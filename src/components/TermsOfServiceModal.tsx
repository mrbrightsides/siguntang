/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  FileText,
  Shield,
  Scale,
  Search,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Lock,
  Camera,
  Cpu,
  Globe,
  Coins,
  Sparkles,
  ChevronRight,
  Info,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ToSSection {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  icon: typeof Shield;
  summary: string;
  clauses: {
    heading: string;
    content: string;
    highlight?: boolean;
  }[];
}

const TOS_SECTIONS: ToSSection[] = [
  {
    id: 'general',
    number: '01',
    title: 'Ketentuan Umum & Definisi Platform',
    shortTitle: 'Ketentuan Umum',
    icon: Globe,
    summary: 'Platform SIGUNTANG adalah inisiatif digitalisasi dan kedaulatan warisan budaya Nusantara yang beroperasi di bawah ekosistem ELPEEF.',
    clauses: [
      {
        heading: '1.1 Identitas Layanan & Ekosistem Pengembang',
        content: 'Platform digital SIGUNTANG Nusantara Gemilang ("SIGUNTANG", "Layanan", atau "Kami") dikembangkan dan dikelola terintegrasi dengan ekosistem ELPEEF, meliputi portal utama (elpeef.com), infrastruktur ledger terdistribusi (rantai.elpeef.com), dan protokol Smart Tourism Chain (smartourism.elpeef.com).'
      },
      {
        heading: '1.2 Penerimaan Ketentuan',
        content: 'Dengan mengakses, menavigasi, berinteraksi dengan peta interaktif, menjelajahi diorama 3D, memindai objek dengan AI Vision, menggunakan kamera WebAR, atau mengklaim Soulbound Token (SBT), Anda ("Pengguna") menyetujui seluruh klausul dalam Ketentuan Layanan ini tanpa syarat.'
      },
      {
        heading: '1.3 Definisi Istilah Inti',
        content: 'STC (Smart Tourism Chain) mengacu pada arsitektur blockchain hibrida untuk verifikasi keaslian dan jejak rekam (traceability) cagar budaya. Node merepresentasikan entitas berlisensi kebudayaan (situs sejarah, museum, rumah ibadah, atau paguyuban kriya lokal Palembang).'
      }
    ]
  },
  {
    id: 'sovereignty',
    number: '02',
    title: 'Kedaulatan & Perlindungan Data Warisan Budaya Nusantara',
    shortTitle: 'Kedaulatan Data',
    icon: Shield,
    summary: 'Data sejarah, manuskrip prasasti, dan tradisi lisan adalah aset peradaban bangsa yang tidak boleh dimonopoli secara komersial.',
    clauses: [
      {
        heading: '2.1 Prinsip Kepemilikan Komunal (Cultural Commons)',
        content: 'Seluruh narasi historiografi Sriwijaya, transkripsi Prasasti Kedukan Bukit, manuskrip Kesultanan Palembang Darussalam, dan folklore Sungai Musi dikelola dengan asas Public Domain / Creative Commons Attribution-NonCommercial (CC BY-NC 4.0).',
        highlight: true
      },
      {
        heading: '2.2 Integritas Data Digital (Digital Authenticity Guarantee)',
        content: 'Setiap entri simpul budaya ditautkan dengan hash kriptografis SHA-256 dan dicatat pada ledger STC. Pengguna dilarang memanipulasi, mengaburkan, atau merekayasa metadata sejarah untuk kepentingan klaim sepihak.'
      },
      {
        heading: '2.3 Keterbukaan Arsip Digital untuk Riset & Pendidikan',
        content: 'Data terbuka bagi institusi pendidikan, peneliti, balai pelestarian cagar budaya, dan masyarakat umum untuk kepentingan studi dan edukasi nirbala.'
      }
    ]
  },
  {
    id: 'blockchain',
    number: '03',
    title: 'Integritas Blockchain, Hash Imutable, & Smart Contract',
    shortTitle: 'Integritas Blockchain',
    icon: Lock,
    summary: 'Pencatatan data penelusuran (traceability) bersifat permanen, transparan, dan dapat diaudit publik.',
    clauses: [
      {
        heading: '3.1 Sifat Transaksi Ledger Terdistribusi',
        content: 'Semua transaksi penelusuran (traceability log) yang telah divalidasi ke jaringan blockchain publik/konsorsium STC bersifat tetap (immutable) dan tidak dapat dibatalkan atau dihapus oleh pihak mana pun.'
      },
      {
        heading: '3.2 Auditabilitas Terbuka',
        content: 'Publik berhak memverifikasi nomor blok, timestamp ISO, proof hash, dan alamat pengirim melalui penjelajah rantai di rantai.elpeef.com dan smartourism.elpeef.com.'
      },
      {
        heading: '3.3 Non-Spekulasi Finansial',
        content: 'Protokol STC dan tokenisasi budaya pada SIGUNTANG ditujukan semata-mata untuk verifikasi jejak pelestarian budaya, bukan sebagai instrumen investasi spekulatif atau sekuritas keuangan.',
        highlight: true
      }
    ]
  },
  {
    id: 'sbt',
    number: '04',
    title: 'Soulbound Token (SBT ERC-5192) & Bukti Kehadiran',
    shortTitle: 'Soulbound Token (SBT)',
    icon: Coins,
    summary: 'Sertifikat digital kehadiran di lokasi bersejarah terikat permanen pada identitas digital pengguna.',
    clauses: [
      {
        heading: '4.1 Sifat Non-Transferable (Terikat Jiwa)',
        content: 'Soulbound Token (SBT) yang diterbitkan melalui standar ERC-5192 berstatus locked / non-transferable. SBT tidak dapat diperjualbelikan, ditukar, atau dipindahtangankan ke dompet lain.'
      },
      {
        heading: '4.2 Bukti Kehadiran Fisik & Edukasi (Proof-of-Visit)',
        content: 'Klaim SBT memerlukan konfirmasi lokasi geospasial aktual pengguna di sekitar simpul cagar budaya (seperti Bukit Siguntang atau Jembatan Ampera) atau penyelesaian modul kurasi edukasi.'
      },
      {
        heading: '4.3 Kebijakan Pembatalan Klaim Palsu',
        content: 'Pengelola berhak menandai atau mencabut status keabsahan klaim SBT on-chain jika terbukti dihasilkan dari manipulasi koordinat GPS atau otomatisasi bot tanpa kehadiran fisik nyata.'
      }
    ]
  },
  {
    id: 'hardware-sensors',
    number: '05',
    title: 'Akses Sensor Perangkat: Kamera WebAR & Geospasial GPS',
    shortTitle: 'Sensor Kamera & GPS',
    icon: Camera,
    summary: 'Akses kamera dan lokasi sepenuhnya diproses lokal di peramban pengguna tanpa penyimpanan data visual rahasia.',
    clauses: [
      {
        heading: '5.1 Pemrosesan Lokal Kamera WebAR (Client-Side Privacy)',
        content: 'Fitur kamera AR Heritage Viewer menggunakan API browser standar (navigator.mediaDevices.getUserMedia). Citra video hanya diproses secara lokal di memori browser untuk menumpangkan objek 3D. Tidak ada rekaman video atau foto yang dikirimkan ke peladen eksternal tanpa tindakan simpan dari Pengguna.',
        highlight: true
      },
      {
        heading: '5.2 Fitur Capture Snapshot Sebagai Objek Browser Lokal',
        content: 'Hasil bidikan foto AR dikonversi langsung menjadi Blob dan File objek lokal di browser pengguna (URL.createObjectURL). File tersebut disimpan di penyimpanan perangkat pengguna dan hanya dibagikan atas kehendak eksplisit Pengguna melalui Web Share API.'
      },
      {
        heading: '5.3 Penggunaan Sensor Geospasial & Kompas Gyroscope',
        content: 'Sensor GPS dan orientasi perangkat (DeviceOrientationEvent) digunakan murni untuk menghitung sudut azimuth arah pandang kamera ke cagar budaya terdekat dan mengkalibrasi jarak toleransi deteksi.'
      }
    ]
  },
  {
    id: 'ai-services',
    number: '06',
    title: 'Kecerdasan Buatan (AI Vision, AI Storyteller, & Gemini Curator)',
    shortTitle: 'Penggunaan Kecerdasan Buatan',
    icon: Cpu,
    summary: 'Fitur AI multimodal bertujuan memperkaya literasi dan identifikasi visual ragam hias warisan Nusantara.',
    clauses: [
      {
        heading: '6.1 Akurasi & Batasan Analisis AI Vision',
        content: 'Fitur inspeksi AI Songket Vision menggunakan model generatif multimodal untuk membantu mengidentifikasi motif tradisional dan ragam hias. Hasil analisis bersifat kuratorial edukatif dan tidak menggantikan sertifikasi keahlian manual resmi dari maestro tenun songket.'
      },
      {
        heading: '6.2 Etika Narasi Budaya AI Storyteller',
        content: 'Generasi narasi tutur lisan didasarkan pada korpus teks sastra dan mitologi lokal Musi yang telah terkurasi. Dilarang memanfaatkan antarmuka AI untuk menyebarkan narasi ujaran kebencian, fabrikasi sejarah bermusuhan, atau penyesatan data genealogi.'
      }
    ]
  },
  {
    id: 'ipr-craft',
    number: '07',
    title: 'Hak Kekayaan Intelektual, Motif Songket, & Penghormatan Budayawan',
    shortTitle: 'Hak Cipta & Seni Kriya',
    icon: Sparkles,
    summary: 'Pengakuan moral dan ekonomi bagi pengrajin songket Tuan Kentang serta para pelaku tradisi lokal.',
    clauses: [
      {
        heading: '7.1 Penghormatan Hak Cipta Perajin Tradisional',
        content: 'Ragam hias songket (Lepus Bintang Penuh, Nampan Perak, Limar, dsb.) adalah karya adiluhung perajin Palembang. Dokumentasi digital di platform SIGUNTANG ditujukan untuk pelindungan hak cipta kolektif dan pencegahan klaim ilegal pihak asing.'
      },
      {
        heading: '7.2 Merek Dagang & Lisensi Kode Sumber',
        content: 'Nama SIGUNTANG, logo grafis, dan aset multimedia berhak cipta dilindungi undang-undang. Kerangka kode komputasi terbuka tunduk pada lisensi Apache-2.0.'
      }
    ]
  },
  {
    id: 'donations',
    number: '08',
    title: 'Donasi Kebudayaan, Reservasi Edukasi, & Patron Komunitas',
    shortTitle: 'Donasi & Partisipasi Patron',
    icon: Coins,
    summary: 'Mekanisme pendanaan partisipatif murni untuk pemeliharaan simpul sejarah dan kesejahteraan perajin.',
    clauses: [
      {
        heading: '8.1 Penyaluran Donasi Transparan',
        content: 'Kontribusi sukarela dari Pengguna disalurkan langsung secara peer-to-peer ke dompet terdaftar pengelola simpul cagar budaya, yayasan pemugaran, atau paguyuban perahu ketek dan kriya songket.',
        highlight: true
      },
      {
        heading: '8.2 Kebijakan Pengembalian Dana (Non-Refundable)',
        content: 'Mengingat sifat transaksi desentralisasi blockchain yang instan dan final, donasi on-chain yang telah terkonfirmasi di blok tidak dapat dibatalkan atau dikembalikan.'
      }
    ]
  },
  {
    id: 'liability',
    number: '09',
    title: 'Batasan Tanggung Jawab & Keamanan Siber',
    shortTitle: 'Batasan Tanggung Jawab',
    icon: Scale,
    summary: 'Ketentuan keselamatan fisik saat berkunjung di lapangan dan integritas keamanan sistem.',
    clauses: [
      {
        heading: '9.1 Keselamatan Pengguna Saat Eksplorasi Lapangan',
        content: 'Pengguna bertanggung jawab penuh atas keselamatan pribadi, kehati-hatian saat melangkah di dermaga Sungai Musi, tepi jembatan, atau lereng bukit ketika mengoperasikan kamera AR.'
      },
      {
        heading: '9.2 Batasan Jaminan Layanan ("As-Is")',
        content: 'Layanan disediakan sebagaimana adanya ("as-is" dan "as-available"). Kami berupaya maksimal menjaga reliabilitas data, namun tidak bertanggung jawab atas kerugian tidak langsung akibat gangguan jaringan internet publik, kegagalan sensor perangkat keras, atau latensi RPC blockchain.'
      }
    ]
  },
  {
    id: 'governance',
    number: '10',
    title: 'Hukum yang Berlaku, Amandemen, & Kontak Resmi',
    shortTitle: 'Hukum & Kontak Resmi',
    icon: BookOpen,
    summary: 'Ketentuan hukum Republik Indonesia dan kanal komunikasi resmi pelaporan warisan budaya.',
    clauses: [
      {
        heading: '10.1 Hukum yang Berlaku & Yurisdiksi',
        content: 'Ketentuan Layanan ini diatur dan ditafsirkan sesuai dengan hukum Republik Indonesia, termasuk Undang-Undang No. 11 Tahun 2010 tentang Cagar Budaya dan Undang-Undang No. 1 Tahun 2024 tentang Informasi dan Transaksi Elektronik (ITE).'
      },
      {
        heading: '10.2 Pembaruan & Amandemen Ketentuan',
        content: 'Kami dapat memperbarui Ketentuan Layanan ini sewaktu-waktu seiring perkembangan regulasi dan teknologi protokol STC. Versi terbaru akan selalu dicantumkan dengan stempel tanggal revisi resmi di laman ini.'
      },
      {
        heading: '10.3 Kontak & Partisipasi Publik',
        content: 'Pertanyaan hukum, usulan verifikasi manuskrip, atau kerja sama digitalisasi cagar budaya dapat disampaikan melalui ekosistem ELPEEF di https://elpeef.com atau kanal resmi pengelola konsorsium Smart Tourism Chain.'
      }
    ]
  }
];

