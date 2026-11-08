/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NodeType, UniversalNode, CulturalRegion } from './types';

// ==========================================
// 1. IBUKOTA PROVINSI: KOTA PALEMBANG
// ==========================================
export const PALEMBANG_CORE_NODES: UniversalNode[] = [
  {
    id: 'node-0',
    name: 'Bukit Siguntang (Genesis Node)',
    type: NodeType.HERITAGE,
    region: 'Palembang',
    description: 'Bukit Siguntang merupakan Genesis Node, titik awal narasi sejarah dan peradaban yang menjadi akar jaringan budaya digital SIGUNTANG.',
    image: 'https://cda.1001malam.com/uploads/tour/onedaycityandmusitourpalembang_bukitsiguntang_5060.JPG',
    location: {
      lat: -2.9972,
      lng: 104.7256,
      address: 'Bukit Lama, Kec. Ilir Barat I, Kota Palembang, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-0', timestamp: '2024-01-01T00:00:00Z', event: 'Genesis Block & Root Node Init', actor: 'SIGUNTANG Protocol', hash: '0x0000...genesis9b' },
      { id: 'tx-siguntang-1', timestamp: '2024-01-05T08:00:00Z', event: 'Verifikasi Kedaulatan Budaya', actor: 'Dinas Pariwisata', hash: '0x7e2b...864c' }
    ],
    tags: ['Genesis', 'Sriwijaya', 'Sejarah', 'Akar Peradaban', 'Simpul Utama']
  },
  {
    id: 'node-1',
    name: 'Museum Sultan Mahmud Badaruddin II',
    type: NodeType.HERITAGE,
    region: 'Palembang',
    description: 'Museum yang menyimpan sejarah Kesultanan Palembang Darussalam dan peninggalan Kerajaan Sriwijaya.',
    image: 'https://www.indonesia.travel/contentassets/cd46cef5b3464845b0c84dba3e94771c/museum-sultan-mahmud-badaruddin-ii-palembang.jpg',
    location: {
      lat: -2.9912,
      lng: 104.7592,
      address: 'Jl. Sultan Mahmud Badaruddin II No.2, 19 Ilir, Bukit Kecil, Palembang'
    },
    traceability: [
      { id: 'tx-1', timestamp: '2024-01-10T09:00:00Z', event: 'Pendataan Aset Digital', actor: 'Dinas Kebudayaan', hash: '0x8f2a...9b3c' },
      { id: 'tx-2', timestamp: '2024-02-15T14:30:00Z', event: 'Verifikasi Autentisitas Blockchain', actor: 'Smart Tourism Chain', hash: '0x4d1e...7f0a' }
    ],
    tags: ['Sejarah', 'Edukasi', 'Sriwijaya', 'Kesultanan']
  },
  {
    id: 'node-2',
    name: 'Masjid Agung Sultan Mahmud Badaruddin I',
    type: NodeType.RELIGION,
    region: 'Palembang',
    description: 'Masjid tertua dan terbesar di Palembang dengan arsitektur perpaduan Tiongkok, Eropa, dan Melayu.',
    image: 'https://indonesiakaya.com/wp-content/uploads/2020/10/Masjid_agung_palembang_1200.jpg',
    location: {
      lat: -2.9889,
      lng: 104.7578,
      address: 'Jl. Jend. Sudirman, 19 Ilir, Bukit Kecil, Palembang'
    },
    traceability: [
      { id: 'tx-3', timestamp: '2024-03-01T10:00:00Z', event: 'Registrasi Node Religi', actor: 'Pengelola Masjid', hash: '0xa3b4...1c2d' }
    ],
    tags: ['Ibadah', 'Arsitektur', 'Legacy', 'Religi']
  },
  {
    id: 'node-3',
    name: 'Pengrajin Songket Tuan Kentang',
    type: NodeType.MSME,
    region: 'Palembang',
    description: 'Pusat kerajinan kain songket khas Palembang dengan motif tradisional yang ditenun secara manual.',
    image: 'https://sumeks.disway.id/upload/57bddaacfc0b15cdea1a12ff567fbaea.jpg',
    location: {
      lat: -3.0012,
      lng: 104.7392,
      address: 'Kampung Tuan Kentang, Seberang Ulu I, Palembang'
    },
    traceability: [
      { id: 'tx-4', timestamp: '2024-04-12T11:00:00Z', event: 'Sertifikasi Keaslian Songket', actor: 'STC Nusantara', hash: '0xcd12...ef34' }
    ],
    tags: ['Craft', 'Fashion', 'Economic', 'Songket']
  },
  {
    id: 'node-ampera',
    name: 'Jembatan Ampera (Amanat Penderitaan Rakyat)',
    type: NodeType.HERITAGE,
    region: 'Palembang',
    description: 'Ikon maritim agung Palembang yang membelah Ulu dan Ilir Sungai Musi. Dibangun pada 1962 dan sempat menjadi jembatan angkat terpanjang di Asia Tenggara, kini berfungsi ganda sebagai simpul transit perahu ketek dan pemantauan gas emisi pelayaran Sungai Musi pada modul STC CarbonPrint.',
    image: 'https://i.imgur.com/QvA1JQU.jpeg',
    location: {
      lat: -2.9918,
      lng: 104.7634,
      address: 'Jembatan Ampera, Seberang Ulu I, Kota Palembang, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-amp-1', timestamp: '2024-05-01T08:00:00Z', event: 'Inisialisasi Sensor Emisi Musi IoT', actor: 'Dinas Perhubungan & STC', hash: '0x3f9a...88b1' },
      { id: 'tx-amp-2', timestamp: '2024-06-10T14:00:00Z', event: 'Penerbitan Proof-of-Visit SBT Ampera', actor: 'SIGUNTANG Protocol', hash: '0x5c2b...e4a7' }
    ],
    tags: ['Ampera', 'Heritage', 'Sungai Musi', 'Ikonik', 'CarbonPrint']
  },
  {
    id: 'node-kemaro',
    name: 'Pulau Kemaro & Pagoda 9 Tingkat',
    type: NodeType.RELIGION,
    region: 'Palembang',
    description: 'Delta suci di tengah Sungai Musi yang tidak pernah tenggelam saat air pasang. Menjadi simbol kerukunan multietnis dan akulturasi Tionghoa-Melayu melalui kisah legendaris Tan Bun An dan Siti Fatimah serta klenteng Hok Tjing Rio.',
    image: 'https://i.imgur.com/XS9TXWS.jpeg',
    location: {
      lat: -2.9814,
      lng: 104.8156,
      address: 'Pulau Kemaro, 1 Ilir, Kec. Ilir Timur II, Kota Palembang, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-kmr-1', timestamp: '2024-05-15T10:30:00Z', event: 'Verifikasi Ziarah Lintas Agama', actor: 'Yayasan Klenteng Pulau Kemaro', hash: '0x991b...773a' },
      { id: 'tx-kmr-2', timestamp: '2024-06-20T16:00:00Z', event: 'Registrasi SBT Cap Go Meh On-Chain', actor: 'STC Trust Engine', hash: '0x12a9...c901' }
    ],
    tags: ['Kemaro', 'Pagoda', 'Akulturasi', 'Religi', 'Ziarah']
  },
  {
    id: 'node-ketek',
    name: 'Perahu Ketek Tradisional Musi (Dermaga Point)',
    type: NodeType.MSME,
    region: 'Palembang',
    description: 'Moda transportasi air tradisional khas Palembang dengan ritme mesin tempel khas "tek-tek-tek". Menjadi tulang punggung konektivitas kampung terapung di sepanjang 750 km Sungai Musi dan terintegrasi pelacak rute geospasial STC.',
    image: 'https://i.imgur.com/sKvLHOW.jpeg',
    location: {
      lat: -2.9905,
      lng: 104.7615,
      address: 'Dermaga Point Benteng Kuto Besak, 19 Ilir, Bukit Kecil, Palembang'
    },
    traceability: [
      { id: 'tx-ktk-1', timestamp: '2024-06-01T07:00:00Z', event: 'Registrasi Paguyuban Pengayuh Ketek', actor: 'Koperasi Transportasi Musi', hash: '0x77bb...33ef' },
      { id: 'tx-ktk-2', timestamp: '2024-06-25T11:45:00Z', event: 'Integrasi Tiket Digital & Eco-Offset', actor: 'SIGUNTANG Protocol', hash: '0x6e31...aa92' }
    ],
    tags: ['Perahu Ketek', 'Transportasi', 'MSME', 'Kearifan Lokal', 'Eco-Cruise']
  },
  {
    id: 'node-bkb',
    name: 'Benteng Kuto Besak (Kawasan Bahari SMB)',
    type: NodeType.HERITAGE,
    region: 'Palembang',
    description: 'Benteng pertahanan batu abad ke-18 era Kesultanan Palembang Darussalam yang menghadap langsung ke Sungai Musi. Saksi bisu heroisme Perang Palembang melawan VOC dan pusat perjumpaan maritim Nusantara.',
    image: 'https://i.imgur.com/XgRtFts.jpeg',
    location: {
      lat: -2.9925,
      lng: 104.7597,
      address: 'Jl. Benteng, 19 Ilir, Bukit Kecil, Kota Palembang, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-bkb-1', timestamp: '2024-05-18T09:00:00Z', event: 'Registrasi Cagar Budaya Benteng Maritim Keraton', actor: 'Balai Pelestarian Kebudayaan V', hash: '0x88ea...91f2' },
      { id: 'tx-bkb-2', timestamp: '2024-06-22T15:30:00Z', event: 'Penerbitan Proof-of-Visit Benteng Bahari SBT', actor: 'SIGUNTANG Protocol', hash: '0x43b1...bc66' }
    ],
    tags: ['Benteng Kuto Besak', 'Kesultanan', 'Cagar Budaya', 'Sungai Musi', 'Benteng Keraton']
  },
  {
    id: 'node-almunawar',
    name: 'Kampung Arab Al-Munawar (Heritage 13 Ulu)',
    type: NodeType.COMMUNITY,
    region: 'Palembang',
    description: 'Kawasan cagar budaya permukiman berusia lebih dari 300 tahun di tepian Sungai Musi Seberang Ulu. Terkenal dengan deretan Rumah Limas kayu ulin, akulturasi Hadramaut-Palembang, seni musik gambus, dan tradisi maritim yang lestari.',
    image: 'https://i.imgur.com/1nO431s.jpeg',
    location: {
      lat: -2.9985,
      lng: 104.7738,
      address: 'Lorong Al-Munawar, 13 Ulu, Kec. Seberang Ulu II, Kota Palembang, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-alm-1', timestamp: '2024-05-20T11:00:00Z', event: 'Dokumentasi Arsitektur Rumah Limas 3 Abad', actor: 'Komunitas Pusaka Palembang', hash: '0x71cd...e519' },
      { id: 'tx-alm-2', timestamp: '2024-06-28T13:15:00Z', event: 'Registrasi SBT Warisan Komunitas Bahari', actor: 'STC Trust Engine', hash: '0x19fa...de88' }
    ],
    tags: ['Kampung Arab', 'Al-Munawar', 'Rumah Limas', 'Akulturasi', 'Komunitas', '13 Ulu']
  }
];

