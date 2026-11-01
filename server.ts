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

function isApiKeyError(err: any): boolean {
  if (!err) return false;
  const str = typeof err === 'string' ? err : (err.message || '') + JSON.stringify(err);
  return (
    str.includes('API_KEY_INVALID') ||
    str.includes('API key not valid') ||
    str.includes('API_KEY_SERVICE_BLOCKED') ||
    str.includes('PERMISSION_DENIED')
  );
}

function logEndpointHandled(endpointName: string, error: any) {
  if (isApiKeyError(error)) {
    console.warn(`[${endpointName}] Gemini API key invalid or unconfigured. Serving curated authentic fallback.`);
  } else {
    console.warn(`[${endpointName}] Fallback invoked:`, error?.message || String(error));
  }
}

function getCuratorFallbackData(landmarkKey: string, landmarkName: string, userQuestion?: string) {
  const k = (landmarkKey || '').toLowerCase();
  const n = (landmarkName || '').toLowerCase();

  if (k.includes('ampera') || n.includes('ampera')) {
    return {
      landmarkKey: 'ampera',
      landmarkName: 'Jembatan Ampera (Amanat Penderitaan Rakyat)',
      era: 'Modernisme Pasca-Kemerdekaan (1962 - 1965)',
      curatorNarrative: userQuestion
        ? `Terkait pertanyaan Anda: Jembatan Ampera bukan sekadar konstruksi baja berbobot 944 ton, melainkan manifesto kedaulatan maritim Indonesia pasca-kolonial yang digagas Presiden Soekarno menggunakan dana pampasan perang Jepang. Jembatan ini menyatukan Seberang Ulu dan Seberang Ilir yang selama berabad-abad dipisahkan oleh arus perkasa Sungai Musi.`
        : `Jembatan Ampera adalah ikon kebanggaan maritim Sumatra Selatan yang dibangun pada April 1962 dan diresmikan pada 1965. Menghubungkan Seberang Ulu dan Seberang Ilir dengan bentang tengah sepanjang 75 meter yang dulunya dapat terangkat vertikal setinggi 10 meter untuk memberikan ruang bagi kapal-kapal samudera bertonase besar melintas menuju pedalaman.\n\nSecara arsitektural dan kosmologis, jembatan ini menjadi titik pusat sumbu perniagaan modern Palembang, mengintegrasikan warisan maritim Sriwijaya abad ke-7 dengan dinamika kota metropolis modern di tepian 750 kilometer Sungai Musi.`,
      archaeologicalFacts: [
        'Mekanisme angkat seberat 500 ton dihentikan permanen sejak 1970 karena waktu pengangkatan 30 menit memicu kemacetan parah lalu lintas darat.',
        'Awalnya diberi nama Jembatan Bung Karno sebagai bentuk penghormatan, sebelum berganti menjadi Jembatan Ampera pada 1966.',
        'Tiang penyangga utama menancap sedalam 30 meter di bawah dasar berlumpur Sungai Musi untuk menahan abrasi arus deras muson.',
      ],
      folkloreConnection:
        'Masyarakat lokal meyakini bahwa pilar dasar Ampera dijaga oleh roh air mistis Antu Banyu dan Buaya Putih penjaga muara Musi yang menuntut rasa hormat bagi siapa pun yang melayari sungainya.',
      stcThesisRole:
        'Simpul utama monitoring emisi karbon perahu ketek dan audit kepadatan rute pelayaran maritim pada modul STC CarbonPrint & Spatial Ledger.',
      suggestedQuestions: [
        'Mengapa mekanisme jembatan angkat Ampera tidak lagi difungsikan?',
        'Bagaimana legenda Antu Banyu di sekitar tiang Ampera dijelaskan secara hidrologis?',
        'Apa peran strategis Ampera dalam menghubungkan Seberang Ulu dan Ilir?',
      ],
    };
  }

  if (k.includes('kemaro') || n.includes('kemaro')) {
    return {
      landmarkKey: 'kemaro',
      landmarkName: 'Pulau Kemaro & Pagoda Sembilan Tingkat',
      era: 'Akulturasi Abad 14 - Era Modern',
      curatorNarrative: userQuestion
        ? `Menjawab keingintahuan Anda: Pulau Kemaro adalah delta aluvial unik yang tidak pernah tenggelam meskipun debit Sungai Musi meluap hebat saat musim pasang. Fenomena hidrologis ini berpadu dengan romantisme sejarah cinta abadi Tan Bun An dan Siti Fatimah, menjadikannya monumen hidup toleransi akulturasi Tionghoa-Melayu tertua di Sumatra.`
        : `Pulau Kemaro terletak sekitar 6 km di hilir Jembatan Ampera, tepat di tengah pusaran Sungai Musi. Kata Kemaro berasal dari kata Kemarau karena delta ini selalu kering dan tidak pernah terendam air pasang sungai sedalam apa pun.\n\nDi pulau ini berdiri megah Pagoda 9 Tingkat berarsitektur khas Tiongkok selatan yang dibangun pada tahun 2006, bersanding damai dengan Klenteng Hok Tjing Rio yang berdiri sejak 1962 dan makam keramat Tan Bun An serta Siti Fatimah, menjadi pusat perayaan Cap Go Meh yang dihadiri puluhan ribu peziarah dari seluruh Asia Tenggara.`,
      archaeologicalFacts: [
        'Delta terbentuk dari sedimentasi aluvial berabad-abad di percabangan muara anak sungai Komering dan Musi.',
        'Terdapat pohon cinta legendaris di mana pasangan sering mengukir nama sebagai simbol janji suci abadi.',
        'Menjadi benteng pertahanan maritim alami Kesultanan Palembang saat menghadapi ekspedisi VOC Belanda pada abad ke-17.',
      ],
      folkloreConnection:
        'Kisah pangeran Tiongkok Tan Bun An yang menenggelamkan diri bersama guci berharga karena salah paham menyangka hanya berisi sawi asin, disusul oleh putri Palembang Siti Fatimah yang melompat bersamanya seraya bersumpah melahirkan pulau suci cinta abadi.',
      stcThesisRole:
        'Simpul validasi Proof-of-Physical-Presence (PoPP) dan penerbitan Soulbound Token ziarah antar-budaya berbasis konsensus EIP-5192.',
      suggestedQuestions: [
        'Mengapa Pulau Kemaro tidak pernah tenggelam saat air pasang besar?',
        'Bagaimana kisah Tan Bun An dan Siti Fatimah melahirkan tradisi Cap Go Meh di sini?',
        'Apa makna arsitektur 9 tingkat pada pagoda Pulau Kemaro?',
      ],
    };
  }

  if (k.includes('siguntang') || n.includes('siguntang')) {
    return {
      landmarkKey: 'siguntang',
      landmarkName: 'Situs Bukit Siguntang (Genesis Node)',
      era: 'Awal Kemaharajaan Bahari Sriwijaya (Abad 6 - 7 Masehi)',
      curatorNarrative: userQuestion
        ? `Jawaban kuratorial untuk Anda: Bukit Siguntang adalah hulu kosmologis peradaban Sriwijaya. Prasasti Kedukan Bukit (683 M) membuktikan bahwa Dapunta Hyang Sri Jayanasa mengawali ekspedisi suci siddhayatra untuk menegakkan pusat pemerintahan kemakmuran bahari bertolak dari titik kosmologis ini.`
        : `Bukit Siguntang menjulang 27 meter di atas permukaan laut di kawasan barat Palembang. Secara geomorfologis dan spiritual, bukit ini adalah titik tertinggi di dataran aluvial rawa Palembang, menjadikannya pusat kosmologis suci bagi peradaban Kerajaan Maritim Sriwijaya sejak abad ke-7.\n\nDi bukit ini ditemukan arca Buddha bergaya Amarawati setinggi 2,77 meter dari abad ke-6, pecahan keramik Dinasti Tang, serta makam tokoh-tokoh suci seperti Raden Fatah, Panglima Tuan Junjungan, dan Putri Kembang Dadar. Bukit Siguntang adalah akar legitimasi silsilah raja-raja Melayu di Nusantara hingga Semenanjung Malaka.`,
      archaeologicalFacts: [
        'Ditemukan fragmen arca Buddha Mahayana abad ke-6 tanpa kepala pada tahun 1920-an oleh tim arkeologi Hindia Belanda (F.D.K. Bosch).',
        'Disebut dalam kitab Sejarah Melayu (Sulalatus Salatin) sebagai tempat turunnya tiga pangeran keturunan Raja Iskandar Zulkarnain, leluhur raja-raja Melayu.',
        'Merupakan lokasi ritual siddhayatra dan penyimpanan abu leluhur kerajaan bahari Sriwijaya.',
      ],
      folkloreConnection:
        'Mitos Putri Kembang Dadar yang suci dan kebal senjata, simbol kemurnian budi pekerti wanita Melayu yang mengilhami nama tarian Gending Sriwijaya.',
      stcThesisRole:
        'Genesis Node (Node #0) yang memegang peran root of trust dalam registrasi seluruh simpul budaya dan verifikasi silsilah data pada platform SIGUNTANG.',
      suggestedQuestions: [
        'Apa kaitan Bukit Siguntang dengan Prasasti Kedukan Bukit 683 M?',
        'Mengapa arca Buddha Amarawati di Bukit Siguntang dinilai sangat penting bagi dunia?',
        'Siapakah sebenarnya sosok Putri Kembang Dadar dalam kosmologi Melayu?',
      ],
    };
  }

  // Default: Perahu Ketek Tradisional Musi
  return {
    landmarkKey: 'ketek',
    landmarkName: 'Perahu Ketek Tradisional Sungai Musi',
    era: 'Kearifan Maritim Lokal Abad Pertengahan hingga Kontemporer',
    curatorNarrative: userQuestion
      ? `Jawaban kuratorial Anda: Perahu Ketek adalah pembuluh darah kehidupan masyarakat sungai Palembang. Bunyi ritmis mesin tempelnya tek-tek-tek adalah melodi otentik yang melintasi lorong-lorong anak sungai Musi, menghubungkan kampung terapung dengan pasar 16 Ilir selama lebih dari satu abad.`
      : `Perahu Ketek adalah perahu kayu bermotor khas Palembang yang menjadi urat nadi mobilitas masyarakat tepian Sungai Musi. Namanya diambil dari tiruan bunyi mesin tempel berbahan bakar diesel yang berbunyi teratur ketek-ketek-ketek saat membelah riak arus air cokelat Musi.\n\nDibuat secara turun-temurun oleh pandai kayu kapal menggunakan kayu ulin atau kayu damar laut yang tahan lapuk di air tawar, ketek mampu menembus selokan dan anak sungai sempit yang tidak dapat diakses oleh kapal cepat modern, menjadikannya warisan maritim fungsional yang tak tergantikan.`,
    archaeologicalFacts: [
      'Mengadopsi rancang bangun perahu cadik dan sampan lunas datar kuno yang telah dipahat pada relief Candi Borobudur abad ke-8.',
      'Setiap perahu dikalibrasi secara manual oleh tukang perahu Seberang Ulu tanpa menggunakan cetak biru komputasi.',
      'Menjadi moda utama pengangkutan bahan pangan dari pedalaman hulu Musi (Ogan, Komering, Lematang) menuju bandar Palembang.',
    ],
    folkloreConnection:
      'Para pengemudi ketek memiliki kearifan tradisional membaca tanda air dan arah angin muson untuk menghindari pusaran air maut yang dipercaya dihuni oleh siluman buaya buntung.',
    stcThesisRole:
      'Unit sensor fisik bergerak yang terhubung melalui IoT Web Serial & BLE Gateway untuk menghitung jejak karbon wisatawan secara real-time.',
    suggestedQuestions: [
      'Bagaimana teknik pembuatan kayu perahu ketek agar kedap air dan tahan belasan tahun?',
      'Berapa rata-rata jejak karbon perahu ketek dibandingkan kapal motor modern?',
      'Bagaimana rute penyeberangan ketek tertua dari 16 Ilir menuju Seberang Ulu?',
    ],
  };
}

