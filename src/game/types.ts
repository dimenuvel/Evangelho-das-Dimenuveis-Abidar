/**
 * Game Types for Abidar - The Cosmic Carpet Ride
 */

export type CollectibleType =
  | 'bowling_pin'
  | 'coffee_cup'
  | 'golden_star'
  | 'ieoua_orb'
  | 'spiral_orb'
  | 'elemental_fire'
  | 'elemental_air'
  | 'elemental_water'
  | 'elemental_earth'
  | 'heart';

export type VowelLetter = 'I' | 'E' | 'O' | 'U' | 'A';

export type ObstacleType =
  | 'the_void'
  | 'the_false_one'
  | 'the_projector'
  | 'the_agitator'
  | 'the_materialist'
  | 'the_silencer';

export interface GameObject {
  id: string;
  x: number; // World X or Canvas X
  y: number; // Canvas Y
  width: number;
  height: number;
  vx: number;
  vy: number;
  active: boolean;
}

export interface Collectible extends GameObject {
  type: CollectibleType;
  vowel?: VowelLetter;
  pulsePhase: number;
  rotation: number;
  value: number;
}

export interface Obstacle extends GameObject {
  type: ObstacleType;
  animFrame: number;
  customData?: any;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  scale: number;
  vy: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  shape?: 'circle' | 'star' | 'spiral' | 'spark' | 'flame' | 'droplet';
  element?: 'fire' | 'air' | 'water' | 'earth';
}

export interface StarFieldLayer {
  x: number;
  y: number;
  speed: number;
  size: number;
  color: string;
  twinkle: number;
}

export interface ParallaxPlanet {
  x: number;
  y: number;
  radius: number;
  type: 'gas_giant' | 'temple_island' | 'moon' | 'crystal_spire' | 'spiral_galaxy';
  colorMain: string;
  colorAccent: string;
  hasRing: boolean;
  speed: number;
}

export interface PlayerState {
  x: number; // Horizontal position on screen (usually ~18% width)
  y: number; // Vertical position on screen
  targetY: number;
  vy: number;
  width: number;
  height: number;
  lives: number;
  maxLives: number;

  abidarEnergy: number; // 0..100
  score: number;
  combo: number;
  comboTimer: number;

  // Abide detection
  stillTime: number; // Seconds spent without vertical movement
  isAbiding: boolean;

  // Power ups
  activePowerUp: string | null;
  powerUpTimer: number;
  shieldActive: boolean;
  magnetActive: boolean;
  speedBoostActive: boolean;
  timeSlowActive: boolean;

  // IEOUA Sequence
  ieouaProgress: VowelLetter[]; // Tracks collected vowels in order I -> E -> O -> U -> A
  spiralModeTime: number; // Seconds left in SOUND OF THE SPIRAL mode

  // Stats
  pinsCollected: number;
  coffeesDrunk: number;
  totalAbideSeconds: number;
  presencePoints: number;

  invulnerableTime: number;
  isMaterialMode: boolean; // Triggers when Abidar Energy = 0
  trailHistory?: Array<{ x: number; y: number; vy: number }>;
}

export interface StageConfig {
  id: number;
  title: string;
  subtitle: string;
  targetDistance: number;
  durationSeconds: number;
  scrollSpeed: number;
  bgGradStart: string;
  bgGradEnd: string;
  nebulaColors: string[];
  obstacleFreq: number;
  collectibleFreq: number;
  allowedObstacles: ObstacleType[];
  hasBoss: boolean;
}

export interface BossState {
  active: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
  maxHealth: number;
  phase: 'emerging' | 'distorting' | 'final_wave' | 'dissolving';
  phaseTimer: number;
  pulsate: number;
  ieouaSequenceRequired: VowelLetter[];
  currentRequiredIndex: number;
}

export type DifficultySetting = 'easy' | 'normal' | 'hard';

export interface GameSettings {
  soundEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
  scanlinesEnabled: boolean;
  touchControlMode: 'drag' | 'zones' | 'joystick';
  difficulty?: DifficultySetting;
  activeCheats?: string[];
}
