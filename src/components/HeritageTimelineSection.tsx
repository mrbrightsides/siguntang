/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scroll, 
  Sparkles, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  ChevronRight, 
  Clock, 
  BookOpen, 
  Compass, 
  Layers, 
  ArrowRight,
  Award
} from 'lucide-react';
import { HERITAGE_TIMELINE_DATA, HeritageTimelineEra } from '../data/heritageTimelineData';
import { useLanguage } from '../context/LanguageContext';

interface HeritageTimelineSectionProps {
  onSelectNodeByName?: (nodeName: string) => void;
  onOpenQuiz?: () => void;
  onOpenSongketModal?: () => void;
}

export function HeritageTimelineSection({
  onSelectNodeByName,
  onOpenQuiz,
  onOpenSongketModal
}: HeritageTimelineSectionProps) {
  const { t, language } = useLanguage();
  const [selectedEraIndex, setSelectedEraIndex] = useState(0);

  const currentEra = HERITAGE_TIMELINE_DATA[selectedEraIndex];

  return (
    <section id="heritage-timeline" className="py-24 bg-[#141210] text-[#f5f2ed] relative overflow-hidden border-t border-b border-amber-900/30">
      {/* Decorative Traditional Motif Background Watermark */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#8b0000]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4">
              <Scroll size={13} className="text-amber-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold">
                {t.timelineSectionBadge}
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-white">
              {t.timelineSectionTitle}
            </h2>
            <p className="mt-3 text-sm md:text-base text-gray-400 max-w-2xl leading-relaxed">
              {t.timelineSectionSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSongketModal}
              className="px-4 py-2.5 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-500/30 rounded-xl text-xs font-mono font-bold text-amber-200 transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-sm"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span>Ensiklopedi Songket</span>
            </button>
            <button
              onClick={onOpenQuiz}
              className="px-4 py-2.5 bg-[#8b0000] hover:bg-[#a00000] text-white rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-md shadow-[#8b0000]/30"
            >
              <Award size={14} />
              <span>Uji Sahabat Sriwijaya</span>
            </button>
          </div>
        </div>

        {/* Timeline Stepper Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {HERITAGE_TIMELINE_DATA.map((era, index) => {
            const isActive = selectedEraIndex === index;
            return (
              <button
                key={era.id}
                onClick={() => setSelectedEraIndex(index)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-br from-[#2a1a14] to-[#1f1510] border-amber-500/60 shadow-lg shadow-amber-900/20'
                    : 'bg-[#1a1715]/60 hover:bg-[#1a1715] border-white/5 hover:border-white/20'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-[#8b0000]" />
                )}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-mono uppercase font-bold tracking-wider ${
                    isActive ? 'text-amber-400' : 'text-gray-400'
                  }`}>
                    {era.period}
                  </span>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    isActive ? 'bg-amber-500 text-black' : 'bg-white/10 text-gray-400'
                  }`}>
                    0{index + 1}
                  </span>
                </div>
                <h4 className={`font-serif text-sm md:text-base font-bold line-clamp-1 transition-colors ${
                  isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                }`}>
                  {era.title}
                </h4>
                <p className="text-[11px] text-gray-400 line-clamp-1 mt-1 font-sans">
                  {era.rulerOrFigure}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Era Detail Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentEra.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-[#1b1714] border border-amber-500/20 rounded-3xl p-6 md:p-10 shadow-2xl relative"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Narrative & Key Milestones */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-amber-400 tracking-widest uppercase">
                      {currentEra.period}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-xs text-gray-300 font-medium">
                      Tokoh Kunci: {currentEra.rulerOrFigure}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">
                    {currentEra.title}
                  </h3>
                  <p className="text-sm font-serif italic text-amber-200/80 mb-4">
                    {currentEra.subtitle}
                  </p>
                </div>

                {/* Historic Quote */}
                <div className="p-4 rounded-2xl bg-amber-500/5 border-l-4 border-amber-500/60 text-amber-100/90 font-serif italic text-sm leading-relaxed">
                  {currentEra.quote}
                </div>

                {/* Narrative Description */}
                <p className="text-sm text-gray-300 leading-relaxed">
                  {currentEra.description}
                </p>

                {/* Key Historic Events Timeline */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold mb-4 flex items-center gap-2">
                    <Clock size={14} />
                    Peristiwa Bersejarah & Tonggak Peradaban
                  </h4>
                  <div className="space-y-3">
                    {currentEra.keyEvents.map((evt, idx) => (
                      <div key={idx} className="p-3.5 bg-black/30 border border-white/5 rounded-xl hover:border-amber-500/30 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                            {evt.year}
                          </span>
                          <span className="text-xs font-bold text-white">
                            {evt.event}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed mt-1">
                          {evt.significance}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {currentEra.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] font-mono px-2.5 py-1 bg-white/5 text-gray-300 rounded-lg border border-white/5">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Artifacts & Blockchain Anchor */}
              <div className="lg:col-span-5 space-y-6">
                {/* Artifact Showcase */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold mb-4 flex items-center gap-2">
                    <BookOpen size={14} />
                    Artefak & Bukti Arkeologis
                  </h4>
                  <div className="space-y-4">
                    {currentEra.artifacts.map((art, idx) => (
                      <div key={idx} className="group bg-black/40 border border-white/10 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all flex flex-col sm:flex-row">
                        <div className="w-full sm:w-36 h-32 sm:h-auto relative overflow-hidden bg-black/60 shrink-0">
                          <img 
                            src={art.image} 
                            alt={art.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = 'https://cda.1001malam.com/uploads/tour/onedaycityandmusitourpalembang_bukitsiguntang_5060.JPG';
                            }}
                          />
                        </div>
                        <div className="p-3.5 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-mono uppercase text-amber-400/80 font-bold tracking-wider">
                              {art.type}
                            </span>
                            <h5 className="font-serif text-sm font-bold text-white group-hover:text-amber-200 transition-colors">
                              {art.name}
                            </h5>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                              {art.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Blockchain & STC Anchor */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#8b0000]/20 to-black/60 border border-[#8b0000]/40">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck size={16} className="text-[#8b0000]" />
                    <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-amber-300">
                      STC On-Chain Anchor
                    </span>
                  </div>
                  <h5 className="font-serif text-sm font-bold text-white mb-1">
                    {currentEra.blockchainAnchor.nodeName}
                  </h5>
                  <p className="text-xs text-gray-300 leading-relaxed mb-4">
                    {currentEra.blockchainAnchor.proofConcept}
                  </p>

                  <button
                    onClick={() => onSelectNodeByName?.(currentEra.blockchainAnchor.nodeName)}
                    className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>Kunjungi Simpul Node di Explorer</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
