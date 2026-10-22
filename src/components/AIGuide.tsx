/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, Sparkles, User, Key, CheckCircle, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../types';
import { getAIResponse, hasActiveGeminiKey, saveCustomApiKey, getStoredApiKey } from '../services/geminiService';
import { cn, cleanAsterisks } from '../lib/utils';

export function AIGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [customKey, setCustomKey] = useState(getStoredApiKey());
  const [isKeyActive, setIsKeyActive] = useState(hasActiveGeminiKey());
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: 'Halo! Saya SIGUNTANG AI Guide. Bagaimana saya bisa membantu Anda menjelajahi warisan Nusantara Gemilang di Palembang hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setIsKeyActive(hasActiveGeminiKey());
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    saveCustomApiKey(customKey);
    const active = hasActiveGeminiKey();
    setIsKeyActive(active);
    setShowKeyConfig(false);
    if (active) {
      setMessages(prev => [
        ...prev,
        { role: 'model', content: 'Kunci API Gemini berhasil dikonfigurasi. Saya siap memandu Anda menjelajahi sejarah dan kebudayaan Sungai Musi.' }
      ]);
    }
  };

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

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[350px] md:w-[420px] h-[580px] bg-white rounded-3xl shadow-2xl shadow-black/20 border border-black/5 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-5 bg-[#8b0000] text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Bot size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg font-bold">SIGUNTANG AI</h3>
                      <span className={cn(
                        "inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-medium",
                        isKeyActive ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30" : "bg-amber-400/20 text-amber-200 border border-amber-300/30"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", isKeyActive ? "bg-emerald-400" : "bg-amber-400 animate-pulse")} />
                        {isKeyActive ? "Online" : "Perlu Kunci"}
                      </span>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest opacity-80">Nusantara Heritage Guide</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setShowKeyConfig(!showKeyConfig)} 
                    title="Pengaturan Kunci API Gemini"
                    className={cn(
                      "p-1.5 rounded-lg transition-colors text-white/90 hover:bg-white/10",
                      showKeyConfig && "bg-white/20"
                    )}
                  >
                    <Key size={18} />
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* API Key Drawer */}
              {showKeyConfig && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-3 border-t border-white/10 text-xs"
                >
                  <p className="text-white/90 mb-2 leading-relaxed">
                    Kunci Gemini dibaca otomatis dari Environment Variables Vercel (setelah Redeploy) atau masukkan langsung di bawah:
                  </p>
                  <form onSubmit={handleSaveKey} className="flex gap-2">
                    <input 
                      type="password"
                      value={customKey}
                      onChange={(e) => setCustomKey(e.target.value)}
                      placeholder="Masukkan AI Studio Gemini Key..."
                      className="flex-1 px-3 py-1.5 rounded-lg bg-black/30 border border-white/20 text-white placeholder-white/50 text-xs focus:outline-none focus:border-amber-300"
                    />
                    <button 
                      type="submit"
                      className="px-3 py-1.5 bg-amber-400 text-stone-900 font-semibold rounded-lg hover:bg-amber-300 transition-colors shrink-0"
                    >
                      Simpan
                    </button>
                  </form>
                </motion.div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn(
                    "p-2 rounded-lg h-fit",
                    msg.role === 'user' ? "bg-[#f5f2ed]" : "bg-[#8b0000]/10"
                  )}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} className="text-[#8b0000]" />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-line",
                    msg.role === 'user' 
                      ? "bg-[#1a1a1a] text-white rounded-tr-none" 
                      : "bg-[#f5f2ed] text-[#1a1a1a] rounded-tl-none"
                  )}>
                    {cleanAsterisks(msg.content)}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="p-2 rounded-lg bg-[#8b0000]/10">
                    <Bot size={14} className="text-[#8b0000]" />
                  </div>
                  <div className="bg-[#f5f2ed] p-4 rounded-2xl rounded-tl-none flex gap-1">
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-1.5 h-1.5 bg-black/20 rounded-full" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 bg-black/20 rounded-full" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 bg-black/20 rounded-full" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

              {/* Folklore Quick Suggestion Chips */}
              <div className="px-6 py-2 bg-[#f5f2ed]/80 border-t border-black/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
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
                    className="shrink-0 px-2.5 py-1 bg-white hover:bg-[#8b0000] hover:text-white text-stone-700 text-[10px] font-medium rounded-full border border-black/5 transition-colors shadow-2xs"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-6 border-t border-black/5 bg-[#f5f2ed]/50">
                <div className="relative">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tanya sejarah atau folklore Musi..."
                    className="w-full pl-5 pr-12 py-3 bg-white border border-black/5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8b0000]/20 transition-all font-sans"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#8b0000] text-white rounded-xl disabled:opacity-50 transition-all active:scale-95"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#8b0000] text-white rounded-2xl shadow-2xl flex items-center justify-center relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff4d4d] rounded-full border-2 border-white animate-pulse" />
      </motion.button>
    </div>
  );
}
