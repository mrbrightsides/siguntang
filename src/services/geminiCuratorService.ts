/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { cleanAsterisks } from "../lib/utils";

export interface LandmarkCuratorInsight {
  landmarkKey: string;
  landmarkName: string;
  era: string;
  curatorNarrative: string;
  archaeologicalFacts: string[];
  folkloreConnection: string;
  stcThesisRole: string;
  suggestedQuestions: string[];
}

/**
 * Kurasi mendalam landmark 3D Diorama Sungai Musi dengan konteks arkeologi dan disertasi STC Dr. Akhmad Khudri via server
 */
export async function getLandmarkCuratorInsight(params: {
  landmarkKey: string;
  landmarkName: string;
  userQuestion?: string;
}): Promise<LandmarkCuratorInsight> {
  try {
    const response = await fetch('/api/curator/insight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      landmarkKey: params.landmarkKey,
      landmarkName: data.landmarkName || params.landmarkName,
      era: data.era || "Lintas Era Palembang",
      curatorNarrative: cleanAsterisks(data.curatorNarrative || ""),
      archaeologicalFacts: Array.isArray(data.archaeologicalFacts) ? data.archaeologicalFacts.map(cleanAsterisks) : [],
      folkloreConnection: cleanAsterisks(data.folkloreConnection || ""),
      stcThesisRole: cleanAsterisks(data.stcThesisRole || ""),
      suggestedQuestions: Array.isArray(data.suggestedQuestions) ? data.suggestedQuestions : []
    };
  } catch (error) {
    console.warn("Curator AI insight fallback invoked:", error);
    return getFallbackCuratorInsight(params.landmarkKey, params.landmarkName, params.userQuestion);
  }
}