// ==========================================
// 2. 3 KOTA LAINNYA
// ==========================================

// KOTA PAGAR ALAM
export const PAGARALAM_NODES: UniversalNode[] = [
  {
    id: 'node-pagaralam-tegurwangi',
    name: 'Situs Megalitikum Tegur Wangi & Belumai',
    type: NodeType.HERITAGE,
    region: 'Pagaralam',
    description: 'Kompleks situs cagar budaya megalitik purba di kaki Gunung Dempo, pusat peradaban Pasemah (2.500–3.000 SM). Menyimpan menhir, dolmen, kubur batu (stone cist), dan arca batu dinamis manusia menunggang kerbau serta manusia dililit ular.',
    image: 'https://awsimages.detik.net.id/community/media/visual/2024/11/17/batu-beghibu-di-pagar-alam_169.jpeg?w=600&q=90',
    location: {
      lat: -4.0412,
      lng: 103.2425,
      address: 'Kelurahan Tegur Wangi, Kec. Dempo Utara, Kota Pagaralam, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-pgr-1', timestamp: '2024-07-01T08:00:00Z', event: 'Pencatatan Karbon & Registrasi Cagar Budaya Megalitikum', actor: 'Balai Pelestarian Kebudayaan Wilayah V', hash: '0x9d11...f8e2' },
      { id: 'tx-pgr-2', timestamp: '2024-07-15T10:30:00Z', event: 'Penerbitan SBT Megalit Pasemah On-Chain', actor: 'STC Heritage Trust', hash: '0x2a7b...4c90' }
    ],
    tags: ['Pagaralam', 'Megalitikum', 'Pasemah', 'Tegur Wangi', 'Bumi Pasemah', 'Arca Batu']
  },
  {
    id: 'node-pagaralam-ghumahbaghi',
    name: 'Ghumah Baghi (Rumah Adat Pasak Besemah)',
    type: NodeType.CULTURE,
    region: 'Pagaralam',
    description: 'Rumah adat kayu panggung suku Besemah yang dibangun dengan kearifan arsitektur tahan gempa bumi vulkanik tanpa paku besi (interlocking wooden joints). Dindingnya dihiasi tatah ukiran kayu pusaka bermotif bunga melati, pakis perak, dan sulur pilin sakral.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRgR5lz1wdrFLFpk-vbMcR_WET1tLyXAVQvM-smCNXLg&s=10',
    location: {
      lat: -4.0189,
      lng: 103.2684,
      address: 'Dusun Pelang Kenidai, Kec. Dempo Tengah, Kota Pagaralam, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-pgr-3', timestamp: '2024-07-20T14:15:00Z', event: 'Dokumentasi HAKI Arsitektur Kayu Pasak Nir-Paku', actor: 'Lembaga Adat Besemah', hash: '0x33e1...bb44' }
    ],
    tags: ['Pagaralam', 'Ghumah Baghi', 'Arsitektur Kayu', 'Pasak Nir-Paku', 'Besemah', 'Pelang Kenidai']
  },
  {
    id: 'node-pagaralam-dempo',
    name: 'Gunung Dempo & Perkebunan Teh (3.159 mdpl)',
    type: NodeType.TOURISM,
    region: 'Pagaralam',
    description: 'Puncak atap tertinggi Sumatera Selatan setinggi 3.159 mdpl dengan hamparan perkebunan teh warisan tahun 1929 seluas ribuan hektar. Menjadi hulu mata air sakral penopang ekosistem sungai-sungai besar termasuk anak Sungai Musi dan Lematang.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRfh91gyHU2JbJZPUqM8Y4LCmGgUV-6IjpscZCswg-Tw&s=10',
    location: {
      lat: -4.0298,
      lng: 103.1311,
      address: 'Lereng Gunung Dempo, Kec. Pagar Alam Selatan, Kota Pagaralam, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-pgr-4', timestamp: '2024-08-01T09:00:00Z', event: 'Inisialisasi Sensor FOLU 2030 & Hulu Musi', actor: 'STC CarbonPrint Engine', hash: '0x7f4c...aa19' }
    ],
    tags: ['Pagaralam', 'Gunung Dempo', 'Kebun Teh', '3159 mdpl', 'Hulu Musi', 'Ekowisata']
  },
  {
    id: 'node-pagaralam-kopi',
    name: 'Kopi Robusta Petik Merah Basemah (Elevasi 1.400 mdpl)',
    type: NodeType.MSME,
    region: 'Pagaralam',
    description: 'Kopi single-origin unggulan lereng tanah vulkanik Dempo yang dipetik merah matang pohon dan diolah secara natural-anaerob. Mengantongi sertifikasi Indikasi Geografis (IG) dan dicatat dalam registry rantai pasok kopi terpercaya STC.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_rw7h4o4pIfkE1eRa8ZmUUQ9M81fPu4FCg1URiSLwyccaJbh7ViHrPD0&s=10',
    location: {
      lat: -4.0250,
      lng: 103.2550,
      address: 'Sentra Tani Kopi Gunung Dempo, Pagaralam, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-pgr-5', timestamp: '2024-08-10T11:45:00Z', event: 'Sertifikasi Indikasi Geografis Kopi On-Chain', actor: 'Koperasi Kopi Besemah Berdaulat', hash: '0x44aa...dd77' }
    ],
    tags: ['Pagaralam', 'Kopi Robusta', 'Petik Merah', 'UMKM', 'Indikasi Geografis', 'STC Verified']
  }
];

