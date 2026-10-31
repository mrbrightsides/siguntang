/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Upload, 
  Camera, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  RefreshCw, 
  Layers, 
  Award, 
  Info, 
  Cpu, 
  FileCheck,
  ChevronRight,
  Flame,
  Search
} from 'lucide-react';
import { 
  inspectSongketOrArtifact, 
  SongketInspectionResult, 
  PRESET_SPECIMENS, 
  PresetSpecimen 
} from '../services/geminiVisionService';
import { buildSBTMetadata, pinMetadataToIPFS } from '../services/ipfsService';
import { mintSoulboundCertificate, WalletState } from '../services/blockchainService';
import { CONTRACT_ADDRESSES } from '../contractData';

interface AIVisionInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletState | null;
  onConnectWallet: () => void;
}

export function AIVisionInspectorModal({
  isOpen,
  onClose,
  wallet,
  onConnectWallet
}: AIVisionInspectorModalProps) {
  const [selectedSpecimen, setSelectedSpecimen] = useState<PresetSpecimen>(PRESET_SPECIMENS[0]);
  const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);
  const [customMimeType, setCustomMimeType] = useState<string>('image/jpeg');
  const [userPrompt, setUserPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SongketInspectionResult | null>(null);

  // Minting State
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccessData, setMintSuccessData] = useState<{
    txHash: string;
    tokenId?: number;
    ipfsUri: string;
    gatewayUrl: string;
  } | null>(null);
  const [mintError, setMintError] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentImagePreview = customImageBase64 || selectedSpecimen.imageUrl;

  const handleSelectPreset = (specimen: PresetSpecimen) => {
    setSelectedSpecimen(specimen);
    setCustomImageBase64(null);
    setResult(null);
    setMintSuccessData(null);
    setMintError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      const [header, base64] = resultStr.split(',');
      const mime = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
      setCustomImageBase64(base64);
      setCustomMimeType(mime);
      setResult(null);
      setMintSuccessData(null);
      setMintError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setMintSuccessData(null);
    setMintError(null);

    try {
      const data = await inspectSongketOrArtifact({
        imageBase64: customImageBase64 || undefined,
        imageMimeType: customMimeType,
        imageUrl: customImageBase64 ? undefined : selectedSpecimen.imageUrl,
        userNotes: userPrompt || (customImageBase64 ? 'Periksa keaslian kriya dan ragam hias kain songket' : `${selectedSpecimen.title} - ${selectedSpecimen.description}`)
      });
      setResult(data);
    } catch (err) {
      console.error("Gagal analisis vision:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleMintSoulboundToken = async () => {
    if (!result) return;
    setIsMinting(true);
    setMintError(null);

    try {
      // 1. Siapkan recipient address
      const recipientAddr = wallet?.address || '0x17A1e4875c125ad6e89388d9F042A361499495Da';
      const recipientLabel = wallet?.address ? 'Kolektor / Peneliti Terverifikasi STC' : 'Dr. Akhmad Khudri (STC Research Treasury)';

      // 2. Bangun metadata IPFS
      const metadata = buildSBTMetadata({
        nodeId: `kriya-${result.motifName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        nodeName: result.motifName,
        category: result.category,
        recipientAddress: recipientAddr,
        recipientName: recipientLabel,
        certificateType: `Autentikasi Kriya Orisinil (${result.craftsmanshipType})`,
        imageUrl: currentImagePreview,
        latitude: -2.9909,
        longitude: 104.7565
      });

      // Tambahkan traits hasil inspeksi AI Vision ke metadata
      metadata.attributes.push(
        { trait_type: 'AI Vision Authenticity', value: `${result.authenticityScore}%` },
        { trait_type: 'Craftsmanship', value: result.craftsmanshipType },
        { trait_type: 'Material & Thread', value: result.threadOrMaterial },
        { trait_type: 'Historical Era', value: result.historicalEra }
      );

      // 3. Pin ke IPFS
      const ipfsResult = await pinMetadataToIPFS(metadata);

      // 4. Mint Soulbound Certificate di smart contract ERC-5192 Sepolia
      const tx = await mintSoulboundCertificate({
        recipientAddress: recipientAddr,
        ipfsUri: ipfsResult.ipfsUri,
        nodeName: result.motifName,
        certType: `Autentikasi Kriya Orisinil (${result.craftsmanshipType})`
      });

      setMintSuccessData({
        txHash: tx.txHash,
        tokenId: tx.tokenId,
        ipfsUri: ipfsResult.ipfsUri,
        gatewayUrl: ipfsResult.gatewayUrl
      });
    } catch (err: any) {
      console.error("Minting SBT gagal:", err);
      setMintError(err.message || 'Gagal mengeksekusi transaksi minting di smart contract.');
    } finally {
      setIsMinting(false);
    }
  };

  const copyTxHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
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
        className="relative w-full max-w-5xl bg-[#121212] border border-white/15 rounded-3xl shadow-2xl text-white overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#1c1917] via-[#261e1b] to-[#1c1917] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-[#8b0000] to-amber-600 rounded-2xl shadow-md text-white">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white">
                  AI Songket & Cultural Artifact Inspector
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold border border-amber-500/30 uppercase">
                  Gemini 3.8 Flash Vision
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Inspeksi Multimodal Ragam Hias, Keaslian Tenun Gedogan & Minting SBT (ERC-5192) Sepolia
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Image Selection, Upload, & Scanning Preview */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Image Preview Box with Futuristic Cultural HUD */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-900 border border-white/15 group shadow-inner">
              <img
                src={customImageBase64 ? `data:${customMimeType};base64,${customImageBase64}` : selectedSpecimen.imageUrl}
                alt="Artefak Budaya"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Scanning Overlay Effect when analyzing */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-amber-500/10 pointer-events-none flex flex-col items-center justify-center">
                  <motion.div
                    animate={{ y: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b]"
                  />
                  <div className="absolute bottom-4 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-amber-400/40 text-[11px] font-mono text-amber-300 flex items-center gap-2">
                    <RefreshCw size={12} className="animate-spin text-amber-400" />
                    Memindai serat benang & pola ragam hias...
                  </div>
                </div>
              )}

              {/* Top Corner Tag */}
              <div className="absolute top-3 left-3 px-3 py-1 bg-black/75 backdrop-blur-md rounded-xl border border-white/15 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Award size={12} />
                {customImageBase64 ? 'Kustom Artefak Pengguna' : selectedSpecimen.category}
              </div>

              {/* Upload trigger button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/80 hover:bg-[#8b0000] backdrop-blur-md rounded-xl border border-white/20 text-[10px] font-mono text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-lg active:scale-95"
              >
                <Upload size={12} />
                Unggah Foto Sendiri
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Specimen Presets */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-2 font-bold flex items-center justify-between">
                <span>Pilih Spesimen Warisan Klasik:</span>
                {customImageBase64 && (
                  <button
                    onClick={() => {
                      setCustomImageBase64(null);
                      setResult(null);
                    }}
                    className="text-amber-400 hover:underline cursor-pointer lowercase text-[10px]"
                  >
                    (kembali ke katalog)
                  </button>
                )}
              </label>

              <div className="grid grid-cols-2 gap-2">
                {PRESET_SPECIMENS.map((specimen) => {
                  const isSelected = !customImageBase64 && selectedSpecimen.id === specimen.id;
                  return (
                    <button
                      key={specimen.id}
                      onClick={() => handleSelectPreset(specimen)}
                      className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#8b0000]/20 border-[#8b0000] text-white ring-1 ring-[#8b0000]' 
                          : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                      }`}
                    >
                      <p className="font-serif text-xs font-bold truncate">{specimen.title}</p>
                      <p className="text-[9px] text-stone-400 truncate">{specimen.subtitle}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Context Prompt */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1.5 font-bold">
                Fokus Pengamatan / Catatan Pengrajin (Opsional):
              </label>
              <input
                type="text"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Contoh: Periksa benang emas jantung dan kerapatan pakan lepus..."
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400/50"
              />
            </div>

            {/* Run Analysis Action Button */}
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:brightness-110 text-black font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={14} className="animate-spin text-black" />
                  Menganalisis dengan Gemini 3.8 Flash...
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-black" />
                  Mulai Inspeksi AI Vision
                </>
              )}
            </button>
          </div>

          {/* Right Column: AI Vision Breakdown & Soulbound Minting */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {!result && !isAnalyzing ? (
              <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/15 rounded-2xl bg-white/[0.02]">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300 mb-4">
                  <Search size={24} />
                </div>
                <h4 className="font-serif text-lg font-bold text-white mb-2">
                  Siap Melakukan Kurasi Multimodal
                </h4>
                <p className="text-xs text-stone-400 max-w-md leading-relaxed mb-6">
                  Pilih salah satu spesimen klasik Songket Palembang di sebelah kiri atau unggah foto kain tenun/kriya Anda sendiri, lalu klik <strong>"Mulai Inspeksi AI Vision"</strong>.
                </p>
                <div className="grid grid-cols-2 gap-3 max-w-sm text-left">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <p className="font-mono text-[10px] text-amber-300 font-bold uppercase mb-1">Deteksi Ragam Hias</p>
                    <p className="text-[11px] text-stone-300">Mengidentifikasi motif Lepus, Limar, Trenggwele, Pucuk Rebung, dll.</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <p className="font-mono text-[10px] text-emerald-300 font-bold uppercase mb-1">Skor Keaslian</p>
                    <p className="text-[11px] text-stone-300">Menilai tenun gedogan manual vs cetak mesin pabrikan.</p>
                  </div>
                </div>
              </div>
            ) : isAnalyzing ? (
              <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-center p-8 border border-white/10 rounded-2xl bg-white/[0.02]">
                <RefreshCw size={36} className="animate-spin text-amber-400 mb-4" />
                <h4 className="font-serif text-lg font-bold text-white mb-2">
                  Gemini 3.8 Flash Sedang Menginspeksi
                </h4>
                <p className="text-xs text-stone-400 max-w-md">
                  Menganalisis kerapatan rajutan pakan, pantulan benang emas, era historis, dan makna filosofis kriya...
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Result Title & Authenticity Badge */}
                <div className="p-4 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl border border-white/15 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="font-mono text-[9px] text-amber-300 font-bold uppercase tracking-widest block mb-0.5">
                      RAGAM HIAS TERVERIFIKASI
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                      {result.motifName}
                    </h3>
                    <p className="text-xs text-stone-300 font-medium mt-0.5">
                      {result.historicalEra} • {result.genesisContext}
                    </p>
                  </div>

                  {/* Authenticity Score Dial */}
                  <div className="flex items-center gap-3 bg-black/60 px-4 py-2 rounded-2xl border border-emerald-500/30">
                    <div className="text-right">
                      <span className="font-mono text-[9px] text-stone-400 uppercase block">Skor Keaslian</span>
                      <span className="font-mono text-2xl font-black text-emerald-400">
                        {result.authenticityScore}%
                      </span>
                    </div>
                    <ShieldCheck size={28} className="text-emerald-400" />
                  </div>
                </div>

                {/* Craftsmanship & Material Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="font-mono text-[10px] text-stone-400 uppercase block mb-1">
                      Teknik Pengerjaan:
                    </span>
                    <p className="font-semibold text-amber-200">{result.craftsmanshipType}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="font-mono text-[10px] text-stone-400 uppercase block mb-1">
                      Material / Benang:
                    </span>
                    <p className="font-semibold text-stone-200">{result.threadOrMaterial}</p>
                  </div>
                </div>

                {/* Philosophical Narrative */}
                <div className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <Flame size={14} className="text-amber-400" />
                    <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-amber-300">
                      Makna Filosofis & Nilai Luhur
                    </h4>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {result.philosophicalMeaning}
                  </p>

                  {/* Symbolism Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {result.symbolismElements.map((elem, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-amber-500/10 text-amber-300 rounded-lg text-[10px] font-mono border border-amber-500/20"
                      >
                        {elem}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Craft Pointers (Tanda Keaslian Kriya) */}
                <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 space-y-1.5">
                  <span className="font-mono text-[10px] text-stone-400 uppercase font-bold block">
                    Indikator Keaslian Fisik:
                  </span>
                  <ul className="space-y-1 text-[11px] text-stone-300">
                    {result.craftPointers.map((pointer, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{pointer}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* STC Recommendation & On-Chain Minting Section */}
                <div className="pt-2">
                  {mintSuccessData ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-emerald-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={18} className="text-emerald-400" />
                          <h4 className="font-serif text-sm font-bold text-white">
                            Sertifikat Kriya Resmi Diterbitkan (ERC-5192)!
                          </h4>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold rounded-full">
                          LOCKED SOULBOUND
                        </span>
                      </div>

                      <div className="space-y-1.5 font-mono text-[11px]">
                        <div className="flex items-center justify-between bg-black/40 p-2 rounded-lg">
                          <span className="text-stone-400">TX Hash:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-emerald-300 font-bold">
                              {mintSuccessData.txHash.slice(0, 10)}...{mintSuccessData.txHash.slice(-8)}
                            </span>
                            <button
                              onClick={() => copyTxHash(mintSuccessData.txHash)}
                              className="text-stone-400 hover:text-white p-1"
                              title="Salin Hash"
                            >
                              <Copy size={12} />
                            </button>
                            {copiedHash && <span className="text-[9px] text-amber-300">Tersalin!</span>}
                          </div>
                        </div>

                        <div className="flex items-center justify-between bg-black/40 p-2 rounded-lg">
                          <span className="text-stone-400">IPFS Canonical URI:</span>
                          <span className="text-amber-300 truncate max-w-[200px]">
                            {mintSuccessData.ipfsUri}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={`https://sepolia.etherscan.io/tx/${mintSuccessData.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-black font-mono text-[10px] font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-1.5"
                        >
                          Buka Sepolia Etherscan
                          <ExternalLink size={12} />
                        </a>
                        <a
                          href={mintSuccessData.gatewayUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2 px-3 bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-1.5"
                        >
                          Inspeksi IPFS Metadata
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="p-4 bg-gradient-to-br from-[#8b0000]/30 to-[#8b0000]/10 border border-[#8b0000]/40 rounded-2xl space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-mono text-[9px] text-amber-300 uppercase tracking-widest font-bold block">
                            STC TRUST LAYER REGISTRATION
                          </span>
                          <p className="text-xs text-stone-200 mt-0.5">
                            Kunci orisinalitas kriya ini secara permanen ke blockchain Ethereum Sepolia sebagai token Soulbound (EIP-5192) yang tidak dapat dipindahtangankan.
                          </p>
                        </div>
                        <ShieldCheck size={22} className="text-amber-400 shrink-0" />
                      </div>

                      {mintError && (
                        <div className="p-2.5 bg-red-950/80 border border-red-500/40 rounded-xl text-red-200 text-xs">
                          {mintError}
                        </div>
                      )}

                      <button
                        onClick={handleMintSoulboundToken}
                        disabled={isMinting}
                        className="w-full py-3.5 bg-gradient-to-r from-[#8b0000] to-[#b30000] hover:brightness-110 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all shadow-lg shadow-[#8b0000]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isMinting ? (
                          <>
                            <RefreshCw size={14} className="animate-spin text-white" />
                            Memproses IPFS & Minting Sepolia EIP-5192...
                          </>
                        ) : (
                          <>
                            <FileCheck size={15} className="text-amber-300" />
                            Terbitkan Sertifikat Keaslian Kriya (SBT Sepolia)
                          </>
                        )}
                      </button>
                    </div>
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
            <span>STC Multi-Stakeholder Vision Engine • Dr. Akhmad Khudri</span>
          </div>
          <span className="hidden sm:inline text-stone-500">
            Sepolia Contract: {CONTRACT_ADDRESSES.STC_CULTURAL_SBT.slice(0, 8)}...
          </span>
        </div>
      </motion.div>
    </div>
  );
}
