/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Users, 
  ExternalLink, 
  Loader2, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  AlertCircle,
  Copy,
  Check,
  X,
  Compass,
  MapPin
} from 'lucide-react';
import { UniversalNode } from '../types';
import { buildSBTMetadata, pinMetadataToIPFS, IPFSResult } from '../services/ipfsService';
import { mintSoulboundCertificate, switchToSepoliaTestnet, WalletState } from '../services/blockchainService';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: UniversalNode;
  wallet: WalletState | null;
  onConnectWallet: () => void;
}

export function BookingModal({
  isOpen,
  onClose,
  node,
  wallet,
  onConnectWallet
}: BookingModalProps) {
  const [visitorName, setVisitorName] = useState('Akhmad Khudri');
  const [visitDate, setVisitDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [visitorCount, setVisitorCount] = useState('1');
  const [step, setStep] = useState<'idle' | 'uploading' | 'signing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    txHash: string;
    tokenId: number;
    explorerUrl: string;
    ipfsResult: IPFSResult;
  } | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleBook = async () => {
    if (!wallet?.isConnected) {
      onConnectWallet();
      return;
    }

    setStep('uploading');
    setErrorMsg(null);

    try {
      // 1. Bangun Metadata Tiket Reservasi Soulbound
      const metadata = buildSBTMetadata({
        nodeId: node.id,
        nodeName: node.name,
        category: node.type,
        recipientAddress: wallet.address || '',
        recipientName: visitorName.trim() || 'Wisatawan Nusantara',
        certificateType: 'Proof-of-Visit Ticket (Reservasi Budaya)',
        imageUrl: node.image,
        latitude: node.location.lat,
        longitude: node.location.lng
      });

      // Tambahkan atribut spesifik reservasi
      metadata.attributes.push(
        { trait_type: 'Scheduled Visit Date', value: visitDate },
        { trait_type: 'Visitor Quota', value: Number(visitorCount) },
        { trait_type: 'STC Module', value: 'STC Connect & KYC SSI' }
      );

      // 2. Unggah ke IPFS
      const ipfsRes = await pinMetadataToIPFS(metadata);

      // 3. Minting ke Sepolia Testnet
      setStep('signing');
      const res = await mintSoulboundCertificate({
        recipientAddress: wallet.address || '',
        ipfsUri: ipfsRes.ipfsUri,
        nodeName: node.name,
        certType: 'Proof-of-Visit'
      });

      setBookingResult({
        txHash: res.txHash,
        tokenId: res.tokenId,
        explorerUrl: res.explorerUrl,
        ipfsResult: ipfsRes
      });

      setStep('success');
    } catch (err: any) {
      console.error("Booking failed:", err);
      setErrorMsg(err?.message || 'Gagal menerbitkan tiket reservasi on-chain.');
      setStep('error');
    }
  };

  const resetForm = () => {
    setStep('idle');
    setBookingResult(null);
    setErrorMsg(null);
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
            className="bg-[#141414] text-[#E4E3E0] w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-white/10 my-8"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-white/10 bg-gradient-to-r from-[#1c1414] via-[#141414] to-[#12181c] relative">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-[#8b0000]/25 border border-[#8b0000]/50 rounded-xl text-[#ff5252]">
                  <Compass size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[#ff5252] font-bold tracking-widest uppercase">
                      PROOFS-OF-VISIT MINTING
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold">
                      ERC-5192 ON SEPOLIA
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-white">
                    Reservasi & Tiket Digital Budaya
                  </h2>
                </div>
              </div>
              <p className="text-xs text-white/60 mt-1">
                Kunjungan resmi ke <strong className="text-white">{node.name}</strong> dengan tiket berbasis Soulbound Token anti-calo yang terikat permanen ke wallet Anda.
              </p>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 space-y-6">
              {step === 'success' && bookingResult ? (
                /* Ticket Success Pass */
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#16221c] to-[#0f1713] border border-emerald-500/30 text-center relative overflow-hidden">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Lock size={26} />
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
                      TIKET SOULBOUND AKTIF #{bookingResult.tokenId}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white mb-1">
                      Reservasi Terkonfirmasi On-Chain!
                    </h3>
                    <p className="text-xs text-emerald-200/80">
                      Tiket telah dicetak dan terkunci di wallet Anda untuk kunjungan pada <strong className="text-white">{visitDate}</strong>.
                    </p>

                    <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-left font-mono text-xs">
                      <div>
                        <span className="text-white/40 block text-[10px] uppercase">Nama Wisatawan</span>
                        <span className="font-bold text-white">{visitorName}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[10px] uppercase">Jumlah Pengunjung</span>
                        <span className="font-bold text-white">{visitorCount} Orang</span>
                      </div>
                    </div>
                  </div>

                  {/* Verification Ledger Box */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 font-mono text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-white/50 uppercase text-[11px]">Sepolia Transaction</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#ff6666]">
                          {bookingResult.txHash.slice(0, 12)}...{bookingResult.txHash.slice(-6)}
                        </span>
                        <button
                          onClick={() => handleCopy(bookingResult.txHash)}
                          className="p-1 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-white"
                          title="Salin Hash"
                        >
                          {copiedHash ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                        <a
                          href={bookingResult.explorerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 hover:bg-white/10 rounded transition-colors text-[#ff6666] hover:text-[#ff9999]"
                          title="Lihat di Sepolia Etherscan"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/10">
                      <span className="text-white/50 uppercase text-[11px]">IPFS Metadata Tiket</span>
                      <a
                        href={bookingResult.ipfsResult.gatewayUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-300 hover:text-amber-200 underline flex items-center gap-1 text-[11px]"
                      >
                        {bookingResult.ipfsResult.cid.slice(0, 16)}...
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <a
                      href={bookingResult.explorerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:flex-1 py-3.5 px-4 bg-[#8b0000] hover:bg-[#a00000] text-white font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#8b0000]/25"
                    >
                      Buka Sepolia Etherscan
                      <ExternalLink size={14} />
                    </a>
                    <button
                      onClick={resetForm}
                      className="w-full sm:flex-1 py-3.5 px-4 bg-white/10 hover:bg-white/15 text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all border border-white/10"
                    >
                      Reservasi Baru
                    </button>
                  </div>
                </div>
              ) : (
                /* Form View */
                <div className="space-y-5">
                  {(step === 'uploading' || step === 'signing') && (
                    <div className="p-5 rounded-2xl bg-[#8b0000]/15 border border-[#8b0000]/30 flex items-center gap-4 animate-pulse">
                      <Loader2 className="animate-spin text-[#ff5252]" size={26} />
                      <div>
                        <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#ff5252]">
                          {step === 'uploading' ? 'Menyematkan Tiket ke IPFS...' : 'Menandatangani Tiket SBT di Sepolia...'}
                        </p>
                        <p className="text-xs text-white/70 mt-0.5">
                          {step === 'uploading' ? 'Membuat metadata Proof-of-Visit standar EIP-5192.' : 'Silakan konfirmasi transaksi di pop-up MetaMask.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {errorMsg && (
                    <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-3">
                      <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
                      <div className="text-xs text-red-200">
                        <p className="font-bold mb-1">Gagal Reservasi</p>
                        <p className="opacity-90">{errorMsg}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="font-mono text-[11px] uppercase tracking-wider text-white/50 block mb-2">
                      Nama Pengunjung Utama
                    </label>
                    <input
                      type="text"
                      value={visitorName}
                      onChange={e => setVisitorName(e.target.value)}
                      disabled={step !== 'idle' && step !== 'error'}
                      placeholder="Masukkan nama Anda..."
                      className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8b0000]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-[11px] uppercase tracking-wider text-white/50 block mb-2 flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#ff5252]" />
                        Tanggal Kunjungan
                      </label>
                      <input
                        type="date"
                        value={visitDate}
                        onChange={e => setVisitDate(e.target.value)}
                        disabled={step !== 'idle' && step !== 'error'}
                        className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8b0000]"
                      />
                    </div>

                    <div>
                      <label className="font-mono text-[11px] uppercase tracking-wider text-white/50 block mb-2 flex items-center gap-1.5">
                        <Users size={13} className="text-[#ff5252]" />
                        Jumlah Wisatawan
                      </label>
                      <select
                        value={visitorCount}
                        onChange={e => setVisitorCount(e.target.value)}
                        disabled={step !== 'idle' && step !== 'error'}
                        className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8b0000]"
                      >
                        <option value="1">1 Orang (Individu)</option>
                        <option value="2">2 Orang (Pasangan)</option>
                        <option value="3">3-4 Orang (Keluarga)</option>
                        <option value="5">Rombongan Riset Budaya</option>
                      </select>
                    </div>
                  </div>

                  {/* Connected wallet */}
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[10px] uppercase text-white/40">Wallet Penerima Tiket</p>
                      <p className="font-mono text-xs font-semibold text-white">
                        {wallet?.address ? `${wallet.address.slice(0, 10)}...${wallet.address.slice(-6)}` : 'Belum Terhubung'}
                      </p>
                    </div>
                    {!wallet?.isConnected ? (
                      <button
                        onClick={onConnectWallet}
                        className="py-1 px-3 bg-white text-black font-mono text-[10px] uppercase font-bold rounded-lg hover:bg-gray-100"
                      >
                        Connect
                      </button>
                    ) : (
                      <span className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                        Sepolia
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 bg-black/40 rounded-xl border border-white/10 text-[11px] text-white/60 space-y-1">
                    <p className="font-semibold text-white/80">🎫 Mengapa Tiket Berbasis SBT?</p>
                    <p>
                      Tiket ini dicatat sebagai Soulbound Token (ERC-5192) yang tidak bisa dialihkan ke orang lain, memusnahkan praktik percaloan tiket dan menjamin verifikasi presisi untuk analisis statistik STC.
                    </p>
                  </div>

                  <button
                    onClick={handleBook}
                    disabled={step === 'uploading' || step === 'signing'}
                    className="w-full py-4 px-6 bg-[#8b0000] hover:bg-[#a00000] text-white font-mono text-xs uppercase tracking-[0.2em] font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#8b0000]/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {step === 'uploading' || step === 'signing' ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Mencetak Tiket On-Chain...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Konfirmasi & Terbitkan Tiket SBT
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
