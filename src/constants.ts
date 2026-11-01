/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NodeType, UniversalNode } from './types';

export const PALEMBANG_NODES: UniversalNode[] = [
  {
    id: 'node-0',
    name: 'Bukit Siguntang (Genesis Node)',
    type: NodeType.HERITAGE,
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
    tags: ['Genesis', 'Sriwijaya', 'Sejarah', 'Akar Peradaban']
  },
  {
    id: 'node-1',
    name: 'Museum Sultan Mahmud Badaruddin II',
    type: NodeType.HERITAGE,
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
    tags: ['Sejarah', 'Edukasi', 'Sriwijaya']
  },
  {
    id: 'node-2',
    name: 'Masjid Agung Sultan Mahmud Badaruddin I',
    type: NodeType.RELIGION,
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
    tags: ['Ibadah', 'Arsitektur', 'Legacy']
  },
  {
    id: 'node-3',
    name: 'Pengrajin Songket Tuan Kentang',
    type: NodeType.MSME,
    description: 'Pusat kerajinan kain songket khas Palembang dengan motif tradisional yang ditenun secara manual.',
    image: 'https://bagindorentcar.com/wp-content/uploads/2018/11/IMG_0359.jpg',
    location: {
      lat: -3.0012,
      lng: 104.7392,
      address: 'Kampung Tuan Kentang, Seberang Ulu I, Palembang'
    },
    traceability: [
      { id: 'tx-4', timestamp: '2024-04-12T11:00:00Z', event: 'Sertifikasi Keaslian Songket', actor: 'STC Nusantara', hash: '0xcd12...ef34' }
    ],
    tags: ['Craft', 'Fashion', 'Economic']
  },
  {
    id: 'node-ampera',
    name: 'Jembatan Ampera (Amanat Penderitaan Rakyat)',
    type: NodeType.HERITAGE,
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

/**
 * Helper fleksibel untuk mencari node Palembang berdasarkan nama, ID, atau kata kunci
 */
export function findPalembangNode(query: string): UniversalNode | undefined {
  if (!query) return undefined;
  const q = query.trim().toLowerCase();

  // 1. Cek kecocokan langsung ID
  const directId = PALEMBANG_NODES.find(n => n.id.toLowerCase() === q);
  if (directId) return directId;

  // 2. Cek kata kunci spesifik landmark
  if (q.includes('ampera')) {
    return PALEMBANG_NODES.find(n => n.id === 'node-ampera');
  }
  if (q.includes('kemaro')) {
    return PALEMBANG_NODES.find(n => n.id === 'node-kemaro');
  }
  if (q.includes('siguntang')) {
    return PALEMBANG_NODES.find(n => n.id === 'node-0');
  }
  if (q.includes('ketek') || q.includes('perahu') || q.includes('dermaga') || q.includes('boat')) {
    return PALEMBANG_NODES.find(n => n.id === 'node-ketek');
  }
  if (q.includes('benteng') || q.includes('kuto besak') || q.includes('bkb')) {
    return PALEMBANG_NODES.find(n => n.id === 'node-bkb');
  }
  if (q.includes('arab') || q.includes('al-munawar') || q.includes('almunawar') || q.includes('13 ulu')) {
    return PALEMBANG_NODES.find(n => n.id === 'node-almunawar');
  }
  if (q.includes('museum') || q.includes('badaruddin ii') || q.includes('smb ii')) {
    return PALEMBANG_NODES.find(n => n.id === 'node-1');
  }
  if (q.includes('masjid') || q.includes('agung') || q.includes('badaruddin i')) {
    return PALEMBANG_NODES.find(n => n.id === 'node-2');
  }
  if (q.includes('songket') || q.includes('kentang') || q.includes('tenun')) {
    return PALEMBANG_NODES.find(n => n.id === 'node-3');
  }

  // 3. Fallback fuzzy search substring dua arah
  return PALEMBANG_NODES.find(n => 
    n.name.toLowerCase().includes(q) || 
    q.includes(n.name.toLowerCase()) ||
    n.tags.some(t => t.toLowerCase().includes(q) || q.includes(t.toLowerCase()))
  );
}
