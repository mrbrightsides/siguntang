/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { cleanAsterisks } from "../lib/utils";

export type TransitMode = 'ketek-diesel' | 'ketek-solar' | 'hybrid-lrt';

export interface TransitOption {
  id: TransitMode;
  name: string;
  badge: string;
  co2PerKm: number; // kg CO2e per km
  speedKmH: number;
  description: string;
  carbonSavingPercent: number;
}

export const TRANSIT_OPTIONS: TransitOption[] = [
  {
    id: 'ketek-diesel',
    name: 'Perahu Ketek Tradisional Diesel',
    badge: 'Sensasi Autentik Musi',
    co2PerKm: 0.22,
    speedKmH: 14,
    description: 'Perahu kayu bermesin tempel dengan irama khas "tek-tek-tek". Menawarkan pengalaman navigasi tradisional masyarakat Musi.',
    carbonSavingPercent: 0
  },
  {
    id: 'ketek-solar',
    name: 'Perahu Listrik Tenaga Surya (Eco-Boat STC)',
    badge: 'Zero Emission 92%',
    co2PerKm: 0.02,
    speedKmH: 16,
    description: 'Armada perahu listrik berbasis panel surya atap kanopi yang hening tanpa polusi suara dan minim emisi gas buang.',
    carbonSavingPercent: 91
  },
  {
    id: 'hybrid-lrt',
    name: 'Rute Campuran Ketek + LRT Palembang',
    badge: 'Transit Cerdas Terpadu',
    co2PerKm: 0.07,
    speedKmH: 28,
    description: 'Kombinasi pelayaran ketek di Sungai Musi dengan LRT layang melintasi Stasiun Ampera dan Jakabaring.',
    carbonSavingPercent: 68
  }
];

export interface ItineraryStop {
  timeSlot: string;
  stopName: string;
  category: string;
  riverCoordinate: string;
  activities: string[];
  localCulinaryTip: string;
  sbtCollectible: string;
  carbonEmissionKg: number;
}

export interface GeneratedCruiseItinerary {
  itineraryTitle: string;
  travelerProfile: string;
  totalDurationHours: number;
  totalDistanceKm: number;
  transitModeName: string;
  carbonMetrics: {
    totalCarbonKg: number;
    carbonSavingsKg: number;
    offsetRecommendation: string;
    efficiencyRating: 'Eco-Champion (A+)' | 'Balanced Green (A)' | 'Heritage Authentic (B)';
  };
  narrativeOverview: string;
  stops: ItineraryStop[];
  stcSmartContractVerification: string;
}

/**
 * Generator Rencana Perjalanan Wisata Cerdas & Optimalisasi Emisi Karbon Pelayaran Musi via server
 */
