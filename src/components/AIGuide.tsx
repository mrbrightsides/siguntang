/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, Sparkles, User } from 'lucide-react';
import { ChatMessage } from '../types';
import { getAIResponse, hasActiveGeminiKey } from '../services/geminiService';
import { cn, cleanAsterisks } from '../lib/utils';

export function AIGuide() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isKeyActive, setIsKeyActive] = useState(hasActiveGeminiKey());
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: 'Halo! Saya SIGUNTANG AI Guide. Saya siap memandu Anda mengeksplorasi 9 Node Budaya Palembang, fitur AI terbaru (Musi Storyteller beradaptasi cuaca, Smart Itinerary & Audit Karbon STC, Generator Prasasti Pallawa Abad ke-7, 3D In-Diorama Curator), serta arsitektur blockchain STC (Soulbound Token ERC-5192 & Traceability Hub). Ada yang ingin Anda tanyakan?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setIsKeyActive(hasActiveGeminiKey());
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    const response = await getAIResponse(newMessages);
    setMessages([...newMessages, { role: 'model', content: response }]);
    setIsTyping(false);
    setIsKeyActive(hasActiveGeminiKey());
  };

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop Overlay for closing on outside click */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[9998] md:bg-black/10"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Floating Chat Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            style={{
              position: 'fixed',
              zIndex: 9999,
            }}
            className={cn(
              "bg-white flex flex-col overflow-hidden shadow-2xl border border-black/10 transition-all box-border",
              // Mobile layout: Elevated hovering card, never stuck to the floor
              "inset-x-3 bottom-6 sm:bottom-24 w-auto max-w-[calc(100vw-1.5rem)] h-[82vh] max-h-[620px] rounded-3xl",
              // Tablet & Desktop layout: Pinned to bottom-right corner hovering above button
              "md:inset-x-auto md:left-auto md:right-6 md:bottom-28 md:w-[420px] md:h-[600px] md:max-h-[calc(100vh-140px)] md:rounded-3xl"
            )}
          >
            {/* Header */}
            <div className="pt-3 pb-4 px-4 sm:px-5 sm:p-5 bg-[#8b0000] text-white shrink-0">
              {/* Mobile grab handle indicator */}
              <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-3 md:hidden" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 sm:p-2.5 bg-white/15 rounded-2xl shadow-inner flex items-center justify-center shrink-0">
                    <Bot size={22} className="text-amber-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-base sm:text-lg font-bold tracking-tight truncate">SIGUNTANG AI</h3>
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full font-medium shadow-xs shrink-0",
                        isKeyActive ? "bg-emerald-500/25 text-emerald-200 border border-emerald-400/30" : "bg-amber-400/25 text-amber-200 border border-amber-300/30"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", isKeyActive ? "bg-emerald-400" : "bg-amber-400 animate-pulse")} />
                        {isKeyActive ? "Online" : "Siap Memandu"}
                      </span>
                    </div>
                    <p className="text-[10px] uppercase tracking-wider text-white/75 font-medium truncate">Nusantara Heritage Guide</p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/15 rounded-xl transition-colors text-white/90 active:scale-95 cursor-pointer shrink-0 ml-2"
                  aria-label="Tutup Obrolan"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area - strictly overflow-x-hidden with min-w-0 container */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-5 space-y-3.5 bg-stone-50/50 w-full min-w-0">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "flex w-full min-w-0 items-start gap-2 sm:gap-3",
                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-xl h-fit shrink-0 shadow-2xs",
                    msg.role === 'user' ? "bg-[#f5f2ed] text-stone-700" : "bg-[#8b0000]/10 text-[#8b0000]"
                  )}>
                    {msg.role === 'user' ? <User size={15} /> : <Bot size={15} />}
                  </div>
                  <div className={cn(
                    "min-w-0 max-w-[82%] sm:max-w-[78%] p-3 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs whitespace-pre-wrap break-words [overflow-wrap:anywhere]",
                    msg.role === 'user' 
                      ? "bg-[#1a1a1a] text-white rounded-tr-xs" 
                      : "bg-[#f5f2ed] text-[#1a1a1a] rounded-tl-xs border border-black/5"
                  )}>
                    {cleanAsterisks(msg.content)}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex w-full min-w-0 items-start gap-2 sm:gap-3">
                  <div className="p-2 rounded-xl bg-[#8b0000]/10 text-[#8b0000] shrink-0">
                    <Bot size={15} />
                  </div>
                  <div className="bg-[#f5f2ed] p-3 sm:p-4 rounded-2xl rounded-tl-xs flex items-center gap-1.5 border border-black/5">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="w-2 h-2 bg-[#8b0000]/60 rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-2 h-2 bg-[#8b0000]/60 rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-2 h-2 bg-[#8b0000]/60 rounded-full" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-3.5 sm:px-5 py-2.5 bg-[#f5f2ed]/90 border-t border-black/5 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 max-w-full">
              <span className="text-[10px] text-stone-500 font-semibold shrink-0 uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={11} className="text-amber-600" /> Topik:
              </span>
              {[
                { label: 'Prasasti Pallawa Abad-7', prompt: 'Bagaimana cara kerja Generator Prasasti Digital Aksara Pallawa Melayu Kuno?' },
                { label: 'SBT Proof-of-Visit', prompt: 'Jelaskan mekanisme Soulbound Token (ERC-5192) Proof-of-Visit di platform SIGUNTANG' },
                { label: 'Audit Karbon STC', prompt: 'Bagaimana perhitungan jejak karbon STC CarbonPrint dan rekomendasi eco-offset perahu Musi?' },
                { label: '3D AI Curator', prompt: 'Bagaimana fitur Context-Aware AI Curator bekerja di dalam Diorama 3D WebGL?' },
                { label: '3 Persona Storyteller', prompt: 'Apa saja 3 persona narator AI Musi Storyteller dan bagaimana adaptasi cuacanya?' },
                { label: '9 Node Budaya', prompt: 'Jelaskan 9 Universal Node budaya Palembang yang tercatat di SIGUNTANG' },
                { label: 'Riset Disertasi STC', prompt: 'Jelaskan latar belakang riset disertasi doktoral Dr. Akhmad Khudri di Universitas Bina Darma' },
                { label: 'Legenda Sungai Musi', prompt: 'Ceritakan legenda Antu Banyu dan Pulau Kemaro di Sungai Musi' }
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setInput(item.prompt);
                  }}
                  className="shrink-0 px-3 py-1.5 bg-white hover:bg-[#8b0000] hover:text-white text-stone-700 text-[11px] font-medium rounded-full border border-black/5 transition-all shadow-2xs active:scale-95 touch-manipulation cursor-pointer whitespace-nowrap"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Input Form with safe bottom padding for mobile browsers */}
            <form onSubmit={handleSubmit} className="p-3 sm:p-4 md:p-5 border-t border-black/5 bg-white shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))] w-full">
              <div className="relative flex items-center w-full">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tanya sejarah atau cerita Musi..."
                  className="w-full pl-3.5 pr-12 py-3 bg-[#f5f2ed]/70 hover:bg-[#f5f2ed] border border-black/5 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8b0000]/25 transition-all font-sans placeholder-stone-400"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2.5 bg-[#8b0000] text-white rounded-xl disabled:opacity-40 transition-all hover:bg-[#700000] active:scale-95 shadow-xs cursor-pointer"
                  aria-label="Kirim Pesan"
                >
                  <Send size={15} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button - Hovering comfortably above bottom with smooth levitation motion */}
      <motion.button
        animate={{
          y: [0, -6, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 3.2,
          ease: "easeInOut"
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          zIndex: 9999,
        }}
        className={cn(
          "w-13 h-13 sm:w-14 sm:h-14 bg-gradient-to-tr from-[#700000] via-[#8b0000] to-[#b30000] text-white rounded-2xl shadow-[0_10px_30px_rgba(139,0,0,0.45)] ring-2 ring-white/20 flex items-center justify-center overflow-hidden touch-manipulation cursor-pointer transition-all",
          "right-4 sm:right-6 bottom-20 sm:bottom-8",
          isOpen ? "max-md:hidden" : "flex"
        )}
        aria-label={isOpen ? "Tutup SIGUNTANG AI" : "Buka SIGUNTANG AI"}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
        {isOpen ? <X size={22} className="sm:size-6" /> : <MessageSquare size={22} className="sm:size-6" />}
        {!isOpen && (
          <div className="pointer-events-none absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-amber-400 rounded-full border-2 border-[#8b0000] animate-pulse" />
        )}
      </motion.button>
    </>
    ,
    document.body
  );
}
