/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Shield, Activity, Globe, Database, ArrowUpRight, Zap } from 'lucide-react';
import { formatDate } from '../lib/utils';

interface TraceabilityHubProps {
  onLaunchExplorer?: () => void;
}

export function TraceabilityHub({ onLaunchExplorer }: TraceabilityHubProps) {
  const stats = [
    { label: 'Network Integrity', value: '99.9%', icon: Shield, color: 'text-green-500' },
    { label: 'Active Heritage Nodes', value: '1,248', icon: Globe, color: 'text-blue-500' },
    { label: 'Blockchain Height', value: '#4,892,102', icon: Database, color: 'text-[#8b0000]' },
    { label: 'Real-time TPS', value: '42', icon: Zap, color: 'text-yellow-500' },
  ];

  const recentTransactions = [
    { id: 'tx-101', type: 'Node Registration', node: 'Benteng Kuto Besak', time: '2 mins ago', hash: '0x7e2...f1a2' },
    { id: 'tx-102', type: 'Donation', node: 'Masjid Agung', time: '15 mins ago', hash: '0x9a4...c3b4' },
    { id: 'tx-103', type: 'Certificate Issued', node: 'Songket Tuan Kentang', time: '1 hour ago', hash: '0x1d2...e4f5' },
    { id: 'tx-104', type: 'Heritage Visit', node: 'Bukit Siguntang', time: '3 hours ago', hash: '0x5c8...d9b2' },
  ];

  return (
    <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-black/5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h3 className="font-serif text-3xl font-bold mb-2">STC Network Insights</h3>
          <p className="text-gray-500 text-sm">Monitoring real-time traceability across the Nusantara Gemilang ecosystem.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#8b0000]/5 text-[#8b0000] rounded-full border border-[#8b0000]/10">
          <Activity size={16} className="animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Live Mainnet Sync</span>
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
        <h4 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#8b0000] mb-6">Recent Traceability Ledger Records</h4>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-black/5">
                <th className="pb-4 font-mono text-[10px] uppercase text-gray-400">Transaction Type</th>
                <th className="pb-4 font-mono text-[10px] uppercase text-gray-400">Reference Node</th>
                <th className="pb-4 font-mono text-[10px] uppercase text-gray-400">Timestamp</th>
                <th className="pb-4 font-mono text-[10px] uppercase text-gray-400">Block Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="group hover:bg-[#f5f2ed]/50 transition-colors">
                  <td className="py-4">
                    <span className="text-xs font-bold text-[#1a1a1a]">{tx.type}</span>
                  </td>
                  <td className="py-4">
                    <span className="text-xs text-gray-600">{tx.node}</span>
                  </td>
                  <td className="py-4">
                    <span className="text-xs text-gray-400">{tx.time}</span>
                  </td>
                  <td className="py-4 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#8b0000]">{tx.hash}</span>
                    <button className="opacity-0 group-hover:opacity-100 p-1.5 bg-black/5 rounded-lg transition-all">
                      <ArrowUpRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <button 
        onClick={onLaunchExplorer}
        className="w-full mt-10 py-5 bg-[#1a1a1a] text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-3"
      >
        Launch Full Blockchain Explorer
        <Globe size={16} />
      </button>
    </div>
  );
}