export async function generateSmartCruiseItinerary(params: {
  durationHours: number;
  selectedInterests: string[];
  transitMode: TransitMode;
  userCustomNotes?: string;
}): Promise<GeneratedCruiseItinerary> {
  const transit = TRANSIT_OPTIONS.find(t => t.id === params.transitMode) || TRANSIT_OPTIONS[0];

  try {
    const response = await fetch('/api/planner/itinerary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const parsed = await response.json();
    return {
      itineraryTitle: cleanAsterisks(parsed.itineraryTitle || "Ekspedisi Budaya Bahari Musi"),
      travelerProfile: cleanAsterisks(parsed.travelerProfile || "Penjelajah Budaya Sriwijaya"),
      totalDurationHours: Number(parsed.totalDurationHours) || params.durationHours,
      totalDistanceKm: Number(parsed.totalDistanceKm) || (params.durationHours * 3.5),
      transitModeName: transit.name,
      carbonMetrics: {
        totalCarbonKg: Number(parsed.carbonMetrics?.totalCarbonKg) || +(params.durationHours * 3.5 * transit.co2PerKm).toFixed(2),
        carbonSavingsKg: Number(parsed.carbonMetrics?.carbonSavingsKg) || +(params.durationHours * 3.5 * 0.45).toFixed(2),
        offsetRecommendation: cleanAsterisks(parsed.carbonMetrics?.offsetRecommendation || "Donasi bibit pohon nipah di delta Pulau Kemaro melalui smart contract STC Green Escrow."),
        efficiencyRating: parsed.carbonMetrics?.efficiencyRating || (transit.id === 'ketek-solar' ? 'Eco-Champion (A+)' : 'Heritage Authentic (B)')
      },
      narrativeOverview: cleanAsterisks(parsed.narrativeOverview || ""),
      stops: Array.isArray(parsed.stops) ? parsed.stops.map((s: any) => ({
        timeSlot: cleanAsterisks(s.timeSlot || ""),
        stopName: cleanAsterisks(s.stopName || ""),
        category: cleanAsterisks(s.category || "Cagar Budaya"),
        riverCoordinate: cleanAsterisks(s.riverCoordinate || "Tepian Musi"),
        activities: Array.isArray(s.activities) ? s.activities.map(cleanAsterisks) : [],
        localCulinaryTip: cleanAsterisks(s.localCulinaryTip || "Pempek Kapal Selam Tradisional"),
        sbtCollectible: cleanAsterisks(s.sbtCollectible || "Proof-of-Visit SBT"),
        carbonEmissionKg: Number(s.carbonEmissionKg) || 0.4
      })) : [],
      stcSmartContractVerification: cleanAsterisks(parsed.stcSmartContractVerification || "Rute pelayaran tervalidasi pada konsensus EIP-5192 STC Tourism Ledger.")
    };
  } catch (error) {
    console.warn("Fallback planner invoked:", error);
    return getFallbackItinerary(params.durationHours, params.selectedInterests, transit, params.userCustomNotes);
  }
}

function getFallbackItinerary(
  hours: number,
  interests: string[],
  transit: TransitOption,
  _userNotes?: string
): GeneratedCruiseItinerary {
  const dist = hours <= 3 ? 8.5 : hours <= 5 ? 14.2 : 24.0;
  const carbonTotal = +(dist * transit.co2PerKm).toFixed(2);
  const carbonSaved = +(dist * (0.35 - transit.co2PerKm)).toFixed(2);

  const stops4Hours: ItineraryStop[] = [
    {
      timeSlot: "08:30 - 09:45",
      stopName: "Bukit Siguntang (Genesis Node)",
      category: "Situs Arkeologi Sriwijaya",
      riverCoordinate: "Hilir Sungai Tatang (Km 0)",
      activities: [
        "Ziarah ke makam leluhur raja-raja Melayu dan arca Buddha Mahayana abad ke-6",
        "Menelaah silsilah peradaban bahari Sriwijaya di bawah naungan pohon Bodhi rindang"
      ],
      localCulinaryTip: "Sarapan Laksan kuah santan ebi hangat khas tangga buntung",
      sbtCollectible: "Genesis Node Explorer SBT (Token #1)",
      carbonEmissionKg: +(dist * 0.25 * transit.co2PerKm).toFixed(2)
    },
    {
      timeSlot: "10:00 - 11:15",
      stopName: "Dermaga Benteng Kuto Besak & Ampera",
      category: "Ikon Bahari & Sejarah Kesultanan",
      riverCoordinate: "Dermaga Point 16 Ilir (Km 4.2)",
      activities: [
        "Melayari lorong pilar Jembatan Ampera menggunakan perahu ketek",
        "Mendengarkan kisah Antu Banyu dan jembatan angkat 1962 melalui audio guide",
        "Eksplorasi pelataran bersejarah Benteng Kuto Besak menghadap Seberang Ulu"
      ],
      localCulinaryTip: "Pempek Keriting dan Pempek Panggang sambal ebi di pelataran BKB",
      sbtCollectible: "Ampera Maritime Navigator SBT (Token #2)",
      carbonEmissionKg: +(dist * 0.35 * transit.co2PerKm).toFixed(2)
    },
    {
      timeSlot: "11:30 - 12:30",
      stopName: "Delta Suci Pulau Kemaro",
      category: "Wisata Religi & Akulturasi",
      riverCoordinate: "Delta Tengah Musi (Km 10.5)",
      activities: [
        "Merapat di dermaga kayu delta Pulau Kemaro yang tidak pernah tenggelam",
        "Menyaksikan kemegahan Pagoda 9 Tingkat dan Klenteng Hok Tjing Rio",
        "Meresapi legenda cinta Tan Bun An dan Siti Fatimah di pohon cinta abadi"
      ],
      localCulinaryTip: "Es Kacang Merah susu kental manis dan Lenggang bakar daun pisang",
      sbtCollectible: "Kemaro Pilgrimage Harmony SBT (Token #3)",
      carbonEmissionKg: +(dist * 0.40 * transit.co2PerKm).toFixed(2)
    }
  ];

  return {
    itineraryTitle: `Jelajah Maritim Sriwijaya & Pusaran Musi (${hours} Jam)`,
    travelerProfile: `Wisatawan Budaya dengan fokus ${interests.length > 0 ? interests.join(' & ') : 'Sejarah Bahari & Religi'}`,
    totalDurationHours: hours,
    totalDistanceKm: dist,
    transitModeName: transit.name,
    carbonMetrics: {
      totalCarbonKg: carbonTotal,
      carbonSavingsKg: Math.max(0.5, carbonSaved),
      offsetRecommendation: "Tebus jejak emisi dengan mengadopsi 1 bibit pohon mangrove/nipah tepian Musi via STC Escrow.",
      efficiencyRating: transit.id === 'ketek-solar' ? 'Eco-Champion (A+)' : 'Heritage Authentic (B)'
    },
    narrativeOverview: `Rencana perjalanan ini dirancang khusus untuk memaksimalkan eksplorasi simpul-simpul budaya terpenting Palembang dalam durasi ${hours} jam. Menggunakan ${transit.name}, Anda akan berlayar menembus riak air Sungai Musi dari Genesis Node Bukit Siguntang hingga delta legendaris Pulau Kemaro.\n\nSetiap simpul persinggahan telah dikurasi agar memadukan ziarah sejarah kuno, kenikmatan kuliner khas sungai, serta penerbitan bukti kehadiran digital Proof-of-Visit Soulbound Token (ERC-5192) yang dicatat langsung pada konsensus Smart Tourism Chain.`,
    stops: stops4Hours,
    stcSmartContractVerification: `Audit Emisi STC CarbonPrint terverifikasi aman: ${carbonTotal} kg CO2e.`
  };
}
