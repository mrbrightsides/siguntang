# Panduan Kontribusi - SIGUNTANG

Kami sangat senang Anda tertarik untuk ikut berkontribusi dalam mengembangkan platform **SIGUNTANG (Sistem Integrasi Gerbang Universal Node, Traceability & Artificial Intelligence Nusantara Gemilang)**! Proyek ini didesain untuk melestarikan warisan kolosal budaya Kota Palembang melalui teknologi modern.

---

## 📞 Saluran Komunikasi Resmi

Jika Anda menemukan bug, ingin mengusulkan fitur baru, atau ingin berdiskusi mengenai arsitektur sistem, silakan hubungi tim kami melalui saluran resmi berikut:

*   **Penyimpanan Kode (Repository)**: [GitHub mrbrightsides/siguntang](https://github.com/mrbrightsides/siguntang)
*   **Komunitas Telegram**: [Hubungi di Telegram](https://t.me/khudriakhmad)
*   **Komunitas Discord**: [Masuk ke Saluran Discord](https://discord.com/channels/@khudri_61362)
*   **Dukungan Email**: [support@elpeef.com](mailto:support@elpeef.com)

---

## 🚀 Alur Kontribusi (Contribution Workflow)

Kami menyarankan untuk mengikuti langkah-langkah berikut untuk berkontribusi:

### 1. Garpu Repositori (Fork) & Kloning (Clone)
Langkah pertama adalah melakukan Fork pada repositori resmi kami di GitHub, lalu melakukan klon secara lokal:
```bash
git clone https://github.com/mrbrightsides/siguntang.git
cd siguntang
```

### 2. Membuat Cabang Baru (Feature Branch)
Selalu buat cabang baru dari cabang utama (`main`) sebelum melakukan modifikasi kode:
```bash
git checkout -b feature/nama-fitur-anda
```

### 3. Standar Penulisan Kode (Lint & Format)
Sebelum melakukan komit, pastikan kode Anda bebas dari kesalahan sintaksis atau ketidaksesuaian tipe data standar TypeScript:
```bash
# Menjalankan Linter
npm run lint

# Menjalankan Tes Kompilasi Build
npm run build
```

### 4. Melakukan Komit (Commit)
Tuliskan pesan komit dengan format deskriptif yang jelas dalam Bahasa Indonesia atau Bahasa Inggris:
```bash
git commit -m "feat: tambahkan fitur integrasi spasial baru pada Heritage Map"
```

### 5. Mengirimkan Pull Request (PR)
Unggah cabang Anda ke fork GitHub Anda, lalu ajukan *Pull Request* ke repositori asli di cabang `main`. Tulis ringkasan mengenai apa yang diubah, diperbaiki, atau ditambahkan pada dokumen penjelas PR Anda.

---

## 📜 Panduan Kode & Etika Komunitas

1.  **Gunakan TypeScript Secermat Mungkin**: Hindari penggunaan tipe data `any` yang tidak perlu untuk menjamin kekuatan kode.
2.  **Gaya Desain Konsisten**: Gunakan utilitas Tailwind CSS dengan tetap mempertahankan skema warna bertema **Warm Ivory & Deep Wood** yang telah established pada layout SIGUNTANG.
3.  **Etika Diskusi**: Hormati seluruh kontributor lain di media sosial Telegram maupun Discord. Kita bersama-sama bergotong royong melestarikan budaya adiluhung nusantara melalui inovasi digital.

Terima kasih atas dedikasi dan kontribusi Anda bagi kelestarian budaya Palembang bersama **SIGUNTANG**!
