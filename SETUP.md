# Panduan Instalasi Lokal - SIGUNTANG

Dokumen ini menjelaskan langkah-langkah untuk menyiapkan, memasang dependensi, dan menjalankan platform **SIGUNTANG** di komputer atau lingkungan lokal Anda.

---

## 📋 Syarat & Kebutuhan Sistem

Sebelum memulai, pastikan lingkungan pengembangan Anda telah memenuhi kebutuhan perangkat lunak berikut:

*   **Node.js**: Versi LTS stabil terbaru (disarankan Node.js v18 atau v20+)
*   **npm**: Terbawa secara default dalam instalasi Node.js (versi 8+)
*   **Git**: Untuk melakukan klon repositori dari GitHub
*   **Dompet Web3 (Opsional)**: Ekstensi penjelajah Metamask untuk menguji alur autentikasi tanda tangan digital yang nyata.

---

## 🚀 Langkah Demi Langkah Instalasi

Ikuti urutan langkah di bawah ini untuk memulai pengembangan:

### 1. Klon Repositori Resmi
Dapatkan salinan kode SIGUNTANG dari penyimpanan resmi menggunakan Git:
```bash
git clone https://github.com/mrbrightsides/siguntang.git
cd siguntang
```

### 2. Memasang Dependensi Paket (Dependencies Install)
Pasang seluruh library pendukung (seperti React, Vite, Framer Motion, Leaflet, dan Lucide Icons) dengan menjalankan perintah berikut di terminal:
```bash
npm install
```

### 3. Konfigurasi Variabel Lingkungan (.env)
Platform ini dapat membaca kunci API server-side seperti Google Gemini API Key secara aman. Buat file `.env` di direktori utama Anda berdasarkan contoh yang disediakan:
```bash
# Salin konfigurasi dasar
cp .env.example .env
```
Isikan variabel di bawah ini di dalam file `.env` baru Anda jika ingin menggunakan asisten bimbingan berbasis AI yang sesungguhnya di port server:
```env
GEMINI_API_KEY=Kunci_API_Gemini_Anda_Disini
```

### 4. Menjalankan Server Pengembangan Lokal (Dev Server)
Jalankan server pengembangan berbasis Vite dengan perintah:
```bash
npm run dev
```
Setelah server berjalan, buka peramban web (*browser*) Anda dan akses alamat berikut:
👉 `http://localhost:3000` (atau port default yang ditunjukkan pada log terminal Anda).

---

## 🏗️ Melakukan Kompilasi untuk Produksi (Production Build)

Jika Anda ingin melakukan build aplikasi untuk didistribusikan di atas cloud hosting statis seperti Vercel, Netlify, atau Cloud Run:

```bash
# Lakukan kompilasi optimal
npm run build
```
Hasil proses kompilasi akan diletakkan di dalam folder `/dist`. Folder ini berisi file statis HTML, CSS, dan Javascript yang sangat teroptimasi dan siap disajikan secara instan ke jutaan pengunjung global.

---

## 🛠️ Kontak Bantuan & Kontribusi

*   **Repository Resmi**: [GitHub mrbrightsides/siguntang](https://github.com/mrbrightsides/siguntang)
*   **Telegram Support**: [@khudriakhmad](https://t.me/khudriakhmad)
*   **Discord Server**: [@khudri_61362](https://discord.com/channels/@khudri_61362)
*   **Dukungan Teknis**: [support@elpeef.com](mailto:support@elpeef.com)
