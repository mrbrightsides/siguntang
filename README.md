# SIGUNTANG - Peta Hidup Budaya Nusantara

> **Sistem Integrasi Gerbang Universal Node, Traceability & Artificial Intelligence Nusantara Gemilang**
> *A Smart Tourism Infrastructure for Palembang Heritage*

SIGUNTANG adalah platform pariwisata cerdas & pelestarian budaya berbasis infrastruktur kelacakgalian (traceability) dan visualisasi spasial interaktif. Proyek ini didesain khusus untuk melacak, mengautentikasi, dan mempromosikan warisan kolosal budaya Kota Palembang (Bumi Sriwijaya).

## 🌐 Live Demo & Tautan Resmi

Aplikasi ini telah didistribusikan secara publik dan dapat diakses melalui tautan resmi di bawah ini:
👉 **[siguntang.vercel.com](https://siguntang.vercel.com)**

---

## 🎨 Fitur Utama Platform

1. **Peta Budaya Interaktif (Heritage Map)**
   Sistem pemetaan geospasial interaktif yang menampilkan simpul-simpul warisan sejarah, religi, maupun pelaku ekonomi kreatif (UMKM) legendaris di Kota Palembang.
   
2. **Kelacakgalian Digital (Traceability Hub)**
   Integrasi konsep *Smart Tourism Chain* (STC) untuk mencatat sejarah sertifikasi, restorasi, pendataan, dan verifikasi fisik dari objek budaya ke dalam ledger digital yang transparan dan *immutable*.

3. **Universal Node Explorer**
   Pustaka komparatif berkepanjangan yang menyajikan profil detail, foto otentik, alamat presisi fisik objek budaya, serta penanda sertifikat digital.

4. **Gerbang Cerdas AI (Artificial Intelligence)**
   Dukungan pemahaman kontekstual berbasis kecerdasan buatan terpadu untuk memberikan edukasi mendalam seputar keterkaitan sejarah silsilah Kerajaan Sriwijaya, Kesultanan Palembang Darussalam, hingga kerajinan kontemporer.

---

## 📜 Arsitektur Smart Contract (Web3 Integration)

Sistem kelacakgalian SIGUNTANG ditunjang oleh 3 pilar Smart Contract utama yang berjalan di atas protokol *Smart Tourism Chain* (STC) berbasis standar Ethereum Virtual Machine (EVM):

1. **`HeritageNodeRegistry` Contract**
   * **Deskripsi**: Kontrak pintar registri desentralisasi yang bertugas menyimpan dan mengelola titik koordinat, silsilah sejarah, serta metadata otoritatif dari simpul-simpul budaya nusantara.
   * **Fungsi Utama**: `registerNode(name, category, location, metadataHash)`
   * **Manfaat**: Memastikan tidak ada duplikasi atau manipulasi data objek cagar budaya historis yang terdaftar di jaringan global.

2. **`TraceabilityTransaction` Contract**
   * **Deskripsi**: Kontrak pencatatan riwayat (ledger) kelacakgalian yang transparan untuk mencatat aktivitas restorasi fisik, penyaluran donasi konservasi, atau rekaman perawatan berkala simpul budaya.
   * **Fungsi Utama**: `recordTransaction(type, nodeName, amount, metadataHash)`
   * **Manfaat**: Menciptakan akuntabilitas penuh atas dana pelestarian alam/budaya berdaulat serta melacak asal-usul materi restorasi purbakala.

3. **`CulturalCertificate` Contract**
   * **Deskripsi**: Kontrak pintar penerbitan sertifikat digital berlingkup warisan budaya (*Universal Cultural Credential*). Biasanya diberikan kepada pengrajin lokal bersertifikasi maupun sertifikat otentisitas karya seni fisik.
   * **Fungsi Utama**: `issueCertificate(recipientName, certType, issuedFor, metadataHash)`
   * **Manfaat**: Melindungi kekayaan intelektual kolektif seperti kain tenun Songket Palembang dari pemalsuan industri luar, sekaligus memberi validasi kepakaran digital bagi maestro pengrajin local.

---

## 📸 Simpul Budaya Terintegrasi (Nodes)

Platform ini mengintegrasikan repositori visual yang didokumentasikan langsung melalui kemitraan publik:

*   **Bukit Siguntang (Genesis Node)** — Titik awal narasi sejarah dan peradaban yang menjadi akar jaringan budaya digital SIGUNTANG. Bukit bersejarah dari era Kerajaan Sriwijaya yang menyimpan nilai spiritual dan arkeologis kolosal.
*   **Masjid Agung Sultan Mahmud Badaruddin I** — Pusat religi bersejarah berarsitektur akulturasi Tionghoa, Eropa, dan Melayu.
*   **Museum Sultan Mahmud Badaruddin II** — Penjaga warisan silsilah Kesultanan Palembang Darussalam & artefak Kerajaan Sriwijaya.
*   **Pengrajin Songket Tuan Kentang** — Pusat industri kreatif & kain tenun songket warisan adiluhung dengan jaminan uji keaslian digital.

---

## 🚀 Teknologi yang Digunakan

*   **Frontend**: React (v18+) + Vite + TypeScript
*   **Web3/Blockchain**: Ethers.js + Metamask Connector + SIWE (Sign-In with Ethereum)
*   **Styling**: Tailwind CSS untuk presisi estetika modern
*   **Peta**: React Leaflet / Custom Spasial Engine
*   **Animasi**: Framer Motion (`motion/react`)
*   **Ikon**: Lucide React
*   **Deploy Cloud**: Vercel (Production Build)

---

## 🛠️ Panduan Pengembangan Lokal

Untuk menjalankan SIGUNTANG di komputer lokal Anda:

1. Clone repositori ini atau ekstrak paket ZIP.
2. Instalasi dependensi:
   ```bash
   npm install
   ```
3. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```
4. Lakukan proses kompilasi siap produksi:
   ```bash
   npm run build
   ```

---

*SIGUNTANG — Menjaga Kejayaan Sriwijaya, Menguntai Teknologi Nusantara Gemilang.*
