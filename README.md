# SIGUNTANG — Gerbang Digital Cagar Budaya Nusantara

> **Sistem Integrasi Gerbang Universal Node, Traceability & Artificial Intelligence Nusantara Gemilang**  
> *A Next-Generation Cultural Heritage Preservation & Smart Tourism Infrastructure for Bumi Sriwijaya*

SIGUNTANG adalah platform pariwisata cerdas dan pelestarian cagar budaya berbasis **Dual-Engine Architecture**: menggabungkan kedalaman **Experience Layer** (Diorama Sinematik 3D Sungai Musi, Peta Geospasial Interaktif, & AI Guide) dengan ketangguhan **Trust Layer** (Siguntang Trust Chain / STC berbasis Web3 & Smart Contracts) untuk mengabadikan dan melindungi warisan peradaban Sriwijaya serta ekonomi kreatif Kota Palembang.

---

## 🌐 Live Demo & Akses Resmi

**Produksi Vercel:** [siguntang.vercel.app](https://siguntang.vercel.app)

---

## 🏛️ Mengapa SIGUNTANG Membutuhkan Web3? (Bukan Tempelan)

Banyak platform digital hanya menyimpan data sejarah di database relasional (SQL/Cloud) biasa. Namun untuk cagar budaya berskala peradaban, database biasa memiliki kelemahan fatal: **Centralized Revisionism** (siapa pun pemegang akses database admin dapat merevisi catatan sejarah atau memalsukan sertifikat). 

SIGUNTANG menerapkan arsitektur dua lapis:

```
┌─────────────────────────────────────────────────────────────┐
│               EXPERIENCE LAYER (Web2 Engine)                │
│   Diorama Sinematik 3D • Musi Cruise • AI Guide • Peta Spasial│
└──────────────────────────────┬──────────────────────────────┘
                               │ Bukti Hash & Otentisitas
┌──────────────────────────────▼──────────────────────────────┐
│                  TRUST LAYER (STC / Web3)                   │
│   Immutable History • Soulbound Kriya Certificate • Donasi  │
└─────────────────────────────────────────────────────────────┘
```

### 4 Pilar Mutlak Siguntang Trust Chain (STC):
1. **🛡️ Anti-Revisionisme Sejarah & Proof of Provenance**  
   Setiap narasi artefak (Genesis Node Bukit Siguntang, Prasasti Kedukan Bukit, manuskrip) tercatat on-chain secara *immutable*. Sejarah tidak bisa direkayasa oleh pergantian rezim, pengurus, atau peretasan server.
2. **🧵 Perlindungan Kriya Adat (Anti-Pemalsuan Songket Palembang)**  
   Songket asli tenun tangan bernilai tinggi sering dipalsukan oleh tekstil pabrikan murah. STC menerbitkan *Cultural Certificate (Soulbound Token / NFT)* yang membuktikan identitas penenun asli, waktu pembuatan, dan batch benang emas yang tak bisa diduplikasi.
3. **💰 Transparansi Dana Abadi Cagar Budaya (*Zero-Leakage Escrow*)**  
   Setiap mikro-donasi atau kontribusi pelestarian situs mengalir langsung ke dompet digital simpul cagar budaya secara *peer-to-peer* dan bisa diaudit real-time oleh publik melalui block explorer.
4. **🏛️ Kedaulatan Multipihak (*Decentralized Custodianship*)**  
   Data cagar budaya dipegang bersama oleh konsorsium validator (akademisi kampus, komunitas sejarawan, Balai Pelestarian Kebudayaan, dan Pemda), bukan dimonopoli oleh satu startup/korporasi swasta.

---

## 🎨 Fitur Unggulan Platform

### 1. 🚤 Musi Cruise Navigator (Diorama 3D WebGL Spatial & Sinematik 2.5D)
* **True 3D Spatial WebGL Engine (Three.js)**:
  * **Simulasi Gelombang Air Dinamis**: Fisika permukaan air Sungai Musi dengan pergeseran vertex sinusoidal riil dan material reflektif sedimen keemasan.
  * **Model 3D Prosedural Landmark**: Jembatan Ampera (twin tower berketinggian 14m, kabel suspensi baja melengkung, & pendar lampu merah nokturnal), Pagoda 9 Tingkat Pulau Kemaro (atap oktagonal bertingkat & pohon cinta), dan Genesis Monolith Bukit Siguntang (batu berpendar aksara Pallawa Sriwijaya).
  * **Hero Perahu Ketek 3D**: Berlayar menyusuri kelokan kurva sungai Musi dengan simulasi fisik pitch, roll, dan oleng pelan mengikuti arus air.
  * **Interaktivitas 360° & Raycasting**: OrbitControls bebas untuk rotasi dan zoom kamera, preset kamera fokus landmark, serta inspeksi objek 3D langsung untuk membaca peran node pada STC Trust Layer.
  * **Siklus Atmosfer Waktu**: Pergantian pencahayaan dinamis (Senja Keemasan, Purnama Ampera, Kabut Pagi, & Hujan Musi) dengan kabut volumetrik dan efek kabut `FogExp2`.
* **Mode Sinematik 2.5D Folklore**:
  * Eksplorasi 5 rute cerita tutur lisan dengan senter teplok pembuka misteri tersembunyi, radar kedalaman arus, sensor gerak gyroscope smartphone, dan pengumpulan 5 pusaka paspor digital STC.

### 2. 🤖 Panduan Budaya Cerdas (AI Cultural Guide)
* Didukung model bahasa mutakhir **Gemini 2.5 Flash** via `@google/genai`.
* Berperan sebagai kurator sejarah Sriwijaya interaktif yang dapat diajak berdiskusi tentang asal-usul prasasti, makna motif kain songket, kuliner khas, hingga filosofi arsitektur.
* Tampilan responsif dinamis di desktop maupun perangkat mobile dengan penanganan bubble chat ergonomis.

### 3. 🗺️ Peta Budaya Geospasial (Interactive Heritage Map)
* Pemetaan presisi seluruh simpul budaya (*Universal Nodes*) di Palembang lengkap dengan koordinat, riwayat restorasi, dan penanda verifikasi on-chain.

### 4. 🔗 STC Explorer & Traceability Ledger
* Pemantau langsung transaksi kelacakgalian budaya (*Live Traceability Ledger*).
* Menampilkan metrik *Network Integrity*, blok blockchain, dan riwayat sertifikasi kriya.

---

## 📜 Arsitektur Smart Contract & Web3 Pipeline (Ethereum Sepolia Testnet)

Sistem kelacakgalian dan kedaulatan data SIGUNTANG ditunjang oleh smart contracts yang dapat diverifikasi secara publik di **Sepolia Etherscan** dan **IPFS Gateway**:

1. **`STCCulturalSBT` Contract (ERC-5192 Minimal Soulbound Tokens)**  
   * **Deployed Address (Sepolia):** [`0xC9F2bb2e96CE36E61935c0c8C1374EdEDfdcc302`](https://sepolia.etherscan.io/address/0xC9F2bb2e96CE36E61935c0c8C1374EdEDfdcc302)
   * **Source Code:** `contracts/STCCulturalSBT.sol`
   * **Standar:** EIP-5192 (`locked(uint256) returns (bool)`, `event Locked(uint256)`)
   * **Fungsi:** `mintCulturalCertificate(address to, string memory ipfsUri, string memory nodeName, string memory certType)`
   * **Sifat Token:** *Non-transferable* (terkunci permanen pada wallet penerima, tidak dapat diperjualbelikan seperti NFT komersial).
   * **Tujuan:** Sertifikasi silsilah tenun Songket Palembang asli, tanda kunjungan resmi (*Proof-of-Visit*), dan mandat kurasi cagar budaya.

2. **Decentralized IPFS Storage Pipeline (`src/services/ipfsService.ts`)**  
   * **Standar Metadata:** JSON-LD / ERC-721 Metadata Schema diperluas dengan geospasial GIS (lat/lng), kurator tanda tangan digital, dan spesifikasi STC Trust Layer.
   * **CID Format:** Canonical CIDv1 (`bafkrei...`) yang dapat diinspeksi melalui gateway terdistribusi seperti `https://ipfs.io/ipfs/...` atau Pinata Cloud.

3. **`HeritageNodeRegistry` & Treasury Escrow**  
   * **Heritage Treasury:** [`0x17A1e4875c125ad6e89388d9F042A361499495Da`](https://sepolia.etherscan.io/address/0x17A1e4875c125ad6e89388d9F042A361499495Da)
   * **STC Zero-Leakage Escrow:** Donasi mikro (Sepolia ETH) ditransfer langsung secara *peer-to-treasury* tanpa perantara bank atau potongan platform swasta.
   * **Proof-of-Visit Booking:** Reservasi kunjungan menerbitkan tiket digital langsung dalam format Soulbound Token (ERC-5192) untuk memusnahkan calo tiket dan menjamin verifikasi presisi pada analisis statistik STC.
   * **Live On-Chain Event Poller:** Modul `TraceabilityHub` membaca riwayat event `CulturalCertificateIssued` secara langsung dari smart contract Sepolia, sehingga setiap token baru otomatis muncul di ledger publik.

### ⚡ Cara Cepat Deploy Kontrak ke Sepolia via Remix IDE:
1. Buka [remix.ethereum.org](https://remix.ethereum.org).
2. Buat file baru `STCCulturalSBT.sol` dan salin kode dari direktori `contracts/STCCulturalSBT.sol`.
3. Compile menggunakan Solidity versi `0.8.20`.
4. Di tab **Deploy & Run Transactions**, ubah Environment ke **Injected Provider - MetaMask** (pastikan akun MetaMask berada di jaringan **Sepolia Testnet**).
5. Klik tombol **Deploy** dan konfirmasi transaksi.
6. Masukkan alamat kontrak yang terbit ke `CONTRACT_ADDRESSES.STC_CULTURAL_SBT` di `src/contractData.ts`.

---

## 📸 Simpul Budaya Utama (Universal Nodes)

* **Bukit Siguntang (Genesis Node)** — Titik pangkal peradaban dan spiritual Kerajaan Sriwijaya abad ke-7.
* **Museum Sultan Mahmud Badaruddin II** — Pusat dokumentasi Kesultanan Palembang Darussalam.
* **Masjid Agung Sultan Mahmud Badaruddin I** — Harmoni akulturasi arsitektur Nusantara, Tiongkok, dan Eropa.
* **Kampung Tenun Songket Tuan Kentang** — Pusat kriya adiluhung Songket Palembang terverifikasi.
* **Pulau Kemaro & Klenteng Hok Tjing Rio** — Simpul persaudaraan dan akulturasi budaya Tionghoa-Melayu.
* **Kampung Arab Al-Munawar** — Kawasan cagar budaya pemukiman bersejarah tepi Sungai Musi.

---

## 🚀 Teknologi & Tech Stack

| Layer | Teknologi |
| :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript + Vite |
| **Artificial Intelligence** | Google Gemini API (`@google/genai` — Gemini 2.5 Flash) |
| **Styling & Design** | Tailwind CSS + Lucide Icons |
| **3D WebGL & Grafis Spasial** | Three.js (`three` + `OrbitControls`) |
| **Animasi & Interaksi** | Framer Motion (`motion/react`) |
| **Web3 & Blockchain** | Ethers.js v6 + SIWE (Sign-In with Ethereum) + MetaMask |
| **Peta Spasial** | Leaflet + React Leaflet |
| **Deployment** | Vercel Serverless Platform |

---

## 🛠️ Instalasi & Pengembangan Lokal

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/username/siguntang.git
cd siguntang
npm install
```

### 2. Konfigurasi Environment Variables
Buat file `.env` di direktori utama:
```env
# Gemini API Key untuk AI Cultural Guide
VITE_GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Menjalankan Server Lokal
```bash
npm run dev
```
Akses aplikasi melalui browser di `http://localhost:3000`.

### 4. Build untuk Produksi
```bash
npm run build
```

---

## 📄 Lisensi & Hak Cipta

Dikelola di bawah lisensi Apache-2.0. Seluruh dokumentasi narasi sejarah dikurasi untuk kepentingan pelestarian cagar budaya Nusantara dan kemajuan pariwisata berkelanjutan.

**SIGUNTANG — Menjaga Kejayaan Sriwijaya, Menguntai Teknologi Nusantara Gemilang.**
