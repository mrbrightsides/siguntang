/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Activity, Globe, Database, ArrowUpRight, Zap, CheckCircle2, ExternalLink } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { fetchOnChainTraceabilityLogs, OnChainTraceabilityRecord } from '../services/blockchainService';
import { CONTRACT_ADDRESSES } from '../contractData';

interface TraceabilityHubProps {
  onLaunchExplorer?: () => void;
  onOpenMintSBT?: () => void;
}

export function TraceabilityHub({ onLaunchExplorer, onOpenMintSBT }: TraceabilityHubProps) {
  const [onChainLogs, setOnChainLogs] = useState<OnChainTraceabilityRecord[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadLogs = async () => {
      setIsLoadingLogs(true);
      try {
        const logs = await fetchOnChainTraceabilityLogs();
        if (isMounted && logs.length > 0) {
          setOnChainLogs(logs);
        }
      } catch (err) {
        console.warn("Could not fetch on-chain logs:", err);
      } finally {
        if (isMounted) setIsLoadingLogs(false);
      }
    };

    loadLogs();
    const interval = setInterval(loadLogs, 15000); // Polling live block events every 15s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const stats = [
    { label: 'Network Integrity', value: '100%', icon: Shield, color: 'text-green-500' },
    { label: 'Smart Contract', value: 'ERC-5192', icon: Database, color: 'text-[#8b0000]' },
    { label: 'On-Chain Tokens', value: onChainLogs.length > 0 ? `#${onChainLogs.length + 1}` : '#2', icon: Globe, color: 'text-blue-500' },
    { label: 'Consensus', value: 'Sepolia', icon: Zap, color: 'text-yellow-500' },
  ];

  const defaultRecords = [
    { 
      id: 'tx-sbt-2', 
      type: 'Proof-of-Visit SBT #2', 
      node: 'Bukit Siguntang (Genesis Node)', 
      time: 'Baru saja di Sepolia', 
      hash: '0xcb67...5706',
      fullHash: '0xcb67f388f299174aff893acc501d82aa4ec44c2170edb2f8a4dac00e996d5706',
      explorerUrl: 'https://sepolia.etherscan.io/tx/0xcb67f388f299174aff893acc501d82aa4ec44c2170edb2f8a4dac00e996d5706',
      isLiveOnChain: true 
    },
    { 
      id: 'tx-101', 
      type: 'Node Registration', 
      node: 'Benteng Kuto Besak', 
      time: '12 mins ago', 
      hash: '0x7e2...f1a2',
      fullHash: '0x7e2a91b40283c748921a2',
      explorerUrl: `https://sepolia.etherscan.io/address/${CONTRACT_ADDRESSES.STC_CULTURAL_SBT}`,
      isLiveOnChain: false 
    },
    { 
      id: 'tx-102', 
      type: 'Heritage Donation', 
      node: 'Masjid Agung Sultan Mahmud Badaruddin I', 
      time: '35 mins ago', 
      hash: '0x9a4...c3b4',
      fullHash: '0x9a4b127530c3b4',
      explorerUrl: `https://sepolia.etherscan.io/address/${CONTRACT_ADDRESSES.HERITAGE_TREASURY}`,
      isLiveOnChain: false 
    },
    { 
      id: 'tx-103', 
      type: 'Craft Provenance SBT #1', 
      node: 'Kampung Tenun Songket Tuan Kentang', 
      time: '1 hour ago', 
      hash: '0x1d2...e4f5',
      fullHash: '0x1d2b7c4a9f5',
      explorerUrl: `https://sepolia.etherscan.io/address/${CONTRACT_ADDRESSES.STC_CULTURAL_SBT}`,
      isLiveOnChain: false 
    },
  ];

  // Gabungkan event on-chain riil dengan log
  const combinedTransactions = onChainLogs.length > 0
    ? [...onChainLogs, ...defaultRecords.filter(d => !onChainLogs.some(l => l.fullHash === d.fullHash))]
    : defaultRecords;

  return (
    <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-black/5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-serif text-3xl font-bold">STC Network Insights</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-mono text-[9px] font-bold">
              KONTRAK TERVERIFIKASI
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            Monitoring real-time traceability and immutable ledger records on Ethereum Sepolia Testnet.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#8b0000]/5 text-[#8b0000] rounded-full border border-[#8b0000]/10">
          <Activity size={16} className="animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest font-mono">
            {isLoadingLogs ? 'Syncing Chain...' : 'Live Sepolia Sync'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 bg-[#f5f2ed] rounded-3xl border border-black/5">
            <stat.icon size={20} className={stat.color + " mb-4"} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
            <p className="font-mono text-xl font-bold text-[#1a1a1a]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#8b0000]">
            Recent Traceability Ledger Records (On-Chain)
          </h4>
          <a
            href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESSES.STC_CULTURAL_SBT}`}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-mono text-gray-500 hover:text-[#8b0000] flex items-center gap-1 transition-colors"
          >
            <span>Contract: {CONTRACT_ADDRESSES.STC_CULTURAL_SBT.slice(0, 6)}...{CONTRACT_ADDRESSES.STC_CULTURAL_SBT.slice(-4)}</span>
            <ExternalLink size={12} />
          </a>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-black/5">
                <th className="pb-4 font-mono text-[10px] uppercase text-gray-400">Transaction Type</th>
                <th className="pb-4 font-mono text-[10px] uppercase text-gray-400">Reference Node</th>
                <th className="pb-4 font-mono text-[10px] uppercase text-gray-400">Timestamp / Status</th>
                <th className="pb-4 font-mono text-[10px] uppercase text-gray-400">Block Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {combinedTransactions.map((tx) => (
                <tr key={tx.id} className="group hover:bg-[#f5f2ed]/50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#1a1a1a]">{tx.type}</span>
                      {tx.isLiveOnChain && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-mono text-[9px] font-bold">
                          ON-CHAIN
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-xs text-gray-600">{tx.node}</span>
                  </td>
                  <td className="py-4">
                    <span className="text-xs text-gray-400">{tx.time}</span>
                  </td>
                  <td className="py-4">
                    <a
                      href={tx.explorerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#8b0000] hover:text-[#b30000] hover:underline"
                      title="Buka di Etherscan"
                    >
                      <span>{tx.hash}</span>
                      <ArrowUpRight size={13} className="text-[#8b0000] opacity-70 group-hover:opacity-100" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
        <button 
          onClick={onLaunchExplorer}
          className="py-5 px-6 bg-[#1a1a1a] text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg"
        >
          Launch Blockchain Explorer
          <Globe size={16} />
        </button>

        {onOpenMintSBT && (
          <button 
            onClick={onOpenMintSBT}
            className="py-5 px-6 bg-gradient-to-r from-[#8b0000] to-[#b30000] text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-[#8b0000]/25"
          >
            <Shield size={16} className="text-amber-300" />
            Mint Soulbound Token (ERC-5192)
          </button>
        )}
      </div>
    </div>
  );
}
