export interface Vector2 {
  x: number;
  y: number;
}

export interface GameState {
  isRunning: boolean;
  currentLevel: number;
  playerForm: 'shadow' | 'physical';
  gameWon: boolean;
  gameOver: boolean;
  lives: number;
  score: number;
  timeRemaining: number;
  keysCollected: number;
  totalKeys: number;
  gameMode: 'menu' | 'levelSelect' | 'playing';
}

export interface Player {
  position: Vector2;
  velocity: Vector2;
  size: Vector2;
  form: 'shadow' | 'physical';
  grounded: boolean;
  canJump: boolean;
  canDoubleJump: boolean;
  hasDoubleJumped: boolean;
  dashCooldown: number;
  canDash: boolean;
  invulnerable: number;
  wallSliding: boolean;
  wallJumpCooldown: number;
}

export interface Platform {
  position: Vector2;
  size: Vector2;
  type: 'physical' | 'shadow' | 'both' | 'moving' | 'crumbling' | 'switch';
  color: string;
  movementPattern?: {
    start: Vector2;
    end: Vector2;
    speed: number;
    direction: number;
  };
  crumbleTimer?: number;
  maxCrumbleTime?: number;
  switchState?: boolean;
  id?: string;
}

export interface Portal {
  position: Vector2;
  size: Vector2;
  active: boolean;
  requiresKeys: boolean;
}

export interface Particle {
  position: Vector2;
  velocity: Vector2;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'spark' | 'trail' | 'explosion' | 'magic';
}

export interface Obstacle {
  position: Vector2;
  size: Vector2;
  type: 'spike' | 'laser' | 'saw' | 'ghost' | 'void';
  active: boolean;
  damage: number;
  pattern?: {
    duration: number;
    timer: number;
  };
  direction?: Vector2;
  speed?: number;
}

export interface Collectible {
  position: Vector2;
  size: Vector2;
  type: 'key' | 'powerup' | 'coin' | 'health';
  collected: boolean;
  value: number;
  effect?: string;
}

export interface Switch {
  position: Vector2;
  size: Vector2;
  activated: boolean;
  targetPlatforms: string[];
  type: 'toggle' | 'timed' | 'pressure';
  timer?: number;
  maxTimer?: number;
}

export interface Camera {
  position: Vector2;
  target: Vector2;
  smoothing: number;
  bounds: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
}

export interface Level {
  id: number;
  name: string;
  size: Vector2;
  platforms: Platform[];
  obstacles: Obstacle[];
  collectibles: Collectible[];
  switches: Switch[];
  portal: Portal;
  playerStart: Vector2;
  background: string;
  timeLimit: number;
  requiredKeys: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  specialMechanics?: string[];
}