// KOTA PRABUMULIH
export const PRABUMULIH_NODES: UniversalNode[] = [
  {
    id: 'node-pbm-nanas',
    name: 'Sentra Kriya Wastra Serat Nanas Prabumulih',
    type: NodeType.MSME,
    region: 'Prabumulih',
    description: 'Pusat inovasi wastra serat daun nanas ramah lingkungan khas Kota Prabumulih. Mengolah limbah pertanian nanas manis menjadi benang tenun bernilai ekonomi tinggi dengan sertifikasi jejak karbon rendah (eco-friendly textile).',
    image: 'https://paltv.disway.id/upload/a3d78cadb72f7fb382bf4483a4699e7d.jpeg',
    location: {
      lat: -3.4256,
      lng: 104.2389,
      address: 'Kelurahan Karang Jaya, Kec. Prabumulih Timur, Kota Prabumulih, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-pbm-1', timestamp: '2024-09-01T08:00:00Z', event: 'Sertifikasi Eco-Wastra Serat Nanas STC CarbonPrint', actor: 'Koperasi Serat Nanas Prabumulih', hash: '0x77aa...1209' }
    ],
    tags: ['Prabumulih', 'Serat Nanas', 'Eco-Wastra', 'Kota Nanas', 'Inovasi Hijau']
  },
  {
    id: 'node-pbm-tugu',
    name: 'Monumen Tugu Nanas Raksasa & Ruang Publik Kota',
    type: NodeType.TOURISM,
    region: 'Prabumulih',
    description: 'Ikon legendaris Kota Prabumulih yang berdiri megah melambangkan kota penghasil nanas termanis di Indonesia. Menjadi ruang terbuka interaksi warga dan simpul transit strategis lintasan tengah Sumatera Selatan.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQffVc1lSDfCvuqEoQa0hZpvxUecdF70I-cPowDNaKBhxFaAuurAeOkOmky&s=10',
    location: {
      lat: -3.4328,
      lng: 104.2281,
      address: 'Patih Galung, Kec. Prabumulih Barat, Kota Prabumulih, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-pbm-2', timestamp: '2024-09-15T11:30:00Z', event: 'Pencatatan Landmark Spasial Kota Prabumulih', actor: 'Dinas Kebudayaan & Pariwisata PBM', hash: '0x88bb...3321' }
    ],
    tags: ['Prabumulih', 'Tugu Nanas', 'Landmark', 'Ikon Kota', 'Transit Sumsel']
  }
];

// KOTA LUBUKLINGGAU
export const LUBUKLINGGAU_NODES: UniversalNode[] = [
  {
    id: 'node-llg-temam',
    name: 'Air Terjun Temam (Niagara Mini Musi)',
    type: NodeType.TOURISM,
    region: 'Lubuklinggau',
    description: 'Air terjun alami berbentuk tirai melengkung setinggi 12 meter dan bentang lebar 25 meter di aliran Sungai Kelingi. Dikenal sebagai Niagara Mini Sumatera Selatan dengan pencahayaan warna-warni malam hari dan ekowisata lembah.',
    image: 'https://zjglidcehtsqqqhbdxyp.supabase.co/storage/v1/object/public/atourin/images/destination/lubuklinggau/air-terjun-temam-profile1646399491.jpeg?x-image-process=image/resize,p_100,limit_1/imageslim',
    location: {
      lat: -3.3428,
      lng: 102.8592,
      address: 'Kelurahan Rahma, Kec. Lubuklinggau Selatan I, Kota Lubuklinggau, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-llg-1', timestamp: '2024-09-20T10:00:00Z', event: 'Verifikasi Ekowisata Sungai Kelingi Temam', actor: 'Pokdarwis Temam Mandiri', hash: '0x11cc...5544' }
    ],
    tags: ['Lubuklinggau', 'Air Terjun Temam', 'Niagara Mini', 'Sungai Kelingi', 'Ekowisata']
  },
  {
    id: 'node-llg-bukitsulap',
    name: 'Taman Nasional Bukit Sulap (Geopark Sebiduk Semare)',
    type: NodeType.HERITAGE,
    region: 'Lubuklinggau',
    description: 'Bukit monolit hijau ikonik setinggi 262 mdpl yang berada tepat di jantung kota. Memiliki jalur inclinator miring terpanjang di Indonesia, situs konservasi flora endemik bunga Rafflesia arnoldii, dan panorama Bukit Barisan.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5q9jwwGmDSZnyKmfbMb-VyYrmiradvq47aDvwxubRmg&s=10',
    location: {
      lat: -3.2950,
      lng: 102.8450,
      address: 'Jalan Bengkulu, Kec. Lubuklinggau Utara II, Kota Lubuklinggau, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-llg-2', timestamp: '2024-10-01T14:30:00Z', event: 'Registrasi Cagar Alam Biodiversitas Bukit Sulap', actor: 'BKSDA Sumsel & STC ImpactViz', hash: '0x44dd...7766' }
    ],
    tags: ['Lubuklinggau', 'Bukit Sulap', 'Rafflesia', 'Geopark', 'Bukit Barisan']
  }
];

// ==========================================
// 3. 13 KABUPATEN DI SUMATERA SELATAN
// ==========================================

// KABUPATEN LAHAT
export const LAHAT_NODES: UniversalNode[] = [
  {
    id: 'node-lahat-tinggihari',
    name: 'Situs Megalitikum Tinggihari (Rekor MURI Negeri Seribu Megalit)',
    type: NodeType.HERITAGE,
    region: 'Lahat',
    description: 'Kawasan cagar budaya megalitik purba yang membawa Kabupaten Lahat dinobatkan oleh MURI sebagai pemilik peninggalan megalitik terbanyak se-Indonesia. Berisi puluhan arca manusia megalitik, dolmen, tetralit, dan lumpang batu bertatah peninggalan 1.000–500 SM.',
    image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=1200&auto=format&fit=crop',
    location: {
      lat: -3.8642,
      lng: 103.4988,
      address: 'Desa Tinggihari, Kec. Gumay Ulu, Kabupaten Lahat, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-lht-1', timestamp: '2024-08-15T09:00:00Z', event: 'Validasi Rekor MURI & Registrasi Heritage Node', actor: 'Dinas Kebudayaan Lahat & STC', hash: '0x1b44...ee29' },
      { id: 'tx-lht-2', timestamp: '2024-08-25T13:30:00Z', event: 'Penerbitan SBT Megalit Tinggihari', actor: 'SIGUNTANG Protocol', hash: '0x88cc...1122' }
    ],
    tags: ['Lahat', 'Megalit Tinggihari', 'Rekor MURI', 'Negeri Seribu Megalit', 'Lembah Lematang']
  },
  {
    id: 'node-lahat-serelo',
    name: 'Bukit Serelo / Bukit Telunjuk (Ikon Monolit Geologis)',
    type: NodeType.TOURISM,
    region: 'Lahat',
    description: 'Landform alamiah formasi monolit batu kapur purba yang menjulang tajam menyerupai jari telunjuk yang menunjuk lurus ke langit. Dikelilingi hutan lindung Sungai Lematang, menjadi kompas orientasi alamiah kafilah purba dan lambang keteguhan budi pekerti tanah Lahat.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
    location: {
      lat: -3.8214,
      lng: 103.6289,
      address: 'Desa Perangai, Kec. Merapi Selatan, Kabupaten Lahat, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-lht-3', timestamp: '2024-09-01T10:00:00Z', event: 'Pemetaan Spasial 3D Monolit Telunjuk', actor: 'STC GeoGrid Inspector', hash: '0x99dd...fa33' }
    ],
    tags: ['Lahat', 'Bukit Serelo', 'Bukit Telunjuk', 'Sungai Lematang', 'Monolit', 'Geowisata']
  },
  {
    id: 'node-lahat-batugajah',
    name: 'Megalit Batu Gajah & Arca Prajurit Lembah Lematang',
    type: NodeType.HERITAGE,
    region: 'Lahat',
    description: 'Monumen megalitik ekspresif berbentuk sosok prajurit zaman logam purba berhelm perang yang tengah menunggang gajah purba lengkap dengan pedang dan nekara perunggu. Bukti autentik tingginya peradaban seni pahat dan relasi fauna purba di Sumatera Selatan.',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop',
    location: {
      lat: -3.8055,
      lng: 103.5210,
      address: 'Desa Pagarbatu, Kec. Pulau Pinang, Kabupaten Lahat, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-lht-4', timestamp: '2024-09-10T15:20:00Z', event: 'Pencatatan Morfologi Arca Batu Gajah On-Chain', actor: 'Pusat Riset Arkeologi Nasional', hash: '0x55aa...33bb' }
    ],
    tags: ['Lahat', 'Batu Gajah', 'Arca Prajurit', 'Zaman Logam', 'Lembah Lematang', 'Cagar Budaya']
  },
  {
    id: 'node-lahat-cughupmaung',
    name: 'Cughup Maung (Air Terjun Tirai Alami Gumay Sakti)',
    type: NodeType.COMMUNITY,
    region: 'Lahat',
    description: 'Air terjun eksotis megah setinggi 80 meter dengan formasi dinding tebing batu selebar puluhan meter yang diselimuti tirai lumut hijau alami, mengalirkan air pegunungan jernih ke lembah Lematang. Dikelola kelompok sadar wisata (Pokdarwis) desa berbasis eco-tourism.',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=1200&auto=format&fit=crop',
    location: {
      lat: -3.9472,
      lng: 103.4417,
      address: 'Desa Rindu Hati, Kec. Gumay Ulu, Kabupaten Lahat, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-lht-5', timestamp: '2024-09-18T12:00:00Z', event: 'Verifikasi Komunitas Pokdarwis & Eco-Pariwisata', actor: 'Forum Pemuda Gumay Ulu', hash: '0x12ff...7799' }
    ],
    tags: ['Lahat', 'Cughup Maung', 'Air Terjun Tirai', 'Gumay Ulu', 'Pokdarwis', 'Eco-Tourism']
  }
];

