/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  Copy, 
  Check, 
  Scroll, 
  Award, 
  Clock, 
  Compass, 
  FileCheck,
  Feather,
  Flame,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  generateDigitalPrasasti, 
  DigitalPrasastiResult, 
  PLEDGE_TEMPLATES, 
  PledgeTemplate,
  StoneStyle,
  speakPrasastiRecitation 
} from '../services/geminiPrasastiService';
import { 
  mintSoulboundCertificate 
} from '../services/blockchainService';
import { 
  CONTRACT_ADDRESSES, 
  SEPOLIA_CONFIG 
} from '../contractData';
import { pinMetadataToIPFS, buildSBTMetadata } from '../services/ipfsService';

interface PrasastiDigitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: any;
  onConnectWallet: () => Promise<void>;
  defaultCategory?: string;
}

export function PrasastiDigitalModal({
  isOpen,
  onClose,
  wallet,
  onConnectWallet,
  defaultCategory
}: PrasastiDigitalModalProps) {
  const [visitorName, setVisitorName] = useState('Dr. Akhmad Khudri');
  const [selectedTemplate, setSelectedTemplate] = useState<PledgeTemplate>(PLEDGE_TEMPLATES[0]);
  const [customPledge, setCustomPledge] = useState(PLEDGE_TEMPLATES[0].defaultPledge);
  const [stoneStyle, setStoneStyle] = useState<StoneStyle>('sandstone-kedukan');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<DigitalPrasastiResult | null>(null);
  
  // Minting state
  const [isMinting, setIsMinting] = useState(false);
  const [mintStep, setMintStep] = useState<'idle' | 'ipfs' | 'contract' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [mintError, setMintError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Audio Speech state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioStopFn, setAudioStopFn] = useState<(() => void) | null>(null);

  if (!isOpen) return null;

  const handleSelectTemplate = (tmpl: PledgeTemplate) => {
    setSelectedTemplate(tmpl);
    setCustomPledge(tmpl.defaultPledge);
    setStoneStyle(tmpl.suggestedStone);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!visitorName.trim()) return;

    if (audioStopFn) {
      audioStopFn();
      setIsPlayingAudio(false);
    }

    setIsGenerating(true);
    setMintStep('idle');
    setTxHash(null);
    setMintError(null);

    try {
      const generated = await generateDigitalPrasasti({
        visitorName,
        pledgeCategory: selectedTemplate.category,
        customPledge,
        stoneStyle
      });
      setResult(generated);
    } catch (err: any) {
      console.error("Gagal gubah prasasti:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      if (audioStopFn) audioStopFn();
      setIsPlayingAudio(false);
    } else {
      if (!result) return;
      const textToSpeak = `${result.steleTitle}. ${result.indonesianTranslation}. Sumpah pelindung: ${result.curseProtectionFormula}`;
      const stop = speakPrasastiRecitation(textToSpeak, () => {
        setIsPlayingAudio(false);
      });
      setAudioStopFn(() => stop);
      setIsPlayingAudio(true);
    }
  };

  const handleMintSBT = async () => {
    if (!result) return;
    if (!wallet?.isConnected) {
      await onConnectWallet();
      return;
    }

    setIsMinting(true);
    setMintStep('ipfs');
    setMintError(null);

    try {
      // 1. Upload IPFS Metadata
      const sbtMeta = buildSBTMetadata({
        nodeId: `prasasti-${Date.now()}`,
        nodeName: result.steleTitle,
        category: 'Prasasti Sumpah Melayu Kuna Abad ke-7',
        recipientAddress: wallet.address,
        recipientName: visitorName,
        certificateType: 'SBT Prasasti Sumpah Melayu Kuna',
        imageUrl: stoneStyle === 'andesit-telaga-batu'
          ? 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
        latitude: -2.9904,
        longitude: 104.7297
      });

      const ipfsResult = await pinMetadataToIPFS(sbtMeta);
      setMintStep('contract');

      // 2. Mint Soulbound Certificate on Ethereum Sepolia
      const tx = await mintSoulboundCertificate({
        recipientAddress: wallet.address,
        ipfsUri: ipfsResult.ipfsUri,
        nodeName: result.steleTitle,
        certType: 'SBT Prasasti Sumpah Melayu Kuna'
      });

      setTxHash(tx.txHash);
      setMintStep('success');
    } catch (err: any) {
      console.error("Gagal minting SBT Prasasti:", err);
      setMintError(err.message || 'Transaksi blockchain ditolak atau gas fee tidak mencukupi.');
      setMintStep('error');
    } finally {
      setIsMinting(false);
    }
  };

  const handleCopyText = () => {
    if (!result) return;
    const shareText = `📜 [PRASASTI SUMPAH SRIWIJAYA]\n${result.steleTitle}\n\nMelayu Kuna (Abad 7):\n"${result.oldMalayText}"\n\nTerjemahan:\n"${result.indonesianTranslation}"\n\nSumpah Pelindung:\n"${result.curseProtectionFormula}"\n\nTerverifikasi pada Smart Tourism Chain (STC) - SIGUNTANG.`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Dynamic stone styles
  const stoneBgClass = 
    stoneStyle === 'andesit-telaga-batu' 
      ? 'bg-gradient-to-b from-stone-900 via-stone-950 to-black text-amber-100 border-stone-800'
      : stoneStyle === 'lempeng-tembaga'
        ? 'bg-gradient-to-b from-[#422006] via-[#291305] to-[#1c0c03] text-amber-200 border-amber-900/60'
        : 'bg-gradient-to-b from-[#453227] via-[#2e2119] to-[#1d1510] text-[#f7e8d0] border-[#5e4434]';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl bg-[#141414] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-[#2a1309] via-[#8b0000] to-[#141414] border-b border-white/10 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 border border-amber-400/30 rounded-2xl">
              <Scroll size={22} className="text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-amber-300 font-bold uppercase tracking-widest">
                  TAHAP 4: EPIGRAFI DIGITAL SRIWIJAYA
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono rounded-full border border-emerald-500/30">
                  Melayu Kuna 683 M
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                Generator Prasasti Digital Aksara Pallawa
              </h2>
            </div>
          </div>
          <button 
            onClick={() => {
              if (audioStopFn) audioStopFn();
              onClose();
            }}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0f0f10]">
          
          {/* Left Column: Creator Form (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <h3 className="font-serif text-base font-bold text-white mb-1 flex items-center gap-2">
                <Feather size={16} className="text-amber-400" />
                Ikrar Sumpah Pelestarian Budaya
              </h3>
              <p className="text-xs text-white/60 leading-relaxed mb-4">
                Abadikan komitmen Anda menjaga warisan Sriwijaya ke dalam prasasti batu kuno abad ke-7 dengan formula sumpah sakral (sapatha).
              </p>

              <form onSubmit={handleGenerate} className="space-y-3.5">
                {/* Nama Pengunjung */}
                <div>
                  <label className="block text-[11px] font-mono text-white/70 uppercase mb-1.5 font-bold">
                    Nama Pemilik Ikrar / Pengunjung:
                  </label>
                  <input
                    type="text"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="Contoh: Dr. Akhmad Khudri"
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 transition-all font-sans"
                    required
                  />
                </div>

                {/* Template Sumpah Kategori */}
                <div>
                  <label className="block text-[11px] font-mono text-white/70 uppercase mb-1.5 font-bold">
                    Pilih Kategori Ikrar Sriwijaya:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PLEDGE_TEMPLATES.map((tmpl) => (
                      <button
                        type="button"
                        key={tmpl.id}
                        onClick={() => handleSelectTemplate(tmpl)}
                        className={`p-2.5 text-left rounded-xl border text-xs transition-all cursor-pointer flex flex-col justify-between ${
                          selectedTemplate.id === tmpl.id
                            ? 'bg-amber-500/20 border-amber-400 text-white shadow-md shadow-amber-500/10'
                            : 'bg-black/40 border-white/10 text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className="font-bold text-[11px] block text-amber-300 truncate">{tmpl.label}</span>
                        <span className="text-[10px] text-white/50 truncate">{tmpl.category}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Sumpah Kustom */}
                <div>
                  <label className="block text-[11px] font-mono text-white/70 uppercase mb-1.5 font-bold">
                    Isi Komitmen Sumpah Budaya:
                  </label>
                  <textarea
                    rows={3}
                    value={customPledge}
                    onChange={(e) => setCustomPledge(e.target.value)}
                    placeholder="Tuliskan ikrar atau komitmen pelestarian warisan budaya..."
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 transition-all leading-relaxed resize-none font-sans"
                    required
                  />
                </div>

                {/* Gaya Batu Prasasti */}
                <div>
                  <label className="block text-[11px] font-mono text-white/70 uppercase mb-1.5 font-bold">
                    Media Pahat Prasasti:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'sandstone-kedukan', label: 'Sandstone Kedukan', sub: 'Cokelat Aluvial' },
                      { key: 'andesit-telaga-batu', label: 'Andesit Hitam', sub: 'Telaga Batu' },
                      { key: 'lempeng-tembaga', label: 'Lempeng Perunggu', sub: 'Talang Tuwo' }
                    ].map((stone) => (
                      <button
                        type="button"
                        key={stone.key}
                        onClick={() => setStoneStyle(stone.key as StoneStyle)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          stoneStyle === stone.key
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                            : 'bg-black/40 border-white/10 text-white/50 hover:text-white'
                        }`}
                      >
                        <span className="block text-[10px] font-bold font-mono">{stone.label}</span>
                        <span className="block text-[9px] text-white/40">{stone.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isGenerating || !visitorName.trim()}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:brightness-110 active:scale-98 text-black font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Memahat Prasasti via Gemini...
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} />
                      Gubah Prasasti Melayu Kuna (Gemini)
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Context Tip */}
            <div className="p-3.5 bg-black/40 border border-white/10 rounded-2xl text-[11px] text-white/60 leading-relaxed">
              <span className="text-amber-400 font-bold block mb-1">💡 Fakta Arkeologi Epigrafi Sriwijaya:</span>
              Prasasti Kedukan Bukit (683 M) dan Telaga Batu di Palembang adalah dokumen tertulis tertua dalam rumpun bahasa Melayu. Mengandung formula sumpah kesetiaan, perlindungan wanua, dan keberkahan air Sungai Musi.
            </div>
          </div>

          {/* Right Column: Inscription Stele Display (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col">
            {result ? (
              <div className="space-y-4 flex-1 flex flex-col">
                {/* Ancient Stele Card */}
                <div className={`relative p-6 sm:p-8 rounded-3xl border shadow-2xl flex-1 flex flex-col justify-between overflow-hidden ${stoneBgClass}`}>
                  {/* Stele Top Arch Accent */}
                  <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div>
                    {/* Stele Top Emblem */}
                    <div className="text-center mb-5 pb-4 border-b border-white/15">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/40 border border-amber-400/30 rounded-full text-amber-300 font-mono text-[10px] uppercase font-bold mb-2">
                        <Flame size={12} className="text-amber-400" />
                        ŚRĪ ! ŚIDDHAM — SUMPAH ABADI
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-amber-100">
                        {result.steleTitle}
                      </h3>
                      <p className="text-[11px] font-mono text-amber-300/70 uppercase tracking-widest mt-0.5">
                        Dapunta Hyang • Wanua Musi Palembang
                      </p>
                    </div>

                    {/* Aksara Pallawa / Ulu Script Carved Rendering */}
                    <div className="p-4 bg-black/40 border border-amber-500/20 rounded-2xl mb-4 text-center">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/70 block mb-2">
                        Pahatan Aksara Pallawa Sriwijaya (Epigrafi Abad ke-7):
                      </span>
                      <p className="font-serif text-lg sm:text-xl text-amber-200 tracking-widest leading-loose select-all font-semibold drop-shadow-[0_2px_8px_rgba(251,191,36,0.25)]">
                        {result.pallawaScript}
                      </p>
                    </div>

                    {/* Old Malay Text */}
                    <div className="mb-4 space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/80 font-bold block">
                        Teks Bahasa Melayu Kuna Asli:
                      </span>
                      <blockquote className="text-xs sm:text-sm italic font-serif leading-relaxed text-amber-100/90 bg-white/5 p-3.5 rounded-xl border border-white/10 select-all">
                        "{result.oldMalayText}"
                      </blockquote>
                      <p className="text-[10px] font-mono text-amber-300/60 pl-1">
                        Transliterasi: {result.phoneticTransliteration}
                      </p>
                    </div>

                    {/* Indonesian Modern Translation */}
                    <div className="mb-4">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-white/70 font-bold block mb-1">
                        Terjemahan Bahasa Indonesia:
                      </span>
                      <p className="text-xs leading-relaxed text-white/80 bg-black/30 p-3 rounded-xl border border-white/5">
                        {result.indonesianTranslation}
                      </p>
                    </div>

                    {/* Curse & Protection Formula */}
                    <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl mb-4">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-red-300 font-bold flex items-center gap-1.5 mb-1">
                        <ShieldCheck size={12} className="text-red-400" />
                        Formula Sumpah Pelindung (Sapatha Sriwijaya):
                      </span>
                      <p className="text-[11px] leading-relaxed text-red-100/90">
                        {result.curseProtectionFormula}
                      </p>
                    </div>
                  </div>

                  {/* Stele Footer Controls */}
                  <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <button
                      onClick={handleToggleAudio}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        isPlayingAudio 
                          ? 'bg-amber-400 text-black shadow-md shadow-amber-400/25' 
                          : 'bg-black/50 hover:bg-black/80 text-amber-300 border border-amber-400/30'
                      }`}
                    >
                      {isPlayingAudio ? <VolumeX size={15} /> : <Volume2 size={15} />}
                      {isPlayingAudio ? 'Hentikan Lafal' : 'Dengarkan Lafal Melayu Kuna'}
                    </button>

                    <button
                      onClick={handleCopyText}
                      className="flex items-center gap-1.5 px-3 py-2 bg-black/40 hover:bg-black/60 border border-white/10 text-white/80 rounded-xl text-xs font-mono transition-all cursor-pointer"
                    >
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      {copied ? 'Tersalin!' : 'Salin Prasasti'}
                    </button>
                  </div>
                </div>

                {/* Blockchain SBT Minting Actions */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                        TRUST LAYER SMART TOURISM CHAIN
                      </span>
                      <h4 className="font-serif text-sm font-bold text-white">
                        Klaim SBT Prasasti Abadi (ERC-5192 Sepolia)
                      </h4>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono rounded-lg">
                      Non-Transferable
                    </span>
                  </div>

                  {mintStep === 'success' && txHash ? (
                    <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs space-y-2">
                      <div className="flex items-center gap-2 text-emerald-300 font-bold">
                        <Check size={16} />
                        Prasasti Berhasil Diminting On-Chain!
                      </div>
                      <p className="text-[11px] text-emerald-100/80 leading-relaxed">
                        Sumpah pelestarian budaya Anda telah terpatri abadi pada Smart Tourism Chain Ethereum Sepolia.
                      </p>
                      <a
                        href={`${SEPOLIA_CONFIG.blockExplorerUrls[0]}/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:underline"
                      >
                        Buka di Sepolia Etherscan <ExternalLink size={12} />
                      </a>
                    </div>
                  ) : mintStep === 'error' && mintError ? (
                    <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-200">
                      <span className="font-bold block mb-1">Gagal Minting:</span>
                      {mintError}
                    </div>
                  ) : null}

                  <button
                    onClick={handleMintSBT}
                    disabled={isMinting || mintStep === 'success'}
                    className="w-full py-3 px-4 bg-gradient-to-r from-[#8b0000] via-[#a80000] to-[#b30000] hover:brightness-110 active:scale-98 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all shadow-lg shadow-[#8b0000]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isMinting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {mintStep === 'ipfs' ? 'Menyimpan ke IPFS...' : 'Mengonfirmasi Smart Contract ERC-5192...'}
                      </>
                    ) : mintStep === 'success' ? (
                      <>
                        <Award size={15} className="text-amber-300" />
                        Prasasti Telah Diminting (ERC-5192)
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={15} className="text-amber-300" />
                        {wallet?.isConnected ? 'Minting SBT Prasasti Abadi' : 'Hubungkan Wallet & Minting SBT'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Empty Initial State */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-black/40 border border-dashed border-white/10 rounded-3xl min-h-[350px]">
                <div className="p-4 bg-amber-500/10 border border-amber-400/20 rounded-2xl text-amber-400 mb-4 animate-pulse">
                  <Scroll size={36} />
                </div>
                <h4 className="font-serif text-lg font-bold text-white mb-2">
                  Prasasti Belum Dipahat
                </h4>
                <p className="text-xs text-white/50 max-w-md leading-relaxed mb-6">
                  Tuliskan nama Anda dan pilih komitmen pelestarian warisan budaya di kolom sebelah kiri, lalu tekan tombol <strong>"Gubah Prasasti Melayu Kuna"</strong>.
                </p>
                <button
                  onClick={() => handleGenerate()}
                  disabled={isGenerating}
                  className="px-5 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles size={14} />
                  Gubah Sekarang dengan Template
                </button>
              </div>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
}
