/**
 * Game Engine for Abidar - The Cosmic Carpet Ride
 * Manages game state, physics, entity spawning, collisions, stage progression, and boss mechanics.
 */

import {
  PlayerState,
  Collectible,
  Obstacle,
  FloatingText,
  Particle,
  StarFieldLayer,
  ParallaxPlanet,
  StageConfig,
  BossState,
  GameSettings,
  VowelLetter,
  CollectibleType,
  ObstacleType
} from './types';
import { pixelRenderer } from './pixelArtRenderer';
import { soundEngine } from '../audio/soundEngine';
import { unlockNextStage } from './stageUnlockManager';

export const STAGES: StageConfig[] = [
  {
    id: 1,
    title: 'STAGE 1 — THE MATERIAL WORLD',
    subtitle: 'Dark Cosmic Cityscape',
    targetDistance: 4500,
    scrollSpeed: 3.5,
    bgGradStart: '#0d0826',
    bgGradEnd: '#1e0c38',
    nebulaColors: ['rgba(80, 20, 140, 0.3)', 'rgba(20, 60, 160, 0.25)'],
    obstacleFreq: 0.015,
    collectibleFreq: 0.05,
    allowedObstacles: ['the_void', 'the_materialist'],
    hasBoss: false
  },
  {
    id: 2,
    title: 'STAGE 2 — THE ELEMENTAL CURRENT',
    subtitle: 'Fire, Air, Water & Earth Currents',
    targetDistance: 6000,
    scrollSpeed: 4.0,
    bgGradStart: '#14062e',
    bgGradEnd: '#2e0a42',
    nebulaColors: ['rgba(220, 50, 50, 0.25)', 'rgba(0, 180, 220, 0.25)', 'rgba(50, 200, 100, 0.2)'],
    obstacleFreq: 0.02,
    collectibleFreq: 0.055,
    allowedObstacles: ['the_void', 'the_agitator', 'the_materialist'],
    hasBoss: false
  },
  {
    id: 3,
    title: 'STAGE 3 — THE VOID',
    subtitle: 'Deep Void Space & Sacred Sounds',
    targetDistance: 8000,
    scrollSpeed: 4.5,
    bgGradStart: '#080018',
    bgGradEnd: '#12002b',
    nebulaColors: ['rgba(140, 0, 180, 0.3)', 'rgba(40, 0, 80, 0.4)'],
    obstacleFreq: 0.025,
    collectibleFreq: 0.06,
    allowedObstacles: ['the_void', 'the_silencer', 'the_projector'],
    hasBoss: false
  },
  {
    id: 4,
    title: 'STAGE 4 — THE SPIRAL',
    subtitle: 'Surreal Galaxies & Golden Spirals',
    targetDistance: 10000,
    scrollSpeed: 5.0,
    bgGradStart: '#1d003b',
    bgGradEnd: '#3b0042',
    nebulaColors: ['rgba(255, 180, 0, 0.25)', 'rgba(200, 0, 150, 0.3)'],
    obstacleFreq: 0.028,
    collectibleFreq: 0.065,
    allowedObstacles: ['the_void', 'the_false_one', 'the_projector', 'the_agitator'],
    hasBoss: false
  },
  {
    id: 5,
    title: 'STAGE 5 — THE PLEROMA',
    subtitle: 'The Seven Dimenuous Layers & The Great Void',
    targetDistance: 12000,
    scrollSpeed: 5.5,
    bgGradStart: '#26004d',
    bgGradEnd: '#550066',
    nebulaColors: ['rgba(255, 215, 0, 0.35)', 'rgba(0, 229, 255, 0.3)', 'rgba(255, 0, 128, 0.3)'],
    obstacleFreq: 0.03,
    collectibleFreq: 0.07,
    allowedObstacles: ['the_void', 'the_false_one', 'the_silencer', 'the_agitator', 'the_materialist'],
    hasBoss: true
  }
];