// KABUPATEN OGAN ILIR
export const OGAN_ILIR_NODES: UniversalNode[] = [
  {
    id: 'node-oi-burai',
    name: 'Desa Ekowisata Tenun Burai (ADWI)',
    type: NodeType.CULTURE,
    region: 'Ogan Ilir',
    description: 'Desa wisata peraih Anugerah Desa Wisata Indonesia (ADWI) di tepian rawa lebak Sungai Kelekar. Terkenal dengan tradisi kriya tenun songket warna alami, deretan rumah panggung kayu warna-warni terapung, dan jelajah perahu ketek rawa.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
    location: {
      lat: -3.4167,
      lng: 104.6833,
      address: 'Desa Burai, Kec. Tanjung Batu, Kabupaten Ogan Ilir, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-oi-1', timestamp: '2024-09-22T08:30:00Z', event: 'Registrasi Wastra Tenun Warna Alami Burai On-Chain', actor: 'Kelompok Tenun Burai & STC', hash: '0x33aa...9911' },
      { id: 'tx-oi-2', timestamp: '2024-09-28T14:00:00Z', event: 'Penerbitan Proof-of-EcoVisit Desa Burai', actor: 'SIGUNTANG Protocol', hash: '0x88ff...5522' }
    ],
    tags: ['Ogan Ilir', 'Desa Burai', 'Tenun Songket', 'Pewarna Alami', 'ADWI', 'Rawa Lebak', 'Bumi Caram Seguguk']
  },
  {
    id: 'node-oi-tanjungbatu',
    name: 'Sentra Pande Besi Pusaka Tanjung Batu',
    type: NodeType.MSME,
    region: 'Ogan Ilir',
    description: 'Pusat metalurgi dan kriya tempa besi tradisional terbesar di Sumatera Bagian Selatan sejak masa Kesultanan Palembang. Menghasilkan bilah pusaka Melayu, parang, keris, dan kuduk dengan teknik tempa manual turun-temurun.',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=1200&auto=format&fit=crop',
    location: {
      lat: -3.4250,
      lng: 104.6167,
      address: 'Kecamatan Tanjung Batu, Kabupaten Ogan Ilir, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-oi-3', timestamp: '2024-10-02T10:15:00Z', event: 'Sertifikasi HAKI Kriya Pande Besi Tradisional', actor: 'Paguyuban Pande Besi Tanjung Batu', hash: '0x77ee...4433' }
    ],
    tags: ['Ogan Ilir', 'Tanjung Batu', 'Pande Besi', 'Kriya Logam', 'Pusaka Melayu', 'UMKM']
  },
  {
    id: 'node-oi-tanjungsenai',
    name: 'Jembatan Pesona Tanjung Senai & Rawa Lebak',
    type: NodeType.TOURISM,
    region: 'Ogan Ilir',
    description: 'Ikon arsitektur modern Ogan Ilir yang melengkung anggun di atas bentangan ekosistem rawa lebak Sungai Ogan. Menjadi ruang publik favorit masyarakat untuk menikmati matahari terbenam (sunset) dan gerbang menuju Kompleks Perkantoran Terpadu.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    location: {
      lat: -3.2389,
      lng: 104.6472,
      address: 'Kawasan Tanjung Senai, Indralaya, Kabupaten Ogan Ilir, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-oi-4', timestamp: '2024-10-10T16:00:00Z', event: 'Pemantauan Emisi Karbon Rawa Gambut & Lebak', actor: 'STC CarbonPrint Engine', hash: '0x55cc...7788' }
    ],
    tags: ['Ogan Ilir', 'Tanjung Senai', 'Jembatan Pesona', 'Indralaya', 'Rawa Lebak', 'Sunset']
  },
  {
    id: 'node-oi-sakatiga',
    name: 'Situs Sejarah Sakatiga & Makam Pangeran Sido Ing Rejeki',
    type: NodeType.RELIGION,
    region: 'Ogan Ilir',
    description: 'Kompleks cagar budaya bersejarah saksi pertahanan Kesultanan Palembang Darussalam abad ke-17 di tepian percabangan tiga sungai. Dikenal sebagai simpul peradaban dan pendidikan Islam tertua dengan tradisi keilmuan pesantren yang masyhur.',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop',
    location: {
      lat: -3.2500,
      lng: 104.6667,
      address: 'Desa Sakatiga, Kec. Indralaya, Kabupaten Ogan Ilir, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-oi-5', timestamp: '2024-10-18T09:45:00Z', event: 'Dokumentasi Naskah & Situs Religi Sakatiga On-Chain', actor: 'Yayasan Pusaka Sejarah Sakatiga', hash: '0x22bb...1100' }
    ],
    tags: ['Ogan Ilir', 'Sakatiga', 'Pangeran Sido Ing Rejeki', 'Kesultanan', 'Religi', 'Sejarah Islam']
  }
];

// KABUPATEN PENUKAL ABAB LEMATANG ILIR (PALI)
export const PALI_NODES: UniversalNode[] = [
  {
    id: 'node-pali-candi',
    name: 'Kompleks Percandian Candi Bumi Ayu (Abad ke-9 M)',
    type: NodeType.HERITAGE,
    region: 'PALI',
    description: 'Satu-satunya kompleks candi Hindu bercorak Siwa terbesar di Sumatera Selatan peninggalan abad ke-9 hingga ke-13 Masehi di pesisir Sungai Lematang. Memiliki belasan struktur candi bata merah bertatah arca Siwa Mahaguru dan relief terakota sakral.',
    image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=1200&auto=format&fit=crop',
    location: {
      lat: -3.3361,
      lng: 104.0917,
      address: 'Desa Bumi Ayu, Kec. Tanah Abang, Kabupaten PALI, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-pali-1', timestamp: '2024-10-20T08:00:00Z', event: 'Registrasi Cagar Budaya Candi Bumi Ayu On-Chain', actor: 'Balai Pelestarian Kebudayaan V & STC', hash: '0x55ee...9900' }
    ],
    tags: ['PALI', 'Candi Bumi Ayu', 'Percandian Hindu', 'Abad ke-9', 'Sungai Lematang', 'Bumi Serepat Serasan']
  }
];

