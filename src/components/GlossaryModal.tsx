/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  BookOpen, 
  Search, 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  Languages, 
  ArrowRight, 
  ExternalLink,
  HelpCircle,
  Check
} from 'lucide-react';

interface GlossaryItem {
  id: string;
  term: string;
  category: 'blockchain' | 'culture';
  plainTranslation: string; // Terjemahan bahasa awam / bahasa Indonesia baku
  simpleExplanation: string; // Penjelasan santai yang mudah dicerna
  practicalExample: string; // Contoh penerapan di SIGUNTANG
  badges: string[];
}

const GLOSSARY_ITEMS: GlossaryItem[] = [
  // --- KATEGORI 1: ISTILAH BLOCKCHAIN & TEKNOLOGI (DITERJEMAHKAN KE BAHASA AWAM) ---
  {
    id: 'sbt',
    term: 'Soulbound Token (SBT / ERC-5192)',
    category: 'blockchain',
    plainTranslation: 'Piagam / Sertifikat Digital Abadi yang Tidak Bisa Dipalsukan',
    simpleExplanation: 'Sertifikat digital resmi yang terikat selamanya pada pemiliknya. Berbeda dengan uang kripto atau NFT biasa, token ini sama sekali tidak bisa diperjualbelikan atau dipindahkan ke orang lain. Fungsinya murni sebagai bukti tanda penghargaan dan reputasi asli.',
    practicalExample: 'Wisatawan yang mengunjungi Bukit Siguntang atau Jembatan Ampera mendapatkan SBT Proof-of-Visit sebagai tanda kehormatan digital.',
    badges: ['Web3', 'Identitas Digital', 'Anti-Palsu']
  },
  {
    id: 'stc',
    term: 'Smart Tourism Chain (STC)',
    category: 'blockchain',
    plainTranslation: 'Buku Catatan Sejarah & Wisata Bersama yang Anti-Manipulasi',
    simpleExplanation: 'Sistem pencatatan digital terdistribusi yang dijaga bersama oleh kampus, komunitas sejarawan, dan pemerintah. Data di dalamnya tidak bisa diedit atau dihapus sepihak oleh admin mana pun, sehingga catatan cagar budaya aman dari rekayasa.',
    practicalExample: 'Seluruh silsilah prasasti dan registrasi perahu ketek dicatat permanen di jaringan blockchain STC.',
    badges: ['Infrastruktur', 'Transparansi', 'Riset']
  },
  {
    id: 'traceability',
    term: 'Traceability Ledger (Kelacakgalian)',
    category: 'blockchain',
    plainTranslation: 'Buku Silsilah Asal-Usul & Garansi Keaslian Karya Adat',
    simpleExplanation: 'Rantai pembuktian jejak karya dari awal dibuat hingga sampai ke tangan Anda. Menjamin bahwa karya kerajinan adalah 100% tenun tangan asli seniman lokal, bukan produk pabrikan tiruan murah.',
    practicalExample: 'Setiap lembar kain Songket Tuan Kentang memiliki nomor seri silsilah digital yang membuktikan nama penenun aslinya.',
    badges: ['Perlindungan Kriya', 'Otentisitas', 'UMKM']
  },
  {
    id: 'zero-leakage-escrow',
    term: 'Zero-Leakage Escrow (Donasi Tanpa Calo)',
    category: 'blockchain',
    plainTranslation: 'Kotak Amal Budaya Langsung ke Tangan Pengelola Situs',
    simpleExplanation: 'Jalur donasi digital langsung tanpa potongan pihak ketiga atau biaya calo tersembunyi. Donatur bisa melihat ke mana 100% uangnya disalurkan secara transparan dan terbuka untuk umum.',
    practicalExample: 'Donasi pemeliharaan klenteng Pulau Kemaro langsung diterima kas pelestari situs secara otomatis.',
    badges: ['Donasi', 'Bebas Potongan', 'Audit Terbuka']
  },
  {
    id: 'carbonprint',
    term: 'STC CarbonPrint Protocol',
    category: 'blockchain',
    plainTranslation: 'Penghitung Jejak Emisi Wisata & Aksi Tanam Pohon Sungai',
    simpleExplanation: 'Alat ukur cerdas yang menghitung kadar emisi bahan bakar selama Anda berwisata di Sungai Musi, sekaligus memberi rekomendasi penebusan lingkungan (eco-offset) seperti menanam pohon pelindung sungai.',
    practicalExample: 'Setiap pelayaran perahu ketek dihitung jejak emisinya (misal: 2.5 kg CO₂) dan diimbangi penanaman bibit pohon nipah di delta Pulau Kemaro.',
    badges: ['Wisata Hijau', 'Lingkungan', 'Eco-Offset']
  },
  {
    id: 'phygital-iot',
    term: 'Phygital IoT Gateway (Sensor Dermaga ESP32)',
    category: 'blockchain',
    plainTranslation: 'Dermaga Pintar: Sentuhan Perahu Langsung Mencatat Kunjungan',
    simpleExplanation: 'Peralatan sensor fisik di dermaga yang saat tersentuh oleh perahu ketek kayu, langsung mencatat kedatangan wisatawan ke catatan digital secara otomatis tanpa perlu tiket kertas manual.',
    practicalExample: 'Dermaga Point Benteng Kuto Besak terhubung ke sensor mikrokontroler ESP32 yang mendeteksi labuh perahu.',
    badges: ['Perangkat Keras', 'Otomatisasi', 'Digital Twin']
  },
  {
    id: 'ai-curator',
    term: 'Context-Aware AI Curator',
    category: 'blockchain',
    plainTranslation: 'Pemandu Sejarah Digital Cerdas di Objek 3D',
    simpleExplanation: 'Asisten pintar buatan (AI) yang langsung mengenali objek sejarah yang Anda klik di Diorama 3D, membeberkan fakta arkeologis dan cerita rahasianya tanpa Anda perlu mengetik pertanyaan panjang.',
    practicalExample: 'Klik Jembatan Ampera di diorama 3D, lalu tekan "Bedah Sejarah", AI Curator langsung menjelaskan sejarah maritimnya.',
    badges: ['Kecerdasan Buatan', 'Diorama 3D', 'Edukasi']
  },

  // --- KATEGORI 2: BAHASA DAERAH PALEMBANG & MELAYU KUNO (DITERJEMAHKAN KE BAHASA INDONESIA) ---
  {
    id: 'ketek',
    term: 'Perahu Ketek',
    category: 'culture',
    plainTranslation: 'Perahu Motor Tradisional Khas Sungai Musi',
    simpleExplanation: 'Perahu kayu bermesin tempel khas Palembang dengan bunyi khas "tek-tek-tek". Menjadi urat nadi penghubung kampung-kampung terapung di sepanjang 750 km aliran Sungai Musi.',
    practicalExample: 'Moda transportasi utama dari Dermaga Benteng Kuto Besak menuju Pulau Kemaro atau Seberang Ulu.',
    badges: ['Bahasa Palembang', 'Transportasi Air', 'Kearifan Lokal']
  },
  {
    id: 'limas',
    term: 'Rumah Limas',
    category: 'culture',
    plainTranslation: 'Rumah Panggung Tradisional Bertingkat Khas Palembang',
    simpleExplanation: 'Rumah adat kayu ulin beratap limas dengan lantai berundak (disebut "kekijing") yang melambangkan penghormatan adat dan tata krama bertamu masyarakat Palembang.',
    practicalExample: 'Dapat dijumpai utuh dan terawat hingga berusia lebih dari 300 tahun di Kampung Arab Al-Munawar 13 Ulu.',
    badges: ['Arsitektur Adat', 'Cagar Budaya', 'Seberang Ulu']
  },
  {
    id: 'songket-lepus',
    term: 'Songket Lepus / Tuan Kentang',
    category: 'culture',
    plainTranslation: 'Kain Tenun Mewah Berlapis Benang Emas Penuh',
    simpleExplanation: 'Kasta tertinggi kain songket Palembang peninggalan kemaharajaan Sriwijaya dan Kesultanan, di mana benang emas ditenun hampir menutupi seluruh bidang kain sutra secara manual.',
    practicalExample: 'Diproduksi secara turun-temurun oleh para penenun terampil di Kampung Tuan Kentang, Seberang Ulu I.',
    badges: ['Wastra Nusantara', 'Kriya Bernilai Tinggi', 'Tenun Tangan']
  },
  {
    id: 'dapunta-hyang',
    term: 'Dapunta Hyaṅ',
    category: 'culture',
    plainTranslation: 'Gelar Baginda Raja Agung Pendiri Kemaharajaan Sriwijaya',
    simpleExplanation: 'Gelar kehormatan untuk raja pendiri kedatuan Sriwijaya abad ke-7 (Dapunta Hyang Sri Jayanasa) yang memimpin ekspedisi maritim menyatukan Nusantara dari tepi Sungai Musi.',
    practicalExample: 'Tertulis abadi pada Prasasti Kedukan Bukit berangka tahun 683 Masehi yang ditemukan di Palembang.',
    badges: ['Melayu Kuno Abad 7', 'Sejarah Sriwijaya', 'Filologi']
  },
  {
    id: 'samvau',
    term: 'Samvau (Sambau)',
    category: 'culture',
    plainTranslation: 'Perahu Layar / Kapal Penjelajah Samudra Kuno',
    simpleExplanation: 'Istilah dalam bahasa Melayu Kuna abad ke-7 untuk menyebut perahu besar atau kapal layar bercadik yang digunakan para pelaut Sriwijaya berlayar mengarungi samudra.',
    practicalExample: 'Kutipan Prasasti: "Dāpūnta hyaŋ nāyik di sāmvau maṅalap siddhayātra" (Baginda naik perahu membawa misi suci kemakmuran).',
    badges: ['Bahasa Kuno', 'Maritim', 'Prasasti']
  },
  {
    id: 'siddhayatra',
    term: 'Siddhayātra',
    category: 'culture',
    plainTranslation: 'Perjalanan Suci yang Membawa Berkah, Kemenangan, dan Kesaktian',
    simpleExplanation: 'Perjalanan ziarah spiritual atau ekspedisi militer suci yang bertujuan membawa keselamatan, kedamaian, dan kemakmuran bagi seluruh rakyat negeri.',
    practicalExample: 'Kini diadaptasi dalam SIGUNTANG sebagai perjalanan pelestarian budaya bagi setiap pengunjung.',
    badges: ['Filosofi Kuno', 'Spiritualitas', 'Peradaban']
  },
  {
    id: 'sapatha',
    term: 'Sapatha (Sumpah)',
    category: 'culture',
    plainTranslation: 'Sumpah Perlindungan / Peringatan Kutukan Penjaga Pusaka',
    simpleExplanation: 'Formula sumpah keramat yang dipahat para leluhur pada batu prasasti, berisi doa keberkahan bagi pelindung negeri dan peringatan keras bagi siapa pun yang berbuat khianat merusak alam dan sungai.',
    practicalExample: 'Dihasilkan oleh fitur Generator Prasasti Digital SIGUNTANG untuk mengabadikan komitmen pelestarian budaya.',
    badges: ['Epigrafi', 'Ikrar Budaya', 'Hukum Adat']
  },
  {
    id: 'antu-banyu',
    term: 'Antu Banyu',
    category: 'culture',
    plainTranslation: 'Cerita Rakyat Sosok Penjaga Palung Dalam Sungai Musi',
    simpleExplanation: 'Cerita tutur lisan legendaris masyarakat Palembang tentang sosok misterius penghuni pusaran air keruh Sungai Musi. Mitos ini berfungsi sebagai pesan kearifan lokal agar anak-anak tidak berenang sembarangan di palung sungai yang berbahaya.',
    practicalExample: 'Dapat dieksplorasi secara sinematik dalam Ekspedisi Diorama Musi Cruise di dekat Jembatan Ampera.',
    badges: ['Folklore Palembang', 'Tutur Lisan', 'Mitologi']
  }
];

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'all' | 'blockchain' | 'culture';
}

