/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Shield, 
  FileText, 
  Database, 
  GitBranch, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Layers, 
  Lock, 
  Scale, 
  ArrowRight,
  BookOpen,
  EyeOff,
  Cpu,
  History,
  Info
} from 'lucide-react';

export type LegalTab = 'protocol' | 'sovereignty' | 'governance';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
  onOpenSTCEcosystem?: () => void;
}

export function LegalModal({ isOpen, onClose, initialTab = 'protocol', onOpenSTCEcosystem }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[6500] flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl bg-[#fbf9f6] text-[#1a1a1a] rounded-3xl md:rounded-[36px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-black/10"
        >
          {/* Header */}
          <div className="px-6 sm:px-8 py-5 border-b border-black/10 bg-white flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#8b0000] text-white flex items-center justify-center shadow-md shadow-[#8b0000]/20">
                <Scale size={20} />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1a1a1a]">
                  Protokol & Tata Kelola SIGUNTANG
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-[#8b0000] font-bold">
                  Proposed Framework • Technical & Heritage Stewardship
                </p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 text-gray-700 flex items-center justify-center transition-colors"
              aria-label="Tutup"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-black/10 bg-white/60 px-4 sm:px-8 gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('protocol')}
              className={`py-3.5 px-4 font-sans text-xs uppercase tracking-widest font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'protocol'
                  ? 'border-[#8b0000] text-[#8b0000]'
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
            >
              <Cpu size={15} />
              STC Protocol & Technical Overview
            </button>

            <button
              onClick={() => setActiveTab('sovereignty')}
              className={`py-3.5 px-4 font-sans text-xs uppercase tracking-widest font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'sovereignty'
                  ? 'border-[#8b0000] text-[#8b0000]'
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
            >
              <Lock size={15} />
              Data Sovereignty & Heritage Data
            </button>

            <button
              onClick={() => setActiveTab('governance')}
              className={`py-3.5 px-4 font-sans text-xs uppercase tracking-widest font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'governance'
                  ? 'border-[#8b0000] text-[#8b0000]'
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
            >
              <Users size={15} />
              Governance & Community Stewardship
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 no-scrollbar text-sm leading-relaxed">
            
            {/* 1. STC PROTOCOL */}
            {activeTab === 'protocol' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8b0000] bg-[#8b0000]/10 px-3 py-1 rounded-full">
                    Technical Architecture Document
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-3 text-[#1a1a1a]">
                    STC Protocol & Technical Overview
                  </h2>
                  <p className="text-gray-600 mt-2 text-sm sm:text-base">
                    Dokumentasi arsitektur teknis sistem SIGUNTANG yang menghubungkan antarmuka interaktif dengan fondasi pencatatan terdistribusi Smart Tourism Chain (STC). Ditujukan untuk peneliti, dosen, developer, dan mitra teknis.
                  </p>
                </div>

                {/* Arsitektur Dual Layer Box */}
                <div className="bg-white p-6 rounded-2xl border border-black/10 shadow-sm space-y-4">
                  <h4 className="font-serif text-lg font-bold flex items-center gap-2 text-[#1a1a1a]">
                    <Layers className="text-[#8b0000]" size={18} />
                    Arsitektur Dual-Layer: Experience & Trust
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    SIGUNTANG memisahkan secara tegas antara lapisan pengalaman pengguna (*Experience Layer*) dengan lapisan integritas data (*Trust Layer*).
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                    {/* Experience Layer */}
                    <div className="p-4 rounded-xl bg-[#f5f2ed] border border-black/5">
                      <div className="flex items-center gap-2 text-[#8b0000] font-bold text-xs uppercase tracking-wider mb-2">
                        <BookOpen size={14} />
                        Experience Layer
                      </div>
                      <ul className="text-xs text-gray-700 space-y-2">
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#8b0000] font-bold">•</span>
                          <span><strong>Heritage Explorer:</strong> Direktori simpul budaya Palembang dengan filter kategori dan narasi.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#8b0000] font-bold">•</span>
                          <span><strong>Heritage Map / GIS:</strong> Peta interaktif koordinat spasial simpul budaya.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#8b0000] font-bold">•</span>
                          <span><strong>AI Cultural Guide:</strong> Panduan interaktif cerdas multimodal berbasis Gemini 2.5.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#8b0000] font-bold">•</span>
                          <span><strong>Musi Cruise 3D Diorama:</strong> Simulasi visual pelayaran sungai dan folklore.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Trust Layer */}
                    <div className="p-4 rounded-xl bg-[#1a1a1a] text-white">
                      <div className="flex items-center gap-2 text-[#f5f2ed] font-bold text-xs uppercase tracking-wider mb-2">
                        <Shield className="text-[#8b0000]" size={14} />
                        Trust Layer (STC)
                      </div>
                      <ul className="text-xs text-gray-300 space-y-2">
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#8b0000] font-bold">•</span>
                          <span><strong>Smart Contracts (EVM):</strong> Registry node, log transaksi donasi, dan sertifikat orisinalitas UMKM.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#8b0000] font-bold">•</span>
                          <span><strong>Digital Traceability:</strong> Hash SHA-256 ringkasan metadata artefak untuk mencegah pemalsuan narasi.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#8b0000] font-bold">•</span>
                          <span><strong>Verification Mechanism:</strong> Audit trail publik yang dapat diuji silang melalui explorer.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Conceptual Hierarchy Diagram */}
                <div className="bg-[#1f1e1d] text-white p-5 rounded-2xl font-mono text-xs">
                  <div className="text-gray-400 mb-2">// Struktur Hirarki Arsitektur Sistem</div>
                  <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-400">
{`SIGUNTANG
    │
    ├── Experience Layer (Client-Side)
    │     ├── Heritage Explorer & Katalog
    │     ├── Heritage Map / GIS Visualizer
    │     ├── Musi Folklore 3D Diorama
    │     └── AI Cultural Guide (Gemini 2.5 Flash)
    │
    └── Trust Layer (Smart Tourism Chain)
          ├── Smart Contract Registry (Node & Wastra UMKM)
          ├── Digital Traceability (SHA-256 State Hashing)
          └── Public Verification Mechanism`}
                  </pre>
                </div>

                {/* Alur Data */}
                <div className="bg-white p-6 rounded-2xl border border-black/10 shadow-sm space-y-3">
                  <h4 className="font-serif text-lg font-bold text-[#1a1a1a]">
                    Diagram Alur Data: Dari Aplikasi ke Ledger
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center pt-2">
                    <div className="p-3 bg-gray-50 rounded-xl border border-black/5">
                      <span className="text-[10px] font-bold text-[#8b0000] uppercase block mb-1">Tahap 1</span>
                      <p className="text-xs font-semibold">Input Data & Kurasi</p>
                      <p className="text-[10px] text-gray-500 mt-1">Input narasi, kunjungan, atau donasi diverifikasi kurator</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-black/5">
                      <span className="text-[10px] font-bold text-[#8b0000] uppercase block mb-1">Tahap 2</span>
                      <p className="text-xs font-semibold">Metadata Hashing</p>
                      <p className="text-[10px] text-gray-500 mt-1">Ekstraksi digest SHA-256 dari payload & timestamp waktu</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-black/5">
                      <span className="text-[10px] font-bold text-[#8b0000] uppercase block mb-1">Tahap 3</span>
                      <p className="text-xs font-semibold">Smart Contract Call</p>
                      <p className="text-[10px] text-gray-500 mt-1">Eksekusi kontrak EVM via Web3 provider terautentikasi</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-black/5">
                      <span className="text-[10px] font-bold text-[#8b0000] uppercase block mb-1">Tahap 4</span>
                      <p className="text-xs font-semibold">Audit Publik</p>
                      <p className="text-[10px] text-gray-500 mt-1">Diverifikasi terbuka oleh masyarakat & sejarawan</p>
                    </div>
                  </div>
                </div>

                {/* Status Implementasi */}
                <div className="bg-amber-50/70 border border-amber-200/80 p-5 rounded-2xl">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-amber-900 mb-2 flex items-center gap-2">
                    <Info size={16} />
                    Status Implementasi Komponen (Transparansi Teknis)
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3 text-xs text-amber-950">
                    <div className="flex items-center justify-between p-2.5 bg-white/70 rounded-lg">
                      <span>Experience Layer (GIS, Diorama, Explorer)</span>
                      <span className="text-emerald-700 font-bold font-mono text-[10px] bg-emerald-100 px-2 py-0.5 rounded">Production Ready</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-white/70 rounded-lg">
                      <span>AI Cultural Guide (Gemini 2.5 Flash)</span>
                      <span className="text-emerald-700 font-bold font-mono text-[10px] bg-emerald-100 px-2 py-0.5 rounded">Live & Connected</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-white/70 rounded-lg">
                      <span>EVM Smart Contract Testbed</span>
                      <span className="text-blue-700 font-bold font-mono text-[10px] bg-blue-100 px-2 py-0.5 rounded">Implemented (Testnet)</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-white/70 rounded-lg">
                      <span>Konsorsium Validator Institusional</span>
                      <span className="text-amber-700 font-bold font-mono text-[10px] bg-amber-100 px-2 py-0.5 rounded">Proposed Framework</span>
                    </div>
                  </div>
                </div>

                {/* Hubungan dengan Disertasi Doktor STC (12 Modul) */}
                <div className="bg-[#1a1a1a] text-white p-6 rounded-2xl border border-white/10 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between gap-3 flex-wrap border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#8b0000] text-white flex items-center justify-center font-serif font-bold text-sm">
                        STC
                      </div>
                      <div>
                        <h4 className="font-serif text-base font-bold text-white">
                          Landasan Riset Disertasi: Smart Tourism Chain (STC)
                        </h4>
                        <p className="text-[10px] text-[#ff4d4d] font-mono uppercase tracking-wider font-semibold">
                          Universitas Sriwijaya • 12 Modul Ekosistem Terpadu
                        </p>
                      </div>
                    </div>
                    {onOpenSTCEcosystem && (
                      <button
                        onClick={onOpenSTCEcosystem}
                        className="px-4 py-2 bg-[#8b0000] hover:bg-[#a00000] text-white font-sans text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md shadow-[#8b0000]/30"
                      >
                        <Layers size={14} />
                        Buka Showcase 12 Modul
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    SIGUNTANG bukanlah aplikasi terisolasi, melainkan implementasi simpul budaya perdana dari kerangka kerja <strong>Smart Tourism Chain (STC)</strong>. STC diciptakan dari penelitian disertasi doktoral yang memetakan solusi menyeluruh pariwisata berbasis Web3:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="font-bold text-[#ff4d4d] block mb-1">1. Gas & Security Engine</span>
                      <p className="text-gray-400 text-[11px]">
                        <strong>STC Analytics</strong>, <strong>STC GasVision</strong> (konversi gas testnet ke Rupiah), <strong>STC Converter</strong> (parser Mythril/Slither), dan <strong>STC Bench</strong>.
                      </p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="font-bold text-emerald-400 block mb-1">2. Sustainable Tourism & Carbon</span>
                      <p className="text-gray-400 text-[11px]">
                        <strong>STC CarbonPrint</strong> (penerjemah gas fee ke emisi karbon riil & target <em>FOLU Net Sink 2030</em>) dan <strong>STC ImpactViz</strong> (Triple Bottom Line).
                      </p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="font-bold text-blue-400 block mb-1">3. Middleware & Gateway</span>
                      <p className="text-gray-400 text-[11px]">
                        <strong>STC Connect</strong> (API perantara IoT & blockchain) serta <strong>STC Ultimate</strong> (mesin escrow & ticketing end-to-end).
                      </p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="font-bold text-amber-400 block mb-1">4. Trust, SSI & Tourism Analytics</span>
                      <p className="text-gray-400 text-[11px]">
                        <strong>KYC by STC</strong> (Self-Sovereign Identity pengrajin/pemandu), <strong>AudiTour</strong> (audit jejak perjalanan), dan <strong>STC Insight</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. DATA SOVEREIGNTY */}
            {activeTab === 'sovereignty' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8b0000] bg-[#8b0000]/10 px-3 py-1 rounded-full">
                    Cultural Integrity & Ethics
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-3 text-[#1a1a1a]">
                    Data Sovereignty & Heritage Data
                  </h2>
                  <p className="text-gray-600 mt-2 text-sm sm:text-base">
                    Prinsip kedaulatan data budaya: Menempatkan pemilik asli kebudayaan, pengelola situs, dan komunitas lokal sebagai pemegang otoritas tertinggi, bukan sekadar komoditas digital.
                  </p>
                </div>

                {/* Key Philosophy Banner */}
                <div className="p-5 rounded-2xl bg-[#8b0000]/10 border-l-4 border-[#8b0000] text-gray-800">
                  <p className="font-serif italic text-base sm:text-lg text-[#1a1a1a] mb-2">
                    “Pencatatan digital tidak otomatis menjadikan sebuah narasi sejarah mutlak benar. Sumber primer, etika kurasi, dan ruang koreksi ilmiah tetap merupakan fondasi utama.”
                  </p>
                  <p className="text-xs text-gray-600">
                    Blockchain di SIGUNTANG tidak dimaksudkan untuk mengunci dogma narasi, melainkan memberikan <em>audit trail</em> transparan atas siapa yang mencatat, kapan dicatat, dan rujukan naskah apa yang digunakan.
                  </p>
                </div>

                {/* 4 Pillars of Data Sovereignty */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-sm space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-[#8b0000]/10 text-[#8b0000] flex items-center justify-center font-bold">
                      1
                    </div>
                    <h4 className="font-serif font-bold text-base text-[#1a1a1a]">
                      Otoritas Pengelola Informasi Budaya
                    </h4>
                    <p className="text-xs text-gray-600">
                      Informasi resmi situs dikelola bersama oleh pengelola situs cagar budaya fisik (seperti Taman Purbakala Kerajaan Sriwijaya, Benteng Kuto Besak), komunitas tetua adat (Kampung Kapitan, Al-Munawar), dan Balai Pelestarian Kebudayaan.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-sm space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-[#8b0000]/10 text-[#8b0000] flex items-center justify-center font-bold">
                      2
                    </div>
                    <h4 className="font-serif font-bold text-base text-[#1a1a1a]">
                      Provenance & Asal-Usul Informasi
                    </h4>
                    <p className="text-xs text-gray-600">
                      Setiap simpul informasi budaya dilengkapi metadata asal-usul (provenance): manuskrip rujukan, nama sejarawan atau juru kunci yang diwawancarai, serta tingkat kepastian data arkeologis.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-sm space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-[#8b0000]/10 text-[#8b0000] flex items-center justify-center font-bold">
                      3
                    </div>
                    <h4 className="font-serif font-bold text-base text-[#1a1a1a]">
                      Mekanisme Koreksi Sejarah (Addendum)
                    </h4>
                    <p className="text-xs text-gray-600">
                      Sejarah bersifat dinamis berdasarkan temuan prasasti atau riset baru. Ketika koreksi diajukan dan divalidasi akademisi, sistem mencatat versi pembaruan (<em>versioned addendum</em>) tanpa menghapus histori evolusi penulisan sejarah sebelumnya.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-sm space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-[#8b0000]/10 text-[#8b0000] flex items-center justify-center font-bold">
                      4
                    </div>
                    <h4 className="font-serif font-bold text-base text-[#1a1a1a]">
                      Perlindungan Informasi Sakral & Privat
                    </h4>
                    <p className="text-xs text-gray-600">
                      SIGUNTANG menerapkan prinsip kehati-hatian: informasi ritual sakral tertentu, artefak pusaka internal keluarga, atau titik koordinat temuan bawah air Sungai Musi yang rawan penjarahan ilegal (looting) tidak dipublikasikan secara terbuka tanpa perlindungan.
                    </p>
                  </div>
                </div>

                {/* Komunitas sebagai Subjek */}
                <div className="bg-white p-5 rounded-2xl border border-black/10 space-y-2">
                  <h4 className="font-serif font-bold text-sm text-[#1a1a1a] flex items-center gap-2">
                    <Users size={16} className="text-[#8b0000]" />
                    Pelibatan Komunitas Pengrajin & Wastra Lokal
                  </h4>
                  <p className="text-xs text-gray-600">
                    Bagi pengrajin Songket Tuan Kentang dan UMKM kriya Palembang, sertifikat digital HAKI di dalam protokol STC berfungsi memperkuat orisinalitas karya asli mereka dari plagiasi industri mesin massal, di mana hak cipta dan nilai ekonomi tetap berada di tangan pengrajin.
                  </p>
                </div>
              </div>
            )}

            {/* 3. GOVERNANCE */}
            {activeTab === 'governance' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8b0000] bg-[#8b0000]/10 px-3 py-1 rounded-full">
                    Proposed Governance Framework
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-3 text-[#1a1a1a]">
                    Governance & Community Stewardship
                  </h2>
                  <p className="text-gray-600 mt-2 text-sm sm:text-base">
                    Kerangka tata kelola partisipatif yang diusulkan untuk menjaga keseimbangan antara inovasi teknologi dan integritas warisan budaya Sriwijaya.
                  </p>
                </div>

                {/* Important Disclaimer Note */}
                <div className="p-4 rounded-2xl bg-gray-100 border border-black/10 flex items-start gap-3">
                  <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                  <div className="text-xs text-gray-700">
                    <strong className="text-black block mb-0.5">Catatan Integritas Publik:</strong>
                    SIGUNTANG saat ini mengusulkan kerangka kerja (*Proposed Governance Framework*) dan tidak mengklaim telah membentuk konsorsium formal sebelum MoU resmi dengan para pemangku kepentingan disahkan.
                  </div>
                </div>

                {/* 4 Pilar Pemangku Kepentingan */}
                <div className="bg-white p-6 rounded-2xl border border-black/10 shadow-sm space-y-4">
                  <h4 className="font-serif text-lg font-bold text-[#1a1a1a]">
                    Model Konsorsium Multipihak (Proposed Framework)
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gray-50 border border-black/5">
                      <span className="text-[10px] font-bold text-[#8b0000] uppercase tracking-wider block mb-1">Pilar 1</span>
                      <h5 className="font-bold text-sm text-[#1a1a1a]">Akademisi & Peneliti</h5>
                      <p className="text-xs text-gray-500 mt-1">
                        Pihak universitas dan periset sejarah bertindak sebagai evaluator metodologi historiografi dan audit keaslian literatur ilmiah.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50 border border-black/5">
                      <span className="text-[10px] font-bold text-[#8b0000] uppercase tracking-wider block mb-1">Pilar 2</span>
                      <h5 className="font-bold text-sm text-[#1a1a1a]">Pengelola Situs & Balai Pelestarian</h5>
                      <p className="text-xs text-gray-500 mt-1">
                        Balai Pelestarian Kebudayaan (BPK) dan pengelola museum/situs mengawasi zonasi cagar budaya dan kepatuhan undang-undang pelestarian.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50 border border-black/5">
                      <span className="text-[10px] font-bold text-[#8b0000] uppercase tracking-wider block mb-1">Pilar 3</span>
                      <h5 className="font-bold text-sm text-[#1a1a1a]">Komunitas Adat & Budayawan</h5>
                      <p className="text-xs text-gray-500 mt-1">
                        Tetua kampung sejarah, budayawan Palembang, dan maestro kriya menjaga tradisi lisan, keaslian motif songket, dan kearifan lokal.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50 border border-black/5">
                      <span className="text-[10px] font-bold text-[#8b0000] uppercase tracking-wider block mb-1">Pilar 4</span>
                      <h5 className="font-bold text-sm text-[#1a1a1a]">Pemerintah & Dinas Terkait</h5>
                      <p className="text-xs text-gray-500 mt-1">
                        Dinas Pariwisata dan Kebudayaan Kota Palembang memfasilitasi promosi pariwisata bertanggung jawab dan perlindungan aset kota.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mekanisme Koreksi */}
                <div className="bg-white p-6 rounded-2xl border border-black/10 shadow-sm space-y-3">
                  <h4 className="font-serif text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
                    <History size={18} className="text-[#8b0000]" />
                    Mekanisme Pengajuan Koreksi & Masukan Publik
                  </h4>
                  <p className="text-xs text-gray-600">
                    Jika pengunjung, peneliti, atau keluarga cagar budaya menemukan inkonsistensi narasi atau data histori yang perlu diperbaiki:
                  </p>
                  <ol className="text-xs text-gray-700 space-y-2 list-decimal list-inside pl-1">
                    <li>Pengajuan melalui kanal resmi SIGUNTANG disertai bukti naskah primer atau dokumen sejarah terkait.</li>
                    <li>Peninjauan oleh tim riset kuratorial akademis dalam waktu maksimal 14 hari kerja.</li>
                    <li>Pembaruan metadata narasi dengan penerbitan nomor referensi addendum terverifikasi di blockchain STC.</li>
                  </ol>
                </div>

                {/* Roadmap Tata Kelola */}
                <div className="bg-white p-6 rounded-2xl border border-black/10 shadow-sm space-y-3">
                  <h4 className="font-serif text-lg font-bold text-[#1a1a1a]">
                    Roadmap Tata Kelola Bertahap
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div>
                        <strong>Fase 1 (Saat ini):</strong> Riset akademis, penyusunan rancangan arsitektur STC, dan peluncuran prototipe interaktif SIGUNTANG.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <div>
                        <strong>Fase 2:</strong> Dialog kuratorial terfokus dengan budayawan Palembang, pengrajin songket, dan pengelola museum.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <div>
                        <strong>Fase 3:</strong> Pembentukan dewan kuratorial multipihak resmi dan penetapan node validator institusi.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer of Modal */}
          <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <span>SIGUNTANG Heritage Trust Framework • Universitas Sriwijaya</span>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#1a1a1a] text-white hover:bg-black rounded-xl text-xs font-bold transition-colors w-full sm:w-auto"
            >
              Tutup Ringkasan
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