// KABUPATEN MUARA ENIM
export const MUARA_ENIM_NODES: UniversalNode[] = [
  {
    id: 'node-me-bedegung',
    name: 'Air Terjun Bedegung / Cughup Tenang (Tinggi 99 Meter)',
    type: NodeType.TOURISM,
    region: 'Muara Enim',
    description: 'Salah satu air terjun tertinggi di Indonesia dengan ketinggian luncur 99 meter yang bersumber dari mata air Pegunungan Bukit Barisan yang tidak pernah surut. Dikelilingi hutan tropis lembah Lematang Enim yang sejuk.',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=1200&auto=format&fit=crop',
    location: {
      lat: -3.9889,
      lng: 103.7917,
      address: 'Desa Bedegung, Kec. Panang Enim, Kabupaten Muara Enim, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-me-1', timestamp: '2024-10-22T11:00:00Z', event: 'Pencatatan Ekosistem Hidrologi Air Terjun Bedegung', actor: 'Dinas Lingkungan Hidup Muara Enim', hash: '0x66ff...1122' }
    ],
    tags: ['Muara Enim', 'Air Terjun Bedegung', 'Cughup Tenang', '99 Meter', 'Bukit Barisan']
  }
];

// KABUPATEN OGAN KOMERING ULU (OKU - BATURAJA)
export const OKU_NODES: UniversalNode[] = [
  {
    id: 'node-oku-guaharimau',
    name: 'Situs Prasejarah & Rock Art Gua Harimau (14.000 SM)',
    type: NodeType.HERITAGE,
    region: 'OKU',
    description: 'Situs hunian gua prasejarah paling signifikan di Sumatera dengan lukisan cadas (rock art) tertua, kubur manusia purba ras Mongoloid dan Australomelanesid, serta artefak zaman batu paleolitik hingga neolitik.',
    image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=1200&auto=format&fit=crop',
    location: {
      lat: -4.0833,
      lng: 103.9333,
      address: 'Desa Padang Bindu, Kec. Semidang Aji, Kabupaten OKU, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-oku-1', timestamp: '2024-10-25T09:30:00Z', event: 'Pencatatan Karbon & Arkeogenetika Gua Harimau', actor: 'Pusat Riset Arkeologi Nasional & STC', hash: '0x77aa...3344' }
    ],
    tags: ['OKU', 'Baturaja', 'Gua Harimau', 'Rock Art', 'Prasejarah', 'Fosil Purba']
  },
  {
    id: 'node-oku-guaputri',
    name: 'Gua Putri & Legenda Si Pahit Lidah (Serunting Sakti)',
    type: NodeType.CULTURE,
    region: 'OKU',
    description: 'Gua karst legendaris dengan ornamen stalaktit dan stalagmit yang dikaitkan dengan legenda Putri Dayang Merindu dan kutukan Si Pahit Lidah (Serunting Sakti). Memiliki sungai bawah tanah dan akustik gua alami.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    location: {
      lat: -4.0750,
      lng: 103.9250,
      address: 'Desa Padang Bindu, Kec. Semidang Aji, Kabupaten OKU, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-oku-2', timestamp: '2024-10-27T14:15:00Z', event: 'Dokumentasi Folklor Si Pahit Lidah On-Chain', actor: 'Lembaga Adat Semidang Aji', hash: '0x88bb...5566' }
    ],
    tags: ['OKU', 'Gua Putri', 'Si Pahit Lidah', 'Folklor', 'Karst Baturaja']
  }
];

// KABUPATEN OKU SELATAN
export const OKU_SELATAN_NODES: UniversalNode[] = [
  {
    id: 'node-okus-danauranau',
    name: 'Danau Ranau & Gunung Seminung (Lanskap Vulkanik)',
    type: NodeType.TOURISM,
    region: 'OKU Selatan',
    description: 'Danau vulkanik tektonik terbesar kedua di Pulau Sumatera seluas 125,9 km² dengan latar belakang kerucut Gunung Seminung (1.888 mdpl) dan pemandian air panas alami belerang di kaki gunung.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    location: {
      lat: -4.8667,
      lng: 103.9167,
      address: 'Banding Agung, Kabupaten OKU Selatan, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-okus-1', timestamp: '2024-10-29T10:00:00Z', event: 'Pemantauan Indeks Ekologi Perairan Danau Ranau', actor: 'STC WaterGuard & DLH OKUS', hash: '0x99cc...7788' }
    ],
    tags: ['OKU Selatan', 'Danau Ranau', 'Gunung Seminung', 'Danau Vulkanik', 'Bumi Serasan Seandanan']
  }
];

// KABUPATEN OKU TIMUR
export const OKU_TIMUR_NODES: UniversalNode[] = [
  {
    id: 'node-okut-bendungan',
    name: 'Bendungan Komering Perjaya & Lumbung Pangan Sriwijaya',
    type: NodeType.TOURISM,
    region: 'OKU Timur',
    description: 'Bendungan irigasi megah di Sungai Komering yang mengairi ratusan ribu hektar sawah dataran rendah Sumatera Selatan, menjadikan OKU Timur sebagai salah satu lumbung beras utama nasional penopang ketahanan pangan.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    location: {
      lat: -4.2667,
      lng: 104.5833,
      address: 'Desa Perjaya, Kec. Martapura, Kabupaten OKU Timur, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-okut-1', timestamp: '2024-11-01T08:00:00Z', event: 'Pencatatan Rantai Pasok Pangan Berkelanjutan', actor: 'Dinas Pertanian OKU Timur', hash: '0x11ee...3344' }
    ],
    tags: ['OKU Timur', 'Bendungan Perjaya', 'Sungai Komering', 'Lumbung Pangan', 'Martapura']
  }
];

// KABUPATEN OGAN KOMERING ILIR (OKI)
export const OKI_NODES: UniversalNode[] = [
  {
    id: 'node-oki-100tiang',
    name: 'Rumah Adat Limas 100 Tiang Kayu Onglen (Abad ke-19)',
    type: NodeType.HERITAGE,
    region: 'OKI',
    description: 'Mahakarya arsitektur vernakular kayu didirikan tahun 1811 Masehi yang ditopang persis oleh 100 tiang kayu ulin/onglen kokoh tanpa paku di tepian Sungai Komering. Dihiasi ukiran tatah emas khas bangsawan Melayu Komering.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
    location: {
      lat: -3.5333,
      lng: 104.9167,
      address: 'Desa Sugih Waras, Kec. Teluk Gelam, Kabupaten OKI, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-oki-1', timestamp: '2024-11-02T13:00:00Z', event: 'Registrasi Cagar Budaya Rumah 100 Tiang', actor: 'Dinas Kebudayaan OKI', hash: '0x22ff...4455' }
    ],
    tags: ['OKI', 'Rumah 100 Tiang', 'Kayu Onglen', 'Kayu Ulin', 'Arsitektur Vernakular', 'Sugih Waras']
  },
  {
    id: 'node-oki-pedamaran',
    name: 'Sentra Anyaman Tikar Purun Pedamaran (Gambut Lestari)',
    type: NodeType.MSME,
    region: 'OKI',
    description: 'Tradisi anyaman purun turun-temurun masyarakat pesisir gambut Pedamaran. Mengolah tumbuhan purun rawa gambut menjadi produk kriya bernilai estetika dan ramah lingkungan pencegah kebakaran lahan gambut.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
    location: {
      lat: -3.4500,
      lng: 104.8833,
      address: 'Kecamatan Pedamaran, Kabupaten OKI, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-oki-2', timestamp: '2024-11-03T15:30:00Z', event: 'Sertifikasi Kriya Rawa Gambut Ramah Lingkungan', actor: 'Komunitas Pengrajin Purun Pedamaran', hash: '0x33aa...5566' }
    ],
    tags: ['OKI', 'Pedamaran', 'Purun', 'Anyaman Tradisional', 'Rawa Gambut', 'Kriya Ramah Lingkungan']
  }
];

