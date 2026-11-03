/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Sliders,
  X,
  Check,
  RotateCcw,
  Music,
  Waves,
  ExternalLink,
  AlertCircle,
  Play,
  Pause,
  Square,
  Sparkles
} from 'lucide-react';
import { musiAudio, MUSI_AUDIO_PRESETS, DEFAULT_RIVER_AUDIO_URL } from '../services/musiAudioEngine';

interface MusiAudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MusiAudioSettingsModal({ isOpen, onClose }: MusiAudioSettingsModalProps) {
  const [currentUrl, setCurrentUrl] = useState<string>(musiAudio.getAudioUrl());
  const [inputUrl, setInputUrl] = useState<string>(musiAudio.getAudioUrl());
  const [volume, setVolume] = useState<number>(musiAudio.getVolume());
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);
  const [status, setStatus] = useState(musiAudio.getStatus());

  useEffect(() => {
    const unsub = musiAudio.subscribe(() => {
      setStatus(musiAudio.getStatus());
      setCurrentUrl(musiAudio.getAudioUrl());
      setVolume(musiAudio.getVolume());
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const handleApplyUrl = async (urlToApply: string) => {
    musiAudio.setCustomAudioUrl(urlToApply);
    setCurrentUrl(urlToApply);
    setInputUrl(urlToApply);

    // If audio engine is not started yet, start it so user can hear the new audio immediately
    if (!status.isRunning) {
      await musiAudio.start();
    }

    setAppliedNotice('Suara berhasil diperbarui!');
    setTimeout(() => setAppliedNotice(null), 3000);
  };

  const handleSelectPreset = (presetUrl: string) => {
    handleApplyUrl(presetUrl);
  };

  const handleResetDefault = () => {
    handleApplyUrl(DEFAULT_RIVER_AUDIO_URL);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    musiAudio.setVolume(val);
  };

  const handleToggleMute = async () => {
    if (!status.isRunning) {
      await musiAudio.start();
    } else {
      musiAudio.toggleMute();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#0f141c] border border-amber-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl text-stone-100 font-sans"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
                <Waves size={22} className="animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                    Audio Ambiance Studio
                  </span>
                  {status.isRunning && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Aktif
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-xl font-bold text-white leading-tight">
                  Pengaturan Suara Gelombang & Air Musi
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-all cursor-pointer"
              title="Tutup"
            >
              <X size={18} />
            </button>
          </div>

          {appliedNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2"
            >
              <Check size={16} className="text-emerald-400" />
              {appliedNotice}
            </motion.div>
          )}

          {status.isLoading && (
            <div className="mt-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2 animate-pulse">
              <Sparkles size={16} className="text-amber-400" />
              Menghubungkan ke stream audio URL...
            </div>
          )}

          {/* Quick Play/Stop & Volume Bar */}
          <div className="mt-5 p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleMute}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  status.isRunning && !status.isMuted
                    ? 'bg-amber-600/30 border border-amber-500/50 text-amber-300 shadow-md'
                    : 'bg-white/10 border border-white/10 text-white/80 hover:bg-white/15'
                }`}
              >
                {status.isRunning && !status.isMuted ? (
                  <>
                    <Pause size={14} /> Jeda Audio
                  </>
                ) : (
                  <>
                    <Play size={14} /> Mainkan Audio
                  </>
                )}
              </button>

              {status.isRunning && (
                <button
                  onClick={() => musiAudio.stop()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 hover:bg-red-900/60 transition-all text-xs font-mono font-bold cursor-pointer"
                  title="Matikan / Hentikan Total Suara Musi"
                >
                  <Square size={12} fill="currentColor" className="text-red-400" />
                  <span>Stop</span>
                </button>
              )}

              <span className="text-xs font-mono text-stone-400 hidden sm:inline ml-1">
                {status.isRunning && !status.isMuted ? 'Musi Ambient: Mengalun' : 'Musi Ambient: Hening'}
              </span>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2.5 min-w-[140px] flex-1 max-w-[200px]">
              {volume === 0 || status.isMuted ? (
                <VolumeX size={16} className="text-stone-500" />
              ) : (
                <Volume2 size={16} className="text-amber-400" />
              )}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={status.isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
              />
              <span className="font-mono text-[10px] text-stone-400 w-8 text-right">
                {Math.round((status.isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          </div>

          {/* Section 1: Custom URL Input */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Music size={14} />
                URL Suara Desiran Ombak / Air (Custom URL)
              </label>
              <button
                onClick={handleResetDefault}
                className="text-[11px] font-mono text-stone-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw size={12} />
                Reset Rekomendasi
              </button>
            </div>

            <p className="text-xs text-stone-400 mb-3 leading-relaxed">
              Kamu bisa memasukkan langsung URL file audio desiran ombak atau riak sungai (.mp3, .ogg, .wav). URL akan tersimpan otomatis untuk kunjungan berikutnya.
            </p>

            <div className="flex gap-2">
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://domain.com/suara-ombak.mp3"
                className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={() => handleApplyUrl(inputUrl)}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 border border-amber-400 text-stone-950 font-bold text-xs font-mono rounded-xl transition-all cursor-pointer whitespace-nowrap"
              >
                Terapkan URL
              </button>
            </div>
          </div>

          {/* Section 2: Presets */}
          <div className="mt-6">
            <h4 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" />
              Pilihan Preset Suara Alami (Siap Pakai)
            </h4>

            <div className="space-y-2">
              {MUSI_AUDIO_PRESETS.map((preset) => {
                const isSelected = currentUrl === preset.url;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.url)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500/60 shadow-md shadow-amber-950/20'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${isSelected ? 'text-amber-300' : 'text-stone-200'}`}>
                          {preset.name}
                        </span>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            Aktif
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5 leading-snug line-clamp-1">
                        {preset.desc}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-stone-950">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-white/20 hover:border-amber-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-400">
            <span className="font-mono text-[11px] text-stone-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Suara tetap mengalun setelah klik Selesai. Matikan via tombol Stop Suara di luar modal.
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold font-mono text-xs cursor-pointer transition-all shadow-md self-end sm:self-auto"
            >
              Selesai & Simpan
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
