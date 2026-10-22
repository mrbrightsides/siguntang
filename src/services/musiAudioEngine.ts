/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MusiWeatherType = 'senja' | 'kabut' | 'hujan' | 'purnama';

class MusiAudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private masterGain: GainNode | null = null;

  // Spatial Panner for diorama positioning
  private spatialPanner: StereoPannerNode | PannerNode | null = null;

  // Water generator nodes
  private waterGain: GainNode | null = null;
  private waterFilter: BiquadFilterNode | null = null;
  private waterNoiseNode: AudioBufferSourceNode | null = null;
  private waterLfo: OscillatorNode | null = null;

  // Ketek motor nodes
  private motorGain: GainNode | null = null;
  private motorOsc: OscillatorNode | null = null;
  private motorPulseOsc: OscillatorNode | null = null;
  private motorPulseGain: GainNode | null = null;

  // Rain / weather generator nodes
  private rainGain: GainNode | null = null;
  private rainNoiseNode: AudioBufferSourceNode | null = null;
  private rainFilter: BiquadFilterNode | null = null;

  // Ambience (crickets / night drone)
  private nightGain: GainNode | null = null;
  private nightOsc: OscillatorNode | null = null;

  private isCruising: boolean = false;
  private isMuted: boolean = false;
  private currentWeather: MusiWeatherType = 'senja';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
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

      const dioramaBus = this.spatialPanner ? this.spatialPanner : this.masterGain;
      if (this.spatialPanner && this.masterGain) {
        this.spatialPanner.connect(this.masterGain);
      }

      // 1. Water River Generator (Gentle river flow)
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.08;
        b6 = white * 0.115926;
      }

      this.waterNoiseNode = this.ctx.createBufferSource();
      this.waterNoiseNode.buffer = noiseBuffer;
      this.waterNoiseNode.loop = true;

      this.waterFilter = this.ctx.createBiquadFilter();
      this.waterFilter.type = 'lowpass';
      this.waterFilter.frequency.setValueAtTime(450, this.ctx.currentTime);

      // Water swell LFO
      this.waterLfo = this.ctx.createOscillator();
      this.waterLfo.frequency.setValueAtTime(0.2, this.ctx.currentTime);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(200, this.ctx.currentTime);
      this.waterLfo.connect(lfoGain);
      lfoGain.connect(this.waterFilter.frequency);

      this.waterGain = this.ctx.createGain();
      this.waterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

      this.waterNoiseNode.connect(this.waterFilter);
      this.waterFilter.connect(this.waterGain);
      this.waterGain.connect(dioramaBus);

      this.waterNoiseNode.start(0);
      this.waterLfo.start(0);

      // 2. Ketek Boat Engine Generator (Soft rhythmic thrum)
      this.motorOsc = this.ctx.createOscillator();
      this.motorOsc.type = 'triangle';
      this.motorOsc.frequency.setValueAtTime(45, this.ctx.currentTime);

      this.motorPulseOsc = this.ctx.createOscillator();
      this.motorPulseOsc.type = 'square';
      this.motorPulseOsc.frequency.setValueAtTime(4.2, this.ctx.currentTime);

      this.motorPulseGain = this.ctx.createGain();
      this.motorPulseGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      this.motorGain = this.ctx.createGain();
      this.motorGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

      this.motorPulseOsc.connect(this.motorPulseGain.gain);
      this.motorOsc.connect(this.motorPulseGain);
      this.motorPulseGain.connect(this.motorGain);
      this.motorGain.connect(dioramaBus);

      this.motorOsc.start(0);
      this.motorPulseOsc.start(0);

      // 3. Rain / Monsoon Audio Node
      const rainBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const rainOut = rainBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        rainOut[i] = (Math.random() * 2 - 1) * 0.12;
      }
      this.rainNoiseNode = this.ctx.createBufferSource();
      this.rainNoiseNode.buffer = rainBuffer;
      this.rainNoiseNode.loop = true;

      this.rainFilter = this.ctx.createBiquadFilter();
      this.rainFilter.type = 'bandpass';
      this.rainFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      this.rainFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(this.currentWeather === 'hujan' ? 0.35 : 0.0, this.ctx.currentTime);

      this.rainNoiseNode.connect(this.rainFilter);
      this.rainFilter.connect(this.rainGain);
      this.rainGain.connect(this.masterGain);
      this.rainNoiseNode.start(0);

      // 4. Night Ambience Generator (subtle ethereal tone)
      this.nightOsc = this.ctx.createOscillator();
      this.nightOsc.type = 'sine';
      this.nightOsc.frequency.setValueAtTime(528, this.ctx.currentTime);

      this.nightGain = this.ctx.createGain();
      this.nightGain.gain.setValueAtTime(0.015, this.ctx.currentTime);

      this.nightOsc.connect(this.nightGain);
      this.nightGain.connect(this.masterGain);
      this.nightOsc.start(0);

      this.isRunning = true;
      return true;
    } catch (e) {
      console.warn('Web Audio start prevented or failed:', e);
      return false;
    }
  }

  // Update 3D Audio Spatial Pan based on diorama tilt / cursor position (-1.0 to 1.0)
  public updateSpatialPan(panX: number) {
    if (!this.ctx || !this.isRunning) return;
    const clamped = Math.max(-1, Math.min(1, panX));
    if (this.spatialPanner && 'pan' in this.spatialPanner) {
      this.spatialPanner.pan.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
    }
  }

  // Set Environmental Weather & adjust audio parameters accordingly
  public setWeather(weather: MusiWeatherType) {
    this.currentWeather = weather;
    if (!this.ctx || !this.isRunning) return;

    const t = this.ctx.currentTime;
    if (weather === 'hujan') {
      this.rainGain?.gain.setTargetAtTime(0.35, t, 0.5);
      this.waterFilter?.frequency.setTargetAtTime(600, t, 0.5);
      this.nightGain?.gain.setTargetAtTime(0.005, t, 0.5);
    } else if (weather === 'kabut') {
      this.rainGain?.gain.setTargetAtTime(0, t, 0.5);
      this.waterFilter?.frequency.setTargetAtTime(320, t, 0.5);
      this.nightGain?.gain.setTargetAtTime(0.025, t, 0.5);
    } else if (weather === 'purnama') {
      this.rainGain?.gain.setTargetAtTime(0, t, 0.5);
      this.waterFilter?.frequency.setTargetAtTime(420, t, 0.5);
      this.nightGain?.gain.setTargetAtTime(0.03, t, 0.5);
      if (this.nightOsc) {
        this.nightOsc.frequency.setTargetAtTime(639, t, 0.8);
      }
    } else {
      // Senja Emas (default)
      this.rainGain?.gain.setTargetAtTime(0, t, 0.5);
      this.waterFilter?.frequency.setTargetAtTime(450, t, 0.5);
      this.nightGain?.gain.setTargetAtTime(0.015, t, 0.5);
      if (this.nightOsc) {
        this.nightOsc.frequency.setTargetAtTime(528, t, 0.8);
      }
    }
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
    if (!this.ctx || !this.isRunning) return;

    const t = this.ctx.currentTime;
    if (cruising) {
      this.motorPulseOsc?.frequency.setTargetAtTime(7.5, t, 0.4);
      this.motorGain?.gain.setTargetAtTime(0.22, t, 0.3);
      this.waterFilter?.frequency.setTargetAtTime(750, t, 0.5);
      this.waterGain?.gain.setTargetAtTime(0.6, t, 0.4);
    } else {
      this.motorPulseOsc?.frequency.setTargetAtTime(3.8, t, 0.5);
      this.motorGain?.gain.setTargetAtTime(0.08, t, 0.4);
      this.waterFilter?.frequency.setTargetAtTime(400, t, 0.5);
      this.waterGain?.gain.setTargetAtTime(0.35, t, 0.4);
    }
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
    return this.isMuted;
  }

  public setVolume(level: number) {
    if (this.ctx && this.masterGain && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, level)), this.ctx.currentTime, 0.05);
    }
  }

  public stop() {
    if (!this.isRunning) return;
    try {
      this.waterNoiseNode?.stop();
      this.waterLfo?.stop();
      this.motorOsc?.stop();
      this.motorPulseOsc?.stop();
      this.rainNoiseNode?.stop();
      this.nightOsc?.stop();
      this.ctx?.close();
    } catch (e) {
      console.warn('Audio stop error:', e);
    } finally {
      this.ctx = null;
      this.isRunning = false;
    }
  }

  public getStatus() {
    return {
      isRunning: this.isRunning,
      isCruising: this.isCruising,
      isMuted: this.isMuted,
      weather: this.currentWeather,
    };
  }
}

export const musiAudio = new MusiAudioEngine();