// KABUPATEN BANYUASIN
export const BANYUASIN_NODES: UniversalNode[] = [
  {
    id: 'node-ba-sembilang',
    name: 'Taman Nasional Sembilang (Situs Ramsar Pesisir Dunia)',
    type: NodeType.TOURISM,
    region: 'Banyuasin',
    description: 'Cagar biosfer pesisir mangrove terbesar di Indonesia bagian barat yang diakui sebagai Situs Ramsar dunia. Menjadi tempat persinggahan jutaan burung migran dari Siberia menuju Australia di muara Sungai Musi dan Banyuasin.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    location: {
      lat: -2.0833,
      lng: 104.7500,
      address: 'Sungsang, Kec. Banyuasin II, Kabupaten Banyuasin, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-ba-1', timestamp: '2024-11-04T09:00:00Z', event: 'Pemantauan Koridor Karbon Mangrove FOLU 2030', actor: 'Balai TN Sembilang & STC CarbonPrint', hash: '0x44bb...6677' }
    ],
    tags: ['Banyuasin', 'TN Sembilang', 'Situs Ramsar', 'Mangrove Pesisir', 'Burung Migran', 'Muara Musi']
  }
];

// KABUPATEN MUSI BANYUASIN (MUBA)
export const MUSI_BANYUASIN_NODES: UniversalNode[] = [
  {
    id: 'node-muba-gambo',
    name: 'Sentra Eko-Wastra Gambo Muba (Pewarna Getah Gambir)',
    type: NodeType.MSME,
    region: 'Musi Banyuasin',
    description: 'Inovasi wastra tenun jumputan khas Musi Banyuasin yang memanfaatkan limbah getah tanaman gambir (Uncaria gambir) sebagai pewarna alami ramah lingkungan 100%, menghasilkan warna tanah eksotis yang mendunia.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1200&auto=format&fit=crop',
    location: {
      lat: -2.8833,
      lng: 103.8167,
      address: 'Kecamatan Sekayu, Kabupaten Musi Banyuasin, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-muba-1', timestamp: '2024-11-05T10:00:00Z', event: 'Sertifikasi Orisinalitas Eko-Wastra Gambo On-Chain', actor: 'Dekranasda Muba & STC', hash: '0x55cc...7788' }
    ],
    tags: ['Musi Banyuasin', 'Gambo Muba', 'Getah Gambir', 'Pewarna Alami', 'Eko-Wastra', 'Sekayu']
  }
];

// KABUPATEN MUSI RAWAS
export const MUSI_RAWAS_NODES: UniversalNode[] = [
  {
    id: 'node-mura-danauaur',
    name: 'Danau Aur & Lanskap Wisata Air Musi Rawas',
    type: NodeType.TOURISM,
    region: 'Musi Rawas',
    description: 'Danau alami asri dengan pulau kecil di tengahnya yang dikelilingi perkebunan karet rakyat. Menyediakan perahu terapung kuliner dan menjadi ruang rekreasi keluarga berbasis air unggulan Kabupaten Musi Rawas.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    location: {
      lat: -3.2000,
      lng: 103.0500,
      address: 'Kecamatan Sumber Harta, Kabupaten Musi Rawas, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-mura-1', timestamp: '2024-11-05T14:00:00Z', event: 'Pencatatan Node Pariwisata Danau Aur', actor: 'Dinas Kebudayaan & Pariwisata Mura', hash: '0x66dd...8899' }
    ],
    tags: ['Musi Rawas', 'Danau Aur', 'Wisata Air', 'Sumber Harta', 'Bumi Lan Serasan Sekentenan']
  }
];

// KABUPATEN MUSI RAWAS UTARA (MURATARA)
export const MURATARA_NODES: UniversalNode[] = [
  {
    id: 'node-muratara-danaurayo',
    name: 'Danau Rayo & Suaka Alam Karang Jaya',
    type: NodeType.TOURISM,
    region: 'Muratara',
    description: 'Danau alami seluas 100 hektar dengan kedalaman 15 meter yang dikelilingi hutan lindung pohon cemara air langka dan teratai merah. Tempat bertualang dan konservasi ekosistem air tawar pedalaman Sumatera.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    location: {
      lat: -2.7167,
      lng: 102.8833,
      address: 'Desa Sungai Jernih, Kec. Rupit, Kabupaten Muratara, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-mrt-1', timestamp: '2024-11-05T16:00:00Z', event: 'Konservasi Ekosistem Danau Rayo Muratara', actor: 'Dinas Lingkungan Hidup Muratara', hash: '0x77ee...9900' }
    ],
    tags: ['Muratara', 'Danau Rayo', 'Karang Jaya', 'Suaka Alam', 'Teratai Merah', 'Rupit']
  }
];

// KABUPATEN EMPAT LAWANG
export const EMPAT_LAWANG_NODES: UniversalNode[] = [
  {
    id: 'node-el-airterjun',
    name: 'Air Terjun Bayau & Lembah Sungai Lintang',
    type: NodeType.TOURISM,
    region: 'Empat Lawang',
    description: 'Air terjun eksotis bertingkat di kaki Bukit Barisan yang mengalir deras ke Sungai Lintang. Menjadi saksi sejarah peradaban klan Empat Pendekar (Empat Lawang) dengan panorama perkebunan kopi dan hutan lindung alami.',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=1200&auto=format&fit=crop',
    location: {
      lat: -3.7333,
      lng: 103.0167,
      address: 'Kecamatan Muara Pinang, Kabupaten Empat Lawang, Sumatera Selatan'
    },
    traceability: [
      { id: 'tx-el-1', timestamp: '2024-11-05T17:00:00Z', event: 'Registrasi Cagar Budaya Alam Empat Lawang', actor: 'Dinas Pariwisata Empat Lawang', hash: '0x88ff...0011' }
    ],
    tags: ['Empat Lawang', 'Air Terjun Bayau', 'Sungai Lintang', 'Empat Pendekar', 'Bukit Barisan', 'Tebing Tinggi']
  }
];

// ==========================================
// GABUNGAN SELURUH NODE SE-SUMATERA SELATAN (17 DAERAH OTONOM)
// ==========================================
export const ALL_CULTURAL_NODES: UniversalNode[] = [
  ...PALEMBANG_CORE_NODES,
  ...PAGARALAM_NODES,
  ...PRABUMULIH_NODES,
  ...LUBUKLINGGAU_NODES,
  ...LAHAT_NODES,
  ...OGAN_ILIR_NODES,
  ...PALI_NODES,
  ...MUARA_ENIM_NODES,
  ...OKU_NODES,
  ...OKU_SELATAN_NODES,
  ...OKU_TIMUR_NODES,
  ...OKI_NODES,
  ...BANYUASIN_NODES,
  ...MUSI_BANYUASIN_NODES,
  ...MUSI_RAWAS_NODES,
  ...MURATARA_NODES,
  ...EMPAT_LAWANG_NODES,
];

// Alias backwards-compatible
export const PALEMBANG_NODES: UniversalNode[] = ALL_CULTURAL_NODES;

// ==========================================
// METADATA 17 DAERAH OTONOM PROVINSI SUMATERA SELATAN
// (1 Ibukota, 3 Kota, 13 Kabupaten)
// ==========================================
export interface RegionInfo {
  id: CulturalRegion;
  category: 'Ibukota' | 'Kota' | 'Kabupaten';
  name: string;
  shortName: string;
  motto: string;
  relationship: string;
  description: string;
  center: [number, number];
  zoom: number;
  highlightColor: string;
  badgeBg: string;
  icon: string;
  stats: {
    nodesCount: number;
    heritageEra: string;
    signatureLandmark: string;
  };
}

