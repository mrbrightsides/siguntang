/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shield, MapPin, Search, Cpu, Wallet } from 'lucide-react';

interface NavbarProps {
  walletAddress: string | null;
  onConnectWallet: () => void;
}

export function Navbar({ walletAddress, onConnectWallet }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[5000] bg-[#f5f2ed]/80 backdrop-blur-md border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#8b0000] flex items-center justify-center rounded-lg shadow-lg">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-[#1a1a1a]">SIGUNTANG</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#8b0000]">Nusantara Gemilang</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#explorer" className="font-sans text-xs uppercase tracking-widest font-semibold hover:text-[#8b0000] transition-colors">Explorer</a>
          <a href="#map" className="font-sans text-xs uppercase tracking-widest font-semibold hover:text-[#8b0000] transition-colors">Heritage Map</a>
          <a href="#traceability" className="font-sans text-xs uppercase tracking-widest font-semibold hover:text-[#8b0000] transition-colors">Traceability</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onConnectWallet}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-black/5 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <Wallet size={16} className="text-[#8b0000]" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
            </span>
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/5 rounded-full border border-black/5">
            <Cpu size={14} className="text-[#8b0000]" />
            <span className="text-[10px] font-mono font-bold tracking-tighter">POWERED BY STC</span>
          </div>
          <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <Search size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
