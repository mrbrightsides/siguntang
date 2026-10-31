/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  MapPin, 
  Clock, 
  Ship, 
  Leaf, 
  Award, 
  Utensils, 
  ShieldCheck, 
  Printer, 
  RefreshCw, 
  ChevronRight, 
  Compass, 
  Flame,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { 
  generateSmartCruiseItinerary, 
  GeneratedCruiseItinerary, 
  TransitMode, 
  TRANSIT_OPTIONS, 
  TransitOption 
} from '../services/geminiPlannerService';
import { buildSBTMetadata, pinMetadataToIPFS } from '../services/ipfsService';
import { mintSoulboundCertificate, WalletState } from '../services/blockchainService';

interface MusiPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet?: WalletState | null;
  onConnectWallet?: () => void;
  onNavigateToNode?: (nodeName: string) => void;
}

const INTEREST_OPTIONS = [
  { id: 'sriwijaya', label: 'Situs Buddha Sriwijaya' },
  { id: 'kesultanan', label: 'Jejak Kesultanan & Benteng' },
  { id: 'songket', label: 'Sentra Kriya Songket' },
  { id: 'kemaro', label: 'Ziarah Religi Pulau Kemaro' },
  { id: 'kuliner', label: 'Kuliner Legendaris Sungai' }
];

