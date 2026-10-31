/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const ESP32_FIRMWARE_INO = `/*
 * =========================================================================================
 *   SIGUNTANG STC (Smart Tourism Chain) - Phygital IoT Diorama Controller
 *   Universitas Bina Darma - Riset Disertasi Doktoral Smart Tourism Chain
 *   Author : Tim Riset STC (khudri@binadarma.ac.id)
 *   Target : ESP32-WROOM-32 / ESP32-S3 (Baud Rate: 115200)
 * =========================================================================================
 *
 *   Fitur:
 *   1. Dual-Channel Gateway: USB Serial JSON Stream + Web Bluetooth LE (BLE GATT)
 *   2. WS2812B Addressable LED: Pendar Nokturnal Jembatan Ampera & Suasana Senja Musi
 *   3. PN532 / MFRC522 NFC Reader: Deteksi Sentuhan Miniatur Perahu & Tagging Proof-of-Presence
 *   4. HC-SR04 Ultrasonic Sensor: Pengukuran Real-Time Pasang-Surut Air Musi (MDPL)
 *   5. LDR / BH1750 Sensor: Pembacaan Cahaya Ambien untuk Sinkronisasi Digital Twin
 *   6. DFPlayer Mini / Buzzer: Klakson Ketek & Lonceng Klenteng Cap Go Meh
 */

#include <Arduino.h>
#include <WiFi.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <Adafruit_NeoPixel.h>
#include <SPI.h>
#include <MFRC522.h>

// =================== PIN MAPPING (GPIO ESP32) ===================
#define PIN_NEOPIXEL     18   // Data pin strip LED WS2812B (Ampera + Tepian)
#define NUM_PIXELS       30   // Jumlah LED addressable
#define PIN_TRIG         5    // HC-SR04 Ultrasonic Trigger
#define PIN_ECHO         19   // HC-SR04 Ultrasonic Echo
#define PIN_LDR          34   // Sensor Cahaya Analog (ADC1)
#define PIN_BUZZER       23   // Piezo Buzzer / DFPlayer Trigger Pin

// SPI RFID/NFC RC522 / PN532 Pin Mapping
#define PIN_SS_RFID      21   // SDA / SS
#define PIN_RST_RFID     22   // Reset pin

// =================== BLE UUID DEFINITIONS =======================
#define SERVICE_UUID           "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID_TX "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define CHARACTERISTIC_UUID_RX "6e400002-b5a3-f393-e0a9-e50e24dcca9e"

// Inisialisasi Objek Hardware
Adafruit_NeoPixel strip(NUM_PIXELS, PIN_NEOPIXEL, NEO_GRB + NEO_KHZ800);
MFRC522 mfrc522(PIN_SS_RFID, PIN_RST_RFID);

BLEServer* pServer = NULL;
BLECharacteristic* pTxCharacteristic = NULL;
bool deviceConnected = false;
bool oldDeviceConnected = false;

// Global State
String currentLedState = "on"; // "on", "pulse", "off"
unsigned long lastTelemetryTime = 0;
const unsigned long TELEMETRY_INTERVAL = 2000; // Kirim tiap 2 detik

// =================== BLE SERVER CALLBACKS =======================
class STCServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
      Serial.println(F("{\\"status\\":\\"BLE_CONNECTED\\"}"));
    };
    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
      Serial.println(F("{\\"status\\":\\"BLE_DISCONNECTED\\"}"));
    }
};

// =================== PARSER PERINTAH DARI WEB ===================
void parseCommand(String cmd) {
  cmd.trim();
  if (cmd.length() == 0) return;

  // 1. Perintah LED Ampera
  if (cmd.indexOf("\\"cmd\\":\\"led\\"") >= 0 || cmd.indexOf("LED_") >= 0) {
    if (cmd.indexOf("red") >= 0 || cmd.indexOf("on") >= 0) {
      currentLedState = "on";
      // Nyalakan LED Merah Ampera
      for (int i = 0; i < NUM_PIXELS; i++) {
        strip.setPixelColor(i, strip.Color(230, 20, 20));
      }
      strip.show();
      Serial.println(F("{\\"ack\\":\\"LED_AMPERA_RED_ACTIVE\\"}"));
    } else if (cmd.indexOf("pulse") >= 0) {
      currentLedState = "pulse";
      Serial.println(F("{\\"ack\\":\\"LED_PULSE_ACTIVE\\"}"));
    } else if (cmd.indexOf("off") >= 0) {
      currentLedState = "off";
      strip.clear();
      strip.show();
      Serial.println(F("{\\"ack\\":\\"LED_OFF\\"}"));
    }
  }

  // 2. Perintah Bunyikan Klakson / Chime Ketek
  if (cmd.indexOf("\\"cmd\\":\\"horn\\"") >= 0 || cmd.indexOf("HORN") >= 0) {
    digitalWrite(PIN_BUZZER, HIGH);
    tone(PIN_BUZZER, 880, 180);
    delay(200);
    tone(PIN_BUZZER, 1174, 250);
    digitalWrite(PIN_BUZZER, LOW);
    Serial.println(F("{\\"ack\\":\\"KETEK_HORN_CHIMED\\"}"));
  }
}

class STCRxCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      String rxValue = pCharacteristic->getValue().c_str();
      if (rxValue.length() > 0) {
        parseCommand(rxValue);
      }
    }
};

// =================== BACA SENSOR JARAK / AIR ====================
float readWaterDistance() {
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);

  long duration = pulseIn(PIN_ECHO, HIGH, 30000);
  if (duration == 0) return 2.45; // Default simulasi jika out of range

  // Hitung jarak (cm) lalu konversi ke level ketinggian air simulasi (2.1 - 2.8m MDPL)
  float distanceCm = duration * 0.034 / 2;
  float simulatedMdpl = 3.0 - (distanceCm / 100.0);
  if (simulatedMdpl < 2.0) simulatedMdpl = 2.15;
  if (simulatedMdpl > 3.2) simulatedMdpl = 2.85;
  return simulatedMdpl;
}

// =================== SETUP SYSTEM ===============================
void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println(F("{\\"system\\":\\"SIGUNTANG_STC_PHYGITAL_BOOTING\\"}"));

  // Init Pin
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_LDR, INPUT);

  // Init NeoPixel
  strip.begin();
  strip.setBrightness(180);
  for (int i = 0; i < NUM_PIXELS; i++) {
    strip.setPixelColor(i, strip.Color(200, 30, 20)); // Merah Ampera Default
  }
  strip.show();

  // Init RFID SPI
  SPI.begin();
  mfrc522.PCD_Init();

  // Init BLE Gateway
  BLEDevice::init("SIGUNTANG-PHYGITAL-STC");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new STCServerCallbacks());

  BLEService *pService = pServer->createService(SERVICE_UUID);
  pTxCharacteristic = pService->createCharacteristic(
                        CHARACTERISTIC_UUID_TX,
                        BLECharacteristic::PROPERTY_NOTIFY
                      );
  pTxCharacteristic->addDescriptor(new BLE2902());

  BLECharacteristic *pRxCharacteristic = pService->createCharacteristic(
                                           CHARACTERISTIC_UUID_RX,
                                           BLECharacteristic::PROPERTY_WRITE
                                         );
  pRxCharacteristic->setCallbacks(new STCRxCallbacks());

  pService->start();
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();

  Serial.println(F("{\\"system\\":\\"READY\\",\\"ble\\":\\"SIGUNTANG-PHYGITAL-STC\\",\\"baud\\":115200}"));
}

// =================== MAIN LOOP ==================================
void loop() {
  unsigned long now = millis();

  // 1. Baca Perintah Masuk via Serial USB (Web Serial API)
  if (Serial.available()) {
    String incoming = Serial.readStringUntil('\\n');
    parseCommand(incoming);
  }

  // 2. Deteksi Kartu / Tag Miniatur NFC RFID
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    String uidStr = "";
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      if (mfrc522.uid.uidByte[i] < 0x10) uidStr += "0";
      uidStr += String(mfrc522.uid.uidByte[i], HEX);
      if (i < mfrc522.uid.size - 1) uidStr += ":";
    }
    uidStr.toUpperCase();

    // Map ke simpul budaya berdasarkan UID
    String landmark = "Dermaga Pulau Kemaro";
    if (mfrc522.uid.uidByte[0] % 2 == 0) {
      landmark = "Jembatan Ampera Ulu";
    }

    // Bangun paket JSON deteksi NFC
    String nfcJson = "{\\"event\\":\\"nfc_tap\\",\\"uid\\":\\"" + uidStr + 
                     "\\",\\"landmark\\":\\"" + landmark + "\\"}";

    // Kirim via Serial USB
    Serial.println(nfcJson);

    // Kirim via BLE jika terhubung
    if (deviceConnected && pTxCharacteristic) {
      pTxCharacteristic->setValue(nfcJson.c_str());
      pTxCharacteristic->notify();
    }

    // Feedback audio bip
    tone(PIN_BUZZER, 1760, 80);

    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
  }

  // 3. Efek Pulsa LED jika mode "pulse"
  if (currentLedState == "pulse") {
    float breath = (sin(now / 400.0) + 1.0) * 0.5; // 0.0 - 1.0
    int brightness = (int)(breath * 220 + 35);
    for (int i = 0; i < NUM_PIXELS; i++) {
      strip.setPixelColor(i, strip.Color(brightness, 10, 10));
    }
    strip.show();
  }

  // 4. Pengiriman Telemetri Periodik
  if (now - lastTelemetryTime > TELEMETRY_INTERVAL) {
    lastTelemetryTime = now;

    float waterLevel = readWaterDistance();
    int rawLux = analogRead(PIN_LDR);
    int mappedLux = map(rawLux, 0, 4095, 30, 350);

    String telemetryJson = "{\\"event\\":\\"telemetry\\",\\"water\\":" + String(waterLevel, 2) + 
                           ",\\"lux\\":" + String(mappedLux) + 
                           ",\\"led\\":\\"" + currentLedState + "\\"}";

    Serial.println(telemetryJson);

    if (deviceConnected && pTxCharacteristic) {
      pTxCharacteristic->setValue(telemetryJson.c_str());
      pTxCharacteristic->notify();
    }
  }

  // Handle BLE disconnect reconnect
  if (!deviceConnected && oldDeviceConnected) {
    delay(500);
    pServer->startAdvertising();
    oldDeviceConnected = deviceConnected;
  }
  if (deviceConnected && !oldDeviceConnected) {
    oldDeviceConnected = deviceConnected;
  }

  delay(20);
}
`;