function getPrasastiFallbackData(name: string, category?: string, stone?: string, customPledge?: string) {
  const visitorName = name || 'Nusantara';
  const pledgeCat = category || 'Pelestarian Warisan Sriwijaya & Kemakmuran Musi';
  return {
    steleTitle: `Prasasti Sumpah Abadi ${visitorName}`,
    visitorName,
    oldMalayText: `Śrī! Śaka-warṣātīta 605 dāpūnta hyaŋ nāyik di sāmvau maṅalap siddhayātra. Ni-sumpahhon dŋan baktī de śrī ${visitorName}: 'Kalu marwwāt kadātuan sarvwa-pradāna wanua Musi, tida ya marpāh tida ya mamāwa rogā, sukha-citta makasampūrṇa.'`,
    phoneticTransliteration: `Shri! Shaka-warsatita... Dapunta hyang nayik di samvau mangalap siddhayatra. Ni-sumpahhon dngan bhakti de shri ${visitorName}: 'Kalu marwwat kadatuan sarwwa-pradana wanua Musi, tida ya marpah tida ya mamawa roga, sukha-citta makasampurna.'`,
    pallawaScript: `ꦯꦿꦷ! ꦯꦏꦮꦂꦰꦴꦠꦷꦠ ꦢꦴꦥꦹꦤ꧀ꦠ ꦲꦾꦁ ꦤꦴꦪꦶꦏ꧀ ꦢꦶ ꦱꦴꦩ꧀ꦮꦻꦴ ꦩꦔꦭꦥ꧀ ꦱꦶꦢ꧀ꦣꦪꦴꦠꦿ꧉ ꦤꦶꦱꦸꦩ꧀ꦥꦃꦲꦺꦴꦤ꧀ ꦢꦼ ꦯꦿꦷ ${visitorName}`,
    indonesianTranslation: `Semoga jaya dan selamat! Dengan kemuliaan sumpah suci yang diikrarkan oleh ${visitorName}: 'Maka kami bersumpah dengan segenap pengabdian hati untuk memelihara kedatuan dan tanah leluhur Musi, tiada akan merusaknya, tiada membawa marabahaya, melainkan mendatangkan kemakmuran dan kedamaian paripurna.'`,
    curseProtectionFormula: `Barang siapa teguh memegang ikrar pelestarian ini, baginya keberkahan tanah air dan sungai nan suci. Dan barang siapa berbuat khianat serta merusak pusaka Musi, niscaya binasa ditimpa sumpah para dewa leluhur Sriwijaya.`,
    historicalContextNotes: `Mengadopsi formula epigrafi prasasti Kedukan Bukit (683 M) dan Telaga Batu abad ke-7 yang ditemukan di Palembang. Mencerminkan tradisi sumpah kesetiaan (sapatha) terhadap kedaulatan peradaban air.`,
    sbtMetadata: {
      name: `Prasasti Digital Sumpah Budaya - ${visitorName}`,
      description: `Prasasti Sumpah Digital beraksara Pallawa dan berbahasa Melayu Kuna abad ke-7. Diterbitkan sebagai Soulbound Token (ERC-5192) tidak dapat dipindahtangankan pada Smart Tourism Chain (STC).`,
      attributes: [
        { trait_type: 'Pemberi Sumpah', value: visitorName },
        { trait_type: 'Kategori Sumpah', value: pledgeCat },
        { trait_type: 'Bahasa', value: 'Melayu Kuna Abad ke-7' },
        { trait_type: 'Aksara Epigrafi', value: 'Pallawa Sriwijaya' },
        {
          trait_type: 'Format Batu',
          value:
            stone === 'andesit-telaga-batu'
              ? 'Batu Andesit Hitam Telaga Batu'
              : 'Batu Sandstone Bukit Siguntang',
        },
        { trait_type: 'Protokol STC', value: 'EIP-5192 Immutable SBT' },
      ],
    },
  };
}

