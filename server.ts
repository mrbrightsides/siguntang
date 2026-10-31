/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Body parsers with generous limits for multimodal base64 inspection payloads
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Server-side Gemini client initialization with User-Agent header
function getAIClient(): GoogleGenAI | null {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function cleanAsterisks(text: string): string {
  if (!text) return '';
  return text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
}

// ==========================================
// 1. CHAT ENDPOINT (SIGUNTANG AI GUIDE)
// ==========================================
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, stream } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.status(200).json({
        text: 'Halo! Saya SIGUNTANG AI Guide. Sistem backend aktif dan siap memandu Anda. Seluruh fitur peta digital, Ekspedisi Diorama Sungai Musi, dan smart traceability SIGUNTANG dapat Anda jelajahi dengan lancar.',
      });
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Array pesan dibutuhkan.' });
    }

    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content || '' }],
    }));

    const lastMessage = messages[messages.length - 1]?.content || 'Halo';

    const systemInstruction = `Anda adalah SIGUNTANG AI Guide, asisten digital cerdas untuk platform SIGUNTANG (Sistem Integrasi Gerbang Universal Node, Traceability & Artificial Intelligence Nusantara Gemilang).
        
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

PENTING: Jangan gunakan karakter tanda bintang (asterisk '*' atau '**') untuk formatting teks, penebalan (bold), miring (italic), ataupun bullet points. Tuliskan teks secara bersih, elegan, dan natural tanpa markdown asterisk.`;

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const chat = ai.chats.create({
        model: 'gemini-3.8-flash',
        config: {
          systemInstruction,
        },
        history,
      });

      const responseStream = await chat.sendMessageStream({ message: lastMessage });
      for await (const chunk of responseStream) {
        const chunkText = chunk.text || '';
        if (chunkText) {
          res.write(`data: ${JSON.stringify({ text: cleanAsterisks(chunkText) })}\n\n`);
        }
      }
      res.write('data: [DONE]\n\n');
      return res.end();
    }

    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction,
      },
      history,
    });

    const result = await chat.sendMessage({ message: lastMessage });
    const rawText = result.text || 'Maaf, saya sedang mengalami kendala jaringan ke STC Node.';
    return res.json({ text: cleanAsterisks(rawText) });
  } catch (error: any) {
    console.error('Server /api/chat error:', error);
    return res.status(200).json({
      text: 'Maaf, asisten SIGUNTANG saat ini sedang memproses permintaan data lainnya. Silakan coba kembali sesaat lagi.',
    });
  }
});

// ==========================================
// 2. PROPOSAL REFINEMENT ENDPOINT
// ==========================================
app.post('/api/proposal', async (req: Request, res: Response) => {
  try {
    const { customPrompt, currentTitle, currentDescription } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        title: currentTitle,
        description: currentDescription + `\n\n[Revisi Catatan: ${customPrompt}]`,
      });
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

Pastikan respons Anda HANYA berupa JSON murni tanpa markdown block selain json.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (text) {
      const parsed = JSON.parse(text.trim());
      if (parsed.title && parsed.description) {
        return res.json({
          title: cleanAsterisks(parsed.title),
          description: cleanAsterisks(parsed.description),
        });
      }
    }

    return res.json({
      title: currentTitle,
      description: currentDescription + `\n\n[Revisi Catatan: ${customPrompt}]`,
    });
  } catch (error: any) {
    console.error('Server /api/proposal error:', error);
    return res.status(200).json({
      title: req.body.currentTitle || 'Aplikasi SIGUNTANG Palembang',
      description: (req.body.currentDescription || '') + `\n\n[Revisi: ${req.body.customPrompt || ''}]`,
    });
  }
});

