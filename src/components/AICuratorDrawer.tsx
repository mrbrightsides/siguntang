/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Compass, 
  Send, 
  RefreshCw, 
  HelpCircle, 
  Layers, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { 
  getLandmarkCuratorInsight, 
  LandmarkCuratorInsight, 
  speakCuratorNarrative 
} from '../services/geminiCuratorService';

interface AICuratorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  landmarkKey: string;
  landmarkName: string;
  onClaimSBT?: () => void;
  onExploreNode?: () => void;
}

export function AICuratorDrawer({
  isOpen,
  onClose,
  landmarkKey,
  landmarkName,
  onClaimSBT,
  onExploreNode
}: AICuratorDrawerProps) {
  const [insight, setInsight] = useState<LandmarkCuratorInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioStopFn, setAudioStopFn] = useState<(() => void) | null>(null);
  const [userQuestion, setUserQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  useEffect(() => {
    if (!isOpen || !landmarkName) {
      if (audioStopFn) audioStopFn();
      setIsPlayingAudio(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    getLandmarkCuratorInsight({
      landmarkKey,
      landmarkName
    }).then(res => {
      if (isMounted) {
        setInsight(res);
        setIsLoading(false);
      }
    }).catch(() => {
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
      if (audioStopFn) audioStopFn();
    };
  }, [isOpen, landmarkKey, landmarkName]);

  const handleAskQuestion = async (questionText: string) => {
    if (!questionText.trim() || isAsking) return;
    setIsAsking(true);
    try {
      const updated = await getLandmarkCuratorInsight({
        landmarkKey,
        landmarkName,
        userQuestion: questionText
      });
      setInsight(updated);
      setUserQuestion('');
    } catch (e) {
      console.error("Gagal bertanya ke AI Curator:", e);
    } finally {
      setIsAsking(false);
    }
  };

  const toggleAudioGuide = () => {
    if (isPlayingAudio) {
      if (audioStopFn) audioStopFn();
      setIsPlayingAudio(false);
      setAudioStopFn(null);
    } else {
      if (!insight) return;
      const textToSpeak = `${insight.landmarkName}. Era: ${insight.era}. ${insight.curatorNarrative}`;
      const stop = speakCuratorNarrative(textToSpeak, () => {
        setIsPlayingAudio(false);
      });
      setAudioStopFn(() => stop);
      setIsPlayingAudio(true);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="absolute top-16 sm:top-20 inset-x-3 sm:inset-x-auto sm:right-6 bottom-3 sm:bottom-6 sm:w-96 sm:max-w-md bg-[#111111]/95 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl text-white flex flex-col z-30 overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#201010] via-[#1a1111] to-[#141414] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-[#8b0000] to-amber-600 rounded-2xl shadow-inner text-amber-200">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-amber-400 font-bold">
                  AI ARCHAEOLOGICAL CURATOR
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h3 className="font-serif text-lg font-bold leading-tight truncate text-white">
                {landmarkName}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleAudioGuide}
              title={isPlayingAudio ? "Hentikan Suara" : "Dengarkan Narasi Suara (Audio Guide)"}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isPlayingAudio 
                  ? 'bg-amber-500 text-black font-bold animate-pulse' 
                  : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white'
              }`}
            >
              {isPlayingAudio ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <button
              onClick={() => {
                if (audioStopFn) audioStopFn();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <RefreshCw size={28} className="animate-spin text-amber-400" />
              <p className="font-serif text-sm font-semibold text-white">
                Membedah Arsip Arkeologi & Kosmologi Musi...
              </p>
              <p className="text-[11px] text-white/50 max-w-xs">
                Mengintegrasikan prasasti Sriwijaya, kronik maritim, dan tesis STC Dr. Akhmad Khudri.
              </p>
            </div>
          ) : insight ? (
            <>
              {/* Era Badge */}
              <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-amber-400" />
                  <span className="font-mono text-[10px] text-stone-300">Periodisasi / Era:</span>
                </div>
                <span className="font-mono text-[10px] font-bold text-amber-300">
                  {insight.era}
                </span>
              </div>

              {/* Main Narrative */}
              <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                    <BookOpen size={12} />
                    Catatan Kuratorial Utama
                  </span>
                  {isPlayingAudio && (
                    <span className="text-[9px] font-mono text-emerald-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Audio Aktif
                    </span>
                  )}
                </div>
                <p className="text-stone-300 leading-relaxed whitespace-pre-line text-xs font-sans">
                  {insight.curatorNarrative}
                </p>
              </div>

              {/* Archaeological Facts */}
              {insight.archaeologicalFacts.length > 0 && (
                <div className="p-3.5 bg-black/40 rounded-xl border border-white/10 space-y-2">
                  <span className="font-mono text-[10px] uppercase font-bold text-white/70 block">
                    Fakta Arkeologis & Epigrafi:
                  </span>
                  <ul className="space-y-1.5">
                    {insight.archaeologicalFacts.map((fact, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-stone-300 text-[11px] leading-relaxed">
                        <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Folklore & Oral Legend */}
              <div className="p-3.5 bg-amber-950/20 rounded-xl border border-amber-500/20 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-300">
                  <Flame size={13} />
                  <span className="font-mono text-[10px] uppercase font-bold">Kaitan Folklore & Tradisi Lisan:</span>
                </div>
                <p className="text-amber-100/85 text-[11px] leading-relaxed">
                  {insight.folkloreConnection}
                </p>
              </div>

              {/* Role in STC Thesis */}
              <div className="p-3.5 bg-[#8b0000]/15 rounded-xl border border-[#8b0000]/30 space-y-1.5">
                <div className="flex items-center gap-1.5 text-red-300">
                  <ShieldCheck size={14} className="text-red-400" />
                  <span className="font-mono text-[10px] uppercase font-bold">Peran pada Smart Tourism Chain:</span>
                </div>
                <p className="text-stone-200 text-[11px] leading-relaxed font-mono">
                  {insight.stcThesisRole}
                </p>
              </div>

              {/* Suggested Follow-up Questions */}
              {insight.suggestedQuestions.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-white/50 block">
                    Eksplorasi Pertanyaan Kurator:
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {insight.suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAskQuestion(q)}
                        disabled={isAsking}
                        className="text-left p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white text-[11px] transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <span className="truncate pr-2">{q}</span>
                        <ChevronRight size={12} className="text-white/40 group-hover:text-amber-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Ask AI Curator Input Bar */}
        <div className="p-3 bg-black/60 border-t border-white/10 shrink-0 space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskQuestion(userQuestion);
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder={`Tanya kurator tentang ${landmarkName}...`}
              className="w-full pl-3 pr-10 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400/50 transition-all font-sans"
            />
            <button
              type="submit"
              disabled={!userQuestion.trim() || isAsking}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black rounded-lg transition-all cursor-pointer"
            >
              {isAsking ? <RefreshCw size={12} className="animate-spin text-black" /> : <Send size={12} />}
            </button>
          </form>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            {onExploreNode && (
              <button
                onClick={onExploreNode}
                className="flex-1 py-2.5 px-3 bg-gradient-to-r from-[#8b0000] to-[#b30000] hover:brightness-110 text-white font-mono text-[10px] font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#8b0000]/30"
              >
                <Compass size={12} className="text-amber-300" />
                <span>Eksplorasi Simpul Ini</span>
                <ChevronRight size={12} />
              </button>
            )}
            {onClaimSBT && (
              <button
                onClick={onClaimSBT}
                className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Award size={12} className="text-amber-400" />
                <span>Klaim SBT</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
