/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

declare global {
  interface Window {
    ethereum?: any;
  }
}

export enum NodeType {
  CULTURE = 'Budaya',
  TOURISM = 'Wisata',
  HERITAGE = 'Heritage',
  MSME = 'UMKM',
  RELIGION = 'Religi',
  COMMUNITY = 'Komunitas',
}

export interface TraceabilityLog {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
  hash: string;
}

export type CulturalRegion =
  // Ibukota Provinsi
  | 'Palembang'
  // 3 Kota Lainnya
  | 'Pagaralam'
  | 'Prabumulih'
  | 'Lubuklinggau'
  // 13 Kabupaten
  | 'Lahat'
  | 'Ogan Ilir'
  | 'Muara Enim'
  | 'PALI'
  | 'OKU'
  | 'OKU Selatan'
  | 'OKU Timur'
  | 'OKI'
  | 'Banyuasin'
  | 'Musi Banyuasin'
  | 'Musi Rawas'
  | 'Muratara'
  | 'Empat Lawang';

export interface UniversalNode {
  id: string;
  name: string;
  type: NodeType;
  region?: CulturalRegion;
  description: string;
  image: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  traceability: TraceabilityLog[];
  tags: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
