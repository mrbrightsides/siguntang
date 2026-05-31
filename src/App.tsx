/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { NodeCard } from './components/NodeCard';
import { STCDashboard } from './components/STCDashboard';
import { AIGuide } from './components/AIGuide';
import { PALEMBANG_NODES } from './constants';
import { UniversalNode, NodeType } from './types';
import { HeritageMap } from './components/HeritageMap';
import { TraceabilityHub } from './components/TraceabilityHub';
import { STCExplorerModal } from './components/STCExplorerModal';
import { connectWallet, WalletState, recordTraceabilityTransaction } from './services/blockchainService';
import { Shield, Sparkles, ChevronRight, Globe, Database, ArrowUpRight, Map as MapIcon, X, Calendar, Wallet as DonationIcon, Download } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [selectedNode, setSelectedNode] = useState<UniversalNode | null>(null);
  const [activeTab, setActiveTab] = useState<NodeType | 'All'>('All');
  const [showSTC, setShowSTC] = useState<UniversalNode | null>(null);
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [txLoading, setTxLoading] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);

  const handleConnectWallet = async () => {
    const state = await connectWallet();
    if (state) {
      setWallet(state);
    }
  };

  const handleTransaction = async (type: string, nodeName: string, amount: string) => {
    if (!wallet?.isConnected) {
      alert('Metamask authentication required.');
      return;
    }
    setTxLoading(true);
    try {
      const hash = await recordTraceabilityTransaction(
        type,
        nodeName,
        amount,
        `metadata-node-${nodeName.toLowerCase().replace(/\s/g, '-')}`
      );
      if (hash) {
        alert(`Transaction Secured on Blockchain! TX: ${hash}`);
      }
    } catch (error) {
      alert('Transaction failed. Check network stability.');
    } finally {
      setTxLoading(false);
    }
  };

  const filteredNodes = activeTab === 'All' 
    ? PALEMBANG_NODES 
    : PALEMBANG_NODES.filter(n => n.type === activeTab);

  return (
    <div className="min-h-screen bg-[#f5f2ed] text-[#1a1a1a] font-sans selection:bg-[#8b0000] selection:text-white">
      <Navbar walletAddress={wallet?.address || null} onConnectWallet={handleConnectWallet} />
      
      {/* Hero Section - The Universal Gate */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-[#8b0000]/10 border border-[#8b0000]/20 rounded-full mb-6"
              >
                <Sparkles size={14} className="text-[#8b0000]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b0000]">Smart Tourism Chain v2.0</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-serif text-5xl md:text-7xl font-bold leading-[1.1] mb-8"
              >
                Gerbang Universal <br /> 
                <span className="text-[#8b0000]">Node Nusantara</span>
              </motion.h1>
              
              <div className="mb-8 p-4 bg-white/40 border-l-4 border-[#8b0000] backdrop-blur-sm rounded-r-xl">
                <p className="font-serif italic text-xl text-[#1a1a1a]">
                  “Peta Hidup Budaya Palembang”
                </p>
              </div>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Integrasi cerdas aset budaya, religi, dan sejarah Palembang dalam ekosistem digital berbasis blockchain dan Artifical Intelligence.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
              >
                <button 
                  onClick={() => document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-[#8b0000] text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#a00000] transition-colors flex items-center gap-2 shadow-xl shadow-[#8b0000]/20"
                >
                  Explore Heritage
                  <ChevronRight size={16} />
                </button>
                <button 
                  onClick={() => setIsExplorerOpen(true)}
                  className="px-8 py-4 bg-white text-[#1a1a1a] border border-black/5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  View Network
                  <Globe size={16} />
                </button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 flex items-center justify-center lg:justify-start gap-8"
              >
                <div className="flex flex-col items-center lg:items-start">
                  <span className="font-serif text-3xl font-bold text-[#8b0000]">120+</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Cultural Nodes</span>
                </div>
                <div className="w-px h-10 bg-black/10" />
                <div className="flex flex-col items-center lg:items-start">
                  <span className="font-serif text-3xl font-bold text-[#8b0000]">100%</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Traceable</span>
                </div>
                <div className="w-px h-10 bg-black/10" />
                <div className="flex flex-col items-center lg:items-start">
                  <span className="font-serif text-3xl font-bold text-[#8b0000]">24/7</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">AI Assistance</span>
                </div>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex-1 relative"
            >
              <div className="relative z-10 w-full aspect-square max-w-[500px] mx-auto bg-white rounded-[40px] p-4 shadow-2xl rotate-3">
                <img 
                  src="https://i.imgur.com/oRfzTOT.jpeg" 
                  className="w-full h-full object-cover rounded-[32px]"
                  alt="Palembang Jembatan Ampera"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-6 -left-6 p-6 bg-[#1a1a1a] text-white rounded-3xl shadow-2xl -rotate-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="text-[#8b0000]" size={20} />
                    <span className="font-mono text-[10px] uppercase tracking-widest font-bold">STC AUTHENTICATED</span>
                  </div>
                  <p className="font-serif text-lg">Ampera Heritage Node</p>
                </div>
              </div>
              
              {/* Background Elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#8b0000]/5 rounded-full blur-[100px] -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section: Transforming Passive to Active */}
      <section className="py-24 bg-[#8b0000] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-8 leading-tight">
                Menghidupkan Kembali <br />
                <span className="opacity-60 underline decoration-white/30 decoration-2">Node Budaya</span>
              </h2>
              <div className="space-y-6 text-white/80">
                <p className="text-lg">
                  Warisan budaya selama ini seringkali bersifat pasif—hanya menjadi latar foto tanpa narasi yang mendalam.
                </p>
                <p className="text-lg">
                  SIGUNTANG hadir untuk memecahkan masalah dokumentasi konvensional dan cerita sejarah yang tercecer, mengubahnya menjadi <strong>ekosistem digital interaktif</strong> yang hidup.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Situs Heritage', icon: '🏛️' },
                { title: 'Masjid Tua', icon: '🕌' },
                { title: 'Pengrajin Songket', icon: '🧶' },
                { title: 'Jalur Sejarah', icon: '🛶' },
                { title: 'Kuliner Khas', icon: '🍲' },
                { title: 'Cerita Rakyat', icon: '🗣️' }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h4 className="font-bold uppercase tracking-widest text-[11px]">{item.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Explorer Section */}
      <section id="explorer" className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="font-serif text-4xl font-bold mb-4 tracking-tight">Eksplorasi Node Nusantara</h2>
              <p className="text-gray-500 max-w-md">Jelajahi setiap titik cerdas dalam ekosistem SIGUNTANG yang mewakili identitas lokal Palembang.</p>
            </div>
            
            <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar">
              {['All', ...Object.values(NodeType)].map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveTab(type as any)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap",
                    activeTab === type 
                      ? "bg-[#8b0000] border-[#8b0000] text-white shadow-lg shadow-[#8b0000]/20" 
                      : "bg-white border-black/5 text-gray-500 hover:border-[#8b0000]/30"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredNodes.map((node) => (
                <NodeCard 
                  key={node.id} 
                  node={node}
                  onViewDetails={setSelectedNode}
                  onViewTraceability={setShowSTC}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Heritage Map Section */}
      <section id="map" className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8b0000]/10 border border-[#8b0000]/20 rounded-full mb-6">
              <MapIcon size={14} className="text-[#8b0000]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b0000]">Geo-Spatial Heritage Network</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 tracking-tight">Peta Jaringan Nusantara</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Visualisasi distribusi node budaya dan religi di seluruh wilayah Kota Palembang yang terintegrasi dalam Smart Tourism Chain.</p>
          </div>

          <HeritageMap 
            nodes={PALEMBANG_NODES} 
            onNodeClick={setSelectedNode} 
          />
        </div>
      </section>

      {/* Traceability Section */}
      <section id="traceability" className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/5 border border-black/10 rounded-full mb-6">
              <Database size={14} className="text-[#8b0000]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]">Digital Trust Infrastructure</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 tracking-tight">Traceability Hub</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Monitor keamanan data dan keaslian histori aset melalui ledger blockchain yang transparan.</p>
          </div>

          <TraceabilityHub onLaunchExplorer={() => setIsExplorerOpen(true)} />
        </div>
      </section>

      {/* STC Overview Section */}
      <section className="py-24 bg-[#1a1a1a] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-10">
          <Database size={400} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="w-16 h-16 bg-[#8b0000] flex items-center justify-center rounded-2xl mb-8">
                <Shield size={32} />
              </div>
              <h2 className="font-serif text-4xl font-bold mb-8 leading-tight">Blockchain sebagai <br /><span className="text-[#8b0000]">Trust Layer Utama</span></h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <span className="font-mono text-sm">01</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Autentikasi Informasi</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">Bukan sekadar gimmick, blockchain di SIGUNTANG adalah fondasi validasi untuk sejarah aset, histori artefak, dan transparansi donasi religi.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <span className="font-mono text-sm">02</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Sertifikat Digital UMKM</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">Memberikan bukti autentisitas digital bagi pengrajin songket dan produk budaya lokal agar memiliki nilai global yang terverifikasi.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <span className="font-mono text-sm">03</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Infrastruktur Smart Tourism</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">Menjadi fondasi arsitektur jaringan yang menghubungkan ribuan node budaya Nusantara dalam satu sistem integrasi yang cerdas.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-[40px] p-10 text-[#1a1a1a]">
              <div className="flex items-center justify-between mb-10">
                <h3 className="font-serif text-2xl font-bold">STC Network Status</h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-100">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Synchronized
                </div>
              </div>

              <div className="space-y-6">
                {[ 
                  { label: 'Blockchain Height', value: '#4,892,102' },
                  { label: 'Active Cultural Nodes', value: '1,248' },
                  { label: 'Validated Transactions', value: '124.5k' },
                  { label: 'Network Latency', value: '12ms' }
                ].map((item, i) => (
                  <div key={i} className="flex items-baseline justify-between py-4 border-b border-black/5 last:border-0">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">{item.label}</span>
                    <span className="font-mono text-lg font-bold">{item.value}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setIsExplorerOpen(true)}
                className="w-full mt-12 py-4 bg-[#1a1a1a] text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2"
              >
                Launch Explorer Console
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-2">SIGUNTANG</h2>
              <p className="text-xs uppercase tracking-widest font-bold text-[#8b0000]">Nusantara Gemilang</p>
            </div>
            <div className="flex gap-12">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-widest mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="#" className="hover:text-[#8b0000]">Explorer</a></li>
                  <li><a href="#" className="hover:text-[#8b0000]">Heritage Map</a></li>
                  <li><a href="#" className="hover:text-[#8b0000]">Traceability</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-widest mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="#" className="hover:text-[#8b0000]">STC Protocol</a></li>
                  <li><a href="#" className="hover:text-[#8b0000]">Data Sovereign</a></li>
                  <li><a href="#" className="hover:text-[#8b0000]">Governance</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-20 pt-10 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-gray-400">© 2026 SIGUNTANG (Sistem Integrasi Gerbang Universal Node Traceability AI Nusantara Gemilang). Powered by STC (Smart Tourism Chain).</p>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-[#8b0000]" />
              <span className="text-[10px] font-mono text-gray-400">V.2.4.0-STC_MAINNET</span>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Assistant */}
      <AIGuide />

      {/* Node Detail Modal */}
      <AnimatePresence>
        {selectedNode && (
          <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setSelectedNode(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row h-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedNode(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-black/10 hover:bg-black/20 text-black rounded-full flex items-center justify-center transition-all"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                <img 
                  src={selectedNode.image} 
                  alt={selectedNode.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <MapIcon size={14} className="text-white" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">{selectedNode.location.address}</span>
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-white leading-tight">{selectedNode.name}</h3>
                </div>
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto no-scrollbar">
                <div className="flex items-center gap-3 mb-8">
                  <div className="px-3 py-1 bg-[#8b0000]/10 border border-[#8b0000]/20 rounded-full">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b0000]">{selectedNode.id}</span>
                  </div>
                  <div className="px-3 py-1 bg-black/5 border border-black/10 rounded-full">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{selectedNode.type}</span>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed mb-10">
                  {selectedNode.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <button 
                    disabled={txLoading}
                    onClick={() => handleTransaction('Booking', selectedNode.name, '0.01')}
                    className="flex flex-col items-center justify-center gap-3 p-6 bg-[#f5f2ed] border border-black/5 rounded-3xl hover:bg-[#8b0000]/5 transition-all text-[#1a1a1a] disabled:opacity-50"
                  >
                    <Calendar size={20} className="text-[#8b0000]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-center">Book Visit</span>
                  </button>
                  <button 
                    disabled={txLoading}
                    onClick={() => handleTransaction('Donation', selectedNode.name, '0.1')}
                    className="flex flex-col items-center justify-center gap-3 p-6 bg-[#f5f2ed] border border-black/5 rounded-3xl hover:bg-[#8b0000]/5 transition-all text-[#1a1a1a] disabled:opacity-50"
                  >
                    <DonationIcon size={20} className="text-[#8b0000]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-center">Donate STC</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      setShowSTC(selectedNode);
                      setSelectedNode(null);
                    }}
                    className="w-full py-4 bg-[#8b0000] text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-[#a00000] transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#8b0000]/20"
                  >
                    View Secure Traceability
                    <Shield size={16} />
                  </button>
                  <button className="w-full py-4 bg-transparent border border-black/10 text-black rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-black/5 transition-all flex items-center justify-center gap-3">
                    Download Audio Story
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <STCDashboard 
        node={showSTC || selectedNode || PALEMBANG_NODES[0]} 
        isOpen={!!showSTC} 
        onClose={() => setShowSTC(null)} 
      />

      <STCExplorerModal
        isOpen={isExplorerOpen}
        onClose={() => setIsExplorerOpen(false)}
      />
    </div>
  );
}

