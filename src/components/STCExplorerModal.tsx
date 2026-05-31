/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Terminal, 
  Database, 
  Search, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  Activity, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Lock
} from 'lucide-react';
import { CONTRACT_ADDRESSES } from '../contractData';

interface STCExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Block {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: string;
  txCount: number;
  gasUsed: string;
  status: 'Validated' | 'Pending';
}

interface BlockchainTx {
  hash: string;
  blockNumber: number;
  type: string;
  from: string;
  to: string;
  value: string;
  payload: string;
}

export function STCExplorerModal({ isOpen, onClose }: STCExplorerModalProps) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedHash, setSelectedHash] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'blocks' | 'transactions' | 'contracts'>('blocks');

  // Hardcoded real contracts
  const contracts = [
    { name: 'HeritageNodeRegistry', address: CONTRACT_ADDRESSES.HERITAGE_NODE_REGISTRY, purpose: 'Registrasi dan validasi hak kepemilikan node sejarah.' },
    { name: 'TraceabilityTransaction', address: CONTRACT_ADDRESSES.TRACEABILITY_TRANSACTION, purpose: 'Pencatatan rincian log donasi dan riwayat aktivitas pelancong.' },
    { name: 'CulturalCertificate', address: CONTRACT_ADDRESSES.CULTURAL_CERTIFICATE, purpose: 'Pemberian sertifikasi digital HAKI orisinalitas UMKM.' }
  ];

  // Hardcoded rich initial block history
  const initialBlocks: Block[] = [
    { number: 4892102, hash: '0x3ec8d9b2a7e28b140cb4e892c3ff1a2b0db21102', parentHash: '0x1c8b32cf78b140cc9a4f892d102e3b44b892101', timestamp: '2026-05-29 07:44:12', txCount: 3, gasUsed: '142,500', status: 'Validated' },
    { number: 4892101, hash: '0x1c8b32cf78b140cc9a4f892d102e3b44b892101', parentHash: '0xfa4a83d9b2e8b140cb4eef102e3ff1a2d9b2a67a', timestamp: '2026-05-29 07:43:01', txCount: 1, gasUsed: '45,800', status: 'Validated' },
    { number: 4892100, hash: '0xfa4a83d9b2e8b140cb4eef102e3ff1a2d9b2a67a', parentHash: '0x8b32d2c7e09b2e8b140cb4d1a2f102c3b4eef12a0', timestamp: '2026-05-29 07:41:44', txCount: 5, gasUsed: '320,120', status: 'Validated' },
    { number: 4892099, hash: '0x8b32d2c7e09b2e8b140cb4d1a2f102c3b4eef12a0', parentHash: '0x21c83aebd2e9b140cb40d1a2e3ff1a2b0db21e09', timestamp: '2026-05-29 07:40:20', txCount: 2, gasUsed: '98,700', status: 'Validated' }
  ];

  // Hardcoded rich initial transaction history
  const transactions: BlockchainTx[] = [
    { hash: '0x7e2db140f1a238cd982a7f05c48921027c8e9b21', blockNumber: 4892102, type: 'RegisterHeritageNode', from: '0xkhudri...9f21 (Owner)', to: CONTRACT_ADDRESSES.HERITAGE_NODE_REGISTRY, value: '0.00 ETH', payload: 'name: "Benteng Kuto Besak", type: "Heritage", address: "Palembang, C9"' },
    { hash: '0x9a4d3b4fa4a83ff102e3b8b32cf78b140cc4ef101', blockNumber: 4892102, type: 'RecordTraceabilityTransaction', from: '0x09d2...b4f2 (Visitor)', to: CONTRACT_ADDRESSES.TRACEABILITY_TRANSACTION, value: '0.10 ETH', payload: 'type: "Donation", node: "Masjid Agung", value: "100.000.000 STC"' },
    { hash: '0x1d2e4f5c8fa4a83ffcf4d4d102eef5c2ebd9b4f42', blockNumber: 4892102, type: 'IssueCulturalCertificate', from: '0xkhudri...9f21 (Owner)', to: CONTRACT_ADDRESSES.CULTURAL_CERTIFICATE, value: '0.00 ETH', payload: 'recipient: "Songket Tuan Kentang", type: "Wastra", key: "authenticity-proof"' },
    { hash: '0x5c8d9b2a7e28b140cb4eef102e3ff1a2d9b2a67bc', blockNumber: 4892101, type: 'RegisterHeritageNode', from: '0xkhudri...9f21 (Owner)', to: CONTRACT_ADDRESSES.HERITAGE_NODE_REGISTRY, value: '0.00 ETH', payload: 'name: "Bukit Siguntang", type: "Budaya", address: "Bukit Kecil, Palembang"' }
  ];

  useEffect(() => {
    setBlocks(initialBlocks);
  }, []);

  // Simulate incoming block generation every 15 seconds
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setBlocks((prev) => {
        const nextNum = prev[0].number + 1;
        const randomHash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
        const newBlock: Block = {
          number: nextNum,
          hash: randomHash,
          parentHash: prev[0].hash,
          timestamp: new Date().toLocaleTimeString(),
          txCount: Math.floor(Math.random() * 4) + 1,
          gasUsed: (Math.floor(Math.random() * 200000) + 40000).toLocaleString(),
          status: 'Validated'
        };
        return [newBlock, ...prev.slice(0, 5)];
      });
    }, 12000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const selectedTx = transactions.find(t => t.hash === selectedHash || t.hash.toLowerCase() === searchQuery.toLowerCase().trim());
  const searchBlock = blocks.find(b => b.number.toString() === searchQuery.trim() || b.hash.toLowerCase() === searchQuery.toLowerCase().trim());

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Main Console */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 text-gray-200 rounded-[32px] overflow-hidden shadow-2xl flex flex-col h-[85vh]"
          >
            {/* Header */}
            <div className="p-6 md:p-8 bg-gradient-to-r from-[#141414] to-[#0a0a0a] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#8b0000]/20 border border-[#8b0000]/40 rounded-2xl relative">
                  <Database className="text-[#ff4d4d]" size={24} />
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full animate-ping" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-xl md:text-2xl font-bold tracking-tight text-white">Smart Tourism Chain Explorer</h2>
                    <span className="text-[9px] font-mono font-bold bg-[#8b0000] px-2 py-0.5 rounded-full text-white tracking-widest uppercase">MAINNET</span>
                  </div>
                  <p className="font-mono text-[9px] text-[#ff4d4d] tracking-widest mt-1 uppercase">Sub-Jaringan Digital Nusantara Gemilang</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Stats Block */}
                <div className="hidden lg:flex items-center gap-6 border-l border-white/10 pl-6 mr-4">
                  <div>
                    <span className="block text-[8px] font-mono text-white/40 uppercase tracking-widest">Network Speed</span>
                    <span className="font-mono text-sm font-bold text-green-400 flex items-center gap-1">
                      <Clock size={12} />
                      12s Block
                    </span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-mono text-white/40 uppercase tracking-widest">Gas Price</span>
                    <span className="font-mono text-sm font-bold text-yellow-400">18.4 Gwei</span>
                  </div>
                </div>

                <button 
                  onClick={onClose}
                  className="p-2.5 bg-white/5 hover:bg-white/10 text-white rounded-full border border-white/10 transition-all active:scale-95"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Custom Search bar */}
            <div className="px-6 py-4 bg-[#111] border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Tabs */}
              <div className="flex gap-2 w-full md:w-auto">
                {[
                  { id: 'blocks', label: 'Blocks Height' },
                  { id: 'transactions', label: 'Transactions Ledger' },
                  { id: 'contracts', label: 'Verified Contracts' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all border ${
                      activeTab === t.id 
                        ? 'bg-[#8b0000] text-white border-[#8b0000] shadow-[#8b0000]/25 shadow-md' 
                        : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Cari block atau hash..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-2 pl-10 text-xs font-mono focus:outline-none focus:border-[#ff4d4d] transition-all text-white"
                />
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar bg-[#0f0f0f]">
              
              {/* Searching result view */}
              {searchQuery.trim() && (
                <div className="mb-8 p-5 bg-[#1a1a1a]/40 border border-white/10 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] uppercase font-bold text-amber-500 tracking-wider flex items-center gap-1.5">
                      <Activity size={12} />
                      HASIL PENCARIAN SYSTEM DATA
                    </span>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="font-mono text-[9px] uppercase tracking-widest text-[#ff4d4d]"
                    >
                      CLEAR SEARCH
                    </button>
                  </div>

                  {selectedTx || searchBlock ? (
                    <div>
                      {selectedTx && (
                        <div className="space-y-3 font-mono text-xs">
                          <div className="text-[#ff4d4d] uppercase font-semibold text-[10px] tracking-widest border-b border-white/5 pb-2">TRANSACTION DATA FOUND</div>
                          <div className="grid grid-cols-4 gap-2">
                            <span className="text-white/40">TX Hash:</span>
                            <span className="col-span-3 text-white break-all">{selectedTx.hash}</span>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            <span className="text-white/40">Type:</span>
                            <span className="col-span-3 text-green-400 font-bold">{selectedTx.type}</span>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            <span className="text-white/40">From:</span>
                            <span className="col-span-3 text-white break-all">{selectedTx.from}</span>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            <span className="text-white/40">Value:</span>
                            <span className="col-span-3 text-white">{selectedTx.value}</span>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            <span className="text-white/40">Argument payload:</span>
                            <span className="col-span-3 text-yellow-400 bg-black/50 p-2 rounded border border-white/5">{selectedTx.payload}</span>
                          </div>
                        </div>
                      )}
                      {searchBlock && (
                        <div className="space-y-3 font-mono text-xs">
                          <div className="text-[#ff4d4d] uppercase font-semibold text-[10px] tracking-widest border-b border-white/5 pb-2">BLOCK DATA FOUND</div>
                          <div className="grid grid-cols-4 gap-2">
                            <span className="text-white/40">Height:</span>
                            <span className="col-span-3 text-white font-bold">{searchBlock.number}</span>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            <span className="text-white/40">Hash:</span>
                            <span className="col-span-3 text-white break-all">{searchBlock.hash}</span>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            <span className="text-white/40">Timestamp:</span>
                            <span className="col-span-3 text-white">{searchBlock.timestamp}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="font-mono text-xs text-white/50">Tidak ada block atau transaksi yang cocok dengan kata kunci: &quot;{searchQuery}&quot;</div>
                  )}
                </div>
              )}

              {/* Tab Blocks */}
              {activeTab === 'blocks' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                      <Layers size={18} className="text-[#ff4d4d]" />
                      Real-time Blocks Chain
                    </h3>
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/40 tracking-wider uppercase">
                      <RefreshCw size={10} className="animate-spin" />
                      Auto Update Enabled
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blocks.map((block) => (
                      <div key={block.number} className="p-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all flex justify-between items-center group">
                        <div className="space-y-3 font-mono">
                          <div className="flex items-center gap-2">
                            <span className="text-[#ff4d4d] font-extrabold text-sm">#{block.number}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/10 rounded-full font-bold">Validated</span>
                          </div>
                          
                          <div className="text-[10px] text-white/50 space-y-1">
                            <div className="flex items-center gap-1">
                              <span className="text-white/30">Hash:</span>
                              <span className="text-white/80 select-all truncate w-48">{block.hash}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-white/30">Tx Count:</span>
                              <span className="text-white">{block.txCount} Transaksi</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-white/30">Gas Used:</span>
                              <span className="text-white">{block.gasUsed} gas units</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex flex-col items-end justify-between h-full space-y-4">
                          <span className="text-[9px] font-mono text-white/40 flex items-center gap-1">
                            <Clock size={10} />
                            {block.timestamp}
                          </span>
                          
                          <button 
                            onClick={() => {
                              setSearchQuery(block.hash);
                              setSelectedHash(null);
                            }}
                            className="p-1 px-2.5 bg-white/5 hover:bg-white/20 border border-white/10 text-[9px] font-mono text-white rounded uppercase tracking-wider transition-all"
                          >
                            Browse
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab Transactions */}
              {activeTab === 'transactions' && (
                <div className="space-y-4 font-mono">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                      <Terminal size={18} className="text-[#ff4d4d]" />
                      Ledger Ledger Transparansi
                    </h3>
                    <span className="text-[9px] text-[#ff4d4d] tracking-widest border border-[#ff4d4d]/30 px-2.5 py-0.5 rounded-full uppercase font-bold">STC v2.4-Secure</span>
                  </div>

                  <div className="overflow-x-auto border border-white/10 rounded-2xl">
                    <table className="w-full text-left text-xs divide-y divide-white/10">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="p-4 uppercase tracking-widest text-[9px] text-white/40">Tx Hash</th>
                          <th className="p-4 uppercase tracking-widest text-[9px] text-white/40">Block No.</th>
                          <th className="p-4 uppercase tracking-widest text-[9px] text-white/40">Function Method</th>
                          <th className="p-4 uppercase tracking-widest text-[9px] text-white/40">Payload Metadata</th>
                          <th className="p-4 uppercase tracking-widest text-[9px] text-white/40 text-right">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {transactions.map((tx) => (
                          <tr key={tx.hash} className="group hover:bg-white/5 transition-colors">
                            <td className="p-4">
                              <button 
                                onClick={() => {
                                  setSearchQuery(tx.hash);
                                  setSelectedHash(tx.hash);
                                }}
                                className="text-green-400 hover:underline select-all text-left block"
                              >
                                {tx.hash.slice(0, 10)}...{tx.hash.slice(-4)}
                              </button>
                            </td>
                            <td className="p-4 text-white">#{tx.blockNumber}</td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 bg-yellow-400/10 text-yellow-500 rounded border border-yellow-400/25 text-[9px] font-bold">
                                {tx.type}
                              </span>
                            </td>
                            <td className="p-4 text-white/60 text-[10px] font-mono max-w-xs truncate">{tx.payload}</td>
                            <td className="p-4 text-right font-bold text-white">{tx.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab Contracts */}
              {activeTab === 'contracts' && (
                <div className="space-y-6 font-mono">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                      <ShieldCheck size={18} className="text-[#ff4d4d]" />
                      Smart Contracts Terverifikasi
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {contracts.map((contract) => (
                      <div key={contract.name} className="p-6 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden group">
                        
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform text-[#ff4d4d]">
                          <ShieldCheck size={160} />
                        </div>

                        <div className="relative z-10 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#ff4d4d] text-sm flex items-center gap-1.5">
                              <FileCheck2 size={16} />
                              {contract.name}.sol
                            </span>
                            <span className="text-[8px] uppercase tracking-widest px-2.5 py-0.5 font-bold text-green-400 bg-green-500/10 border border-green-500/20 rounded-full">
                              VERIFIED & DEPLOYED
                            </span>
                          </div>

                          <p className="text-xs text-white/60 tracking-wide font-sans">{contract.purpose}</p>

                          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/5">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-white/40 uppercase">Address:</span>
                              <span className="text-[10px] text-white break-all font-mono select-all select-none">{contract.address}</span>
                            </div>
                            
                            <a 
                              href={`https://sepolia.etherscan.io/address/${contract.address}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[9px] font-mono text-[#ff4d4d] hover:underline flex items-center gap-1 sm:self-auto self-start"
                            >
                              Etherscan Contract Link
                              <ExternalLink size={10} />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Footer console lines */}
            <div className="p-4 bg-black border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-2 text-[10px] font-mono text-white/40">
                <Cpu size={12} className="text-[#ff4d4d]" />
                <span>SIGUNTANG Network Engine Console V2.4-Live On-Chain Mode</span>
              </div>
              <div className="flex items-center gap-2 text-[9px] font-mono text-green-400 font-bold uppercase">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                STC MAINNET NODE SYNCHRONIZATION RESPONDING (12ms)
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
