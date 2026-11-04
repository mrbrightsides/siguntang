/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  X,
  Compass,
  MapPin,
  RefreshCw,
  Sparkles,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Shield,
  Layers,
  ChevronRight,
  Eye,
  Check,
  Download,
  Share2,
  Sliders,
  Navigation,
  Smartphone,
  Info,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  CheckCircle2,
  Target,
  Locate,
  LocateFixed,
  ArrowUp,
  ArrowUpRight,
  Crosshair,
  SlidersHorizontal,
  Activity
} from 'lucide-react';
import { PALEMBANG_NODES } from '../constants';
import { UniversalNode } from '../types';
import {
  calculateDistanceMeters,
  calculateBearingDegrees,
  formatDistance,
  bearingToCardinal,
  getRelativeAngle,
  PALEMBANG_CENTER,
  SIGUNTANG_SUMMIT,
  GeoCoordinate,
  AMPERA_MARKER_SAMPLE_DATA,
  isAmperaCoordinateMatch,
  findNearestHeritageSite,
  getSiteCalibrationStatus,
  getRelativeDirectionText,
  NearestSiteResult,
  CalibrationStatus
} from '../services/arGeoMath';
import { buildHeritage3DMarker } from '../services/arMarkerFactory';
import { musiAudio } from '../services/musiAudioEngine';

interface ARHeritageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNode?: UniversalNode | null;
  onSelectNodeDetail?: (node: UniversalNode) => void;
  onOpenMintSBT?: (node: UniversalNode) => void;
}

type CameraStatus = 'initializing' | 'active' | 'denied' | 'unsupported' | 'simulated';

/**
 * Representasi Objek Browser Lokal untuk Foto Hasil Snapshot AR
 */
export interface LocalBrowserSnapshot {
  id: string;
  objectUrl: string; // URL.createObjectURL(blob)
  file: File;        // Browser File object untuk native Web Share API
  blob: Blob;        // Browser Blob object
  dataUrl: string;
  timestamp: Date;
  siteName: string;
  coordinates: GeoCoordinate;
  isCoordinateMatched: boolean;
}

