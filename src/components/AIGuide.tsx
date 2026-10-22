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
    { role: 'model', content: 'Halo! Saya SIGUNTANG AI Guide. Bagaimana saya bisa membantu Anda menjelajahi warisan Nusantara Gemilang dan legenda Sungai Musi hari ini?' }
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
              // Mobile layout: Dynamic bottom sheet docking, firmly contained
              "inset-x-0 bottom-0 w-full max-w-full h-[88vh] max-h-[640px] rounded-t-[2rem] rounded-b-none",
              // Tablet & Desktop layout: Firmly pinned to bottom-right corner above the button
              "md:inset-x-auto md:left-auto md:right-6 md:bottom-24 md:w-[420px] md:h-[600px] md:max-h-[calc(100vh-130px)] md:rounded-3xl"
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
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 sm:p-5 space-y-4 bg-stone-50/50 w-full min-w-0">
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
                    "min-w-0 max-w-[calc(100%-42px)] sm:max-w-[78%] p-3 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm whitespace-pre-wrap break-words [overflow-wrap:anywhere]",
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
                <Sparkles size={11} className="text-amber-600" /> Ide:
              </span>
              {[
                'Cerita Antu Banyu',
                'Legenda Pulau Kemaro',
                'Putri Kembang Dadar',
                'Kutukan Si Pahit Lidah',
                'Misteri Buaya Buntung'
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setInput(`Ceritakan tentang ${tag} di Sungai Musi`);
                  }}
                  className="shrink-0 px-3 py-1.5 bg-white hover:bg-[#8b0000] hover:text-white text-stone-700 text-[11px] font-medium rounded-full border border-black/5 transition-all shadow-2xs active:scale-95 touch-manipulation cursor-pointer"
                >
                  {tag}
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

      {/* Floating Action Button - Locked strictly to bottom-right corner of viewport */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          right: '1.5rem',
          bottom: '1.5rem',
          zIndex: 9999,
        }}
        className={cn(
          "w-14 h-14 bg-[#8b0000] text-white rounded-2xl shadow-2xl shadow-red-950/35 flex items-center justify-center overflow-hidden border border-white/20 touch-manipulation cursor-pointer transition-shadow",
          isOpen ? "max-md:hidden" : "flex"
        )}
        aria-label={isOpen ? "Tutup SIGUNTANG AI" : "Buka SIGUNTANG AI"}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <div className="pointer-events-none absolute top-2 right-2 w-3 h-3 bg-amber-400 rounded-full border-2 border-[#8b0000] animate-pulse" />
        )}
      </motion.button>
    </>
    ,
    document.body
  );
}
