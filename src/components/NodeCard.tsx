/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { MapPin, Shield, ExternalLink } from 'lucide-react';
import { UniversalNode } from '../types';

interface NodeCardProps {
  key?: string;
  node: UniversalNode;
  onViewDetails: (node: UniversalNode) => void;
  onViewTraceability: (node: UniversalNode) => void;
}

export function NodeCard({ node, onViewDetails, onViewTraceability }: NodeCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-black/5 group"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={node.image} 
          alt={node.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
            {node.type}
          </span>
        </div>
        <button 
          onClick={() => onViewTraceability(node)}
          className="absolute bottom-4 right-4 p-2 bg-[#8b0000] text-white rounded-xl shadow-lg hover:bg-[#a00000] transition-colors"
          title="View Smart Tourism Chain Heritage"
        >
          <Shield size={18} />
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="font-serif text-xl font-bold text-[#1a1a1a] leading-tight group-hover:text-[#8b0000] transition-colors">
            {node.name}
          </h3>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
          {node.description}
        </p>

        <div className="flex items-center gap-4 text-[#8b0000] mb-6">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} />
            <span className="text-[11px] font-bold uppercase tracking-wider">Palembang</span>
          </div>
        </div>

        <button 
          onClick={() => onViewDetails(node)}
          className="w-full py-3 px-4 bg-[#f5f2ed] hover:bg-[#8b0000] hover:text-white text-[#1a1a1a] font-sans text-[11px] font-bold uppercase tracking-[0.15em] rounded-2xl border border-black/5 transition-all flex items-center justify-center gap-2"
        >
          Explore Node Heritage
          <ExternalLink size={14} />
        </button>
      </div>
    </motion.div>
  );
}
