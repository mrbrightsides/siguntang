/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { cleanAsterisks } from "../lib/utils";

export type StoneStyle = 'sandstone-kedukan' | 'andesit-telaga-batu' | 'lempeng-tembaga';

export interface PledgeTemplate {
  id: string;
  category: string;
  label: string;
  defaultPledge: string;
  suggestedStone: StoneStyle;
  iconName: string;
}

export const PLEDGE_TEMPLATES: PledgeTemplate[] = [
  {
    id: 'siddhayatra-musi',
    category: 'Perlindungan Ekosistem & Kemakmuran Musi',
    label: 'Siddhayatra Pelindung Musi',
    defaultPledge: 'Kami bersumpah menjaga kejernihan dan kelestarian Sungai Musi, melarang segala perusakan air, dan memuliakan urat nadi kehidupan nenek moyang Sriwijaya demi kemakmuran seluruh rakyat.',
    suggestedStone: 'sandstone-kedukan',
    iconName: 'Waves'
  },
  {
    id: 'kriya-songket',
    category: 'Pelestarian Kriya Tenun Adat Songket',
    label: 'Sumpah Penjaga Benang Emas',
    defaultPledge: 'Berikrar mempertahankan kemurnian tenun gedogan Songket Palembang, melindungi hak cipta komunal penenun tradisi, dan mewariskan motif Lepus serta Limar tanpa membiarkannya punah tergerus zaman.',
    suggestedStone: 'lempeng-tembaga',
    iconName: 'Sparkles'
  },
  {
    id: 'kedaulatan-sriwijaya',
    category: 'Riset Sejarah & Epigrafi Nusantara',
    label: 'Ikrar Kedaulatan Wanua Sriwijaya',
    defaultPledge: 'Menjunjung tinggi kebenaran sejarah bahari Sriwijaya, merawat situs Bukit Siguntang dan prasasti kuno, serta membangkitkan rasa bangga peradaban maritim Nusantara di mata dunia.',
    suggestedStone: 'andesit-telaga-batu',
    iconName: 'Shield'
  },
  {
    id: 'adat-limas',
    category: 'Warisan Arsitektur Adat Rumah Limas',
    label: 'Piagam Penghormatan Budi Pekerti',
    defaultPledge: 'Memelihara keluhuran adab kearifan lokal Melayu Palembang, menghormati tamu, dan menjaga falsafah kekijing Rumah Limas sebagai simbol martabat keluarga yang suci.',
    suggestedStone: 'sandstone-kedukan',
    iconName: 'Home'
  }
];

export interface DigitalPrasastiResult {
  steleTitle: string;
  visitorName: string;
  oldMalayText: string;
  phoneticTransliteration: string;
  pallawaScript: string;
  indonesianTranslation: string;
  curseProtectionFormula: string;
  historicalContextNotes: string;
  sbtMetadata: {
    name: string;
    description: string;
    attributes: Array<{ trait_type: string; value: string | number }>;
  };
}

/**
 * Memanggil endpoint backend /api/prasasti/generate untuk mengubah ikrar menjadi prasasti Melayu Kuna abad ke-7
 */
