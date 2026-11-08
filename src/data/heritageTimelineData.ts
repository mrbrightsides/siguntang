/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HeritageTimelineEra {
  id: string;
  period: string;
  title: string;
  subtitle: string;
  rulerOrFigure: string;
  quote: string;
  description: string;
  keyEvents: {
    year: string;
    event: string;
    significance: string;
  }[];
  artifacts: {
    name: string;
    type: string;
    image: string;
    desc: string;
  }[];
  blockchainAnchor: {
    nodeId: string;
    nodeName: string;
    proofConcept: string;
  };
  tags: string[];
}

export const HERITAGE_TIMELINE_DATA: HeritageTimelineEra[] = [
  {
    id: 'era-sriwijaya',
    period: 'Abad VII – XIV M',
    title: 'Kemaharajaan Bahari Sriwijaya',
    subtitle: 'Poros Maritim Nusantara & Pusat Kebijaksanaan Dharmis Dunia',
    rulerOrFigure: 'Dapunta Hyang Sri Jayanasa & Balaputradewa',
    quote: '“Siddhayatra subhiksa—Perjalanan suci demi kemakmuran, kebajikan, dan kesejahteraan sekalian makhluk.” (Inskripsi Kedukan Bukit, 683 M)',
    description: 'Bermula dari perjumpaan Sungai Musi dengan perbukitan sakral Bukit Siguntang, Sriwijaya bangkit sebagai talasokrasi bahari yang menguasai Selat Malaka dan Selat Sunda. Menjadi pusat kajian bahasa Sanskerta dan teologi internasional yang dikunjungi pendeta I-Tsing.',
    keyEvents: [
      {
        year: '683 M (605 Saka)',
        event: 'Ekspedisi Samaryatra Dapunta Hyang',
        significance: 'Dapunta Hyang memimpin 20.000 bala tentara mendirikan wanua (kota peradaban) Sriwijaya di muara Tatang, dipahatkan pada Prasasti Kedukan Bukit.'
      },
      {
        year: '684 M',
        event: 'Peresmian Taman Sriksetra',
        significance: 'Prasasti Talang Tuwo mencatat komitmen ekologis purba: pembangunan taman publik berisi pohon kelapa, pinang, dan telaga untuk kebahagiaan seluruh makhluk hidup.'
      },
      {
        year: 'Abad VIII M',
        event: 'Pahatan Prasasti Telaga Batu',
        significance: 'Kutukan sakral dan sumpah kesetiaan birokrasi kerajaan yang melahirkan konsep tata kelola transparansi dan integritas awal Nusantara.'
      }
    ],
    artifacts: [
      {
        name: 'Prasasti Kedukan Bukit',
        type: 'Inskripsi Batu Pallawa (683 M)',
        image: 'https://asset.kompas.com/crops/LxTb-wNo4Ufo00RJoskQ-Wg0yWo=/0x0:1280x853/1200x1200/data/photo/2021/04/07/606d687bebfdd.jpg',
        desc: 'Sertifikat kelahiran peradaban Sriwijaya bertanggal 16 Juni 683 Masehi yang ditemukan di Palembang.'
      },
      {
        name: 'Arca Buddha Amarawati Siguntang',
        type: 'Arca Granit Abad VI-VIII M',
        image: 'https://jelajah.kompas.id/wp-content/uploads/2020/10/JELAJAH-MUSI-2010-19-11-.jpg',
        desc: 'Karya seni pemahatan granit setinggi 2,77 meter dari puncak bukit sakral Bukit Siguntang Palembang.'
      }
    ],
    blockchainAnchor: {
      nodeId: 'node-0',
      nodeName: 'Bukit Siguntang (Genesis Node)',
      proofConcept: 'Smart Contract Genesis Block: Verifikasi akar peradaban tertulis dengan stempel kriptografis abadi.'
    },
    tags: ['Sriwijaya', 'Prasasti', 'Kedukan Bukit', 'Bukit Siguntang', 'Talasokrasi']
  },
  {
    id: 'era-kesultanan',
    period: '1659 – 1823 M',
    title: 'Kesultanan Palembang Darussalam',
    subtitle: 'Zaman Kedaulatan Islam Bahari, Benteng Kuto Besak & Sastra Melayu',
    rulerOrFigure: 'Sultan Abdurrahman & Sultan Mahmud Badaruddin II',
    quote: '“Biar putih tulang di tanah leluhur, pantang tunduk marwah tanah Palembang di hadapan meriam penjajah.” (Sultan Mahmud Badaruddin II)',
    description: 'Didirikan pasca-runtuhnya Geger Palembang atas Mataram, Kesultanan Palembang Darussalam menjelma menjadi kekuatan niaga timah, lada, dan keraton bahari. Menghasilkan karya sastra agung Syair Perang Palembang serta diplomasi bebas aktif di Selat Bangka.',
    keyEvents: [
      {
        year: '1659 M',
        event: 'Proklamasi Kesultanan Palembang Darussalam',
        significance: 'Sultan Abdurrahman melepaskan diri dari hegemoni Mataram dan menegakkan daulat kesultanan Islam merdeka.'
      },
      {
        year: '1780 – 1797 M',
        event: 'Pembangunan Benteng Kuto Besak',
        significance: 'Sultan Muhammad Bahauddin memprakarsai benteng batu kapur putih megah menghadap Sungai Musi, mandiri tanpa bantuan arsitek Eropa.'
      },
      {
        year: '1819 – 1821 M',
        event: 'Perang Palembang Melawan Armada Kolonial',
        significance: 'Heroisme Sultan Mahmud Badaruddin II mematahkan serangan armada perang Belanda di perairan Sungai Musi sebelum akhirnya diasingkan ke Ternate.'
      }
    ],
    artifacts: [
      {
        name: 'Benteng Kuto Besak (BKB)',
        type: 'Benteng Keraton Maritim',
        image: 'https://i.imgur.com/XgRtFts.jpeg',
        desc: 'Benteng pertahanan batu berperekat putih telur dan kapur dengan ratusan meriam keraton.'
      },
      {
        name: 'Mata Uang Picis Palembang',
        type: 'Numismatika Kesultanan',
        image: 'https://www.indonesia.travel/contentassets/cd46cef5b3464845b0c84dba3e94771c/museum-sultan-mahmud-badaruddin-ii-palembang.jpg',
        desc: 'Mata uang timah resmi Kesultanan beraksara Arab Melayu bertuliskan Al-Sultan fi Balad Palembang.'
      }
    ],
    blockchainAnchor: {
      nodeId: 'node-bkb',
      nodeName: 'Benteng Kuto Besak (Kawasan Bahari SMB)',
      proofConcept: 'Proof-of-Sovereignty Node: Pembuktian kedaulatan hak waris sejarah tak terputus.'
    },
    tags: ['Kesultanan', 'SMB II', 'Benteng Kuto Besak', 'Perang Palembang', 'Masjid Agung']
  },
  {
    id: 'era-ampera',
    period: 'Abad XX M',
    title: 'Era Perjuangan & Ikon Bahari Ampera',
    subtitle: 'Menyatukan Seberang Ulu dan Ilir di Bawah Amanat Penderitaan Rakyat',
    rulerOrFigure: 'Presiden Soekarno & Brigjen Harun Sohar',
    quote: '“Jembatan ini bukan sekadar beton dan baja, melainkan urat nadi penghubung rasa dan keadilan bagi wong kito.”',
    description: 'Sejak berabad-abad, Sungai Musi memisahkan Palembang menjadi dua belahan: Seberang Ulu dan Seberang Ilir. Gagasan menyatukan kedua tepian diwujudkan melalui Jembatan Bung Karno (kemudian menjadi Ampera) yang diresmikan tahun 1965 dengan teknologi jembatan angkat terpanjang Asia Tenggara.',
    keyEvents: [
      {
        year: '1962 M',
        event: 'Peletakan Batu Pertama Jembatan Ampera',
        significance: 'Dimulainya proyek mercusuar pemersatu Ulu dan Ilir menggunakan dana rampasan perang.'
      },
      {
        year: '1965 M',
        event: 'Uji Coba Pengangkatan Bagian Tengah Jembatan',
        significance: 'Bagian tengah jembatan sepanjang 71,9 meter seberat 944 ton dapat terangkat dalam tempo 3 menit agar kapal perang dan niaga samudera leluasa melintas.'
      },
      {
        year: '1966 M',
        event: 'Penggantian Nama Menjadi AMPERA',
        significance: 'Mengukuhkan filosofi Amanat Penderitaan Rakyat sebagai monumen ketangguhan rakyat Sumatera Selatan.'
      }
    ],
    artifacts: [
      {
        name: 'Jembatan Ampera Senja',
        type: 'Monumen Infrastruktur Nasional',
        image: 'https://i.imgur.com/oRfzTOT.jpeg',
        desc: 'Dua menara merah setinggi 63 meter yang menjadi ikon abadi kebanggaan Palembang.'
      },
      {
        name: 'Perahu Ketek Musi',
        type: 'Kearifan Transportasi Bahari',
        image: 'https://i.imgur.com/sKvLHOW.jpeg',
        desc: 'Perahu kayu penyeberang tradisional bertulang ulin yang setia merajut denyut nadi sungai.'
      }
    ],
    blockchainAnchor: {
      nodeId: 'node-ampera',
      nodeName: 'Jembatan Ampera Heritage Node',
      proofConcept: 'Smart Tourism Chain Transit & CarbonPrint Engine: Rekam jejak emisi perahu ketek dan mobilitas bahari.'
    },
    tags: ['Ampera', 'Soekarno', 'Sungai Musi', 'Perahu Ketek', 'Ulu Ilir']
  },
  {
    id: 'era-digital',
    period: 'Abad XXI – 2026 M (Kini)',
    title: 'Kedaulatan Digital & Songket Tenun Chain',
    subtitle: 'Konsorsium Cagar Budaya Terdesentralisasi, AI Vision & FOLU Net Sink 2030',
    rulerOrFigure: 'Komunitas Penenun Tuan Kentang, Riset Disertasi Dr. Firman Khudri & SIGUNTANG Protocol',
    quote: '“Teknologi modern tidak hadir untuk menggusur tradisi, melainkan memahkotainya dengan sertifikasi keaslian abadi yang tak dapat dipalsukan siapapun.”',
    description: 'Kain songket adiluhung Palembang yang terancam tiruan pabrik murah kini dilindungi rantai pasok kriptografi multi-token (ERC-1155/721 hybrid). Setiap helai benang emas jantun, nama maestro penenun, dan koordinat kebun pewarna alami gambir tercatat permanen di jaringan blockchain yang ramah iklim.',
    keyEvents: [
      {
        year: '2024 M',
        event: 'Inisiasi Protokol STC (Smart Tourism Chain)',
        significance: 'Penyusunan 12 modul ekosistem terpadu berbasis disertasi doktoral Universitas Sriwijaya & Bina Darma.'
      },
      {
        year: '2025 M',
        event: 'Integrasi Proof-of-Visit & Soulbound Token (ERC-5192)',
        significance: 'Wisatawan yang menziarahi simpul budaya memperoleh piagam digital yang terikat ke dompet, tidak dapat diperjualbelikan.'
      },
      {
        year: '2026 M',
        event: 'Peluncuran SIGUNTANG Genesis Node & AI Vision 3.8',
        significance: 'Kombinasi computer vision analisis ragam hias motif songket dan sertifikasi fisik terverifikasi QR hash.'
      }
    ],
    artifacts: [
      {
        name: 'Songket Lepus Berekam On-Chain',
        type: 'Phygital Masterpiece',
        image: 'https://sumeks.disway.id/upload/57bddaacfc0b15cdea1a12ff567fbaea.jpg',
        desc: 'Kain tenun emas bersertifikasi hash ganda dengan metadata terenkripsi IPFS.'
      },
      {
        name: 'Prasasti Digital Pallawa Web3',
        type: 'Soulbound Credential',
        image: 'https://i.imgur.com/QvA1JQU.jpeg',
        desc: 'Janji pelestarian budaya yang diminting ke smart contract Polygon/Sepolia.'
      }
    ],
    blockchainAnchor: {
      nodeId: 'node-3',
      nodeName: 'Sentra Tenun Tuan Kentang',
      proofConcept: 'Dual-Registry Proof-of-Authenticity: Perlindungan hak cipta motif adat penenun lokal dari eksploitasi industri cepat saji.'
    },
    tags: ['Web3', 'Songket Tenun Chain', 'AI Vision', 'FOLU Net Sink', 'Soulbound Token']
  }
];