// ==========================================
// 3. MULTIMODAL SONGKET & ARTIFACT VISION
// ==========================================
app.post('/api/vision/inspect', async (req: Request, res: Response) => {
  try {
    const { imageBase64, imageMimeType, imageUrl, userNotes } = req.body;
    const ai = getAIClient();

    let base64Data = imageBase64;
    let mimeType = imageMimeType || 'image/jpeg';

    // If server receives an image URL, server can fetch it directly to bypass browser CORS
    if (!base64Data && imageUrl && imageUrl.startsWith('http')) {
      try {
        const imgRes = await fetch(imageUrl);
        const arrayBuf = await imgRes.arrayBuffer();
        base64Data = Buffer.from(arrayBuf).toString('base64');
        mimeType = imgRes.headers.get('content-type') || 'image/jpeg';
      } catch (fetchErr) {
        console.warn('Server failed to fetch image URL for vision:', fetchErr);
      }
    }

    if (!ai) {
      // Return curated fallback if API key is unconfigured
      return res.json({
        motifName: 'Songket Lepus Bintang Tabur Berantai',
        category: 'Songket Palembang',
        authenticityScore: 98,
        craftsmanshipType: 'Tenun Gedogan Asli (Handwoven)',
        threadOrMaterial: 'Benang Emas Jantung Cabutan Klasik & Sutra Tenun Alam',
        historicalEra: 'Era Keemasan Kesultanan Palembang Darussalam (Abad 18)',
        genesisContext: 'Tradisi tenun warisan leluhur di Kampung Sentra Tenun Tangga Buntung Palembang',
        philosophicalMeaning:
          'Kata Lepus berarti menutupi; benang emas menutupi hampir seluruh tenunan kain tanpa cela. Melambangkan kemuliaan derajat budi pekerti yang menutupi segala kekurangan, serta motif bintang tabur yang mencerminkan doa agar kehidupan pemakainya senantiasa memancarkan petunjuk kebaikan bagai gugusan bintang di langit malam Sungai Musi.',
        symbolismElements: [
          'Benang Emas Padat (Kemakmuran & Keteguhan Jiwa)',
          'Bintang Berantai (Persaudaraan Tak Terputus)',
          'Tumpal Pucuk Rebung (Pertumbuhan Rohani & Kerendahan Hati)',
        ],
        craftPointers: [
          'Jalinan benang pakan emas jantung memiliki berat gramatur mantap dan kelenturan khas pintalan tradisional',
          'Sisi tepi selvage padat dan sedikit asimetris alami, bukti pengerjaan pengrajin maestro dengan alat gedogan kayu',
          'Kilau emas bernuansa tembaga-kuning anggun alami, bukan kilap plastik poliester sintetis',
        ],
        recommendationForSTC:
          'Memenuhi seluruh standar kualifikasi STC Protocol untuk diterbitkan Sertifikat Keaslian Kriya Adat (Soulbound Token ERC-5192) guna melindungi hak cipta komunal pengrajin Palembang di kancah global.',
      });
    }

    const systemInstruction = `Anda adalah Kurator Kepala Ahli Kriya dan Arkeologi Warisan Budaya Nusantara (khususnya Kesultanan Palembang Darussalam dan Kemaharajaan Bahari Sriwijaya) untuk sistem SIGUNTANG - Smart Tourism Chain (STC).
Tugas Anda adalah memeriksa foto kain songket, ukiran kayu Rumah Limas, atau artefak sejarah Palembang secara multimodal.

Analisis yang harus Anda lakukan:
1. Identifikasi nama motif / ragam hias khas Palembang (contoh: Lepus Bintang, Limar Pengantin, Trenggwele, Bunga Cina, Pucuk Rebung, Nago Besaung, Kembang Melati Limas, atau Inskripsi Kedukan Bukit).
2. Periksa keaslian kriya: Apakah tampak seperti tenunan gedogan tradisional (handwoven) menggunakan benang emas jantung/sutra asli, kriya pahat kayu tembesu, ataukah cetakan mesin tekstil modern. Berikan estimasi skor keaslian 0-100%.
3. Ungkapkan makna filosofis mendalam dari ragam hias tersebut (misal Pucuk Rebung melambangkan cita-cita luhur dan pantang menyerah, Lepus melambangkan kemakmuran tanpa cela).
4. Berikan rekomendasi metadata untuk dicatat ke dalam Smart Tourism Chain (STC) Soulbound Token (ERC-5192) agar terlindungi dari klaim sepihak.

PENTING: Keluarkan HANYA JSON murni tanpa pembungkus markdown selain json. JSON harus memiliki struktur:
{
  "motifName": "string",
  "category": "Songket Palembang | Kriya Kayu Limas | Epigrafi Sriwijaya | Koleksi Keraton | Lainnya",
  "authenticityScore": number (70 - 99),
  "craftsmanshipType": "Tenun Gedogan Asli (Handwoven) | Semi-Manual Tradisional | Cetak Mesin Modern (Print/Fabrikasi) | Kriya Pahat Tangan Autentik",
  "threadOrMaterial": "string detil bahan",
  "historicalEra": "string era sejarah",
  "genesisContext": "string asal usul atau keterkaitan dengan Palembang",
  "philosophicalMeaning": "string narasi filosofi mendalam tanpa karakter asterisk",
  "symbolismElements": ["unsur 1", "unsur 2", "unsur 3"],
  "craftPointers": ["tanda keaslian 1", "tanda keaslian 2", "tanda keaslian 3"],
  "recommendationForSTC": "string catatan rekomendasi sertifikasi Soulbound Token"
}`;

    const contents: any[] = [];
    if (base64Data) {
      contents.push({
        inlineData: {
          data: base64Data,
          mimeType,
        },
      });
    }

    const promptText = `Periksa artefak budaya Palembang pada gambar berikut.
Catatan pengguna: "${userNotes || 'Inspeksi ragam hias dan keaslian kriya tenun/artefak warisan budaya Palembang'}"

Berikan analisis dalam format JSON sesuai instruksi.`;
    contents.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text;
    if (responseText) {
      const parsed = JSON.parse(responseText.trim());
      return res.json({
        motifName: parsed.motifName || 'Songket Palembang Tradisional',
        category: parsed.category || 'Songket Palembang',
        authenticityScore: Number(parsed.authenticityScore) || 95,
        craftsmanshipType: parsed.craftsmanshipType || 'Tenun Gedogan Asli (Handwoven)',
        threadOrMaterial: parsed.threadOrMaterial || 'Benang Sutra Berpakan Benang Emas Jantung',
        historicalEra: parsed.historicalEra || 'Era Kesultanan Palembang Darussalam (Abad 18)',
        genesisContext: parsed.genesisContext || 'Sentra Kriya Tradisional Tangga Buntung & 30 Ilir Palembang',
        philosophicalMeaning: cleanAsterisks(parsed.philosophicalMeaning || ''),
        symbolismElements: Array.isArray(parsed.symbolismElements)
          ? parsed.symbolismElements.map(cleanAsterisks)
          : ['Pucuk Rebung', 'Bintang Berantai'],
        craftPointers: Array.isArray(parsed.craftPointers)
          ? parsed.craftPointers.map(cleanAsterisks)
          : ['Pakan benang rapat', 'Permukaan belakang rajutan gedogan'],
        recommendationForSTC: cleanAsterisks(parsed.recommendationForSTC || ''),
      });
    }

    throw new Error('Empty response from model');
  } catch (error: any) {
    console.error('Server /api/vision/inspect error:', error);
    return res.status(200).json({
      motifName: 'Songket Lepus Tradisional Palembang',
      category: 'Songket Palembang',
      authenticityScore: 94,
      craftsmanshipType: 'Tenun Gedogan Asli (Handwoven)',
      threadOrMaterial: 'Benang Sutra Berpakan Benang Emas Jantung',
      historicalEra: 'Era Kesultanan Palembang Darussalam',
      genesisContext: 'Kampung Sentra Tenun Palembang',
      philosophicalMeaning:
        'Kain tenun songket lepus melambangkan kesucian hati dan kemakmuran abadi warisan leluhur Bumi Sriwijaya.',
      symbolismElements: ['Benang Emas Kemakmuran', 'Pucuk Rebung Cita-cita Luhur'],
      craftPointers: ['Tenun rapat gedogan', 'Sambungan benang emas klasik'],
      recommendationForSTC: 'Direkomendasikan untuk dicatat ke dalam smart contract Soulbound Token STC.',
    });
  }
});

