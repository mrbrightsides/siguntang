# Architecture & System Design - SIGUNTANG

SIGUNTANG (**Sistem Integrasi Gerbang Universal Node, Traceability & Artificial Intelligence Nusantara Gemilang**) adalah platform *Smart Tourism & Cultural Preservation* berbasis teknologi desentralistik dan kecerdasan buatan. Dokumen ini merincikan desain sistem, aliran data, serta modul arsitektur yang digunakan platform.

---

## 🏗️ 1. Architecture & System Topology

Topologi arsitektur SIGUNTANG membagi sistem ke dalam 3 lapisan (Layers) utama: **Client Layer (UI/UX)**, **DApp Integration & Security Layer**, serta **Data & Intelligence Layer**.

```mermaid
graph TD
    %% Define Nodes
    subgraph ClientLayer [Client Layer - React/Vite SPA]
        A[Interactive Web App] --> B[Heritage Map UI]
        A --> C[Traceability Hub UI]
        A --> D[Universal Explorer UI]
        A --> E[AI Assistant Chat]
    end

    subgraph ServiceLayer [Integration & Decoupled State]
        F[Wallet Connector - Metamask/EVM]
        G[SIGUNTANG Web3 Service]
        H[AI Service Gateway - Gemini API]
    end

    subgraph CoreLayer [Data & Ledger Layer]
        I[(Local Storage State)]
        J[Smart Tourism Chain - simulated ledger]
        K[Google GenAI API]
    end

    %% Connectors
    B -->|Interactive Leaflet Tiles| I
    C -->|Reads/Writes TXs| G
    E -->|Context Query| H
    
    G -->|Interactive Cryptographic Signing| F
    G -->|Read/Write Blockchain States| J
    H -->|Proxying Contextual Metadata| K
    
    A -.->|Fallback Storage| I

    %% Styling
    classDef client fill:#faf8f5,stroke:#8b0000,stroke-width:2px;
    classDef service fill:#f2efe9,stroke:#555,stroke-width:1px;
    classDef core fill:#e8dcd0,stroke:#8b0000,stroke-width:1px;
    class A,B,C,D,E client;
    class F,G,H service;
    class I,J,K core;
```

---

## 🌊 2. Data Flow Diagram

Diagram di bawah mengilustrasikan aliran penambahan riwayat kelacakgalian (*Traceability transaction*) dari pengguna yang memiliki otorisasi dompet digital (*authenticated wallet*):

```mermaid
sequenceDiagram
    autonumber
    actor User as Pengurus / Kurator Budaya
    participant Web as SIGUNTANG UI
    participant Web3 as Blockchain Service (STC)
    participant AI as Gemini Assistant
    participant Ledger as Immutable State (STC Ledger)

    User->>Web: Sambungkan Wallet (Connect Wallet)
    Web->>Web3: Minta Otorisasi Alamat Dompet (Metamask)
    Web3-->>Web: Wallet Terhubung (0x17A1...95DA)
    
    User->>Web: Masukkan Transaksi Restorasi / Verifikasi
    Web->>Web3: Hitung SHA-256 Hash Konten & Detil
    Web3->>Web3: Tanda tangani enkripsi transaksi
    Web3->>Ledger: Commit data ke Smart Contract
    Ledger-->>Web: Berhasil dicatat (Tx Hash Terbit)
    
    Web->>AI: Kirimkan Transaksi Baru untuk Sintesis Narasi
    AI->>Web: Hasil analisis relevansi sejarah (AI Context)
    Web-->>User: Tampilkan notifikasi dan update daftar node terbaru
```

---

## 🧭 3. User Journey Map

Perjalanan pengguna umum (Wisatawan/Sejarawan) dan Kurator Budaya dalam mengeksplorasi serta melestarikan warisan budaya Palembang:

```mermaid
journey
    title Menjelajah Warisan Budaya dengan SIGUNTANG
    section Penjelajahan Geospasial
      Membuka homepage SIGUNTANG: 5: Wisatawan, Kurator
      Melihat Peta Interaktif Palembang: 4: Wisatawan, Kurator
      Mengklik Bukit Siguntang (Genesis Node): 5: Wisatawan
    section Validasi Autentisitas & AI
      Membuka detail simpul & memverifikasi sertifikat budaya: 4: Wisatawan
      Melakukan tanya jawab seputar sejarah silsilah di AI Chat: 5: Wisatawan, Sejarawan
    section Pencatatan Kelacakgalian (Web3)
      Menyambungkan akun Web3 / Wallet: 4: Kurator, Pengrajin
      Melakukan entri restorasi atau verifikasi kain Songket: 5: Kurator, Pengrajin
      Mengunduh sertifikat sertifikasi kelacakgalian (PDF/Text): 5: Pengrajin, Kolektor
```

---

## 🗺️ 4. Cultural Knowledge Mindmap

Struktur organisasi pengetahuan budaya (Cultural Ontology) yang dipetakan oleh platform SIGUNTANG untuk melacak warisan kolosal Bumi Sriwijaya:

```mermaid
mindmap
  root((SIGUNTANG))
    Genesis Node
      Bukit Siguntang
        Akar Sriwijaya
        Situs Arkeologi Spiritual
    Sejarah & Religi
      Museum SMB II
        Kesultanan Palembang Darussalam
        Artefak Sriwijaya
      Masjid Agung Palembang
        Akulturasi Tionghoa
        Arsitektur Eropa & Melayu
    Ekonomi Kreatif
      Kain Tenun Songket
        Pengrajin Tuan Kentang
        Sertifikasi Keaslian Fisik
    Infrastruktur Digital
      Smart Tourism Chain - STC
      Gemini AI Knowledge Base
      Interaksi Peta Geospasial
```

---

## 🧬 5. Class Diagram (System Structure)

Hubungan kelas dan tipe struktur data yang merepresentasikan ekosistem SIGUNTANG:

```mermaid
classDiagram
    class NodeType {
        <<enumeration>>
        HERITAGE
        RELIGION
        MSME
    }

    class UniversalNode {
        +string id
        +string name
        +NodeType type
        +string description
        +string image
        +Location location
        +List~TraceabilityTransaction~ traceability
        +List~string~ tags
    }

    class Location {
        +number lat
        +number lng
        +string address
    }

    class TraceabilityTransaction {
        +string id
        +string timestamp
        +string event
        +string actor
        +string hash
        +number value
    }

    class WalletState {
        +string address
        +boolean isConnected
        +number balance
    }

    UniversalNode --> NodeType : memiliki tipe
    UniversalNode --> Location : menunjuk koordinat
    UniversalNode --> TraceabilityTransaction : mencatat riwayat
    TraceabilityTransaction ..> WalletState : divalidasi oleh
```

---

## 🛠️ Desain Modular Kode
Sistem dibangun berdampingan dengan prinsip ketergantungan minimal dan isolasi fungsional:
*   `src/constants.ts` - Bertindak sebagai repositori tunggal data (*Single Source of Truth*) untuk data Budaya dan Koordinat Geospasial Node.
*   `src/components/HeritageMap.tsx` - Modul visualisasi spasial berbasis Leaflet Engine dengan rendering performa tinggi.
*   `src/components/TraceabilityHub.tsx` - Modul visual interaksi dengan jaringan digital STC untuk melihat serta menambahkan catatan transparan.
*   `src/services/blockchainService.ts` - Lapisan emulasi Smart Contract & integrasi Metamask dengan hash kriptografis SHA-256 demi kelayakan verifikasi nyata.