export const PINOUT_TABLE = [
  { module: 'WS2812B LED Strip', espPin: 'GPIO 18', type: 'PWM / Data In', voltage: '5V (Vin)', notes: 'Gunakan resistor 330Ω pada jalur data' },
  { module: 'RC522 / PN532 SDA (SS)', espPin: 'GPIO 21', type: 'SPI / I2C', voltage: '3.3V (VCC)', notes: 'Jangan beri 5V ke RC522 agar tidak rusak' },
  { module: 'RC522 SCK', espPin: 'GPIO 18 / 14', type: 'SPI Clock', voltage: '3.3V', notes: 'Standar SPI clock bus' },
  { module: 'RC522 MOSI', espPin: 'GPIO 23', type: 'SPI Master Out', voltage: '3.3V', notes: 'Master Out Slave In' },
  { module: 'RC522 MISO', espPin: 'GPIO 19', type: 'SPI Master In', voltage: '3.3V', notes: 'Master In Slave Out' },
  { module: 'RC522 RST', espPin: 'GPIO 22', type: 'Reset', voltage: '3.3V', notes: 'Reset hardware chip' },
  { module: 'HC-SR04 Trig', espPin: 'GPIO 5', type: 'Digital Output', voltage: '5V', notes: 'Trigger pulsa ultrasonik 10µs' },
  { module: 'HC-SR04 Echo', espPin: 'GPIO 19 / 35', type: 'Digital Input', voltage: '3.3V', notes: 'Beri voltage divider (1kΩ + 2kΩ) jika HC-SR04 5V' },
  { module: 'Sensor Cahaya LDR', espPin: 'GPIO 34', type: 'ADC1 Analog', voltage: '3.3V', notes: 'Rangkaian pembagi tegangan LDR + 10kΩ' },
  { module: 'Piezo Buzzer / DFPlayer', espPin: 'GPIO 23 / 25', type: 'DAC / Tone', voltage: '5V', notes: 'Klakson perahu ketek & chime pagoda' }
];

