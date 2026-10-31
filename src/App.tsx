/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
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
import { LegalModal, LegalTab } from './components/LegalModal';
import { STCEcosystemModal } from './components/STCEcosystemModal';
import { MusiCruiseDiorama } from './components/MusiCruiseDiorama';
import { MintSBTModal } from './components/MintSBTModal';
import { DonationModal } from './components/DonationModal';
import { BookingModal } from './components/BookingModal';
import { AIVisionInspectorModal } from './components/AIVisionInspectorModal';
import { MusiStorytellerModal } from './components/MusiStorytellerModal';
import { MusiPlannerModal } from './components/MusiPlannerModal';
import { MusiWeatherType } from './services/musiAudioEngine';
import { connectWallet, WalletState, recordTraceabilityTransaction } from './services/blockchainService';
import { SEPOLIA_CONFIG } from './contractData';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Shield, Sparkles, ChevronRight, Globe, Database, ArrowUpRight, Map as MapIcon, X, Calendar, Wallet as DonationIcon, Download, Compass, Layers, Lock, BookOpen } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [selectedNode, setSelectedNode] = useState<UniversalNode | null>(null);
  const [activeTab, setActiveTab] = useState<NodeType | 'All'>('All');
  const [showSTC, setShowSTC] = useState<UniversalNode | null>(null);
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [txLoading, setTxLoading] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [isSTCEcosystemOpen, setIsSTCEcosystemOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTab | null>(null);
  const [isMintSBTOpen, setIsMintSBTOpen] = useState(false);
  const [mintTargetNode, setMintTargetNode] = useState<UniversalNode | null>(null);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [donationTargetNode, setDonationTargetNode] = useState<UniversalNode | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingTargetNode, setBookingTargetNode] = useState<UniversalNode | null>(null);
  const [isAIVisionOpen, setIsAIVisionOpen] = useState(false);
  const [isStorytellerOpen, setIsStorytellerOpen] = useState(false);
  const [storytellerWeather, setStorytellerWeather] = useState<MusiWeatherType>('senja');
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleChainChanged = (chainIdHex: string) => {
        const chainId = parseInt(chainIdHex, 16);
        setWallet(prev => prev ? {
          ...prev,
          chainId,
          isSepolia: chainId === SEPOLIA_CONFIG.chainId
        } : null);
      };

      const handleAccountsChanged = (accounts: string[]) => {
        if (!accounts || accounts.length === 0) {
          setWallet(null);
        } else {
          setWallet(prev => prev ? { ...prev, address: accounts[0] } : null);
        }
      };

      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener('chainChanged', handleChainChanged);
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, []);

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
      <Navbar 
        walletAddress={wallet?.address || null} 
        onConnectWallet={handleConnectWallet} 
        onOpenSTCEcosystem={() => setIsSTCEcosystemOpen(true)}
      />
      
      {/* Hero Section - The Universal Gate */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">              
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
                  onClick={() => document.getElementById('expedition')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-[#8b0000] text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#a00000] transition-all flex items-center gap-2 shadow-xl shadow-[#8b0000]/25 hover:scale-[1.02] active:scale-95"
                >
                  <Compass size={16} />
                  Naik Ketek & Jelajah Musi
                </button>
                <button 
                  onClick={() => document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-white text-[#1a1a1a] border border-black/10 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
                >
                  Explore Heritage Nodes
                  <ChevronRight size={16} />
                </button>
                <button 
                  onClick={() => setIsExplorerOpen(true)}
                  className="px-6 py-4 bg-black/5 text-[#1a1a1a] hover:bg-black/10 rounded-2xl font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
                >
                  <Globe size={16} />
                  Network
                </button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 flex items-center justify-center lg:justify-start gap-8"
              >
                <div className="flex flex-col items-center lg:items-start">
                  <span className="font-serif text-3xl font-bold text-[#8b0000]">5 Rute</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Folklore Musi</span>
                </div>
                <div className="w-px h-10 bg-black/10" />
                <div className="flex flex-col items-center lg:items-start">
                  <span className="font-serif text-3xl font-bold text-[#8b0000]">120+</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Cultural Nodes</span>
                </div>
                <div className="w-px h-10 bg-black/10" />
                <div className="flex flex-col items-center lg:items-start">
                  <span className="font-serif text-3xl font-bold text-[#8b0000]">100%</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Traceable STC</span>
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

      {/* Musi River Cruise Folklore Diorama Section */}
      <MusiCruiseDiorama 
        onNodeSelect={(name) => {
          const found = PALEMBANG_NODES.find(n => n.name.toLowerCase().includes(name.toLowerCase()));
          if (found) setSelectedNode(found);
        }}
        onOpenStoryteller={(w) => {
          setStorytellerWeather(w);
          setIsStorytellerOpen(true);
        }}
        onOpenPlanner={() => setIsPlannerOpen(true)}
      />

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
      <section id="explorer" className="py-24 bg-white/50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8b0000]/10 border border-[#8b0000]/20 rounded-full mb-3">
                <Globe size={14} className="text-[#8b0000]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b0000]">Direktori Simpul Budaya Palembang</span>
              </div>
              <h2 className="font-serif text-4xl font-bold mb-4 tracking-tight">Eksplorasi Node Nusantara</h2>
              <p className="text-gray-500 max-w-xl">Direktori simpul budaya Palembang lengkap dengan kategori, narasi kurasi, koordinat spasial, dan status verifikasi smart contract.</p>
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
      <section id="map" className="py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8b0000]/10 border border-[#8b0000]/20 rounded-full mb-6">
              <MapIcon size={14} className="text-[#8b0000]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b0000]">Peta Interaktif Lokasi Budaya</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 tracking-tight">Peta Jaringan Nusantara</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Peta interaktif persebaran lokasi budaya dan religi Kota Palembang dengan penanda spasial serta informasi mendalam setiap situs bersejarah.</p>
          </div>

          <ErrorBoundary fallbackTitle="Peta Budaya Palembang Sedang Dimuat">
            <HeritageMap 
              nodes={PALEMBANG_NODES} 
              onNodeClick={setSelectedNode} 
            />
          </ErrorBoundary>
        </div>
      </section>

      {/* Traceability Section */}
      <section id="traceability" className="py-24 bg-white/50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/5 border border-black/10 rounded-full mb-6">
              <Database size={14} className="text-[#8b0000]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]">Digital Trust & Verification Mechanism</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 tracking-tight">Traceability Hub</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Mekanisme pencatatan terdistribusi, ringkasan hash SHA-256, verifikasi integritas narasi, serta riwayat aktivitas transaksi donasi yang transparan.</p>
          </div>

          <TraceabilityHub 
            onLaunchExplorer={() => setIsExplorerOpen(true)} 
            onOpenMintSBT={() => {
              setMintTargetNode(null);
              setIsMintSBTOpen(true);
            }}
          />
        </div>
      </section>

      {/* STC Overview Section */}
      <section className="py-24 bg-[#1a1a1a] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-10">
          <Database size={400} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8b0000]/30 border border-[#8b0000]/50 rounded-full mb-6">
                <Shield size={14} className="text-[#ff4d4d]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">Kajian Disertasi Doktor • Universitas Sriwijaya</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Blockchain sebagai <br />
                <span className="text-[#8b0000]">Trust Layer Utama</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Bukan sekadar gimmick, teknologi di SIGUNTANG berakar langsung dari riset doktoral <strong>Smart Tourism Chain (STC)</strong>. Menjadi jembatan antara aplikasi pariwisata, perangkat IoT, dan ledger terdistribusi dengan 12 modul ekosistem terpadu.
              </p>

              <div className="space-y-6">
                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                    <span className="font-mono text-sm text-[#ff4d4d] font-bold">01</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-base mb-1">Integritas Narasi & Hashing Metadata</h4>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">Menjamin data sejarah artefak dan simpul budaya tidak dapat diubah sepihak dengan SHA-256 state hashing.</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                    <span className="font-mono text-sm text-[#ff4d4d] font-bold">02</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-base mb-1">Mitigasi Karbon & FOLU Net Sink 2030</h4>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">Melalui modul STC CarbonPrint & ImpactViz, konsumsi komputasi dan pelayaran ketek dipetakan ke target emisi riil SDGs.</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                    <span className="font-mono text-sm text-[#ff4d4d] font-bold">03</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-base mb-1">Identitas Berdaulat (SSI & KYC) UMKM</h4>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">Sertifikat digital terverifikasi bagi maestro pengrajin songket dan pelaku ekonomi kreatif lokal tanpa ketergantungan pihak ketiga.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsSTCEcosystemOpen(true)}
                  className="px-6 py-3.5 bg-[#8b0000] hover:bg-[#a00000] text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-[#8b0000]/30 active:scale-95 cursor-pointer"
                >
                  <Layers size={16} />
                  Jelajahi 12 Modul STC Ecosystem
                </button>
                <button
                  onClick={() => setLegalModalTab('protocol')}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2 cursor-pointer"
                >
                  Baca Dokumen Protokol
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-[40px] p-8 sm:p-10 text-[#1a1a1a] shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8b0000]">Smart Tourism Chain</span>
                  <h3 className="font-serif text-2xl font-bold">STC Network Status</h3>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-100">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Synchronized
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {[ 
                  { label: 'Blockchain Height', value: '#4,892,102' },
                  { label: 'Active Cultural Nodes', value: '1,248' },
                  { label: 'Validated Transactions', value: '124.5k' },
                  { label: 'Gas Converter Rate', value: 'IDR Real-time' },
                  { label: 'Carbon Measurement', value: 'FOLU 2030 Ready' }
                ].map((item, i) => (
                  <div key={i} className="flex items-baseline justify-between py-3 border-b border-black/5 last:border-0">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">{item.label}</span>
                    <span className="font-mono text-base font-bold">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Ecosystem Mini Badges */}
              <div className="p-4 bg-[#f5f2ed] rounded-2xl mb-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
                  Terintegrasi ke Suite Riset STC:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['CarbonPrint', 'ImpactViz', 'Connect API', 'KYC SSI', 'GasVision', 'Converter'].map((tag) => (
                    <span key={tag} className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-white border border-black/5 rounded-lg text-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setIsExplorerOpen(true)}
                  className="py-3.5 bg-[#1a1a1a] text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Explorer Console
                  <ArrowUpRight size={14} />
                </button>
                <button 
                  onClick={() => setIsSTCEcosystemOpen(true)}
                  className="py-3.5 bg-[#8b0000]/10 text-[#8b0000] hover:bg-[#8b0000]/20 rounded-2xl font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  12 Modul STC
                  <Layers size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
            <a href="#" className="flex items-center transition-opacity hover:opacity-90">
              <img 
                src="https://i.imgur.com/E0EOmhA.png" 
                alt="SIGUNTANG Nusantara Gemilang" 
                className="h-10 md:h-12 w-auto object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://i.imgur.com/E0EOmhA.png';
                }}
              />
            </a>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 lg:gap-14">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-widest mb-4 text-[#1a1a1a]">Platform</h4>
                <ul className="space-y-2.5 text-sm text-gray-500">
                  <li>
                    <a 
                      href="#explorer" 
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="hover:text-[#8b0000] flex items-center gap-2 transition-colors group"
                    >
                      <span className="font-semibold text-gray-700 group-hover:text-[#8b0000]">Explorer</span>
                      <span className="text-[10px] text-gray-400 font-mono">/ Simpul Budaya</span>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#map" 
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="hover:text-[#8b0000] flex items-center gap-2 transition-colors group"
                    >
                      <span className="font-semibold text-gray-700 group-hover:text-[#8b0000]">Heritage Map</span>
                      <span className="text-[10px] text-gray-400 font-mono">/ Peta Interaktif</span>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#traceability" 
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('traceability')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="hover:text-[#8b0000] flex items-center gap-2 transition-colors group"
                    >
                      <span className="font-semibold text-gray-700 group-hover:text-[#8b0000]">Traceability</span>
                      <span className="text-[10px] text-gray-400 font-mono">/ Verifikasi Hash</span>
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-widest mb-4 text-[#1a1a1a]">Knowledge & Protocol</h4>
                <ul className="space-y-2.5 text-sm text-gray-500">
                  <li>
                    <button 
                      onClick={() => setIsSTCEcosystemOpen(true)}
                      className="hover:text-[#8b0000] text-left transition-colors flex items-center gap-2 group cursor-pointer"
                    >
                      <span className="font-semibold text-[#8b0000] group-hover:underline">STC Ecosystem (12 Modul)</span>
                      <span className="text-[10px] bg-[#8b0000]/10 text-[#8b0000] font-mono px-1.5 py-0.2 rounded font-bold">Riset</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setLegalModalTab('protocol')}
                      className="hover:text-[#8b0000] text-left transition-colors flex items-center gap-2 group cursor-pointer"
                    >
                      <span className="font-semibold text-gray-700 group-hover:text-[#8b0000]">STC Protocol</span>
                      <span className="text-[10px] text-gray-400 font-mono">/ Overview</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setLegalModalTab('sovereignty')}
                      className="hover:text-[#8b0000] text-left transition-colors flex items-center gap-2 group cursor-pointer"
                    >
                      <span className="font-semibold text-gray-700 group-hover:text-[#8b0000]">Data Sovereignty</span>
                      <span className="text-[10px] text-gray-400 font-mono">/ Kedaulatan</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setLegalModalTab('governance')}
                      className="hover:text-[#8b0000] text-left transition-colors flex items-center gap-2 group cursor-pointer"
                    >
                      <span className="font-semibold text-gray-700 group-hover:text-[#8b0000]">Governance</span>
                      <span className="text-[10px] text-gray-400 font-mono">/ Stewardship</span>
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-widest mb-4 text-[#1a1a1a] flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#8b0000]" />
                  Blockchain & AI
                </h4>
                <div className="flex flex-col gap-2.5">
                  <button 
                    onClick={() => setIsAIVisionOpen(true)}
                    className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-600/30 rounded-xl text-amber-950 font-mono text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95 text-left group"
                    title="Inspeksi Ragam Hias & Keaslian Songket dengan Gemini 3.8 Flash Vision"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-amber-600 group-hover:scale-110 transition-transform" />
                      <span>AI Songket Vision</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-600/20 text-amber-800 font-mono font-semibold">Vision 3.8</span>
                  </button>

                  <button 
                    onClick={() => setIsStorytellerOpen(true)}
                    className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-amber-600/10 hover:bg-amber-600/20 border border-amber-500/30 rounded-xl text-amber-950 font-mono text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95 text-left group"
                    title="Buka Pencerita Lisan AI Musi Berbasis Persona"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen size={14} className="text-amber-700 group-hover:scale-110 transition-transform" />
                      <span>AI Musi Storyteller</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-700/20 text-amber-900 font-mono font-semibold">Persona</span>
                  </button>

                  <button 
                    onClick={() => setIsPlannerOpen(true)}
                    className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-600/30 rounded-xl text-emerald-950 font-mono text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95 text-left group"
                    title="Rancang Rute Pelayaran & Emisi Karbon STC"
                  >
                    <div className="flex items-center gap-2">
                      <Compass size={14} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                      <span>Cruise & Carbon Planner</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-600/20 text-emerald-800 font-mono font-semibold">CarbonPrint</span>
                  </button>

                  <button 
                    onClick={() => {
                      setMintTargetNode(null);
                      setIsMintSBTOpen(true);
                    }}
                    className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-[#8b0000]/10 hover:bg-[#8b0000]/20 border border-[#8b0000]/30 rounded-xl text-[#8b0000] font-mono text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95 text-left group"
                    title="Klaim Sertifikat Budaya Soulbound Token (ERC-5192) Sepolia"
                  >
                    <div className="flex items-center gap-2">
                      <Shield size={14} className="text-[#8b0000] group-hover:scale-110 transition-transform" />
                      <span>Klaim SBT Budaya</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#8b0000]/15 text-[#8b0000] font-mono font-semibold">ERC-5192</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 pt-10 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-gray-500">
              © 2026 SIGUNTANG (Sistem Integrasi Gerbang Universal Node Traceability AI Nusantara Gemilang).{' '}
              <button 
                onClick={() => setIsSTCEcosystemOpen(true)}
                className="text-[#8b0000] hover:underline font-semibold cursor-pointer"
              >
                Powered by STC (Smart Tourism Chain) Ecosystem
              </button>
              . Kajian Disertasi Doktor Universitas Sriwijaya.
            </p>
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
                    onClick={() => {
                      setBookingTargetNode(selectedNode);
                      setIsBookingOpen(true);
                    }}
                    className="flex flex-col items-center justify-center gap-3 p-6 bg-[#f5f2ed] border border-black/5 rounded-3xl hover:bg-[#8b0000]/10 hover:border-[#8b0000]/30 transition-all text-[#1a1a1a] cursor-pointer group"
                  >
                    <Calendar size={22} className="text-[#8b0000] group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-center block">Book Visit</span>
                      <span className="text-[9px] text-[#8b0000] font-mono font-semibold">Tiket SBT On-Chain</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => {
                      setDonationTargetNode(selectedNode);
                      setIsDonationOpen(true);
                    }}
                    className="flex flex-col items-center justify-center gap-3 p-6 bg-[#f5f2ed] border border-black/5 rounded-3xl hover:bg-[#8b0000]/10 hover:border-[#8b0000]/30 transition-all text-[#1a1a1a] cursor-pointer group"
                  >
                    <DonationIcon size={22} className="text-[#8b0000] group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-center block">Donate STC</span>
                      <span className="text-[9px] text-emerald-600 font-mono font-semibold">Sepolia ETH Escrow</span>
                    </div>
                  </button>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      setMintTargetNode(selectedNode);
                      setIsMintSBTOpen(true);
                      setSelectedNode(null);
                    }}
                    className="w-full py-4 bg-gradient-to-r from-[#8b0000] to-[#b30000] hover:brightness-110 text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#8b0000]/25 cursor-pointer"
                  >
                    Klaim SBT Budaya (ERC-5192)
                    <Shield size={16} className="text-amber-300" />
                  </button>
                  <button 
                    onClick={() => {
                      setShowSTC(selectedNode);
                      setSelectedNode(null);
                    }}
                    className="w-full py-4 bg-[#1a1a1a] text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-3 shadow-sm cursor-pointer"
                  >
                    View Secure Traceability
                    <Shield size={16} />
                  </button>
                  <button className="w-full py-3.5 bg-transparent border border-black/10 text-black rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-black/5 transition-all flex items-center justify-center gap-3 cursor-pointer">
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
        onMintSBT={(node) => {
          setMintTargetNode(node);
          setIsMintSBTOpen(true);
        }}
      />

      <STCExplorerModal
        isOpen={isExplorerOpen}
        onClose={() => setIsExplorerOpen(false)}
      />

      <LegalModal
        isOpen={!!legalModalTab}
        initialTab={legalModalTab || 'protocol'}
        onOpenSTCEcosystem={() => {
          setLegalModalTab(null);
          setIsSTCEcosystemOpen(true);
        }}
        onClose={() => setLegalModalTab(null)}
      />

      <STCEcosystemModal
        isOpen={isSTCEcosystemOpen}
        onClose={() => setIsSTCEcosystemOpen(false)}
      />

      <MintSBTModal
        isOpen={isMintSBTOpen}
        onClose={() => setIsMintSBTOpen(false)}
        defaultNode={mintTargetNode}
        wallet={wallet}
        onConnectWallet={handleConnectWallet}
      />

      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
        node={donationTargetNode || PALEMBANG_NODES[0]}
        wallet={wallet}
        onConnectWallet={handleConnectWallet}
        onClaimPatronSBT={(node) => {
          setMintTargetNode(node);
          setIsMintSBTOpen(true);
        }}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        node={bookingTargetNode || PALEMBANG_NODES[0]}
        wallet={wallet}
        onConnectWallet={handleConnectWallet}
      />

      <AIVisionInspectorModal
        isOpen={isAIVisionOpen}
        onClose={() => setIsAIVisionOpen(false)}
        wallet={wallet}
        onConnectWallet={handleConnectWallet}
      />

      <MusiStorytellerModal
        isOpen={isStorytellerOpen}
        onClose={() => setIsStorytellerOpen(false)}
        currentWeather={storytellerWeather}
        wallet={wallet}
        onConnectWallet={handleConnectWallet}
      />

      <MusiPlannerModal
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
        wallet={wallet}
        onConnectWallet={handleConnectWallet}
        onNavigateToNode={(nodeName) => {
          setIsPlannerOpen(false);
          const found = PALEMBANG_NODES.find(n => n.name.toLowerCase().includes(nodeName.toLowerCase()));
          if (found) setSelectedNode(found);
        }}
      />

      {/* Floating AI Guide & Musi Storyteller Assistant */}
      <AIGuide />
    </div>
  );
}