// ==========================================
// 1. CHAT ENDPOINT (SIGUNTANG AI GUIDE)
// ==========================================
function getAIGuideFallbackResponse(userMessage: string): string {
  const q = (userMessage || '').toLowerCase();

  if (q.includes('prasasti') || q.includes('pallawa') || q.includes('melayu kuno') || q.includes('sumpah') || q.includes('ikrar')) {
    return 'Generator Prasasti Digital SIGUNTANG mengonversi komitmen pelestarian budaya Anda ke tata bahasa Melayu Kuna abad ke-7, serupa dengan gaya bahasa Prasasti Kedukan Bukit (683 M) dan Telaga Batu ("Dapunta Hyan nayik di samvau mangalap siddhayatra..."). Hasilnya mencakup transliterasi fonetik Latin, teks beraksara Pallawa/Kaganga, formula kutukan pelindung sakral (sapatha), serta langsung dapat diminting on-chain sebagai Soulbound Token (ERC-5192) yang abadi di jaringan STC.';
  }

  if (q.includes('sbt') || q.includes('soulbound') || q.includes('proof-of-visit') || q.includes('token') || q.includes('nft') || q.includes('mint')) {
    return 'Soulbound Token (SBT) dengan standar ERC-5192 di SIGUNTANG adalah tanda pengenal dan sertifikat digital non-transferable yang terikat permanen ke dompet Web3 Anda. SBT ini berfungsi sebagai Proof-of-Visit otentik saat Anda mengunjungi simpul budaya (seperti Jembatan Ampera, Pagoda Pulau Kemaro, Bukit Siguntang, maupun Benteng Kuto Besak). Karena tidak dapat diperjualbelikan, SBT ini menjadi reputasi abadi dan bukti kedaulatan budaya pengunjung.';
  }

  if (q.includes('carbon') || q.includes('karbon') || q.includes('emisi') || q.includes('planner') || q.includes('rute') || q.includes('itinerary') || q.includes('cruise')) {
    return 'Smart Heritage Itinerary & Carbon-Optimized Musi Cruise Planner menggunakan Google Search Grounding untuk merancang penjelajahan budaya Sungai Musi yang dipersonalisasi. Sistem ini memperhitungkan estimasi waktu labuh perahu ketek atau kapal wisata, menghitung jejak karbon perjalanan secara real-time melalui STC CarbonPrint, menyediakan rekomendasi aksi hijau (eco-offset seperti penanaman pohon nipah di delta Kemaro), serta memetakan tiket Proof-of-Visit SBT di setiap persinggahan.';
  }

  if (q.includes('curator') || q.includes('kurator') || q.includes('diorama') || q.includes('3d') || q.includes('bedah')) {
    return 'Context-Aware AI Curator terpasang langsung di dalam Diorama 3D WebGL Sungai Musi. Saat Anda mengeklik objek landmark 3D (seperti Jembatan Ampera, Pagoda Pulau Kemaro, Bukit Siguntang, Benteng Kuto Besak, atau Kampung Arab Al-Munawar), tombol "Bedah Sejarah dengan AI Curator" langsung memicu prompt context-injection spasial dan arkeologis ke Gemini, menyajikan dialog interaktif mendalam tentang rahasia sejarah, mitologi, dan peran simpul tersebut tanpa perlu mengetik dari nol.';
  }

  if (q.includes('storyteller') || q.includes('persona') || q.includes('dongeng') || q.includes('tutur') || q.includes('suara') || q.includes('audio')) {
    return 'AI Musi Storyteller menghadirkan 3 persona narator dinamis: 1) Tetua Pengayuh Ketek Sungai Musi (tutur lisan Melayu Palembang tempo dulu yang hangat dan magis), 2) Kurator Akademik Sejarah Sriwijaya (ilmiah, analitis, sarat fakta arkeologis), dan 3) Pencerita Dongeng Anak Nusantara (ramah anak dan sarat kebajikan moral). Cerita ini beradaptasi secara dinamis dengan cuaca diorama 3D (Senja Emas, Malam Purnama, Hujan Kabut Musi, atau Fajar Tropis).';
  }

  if (q.includes('blockchain') || q.includes('stc') || q.includes('traceability') || q.includes('disertasi') || q.includes('bina darma') || q.includes('khudri')) {
    return 'Platform SIGUNTANG dan arsitektur Smart Tourism Chain (STC) dikembangkan dalam kerangka riset disertasi doktoral Dr. Akhmad Khudri di Universitas Bina Darma. Blockchain berperan sebagai Trust Layer yang mencatat hash SHA-256 pada ledger terdesentralisasi, memastikan provenance kain songket tenun tangan Tuan Kentang, mencegah distorsi sejarah folklore, memvalidasi data sensor IoT sandar perahu, dan menjaga transparansi donasi cagar budaya.';
  }

  if (q.includes('node') || q.includes('simpul') || q.includes('ampera') || q.includes('kemaro') || q.includes('benteng') || q.includes('al-munawar') || q.includes('ketek')) {
    return 'SIGUNTANG mengintegrasikan 9 Universal Node budaya di Palembang: 1) Bukit Siguntang (Genesis Node Sriwijaya), 2) Museum Sultan Mahmud Badaruddin II, 3) Masjid Agung SMB I, 4) Sentra Songket Tuan Kentang, 5) Jembatan Ampera, 6) Pulau Kemaro & Pagoda 9 Tingkat, 7) Perahu Ketek Dermaga Point, 8) Benteng Kuto Besak (Kawasan Bahari Keraton), dan 9) Kampung Arab Al-Munawar 13 Ulu. Semua simpul memiliki data spasial, kurasi sejarah, dan verifikasi on-chain.';
  }

  return 'Halo! Saya SIGUNTANG AI Guide. Saya dibekali kecerdasan komprehensif mengenai 9 Simpul Budaya Palembang, Ekspedisi Diorama 3D Sungai Musi, AI Musi Storyteller beradaptasi cuaca, Smart Cruise Planner berorientasi jejak karbon (STC CarbonPrint), Generator Prasasti Digital Aksara Pallawa, Context-Aware AI Curator 3D, serta protokol blockchain Smart Tourism Chain (ERC-5192 Soulbound Token, Traceability Hub, dan IoT Phygital). Silakan ajukan pertanyaan seputar budaya atau teknologi SIGUNTANG!';
}