export const INFINITE_STAGE_CONFIG: StageConfig = {
  id: 99,
  title: 'INFINITE COSMOS — ENDLESS RUN',
  subtitle: 'Survive the Infinite Void',
  targetDistance: Infinity,
  scrollSpeed: 4.0,
  bgGradStart: '#050212',
  bgGradEnd: '#18032b',
  nebulaColors: ['rgba(0, 229, 255, 0.3)', 'rgba(255, 215, 0, 0.3)'],
  obstacleFreq: 0.02,
  collectibleFreq: 0.06,
  allowedObstacles: ['the_void', 'the_false_one', 'the_projector', 'the_agitator', 'the_materialist', 'the_silencer'],
  hasBoss: false
};

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private width: number = 800;
  private height: number = 450;

  private animationFrameId: number | null = null;
  private lastTime: number = 0;
  private gameTime: number = 0;

  // State
  public isRunning: boolean = false;
  public isPaused: boolean = false;
  public isGameOver: boolean = false;
  public isStageClear: boolean = false;
  public isVictory: boolean = false;
  public isInfiniteMode: boolean = false;

  public currentStageIndex: number = 0;
  public currentDistance: number = 0;

  public getCurrentStageConfig(): StageConfig {
    if (this.isInfiniteMode) {
      const distanceChunk = Math.floor(this.currentDistance / 2500);
      const nebulas = [
        ['rgba(0, 229, 255, 0.3)', 'rgba(255, 215, 0, 0.3)'],
        ['rgba(220, 50, 50, 0.25)', 'rgba(0, 180, 220, 0.25)'],
        ['rgba(140, 0, 180, 0.3)', 'rgba(40, 0, 80, 0.4)'],
        ['rgba(255, 180, 0, 0.25)', 'rgba(200, 0, 150, 0.3)'],
        ['rgba(255, 215, 0, 0.35)', 'rgba(0, 229, 255, 0.3)']
      ];
      return {
        ...INFINITE_STAGE_CONFIG,
        scrollSpeed: 4.0 + Math.min(6.0, this.currentDistance / 2500),
        obstacleFreq: 0.018 + Math.min(0.035, this.currentDistance / 8000),
        nebulaColors: nebulas[distanceChunk % nebulas.length]
      };
    }
    return STAGES[this.currentStageIndex] || STAGES[0];
  }

  public player!: PlayerState;
  public collectibles: Collectible[] = [];
  public obstacles: Obstacle[] = [];
  public floatingTexts: FloatingText[] = [];
  public particles: Particle[] = [];

  public stars: StarFieldLayer[] = [];
  public planets: ParallaxPlanet[] = [];

  public bossState: BossState = {
    active: false,
    x: 0,
    y: 0,
    width: 200,
    height: 200,
    health: 100,
    maxHealth: 100,
    phase: 'emerging',
    phaseTimer: 0,
    pulsate: 0,
    ieouaSequenceRequired: ['I', 'E', 'O', 'U', 'A'],
    currentRequiredIndex: 0
  };

  public settings: GameSettings = {
    soundEnabled: true,
    musicVolume: 0.5,
    sfxVolume: 0.7,
    scanlinesEnabled: true,
    touchControlMode: 'drag'
  };

  // Input state
  private inputLift: boolean = false;
  private inputUp: boolean = false;
  private inputDown: boolean = false;
  private touchTargetY: number | null = null;

  // Consecutive counters
  private consecutiveCoffeeCount: number = 0;

  // High scores
  public highScore: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.imageSmoothingEnabled = false;

    this.loadSettings();
    this.loadHighScore();
    this.resizeCanvas();
    this.initStarfield();
  }

  private loadSettings() {
    try {
      const saved = localStorage.getItem('abidar_settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
  }

  public saveSettings() {
    try {
      localStorage.setItem('abidar_settings', JSON.stringify(this.settings));
    } catch {
      // ignore
    }
  }

  private loadHighScore() {
    try {
      const saved = localStorage.getItem('abidar_highscore');
      if (saved) {
        this.highScore = parseInt(saved, 10) || 0;
      }
    } catch {
      // ignore
    }
  }

  private saveHighScore() {
    if (this.player.score > this.highScore) {
      this.highScore = this.player.score;
      try {
        localStorage.setItem('abidar_highscore', this.highScore.toString());
      } catch {
        // ignore
      }
    }
  }

  public resizeCanvas() {
    // Standard 16:9 pixel resolution for Genesis arcade style
    this.width = 800;
    this.height = 450;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  private initStarfield() {
    this.stars = [];
    for (let i = 0; i < 90; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        speed: 0.5 + Math.random() * 2.0,
        size: Math.random() > 0.8 ? 2 : 1,
        color: Math.random() > 0.5 ? '#ffffff' : Math.random() > 0.5 ? '#ffd700' : '#88e5ff',
        twinkle: Math.random() * Math.PI * 2
      });
    }

    this.planets = [
      {
        x: 650,
        y: 120,
        radius: 55,
        type: 'spiral_galaxy',
        colorMain: '#9c27b0',
        colorAccent: '#00e5ff',
        hasRing: false,
        speed: 0.3
      },
      {
        x: 1100,
        y: 280,
        radius: 50,
        type: 'temple_island',
        colorMain: '#ffd700',
        colorAccent: '#00e5ff',
        hasRing: false,
        speed: 0.6
      }
    ];
  }

  // --- GAME LIFE CYCLE ---

  public startNewGame(stageIndex: number = 0, isInfiniteMode: boolean = false) {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.currentStageIndex = stageIndex;
    this.isInfiniteMode = isInfiniteMode;
    this.currentDistance = 0;
    this.isGameOver = false;
    this.isStageClear = false;
    this.isVictory = false;
    this.isPaused = false;
    this.consecutiveCoffeeCount = 0;
    this.inputLift = false;

    this.player = {
      x: this.width * 0.18,
      y: this.height * 0.5,
      targetY: this.height * 0.5,
      vy: 0,
      width: 70,
      height: 40,
      lives: 3,
      maxLives: 3,
      abidarEnergy: 100,
      score: 0,
      combo: 1,
      comboTimer: 0,
      stillTime: 0,
      isAbiding: false,
      activePowerUp: null,
      powerUpTimer: 0,
      shieldActive: false,
      magnetActive: false,
      speedBoostActive: false,
      timeSlowActive: false,
      ieouaProgress: [],
      spiralModeTime: 0,
      pinsCollected: 0,
      coffeesDrunk: 0,
      totalAbideSeconds: 0,
      presencePoints: 0,
      invulnerableTime: 0,
      isMaterialMode: false,
      trailHistory: []
    };

    this.collectibles = [];
    this.obstacles = [];
    this.floatingTexts = [];
    this.particles = [];

    this.bossState.active = false;

    const currentConfig = this.getCurrentStageConfig();
    soundEngine.setStage(currentConfig.id);
    if (this.settings.soundEnabled) {
      soundEngine.startMusic(currentConfig.id);
    }

    this.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);
  }

  public nextStage() {
    if (this.isInfiniteMode) return;

    if (this.currentStageIndex + 1 < STAGES.length) {
      this.currentStageIndex++;
      this.currentDistance = 0;
      this.isStageClear = false;
      this.isGameOver = false;

      // Reset player position, velocity and input for the new stage
      this.player.y = this.height * 0.5;
      this.player.vy = 0;
      this.player.invulnerableTime = 2.0;
      this.inputLift = false;

      this.collectibles = [];
      this.obstacles = [];
      this.floatingTexts = [];

      const currentConfig = this.getCurrentStageConfig();
      soundEngine.setStage(currentConfig.id);
      if (this.settings.soundEnabled) {
        soundEngine.startMusic(currentConfig.id);
      }
      this.addFloatingText(this.width / 2, this.height / 2 - 30, currentConfig.title, '#ffd700', 2.0);
    } else {
      this.isVictory = true;
      this.saveHighScore();
    }
  }

  public setPaused(paused: boolean) {
    this.isPaused = paused;
    if (paused) {
      soundEngine.stopMusic();
    } else if (this.settings.soundEnabled) {
      soundEngine.startMusic(STAGES[this.currentStageIndex].id);
    }
  }

  // --- INPUT HANDLERS ---

  public setInputLift(active: boolean) {
    this.inputLift = active;
  }

  public setInputUp(active: boolean) {
    this.inputLift = active;
  }

  public setInputDown(active: boolean) {
    // Unused in tap-to-rise mode
  }

  public setTouchTargetY(y: number | null) {
    this.inputLift = y !== null;
  }

  // --- MAIN LOOP ---

  private gameLoop = (timestamp: number) => {
    if (!this.isRunning) return;

    const dt = Math.min(0.05, (timestamp - this.lastTime) / 1000);
    this.lastTime = timestamp;
    this.gameTime += dt;

    if (!this.isPaused && !this.isGameOver && !this.isVictory && !this.isStageClear) {
      this.update(dt);
    }

    this.render();

    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  // --- UPDATE LOGIC ---

  private update(dt: number) {
    const stage = this.getCurrentStageConfig();

    // Scroll distance advancement
    const speedMult = this.player.speedBoostActive ? 1.5 : this.player.timeSlowActive ? 0.6 : 1.0;
    this.currentDistance += stage.scrollSpeed * speedMult * dt * 30;

    // --- PLAYER MOVEMENT (TAP/CLICK TO RISE, RELEASE TO FALL) ---
    const gravity = 700; // Constant downward gravity force
    const liftForce = -1550; // Upward force when tapped/held

    let accelY = gravity;
    if (this.inputLift) {
      accelY += liftForce;
    }

    // Material mode slows responsiveness
    const drag = this.player.isMaterialMode ? 0.92 : 0.96;
    this.player.vy = (this.player.vy + accelY * dt) * drag;

    // Terminal velocity limits
    this.player.vy = Math.max(-360, Math.min(420, this.player.vy));
    this.player.y += this.player.vy * dt;

    // Ceiling boundary
    const minY = 55;
    if (this.player.y < minY) {
      this.player.y = minY;
      if (this.player.vy < 0) this.player.vy = 0;
    }

    // Off-screen Fall Death
    const deathY = this.height + 25;
    if (this.player.y > deathY && !this.isGameOver && !this.isVictory && !this.isStageClear) {
      this.player.lives = 0;
      this.isGameOver = true;
      soundEngine.playHitSound();
      soundEngine.stopMusic();
      this.saveHighScore();
      this.addFloatingText(this.player.x, this.height - 40, 'FELL OFF THE COSMOS!', '#ff2200', 2.0);
    }

    // --- ABIDE DETECTION ---
    // If vertical movement is balanced/near stationary and player is inside screen bounds
    if (Math.abs(this.player.vy) < 25 && this.player.y < deathY) {
      this.player.stillTime += dt;
      if (this.player.stillTime >= 2.0) {
        if (!this.player.isAbiding) {
          this.player.isAbiding = true;
          soundEngine.setAbideState(true);
          this.player.score += 1000;
          this.player.presencePoints += 1000;
          this.addFloatingText(this.player.x + 30, this.player.y - 30, '+1000 PRESENCE', '#ffd700', 1.8);
        }
        this.player.totalAbideSeconds += dt;
        // Slowly regenerate Abidar energy
        this.player.abidarEnergy = Math.min(100, this.player.abidarEnergy + dt * 6.0);
      }
    } else {
      if (this.player.isAbiding) {
        this.player.isAbiding = false;
        soundEngine.setAbideState(false);
      }
      this.player.stillTime = 0;
    }

    // --- ABIDAR ENERGY DRAIN ---
    if (!this.player.isAbiding) {
      this.player.abidarEnergy = Math.max(0, this.player.abidarEnergy - dt * 1.8);
    }
    this.player.isMaterialMode = this.player.abidarEnergy <= 0;

    // Timers
    if (this.player.invulnerableTime > 0) this.player.invulnerableTime -= dt;
    if (this.player.powerUpTimer > 0) {
      this.player.powerUpTimer -= dt;
      if (this.player.powerUpTimer <= 0) {
        this.player.shieldActive = false;
        this.player.magnetActive = false;
        this.player.speedBoostActive = false;
        this.player.timeSlowActive = false;
        this.player.activePowerUp = null;
      }
    }
    if (this.player.spiralModeTime > 0) {
      this.player.spiralModeTime -= dt;
    }

    // Combo timer reset
    if (this.player.comboTimer > 0) {
      this.player.comboTimer -= dt;
      if (this.player.comboTimer <= 0) {
        this.player.combo = 1;
      }
    }

    // --- PARALLAX & STARFIELD UPDATE ---
    this.stars.forEach((s) => {
      s.x -= s.speed * stage.scrollSpeed * speedMult * dt * 15;
      if (s.x < 0) s.x = this.width;
    });

    this.planets.forEach((p) => {
      p.x -= p.speed * stage.scrollSpeed * speedMult * dt * 10;
      if (p.x < -100) p.x = this.width + 100;
    });

    // --- SPAWNING OBJECTS ---
    this.spawnEntities(stage, dt);

    // --- UPDATE COLLECTIBLES & MAGNET EFFECT ---
    const magnetActive = this.player.magnetActive || this.player.spiralModeTime > 0;
    this.collectibles.forEach((c) => {
      if (!c.active) return;
      c.x -= stage.scrollSpeed * speedMult * dt * 60;

      // Magnet attraction
      if (magnetActive) {
        const dx = this.player.x - c.x;
        const dy = this.player.y - c.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 220) {
          c.x += (dx / dist) * 350 * dt;
          c.y += (dy / dist) * 350 * dt;
        }
      }

      // Check collision
      if (Math.hypot(this.player.x - c.x, this.player.y - c.y) < 32) {
        this.collectItem(c);
      }

      if (c.x < -40) c.active = false;
    });

    // --- UPDATE OBSTACLES & COLLISIONS ---
    this.obstacles.forEach((o) => {
      if (!o.active) return;
      o.x -= stage.scrollSpeed * speedMult * dt * 60;

      // Check collision with player
      if (this.player.invulnerableTime <= 0 && this.player.spiralModeTime <= 0 && Math.hypot(this.player.x - o.x, this.player.y - o.y) < 30) {
        this.hitObstacle(o);
      }

      if (o.x < -60) o.active = false;
    });

    // Clean inactive entities
    this.collectibles = this.collectibles.filter((c) => c.active);
    this.obstacles = this.obstacles.filter((o) => o.active);

    // --- UPDATE CARPET TRAIL HISTORY & PARTICLES ---
    if (!this.player.trailHistory) this.player.trailHistory = [];
    const scrollDist = stage.scrollSpeed * speedMult * dt * 60 + 100 * dt;

    // Shift previous trail nodes left and adjust for vertical momentum
    for (let i = 0; i < this.player.trailHistory.length; i++) {
      const pt = this.player.trailHistory[i];
      pt.x -= scrollDist;
      pt.y += pt.vy * dt * 0.12;
    }

    // Record current carpet rear position
    this.player.trailHistory.unshift({
      x: this.player.x - 45,
      y: this.player.y + 18,
      vy: this.player.vy
    });

    if (this.player.trailHistory.length > 28) {
      this.player.trailHistory.pop();
    }

    // Spawn dynamic stardust & energy sparks with vertical inertia lag
    const isHighEnergy = this.player.abidarEnergy > 80 || this.player.isAbiding;
    const trailColor = this.player.spiralModeTime > 0
      ? (Math.random() < 0.5 ? '#00ffff' : '#ff00ff')
      : isHighEnergy
      ? (Math.random() < 0.5 ? '#ffd700' : '#ffffff')
      : this.player.isMaterialMode
      ? '#885522'
      : (Math.random() < 0.5 ? '#ff9900' : '#ff3366');

    // Inverse vertical velocity: moving up (-vy) throws particles down (+vy)
    const inertiaVy = -this.player.vy * 0.45;

    for (let i = 0; i < 3; i++) {
      this.particles.push({
        x: this.player.x - 48 - Math.random() * 15,
        y: this.player.y + 18 + (Math.random() - 0.5) * 10,
        vx: -stage.scrollSpeed * speedMult * 35 - 50 - Math.random() * 40,
        vy: inertiaVy + (Math.random() - 0.5) * 45,
        color: trailColor,
        size: Math.random() * 4 + 2,
        life: 0.8 + Math.random() * 0.6,
        maxLife: 1.4
      });
    }

    // --- UPDATE PARTICLES & FLOATING TEXTS ---
    // Emit ambient elemental particles while power-up is active
    if (this.player.powerUpTimer > 0 && this.player.activePowerUp) {
      const elem = this.player.activePowerUp;
      if (elem === 'fire') {
        this.particles.push({
          x: this.player.x + (Math.random() - 0.5) * 50,
          y: this.player.y + (Math.random() - 0.5) * 30,
          vx: -50 - Math.random() * 40,
          vy: -70 - Math.random() * 50,
          color: Math.random() < 0.5 ? '#ff3300' : '#ff9900',
          size: Math.random() * 5 + 2,
          life: 0.4 + Math.random() * 0.3,
          maxLife: 0.7,
          shape: 'flame',
          element: 'fire'
        });
      } else if (elem === 'air') {
        this.particles.push({
          x: this.player.x + (Math.random() - 0.5) * 40,
          y: this.player.y + (Math.random() - 0.5) * 30,
          vx: 130 + Math.random() * 100,
          vy: (Math.random() - 0.5) * 40,
          color: Math.random() < 0.5 ? '#00ffff' : '#80f0ff',
          size: Math.random() * 4 + 2,
          life: 0.3 + Math.random() * 0.3,
          maxLife: 0.6,
          shape: 'spark',
          element: 'air'
        });
      } else if (elem === 'water') {
        this.particles.push({
          x: this.player.x + (Math.random() - 0.5) * 50,
          y: this.player.y + (Math.random() - 0.5) * 30,
          vx: -30 - Math.random() * 30,
          vy: 40 + Math.random() * 50,
          color: Math.random() < 0.5 ? '#0066ff' : '#80e5ff',
          size: Math.random() * 5 + 2,
          life: 0.5 + Math.random() * 0.3,
          maxLife: 0.8,
          shape: 'droplet',
          element: 'water'
        });
      } else if (elem === 'earth') {
        this.particles.push({
          x: this.player.x + (Math.random() - 0.5) * 60,
          y: this.player.y + (Math.random() - 0.5) * 40,
          vx: (Math.random() - 0.5) * 60,
          vy: (Math.random() - 0.5) * 60,
          color: Math.random() < 0.5 ? '#22cc44' : '#88ff00',
          size: Math.random() * 5 + 2,
          life: 0.4 + Math.random() * 0.4,
          maxLife: 0.8,
          shape: 'star',
          element: 'earth'
        });
      }
    }

    this.particles.forEach((p) => {
      p.x += p.vx * dt;
      if (p.element === 'fire') {
        p.vy -= 45 * dt; // Heat buoyancy
      } else if (p.element === 'water') {
        p.vy += 70 * dt; // Water gravity
      } else {
        p.vy += Math.sin(p.life * 14) * 35 * dt;
      }
      p.y += p.vy * dt;
      p.life -= dt;
    });
    this.particles = this.particles.filter((p) => p.life > 0);

    this.floatingTexts.forEach((ft) => {
      ft.y += ft.vy * dt;
      ft.alpha -= dt * 0.8;
    });
    this.floatingTexts = this.floatingTexts.filter((ft) => ft.alpha > 0);

    // --- STAGE COMPLETION / BOSS MECHANIC ---
    if (stage.hasBoss && this.currentDistance >= stage.targetDistance && !this.bossState.active) {
      this.initBoss();
    } else if (!stage.hasBoss && this.currentDistance >= stage.targetDistance && !this.isStageClear) {
      this.isStageClear = true;
      unlockNextStage(this.currentStageIndex);
      soundEngine.playStageClearSound();
      this.saveHighScore();
    }

    if (this.bossState.active) {
      this.updateBoss(dt);
    }
  }

  // --- SPAWN LOGIC ---

  private spawnEntities(stage: StageConfig, dt: number) {
    if (this.bossState.active) return; // Don't spawn normal obstacles during final boss

    // Collectible Spawner
    if (Math.random() < stage.collectibleFreq) {
      const spawnY = 80 + Math.random() * (this.height - 160);
      const randVal = Math.random();

      if (randVal < 0.5) {
        // Bowling Pin
        this.collectibles.push({
          id: Math.random().toString(),
          x: this.width + 30,
          y: spawnY,
          width: 24,
          height: 32,
          vx: -100,
          vy: 0,
          active: true,
          type: 'bowling_pin',
          pulsePhase: Math.random() * Math.PI,
          rotation: 0,
          value: 100
        });
      } else if (randVal < 0.72) {
        // Coffee Cup
        this.collectibles.push({
          id: Math.random().toString(),
          x: this.width + 30,
          y: spawnY,
          width: 32,
          height: 32,
          vx: -100,
          vy: 0,
          active: true,
          type: 'coffee_cup',
          pulsePhase: Math.random() * Math.PI,
          rotation: 0,
          value: 50
        });
      } else if (randVal < 0.85) {
        // Golden Star
        this.collectibles.push({
          id: Math.random().toString(),
          x: this.width + 30,
          y: spawnY,
          width: 28,
          height: 28,
          vx: -100,
          vy: 0,
          active: true,
          type: 'golden_star',
          pulsePhase: Math.random() * Math.PI,
          rotation: 0,
          value: 200
        });
      } else if (randVal < 0.94) {
        // IEOUA Vowel Sequence Orb
        const vowels: VowelLetter[] = ['I', 'E', 'O', 'U', 'A'];
        // Pick next needed vowel or random
        const nextNeeded = vowels.find((v) => !this.player.ieouaProgress.includes(v)) || 'I';
        this.collectibles.push({
          id: Math.random().toString(),
          x: this.width + 30,
          y: spawnY,
          width: 32,
          height: 32,
          vx: -100,
          vy: 0,
          active: true,
          type: 'ieoua_orb',
          vowel: nextNeeded,
          pulsePhase: Math.random() * Math.PI,
          rotation: 0,
          value: 300
        });
      } else {
        // Elemental Orbs
        const elems: CollectibleType[] = ['elemental_fire', 'elemental_air', 'elemental_water', 'elemental_earth'];
        const chosen = elems[Math.floor(Math.random() * elems.length)];
        this.collectibles.push({
          id: Math.random().toString(),
          x: this.width + 30,
          y: spawnY,
          width: 30,
          height: 30,
          vx: -100,
          vy: 0,
          active: true,
          type: chosen,
          pulsePhase: Math.random() * Math.PI,
          rotation: 0,
          value: 250
        });
      }
    }

    // Obstacle Spawner
    const obsFreq = (stage && stage.obstacleFreq) || 0.02;
    if (Math.random() < obsFreq) {
      const allowed: ObstacleType[] = (stage && stage.allowedObstacles && stage.allowedObstacles.length > 0)
        ? stage.allowedObstacles
        : ['the_void'];
      const spawnY = 90 + Math.random() * (this.height - 180);
      const chosenObs = allowed[Math.floor(Math.random() * allowed.length)];
      this.obstacles.push({
        id: Math.random().toString(),
        x: this.width + 50,
        y: spawnY,
        width: 40,
        height: 40,
        vx: -120,
        vy: 0,
        active: true,
        type: chosenObs,
        animFrame: 0
      });
    }
  }

  // --- ITEM COLLECTION ---

  private collectItem(c: Collectible) {
    c.active = false;

    // Increment combo
    this.player.comboTimer = 3.5;
    this.player.combo++;
    const comboMult = this.player.combo >= 13 ? 5 : this.player.combo >= 7 ? 3 : this.player.combo >= 3 ? 2 : 1;

    const points = c.value * comboMult;
    this.player.score += points;

    this.addFloatingText(c.x, c.y - 15, `+${points}`, '#ffd700', 1.0 + comboMult * 0.2);

    if (c.type === 'bowling_pin') {
      this.player.pinsCollected++;
      this.consecutiveCoffeeCount = 0;
      soundEngine.playPinSound(comboMult);
    } else if (c.type === 'coffee_cup') {
      this.player.coffeesDrunk++;
      this.player.abidarEnergy = Math.min(100, this.player.abidarEnergy + 15);
      soundEngine.playCoffeeSound();

      this.consecutiveCoffeeCount++;
      if (this.consecutiveCoffeeCount >= 3) {
        this.triggerCoffeeRushTime();
      }
    } else if (c.type === 'golden_star') {
      this.consecutiveCoffeeCount = 0;
      soundEngine.playStarSound();
    } else if (c.type === 'ieoua_orb' && c.vowel) {
      this.consecutiveCoffeeCount = 0;
      const index = ['I', 'E', 'O', 'U', 'A'].indexOf(c.vowel);
      soundEngine.playIEOUASound(index);

      if (!this.player.ieouaProgress.includes(c.vowel)) {
        this.player.ieouaProgress.push(c.vowel);
      }

      if (this.player.ieouaProgress.length === 5) {
        // Completed IEOUA!
        this.triggerSoundOfTheSpiral();
      }
    } else if (c.type.startsWith('elemental_')) {
      const elem = c.type.replace('elemental_', '');
      this.player.activePowerUp = elem;
      soundEngine.playElementalSound(elem);

      if (elem === 'fire') {
        this.player.shieldActive = true;
        this.player.powerUpTimer = 8;
        this.addFloatingText(this.player.x, this.player.y - 30, '🔥 FIRE SHIELD!', '#ff3300', 1.6);
        this.spawnElementalBurst(c.x, c.y, 'fire');
      } else if (elem === 'air') {
        this.player.speedBoostActive = true;
        this.player.powerUpTimer = 6;
        this.addFloatingText(this.player.x, this.player.y - 30, '🌀 AIR SPEED!', '#00ccff', 1.6);
        this.spawnElementalBurst(c.x, c.y, 'air');
      } else if (elem === 'water') {
        this.player.timeSlowActive = true;
        this.player.powerUpTimer = 7;
        this.addFloatingText(this.player.x, this.player.y - 30, '💧 WATER CALM!', '#0055ff', 1.6);
        this.spawnElementalBurst(c.x, c.y, 'water');
      } else if (elem === 'earth') {
        this.player.magnetActive = true;
        this.player.powerUpTimer = 8;
        this.addFloatingText(this.player.x, this.player.y - 30, '🌱 EARTH MAGNET!', '#22cc44', 1.6);
        this.spawnElementalBurst(c.x, c.y, 'earth');
      }
    }

    // Sparkle particles
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: c.x,
        y: c.y,
        vx: (Math.random() - 0.5) * 120,
        vy: (Math.random() - 0.5) * 120,
        color: '#ffd700',
        size: 3,
        life: 0.4,
        maxLife: 0.4
      });
    }
  }

  private spawnElementalBurst(x: number, y: number, element: string) {
    const numParticles = 32;

    if (element === 'fire') {
      const colors = ['#ff2200', '#ff6600', '#ffcc00', '#ffffff', '#ff0055'];
      for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 80 + Math.random() * 220;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 60,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 6 + 3,
          life: 0.5 + Math.random() * 0.5,
          maxLife: 1.0,
          shape: Math.random() < 0.5 ? 'flame' : 'spark',
          element: 'fire'
        });
      }
    } else if (element === 'air') {
      const colors = ['#00ffff', '#80f0ff', '#ffffff', '#0099ff'];
      for (let i = 0; i < numParticles; i++) {
        const angle = (i / numParticles) * Math.PI * 2 + Math.random() * 0.2;
        const speed = 120 + Math.random() * 260;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 5 + 2.5,
          life: 0.6 + Math.random() * 0.4,
          maxLife: 1.0,
          shape: 'spark',
          element: 'air'
        });
      }
    } else if (element === 'water') {
      const colors = ['#0066ff', '#00ccff', '#80e5ff', '#ffffff', '#0033aa'];
      for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 90 + Math.random() * 200;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 40,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 6 + 3,
          life: 0.6 + Math.random() * 0.5,
          maxLife: 1.1,
          shape: 'droplet',
          element: 'water'
        });
      }
    } else if (element === 'earth') {
      const colors = ['#22cc44', '#00ff66', '#88ff00', '#a0ff33', '#8b5a2b'];
      for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 70 + Math.random() * 240;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 6 + 3,
          life: 0.5 + Math.random() * 0.6,
          maxLife: 1.1,
          shape: Math.random() < 0.5 ? 'star' : 'spark',
          element: 'earth'
        });
      }
    }
  }

  private triggerCoffeeRushTime() {
    this.consecutiveCoffeeCount = 0;
    this.player.magnetActive = true;
    this.player.powerUpTimer = 8.0;
    this.player.abidarEnergy = 100;
    soundEngine.playCoffeeRushTimeSound();
    this.addFloatingText(this.width / 2, this.height / 2 - 40, '☕ COFFEE RUSH TIME! ☕', '#ffffff', 2.2);
  }

  private triggerSoundOfTheSpiral() {
    this.player.ieouaProgress = [];
    this.player.spiralModeTime = 10.0;
    this.player.score += 5000;
    this.addFloatingText(this.width / 2, this.height / 2 - 40, '✨ THE SOUND OF THE SPIRAL ✨', '#ffd700', 2.5);

    // Transmute all obstacles currently on screen into golden pins!
    this.obstacles.forEach((o) => {
      o.active = false;
      this.collectibles.push({
        id: Math.random().toString(),
        x: o.x,
        y: o.y,
        width: 24,
        height: 32,
        vx: 0,
        vy: 0,
        active: true,
        type: 'bowling_pin',
        pulsePhase: 0,
        rotation: 0,
        value: 200
      });
    });
  }

  // --- OBSTACLE HIT ---

  private hitObstacle(o: Obstacle) {
    if (this.player.shieldActive) {
      this.player.shieldActive = false;
      o.active = false;
      this.addFloatingText(this.player.x, this.player.y - 30, 'SHIELD ABSORBED!', '#ff4400', 1.4);
      return;
    }

    o.active = false;
    soundEngine.playHitSound();

    this.player.combo = 1;
    this.player.invulnerableTime = 1.8;
    this.player.abidarEnergy = Math.max(0, this.player.abidarEnergy - 25);
    this.player.lives--;

    this.addFloatingText(this.player.x, this.player.y - 30, 'HIT!', '#ff2200', 1.6);

    if (this.player.lives <= 0) {
      this.isGameOver = true;
      soundEngine.stopMusic();
      this.saveHighScore();
    }
  }

  // --- FINAL BOSS LOGIC ---

  private initBoss() {
    this.bossState = {
      active: true,
      x: this.width * 0.78,
      y: this.height * 0.5,
      width: 220,
      height: 220,
      health: 100,
      maxHealth: 100,
      phase: 'emerging',
      phaseTimer: 0,
      pulsate: 0,
      ieouaSequenceRequired: ['I', 'E', 'O', 'U', 'A'],
      currentRequiredIndex: 0
    };
  }

  private updateBoss(dt: number) {
    this.bossState.phaseTimer += dt;
    this.bossState.pulsate += dt * 3;

    // Boss floats up/down slowly
    this.bossState.y = this.height * 0.5 + Math.sin(this.bossState.pulsate) * 60;

    // Spawn required IEOUA sequence periodically in boss fight
    if (Math.random() < 0.04) {
      const nextVowel = this.bossState.ieouaSequenceRequired[this.bossState.currentRequiredIndex] || 'I';
      this.collectibles.push({
        id: Math.random().toString(),
        x: this.width + 20,
        y: 100 + Math.random() * (this.height - 200),
        width: 32,
        height: 32,
        vx: -120,
        vy: 0,
        active: true,
        type: 'ieoua_orb',
        vowel: nextVowel,
        pulsePhase: 0,
        rotation: 0,
        value: 500
      });
    }

    // Boss clears when player completes full IEOUA sequence or abides for 15s in front of Great Void
    if (this.player.totalAbideSeconds > 15 || this.player.ieouaProgress.length === 5) {
      this.bossState.active = false;
      this.isVictory = true;
      unlockNextStage(this.currentStageIndex);
      soundEngine.playStageClearSound();
      this.saveHighScore();
    }
  }

  // --- HELPER ---

  private addFloatingText(x: number, y: number, text: string, color: string, scale: number = 1.0) {
    this.floatingTexts.push({
      id: Math.random().toString(),
      x,
      y,
      text,
      color,
      alpha: 1.0,
      scale,
      vy: -35
    });
  }

  // --- RENDER FUNCTION ---

  private render() {
    const stage = this.getCurrentStageConfig();

    // Clear
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Space background
    pixelRenderer.drawSpaceBackground(this.ctx, this.width, this.height, stage, this.gameTime);

    // 2. Stars
    pixelRenderer.drawStars(this.ctx, this.stars, this.width, this.gameTime);

    // 3. Parallax Planets & Temples
    pixelRenderer.drawParallaxPlanets(this.ctx, this.planets, this.gameTime);

    // 4. Boss
    if (this.bossState.active) {
      pixelRenderer.drawBoss(this.ctx, this.bossState, this.gameTime);
    }

    // 5. Collectibles & Obstacles
    pixelRenderer.drawCollectibles(this.ctx, this.collectibles, this.gameTime);
    pixelRenderer.drawObstacles(this.ctx, this.obstacles, this.gameTime);

    // 6. Player (The Dude on Flying Carpet)
    pixelRenderer.drawPlayer(this.ctx, this.player, this.gameTime);

    // 7. Particles & Floating Text
    pixelRenderer.drawParticles(this.ctx, this.particles);
    pixelRenderer.drawFloatingTexts(this.ctx, this.floatingTexts);

    // 8. Retro HUD
    pixelRenderer.drawHUD(this.ctx, this.width, this.height, this.player, stage, this.gameTime);
  }

  public destroy() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    soundEngine.stopMusic();
  }
}
