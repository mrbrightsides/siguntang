# Integrasi API Pihak Ketiga & Layanan Eksternal - SIGUNTANG

Platform **SIGUNTANG** mengandalkan beberapa API dan pustaka open-source eksternal untuk menghidupkan ekosistem pariwisata cerdas dan kelacakgalian digital. Berikut adalah rincian layanan pihak ketiga yang digunakan dan cara mengonfigurasinya.

---

## 🧠 1. Google Gemini API (Kecerdasan Buatan)

SIGUNTANG mengintegrasikan model bahasa pintar Gemini dari Google untuk memberikan asisten edukasi pemahaman mendalam secara kontekstual di dasbor pengguna.

*   **Pustaka**: SDK `@google/genai` (Node.js/TypeScript Server-Side) atau panggilan proxy RESTful.
*   **Penggunaan Utama**: Menjawab pertanyaan sejarah, menautkan nilai silsilah Kerajaan Sriwijaya, menganalisis data, serta menjelaskan struktur akulturasi budaya Palembang.
*   **Konfigurasi Keamanan**: Kunci API disimpan secara eksklusif di dalam server backend yang aman dengan mendeklarasikannya di `.env`:
    ```env
    GEMINI_API_KEY=AIzaSy...
    ```
*   **Keamanan Kunci**: Sesuai dengan standar keamanan kami, kunci ini tidak pernah dibocorkan ke browser klien desktop maupun ponsel pintar.

---

## 🗺️ 2. OpenStreetMap & Leaflet (Peta Spasial)

Sistem rendering geospasial yang interaktif dan responsif pada seksi **Heritage Map** memanfaatkan visualisasi peta gratis terdistribusi.

*   **Pustaka**: `leaflet` dan integrasi React Leaflet.
*   **Penggunaan Utama**: Pemetaan lokasi presisi dari simpul warisan (Heritage Nodes) seperti Bukit Siguntang, Masjid Agung, Museum SMB II, dan Pengrajin Songket Tuan Kentang.
*   **Tile Server Provider**: OpenStreetMap (OSM) standard tile engine.
*   **Kebutuhan API Key**: Sepenuhnya open-source dan tidak memerlukan kunci Lisensi berbayar, menjamin reliabilitas platform untuk diakses secara asinkronus tanpa khawatir limit kuota.

---

## 🔐 3. Web3 & EVM Cryptographic Signing (Simulated Ledger)

Untuk menyalakan sistem pelacakan digital transparan *Smart Tourism Chain (STC)*, kami mengintegrasikan fungsionalitas penandatanganan kriptografis desentralisasi.

*   **Pustaka**: Ethers.js / Web3.js provider emulator.
*   **Penggunaan Utama**: Menghubungkan akun dompet digital kurator menggunakan protokol Metamask Core, menghitung hash kriptografi transparan berbasis algoritma SHA-256 secara lokal, serta menghasilkan blok tanda tangan immutable (tidak dapat diretas).
*   **Smart Contract**: Menjalankan virtualisasi pemanggilan 3 kontrak pintar utama:
    *   `HeritageNodeRegistry`
    *   `TraceabilityTransaction`
    *   `CulturalCertificate`

---

## 📞 Hubungi Kami

Apabila Anda memiliki pertanyaan seputar integrasi API atau ingin mengembangkan kemitraan teknologi lanjutan:

*   **GitHub**: [mrbrightsides/siguntang](https://github.com/mrbrightsides/siguntang)
*   **Telegram**: [@khudriakhmad](https://t.me/khudriakhmad)
*   **Discord**: [@khudri_61362](https://discord.com/channels/@khudri_61362)
*   **Email**: [support@elpeef.com](mailto:support@elpeef.com)
