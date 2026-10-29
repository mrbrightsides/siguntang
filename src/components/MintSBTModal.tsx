/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  ExternalLink, 
  Loader2, 
  CheckCircle2, 
  FileCode, 
  Globe, 
  Database, 
  Sparkles, 
  AlertCircle,
  Copy,
  Check,
  X,
  Code2
} from 'lucide-react';
import { UniversalNode } from '../types';
import { PALEMBANG_NODES } from '../constants';
import { buildSBTMetadata, pinMetadataToIPFS, IPFSResult } from '../services/ipfsService';
import { mintSoulboundCertificate, switchToSepoliaTestnet, WalletState } from '../services/blockchainService';
import { CONTRACT_ADDRESSES, SEPOLIA_CONFIG } from '../contractData';

interface MintSBTModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultNode?: UniversalNode | null;
  wallet: WalletState | null;
  onConnectWallet: () => void;
}

export function MintSBTModal({
  isOpen,
  onClose,
  defaultNode,
  wallet,
  onConnectWallet
}: MintSBTModalProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(defaultNode?.id || PALEMBANG_NODES[0].id);
  const [recipientName, setRecipientName] = useState('Akhmad Khudri');
  const [certType, setCertType] = useState('Proof-of-Visit');
  const [step, setStep] = useState<'idle' | 'uploading_ipfs' | 'signing_chain' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mintResult, setMintResult] = useState<{
    txHash: string;
    tokenId: number;
    explorerUrl: string;
    ipfsResult: IPFSResult;
    isSimulated?: boolean;
  } | null>(null);

  const [showMetadataPreview, setShowMetadataPreview] = useState(false);
  const [showDeployGuide, setShowDeployGuide] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const selectedNode = PALEMBANG_NODES.find(n => n.id === selectedNodeId) || defaultNode || PALEMBANG_NODES[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleMint = async () => {
    if (!wallet?.isConnected || !wallet.address) {
      onConnectWallet();
      return;
    }

    setStep('uploading_ipfs');
    setErrorMessage(null);

    try {
      // 1. Bangun Metadata SBT standar ERC-5192
      const metadata = buildSBTMetadata({
        nodeId: selectedNode.id,
        nodeName: selectedNode.name,
        category: selectedNode.type,
        recipientAddress: wallet.address,
        recipientName: recipientName.trim() || 'Pelestari Budaya Nusantara',
        certificateType: certType,
        imageUrl: selectedNode.image,
        latitude: selectedNode.location.lat,
        longitude: selectedNode.location.lng
      });

      // 2. Unggah/sematkan metadata ke IPFS
      const ipfsRes = await pinMetadataToIPFS(metadata);

      // 3. Menandatangani & Minting ke Sepolia Testnet
      setStep('signing_chain');
      const res = await mintSoulboundCertificate({
        recipientAddress: wallet.address,
        ipfsUri: ipfsRes.ipfsUri,
        nodeName: selectedNode.name,
        certType
      });

      setMintResult({
        txHash: res.txHash,
        tokenId: res.tokenId,
        explorerUrl: res.explorerUrl,
        ipfsResult: ipfsRes,
        isSimulated: res.isSimulated
      });

      setStep('success');
    } catch (err: any) {
      console.error("Minting SBT Error:", err);
      setErrorMessage(err?.message || 'Gagal melakukan minting token. Pastikan MetaMask Anda terhubung ke jaringan Sepolia.');
      setStep('error');
    }
  };

  const resetForm = () => {
    setStep('idle');
    setMintResult(null);
    setErrorMessage(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-[#141414] text-[#E4E3E0] w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-white/10 my-8"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-white/10 bg-gradient-to-r from-[#1c1212] via-[#141414] to-[#12181c] relative">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex flex-wrap items-center gap-3 mb-2">
                <div className="p-2.5 bg-[#8b0000]/20 border border-[#8b0000]/40 rounded-xl text-[#ff5252]">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[#ff5252] font-bold tracking-widest uppercase">
                      ERC-5192 SOULBOUND TOKEN
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold">
                      SEPOLIA TESTNET
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">
                    Penerbitan Sertifikat Budaya On-Chain
                  </h2>
                </div>
              </div>
              <p className="text-xs text-white/60 mt-1 max-w-xl">
                Sertifikat digital tak-bisa-dipindahtangankan (Soulbound) yang terikat permanen ke wallet Anda dan diverifikasi oleh IPFS & Ethereum Sepolia Testnet.
              </p>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 space-y-6">
              {step === 'success' && mintResult ? (
                /* Success View */
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Lock size={30} />
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
                      LOCKED (ERC-5192 SOULBOUND)
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white mb-2">
                      Sertifikat Berhasil Diterbitkan!
                    </h3>
                    <p className="text-xs text-emerald-200/80 max-w-lg mx-auto">
                      Token ini telah terkunci permanen pada wallet <span className="font-mono text-white">{wallet?.address?.slice(0, 8)}...{wallet?.address?.slice(-6)}</span> dan tidak dapat ditransfer sesuai spesifikasi EIP-5192.
                    </p>
                  </div>

                  {/* Verification Ledger Box */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="font-mono text-xs text-white/50 uppercase">Token ID</span>
                      <span className="font-mono text-sm font-bold text-white">#{mintResult.tokenId}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                      <span className="font-mono text-xs text-white/50 uppercase">Transaction Hash</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#ff6666]">
                          {mintResult.txHash.slice(0, 14)}...{mintResult.txHash.slice(-8)}
                        </span>
                        <button
                          onClick={() => handleCopy(mintResult.txHash)}
                          className="p-1 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-white"
                          title="Salin Hash"
                        >
                          {copiedHash ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                        <a
                          href={mintResult.explorerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 hover:bg-white/10 rounded transition-colors text-[#ff6666] hover:text-[#ff9999]"
                          title="Lihat di Sepolia Etherscan"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                      <span className="font-mono text-xs text-white/50 uppercase">IPFS Canonical URI</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-amber-300">
                          {mintResult.ipfsResult.ipfsUri.slice(0, 18)}...{mintResult.ipfsResult.ipfsUri.slice(-6)}
                        </span>
                        <a
                          href={mintResult.ipfsResult.gatewayUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 hover:bg-white/10 rounded transition-colors text-amber-300 hover:text-amber-200"
                          title="Buka Metadata di IPFS Gateway"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="font-mono text-xs text-white/50 uppercase">Konsensus / Network</span>
                      <span className="font-mono text-xs text-white/90">Ethereum Sepolia (Chain ID: 11155111)</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href={mintResult.explorerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-3 px-4 bg-[#8b0000] hover:bg-[#a50000] text-white font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#8b0000]/25"
                    >
                      Buka Sepolia Etherscan
                      <ExternalLink size={14} />
                    </a>
                    <a
                      href={mintResult.ipfsResult.gatewayUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/15 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-white/15"
                    >
                      Inspeksi IPFS Gateway
                      <Globe size={14} />
                    </a>
                    <button
                      onClick={resetForm}
                      className="py-3 px-5 bg-white/5 hover:bg-white/10 text-white/80 font-mono text-xs uppercase tracking-wider rounded-xl transition-all border border-white/10"
                    >
                      Mint Node Lain
                    </button>
                  </div>
                </div>
              ) : (
                /* Form View */
                <div className="space-y-6">
                  {/* Step status indicators */}
                  {(step === 'uploading_ipfs' || step === 'signing_chain') && (
                    <div className="p-6 rounded-2xl bg-[#8b0000]/10 border border-[#8b0000]/30 flex items-center gap-4 animate-pulse">
                      <Loader2 className="animate-spin text-[#ff5252]" size={28} />
                      <div>
                        <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#ff5252]">
                          {step === 'uploading_ipfs' ? 'Langkah 1/2: Menyematkan Metadata ke IPFS...' : 'Langkah 2/2: Menandatangani Transaksi On-Chain di Sepolia...'}
                        </p>
                        <p className="text-xs text-white/70 mt-0.5">
                          {step === 'uploading_ipfs' 
                            ? 'Menghasilkan JSON skema ERC-5192 dan menghitung Canonical CID.' 
                            : 'Silakan konfirmasi transaksi di jendela pop-up MetaMask Anda.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {step === 'error' && errorMessage && (
                    <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-3">
                      <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
                      <div className="text-xs text-red-200">
                        <p className="font-bold mb-1">Gagal Menerbitkan Token</p>
                        <p className="opacity-90">{errorMessage}</p>
                      </div>
                    </div>
                  )}

                  {/* Form inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="font-mono text-[11px] uppercase tracking-wider text-white/50 block mb-2">
                        Pilih Simpul Budaya Palembang
                      </label>
                      <select
                        value={selectedNodeId}
                        onChange={e => setSelectedNodeId(e.target.value)}
                        disabled={step !== 'idle' && step !== 'error'}
                        className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8b0000] transition-colors"
                      >
                        {PALEMBANG_NODES.map(node => (
                          <option key={node.id} value={node.id}>
                            {node.name} ({node.type})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-mono text-[11px] uppercase tracking-wider text-white/50 block mb-2">
                        Tipe Sertifikat Soulbound
                      </label>
                      <select
                        value={certType}
                        onChange={e => setCertType(e.target.value)}
                        disabled={step !== 'idle' && step !== 'error'}
                        className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8b0000] transition-colors"
                      >
                        <option value="Proof-of-Visit">Proof-of-Visit (Kunjungan Wisata Budaya)</option>
                        <option value="Authentic Craft Provenance">Authentic Craft Provenance (Sertifikasi Karya)</option>
                        <option value="Curator Stewardship">Curator Stewardship (Penjaga Simpul Budaya)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-[11px] uppercase tracking-wider text-white/50 block mb-2">
                      Nama Penerima Sertifikat (Nama / Afiliasi)
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={e => setRecipientName(e.target.value)}
                      placeholder="Masukkan nama penerima..."
                      disabled={step !== 'idle' && step !== 'error'}
                      className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#8b0000] transition-colors"
                    />
                  </div>

                  {/* Connected Wallet Info */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <div>
                        <p className="font-mono text-[10px] uppercase text-white/40">Target Penerima (Wallet)</p>
                        <p className="font-mono text-xs font-semibold text-white">
                          {wallet?.address ? wallet.address : 'Belum Terhubung (Klik Connect)'}
                        </p>
                      </div>
                    </div>
                    {!wallet?.isConnected ? (
                      <button
                        onClick={onConnectWallet}
                        className="py-1.5 px-4 bg-white text-black font-mono text-[10px] uppercase font-bold rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Connect Wallet
                      </button>
                    ) : !wallet.isSepolia ? (
                      <button
                        onClick={() => switchToSepoliaTestnet()}
                        className="py-1.5 px-4 bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-[10px] uppercase font-bold rounded-lg hover:bg-amber-500/30 transition-colors"
                      >
                        Switch ke Sepolia
                      </button>
                    ) : (
                      <span className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        Sepolia Ready
                      </span>
                    )}
                  </div>

                  {/* Deployed Contract Live Badge */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/25 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-mono text-[11px] text-white/70">Smart Contract On-Chain:</span>
                      <span className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                        ERC-5192 SOULBOUND
                      </span>
                    </div>
                    <a
                      href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESSES.STC_CULTURAL_SBT}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs text-emerald-400 hover:text-emerald-300 underline flex items-center gap-1.5 transition-colors"
                      title="Lihat Kontrak di Sepolia Etherscan"
                    >
                      <span>{CONTRACT_ADDRESSES.STC_CULTURAL_SBT.slice(0, 10)}...{CONTRACT_ADDRESSES.STC_CULTURAL_SBT.slice(-6)}</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>

                  {/* Accordion: Live IPFS Metadata Payload */}
                  <div className="border border-white/10 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setShowMetadataPreview(!showMetadataPreview)}
                      className="w-full p-3.5 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between text-left text-xs text-white/80 font-mono"
                    >
                      <span className="flex items-center gap-2">
                        <FileCode size={14} className="text-[#ff5252]" />
                        Pratinjau Metadata JSON (Standar EIP-5192 & IPFS)
                      </span>
                      <span className="text-[10px] text-white/40 uppercase">
                        {showMetadataPreview ? 'Sembunyikan' : 'Buka'}
                      </span>
                    </button>
                    {showMetadataPreview && (
                      <div className="p-4 bg-black/60 border-t border-white/10">
                        <pre className="font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-52 p-3 bg-[#0d0d0d] rounded-lg">
                          {JSON.stringify(
                            buildSBTMetadata({
                              nodeId: selectedNode.id,
                              nodeName: selectedNode.name,
                              category: selectedNode.type,
                              recipientAddress: wallet?.address || '0x0000000000000000000000000000000000000000',
                              recipientName: recipientName.trim() || 'Pelestari Budaya',
                              certificateType: certType,
                              imageUrl: selectedNode.image,
                              latitude: selectedNode.location.lat,
                              longitude: selectedNode.location.lng
                            }),
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <button
                      onClick={handleMint}
                      disabled={step === 'uploading_ipfs' || step === 'signing_chain'}
                      className="w-full py-4 px-6 bg-[#8b0000] hover:bg-[#a00000] text-white font-mono text-xs uppercase tracking-[0.2em] font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#8b0000]/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {step === 'uploading_ipfs' || step === 'signing_chain' ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Memproses ke IPFS & Sepolia...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          Mint Soulbound Certificate ke Sepolia
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