export const REGIONAL_INFO: Record<CulturalRegion, RegionInfo> = {
  // 1. IBUKOTA PROVINSI
  Palembang: {
    id: 'Palembang',
    category: 'Ibukota',
    name: 'Kota Palembang',
    shortName: 'Palembang',
    motto: 'Bumi Sriwijaya',
    relationship: 'Ibukota Provinsi • Simpul Utama',
    description: 'Ibukota Provinsi Sumatera Selatan, pusat kemaharajaan maritim Sriwijaya abad ke-7 dan Kesultanan Palembang Darussalam di sepanjang Sungai Musi.',
    center: [-2.9909, 104.7567],
    zoom: 13,
    highlightColor: '#8b0000',
    badgeBg: 'bg-[#8b0000]/10 text-[#8b0000] border-[#8b0000]/20',
    icon: '🏛️',
    stats: {
      nodesCount: PALEMBANG_CORE_NODES.length,
      heritageEra: 'Abad ke-7 – Abad ke-18',
      signatureLandmark: 'Jembatan Ampera & Bukit Siguntang',
    },
  },

  // 2. 3 KOTA LAINNYA
  Pagaralam: {
    id: 'Pagaralam',
    category: 'Kota',
    name: 'Kota Pagar Alam',
    shortName: 'Pagar Alam',
    motto: 'Bumi Pasemah',
    relationship: 'Bumi Pasemah Megalitikum',
    description: 'Dataran tinggi vulkanik Gunung Dempo dengan peradaban megalitikum Pasemah 3.000 SM, rumah adat ukir Ghumah Baghi, dan hamparan perkebunan teh.',
    center: [-4.0300, 103.2400],
    zoom: 12,
    highlightColor: '#d97706',
    badgeBg: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    icon: '⛰️',
    stats: {
      nodesCount: PAGARALAM_NODES.length,
      heritageEra: '3.000 SM – Zaman Besi Purba',
      signatureLandmark: 'Situs Tegur Wangi & Gunung Dempo (3.159 mdpl)',
    },
  },
  Prabumulih: {
    id: 'Prabumulih',
    category: 'Kota',
    name: 'Kota Prabumulih',
    shortName: 'Prabumulih',
    motto: 'Kota Nanas Seinggok Sepemunyian',
    relationship: 'Kota Nanas • Sentra Serat Wastra',
    description: 'Sentra penghasil nanas termanis dan inovasi wastra serat nanas ramah lingkungan, serta simpul transit strategis lintasan tengah Sumatera.',
    center: [-3.4300, 104.2300],
    zoom: 12,
    highlightColor: '#eab308',
    badgeBg: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    icon: '🍍',
    stats: {
      nodesCount: PRABUMULIH_NODES.length,
      heritageEra: 'Abad ke-19 – Era Modern',
      signatureLandmark: 'Kriya Serat Nanas & Tugu Nanas',
    },
  },
  Lubuklinggau: {
    id: 'Lubuklinggau',
    category: 'Kota',
    name: 'Kota Lubuklinggau',
    shortName: 'Lubuklinggau',
    motto: 'Kota Sebiduk Semare',
    relationship: 'Gerbang Geopark Bukit Barisan',
    description: 'Pusat pertumbuhan ekonomi barat Sumsel yang dikaruniai panorama Bukit Sulap dan eksotisme tirai air terjun Temam di aliran Sungai Kelingi.',
    center: [-3.3000, 102.8600],
    zoom: 12,
    highlightColor: '#0ea5e9',
    badgeBg: 'bg-sky-500/10 text-sky-700 border-sky-500/20',
    icon: '🏙️',
    stats: {
      nodesCount: LUBUKLINGGAU_NODES.length,
      heritageEra: 'Kolonial 1920 – Era Geopark',
      signatureLandmark: 'Air Terjun Temam & Bukit Sulap',
    },
  },

  // 3. 13 KABUPATEN
  Lahat: {
    id: 'Lahat',
    category: 'Kabupaten',
    name: 'Kabupaten Lahat',
    shortName: 'Lahat',
    motto: 'Seganti Setungguan',
    relationship: 'Negeri Seribu Megalit (Rekor MURI)',
    description: 'Pemegang rekor MURI situs megalitik terbanyak se-Indonesia, ikon geologis monolit Bukit Serelo (Bukit Telunjuk), dan lembah Sungai Lematang.',
    center: [-3.8300, 103.5400],
    zoom: 11,
    highlightColor: '#059669',
    badgeBg: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    icon: '🗿',
    stats: {
      nodesCount: LAHAT_NODES.length,
      heritageEra: '1.000 SM – Formasi Geologis Purba',
      signatureLandmark: 'Megalit Tinggihari & Bukit Serelo',
    },
  },
  'Ogan Ilir': {
    id: 'Ogan Ilir',
    category: 'Kabupaten',
    name: 'Kabupaten Ogan Ilir',
    shortName: 'Ogan Ilir',
    motto: 'Caram Seguguk',
    relationship: 'Bumi Caram Seguguk',
    description: 'Wilayah rawa lebak dan aliran Sungai Ogan-Kelekar yang kaya tradisi kerajinan pande besi Tanjung Batu, desa ekowisata tenun warna alami Burai (ADWI), dan cagar budaya Sakatiga.',
    center: [-3.3500, 104.6500],
    zoom: 12,
    highlightColor: '#2563eb',
    badgeBg: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    icon: '🌾',
    stats: {
      nodesCount: OGAN_ILIR_NODES.length,
      heritageEra: 'Abad ke-17 – Era Modern',
      signatureLandmark: 'Desa Tenun Burai & Pande Besi Tanjung Batu',
    },
  },
  PALI: {
    id: 'PALI',
    category: 'Kabupaten',
    name: 'Kabupaten Penukal Abab Lematang Ilir (PALI)',
    shortName: 'PALI',
    motto: 'Serepat Serasan',
    relationship: 'Bumi Percandian Candi Bumi Ayu',
    description: 'Lembah sungai Lematang Ilir yang menyimpan mahakarya arsitektur percandian bata merah Candi Bumi Ayu peninggalan Hindu abad ke-9 hingga ke-13 Masehi.',
    center: [-3.3361, 104.0917],
    zoom: 12,
    highlightColor: '#b45309',
    badgeBg: 'bg-amber-700/10 text-amber-800 border-amber-700/20',
    icon: '🛕',
    stats: {
      nodesCount: PALI_NODES.length,
      heritageEra: 'Abad ke-9 – Abad ke-13 M',
      signatureLandmark: 'Kompleks Candi Bumi Ayu',
    },
  },
  'Muara Enim': {
    id: 'Muara Enim',
    category: 'Kabupaten',
    name: 'Kabupaten Muara Enim',
    shortName: 'Muara Enim',
    motto: 'Serasan Sekundang',
    relationship: 'Bumi Serasan Sekundang',
    description: 'Kawasan subur lembah Sungai Enim dan perbukitan Bukit Barisan dengan air terjun megah Bedegung setinggi 99 meter serta keanekaragaman hayati tropis.',
    center: [-3.6500, 103.7800],
    zoom: 11,
    highlightColor: '#16a34a',
    badgeBg: 'bg-green-600/10 text-green-700 border-green-600/20',
    icon: '🌊',
    stats: {
      nodesCount: MUARA_ENIM_NODES.length,
      heritageEra: 'Ekosistem Bukit Barisan',
      signatureLandmark: 'Air Terjun Bedegung (99m)',
    },
  },
  OKU: {
    id: 'OKU',
    category: 'Kabupaten',
    name: 'Kabupaten Ogan Komering Ulu (OKU)',
    shortName: 'OKU Baturaja',
    motto: 'Sebimbing Sekundang',
    relationship: 'Bumi Sebimbing Sekundang • Rock Art Purba',
    description: 'Pusat riset arkeologi prasejarah Sumatera Selatan dengan lukisan cadas tertua Gua Harimau (14.000 SM) dan legenda Si Pahit Lidah di Gua Putri.',
    center: [-4.1300, 104.1700],
    zoom: 11,
    highlightColor: '#c026d3',
    badgeBg: 'bg-fuchsia-500/10 text-fuchsia-700 border-fuchsia-500/20',
    icon: '🦇',
    stats: {
      nodesCount: OKU_NODES.length,
      heritageEra: '14.000 SM – Zaman Prasejarah',
      signatureLandmark: 'Gua Harimau & Gua Putri',
    },
  },
  'OKU Selatan': {
    id: 'OKU Selatan',
    category: 'Kabupaten',
    name: 'Kabupaten OKU Selatan',
    shortName: 'OKU Selatan',
    motto: 'Serasan Seandanan',
    relationship: 'Bumi Danau Ranau & Gunung Seminung',
    description: 'Puncak pesona geowisata Sumatera Selatan dengan Danau Ranau seluas 125,9 km², Gunung Seminung, dan tradisi kopi dataran tinggi Ranau.',
    center: [-4.6500, 104.0000],
    zoom: 11,
    highlightColor: '#0284c7',
    badgeBg: 'bg-sky-600/10 text-sky-800 border-sky-600/20',
    icon: '⛵',
    stats: {
      nodesCount: OKU_SELATAN_NODES.length,
      heritageEra: 'Formasi Kaldera Vulkanik Purba',
      signatureLandmark: 'Danau Ranau & Gn. Seminung',
    },
  },
  'OKU Timur': {
    id: 'OKU Timur',
    category: 'Kabupaten',
    name: 'Kabupaten OKU Timur',
    shortName: 'OKU Timur',
    motto: 'Sebiduk Sehaluan',
    relationship: 'Lumbung Pangan & Wastra Bidak',
    description: 'Dataran subur lembah Sungai Komering penopang pangan nasional dengan Bendungan Perjaya dan kelestarian tenun bidak adat Komering.',
    center: [-4.0500, 104.5500],
    zoom: 11,
    highlightColor: '#65a30d',
    badgeBg: 'bg-lime-600/10 text-lime-800 border-lime-600/20',
    icon: '🌾',
    stats: {
      nodesCount: OKU_TIMUR_NODES.length,
      heritageEra: 'Tradisi Komering & Irigasi Modern',
      signatureLandmark: 'Bendungan Perjaya Komering',
    },
  },
  OKI: {
    id: 'OKI',
    category: 'Kabupaten',
    name: 'Kabupaten Ogan Komering Ilir (OKI)',
    shortName: 'OKI Kayuagung',
    motto: 'Bende Seguguk',
    relationship: 'Bumi Rumah Limas 100 Tiang & Purun Gambut',
    description: 'Kabupaten terluas di Sumsel dengan bentang rawa gambut purun Pedamaran dan mahakarya arsitektur Rumah Limas 100 Tiang kayu onglen.',
    center: [-3.4000, 105.0000],
    zoom: 10,
    highlightColor: '#ea580c',
    badgeBg: 'bg-orange-600/10 text-orange-800 border-orange-600/20',
    icon: '🛖',
    stats: {
      nodesCount: OKI_NODES.length,
      heritageEra: 'Tahun 1811 M – Ekologi Gambut',
      signatureLandmark: 'Rumah 100 Tiang & Tikar Purun',
    },
  },
  Banyuasin: {
    id: 'Banyuasin',
    category: 'Kabupaten',
    name: 'Kabupaten Banyuasin',
    shortName: 'Banyuasin',
    motto: 'Sedulang Setudung',
    relationship: 'Pesisir Ramsar Dunia TN Sembilang',
    description: 'Kawasan pesisir mangrove dan delta muara Musi-Banyuasin yang menjadi situs perlindungan keanekaragaman hayati pesisir internasional.',
    center: [-2.4000, 104.6000],
    zoom: 10,
    highlightColor: '#0d9488',
    badgeBg: 'bg-teal-600/10 text-teal-800 border-teal-600/20',
    icon: '🦅',
    stats: {
      nodesCount: BANYUASIN_NODES.length,
      heritageEra: 'Situs Ramsar Pesisir Internasional',
      signatureLandmark: 'Taman Nasional Sembilang',
    },
  },
  'Musi Banyuasin': {
    id: 'Musi Banyuasin',
    category: 'Kabupaten',
    name: 'Kabupaten Musi Banyuasin',
    shortName: 'Musi Banyuasin',
    motto: 'Serasan Sekate',
    relationship: 'Pusat Eko-Wastra Gambo Muba',
    description: 'Kabupaten kaya sumber daya alam di sepanjang aliran Sungai Musi dengan terobosan eko-wastra Gambo Muba pewarna getah gambir alami.',
    center: [-2.6000, 103.8000],
    zoom: 10,
    highlightColor: '#78716c',
    badgeBg: 'bg-stone-600/10 text-stone-800 border-stone-600/20',
    icon: '🧣',
    stats: {
      nodesCount: MUSI_BANYUASIN_NODES.length,
      heritageEra: 'Kearifan Tradisi Gambir',
      signatureLandmark: 'Eko-Wastra Gambo Muba',
    },
  },
  'Musi Rawas': {
    id: 'Musi Rawas',
    category: 'Kabupaten',
    name: 'Kabupaten Musi Rawas',
    shortName: 'Musi Rawas',
    motto: 'Lan Serasan Sekentenan',
    relationship: 'Bumi Danau Aur & Sungai Rawas',
    description: 'Lembah agraris asri di hulu barat Sumsel dengan Danau Aur dan peninggalan peradaban masyarakat tepian Sungai Rawas.',
    center: [-3.1500, 103.1500],
    zoom: 10,
    highlightColor: '#4f46e5',
    badgeBg: 'bg-indigo-600/10 text-indigo-800 border-indigo-600/20',
    icon: '🏞️',
    stats: {
      nodesCount: MUSI_RAWAS_NODES.length,
      heritageEra: 'Peradaban Hulu Sungai Rawas',
      signatureLandmark: 'Danau Aur Sumber Harta',
    },
  },
  Muratara: {
    id: 'Muratara',
    category: 'Kabupaten',
    name: 'Kabupaten Musi Rawas Utara (Muratara)',
    shortName: 'Muratara',
    motto: 'Beselang Serundingan',
    relationship: 'Bumi Danau Rayo & Karst Purba',
    description: 'Kabupaten perbatasan barat Sumsel dengan suaka alam Danau Rayo berteratai merah dan formasi gua karst purba Napal Licin.',
    center: [-2.7500, 102.9000],
    zoom: 10,
    highlightColor: '#dc2626',
    badgeBg: 'bg-red-600/10 text-red-800 border-red-600/20',
    icon: '🌺',
    stats: {
      nodesCount: MURATARA_NODES.length,
      heritageEra: 'Suaka Alam Tropis Pedalaman',
      signatureLandmark: 'Danau Rayo Karang Jaya',
    },
  },
  'Empat Lawang': {
    id: 'Empat Lawang',
    category: 'Kabupaten',
    name: 'Kabupaten Empat Lawang',
    shortName: 'Empat Lawang',
    motto: 'Saling Keruani Sangi Kerawati',
    relationship: 'Negeri Empat Pendekar & Air Terjun Bayau',
    description: 'Tanah pegunungan lembah Sungai Lintang dengan kisah patriotisme Empat Pendekar (Empat Lawang), kebun kopi lereng bukit, dan tirai air terjun Bayau.',
    center: [-3.7500, 103.0500],
    zoom: 11,
    highlightColor: '#9333ea',
    badgeBg: 'bg-purple-600/10 text-purple-800 border-purple-600/20',
    icon: '⚔️',
    stats: {
      nodesCount: EMPAT_LAWANG_NODES.length,
      heritageEra: 'Folklor Empat Pendekar Lintang',
      signatureLandmark: 'Air Terjun Bayau Muara Pinang',
    },
  },
};

