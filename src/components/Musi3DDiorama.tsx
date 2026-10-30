/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Compass, 
  Sun, 
  Moon, 
  CloudRain, 
  Eye, 
  Maximize2, 
  RotateCcw, 
  Ship, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Layers, 
  Info,
  MapPin,
  ChevronRight,
  X
} from 'lucide-react';
import { musiAudio, MusiWeatherType } from '../services/musiAudioEngine';
import { motion, AnimatePresence } from 'motion/react';

interface Musi3DDioramaProps {
  onNodeSelect?: (nodeName: string) => void;
  onClose?: () => void;
}

type CameraPreset = 'isometric' | 'boat' | 'ampera' | 'kemaro' | 'siguntang';

export function Musi3DDiorama({ onNodeSelect, onClose }: Musi3DDioramaProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<MusiWeatherType>('senja');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('isometric');
  const [selectedLandmark, setSelectedLandmark] = useState<{
    name: string;
    description: string;
    significance: string;
    stcRole: string;
  } | null>(null);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [cruiseSpeed, setCruiseSpeed] = useState<number>(1);
  const [boatProgress, setBoatProgress] = useState<number>(0);

  // References for Three.js lifecycle
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const boatGroupRef = useRef<THREE.Group | null>(null);
  const lightsRef = useRef<{
    dirLight: THREE.DirectionalLight;
    ambientLight: THREE.AmbientLight;
    amperaLights: THREE.PointLight[];
  } | null>(null);

  // Raycaster for clicking landmarks
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  // Landmarks Data
  const LANDMARKS_DATA = {
    ampera: {
      name: 'Jembatan Ampera (Amanat Penderitaan Rakyat)',
      description: 'Ikon maritim agung Palembang yang membelah Ulu dan Ilir Sungai Musi. Dibangun pada 1962 dan sempat menjadi jembatan angkat terpanjang di Asia Tenggara.',
      significance: 'Simbol integrasi budaya dan denyut nadi perniagaan modern Sumatra Selatan.',
      stcRole: 'Pusat simpul monitoring gas & emisi pelayaran sungai pada modul STC CarbonPrint.'
    },
    kemaro: {
      name: 'Pulau Kemaro & Pagoda 9 Tingkat',
      description: 'Delta suci di tengah Sungai Musi yang tidak pernah tenggelam saat air pasang. Legenda cinta abadi Tan Bun An & Siti Fatimah menjadi saksi akulturasi Tionghoa-Melayu.',
      significance: 'Pusat ziarah Cap Go Meh terbesar di Sumatra dan simbol harmoni multietnis.',
      stcRole: 'Simpul validasi Proof-of-Visit SBT untuk peziarah dan pelancong budaya.'
    },
    siguntang: {
      name: 'Situs Bukit Siguntang (Genesis Node)',
      description: 'Bukit sakral setinggi 27 mdpl, titik kosmologis awal peradaban Kerajaan Maritim Sriwijaya abad ke-7 dengan temuan arca Buddha Mahayana abad ke-6.',
      significance: 'Akar silsilah raja-raja Melayu Nusantara dan pusat spiritualitas Sriwijaya.',
      stcRole: 'Genesis Node utama pencatatan silsilah dan provenance data budaya SIGUNTANG.'
    },
    ketek: {
      name: 'Perahu Ketek Tradisional Musi',
      description: 'Transportasi air tradisional khas Palembang bertenaga mesin tempel dengan suara khas "tek-tek-tek". Menghubungkan kampung-kampung terapung di sepanjang 750 km Sungai Musi.',
      significance: 'Warisan moda mobilitas kearifan lokal masyarakat sungai Sriwijaya.',
      stcRole: 'Unit pelacakan rute geospasial real-time dan perhitungan jejak karbon wisata.'
    }
  };

  // Sound toggle
  const toggleAudio = () => {
    if (!isAudioActive) {
      musiAudio.start();
      musiAudio.setWeather(timeOfDay);
      setIsAudioActive(true);
    } else {
      musiAudio.stop();
      setIsAudioActive(false);
    }
  };

  // Weather switch
  const handleTimeChange = (w: MusiWeatherType) => {
    setTimeOfDay(w);
    musiAudio.setWeather(w);

    if (!lightsRef.current || !sceneRef.current) return;
    const { dirLight, ambientLight, amperaLights } = lightsRef.current;

    if (w === 'senja') {
      sceneRef.current.background = new THREE.Color(0xf59e0b).lerp(new THREE.Color(0x7c2d12), 0.5);
      sceneRef.current.fog = new THREE.FogExp2(0xd97706, 0.015);
      dirLight.color.setHex(0xff7722);
      dirLight.intensity = 1.8;
      dirLight.position.set(40, 25, -20);
      ambientLight.color.setHex(0xffaa66);
      ambientLight.intensity = 0.8;
      amperaLights.forEach(l => { l.intensity = 2; l.color.setHex(0xff3333); });
    } else if (w === 'purnama') {
      sceneRef.current.background = new THREE.Color(0x060913);
      sceneRef.current.fog = new THREE.FogExp2(0x060913, 0.02);
      dirLight.color.setHex(0x38bdf8);
      dirLight.intensity = 0.4;
      dirLight.position.set(-20, 30, 20);
      ambientLight.color.setHex(0x1e293b);
      ambientLight.intensity = 0.3;
      amperaLights.forEach(l => { l.intensity = 5; l.color.setHex(0xff1122); });
    } else if (w === 'kabut') {
      sceneRef.current.background = new THREE.Color(0x94a3b8);
      sceneRef.current.fog = new THREE.FogExp2(0x94a3b8, 0.035);
      dirLight.color.setHex(0xf8fafc);
      dirLight.intensity = 1.0;
      ambientLight.color.setHex(0x64748b);
      ambientLight.intensity = 0.9;
      amperaLights.forEach(l => { l.intensity = 1.2; l.color.setHex(0xff8888); });
    } else { // hujan
      sceneRef.current.background = new THREE.Color(0x334155);
      sceneRef.current.fog = new THREE.FogExp2(0x334155, 0.03);
      dirLight.color.setHex(0x94a3b8);
      dirLight.intensity = 0.6;
      ambientLight.color.setHex(0x475569);
      ambientLight.intensity = 0.5;
      amperaLights.forEach(l => { l.intensity = 3; l.color.setHex(0xff2222); });
    }
  };

  // Camera presets
  const applyCameraPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    if (preset === 'isometric') {
      camera.position.set(45, 35, 45);
      controls.target.set(0, 0, 0);
    } else if (preset === 'ampera') {
      camera.position.set(-8, 12, 18);
      controls.target.set(-8, 6, 0);
    } else if (preset === 'kemaro') {
      camera.position.set(28, 14, -10);
      controls.target.set(24, 5, -8);
    } else if (preset === 'siguntang') {
      camera.position.set(-25, 12, -18);
      controls.target.set(-20, 4, -15);
    } else if (preset === 'boat') {
      if (boatGroupRef.current) {
        const bp = boatGroupRef.current.position;
        camera.position.set(bp.x - 6, bp.y + 4, bp.z + 6);
        controls.target.copy(bp);
      }
    }
    controls.update();
  };

  // Click on 3D objects
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (!cameraRef.current || !sceneRef.current) return;
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);

    if (intersects.length > 0) {
      // Cari nama objek yang memiliki userdata landmark
      for (const hit of intersects) {
        let obj: THREE.Object3D | null = hit.object;
        while (obj) {
          if (obj.userData?.landmark) {
            const key = obj.userData.landmark as keyof typeof LANDMARKS_DATA;
            if (LANDMARKS_DATA[key]) {
              setSelectedLandmark(LANDMARKS_DATA[key]);
              return;
            }
          }
          obj = obj.parent;
        }
      }
    }
  };

  // Three.js Mount Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xd97706); // Golden Senja default
    scene.fog = new THREE.FogExp2(0xd97706, 0.015);

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(45, 35, 45);
    cameraRef.current = camera;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 2. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera going below ground
    controls.minDistance = 10;
    controls.maxDistance = 120;
    controlsRef.current = controls;

    // 3. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffaa66, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xff7722, 1.8);
    dirLight.position.set(40, 25, -20);
    dirLight.castShadow = !isSoftwareGl;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 150;
    dirLight.shadow.camera.left = -40;
    dirLight.shadow.camera.right = 40;
    dirLight.shadow.camera.top = 40;
    dirLight.shadow.camera.bottom = -40;
    scene.add(dirLight);

    const amperaLights: THREE.PointLight[] = [];

    // 4. DIORAMA BASE / PLINTH (Floating Diorama Island)
    const baseGroup = new THREE.Group();
    scene.add(baseGroup);

    // Plinth Bottom Block (Tanah / Kerak Geologis Sriwijaya)
    const plinthGeo = new THREE.BoxGeometry(70, 6, 40);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x271e16,
      roughness: 0.9,
      metalness: 0.1
    });
    const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
    plinthMesh.position.y = -3;
    plinthMesh.receiveShadow = true;
    baseGroup.add(plinthMesh);

    // Riverbanks (Tepi Sungai Hulu & Hilir)
    // Bank 1: Seberang Ulu (Kiri)
    const bank1Geo = new THREE.BoxGeometry(18, 1.2, 38);
    const bankMat = new THREE.MeshStandardMaterial({
      color: 0x3d4f2b, // Rumput subur tepi sungai
      roughness: 0.85
    });
    const bank1 = new THREE.Mesh(bank1Geo, bankMat);
    bank1.position.set(-25, 0.6, 0);
    bank1.receiveShadow = true;
    baseGroup.add(bank1);

    // Bank 2: Seberang Ilir (Kanan)
    const bank2 = new THREE.Mesh(bank1Geo, bankMat);
    bank2.position.set(25, 0.6, 0);
    bank2.receiveShadow = true;
    baseGroup.add(bank2);

    // 5. RIVER WATER (Air Sungai Musi Bergelombang Dinamis)
    const waterGeo = new THREE.PlaneGeometry(36, 38, 48, 48);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x6e522e, // Cokelat keemasan khas air Musi kaya sedimen
      roughness: 0.2,
      metalness: 0.4,
      transparent: true,
      opacity: 0.92
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.set(0, 0.4, 0);
    waterMesh.receiveShadow = true;
    baseGroup.add(waterMesh);
    waterMeshRef.current = waterMesh;

    // Simpan posisi origin vertex air untuk gelombang
    const waterPositions = waterGeo.attributes.position.clone();
    (waterGeo as any).originalPositions = waterPositions;

    // 6. PROCEDURAL MODEL: JEMBATAN AMPERA 3D
    const amperaGroup = new THREE.Group();
    amperaGroup.position.set(-8, 0, 0);
    amperaGroup.userData = { landmark: 'ampera' };
    scene.add(amperaGroup);

    const redColor = 0xc0292b;
    const steelMat = new THREE.MeshStandardMaterial({ color: redColor, roughness: 0.4, metalness: 0.6 });
    const asphaltMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });

    // Road Deck (Lantai Jembatan)
    const deckGeo = new THREE.BoxGeometry(4, 0.6, 38);
    const deck = new THREE.Mesh(deckGeo, asphaltMat);
    deck.position.set(0, 5, 0);
    deck.castShadow = true;
    deck.receiveShadow = true;
    amperaGroup.add(deck);

    // Dua Menara Utama Ampera (Tower Ulu & Tower Ilir)
    [-7, 7].forEach(zPos => {
      const towerGroup = new THREE.Group();
      towerGroup.position.set(0, 0, zPos);

      // Kolom kiri & kanan menara
      [-1.4, 1.4].forEach(xPos => {
        const colGeo = new THREE.BoxGeometry(0.8, 14, 0.8);
        const col = new THREE.Mesh(colGeo, steelMat);
        col.position.set(xPos, 7, 0);
        col.castShadow = true;
        towerGroup.add(col);
      });

      // Balok palang atas
      const crossGeo = new THREE.BoxGeometry(3.6, 1.2, 0.8);
      const cross = new THREE.Mesh(crossGeo, steelMat);
      cross.position.set(0, 13.4, 0);
      cross.castShadow = true;
      towerGroup.add(cross);

      // Jam gadang mini / logo Ampera atas
      const topGeo = new THREE.BoxGeometry(1.4, 1.2, 0.9);
      const top = new THREE.Mesh(topGeo, steelMat);
      top.position.set(0, 14.6, 0);
      towerGroup.add(top);

      // Lampu Pendar Merah Ampera
      const amperaLight = new THREE.PointLight(0xff2222, 2.5, 18);
      amperaLight.position.set(0, 14, 0);
      towerGroup.add(amperaLight);
      amperaLights.push(amperaLight);

      amperaGroup.add(towerGroup);
    });

    // Kabel Suspensi Baja Ampera
    const cableMat = new THREE.LineBasicMaterial({ color: 0xdd4444, linewidth: 2 });
    const cablePoints: THREE.Vector3[] = [
      new THREE.Vector3(0, 5, -18),
      new THREE.Vector3(0, 14, -7),
      new THREE.Vector3(0, 6.5, 0),
      new THREE.Vector3(0, 14, 7),
      new THREE.Vector3(0, 5, 18)
    ];
    const cableGeo = new THREE.BufferGeometry().setFromPoints(cablePoints);
    const cableLine = new THREE.Line(cableGeo, cableMat);
    amperaGroup.add(cableLine);

    // 7. PROCEDURAL MODEL: PAGODA PULAU KEMARO 3D
    const kemaroGroup = new THREE.Group();
    kemaroGroup.position.set(16, 0, -8);
    kemaroGroup.userData = { landmark: 'kemaro' };
    scene.add(kemaroGroup);

    // Delta Pulau Kemaro (Pulau Pasir/Tanah Terapung di Tengah Air)
    const islandGeo = new THREE.CylinderGeometry(7, 8, 1.5, 12);
    const islandMat = new THREE.MeshStandardMaterial({ color: 0x475536, roughness: 0.9 });
    const island = new THREE.Mesh(islandGeo, islandMat);
    island.position.y = 0.75;
    island.receiveShadow = true;
    kemaroGroup.add(island);

    // Pagoda 9 Tingkat (Oktagonal Bertingkat)
    const pagodaMatRed = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.5 });
    const pagodaMatRoof = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.2 });

    const numTiers = 7;
    for (let i = 0; i < numTiers; i++) {
      const tierRadius = 2.4 - (i * 0.28);
      const tierHeight = 1.1;
      const yOffset = 1.5 + (i * 1.3);

      // Dinding Tingkat Pagoda
      const wallGeo = new THREE.CylinderGeometry(tierRadius * 0.85, tierRadius, tierHeight, 8);
      const wall = new THREE.Mesh(wallGeo, pagodaMatRed);
      wall.position.y = yOffset + tierHeight / 2;
      wall.castShadow = true;
      kemaroGroup.add(wall);

      // Atap Melengkung Khas Tionghoa
      const roofGeo = new THREE.ConeGeometry(tierRadius * 1.35, 0.6, 8);
      const roof = new THREE.Mesh(roofGeo, pagodaMatRoof);
      roof.position.y = yOffset + tierHeight + 0.3;
      roof.castShadow = true;
      kemaroGroup.add(roof);
    }

    // Pohon Cinta Pulau Kemaro
    const treeTrunkGeo = new THREE.CylinderGeometry(0.3, 0.5, 3.5, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 });
    const treeCrownGeo = new THREE.DodecahedronGeometry(2);
    const crownMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.6 }); // Bunga cinta pink/merah muda

    const treeGroup = new THREE.Group();
    treeGroup.position.set(-3.5, 1.5, 3.5);
    const trunk = new THREE.Mesh(treeTrunkGeo, trunkMat);
    trunk.position.y = 1.75;
    const crown = new THREE.Mesh(treeCrownGeo, crownMat);
    crown.position.y = 3.6;
    crown.castShadow = true;
    treeGroup.add(trunk, crown);
    kemaroGroup.add(treeGroup);

    // 8. PROCEDURAL MODEL: BUKIT SIGUNTANG MONOLITH & ARTIFACT (Genesis Node)
    const siguntangGroup = new THREE.Group();
    siguntangGroup.position.set(-25, 1.2, -10);
    siguntangGroup.userData = { landmark: 'siguntang' };
    scene.add(siguntangGroup);

    // Bukit bertingkat
    const hillGeo = new THREE.CylinderGeometry(5, 7, 3, 10);
    const hillMat = new THREE.MeshStandardMaterial({ color: 0x2d4420, roughness: 0.9 });
    const hill = new THREE.Mesh(hillGeo, hillMat);
    hill.position.y = 1.5;
    hill.receiveShadow = true;
    siguntangGroup.add(hill);

    // Prasasti Batu Berpendar Sriwijaya
    const stoneGeo = new THREE.BoxGeometry(1.2, 2.4, 0.8);
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.7 });
    const stone = new THREE.Mesh(stoneGeo, stoneMat);
    stone.position.set(0, 4.2, 0);
    stone.castShadow = true;
    siguntangGroup.add(stone);

    // Pendar Emas Aksara Pallawa di Batu
    const stoneLight = new THREE.PointLight(0xf59e0b, 1.8, 6);
    stoneLight.position.set(0, 4.2, 0.6);
    siguntangGroup.add(stoneLight);

    // 9. PROCEDURAL MODEL: PERAHU KETEK 3D TRADISIONAL (Hero Ship)
    const boatGroup = new THREE.Group();
    boatGroup.userData = { landmark: 'ketek' };
    scene.add(boatGroup);
    boatGroupRef.current = boatGroup;

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.7 });
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.8 });

    // Lambung Perahu (Hull)
    const hullGeo = new THREE.BoxGeometry(1.4, 0.8, 4.8);
    const hull = new THREE.Mesh(hullGeo, woodMat);
    hull.position.y = 0.4;
    hull.castShadow = true;
    boatGroup.add(hull);

    // Haluan Lancip Depan
    const bowGeo = new THREE.ConeGeometry(0.7, 1.4, 4);
    bowGeo.rotateX(-Math.PI / 2);
    const bow = new THREE.Mesh(bowGeo, woodMat);
    bow.position.set(0, 0.4, 2.9);
    bow.castShadow = true;
    boatGroup.add(bow);

    // Atap / Kanopi Perahu Ketek
    const roofCurveGeo = new THREE.CylinderGeometry(0.85, 0.85, 2.6, 8, 1, false, 0, Math.PI);
    roofCurveGeo.rotateZ(Math.PI / 2);
    const boatRoof = new THREE.Mesh(roofCurveGeo, canopyMat);
    boatRoof.position.set(0, 1.3, -0.2);
    boatRoof.castShadow = true;
    boatGroup.add(boatRoof);

    // Tiang Penyangga Atap
    [-0.55, 0.55].forEach(x => {
      [-1.1, 1.1].forEach(z => {
        const postGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8);
        const post = new THREE.Mesh(postGeo, woodMat);
        post.position.set(x, 1.0, z);
        boatGroup.add(post);
      });
    });

    // Lampu Lentera Teplok di Haluan Perahu
    const lanternGeo = new THREE.DodecahedronGeometry(0.18);
    const lanternMat = new THREE.MeshBasicMaterial({ color: 0xffe066 });
    const lantern = new THREE.Mesh(lanternGeo, lanternMat);
    lantern.position.set(0, 0.9, 2.4);
    boatGroup.add(lantern);

    const lanternLight = new THREE.PointLight(0xffaa22, 2.0, 8);
    lanternLight.position.set(0, 0.9, 2.4);
    boatGroup.add(lanternLight);

    // Pohon-pohon Palm & Nipah di Sekitar Tepi Sungai
    const palmMat = new THREE.MeshStandardMaterial({ color: 0x1e3a1e, roughness: 0.8 });
    const createPalmTree = (x: number, z: number) => {
      const palm = new THREE.Group();
      palm.position.set(x, 1.2, z);

      const pTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.25, 2.8, 5), trunkMat);
      pTrunk.position.y = 1.4;
      pTrunk.castShadow = true;

      const pCrown = new THREE.Mesh(new THREE.ConeGeometry(1.6, 2.2, 5), palmMat);
      pCrown.position.y = 3.0;
      pCrown.castShadow = true;

      palm.add(pTrunk, pCrown);
      scene.add(palm);
    };

    [
      [-28, 8], [-23, 14], [-26, -4], [-30, -14],
      [27, 10], [24, -12], [28, 4], [23, 15]
    ].forEach(([x, z]) => createPalmTree(x, z));

    lightsRef.current = { dirLight, ambientLight, amperaLights };

    // 10. ANIMATION LOOP (Waves, Boat Navigation, Day/Night Shimmer)
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Animasi Ombak Air Sungai Musi
      if (waterMeshRef.current) {
        const geo = waterMeshRef.current.geometry;
        const posAttr = geo.attributes.position;
        const orig = (geo as any).originalPositions;

        for (let i = 0; i < posAttr.count; i++) {
          const u = orig.getX(i);
          const v = orig.getY(i);
          // Wave equation gabungan 2 frekuensi
          const waveZ = Math.sin(u * 0.4 + elapsed * 2.2) * 0.18 + Math.cos(v * 0.3 + elapsed * 1.5) * 0.14;
          posAttr.setZ(i, waveZ);
        }
        posAttr.needsUpdate = true;
      }

      // Animasi Pelayaran Perahu Ketek Menyusuri Sungai Musi
      if (boatGroupRef.current) {
        const t = (elapsed * 0.12 * cruiseSpeed) % 1;
        setBoatProgress(t);

        // Lintasan kurva Sungai Musi (dari z = -16 ke z = +16)
        const zPos = -15 + t * 30;
        const xPos = Math.sin(t * Math.PI * 2) * 3.5; // Mengarungi kelokan sungai

        boatGroupRef.current.position.set(xPos, 0.45, zPos);
        // Gerakan mengapung & oleng pelan perahu (pitch & roll)
        boatGroupRef.current.rotation.y = Math.sin(t * Math.PI * 2) * 0.25;
        boatGroupRef.current.rotation.z = Math.sin(elapsed * 3.5) * 0.05;
        boatGroupRef.current.rotation.x = Math.cos(elapsed * 2.8) * 0.04;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 11. Handle Resize
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [cruiseSpeed]);

  return (
    <div className="relative w-full h-[520px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30 bg-[#0d1117] select-none">
      {/* Three.js Canvas Container */}
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onClick={handleCanvasClick as any}
      />

      {/* Top Floating Header & Controls */}
      <div className="absolute top-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
        <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 pointer-events-auto">
          <div className="p-2 bg-[#8b0000]/30 border border-[#8b0000]/50 rounded-xl text-[#ff5252]">
            <Compass size={18} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] text-[#ff5252] font-bold tracking-widest uppercase">
                3D WEBGL ENGINE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white leading-tight">
              Diorama Musi 3D Spatial
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Audio toggle */}
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              isAudioActive 
                ? 'bg-[#8b0000] border-[#ff5252] text-white shadow-lg shadow-[#8b0000]/30' 
                : 'bg-black/60 border-white/10 text-white/70 hover:bg-black/80'
            }`}
            title="Audio Gemercik Air Musi"
          >
            {isAudioActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Reset View */}
          <button
            onClick={() => applyCameraPreset('isometric')}
            className="p-3 bg-black/60 border border-white/10 hover:bg-black/80 text-white/80 hover:text-white rounded-2xl transition-all cursor-pointer"
            title="Kembalikan Sudut Pandang"
          >
            <RotateCcw size={16} />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-3 bg-black/60 border border-white/10 hover:bg-black/80 text-white/80 hover:text-white rounded-2xl transition-all cursor-pointer"
              title="Tutup Mode 3D"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Floating Bottom Left: Time of Day Selector */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 z-10">
        {[
          { key: 'senja', label: 'Senja', icon: Sun },
          { key: 'purnama', label: 'Purnama Ampera', icon: Moon },
          { key: 'kabut', label: 'Kabut Pagi', icon: CloudRain },
        ].map(item => (
          <button
            key={item.key}
            onClick={() => handleTimeChange(item.key as MusiWeatherType)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-[10px] uppercase font-bold transition-all cursor-pointer ${
              timeOfDay === item.key 
                ? 'bg-[#8b0000] text-white shadow-md shadow-[#8b0000]/30' 
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <item.icon size={12} />
            {item.label}
          </button>
        ))}
      </div>

      {/* Floating Bottom Right: Camera Landmark Presets */}
      <div className="absolute bottom-6 right-6 hidden sm:flex items-center gap-2 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 z-10">
        <span className="font-mono text-[9px] text-white/40 uppercase pl-2 pr-1">Fokus 3D:</span>
        {[
          { key: 'isometric', label: 'Overview' },
          { key: 'boat', label: 'Perahu Ketek' },
          { key: 'ampera', label: 'Ampera' },
          { key: 'kemaro', label: 'Kemaro' },
          { key: 'siguntang', label: 'Siguntang' }
        ].map(preset => (
          <button
            key={preset.key}
            onClick={() => applyCameraPreset(preset.key as CameraPreset)}
            className={`px-3 py-1.5 rounded-xl font-mono text-[10px] uppercase font-semibold transition-all cursor-pointer ${
              cameraPreset === preset.key 
                ? 'bg-white text-black font-bold' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Interactive Landmark Detail Modal/Drawer (When clicking on 3D objects) */}
      <AnimatePresence>
        {selectedLandmark && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="absolute top-24 left-6 right-6 sm:left-auto sm:right-6 sm:w-96 bg-[#141414]/95 backdrop-blur-xl p-6 rounded-3xl border border-white/15 text-white shadow-2xl z-20"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="font-mono text-[9px] text-[#ff5252] font-bold uppercase tracking-wider block mb-1">
                  LANDMARK TERSOROT
                </span>
                <h4 className="font-serif text-xl font-bold leading-tight">
                  {selectedLandmark.name}
                </h4>
              </div>
              <button 
                onClick={() => setSelectedLandmark(null)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-white/70 leading-relaxed mb-4">
              {selectedLandmark.description}
            </p>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 mb-4 space-y-2 text-xs">
              <div>
                <span className="font-mono text-[10px] text-white/40 uppercase block">Konteks Budaya:</span>
                <p className="text-white/80 font-medium">{selectedLandmark.significance}</p>
              </div>
              <div className="pt-2 border-t border-white/10">
                <span className="font-mono text-[10px] text-amber-300 uppercase block">Peran pada STC Trust Layer:</span>
                <p className="text-amber-200/90 font-mono text-[11px]">{selectedLandmark.stcRole}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (onNodeSelect) onNodeSelect(selectedLandmark.name);
                  setSelectedLandmark(null);
                }}
                className="w-full py-2.5 px-4 bg-[#8b0000] hover:bg-[#a50000] text-white font-mono text-[10px] uppercase font-bold tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#8b0000]/30"
              >
                Eksplorasi Simpul Ini
                <ChevronRight size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Hint Banner */}
      <div className="absolute top-20 left-6 hidden md:flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full border border-white/5 text-[10px] text-white/50 pointer-events-none">
        <Sparkles size={11} className="text-amber-300" />
        <span>Tarik mouse untuk rotasi 360° • Scroll untuk zoom • Klik objek 3D untuk info</span>
      </div>
    </div>
  );
}
