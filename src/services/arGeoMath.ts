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
