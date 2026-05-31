/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, Sparkles, User } from 'lucide-react';
import { ChatMessage } from '../types';
import { getAIResponse } from '../services/geminiService';
import { cn } from '../lib/utils';

export function AIGuide() {
  const [isOpen, setIsOpen] = useState(false);
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
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[550px] bg-white rounded-3xl shadow-2xl shadow-black/20 border border-black/5 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 bg-[#8b0000] text-white">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold">SIGUNTANG AI</h3>
                    <p className="text-[10px] uppercase tracking-widest opacity-80">Nusantara Heritage Guide</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
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
                    "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                    msg.role === 'user' 
                      ? "bg-[#1a1a1a] text-white rounded-tr-none" 
                      : "bg-[#f5f2ed] text-[#1a1a1a] rounded-tl-none"
                  )}>
                    {msg.content}
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

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-6 border-t border-black/5 bg-[#f5f2ed]/50">
              <div className="relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Palembang heritage..."
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
