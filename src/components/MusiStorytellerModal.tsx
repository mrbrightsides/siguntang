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
  Play, 
  Pause, 
  RotateCcw, 
  BookOpen, 
  Sun, 
  Moon, 
  CloudFog, 
  CloudRain, 
  Award, 
  User, 
  Compass, 
  ShieldCheck, 
  ChevronRight,
  Flame,
  CheckCircle2,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { 
  STORYTELLER_PERSONAS, 
  StorytellerPersonaId, 
  StorytellerPersona, 
  MUSI_FOLKLORE_TOPICS, 
  MusiFolkloreTopic, 
  OralStoryResult, 
  generateMusiOralStory, 
  playOralStorySpeech 
} from '../services/geminiStorytellerService';
import { MusiWeatherType } from '../services/musiAudioEngine';
import { buildSBTMetadata, pinMetadataToIPFS } from '../services/ipfsService';
import { mintSoulboundCertificate, WalletState } from '../services/blockchainService';

interface MusiStorytellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeather?: MusiWeatherType;
  wallet?: WalletState | null;
  onConnectWallet?: () => void;
}

export function MusiStorytellerModal({
  isOpen,
  onClose,
  currentWeather = 'senja',
  wallet,
  onConnectWallet
}: MusiStorytellerModalProps) {
  const [selectedPersonaId, setSelectedPersonaId] = useState<StorytellerPersonaId>('pengayuh-ketek');
  const [selectedStoryId, setSelectedStoryId] = useState<string>(MUSI_FOLKLORE_TOPICS[0].id);
  const [activeWeather, setActiveWeather] = useState<MusiWeatherType>(currentWeather);
  const [customListenerNotes, setCustomListenerNotes] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [storyResult, setStoryResult] = useState<OralStoryResult | null>(null);

  // Audio Speech Synthesis state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioStopFn, setAudioStopFn] = useState<(() => void) | null>(null);

  // Minting state
  const [isMinting, setIsMinting] = useState(false);
  const [mintedTxHash, setMintedTxHash] = useState<string | null>(null);

  useEffect(() => {
    setActiveWeather(currentWeather);
  }, [currentWeather]);

  useEffect(() => {
    return () => {
      if (audioStopFn) audioStopFn();
    };
  }, [audioStopFn]);

  if (!isOpen) return null;

  const currentPersona = STORYTELLER_PERSONAS.find(p => p.id === selectedPersonaId) || STORYTELLER_PERSONAS[0];
  const currentTopic = MUSI_FOLKLORE_TOPICS.find(t => t.id === selectedStoryId) || MUSI_FOLKLORE_TOPICS[0];

  const handleGenerateStory = async () => {
    if (audioStopFn) {
      audioStopFn();
      setIsPlayingAudio(false);
    }
    setIsLoading(true);
    setMintedTxHash(null);

    try {
      const res = await generateMusiOralStory({
        storyId: selectedStoryId,
        personaId: selectedPersonaId,
        weather: activeWeather,
        customListenerContext: customListenerNotes
      });
      setStoryResult(res);
    } catch (e) {
      console.error("Gagal generate oral story:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      if (audioStopFn) audioStopFn();
      setIsPlayingAudio(false);
      setAudioStopFn(null);
    } else {
      if (!storyResult) return;
      const textToPlay = `${storyResult.title}. ${storyResult.storyNarrative}. Pepatah kuno: ${storyResult.localProverb}. ${storyResult.proverbMeaning}`;
      const stop = playOralStorySpeech(textToPlay, currentPersona, () => {
        setIsPlayingAudio(false);
      });
      setAudioStopFn(() => stop);
      setIsPlayingAudio(true);
    }
  };

  const handleMintProofOfStorytelling = async () => {
    if (!storyResult) return;
    setIsMinting(true);

    try {
      const recipientAddr = wallet?.address || '0x17A1e4875c125ad6e89388d9F042A361499495Da';
      const metadata = buildSBTMetadata({
        nodeId: `folklore-${selectedStoryId}`,
        nodeName: storyResult.title,
        category: 'Tutur Lisan Tradisi Musi',
        recipientAddress: recipientAddr,
        recipientName: wallet?.address ? 'Pendengar Warisan Budaya STC' : 'Dr. Akhmad Khudri (STC Treasury)',
        certificateType: `Proof-of-Oral-Storytelling (${currentPersona.name})`,
        imageUrl: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80',
        latitude: -2.9909,
        longitude: 104.7565
      });

      metadata.attributes.push(
        { trait_type: 'Storyteller Persona', value: currentPersona.name },
        { trait_type: 'Voice Role', value: currentPersona.roleTitle },
        { trait_type: 'Weather Atmosphere', value: activeWeather },
        { trait_type: 'Local Proverb', value: storyResult.localProverb }
      );

      const ipfsRes = await pinMetadataToIPFS(metadata);
      const tx = await mintSoulboundCertificate({
        recipientAddress: recipientAddr,
        ipfsUri: ipfsRes.ipfsUri,
        nodeName: storyResult.title,
        certType: `Proof-of-Oral-Storytelling (${currentPersona.name})`
      });

      setMintedTxHash(tx.txHash);
    } catch (err: any) {
      alert(`Minting gagal: ${err.message || 'Periksa koneksi jaringan MetaMask'}`);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl bg-[#141210] border border-amber-500/25 rounded-3xl shadow-2xl text-white overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#211612] via-[#2a1a14] to-[#1c120e] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-[#8b0000] to-amber-600 rounded-2xl shadow-md text-amber-200">
              <BookOpen size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white">
                  AI Musi Oral Storyteller
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold border border-amber-500/30 uppercase">
                  Persona Tutur Lisan
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Tutur Lisan Cerita Rakyat Sungai Musi Beradaptasi dengan Persona & Cuaca Diorama 3D
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (audioStopFn) audioStopFn();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Persona & Atmosphere Config */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Persona Selection */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block mb-2 flex items-center gap-1.5">
                <User size={13} />
                Pilih Persona Penutur Cerita:
              </label>

              <div className="space-y-2">
                {STORYTELLER_PERSONAS.map((persona) => {
                  const isSelected = selectedPersonaId === persona.id;
                  return (
                    <button
                      key={persona.id}
                      onClick={() => setSelectedPersonaId(persona.id)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/60 ring-1 ring-amber-500/40 text-white'
                          : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${persona.avatarBg} flex items-center justify-center shrink-0 text-white font-serif font-bold text-sm shadow-md`}>
                        {persona.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-serif text-xs font-bold text-white truncate">{persona.name}</p>
                          <span className="text-[9px] font-mono text-amber-300/80 uppercase font-semibold">{persona.id.split('-')[0]}</span>
                        </div>
                        <p className="text-[10px] text-amber-200/90 font-medium truncate">{persona.roleTitle}</p>
                        <p className="text-[10px] text-stone-400 line-clamp-2 mt-0.5 leading-relaxed">{persona.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weather Atmosphere Synced with 3D Diorama */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-2 flex items-center justify-between">
                <span>Atmosfer Cuaca di Sungai Musi:</span>
                <span className="text-amber-400 font-semibold lowercase">({activeWeather})</span>
              </label>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: 'senja', label: 'Senja', icon: Sun, color: 'text-amber-400' },
                  { key: 'purnama', label: 'Purnama', icon: Moon, color: 'text-sky-300' },
                  { key: 'kabut', label: 'Kabut', icon: CloudFog, color: 'text-stone-300' },
                  { key: 'hujan', label: 'Hujan', icon: CloudRain, color: 'text-blue-400' }
                ].map(w => (
                  <button
                    key={w.key}
                    onClick={() => setActiveWeather(w.key as MusiWeatherType)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      activeWeather === w.key
                        ? 'bg-amber-500/20 border-amber-400 text-white font-bold'
                        : 'bg-white/5 border-white/10 text-stone-400 hover:bg-white/10'
                    }`}
                  >
                    <w.icon size={15} className={w.color} />
                    <span className="text-[10px] font-mono">{w.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Folklore Topic Picker */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-1.5">
                Topik Cerita Rakyat:
              </label>
              <select
                value={selectedStoryId}
                onChange={(e) => setSelectedStoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {MUSI_FOLKLORE_TOPICS.map(topic => (
                  <option key={topic.id} value={topic.id} className="bg-stone-900 text-white">
                    {topic.title} ({topic.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Action Trigger Button */}
            <button
              onClick={handleGenerateStory}
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:brightness-110 text-stone-950 font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={14} className="animate-spin text-stone-950" />
                  Merangkai Tutur Lisan...
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-stone-950" />
                  Mulai Tutur Lisan {currentPersona.name}
                </>
              )}
            </button>
          </div>

          {/* Right Column: Story Narrative Display & Audio Synthesis */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {!storyResult && !isLoading ? (
              <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/15 rounded-2xl bg-white/[0.02]">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300 mb-4">
                  <BookOpen size={24} />
                </div>
                <h4 className="font-serif text-lg font-bold text-white mb-2">
                  Panggung Tutur Lisan Siap Dibawakan
                </h4>
                <p className="text-xs text-stone-400 max-w-md leading-relaxed mb-6">
                  Pilih persona penutur (Wak Seman, Dr. Raden Sriwijaya, atau Bunda Kembang), sesuaikan atmosfer cuaca Sungai Musi, lalu klik <strong>"Mulai Tutur Lisan"</strong>.
                </p>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 max-w-sm text-left">
                  <p className="font-mono text-[10px] text-amber-300 font-bold uppercase mb-1">
                    Gaya Suara Dinamis
                  </p>
                  <p className="text-[11px] text-stone-300 leading-relaxed">
                    Setiap penutur memiliki nada, kecepatan bercerita, dan sudut pandang orisinil yang tersinkronisasi dengan cuaca 3D diorama.
                  </p>
                </div>
              </div>
            ) : isLoading ? (
              <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-center p-8 border border-white/10 rounded-2xl bg-white/[0.02]">
                <RefreshCw size={36} className="animate-spin text-amber-400 mb-4" />
                <h4 className="font-serif text-lg font-bold text-white mb-2">
                  {currentPersona.name} Sedang Bersiap Bertutur
                </h4>
                <p className="text-xs text-stone-400 max-w-md">
                  Mengintegrasikan nuansa {activeWeather} Sungai Musi dengan hikayat {currentTopic.title}...
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Title & Audio Play Controls */}
                <div className="p-4 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl border border-white/15 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="font-mono text-[9px] text-amber-300 font-bold uppercase tracking-widest block mb-0.5">
                      TUTUR LISAN AKTIF • {storyResult.weatherAtmosphere.toUpperCase()}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                      {storyResult.title}
                    </h3>
                    <p className="text-xs text-stone-300">
                      Penutur: <strong>{storyResult.personaName}</strong> ({currentPersona.roleTitle})
                    </p>
                  </div>

                  {/* Play Audio Button */}
                  <button
                    onClick={handleToggleAudio}
                    className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                      isPlayingAudio
                        ? 'bg-amber-400 text-stone-950 animate-pulse'
                        : 'bg-[#8b0000] hover:bg-[#a00000] text-white shadow-[#8b0000]/30'
                    }`}
                  >
                    {isPlayingAudio ? (
                      <>
                        <VolumeX size={15} />
                        Hentikan Audio
                      </>
                    ) : (
                      <>
                        <Volume2 size={15} />
                        Dengarkan Suara ({currentPersona.name.split(' ')[0]})
                      </>
                    )}
                  </button>
                </div>

                {/* Narrative Body */}
                <div className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-3 max-h-[300px] overflow-y-auto">
                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed whitespace-pre-line font-sans">
                    {storyResult.storyNarrative}
                  </p>
                </div>

                {/* Proverb & Moral Lesson */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-amber-950/20 border border-amber-500/25 rounded-xl space-y-1">
                    <span className="font-mono text-[10px] text-amber-400 uppercase font-bold block">
                      Pepatah Palembang Bahari:
                    </span>
                    <p className="font-serif italic text-amber-200">"{storyResult.localProverb}"</p>
                    <p className="text-[10px] text-stone-300 mt-1">{storyResult.proverbMeaning}</p>
                  </div>

                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1">
                    <span className="font-mono text-[10px] text-emerald-400 uppercase font-bold block">
                      Pesan Moral Luhur:
                    </span>
                    <p className="text-stone-200 font-medium">{storyResult.moralLesson}</p>
                  </div>
                </div>

                {/* On-Chain Soulbound Minting */}
                <div className="pt-1">
                  {mintedTxHash ? (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center justify-between text-xs text-emerald-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        <span>SBT Bukti Cerita Lisan Berhasil Dicatat di Sepolia!</span>
                      </div>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${mintedTxHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[10px] text-amber-300 underline font-bold"
                      >
                        Lihat di Etherscan ↗
                      </a>
                    </div>
                  ) : (
                    <button
                      onClick={handleMintProofOfStorytelling}
                      disabled={isMinting}
                      className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-[10px] uppercase font-bold tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isMinting ? (
                        <>
                          <RefreshCw size={13} className="animate-spin text-amber-400" />
                          Mencatat ke Sepolia EIP-5192...
                        </>
                      ) : (
                        <>
                          <Award size={13} className="text-amber-400" />
                          Klaim SBT Bukti Tutur Lisan ({currentTopic.title})
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-black/60 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400 font-mono shrink-0">
          <div className="flex items-center gap-2">
            <Cpu size={13} className="text-amber-400" />
            <span>STC Oral Heritage Ledger • Dr. Akhmad Khudri</span>
          </div>
          <span className="hidden sm:inline text-stone-500">
            Engine: Gemini 3.8 Flash • Web Speech API
          </span>
        </div>
      </motion.div>
    </div>
  );
}
