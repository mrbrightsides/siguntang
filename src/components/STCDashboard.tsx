/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, History, User, Loader2 } from 'lucide-react';
import { UniversalNode } from '../types';
import { formatDate } from '../lib/utils';
import { registerHeritageNode } from '../services/blockchainService';

interface STCDashboardProps {
  node: UniversalNode;
  isOpen: boolean;
  onClose: () => void;
}

export function STCDashboard({ node, isOpen, onClose }: STCDashboardProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      const hash = await registerHeritageNode(
        node.name,
        node.type,
        node.location.address,
        `metadata-hash-${node.id}`
      );
      if (hash) {
        setTxHash(hash);
        alert(`Node Registered Successfully! TX: ${hash}`);
      }
    } catch (error) {
      alert('Registration failed. Make sure your wallet is connected and on the correct network.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-[#141414] text-[#E4E3E0] w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-8 border-b border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#8b0000]/20 border border-[#8b0000]/40 rounded-lg">
                <Shield className="text-[#ff4d4d]" size={24} />
              </div>
              <div>
                <h2 className="font-mono text-xs text-[#ff4d4d] font-bold tracking-widest uppercase">Smart Tourism Chain</h2>
                <p className="font-serif text-2xl font-bold">Node Authentication Certificate</p>
              </div>
            </div>
            {txHash && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span className="text-[10px] font-mono text-green-500 font-bold uppercase">CHAIN VERIFIED</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-8 mt-6">
            <div>
              <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest block mb-1">Authenticated Asset</label>
              <p className="font-sans font-medium text-lg">{node.name}</p>
            </div>
            <div>
              <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest block mb-1">Global Node ID</label>
              <p className="font-mono text-sm text-[#ff4d4d]">{node.id.toUpperCase()}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <History size={14} />
              Traceability Ledger
            </h3>
            <span className="font-mono text-[10px] text-white/40">Real-time Block Status: {txHash ? 'SYNCHRONIZED' : 'COMPLETED'}</span>
          </div>

          <div className="space-y-4 max-h-[200px] overflow-y-auto no-scrollbar">
            {node.traceability.map((log) => (
              <div key={log.id} className="relative pl-6 pb-6 border-l border-white/10 last:pb-0">
                <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] bg-[#ff4d4d] rounded-full shadow-[0_0_10px_rgba(255,77,77,0.5)]" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs text-white/90">{log.event}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <User size={10} className="text-white/40" />
                      <p className="text-[10px] text-white/60 font-medium uppercase tracking-wider">{log.actor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/40 font-mono">{formatDate(log.timestamp)}</p>
                    <p className="text-[9px] text-[#ff4d4d] font-mono mt-1 opacity-70">TX: {log.hash}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white/5 border-top border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Mainnet Node Synchronization Active</span>
          </div>
          <div className="flex items-center gap-3">
            {!txHash && (
              <button 
                disabled={isRegistering}
                className="px-6 py-2 bg-[#8b0000] hover:bg-[#a00000] text-white font-mono text-[10px] uppercase tracking-widest rounded-full transition-all flex items-center gap-2 shadow-lg shadow-[#8b0000]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleRegister}
              >
                {isRegistering ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Shield size={12} />
                )}
                Register Heritage Node
              </button>
            )}
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-transparent hover:bg-white/5 text-white/80 font-mono text-[10px] uppercase tracking-widest border border-white/20 rounded-full transition-colors"
            >
              Close Secure Terminal
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
    )}
  </AnimatePresence>
  );
}
