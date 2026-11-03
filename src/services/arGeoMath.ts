/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GeoCoordinate {
  lat: number;
  lng: number;
}

// Pusat Jembatan Ampera (Titik Episentrum Maritim Palembang)
export const PALEMBANG_CENTER: GeoCoordinate = {
  lat: -2.9918,
  lng: 104.7634,
};

// Puncak Bukit Siguntang (Genesis Node)
export const SIGUNTANG_SUMMIT: GeoCoordinate = {
  lat: -2.9972,
  lng: 104.7256,
};

/**
 * Menghitung jarak Haversine antara dua titik koordinat bumi dalam satuan meter
 */
export function calculateDistanceMeters(coord1: GeoCoordinate, coord2: GeoCoordinate): number {
  const R = 6371e3; // Radius bumi dalam meter
  const phi1 = (coord1.lat * Math.PI) / 180;
  const phi2 = (coord2.lat * Math.PI) / 180;
  const deltaPhi = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const deltaLambda = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Format jarak menjadi string yang mudah dibaca (misal: "450 m" atau "2.4 km")
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  const km = meters / 1000;
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
}

/**
 * Menghitung initial bearing (sudut azimuth derajat 0°–360°) dari titik awal ke titik tujuan
 * 0° = Utara, 90° = Timur, 180° = Selatan, 270° = Barat
 */
export function calculateBearingDegrees(from: GeoCoordinate, to: GeoCoordinate): number {
  const phi1 = (from.lat * Math.PI) / 180;
  const phi2 = (to.lat * Math.PI) / 180;
  const deltaLambda = ((to.lng - from.lng) * Math.PI) / 180;

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  const theta = Math.atan2(y, x);
  const degrees = ((theta * 180) / Math.PI + 360) % 360;
  return degrees;
}

/**
 * Mengonversi sudut derajat ke arah mata angin (N, NE, E, SE, S, SW, W, NW)
 */
export function bearingToCardinal(deg: number): string {
  const cardinals = [
    'U (Utara)',
    'TL (Timur Laut)',
    'T (Timur)',
    'TG (Tenggara)',
    'S (Selatan)',
    'BD (Barat Daya)',
    'B (Barat)',
    'BL (Barat Laut)',
  ];
  const index = Math.round(deg / 45) % 8;
  return cardinals[index];
}

/**
 * Menghitung selisih sudut relatif (bearing - currentHeading) yang dinormalisasi antara -180° dan 180°
 */
export function getRelativeAngle(bearing: number, heading: number): number {
  let diff = (bearing - heading) % 360;
  if (diff < -180) diff += 360;
  if (diff > 180) diff -= 360;
  return diff;
}

/**
 * Data Spesifikasi Sampel Penanda 3D Jembatan Ampera (Ampera Bridge AR Marker Sample Data)
 */
export interface ARMarkerSampleData {
  id: string;
  name: string;
  description: string;
  coordinates: GeoCoordinate;
  toleranceRadiusMeters: number; // Radius toleransi pencocokan koordinat geografis (350 meter)
  builtYear: number;
  lengthMeters: number;
  heightMeters: number;
  elevationMsl: number;
  architecturalStyle: string;
  stcProofHash: string;
  model3DFeatures: string[];
}

export const AMPERA_MARKER_SAMPLE_DATA: ARMarkerSampleData = {
  id: 'node-ampera',
  name: 'Jembatan Ampera (Amanat Penderitaan Rakyat)',
  description: 'Ikon maritim agung Palembang yang membelah Ulu dan Ilir Sungai Musi. Dibangun pada 1962 dengan menara kembar merah dan bentang angkat maritim legendaris.',
  coordinates: {
    lat: -2.9918,
    lng: 104.7634,
  },
  toleranceRadiusMeters: 350,
  builtYear: 1962,
  lengthMeters: 1177,
  heightMeters: 63,
  elevationMsl: 18,
  architecturalStyle: 'Modernist Red Steel Suspension & Vertical-Lift Towers',
  stcProofHash: '0x3f9a...88b1_AMPERA_GENESIS_NODE',
  model3DFeatures: [
    'Twin Red Pylon Towers (Menara Kembar 63m)',
    'High-Tension Steel Suspension Cable Stays',
    'Vertical Lifting Crossbar Deck (Bentang Angkat)',
    'Holographic Navigational Beacon & Ground Pulse Ring',
    'STC CarbonPrint Monitoring Twin Sensors'
  ],
};

/**
 * Memeriksa apakah koordinat lokasi pengguna saat ini cocok (dalam radius toleransi) dengan Jembatan Ampera
 */
