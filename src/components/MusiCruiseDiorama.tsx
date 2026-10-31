/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  MapPin,
  Award,
  Layers,
  Flame,
  Info,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Navigation,
  CloudRain,
  Moon,
  Sunset,
  CloudFog,
  Smartphone,
  Eye,
  Crosshair,
  Radio,
  Box,
  Cpu
} from 'lucide-react';
import { MUSI_FOLKLORE_EXPEDITION, FolkloreStory, FolkloreHotspot, FolkloreRelic } from '../data/folkloreData';
import { musiAudio, MusiWeatherType } from '../services/musiAudioEngine';
import { Musi3DDiorama } from './Musi3DDiorama';
import { PhygitalConsoleModal } from './PhygitalConsoleModal';

interface MusiCruiseDioramaProps {
  onNodeSelect?: (nodeName: string) => void;
  onOpenStoryteller?: (weather: MusiWeatherType) => void;
  onOpenPlanner?: () => void;
}

interface FolkloreSecret {
  id: string;
  storyId: string;
  name: string;
  xPercent: number;
  yPercent: number;
  hint: string;
  description: string;
  badge: string;
}

const FOLKLORE_SECRETS: Record<string, FolkloreSecret> = {
  'kembang-dadar': {
    id: 'secret-kembang-dadar',
    storyId: 'kembang-dadar',
    name: 'Kelopak Teratai Emas Hanyut',
    xPercent: 36,
    yPercent: 72,
    hint: 'Arahkan senter teplok ke riak air dekat buritan haluan',
    description: 'Pusaran air Sungai Musi berkilau menampakkan kelopak teratai emas tujuh rupa Putri Kembang Dadar yang tak pernah layu.',
    badge: 'Misteri Teratai Keraton',
  },
  'antu-banyu': {
    id: 'secret-antu-banyu',
    storyId: 'antu-banyu',
    name: 'Mata Menyala Pusaran Palung Musi',
    xPercent: 64,
    yPercent: 78,
    hint: 'Sorot senter teplok ke bayangan gelap di palung arus dalam',
    description: 'Di bawah permukaan air keruh, terlihat sepasang mata keemasan menyala pelan dan pusaran rambut lumut Antu Banyu yang menari mengikuti arus.',
    badge: 'Siluet Penjaga Palung',
  },
  'kemaro': {
    id: 'secret-kemaro',
    storyId: 'kemaro',
    name: 'Timbunan 7 Guci Emas Tan Bun An',
    xPercent: 48,
    yPercent: 82,
    hint: 'Sorot senter teplok ke dasar lumpur dekat delta pulau',
    description: 'Tujuh guci kuno berlapis emas Dinasti Ming tersimpan di dasar lumpur Musi tempat Tan Bun An melompat demi membuktikan cintanya.',
    badge: 'Harta Karun Abadi Kemaro',
  },
  'pahit-lidah': {
    id: 'secret-pahit-lidah',
    storyId: 'pahit-lidah',
    name: 'Prasasti Sumpah Batu Serunting',
    xPercent: 70,
    yPercent: 56,
    hint: 'Arahkan senter ke tebing cadas yang membatu',
    description: 'Aksara Pallawa Sriwijaya kuno memancarkan pendar emas di atas batu cadas, merekam sumpah penyesalan Serunting Sakti.',
    badge: 'Aksara Sumpah Terbuka',
  },
  'buaya-buntung': {
    id: 'secret-buaya-buntung',
    storyId: 'buaya-buntung',
    name: 'Kalung Mas Suci Buaya Buntung',
    xPercent: 28,
    yPercent: 68,
    hint: 'Sorot celah akar bakau nipah di tepi sungai Musi',
    description: 'Kilau kalung mas kuno pemberian bangsawan Palembang memancar di antara bayangan rawa nipah, pertanda sumpah persaudaraan manusia dan sungai.',
    badge: 'Tanda Janji Musi',
  },
};

interface WaterRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
  color: string;
}

