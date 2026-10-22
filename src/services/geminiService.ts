/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";
import { cleanAsterisks } from "../lib/utils";

export function getStoredApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('SIGUNTANG_GEMINI_API_KEY') || '';
}

export function saveCustomApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  if (!key.trim()) {
    localStorage.removeItem('SIGUNTANG_GEMINI_API_KEY');
  } else {
    localStorage.setItem('SIGUNTANG_GEMINI_API_KEY', key.trim());
  }
}

export function hasActiveGeminiKey(): boolean {
  return !!getGeminiClient();
}

function getGeminiClient(): GoogleGenAI | null {
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('SIGUNTANG_GEMINI_API_KEY') : null;
  const apiKey =
    localKey ||
    (typeof process !== 'undefined' && (process.env?.GEMINI_API_KEY || process.env?.VITE_GEMINI_API_KEY)) ||
    (typeof import.meta !== 'undefined' && ((import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.GEMINI_API_KEY)) ||
    (typeof window !== 'undefined' && ((window as any).__GEMINI_API_KEY__ || (window as any).GEMINI_API_KEY)) ||
    '';

  const cleanKey = typeof apiKey === 'string' ? apiKey.trim() : '';

  if (!cleanKey || cleanKey === 'undefined' || cleanKey === 'null') {
    return null;
  }

  try {
    return new GoogleGenAI({ apiKey: cleanKey });
  } catch (error) {
    console.warn("GoogleGenAI lazy init prevented:", error);
    return null;
  }
}

export async function getAIResponse(messages: ChatMessage[]) {
  const ai = getGeminiClient();
  if (!ai) {
    return "Halo! Saya SIGUNTANG AI Guide. Layanan asisten AI membutuhkan kunci GEMINI_API_KEY di dashboard Vercel Anda (Environment Variables). Namun, seluruh fitur peta digital, Ekspedisi Diorama Sungai Musi, dan smart traceability SIGUNTANG dapat Anda jelajahi dengan lancar tanpa hambatan.";
  }

  const history = messages.slice(0, -1).map(m => ({
    role: m.role,
    parts: [{ text: m.content }]
  }));
  
  const lastMessage = messages[messages.length - 1].content;

  try {
    const chat = ai.chats.create({
      model: "gemini-3.8-flash",
      config: {
        systemInstruction: `Anda adalah SIGUNTANG AI Guide, asisten digital cerdas untuk platform SIGUNTANG (Sistem Integrasi Gerbang Universal Node, Traceability & Artificial Intelligence Nusantara Gemilang).
        
        Filosofi Anda:
        1. SIGUNTANG adalah "peta hidup budaya Nusantara". 
        2. Visi: Mengubah warisan budaya yang selama ini pasif menjadi ekosistem digital interaktif.
        3. Masalah yang dipecahkan: Dokumentasi konvensional, cerita sejarah yang tercecer, dan wisata yang hanya sekadar tempat foto tanpa nyawa digital.
        4. Node: Anda memandang setiap situs, pengrajin, kuliner, dan jalur sejarah sebagai "Node Digital".
        5. Blockchain: Bagi SIGUNTANG, blockchain adalah "Trust Layer" (bukan gimmick) untuk autentikasi informasi heritage, transparansi donasi, dan sertifikasi digital UMKM.
        
        Tugas Anda:
        - Memberikan narasi digital interaktif tentang "nyawa" di balik audio storytelling, heritage map, dan Ekspedisi Virtual Diorama Sungai Musi (Putri Kembang Dadar di Bukit Siguntang, Misteri Antu Banyu di Ampera, Pulau Kemaro & Tan Bun An - Siti Fatimah, Serunting Sakti Si Pahit Lidah, serta Buaya Buntung Musi / Raden Alit).
        - Menjelaskan Palembang sebagai pilot city (Sriwijaya, Sungai Musi, Islam Nusantara, folklore lisan).
        - Memberikan rekomendasi yang personal dan membanggakan identitas Nusantara.
        
        PENTING: Jangan gunakan karakter tanda bintang (asterisk '*' atau '**') untuk formatting teks, penebalan (bold), miring (italic), ataupun bullet points. Tuliskan teks secara bersih, elegan, dan natural tanpa markdown asterisk.`,
        temperature: 0.7,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message: lastMessage });
    const rawText = result.text || "Maaf, saya sedang mengalami gangguan koneksi ke STC Node.";
    return cleanAsterisks(rawText);
  } catch (error) {
    console.error("AI Guide Error:", error);
    return "Maaf, saya sedang tidak dapat terhubung ke sistem pusat Nusantara Gemilang.";
  }
}

export async function generateAndRefineProposal(
  customPrompt: string,
  currentTitle: string,
  currentDescription: string
): Promise<{ title: string; description: string }> {
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return {
        title: currentTitle,
        description: currentDescription + `\n\n[Revisi Catatan: ${customPrompt}]`
      };
    }

    const prompt = `Anda adalah ahli konsultan proposal hibah pemerintah, khususnya program bantuan Dana Indonesiana (Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi) untuk kategori "Penciptaan Karya Kreatif Inovatif" dengan sub-kategori "Aplikasi/Program Komputer".
    
    Tugas Anda adalah memodifikasi atau memperinci proposal aplikasi "SIGUNTANG" berdasarkan instruksi kustom pengguna.
    
    Aplikasi SIGUNTANG:
    - Nama: SIGUNTANG (Sistem Integrasi Gerbang Universal Node, Traceability & AI Nusantara Gemilang)
    - Platform: Web App Smart Tourism & Heritage Preservation berbasis Blockchain (Smart Tourism Chain / STC) dan AI.
    - Lokasi Pilot: Palembang (Situs Sriwijaya, Ampera, Bukit Siguntang, Songket, dll).
    - Keunggulan: Smart Contract Autentikasi Node, Ledger Transparansi Donasi/Kunjungan, Sertifikat Digital Orisinalitas (NFT) UMKM Songket, dan AI Storyteller.
    
    Instruksi Kustom Pengguna: "${customPrompt}"
    
    Judul Kegiatan Saat Ini: "${currentTitle}"
    Deskripsi Kegiatan Saat Ini: "${currentDescription}"
    
    Silakan respon dalam format JSON yang valid dengan dua properti: "title" dan "description".
    - "title": Judul kegiatan yang formal, ringkas, menarik, dan akademis-birokratis (maksimal 20 kata).
    - "description": Narasi deskripsi kegiatan bahasa Indonesia yang sangat mendalam, kaya akan istilah pemuda, pemajuan kebudayaan, dan aspek teknis terperinci (maksimal 4800 karakter agar muat dalam batas 5000 karakter portal). Gunakan struktur bernomor atau poin-poin yang rapi (misal: Latar Belakang & Urgensi, Penerapan Inovasi Teknologi, Detil Teknis & Smart Contract, Rencana Implementasi Palembang, Dampak Kebudayaan).
    
    Pastikan respons Anda HANYA berupa JSON tanpa markdown block selain json.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (text) {
      const parsed = JSON.parse(text.trim());
      if (parsed.title && parsed.description) {
        return {
          title: parsed.title,
          description: parsed.description
        };
      }
    }
    throw new Error("Invalid output format");
  } catch (error) {
    console.error("Proposal Refinement Failed:", error);
    // Return modified fallback to prevent crashes if key is missing or network fails
    return {
      title: currentTitle,
      description: currentDescription + `\n\n[Revisi Catatan: ${customPrompt}]`
    };
  }
}

