/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Layers, 
  Leaf, 
  Search, 
  ShieldCheck, 
  Check, 
  ExternalLink, 
  Award,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  SONGKET_MOTIFS_DATA, 
  SONGKET_ANATOMY_PARTS, 
  SONGKET_MATERIALS_DATA, 
  SongketMotifItem,
  SongketAnatomyPart 
} from '../data/songketMotifData';

interface SongketMotifModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAIVision?: () => void;
}

export function SongketMotifModal({
  isOpen,
  onClose,
  onOpenAIVision
}: SongketMotifModalProps) {
  const [activeTab, setActiveTab] = useState<'motifs' | 'anatomy' | 'materials'>('motifs');
  const [selectedMotif, setSelectedMotif] = useState<SongketMotifItem>(SONGKET_MOTIFS_DATA[0]);
  const [selectedAnatomy, setSelectedAnatomy] = useState<SongketAnatomyPart>(SONGKET_ANATOMY_PARTS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredMotifs = SONGKET_MOTIFS_DATA.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.philosophy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[6500] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-5xl bg-[#181412] text-[#f5f2ed] border border-amber-500/30 rounded-[32px] overflow-hidden shadow-2xl z-10 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-amber-900/30 bg-gradient-to-r from-[#241712] via-[#1a120e] to-[#241712] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-amber-400">
                  Ensiklopedi Kriya Adiluhung
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 font-semibold">
                  STC Heritage
                </span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">
                Anatomi & Filosofi Motif Songket Palembang
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 md:px-8 pt-4 pb-2 border-b border-white/5 flex flex-wrap items-center justify-between gap-4 bg-[#14100e] shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('motifs')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'motifs'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Ragam Motif Sakral ({SONGKET_MOTIFS_DATA.length})
            </button>
            <button
              onClick={() => setActiveTab('anatomy')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'anatomy'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Anatomi Sehelai Kain
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'materials'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Bahan Alami & FOLU 2030
            </button>
          </div>

          {onOpenAIVision && (
            <button
              onClick={() => {
                onClose();
                onOpenAIVision();
              }}
              className="px-3.5 py-1.5 bg-[#8b0000]/20 hover:bg-[#8b0000]/40 border border-[#8b0000]/40 rounded-xl text-amber-200 text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles size={13} className="text-amber-400" />
              <span>Inspeksi via AI Songket Vision</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          {/* TAB 1: RAGAM MOTIF */}
          {activeTab === 'motifs' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Motif List */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari motif (Lepus, Nago, Bunga...)"
                    className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60 transition-colors"
                  />
                </div>

                <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                  {filteredMotifs.map((motif) => {
                    const isSelected = selectedMotif.id === motif.id;
                    return (
                      <button
                        key={motif.id}
                        onClick={() => setSelectedMotif(motif)}
                        className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-amber-950/60 to-black/60 border-amber-500/60 shadow-lg'
                            : 'bg-black/20 hover:bg-black/40 border-white/5 hover:border-white/15'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/60 shrink-0 border border-white/10">
                          <img 
                            src={motif.image} 
                            alt={motif.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = 'https://sumeks.disway.id/upload/57bddaacfc0b15cdea1a12ff567fbaea.jpg';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                              {motif.hierarchicalRank.split(' ')[0]}
                            </span>
                            <span className="text-[9px] text-gray-400 font-mono">
                              {motif.goldThreadRatio.split(' ')[0]}
                            </span>
                          </div>
                          <h4 className="font-serif text-sm font-bold text-white truncate">
                            {motif.name}
                          </h4>
                          <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                            {motif.category}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Selected Motif Detail */}
              <div className="lg:col-span-7 bg-black/30 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="w-full sm:w-44 h-44 rounded-2xl overflow-hidden bg-black border border-amber-500/30 shrink-0 shadow-lg relative group">
                    <img 
                      src={selectedMotif.image} 
                      alt={selectedMotif.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                      <span className="text-[9px] font-mono text-amber-300 font-bold">
                        {selectedMotif.weavingComplexity}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        {selectedMotif.hierarchicalRank}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">
                        Kategori: {selectedMotif.category}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-white mb-2">
                      {selectedMotif.name}
                    </h3>

                    <div className="p-3 bg-amber-500/10 border-l-2 border-amber-500 rounded-r-xl">
                      <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-1">
                        Kadar Benang Emas
                      </span>
                      <span className="text-xs font-serif italic text-amber-200">
                        {selectedMotif.goldThreadRatio}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Philosophy */}
                <div className="space-y-2">
                  <h5 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                    <Info size={14} />
                    Filosofi Luhur & Makna Spiritual
                  </h5>
                  <p className="text-sm text-gray-300 leading-relaxed font-sans bg-black/20 p-4 rounded-2xl border border-white/5">
                    {selectedMotif.philosophy}
                  </p>
                </div>

                {/* History & Context */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-black/20 rounded-xl border border-white/5">
                    <span className="text-[10px] font-mono text-gray-400 uppercase font-bold block mb-1">
                      Asal Usul & Sejarah
                    </span>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {selectedMotif.historyAndOrigin}
                    </p>
                  </div>

                  <div className="p-3.5 bg-black/20 rounded-xl border border-white/5">
                    <span className="text-[10px] font-mono text-gray-400 uppercase font-bold block mb-1">
                      Konteks Pemakaian Adat
                    </span>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {selectedMotif.usageContext}
                    </p>
                  </div>
                </div>

                {/* Symbolic Meaning Bullets */}
                <div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase font-bold block mb-2">
                    Nilai Simbolis Karakter:
                  </span>
                  <div className="space-y-1.5">
                    {selectedMotif.symbolicMeaning.map((val, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                        <Check size={13} className="text-amber-400 shrink-0" />
                        <span>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANATOMI SEHELAI KAIN */}
          {activeTab === 'anatomy' && (
            <div className="space-y-8">
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
                Kain songket Palembang tidak hanya selembar kain, melainkan kesatuan kosmos busana berstruktur baku yang sarat filosofi tatanan adat Melayu Palembang.
              </div>

              {/* Anatomy Diagram Simulation */}
              <div className="p-6 bg-black/40 border border-amber-500/30 rounded-3xl relative overflow-hidden">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-4">
                  Visualisasi Struktur Bidang Kain Songket
                </span>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {SONGKET_ANATOMY_PARTS.map((part) => {
                    const isSelected = selectedAnatomy.id === part.id;
                    return (
                      <button
                        key={part.id}
                        onClick={() => setSelectedAnatomy(part)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-gradient-to-b from-amber-900/60 to-black/80 border-amber-500 shadow-lg ring-1 ring-amber-500'
                            : 'bg-black/20 hover:bg-black/30 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="text-[10px] font-mono text-amber-400 font-bold mb-1">
                          {part.palembangTerm}
                        </div>
                        <h4 className="font-serif text-sm font-bold text-white mb-2">
                          {part.name}
                        </h4>
                        <p className="text-[11px] text-gray-400 line-clamp-2">
                          {part.visualPosition}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Anatomy Detail Card */}
              <div className="p-6 md:p-8 bg-black/30 border border-white/10 rounded-3xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                      Istilah Bahasa Palembang: {selectedAnatomy.palembangTerm}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white">
                      {selectedAnatomy.name}
                    </h3>
                  </div>
                  <span className="text-xs text-gray-400 font-mono bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                    {selectedAnatomy.visualPosition}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h5 className="text-xs font-mono uppercase text-amber-400 font-bold">
                      Makna Filosofis & Simbol Adat
                    </h5>
                    <p className="text-sm text-gray-300 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                      {selectedAnatomy.philosophicalSymbol}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-xs font-mono uppercase text-amber-400 font-bold">
                      Teknik Penenunan Tradisional
                    </h5>
                    <p className="text-sm text-gray-300 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                      {selectedAnatomy.technicalDetails}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BAHAN ALAMI & FOLU NET SINK 2030 */}
          {activeTab === 'materials' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed flex items-start gap-3">
                <Leaf size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-300 block mb-1">
                    Komitmen FOLU Net Sink 2030 & Ekologi Kriya Tradisional
                  </strong>
                  Pembuatan songket autentik Palembang sejatinya adalah kriya rendah karbon murni. Penggunaan getah gambir dan serutan kayu secang membebaskan perairan Sungai Musi dari limbah kimia beracun pabrik sintetis modern.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SONGKET_MATERIALS_DATA.map((mat, idx) => (
                  <div key={idx} className="p-5 bg-black/30 border border-white/10 rounded-2xl space-y-3 hover:border-amber-500/30 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-serif text-base font-bold text-white">
                        {mat.name}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full font-bold">
                        {mat.durability}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-gray-300">
                      <div>
                        <span className="font-bold text-gray-400 block font-mono text-[10px] uppercase">
                          Bahan Sumber:
                        </span>
                        {mat.source}
                      </div>

                      <div>
                        <span className="font-bold text-emerald-400 block font-mono text-[10px] uppercase">
                          Karakter Ekologis (Eco-Feature):
                        </span>
                        {mat.ecoFeature}
                      </div>

                      <div>
                        <span className="font-bold text-amber-400 block font-mono text-[10px] uppercase">
                          Pengolahan Tradisional Leluhur:
                        </span>
                        {mat.traditionalPreparation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 md:p-6 border-t border-white/5 bg-[#14100e] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <p className="text-xs text-gray-400">
            Terhubung ke Sentra Tenun Tuan Kentang & Modul Kriptografi STC Multi-Token Standard.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
          >
            Tutup Ensiklopedi
          </button>
        </div>
      </motion.div>
    </div>
  );
}