export function MusiCruiseDiorama({ onNodeSelect, onOpenStoryteller, onOpenPlanner }: MusiCruiseDioramaProps) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isCruising, setIsCruising] = useState<boolean>(false);
  const [autoCruise, setAutoCruise] = useState<boolean>(false);
  const [audioActive, setAudioActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [selectedHotspot, setSelectedHotspot] = useState<FolkloreHotspot | null>(null);
  const [inspectingRelic, setInspectingRelic] = useState<FolkloreRelic | null>(null);
  const [narrationStep, setNarrationStep] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Immersive Controls State
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [weather, setWeather] = useState<MusiWeatherType>('senja');
  const [torchActive, setTorchActive] = useState<boolean>(true);
  const [torchPos, setTorchPos] = useState<{ x: number; y: number }>({ x: 50, y: 55 });
  const [revealedSecret, setRevealedSecret] = useState<FolkloreSecret | null>(null);
  const [discoveredSecrets, setDiscoveredSecrets] = useState<string[]>([]);
  const [isSecretModalOpen, setIsSecretModalOpen] = useState<boolean>(false);
  const [isPhygitalOpen, setIsPhygitalOpen] = useState<boolean>(false);
  const [gyroActive, setGyroActive] = useState<boolean>(false);
  const [gyroSupported, setGyroSupported] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [dioramaTilt, setDioramaTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [collectedRelics, setCollectedRelics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('siguntang_collected_folklore_relics');
      return saved ? JSON.parse(saved) : ['relic-kembang-dadar'];
    } catch {
      return ['relic-kembang-dadar'];
    }
  });
  const [claimedNotice, setClaimedNotice] = useState<string | null>(null);

  const dioramaContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ripplesRef = useRef<WaterRipple[]>([]);
  const rainDropsRef = useRef<{ x: number; y: number; speed: number; len: number }[]>([]);

  const activeStory: FolkloreStory = MUSI_FOLKLORE_EXPEDITION[currentIdx];
  const activeSecret = FOLKLORE_SECRETS[activeStory.id];

  // Check device orientation availability
  useEffect(() => {
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      setGyroSupported(true);
    }
  }, []);

  // Safe Haptic feedback
  const triggerHaptic = useCallback((pattern: number[]) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignored if user hasn't interacted or unsupported
      }
    }
  }, []);

  // Weather switch handler
  const handleSelectWeather = (newWeather: MusiWeatherType) => {
    setWeather(newWeather);
    musiAudio.setWeather(newWeather);
    triggerHaptic([20]);
  };

  // Fullscreen toggle handler
  const handleToggleFullscreen = async () => {
    const el = dioramaContainerRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      try {
        await el.requestFullscreen();
        setIsFullscreen(true);
      } catch {
        setIsFullscreen(true); // Fallback to CSS overlay
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Gyroscope orientation listener
  useEffect(() => {
    if (!gyroActive) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        // Map gamma (-45 to 45) to tilt X (-10 to 10)
        const tiltX = Math.max(-10, Math.min(10, e.gamma * 0.3));
        // Map beta (30 to 70 holding phone) to tilt Y (-8 to 8)
        const tiltY = Math.max(-8, Math.min(8, (e.beta - 45) * 0.3));

        setDioramaTilt({ x: tiltX, y: tiltY });
        musiAudio.updateSpatialPan(tiltX / 10);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [gyroActive]);

  // Request Gyro permission (iOS 13+)
  const handleEnableGyro = async () => {
    if (gyroActive) {
      setGyroActive(false);
      setDioramaTilt({ x: 0, y: 0 });
      return;
    }

    try {
      const DeviceOrientationEventAny = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };

      if (typeof DeviceOrientationEventAny.requestPermission === 'function') {
        const response = await DeviceOrientationEventAny.requestPermission();
        if (response === 'granted') {
          setGyroActive(true);
          triggerHaptic([40]);
        }
      } else {
        setGyroActive(true);
        triggerHaptic([40]);
      }
    } catch (e) {
      console.warn('Gyro permission error:', e);
      setGyroActive(true);
    }
  };

  // Water Ripple creation helper
  const addRipple = useCallback((clientX: number, clientY: number, containerRect: DOMRect) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scaleX = canvas.width / containerRect.width;
    const scaleY = canvas.height / containerRect.height;
    const x = (clientX - containerRect.left) * scaleX;
    const y = (clientY - containerRect.top) * scaleY;

    ripplesRef.current.push({
      x,
      y,
      radius: 4,
      maxRadius: 110 + Math.random() * 40,
      opacity: 0.85,
      speed: 2.5,
      color: weather === 'purnama' ? 'rgba(220, 240, 255,' : 'rgba(255, 215, 120,',
    });

    if (ripplesRef.current.length > 25) {
      ripplesRef.current.shift();
    }

    musiAudio.playSplash(0.8);
    triggerHaptic([15]);
  }, [weather, triggerHaptic]);

  // Initialize rain drops
  useEffect(() => {
    const drops = [];
    for (let i = 0; i < 70; i++) {
      drops.push({
        x: Math.random() * 800,
        y: Math.random() * 500,
        speed: 12 + Math.random() * 8,
        len: 14 + Math.random() * 10,
      });
    }
    rainDropsRef.current = drops;
  }, []);

  // Main Canvas Animation: Waves, Fluid Ripples, Weather Particles & Senter Teplok Beam
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;

      // 1. Water waves surface
      const lines = 6;
      for (let i = 0; i < lines; i++) {
        ctx.beginPath();
        const yBase = height * 0.44 + i * (height * 0.095);
        ctx.moveTo(0, yBase);

        for (let x = 0; x <= width; x += 15) {
          const wave1 = Math.sin(x * 0.008 + time + i * 0.8) * 6;
          const wave2 = Math.cos(x * 0.015 - time * 0.7 + i) * 3;
          ctx.lineTo(x, yBase + wave1 + wave2);
        }

        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        const alpha = 0.08 + i * 0.035;
        if (weather === 'purnama') {
          ctx.fillStyle = `rgba(180, 210, 245, ${alpha * 0.85})`;
        } else if (weather === 'hujan') {
          ctx.fillStyle = `rgba(100, 150, 180, ${alpha * 1.1})`;
        } else if (weather === 'kabut') {
          ctx.fillStyle = `rgba(120, 140, 130, ${alpha * 0.9})`;
        } else {
          // senja
          ctx.fillStyle = i % 2 === 0
            ? `rgba(255, 190, 100, ${alpha * 1.4})`
            : `rgba(0, 180, 160, ${alpha * 0.6})`;
        }
        ctx.fill();
      }

      // 2. Full Moon Specular Shimmer Reflection on Water Center
      if (weather === 'purnama') {
        const moonCenterX = width * 0.52;
        ctx.save();
        for (let m = 0; m < 12; m++) {
          const my = height * 0.48 + m * 24;
          const shimmerWidth = (14 + m * 8) + Math.sin(time * 3 + m) * 10;
          ctx.beginPath();
          ctx.ellipse(moonCenterX, my, shimmerWidth, 2.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${0.18 - m * 0.01})`;
          ctx.fill();
        }
        ctx.restore();
      }

      // 3. Falling Rain Streaks & Spatters (when weather is hujan)
      if (weather === 'hujan') {
        ctx.save();
        ctx.strokeStyle = 'rgba(180, 210, 240, 0.45)';
        ctx.lineWidth = 1.2;

        rainDropsRef.current.forEach((drop) => {
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - 3, drop.y + drop.len);
          ctx.stroke();

          drop.y += drop.speed;
          drop.x -= 1.5;

          if (drop.y > height) {
            drop.y = -10;
            drop.x = Math.random() * width;

            // Occasional mini droplet ripple on water contact
            if (Math.random() < 0.25) {
              ripplesRef.current.push({
                x: drop.x,
                y: height * 0.5 + Math.random() * (height * 0.45),
                radius: 1,
                maxRadius: 28 + Math.random() * 15,
                opacity: 0.6,
                speed: 1.5,
                color: 'rgba(190, 225, 255,',
              });
            }
          }
        });
        ctx.restore();
      }

      // 4. Interactive Fluid Ripples physics loop
      ctx.save();
      for (let r = ripplesRef.current.length - 1; r >= 0; r--) {
        const rip = ripplesRef.current[r];
        rip.radius += rip.speed;
        const lifeRatio = rip.radius / rip.maxRadius;
        const currentAlpha = Math.max(0, rip.opacity * (1 - lifeRatio));

        if (lifeRatio >= 1 || currentAlpha <= 0.01) {
          ripplesRef.current.splice(r, 1);
          continue;
        }

        ctx.beginPath();
        // Elliptical perspective ripple
        ctx.ellipse(rip.x, rip.y, rip.radius * 1.6, rip.radius * 0.55, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `${rip.color} ${currentAlpha})`;
        ctx.lineWidth = Math.max(0.8, 2.2 * (1 - lifeRatio));
        ctx.stroke();
      }
      ctx.restore();

      // 5. River Mist & Ambient Glow Particles
      const particleColor = weather === 'purnama'
        ? 'rgba(210, 230, 255, 0.5)'
        : weather === 'kabut'
        ? 'rgba(180, 200, 190, 0.4)'
        : 'rgba(251, 191, 36, 0.45)';

      for (let p = 0; p < 18; p++) {
        const px = ((Math.sin(p * 99 + time * 0.35) * 0.5 + 0.5) * width);
        const py = height * 0.38 + ((Math.cos(p * 47 + time * 0.25) * 0.5 + 0.5) * height * 0.58);
        const radius = (Math.sin(p + time) * 0.5 + 1.2);

        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      }

      // 6. Volumetric Fog Waves for "kabut"
      if (weather === 'kabut') {
        ctx.save();
        const fogAlpha = 0.22 + Math.sin(time) * 0.05;
        const fogGrad = ctx.createLinearGradient(0, height * 0.3, 0, height);
        fogGrad.addColorStop(0, 'rgba(200, 220, 215, 0)');
        fogGrad.addColorStop(0.5, `rgba(210, 225, 220, ${fogAlpha})`);
        fogGrad.addColorStop(1, 'rgba(190, 210, 205, 0.05)');
        ctx.fillStyle = fogGrad;
        ctx.fillRect(0, height * 0.3, width, height * 0.7);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [weather]);

  // Audio start/stop toggle
  const handleToggleAudio = async () => {
    if (!audioActive) {
      const ok = await musiAudio.start();
      if (ok) {
        setAudioActive(true);
        setIsMuted(false);
        musiAudio.setWeather(weather);
        triggerHaptic([30]);
      }
    } else {
      const muted = musiAudio.toggleMute();
      setIsMuted(muted);
      triggerHaptic([20]);
    }
  };

  // Navigate between folklore halts
  const navigateToStory = (targetIdx: number) => {
    if (targetIdx === currentIdx || isCruising) return;
    setIsCruising(true);
    musiAudio.setCruising(true);
    setNarrationStep(0);
    setSelectedHotspot(null);
    setRevealedSecret(null);
    triggerHaptic([25, 40]);

    setTimeout(() => {
      setCurrentIdx(targetIdx);
      setIsCruising(false);
      musiAudio.setCruising(false);
      musiAudio.playArrivalChime(MUSI_FOLKLORE_EXPEDITION[targetIdx].ambientBgmFreq);
      triggerHaptic([40, 60]);
    }, 1400);
  };

  // Auto cruise loop
  useEffect(() => {
    if (!autoCruise) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % MUSI_FOLKLORE_EXPEDITION.length);
      musiAudio.playArrivalChime();
    }, 14000);
    return () => clearInterval(interval);
  }, [autoCruise]);

  // Handle Speech Narration with walkie-talkie radio beep
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Fitur speech browser tidak didukung di perangkat ini.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    musiAudio.playRadioBeep();
    const currentText = activeStory.narrationScript[narrationStep];
    const utterance = new SpeechSynthesisUtterance(currentText);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95;
    utterance.pitch = 0.95;

    utterance.onend = () => {
      setIsSpeaking(false);
      musiAudio.playRadioBeep();
      if (narrationStep < activeStory.narrationScript.length - 1) {
        setNarrationStep((s) => s + 1);
      }
    };

    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    triggerHaptic([30]);
  };

  // Claim Relic to STC Passport
  const handleClaimRelic = (relicId: string) => {
    if (!collectedRelics.includes(relicId)) {
      const updated = [...collectedRelics, relicId];
      setCollectedRelics(updated);
      try {
        localStorage.setItem('siguntang_collected_folklore_relics', JSON.stringify(updated));
      } catch (e) {
        console.warn('Storage failed:', e);
      }
      musiAudio.playRelicInspectSound();
      triggerHaptic([40, 60, 90]);
      setClaimedNotice(`Pusaka "${activeStory.relic.name}" berhasil dicatat ke Paspor Digital STC!`);
      setTimeout(() => setClaimedNotice(null), 4000);
    }
  };

  // Claim Hidden Folklore Secret
  const handleClaimSecret = (sec: FolkloreSecret) => {
    if (!discoveredSecrets.includes(sec.id)) {
      setDiscoveredSecrets((prev) => [...prev, sec.id]);
      musiAudio.playRelicInspectSound();
      triggerHaptic([50, 80, 110]);
      setClaimedNotice(`Misteri "${sec.badge}" Terkuak! +50 Skor Kurasi Heritage`);
      setTimeout(() => setClaimedNotice(null), 4000);
      setIsSecretModalOpen(false);
    }
  };

  // Mouse & Touch tracking for Senter Teplok + 3D Parallax Tilt
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    setTorchPos({ x: xPct, y: yPct });

    // Desktop mouse tilt parallax (if gyro is off)
    if (!gyroActive) {
      const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
      const yRatio = (e.clientY - rect.top) / rect.height - 0.5;
      const tiltX = xRatio * 10;
      const tiltY = -yRatio * 8;
      setDioramaTilt({ x: tiltX, y: tiltY });
      musiAudio.updateSpatialPan(xRatio * 1.5);
    }

    // Check proximity to active hidden secret
    if (activeSecret && torchActive) {
      const dx = xPct - activeSecret.xPercent;
      const dy = yPct - activeSecret.yPercent;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 15) {
        if (!revealedSecret || revealedSecret.id !== activeSecret.id) {
          setRevealedSecret(activeSecret);
          triggerHaptic([25, 45]);
        }
      } else if (distance > 22 && revealedSecret) {
        setRevealedSecret(null);
      }
    }
  };

  const handlePointerLeave = () => {
    if (!gyroActive) {
      setDioramaTilt({ x: 0, y: 0 });
      musiAudio.updateSpatialPan(0);
    }
    setRevealedSecret(null);
  };

  // Water click/touch handler to spawn interactive fluid ripples
  const handleDioramaPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    addRipple(e.clientX, e.clientY, rect);
  };

  return (
    <section
      id="expedition"
      ref={dioramaContainerRef}
      className={`relative py-16 bg-[#080503] text-[#f5f2ed] select-none transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto p-4 md:p-8 bg-black' : ''
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-950/40 rounded-full blur-[160px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full mb-3">
              <Compass size={14} className="text-amber-400 animate-spin-slow" />
              <span className="text-[11px] font-bold tracking-widest text-amber-400 uppercase">
                Ekspedisi Virtual Sungai Musi • Immersive Native
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white">
              Jelajah Folklore <span className="text-amber-400 italic">Diorama Musi</span>
            </h2>
            <p className="text-sm md:text-base text-stone-400 mt-2 max-w-2xl">
              Pengalaman diorama sungai 3D realistis tanpa VR: audio spasial 360°, senter teplok pembuka misteri, sensor gerak gyroscope HP, dan fisika riak air interaktif.
            </p>
          </div>

          {/* Quick HUD controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Audio Toggle */}
            <button
              onClick={handleToggleAudio}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all text-xs font-semibold ${
                audioActive && !isMuted
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                  : 'bg-white/5 border-white/10 text-stone-400 hover:text-white'
              }`}
            >
              {audioActive && !isMuted ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{audioActive && !isMuted ? 'Audio Spasial Nyala' : 'Aktifkan Suara Musi'}</span>
            </button>

            {/* Gyro Sensor Button */}
            {gyroSupported && (
              <button
                onClick={handleEnableGyro}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all text-xs font-semibold ${
                  gyroActive
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                    : 'bg-white/5 border-white/10 text-stone-400 hover:text-white'
                }`}
                title="Gunakan kemiringan HP untuk menggerakkan kamera diorama"
              >
                <Smartphone size={16} />
                <span>{gyroActive ? 'Gyro HP Aktif' : 'Gerak Gyro'}</span>
              </button>
            )}

            {/* AI Musi Storyteller Button */}
            {onOpenStoryteller && (
              <button
                onClick={() => onOpenStoryteller(weather)}
                className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-600/30 to-amber-700/20 hover:from-amber-600/40 hover:to-amber-700/30 border border-amber-500/40 rounded-xl text-xs font-semibold text-amber-200 shadow-sm transition-all cursor-pointer"
                title="Buka Pencerita Lisan AI Musi Berbasis Persona"
              >
                <Sparkles size={14} className="text-amber-400" />
                <span>AI Storyteller</span>
              </button>
            )}

            {/* Smart Musi Cruise Planner Button */}
            {onOpenPlanner && (
              <button
                onClick={onOpenPlanner}
                className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600/30 to-teal-700/20 hover:from-emerald-600/40 hover:to-teal-700/30 border border-emerald-500/40 rounded-xl text-xs font-semibold text-emerald-200 shadow-sm transition-all cursor-pointer"
                title="Rancang Rute Pelayaran & Emisi Karbon STC"
              >
                <Compass size={14} className="text-emerald-400" />
                <span>Cruise Planner</span>
              </button>
            )}

            {/* Phygital IoT Console Button */}
            <button
              onClick={() => setIsPhygitalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 rounded-xl text-xs font-semibold text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all cursor-pointer"
              title="Buka Konsol Jembatan Phygital IoT & Digital Twin"
            >
              <Cpu size={16} className="text-amber-400 animate-pulse" />
              <span>Phygital IoT</span>
            </button>

            {/* Theater / Fullscreen Toggle */}
            <button
              onClick={handleToggleFullscreen}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-stone-300 hover:text-white transition-colors"
              title={isFullscreen ? 'Keluar Mode Layar Penuh' : 'Mode Bioskop Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>

            {/* Passport STC status */}
            <div className="flex items-center gap-2 px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs">
              <Award size={15} className="text-amber-400" />
              <span className="text-stone-300">
                Pusaka: <strong className="text-amber-400">{collectedRelics.length}/5</strong>
              </span>
            </div>
          </div>
        </div>

        {/* VIEW MODE SELECTOR: 3D SPATIAL WEBGL vs 2.5D SINEMATIK */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 p-2 bg-[#120c08] border border-amber-500/30 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2.5 pl-2">
            <span className="font-mono text-[10px] text-amber-400 font-bold tracking-wider uppercase">
              Engine Viewport:
            </span>
            <span className="text-xs text-stone-300 font-medium">
              {viewMode === '3d' 
                ? '3D Spatial WebGL (Three.js Diroama • Orbit 360° • Pendar Ampera)' 
                : 'Sinematik 2.5D Parallax & Senter Teplok Explorer'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-xl border border-white/10 shrink-0">
            <button
              onClick={() => {
                setViewMode('3d');
                triggerHaptic([30]);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === '3d'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 shadow-md font-extrabold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Box size={14} className={viewMode === '3d' ? 'text-stone-950 animate-pulse' : 'text-amber-400'} />
              <span>Diorama 3D Spatial</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-black/30 text-stone-950 font-mono font-black">PRO</span>
            </button>
            <button
              onClick={() => {
                setViewMode('2d');
                triggerHaptic([30]);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === '2d'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 shadow-md font-extrabold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Layers size={14} />
              <span>Sinematik 2.5D</span>
            </button>
          </div>
        </div>

        {/* WEATHER & TIME-OF-DAY ENGINE BAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#120c08] border border-amber-900/30 rounded-2xl px-4 py-2.5 mb-6 text-xs">
          <div className="flex items-center gap-2 text-stone-400">
            <span className="font-mono text-[10px] tracking-wider uppercase text-amber-400 font-bold">
              Cuaca & Waktu Musi:
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => handleSelectWeather('senja')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
                weather === 'senja'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-white/5 border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Sunset size={14} className="text-amber-400" />
              <span>Senja Emas</span>
            </button>

            <button
              onClick={() => handleSelectWeather('kabut')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
                weather === 'kabut'
                  ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                  : 'bg-white/5 border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <CloudFog size={14} className="text-teal-300" />
              <span>Kabut Malam</span>
            </button>

            <button
              onClick={() => handleSelectWeather('hujan')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
                weather === 'hujan'
                  ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                  : 'bg-white/5 border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <CloudRain size={14} className="text-blue-300" />
              <span>Hujan Musi</span>
            </button>

            <button
              onClick={() => handleSelectWeather('purnama')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
                weather === 'purnama'
                  ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300'
                  : 'bg-white/5 border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Moon size={14} className="text-indigo-300" />
              <span>Bulan Purnama</span>
            </button>
          </div>

          {/* Torchlight toggle button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setTorchActive(!torchActive);
                triggerHaptic([20]);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                torchActive
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.25)]'
                  : 'bg-white/5 border-white/10 text-stone-400'
              }`}
              title="Sorotkan senter untuk menyingkap rahasia folklore tersembunyi"
            >
              <Flame size={14} className={torchActive ? 'text-amber-400 animate-bounce' : 'text-stone-500'} />
              <span>{torchActive ? 'Senter Teplok Aktif' : 'Nyalakan Senter'}</span>
            </button>
          </div>
        </div>

        {/* CRUISE NAVIGATOR BAR */}
        <div className="bg-[#140e0a] border border-amber-500/20 rounded-2xl p-4 md:p-5 mb-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Live Navigation Status */}
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center shadow-lg border border-amber-400/30 shrink-0">
                <Navigation
                  size={22}
                  className={`text-white transition-transform duration-700 ${
                    isCruising ? 'rotate-45 scale-110' : ''
                  }`}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded">
                    {isCruising ? 'SEDANG BERLAYAR...' : 'BERLABUH DI DERMAGA'}
                  </span>
                  <span className="text-xs font-mono text-stone-400">
                    KM {activeStory.riverKm} • {activeStory.atmosphereLabel}
                  </span>
                </div>
                <h4 className="font-serif text-lg font-bold text-white mt-1">
                  Halte {currentIdx + 1}: {activeStory.title}
                </h4>
              </div>
            </div>

            {/* Stepper Waypoint Path on Musi */}
            <div className="flex items-center justify-between gap-1 md:gap-2 w-full lg:w-3/5 overflow-x-auto no-scrollbar py-2">
              {MUSI_FOLKLORE_EXPEDITION.map((story, idx) => {
                const isActive = idx === currentIdx;
                const isVisited = collectedRelics.includes(story.relic.id);
                return (
                  <button
                    key={story.id}
                    onClick={() => navigateToStory(idx)}
                    disabled={isCruising}
                    className={`group relative flex flex-col items-center min-w-[85px] md:min-w-[110px] p-2.5 rounded-xl transition-all border ${
                      isActive
                        ? 'bg-amber-500/20 border-amber-400/60 shadow-[0_0_20px_rgba(251,191,36,0.25)]'
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <div
                        className={`w-3 h-3 rounded-full transition-transform ${
                          isActive
                            ? 'bg-amber-400 ring-4 ring-amber-400/20 scale-125'
                            : isVisited
                            ? 'bg-emerald-400'
                            : 'bg-stone-600'
                        }`}
                      />
                      {isVisited && <CheckCircle2 size={10} className="text-emerald-400" />}
                    </div>
                    <span
                      className={`text-[11px] font-semibold text-center line-clamp-1 ${
                        isActive ? 'text-amber-300' : 'text-stone-400 group-hover:text-stone-200'
                      }`}
                    >
                      {story.title}
                    </span>
                    <span className="text-[9px] font-mono text-stone-500 mt-0.5">
                      KM {story.riverKm}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() =>
                  navigateToStory(
                    (currentIdx - 1 + MUSI_FOLKLORE_EXPEDITION.length) % MUSI_FOLKLORE_EXPEDITION.length
                  )
                }
                disabled={isCruising}
                className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl disabled:opacity-40 transition-colors"
                title="Dermaga Sebelumnya"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={() =>
                  navigateToStory((currentIdx + 1) % MUSI_FOLKLORE_EXPEDITION.length)
                }
                disabled={isCruising}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                <span>Berlayar</span>
                <ChevronRight size={16} />
              </button>

              <button
                onClick={() => setAutoCruise(!autoCruise)}
                className={`p-2.5 border rounded-xl transition-colors ${
                  autoCruise
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-white/5 border-white/10 text-stone-400 hover:text-white'
                }`}
                title="Auto Cruise Tour"
              >
                {autoCruise ? <Pause size={18} /> : <Play size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* MAIN DIORAMA VIEWPORT & EXPERIENCE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Diorama Stage (Col 8) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {viewMode === '3d' ? (
              <Musi3DDiorama onNodeSelect={onNodeSelect} />
            ) : (
              <div
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onPointerDown={handleDioramaPointerDown}
                className="relative w-full h-[490px] md:h-[580px] rounded-3xl overflow-hidden border border-amber-500/30 bg-black shadow-2xl transition-all cursor-crosshair touch-none"
                style={{
                  perspective: '1000px',
                }}
              >
                {/* Dynamic Sky Gradient according to Weather */}
              <div
                className={`absolute inset-0 transition-colors duration-1000 ${
                  weather === 'senja'
                    ? activeStory.backdropVisual.skyGradient
                    : weather === 'kabut'
                    ? 'bg-gradient-to-b from-[#0c1815] via-[#10221f] to-[#040807]'
                    : weather === 'hujan'
                    ? 'bg-gradient-to-b from-[#080d14] via-[#0f1724] to-[#03060a]'
                    : 'bg-gradient-to-b from-[#0b0e1e] via-[#111833] to-[#05060d]'
                }`}
              />

              {/* Parallax Stars/Night glow */}
              <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

              {/* Full Moon Orb in sky when purnama */}
              {weather === 'purnama' && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none">
                  <div className="w-20 h-20 rounded-full bg-stone-100 shadow-[0_0_60px_rgba(255,255,255,0.7)] opacity-90" />
                </div>
              )}

              {/* Interactive River Canvas (Waves, Ripples, Rain) */}
              <canvas
                ref={canvasRef}
                width={800}
                height={500}
                className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-95"
              />

              {/* SENTER TEPLOK VOLUMETRIC SPOTLIGHT SHADER MASK */}
              {torchActive && (
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle 170px at ${torchPos.x}% ${torchPos.y}%, rgba(255, 235, 170, 0.22) 0%, rgba(251, 191, 36, 0.08) 55%, rgba(0, 0, 0, 0.45) 100%)`,
                  }}
                >
                  {/* Subtle target reticle around beam center */}
                  <div
                    className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-300/40 pointer-events-none opacity-60 animate-ping-slow"
                    style={{
                      left: `${torchPos.x}%`,
                      top: `${torchPos.y}%`,
                    }}
                  />
                </div>
              )}

              {/* Cruising Speed Blur Overlay */}
              <AnimatePresence>
                {isCruising && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-40 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                      className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-400 rounded-full mb-4"
                    />
                    <p className="font-serif italic text-lg text-amber-200">
                      Membelah arus riak Sungai Musi...
                    </p>
                    <span className="text-xs font-mono text-stone-400 mt-1">
                      Menuju {activeStory.title} (KM {activeStory.riverKm})
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 3D TILT LAYER: Diorama Landmarks, Relic Orb, & Hotspots */}
              <div
                className="absolute inset-0 transition-transform duration-200 ease-out flex items-center justify-center pointer-events-none"
                style={{
                  transform: `rotateY(${dioramaTilt.x}deg) rotateX(${dioramaTilt.y}deg)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Central Diorama Scene Iconography */}
                <div className="absolute bottom-28 w-full flex flex-col items-center justify-center">
                  <motion.div
                    key={activeStory.id}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative flex flex-col items-center"
                  >
                    {/* Glowing Aura */}
                    <div
                      className="w-48 h-48 rounded-full blur-3xl opacity-50 absolute"
                      style={{ backgroundColor: activeStory.relic.glowColor }}
                    />

                    {/* Landmark badge */}
                    <div className="relative px-4 py-2 bg-black/60 border border-white/20 backdrop-blur-md rounded-2xl text-center shadow-xl mb-3">
                      <span className="text-[11px] font-mono tracking-wider text-amber-300">
                        {activeStory.backdropVisual.keyLandmark}
                      </span>
                    </div>

                    {/* Central 3D Relic Orb */}
                    <div
                      onClick={() => {
                        setInspectingRelic(activeStory.relic);
                        musiAudio.playRelicInspectSound();
                        triggerHaptic([30, 50]);
                      }}
                      className="group cursor-pointer relative w-28 h-28 md:w-36 md:h-36 rounded-full border-2 flex items-center justify-center transition-all duration-500 hover:scale-110 pointer-events-auto"
                      style={{
                        borderColor: activeStory.relic.glowColor,
                        boxShadow: `0 0 35px ${activeStory.relic.glowColor}66`,
                        background: 'radial-gradient(circle, rgba(20,20,20,0.8) 0%, rgba(5,5,5,0.95) 100%)',
                      }}
                    >
                      <Sparkles
                        size={36}
                        className="animate-pulse"
                        style={{ color: activeStory.relic.glowColor }}
                      />
                      <div className="absolute -bottom-7 px-3 py-1 bg-stone-900 border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider text-stone-200 group-hover:text-amber-400 group-hover:border-amber-400 whitespace-nowrap transition-colors">
                        Klik Periksa Pusaka
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* HIDDEN FOLKLORE SECRET (Revealed by Senter Teplok) */}
                {activeSecret && (
                  <div
                    className={`absolute z-30 pointer-events-auto transition-all duration-500 ${
                      revealedSecret?.id === activeSecret.id
                        ? 'opacity-100 scale-100'
                        : 'opacity-15 scale-75 hover:opacity-50'
                    }`}
                    style={{
                      left: `${activeSecret.xPercent}%`,
                      top: `${activeSecret.yPercent}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <button
                      onClick={() => {
                        setIsSecretModalOpen(true);
                        triggerHaptic([40, 70]);
                      }}
                      className="relative group p-2 rounded-2xl bg-amber-950/80 border-2 border-amber-400/80 shadow-[0_0_30px_rgba(251,191,36,0.6)] animate-pulse flex items-center gap-2"
                    >
                      <Eye size={18} className="text-amber-300" />
                      <div className="text-left pr-2">
                        <span className="text-[9px] font-mono uppercase text-amber-300 block font-bold">
                          {revealedSecret ? 'Misteri Terkuak!' : 'Sorot Senter Disini'}
                        </span>
                        <span className="text-[11px] font-serif text-white font-bold whitespace-nowrap">
                          {activeSecret.name}
                        </span>
                      </div>
                    </button>
                  </div>
                )}

                {/* Interactive Diorama Hotspots */}
                {activeStory.hotspots.map((hs) => (
                  <button
                    key={hs.id}
                    onClick={() => {
                      setSelectedHotspot(hs);
                      triggerHaptic([20]);
                    }}
                    className="absolute z-20 group transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 focus:outline-none pointer-events-auto"
                    style={{
                      left: `${hs.xPercent}%`,
                      top: `${hs.yPercent}%`,
                    }}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-amber-400 opacity-40" />
                      <div className="w-8 h-8 rounded-full bg-stone-900/90 border-2 border-amber-400 text-amber-300 flex items-center justify-center shadow-lg group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
                        <Info size={14} />
                      </div>
                    </div>
                    <div className="absolute top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-stone-100 text-[10px] font-semibold px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none border border-white/10">
                      {hs.title}
                    </div>
                  </button>
                ))}
              </div>

              {/* FOREGROUND: Perahu Ketek Haluan Deck & Cockpit */}
              <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
                <div className="relative h-28 md:h-36 bg-gradient-to-t from-[#160d07] via-[#21140c] to-transparent border-t border-amber-900/40">
                  <div className="max-w-4xl mx-auto h-full flex items-end justify-between px-6 pb-4">
                    {/* Brass lantern with flicker on left bow */}
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-14 bg-stone-950/80 border border-amber-600/50 rounded-t-lg flex flex-col items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                        <Flame size={18} className="text-amber-400 animate-bounce" />
                        <span className="text-[7px] font-mono text-amber-300 uppercase tracking-tighter mt-1">
                          Teplok
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-stone-400 hidden sm:block">
                        KEMUDI KETEK MUSI
                        <br />
                        <span className="text-amber-400 font-bold">Kayu Ulin Musi • KM {activeStory.riverKm}</span>
                      </div>
                    </div>

                    {/* Hint for interactive ripple & secret */}
                    <div className="text-center hidden md:block">
                      <span className="text-[10px] font-mono text-amber-300/80 px-3 py-1 bg-black/40 rounded-full border border-white/10">
                        Sentuh atau klik air sungai untuk memicu riak ombak
                      </span>
                    </div>

                    {/* Coordinates & Compass Head */}
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-amber-400/90">
                        {activeStory.coordinates.lat.toFixed(4)}° S, {activeStory.coordinates.lng.toFixed(4)}° E
                      </div>
                      <div className="text-[11px] font-bold text-stone-200">
                        {activeStory.locationName}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top-Right Diorama Atmosphere badge */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2 pointer-events-none">
                <div className="px-3 py-1.5 bg-black/60 border border-white/15 backdrop-blur-md rounded-xl text-xs font-mono text-stone-300">
                  {activeStory.atmosphereLabel}
                </div>
              </div>
            </div>
            )}

            {/* Hotspot Lore Detail Callout (When selected) */}
            <AnimatePresence>
              {selectedHotspot && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-[#19120c] border border-amber-500/30 rounded-2xl p-5 shadow-xl relative"
                >
                  <button
                    onClick={() => setSelectedHotspot(null)}
                    className="absolute top-3 right-3 text-stone-400 hover:text-white p-1"
                  >
                    ✕
                  </button>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                        Fokus Observasi Diorama
                      </span>
                      <h4 className="font-serif text-lg font-bold text-white">
                        {selectedHotspot.title}
                      </h4>
                      <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                        {selectedHotspot.description}
                      </p>
                      <div className="mt-3 p-2.5 bg-black/40 border-l-2 border-amber-400 rounded-r-lg">
                        <p className="text-[11px] italic text-amber-200">
                          Catatan Budaya: {selectedHotspot.culturalNote}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Story Narrative & Folklore Teleprompter Hub (Col 4) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Palembang Folkloric Quote Card */}
            <div className="bg-[#140e0a] border border-amber-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

              <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-bold block mb-2">
                Tutur Lisan Tradisi Musi
              </span>

              <blockquote className="font-serif text-lg font-semibold italic text-amber-100 leading-snug mb-3">
                {activeStory.palembangQuote}
              </blockquote>

              <p className="text-xs text-stone-400 border-t border-white/10 pt-3">
                {activeStory.quoteMeaning}
              </p>
            </div>

            {/* Interactive Story Narrative Teleprompter */}
            <div className="bg-[#140e0a] border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Layers size={16} className="text-amber-400" />
                    <h3 className="font-serif text-lg font-bold text-white">
                      Narasi Pelayaran
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-stone-400">
                    Bait {narrationStep + 1} dari {activeStory.narrationScript.length}
                  </span>
                </div>

                {/* Script Display */}
                <div className="min-h-[140px] flex items-center justify-center p-4 bg-black/40 border border-white/5 rounded-2xl mb-4">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={`${activeStory.id}-${narrationStep}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="font-serif text-sm md:text-base text-stone-200 leading-relaxed text-center"
                    >
                      “{activeStory.narrationScript[narrationStep]}”
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              {/* Narration Controls */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => setNarrationStep((s) => Math.max(0, s - 1))}
                    disabled={narrationStep === 0}
                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Bait Sebelumnya
                  </button>
                  <button
                    onClick={() =>
                      setNarrationStep((s) =>
                        Math.min(activeStory.narrationScript.length - 1, s + 1)
                      )
                    }
                    disabled={narrationStep === activeStory.narrationScript.length - 1}
                    className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition-colors"
                  >
                    Bait Selanjutnya
                  </button>
                </div>

                <button
                  onClick={handleToggleSpeech}
                  className={`w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isSpeaking
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
                      : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                  }`}
                >
                  <Radio size={15} />
                  <span>{isSpeaking ? 'Hentikan Suara Tutur' : 'Radio Pemandu Perahu (AI)'}</span>
                </button>
              </div>
            </div>

            {/* Relic Preview Card & STC Blockchain Badge */}
            <div className="bg-gradient-to-br from-[#1a120c] to-[#120a06] border border-amber-500/30 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  Pusaka Folklore STC
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  {collectedRelics.includes(activeStory.relic.id) ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Terekam di STC
                    </span>
                  ) : (
                    'Belum Diklaim'
                  )}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 shadow-lg"
                  style={{
                    borderColor: activeStory.relic.glowColor,
                    backgroundColor: `${activeStory.relic.glowColor}15`,
                  }}
                >
                  <Sparkles size={24} style={{ color: activeStory.relic.glowColor }} />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-white">
                    {activeStory.relic.name}
                  </h4>
                  <p className="text-xs text-amber-300/80 font-serif italic">
                    {activeStory.relic.titlePalembang}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setInspectingRelic(activeStory.relic);
                    musiAudio.playRelicInspectSound();
                    triggerHaptic([30, 40]);
                  }}
                  className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-semibold text-white transition-colors"
                >
                  Inspect 3D Relic
                </button>
                <button
                  onClick={() => handleClaimRelic(activeStory.relic.id)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    collectedRelics.includes(activeStory.relic.id)
                      ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300 cursor-default'
                      : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md'
                  }`}
                >
                  {collectedRelics.includes(activeStory.relic.id)
                    ? 'Cap Tersimpan'
                    : 'Klaim Paspor STC'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Claim Notification Toast */}
        <AnimatePresence>
          {claimedNotice && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500 text-emerald-200 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3"
            >
              <Award size={20} className="text-emerald-400 shrink-0" />
              <p className="text-xs font-semibold">{claimedNotice}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HIDDEN SECRET DISCOVERY MODAL */}
        <AnimatePresence>
          {isSecretModalOpen && activeSecret && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#140e0a] border border-amber-400/60 rounded-3xl max-w-lg w-full p-6 md:p-8 relative shadow-2xl overflow-hidden"
              >
                <button
                  onClick={() => setIsSecretModalOpen(false)}
                  className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full bg-white/5 border border-white/10"
                >
                  ✕
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
                    <Eye size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                      Rahasia Tersorot Senter Teplok
                    </span>
                    <h3 className="font-serif text-xl font-bold text-white">
                      {activeSecret.name}
                    </h3>
                  </div>
                </div>

                <div className="p-4 bg-black/50 border border-white/10 rounded-2xl mb-5">
                  <p className="text-sm text-stone-200 leading-relaxed font-serif italic mb-2">
                    "{activeSecret.description}"
                  </p>
                  <span className="text-[11px] font-mono text-amber-300">
                    Badge: {activeSecret.badge}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setIsSecretModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-stone-300 hover:bg-white/5"
                  >
                    Tutup
                  </button>
                  <button
                    onClick={() => handleClaimSecret(activeSecret)}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                  >
                    {discoveredSecrets.includes(activeSecret.id)
                      ? 'Sudah Dicatat'
                      : 'Simpan ke Buku Observasi (+50 STC)'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D RELIC INSPECTOR MODAL */}
        <AnimatePresence>
          {inspectingRelic && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#140e0a] border border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 md:p-8 relative shadow-2xl overflow-hidden"
              >
                {/* Background glow */}
                <div
                  className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-40"
                  style={{ backgroundColor: inspectingRelic.glowColor }}
                />

                <button
                  onClick={() => setInspectingRelic(null)}
                  className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full bg-white/5 border border-white/10"
                >
                  ✕
                </button>

                <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
                  {/* Visual Relic Orb */}
                  <div
                    className="w-40 h-40 rounded-full border-2 flex items-center justify-center shrink-0 shadow-2xl relative animate-pulse-slow"
                    style={{
                      borderColor: inspectingRelic.glowColor,
                      boxShadow: `0 0 50px ${inspectingRelic.glowColor}55`,
                      backgroundColor: '#0a0705',
                    }}
                  >
                    <Sparkles size={64} style={{ color: inspectingRelic.glowColor }} />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block mb-1">
                      Relik Pusaka Asli Palembang
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white">
                      {inspectingRelic.name}
                    </h3>
                    <p className="text-sm font-serif italic text-amber-300/90 mb-3">
                      {inspectingRelic.titlePalembang}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-stone-300">
                      <MapPin size={12} className="text-amber-400" />
                      <span>{inspectingRelic.origin}</span>
                    </div>
                  </div>
                </div>

                {/* Lore description */}
                <div className="space-y-4 text-xs md:text-sm text-stone-300 leading-relaxed border-t border-white/10 pt-4 mb-6">
                  <p>{inspectingRelic.lore}</p>
                  <div className="p-4 bg-amber-500/10 border-l-4 border-amber-400 rounded-r-xl">
                    <strong className="text-amber-300 block mb-1">Pesan Moral & Filosofi Musi:</strong>
                    <p className="italic text-stone-200">{inspectingRelic.moralLesson}</p>
                  </div>
                </div>

                {/* Blockchain Proof Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
                  <div className="font-mono text-[11px] text-stone-400">
                    Hash STC: <span className="text-amber-300">{inspectingRelic.stcHash}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleClaimRelic(inspectingRelic.id);
                      setInspectingRelic(null);
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                  >
                    {collectedRelics.includes(inspectingRelic.id)
                      ? 'Telah Tercatat di Paspor'
                      : 'Klaim ke Paspor STC'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phygital IoT Console & Hardware Twin Modal */}
        <PhygitalConsoleModal
          isOpen={isPhygitalOpen}
          onClose={() => setIsPhygitalOpen(false)}
          currentWeather={weather}
          onWeatherChange={handleSelectWeather}
        />
      </div>
    </section>
  );
}
