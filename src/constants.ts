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
  }
];
