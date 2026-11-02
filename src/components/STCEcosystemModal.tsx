import { useState, useMemo, useRef } from 'react';
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
  ChevronLeft,
  ChevronRight,
  ArrowUp,
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
  const [isResearchContextOpen, setIsResearchContextOpen] = useState<boolean>(true);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);

  const categories = [
    'Semua',
    'Core & Middleware',
    'Trust & Identity',
    'Tourism Analytics & Impact',
    'Gas & Performance'
  ];

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const offset = direction === 'left' ? -200 : 200;
      categoryScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleMainScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop > 300) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  const scrollToTop = () => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
      <div className="fixed inset-0 z-[7000] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
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
          className="relative w-full max-w-5xl bg-[#fbf9f6] text-[#1a1a1a] rounded-3xl md:rounded-[36px] shadow-2xl overflow-hidden flex flex-col max-h-[94vh] border border-black/10"
        >
          {/* Compact Fixed Header */}
          <div className="px-5 sm:px-8 py-3.5 sm:py-4 border-b border-black/10 bg-white shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#8b0000] text-white flex items-center justify-center shadow-md shadow-[#8b0000]/25 shrink-0">
                  <GraduationCap size={20} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase tracking-widest text-[#8b0000] font-bold bg-[#8b0000]/10 px-2.5 py-0.5 rounded-full">
                      Dokumentasi Disertasi Doktor
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono hidden md:inline">
                      {DISSERTATION_RESEARCH_INFO.institution}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-2xl font-bold text-[#1a1a1a] truncate mt-0.5">
                    STC Ecosystem Website <span className="text-xs sm:text-sm font-sans font-normal text-gray-500">(12 Modul)</span>
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
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
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/5 hover:bg-black/10 text-gray-700 flex items-center justify-center transition-colors"
                  aria-label="Tutup"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Controls: Category Sliding Toolbar & Search Box */}
          <div className="border-b border-black/10 bg-[#faf8f5] px-4 sm:px-8 py-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
            {/* Horizontal sliding categories with navigation */}
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <button
                onClick={() => scrollCategories('left')}
                className="w-7 h-7 rounded-lg bg-black/5 hover:bg-black/10 flex items-center justify-center text-gray-600 shrink-0 transition-colors hidden sm:flex"
                title="Geser kategori ke kiri"
              >
                <ChevronLeft size={16} />
              </button>

              <div 
                ref={categoryScrollRef}
                className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar scroll-smooth py-1 px-0.5 touch-pan-x flex-1"
              >
                {categories.map((cat) => {
                  const count = cat === 'Semua' 
                    ? STC_ECOSYSTEM_MODULES.length 
                    : STC_ECOSYSTEM_MODULES.filter(m => m.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl font-sans text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-[#8b0000] text-white shadow-sm'
                          : 'bg-white border border-black/5 text-gray-600 hover:bg-black/5'
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

              <button
                onClick={() => scrollCategories('right')}
                className="w-7 h-7 rounded-lg bg-black/5 hover:bg-black/10 flex items-center justify-center text-gray-600 shrink-0 transition-colors hidden sm:flex"
                title="Geser kategori ke kanan"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-60 shrink-0">
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

          {/* Module Cards Grid & Research Context (Easily scrollable and slideable) */}
          <div 
            ref={mainScrollRef}
            onScroll={handleMainScroll}
            className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 custom-scrollbar scroll-smooth overscroll-contain touch-pan-y"
          >
            {/* Collapsible Research Context Banner (inside scroll container so viewport is never blocked) */}
            <div className="bg-white border border-black/10 rounded-2xl shadow-xs overflow-hidden transition-all">
              <button 
                onClick={() => setIsResearchContextOpen(!isResearchContextOpen)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-[#faf7f2]/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#8b0000]/10 text-[#8b0000] flex items-center justify-center shrink-0">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm sm:text-base font-bold text-gray-900">
                      Mengapa SIGUNTANG "Powered by STC"?
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Landasan Teoretis & Arsitektur Disertasi Doktoral Smart Tourism Chain
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8b0000] shrink-0">
                  <span>{isResearchContextOpen ? 'Tutup Ringkasan' : 'Buka Penjelasan'}</span>
                  {isResearchContextOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {isResearchContextOpen && (
                <div className="px-5 pb-5 pt-0 text-xs text-gray-700 leading-relaxed border-t border-black/5 space-y-3 bg-[#fbf9f6]/60">
                  <p className="pt-3">
                    <strong>Smart Tourism Chain (STC)</strong> merupakan hasil kajian disertasi doktoral yang merumuskan arsitektur blockchain untuk sektor pariwisata dan pelestarian budaya. SIGUNTANG hadir sebagai <em>Cultural Experience Layer Node</em> pertama yang mengadopsi 12 modul STC—menjamin data artefak tidak dapat dipalsukan, transaksi mikro gas ramah kantong, jejak karbon terukur menuju <strong>FOLU Net Sink 2030</strong>, dan transparansi donasi berbasis bukti digital.
                  </p>
                  <p>
                    SIGUNTANG merupakan platform demonstrasi digital yang mengintegrasikan teknologi blockchain, kecerdasan buatan, dan sistem informasi geospasial untuk mendukung pelestarian warisan budaya serta pengembangan pariwisata cerdas di Palembang. Platform ini dikembangkan dengan memanfaatkan pendekatan SmartTourismChain (STC), sebuah inisiatif arsitektur teknologi yang mengeksplorasi pemanfaatan smart contract, pencatatan digital, dan integrasi sistem dalam ekosistem pariwisata. Melalui SIGUNTANG, pendekatan tersebut dieksplorasi dalam konteks yang lebih spesifik: pengelolaan informasi cagar budaya, pemetaan simpul warisan sejarah, serta pengembangan konsep keterlacakan dan verifikasi digital. SIGUNTANG menghadirkan konteks penerapan; STC menyediakan landasan eksplorasi teknologinya.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Count & View indicator */}
            <div className="flex items-center justify-between text-xs text-gray-500 px-1">
              <span>Menampilkan <strong>{filteredModules.length}</strong> modul STC</span>
              <span className="text-[11px] font-mono">Scroll halus • Sentuh / geser kartu</span>
            </div>

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

          {/* Floating Scroll to Top Button */}
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="absolute bottom-5 right-5 sm:bottom-6 sm:right-8 z-20 w-10 h-10 rounded-full bg-[#8b0000] text-white shadow-lg shadow-[#8b0000]/30 hover:bg-[#a00000] flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Kembali ke atas"
              aria-label="Kembali ke atas"
            >
              <ArrowUp size={18} />
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
