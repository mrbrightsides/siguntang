/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shield, MapPin, Search, Cpu, Wallet, Sparkles, Scroll, Award, Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  walletAddress: string | null;
  onConnectWallet: () => void;
  onOpenSTCEcosystem?: () => void;
  onOpenMintSBT?: () => void;
  onOpenAIVision?: () => void;
  onOpenSongketModal?: () => void;
  onOpenQuiz?: () => void;
}

export function Navbar({ 
  walletAddress, 
  onConnectWallet, 
  onOpenSTCEcosystem, 
  onOpenMintSBT, 
  onOpenAIVision,
  onOpenSongketModal,
  onOpenQuiz 
}: NavbarProps) {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <nav className="fixed top-0 left-0 right-0 z-[5000] bg-[#f5f2ed]/90 backdrop-blur-md border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
        <a href="#" className="flex items-center transition-opacity hover:opacity-90 shrink-0">
          <img 
            src="https://i.imgur.com/E0EOmhA.png" 
            alt="SIGUNTANG Nusantara Gemilang" 
            className="h-9 md:h-11 w-auto object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://i.imgur.com/E0EOmhA.png';
            }}
          />
        </a>

        <div className="hidden lg:flex items-center gap-6">
          <a href="#heritage-timeline" className="font-sans text-xs uppercase tracking-widest font-semibold hover:text-[#8b0000] transition-colors flex items-center gap-1.5">
            <Scroll size={13} className="text-[#8b0000]" />
            <span>{t.navTimeline}</span>
          </a>
          <a href="#map" className="font-sans text-xs uppercase tracking-widest font-semibold hover:text-[#8b0000] transition-colors">
            {t.navMap}
          </a>
          <a href="#traceability" className="font-sans text-xs uppercase tracking-widest font-semibold hover:text-[#8b0000] transition-colors">
            {t.navTraceability}
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Mode Switcher */}
          <button
            onClick={toggleLanguage}
            title={language === 'id' ? 'Beralih ke Basa Palembang Alus' : 'Beralih ke Bahasa Indonesia'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-600/30 rounded-xl transition-all cursor-pointer text-[10px] font-mono font-bold text-amber-950 active:scale-95"
          >
            <Languages size={13} className="text-amber-700" />
            <span className="hidden sm:inline">
              {language === 'id' ? 'Basa Palembang Alus' : 'Bahasa Indonesia'}
            </span>
            <span className="sm:hidden uppercase">
              {language === 'id' ? 'PLG' : 'ID'}
            </span>
          </button>

          <button 
            onClick={onConnectWallet}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-black/5 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Wallet size={14} className="text-[#8b0000]" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : t.connectWallet}
            </span>
          </button>
          
          <button 
            onClick={onOpenSTCEcosystem}
            title="Kajian Disertasi STC (12 Modul Ekosistem)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/5 hover:bg-[#8b0000]/10 border border-black/5 hover:border-[#8b0000]/30 rounded-xl transition-all group cursor-pointer"
          >
            <Cpu size={14} className="text-[#8b0000] group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] font-mono font-bold tracking-tighter text-[#1a1a1a] group-hover:text-[#8b0000]">STC</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#8b0000] animate-ping" />
          </button>
        </div>
      </div>
    </nav>
  );
}