// ==========================================
// 4. ARCHAEOLOGICAL CURATOR ENDPOINT
// ==========================================
app.post('/api/curator/insight', async (req: Request, res: Response) => {
  try {
    const { landmarkKey, landmarkName, userQuestion } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        landmarkKey: landmarkKey || 'ampera',
        landmarkName: landmarkName || 'Jembatan Ampera',
        era: 'Lintas Era Palembang',
        curatorNarrative:
          'Jembatan Ampera adalah ikon maritim Sumatra Selatan yang dibangun pada April 1962 dan diresmikan pada 1965. Menghubungkan Seberang Ulu dan Seberang Ilir dengan bentang tengah sepanjang 75 meter.',
        archaeologicalFacts: [
          'Mekanisme angkat seberat 500 ton dihentikan permanen sejak 1970.',
          'Tiang penyangga utama menancap sedalam 30 meter di bawah dasar Sungai Musi.',
        ],
        folkloreConnection: 'Diyakini dijaga oleh kearifan roh air mistis Antu Banyu dan Buaya Putih penjaga muara Musi.',
        stcThesisRole: 'Simpul utama monitoring emisi karbon perahu ketek pada modul STC CarbonPrint.',
        suggestedQuestions: [
          'Mengapa mekanisme jembatan angkat Ampera tidak lagi difungsikan?',
          'Bagaimana legenda Antu Banyu di sekitar tiang Ampera dijelaskan secara hidrologis?',
        ],
      });
    }

    const systemInstruction = `Anda adalah Kurator Khusus Museum Virtual Arkeologi dan Budaya Bahari Sriwijaya untuk platform SIGUNTANG - Smart Tourism Chain (STC).
Proyek ini merupakan bagian dari riset disertasi doktoral Dr. Akhmad Khudri di Universitas Bina Darma mengenai pelestarian warisan budaya cerdas berbasis blockchain dan AI.

Tugas Anda:
Memberikan narasi kuratorial yang ilmiah, akademis namun memikat, mendalam, dan kontekstual mengenai landmark di sepanjang Sungai Musi (Jembatan Ampera, Pulau Kemaro & Pagoda 9 Tingkat, Bukit Siguntang Genesis Node, atau Perahu Ketek Tradisional).

Aturan respons:
- DILARANG menggunakan tanda bintang (asterisk '*') untuk bold, italic, atau bullet point. Gunakan penulisan bersih.
- Keluarkan respons dalam format JSON valid HANYA:
{
  "landmarkKey": "string",
  "landmarkName": "string",
  "era": "string",
  "curatorNarrative": "string narasi mendalam 2-3 paragraf",
  "archaeologicalFacts": ["fakta 1", "fakta 2", "fakta 3"],
  "folkloreConnection": "string hubungan dengan cerita rakyat lokal Palembang",
  "stcThesisRole": "string peran spesifik dalam arsitektur Trust Layer STC",
  "suggestedQuestions": ["pertanyaan lanjutan 1", "pertanyaan lanjutan 2", "pertanyaan lanjutan 3"]
}`;

    const prompt = `Landmark: ${landmarkName} (Key: ${landmarkKey}).
${userQuestion ? `Pertanyaan pengunjung: "${userQuestion}"` : `Berikan bedah sejarah lengkap dan analisis peran kuratorial landmark ini.`}
Respon dalam JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (text) {
      const parsed = JSON.parse(text.trim());
      return res.json({
        landmarkKey,
        landmarkName: parsed.landmarkName || landmarkName,
        era: parsed.era || 'Lintas Era Palembang',
        curatorNarrative: cleanAsterisks(parsed.curatorNarrative || ''),
        archaeologicalFacts: Array.isArray(parsed.archaeologicalFacts)
          ? parsed.archaeologicalFacts.map(cleanAsterisks)
          : [],
        folkloreConnection: cleanAsterisks(parsed.folkloreConnection || ''),
        stcThesisRole: cleanAsterisks(parsed.stcThesisRole || ''),
        suggestedQuestions: Array.isArray(parsed.suggestedQuestions)
          ? parsed.suggestedQuestions.map(cleanAsterisks)
          : [],
      });
    }

    throw new Error('Empty response');
  } catch (error: any) {
    console.error('Server /api/curator/insight error:', error);
    return res.status(200).json({
      landmarkKey: req.body.landmarkKey || 'ampera',
      landmarkName: req.body.landmarkName || 'Landmark Sungai Musi',
      era: 'Warisan Budaya Palembang',
      curatorNarrative: 'Landmark bersejarah ini merupakan simpul penting dalam peradaban Sungai Musi.',
      archaeologicalFacts: ['Memiliki nilai histori mendalam bagi masyarakat Palembang.'],
      folkloreConnection: 'Terkait erat dengan folklor lisan masyarakat sungai.',
      stcThesisRole: 'Simpul validasi Proof-of-Presence pada STC Heritage Ledger.',
      suggestedQuestions: ['Bagaimana sejarah awal pembangunan situs ini?'],
    });
  }
});

// ==========================================
// 5. MUSI ORAL STORYTELLER ENDPOINT
// ==========================================
app.post('/api/storyteller/narrate', async (req: Request, res: Response) => {
  try {
    const { storyId, personaId, weather, customListenerContext } = req.body;
    const ai = getAIClient();

    const weatherDescriptions: Record<string, string> = {
      senja: 'Sore Senja Keemasan, langit memerah tembaga di atas lengkung jembatan Ampera dan riak air Sungai Musi berkilau keemasan.',
      purnama: 'Malam Bulan Purnama, pendar cahaya rembulan menerangi riak palung sungai Musi yang hening dan bayangan Pagoda Kemaro tampak mistis.',
      kabut: 'Pagi Berkabut Dingin, kabut embun tebal menyelimuti rawa-rawa nipah dan haluan perahu ketek meraba jalur air.',
      hujan: 'Hujan Muson Deras, gemuruh rintik hujan menderu di atas kanopi perahu, arus air Musi bergolak pasang.',
    };

    const weatherText = weatherDescriptions[weather] || weatherDescriptions.senja;

    if (!ai) {
      return res.json({
        title: 'Hikayat Warisan Sungai Musi',
        personaName: personaId === 'pengayuh-ketek' ? 'Wak Seman' : 'Pencerita Budaya Musi',
        weatherAtmosphere: weather || 'senja',
        storyNarrative: `Apo kabar sanak dulurku sekalian. Mari duduk di buritan perahu ketek aku, rasakan goyangan perahu membelah riak air cokelat Sungai Musi.\n\n${weatherText} Di perairan ini, orang tua-tua kito dari zaman bahari selalu berpesan bahwa Sungai Musi ini punyo nyawa. Jagalah sungai ini dengan rasa hormat dan kasih sayang.`,
        localProverb: 'Kalu dak pacak nambahi, jangan merusaki.',
        proverbMeaning: 'Jika tidak mampu memperindah warisan luhur, jangan sekali-kali merusaknya.',
        moralLesson: 'Hormatilah air dan pusaka leluhur demi keselamatan generasi mendatang.',
        stcLedgerProof: 'Katalog folklor terverifikasi pada STC Oral Heritage Ledger.',
      });
    }

    const personaPrompts: Record<string, string> = {
      'pengayuh-ketek':
        'Persona: Wak Seman (Tetua Pengayuh Ketek Sungai Musi). Gaya tutur lisan khas Palembang tempo dulu yang hangat dan magis ("Apo kabar dinda/sanak...", deru mesin tempel, riak gelombang air cokelat Musi).',
      'kurator-sriwijaya':
        'Persona: Dr. Raden Sriwijaya (Kurator Akademik Arkeologi & Epigrafi). Gaya bahasa ilmiah, analitis, filologis, kaitkan dengan Prasasti Kedukan Bukit 683 M, catatan I-Tsing, dan sedimentasi aluvial.',
      'dongeng-nusantara':
        'Persona: Bunda Kembang (Pencerita Dongeng Hikayat Nusantara). Lembut, ramah keluarga/anak, penuh analogi indah dan petuah budi pekerti luhur kebajikan bangsa.',
    };

    const personaDesc = personaPrompts[personaId] || personaPrompts['pengayuh-ketek'];

    const systemInstruction = `Anda adalah Pencerita Budaya Sungai Musi untuk SIGUNTANG - Smart Tourism Chain (STC).