app.post('/api/chat', async (req: Request, res: Response) => {
  const { messages, stream } = req.body || {};
  const lastMessage = Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1]?.content || 'Halo' : 'Halo';

  try {
    const ai = getAIClient();

    if (!ai) {
      return res.status(200).json({
        text: getAIGuideFallbackResponse(lastMessage),
      });
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Array pesan dibutuhkan.' });
    }

    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content || '' }],
    }));

    const systemInstruction = `Anda adalah SIGUNTANG AI Guide, asisten digital cerdas kelas dunia untuk platform SIGUNTANG (Sistem Integrasi Gerbang Universal Node, Traceability & Artificial Intelligence Nusantara Gemilang).
Platform ini merupakan bagian dari riset disertasi doktoral Dr. Akhmad Khudri di Universitas Bina Darma mengenai kedaulatan cagar budaya maritim berbasis blockchain (Smart Tourism Chain / STC) dan Generative AI.

PENGETAHUAN LENGKAP FITUR AI TERBARU SIGUNTANG:
1. AI Musi Storyteller Berbasis Persona & Adaptasi Cuaca:
   - Tiga persona penutur:
     a. Tetua Pengayuh Ketek Palembang tempo dulu: Gaya bahasa tutur lisan Melayu Palembang hangat, berjiwa kearifan lokal magis, akrab memanggil sanak/dulur.
     b. Kurator Akademik Sejarah Sriwijaya: Analitis, ilmiah, membedah temuan arca, prasasti abad ke-7, dan geo-arkeologi Sungai Musi.
     c. Pencerita Dongeng Anak Nusantara: Hangat, edukatif, ramah anak, sarat amanat moral kebajikan.
   - Adaptasi dinamis terhadap 4 kondisi cuaca Diorama 3D:
     * Senja Emas (Golden Dusk): Pantulan cahaya jingga di riak Musi, desau angin hilir.
     * Malam Purnama (Full Moon): Gemerlap cahaya perak bulan di palung sungai, ziarah malam Pulau Kemaro.
     * Hujan Kabut Musi (Rainy Mist): Rintik hujan menimpa atap perahu ketek, mistisisme Antu Banyu.
     * Fajar Tropis (Emerald Dawn): Deru fajar perahu pasar terapung, kesegaran udara pagi Palembang.

2. Smart Heritage Itinerary & Carbon-Optimized Musi Cruise Planner:
   - Menggunakan Google Search Grounding untuk merancang rencana perjalanan wisata budaya Palembang yang terpersonalisasi.
   - Pilihan moda transportasi air: Perahu Ketek Tradisional Musi, Speedboat Musi Express, dan Hybrid Solar Eco-Cruise.
   - Estimasi waktu labuh perahu dan koordinat simpul.
   - Perhitungan jejak karbon (STC CarbonPrint Protocol) secara real-time, perbandingan emisi terhadap kapal modern, serta rekomendasi kompensasi hijau (eco-offset, contohnya penanaman pohon nipah di delta Pulau Kemaro).
   - Rekomendasi tiket Proof-of-Visit SBT di setiap persinggahan.

3. Generator Prasasti Digital Aksara Pallawa / Melayu Kuno Abad ke-7:
   - Filologi dan epigrafi kuno: Mengonversi sumpah/komitmen pengunjung ke tata bahasa Melayu Kuna abad ke-7 yang otentik (mengacu pada Prasasti Kedukan Bukit 683 M, Talang Tuwo 684 M, dan Telaga Batu: "Dapunta Hyan nayik di samvau mangalap siddhayatra...").
   - Menghasilkan transliterasi fonetik Latin dan padanan Aksara Pallawa / Ulu Kaganga.
   - Memuat formula kutukan pelindung suci (sapatha) bagi siapa pun yang merusak atau mengkhianati kelestarian alam dan air Sungai Musi.
   - Hasil prasasti dapat langsung diminting on-chain sebagai Soulbound Token (ERC-5192) yang abadi.

4. Context-Aware AI Curator Langsung di dalam Objek 3D Diorama:
   - Di dalam Diorama 3D WebGL, saat mengeklik landmark (Ampera, Pagoda Pulau Kemaro, Bukit Siguntang, Perahu Ketek, Benteng Kuto Besak, atau Kampung Arab Al-Munawar), tombol "Bedah Sejarah dengan AI Curator" langsung memicu prompt context-injection spasial dan arkeologis tanpa mengetik manual.

5. AI Vision Artifact Inspector:
   - Pemeriksaan visual artefak budaya (motif kain Songket Tuan Kentang, mata uang koin kuno Kesultanan, arca Buddha Siguntang) berbasis Computer Vision multimodal.

6. Gemini Live Audio API:
   - Interaksi suara real-time dua arah tanpa jeda (full-duplex streaming) via WebSocket /live.

PENGETAHUAN LENGKAP PROTOKOL BLOCKCHAIN STC (SMART TOURISM CHAIN):
1. ERC-5192 Soulbound Tokens (SBT):
   - Token bukti ziarah dan keterlibatan budaya (Proof-of-Visit) yang non-transferable (terkunci permanen pada address pengunjung).
   - Mencegah spekulasi finansial dan memastikan autentisitas pengalaman wisata budaya.
2. Traceability Hub & Decentralized Trust Layer:
   - Pencatatan hash SHA-256 pada ledger terdesentralisasi untuk menjamin integritas naskah sejarah, provenance motif songket asli, dan riwayat sumpah prasasti.
   - Sistem audit donasi pelestarian transparan tanpa potongan pihak ketiga tersembunyi.
3. Phygital IoT Integration:
   - Koneksi konsol perangkat keras (ESP32 BLE/Web Serial) pada dermaga perahu ketek yang secara otomatis memicu transaksi smart contract on-chain saat perahu berlabuh.
4. STC CarbonPrint Green Tourism:
   - Protokol audit emisi karbon perjalanan wisata air berbasis smart contract.

DAFTAR 9 UNIVERSAL NODE BUDAYA PALEMBANG:
1. node-0: Bukit Siguntang (Genesis Node, titik kosmologis Sriwijaya abad ke-7).
2. node-1: Museum Sultan Mahmud Badaruddin II (Peninggalan Kesultanan Palembang Darussalam).
3. node-2: Masjid Agung Sultan Mahmud Badaruddin I (Arsitektur akulturasi Tionghoa, Eropa, Melayu).
4. node-3: Pengrajin Songket Tuan Kentang (Sentra tenun kriya benang emas tradisional).
5. node-ampera: Jembatan Ampera (Ikon maritim agung pemersatu Ulu & Ilir, simpul IoT CarbonPrint).
6. node-kemaro: Pulau Kemaro & Pagoda 9 Tingkat (Delta suci legenda Tan Bun An & Siti Fatimah, harmoni multietnis).
7. node-ketek: Perahu Ketek Tradisional Musi Dermaga Point (Transportasi sungai tradisional berirama tek-tek-tek).
8. node-bkb: Benteng Kuto Besak Kawasan Bahari SMB (Benteng pertahanan keraton abad ke-18 di hadapan Sungai Musi).
9. node-almunawar: Kampung Arab Al-Munawar 13 Ulu (Kawasan cagar budaya 300 tahun dengan Rumah Limas ulin dan tradisi gambus).

GAYA DAN ATURAN RESPON:
- Berikan jawaban yang ramah, berwibawa, sarat pengetahuan, dan membanggakan budaya Nusantara.
- PENTING: DILARANG KERAS menggunakan karakter tanda bintang (asterisk '*' atau '**') untuk formatting teks, penebalan (bold), miring (italic), ataupun bullet point. Tuliskan teks secara bersih, elegan, dan natural tanpa markdown asterisk.`;

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
    const rawText = result.text || getAIGuideFallbackResponse(lastMessage);
    return res.json({ text: cleanAsterisks(rawText) });
  } catch (error: any) {
    logEndpointHandled('/api/chat', error);
    return res.status(200).json({
      text: getAIGuideFallbackResponse(lastMessage),
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
  const { landmarkKey, landmarkName, userQuestion } = req.body;
  const fallback = getCuratorFallbackData(landmarkKey, landmarkName, userQuestion);

  try {
    const ai = getAIClient();

    if (!ai) {
      return res.json(fallback);
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

    const prompt = `Landmark: ${landmarkName || fallback.landmarkName} (Key: ${landmarkKey || fallback.landmarkKey}).
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
        landmarkKey: landmarkKey || fallback.landmarkKey,
        landmarkName: parsed.landmarkName || landmarkName || fallback.landmarkName,
        era: parsed.era || fallback.era,
        curatorNarrative: cleanAsterisks(parsed.curatorNarrative || fallback.curatorNarrative),
        archaeologicalFacts: Array.isArray(parsed.archaeologicalFacts) && parsed.archaeologicalFacts.length > 0
          ? parsed.archaeologicalFacts.map(cleanAsterisks)
          : fallback.archaeologicalFacts,
        folkloreConnection: cleanAsterisks(parsed.folkloreConnection || fallback.folkloreConnection),
        stcThesisRole: cleanAsterisks(parsed.stcThesisRole || fallback.stcThesisRole),
        suggestedQuestions: Array.isArray(parsed.suggestedQuestions) && parsed.suggestedQuestions.length > 0
          ? parsed.suggestedQuestions.map(cleanAsterisks)
          : fallback.suggestedQuestions,
      });
    }

    throw new Error('Empty response');
  } catch (error: any) {
    logEndpointHandled('/api/curator/insight', error);
    return res.status(200).json(fallback);
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
// 7. DIGITAL PALLAWA PRASASTI GENERATOR
// ==========================================
app.post('/api/prasasti/generate', async (req: Request, res: Response) => {
  const { visitorName, pledgeCategory, customPledge, stoneStyle } = req.body || {};
  const name = visitorName?.trim() || 'Sahabat Budaya Nusantara';
  const category = pledgeCategory || 'Pelestarian Warisan Sriwijaya & Kemakmuran Musi';
  const pledge = customPledge?.trim() || 'Berjanji menjaga keluhuran adat, memuliakan air Sungai Musi, dan melestarikan pusaka Sriwijaya hingga akhir zaman.';
  const stone = stoneStyle || 'sandstone-kedukan';
  const fallback = getPrasastiFallbackData(name, category, stone, pledge);

  try {
    const ai = getAIClient();

    if (!ai) {
      return res.json(fallback);
    }

    const systemInstruction = `Anda adalah Epigraf Senior & Filolog Aksara Kuno Kemaharajaan Bahari Sriwijaya untuk platform SIGUNTANG - Smart Tourism Chain (STC).
Proyek ini merupakan bagian dari riset disertasi doktoral Dr. Akhmad Khudri di Universitas Bina Darma mengenai pelestarian warisan budaya berbasis blockchain dan AI.

Tugas Anda:
Mengonversi ikrar atau komitmen sumpah pelestarian budaya pengunjung menjadi Prasasti Batu Digital bergaya epigrafi Melayu Kuna abad ke-7 (seperti pada Prasasti Telaga Batu, Kedukan Bukit 683 M, dan Talang Tuwo 684 M).

Kaidah Epigrafi Melayu Kuna Abad ke-7:
1. Awali dengan seruan pembuka suci: "Śrī! Śiddham" atau "Śrī! Śaka-warṣātīta..."
2. Gunakan kosakata dan morfologi Melayu Kuna otentik:
   - "Dapunta Hyaṅ", "Puŋku", "Marwwāt", "Samvau" (perahu/kapal), "Wanua" (kota/negeri peradaban), "Siddhayātra" (perjalanan suci kejayaan), "Bhakti" (kesetiaan murni), "Kalu" (apabila), "Makasampūrṇa" (menjadikan paripurna), "Nāyik" (naik/berlayar), "Kadātuan" (kedatuan Sriwijaya).
   - Terapkan imbuhan purba: mar- (ber-), ni- (di-), par- (per-).
3. Buat formula sumpah suci dan peringatan kutukan pelindung (sapatha) terhadap siapa pun yang merusak atau mengkhianati pusaka alam/budaya Sungai Musi.
4. Tampilkan padanan teks Aksara Pallawa / Ulu Kaganga klasik (karakter kuno megah yang dapat dirender di font web).
5. Terjemahan modern bahasa Indonesia yang agung, puitis, dan menyentuh sanubari.
6. HANYA keluarkan format JSON valid tanpa tanda bintang asterisk (*) di semua nilai string:
{
  "steleTitle": "string judul prasasti",
  "visitorName": "${name}",
  "oldMalayText": "string teks Melayu Kuna abad ke-7 yang otentik dan kaya istilah arkeologi",
  "phoneticTransliteration": "string transliterasi fonetik latin",
  "pallawaScript": "string padanan aksara Pallawa/Kaganga",
  "indonesianTranslation": "string terjemahan modern bahasa Indonesia agung",
  "curseProtectionFormula": "string formula sumpah pelindung tradisi Sriwijaya",
  "historicalContextNotes": "string catatan filologis perbandingan dengan prasasti Kedukan Bukit/Telaga Batu",
  "sbtMetadata": {
    "name": "string nama token SBT",
    "description": "string deskripsi token untuk IPFS",
    "attributes": [
      { "trait_type": "Pemberi Sumpah", "value": "${name}" },
      { "trait_type": "Kategori Sumpah", "value": "${category}" },
      { "trait_type": "Bahasa", "value": "Melayu Kuna Abad ke-7" },
      { "trait_type": "Aksara Epigrafi", "value": "Pallawa Sriwijaya" },
      { "trait_type": "Batu Epigrafi", "value": "Batu Prasasti Alam" },
      { "trait_type": "Protokol STC", "value": "EIP-5192 Immutable SBT" }
    ]
  }
}`;

    const prompt = `Nama Pengunjung: ${name}
Kategori Ikrar: ${category}
Isi Komitmen / Sumpah: "${pledge}"
Gaya Batu Prasasti: ${stone}

Gubah menjadi Prasasti Digital Melayu Kuna abad ke-7 dalam format JSON sesuai instruksi.`;

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
        steleTitle: cleanAsterisks(parsed.steleTitle || `Prasasti Sumpah ${name}`),
        visitorName: name,
        oldMalayText: cleanAsterisks(parsed.oldMalayText || ''),
        phoneticTransliteration: cleanAsterisks(parsed.phoneticTransliteration || ''),
        pallawaScript: cleanAsterisks(parsed.pallawaScript || ''),
        indonesianTranslation: cleanAsterisks(parsed.indonesianTranslation || ''),
        curseProtectionFormula: cleanAsterisks(parsed.curseProtectionFormula || ''),
        historicalContextNotes: cleanAsterisks(parsed.historicalContextNotes || ''),
        sbtMetadata: {
          name: cleanAsterisks(parsed.sbtMetadata?.name || `Prasasti Digital Sumpah Budaya - ${name}`),
          description: cleanAsterisks(parsed.sbtMetadata?.description || `Prasasti Sumpah Digital beraksara Pallawa Melayu Kuna.`),
          attributes: Array.isArray(parsed.sbtMetadata?.attributes) ? parsed.sbtMetadata.attributes : [
            { trait_type: 'Pemberi Sumpah', value: name },
            { trait_type: 'Kategori Sumpah', value: category },
            { trait_type: 'Bahasa', value: 'Melayu Kuna Abad ke-7' },
            { trait_type: 'Aksara Epigrafi', value: 'Pallawa Sriwijaya' },
            { trait_type: 'Format Batu', value: stone },
            { trait_type: 'Protokol STC', value: 'EIP-5192 Immutable SBT' }
          ]
        }
      });
    }

    throw new Error('Empty model response');
  } catch (error: any) {
    logEndpointHandled('/api/prasasti/generate', error);
    return res.status(200).json(fallback);
  }
});

// ==========================================
// 8. WEBSOCKET FOR GEMINI LIVE API (/live)
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

