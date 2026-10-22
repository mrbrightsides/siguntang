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

### 1. 🚤 Musi Cruise Navigator (Diorama Sinematik & Imersif)
* Simulasi pelayaran menyusuri Sungai Musi dengan sudut pandang realistis-atmosferik.
* Menampilkan titik-titik legendaris di sepanjang sungai:
  * **Jembatan Ampera** — Landmark ikonik dengan tata cahaya atmosferik.
  * **Pulau Kemaro** — Diorama pagoda legendaris lengkap dengan kisah cinta abadi Tan Bun An & Siti Fatimah.
  * **Kampung Arab Al-Munawar** — Cagar budaya arsitektur rumah batu berusia ratusan tahun.
  * **Benteng Kuto Besak (BKB)** — Simbol ketangguhan Kesultanan Palembang Darussalam.
  * **Legenda Putri Kemarau** — Kisah pengorbanan luhur demi keselamatan rakyat Sriwijaya.
* Dilengkapi *audio ambiance* gemercik air sungai dan mode pencahayaan dinamis.

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

## 📜 Arsitektur Smart Contract (EVM Compatible)

Sistem kelacakgalian SIGUNTANG ditunjang oleh 3 kontrak pintar utama:

1. **`HeritageNodeRegistry` Contract**  
   * **Fungsi:** `registerNode(name, category, location, metadataHash)`  
   * **Tujuan:** Menyimpan titik koordinat, silsilah sejarah, dan hash metadata IPFS secara permanen.
2. **`TraceabilityTransaction` Contract**  
   * **Fungsi:** `recordTransaction(type, nodeName, amount, metadataHash)`  
   * **Tujuan:** Mencatat aktivitas konservasi, kunjungan budaya, dan penyaluran dana restorasi.
3. **`CulturalCertificate` Contract**  
   * **Fungsi:** `issueCertificate(recipientName, certType, issuedFor, metadataHash)`  
   * **Tujuan:** Penerbitan kredensial budaya tak-dapat-dipalsukan untuk pengrajin Songket dan cagar budaya otentik.

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