export function TermsOfServiceModal({ isOpen, onClose }: TermsOfServiceModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState<string>('general');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Filter sections based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return TOS_SECTIONS;
    const q = searchQuery.toLowerCase();
    return TOS_SECTIONS.filter((sec) => {
      const matchTitle = sec.title.toLowerCase().includes(q) || sec.shortTitle.toLowerCase().includes(q);
      const matchSummary = sec.summary.toLowerCase().includes(q);
      const matchClauses = sec.clauses.some(
        (c) => c.heading.toLowerCase().includes(q) || c.content.toLowerCase().includes(q)
      );
      return matchTitle || matchSummary || matchClauses;
    });
  }, [searchQuery]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopySection = (sec: ToSSection) => {
    const textToCopy = `SIGUNTANG • Terms of Service (Ketentuan Layanan)\nBagian ${sec.number}: ${sec.title}\n\n${sec.summary}\n\n` +
      sec.clauses.map(c => `${c.heading}\n${c.content}`).join('\n\n') +
      `\n\nSumber Resmi: https://elpeef.com • Smart Tourism Chain`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedSection(sec.id);
    setTimeout(() => setCopiedSection(null), 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[7000] flex items-center justify-center p-3 sm:p-6 overflow-hidden select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-5xl max-h-[92vh] bg-[#0c0d12] border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-200 z-10"
        >
          {/* TOP HEADER BAR */}
          <div className="p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-[#170a0a] via-[#120f0d] to-[#0c0d12] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#8b0000]/25 border border-[#8b0000]/50 flex items-center justify-center text-red-400 shrink-0 shadow-lg shadow-red-950/40">
                <Scale size={22} className="text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    Official Legal Protocol
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">
                    Dokumen v2.4.0-STC
                  </span>
                </div>
                <h2 className="font-serif text-lg sm:text-2xl font-bold text-white tracking-tight leading-tight">
                  Ketentuan Layanan & Protokol Budaya Digital
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  SIGUNTANG Nusantara Gemilang • Smart Tourism Chain (STC) & Ekosistem ELPEEF
                </p>
              </div>
            </div>

            {/* Header Action Tools */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={handlePrint}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono font-semibold text-stone-300 transition-all cursor-pointer"
                title="Cetak atau Ekspor Dokumen ke PDF"
              >
                <Printer size={14} className="text-stone-400" />
                <span>Cetak / PDF</span>
              </button>

              <button
                onClick={onClose}
                className="p-2.5 bg-white/10 hover:bg-red-950/80 border border-white/15 hover:border-red-500/50 rounded-xl text-stone-300 hover:text-white transition-all cursor-pointer shadow-md"
                title="Tutup Ketentuan Layanan"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* SEARCH & QUICK ECOSYSTEM STRIP */}
          <div className="px-4 sm:px-6 py-3 bg-black/40 border-b border-white/5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari klausul (misal: kamera, GPS, blockchain, SBT, songket)..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs font-mono text-white placeholder-stone-500 focus:outline-none focus:border-amber-400/60 focus:bg-white/10 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-white"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Verified Ecosystem Hub Links */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
              <span className="text-[10px] font-mono text-stone-500 uppercase font-bold shrink-0">
                Ekosistem Terkait:
              </span>
              <a
                href="https://elpeef.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-[10px] font-mono font-bold text-amber-300 flex items-center gap-1 transition-all shrink-0"
              >
                <span>ELPEEF Utama</span>
                <ExternalLink size={10} />
              </a>
              <a
                href="https://rantai.elpeef.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-mono font-bold text-stone-300 flex items-center gap-1 transition-all shrink-0"
              >
                <span>Rantai Ledger</span>
                <ExternalLink size={10} />
              </a>
              <a
                href="https://smartourism.elpeef.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-mono font-bold text-stone-300 flex items-center gap-1 transition-all shrink-0"
              >
                <span>Smart Tourism</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>

          {/* MAIN DUAL-PANE BODY */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
            {/* LEFT SIDEBAR: QUICK CLAUSE SELECTOR */}
            <div className="w-full md:w-72 lg:w-80 bg-black/50 border-b md:border-b-0 md:border-r border-white/10 overflow-y-auto p-3 sm:p-4 shrink-0 space-y-1.5 max-h-48 md:max-h-none">
              <div className="text-[10px] font-mono uppercase font-bold text-stone-400 px-2 py-1 flex items-center justify-between">
                <span>Daftar Pasal ({filteredSections.length})</span>
                <span className="text-amber-400">Pilih Bab</span>
              </div>

              {filteredSections.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSectionId === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setActiveSectionId(sec.id);
                      document.getElementById(`tos-section-${sec.id}`)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer group ${
                      isActive
                        ? 'bg-amber-500/15 border-amber-400/60 text-white shadow-md shadow-amber-500/10'
                        : 'bg-white/5 hover:bg-white/10 border-white/5 text-stone-300'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                      isActive ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-white/10 text-stone-400 group-hover:text-amber-300'
                    }`}>
                      <Icon size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono font-bold text-amber-400/80">
                          Pasal {sec.number}
                        </span>
                      </div>
                      <p className="text-xs font-semibold truncate leading-snug">
                        {sec.shortTitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* RIGHT MAIN VIEWPORT: EXPANDED ARTICLE CLAUSES */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 scroll-smooth">
              {/* Preamble Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#8b0000]/10 to-transparent border border-amber-500/30 flex items-start gap-3.5">
                <Info size={20} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-stone-300 space-y-1.5">
                  <p className="font-bold text-white text-sm">
                    Mukadimah Kedaulatan Budaya Nusantara
                  </p>
                  <p>
                    SIGUNTANG dibangun di atas kesadaran bahwa kekayaan peradaban Sriwijaya, keagungan Sungai Musi, dan filosofi tenun Songket Palembang adalah amanah peradaban luhur. Dokumen ini mengatur tata kelola digital etis, perlindungan privasi kamera WebAR, verifikasi hash blockchain, dan hak-hak komunal masyarakat adat dan pelaku kriya lokal.
                  </p>
                  <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px] font-mono text-stone-400">
                    <span>• Pembaruan Terakhir: 5 November 2026</span>
                    <span>• Status Hukum: Resmi Berlaku</span>
                    <span>• Versi Protokol: 2.4.0-STC</span>
                  </div>
                </div>
              </div>

              {/* Sections List */}
              {filteredSections.map((sec) => {
                const Icon = sec.icon;
                const isCopied = copiedSection === sec.id;

                return (
                  <section
                    key={sec.id}
                    id={`tos-section-${sec.id}`}
                    className="p-5 sm:p-6 rounded-3xl bg-[#12141c] border border-white/10 hover:border-amber-500/30 transition-all space-y-4 shadow-xl"
                  >
                    {/* Section Header */}
                    <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
                          <Icon size={18} />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase font-bold text-amber-400 tracking-wider">
                            Pasal {sec.number}
                          </span>
                          <h3 className="font-serif text-base sm:text-xl font-bold text-white">
                            {sec.title}
                          </h3>
                        </div>
                      </div>

                      {/* Copy Clause Button */}
                      <button
                        onClick={() => handleCopySection(sec)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-stone-400 hover:text-white transition-all cursor-pointer"
                        title="Salin isi pasal ini ke clipboard"
                      >
                        {isCopied ? (
                          <>
                            <Check size={12} className="text-emerald-400" />
                            <span className="text-emerald-300 font-bold">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Salin Pasal</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Section Summary */}
                    <p className="text-xs text-amber-200/90 font-mono bg-amber-500/5 border-l-2 border-amber-400 px-3 py-2 rounded-r-lg">
                      {sec.summary}
                    </p>

                    {/* Clauses Detail */}
                    <div className="space-y-3.5 pt-1">
                      {sec.clauses.map((clause, idx) => (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-2xl border text-xs leading-relaxed space-y-1.5 ${
                            clause.highlight
                              ? 'bg-amber-950/20 border-amber-500/30 text-stone-200'
                              : 'bg-black/30 border-white/5 text-stone-300'
                          }`}
                        >
                          <h4 className="font-mono font-bold text-amber-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            {clause.heading}
                          </h4>
                          <p className="text-stone-300 pl-3.5 leading-relaxed">
                            {clause.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}

              {/* Bottom Formal Declaration Card */}
              <div className="p-6 rounded-3xl bg-black/60 border border-white/10 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#8b0000]/20 border border-[#8b0000]/40 text-red-400 mb-1">
                  <CheckCircle2 size={24} className="text-amber-400" />
                </div>
                <h4 className="font-serif text-lg font-bold text-white">
                  Komitmen Abadi Kedaulatan Budaya Palembang
                </h4>
                <p className="text-xs text-stone-400 max-w-xl mx-auto leading-relaxed">
                  Dengan menggunakan ekosistem SIGUNTANG, Anda turut menjadi penjaga kedaulatan digital Sriwijaya, memperkuat ekosistem perajin songket, dan melestarikan hikayat maritim Sungai Musi untuk generasi mendatang.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase font-mono tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95"
                  >
                    Saya Mengerti & Setuju
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase font-mono tracking-wider rounded-xl transition-all cursor-pointer border border-white/15"
                  >
                    Simpan Salinan Dokumen
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER BAR */}
          <div className="p-3 sm:p-4 bg-black/80 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400 font-mono">
            <div className="flex items-center gap-2">
              <Shield size={13} className="text-[#8b0000]" />
              <span>SIGUNTANG Nusantara Protocol • Hash: 0x7e2b...864c</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <a
                href="https://elpeef.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition-colors"
              >
                elpeef.com
              </a>
              <span>•</span>
              <a
                href="https://rantai.elpeef.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition-colors"
              >
                rantai.elpeef.com
              </a>
              <span>•</span>
              <a
                href="https://smartourism.elpeef.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition-colors"
              >
                smartourism.elpeef.com
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
