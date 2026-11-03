/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { UniversalNode, NodeType } from '../types';

/**
 * Membuat procedural canvas texture untuk label billboard 3D di atas marker
 */
export function createARMarkerLabelTexture(
  title: string,
  distanceText: string,
  categoryText: string,
  accentColor = '#f59e0b',
  isMatched = false
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Bersihkan canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background rounded box dengan gradien halus
  const x = 16;
  const y = 16;
  const w = 480;
  const h = 224;
  const r = 32;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();

  // Glassmorphic dark fill (Hijau zamrud jika koordinat cocok, abu gelap jika standar)
  ctx.fillStyle = isMatched ? 'rgba(5, 42, 28, 0.95)' : 'rgba(12, 10, 8, 0.90)';
  ctx.fill();

  // Border aksen emas / emerald glow
  ctx.strokeStyle = isMatched ? '#10b981' : accentColor;
  ctx.lineWidth = isMatched ? 8 : 6;
  ctx.stroke();

  // Top Category Pill
  ctx.fillStyle = isMatched ? '#10b981' : accentColor;
  ctx.beginPath();
  ctx.arc(42, 54, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = 'bold 22px monospace';
  ctx.fillStyle = isMatched ? '#a7f3d0' : '#fde68a';
  const catLabel = isMatched ? 'KOORDINAT COCOK • LIVE OVERLAY' : categoryText.toUpperCase();
  ctx.fillText(catLabel, 64, 62);

  // Distance Pill (Kanan atas)
  ctx.fillStyle = isMatched ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.15)';
  ctx.fillRect(330, 36, 140, 38);
  ctx.strokeStyle = isMatched ? 'rgba(16, 185, 129, 0.7)' : 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.strokeRect(330, 36, 140, 38);

  ctx.font = 'bold 19px monospace';
  ctx.fillStyle = isMatched ? '#6ee7b7' : '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(isMatched ? 'IN-RANGE' : distanceText, 400, 62);
  ctx.textAlign = 'left';

  // Title / Heritage Name (Maksimal 2 baris jika panjang)
  ctx.font = 'bold 32px serif';
  ctx.fillStyle = '#ffffff';
  if (title.length > 22) {
    const words = title.split(' ');
    let line1 = '';
    let line2 = '';
    for (const w of words) {
      if ((line1 + w).length <= 20) {
        line1 += (line1 ? ' ' : '') + w;
      } else {
        line2 += (line2 ? ' ' : '') + w;
      }
    }
    ctx.fillText(line1, 32, 120);
    ctx.fillText(line2, 32, 164);
  } else {
    ctx.fillText(title, 32, 136);
  }

  // Footer Subtext / Tap to Inspect
  ctx.font = isMatched ? 'bold 18px monospace' : '18px sans-serif';
  ctx.fillStyle = isMatched ? '#34d399' : '#a8a29e';
  ctx.fillText(
    isMatched ? '✓ Posisi Terverifikasi • Tap untuk Detail & Klaim SBT' : 'Tap marker untuk melihat artefak & klaim SBT',
    32,
    204
  );

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export interface ARMarkerComposite {
  group: THREE.Group;
  iconGroup: THREE.Group;
  beaconRing: THREE.Mesh;
  labelSprite: THREE.Sprite;
  updateDistance: (dist: string) => void;
  setCoordinateMatched: (matched: boolean) => void;
  isCoordinateMatched: () => boolean;
}

/**
 * Factory untuk membuat Model 3D Komposit (THREE.Group 3–8 parts) untuk situs cagar budaya
 */
export function buildHeritage3DMarker(
  node: UniversalNode,
  distanceText: string
): ARMarkerComposite {
  const root = new THREE.Group();
  root.name = `AR_MARKER_${node.id}`;
  root.userData = { node, isARMarker: true };

  // Palet Warna & Material Standar PBR
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.85,
    roughness: 0.2,
    emissive: 0xb45309,
    emissiveIntensity: 0.25,
  });

  const redMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b,
    metalness: 0.4,
    roughness: 0.35,
    emissive: 0x7f1d1d,
    emissiveIntensity: 0.2,
  });

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x57534e,
    metalness: 0.1,
    roughness: 0.85,
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.9,
    roughness: 0.25,
  });

  const cyanBeamMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  // 1. BEACON BASE: Cincin tanah dan pulsa horizontal
  const beaconRingGeo = new THREE.RingGeometry(1.2, 1.8, 32);
  const beaconRingMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7,
  });
  const beaconRing = new THREE.Mesh(beaconRingGeo, beaconRingMat);
  beaconRing.rotation.x = -Math.PI / 2;
  beaconRing.position.y = -1.8;
  root.add(beaconRing);

  // 2. VERTICAL LIGHT SHAFT (Laser Penanda ke Langit)
  const beamGeo = new THREE.CylinderGeometry(0.08, 0.4, 7.0, 16, 1, true);
  const beam = new THREE.Mesh(beamGeo, cyanBeamMat);
  beam.position.y = 1.6;
  root.add(beam);

  // 3. ICON GROUP: 3D Procedural Architectural Miniature
  const iconGroup = new THREE.Group();
  iconGroup.position.y = 1.0;

  const id = node.id.toLowerCase();

  if (id.includes('ampera')) {
    // === MODEL 3D JEMBATAN AMPERA ===
    // Tower 1 & 2
    const towerGeo = new THREE.BoxGeometry(0.35, 3.2, 0.4);
    const towerLeft = new THREE.Mesh(towerGeo, redMat);
    towerLeft.position.set(-0.8, 0.8, 0);

    const towerRight = new THREE.Mesh(towerGeo, redMat);
    towerRight.position.set(0.8, 0.8, 0);

    // Crossbar Horisontal atas
    const crossTopGeo = new THREE.BoxGeometry(2.0, 0.35, 0.35);
    const crossTop = new THREE.Mesh(crossTopGeo, redMat);
    crossTop.position.set(0, 1.8, 0);

    // Crossbar Horisontal tengah
    const crossMid = new THREE.Mesh(crossTopGeo, redMat);
    crossMid.position.set(0, 1.1, 0);

    // Bridge Deck (Jalan raya)
    const deckGeo = new THREE.BoxGeometry(2.6, 0.15, 1.2);
    const deck = new THREE.Mesh(deckGeo, stoneMat);
    deck.position.set(0, 0.1, 0);

    // Menara Angkat Tengah (Pusat ikonik)
    const liftBoxGeo = new THREE.BoxGeometry(0.8, 0.5, 0.5);
    const liftBox = new THREE.Mesh(liftBoxGeo, goldMat);
    liftBox.position.set(0, 2.2, 0);

    // Suspension Steel Cables
    const cableMat = new THREE.MeshBasicMaterial({
      color: 0xfde68a,
      transparent: true,
      opacity: 0.75,
    });
    for (let c = -1.2; c <= 1.2; c += 0.4) {
      if (Math.abs(c) > 0.15) {
        const cableGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.8);
        const cable = new THREE.Mesh(cableGeo, cableMat);
        cable.position.set(c, 1.0, 0);
        cable.rotation.z = c > 0 ? -0.32 : 0.32;
        iconGroup.add(cable);
      }
    }

    // Holographic STC Beacon Halo above Ampera
    const haloGeo = new THREE.TorusGeometry(1.2, 0.04, 8, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.65,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.name = 'AMPERA_HALO';
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 2.8;

    iconGroup.add(towerLeft, towerRight, crossTop, crossMid, deck, liftBox, halo);
  } else if (id.includes('kemaro')) {
    // === MODEL 3D PAGODA 9 TINGKAT PULAU KEMARO ===
    const levels = 5;
    for (let i = 0; i < levels; i++) {
      const radius = 1.1 - i * 0.18;
      const height = 0.45;
      const yOffset = i * 0.48;

      // Lantai / Tubuh Oktagonal
      const bodyGeo = new THREE.CylinderGeometry(radius * 0.75, radius * 0.85, height, 8);
      const body = new THREE.Mesh(bodyGeo, redMat);
      body.position.y = yOffset;

      // Atap Genteng Bersusun (Flared eaves)
      const roofGeo = new THREE.ConeGeometry(radius * 1.15, 0.22, 8);
      const roof = new THREE.Mesh(roofGeo, goldMat);
      roof.position.y = yOffset + height / 2 + 0.1;

      iconGroup.add(body, roof);
    }
    // Finial Puncak Emas
    const finialGeo = new THREE.CylinderGeometry(0.04, 0.12, 0.8, 8);
    const finial = new THREE.Mesh(finialGeo, brassMat);
    finial.position.y = 2.7;

    const orbGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const orb = new THREE.Mesh(orbGeo, goldMat);
    orb.position.y = 3.1;

    iconGroup.add(finial, orb);
  } else if (id.includes('bkb') || id.includes('benteng')) {
    // === MODEL 3D BENTENG KUTO BESAK (Rampart & Meriam Kesultanan) ===
    // Dinding Benteng Batu Bata
    const wallGeo = new THREE.BoxGeometry(2.4, 1.2, 1.0);
    const wall = new THREE.Mesh(wallGeo, stoneMat);
    wall.position.y = 0.6;

    // Parapet / Merlon atas
    for (let b = -1.0; b <= 1.0; b += 0.5) {
      const merlonGeo = new THREE.BoxGeometry(0.3, 0.35, 1.05);
      const merlon = new THREE.Mesh(merlonGeo, stoneMat);
      merlon.position.set(b, 1.35, 0);
      iconGroup.add(merlon);
    }

    // Moncong Meriam Kuningan (Cannon)
    const cannonBarrelGeo = new THREE.CylinderGeometry(0.12, 0.18, 1.4, 16);
    const cannonBarrel = new THREE.Mesh(cannonBarrelGeo, brassMat);
    cannonBarrel.rotation.x = Math.PI / 2.3;
    cannonBarrel.position.set(0, 1.1, 0.4);

    // Tiang Panji Kesultanan
    const poleGeo = new THREE.CylinderGeometry(0.03, 0.03, 2.0, 8);
    const pole = new THREE.Mesh(poleGeo, goldMat);
    pole.position.set(0.9, 1.8, 0);

    const flagGeo = new THREE.PlaneGeometry(0.6, 0.4);
    const flag = new THREE.Mesh(flagGeo, redMat);
    flag.position.set(1.2, 2.3, 0);

    iconGroup.add(wall, cannonBarrel, pole, flag);
  } else if (id.includes('siguntang') || id.includes('genesis')) {
    // === MODEL 3D BUKIT SIGUNTANG (Stupa Sriwijaya & Candi Batu) ===
    // Dasar Teratai Bertingkat
    const base1Geo = new THREE.CylinderGeometry(1.3, 1.5, 0.35, 16);
    const base1 = new THREE.Mesh(base1Geo, stoneMat);
    base1.position.y = 0.2;

    const base2Geo = new THREE.CylinderGeometry(1.0, 1.2, 0.3, 16);
    const base2 = new THREE.Mesh(base2Geo, goldMat);
    base2.position.y = 0.5;

    // Kubah Utama Stupa (Andah)
    const stupaGeo = new THREE.SphereGeometry(0.85, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const stupa = new THREE.Mesh(stupaGeo, goldMat);
    stupa.position.y = 0.65;

    // Puncak Harmika & Yashti (Spire)
    const harmikaGeo = new THREE.BoxGeometry(0.4, 0.3, 0.4);
    const harmika = new THREE.Mesh(harmikaGeo, brassMat);
    harmika.position.y = 1.4;

    const spireGeo = new THREE.ConeGeometry(0.2, 1.2, 16);
    const spire = new THREE.Mesh(spireGeo, goldMat);
    spire.position.y = 2.0;

    // Aura Cincin Melayang
    const auraGeo = new THREE.TorusGeometry(1.2, 0.04, 8, 32);
    const aura = new THREE.Mesh(auraGeo, goldMat);
    aura.rotation.x = Math.PI / 2;
    aura.position.y = 1.1;

    iconGroup.add(base1, base2, stupa, harmika, spire, aura);
  } else if (id.includes('songket') || id.includes('kentang')) {
    // === MODEL 3D PENGRAJIN SONGKET (Prisma Tenun Geometris) ===
    const prismGeo = new THREE.OctahedronGeometry(0.9, 0);
    const prism = new THREE.Mesh(prismGeo, goldMat);
    prism.position.y = 1.2;

    const ringGeo = new THREE.TorusGeometry(1.3, 0.06, 12, 32);
    const ring1 = new THREE.Mesh(ringGeo, redMat);
    ring1.rotation.x = Math.PI / 4;
    ring1.position.y = 1.2;

    const ring2 = new THREE.Mesh(ringGeo, brassMat);
    ring2.rotation.y = Math.PI / 3;
    ring2.position.y = 1.2;

    iconGroup.add(prism, ring1, ring2);
  } else if (id.includes('almunawar') || id.includes('arab')) {
    // === MODEL 3D KAMPUNG ARAB (Rumah Limas & Menara Gambus) ===
    // Tiang Kayu Rumah Panggung Limas
    const houseBaseGeo = new THREE.BoxGeometry(1.6, 0.6, 1.2);
    const houseBase = new THREE.Mesh(houseBaseGeo, stoneMat);
    houseBase.position.y = 0.3;

    // Atap Limas Bertingkat Kayu Ulin
    const roof1Geo = new THREE.ConeGeometry(1.3, 0.7, 4);
    const roof1 = new THREE.Mesh(roof1Geo, redMat);
    roof1.rotation.y = Math.PI / 4;
    roof1.position.y = 0.95;

    // Menara Klasik
    const minaretGeo = new THREE.CylinderGeometry(0.25, 0.35, 2.2, 12);
    const minaret = new THREE.Mesh(minaretGeo, brassMat);
    minaret.position.set(0.9, 1.1, 0.5);

    const domeGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const dome = new THREE.Mesh(domeGeo, goldMat);
    dome.position.set(0.9, 2.25, 0.5);

    iconGroup.add(houseBase, roof1, minaret, dome);
  } else {
    // === DEFAULT PROCEDURAL HERITAGE MONUMENT ===
    const baseGeo = new THREE.CylinderGeometry(0.9, 1.2, 0.5, 16);
    const base = new THREE.Mesh(baseGeo, stoneMat);
    base.position.y = 0.25;

    const pillarGeo = new THREE.BoxGeometry(0.6, 1.4, 0.6);
    const pillar = new THREE.Mesh(pillarGeo, brassMat);
    pillar.position.y = 1.1;

    const diamondGeo = new THREE.OctahedronGeometry(0.6);
    const diamond = new THREE.Mesh(diamondGeo, goldMat);
    diamond.position.y = 2.1;

    iconGroup.add(base, pillar, diamond);
  }

  root.add(iconGroup);

  // 4. BILLBOARD 2D SPRITE LABEL: Nama Situs & Jarak
  let labelTexture = createARMarkerLabelTexture(
    node.name,
    distanceText,
    node.type,
    node.type === NodeType.HERITAGE ? '#f59e0b' : node.type === NodeType.RELIGION ? '#10b981' : '#ec4899'
  );

  const spriteMat = new THREE.SpriteMaterial({
    map: labelTexture,
    transparent: true,
    depthTest: false,
  });

  const labelSprite = new THREE.Sprite(spriteMat);
  labelSprite.position.set(0, 3.8, 0);
  labelSprite.scale.set(3.4, 1.7, 1);
  root.add(labelSprite);

  let currentMatched = false;
  let currentDist = distanceText;

  const updateDistance = (newDistText: string) => {
    currentDist = newDistText;
    labelTexture.dispose();
    labelTexture = createARMarkerLabelTexture(
      node.name,
      newDistText,
      node.type,
      node.type === NodeType.HERITAGE ? '#f59e0b' : node.type === NodeType.RELIGION ? '#10b981' : '#ec4899',
      currentMatched
    );
    spriteMat.map = labelTexture;
    spriteMat.needsUpdate = true;
  };

  const setCoordinateMatched = (matched: boolean) => {
    if (currentMatched === matched) return;
    currentMatched = matched;

    if (matched) {
      beaconRing.material = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95,
      });
      beam.material = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      root.scale.set(1.2, 1.2, 1.2);
    } else {
      beaconRing.material = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      beam.material = cyanBeamMat;
      root.scale.set(1.0, 1.0, 1.0);
    }

    updateDistance(currentDist);
  };

  return {
    group: root,
    iconGroup,
    beaconRing,
    labelSprite,
    updateDistance,
    setCoordinateMatched,
    isCoordinateMatched: () => currentMatched,
  };
}