function getFallbackCuratorInsight(key: string, name: string, userQuestion?: string): LandmarkCuratorInsight {
  if (key.includes('ampera') || name.toLowerCase().includes('ampera')) {
    return {
      landmarkKey: 'ampera',
      landmarkName: 'Jembatan Ampera (Amanat Penderitaan Rakyat)',
      era: 'Modernisme Pasca-Kemerdekaan (1962 - 1965)',
      curatorNarrative: userQuestion 
        ? `Terkait pertanyaan Anda: Jembatan Ampera bukan sekadar konstruksi baja berbobot 944 ton, melainkan manifesto kedaulatan maritim Indonesia pasca-kolonial yang digagas Presiden Soekarno menggunakan dana pampasan perang Jepang. Jembatan ini menyatukan Seberang Ulu dan Seberang Ilir yang selama berabad-abad dipisahkan oleh arus perkasa Sungai Musi.`
        : `Jembatan Ampera adalah ikon kebanggaan maritim Sumatra Selatan yang dibangun pada April 1962 dan diresmikan pada 1965. Menghubungkan Seberang Ulu dan Seberang Ilir dengan bentang tengah sepanjang 75 meter yang dulunya dapat terangkat vertikal setinggi 10 meter untuk memberikan ruang bagi kapal-kapal samudera bertonase besar melintas menuju pedalaman.\n\nSecara arsitektural dan kosmologis, jembatan ini menjadi titik pusat sumbu perniagaan modern Palembang, mengintegrasikan warisan maritim Sriwijaya abad ke-7 dengan dinamika kota metropolis modern di tepian 750 kilometer Sungai Musi.`,
      archaeologicalFacts: [
        "Mekanisme angkat seberat 500 ton dihentikan permanen sejak 1970 karena waktu pengangkatan 30 menit memicu kemacetan parah lalu lintas darat.",
        "Awalnya diberi nama Jembatan Bung Karno sebagai bentuk penghormatan, sebelum berganti menjadi Jembatan Ampera pada 1966.",
        "Tiang penyangga utama menancap sedalam 30 meter di bawah dasar berlumpur Sungai Musi untuk menahan abrasi arus deras muson."
      ],
      folkloreConnection: "Masyarakat lokal meyakini bahwa pilar dasar Ampera dijaga oleh roh air mistis Antu Banyu dan Buaya Putih penjaga muara Musi yang menuntut rasa hormat bagi siapa pun yang melayari sungainya.",
      stcThesisRole: "Simpul utama monitoring emisi karbon perahu ketek dan audit kepadatan rute pelayaran maritim pada modul STC CarbonPrint & Spatial Ledger.",
      suggestedQuestions: [
        "Mengapa mekanisme jembatan angkat Ampera tidak lagi difungsikan?",
        "Bagaimana legenda Antu Banyu di sekitar tiang Ampera dijelaskan secara hidrologis?",
        "Apa peran strategis Ampera dalam menghubungkan Seberang Ulu dan Ilir?"
      ]
    };
  }

  if (key.includes('kemaro') || name.toLowerCase().includes('kemaro')) {
    return {
      landmarkKey: 'kemaro',
      landmarkName: 'Pulau Kemaro & Pagoda Sembilan Tingkat',
      era: 'Akulturasi Abad 14 - Era Modern',
      curatorNarrative: userQuestion
        ? `Menjawab keingintahuan Anda: Pulau Kemaro adalah delta aluvial unik yang tidak pernah tenggelam meskipun debit Sungai Musi meluap hebat saat musim pasang. Fenomena hidrologis ini berpadu dengan romantisme sejarah cinta abadi Tan Bun An dan Siti Fatimah, menjadikannya monumen hidup toleransi akulturasi Tionghoa-Melayu tertua di Sumatra.`
        : `Pulau Kemaro terletak sekitar 6 km di hilir Jembatan Ampera, tepat di tengah pusaran Sungai Musi. Kata 'Kemaro' berasal dari kata 'Kemarau' karena delta ini selalu kering dan tidak pernah terendam air pasang sungai sedalam apa pun.\n\nDi pulau ini berdiri megah Pagoda 9 Tingkat berarsitektur khas Tiongkok selatan yang dibangun pada tahun 2006, bersanding damai dengan Klenteng Hok Tjing Rio yang berdiri sejak 1962 dan makam keramat Tan Bun An serta Siti Fatimah, menjadi pusat perayaan Cap Go Meh yang dihadiri puluhan ribu peziarah dari seluruh Asia Tenggara.`,
      archaeologicalFacts: [
        "Delta terbentuk dari sedimentasi aluvial berabad-abad di percabangan muara anak sungai Komering dan Musi.",
        "Terdapat pohon cinta legendaris di mana pasangan sering mengukir nama sebagai simbol janji suci abadi.",
        "Menjadi benteng pertahanan maritim alami Kesultanan Palembang saat menghadapi ekspedisi VOC Belanda pada abad ke-17."
      ],
      folkloreConnection: "Kisah pangeran Tiongkok Tan Bun An yang menenggelamkan diri bersama guci berharga karena salah paham menyangka hanya berisi sawi asin, disusul oleh putri Palembang Siti Fatimah yang melompat bersamanya seraya bersumpah melahirkan pulau suci cinta abadi.",
      stcThesisRole: "Simpul validasi Proof-of-Physical-Presence (PoPP) dan penerbitan Soulbound Token ziarah antar-budaya berbasis konsensus EIP-5192.",
      suggestedQuestions: [
        "Mengapa Pulau Kemaro tidak pernah tenggelam saat air pasang besar?",
        "Bagaimana kisah Tan Bun An dan Siti Fatimah melahirkan tradisi Cap Go Meh di sini?",
        "Apa makna arsitektur 9 tingkat pada pagoda Pulau Kemaro?"
      ]
    };
  }

  if (key.includes('siguntang') || name.toLowerCase().includes('siguntang')) {
    return {
      landmarkKey: 'siguntang',
      landmarkName: 'Situs Bukit Siguntang (Genesis Node)',
      era: 'Awal Kemaharajaan Bahari Sriwijaya (Abad 6 - 7 Masehi)',
      curatorNarrative: userQuestion
        ? `Jawaban kuratorial untuk Anda: Bukit Siguntang adalah 'hulu kosmologis' peradaban Sriwijaya. Prasasti Kedukan Bukit (683 M) membuktikan bahwa Dapunta Hyang Sri Jayanasa mengawali ekspedisi suci siddhayatra untuk menegakkan pusat pemerintahan kemakmuran bahari bertolak dari titik kosmologis ini.`
        : `Bukit Siguntang menjulang 27 meter di atas permukaan laut di kawasan barat Palembang. Secara geomorfologis dan spiritual, bukit ini adalah titik tertinggi di dataran aluvial rawa Palembang, menjadikannya pusat kosmologis suci bagi peradaban Kerajaan Maritim Sriwijaya sejak abad ke-7.\n\nDi bukit ini ditemukan arca Buddha bergaya Amarawati setinggi 2,77 meter dari abad ke-6, pecahan keramik Dinasti Tang, serta makam tokoh-tokoh suci seperti Raden Fatah, Panglima Tuan Junjungan, dan Putri Kembang Dadar. Bukit Siguntang adalah akar legitimasi silsilah raja-raja Melayu di Nusantara hingga Semenanjung Malaka.`,
      archaeologicalFacts: [
        "Ditemukan fragmen arca Buddha Mahayana abad ke-6 tanpa kepala pada tahun 1920-an oleh tim arkeologi Hindia Belanda (F.D.K. Bosch).",
        "Disebut dalam kitab Sejarah Melayu (Sulalatus Salatin) sebagai tempat turunnya tiga pangeran keturunan Raja Iskandar Zulkarnain, leluhur raja-raja Melayu.",
        "Merupakan lokasi ritual siddhayatra dan penyimpanan abu leluhur kerajaan bahari Sriwijaya."
      ],
      folkloreConnection: "Mitos Putri Kembang Dadar yang suci dan kebal senjata, simbol kemurnian budi pekerti wanita Melayu yang mengilhami nama tarian Gending Sriwijaya.",
      stcThesisRole: "Genesis Node (Node #0) yang memegang peran root of trust dalam registrasi seluruh simpul budaya dan verifikasi silsilah data pada platform SIGUNTANG.",
      suggestedQuestions: [
        "Apa kaitan Bukit Siguntang dengan Prasasti Kedukan Bukit 683 M?",
        "Mengapa arca Buddha Amarawati di Bukit Siguntang dinilai sangat penting bagi dunia?",
        "Siapakah sebenarnya sosok Putri Kembang Dadar dalam kosmologi Melayu?"
      ]
    };
  }

  // Default: Perahu Ketek Tradisional Musi
  return {
    landmarkKey: 'ketek',
    landmarkName: 'Perahu Ketek Tradisional Sungai Musi',
    era: 'Kearifan Maritim Lokal Abad Pertengahan hingga Kontemporer',
    curatorNarrative: userQuestion
      ? `Jawaban kuratorial Anda: Perahu Ketek adalah pembuluh darah kehidupan masyarakat sungai Palembang. Bunyi ritmis mesin tempelnya 'tek-tek-tek' adalah melodi otentik yang melintasi lorong-lorong anak sungai Musi, menghubungkan kampung terapung dengan pasar 16 Ilir selama lebih dari satu abad.`
      : `Perahu Ketek adalah perahu kayu bermotor khas Palembang yang menjadi urat nadi mobilitas masyarakat tepian Sungai Musi. Namanya diambil dari tiruan bunyi mesin tempel berbahan bakar diesel yang berbunyi teratur 'ketek-ketek-ketek' saat membelah riak arus air cokelat Musi.\n\nDibuat secara turun-temurun oleh pandai kayu kapal menggunakan kayu ulin atau kayu damar laut yang tahan lapuk di air tawar, ketek mampu menembus selokan dan anak sungai sempit yang tidak dapat diakses oleh kapal cepat modern, menjadikannya warisan maritim fungsional yang tak tergantikan.`,
    archaeologicalFacts: [
      "Mengadopsi rancang bangun perahu cadik dan sampan lunas datar kuno yang telah dipahat pada relief Candi Borobudur abad ke-8.",
      "Setiap perahu dikalibrasi secara manual oleh tukang perahu Seberang Ulu tanpa menggunakan cetak biru komputasi.",
      "Menjadi moda utama pengangkutan bahan pangan dari pedalaman hulu Musi (Ogan, Komering, Lematang) menuju bandar Palembang."
    ],
    folkloreConnection: "Para pengemudi ketek memiliki kearifan tradisional membaca tanda air dan arah angin muson untuk menghindari pusaran air maut yang dipercaya dihuni oleh siluman buaya buntung.",
    stcThesisRole: "Unit sensor fisik bergerak yang terhubung melalui IoT Web Serial & BLE Gateway untuk menghitung jejak karbon wisatawan secara real-time.",
    suggestedQuestions: [
      "Bagaimana teknik pembuatan kayu perahu ketek agar kedap air dan tahan belasan tahun?",
      "Berapa rata-rata jejak karbon perahu ketek dibandingkan kapal motor modern?",
      "Bagaimana rute penyeberangan ketek tertua dari 16 Ilir menuju Seberang Ulu?"
    ]
  };
}

/**
 * Membacakan narasi AI Curator dengan sintesis suara Bahasa Indonesia (Web Speech API)
 */
export function speakCuratorNarrative(text: string, onEnd?: () => void): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return () => {};
  }

  window.speechSynthesis.cancel();

  const cleanText = text
    .replace(/[#*_~`]/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .slice(0, 450);

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'id-ID';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
  if (idVoice) {
    utterance.voice = idVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
}
