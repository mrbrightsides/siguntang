/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export async function getAIResponse(messages: ChatMessage[]) {
  const history = messages.slice(0, -1).map(m => ({
    role: m.role,
    parts: [{ text: m.content }]
  }));
  
  const lastMessage = messages[messages.length - 1].content;

  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `Anda adalah SIGUNTANG AI Guide, asisten digital cerdas untuk platform SIGUNTANG (Sistem Integrasi Gerbang Universal Node, Traceability & Artificial Intelligence Nusantara Gemilang).
        
        Filosofi Anda:
        1. SIGUNTANG adalah "peta hidup budaya Nusantara". 
        2. Visi: Mengubah warisan budaya yang selama ini pasif menjadi ekosistem digital interaktif.
        3. Masalah yang dipecahkan: Dokumentasi konvensional, cerita sejarah yang tercecer, dan wisata yang hanya sekadar tempat foto tanpa nyawa digital.
        4. Node: Anda memandang setiap situs, pengrajin, kuliner, dan jalur sejarah sebagai "Node Digital".
        5. Blockchain: Bagi SIGUNTANG, blockchain adalah "Trust Layer" (bukan gimmick) untuk autentikasi informasi heritage, transparansi donasi, dan sertifikasi digital UMKM.
        
        Tugas Anda:
        - Memberikan narasi digital interaktif tentang "nyawa" di balik audio storytelling dan heritage map.
        - Menjelaskan Palembang sebagai pilot city (Sriwijaya, Sungai Musi, Islam Nusantara).
        - Memberikan rekomendasi yang personal dan membanggakan identitas Nusantara.`,
        temperature: 0.7,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message: lastMessage });
    return result.text || "Maaf, saya sedang mengalami gangguan koneksi ke STC Node.";
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
      model: "gemini-3.5-flash",
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