// Pengelompokan administratif resmi Provinsi Sumatera Selatan
export const CAPITAL_CITY_ID: CulturalRegion = 'Palembang';

export const OTHER_CITIES_REGIONS: CulturalRegion[] = [
  'Pagaralam',
  'Prabumulih',
  'Lubuklinggau',
];

export const REGENCIES_REGIONS: CulturalRegion[] = [
  'Lahat',
  'Ogan Ilir',
  'Muara Enim',
  'PALI',
  'OKU',
  'OKU Selatan',
  'OKU Timur',
  'OKI',
  'Banyuasin',
  'Musi Banyuasin',
  'Musi Rawas',
  'Muratara',
  'Empat Lawang',
];

export const ALL_SUMSEL_REGIONS: CulturalRegion[] = [
  CAPITAL_CITY_ID,
  ...OTHER_CITIES_REGIONS,
  ...REGENCIES_REGIONS,
];

/**
 * Helper fleksibel untuk mencari node budaya berdasarkan nama, ID, atau kata kunci
 */
export function findPalembangNode(query: string): UniversalNode | undefined {
  if (!query) return undefined;
  const q = query.trim().toLowerCase();

  const directId = ALL_CULTURAL_NODES.find(n => n.id.toLowerCase() === q);
  if (directId) return directId;

  // Fallback fuzzy search substring dua arah
  return ALL_CULTURAL_NODES.find(n => 
    n.name.toLowerCase().includes(q) || 
    q.includes(n.name.toLowerCase()) ||
    n.tags.some(t => t.toLowerCase().includes(q) || q.includes(t.toLowerCase()))
  );
}

export const findCulturalNode = findPalembangNode;