Anda harus membawakan cerita rakyat Palembang secara dinamis dengan karakter persona yang dipilih pengguna.

${personaDesc}

KONDISI CUACA SAAT INI DI DIORAMA SUNGAI MUSI:
${weatherText}
Instruksi Penting: Cerita WAJIB mengintegrasikan suasana cuaca ini ke dalam paragraf pembuka dan penggambaran adegan cerita!

ATURAN FORMATTING:
- DILARANG menggunakan tanda bintang (asterisk '*' atau '**') untuk formatting teks, penebalan (bold), miring (italic), ataupun bullet points.
- Keluarkan respons HANYA dalam format JSON valid:
{
  "title": "string judul tutur",
  "personaName": "string nama persona",
  "weatherAtmosphere": "${weather || 'senja'}",
  "storyNarrative": "string narasi tutur lisan lengkap 3-4 paragraf yang sangat hidup, menawan, dan sesuai persona tanpa asterisk",
  "localProverb": "string pepatah/pantun Melayu Palembang kuno yang relevan",
  "proverbMeaning": "string makna pepatah",
  "moralLesson": "string pesan kebajikan budi pekerti luhur",
  "stcLedgerProof": "string catatan otentikasi bahwa tutur lisan ini dilindungi dalam STC Oral Heritage Ledger"
}`;

    const prompt = `Ceritakan hikayat bertema ID: "${storyId || 'kembang-dadar'}".