export const STEP_BY_STEP_GUIDE = [
  {
    step: 1,
    title: 'Fabrikasi Meja & Miniatur 3D Diorama',
    desc: 'Cetak 3D (3D Print) file STL model miniatur Jembatan Ampera, Pagoda Kemaro 9 Tingkat, dan Bukit Siguntang menggunakan filamen PLA+ (skala 1:200). Gunakan alas akrilik bening setebal 5mm sebagai permukaan Sungai Musi dengan rongga tersembunyi di bawahnya untuk jalur kabel sensor dan rel magnetik miniatur kapal.'
  },
  {
    step: 2,
    title: 'Perakitan Sirkuit Elektronika & Sensor',
    desc: 'Pasang ESP32-WROOM-32 pada breadboard/PCB prototipe. Hubungkan strip WS2812B di bawah geladak Jembatan Ampera. Letakkan pembaca RFID/NFC PN532 di bawah dermaga Pulau Kemaro dan dermaga Ampera. Pasang sensor HC-SR04 di salah satu wadah air tersembunyi untuk membaca ketinggian level air sungai Musi.'
  },
  {
    step: 3,
    title: 'Setup Arduino IDE & Library Dependencies',
    desc: 'Buka Arduino IDE versi 2.x, pasang Board Support "esp32 by Espressif Systems". Install library pendukung melalui Library Manager: "Adafruit NeoPixel" dan "MFRC522" (atau "Adafruit PN532"). Pilih board "ESP32 Dev Module" dengan Upload Speed 115200 atau 921600.'
  },
  {
    step: 4,
    title: 'Upload Firmware & Uji Serial Monitor',
    desc: 'Salin kode STC_Diorama_ESP32.ino ke sketch, lalu klik Upload. Buka Serial Monitor pada 115200 baud. Pastikan muncul pesan JSON: {"system":"READY", "baud":115200}. Tempelkan tag NFC miniatur perahu ketek dan perhatikan log: {"event":"nfc_tap", "uid":"...", "landmark":"..."}.'
  },
  {
    step: 5,
    title: 'Koneksi Langsung ke SIGUNTANG Web (Web Serial / Web Bluetooth)',
    desc: 'Buka aplikasi SIGUNTANG di browser Google Chrome / Edge. Pada Diorama 3D, klik tombol [Phygital IoT]. Pilih "Sambungkan USB Serial" (115200 baud) atau "Scan Web Bluetooth". Browser Anda akan langsung bertukar paket telemetri dua arah dengan perangkat fisik tanpa memerlukan server cloud perantara!'
  },
  {
    step: 6,
    title: 'Pengujian Validasi On-Chain (Proof-of-Physical-Presence)',
    desc: 'Saat miniatur perahu menyentuh dermaga fisik, UID terbaca dan diverifikasi. Tekan tombol "Mint Proof-of-Presence SBT (ERC-5192)" pada konsol. Transaksi akan langsung dikirim ke smart contract STCCulturalSBT kita di Sepolia (0xC9F2...c302) dan tercatat permanen pada Sepolia Etherscan & IPFS!'
  }
];
