// Enhanced Web Audio API Manager for Mysuru Dasara 2026
// Supports: Master, Music, SFX, and Voice volumes,
// Soundscapes (Palace, Nadaswara, Chende, Procession, Drone show),
// Audio ducking during speech, and subtitles callback.

export type SoundscapeType = 'palace' | 'nadaswara' | 'chende' | 'procession' | 'drones' | 'none';

class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private voiceGain: GainNode | null = null;

  public masterVolume: number = 0.8;
  public musicVolume: number = 0.5;
  public sfxVolume: number = 0.7;
  public voiceVolume: number = 1.0;

  private isMuted: boolean = false;
  private currentSoundscape: SoundscapeType = 'none';
  private loopTimer: any = null;

  private onSubtitleCallback: ((text: string) => void) | null = null;

  constructor() {
    // Context is initialized on first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.voiceGain = this.ctx.createGain();
      this.voiceGain.gain.setValueAtTime(this.voiceVolume, this.ctx.currentTime);
      this.voiceGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Volume Controls
  public setMasterVolume(v: number) {
    this.masterVolume = Math.max(0, Math.min(1, v));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
  }

  public setMusicVolume(v: number) {
    this.musicVolume = Math.max(0, Math.min(1, v));
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }

  public setSfxVolume(v: number) {
    this.sfxVolume = Math.max(0, Math.min(1, v));
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  public setVoiceVolume(v: number) {
    this.voiceVolume = Math.max(0, Math.min(1, v));
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Soundscape Switcher
  public setSoundscape(type: SoundscapeType) {
    if (this.currentSoundscape === type) return;
    this.stopSoundscape();
    this.currentSoundscape = type;

    if (type === 'none') return;
    this.initContext();

    switch (type) {
      case 'palace':
        this.startPalaceAmbience();
        break;
      case 'nadaswara':
        this.startNadaswaraDrone();
        break;
      case 'chende':
        this.startChendeRhythm();
        break;
      case 'procession':
        this.startProcessionAtmosphere();
        break;
      case 'drones':
        this.startDroneAmbience();
        break;
    }
  }

  public stopSoundscape() {
    if (this.loopTimer) {
      clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
    this.currentSoundscape = 'none';
  }

  public getCurrentSoundscape(): SoundscapeType {
    return this.currentSoundscape;
  }

  // 1. Palace Ambience (Gentle royal chimes & string resonance)
  private startPalaceAmbience() {
    const chords = [261.63, 329.63, 392.0, 523.25];
    this.loopTimer = setInterval(() => {
      if (!this.ctx || !this.musicGain || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freq = chords[Math.floor(Math.random() * chords.length)];
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start(now);
      osc.stop(now + 3.8);
    }, 2400);
  }

  // 2. Traditional Nadaswara Drone (Mayamalavagowla resonant scale)
  private startNadaswaraDrone() {
    const scale = [220, 246.94, 277.18, 329.63, 370.0, 440];
    this.loopTimer = setInterval(() => {
      if (!this.ctx || !this.musicGain || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freq = scale[Math.floor(Math.random() * scale.length)];
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 1.0);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);

      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start(now);
      osc.stop(now + 4.0);
    }, 2000);
  }

  // 3. Chende / Dollu Percussive Pulse
  private startChendeRhythm() {
    let beat = 0;
    this.loopTimer = setInterval(() => {
      if (!this.ctx || !this.musicGain || this.isMuted) return;
      this.playDrumBeat(beat % 2 === 0 ? 0.7 : 0.4);
      beat++;
    }, 650);
  }

  // 4. Procession Atmosphere (Festival brass fanfare + percussion)
  private startProcessionAtmosphere() {
    let step = 0;
    this.loopTimer = setInterval(() => {
      if (!this.ctx || !this.musicGain || this.isMuted) return;
      this.playDrumBeat(step % 4 === 0 ? 0.8 : 0.35);
      if (step % 8 === 0) {
        this.playRoyalFanfare();
      }
      step++;
    }, 800);
  }

  // 5. Drone Show Ambience (Ethereal spatial synth)
  private startDroneAmbience() {
    const freqs = [440, 554.37, 659.25, 880];
    this.loopTimer = setInterval(() => {
      if (!this.ctx || !this.musicGain || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqs[Math.floor(Math.random() * freqs.length)], now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 2.0);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.0);

      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start(now);
      osc.stop(now + 5.0);
    }, 3000);
  }

  // Sound Effects
  public playBellSound() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1046.5, now); // C6 bell tone
    osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.6);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.8);
  }

  public playRoyalFanfare() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99];

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0, now + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 1.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 1.2);
    });
  }

  public playDrumBeat(intensity: number = 0.6) {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.25);

    gain.gain.setValueAtTime(intensity * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  public playFireworkSound() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  public playClickSound() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  public playBells() {
    this.playBellSound();
  }

  public duckAudio(duck: boolean) {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;
    const target = duck ? this.musicVolume * 0.15 : this.musicVolume;
    this.musicGain.gain.cancelScheduledValues(now);
    this.musicGain.gain.linearRampToValueAtTime(target, now + 0.25);
  }

  // Speech & Subtitles
  public setSubtitleCallback(cb: ((text: string) => void) | null) {
    this.onSubtitleCallback = cb;
  }

  public speak(
    text: string,
    language: 'en' | 'kn' = 'en',
    onEnd?: () => void
  ) {
    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel();
    this.duckAudio(true);

    if (this.onSubtitleCallback) {
      this.onSubtitleCallback(text);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'kn' ? 'kn-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.volume = this.voiceVolume;

    utterance.onend = () => {
      this.duckAudio(false);
      if (this.onSubtitleCallback) {
        this.onSubtitleCallback('');
      }
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.duckAudio(false);
      if (this.onSubtitleCallback) {
        this.onSubtitleCallback('');
      }
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.duckAudio(false);
      if (this.onSubtitleCallback) {
        this.onSubtitleCallback('');
      }
    }
  }

  public startFestiveAmbience() {
    this.setSoundscape('palace');
  }

  public stopFestiveAmbience() {
    this.stopSoundscape();
  }
}

export const audioManager = new AudioManager();