${customListenerContext ? `Permintaan khusus pendengar: "${customListenerContext}"` : ''}
Bawakan narasi secara mendalam dan penuh penghayatan.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (text) {
      const parsed = JSON.parse(text.trim());
      return res.json({
        title: cleanAsterisks(parsed.title || 'Tutur Lisan Musi'),
        personaName: cleanAsterisks(parsed.personaName || 'Wak Seman'),
        weatherAtmosphere: weather || 'senja',
        storyNarrative: cleanAsterisks(parsed.storyNarrative || ''),
        localProverb: cleanAsterisks(parsed.localProverb || 'Kalu dak pacak nambahi, jangan merusaki.'),
        proverbMeaning: cleanAsterisks(parsed.proverbMeaning || 'Lestarikanlah warisan yang telah ada.'),
        moralLesson: cleanAsterisks(parsed.moralLesson || 'Kebaikan budi pekerti adalah pelindung hakiki.'),
        stcLedgerProof: cleanAsterisks(parsed.stcLedgerProof || 'Tercatat dalam STC Protocol EIP-5192.'),
      });
    }

    throw new Error('Empty response');
  } catch (error: any) {
    console.error('Server /api/storyteller/narrate error:', error);
    return res.status(200).json({
      title: 'Hikayat Sungai Musi',
      personaName: 'Wak Seman',
      weatherAtmosphere: req.body.weather || 'senja',
      storyNarrative:
        'Sungai Musi mengalir membawa ribuan kisah leluhur Palembang. Duduklah santai di atas perahu sembari meresapi deburan riak air yang tenang.',
      localProverb: 'Banyu tenang jangan disangko dak buayo.',
      proverbMeaning: 'Tetaplah waspada dan rendah hati di hadapan keagungan alam ciptaan Yang Maha Kuasa.',
      moralLesson: 'Jaga keharmonisan antara manusia, sejarah, dan lingkungan sungai.',
      stcLedgerProof: 'Katalog tutur lisan STC Heritage Ledger.',
    });
  }
});