export function isAmperaCoordinateMatch(
  userCoord: GeoCoordinate,
  toleranceMeters = AMPERA_MARKER_SAMPLE_DATA.toleranceRadiusMeters
): {
  isMatch: boolean;
  distanceMeters: number;
  bearing: number;
  cardinal: string;
} {
  const distanceMeters = calculateDistanceMeters(userCoord, AMPERA_MARKER_SAMPLE_DATA.coordinates);
  const bearing = calculateBearingDegrees(userCoord, AMPERA_MARKER_SAMPLE_DATA.coordinates);
  const cardinal = bearingToCardinal(bearing);

  return {
    isMatch: distanceMeters <= toleranceMeters,
    distanceMeters,
    bearing,
    cardinal,
  };
}

import { UniversalNode } from '../types';

/**
 * Mendapatkan deskripsi arah relatif berdasarkan selisih sudut pandang kamera vs bearing situs
 */
export function getRelativeDirectionText(relAngle: number): string {
  const abs = Math.abs(relAngle);
  if (abs <= 12) {
    return 'Tepat di Depan (Lurus)';
  } else if (relAngle > 12 && relAngle <= 45) {
    return `Serong Kanan (${Math.round(relAngle)}°)`;
  } else if (relAngle > 45 && relAngle <= 120) {
    return `Kanan (${Math.round(relAngle)}°)`;
  } else if (relAngle < -12 && relAngle >= -45) {
    return `Serong Kiri (${Math.round(abs)}°)`;
  } else if (relAngle < -45 && relAngle >= -120) {
    return `Kiri (${Math.round(abs)}°)`;
  } else {
    return `Berbalik Arah (${Math.round(abs)}°)`;
  }
}

export interface NearestSiteResult {
  node: UniversalNode;
  distanceMeters: number;
  bearing: number;
  relativeAngle: number;
  cardinal: string;
  relativeDirectionText: string;
}

/**
 * Menemukan situs cagar budaya Palembang yang terdekat dari koordinat pengguna
 */
export function findNearestHeritageSite(
  userCoord: GeoCoordinate,
  nodes: UniversalNode[],
  heading: number = 0
): NearestSiteResult | null {
  if (!nodes || nodes.length === 0) return null;
  let nearest: NearestSiteResult | null = null;

  for (const node of nodes) {
    const dist = calculateDistanceMeters(userCoord, node.location);
    const bearing = calculateBearingDegrees(userCoord, node.location);
    const rel = getRelativeAngle(bearing, heading);
    const cardinal = bearingToCardinal(bearing);

    if (!nearest || dist < nearest.distanceMeters) {
      nearest = {
        node,
        distanceMeters: dist,
        bearing,
        relativeAngle: rel,
        cardinal,
        relativeDirectionText: getRelativeDirectionText(rel),
      };
    }
  }

  return nearest;
}

export interface CalibrationStatus {
  zone: 'on_site' | 'in_range' | 'approaching' | 'far';
  zoneLabel: string;
  isCalibrated: boolean;
  accuracyScore: number; // 0 - 100%
  description: string;
  badgeColor: string;
}

/**
 * Menghitung status kalibrasi spasial pengguna terhadap situs terpilih
 */
export function getSiteCalibrationStatus(
  distanceMeters: number,
  toleranceRadius = 350
): CalibrationStatus {
  if (distanceMeters <= 50) {
    return {
      zone: 'on_site',
      zoneLabel: 'Episentrum Terverifikasi (On-Site)',
      isCalibrated: true,
      accuracyScore: 100,
      description: 'Presisi lokasi sangat tinggi (deviasi < 50m). Penanda AR dan SBT siap diklaim.',
      badgeColor: '#10b981',
    };
  } else if (distanceMeters <= toleranceRadius) {
    const pct = Math.round(100 - ((distanceMeters - 50) / (toleranceRadius - 50)) * 25);
    return {
      zone: 'in_range',
      zoneLabel: 'Radius Deteksi AR (In-Range)',
      isCalibrated: true,
      accuracyScore: Math.max(75, pct),
      description: `Lokasi berada dalam radius toleransi ${toleranceRadius}m dari situs. Kalibrasi AR aktif.`,
      badgeColor: '#10b981',
    };
  } else if (distanceMeters <= 1000) {
    const pct = Math.round(75 - ((distanceMeters - toleranceRadius) / (1000 - toleranceRadius)) * 35);
    return {
      zone: 'approaching',
      zoneLabel: 'Menuju Kawasan Situs (Approaching)',
      isCalibrated: false,
      accuracyScore: Math.max(40, pct),
      description: `Pengguna berjarak ${Math.round(distanceMeters)}m dari situs. Kalibrasi posisi untuk mendekat.`,
      badgeColor: '#f59e0b',
    };
  } else {
    return {
      zone: 'far',
      zoneLabel: 'Di Luar Jangkauan Fisik (Out-of-Range)',
      isCalibrated: false,
      accuracyScore: Math.max(5, Math.round(10000 / distanceMeters)),
      description: `Jarak ${formatDistance(distanceMeters)} melebihi radius deteksi fisik. Gunakan kalibrasi untuk sinkronisasi.`,
      badgeColor: '#ef4444',
    };
  }
}


