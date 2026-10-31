/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shield, MapPin, Search, Cpu, Wallet, Sparkles } from 'lucide-react';

interface NavbarProps {
  walletAddress: string | null;
  onConnectWallet: () => void;
  onOpenSTCEcosystem?: () => void;
  onOpenMintSBT?: () => void;
  onOpenAIVision?: () => void;
}

export function Navbar({ walletAddress, onConnectWallet, onOpenSTCEcosystem, onOpenMintSBT, onOpenAIVision }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[5000] bg-[#f5f2ed]/80 backdrop-blur-md border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center transition-opacity hover:opacity-90">
          <img 
            src="https://i.imgur.com/E0EOmhA.png" 
            alt="SIGUNTANG Nusantara Gemilang" 
            className="h-10 md:h-11 w-auto object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://i.imgur.com/E0EOmhA.png';
            }}
          />
        </a>

        <div className="hidden md:flex items-center gap-7">
          <a href="#explorer" className="font-sans text-xs uppercase tracking-widest font-semibold hover:text-[#8b0000] transition-colors">Explorer</a>
          <a href="#map" className="font-sans text-xs uppercase tracking-widest font-semibold hover:text-[#8b0000] transition-colors">Heritage Map</a>
          <a href="#traceability" className="font-sans text-xs uppercase tracking-widest font-semibold hover:text-[#8b0000] transition-colors">Traceability</a>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <button 
            onClick={onConnectWallet}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-black/5 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <Wallet size={15} className="text-[#8b0000]" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect'}
            </span>
          </button>
          
          <button 
            onClick={onOpenSTCEcosystem}
            title="Kajian Disertasi STC (12 Modul Ekosistem)"
            className="flex items-center gap-2 px-3 py-1.5 bg-black/5 hover:bg-[#8b0000]/10 border border-black/5 hover:border-[#8b0000]/30 rounded-xl transition-all group cursor-pointer"
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