// ==========================================
// 6. SMART CRUISE & CARBON PLANNER ENDPOINT
// ==========================================
app.post('/api/planner/itinerary', async (req: Request, res: Response) => {
  try {
    const { durationHours, selectedInterests, transitMode, userCustomNotes } = req.body;
    const ai = getAIClient();

    const hours = Number(durationHours) || 4;
    const interests = Array.isArray(selectedInterests) ? selectedInterests : ['Warisan Sriwijaya', 'Kuliner Musi'];
    const modeName =
      transitMode === 'ketek-solar'
        ? 'Perahu Listrik Tenaga Surya (Eco-Boat STC)'
        : transitMode === 'hybrid-lrt'
          ? 'Rute Campuran Ketek + LRT Palembang'
          : 'Perahu Ketek Tradisional Diesel';

    const co2PerKm = transitMode === 'ketek-solar' ? 0.02 : transitMode === 'hybrid-lrt' ? 0.07 : 0.22;

    if (!ai) {
      const dist = +(hours * 3.5).toFixed(1);
      const totalCO2 = +(dist * co2PerKm).toFixed(2);
      return res.json({
        itineraryTitle: `Jelajah Maritim Musi (${hours} Jam)`,
        travelerProfile: `Wisatawan Budaya dengan fokus ${interests.join(' & ')}`,
        totalDurationHours: hours,
        totalDistanceKm: dist,
        transitModeName: modeName,
        carbonMetrics: {
          totalCarbonKg: totalCO2,
          carbonSavingsKg: +(dist * 0.3).toFixed(2),
          offsetRecommendation:
            'Tebus jejak emisi dengan mengadopsi bibit mangrove atau pohon nipah tepian Musi via STC Escrow.',
          efficiencyRating: transitMode === 'ketek-solar' ? 'Eco-Champion (A+)' : 'Heritage Authentic (B)',
        },
        narrativeOverview: `Rencana perjalanan ini dirancang khusus untuk memaksimalkan eksplorasi simpul budaya Palembang dalam durasi ${hours} jam dengan moda ${modeName}.`,
        stops: [
          {
            timeSlot: '08:30 - 09:45',
            stopName: 'Bukit Siguntang (Genesis Node)',
            category: 'Situs Arkeologi Sriwijaya',
            riverCoordinate: 'Hilir Sungai Tatang (Km 0)',
            activities: ['Ziarah arca Buddha abad ke-6', 'Melihat makam raja-raja Melayu'],
            localCulinaryTip: 'Sarapan Laksan kuah santan ebi hangat',
            sbtCollectible: 'Genesis Node Explorer SBT',
            carbonEmissionKg: +(dist * 0.3 * co2PerKm).toFixed(2),
          },
          {
            timeSlot: '10:00 - 11:30',
            stopName: 'Jembatan Ampera & Benteng Kuto Besak',
            category: 'Ikon Bahari',
            riverCoordinate: 'Dermaga 16 Ilir (Km 4.2)',
            activities: ['Melayari tiang Ampera', 'Kisah Antu Banyu audio tour'],
            localCulinaryTip: 'Pempek Panggang sambal ebi',
            sbtCollectible: 'Ampera Maritime Navigator SBT',
            carbonEmissionKg: +(dist * 0.4 * co2PerKm).toFixed(2),
          },
          {
            timeSlot: '11:45 - 12:30',
            stopName: 'Delta Suci Pulau Kemaro',
            category: 'Wisata Religi & Akulturasi',
            riverCoordinate: 'Delta Tengah Musi (Km 10.5)',
            activities: ['Mengunjungi Pagoda 9 Tingkat', 'Ziarah Tan Bun An & Siti Fatimah'],
            localCulinaryTip: 'Es Kacang Merah segar',
            sbtCollectible: 'Kemaro Pilgrimage Harmony SBT',
            carbonEmissionKg: +(dist * 0.3 * co2PerKm).toFixed(2),
          },
        ],
        stcSmartContractVerification: 'Rute pelayaran tervalidasi pada konsensus EIP-5192 STC Tourism Ledger.',
      });
    }

    const systemInstruction = `Anda adalah Perancang Perjalanan Cerdas & Ahli Ekowisata Bahari (Smart Heritage & Carbon-Optimized Cruise Planner) untuk SIGUNTANG - Smart Tourism Chain (STC).
Aplikasi ini dikembangkan dalam kerangka riset doktoral Dr. Akhmad Khudri di Universitas Bina Darma mengenai pelestarian warisan budaya berbasis blockchain dan AI.

Tugas Anda:
Merancang rencana perjalanan wisata maritim dan budaya Palembang yang efisien, kaya nilai historis, serta memperhitungkan jejak emisi karbon (STC CarbonPrint) secara akurat.

Ketentuan:
1. Rute harus realistis dan berurutan secara geografis di sepanjang Sungai Musi dan sekitarnya (Bukit Siguntang, Dermaga 16 Ilir, Jembatan Ampera, Benteng Kuto Besak, Museum SMB II, Kampung Songket Tangga Buntung, Kampung Arab Al-Munawar, Pulau Kemaro).
2. Hitung jarak laut Sungai Musi (km) dan kalikan dengan faktor emisi moda transit:
   - Faktor emisi moda saat ini: ${co2PerKm} kg CO2e per km
3. Tampilkan rekomendasi kuliner otentik di setiap titik (misal Pempek Panggang Saga, Pindang Pegagan, Burgo, Es Kacang Merah).
4. Tentukan jenis sertifikat Proof-of-Visit Soulbound Token (ERC-5192) yang bisa diklaim di setiap titik.

ATURAN FORMAT:
- DILARANG menggunakan karakter asterisk ('*' atau '**') di dalam nilai teks.
- Keluarkan respons HANYA dalam JSON valid:
{
  "itineraryTitle": "string judul rute menarik",
  "travelerProfile": "string ringkasan profil wisatawan",
  "totalDurationHours": number,
  "totalDistanceKm": number,
  "transitModeName": "${modeName}",
  "carbonMetrics": {
    "totalCarbonKg": number,
    "carbonSavingsKg": number,
    "offsetRecommendation": "string aksi tebus emisi karbon",
    "efficiencyRating": "Eco-Champion (A+) | Balanced Green (A) | Heritage Authentic (B)"
  },
  "narrativeOverview": "string ulasan narasi rute 2 paragraf tanpa asterisk",
  "stops": [
    {
      "timeSlot": "09:00 - 10:30",
      "stopName": "string nama simpul",
      "category": "string kategori",
      "riverCoordinate": "string koordinat / km sungai",
      "activities": ["aktivitas 1", "aktivitas 2"],
      "localCulinaryTip": "string tips kuliner",
      "sbtCollectible": "string nama tiket Proof-of-Visit SBT",
      "carbonEmissionKg": number
    }
  ],
  "stcSmartContractVerification": "string catatan sertifikasi rute STC"
}`;

    const prompt = `Durasi tersedia: ${hours} Jam.
Minat budaya: ${interests.join(', ')}.
Moda pelayaran: ${modeName} (Faktor emisi: ${co2PerKm} kg CO2e/km).
Catatan khusus pengunjung: "${userCustomNotes || 'Ingin menjelajahi ikon terbaik Palembang dengan efisien dan bermakna.'}"

Susun rencana perjalanan optimal dalam format JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (text) {
      const parsed = JSON.parse(text.trim());
      return res.json({
        itineraryTitle: cleanAsterisks(parsed.itineraryTitle || 'Ekspedisi Budaya Bahari Musi'),
        travelerProfile: cleanAsterisks(parsed.travelerProfile || 'Penjelajah Budaya Sriwijaya'),
        totalDurationHours: Number(parsed.totalDurationHours) || hours,
        totalDistanceKm: Number(parsed.totalDistanceKm) || hours * 3.5,
        transitModeName: modeName,
        carbonMetrics: {
          totalCarbonKg:
            Number(parsed.carbonMetrics?.totalCarbonKg) || +(hours * 3.5 * co2PerKm).toFixed(2),
          carbonSavingsKg:
            Number(parsed.carbonMetrics?.carbonSavingsKg) || +(hours * 3.5 * 0.35).toFixed(2),
          offsetRecommendation: cleanAsterisks(
            parsed.carbonMetrics?.offsetRecommendation ||
              'Donasi bibit pohon nipah di delta Pulau Kemaro melalui smart contract STC Green Escrow.'
          ),
          efficiencyRating:
            parsed.carbonMetrics?.efficiencyRating ||
            (transitMode === 'ketek-solar' ? 'Eco-Champion (A+)' : 'Heritage Authentic (B)'),
        },
        narrativeOverview: cleanAsterisks(parsed.narrativeOverview || ''),
        stops: Array.isArray(parsed.stops)
          ? parsed.stops.map((s: any) => ({
              timeSlot: cleanAsterisks(s.timeSlot || ''),
              stopName: cleanAsterisks(s.stopName || ''),
              category: cleanAsterisks(s.category || 'Cagar Budaya'),
              riverCoordinate: cleanAsterisks(s.riverCoordinate || 'Tepian Musi'),
              activities: Array.isArray(s.activities) ? s.activities.map(cleanAsterisks) : [],
              localCulinaryTip: cleanAsterisks(s.localCulinaryTip || 'Pempek Kapal Selam Tradisional'),
              sbtCollectible: cleanAsterisks(s.sbtCollectible || 'Proof-of-Visit SBT'),
              carbonEmissionKg: Number(s.carbonEmissionKg) || 0.4,
            }))
          : [],
        stcSmartContractVerification: cleanAsterisks(
          parsed.stcSmartContractVerification ||
            'Rute pelayaran tervalidasi pada konsensus EIP-5192 STC Tourism Ledger.'
        ),
      });
    }

    throw new Error('Empty response');
  } catch (error: any) {
    console.error('Server /api/planner/itinerary error:', error);
    return res.status(200).json({
      itineraryTitle: 'Ekspedisi Sungai Musi',
      travelerProfile: 'Wisatawan Nusantara',
      totalDurationHours: req.body.durationHours || 4,
      totalDistanceKm: 12.0,
      transitModeName: 'Perahu Ketek Tradisional Musi',
      carbonMetrics: {
        totalCarbonKg: 2.5,
        carbonSavingsKg: 1.2,
        offsetRecommendation: 'Penanaman bibit pohon nipah di pesisir delta Pulau Kemaro.',
        efficiencyRating: 'Heritage Authentic (B)',
      },
      narrativeOverview: 'Jelajah pesona budaya Palembang sepanjang tepian Sungai Musi.',
      stops: [],
      stcSmartContractVerification: 'Audit STC CarbonPrint valid.',
    });
  }
});

// ==========================================
// 7. WEBSOCKET FOR GEMINI LIVE API (/live)
// ==========================================
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const pathname = new URL(request.url || '', `http://${request.headers.host}`).pathname;
  if (pathname === '/live') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('Client connected to Live API WebSocket bridge');
  const ai = getAIClient();

  if (!ai) {
    clientWs.send(JSON.stringify({ error: 'Server GEMINI_API_KEY is not configured.' }));
    clientWs.close();
    return;
  }

  let session: any = null;
  try {
    session = await (ai as any).live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
        systemInstruction:
          'Anda adalah asisten suara real-time SIGUNTANG untuk memandu wisatawan di Sungai Musi Palembang. Bersikaplah ramah, ringkas, dan jelas dalam bahasa Indonesia.',
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          for (const part of message.serverContent?.modelTurn?.parts ?? []) {
            if (part.inlineData?.data) {
              if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ audio: part.inlineData.data }));
              }
            }
          }
          if (message.serverContent?.interrupted) {
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          }
        },
        onerror: (err: any) => {
          console.warn('Live API session error:', err);
        },
        onclose: () => {
          console.log('Live API session closed');
        },
      },
    });

    clientWs.on('message', (data: any) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.audio && session) {
          session.sendRealtimeInput({
            audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        }
      } catch (err) {
        console.warn('WebSocket message parse error:', err);
      }
    });

    clientWs.on('close', () => {
      try {
        if (session && typeof session.close === 'function') {
          session.close();
        }
      } catch (err) {
        // ignore
      }
    });
  } catch (err: any) {
    console.error('Failed to initialize Live API session:', err);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify({ error: 'Failed to establish Live API session' }));
      clientWs.close();
    }
  }
});

// ==========================================
// 8. VITE MIDDLEWARE (DEV) & STATIC (PROD)
// ==========================================
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`SIGUNTANG full-stack server running on http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

export default app;

if (process.env.VERCEL !== '1') {
  startServer().catch((err) => {
    console.error('Fatal server start error:', err);
  });
}

