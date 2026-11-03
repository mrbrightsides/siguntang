/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageMode = 'id' | 'palembang_alus';

export interface Translations {
  navExplorer: string;
  navMap: string;
  navTraceability: string;
  navTimeline: string;
  navSongket: string;
  navQuiz: string;
  heroBadge: string;
  heroTitleMain: string;
  heroTitleHighlight: string;
  heroQuote: string;
  heroDesc: string;
  btnRideKetek: string;
  btnExploreNodes: string;
  btnNetwork: string;
  metricRoutes: string;
  metricRoutesLabel: string;
  metricNodes: string;
  metricNodesLabel: string;
  metricTraceable: string;
  metricTraceableLabel: string;
  connectWallet: string;
  connected: string;
  sectionMissionTitle: string;
  sectionMissionHighlight: string;
  sectionMissionP1: string;
  sectionMissionP2: string;
  timelineSectionBadge: string;
  timelineSectionTitle: string;
  timelineSectionSubtitle: string;
  motifSectionBadge: string;
  motifSectionTitle: string;
  motifSectionSubtitle: string;
  quizSectionBadge: string;
  quizSectionTitle: string;
  quizSectionSubtitle: string;
  footerPlatform: string;
  footerKnowledge: string;
  footerAI: string;
  langToggleLabel: string;
}

