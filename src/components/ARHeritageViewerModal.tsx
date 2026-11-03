/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  Info
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
  GeoCoordinate
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
  }>>(new Map());

  // Camera stream & status
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('initializing');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraErrorMsg, setCameraErrorMsg] = useState<string | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Geolocation & Heading State
  const [useSimulatedGPS, setUseSimulatedGPS] = useState<boolean>(true);
  const [currentCoord, setCurrentCoord] = useState<GeoCoordinate>(PALEMBANG_CENTER);
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

  // Sync selected node with initialNode prop
  useEffect(() => {
    if (initialNode) {
      setSelectedMarkerNode(initialNode);
    }
  }, [initialNode]);

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
      // Sudut theta (azimuth bearing): 0° = Z negatif (Utara)
      const radBearing = (bearing * Math.PI) / 180;
      // Jarak visual di-scale agar nyaman dilihat di viewport (16 - 32 unit)
      const visualRadius = Math.max(16, Math.min(32, 16 + Math.log10(Math.max(10, distMeters)) * 4));

      const x = visualRadius * Math.sin(radBearing);
      const z = -visualRadius * Math.cos(radBearing);
      const y = -0.5 + (Math.sin(radBearing * 3) * 0.4); // Variasi elevasi alami

      markerObj.group.position.set(x, y, z);
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
      markersMap.forEach(({ iconGroup, beaconRing, labelSprite }) => {
        // Slow continuous rotation
        iconGroup.rotation.y = elapsed * 0.4;
        iconGroup.position.y = 1.0 + Math.sin(elapsed * 2 + iconGroup.id) * 0.15;

        // Pulse ground beacon ring
        beaconRing.scale.setScalar(1.0 + Math.sin(elapsed * 3) * 0.12);

        // Always face label towards the camera
        labelSprite.lookAt(camera.position);
      });

      // Update camera orientation from Heading & Pitch + manual drag
      const totalHeading = (compassHeading + manualHeadingOffsetRef.current) % 360;
      const totalPitch = Math.max(-80, Math.min(80, pitchAngle + manualPitchOffsetRef.current));

      const radYaw = (-totalHeading * Math.PI) / 180;
      const radPitch = (-totalPitch * Math.PI) / 180;

      // Euler angle: YXZ order untuk orientasi kamera HP yang tepat
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

  // Recalculate distances and update 3D marker positions when location changes
  useEffect(() => {
    if (!markersRef.current.size) return;
    const origin = currentCoord;

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

    // Sensitivitas drag: 1px = ~0.35 derajat
    manualHeadingOffsetRef.current = (manualHeadingOffsetRef.current - deltaX * 0.35) % 360;
    manualPitchOffsetRef.current = Math.max(-75, Math.min(75, manualPitchOffsetRef.current + deltaY * 0.25));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    // Cek apakah klik/tap singkat tanpa banyak drag (untuk raycasting objek 3D)
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

    // Set heading agar kamera langsung menatap azimuth situs ini
    const targetHeading = marker.bearing;
    manualHeadingOffsetRef.current = targetHeading - compassHeading;
    manualPitchOffsetRef.current = 0;
    musiAudio.playArrivalChime(480);
  };

  // Snapshot Foto AR: Gabungkan feed kamera/latar + Three.js canvas + Stempel Cagar Budaya
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
        // Background Simulasi Panorama Musi Senja
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
      // Banner gelap transparan di bawah
      ctx.fillStyle = 'rgba(10, 8, 6, 0.75)';
      ctx.fillRect(0, h - 85, w, 85);

      // Border aksen emas
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(0, h - 88, w, 3);

      // Logo Text SIGUNTANG AR
      ctx.font = 'bold 22px serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('SIGUNTANG • Cagar Budaya AR Camera', 30, h - 50);

      ctx.font = '13px monospace';
      ctx.fillStyle = '#fde68a';
      const locText = useSimulatedGPS
        ? 'Palembang Heritage Hub • Simulasi Jembatan Ampera'
        : `GPS: ${currentCoord.lat.toFixed(4)}, ${currentCoord.lng.toFixed(4)}`;
      ctx.fillText(`${locText} • Heading: ${((compassHeading + manualHeadingOffsetRef.current) % 360).toFixed(0)}°`, 30, h - 25);

      // Stempel Kanan
      ctx.textAlign = 'right';
      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('STC DIGITAL PROVENANCE VERIFIED', w - 30, h - 50);

      ctx.font = '12px monospace';
      ctx.fillStyle = '#a8a29e';
      ctx.fillText(new Date().toLocaleString('id-ID'), w - 30, h - 25);
      ctx.restore();

      // Trigger Download atau Web Share
      const dataUrl = snapCanvas.toDataURL('image/jpeg', 0.92);

      // Play audio shutter
      musiAudio.playSplash(1.5);

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `SIGUNTANG-AR-${selectedMarkerNode?.name.replace(/\s+/g, '_') || 'Palembang'}-${Date.now()}.jpg`;
      link.click();

      setSnapshotSuccess('Foto AR berhasil ditangkap & diunduh ke galeri!');
      setTimeout(() => setSnapshotSuccess(null), 4000);
    } catch (e) {
      console.warn('Snapshot error:', e);
    } finally {
      setIsSnapshotLoading(false);
    }
  };

  if (!isOpen) return null;

  const activeHeading = Math.round((compassHeading + manualHeadingOffsetRef.current + 360) % 360);
  const activePitch = Math.round(pitchAngle + manualPitchOffsetRef.current);

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
            {/* Parallax Stars */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#fde68a_1px,transparent_1px)] [background-size:28px_28px]" />
            {/* River Glow Horizon */}
            <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-amber-950/60 via-[#190d06]/40 to-transparent" />
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center pointer-events-none opacity-40">
              <span className="font-mono text-xs text-amber-200 uppercase tracking-widest block">
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

        {/* 4. TOP AR COMPASS & RADAR HUD BAR (Zero Viewport Occlusion) */}
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
              {/* GPS Origin Mode Switcher */}
              <button
                onClick={() => {
                  setUseSimulatedGPS(!useSimulatedGPS);
                  if (!useSimulatedGPS) {
                    setCurrentCoord(PALEMBANG_CENTER);
                  }
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  useSimulatedGPS
                    ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                    : 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                }`}
                title={useSimulatedGPS ? 'Beralih ke GPS Nyata Ponsel' : 'Beralih ke Simulasi Episentrum Ampera'}
              >
                <MapPin size={13} />
                <span className="hidden md:inline">
                  {useSimulatedGPS ? 'Simulasi: Jembatan Ampera' : 'GPS Nyata Aktif'}
                </span>
                <span className="md:hidden">
                  {useSimulatedGPS ? 'Ampera Hub' : 'GPS'}
                </span>
              </button>

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

          {/* COMPASS HEADING RIBBON (Radar Strip Horisontal) */}
          <div className="max-w-md mx-auto w-full relative h-7 bg-black/50 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md pointer-events-auto">
            {/* Center target reticle */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-amber-400 z-10 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-1 bg-amber-400 rounded-b z-10 pointer-events-none" />

            {/* Sliding Compass Tape */}
            <div
              className="absolute top-0 bottom-0 flex items-center transition-transform duration-100 ease-out font-mono text-[9px] text-stone-400 pointer-events-none"
              style={{
                left: '50%',
                transform: `translateX(-${activeHeading * 3}px)`,
              }}
            >
              {/* Render 360 degrees tape with markers */}
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

              {/* Marker Pips on Tape */}
              {PALEMBANG_NODES.map((node) => {
                const marker = markersRef.current.get(node.id);
                if (!marker) return null;
                const rel = getRelativeAngle(marker.bearing, activeHeading);
                const isSelected = selectedMarkerNode?.id === node.id;

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
                        isSelected
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

        {/* 5. CENTER SCREEN CROSSHAIR RETICLE & HINT */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="relative w-12 h-12 border border-white/20 rounded-full flex items-center justify-center opacity-60">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <div className="absolute -top-1 w-2 h-0.5 bg-white/40" />
            <div className="absolute -bottom-1 w-2 h-0.5 bg-white/40" />
            <div className="absolute -left-1 w-0.5 h-2 bg-white/40" />
            <div className="absolute -right-1 w-0.5 h-2 bg-white/40" />
          </div>
        </div>

        {/* Camera Permission Warning / Retry Banner */}
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

        {/* 6. COLLAPSIBLE BOTTOM DOCK (Unified Zero-Occlusion Dock per threejs Skill) */}
        <footer className="relative z-20 mt-auto p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-col items-center gap-3 pointer-events-none">
          {/* Collapse/Expand Toggle Button */}
          <button
            onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
            className="pointer-events-auto px-3 py-1 rounded-full bg-black/60 border border-white/15 text-[10px] font-mono font-bold uppercase text-stone-400 hover:text-white transition-all cursor-pointer backdrop-blur-md flex items-center gap-1.5 shadow-md active:scale-95"
          >
            <span>{isControlsCollapsed ? '▲ Tampilkan Kontrol AR' : '▼ Sembunyikan Kontrol'}</span>
          </button>

          {!isControlsCollapsed && (
            <div className="w-full max-w-4xl mx-auto flex flex-col gap-3 pointer-events-auto">
              {/* Selected Heritage Marker Card (if any selected) */}
              <AnimatePresence>
                {selectedMarkerNode && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="bg-[#120f0d]/95 border border-amber-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl text-white"
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

                    return (
                      <button
                        key={node.id}
                        onClick={() => handleFocusSite(node)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 text-stone-950 font-extrabold shadow-lg shadow-amber-400/25 scale-105'
                            : 'bg-black/60 hover:bg-white/10 text-stone-300 border border-white/10'
                        }`}
                      >
                        <span>{node.name.split('(')[0].trim()}</span>
                        {distStr && <span className="text-[9px] opacity-75 font-normal">({distStr})</span>}
                      </button>
                    );
                  })}
                </div>

                {/* SNAPSHOT FOTO AR BUTTON */}
                <button
                  onClick={handleCaptureARSnapshot}
                  disabled={isSnapshotLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:brightness-110 text-stone-950 font-bold text-xs font-mono uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-amber-500/25 shrink-0 cursor-pointer active:scale-95 disabled:opacity-50"
                  title="Ambil foto AR dengan overlay 3D & stempel digital STC"
                >
                  <Camera size={15} />
                  <span className="hidden sm:inline">Foto AR</span>
                </button>
              </div>
            </div>
          )}
        </footer>
      </div>
    </AnimatePresence>
  );
}
