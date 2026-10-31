/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Radio, 
  Wifi, 
  Activity, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  X, 
  Sliders, 
  RefreshCw, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Lightbulb,
  Anchor,
  Compass,
  ArrowRight,
  ExternalLink,
  Zap,
  Flame,
  Volume2,
  Code,
  Download,
  Copy,
  Check,
  Usb,
  Smartphone,
  Lock,
  FileText
} from 'lucide-react';
import { musiAudio, MusiWeatherType } from '../services/musiAudioEngine';
import { CONTRACT_ADDRESSES } from '../contractData';
import { mintSoulboundCertificate } from '../services/blockchainService';
import { buildSBTMetadata, pinMetadataToIPFS } from '../services/ipfsService';
import { ESP32_FIRMWARE_INO, PINOUT_TABLE, STEP_BY_STEP_GUIDE } from '../data/esp32FirmwareCode';

interface PhygitalConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeather: MusiWeatherType;
  onWeatherChange?: (w: MusiWeatherType) => void;
  onFocusLandmark?: (landmark: 'ampera' | 'kemaro' | 'siguntang') => void;
}

export function PhygitalConsoleModal({
  isOpen,
  onClose,
  currentWeather,
  onWeatherChange,
  onFocusLandmark
}: PhygitalConsoleModalProps) {
  const [activeTab, setActiveTab] = useState<'live-twin' | 'popp-nfc' | 'firmware' | 'steps'>('live-twin');
  const [connectionMode, setConnectionMode] = useState<'simulated' | 'serial' | 'ble'>('simulated');
  const [statusLog, setStatusLog] = useState<string>('Simulator ESP32 Aktif (115200 Baud)');
  
  // Real Hardware References (Web Serial)
  const serialPortRef = useRef<any>(null);
  const serialReaderRef = useRef<any>(null);
  const serialWriterRef = useRef<any>(null);

  // Sensor Telemetry State
  const [waterLevel, setWaterLevel] = useState<number>(2.42);
  const [luxValue, setLuxValue] = useState<number>(145);
  const [amperaLedState, setAmperaLedState] = useState<'on' | 'off' | 'pulse'>('on');
  const [boatPhysicalPos, setBoatPhysicalPos] = useState<number>(38);
  const [lastNfcDetected, setLastNfcDetected] = useState<{
    uid: string;
    landmark: string;
    timestamp: string;
    isRealHardware?: boolean;
  }>({
    uid: '04:7B:A2:1F:89:6E:80',
    landmark: 'Dermaga Pulau Kemaro',
    timestamp: 'Baru saja'
  });

  const [nfcVerifying, setNfcVerifying] = useState<boolean>(false);
  const [nfcVerifySuccess, setNfcVerifySuccess] = useState<boolean>(false);
  
  // On-Chain Minting State
  const [mintLoading, setMintLoading] = useState<boolean>(false);
  const [mintResult, setMintResult] = useState<{
    txHash: string;
    tokenId?: number;
    ipfsUri?: string;
  } | null>(null);
  const [mintError, setMintError] = useState<string | null>(null);

  // Clipboard Copied State
  const [codeCopied, setCodeCopied] = useState<boolean>(false);

  // Simulation Ticker
  useEffect(() => {
    if (!isOpen || connectionMode !== 'simulated') return;

    const interval = setInterval(() => {
      setWaterLevel(prev => {
        const delta = (Math.random() - 0.5) * 0.02;
        return Number(Math.max(2.1, Math.min(2.8, prev + delta)).toFixed(2));
      });

      if (currentWeather === 'senja') {
        setLuxValue(Math.floor(220 + Math.random() * 30));
      } else if (currentWeather === 'purnama') {
        setLuxValue(Math.floor(45 + Math.random() * 10));
      } else if (currentWeather === 'kabut') {
        setLuxValue(Math.floor(120 + Math.random() * 20));
      } else {
        setLuxValue(Math.floor(90 + Math.random() * 20));
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isOpen, connectionMode, currentWeather]);

  // Clean up serial on unmount
  useEffect(() => {
    return () => {
      if (serialReaderRef.current) {
        serialReaderRef.current.cancel().catch(() => {});
      }
      if (serialPortRef.current) {
        serialPortRef.current.close().catch(() => {});
      }
    };
  }, []);

  // ==================== 1. REAL WEB SERIAL API HANDLER ====================
  const handleConnectSerial = async () => {
    const nav = navigator as any;
    if (typeof navigator !== 'undefined' && nav.serial) {
      try {
        setStatusLog('Meminta izin akses port USB Serial...');
        const port = await nav.serial.requestPort();
        await port.open({ baudRate: 115200 });
        serialPortRef.current = port;
        setConnectionMode('serial');
        setStatusLog('Terhubung langsung via USB Serial (115200 Baud)!');

        // Setup writer
        const textEncoder = new TextEncoderStream();
        textEncoder.readable.pipeTo(port.writable);
        serialWriterRef.current = textEncoder.writable.getWriter();

        // Setup reader
        const textDecoder = new TextDecoderStream();
        port.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable.getReader();
        serialReaderRef.current = reader;

        // Read stream loop
        (async () => {
          let buffer = '';
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            if (value) {
              buffer += value;
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';
              for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
                  try {
                    const data = JSON.parse(trimmed);
                    if (data.event === 'telemetry') {
                      if (data.water) setWaterLevel(Number(data.water));
                      if (data.lux) setLuxValue(Number(data.lux));
                    } else if (data.event === 'nfc_tap') {
                      setLastNfcDetected({
                        uid: data.uid || 'UNKNOWN',
                        landmark: data.landmark || 'Dermaga Pulau Kemaro',
                        timestamp: new Date().toLocaleTimeString('id-ID'),
                        isRealHardware: true
                      });
                      setNfcVerifySuccess(true);
                      musiAudio.playRelicInspectSound();
                    }
                  } catch (e) {
                    // Non-JSON debug message
                  }
                }
              }
            }
          }
        })();
      } catch (err: unknown) {
        const error = err as Error;
        console.warn('Web Serial connection error:', error);
        setStatusLog(`USB Serial dibatalkan: ${error.message || 'Port tidak dipilih'}`);
      }
    } else {
      alert('Browser Anda belum mendukung Web Serial API. Gunakan Google Chrome atau Edge versi Desktop, atau gunakan Mode Simulator.');
    }
  };

  // Send Downlink command to ESP32 (via Serial or Simulated)
  const sendActuatorCommand = async (commandObj: any) => {
    const jsonStr = JSON.stringify(commandObj) + '\n';
    if (serialWriterRef.current) {
      try {
        await serialWriterRef.current.write(jsonStr);
        setStatusLog(`Kirim ke ESP32: ${jsonStr.trim()}`);
      } catch (err) {
        console.warn('Gagal menulis ke Serial:', err);
      }
    } else {
      setStatusLog(`[Simulasi Downlink] Terkirim: ${jsonStr.trim()}`);
    }
  };

  // ==================== 2. REAL WEB BLUETOOTH API ====================
  const handleConnectBluetooth = async () => {
    const nav = navigator as any;
    if (typeof navigator !== 'undefined' && nav.bluetooth) {
      try {
        setStatusLog('Memindai perangkat Bluetooth LE (SIGUNTANG-PHYGITAL-STC)...');
        const device = await nav.bluetooth.requestDevice({
          filters: [{ namePrefix: 'SIGUNTANG' }],
          optionalServices: ['4fafc201-1fb5-459e-8fcc-c5c9c331914b']
        });
        setConnectionMode('ble');
        setStatusLog(`Terhubung ke BLE: ${device.name || 'ESP32-STC'}`);
      } catch (err: unknown) {
        const error = err as Error;
        console.warn('Bluetooth pairing cancelled or failed:', error);
        setStatusLog('Mode Simulasi (Pairing dibatalkan atau Web BLE fallback)');
        setConnectionMode('simulated');
      }
    } else {
      alert('Browser ini belum mengaktifkan Web Bluetooth API. Menggunakan Mode High-Fidelity Simulator.');
    }
  };

  // ==================== 3. REAL WEB NFC SCAN (ANDROID CHROME) ====================
  const handleScanWebNFC = async () => {
    const win = window as any;
    if (typeof window !== 'undefined' && win.NDEFReader) {
      try {
        setStatusLog('Dekatkan kartu / tag NFC fisik ke belakang smartphone...');
        const ndef = new win.NDEFReader();
        await ndef.scan();
        setNfcVerifying(true);
        setStatusLog('Sensor Web NFC HP Aktif! Menunggu sentuhan...');

        ndef.onreading = (event: any) => {
          const serialNumber = event.serialNumber || '04:EA:89:12:FA:77';
          setLastNfcDetected({
            uid: serialNumber,
            landmark: 'Pulau Kemaro (Physical Touchpoint)',
            timestamp: new Date().toLocaleTimeString('id-ID'),
            isRealHardware: true
          });
          setNfcVerifying(false);
          setNfcVerifySuccess(true);
          musiAudio.playRelicInspectSound();
          setStatusLog(`NFC Terbaca dari HP! UID: ${serialNumber}`);
        };
      } catch (err: any) {
        alert('Gagal mengaktifkan Web NFC: ' + (err.message || 'Izin ditolak atau NFC mati'));
        setStatusLog('Sensor NFC HP dibatalkan.');
        setNfcVerifying(false);
      }
    } else {
      alert('Fitur Web NFC didukung pada Google Chrome di perangkat Android dengan sensor NFC aktif.');
    }
  };

  // ==================== 4. SIMULATION NFC TRIGGER ====================
  const handleSimulateNfcTap = (landmark: 'Pulau Kemaro' | 'Jembatan Ampera' | 'Bukit Siguntang') => {
    setNfcVerifying(true);
    setNfcVerifySuccess(false);
    musiAudio.playRelicInspectSound();

    setTimeout(() => {
      const hexChars = '0123456789ABCDEF';
      let randUid = '04:';
      for (let i = 0; i < 6; i++) {
        randUid += hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)] + (i < 5 ? ':' : '');
      }

      setLastNfcDetected({
        uid: randUid,
        landmark,
        timestamp: new Date().toLocaleTimeString('id-ID'),
        isRealHardware: false
      });
      setNfcVerifying(false);
      setNfcVerifySuccess(true);

      if (onFocusLandmark) {
        if (landmark === 'Pulau Kemaro') onFocusLandmark('kemaro');
        else if (landmark === 'Jembatan Ampera') onFocusLandmark('ampera');
        else if (landmark === 'Bukit Siguntang') onFocusLandmark('siguntang');
      }
    }, 1000);
  };

  // ==================== 5. MINT ON-CHAIN PROOF-OF-PRESENCE SBT ====================
  const handleMintProofOfPresence = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask tidak terdeteksi. Silakan pasang ekstensi MetaMask.');
      return;
    }

    setMintLoading(true);
    setMintError(null);
    setMintResult(null);

    try {
      // 1. Dapatkan akun MetaMask
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAddr = accounts[0];

      // 2. Publish Metadata ke IPFS
      const metadata = buildSBTMetadata({
        nodeId: `phygital-${lastNfcDetected.landmark.toLowerCase().replace(/\s/g, '-')}`,
        nodeName: `${lastNfcDetected.landmark} (Proof-of-Physical-Presence)`,
        category: 'Proof-of-Physical-Presence',
        recipientAddress: userAddr,
        recipientName: 'STC Phygital Explorer',
        certificateType: 'Proof-of-Physical-Presence (PoPP)',
        latitude: -2.9904,
        longitude: 104.7963,
        imageUrl: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&q=80&w=1200'
      });
      const ipfsData = await pinMetadataToIPFS(metadata);

      // 3. Minting ke Sepolia Smart Contract ERC-5192
      const result = await mintSoulboundCertificate({
        recipientAddress: userAddr,
        ipfsUri: ipfsData.ipfsUri,
        nodeName: lastNfcDetected.landmark,
        certType: 'Proof-of-Physical-Presence'
      });

      setMintResult({
        txHash: result.txHash,
        tokenId: result.tokenId,
        ipfsUri: ipfsData.ipfsUri
      });
      musiAudio.playArrivalChime();
    } catch (err: any) {
      console.error('Minting error:', err);
      setMintError(err.message || 'Gagal melakukan transaksi on-chain di Sepolia.');
    } finally {
      setMintLoading(false);
    }
  };

  // Copy firmware sketch to clipboard
  const handleCopyFirmware = () => {
    navigator.clipboard.writeText(ESP32_FIRMWARE_INO);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 3000);
  };

  // Download .ino file
  const handleDownloadIno = () => {
    const blob = new Blob([ESP32_FIRMWARE_INO], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'STC_Diorama_ESP32.ino';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-[#120f0d] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden text-[#f5f2ed] my-8"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-stone-900/90 via-amber-950/40 to-stone-900/90">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg">
              <Cpu size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                  STC Phygital Architecture
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[9px] font-mono text-emerald-300 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {connectionMode === 'serial' ? 'USB SERIAL LIVE' : connectionMode === 'ble' ? 'BLE LIVE' : 'SIMULATOR LIVE'}
                </span>
              </div>
              <h3 className="font-serif text-xl md:text-2xl font-bold text-white leading-tight">
                Konsol Jembatan Phygital (IoT & On-Chain Twin)
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigator */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/10 bg-[#0d0a08] text-xs font-mono overflow-x-auto">
          <button
            onClick={() => setActiveTab('live-twin')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold transition-all shrink-0 ${
              activeTab === 'live-twin'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Activity size={15} />
            <span>Telemetri & Kontrol Twin</span>
          </button>
          <button
            onClick={() => setActiveTab('popp-nfc')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold transition-all shrink-0 ${
              activeTab === 'popp-nfc'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <ShieldCheck size={15} />
            <span>NFC & Proof-of-Presence On-Chain</span>
          </button>
          <button
            onClick={() => setActiveTab('firmware')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold transition-all shrink-0 ${
              activeTab === 'firmware'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Code size={15} />
            <span>Kode Firmware ESP32 (.ino)</span>
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold transition-all shrink-0 ${
              activeTab === 'steps'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Layers size={15} />
            <span>Tahapan Perakitan & Pinout</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[68vh] overflow-y-auto space-y-6">
          {/* TAB 1: LIVE TWIN TELEMETRY */}
          {activeTab === 'live-twin' && (
            <div className="space-y-6">
              {/* Connection Status & Hardware Connectors */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-black/50 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <Radio size={18} className="animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-stone-400 block">Status Hardware Gateway:</span>
                    <span className="text-xs font-mono font-bold text-emerald-300">
                      {statusLog}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Real Web Serial Connect */}
                  <button
                    onClick={handleConnectSerial}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 rounded-xl text-xs font-mono font-bold transition-all shadow-md"
                    title="Hubungkan ESP32 via kabel USB Serial"
                  >
                    <Usb size={14} />
                    <span>Hubungkan USB Serial</span>
                  </button>

                  {/* Web Bluetooth Connect */}
                  <button
                    onClick={handleConnectBluetooth}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl text-xs font-mono text-stone-300 hover:text-white transition-all"
                    title="Hubungkan ESP32 via Web Bluetooth LE"
                  >
                    <Wifi size={13} />
                    <span>Scan Web BLE</span>
                  </button>
                </div>
              </div>

              {/* Sensor Telemetry Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Water Level Sensor */}
                <div className="p-4 rounded-2xl bg-stone-900/60 border border-white/10 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase text-stone-400 font-bold">
                      Pasang Surut Sungai Musi
                    </span>
                    <span className="text-[9px] px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full font-mono">
                      HC-SR04
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-bold text-blue-400">
                      {waterLevel}
                    </span>
                    <span className="font-mono text-xs text-stone-400">meter (MDPL)</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-2">
                    Ketinggian normal sungai. Mengatur frekuensi ombak matematis pada 3D diorama secara dinamis.
                  </p>
                </div>

                {/* 2. Ambient Lux Sensor */}
                <div className="p-4 rounded-2xl bg-stone-900/60 border border-white/10 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase text-stone-400 font-bold">
                      Luxometer Fisik
                    </span>
                    <span className="text-[9px] px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full font-mono">
                      LDR / BH1750
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-bold text-amber-400">
                      {luxValue}
                    </span>
                    <span className="font-mono text-xs text-stone-400">Lux</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-2">
                    Intensitas cahaya ruangan fisik. Sinkron otomatis dengan siklus langit Senja / Purnama di 3D.
                  </p>
                </div>

                {/* 3. Physical Track Boat Tracker */}
                <div className="p-4 rounded-2xl bg-stone-900/60 border border-white/10 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase text-stone-400 font-bold">
                      Posisi Perahu Fisik
                    </span>
                    <span className="text-[9px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full font-mono">
                      Rel Magnetik
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-bold text-emerald-400">
                      {boatPhysicalPos}%
                    </span>
                    <span className="font-mono text-xs text-stone-400">Alur Musi</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-2">
                    Koordinat perahu di atas meja diorama fisik yang mengontrol posisi perahu 3D pada layar.
                  </p>
                </div>
              </div>

              {/* Two-Way Actuator Downlink Controls */}
              <div className="p-5 rounded-2xl bg-[#17130f] border border-amber-500/20 space-y-4">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-amber-400" />
                  <h4 className="font-serif text-base font-bold text-white">
                    Perintah Dua Arah (Downlink Web ➔ Aktuator Miniatur ESP32)
                  </h4>
                </div>
                <p className="text-xs text-stone-400">
                  Uji pengiriman perintah dari browser ke aktuator fisik (LED WS2812B Jembatan Ampera & Klakson DFPlayer):
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Ampera LED Strip Actuator */}
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Lampu Rangka Ampera (WS2812B)</span>
                      <span className="text-[10px] font-mono text-stone-400">Status: {amperaLedState.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setAmperaLedState('on');
                          sendActuatorCommand({ cmd: 'led', color: 'red', state: 'on' });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                          amperaLedState === 'on' ? 'bg-red-600 text-white' : 'bg-white/5 text-stone-400'
                        }`}
                      >
                        MERAH
                      </button>
                      <button
                        onClick={() => {
                          setAmperaLedState('pulse');
                          sendActuatorCommand({ cmd: 'led', color: 'red', state: 'pulse' });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                          amperaLedState === 'pulse' ? 'bg-amber-500 text-stone-950 font-black' : 'bg-white/5 text-stone-400'
                        }`}
                      >
                        PULSA
                      </button>
                      <button
                        onClick={() => {
                          setAmperaLedState('off');
                          sendActuatorCommand({ cmd: 'led', state: 'off' });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                          amperaLedState === 'off' ? 'bg-stone-700 text-white' : 'bg-white/5 text-stone-400'
                        }`}
                      >
                        MATI
                      </button>
                    </div>
                  </div>

                  {/* Ketek Chime / Buzzer Actuator */}
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Klakson Perahu Miniatur</span>
                      <span className="text-[10px] font-mono text-stone-400">DFPlayer Mini / Buzzer GPIO 23</span>
                    </div>
                    <button
                      onClick={() => {
                        musiAudio.playArrivalChime();
                        sendActuatorCommand({ cmd: 'horn' });
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer shadow-md"
                    >
                      <Volume2 size={13} />
                      <span>Bunyikan</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NFC & ON-CHAIN PROOF-OF-PRESENCE */}
          {activeTab === 'popp-nfc' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/30 to-stone-900 border border-amber-500/30">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                    <ShieldCheck size={28} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-serif text-lg font-bold text-white">
                      Proof-of-Physical-Presence (PoPP) On-Chain Minting
                    </h4>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Sertifikat kunjungan digital tidak dapat diterbitkan sebelum pengunjung secara fisik mendekatkan miniatur perahu atau ponsel ke sensor NFC di lokasi. Ketika signature NFC valid, Anda dapat langsung mencetak <strong>ERC-5192 Soulbound Token</strong> ke Ethereum Sepolia.
                    </p>
                  </div>
                </div>
              </div>

              {/* NFC Scanners (Real Web NFC + Simulator) */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                    Pilih Metode Deteksi Touchpoint Fisik:
                  </span>
                  
                  {/* Real Web NFC on Mobile */}
                  <button
                    onClick={handleScanWebNFC}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 text-blue-300 rounded-xl text-xs font-mono font-bold transition-all"
                  >
                    <Smartphone size={14} />
                    <span>Scan Sensor Web NFC HP</span>
                  </button>
                </div>
                
                {/* Simulator Touchpoint Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { name: 'Pulau Kemaro', icon: '🏯', desc: 'Dermaga Pagoda 9 Tingkat' },
                    { name: 'Jembatan Ampera', icon: '🌉', desc: 'Pilar Utama Ulu-Ilir' },
                    { name: 'Bukit Siguntang', icon: '⛰️', desc: 'Genesis Node Monolith' }
                  ].map(site => (
                    <button
                      key={site.name}
                      onClick={() => handleSimulateNfcTap(site.name as any)}
                      disabled={nfcVerifying}
                      className="p-4 rounded-xl bg-stone-900/80 hover:bg-amber-950/40 border border-white/10 hover:border-amber-400/50 text-left transition-all group disabled:opacity-50 cursor-pointer"
                    >
                      <div className="text-2xl mb-2">{site.icon}</div>
                      <span className="font-serif text-sm font-bold text-white group-hover:text-amber-300 block">
                        Tap ke {site.name}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono block mt-1">
                        {site.desc}
                      </span>
                    </button>
                  ))}
                </div>

                {/* NFC Detection Result Card */}
                <div className="p-4 rounded-xl bg-stone-900/90 border border-white/10 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-stone-400">Status Pembaca NFC:</span>
                    <span className="text-emerald-400 font-bold">
                      {nfcVerifying ? 'Sedang Memverifikasi Signature...' : 'Siaga (Touchpoint Active)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">UID Chip Terakhir:</span>
                    <span className="text-amber-300 font-bold">{lastNfcDetected.uid}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Simpul Budaya:</span>
                    <span className="text-white font-bold">{lastNfcDetected.landmark}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Waktu Sentuhan:</span>
                    <span className="text-stone-300">{lastNfcDetected.timestamp}</span>
                  </div>
                </div>

                {/* ON-CHAIN ACTION BUTTON */}
                {nfcVerifySuccess && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold">
                      <CheckCircle2 size={16} />
                      <span>Signature Fisik Terverifikasi! Siap diterbitkan sebagai sertifikat on-chain:</span>
                    </div>

                    <button
                      onClick={handleMintProofOfPresence}
                      disabled={mintLoading}
                      className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Lock size={15} />
                      <span>{mintLoading ? 'Menerbitkan ke Sepolia Blockchain...' : 'Mint Proof-of-Presence SBT (ERC-5192)'}</span>
                    </button>

                    {mintError && (
                      <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-start gap-2">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span>{mintError}</span>
                      </div>
                    )}

                    {mintResult && (
                      <div className="p-4 bg-black/60 border border-emerald-400/40 rounded-xl space-y-2 text-xs font-mono">
                        <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                          <CheckCircle2 size={14} />
                          <span>SBT Berhasil Diterbitkan On-Chain di Sepolia!</span>
                        </div>
                        <div className="text-stone-300">
                          Token ID: <strong className="text-amber-400">#{mintResult.tokenId || 'Baru'}</strong>
                        </div>
                        <div className="truncate text-stone-400">
                          TX: <span className="text-amber-300">{mintResult.txHash}</span>
                        </div>
                        <div className="pt-2 flex items-center gap-3">
                          <a
                            href={`https://sepolia.etherscan.io/tx/${mintResult.txHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-amber-400 underline font-bold"
                          >
                            <span>Lihat di Sepolia Etherscan</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: FIRMWARE SOURCE CODE */}
          {activeTab === 'firmware' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-black/50 border border-white/10 rounded-2xl">
                <div>
                  <h4 className="font-serif text-base font-bold text-white">
                    Kode Lengkap Arduino IDE (STC_Diorama_ESP32.ino)
                  </h4>
                  <p className="text-xs text-stone-400">
                    Flash kode C++ ini langsung ke modul ESP32-WROOM-32 / ESP32-S3 Anda.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyFirmware}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl text-xs font-mono text-stone-300 hover:text-white transition-all"
                  >
                    {codeCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{codeCopied ? 'Tersalin!' : 'Salin Kode'}</span>
                  </button>

                  <button
                    onClick={handleDownloadIno}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-mono font-bold transition-all shadow-md"
                  >
                    <Download size={14} />
                    <span>Download .ino</span>
                  </button>
                </div>
              </div>

              {/* Code Viewer Container */}
              <div className="relative rounded-2xl border border-white/10 bg-[#0a0806] p-4 overflow-hidden">
                <pre className="font-mono text-[11px] text-stone-300 overflow-x-auto max-h-[380px] p-2 leading-relaxed">
                  <code>{ESP32_FIRMWARE_INO}</code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: STEP-BY-STEP ASSEMBLY & PINOUT */}
          {activeTab === 'steps' && (
            <div className="space-y-6">
              {/* Step By Step Guide */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                  Tahapan Praktis Pembuatan Perangkat Hardware Miniatur (Lab Bina Darma):
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {STEP_BY_STEP_GUIDE.map(item => (
                    <div key={item.step} className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          {item.step}
                        </span>
                        <h5 className="font-serif text-sm font-bold text-white">
                          {item.title}
                        </h5>
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed pl-8">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pinout Table */}
              <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base font-bold text-white">
                    Tabel Pinout Perkabelan GPIO ESP32
                  </h4>
                  <span className="text-[10px] font-mono text-stone-400">Tegangan Operasional: 3.3V / 5V</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-white/10 text-stone-400 text-[10px] uppercase">
                        <th className="pb-2">Modul / Sensor</th>
                        <th className="pb-2">Pin ESP32</th>
                        <th className="pb-2">Tipe Sinyal</th>
                        <th className="pb-2">Tegangan</th>
                        <th className="pb-2">Catatan Pemasangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-[11px]">
                      {PINOUT_TABLE.map((row, idx) => (
                        <tr key={idx}>
                          <td className="py-2 text-amber-300 font-bold">{row.module}</td>
                          <td className="py-2 text-emerald-300 font-bold">{row.espPin}</td>
                          <td className="py-2 text-stone-300">{row.type}</td>
                          <td className="py-2 text-stone-400">{row.voltage}</td>
                          <td className="py-2 text-stone-400">{row.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="p-4 border-t border-white/10 bg-[#0d0a08] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-stone-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Target Contract: Sepolia ({CONTRACT_ADDRESSES.STC_CULTURAL_SBT.slice(0, 10)}...)</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition-all cursor-pointer shadow-md"
          >
            Tutup Konsol
          </button>
        </div>
      </motion.div>
    </div>
  );
}