export const DICTIONARY: Record<LanguageMode, Translations> = {
  id: {
    navExplorer: 'Explorer',
    navMap: 'Heritage Map',
    navTraceability: 'Traceability',
    navTimeline: 'Linimasa Sejarah',
    navSongket: 'Ensiklopedi Songket',
    navQuiz: 'Uji Sriwijaya',
    heroBadge: 'STC AUTHENTICATED',
    heroTitleMain: 'Gerbang Universal',
    heroTitleHighlight: 'Node Nusantara',
    heroQuote: '“Peta Hidup Budaya Palembang”',
    heroDesc: 'Integrasi cerdas aset budaya, religi, dan sejarah Palembang dalam ekosistem digital berbasis blockchain dan Artifical Intelligence.',
    btnRideKetek: 'Naik Ketek & Jelajah Musi',
    btnExploreNodes: 'Explore Heritage Nodes',
    btnNetwork: 'Network',
    metricRoutes: '5 Rute',
    metricRoutesLabel: 'Folklore Musi',
    metricNodes: '120+',
    metricNodesLabel: 'Cultural Nodes',
    metricTraceable: '100%',
    metricTraceableLabel: 'Traceable STC',
    connectWallet: 'Connect',
    connected: 'Terhubung',
    sectionMissionTitle: 'Menghidupkan Kembali',
    sectionMissionHighlight: 'Node Budaya',
    sectionMissionP1: 'Warisan budaya selama ini seringkali bersifat pasif—hanya menjadi latar foto tanpa narasi yang mendalam.',
    sectionMissionP2: 'SIGUNTANG hadir untuk memecahkan masalah dokumentasi konvensional dan cerita sejarah yang tercecer, mengubahnya menjadi ekosistem digital interaktif yang hidup.',
    timelineSectionBadge: 'KRONIK PERADABAN 683 M – KINI',
    timelineSectionTitle: 'Lorong Waktu Sejarah',
    timelineSectionSubtitle: 'Menyusuri tapak kejayaan Sriwijaya, kegigihan Kesultanan Palembang Darussalam, hingga kedaulatan digital Songket Tenun Chain.',
    motifSectionBadge: 'KRIYA ADILUHUNG & FILOSOFI',
    motifSectionTitle: 'Anatomi & Ragam Hias Songket',
    motifSectionSubtitle: 'Mengurai kemuliaan helai benang emas jantun, struktur tumpal pucuk rebung, dan pewarna alami ramah iklim FOLU Net Sink 2030.',
    quizSectionBadge: 'TANTANGAN EDUKASI & PRESTASI',
    quizSectionTitle: 'Uji Sahabat Sriwijaya',
    quizSectionSubtitle: 'Uji pengetahuan sejarah kuto Palembang dan raih Piagam Duta Cagar Budaya resmi ber-QR Code on-chain.',
    footerPlatform: 'Platform',
    footerKnowledge: 'Knowledge & Protocol',
    footerAI: 'Blockchain & AI',
    langToggleLabel: 'Basa Palembang Alus'
  },
  palembang_alus: {
    navExplorer: 'Simpul Pusako',
    navMap: 'Peta Kuto Palembang',
    navTraceability: 'Lacak Kripto STC',
    navTimeline: 'Tititi Sejara',
    navSongket: 'Kamus Sewet Songket',
    navQuiz: 'Uji Pasak Sriwijaya',
    heroBadge: 'PENGESAHAN STC PUSAKO',
    heroTitleMain: 'Lawang Agung',
    heroTitleHighlight: 'Node Nusantara',
    heroQuote: '“Peta Idop Adat Kuto Palembang”',
    heroDesc: 'Paduan cindo khazanah cagar budaya, pesarean, lan lelintang sejara Palembang lebet jaringan pinter blockchain lan Ponggawa AI.',
    btnRideKetek: 'Nunggang Ketek & Nyusur Musi',
    btnExploreNodes: 'Jingok Simpul Pusako',
    btnNetwork: 'Jaringan Jagat',
    metricRoutes: '5 Lampahan',
    metricRoutesLabel: 'Cerito Batanghari Musi',
    metricNodes: '120+',
    metricNodesLabel: 'Simpul Cagar Budaya',
    metricTraceable: '100%',
    metricTraceableLabel: 'Kasahihan Kripto STC',
    connectWallet: 'Sambung Dompet',
    connected: 'Sampun Nyambung',
    sectionMissionTitle: 'Nguripke Malek',
    sectionMissionHighlight: 'Pusako Leluhur Kito',
    sectionMissionP1: 'Khazanah cagar pusako selamo ini kerap mung dados pajangan foto tanpa kawruh cerito ingkang lebet.',
    sectionMissionP2: 'SIGUNTANG rawuh ngempalke serat sejara ingkang kasebar, ngubah dados lambang pusako digital ingkang gesang lan nentremke ati.',
    timelineSectionBadge: 'LELINTANG SEJARA 683 M – SAMPEK MANGKIN',
    timelineSectionTitle: 'Tititi Sejara Wong Kito',
    timelineSectionSubtitle: 'Nyusur tapak jayo Kedukan Bukit Sriwijaya, daulat Kesultanan Palembang Darussalam, tumeko jaman digital Songket Tenun Chain.',
    motifSectionBadge: 'TENUN CINDO & PIWULANG ADAT',
    motifSectionTitle: 'Bedah Anatomi & Motif Songket',
    motifSectionSubtitle: 'Nyuraikan kilau benang ameh jantun, pucuk rebung palepai, lan celup godong gambir secang ramah bumi FOLU Net Sink 2030.',
    quizSectionBadge: 'UJI KAWRUH PUSAKO & GANJARAN',
    quizSectionTitle: 'Uji Pasak Sriwijaya',
    quizSectionSubtitle: 'Cobi uji kawruh sejara kuto kito Palembang lan tampi Piagam Duta Cagar Budaya resmi mawi QR Code on-chain.',
    footerPlatform: 'Wahana Platform',
    footerKnowledge: 'Kawruh & Pranata Adat',
    footerAI: 'Blockchain & AI Pinter',
    langToggleLabel: 'Bahasa Indonesia'
  }
};

interface LanguageContextType {
  language: LanguageMode;
  setLanguage: (lang: LanguageMode) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<LanguageMode>(() => {
    try {
      const saved = localStorage.getItem('siguntang_lang');
      return (saved === 'palembang_alus' || saved === 'id') ? saved : 'id';
    } catch {
      return 'id';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('siguntang_lang', language);
    } catch {
      // ignore
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'id' ? 'palembang_alus' : 'id');
  };

  const t = DICTIONARY[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
