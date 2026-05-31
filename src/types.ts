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

export interface UniversalNode {
  id: string;
  name: string;
  type: NodeType;
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
