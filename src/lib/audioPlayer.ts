import { Howl } from 'howler';

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private soundEnabled = true;

  constructor() {
    // Lazy audio context init on first user touch
  }

  private getContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isSoundEnabled() {
    return this.soundEnabled;
  }

  // Generate pleasant procedural UI sound effects (click, correct, wrong, star) without requiring huge audio files
  public playClick() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // ignore audio context errors
    }
  }

  public playCorrect() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Friendly chime chord (Major pentatonic C - E - G - C5)
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.4);
      });
    } catch {
      // ignore
    }
  }

  public playWrong() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.linearRampToValueAtTime(200, now + 0.2);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // ignore
    }
  }

  public playStar() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const freqs = [659.25, 880, 1174.66, 1318.51];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.18, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.5);
      });
    } catch {
      // ignore
    }
  }

  public playBuzzer() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(587.33, now + 0.15);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // ignore
    }
  }

  public playVictory() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.1 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.6);
      });
    } catch {
      // ignore
    }
  }
}

export const sfx = new SoundEffectsManager();

class QuranAudioManager {
  private currentHowl: Howl | null = null;
  private currentAyatKey: string | null = null;
  private isPlayingState = false;
  private listeners: ((isPlaying: boolean, ayatKey: string | null) => void)[] = [];
  private qari = 'misyari'; // default qari

  public setQari(qariName: string) {
    this.qari = qariName;
  }

  public getQari() {
    return this.qari;
  }

  public subscribe(callback: (isPlaying: boolean, ayatKey: string | null) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb(this.isPlayingState, this.currentAyatKey));
  }

  public stop() {
    if (this.currentHowl) {
      this.currentHowl.stop();
      this.currentHowl.unload();
      this.currentHowl = null;
    }
    this.isPlayingState = false;
    this.currentAyatKey = null;
    this.notify();
  }

  public playAyat(surahNumber: number, ayatNumber: number, onEnd?: () => void) {
    this.stop();

    const surahStr = String(surahNumber).padStart(3, '0');
    const ayatStr = String(ayatNumber).padStart(3, '0');
    const key = `${surahStr}${ayatStr}`;
    this.currentAyatKey = key;

    // Fallback URL pattern: try local /audio/{qari}/{surahStr}{ayatStr}.mp3,
    // fallback to online Quran audio CDN (EveryAyah Mishary Rashid Alafasy 128kbps) for reliable development & demo
    const localUrl = `/audio/${this.qari}/${key}.mp3`;
    const cdnUrl = `https://everyayah.com/data/Alafasy_128kbps/${key}.mp3`;

    this.isPlayingState = true;
    this.notify();

    this.currentHowl = new Howl({
      src: [localUrl, cdnUrl],
      html5: true,
      onend: () => {
        this.isPlayingState = false;
        this.currentAyatKey = null;
        this.notify();
        if (onEnd) onEnd();
      },
      onloaderror: () => {
        // Fallback or finish gracefully
        this.isPlayingState = false;
        this.currentAyatKey = null;
        this.notify();
      },
      onplayerror: () => {
        this.currentHowl?.once('unlock', () => {
          this.currentHowl?.play();
        });
      }
    });

    this.currentHowl.play();
  }

  public isPlaying(surahNumber?: number, ayatNumber?: number): boolean {
    if (!surahNumber || !ayatNumber) return this.isPlayingState;
    const surahStr = String(surahNumber).padStart(3, '0');
    const ayatStr = String(ayatNumber).padStart(3, '0');
    return this.isPlayingState && this.currentAyatKey === `${surahStr}${ayatStr}`;
  }
}

export const quranAudio = new QuranAudioManager();
