/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  BarChart3, 
  Coins, 
  Leaf, 
  PieChart, 
  Fingerprint, 
  Network, 
  Cpu, 
  FileCode, 
  Scale, 
  Activity, 
  Search, 
  BookOpen, 
  GraduationCap, 
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { STC_ECOSYSTEM_MODULES, DISSERTATION_RESEARCH_INFO, STCModule } from '../data/stcEcosystemData';

interface STCEcosystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilter?: string;
}

export function STCEcosystemModal({ isOpen, onClose, initialFilter = 'Semua' }: STCEcosystemModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialFilter);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  const categories = [
    'Semua',
    'Core & Middleware',
    'Trust & Identity',
    'Tourism Analytics & Impact',
    'Gas & Performance'
  ];

  const filteredModules = useMemo(() => {
    return STC_ECOSYSTEM_MODULES.filter(mod => {
      const matchCat = selectedCategory === 'Semua' || mod.category === selectedCategory;
      const matchSearch = searchQuery === '' || 
        mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.roleInSiguntang.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const renderIcon = (iconName: string, className: string = "w-5 h-5") => {
    switch (iconName) {
      case 'Activity': return <Activity className={className} />;
      case 'Coins': return <Coins className={className} />;
      case 'FileCode': return <FileCode className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'BarChart3': return <BarChart3 className={className} />;
      case 'Scale': return <Scale className={className} />;
      case 'Leaf': return <Leaf className={className} />;
      case 'PieChart': return <PieChart className={className} />;
      case 'Network': return <Network className={className} />;
      case 'Fingerprint': return <Fingerprint className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Layers': return <Layers className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[7000] flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-5xl bg-[#fbf9f6] text-[#1a1a1a] rounded-3xl md:rounded-[36px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-black/10"
        >
          {/* Header */}
          <div className="px-6 sm:px-8 py-5 border-b border-black/10 bg-white">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#8b0000] text-white flex items-center justify-center shadow-lg shadow-[#8b0000]/25 shrink-0">
                  <GraduationCap size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase tracking-widest text-[#8b0000] font-bold bg-[#8b0000]/10 px-2.5 py-0.5 rounded-full">
                      Dokumentasi Disertasi Doktor
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono hidden sm:inline">
                      {DISSERTATION_RESEARCH_INFO.institution}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1a1a1a] mt-0.5">
                    STC Ecosystem Website
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={DISSERTATION_RESEARCH_INFO.ecosystemShowcaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/5 hover:bg-black/10 rounded-xl text-xs font-semibold text-gray-700 transition-colors"
                >
                  <span>showcase.elpeef.com</span>
                  <ExternalLink size={13} />
                </a>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 text-gray-700 flex items-center justify-center transition-colors"
                  aria-label="Tutup"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Sub-header Context Banner */}
            <div className="bg-[#f5f2ed] border border-black/5 rounded-2xl p-4 sm:p-5 mt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white text-[#8b0000] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <BookOpen size={16} />
                </div>
                <div className="flex-1 text-xs text-gray-700 leading-relaxed">
                  <p className="font-semibold text-gray-900 mb-1">
                    Mengapa SIGUNTANG "Powered by STC"?
                  </p>
                  <p>
                    <strong>Smart Tourism Chain (STC)</strong> merupakan hasil kajian disertasi doktoral yang merumuskan arsitektur blockchain untuk sektor pariwisata dan pelestarian budaya. SIGUNTANG hadir sebagai <em>Cultural Experience Layer Node</em> pertama yang mengadopsi 12 modul STC—menjamin data artefak tidak dapat dipalsukan, transaksi mikro gas ramah kantong, jejak karbon terukur menuju <strong>FOLU Net Sink 2030</strong>, dan transparansi donasi berbasis bukti digital.
                  </p>
                  <p>
                    SIGUNTANG merupakan platform demonstrasi digital yang mengintegrasikan teknologi blockchain, kecerdasan buatan, dan sistem informasi geospasial untuk mendukung pelestarian warisan budaya serta pengembangan pariwisata cerdas di Palembang. Platform ini dikembangkan dengan memanfaatkan pendekatan SmartTourismChain (STC), sebuah inisiatif arsitektur teknologi yang mengeksplorasi pemanfaatan smart contract, pencatatan digital, dan integrasi sistem dalam ekosistem pariwisata. Melalui SIGUNTANG, pendekatan tersebut dieksplorasi dalam konteks yang lebih spesifik: pengelolaan informasi cagar budaya, pemetaan simpul warisan sejarah, serta pengembangan konsep keterlacakan dan verifikasi digital. SIGUNTANG menghadirkan konteks penerapan; STC menyediakan landasan eksplorasi teknologinya.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls: Search and Filter Tabs */}
          <div className="border-b border-black/10 bg-white/70 px-6 sm:px-8 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {categories.map((cat) => {
                const count = cat === 'Semua' 
                  ? STC_ECOSYSTEM_MODULES.length 
                  : STC_ECOSYSTEM_MODULES.filter(m => m.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl font-sans text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      selectedCategory === cat
                        ? 'bg-[#8b0000] text-white shadow-sm'
                        : 'bg-black/5 text-gray-600 hover:bg-black/10'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-black/10 text-gray-700'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Box */}
            <div className="relative min-w-[200px] sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari modul (karbon, gas, audit...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-black/10 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#8b0000]"
              />
            </div>
          </div>

          {/* Module Cards Grid */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 no-scrollbar space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredModules.map((module) => {
                const isExpanded = expandedModuleId === module.id;
                return (
                  <motion.div
                    key={module.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl border border-black/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    <div className="p-5 flex-1">
                      {/* Top Meta */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm"
                          style={{ backgroundColor: module.color }}
                        >
                          {renderIcon(module.iconName)}
                        </div>
                        <span 
                          className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ 
                            backgroundColor: `${module.color}15`, 
                            color: module.color 
                          }}
                        >
                          {module.badge}
                        </span>
                      </div>

                      {/* Title & Tagline */}
                      <h4 className="font-serif text-lg font-bold text-[#1a1a1a] group-hover:text-[#8b0000] transition-colors">
                        {module.name}
                      </h4>
                      <p className="text-[11px] font-medium text-gray-500 mb-3">
                        {module.tagline}
                      </p>

                      {/* Main Description */}
                      <p className="text-xs text-gray-700 leading-relaxed mb-4">
                        {module.description}
                      </p>

                      {/* Peran di SIGUNTANG */}
                      <div className="p-3 bg-[#f5f2ed] border-l-2 border-[#8b0000] rounded-r-xl text-[11px] text-gray-800 leading-relaxed mb-3">
                        <span className="font-bold text-[#8b0000] block mb-0.5">
                          Peran di SIGUNTANG:
                        </span>
                        {module.roleInSiguntang}
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-2 border-t border-black/5 space-y-3"
                        >
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                              Fitur Kunci:
                            </span>
                            <ul className="text-[11px] text-gray-600 space-y-1">
                              {module.keyFeatures.map((feat, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-[#8b0000] font-bold">•</span>
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-2.5 bg-gray-50 rounded-xl text-[10px] text-gray-600">
                            <span className="font-bold text-gray-800 block mb-0.5">
                              Fokus Disertasi:
                            </span>
                            {module.dissertationScope}
                          </div>

                          {module.externalUrl && (
                            <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-gray-500">
                              <span className="text-gray-400">Endpoint Live:</span>
                              <span className="text-[#8b0000] font-semibold truncate max-w-[200px]">
                                {module.externalUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                              </span>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div className="p-4 bg-gray-50/70 border-t border-black/5 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setExpandedModuleId(isExpanded ? null : module.id)}
                        className="text-[11px] font-semibold text-gray-600 hover:text-black flex items-center gap-1 transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            <span>Ringkas</span>
                            <ChevronUp size={14} />
                          </>
                        ) : (
                          <>
                            <span>Detail Modul</span>
                            <ChevronDown size={14} />
                          </>
                        )}
                      </button>

                      <a
                        href={module.externalUrl || DISSERTATION_RESEARCH_INFO.ecosystemShowcaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8b0000] hover:bg-[#a00000] text-white text-[11px] font-bold rounded-xl transition-all shadow-sm shadow-[#8b0000]/20 active:scale-95"
                        title={module.externalUrl ? `Buka ${module.name} (${module.externalUrl})` : `Buka ${module.name}`}
                      >
                        <span>Launch App</span>
                        <ArrowUpRight size={13} />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Architecture Flow */}
            <div className="bg-[#1a1a1a] text-white rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#ff4d4d] uppercase font-bold tracking-widest">
                    Framework Disertasi Doktoral
                  </span>
                  <h4 className="font-serif text-lg sm:text-xl font-bold mt-1 text-white">
                    Integrasi Penuh SIGUNTANG ke 12 Modul STC
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400">Riset Terapan:</span>
                  <p className="text-xs font-semibold text-white">{DISSERTATION_RESEARCH_INFO.institution}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-2">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="text-[#ff4d4d] font-bold text-[10px] uppercase tracking-wider mb-1">
                    Layer 1: Experience
                  </div>
                  <p className="font-bold text-white text-sm">SIGUNTANG Node</p>
                  <p className="text-gray-400 text-[11px] mt-1">
                    Heritage Explorer, GIS Map, Musi Cruise Diorama, & AI Guide.
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="text-blue-400 font-bold text-[10px] uppercase tracking-wider mb-1">
                    Layer 2: Middleware
                  </div>
                  <p className="font-bold text-white text-sm">STC Connect & Ultimate</p>
                  <p className="text-gray-400 text-[11px] mt-1">
                    API Gateway, IoT dermaga, QR/RFID turnstile, dan escrow settlement.
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="text-emerald-400 font-bold text-[10px] uppercase tracking-wider mb-1">
                    Layer 3: Trust & Audit
                  </div>
                  <p className="font-bold text-white text-sm">KYC, AudiTour, Converter</p>
                  <p className="text-gray-400 text-[11px] mt-1">
                    Self-Sovereign Identity UMKM, immutable audit trail, dan audit parser.
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="text-amber-400 font-bold text-[10px] uppercase tracking-wider mb-1">
                    Layer 4: Analytics & Eco
                  </div>
                  <p className="font-bold text-white text-sm">CarbonPrint & Insight</p>
                  <p className="text-gray-400 text-[11px] mt-1">
                    Mitigasi karbon FOLU Net Sink 2030, Triple Bottom Line, dan optimasi gas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