export function GlossaryModal({ isOpen, onClose, initialTab = 'all' }: GlossaryModalProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'blockchain' | 'culture'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredItems = GLOSSARY_ITEMS.filter(item => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const matchesSearch = 
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.plainTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.simpleExplanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badges.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative w-full max-w-4xl bg-[#fbf9f6] text-[#1a1a1a] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-black/10"
        >
          {/* Header */}
          <div className="px-6 sm:px-8 py-5 border-b border-black/10 bg-white flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#8b0000] text-white flex items-center justify-center shadow-md shadow-[#8b0000]/20 shrink-0">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1a1a1a] flex items-center gap-2">
                  Kamus Istilah Budaya & Teknologi
                  <span className="text-[10px] bg-amber-500/15 text-amber-900 border border-amber-500/30 font-sans font-bold px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline">
                    Bahasa Awam
                  </span>
                </h3>
                <p className="text-xs text-stone-500">
                  Terjemahan istilah teknis blockchain dan kosakata daerah Palembang / Melayu Kuna ke bahasa yang mudah dimengerti
                </p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="p-2.5 rounded-xl hover:bg-black/5 text-gray-500 hover:text-black transition-colors cursor-pointer shrink-0"
              aria-label="Tutup Kamus"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search & Tabs Controls */}
          <div className="p-4 sm:p-6 bg-white/70 border-b border-black/5 space-y-4 shrink-0">
            {/* Search Input */}
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari istilah... (contoh: SBT, Ketek, Songket, Escrow, Samvau, Dapunta)"
                className="w-full pl-11 pr-4 py-3 bg-[#f5f2ed] border border-black/10 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8b0000]/20 transition-all placeholder-stone-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-black p-1 text-xs"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-[#8b0000] text-white shadow-sm'
                    : 'bg-stone-200/70 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Semua Istilah ({GLOSSARY_ITEMS.length})
              </button>
              <button
                onClick={() => setActiveTab('blockchain')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'blockchain'
                    ? 'bg-[#8b0000] text-white shadow-sm'
                    : 'bg-stone-200/70 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Cpu size={14} />
                Istilah Teknologi ➔ Bahasa Awam
              </button>
              <button
                onClick={() => setActiveTab('culture')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'culture'
                    ? 'bg-[#8b0000] text-white shadow-sm'
                    : 'bg-stone-200/70 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Languages size={14} />
                Bahasa Daerah / Kuno ➔ Bahasa Indonesia
              </button>
            </div>
          </div>

          {/* Glossary Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#fbf9f6]">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 text-stone-400">
                <HelpCircle size={36} className="mx-auto mb-2 opacity-40" />
                <p className="font-serif text-base font-bold text-stone-600">Istilah tidak ditemukan</p>
                <p className="text-xs text-stone-500 mt-1">Coba gunakan kata kunci lain seperti "SBT", "Ketek", atau "Songket".</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-5 bg-white rounded-2xl border border-black/5 hover:border-[#8b0000]/30 transition-all shadow-xs space-y-2.5"
                >
                  {/* Top Bar: Term and Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-serif text-base sm:text-lg font-bold text-[#8b0000]">
                      {item.term}
                    </h4>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        item.category === 'blockchain' 
                          ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {item.category === 'blockchain' ? 'Teknologi & Web3' : 'Budaya & Daerah'}
                      </span>
                    </div>
                  </div>

                  {/* Plain Translation Banner */}
                  <div className="p-3 bg-[#f5f2ed] rounded-xl border border-black/5 flex items-start gap-2.5">
                    <ArrowRight size={16} className="text-[#8b0000] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-stone-400 block tracking-wider">
                        {item.category === 'blockchain' ? 'Bahasa Orang Awam (Artinya):' : 'Bahasa Indonesia Baku:'}
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                        {item.plainTranslation}
                      </p>
                    </div>
                  </div>

                  {/* Simple Explanation */}
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {item.simpleExplanation}
                  </p>

                  {/* Practical Example in SIGUNTANG */}
                  <div className="pt-2 border-t border-black/5 flex items-start gap-2 text-xs text-stone-500">
                    <Sparkles size={13} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed">
                      <strong className="text-stone-700">Contoh di SIGUNTANG:</strong> {item.practicalExample}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Note */}
          <div className="px-6 py-3.5 bg-stone-100 border-t border-black/5 flex flex-wrap items-center justify-between text-xs text-stone-500 shrink-0">
            <span>Disusun untuk mempermudah komunikasi ke pemda, tetua adat, dan wisatawan.</span>
            <span className="font-mono text-[10px] text-stone-400">Riset Disertasi Dr. Akhmad Khudri</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
