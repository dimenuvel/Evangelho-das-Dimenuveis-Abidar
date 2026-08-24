/**
 * Web Audio API Sound Engine for Abidar - The Cosmic Carpet Ride
 * Synthesizes 16-bit Sega Genesis style chiptune/FM music and sound effects.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private lowpassFilter: BiquadFilterNode | null = null;

  private isMuted: boolean = false;
  private musicVolume: number = 0.5;
  private sfxVolume: number = 0.7;

  private currentStage: number = 1;
  private isMusicPlaying: boolean = false;
  private isAbiding: boolean = false;
  private musicTimer: number | null = null;
  private stepCount: number = 0;

  constructor() {
    // Lazy init on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 1;

      this.lowpassFilter = this.ctx.createBiquadFilter();
      this.lowpassFilter.type = 'lowpass';
      this.lowpassFilter.frequency.value = 18000;

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.musicVolume;

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxVolume;

      this.musicGain.connect(this.lowpassFilter);
      this.sfxGain.connect(this.masterGain);
      this.lowpassFilter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain) {
      this.masterGain.gain.value = muted ? 0 : 1;
    }
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.musicGain) {
      this.musicGain.gain.value = this.musicVolume;
    }
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.sfxVolume;
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public getMusicVolume() {
    return this.musicVolume;
  }

  public getSfxVolume() {
    return this.sfxVolume;
  }

  // Set ABIDE quiet cosmic drone filter
  public setAbideState(abiding: boolean) {
    this.isAbiding = abiding;
    if (!this.ctx || !this.lowpassFilter || !this.musicGain) return;
    const now = this.ctx.currentTime;
    if (abiding) {
      this.lowpassFilter.frequency.setTargetAtTime(800, now, 0.5);
      this.musicGain.gain.setTargetAtTime(this.musicVolume * 0.4, now, 0.5);
      this.playAbideTone();
    } else {
      this.lowpassFilter.frequency.setTargetAtTime(18000, now, 0.5);
      this.musicGain.gain.setTargetAtTime(this.musicVolume, now, 0.5);
    }
  }

  // --- SOUND EFFECTS ---

  // Bowling Pin Collect: Crispy wood/ceramic clink
  public playPinSound(comboMultiplier: number = 1) {
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    // Pitch rises with combo
    const baseFreq = 587.33 + (comboMultiplier - 1) * 60; // D5
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.12);

    // Second harmonic tick
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(baseFreq * 2.5, now);
    gain2.gain.setValueAtTime(0.15, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc2.connect(gain2);
    gain2.connect(this.sfxGain);
    osc2.start(now);
    osc2.stop(now + 0.06);
  }

  // Coffee Cup Collect: Warm cup clink & liquid chime
  public playCoffeeSound() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now); // A4
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Golden Star Collect: Sparkling chord chime
  public playStarSound() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C E G C
    freqs.forEach((f, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + i * 0.04;

      osc.type = 'square';
      osc.frequency.setValueAtTime(f, startTime);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  // IEOUA Vowel Orb Collect: 5 ascending sacred pitches
  // Index 0..4 corresponding to I, E, O, U, A
  public playIEOUASound(vowelIndex: number) {
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    // Sacred Pentatonic / Lydian frequencies
    const vowelNotes = [523.25, 659.25, 783.99, 987.77, 1174.66]; // C5, E5, G5, B5, D6
    const note = vowelNotes[Math.min(4, Math.max(0, vowelIndex))];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, now);
    osc.frequency.exponentialRampToValueAtTime(note * 1.05, now + 0.3);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.35);

    // If vowelIndex === 4 (A collected - completed sequence!): play grand sound of the spiral
    if (vowelIndex === 4) {
      this.playSpiralActivationSound();
    }
  }

  // Sound of the Spiral activation
  public playSpiralActivationSound() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const chord = [261.63, 329.63, 392.00, 493.88, 587.33, 783.99]; // C4, E4, G4, B4, D5, G5
    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + idx * 0.06;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, start + 0.6);

      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.8);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(start);
      osc.stop(start + 0.8);
    });
  }

  // Coffee Rush Time (3 coffees in row)
  public playCoffeeRushTimeSound() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(800, now + 0.4);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  // Elemental Orb Collect
  public playElementalSound(type: string) {
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (type === 'fire') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);
    } else if (type === 'air') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25);
    } else if (type === 'water') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.linearRampToValueAtTime(300, now + 0.25);
    } else { // earth
      osc.type = 'square';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(360, now + 0.3);
    }

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Abide mode tone (subtle cosmic bell / drone)
  private playAbideTone() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(216, now); // 216Hz cosmic harmonic

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 2.0);
  }

  // Hit Obstacle Damage
  public playHitSound() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Button Click / UI Navigation
  public playUiClick() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.05);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Stage Clear Fanfare
  public playStageClearSound() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const notes = [392, 523.25, 659.25, 783.99, 1046.50]; // G4 C5 E5 G5 C6
    notes.forEach((f, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.1;

      osc.type = 'square';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.3);
    });
  }

  // --- BACKGROUND MUSIC ENGINE ---

  public startMusic(stage: number = 1) {
    this.initCtx();
    this.currentStage = stage;
    if (this.isMusicPlaying) return;

    this.isMusicPlaying = true;
    this.stepCount = 0;
    this.scheduleNextBeat();
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer !== null) {
      window.clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  public setStage(stage: number) {
    this.currentStage = stage;
  }

  private scheduleNextBeat = () => {
    if (!this.isMusicPlaying || !this.ctx || !this.musicGain) return;

    const tempo = 110; // BPM
    const stepTime = (60 / tempo) / 4; // 16th note in seconds

    const now = this.ctx.currentTime;
    this.playSynthStep(now, this.stepCount, this.currentStage);

    this.stepCount = (this.stepCount + 1) % 64; // 4 bar loop
    this.musicTimer = window.setTimeout(this.scheduleNextBeat, stepTime * 1000);
  };

  private playSynthStep(now: number, step: number, stage: number) {
    if (!this.ctx || !this.musicGain) return;

    // Stage Scales (16-bit retro synth notes in Hz)
    // C Minor / Lydian / Mystical scales
    const basslineC = [130.81, 130.81, 155.56, 130.81, 174.61, 155.56, 196.00, 130.81]; // C3 Eb3 F3 G3
    const basslineG = [196.00, 196.00, 220.00, 196.00, 261.63, 220.00, 293.66, 196.00];

    // Bass note trigger every 4th 16th note (quarter notes & syncopation)
    if (step % 2 === 0) {
      const bassIndex = Math.floor(step / 2) % basslineC.length;
      const freq = stage % 2 === 0 ? basslineG[bassIndex] : basslineC[bassIndex];

      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();

      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(freq / 2, now); // Deep synth bass

      bassGain.gain.setValueAtTime(0.22, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      bassOsc.connect(bassGain);
      bassGain.connect(this.musicGain);

      bassOsc.start(now);
      bassOsc.stop(now + 0.15);
    }

    // Arpeggio chime synth every 16th note
    const arpeggioNotes = [261.63, 311.13, 392.00, 466.16, 523.25, 622.25, 783.99, 932.33]; // C minor 7
    const arpFreq = arpeggioNotes[(step * (stage + 1)) % arpeggioNotes.length];

    if (step % 2 === 1) {
      const arpOsc = this.ctx.createOscillator();
      const arpGain = this.ctx.createGain();

      arpOsc.type = 'triangle';
      arpOsc.frequency.setValueAtTime(arpFreq, now);

      arpGain.gain.setValueAtTime(0.08, now);
      arpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      arpOsc.connect(arpGain);
      arpGain.connect(this.musicGain);

      arpOsc.start(now);
      arpOsc.stop(now + 0.1);
    }

    // Warm ambient pad every 16 steps (bar start)
    if (step % 16 === 0) {
      const chord = [261.63, 392.00, 466.16, 587.33]; // C4, G4, Bb4, D5
      chord.forEach((f) => {
        if (!this.ctx || !this.musicGain) return;
        const padOsc = this.ctx.createOscillator();
        const padGain = this.ctx.createGain();

        padOsc.type = 'sine';
        padOsc.frequency.setValueAtTime(f, now);

        padGain.gain.setValueAtTime(0.001, now);
        padGain.gain.linearRampToValueAtTime(0.06, now + 0.4);
        padGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

        padOsc.connect(padGain);
        padGain.connect(this.musicGain);

        padOsc.start(now);
        padOsc.stop(now + 2.2);
      });
    }
  }
}

export const soundEngine = new SoundEngine();
