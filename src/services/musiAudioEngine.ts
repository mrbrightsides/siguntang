/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MusiWeatherType = 'senja' | 'kabut' | 'hujan' | 'purnama';

export interface MusiAudioPreset {
  id: string;
  name: string;
  desc: string;
  url: string;
}

export const MUSI_AUDIO_PRESETS: MusiAudioPreset[] = [
  {
    id: 'waves-natural',
    name: 'Desiran Ombak & Gelombang Tenang (Rekomendasi)',
    desc: 'Rekaman desiran gelombang air alami yang lembut dan menenangkan (Natural Wave Ambiance)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Waves.ogg',
  },
  {
    id: 'brook-ripples',
    name: 'Gemericik Aliran Sungai Jernih',
    desc: 'Suara gemericik aliran sungai tenang berbatuan alami (Gentle Brook Sound)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Brook_sound.ogg',
  },
  {
    id: 'river-current',
    name: 'Deru Arus Sungai Alami',
    desc: 'Suara gemuruh arus sungai alami yang lebih berbobot (River Current Ambient)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Rivernoise.ogg',
  },
  {
    id: 'sea-gentle',
    name: 'Deburan Ombak Tepian Musi',
    desc: 'Desiran gelombang air tepian sungai lapang (Gentle Shore Waves)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Seasound.ogg',
  },
];

export const DEFAULT_RIVER_AUDIO_URL = 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Waves.ogg';

class MusiAudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private masterGain: GainNode | null = null;

  // Spatial Panner for diorama positioning
  private spatialPanner: StereoPannerNode | PannerNode | null = null;

  // Real Audio Streaming Element (for URL-based waves/ripples)
  private bgAudioEl: HTMLAudioElement | null = null;
  private currentAudioUrl: string = DEFAULT_RIVER_AUDIO_URL;
  private isAudioLoading: boolean = false;
  private audioLoadError: string | null = null;
  private volumeLevel: number = 0.5;

  private isCruising: boolean = false;
  private isMuted: boolean = false;
  private currentWeather: MusiWeatherType = 'senja';
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedUrl = localStorage.getItem('siguntang_musi_audio_url');
        if (savedUrl !== null) {
          this.currentAudioUrl = savedUrl;
        }
      } catch (e) {
        console.warn('Storage read failed:', e);
      }
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private setupBgAudioElement() {
    if (typeof window === 'undefined') return;
    if (!this.bgAudioEl) {
      this.bgAudioEl = new Audio();
      this.bgAudioEl.loop = true;
      this.bgAudioEl.preload = 'auto';
      this.bgAudioEl.crossOrigin = 'anonymous';

      this.bgAudioEl.addEventListener('error', (e) => {
        console.warn('Audio element failed to load stream URL:', this.currentAudioUrl, e);
        this.audioLoadError = 'Gagal memuat URL audio. Pastikan link streaming dapat diakses secara publik.';
        this.isAudioLoading = false;
        this.notify();
      });

      this.bgAudioEl.addEventListener('playing', () => {
        this.isAudioLoading = false;
        this.audioLoadError = null;
        this.notify();
      });

      this.bgAudioEl.addEventListener('waiting', () => {
        this.isAudioLoading = true;
        this.notify();
      });
    }

    if (this.currentAudioUrl) {
      this.bgAudioEl.src = this.currentAudioUrl;
    }
  }

  public async start(): Promise<boolean> {
    try {
      this.initContext();
      if (!this.ctx) return false;
      if (this.isRunning) return true;

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Stereo Panner Node for spatial positioning
      if ('createStereoPanner' in this.ctx) {
        this.spatialPanner = this.ctx.createStereoPanner();
        this.spatialPanner.pan.setValueAtTime(0, this.ctx.currentTime);
      }

      if (this.spatialPanner && this.masterGain) {
        this.spatialPanner.connect(this.masterGain);
      }

      // Start Natural Audio Element Stream (Pure recorded wave/river audio)
      this.setupBgAudioElement();
      if (this.bgAudioEl && this.currentAudioUrl) {
        this.bgAudioEl.volume = this.isMuted ? 0 : this.volumeLevel;
        this.isAudioLoading = true;
        this.bgAudioEl.play().catch((err) => {
          console.warn('HTML Audio playback error:', err);
          this.isAudioLoading = false;
        });
      }

      this.isRunning = true;
      this.notify();
      return true;
    } catch (e) {
      console.warn('Web Audio start prevented or failed:', e);
      return false;
    }
  }

  // Update Custom Water / Wave Audio URL
  public setCustomAudioUrl(url: string) {
    const trimmed = url.trim();
    this.currentAudioUrl = trimmed;
    this.audioLoadError = null;

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('siguntang_musi_audio_url', trimmed);
      } catch (e) {
        console.warn('Storage save failed:', e);
      }
    }

    this.setupBgAudioElement();

    if (this.isRunning && this.bgAudioEl) {
      if (trimmed) {
        this.isAudioLoading = true;
        this.bgAudioEl.src = trimmed;
        this.bgAudioEl.volume = this.isMuted ? 0 : this.volumeLevel;
        this.bgAudioEl.play().catch((err) => {
          console.warn('Audio play error:', err);
          this.isAudioLoading = false;
        });
      } else {
        this.bgAudioEl.pause();
        this.isAudioLoading = false;
      }
    }
    this.notify();
  }

  public getAudioUrl(): string {
    return this.currentAudioUrl;
  }

  public getPresets(): MusiAudioPreset[] {
    return MUSI_AUDIO_PRESETS;
  }

  public isUsingRealAudio(): boolean {
    return !!this.currentAudioUrl;
  }

  public isLoading(): boolean {
    return this.isAudioLoading;
  }

  public getLoadError(): string | null {
    return this.audioLoadError;
  }

  // Update 3D Audio Spatial Pan based on diorama tilt / cursor position (-1.0 to 1.0)
  public updateSpatialPan(panX: number) {
    if (!this.ctx || !this.isRunning) return;
    const clamped = Math.max(-1, Math.min(1, panX));
    if (this.spatialPanner && 'pan' in this.spatialPanner) {
      this.spatialPanner.pan.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
    }
  }

  // Set Environmental Weather
  public setWeather(weather: MusiWeatherType) {
    this.currentWeather = weather;
    this.notify();
  }

  // Interactive water splash synthesis when the user clicks or waves the water
  public playSplash(strength = 1) {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(120 + Math.random() * 80, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);

      const vol = Math.min(0.2, 0.08 * strength);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      if (this.masterGain) gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.warn('Audio splash error:', e);
    }
  }

  public setCruising(cruising: boolean) {
    this.isCruising = cruising;
  }

  public playArrivalChime(freq = 440) {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const freqs = [freq, freq * 1.25, freq * 1.5, freq * 2];
      freqs.forEach((f, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, now);

        const initialVol = 0.08 / (idx + 1);
        g.gain.setValueAtTime(initialVol, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 2.5 + idx * 0.4);

        osc.connect(g);
        if (this.masterGain) g.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 3.5);
      });
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }

  public playRelicInspectSound() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [660, 880, 1100, 1320].forEach((f, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.08);

        g.gain.setValueAtTime(0.06, now + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 1.2);

        osc.connect(g);
        if (this.masterGain) g.connect(this.masterGain);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 1.5);
      });
    } catch (e) {
      console.warn('Audio relic error:', e);
    }
  }

  // Authentic boat walkie-talkie / captain radio cue
  public playRadioBeep() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1760, now + 0.04);

      g.gain.setValueAtTime(0.04, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(g);
      if (this.masterGain) g.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      console.warn('Audio radio beep error:', e);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime, 0.1);
    }
    if (this.bgAudioEl) {
      this.bgAudioEl.volume = this.isMuted ? 0 : this.volumeLevel;
    }
    this.notify();
    return this.isMuted;
  }

  public setVolume(level: number) {
    this.volumeLevel = Math.max(0, Math.min(1, level));
    if (this.ctx && this.masterGain && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volumeLevel * 0.35, this.ctx.currentTime, 0.05);
    }
    if (this.bgAudioEl && !this.isMuted) {
      this.bgAudioEl.volume = this.volumeLevel;
    }
    this.notify();
  }

  public getVolume(): number {
    return this.volumeLevel;
  }

  public isPlaying(): boolean {
    return this.isRunning && !this.isMuted;
  }

  public stop() {
    try {
      if (this.bgAudioEl) {
        this.bgAudioEl.pause();
        this.bgAudioEl.currentTime = 0;
      }
      this.ctx?.close();
    } catch (e) {
      console.warn('Audio stop error:', e);
    } finally {
      this.ctx = null;
      this.isRunning = false;
      this.notify();
    }
  }

  public getStatus() {
    return {
      isRunning: this.isRunning,
      isPlaying: this.isRunning && !this.isMuted,
      isCruising: this.isCruising,
      isMuted: this.isMuted,
      weather: this.currentWeather,
      audioUrl: this.currentAudioUrl,
      isLoading: this.isAudioLoading,
      volume: this.volumeLevel,
    };
  }
}

export const musiAudio = new MusiAudioEngine();