export async function generateDigitalPrasasti(params: {
  visitorName: string;
  pledgeCategory: string;
  customPledge: string;
  stoneStyle?: StoneStyle;
}): Promise<DigitalPrasastiResult> {
  try {
    const response = await fetch('/api/prasasti/generate', {
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
      steleTitle: cleanAsterisks(data.steleTitle || `Prasasti Sumpah ${params.visitorName}`),
      visitorName: params.visitorName,
      oldMalayText: cleanAsterisks(data.oldMalayText || ''),
      phoneticTransliteration: cleanAsterisks(data.phoneticTransliteration || ''),
      pallawaScript: data.pallawaScript || '',
      indonesianTranslation: cleanAsterisks(data.indonesianTranslation || ''),
      curseProtectionFormula: cleanAsterisks(data.curseProtectionFormula || ''),
      historicalContextNotes: cleanAsterisks(data.historicalContextNotes || ''),
      sbtMetadata: data.sbtMetadata || {
        name: `Prasasti Digital Sumpah Budaya - ${params.visitorName}`,
        description: `Prasasti Sumpah Digital beraksara Pallawa dan berbahasa Melayu Kuna abad ke-7.`,
        attributes: [
          { trait_type: 'Pemberi Sumpah', value: params.visitorName },
          { trait_type: 'Kategori Sumpah', value: params.pledgeCategory },
          { trait_type: 'Bahasa', value: 'Melayu Kuna Abad ke-7' },
          { trait_type: 'Aksara Epigrafi', value: 'Pallawa Sriwijaya' },
          { trait_type: 'Format Batu', value: params.stoneStyle || 'sandstone-kedukan' },
          { trait_type: 'Protokol STC', value: 'EIP-5192 Immutable SBT' }
        ]
      }
    };
  } catch (error) {
    console.warn("Fallback generator prasasti digital invoked:", error);
    return getFallbackPrasasti(params);
  }
}

function getFallbackPrasasti(params: {
  visitorName: string;
  pledgeCategory: string;
  customPledge: string;
  stoneStyle?: StoneStyle;
}): DigitalPrasastiResult {
  const name = params.visitorName.trim() || 'Sahabat Budaya Nusantara';
  const stone = params.stoneStyle || 'sandstone-kedukan';

  return {
    steleTitle: `Prasasti Sumpah Abadi ${name}`,
    visitorName: name,
    oldMalayText: `Śrī! Śaka-warṣātīta 605 dāpūnta hyaṅ nāyik di sāmvau maṅalap siddhayātra. Ni-sumpahhon dŋan baktī de śrī ${name}: 'Kalu marwwāt kadātuan sarvwa-pradāna wanua Musi, tida ya marpāh tida ya mamāwa rogā, sukha-citta makasampūrṇa.'`,
    phoneticTransliteration: `Shri! Shaka-warsatita 605... Dapunta hyang nayik di samvau mangalap siddhayatra. Ni-sumpahhon dngan bhakti de shri ${name}: 'Kalu marwwat kadatuan sarwwa-pradana wanua Musi, tida ya marpah tida ya mamawa roga, sukha-citta makasampurna.'`,
    pallawaScript: `ꦯꦿꦷ! ꦯꦏꦮꦂꦰꦴꦠꦷꦠ ꦢꦴꦥꦹꦤ꧀ꦠ ꦲꦾꦁ ꦤꦴꦪꦶꦏ꧀ ꦢꦶ ꦱꦴꦩ꧀ꦮꦻꦴ ꦩꦔꦭꦥ꧀ ꦱꦶꦢ꧀ꦣꦪꦴꦠꦿ꧉ ꦤꦶꦱꦸꦩ꧀ꦥꦃꦲꦺꦴꦤ꧀ ꦢꦼ ꦯꦿꦷ ${name}`,
    indonesianTranslation: `Semoga jaya dan selamat! Dengan kemuliaan sumpah suci yang diikrarkan oleh ${name}: 'Maka kami bersumpah dengan segenap pengabdian hati untuk memelihara kedatuan dan tanah leluhur Musi, tiada akan merusaknya, tiada membawa marabahaya, melainkan mendatangkan kemakmuran dan kedamaian paripurna.'`,
    curseProtectionFormula: `Barang siapa teguh memegang ikrar pelestarian ini, baginya keberkahan tanah air dan sungai nan suci. Dan barang siapa berbuat khianat serta merusak pusaka Musi, niscaya binasa ditimpa sumpah para dewa leluhur Sriwijaya.`,
    historicalContextNotes: `Formula epigrafi mengadopsi Prasasti Kedukan Bukit (683 M) dan Telaga Batu abad ke-7 yang ditemukan di Palembang. Mencerminkan tradisi sumpah suci (sapatha) untuk menjaga keharmonisan wanua perairan.`,
    sbtMetadata: {
      name: `Prasasti Digital Sumpah Budaya - ${name}`,
      description: `Prasasti Sumpah Digital beraksara Pallawa dan berbahasa Melayu Kuna abad ke-7. Diterbitkan sebagai Soulbound Token (ERC-5192) pada Smart Tourism Chain (STC).`,
      attributes: [
        { trait_type: 'Pemberi Sumpah', value: name },
        { trait_type: 'Kategori Sumpah', value: params.pledgeCategory },
        { trait_type: 'Bahasa', value: 'Melayu Kuna Abad ke-7' },
        { trait_type: 'Aksara Epigrafi', value: 'Pallawa Sriwijaya' },
        { trait_type: 'Format Batu', value: stone === 'andesit-telaga-batu' ? 'Batu Andesit Hitam Telaga Batu' : 'Batu Sandstone Bukit Siguntang' },
        { trait_type: 'Protokol STC', value: 'EIP-5192 Immutable SBT' }
      ]
    }
  };
}

/**
 * Pembacaan dramatis teks Melayu Kuna dan terjemahan menggunakan sintesis suara
 */
export function speakPrasastiRecitation(
  text: string,
  onEnd?: () => void
): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return () => {};
  }

  window.speechSynthesis.cancel();

  const cleanText = text
    .replace(/[#*_~`ꦯꦿꦷꦏꦮꦂꦰꦴꦠꦷꦠꦢꦴꦥꦹꦤ꧀ꦠꦲꦾꦁꦤꦴꦪꦶꦏ꧀ꦢꦶꦱꦴꦩ꧀ꦮꦻꦴꦩꦔꦭꦥ꧀ꦱꦶꦢ꧀ꦣꦪꦴꦠꦿ]/g, '')
    .slice(0, 500);

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'id-ID';
  utterance.rate = 0.88; // Wibawa tempo lambat khas pembacaan prasasti kuno
  utterance.pitch = 0.90; // Nada berat berwibawa

  const voices = window.speechSynthesis.getVoices();
  const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
  if (idVoice) utterance.voice = idVoice;

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
}