export function MusiPlannerModal({
  isOpen,
  onClose,
  wallet,
  onConnectWallet,
  onNavigateToNode
}: MusiPlannerModalProps) {
  const [durationHours, setDurationHours] = useState<number>(4);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Situs Buddha Sriwijaya',
    'Ziarah Religi Pulau Kemaro'
  ]);
  const [transitMode, setTransitMode] = useState<TransitMode>('ketek-solar');
  const [userCustomNotes, setUserCustomNotes] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<GeneratedCruiseItinerary | null>(null);

  // Minting state
  const [isMinting, setIsMinting] = useState(false);
  const [mintedTxHash, setMintedTxHash] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleInterest = (label: string) => {
    if (selectedInterests.includes(label)) {
      setSelectedInterests(selectedInterests.filter(i => i !== label));
    } else {
      setSelectedInterests([...selectedInterests, label]);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setMintedTxHash(null);

    try {
      const result = await generateSmartCruiseItinerary({
        durationHours,
        selectedInterests,
        transitMode,
        userCustomNotes
      });
      setItinerary(result);
    } catch (err) {
      console.error("Gagal generate itinerary:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleMintItinerarySBT = async () => {
    if (!itinerary) return;
    setIsMinting(true);

    try {
      const recipientAddr = wallet?.address || '0x17A1e4875c125ad6e89388d9F042A361499495Da';
      const metadata = buildSBTMetadata({
        nodeId: `itinerary-${Date.now()}`,
        nodeName: itinerary.itineraryTitle,
        category: 'Rencana Perjalanan Cerdas STC',
        recipientAddress: recipientAddr,
        recipientName: wallet?.address ? 'Wisatawan Terverifikasi STC' : 'Dr. Akhmad Khudri (STC Treasury)',
        certificateType: `Green Cruise Route Certificate (${itinerary.transitModeName})`,
        imageUrl: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80',
        latitude: -2.9909,
        longitude: 104.7565
      });

      metadata.attributes.push(
        { trait_type: 'Total Duration', value: `${itinerary.totalDurationHours} Jam` },
        { trait_type: 'Nautical Distance', value: `${itinerary.totalDistanceKm} km` },
        { trait_type: 'Carbon Footprint', value: `${itinerary.carbonMetrics.totalCarbonKg} kg CO2e` },
        { trait_type: 'Transit Mode', value: itinerary.transitModeName },
        { trait_type: 'Efficiency Rating', value: itinerary.carbonMetrics.efficiencyRating }
      );

      const ipfsRes = await pinMetadataToIPFS(metadata);
      const tx = await mintSoulboundCertificate({
        recipientAddress: recipientAddr,
        ipfsUri: ipfsRes.ipfsUri,
        nodeName: itinerary.itineraryTitle,
        certType: `Green Cruise Passport (${itinerary.transitModeName})`
      });

      setMintedTxHash(tx.txHash);
    } catch (err: any) {
      alert(`Minting tiket rute gagal: ${err.message || 'Periksa jaringan MetaMask'}`);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto print:p-0 print:bg-white">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md print:hidden"
      />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl bg-[#121212] border border-emerald-500/25 rounded-3xl shadow-2xl text-white overflow-hidden my-auto max-h-[92vh] flex flex-col print:border-none print:shadow-none print:bg-white print:text-black print:max-h-none print:overflow-visible"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#111e16] via-[#16271c] to-[#111e16] border-b border-white/10 flex items-center justify-between shrink-0 print:border-b-2 print:border-black">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-md text-white">
              <Compass size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white print:text-black">
                  Smart Heritage & Musi Cruise Planner
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold border border-emerald-500/30 uppercase print:hidden">
                  STC CarbonPrint Engine
                </span>
              </div>
              <p className="text-xs text-stone-400 print:text-stone-600">
                Optimalisasi Rute Jelajah Budaya & Estimasi Emisi Karbon Pelayaran Sungai Musi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer print:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 print:overflow-visible">
          {/* Left Column: Preferences Input */}
          <div className="lg:col-span-5 flex flex-col gap-4 print:hidden">
            {/* Duration Selector */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block mb-1.5 flex items-center gap-1.5">
                <Clock size={13} />
                Waktu Luang yang Anda Miliki:
              </label>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { hours: 2, label: '2 Jam', sub: 'Kilat' },
                  { hours: 4, label: '4 Jam', sub: 'Standar' },
                  { hours: 8, label: '8 Jam', sub: 'Mendalam' },
                  { hours: 12, label: '1 Hari', sub: 'Lengkap' }
                ].map(d => (
                  <button
                    key={d.hours}
                    onClick={() => setDurationHours(d.hours)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      durationHours === d.hours
                        ? 'bg-emerald-500/25 border-emerald-400 text-white font-bold'
                        : 'bg-white/5 border-white/10 text-stone-400 hover:bg-white/10'
                    }`}
                  >
                    <p className="font-serif text-xs font-bold leading-none">{d.label}</p>
                    <span className="text-[9px] font-mono text-emerald-300/80">{d.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Chips */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-1.5">
                Fokus Minat Budaya & Heritage:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {INTEREST_OPTIONS.map(opt => {
                  const isChecked = selectedInterests.includes(opt.label);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleInterest(opt.label)}
                      className={`px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-medium'
                          : 'bg-white/5 border-white/10 text-stone-400 hover:bg-white/10'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}{opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Transit Mode Selection with Carbon Factor */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-1.5 flex items-center justify-between">
                <span>Moda Pelayaran / Transportasi:</span>
                <Leaf size={13} className="text-emerald-400" />
              </label>

              <div className="space-y-2">
                {TRANSIT_OPTIONS.map(opt => {
                  const isSelected = transitMode === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setTransitMode(opt.id)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-emerald-500/15 border-emerald-500/60 ring-1 ring-emerald-500/30 text-white'
                          : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-serif text-xs font-bold text-white truncate">{opt.name}</p>
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold shrink-0">
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-400 line-clamp-1">{opt.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono text-[10px] text-stone-300 font-bold block">{opt.co2PerKm} kg/km</span>
                        {opt.carbonSavingPercent > 0 && (
                          <span className="text-[9px] font-mono text-emerald-400 font-bold">-{opt.carbonSavingPercent}% CO₂</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Notes */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1 font-bold">
                Permintaan Khusus (Opsional):
              </label>
              <input
                type="text"
                value={userCustomNotes}
                onChange={(e) => setUserCustomNotes(e.target.value)}
                placeholder="Misal: Ingin beli oleh-oleh pempek tertua dan ziarah makam..."
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Action Trigger */}
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:brightness-110 text-stone-950 font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={14} className="animate-spin text-stone-950" />
                  Mengalkulasi Rute & Emisi Karbon...
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-stone-950" />
                  Rancang Rute Wisata Cerdas
                </>
              )}
            </button>
          </div>

          {/* Right Column: Interactive Timeline & Carbon Breakdown */}
          <div className="lg:col-span-7 flex flex-col justify-between print:col-span-12">
            {!itinerary && !isLoading ? (
              <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/15 rounded-2xl bg-white/[0.02]">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-300 mb-4">
                  <Ship size={24} />
                </div>
                <h4 className="font-serif text-lg font-bold text-white mb-2">
                  Siap Merancang Rencana Perjalanan Wisata Cerdas
                </h4>
                <p className="text-xs text-stone-400 max-w-md leading-relaxed mb-6">
                  Pilih durasi waktu luang, minat budaya, dan moda perahu Musi di sebelah kiri, lalu klik <strong>"Rancang Rute Wisata Cerdas"</strong>.
                </p>
                <div className="grid grid-cols-2 gap-3 max-w-sm text-left">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <p className="font-mono text-[10px] text-emerald-300 font-bold uppercase mb-1">Rute Optimal</p>
                    <p className="text-[11px] text-stone-300">Penataan waktu tiba & labuh perahu bertahap.</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <p className="font-mono text-[10px] text-amber-300 font-bold uppercase mb-1">STC CarbonPrint</p>
                    <p className="text-[11px] text-stone-300">Kalkulasi jejak emisi dan rekomendasi offset.</p>
                  </div>
                </div>
              </div>
            ) : isLoading ? (
              <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-center p-8 border border-white/10 rounded-2xl bg-white/[0.02]">
                <RefreshCw size={36} className="animate-spin text-emerald-400 mb-4" />
                <h4 className="font-serif text-lg font-bold text-white mb-2">
                  Gemini Sedang Mengoptimalkan Rute
                </h4>
                <p className="text-xs text-stone-400 max-w-md">
                  Menghitung jarak nautikal Sungai Musi, mencocokkan simpul sejarah, dan memverifikasi estimasi jejak karbon...
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Title & Carbon Metrics Header */}
                <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-black/40 rounded-2xl border border-emerald-500/30 space-y-3 print:bg-none print:border print:border-black">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase tracking-widest block mb-0.5">
                        ITINERARY RESMI TERVALIDASI STC
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-white print:text-black">
                        {itinerary.itineraryTitle}
                      </h3>
                      <p className="text-xs text-stone-300 print:text-stone-700">
                        Durasi: {itinerary.totalDurationHours} Jam • Jarak: {itinerary.totalDistanceKm} km • Moda: {itinerary.transitModeName}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 print:hidden">
                      <button
                        onClick={handlePrint}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all cursor-pointer"
                        title="Cetak Rencana Perjalanan"
                      >
                        <Printer size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Carbon Stats Row */}
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10 print:border-black/20">
                    <div className="p-2.5 bg-black/40 rounded-xl border border-white/10 text-center">
                      <span className="font-mono text-[9px] text-stone-400 uppercase block">Jejak Karbon</span>
                      <span className="font-mono text-sm sm:text-base font-bold text-emerald-400">
                        {itinerary.carbonMetrics.totalCarbonKg} kg
                      </span>
                      <span className="text-[9px] text-stone-400 block">CO₂e</span>
                    </div>

                    <div className="p-2.5 bg-black/40 rounded-xl border border-white/10 text-center">
                      <span className="font-mono text-[9px] text-stone-400 uppercase block">Penghematan</span>
                      <span className="font-mono text-sm sm:text-base font-bold text-teal-300">
                        -{itinerary.carbonMetrics.carbonSavingsKg} kg
                      </span>
                      <span className="text-[9px] text-stone-400 block">vs Transport Darat</span>
                    </div>

                    <div className="p-2.5 bg-black/40 rounded-xl border border-white/10 text-center">
                      <span className="font-mono text-[9px] text-stone-400 uppercase block">Peringkat Efisiensi</span>
                      <span className="font-mono text-xs sm:text-xs font-bold text-amber-300 truncate block mt-1">
                        {itinerary.carbonMetrics.efficiencyRating.split(' ')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Offset Action */}
                  <div className="p-2.5 bg-emerald-950/30 rounded-xl border border-emerald-500/20 flex items-start gap-2 text-xs">
                    <Leaf size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-emerald-200/90 text-[11px] leading-relaxed">
                      <strong>Aksi Tebus Emisi (Carbon Offset):</strong> {itinerary.carbonMetrics.offsetRecommendation}
                    </p>
                  </div>
                </div>

                {/* Timeline Stops */}
                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                  {itinerary.stops.map((stop, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-all flex items-start gap-3 print:bg-none print:border print:border-stone-300"
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                          <h4 className="font-serif text-sm font-bold text-white print:text-black">
                            {stop.stopName}
                          </h4>
                          <span className="font-mono text-[10px] text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md font-semibold">
                            {stop.timeSlot}
                          </span>
                        </div>

                        <p className="text-[10px] font-mono text-stone-400 mb-2">
                          {stop.category} • {stop.riverCoordinate} • Emisi: {stop.carbonEmissionKg} kg CO₂
                        </p>

                        <ul className="space-y-1 text-xs text-stone-300 mb-2">
                          {stop.activities.map((act, aIdx) => (
                            <li key={aIdx} className="flex items-start gap-1.5">
                              <span className="text-emerald-400 mt-0.5">•</span>
                              <span>{act}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/10 text-[11px]">
                          <div className="flex items-center gap-1 text-amber-300">
                            <Utensils size={12} />
                            <span>{stop.localCulinaryTip}</span>
                          </div>
                          <span className="text-white/20">•</span>
                          <div className="flex items-center gap-1 text-stone-400 font-mono text-[10px]">
                            <Award size={12} className="text-emerald-400" />
                            <span>{stop.sbtCollectible}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* On-Chain Passport Minting */}
                <div className="pt-1 print:hidden">
                  {mintedTxHash ? (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center justify-between text-xs text-emerald-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        <span>SBT Paspor Rute Cerdas Berhasil Dicatat di Sepolia!</span>
                      </div>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${mintedTxHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[10px] text-amber-300 underline font-bold"
                      >
                        Buka Etherscan ↗
                      </a>
                    </div>
                  ) : (
                    <button
                      onClick={handleMintItinerarySBT}
                      disabled={isMinting}
                      className="w-full py-2.5 px-4 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-200 font-mono text-[10px] uppercase font-bold tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isMinting ? (
                        <>
                          <RefreshCw size={13} className="animate-spin text-emerald-300" />
                          Mencatat Paspor Rute ke Sepolia ERC-5192...
                        </>
                      ) : (
                        <>
                          <Award size={13} className="text-emerald-400" />
                          Terbitkan SBT Paspor Wisata Rendah Karbon (Sepolia)
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
        <div className="px-6 py-3 bg-black/60 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400 font-mono shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <Cpu size={13} className="text-emerald-400" />
            <span>STC CarbonPrint Ledger • Dr. Akhmad Khudri</span>
          </div>
          <span className="hidden sm:inline text-stone-500">
            Audit Standar ISO 14064-1 Carbon Tourism
          </span>
        </div>
      </motion.div>
    </div>
  );
}
