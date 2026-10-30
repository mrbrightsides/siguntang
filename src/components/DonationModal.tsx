/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  ExternalLink, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  Copy,
  Check,
  X,
  Wallet as DonationIcon
} from 'lucide-react';
import { UniversalNode } from '../types';
import { donateToHeritageNode, WalletState, switchToSepoliaTestnet } from '../services/blockchainService';
import { CONTRACT_ADDRESSES } from '../contractData';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: UniversalNode;
  wallet: WalletState | null;
  onConnectWallet: () => void;
  onClaimPatronSBT?: (node: UniversalNode) => void;
}

export function DonationModal({
  isOpen,
  onClose,
  node,
  wallet,
  onConnectWallet,
  onClaimPatronSBT
}: DonationModalProps) {
  const [amount, setAmount] = useState('0.001');
  const [isCustom, setIsCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [donationResult, setDonationResult] = useState<{
    txHash: string;
    amount: string;
    explorerUrl: string;
  } | null>(null);

  const finalAmount = isCustom ? customAmount : amount;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDonate = async () => {
    if (!wallet?.isConnected) {
      onConnectWallet();
      return;
    }

    if (!finalAmount || parseFloat(finalAmount) <= 0) {
      setErrorMsg('Masukkan nominal donasi yang valid.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await donateToHeritageNode(finalAmount, node.name);
      setDonationResult(res);
    } catch (err: any) {
      console.error("Donation failed:", err);
      setErrorMsg(err?.message || 'Gagal mengirim donasi on-chain.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setDonationResult(null);
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
            <div className="p-6 md:p-8 border-b border-white/10 bg-gradient-to-r from-[#201010] via-[#141414] to-[#12181c] relative">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-[#8b0000]/25 border border-[#8b0000]/50 rounded-xl text-[#ff5252]">
                  <Heart size={22} className="fill-[#ff5252]/30" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[#ff5252] font-bold tracking-widest uppercase">
                      STC ZERO-LEAKAGE ESCROW
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold">
                      SEPOLIA TESTNET
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-white">
                    Dana Abadi Pelestarian Cagar Budaya
                  </h2>
                </div>
              </div>
              <p className="text-xs text-white/60 mt-1">
                Donasi mikro terdesentralisasi untuk konservasi dan restorasi situs <strong className="text-white">{node.name}</strong> secara transparan tanpa potongan pihak ketiga.
              </p>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 space-y-6">
              {donationResult ? (
                /* Success View */
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 size={32} />
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
                      DONASI ON-CHAIN BERHASIL
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white mb-2">
                      Terima Kasih, Pelestari Budaya!
                    </h3>
                    <p className="text-xs text-emerald-200/80 max-w-md mx-auto">
                      Donasi sebesar <strong className="text-white font-mono">{donationResult.amount} Sepolia ETH</strong> telah diterima langsung oleh dompet konservasi situs {node.name}.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="font-mono text-xs text-white/50 uppercase">Transaction Hash</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#ff6666]">
                          {donationResult.txHash.slice(0, 14)}...{donationResult.txHash.slice(-8)}
                        </span>
                        <button
                          onClick={() => handleCopy(donationResult.txHash)}
                          className="p-1 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-white"
                          title="Salin Hash"
                        >
                          {copiedHash ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                        <a
                          href={donationResult.explorerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 hover:bg-white/10 rounded transition-colors text-[#ff6666] hover:text-[#ff9999]"
                          title="Lihat di Sepolia Etherscan"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className="font-mono text-xs text-white/50 uppercase">Treasury Pelestarian</span>
                      <span className="font-mono text-xs text-emerald-400">
                        {CONTRACT_ADDRESSES.HERITAGE_TREASURY.slice(0, 8)}...{CONTRACT_ADDRESSES.HERITAGE_TREASURY.slice(-6)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    {onClaimPatronSBT && (
                      <button
                        onClick={() => {
                          onClose();
                          onClaimPatronSBT(node);
                        }}
                        className="w-full sm:flex-1 py-3.5 px-4 bg-gradient-to-r from-[#8b0000] to-[#b30000] hover:brightness-110 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#8b0000]/25 cursor-pointer"
                      >
                        <ShieldCheck size={16} className="text-amber-300" />
                        Klaim SBT Donatur Budaya
                      </button>
                    )}
                    <a
                      href={donationResult.explorerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:flex-1 py-3.5 px-4 bg-white/10 hover:bg-white/15 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-white/15"
                    >
                      Buka di Etherscan
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ) : (
                /* Form View */
                <div className="space-y-6">
                  {errorMsg && (
                    <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-3">
                      <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
                      <div className="text-xs text-red-200">
                        <p className="font-bold mb-1">Gagal Mengirim Donasi</p>
                        <p className="opacity-90">{errorMsg}</p>
                      </div>
                    </div>
                  )}

                  {/* Amount Selectors */}
                  <div>
                    <label className="font-mono text-[11px] uppercase tracking-wider text-white/50 block mb-3">
                      Pilih Nominal Donasi (Sepolia ETH)
                    </label>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      {[
                        { label: '0.001 ETH', val: '0.001', note: 'Mikro' },
                        { label: '0.005 ETH', val: '0.005', note: 'Standar' },
                        { label: '0.01 ETH', val: '0.01', note: 'Patron' },
                      ].map(item => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => {
                            setAmount(item.val);
                            setIsCustom(false);
                          }}
                          className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                            !isCustom && amount === item.val
                              ? 'bg-[#8b0000]/20 border-[#ff5252] text-white shadow-lg shadow-[#8b0000]/20'
                              : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                          }`}
                        >
                          <span className="font-mono text-sm font-bold block">{item.label}</span>
                          <span className="text-[10px] text-white/40 uppercase">{item.note}</span>
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsCustom(!isCustom)}
                      className="font-mono text-xs text-[#ff6666] hover:underline"
                    >
                      {isCustom ? '← Pilih dari rekomendasi nominal' : '+ Masukkan nominal kustom'}
                    </button>

                    {isCustom && (
                      <div className="mt-3">
                        <input
                          type="number"
                          step="0.001"
                          placeholder="Contoh: 0.02"
                          value={customAmount}
                          onChange={e => setCustomAmount(e.target.value)}
                          className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#8b0000]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Wallet status */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <div>
                        <p className="font-mono text-[10px] uppercase text-white/40">Donatur (Wallet)</p>
                        <p className="font-mono text-xs font-semibold text-white">
                          {wallet?.address ? `${wallet.address.slice(0, 10)}...${wallet.address.slice(-6)}` : 'Belum Terhubung'}
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

                  {/* Transparency Notice */}
                  <div className="p-3.5 bg-black/40 rounded-xl border border-white/10 text-[11px] text-white/60 space-y-1">
                    <p className="font-semibold text-white/80">✨ Prinsip Kedaulatan Dana STC:</p>
                    <p>
                      Setiap donasi mengalir langsung ke rekening treasury pelestarian cagar budaya tanpa melalui rekening penampung pihak ketiga. Transaksi diverifikasi permanen di Sepolia Testnet.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleDonate}
                    disabled={isLoading}
                    className="w-full py-4 px-6 bg-[#8b0000] hover:bg-[#a00000] text-white font-mono text-xs uppercase tracking-[0.2em] font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#8b0000]/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Mengonfirmasi di MetaMask...
                      </>
                    ) : (
                      <>
                        <DonationIcon size={16} />
                        Kirim Donasi {finalAmount} ETH On-Chain
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