export function ARHeritageViewerModal({
  isOpen,
  onClose,
  initialNode,
  onSelectNodeDetail,
  onOpenMintSBT,
}: ARHeritageViewerModalProps) {
  // DOM Refs
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const markersRef = useRef<Map<string, {
    group: THREE.Group;
    iconGroup: THREE.Group;
    beaconRing: THREE.Mesh;
    labelSprite: THREE.Sprite;
    node: UniversalNode;
    bearing: number;
    distance: number;
    updateDistance: (d: string) => void;
    setCoordinateMatched: (m: boolean) => void;
    isCoordinateMatched: () => boolean;
  }>>(new Map());

  // Camera stream & status
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('initializing');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraErrorMsg, setCameraErrorMsg] = useState<string | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Geolocation & Heading State
  const [useSimulatedGPS, setUseSimulatedGPS] = useState<boolean>(true);
  const [currentCoord, setCurrentCoord] = useState<GeoCoordinate>(AMPERA_MARKER_SAMPLE_DATA.coordinates);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [pitchAngle, setPitchAngle] = useState<number>(0);
  const [deviceOrientationActive, setDeviceOrientationActive] = useState<boolean>(false);
  const [needsOrientationPermission, setNeedsOrientationPermission] = useState<boolean>(false);

  // Drag interaction fallback (for touch / mouse look)
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const manualHeadingOffsetRef = useRef<number>(0);
  const manualPitchOffsetRef = useRef<number>(0);

  // Selection & UI State
  const [selectedMarkerNode, setSelectedMarkerNode] = useState<UniversalNode | null>(initialNode || null);
  const [isSnapshotLoading, setIsSnapshotLoading] = useState<boolean>(false);
  const [snapshotSuccess, setSnapshotSuccess] = useState<string | null>(null);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState<boolean>(false);

  // Ampera Sample Data Inspection Modal
  const [isAmperaDataModalOpen, setIsAmperaDataModalOpen] = useState<boolean>(false);

  // Local Browser Snapshot Objects & Sharing Modal
  const [savedSnapshots, setSavedSnapshots] = useState<LocalBrowserSnapshot[]>([]);
  const [activeSnapshotForShare, setActiveSnapshotForShare] = useState<LocalBrowserSnapshot | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Ampera Coordinate Matching Status
  const amperaMatchStatus = isAmperaCoordinateMatch(currentCoord);
  const isAmperaMatched = amperaMatchStatus.isMatch;

  // Sync selected node with initialNode prop
  useEffect(() => {
    if (initialNode) {
      setSelectedMarkerNode(initialNode);
    }
  }, [initialNode]);

  // Clean up object URLs on unmount to prevent browser memory leaks
  useEffect(() => {
    return () => {
      savedSnapshots.forEach((snap) => {
        URL.revokeObjectURL(snap.objectUrl);
      });
    };
  }, [savedSnapshots]);

  // Raycaster for 3D marker touch/click
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseVecRef = useRef<THREE.Vector2>(new THREE.Vector2());

  // Detect Software WebGL
  const isSoftwareGl = (() => {
    try {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch {
      return false;
    }
  })();

  // 1. Inisialisasi Kamera Real Browser (getUserMedia)
  const startCamera = useCallback(async (mode: 'environment' | 'user') => {
    setCameraStatus('initializing');
    setCameraErrorMsg(null);

    // Hentikan stream aktif jika ada
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraStatus('unsupported');
      setCameraErrorMsg('Browser tidak mendukung akses kamera langsung (getUserMedia). Mode Simulasi 360° diaktifkan.');
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((err) => console.warn('Video play error:', err));
        };
      }

      setCameraStatus('active');
    } catch (err: any) {
      console.warn('Camera access denied or failed:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraStatus('denied');
        setCameraErrorMsg('Izin akses kamera belum diberikan. Anda dapat mencoba lagi atau menggunakan Mode Simulasi 360°.');
      } else {
        setCameraStatus('simulated');
        setCameraErrorMsg('Kamera fisik tidak tersedia di perangkat ini. Mode Simulasi 360° diaktifkan otomatis.');
      }
    }
  }, []);

  // 2. Setup Device Orientation (Sensor Kompas & Gyroscope HP)
  useEffect(() => {
    if (!isOpen) return;

    // Cek iOS 13+ permission requirement
    if (
      typeof window !== 'undefined' &&
      typeof (DeviceOrientationEvent as any)?.requestPermission === 'function'
    ) {
      setNeedsOrientationPermission(true);
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // Prioritaskan compass heading mutlak jika ada (webkitCompassHeading pada iOS)
      let heading = 0;
      if ((event as any).webkitCompassHeading !== undefined) {
        heading = (event as any).webkitCompassHeading;
      } else if (event.alpha !== null) {
        heading = (360 - event.alpha) % 360;
      }

      // Pitch (kemiringan atas-bawah ponsel)
      const pitch = event.beta !== null ? event.beta - 90 : 0; // 0 saat ponsel tegak horizontal

      setCompassHeading(Math.round(heading));
      setPitchAngle(Math.round(pitch));
      setDeviceOrientationActive(true);
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [isOpen]);

  // Request iOS Gyro Permission
  const requestIOSOrientation = async () => {
    try {
      if (typeof (DeviceOrientationEvent as any)?.requestPermission === 'function') {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setNeedsOrientationPermission(false);
          setDeviceOrientationActive(true);
        }
      }
    } catch (err) {
      console.warn('Orientation permission error:', err);
    }
  };

  // 3. Real GPS Watcher
  useEffect(() => {
    if (!isOpen || useSimulatedGPS) return;

    if (!('geolocation' in navigator)) {
      setUseSimulatedGPS(true);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setCurrentCoord({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn('GPS location error:', err);
        setUseSimulatedGPS(true);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isOpen, useSimulatedGPS]);

  // 4. Inisialisasi Three.js WebGL Engine Overlay
  useEffect(() => {
    if (!isOpen || !canvasMountRef.current) return;

    const mount = canvasMountRef.current;
    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    // Create Scene with transparent background
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Perspective Camera matching mobile FOV (65 deg)
    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0);
    cameraRef.current = camera;

    // WebGL Renderer with Alpha transparency
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true, // Diperlukan untuk fitur screenshot/snapshot foto AR
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'auto';

    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3-Point Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    const dirLight1 = new THREE.DirectionalLight(0xfef08a, 2.0); // Warm sunlight
    dirLight1.position.set(5, 12, 7);
    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.0); // Cool sky reflection
    dirLight2.position.set(-7, -4, -5);
    scene.add(ambientLight, dirLight1, dirLight2);

    // Build 3D Markers for each Palembang Heritage Node
    const markersMap = new Map();
    const origin = currentCoord;

    PALEMBANG_NODES.forEach((node) => {
      const distMeters = calculateDistanceMeters(origin, node.location);
      const bearing = calculateBearingDegrees(origin, node.location);
      const distText = formatDistance(distMeters);

      const markerObj = buildHeritage3DMarker(node, distText);

      // Posisi 3D pada lingkaran bola AR
      const radBearing = (bearing * Math.PI) / 180;
      const visualRadius = Math.max(16, Math.min(32, 16 + Math.log10(Math.max(10, distMeters)) * 4));

      const x = visualRadius * Math.sin(radBearing);
      const z = -visualRadius * Math.cos(radBearing);
      const y = -0.5 + (Math.sin(radBearing * 3) * 0.4);

      markerObj.group.position.set(x, y, z);

      // Jika node adalah Ampera dan koordinat cocok, aktifkan state virtual overlay
      if (node.id === 'node-ampera') {
        const isMatch = isAmperaCoordinateMatch(origin).isMatch;
        markerObj.setCoordinateMatched(isMatch);
      }

      scene.add(markerObj.group);

      markersMap.set(node.id, {
        ...markerObj,
        node,
        bearing,
        distance: distMeters,
      });
    });

    markersRef.current = markersMap;

    // Continuous Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Animasi subtle floating & pulse pada marker
      markersMap.forEach(({ iconGroup, beaconRing, labelSprite, node, isCoordinateMatched }) => {
        const isMatched = isCoordinateMatched();

        // Slow continuous rotation
        iconGroup.rotation.y = elapsed * (isMatched ? 0.6 : 0.4);
        iconGroup.position.y = 1.0 + Math.sin(elapsed * 2 + iconGroup.id) * 0.15;

        // Animate Ampera halo if present
        const halo = iconGroup.getObjectByName('AMPERA_HALO');
        if (halo) {
          halo.rotation.z = elapsed * 1.2;
          halo.scale.setScalar(1.0 + Math.sin(elapsed * 4) * 0.1);
        }

        // Pulse ground beacon ring
        beaconRing.scale.setScalar(1.0 + Math.sin(elapsed * (isMatched ? 4.5 : 3)) * 0.15);

        // Always face label towards the camera
        labelSprite.lookAt(camera.position);
      });

      // Update camera orientation from Heading & Pitch + manual drag
      const totalHeading = (compassHeading + manualHeadingOffsetRef.current) % 360;
      const totalPitch = Math.max(-80, Math.min(80, pitchAngle + manualPitchOffsetRef.current));

      const radYaw = (-totalHeading * Math.PI) / 180;
      const radPitch = (-totalPitch * Math.PI) / 180;

      camera.rotation.order = 'YXZ';
      camera.rotation.y = radYaw;
      camera.rotation.x = radPitch;
      camera.rotation.z = 0;

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!canvasMountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = canvasMountRef.current.clientWidth;
      const h = canvasMountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      markersMap.forEach(({ group }) => {
        scene.remove(group);
      });
      markersMap.clear();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [isOpen, isSoftwareGl, currentCoord]);

  // Recalculate distances, positions, and coordinate match when location changes
  useEffect(() => {
    if (!markersRef.current.size) return;
    const origin = currentCoord;
    const amperaMatch = isAmperaCoordinateMatch(origin);

    markersRef.current.forEach((markerData) => {
      const distMeters = calculateDistanceMeters(origin, markerData.node.location);
      const bearing = calculateBearingDegrees(origin, markerData.node.location);
      const distText = formatDistance(distMeters);

      markerData.distance = distMeters;
      markerData.bearing = bearing;
      markerData.updateDistance(distText);

      // Reposition in 3D circle
      const radBearing = (bearing * Math.PI) / 180;
      const visualRadius = Math.max(16, Math.min(32, 16 + Math.log10(Math.max(10, distMeters)) * 4));
      const x = visualRadius * Math.sin(radBearing);
      const z = -visualRadius * Math.cos(radBearing);
      markerData.group.position.x = x;
      markerData.group.position.z = z;

      // Update Ampera coordinate match state
      if (markerData.node.id === 'node-ampera') {
        markerData.setCoordinateMatched(amperaMatch.isMatch);
      }
    });
  }, [currentCoord]);

  // Start Camera when Modal Opens
  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    }
  }, [isOpen, facingMode, startCamera]);

  // Flip Camera
  const handleFlipCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Pointer / Touch Dragging Handler untuk rotasi 360° (Gyroscope fallback)
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    manualHeadingOffsetRef.current = (manualHeadingOffsetRef.current - deltaX * 0.35) % 360;
    manualPitchOffsetRef.current = Math.max(-75, Math.min(75, manualPitchOffsetRef.current + deltaY * 0.25));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;

    if (!canvasMountRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = canvasMountRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    mouseVecRef.current.set(x, y);
    raycasterRef.current.setFromCamera(mouseVecRef.current, cameraRef.current);

    const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);

    for (const hit of intersects) {
      let cur: THREE.Object3D | null = hit.object;
      while (cur) {
        if (cur.userData?.isARMarker && cur.userData?.node) {
          setSelectedMarkerNode(cur.userData.node);
          musiAudio.playArrivalChime(520);
          return;
        }
        cur = cur.parent;
      }
    }
  };

  // Align Camera to Face Selected Site
  const handleFocusSite = (node: UniversalNode) => {
    setSelectedMarkerNode(node);
    const marker = markersRef.current.get(node.id);
    if (!marker) return;

    const targetHeading = marker.bearing;
    manualHeadingOffsetRef.current = targetHeading - compassHeading;
    manualPitchOffsetRef.current = 0;
    musiAudio.playArrivalChime(480);
  };

  // Set Simulated Location to Exact Ampera Coordinates
  const handleSetExactAmperaLocation = () => {
    setUseSimulatedGPS(true);
    setCurrentCoord(AMPERA_MARKER_SAMPLE_DATA.coordinates);
    const amperaNode = PALEMBANG_NODES.find((n) => n.id === 'node-ampera');
    if (amperaNode) {
      handleFocusSite(amperaNode);
    }
    musiAudio.playArrivalChime(640);
  };

  // Set Location away from Ampera to demonstrate distance/non-match
  const handleSetFarLocation = () => {
    setUseSimulatedGPS(true);
    // 3.5 km away from Ampera
    setCurrentCoord({ lat: -3.0200, lng: 104.7900 });
  };

  // Calibration Toast Notification
  const [calibrationToast, setCalibrationToast] = useState<string | null>(null);

  // Calibrate user coordinates to exact location of any selected node (Sets distance to 0m)
  const handleCalibrateToSite = (node: UniversalNode) => {
    setUseSimulatedGPS(true);
    setCurrentCoord({
      lat: node.location.lat,
      lng: node.location.lng,
    });
    handleFocusSite(node);
    musiAudio.playArrivalChime(640);
    setCalibrationToast(`Koordinat berhasil dikalibrasi ke ${node.name.split('(')[0].trim()} (Jarak: 0m • Kalibrasi Presisi)`);
    setTimeout(() => setCalibrationToast(null), 3500);
  };

  // Fine tune distance relative to selected site (e.g. +50m or -50m)
  const handleFineTuneDistance = (deltaMeters: number) => {
    if (!selectedMarkerNode) return;
    const target = selectedMarkerNode.location;
    const currentDist = calculateDistanceMeters(currentCoord, target);
    
    let newDist = currentDist + deltaMeters;
    if (newDist < 0) newDist = 0;

    if (currentDist < 1) {
      const degOffset = newDist / 111320;
      setCurrentCoord({
        lat: target.lat + degOffset,
        lng: target.lng,
      });
    } else {
      const ratio = newDist / currentDist;
      const newLat = target.lat + (currentCoord.lat - target.lat) * ratio;
      const newLng = target.lng + (currentCoord.lng - target.lng) * ratio;
      setCurrentCoord({ lat: newLat, lng: newLng });
    }

    setCalibrationToast(`Jarak disesuaikan menjadi ${Math.round(newDist)} meter (${deltaMeters > 0 ? '+50m' : '-50m'})`);
    setTimeout(() => setCalibrationToast(null), 3000);
  };

  // Re-sync with real device GPS hardware
  const handleSyncRealGPS = () => {
    if (!navigator.geolocation) {
      setCalibrationToast('Perangkat tidak mendukung sensor GPS.');
      setTimeout(() => setCalibrationToast(null), 3000);
      return;
    }

    setCalibrationToast('Membaca sensor GPS perangkat...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUseSimulatedGPS(false);
        setCurrentCoord({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setCalibrationToast(`GPS Asli Terkunci: ±${Math.round(pos.coords.accuracy || 10)}m akurasi.`);
        setTimeout(() => setCalibrationToast(null), 3500);
      },
      (err) => {
        setCalibrationToast(`Gagal membaca GPS: ${err.message}. Tetap di koordinat kalibrasi.`);
        setTimeout(() => setCalibrationToast(null), 3500);
      },
      { enableHighAccuracy: true, timeout: 7000 }
    );
  };

  // =========================================================================
  // CAPTURE SNAPSHOT FEATURE (Saves photo as a Local Browser Object for sharing)
  // =========================================================================
  const handleCaptureARSnapshot = async () => {
    if (isSnapshotLoading) return;
    setIsSnapshotLoading(true);

    try {
      const snapCanvas = document.createElement('canvas');
      const w = 1280;
      const h = 720;
      snapCanvas.width = w;
      snapCanvas.height = h;
      const ctx = snapCanvas.getContext('2d')!;

      // 1. Draw video feed jika kamera aktif, atau gradien langit Musi jika simulasi
      if (cameraStatus === 'active' && videoRef.current && videoRef.current.readyState >= 2) {
        ctx.drawImage(videoRef.current, 0, 0, w, h);
      } else {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#1c1917');
        bgGrad.addColorStop(0.5, '#78350f');
        bgGrad.addColorStop(0.7, '#451a03');
        bgGrad.addColorStop(1, '#0c0a09');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // 2. Draw Three.js WebGL overlay
      if (rendererRef.current) {
        ctx.drawImage(rendererRef.current.domElement, 0, 0, w, h);
      }

      // 3. Stempel Watermark Budaya Eksklusif SIGUNTANG AR
      ctx.save();
      ctx.fillStyle = 'rgba(10, 8, 6, 0.78)';
      ctx.fillRect(0, h - 90, w, 90);

      // Border aksen emas / hijau jika cocok
      ctx.fillStyle = isAmperaMatched ? '#10b981' : '#f59e0b';
      ctx.fillRect(0, h - 93, w, 3);

      // Logo Text SIGUNTANG AR
      ctx.font = 'bold 22px serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('SIGUNTANG • Cagar Budaya AR Camera', 30, h - 52);

      ctx.font = '13px monospace';
      ctx.fillStyle = isAmperaMatched ? '#6ee7b7' : '#fde68a';
      const locText = isAmperaMatched
        ? `📍 AMPERA BRIDGE COORDINATES MATCHED (Lat: ${currentCoord.lat.toFixed(4)}, Lng: ${currentCoord.lng.toFixed(4)})`
        : `GPS: Lat ${currentCoord.lat.toFixed(4)}, Lng ${currentCoord.lng.toFixed(4)}`;
      ctx.fillText(`${locText} • Heading: ${activeHeading}°`, 30, h - 25);

      // Stempel Kanan
      ctx.textAlign = 'right';
      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = isAmperaMatched ? '#10b981' : '#f59e0b';
      ctx.fillText(
        isAmperaMatched ? '✓ AMPERA 3D VIRTUAL OVERLAY VERIFIED' : 'STC DIGITAL PROVENANCE VERIFIED',
        w - 30,
        h - 52
      );

      ctx.font = '11px monospace';
      ctx.fillStyle = '#a8a29e';
      ctx.fillText(new Date().toLocaleString('id-ID'), w - 30, h - 25);
      ctx.restore();

      // 4. GENERATE LOCAL BROWSER OBJECTS (Blob & File Object)
      const blob = await new Promise<Blob>((resolve, reject) => {
        snapCanvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error('Canvas toBlob failed'));
          },
          'image/jpeg',
          0.92
        );
      });

      const filename = `SIGUNTANG-AR-${selectedMarkerNode?.name.split('(')[0].trim().replace(/\s+/g, '_') || 'Ampera'}-${Date.now()}.jpg`;
      const fileObject = new File([blob], filename, { type: 'image/jpeg' });
      const objectUrl = URL.createObjectURL(blob);
      const dataUrl = snapCanvas.toDataURL('image/jpeg', 0.92);

      // Simpan sebagai objek browser lokal ke state
      const newSnapshot: LocalBrowserSnapshot = {
        id: `snap-${Date.now()}`,
        objectUrl,
        file: fileObject,
        blob,
        dataUrl,
        timestamp: new Date(),
        siteName: selectedMarkerNode?.name || 'Jembatan Ampera',
        coordinates: currentCoord,
        isCoordinateMatched: isAmperaMatched,
      };

      setSavedSnapshots((prev) => [newSnapshot, ...prev]);
      setActiveSnapshotForShare(newSnapshot);

      // Play audio shutter
      musiAudio.playSplash(1.5);

      setSnapshotSuccess('Foto AR disimpan sebagai objek browser lokal! Siap dibagikan.');
      setTimeout(() => setSnapshotSuccess(null), 4000);
    } catch (e) {
      console.warn('Snapshot error:', e);
    } finally {
      setIsSnapshotLoading(false);
    }
  };

  // Web Share API Handler menggunakan Browser File Object
  const handleNativeShare = async (snapshot: LocalBrowserSnapshot) => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        if (navigator.canShare && navigator.canShare({ files: [snapshot.file] })) {
          await navigator.share({
            files: [snapshot.file],
            title: `SIGUNTANG AR: ${snapshot.siteName}`,
            text: `Lihat foto AR Cagar Budaya ${snapshot.siteName} dengan penanda 3D di SIGUNTANG!`,
          });
        } else {
          await navigator.share({
            title: `SIGUNTANG AR: ${snapshot.siteName}`,
            text: `Foto AR Cagar Budaya ${snapshot.siteName} - SIGUNTANG Nusantara Gemilang`,
            url: window.location.href,
          });
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('Web Share API error:', err);
        }
      }
    } else {
      // Fallback copy object link
      handleCopyObjectUrl(snapshot.objectUrl);
    }
  };

  // Salin Link Objek Browser (Blob URL)
  const handleCopyObjectUrl = (url: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopyFeedback('Link objek lokal browser (Blob URL) disalin!');
      setTimeout(() => setCopyFeedback(null), 3000);
    }
  };

  // Salin Gambar Langsung ke Clipboard
  const handleCopyImageToClipboard = async (snapshot: LocalBrowserSnapshot) => {
    try {
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard) {
        // Clipboard API memerlukan image/png
        const img = new Image();
        img.src = snapshot.dataUrl;
        await new Promise((r) => (img.onload = r));
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        const cx = c.getContext('2d')!;
        cx.drawImage(img, 0, 0);
        c.toBlob(async (pngBlob) => {
          if (pngBlob) {
            await navigator.clipboard.write([
              new ClipboardItem({
                'image/png': pngBlob,
              }),
            ]);
            setCopyFeedback('Gambar berhasil disalin ke clipboard!');
            setTimeout(() => setCopyFeedback(null), 3000);
          }
        }, 'image/png');
      }
    } catch (err) {
      console.warn('Clipboard image write error:', err);
      handleCopyObjectUrl(snapshot.objectUrl);
    }
  };

  if (!isOpen) return null;

  const activeHeading = Math.round((compassHeading + manualHeadingOffsetRef.current + 360) % 360);
  const activePitch = Math.round(pitchAngle + manualPitchOffsetRef.current);

  // 1. Situs Cagar Budaya Palembang Terdekat & Arah Relatif Kompas Kamera
  const nearestSite = useMemo(() => {
    return findNearestHeritageSite(currentCoord, PALEMBANG_NODES, activeHeading);
  }, [currentCoord, activeHeading]);

  // 2. Indikator Jarak Eksak & Telemetri Kalibrasi Spasial untuk Marker Terpilih
  const selectedDistanceMeters = useMemo(() => {
    if (!selectedMarkerNode) return null;
    return calculateDistanceMeters(currentCoord, selectedMarkerNode.location);
  }, [currentCoord, selectedMarkerNode]);

  const selectedBearing = useMemo(() => {
    if (!selectedMarkerNode) return null;
    return calculateBearingDegrees(currentCoord, selectedMarkerNode.location);
  }, [currentCoord, selectedMarkerNode]);

  const selectedRelativeAngle = useMemo(() => {
    if (selectedBearing === null) return null;
    return getRelativeAngle(selectedBearing, activeHeading);
  }, [selectedBearing, activeHeading]);

  const selectedCalibration = useMemo(() => {
    if (selectedDistanceMeters === null) return null;
    return getSiteCalibrationStatus(selectedDistanceMeters, 350);
  }, [selectedDistanceMeters]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[7000] bg-black flex flex-col overflow-hidden select-none touch-none">
        {/* 1. CAMERA VIDEO STREAM (Background Layer) */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 pointer-events-none ${
            cameraStatus === 'active' ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* 2. SIMULATED CAMERA 360° SKYLINE BACKDROP (Fallback jika kamera denied/unsupported) */}
        {cameraStatus !== 'active' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#090b10] via-[#1c1917] to-[#0a0705] pointer-events-none overflow-hidden">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#fde68a_1px,transparent_1px)] [background-size:28px_28px]" />
            <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-amber-950/60 via-[#190d06]/40 to-transparent" />
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center pointer-events-none opacity-50">
              <span className="font-mono text-xs text-amber-200 uppercase tracking-widest block font-bold">
                Mode Simulasi Panorama 360° Palembang
              </span>
              <span className="text-[11px] text-stone-400">
                Geser layar untuk memutar kamera 360 derajat
              </span>
            </div>
          </div>
        )}

        {/* 3. THREE.JS WEBGL 3D OVERLAY CONTAINER */}
        <div
          ref={canvasMountRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10"
        />

        {/* 4. TOP AR COMPASS & RADAR HUD BAR */}
        <header className="relative z-20 p-3 sm:p-4 bg-gradient-to-b from-black/85 via-black/50 to-transparent flex flex-col gap-2 pointer-events-none">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3 pointer-events-auto">
            {/* Brand Title Pill */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 bg-black/60 border border-amber-500/30 rounded-2xl backdrop-blur-md">
              <Camera size={16} className="text-amber-400" />
              <div>
                <span className="font-mono text-[9px] text-amber-400 uppercase tracking-widest font-bold block leading-none">
                  SIGUNTANG WebAR
                </span>
                <span className="font-serif text-xs font-bold text-white leading-tight">
                  Palembang Heritage Lens
                </span>
              </div>
            </div>

            {/* Compass Azimuth & Pitch Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-black/60 border border-white/10 rounded-2xl backdrop-blur-md text-xs font-mono">
              <Compass size={14} className="text-amber-400 animate-spin-slow" />
              <span className="font-bold text-white">{activeHeading}°</span>
              <span className="text-stone-400">{bearingToCardinal(activeHeading)}</span>
              <span className="text-stone-600">|</span>
              <span className="text-stone-400">Pitch: {activePitch}°</span>
            </div>

            {/* Action Tools: Switch Cam, GPS toggle, Close */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Tombol Buka Data Sampel Marker 3D Ampera */}
              <button
                onClick={() => setIsAmperaDataModalOpen(true)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-mono font-bold transition-all cursor-pointer shadow-md ${
                  isAmperaMatched
                    ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300'
                    : 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                }`}
                title="Buka Data Sampel Penanda 3D Jembatan Ampera & Uji Koordinat"
              >
                <Target size={13} className={isAmperaMatched ? 'text-emerald-400' : 'text-amber-400'} />
                <span className="hidden sm:inline">Data Marker Ampera</span>
                <span className="sm:hidden">Ampera</span>
                {isAmperaMatched && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
              </button>

              {/* Saved Snapshots Gallery Counter Button */}
              {savedSnapshots.length > 0 && (
                <button
                  onClick={() => setActiveSnapshotForShare(savedSnapshots[0])}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono text-white transition-all cursor-pointer"
                  title="Lihat Galeri Foto AR Objek Browser"
                >
                  <ImageIcon size={13} className="text-amber-400" />
                  <span>{savedSnapshots.length}</span>
                </button>
              )}

              {/* Flip Camera Button */}
              {cameraStatus === 'active' && (
                <button
                  onClick={handleFlipCamera}
                  className="p-2 bg-black/60 hover:bg-black/80 border border-white/15 text-stone-300 hover:text-white rounded-xl backdrop-blur-md transition-all cursor-pointer"
                  title="Balik Kamera (Depan / Belakang)"
                >
                  <RefreshCw size={15} />
                </button>
              )}

              {/* iOS Sensor Permission Button if Needed */}
              {needsOrientationPermission && (
                <button
                  onClick={requestIOSOrientation}
                  className="px-2.5 py-1.5 bg-amber-500 text-stone-950 font-bold text-[10px] uppercase font-mono rounded-xl cursor-pointer shadow-md"
                >
                  Aktifkan Sensor HP
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 bg-black/60 hover:bg-red-950/80 border border-white/15 hover:border-red-500/40 text-stone-300 hover:text-white rounded-xl backdrop-blur-md transition-all cursor-pointer"
                title="Tutup AR Lens"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* COMPASS HEADING RIBBON */}
          <div className="max-w-md mx-auto w-full relative h-7 bg-black/50 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md pointer-events-auto">
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-amber-400 z-10 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-1 bg-amber-400 rounded-b z-10 pointer-events-none" />

            <div
              className="absolute top-0 bottom-0 flex items-center transition-transform duration-100 ease-out font-mono text-[9px] text-stone-400 pointer-events-none"
              style={{
                left: '50%',
                transform: `translateX(-${activeHeading * 3}px)`,
              }}
            >
              {Array.from({ length: 72 }, (_, i) => i * 5).map((deg) => {
                const isCardinal = deg % 90 === 0;
                const isSubCardinal = deg % 45 === 0 && !isCardinal;
                const cardinalLabel =
                  deg === 0 || deg === 360
                    ? 'U'
                    : deg === 90
                    ? 'T'
                    : deg === 180
                    ? 'S'
                    : deg === 270
                    ? 'B'
                    : deg === 45
                    ? 'TL'
                    : deg === 135
                    ? 'TG'
                    : deg === 225
                    ? 'BD'
                    : deg === 315
                    ? 'BL'
                    : null;

                return (
                  <div
                    key={deg}
                    className="absolute flex flex-col items-center"
                    style={{ left: `${deg * 3}px`, width: '30px', marginLeft: '-15px' }}
                  >
                    <div
                      className={`w-0.5 ${
                        isCardinal
                          ? 'h-3 bg-amber-400'
                          : isSubCardinal
                          ? 'h-2 bg-stone-300'
                          : 'h-1 bg-stone-600'
                      }`}
                    />
                    {cardinalLabel && (
                      <span
                        className={`text-[8px] font-bold ${
                          isCardinal ? 'text-amber-300' : 'text-stone-300'
                        }`}
                      >
                        {cardinalLabel}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Marker Pips on Compass */}
              {PALEMBANG_NODES.map((node) => {
                const marker = markersRef.current.get(node.id);
                if (!marker) return null;
                const isSelected = selectedMarkerNode?.id === node.id;
                const isAmpera = node.id === 'node-ampera';

                return (
                  <div
                    key={node.id}
                    className="absolute -top-1 flex flex-col items-center pointer-events-auto cursor-pointer"
                    style={{
                      left: `${marker.bearing * 3}px`,
                      marginLeft: '-6px',
                    }}
                    onClick={() => handleFocusSite(node)}
                    title={`${node.name} (${formatDistance(marker.distance)})`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full flex items-center justify-center transition-all ${
                        isAmpera && isAmperaMatched
                          ? 'bg-emerald-400 ring-2 ring-emerald-300 scale-125'
                          : isSelected
                          ? 'bg-amber-400 ring-2 ring-amber-300 scale-125'
                          : 'bg-red-600 border border-white/60'
                      }`}
                    >
                      <div className="w-1 h-1 rounded-full bg-white" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </header>

        {/* Calibration Toast Notification */}
        {calibrationToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-amber-950/90 border border-amber-400 text-amber-200 rounded-2xl text-xs font-mono font-bold flex items-center gap-2 shadow-2xl z-50 backdrop-blur-md"
          >
            <LocateFixed size={15} className="text-amber-400 animate-pulse" />
            <span>{calibrationToast}</span>
          </motion.div>
        )}

        {/* 5A. VISUAL COMPASS & DIRECTIONAL ARROW (Points toward Nearest Registered Palembang Heritage Site) */}
        {nearestSite && (
          <div
            onClick={() => handleFocusSite(nearestSite.node)}
            className="absolute top-28 sm:top-24 left-3 sm:left-4 z-20 flex items-center gap-2.5 p-2 sm:p-2.5 bg-black/80 hover:bg-black/90 border border-amber-500/40 hover:border-amber-400 rounded-2xl shadow-2xl backdrop-blur-md text-white cursor-pointer group transition-all max-w-[270px] sm:max-w-xs pointer-events-auto"
            title={`Arah kompas menunjuk ke situs cagar budaya terdekat: ${nearestSite.node.name}. Klik untuk mengarahkan kamera.`}
          >
            {/* Circular Compass Dial with Animated Directional Arrow Needle */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-stone-950 border-2 border-amber-400/60 flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
              {/* Cardinal ticks */}
              <div className="absolute top-0.5 text-[7px] font-mono font-bold text-amber-400/80">U</div>
              <div className="absolute bottom-0.5 text-[7px] font-mono text-stone-500">S</div>
              <div className="absolute left-1 text-[7px] font-mono text-stone-500">B</div>
              <div className="absolute right-1 text-[7px] font-mono text-stone-500">T</div>
              <div className="absolute inset-1 rounded-full border border-white/5" />

              {/* Pulsing indicator when aligned within ±15 degrees */}
              {Math.abs(nearestSite.relativeAngle) <= 15 && (
                <span className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-75" />
              )}

              {/* Rotating Directional Needle */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-out"
                style={{
                  transform: `rotate(${nearestSite.relativeAngle}deg)`,
                }}
              >
                <div className="flex flex-col items-center">
                  {/* Arrowhead */}
                  <div
                    className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[16px] drop-shadow-[0_0_6px_rgba(245,158,11,0.8)] ${
                      Math.abs(nearestSite.relativeAngle) <= 15
                        ? 'border-b-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.9)]'
                        : 'border-b-amber-400'
                    }`}
                  />
                  {/* Stem */}
                  <div
                    className={`w-1 h-3 -mt-0.5 rounded-b ${
                      Math.abs(nearestSite.relativeAngle) <= 15 ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                </div>
              </div>

              {/* Center Pivot */}
              <div
                className={`w-2 h-2 rounded-full z-10 ${
                  Math.abs(nearestSite.relativeAngle) <= 15
                    ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
                    : 'bg-amber-400'
                }`}
              />
            </div>

            {/* Nearest Site Telemetry */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Compass size={10} className="text-amber-400 animate-spin-slow" />
                  Situs Terdekat
                </span>
                {Math.abs(nearestSite.relativeAngle) <= 15 && (
                  <span className="text-[8px] font-mono font-bold px-1 py-0.2 rounded bg-emerald-500/25 text-emerald-300 border border-emerald-500/40">
                    LURUS
                  </span>
                )}
              </div>

              <h5 className="font-serif text-xs font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                {nearestSite.node.name.split('(')[0].trim()}
              </h5>

              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`font-mono text-xs font-black ${
                    nearestSite.distanceMeters <= 350 ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {Math.round(nearestSite.distanceMeters)} m
                </span>
                <span className="text-stone-500 text-[10px]">•</span>
                <span className="font-mono text-[10px] text-stone-300 truncate">
                  {nearestSite.relativeDirectionText}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 5B. VIRTUAL OVERLAY MARKER ACTIVE BANNER (When Coordinates Match Ampera Bridge) */}
        {isAmperaMatched && (
          <div className="absolute top-44 sm:top-28 right-3 sm:right-6 sm:w-80 p-3 bg-emerald-950/85 border-2 border-emerald-400 rounded-2xl shadow-2xl backdrop-blur-md text-white z-20 animate-fade-in pointer-events-auto">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
                  Overlay Ampera Aktif
                </span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-200 px-2 py-0.5 rounded border border-emerald-500/40">
                Match: {Math.round(amperaMatchStatus.distanceMeters)}m
              </span>
            </div>
            <h4 className="font-serif text-xs font-bold text-white mt-1">
              Jembatan Ampera Terverifikasi di Lokasi
            </h4>
            <p className="text-[10px] text-emerald-200/80 mt-0.5 leading-relaxed">
              Koordinat kamera cocok (-2.9918, 104.7634). Model 3D menara kembar merah virtual aktif di viewport.
            </p>
            <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-emerald-500/30">
              <button
                onClick={() => setIsAmperaDataModalOpen(true)}
                className="text-[10px] font-mono font-bold text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Spesifikasi Marker</span>
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Center Crosshair Reticle & Floating Distance Calibration Pill */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <div className="relative w-12 h-12 border border-white/20 rounded-full flex items-center justify-center opacity-60">
            <div className={`w-1.5 h-1.5 rounded-full ${isAmperaMatched ? 'bg-emerald-400 scale-125' : 'bg-amber-400'}`} />
            <div className="absolute -top-1 w-2 h-0.5 bg-white/40" />
            <div className="absolute -bottom-1 w-2 h-0.5 bg-white/40" />
            <div className="absolute -left-1 w-0.5 h-2 bg-white/40" />
            <div className="absolute -right-1 w-0.5 h-2 bg-white/40" />
          </div>

          {/* Floating Distance Indicator for Selected Marker */}
          {selectedMarkerNode && selectedDistanceMeters !== null && selectedCalibration && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 pointer-events-auto flex items-center gap-2 px-3 py-1.5 bg-black/85 backdrop-blur-md border border-amber-500/40 rounded-2xl shadow-xl text-white text-xs font-mono"
            >
              <div className="flex items-center gap-1.5">
                <MapPin size={12} className="text-amber-400 shrink-0" />
                <span className="text-stone-300 truncate max-w-[120px] sm:max-w-none">
                  {selectedMarkerNode.name.split('(')[0].trim()}:
                </span>
                <span
                  className={`font-black ${
                    selectedCalibration.isCalibrated ? 'text-emerald-400' : 'text-amber-300'
                  }`}
                >
                  {Math.round(selectedDistanceMeters)} meter
                </span>
              </div>

              <span className="text-stone-600">|</span>

              <button
                onClick={() => handleCalibrateToSite(selectedMarkerNode)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-white border border-amber-400/40 text-[10px] font-bold uppercase transition-all cursor-pointer active:scale-95"
                title="Kalibrasi posisi pengguna ke titik koordinat situs ini (jarak 0m)"
              >
                <LocateFixed size={10} className="text-amber-400" />
                <span>Kalibrasi (0m)</span>
              </button>
            </motion.div>
          )}
        </div>

        {/* Camera Permission Warning Banner */}
        {cameraStatus === 'denied' && (
          <div className="absolute top-28 left-4 right-4 max-w-md mx-auto p-4 bg-red-950/90 border border-red-500/50 rounded-2xl text-white text-xs z-30 shadow-2xl backdrop-blur-md">
            <div className="flex items-start gap-3">
              <Info size={18} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-200">Akses Kamera Belum Diizinkan</p>
                <p className="text-stone-300 mt-1 leading-relaxed">
                  {cameraErrorMsg || 'Izinkan akses kamera di pengaturan browser Anda untuk pengalaman AR penuh.'}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => startCamera(facingMode)}
                    className="px-3 py-1.5 bg-red-800 hover:bg-red-700 font-bold rounded-lg transition-all cursor-pointer"
                  >
                    Coba Izinkan Lagi
                  </button>
                  <button
                    onClick={() => setCameraStatus('simulated')}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-all cursor-pointer text-stone-300"
                  >
                    Gunakan Mode 360°
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Snapshot Success Notification */}
        {snapshotSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 px-4 py-2 bg-emerald-950/90 border border-emerald-400/60 text-emerald-200 rounded-2xl text-xs font-mono font-bold flex items-center gap-2 shadow-2xl z-40 backdrop-blur-md"
          >
            <Check size={16} className="text-emerald-400" />
            <span>{snapshotSuccess}</span>
          </motion.div>
        )}

        {/* 6. COLLAPSIBLE BOTTOM DOCK (Unified Zero-Occlusion Dock) */}
        <footer className="relative z-20 mt-auto p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-col items-center gap-3 pointer-events-none">
          <button
            onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
            className="pointer-events-auto px-3 py-1 rounded-full bg-black/60 border border-white/15 text-[10px] font-mono font-bold uppercase text-stone-400 hover:text-white transition-all cursor-pointer backdrop-blur-md flex items-center gap-1.5 shadow-md active:scale-95"
          >
            <span>{isControlsCollapsed ? '▲ Tampilkan Kontrol AR' : '▼ Sembunyikan Kontrol'}</span>
          </button>

          {!isControlsCollapsed && (
            <div className="w-full max-w-4xl mx-auto flex flex-col gap-3 pointer-events-auto">
              {/* Selected Heritage Marker Card */}
              <AnimatePresence>
                {selectedMarkerNode && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className={`border rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl text-white ${
                      selectedMarkerNode.id === 'node-ampera' && isAmperaMatched
                        ? 'bg-[#091f16]/95 border-emerald-400/60 shadow-emerald-950/50'
                        : 'bg-[#120f0d]/95 border-amber-500/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      {/* Thumbnail & Meta */}
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <img
                          src={selectedMarkerNode.image}
                          alt={selectedMarkerNode.name}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-amber-500/30 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                              {selectedMarkerNode.type}
                            </span>
                            {selectedMarkerNode.id === 'node-ampera' && isAmperaMatched && (
                              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 uppercase tracking-wider">
                                ✓ Koordinat Cocok
                              </span>
                            )}
                            {markersRef.current.get(selectedMarkerNode.id) && (
                              <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                                <Navigation size={10} className="rotate-45" />
                                {formatDistance(markersRef.current.get(selectedMarkerNode.id)!.distance)}
                                {' • '}
                                {markersRef.current.get(selectedMarkerNode.id)!.bearing.toFixed(0)}° (
                                {bearingToCardinal(markersRef.current.get(selectedMarkerNode.id)!.bearing)})
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif text-base sm:text-lg font-bold text-white truncate">
                            {selectedMarkerNode.name}
                          </h4>
                          <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                            {selectedMarkerNode.description}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                        {onOpenMintSBT && (
                          <button
                            onClick={() => {
                              onOpenMintSBT(selectedMarkerNode);
                              onClose();
                            }}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-gradient-to-r from-red-800 to-red-700 hover:brightness-110 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-red-900/30 cursor-pointer active:scale-95 transition-all border border-red-500/30"
                            title="Klaim Soulbound Token Kehadiran di Lokasi"
                          >
                            <Shield size={14} className="text-amber-300" />
                            <span>Klaim SBT</span>
                          </button>
                        )}

                        {onSelectNodeDetail && (
                          <button
                            onClick={() => {
                              onSelectNodeDetail(selectedMarkerNode);
                              onClose();
                            }}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
                            title="Buka Lembar Cagar Budaya Lengkap"
                          >
                            <Eye size={14} />
                            <span>Detail Situs</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* DISTANCE INDICATOR & SPATIAL CALIBRATION SECTION */}
                    {selectedDistanceMeters !== null && selectedCalibration && (
                      <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-black/40 rounded-2xl p-3 border border-white/5">
                        {/* Distance in Meters & Proximity Zone */}
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-300 shrink-0">
                            <LocateFixed size={18} className="animate-pulse" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider font-semibold">
                                Jarak ke Situs:
                              </span>
                              <span
                                className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase"
                                style={{
                                  backgroundColor: `${selectedCalibration.badgeColor}25`,
                                  color: selectedCalibration.badgeColor,
                                  border: `1px solid ${selectedCalibration.badgeColor}50`,
                                }}
                              >
                                {selectedCalibration.zoneLabel}
                              </span>
                            </div>
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                              <span className="text-xl sm:text-2xl font-mono font-black text-white">
                                {Math.round(selectedDistanceMeters)}
                              </span>
                              <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                                METER
                              </span>
                              <span className="text-stone-500 text-xs font-mono">
                                ({formatDistance(selectedDistanceMeters)})
                              </span>
                              {selectedBearing !== null && (
                                <span className="text-stone-400 text-[11px] font-mono hidden sm:inline">
                                  • Azimuth: {selectedBearing.toFixed(0)}° ({bearingToCardinal(selectedBearing)})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Calibration Action Controls */}
                        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                          {/* Snap to Site (0m) */}
                          <button
                            onClick={() => handleCalibrateToSite(selectedMarkerNode)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-mono font-bold text-[11px] uppercase rounded-xl transition-all shadow-md shadow-emerald-600/25 cursor-pointer active:scale-95"
                            title="Kalibrasi koordinat lokasi pengguna ke titik situs ini (0 meter)"
                          >
                            <LocateFixed size={12} />
                            <span>Kalibrasi Titik (0m)</span>
                          </button>

                          {/* Fine tune -50m */}
                          <button
                            onClick={() => handleFineTuneDistance(-50)}
                            className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-stone-200 font-mono text-[10px] font-bold rounded-xl border border-white/10 transition-all cursor-pointer"
                            title="Dekatkan posisi 50 meter ke situs"
                          >
                            -50m
                          </button>

                          {/* Fine tune +50m */}
                          <button
                            onClick={() => handleFineTuneDistance(50)}
                            className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-stone-200 font-mono text-[10px] font-bold rounded-xl border border-white/10 transition-all cursor-pointer"
                            title="Jauhkan posisi 50 meter dari situs"
                          >
                            +50m
                          </button>

                          {/* Sync real GPS */}
                          <button
                            onClick={handleSyncRealGPS}
                            className="p-2 bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white rounded-xl border border-white/10 transition-all cursor-pointer"
                            title="Sinkronkan dengan sensor GPS fisik perangkat"
                          >
                            <Crosshair size={13} />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* HORIZONTAL SITE QUICK SELECTOR STRIP */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase pl-1 pr-1.5 shrink-0 flex items-center gap-1">
                    <MapPin size={11} />
                    Fokus AR:
                  </span>
                  {PALEMBANG_NODES.map((node) => {
                    const isSelected = selectedMarkerNode?.id === node.id;
                    const marker = markersRef.current.get(node.id);
                    const distStr = marker ? formatDistance(marker.distance) : '';
                    const isAmpera = node.id === 'node-ampera';

                    return (
                      <button
                        key={node.id}
                        onClick={() => handleFocusSite(node)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                          isAmpera && isAmperaMatched
                            ? 'bg-emerald-500 text-stone-950 font-extrabold shadow-lg shadow-emerald-400/30 scale-105'
                            : isSelected
                            ? 'bg-amber-400 text-stone-950 font-extrabold shadow-lg shadow-amber-400/25 scale-105'
                            : 'bg-black/60 hover:bg-white/10 text-stone-300 border border-white/10'
                        }`}
                      >
                        <span>{node.name.split('(')[0].trim()}</span>
                        {isAmpera && isAmperaMatched ? (
                          <span className="text-[9px] bg-black/40 text-emerald-200 px-1 rounded font-bold">MATCH</span>
                        ) : (
                          distStr && <span className="text-[9px] opacity-75 font-normal">({distStr})</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* CAPTURE SNAPSHOT BUTTON */}
                <button
                  onClick={handleCaptureARSnapshot}
                  disabled={isSnapshotLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:brightness-110 text-stone-950 font-bold text-xs font-mono uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-amber-500/25 shrink-0 cursor-pointer active:scale-95 disabled:opacity-50"
                  title="Ambil snapshot foto AR dan simpan sebagai objek browser lokal untuk dibagikan"
                >
                  <Camera size={15} />
                  <span className="hidden sm:inline">Capture Snapshot</span>
                  <span className="sm:hidden">Snapshot</span>
                </button>
              </div>
            </div>
          )}
        </footer>

        {/* =========================================================================
            7. MODAL DETAIL DATA SAMPEL PENANDA 3D JEMBATAN AMPERA
           ========================================================================= */}
        <AnimatePresence>
          {isAmperaDataModalOpen && (
            <div className="fixed inset-0 z-[7500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative w-full max-w-lg bg-[#0e141a] border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-stone-100 max-h-[85vh] overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
                      <Target size={22} />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                        Spesifikasi Penanda 3D Virtual AR
                      </span>
                      <h3 className="font-serif text-lg font-bold text-white">
                        {AMPERA_MARKER_SAMPLE_DATA.name}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAmperaDataModalOpen(false)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-all cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Status Pencocokan Koordinat */}
                <div className={`mt-4 p-4 rounded-2xl border ${
                  isAmperaMatched
                    ? 'bg-emerald-950/60 border-emerald-400/60 text-emerald-200'
                    : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                }`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-bold uppercase flex items-center gap-1.5">
                      {isAmperaMatched ? (
                        <>
                          <CheckCircle2 size={15} className="text-emerald-400" />
                          Status: Koordinat Cocok (In-Range)
                        </>
                      ) : (
                        <>
                          <MapPin size={15} className="text-amber-400" />
                          Status: Di Luar Radius Toleransi
                        </>
                      )}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10 font-bold">
                      Jarak: {formatDistance(amperaMatchStatus.distanceMeters)}
                    </span>
                  </div>
                  <p className="text-xs mt-2 text-stone-300 leading-relaxed">
                    {isAmperaMatched
                      ? `Koordinat lokasi saat ini berada dalam radius toleransi ${AMPERA_MARKER_SAMPLE_DATA.toleranceRadiusMeters}m dari Jembatan Ampera. Virtual overlay marker 3D ditampilkan secara penuh di layar kamera.`
                      : `Marker Ampera berjarak ${formatDistance(amperaMatchStatus.distanceMeters)} dari koordinat Anda saat ini. Gunakan tombol uji di bawah untuk memposisikan koordinat ke Jembatan Ampera.`}
                  </p>
                </div>

                {/* Parameter Koordinat Geografis */}
                <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2.5 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Koordinat Patokan:</span>
                    <span className="text-amber-300 font-bold">
                      {AMPERA_MARKER_SAMPLE_DATA.coordinates.lat}, {AMPERA_MARKER_SAMPLE_DATA.coordinates.lng}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Koordinat Anda Saat Ini:</span>
                    <span className="text-white font-bold">
                      {currentCoord.lat.toFixed(4)}, {currentCoord.lng.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Radius Toleransi Match:</span>
                    <span className="text-stone-200">{AMPERA_MARKER_SAMPLE_DATA.toleranceRadiusMeters} Meter</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Tinggi Menara / Bentang:</span>
                    <span className="text-stone-200">63 m / 1.177 m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">STC Proof Hash:</span>
                    <span className="text-amber-400 text-[10px]">{AMPERA_MARKER_SAMPLE_DATA.stcProofHash}</span>
                  </div>
                </div>

                {/* Komponen Model 3D Prosedural */}
                <div className="mt-4">
                  <span className="font-mono text-[11px] font-bold uppercase text-amber-400 block mb-2">
                    Fitur Arsitektur Model 3D Penanda:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {AMPERA_MARKER_SAMPLE_DATA.model3DFeatures.map((feat, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-stone-300 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tombol Uji Pencocokan Koordinat */}
                <div className="mt-6 flex flex-col sm:flex-row gap-2 pt-4 border-t border-white/10">
                  <button
                    onClick={() => {
                      handleSetExactAmperaLocation();
                      setIsAmperaDataModalOpen(false);
                    }}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/25 active:scale-95"
                  >
                    <CheckCircle2 size={15} />
                    <span>Uji: Cocokkan ke Ampera</span>
                  </button>

                  <button
                    onClick={() => {
                      handleSetFarLocation();
                      setIsAmperaDataModalOpen(false);
                    }}
                    className="py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Uji Luar Radius
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* =========================================================================
            8. MODAL SHARING & DETAIL OBJEK BROWSER SNAPSHOT AR
           ========================================================================= */}
        <AnimatePresence>
          {activeSnapshotForShare && (
            <div className="fixed inset-0 z-[7600] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative w-full max-w-xl bg-[#0f1218] border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl text-stone-100 max-h-[90vh] overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
                      <Share2 size={22} />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                        Objek Browser Lokal Tersimpan
                      </span>
                      <h3 className="font-serif text-lg font-bold text-white">
                        Bagikan Snapshot Foto AR
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSnapshotForShare(null)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-all cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {copyFeedback && (
                  <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                    <Check size={14} className="text-emerald-400" />
                    <span>{copyFeedback}</span>
                  </div>
                )}

                {/* Image Preview */}
                <div className="mt-4 rounded-2xl overflow-hidden border border-white/15 relative bg-black shadow-lg">
                  <img
                    src={activeSnapshotForShare.objectUrl}
                    alt="Captured AR Overlay"
                    className="w-full h-auto max-h-[340px] object-contain mx-auto"
                  />
                  {activeSnapshotForShare.isCoordinateMatched && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-950/85 border border-emerald-400 rounded-full text-[10px] font-mono text-emerald-300 flex items-center gap-1.5 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>Ampera Coordinates Matched</span>
                    </div>
                  )}
                </div>

                {/* Local Browser Object Metadata Card */}
                <div className="mt-4 p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-stone-400">Nama File Objek:</span>
                    <span className="text-white font-bold truncate max-w-[240px]">
                      {activeSnapshotForShare.file.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Ukuran Objek Browser:</span>
                    <span className="text-amber-300 font-bold">
                      {(activeSnapshotForShare.file.size / 1024).toFixed(1)} KB (image/jpeg)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Waktu Pengambilan:</span>
                    <span className="text-stone-300">
                      {activeSnapshotForShare.timestamp.toLocaleTimeString('id-ID')}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                    <span className="text-stone-400 text-[10px]">Local Blob URL:</span>
                    <button
                      onClick={() => handleCopyObjectUrl(activeSnapshotForShare.objectUrl)}
                      className="text-amber-400 text-[10px] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Copy size={11} />
                      <span>Salin Blob URL</span>
                    </button>
                  </div>
                </div>

                {/* Action Buttons: Native Share, Clipboard, Download */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => handleNativeShare(activeSnapshotForShare)}
                    className="py-3 px-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:brightness-110 text-stone-950 font-bold text-xs font-mono uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95"
                    title="Bagikan menggunakan native Web Share API ponsel"
                  >
                    <Share2 size={15} />
                    <span>Bagikan Foto</span>
                  </button>

                  <button
                    onClick={() => handleCopyImageToClipboard(activeSnapshotForShare)}
                    className="py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/15 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    title="Salin gambar langsung ke clipboard untuk ditempel ke chat"
                  >
                    <Copy size={15} />
                    <span>Salin Gambar</span>
                  </button>

                  <a
                    href={activeSnapshotForShare.objectUrl}
                    download={activeSnapshotForShare.file.name}
                    className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20 active:scale-95"
                    title="Simpan foto ke penyimpanan galeri lokal perangkat"
                  >
                    <Download size={15} />
                    <span>Unduh File</span>
                  </a>
                </div>

                {/* Session Snapshots Carousel if multiple exist */}
                {savedSnapshots.length > 1 && (
                  <div className="mt-5 pt-4 border-t border-white/10">
                    <span className="font-mono text-[10px] text-stone-400 uppercase tracking-wider block mb-2">
                      Foto Lain dalam Sesi Ini ({savedSnapshots.length}):
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                      {savedSnapshots.map((snap) => (
                        <div
                          key={snap.id}
                          onClick={() => setActiveSnapshotForShare(snap)}
                          className={`w-16 h-12 rounded-xl overflow-hidden border cursor-pointer shrink-0 transition-all ${
                            activeSnapshotForShare.id === snap.id
                              ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                              : 'border-white/20 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={snap.objectUrl}
                            alt="Snapshot"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}
