import { GameState, Player, Platform, Portal, Particle, Level, Vector2, Obstacle, Collectible, Switch, Camera } from '../types/game';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gameState: GameState;
  private player: Player;
  private levels: Level[];
  private currentLevel: Level;
  private particles: Particle[] = [];
  private camera: Camera;
  private keys: { [key: string]: boolean } = {};
  private animationId: number | null = null;
  private lastTime: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.gameState = this.initializeGameState();
    this.player = this.initializePlayer();
    this.levels = this.initializeLevels();
    this.currentLevel = this.levels[0];
    this.camera = this.initializeCamera();
    this.setupEventListeners();
  }

  private initializeGameState(): GameState {
    return {
      isRunning: false,
      currentLevel: 0,
      playerForm: 'physical',
      gameWon: false,
      gameOver: false,
      lives: 3,
      score: 0,
      timeRemaining: 120,
      keysCollected: 0,
      totalKeys: 0,
      gameMode: 'menu'
    };
  }

  private initializePlayer(): Player {
    return {
      position: { x: 100, y: 400 },
      velocity: { x: 0, y: 0 },
      size: { x: 24, y: 32 },
      form: 'physical',
      grounded: false,
      canJump: true,
      canDoubleJump: true,
      hasDoubleJumped: false,
      dashCooldown: 0,
      canDash: true,
      invulnerable: 0,
      wallSliding: false,
      wallJumpCooldown: 0
    };
  }

  private initializeCamera(): Camera {
    return {
      position: { x: 0, y: 0 },
      target: { x: 0, y: 0 },
      smoothing: 0.1,
      bounds: {
        left: 0,
        right: 1600,
        top: 0,
        bottom: 1200
      }
    };
  }

  private initializeLevels(): Level[] {
    return [
      {
        id: 1,
        name: "Shadow Awakening",
        size: { x: 1600, y: 1200 },
        platforms: [
          { position: { x: 0, y: 1180 }, size: { x: 1600, y: 20 }, type: 'both', color: '#4a5568' },
          { position: { x: 200, y: 1100 }, size: { x: 120, y: 20 }, type: 'physical', color: '#3182ce' },
          { position: { x: 500, y: 900 }, size: { x: 200, y: 20 }, type: 'shadow', color: '#805ad5' },
          { position: { x: 800, y: 800 }, size: { x: 200, y: 20 }, type: 'both', color: '#4a5568' },
          { position: { x: 1100, y: 700 }, size: { x: 200, y: 20 }, type: 'physical', color: '#3182ce' },
          { position: { x: 1400, y: 600 }, size: { x: 200, y: 20 }, type: 'both', color: '#4a5568' }
        ],
        obstacles: [],
        collectibles: [
          { position: { x: 250, y: 950 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 850, y: 750 }, size: { x: 20, y: 20 }, type: 'coin', collected: false, value: 100 }
        ],
        switches: [],
        portal: { position: { x: 1450, y: 550 }, size: { x: 40, y: 60 }, active: true, requiresKeys: true },
        playerStart: { x: 50, y: 1100 },
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        timeLimit: 120,
        requiredKeys: 1,
        difficulty: 'easy'
      },

      {
        id: 2,
        name: "Shifting Realms",
        size: { x: 2000, y: 1400 },
        platforms: [
          { position: { x: 0, y: 1380 }, size: { x: 2000, y: 20 }, type: 'both', color: '#4a5568' },
          { position: { x: 150, y: 1200 }, size: { x: 150, y: 20 }, type: 'physical', color: '#3182ce' },
          { 
            position: { x: 400, y: 1100 }, 
            size: { x: 120, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 400, y: 1100 },
              end: { x: 600, y: 900 },
              speed: 2,
              direction: 1
            }
          },
          { position: { x: 800, y: 1000 }, size: { x: 100, y: 20 }, type: 'shadow', color: '#805ad5' },
          { 
            position: { x: 1000, y: 900 }, 
            size: { x: 120, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 1000, y: 900 },
              end: { x: 1200, y: 700 },
              speed: 1.5,
              direction: 1
            }
          },
          { position: { x: 1400, y: 600 }, size: { x: 150, y: 20 }, type: 'both', color: '#4a5568' },
          { position: { x: 1700, y: 500 }, size: { x: 200, y: 20 }, type: 'physical', color: '#3182ce' }
        ],
        obstacles: [
          { position: { x: 700, y: 1360 }, size: { x: 100, y: 20 }, type: 'spike', active: true, damage: 1 },
          { position: { x: 1200, y: 1360 }, size: { x: 150, y: 20 }, type: 'spike', active: true, damage: 1 }
        ],
        collectibles: [
          { position: { x: 200, y: 1150 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 850, y: 950 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 1450, y: 550 }, size: { x: 20, y: 20 }, type: 'powerup', collected: false, value: 1, effect: 'double_jump' }
        ],
        switches: [],
        portal: { position: { x: 1750, y: 450 }, size: { x: 40, y: 60 }, active: true, requiresKeys: true },
        playerStart: { x: 50, y: 1300 },
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        timeLimit: 180,
        requiredKeys: 2,
        difficulty: 'medium'
      },

      {
        id: 3,
        name: "Fragile Balance",
        size: { x: 2400, y: 1600 },
        platforms: [
          { position: { x: 0, y: 1580 }, size: { x: 2400, y: 20 }, type: 'both', color: '#4a5568' },
          { position: { x: 200, y: 1400 }, size: { x: 120, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 120 },
          { position: { x: 400, y: 1300 }, size: { x: 120, y: 20 }, type: 'shadow', color: '#805ad5' },
          { position: { x: 600, y: 1200 }, size: { x: 120, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 90 },
          { position: { x: 800, y: 1100 }, size: { x: 120, y: 20 }, type: 'switch', color: '#ed8936', switchState: false, id: 'bridge1' },
          { position: { x: 1200, y: 1000 }, size: { x: 200, y: 20 }, type: 'physical', color: '#3182ce' },
          { position: { x: 1500, y: 900 }, size: { x: 120, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 150 },
          { position: { x: 1800, y: 800 }, size: { x: 120, y: 20 }, type: 'shadow', color: '#805ad5' },
          { position: { x: 2100, y: 700 }, size: { x: 200, y: 20 }, type: 'both', color: '#4a5568' }
        ],
        obstacles: [
          { position: { x: 1000, y: 1080 }, size: { x: 150, y: 20 }, type: 'laser', active: false, damage: 1, pattern: { duration: 180, timer: 0 } },
          { position: { x: 1650, y: 880 }, size: { x: 100, y: 20 }, type: 'saw', active: true, damage: 1, direction: { x: 1, y: 0 }, speed: 2 }
        ],
        collectibles: [
          { position: { x: 250, y: 1350 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 1250, y: 950 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 1850, y: 750 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 }
        ],
        switches: [
          { position: { x: 850, y: 1070 }, size: { x: 30, y: 30 }, activated: false, targetPlatforms: ['bridge1'], type: 'toggle' }
        ],
        portal: { position: { x: 2150, y: 650 }, size: { x: 40, y: 60 }, active: true, requiresKeys: true },
        playerStart: { x: 50, y: 1500 },
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        timeLimit: 240,
        requiredKeys: 3,
        difficulty: 'hard'
      },

      {
        id: 4,
        name: "Spectral Gauntlet",
        size: { x: 2800, y: 1800 },
        platforms: [
          { position: { x: 0, y: 1780 }, size: { x: 2800, y: 20 }, type: 'both', color: '#4a5568' },
          { position: { x: 200, y: 1600 }, size: { x: 150, y: 20 }, type: 'physical', color: '#3182ce' },
          { position: { x: 500, y: 1500 }, size: { x: 150, y: 20 }, type: 'shadow', color: '#805ad5' },
          { position: { x: 800, y: 1400 }, size: { x: 200, y: 20 }, type: 'both', color: '#4a5568' },
          { 
            position: { x: 1200, y: 1300 }, 
            size: { x: 120, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 1200, y: 1300 },
              end: { x: 1400, y: 1100 },
              speed: 1.8,
              direction: 1
            }
          },
          { position: { x: 1600, y: 1000 }, size: { x: 150, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 100 },
          { position: { x: 1900, y: 900 }, size: { x: 150, y: 20 }, type: 'shadow', color: '#805ad5' },
          { position: { x: 2200, y: 800 }, size: { x: 150, y: 20 }, type: 'physical', color: '#3182ce' },
          { position: { x: 2500, y: 700 }, size: { x: 200, y: 20 }, type: 'both', color: '#4a5568' }
        ],
        obstacles: [
          { position: { x: 400, y: 1760 }, size: { x: 80, y: 20 }, type: 'void', active: true, damage: 2 },
          { position: { x: 700, y: 1380 }, size: { x: 80, y: 80 }, type: 'ghost', active: true, damage: 1, direction: { x: 1, y: 0 }, speed: 1 },
          { position: { x: 1100, y: 1760 }, size: { x: 80, y: 20 }, type: 'void', active: true, damage: 2 },
          { position: { x: 1500, y: 980 }, size: { x: 80, y: 80 }, type: 'ghost', active: true, damage: 1, direction: { x: -1, y: 0 }, speed: 1.5 },
          { position: { x: 2100, y: 780 }, size: { x: 80, y: 80 }, type: 'ghost', active: true, damage: 1, direction: { x: 1, y: 0 }, speed: 1.2 }
        ],
        collectibles: [
          { position: { x: 250, y: 1550 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 550, y: 1450 }, size: { x: 20, y: 20 }, type: 'health', collected: false, value: 1 },
          { position: { x: 850, y: 1350 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 1950, y: 850 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 2550, y: 650 }, size: { x: 20, y: 20 }, type: 'powerup', collected: false, value: 1, effect: 'dash' }
        ],
        switches: [],
        portal: { position: { x: 2600, y: 650 }, size: { x: 40, y: 60 }, active: true, requiresKeys: true },
        playerStart: { x: 50, y: 1700 },
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        timeLimit: 300,
        requiredKeys: 3,
        difficulty: 'expert',
        specialMechanics: ['ghosts', 'void_zones']
      },

      {
        id: 5,
        name: "Shadow Master",
        size: { x: 3200, y: 2000 },
        platforms: [
          { position: { x: 0, y: 1980 }, size: { x: 3200, y: 20 }, type: 'both', color: '#4a5568' },
          { position: { x: 150, y: 1800 }, size: { x: 100, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 60 },
          { position: { x: 350, y: 1700 }, size: { x: 100, y: 20 }, type: 'shadow', color: '#805ad5' },
          { 
            position: { x: 550, y: 1600 }, 
            size: { x: 100, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 550, y: 1600 },
              end: { x: 750, y: 1400 },
              speed: 2.5,
              direction: 1
            }
          },
          { position: { x: 900, y: 1500 }, size: { x: 120, y: 20 }, type: 'switch', color: '#ed8936', switchState: false, id: 'bridge2' },
          { position: { x: 1200, y: 1400 }, size: { x: 100, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 90 },
          { 
            position: { x: 1400, y: 1300 }, 
            size: { x: 100, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 1400, y: 1300 },
              end: { x: 1600, y: 1100 },
              speed: 2,
              direction: 1
            }
          },
          { position: { x: 1800, y: 1200 }, size: { x: 100, y: 20 }, type: 'physical', color: '#3182ce' },
          { position: { x: 2000, y: 1100 }, size: { x: 100, y: 20 }, type: 'shadow', color: '#805ad5' },
          { position: { x: 2200, y: 1000 }, size: { x: 100, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 120 },
          { 
            position: { x: 2400, y: 900 }, 
            size: { x: 100, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 2400, y: 900 },
              end: { x: 2600, y: 700 },
              speed: 1.5,
              direction: 1
            }
          },
          { position: { x: 2800, y: 800 }, size: { x: 150, y: 20 }, type: 'both', color: '#4a5568' },
          { position: { x: 3000, y: 600 }, size: { x: 200, y: 20 }, type: 'both', color: '#4a5568' }
        ],
        obstacles: [
          { position: { x: 300, y: 1960 }, size: { x: 100, y: 20 }, type: 'void', active: true, damage: 2 },
          { position: { x: 600, y: 1580 }, size: { x: 80, y: 80 }, type: 'ghost', active: true, damage: 1, direction: { x: 1, y: 0 }, speed: 1.8 },
          { position: { x: 1050, y: 1480 }, size: { x: 100, y: 20 }, type: 'laser', active: false, damage: 1, pattern: { duration: 120, timer: 0 } },
          { position: { x: 1350, y: 1280 }, size: { x: 80, y: 80 }, type: 'saw', active: true, damage: 1, direction: { x: 1, y: 0 }, speed: 2.5 },
          { position: { x: 1700, y: 1960 }, size: { x: 100, y: 20 }, type: 'void', active: true, damage: 2 },
          { position: { x: 2150, y: 980 }, size: { x: 80, y: 80 }, type: 'ghost', active: true, damage: 1, direction: { x: -1, y: 0 }, speed: 2 },
          { position: { x: 2700, y: 780 }, size: { x: 80, y: 80 }, type: 'ghost', active: true, damage: 1, direction: { x: 1, y: 0 }, speed: 1.5 }
        ],
        collectibles: [
          { position: { x: 200, y: 1750 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 400, y: 1650 }, size: { x: 20, y: 20 }, type: 'health', collected: false, value: 1 },
          { position: { x: 950, y: 1450 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 1850, y: 1150 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 2050, y: 1050 }, size: { x: 20, y: 20 }, type: 'coin', collected: false, value: 500 },
          { position: { x: 2850, y: 750 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 3050, y: 550 }, size: { x: 20, y: 20 }, type: 'powerup', collected: false, value: 1, effect: 'invincibility' }
        ],
        switches: [
          { position: { x: 950, y: 1470 }, size: { x: 30, y: 30 }, activated: false, targetPlatforms: ['bridge2'], type: 'timed', timer: 0, maxTimer: 300 }
        ],
        portal: { position: { x: 3100, y: 550 }, size: { x: 40, y: 60 }, active: true, requiresKeys: true },
        playerStart: { x: 50, y: 1900 },
        background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
        timeLimit: 420,
        requiredKeys: 4,
        difficulty: 'expert',
        specialMechanics: ['all_mechanics']
      },

      {
        id: 6,
        name: "Elemental Chaos",
        size: { x: 4000, y: 2400 },
        platforms: [
          { position: { x: 0, y: 2380 }, size: { x: 4000, y: 20 }, type: 'both', color: '#4a5568' },
          { position: { x: 200, y: 2200 }, size: { x: 150, y: 20 }, type: 'physical', color: '#3182ce' },
          { position: { x: 500, y: 2100 }, size: { x: 120, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 80 },
          { 
            position: { x: 800, y: 2000 }, 
            size: { x: 100, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 800, y: 2000 },
              end: { x: 1200, y: 1800 },
              speed: 3,
              direction: 1
            }
          },
          { position: { x: 1400, y: 1900 }, size: { x: 100, y: 20 }, type: 'shadow', color: '#805ad5' },
          { position: { x: 1700, y: 1800 }, size: { x: 120, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 60 },
          { 
            position: { x: 2000, y: 1700 }, 
            size: { x: 100, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 2000, y: 1700 },
              end: { x: 2300, y: 1500 },
              speed: 2.5,
              direction: 1
            }
          },
          { position: { x: 2500, y: 1600 }, size: { x: 150, y: 20 }, type: 'physical', color: '#3182ce' },
          { position: { x: 2800, y: 1500 }, size: { x: 100, y: 20 }, type: 'shadow', color: '#805ad5' },
          { position: { x: 3100, y: 1400 }, size: { x: 120, y: 20 }, type: 'switch', color: '#ed8936', switchState: false, id: 'elemental1' },
          { position: { x: 3400, y: 1300 }, size: { x: 150, y: 20 }, type: 'both', color: '#4a5568' },
          { position: { x: 3700, y: 1200 }, size: { x: 200, y: 20 }, type: 'both', color: '#4a5568' }
        ],
        obstacles: [
          { position: { x: 400, y: 2360 }, size: { x: 80, y: 20 }, type: 'fireball', active: true, damage: 1, direction: { x: 1, y: 0 }, speed: 3 },
          { position: { x: 900, y: 1980 }, size: { x: 100, y: 100 }, type: 'ice', active: true, damage: 0, freezeTimer: 0 },
          { position: { x: 1500, y: 1880 }, size: { x: 80, y: 80 }, type: 'wind', active: true, damage: 0, windForce: { x: 5, y: -2 } },
          { position: { x: 2100, y: 1680 }, size: { x: 80, y: 80 }, type: 'fireball', active: true, damage: 1, direction: { x: -1, y: 0 }, speed: 2.5 },
          { position: { x: 2700, y: 1480 }, size: { x: 80, y: 80 }, type: 'teleporter', active: true, damage: 0, teleportTarget: { x: 3200, y: 1380 } },
          { position: { x: 3200, y: 1380 }, size: { x: 80, y: 80 }, type: 'teleporter', active: true, damage: 0, teleportTarget: { x: 2700, y: 1480 } },
          { position: { x: 3500, y: 1280 }, size: { x: 80, y: 80 }, type: 'mirror', active: true, damage: 0 }
        ],
        collectibles: [
          { position: { x: 250, y: 2150 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 1450, y: 1850 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 2550, y: 1550 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 3150, y: 1350 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 3750, y: 1150 }, size: { x: 20, y: 20 }, type: 'powerup', collected: false, value: 1, effect: 'fire_resistance' }
        ],
        switches: [
          { position: { x: 3150, y: 1370 }, size: { x: 30, y: 30 }, activated: false, targetPlatforms: ['elemental1'], type: 'toggle' }
        ],
        portal: { position: { x: 3800, y: 1150 }, size: { x: 40, y: 60 }, active: true, requiresKeys: true },
        playerStart: { x: 50, y: 2300 },
        background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%)',
        timeLimit: 480,
        requiredKeys: 4,
        difficulty: 'expert',
        specialMechanics: ['elemental_obstacles', 'teleporters']
      },

      {
        id: 7,
        name: "Gravity Defiance",
        size: { x: 4800, y: 2800 },
        platforms: [
          { position: { x: 0, y: 2780 }, size: { x: 4800, y: 20 }, type: 'both', color: '#4a5568' },
          { position: { x: 150, y: 2600 }, size: { x: 120, y: 20 }, type: 'physical', color: '#3182ce' },
          { position: { x: 400, y: 2500 }, size: { x: 100, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 45 },
          { 
            position: { x: 650, y: 2400 }, 
            size: { x: 80, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 650, y: 2400 },
              end: { x: 650, y: 2000 },
              speed: 4,
              direction: 1
            }
          },
          { position: { x: 900, y: 2300 }, size: { x: 100, y: 20 }, type: 'shadow', color: '#805ad5' },
          { position: { x: 1200, y: 2200 }, size: { x: 80, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 30 },
          { 
            position: { x: 1450, y: 2100 }, 
            size: { x: 100, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 1450, y: 2100 },
              end: { x: 1800, y: 1900 },
              speed: 3.5,
              direction: 1
            }
          },
          { position: { x: 2000, y: 2000 }, size: { x: 120, y: 20 }, type: 'physical', color: '#3182ce' },
          { position: { x: 2300, y: 1900 }, size: { x: 100, y: 20 }, type: 'switch', color: '#ed8936', switchState: false, id: 'gravity1' },
          { position: { x: 2600, y: 1800 }, size: { x: 80, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 40 },
          { 
            position: { x: 2850, y: 1700 }, 
            size: { x: 100, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 2850, y: 1700 },
              end: { x: 3200, y: 1500 },
              speed: 4,
              direction: 1
            }
          },
          { position: { x: 3400, y: 1600 }, size: { x: 120, y: 20 }, type: 'shadow', color: '#805ad5' },
          { position: { x: 3700, y: 1500 }, size: { x: 100, y: 20 }, type: 'physical', color: '#3182ce' },
          { position: { x: 4000, y: 1400 }, size: { x: 120, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 50 },
          { position: { x: 4300, y: 1300 }, size: { x: 150, y: 20 }, type: 'both', color: '#4a5568' },
          { position: { x: 4600, y: 1200 }, size: { x: 200, y: 20 }, type: 'both', color: '#4a5568' }
        ],
        obstacles: [
          { position: { x: 300, y: 2760 }, size: { x: 80, y: 20 }, type: 'void', active: true, damage: 2 },
          { position: { x: 750, y: 2380 }, size: { x: 80, y: 80 }, type: 'ghost', active: true, damage: 1, direction: { x: 1, y: 0 }, speed: 2.5 },
          { position: { x: 1100, y: 2180 }, size: { x: 80, y: 80 }, type: 'saw', active: true, damage: 1, direction: { x: 1, y: 1 }, speed: 3 },
          { position: { x: 1600, y: 2080 }, size: { x: 100, y: 20 }, type: 'laser', active: false, damage: 1, pattern: { duration: 90, timer: 0 } },
          { position: { x: 2150, y: 1980 }, size: { x: 80, y: 80 }, type: 'fireball', active: true, damage: 1, direction: { x: -1, y: 0 }, speed: 4 },
          { position: { x: 2500, y: 1880 }, size: { x: 80, y: 80 }, type: 'ghost', active: true, damage: 1, direction: { x: 1, y: 0 }, speed: 3 },
          { position: { x: 3000, y: 1680 }, size: { x: 80, y: 80 }, type: 'wind', active: true, damage: 0, windForce: { x: -3, y: -4 } },
          { position: { x: 3550, y: 1580 }, size: { x: 80, y: 80 }, type: 'ice', active: true, damage: 0, freezeTimer: 0 },
          { position: { x: 4150, y: 1380 }, size: { x: 80, y: 80 }, type: 'mirror', active: true, damage: 0 }
        ],
        collectibles: [
          { position: { x: 200, y: 2550 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 950, y: 2250 }, size: { x: 20, y: 20 }, type: 'health', collected: false, value: 1 },
          { position: { x: 1500, y: 2050 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 2050, y: 1950 }, size: { x: 20, y: 20 }, type: 'coin', collected: false, value: 300 },
          { position: { x: 2900, y: 1650 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 3450, y: 1550 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 4050, y: 1350 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 4650, y: 1150 }, size: { x: 20, y: 20 }, type: 'powerup', collected: false, value: 1, effect: 'gravity_boots' }
        ],
        switches: [
          { position: { x: 2350, y: 1870 }, size: { x: 30, y: 30 }, activated: false, targetPlatforms: ['gravity1'], type: 'timed', timer: 0, maxTimer: 240 }
        ],
        portal: { position: { x: 4700, y: 1150 }, size: { x: 40, y: 60 }, active: true, requiresKeys: true },
        playerStart: { x: 50, y: 2700 },
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        timeLimit: 540,
        requiredKeys: 5,
        difficulty: 'expert',
        specialMechanics: ['gravity_zones', 'advanced_movement']
      },

      {
        id: 8,
        name: "Temporal Maze",
        size: { x: 5600, y: 3200 },
        platforms: [
          { position: { x: 0, y: 3180 }, size: { x: 5600, y: 20 }, type: 'both', color: '#4a5568' },
          { position: { x: 200, y: 3000 }, size: { x: 100, y: 20 }, type: 'physical', color: '#3182ce' },
          { position: { x: 450, y: 2900 }, size: { x: 80, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 25 },
          { 
            position: { x: 700, y: 2800 }, 
            size: { x: 60, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 700, y: 2800 },
              end: { x: 1000, y: 2600 },
              speed: 5,
              direction: 1
            }
          },
          { position: { x: 1200, y: 2700 }, size: { x: 80, y: 20 }, type: 'shadow', color: '#805ad5' },
          { position: { x: 1450, y: 2600 }, size: { x: 60, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 20 },
          { 
            position: { x: 1700, y: 2500 }, 
            size: { x: 80, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 1700, y: 2500 },
              end: { x: 2000, y: 2300 },
              speed: 4.5,
              direction: 1
            }
          },
          { position: { x: 2200, y: 2400 }, size: { x: 100, y: 20 }, type: 'switch', color: '#ed8936', switchState: false, id: 'temporal1' },
          { position: { x: 2500, y: 2300 }, size: { x: 80, y: 20 }, type: 'physical', color: '#3182ce' },
          { position: { x: 2800, y: 2200 }, size: { x: 60, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 15 },
          { 
            position: { x: 3050, y: 2100 }, 
            size: { x: 80, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 3050, y: 2100 },
              end: { x: 3400, y: 1900 },
              speed: 6,
              direction: 1
            }
          },
          { position: { x: 3600, y: 2000 }, size: { x: 100, y: 20 }, type: 'shadow', color: '#805ad5' },
          { position: { x: 3900, y: 1900 }, size: { x: 80, y: 20 }, type: 'switch', color: '#ed8936', switchState: false, id: 'temporal2' },
          { position: { x: 4200, y: 1800 }, size: { x: 60, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 30 },
          { 
            position: { x: 4450, y: 1700 }, 
            size: { x: 80, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 4450, y: 1700 },
              end: { x: 4800, y: 1500 },
              speed: 5.5,
              direction: 1
            }
          },
          { position: { x: 5000, y: 1600 }, size: { x: 120, y: 20 }, type: 'physical', color: '#3182ce' },
          { position: { x: 5300, y: 1500 }, size: { x: 150, y: 20 }, type: 'both', color: '#4a5568' },
          { position: { x: 5500, y: 1400 }, size: { x: 100, y: 20 }, type: 'both', color: '#4a5568' }
        ],
        obstacles: [
          { position: { x: 350, y: 3160 }, size: { x: 80, y: 20 }, type: 'void', active: true, damage: 2 },
          { position: { x: 600, y: 2880 }, size: { x: 80, y: 80 }, type: 'fireball', active: true, damage: 1, direction: { x: 1, y: 0 }, speed: 5 },
          { position: { x: 1100, y: 2680 }, size: { x: 80, y: 80 }, type: 'ghost', active: true, damage: 1, direction: { x: -1, y: 0 }, speed: 4 },
          { position: { x: 1600, y: 2480 }, size: { x: 80, y: 80 }, type: 'teleporter', active: true, damage: 0, teleportTarget: { x: 2700, y: 2180 } },
          { position: { x: 2700, y: 2180 }, size: { x: 80, y: 80 }, type: 'teleporter', active: true, damage: 0, teleportTarget: { x: 1600, y: 2480 } },
          { position: { x: 2400, y: 2380 }, size: { x: 80, y: 80 }, type: 'ice', active: true, damage: 0, freezeTimer: 0 },
          { position: { x: 3200, y: 2080 }, size: { x: 100, y: 20 }, type: 'laser', active: false, damage: 1, pattern: { duration: 60, timer: 0 } },
          { position: { x: 3750, y: 1980 }, size: { x: 80, y: 80 }, type: 'wind', active: true, damage: 0, windForce: { x: 4, y: -3 } },
          { position: { x: 4350, y: 1780 }, size: { x: 80, y: 80 }, type: 'saw', active: true, damage: 1, direction: { x: -1, y: 1 }, speed: 4 },
          { position: { x: 5150, y: 1580 }, size: { x: 80, y: 80 }, type: 'mirror', active: true, damage: 0 }
        ],
        collectibles: [
          { position: { x: 250, y: 2950 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 1250, y: 2650 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 2250, y: 2350 }, size: { x: 20, y: 20 }, type: 'health', collected: false, value: 1 },
          { position: { x: 2550, y: 2250 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 3650, y: 1950 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 4500, y: 1650 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 5050, y: 1550 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 5550, y: 1350 }, size: { x: 20, y: 20 }, type: 'powerup', collected: false, value: 1, effect: 'time_slow' }
        ],
        switches: [
          { position: { x: 2250, y: 2370 }, size: { x: 30, y: 30 }, activated: false, targetPlatforms: ['temporal1'], type: 'timed', timer: 0, maxTimer: 180 },
          { position: { x: 3950, y: 1870 }, size: { x: 30, y: 30 }, activated: false, targetPlatforms: ['temporal2'], type: 'toggle' }
        ],
        portal: { position: { x: 5550, y: 1350 }, size: { x: 40, y: 60 }, active: true, requiresKeys: true },
        playerStart: { x: 50, y: 3100 },
        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #d299c2 100%)',
        timeLimit: 600,
        requiredKeys: 6,
        difficulty: 'expert',
        specialMechanics: ['time_manipulation', 'complex_teleporters']
      },

      {
        id: 9,
        name: "Shadow Nexus",
        size: { x: 6400, y: 3600 },
        platforms: [
          { position: { x: 0, y: 3580 }, size: { x: 6400, y: 20 }, type: 'both', color: '#4a5568' },
          { position: { x: 150, y: 3400 }, size: { x: 80, y: 20 }, type: 'physical', color: '#3182ce' },
          { position: { x: 350, y: 3300 }, size: { x: 60, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 20 },
          { 
            position: { x: 550, y: 3200 }, 
            size: { x: 50, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 550, y: 3200 },
              end: { x: 800, y: 3000 },
              speed: 6,
              direction: 1
            }
          },
          { position: { x: 1000, y: 3100 }, size: { x: 60, y: 20 }, type: 'shadow', color: '#805ad5' },
          { position: { x: 1250, y: 3000 }, size: { x: 50, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 15 },
          { 
            position: { x: 1450, y: 2900 }, 
            size: { x: 60, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 1450, y: 2900 },
              end: { x: 1700, y: 2700 },
              speed: 7,
              direction: 1
            }
          },
          { position: { x: 1900, y: 2800 }, size: { x: 80, y: 20 }, type: 'switch', color: '#ed8936', switchState: false, id: 'nexus1' },
          { position: { x: 2200, y: 2700 }, size: { x: 60, y: 20 }, type: 'physical', color: '#3182ce' },
          { position: { x: 2450, y: 2600 }, size: { x: 50, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 12 },
          { 
            position: { x: 2650, y: 2500 }, 
            size: { x: 60, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 2650, y: 2500 },
              end: { x: 2950, y: 2300 },
              speed: 8,
              direction: 1
            }
          },
          { position: { x: 3150, y: 2400 }, size: { x: 80, y: 20 }, type: 'shadow', color: '#805ad5' },
          { position: { x: 3400, y: 2300 }, size: { x: 60, y: 20 }, type: 'switch', color: '#ed8936', switchState: false, id: 'nexus2' },
          { position: { x: 3650, y: 2200 }, size: { x: 50, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 18 },
          { 
            position: { x: 3850, y: 2100 }, 
            size: { x: 60, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 3850, y: 2100 },
              end: { x: 4150, y: 1900 },
              speed: 6.5,
              direction: 1
            }
          },
          { position: { x: 4350, y: 2000 }, size: { x: 80, y: 20 }, type: 'physical', color: '#3182ce' },
          { position: { x: 4600, y: 1900 }, size: { x: 60, y: 20 }, type: 'shadow', color: '#805ad5' },
          { position: { x: 4850, y: 1800 }, size: { x: 50, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 25 },
          { 
            position: { x: 5050, y: 1700 }, 
            size: { x: 60, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 5050, y: 1700 },
              end: { x: 5350, y: 1500 },
              speed: 5.5,
              direction: 1
            }
          },
          { position: { x: 5550, y: 1600 }, size: { x: 100, y: 20 }, type: 'switch', color: '#ed8936', switchState: false, id: 'nexus3' },
          { position: { x: 5800, y: 1500 }, size: { x: 120, y: 20 }, type: 'physical', color: '#3182ce' },
          { position: { x: 6100, y: 1400 }, size: { x: 150, y: 20 }, type: 'both', color: '#4a5568' },
          { position: { x: 6300, y: 1300 }, size: { x: 100, y: 20 }, type: 'both', color: '#4a5568' }
        ],
        obstacles: [
          { position: { x: 250, y: 3560 }, size: { x: 80, y: 20 }, type: 'void', active: true, damage: 2 },
          { position: { x: 500, y: 3280 }, size: { x: 80, y: 80 }, type: 'ghost', active: true, damage: 1, direction: { x: 1, y: 0 }, speed: 5 },
          { position: { x: 900, y: 3080 }, size: { x: 80, y: 80 }, type: 'fireball', active: true, damage: 1, direction: { x: -1, y: 0 }, speed: 6 },
          { position: { x: 1350, y: 2880 }, size: { x: 80, y: 80 }, type: 'teleporter', active: true, damage: 0, teleportTarget: { x: 3000, y: 2280 } },
          { position: { x: 3000, y: 2280 }, size: { x: 80, y: 80 }, type: 'teleporter', active: true, damage: 0, teleportTarget: { x: 1350, y: 2880 } },
          { position: { x: 1800, y: 2780 }, size: { x: 80, y: 80 }, type: 'ice', active: true, damage: 0, freezeTimer: 0 },
          { position: { x: 2350, y: 2580 }, size: { x: 80, y: 80 }, type: 'wind', active: true, damage: 0, windForce: { x: -5, y: -2 } },
          { position: { x: 2800, y: 2480 }, size: { x: 100, y: 20 }, type: 'laser', active: false, damage: 1, pattern: { duration: 45, timer: 0 } },
          { position: { x: 3550, y: 2180 }, size: { x: 80, y: 80 }, type: 'saw', active: true, damage: 1, direction: { x: 1, y: -1 }, speed: 5 },
          { position: { x: 4000, y: 2080 }, size: { x: 80, y: 80 }, type: 'mirror', active: true, damage: 0 },
          { position: { x: 4500, y: 1980 }, size: { x: 80, y: 80 }, type: 'ghost', active: true, damage: 1, direction: { x: -1, y: 0 }, speed: 4.5 },
          { position: { x: 4950, y: 1780 }, size: { x: 80, y: 80 }, type: 'fireball', active: true, damage: 1, direction: { x: 1, y: 0 }, speed: 7 },
          { position: { x: 5700, y: 1580 }, size: { x: 80, y: 80 }, type: 'wind', active: true, damage: 0, windForce: { x: 3, y: -4 } }
        ],
        collectibles: [
          { position: { x: 200, y: 3350 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 1050, y: 3050 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 1950, y: 2750 }, size: { x: 20, y: 20 }, type: 'health', collected: false, value: 1 },
          { position: { x: 2250, y: 2650 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 3200, y: 2350 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 4400, y: 1950 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 4650, y: 1850 }, size: { x: 20, y: 20 }, type: 'coin', collected: false, value: 500 },
          { position: { x: 5600, y: 1550 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 5850, y: 1450 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 6350, y: 1250 }, size: { x: 20, y: 20 }, type: 'powerup', collected: false, value: 1, effect: 'shadow_mastery' }
        ],
        switches: [
          { position: { x: 1950, y: 2770 }, size: { x: 30, y: 30 }, activated: false, targetPlatforms: ['nexus1'], type: 'timed', timer: 0, maxTimer: 150 },
          { position: { x: 3450, y: 2270 }, size: { x: 30, y: 30 }, activated: false, targetPlatforms: ['nexus2'], type: 'toggle' },
          { position: { x: 5600, y: 1570 }, size: { x: 30, y: 30 }, activated: false, targetPlatforms: ['nexus3'], type: 'pressure' }
        ],
        portal: { position: { x: 6350, y: 1250 }, size: { x: 40, y: 60 }, active: true, requiresKeys: true },
        playerStart: { x: 50, y: 3500 },
        background: 'linear-gradient(135deg, #2c3e50 0%, #4a6741 50%, #8e44ad 100%)',
        timeLimit: 660,
        requiredKeys: 7,
        difficulty: 'expert',
        specialMechanics: ['shadow_mastery', 'nexus_portals']
      },

      {
        id: 10,
        name: "The Ultimate Challenge",
        size: { x: 8000, y: 4000 },
        platforms: [
          { position: { x: 0, y: 3980 }, size: { x: 8000, y: 20 }, type: 'both', color: '#4a5568' },
          { position: { x: 100, y: 3800 }, size: { x: 60, y: 20 }, type: 'physical', color: '#3182ce' },
          { position: { x: 250, y: 3700 }, size: { x: 40, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 15 },
          { 
            position: { x: 400, y: 3600 }, 
            size: { x: 40, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 400, y: 3600 },
              end: { x: 600, y: 3400 },
              speed: 8,
              direction: 1
            }
          },
          { position: { x: 750, y: 3500 }, size: { x: 50, y: 20 }, type: 'shadow', color: '#805ad5' },
          { position: { x: 900, y: 3400 }, size: { x: 40, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 10 },
          { 
            position: { x: 1050, y: 3300 }, 
            size: { x: 50, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 1050, y: 3300 },
              end: { x: 1300, y: 3100 },
              speed: 9,
              direction: 1
            }
          },
          { position: { x: 1450, y: 3200 }, size: { x: 60, y: 20 }, type: 'switch', color: '#ed8936', switchState: false, id: 'ultimate1' },
          { position: { x: 1650, y: 3100 }, size: { x: 40, y: 20 }, type: 'physical', color: '#3182ce' },
          { position: { x: 1800, y: 3000 }, size: { x: 40, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 8 },
          { 
            position: { x: 1950, y: 2900 }, 
            size: { x: 50, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 1950, y: 2900 },
              end: { x: 2200, y: 2700 },
              speed: 10,
              direction: 1
            }
          },
          { position: { x: 2400, y: 2800 }, size: { x: 60, y: 20 }, type: 'shadow', color: '#805ad5' },
          { position: { x: 2600, y: 2700 }, size: { x: 50, y: 20 }, type: 'switch', color: '#ed8936', switchState: false, id: 'ultimate2' },
          { position: { x: 2800, y: 2600 }, size: { x: 40, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 12 },
          { 
            position: { x: 2950, y: 2500 }, 
            size: { x: 50, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 2950, y: 2500 },
              end: { x: 3250, y: 2300 },
              speed: 8.5,
              direction: 1
            }
          },
          { position: { x: 3450, y: 2400 }, size: { x: 60, y: 20 }, type: 'physical', color: '#3182ce' },
          { position: { x: 3650, y: 2300 }, size: { x: 40, y: 20 }, type: 'shadow', color: '#805ad5' },
          { position: { x: 3800, y: 2200 }, size: { x: 40, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 6 },
          { 
            position: { x: 3950, y: 2100 }, 
            size: { x: 50, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 3950, y: 2100 },
              end: { x: 4250, y: 1900 },
              speed: 11,
              direction: 1
            }
          },
          { position: { x: 4450, y: 2000 }, size: { x: 60, y: 20 }, type: 'switch', color: '#ed8936', switchState: false, id: 'ultimate3' },
          { position: { x: 4650, y: 1900 }, size: { x: 50, y: 20 }, type: 'physical', color: '#3182ce' },
          { position: { x: 4850, y: 1800 }, size: { x: 40, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 5 },
          { 
            position: { x: 5000, y: 1700 }, 
            size: { x: 50, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 5000, y: 1700 },
              end: { x: 5300, y: 1500 },
              speed: 12,
              direction: 1
            }
          },
          { position: { x: 5500, y: 1600 }, size: { x: 60, y: 20 }, type: 'shadow', color: '#805ad5' },
          { position: { x: 5700, y: 1500 }, size: { x: 50, y: 20 }, type: 'switch', color: '#ed8936', switchState: false, id: 'ultimate4' },
          { position: { x: 5900, y: 1400 }, size: { x: 40, y: 20 }, type: 'crumbling', color: '#e53e3e', crumbleTimer: 0, maxCrumbleTime: 4 },
          { 
            position: { x: 6050, y: 1300 }, 
            size: { x: 50, y: 20 }, 
            type: 'moving', 
            color: '#38a169',
            movementPattern: {
              start: { x: 6050, y: 1300 },
              end: { x: 6350, y: 1100 },
              speed: 10,
              direction: 1
            }
          },
          { position: { x: 6550, y: 1200 }, size: { x: 80, y: 20 }, type: 'physical', color: '#3182ce' },
          { position: { x: 6800, y: 1100 }, size: { x: 100, y: 20 }, type: 'shadow', color: '#805ad5' },
          { position: { x: 7100, y: 1000 }, size: { x: 120, y: 20 }, type: 'both', color: '#4a5568' },
          { position: { x: 7400, y: 900 }, size: { x: 150, y: 20 }, type: 'both', color: '#4a5568' },
          { position: { x: 7700, y: 800 }, size: { x: 200, y: 20 }, type: 'both', color: '#4a5568' }
        ],
        obstacles: [
          { position: { x: 180, y: 3960 }, size: { x: 60, y: 20 }, type: 'void', active: true, damage: 3 },
          { position: { x: 350, y: 3780 }, size: { x: 80, y: 80 }, type: 'ghost', active: true, damage: 1, direction: { x: 1, y: 0 }, speed: 6 },
          { position: { x: 700, y: 3580 }, size: { x: 80, y: 80 }, type: 'fireball', active: true, damage: 1, direction: { x: -1, y: 0 }, speed: 8 },
          { position: { x: 1000, y: 3380 }, size: { x: 80, y: 80 }, type: 'teleporter', active: true, damage: 0, teleportTarget: { x: 2350, y: 2680 } },
          { position: { x: 2350, y: 2680 }, size: { x: 80, y: 80 }, type: 'teleporter', active: true, damage: 0, teleportTarget: { x: 1000, y: 3380 } },
          { position: { x: 1350, y: 3180 }, size: { x: 80, y: 80 }, type: 'ice', active: true, damage: 0, freezeTimer: 0 },
          { position: { x: 1750, y: 2980 }, size: { x: 80, y: 80 }, type: 'wind', active: true, damage: 0, windForce: { x: -6, y: -3 } },
          { position: { x: 2150, y: 2880 }, size: { x: 100, y: 20 }, type: 'laser', active: false, damage: 2, pattern: { duration: 30, timer: 0 } },
          { position: { x: 2550, y: 2680 }, size: { x: 80, y: 80 }, type: 'saw', active: true, damage: 2, direction: { x: 1, y: -1 }, speed: 6 },
          { position: { x: 2900, y: 2580 }, size: { x: 80, y: 80 }, type: 'mirror', active: true, damage: 0 },
          { position: { x: 3350, y: 2380 }, size: { x: 80, y: 80 }, type: 'ghost', active: true, damage: 1, direction: { x: -1, y: 0 }, speed: 7 },
          { position: { x: 3750, y: 2180 }, size: { x: 80, y: 80 }, type: 'fireball', active: true, damage: 1, direction: { x: 1, y: 0 }, speed: 9 },
          { position: { x: 4150, y: 2080 }, size: { x: 80, y: 80 }, type: 'wind', active: true, damage: 0, windForce: { x: 4, y: -5 } },
          { position: { x: 4550, y: 1980 }, size: { x: 80, y: 80 }, type: 'ice', active: true, damage: 0, freezeTimer: 0 },
          { position: { x: 4950, y: 1780 }, size: { x: 80, y: 80 }, type: 'saw', active: true, damage: 2, direction: { x: -1, y: 1 }, speed: 7 },
          { position: { x: 5350, y: 1680 }, size: { x: 100, y: 20 }, type: 'laser', active: false, damage: 2, pattern: { duration: 25, timer: 0 } },
          { position: { x: 5800, y: 1480 }, size: { x: 80, y: 80 }, type: 'ghost', active: true, damage: 1, direction: { x: 1, y: 0 }, speed: 8 },
          { position: { x: 6200, y: 1380 }, size: { x: 80, y: 80 }, type: 'fireball', active: true, damage: 1, direction: { x: -1, y: 0 }, speed: 10 },
          { position: { x: 6650, y: 1180 }, size: { x: 80, y: 80 }, type: 'wind', active: true, damage: 0, windForce: { x: 3, y: -6 } },
          { position: { x: 7050, y: 980 }, size: { x: 80, y: 80 }, type: 'mirror', active: true, damage: 0 },
          { position: { x: 7450, y: 880 }, size: { x: 80, y: 80 }, type: 'void', active: true, damage: 3 }
        ],
        collectibles: [
          { position: { x: 150, y: 3750 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 800, y: 3450 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 1500, y: 3150 }, size: { x: 20, y: 20 }, type: 'health', collected: false, value: 1 },
          { position: { x: 1700, y: 3050 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 2450, y: 2750 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 2650, y: 2650 }, size: { x: 20, y: 20 }, type: 'coin', collected: false, value: 1000 },
          { position: { x: 3500, y: 2350 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 4500, y: 1950 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 4700, y: 1850 }, size: { x: 20, y: 20 }, type: 'health', collected: false, value: 1 },
          { position: { x: 5550, y: 1550 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 5750, y: 1450 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 6600, y: 1150 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 6850, y: 1050 }, size: { x: 20, y: 20 }, type: 'key', collected: false, value: 1 },
          { position: { x: 7750, y: 750 }, size: { x: 20, y: 20 }, type: 'powerup', collected: false, value: 1, effect: 'ultimate_mastery' }
        ],
        switches: [
          { position: { x: 1500, y: 3170 }, size: { x: 30, y: 30 }, activated: false, targetPlatforms: ['ultimate1'], type: 'timed', timer: 0, maxTimer: 120 },
          { position: { x: 2650, y: 2670 }, size: { x: 30, y: 30 }, activated: false, targetPlatforms: ['ultimate2'], type: 'toggle' },
          { position: { x: 4500, y: 1970 }, size: { x: 30, y: 30 }, activated: false, targetPlatforms: ['ultimate3'], type: 'pressure' },
          { position: { x: 5750, y: 1470 }, size: { x: 30, y: 30 }, activated: false, targetPlatforms: ['ultimate4'], type: 'timed', timer: 0, maxTimer: 90 }
        ],
        portal: { position: { x: 7800, y: 750 }, size: { x: 40, y: 60 }, active: true, requiresKeys: true },
        playerStart: { x: 50, y: 3900 },
        background: 'linear-gradient(135deg, #000000 0%, #434343 25%, #ff6b6b 50%, #feca57 75%, #48dbfb 100%)',
        timeLimit: 720,
        requiredKeys: 10,
        difficulty: 'expert',
        specialMechanics: ['ultimate_challenge', 'all_advanced_mechanics']
      }
    ];
  }

  private setupEventListeners(): void {
    document.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        this.toggleForm();
      }
      
      if (e.key.toLowerCase() === 'x' && this.player.canDash && this.player.dashCooldown <= 0) {
        this.performDash();
      }
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }

  private toggleForm(): void {
    const oldForm = this.player.form;
    this.player.form = this.player.form === 'physical' ? 'shadow' : 'physical';
    this.gameState.playerForm = this.player.form;
    
    this.createFormSwitchParticles();
  }

  private performDash(): void {
    const dashDirection = this.keys['d'] || this.keys['arrowright'] ? 1 : 
                         this.keys['a'] || this.keys['arrowleft'] ? -1 : 
                         this.player.velocity.x > 0 ? 1 : -1;
    
    this.player.velocity.x = dashDirection * 12;
    this.player.dashCooldown = 60;
    this.player.canDash = false;
    this.player.invulnerable = 20;
    
    this.createDashParticles();
  }

  private createFormSwitchParticles(): void {
    const colors = this.player.form === 'shadow' ? ['#805ad5', '#9f7aea', '#b794f6'] : ['#3182ce', '#4299e1', '#63b3ed'];
    
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        position: {
          x: this.player.position.x + this.player.size.x / 2 + (Math.random() - 0.5) * 50,
          y: this.player.position.y + this.player.size.y / 2 + (Math.random() - 0.5) * 50
        },
        velocity: {
          x: (Math.random() - 0.5) * 10,
          y: (Math.random() - 0.5) * 10
        },
        life: 80,
        maxLife: 80,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 3,
        type: 'magic'
      });
    }
  }

  private createDashParticles(): void {
    for (let i = 0; i < 15; i++) {
      this.particles.push({
        position: {
          x: this.player.position.x + Math.random() * this.player.size.x,
          y: this.player.position.y + Math.random() * this.player.size.y
        },
        velocity: {
          x: (Math.random() - 0.5) * 6,
          y: (Math.random() - 0.5) * 6
        },
        life: 40,
        maxLife: 40,
        color: '#ffd700',
        size: Math.random() * 4 + 2,
        type: 'trail'
      });
    }
  }

  private createTeleportParticles(): void {
    for (let i = 0; i < 25; i++) {
      this.particles.push({
        position: {
          x: this.player.position.x + this.player.size.x / 2 + (Math.random() - 0.5) * 60,
          y: this.player.position.y + this.player.size.y / 2 + (Math.random() - 0.5) * 60
        },
        velocity: {
          x: (Math.random() - 0.5) * 12,
          y: (Math.random() - 0.5) * 12
        },
        life: 60,
        maxLife: 60,
        color: '#00ffff',
        size: Math.random() * 6 + 3,
        type: 'magic'
      });
    }
  }
  private updatePlayer(deltaTime: number): void {
    if (this.player.dashCooldown > 0) this.player.dashCooldown--;
    if (this.player.invulnerable > 0) this.player.invulnerable--;
    if (this.player.wallJumpCooldown > 0) this.player.wallJumpCooldown--;

    const moveSpeed = 0.8;
    const maxSpeed = 7;
    
    if (this.keys['a'] || this.keys['arrowleft']) {
      this.player.velocity.x = Math.max(this.player.velocity.x - moveSpeed, -maxSpeed);
    } else if (this.keys['d'] || this.keys['arrowright']) {
      this.player.velocity.x = Math.min(this.player.velocity.x + moveSpeed, maxSpeed);
    } else {
      this.player.velocity.x *= 0.85;
    }

    if ((this.keys['w'] || this.keys['arrowup']) && this.player.canJump) {
      if (this.player.grounded) {
        this.player.velocity.y = -16;
        this.player.grounded = false;
        this.player.canJump = false;
      } else if (this.player.canDoubleJump && !this.player.hasDoubleJumped) {
        this.player.velocity.y = -14;
        this.player.hasDoubleJumped = true;
        this.createJumpParticles();
      }
    }

    this.checkWallSliding();
    
    if (this.player.wallSliding) {
      this.player.velocity.y = Math.min(this.player.velocity.y, 3);
      
      if ((this.keys['w'] || this.keys['arrowup']) && this.player.wallJumpCooldown <= 0) {
        const wallDirection = this.player.velocity.x > 0 ? -1 : 1;
        this.player.velocity.x = wallDirection * 10;
        this.player.velocity.y = -14;
        this.player.wallJumpCooldown = 20;
        this.player.wallSliding = false;
      }
    }

    const gravity = 0.9;
    this.player.velocity.y += gravity;

    this.player.velocity.y = Math.min(this.player.velocity.y, 20);

    this.player.position.x += this.player.velocity.x;
    this.player.position.y += this.player.velocity.y;

    this.checkCollisions();
    this.checkObstacleCollisions();
    this.checkCollectibleCollisions();
    this.checkSwitchCollisions();

    if (this.player.position.x < 0) this.player.position.x = 0;
    if (this.player.position.x + this.player.size.x > this.currentLevel.size.x) {
      this.player.position.x = this.currentLevel.size.x - this.player.size.x;
    }

    if (this.player.position.y > this.currentLevel.size.y) {
      this.takeDamage(1);
    }

    if (this.player.grounded && this.player.dashCooldown <= 0) {
      this.player.canDash = true;
    }

    this.checkPortalCollision();
  }

  private createJumpParticles(): void {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        position: {
          x: this.player.position.x + Math.random() * this.player.size.x,
          y: this.player.position.y + this.player.size.y
        },
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: Math.random() * -3
        },
        life: 30,
        maxLife: 30,
        color: '#ffffff',
        size: Math.random() * 3 + 1,
        type: 'spark'
      });
    }
  }

  private checkWallSliding(): void {
    if (this.player.grounded || this.player.velocity.y < 0) {
      this.player.wallSliding = false;
      return;
    }

    const checkLeft = this.player.position.x <= 5;
    const checkRight = this.player.position.x + this.player.size.x >= this.currentLevel.size.x - 5;
    
    if (checkLeft || checkRight) {
      this.player.wallSliding = true;
      return;
    }

    for (const platform of this.currentLevel.platforms) {
      if (this.canCollideWithPlatform(platform)) {
        const playerRight = this.player.position.x + this.player.size.x;
        const playerLeft = this.player.position.x;
        const playerTop = this.player.position.y;
        const playerBottom = this.player.position.y + this.player.size.y;
        
        const platformRight = platform.position.x + platform.size.x;
        const platformLeft = platform.position.x;
        const platformTop = platform.position.y;
        const platformBottom = platform.position.y + platform.size.y;
        
        if (playerBottom > platformTop && playerTop < platformBottom) {
          if ((playerRight >= platformLeft && playerRight <= platformLeft + 5) ||
              (playerLeft <= platformRight && playerLeft >= platformRight - 5)) {
            this.player.wallSliding = true;
            return;
          }
        }
      }
    }
    
    this.player.wallSliding = false;
  }

  private updateMovingPlatforms(): void {
    for (const platform of this.currentLevel.platforms) {
      if (platform.type === 'moving' && platform.movementPattern) {
        const pattern = platform.movementPattern;
        const distance = Math.sqrt(
          Math.pow(pattern.end.x - pattern.start.x, 2) + 
          Math.pow(pattern.end.y - pattern.start.y, 2)
        );
        
        platform.position.x += (pattern.end.x - pattern.start.x) / distance * pattern.speed * pattern.direction;
        platform.position.y += (pattern.end.y - pattern.start.y) / distance * pattern.speed * pattern.direction;
        
        const currentDistance = Math.sqrt(
          Math.pow(platform.position.x - pattern.start.x, 2) + 
          Math.pow(platform.position.y - pattern.start.y, 2)
        );
        
        if (currentDistance >= distance || currentDistance <= 0) {
          pattern.direction *= -1;
          const temp = pattern.start;
          pattern.start = pattern.end;
          pattern.end = temp;
        }
      }
    }
  }

  private updateCrumblingPlatforms(): void {
    for (const platform of this.currentLevel.platforms) {
      if (platform.type === 'crumbling' && platform.crumbleTimer !== undefined && platform.maxCrumbleTime !== undefined) {
        const playerOnPlatform = this.isColliding(this.player, platform) && this.canCollideWithPlatform(platform);
        
        if (playerOnPlatform) {
          platform.crumbleTimer++;
          if (platform.crumbleTimer >= platform.maxCrumbleTime) {
            platform.type = 'both'; 
            platform.color = '#666666';
          }
        }
      }
    }
  }

  private updateObstacles(): void {
    for (const obstacle of this.currentLevel.obstacles) {
      if (obstacle.type === 'laser' && obstacle.pattern) {
        obstacle.pattern.timer++;
        if (obstacle.pattern.timer >= obstacle.pattern.duration) {
          obstacle.active = !obstacle.active;
          obstacle.pattern.timer = 0;
        }
      }
      
      if (obstacle.type === 'saw' && obstacle.direction && obstacle.speed) {
        obstacle.position.x += obstacle.direction.x * obstacle.speed;
        obstacle.position.y += obstacle.direction.y * obstacle.speed;
        
        if (obstacle.position.x <= 0 || obstacle.position.x + obstacle.size.x >= this.currentLevel.size.x) {
          obstacle.direction.x *= -1;
        }
        if (obstacle.position.y <= 0 || obstacle.position.y + obstacle.size.y >= this.currentLevel.size.y) {
          obstacle.direction.y *= -1;
        }
      }
      
      if (obstacle.type === 'ghost' && obstacle.direction && obstacle.speed) {
        obstacle.position.x += obstacle.direction.x * obstacle.speed;
        obstacle.position.y += obstacle.direction.y * obstacle.speed;
        
        if (obstacle.position.x <= 0 || obstacle.position.x + obstacle.size.x >= this.currentLevel.size.x) {
          obstacle.direction.x *= -1;
        }
      }
      
      if (obstacle.type === 'fireball' && obstacle.direction && obstacle.speed) {
        obstacle.position.x += obstacle.direction.x * obstacle.speed;
        obstacle.position.y += obstacle.direction.y * obstacle.speed;
        
        if (obstacle.position.x <= 0 || obstacle.position.x + obstacle.size.x >= this.currentLevel.size.x) {
          obstacle.direction.x *= -1;
        }
        if (obstacle.position.y <= 0 || obstacle.position.y + obstacle.size.y >= this.currentLevel.size.y) {
          obstacle.direction.y *= -1;
        }
      }
      
      if (obstacle.type === 'wind' && obstacle.windForce) {
        const distance = Math.sqrt(
          Math.pow(this.player.position.x - obstacle.position.x, 2) + 
          Math.pow(this.player.position.y - obstacle.position.y, 2)
        );
        if (distance < 150) {
          this.player.velocity.x += obstacle.windForce.x * 0.1;
          this.player.velocity.y += obstacle.windForce.y * 0.1;
        }
      }
      
      if (obstacle.type === 'ice' && obstacle.freezeTimer !== undefined) {
        if (this.isColliding(this.player, obstacle)) {
          obstacle.freezeTimer++;
          if (obstacle.freezeTimer > 60) {
            this.player.velocity.x *= 0.3;
            this.player.velocity.y *= 0.3;
          }
        } else {
          obstacle.freezeTimer = Math.max(0, obstacle.freezeTimer - 2);
        }
      }
      
      if (obstacle.type === 'teleporter' && obstacle.teleportTarget) {
        if (this.isColliding(this.player, obstacle)) {
          this.player.position.x = obstacle.teleportTarget.x;
          this.player.position.y = obstacle.teleportTarget.y;
          this.createTeleportParticles();
        }
      }
      
      if (obstacle.type === 'mirror') {
        if (this.isColliding(this.player, obstacle)) {
          this.toggleForm();
          this.createFormSwitchParticles();
        }
      }
    }
  }

  private updateSwitches(): void {
    for (const switchObj of this.currentLevel.switches) {
      if (switchObj.type === 'timed' && switchObj.activated && switchObj.timer !== undefined && switchObj.maxTimer !== undefined) {
        switchObj.timer++;
        if (switchObj.timer >= switchObj.maxTimer) {
          switchObj.activated = false;
          switchObj.timer = 0;
          this.updateSwitchPlatforms(switchObj);
        }
      }
    }
  }

  private updateSwitchPlatforms(switchObj: Switch): void {
    for (const platformId of switchObj.targetPlatforms) {
      const platform = this.currentLevel.platforms.find(p => p.id === platformId);
      if (platform) {
        platform.switchState = switchObj.activated;
        platform.color = switchObj.activated ? '#38a169' : '#e53e3e';
      }
    }
  }

  private checkCollisions(): void {
    this.player.grounded = false;
    
    for (const platform of this.currentLevel.platforms) {
      if (this.canCollideWithPlatform(platform)) {
        if (this.isColliding(this.player, platform)) {
          this.resolveCollision(platform);
        }
      }
    }
  }

  private checkObstacleCollisions(): void {
    if (this.player.invulnerable > 0) return;
    
    for (const obstacle of this.currentLevel.obstacles) {
      if (obstacle.active && this.isColliding(this.player, obstacle)) {
        this.takeDamage(obstacle.damage);
        break;
      }
    }
  }

  private checkCollectibleCollisions(): void {
    for (const collectible of this.currentLevel.collectibles) {
      if (!collectible.collected && this.isColliding(this.player, collectible)) {
        collectible.collected = true;
        this.gameState.score += collectible.value * 10;
        
        if (collectible.type === 'key') {
          this.gameState.keysCollected++;
        } else if (collectible.type === 'health') {
          this.gameState.lives = Math.min(this.gameState.lives + 1, 5);
        } else if (collectible.type === 'powerup') {
          this.applyPowerup(collectible.effect || '');
        }
        
        this.createCollectParticles(collectible);
      }
    }
  }

  private checkSwitchCollisions(): void {
    for (const switchObj of this.currentLevel.switches) {
      if (this.isColliding(this.player, switchObj)) {
        if (!switchObj.activated) {
          switchObj.activated = true;
          if (switchObj.type === 'timed') {
            switchObj.timer = 0;
          }
          this.updateSwitchPlatforms(switchObj);
        }
      }
    }
  }

  private applyPowerup(effect: string): void {
    switch (effect) {
      case 'double_jump':
        this.player.canDoubleJump = true;
        break;
      case 'dash':
        this.player.canDash = true;
        break;
      case 'invincibility':
        this.player.invulnerable = 300;
        break;
    }
  }

  private createCollectParticles(collectible: Collectible): void {
    const colors = {
      key: ['#ffd700', '#ffed4e', '#f6e05e'],
      health: ['#48bb78', '#68d391', '#9ae6b4'],
      coin: ['#ed8936', '#f6ad55', '#fbd38d'],
      powerup: ['#9f7aea', '#b794f6', '#d6bcfa']
    };
    
    const colorArray = colors[collectible.type] || colors.coin;
    
    for (let i = 0; i < 12; i++) {
      this.particles.push({
        position: {
          x: collectible.position.x + collectible.size.x / 2,
          y: collectible.position.y + collectible.size.y / 2
        },
        velocity: {
          x: (Math.random() - 0.5) * 8,
          y: (Math.random() - 0.5) * 8
        },
        life: 60,
        maxLife: 60,
        color: colorArray[Math.floor(Math.random() * colorArray.length)],
        size: Math.random() * 4 + 2,
        type: 'explosion'
      });
    }
  }

  private takeDamage(damage: number): void {
    this.gameState.lives -= damage;
    this.player.invulnerable = 120;
    
    if (this.gameState.lives <= 0) {
      this.gameState.gameOver = true;
      this.gameState.isRunning = false;
    } else {
      this.resetPlayerPosition();
    }
  }

  private canCollideWithPlatform(platform: Platform): boolean {
    if (platform.type === 'switch') {
      return platform.switchState === true;
    }
    return platform.type === 'both' || platform.type === this.player.form || platform.type === 'moving' || platform.type === 'crumbling';
  }

  private isColliding(obj1: any, obj2: any): boolean {
    return (
      obj1.position.x < obj2.position.x + obj2.size.x &&
      obj1.position.x + obj1.size.x > obj2.position.x &&
      obj1.position.y < obj2.position.y + obj2.size.y &&
      obj1.position.y + obj1.size.y > obj2.position.y
    );
  }

  private resolveCollision(platform: Platform): void {
    const playerCenterX = this.player.position.x + this.player.size.x / 2;
    const playerCenterY = this.player.position.y + this.player.size.y / 2;
    const platformCenterX = platform.position.x + platform.size.x / 2;
    const platformCenterY = platform.position.y + platform.size.y / 2;

    const overlapX = Math.min(
      this.player.position.x + this.player.size.x - platform.position.x,
      platform.position.x + platform.size.x - this.player.position.x
    );
    const overlapY = Math.min(
      this.player.position.y + this.player.size.y - platform.position.y,
      platform.position.y + platform.size.y - this.player.position.y
    );

    if (overlapX < overlapY) {
      if (playerCenterX < platformCenterX) {
        this.player.position.x = platform.position.x - this.player.size.x;
      } else {
        this.player.position.x = platform.position.x + platform.size.x;
      }
      this.player.velocity.x = 0;
    } else {
      if (playerCenterY < platformCenterY) {
        this.player.position.y = platform.position.y - this.player.size.y;
        this.player.velocity.y = 0;
        this.player.grounded = true;
        this.player.canJump = true;
        this.player.hasDoubleJumped = false;
      } else {
        this.player.position.y = platform.position.y + platform.size.y;
        this.player.velocity.y = 0;
      }
    }
  }

  private checkPortalCollision(): void {
    const portal = this.currentLevel.portal;
    if (portal.active && this.isColliding(this.player, portal)) {
      if (!portal.requiresKeys || this.gameState.keysCollected >= this.currentLevel.requiredKeys) {
        this.nextLevel();
      }
    }
  }

  private nextLevel(): void {
    if (this.gameState.currentLevel < this.levels.length - 1) {
      this.gameState.currentLevel++;
      this.currentLevel = this.levels[this.gameState.currentLevel];
      this.gameState.keysCollected = 0;
      this.gameState.timeRemaining = this.currentLevel.timeLimit;
      this.resetPlayerPosition();
      this.updateCameraBounds();
    } else {
      this.gameState.gameWon = true;
      this.gameState.isRunning = false;
    }
  }

  private resetLevel(): void {
    this.resetPlayerPosition();
    this.player.form = 'physical';
    this.gameState.playerForm = 'physical';
    this.gameState.keysCollected = 0;
    this.gameState.timeRemaining = this.currentLevel.timeLimit;
    this.particles = [];
    
    for (const collectible of this.currentLevel.collectibles) {
      collectible.collected = false;
    }
    
    for (const switchObj of this.currentLevel.switches) {
      switchObj.activated = false;
      switchObj.timer = 0;
    }
    
    for (const platform of this.currentLevel.platforms) {
      if (platform.crumbleTimer !== undefined) {
        platform.crumbleTimer = 0;
        platform.type = 'crumbling';
        platform.color = '#e53e3e';
      }
      if (platform.switchState !== undefined) {
        platform.switchState = false;
        platform.color = '#e53e3e';
      }
    }
  }

  private resetPlayerPosition(): void {
    this.player.position = { ...this.currentLevel.playerStart };
    this.player.velocity = { x: 0, y: 0 };
    this.player.grounded = false;
    this.player.canJump = true;
    this.player.hasDoubleJumped = false;
    this.player.dashCooldown = 0;
    this.player.canDash = true;
    this.player.invulnerable = 60;
    this.player.wallSliding = false;
    this.player.wallJumpCooldown = 0;
  }

  private updateCamera(): void {
    this.camera.target.x = this.player.position.x + this.player.size.x / 2 - this.canvas.width / 2;
    this.camera.target.y = this.player.position.y + this.player.size.y / 2 - this.canvas.height / 2;
    
    this.camera.target.x = Math.max(this.camera.bounds.left, Math.min(this.camera.target.x, this.camera.bounds.right - this.canvas.width));
    this.camera.target.y = Math.max(this.camera.bounds.top, Math.min(this.camera.target.y, this.camera.bounds.bottom - this.canvas.height));
    
    this.camera.position.x += (this.camera.target.x - this.camera.position.x) * this.camera.smoothing;
    this.camera.position.y += (this.camera.target.y - this.camera.position.y) * this.camera.smoothing;
  }

  private updateCameraBounds(): void {
    this.camera.bounds = {
      left: 0,
      right: this.currentLevel.size.x,
      top: 0,
      bottom: this.currentLevel.size.y
    };
  }

  private updateParticles(): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.position.x += particle.velocity.x;
      particle.position.y += particle.velocity.y;
      particle.life--;
      
      if (particle.type === 'explosion' || particle.type === 'spark') {
        particle.velocity.y += 0.2;
      }
      
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private updateTimer(): void {
    if (this.gameState.timeRemaining > 0) {
      this.gameState.timeRemaining--;
    } else {
      this.takeDamage(1);
      this.gameState.timeRemaining = this.currentLevel.timeLimit;
    }
  }

  private render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.save();
    this.ctx.translate(-this.camera.position.x, -this.camera.position.y);

    const gradient = this.ctx.createLinearGradient(0, 0, this.currentLevel.size.x, this.currentLevel.size.y);
    if (this.player.form === 'shadow') {
      gradient.addColorStop(0, '#2d3748');
      gradient.addColorStop(1, '#1a202c');
    } else {
      gradient.addColorStop(0, '#e2e8f0');
      gradient.addColorStop(1, '#cbd5e0');
    }
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.currentLevel.size.x, this.currentLevel.size.y);

    for (const platform of this.currentLevel.platforms) {
      if (this.canCollideWithPlatform(platform)) {
        this.ctx.fillStyle = platform.color;
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = platform.color;
      } else {
        this.ctx.fillStyle = platform.color + '40';
        this.ctx.shadowBlur = 0;
      }
      
      this.ctx.fillRect(
        platform.position.x,
        platform.position.y,
        platform.size.x,
        platform.size.y
      );
    }

    for (const obstacle of this.currentLevel.obstacles) {
      if (!obstacle.active && obstacle.type !== 'void') continue;
      
      this.ctx.save();
      switch (obstacle.type) {
        case 'spike':
          this.ctx.fillStyle = '#e53e3e';
          this.ctx.shadowBlur = 5;
          this.ctx.shadowColor = '#e53e3e';
          break;
        case 'laser':
          this.ctx.fillStyle = obstacle.active ? '#ff0000' : '#660000';
          this.ctx.shadowBlur = obstacle.active ? 15 : 0;
          this.ctx.shadowColor = '#ff0000';
          break;
        case 'saw':
          this.ctx.fillStyle = '#c53030';
          this.ctx.shadowBlur = 10;
          this.ctx.shadowColor = '#c53030';
          break;
        case 'ghost':
          this.ctx.fillStyle = this.player.form === 'shadow' ? '#805ad5' : '#805ad540';
          this.ctx.shadowBlur = 12;
          this.ctx.shadowColor = '#805ad5';
          break;
        case 'void':
          this.ctx.fillStyle = '#000000';
          this.ctx.shadowBlur = 20;
          this.ctx.shadowColor = '#000000';
          break;
        case 'fireball':
          this.ctx.fillStyle = '#ff4500';
          this.ctx.shadowBlur = 15;
          this.ctx.shadowColor = '#ff4500';
          break;
        case 'ice':
          this.ctx.fillStyle = '#87ceeb';
          this.ctx.shadowBlur = 10;
          this.ctx.shadowColor = '#87ceeb';
          break;
        case 'wind':
          this.ctx.fillStyle = '#e6f3ff';
          this.ctx.shadowBlur = 8;
          this.ctx.shadowColor = '#87ceeb';
          break;
        case 'teleporter':
          this.ctx.fillStyle = '#00ffff';
          this.ctx.shadowBlur = 20;
          this.ctx.shadowColor = '#00ffff';
          break;
        case 'mirror':
          this.ctx.fillStyle = '#c0c0c0';
          this.ctx.shadowBlur = 12;
          this.ctx.shadowColor = '#c0c0c0';
          break;
      }
      
      this.ctx.fillRect(
        obstacle.position.x,
        obstacle.position.y,
        obstacle.size.x,
        obstacle.size.y
      );
      this.ctx.restore();
    }

    for (const collectible of this.currentLevel.collectibles) {
      if (collectible.collected) continue;
      
      this.ctx.save();
      switch (collectible.type) {
        case 'key':
          this.ctx.fillStyle = '#ffd700';
          this.ctx.shadowBlur = 15;
          this.ctx.shadowColor = '#ffd700';
          break;
        case 'health':
          this.ctx.fillStyle = '#48bb78';
          this.ctx.shadowBlur = 10;
          this.ctx.shadowColor = '#48bb78';
          break;
        case 'coin':
          this.ctx.fillStyle = '#ed8936';
          this.ctx.shadowBlur = 8;
          this.ctx.shadowColor = '#ed8936';
          break;
        case 'powerup':
          this.ctx.fillStyle = '#9f7aea';
          this.ctx.shadowBlur = 12;
          this.ctx.shadowColor = '#9f7aea';
          break;
      }
      
      this.ctx.fillRect(
        collectible.position.x,
        collectible.position.y,
        collectible.size.x,
        collectible.size.y
      );
      this.ctx.restore();
    }

    for (const switchObj of this.currentLevel.switches) {
      this.ctx.save();
      this.ctx.fillStyle = switchObj.activated ? '#38a169' : '#e53e3e';
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = switchObj.activated ? '#38a169' : '#e53e3e';
      this.ctx.fillRect(
        switchObj.position.x,
        switchObj.position.y,
        switchObj.size.x,
        switchObj.size.y
      );
      this.ctx.restore();
    }

    const portal = this.currentLevel.portal;
    if (portal.active) {
      this.ctx.save();
      const canEnter = !portal.requiresKeys || this.gameState.keysCollected >= this.currentLevel.requiredKeys;
      this.ctx.shadowBlur = 25;
      this.ctx.shadowColor = canEnter ? '#f6e05e' : '#666666';
      this.ctx.fillStyle = canEnter ? '#f6e05e' : '#666666';
      this.ctx.fillRect(portal.position.x, portal.position.y, portal.size.x, portal.size.y);
      this.ctx.restore();
    }

    this.ctx.save();
    if (this.player.invulnerable > 0 && Math.floor(this.player.invulnerable / 5) % 2) {
      this.ctx.globalAlpha = 0.5;
    }
    
    if (this.player.form === 'shadow') {
      this.ctx.fillStyle = '#805ad5';
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = '#805ad5';
    } else {
      this.ctx.fillStyle = '#3182ce';
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = '#3182ce';
    }
    
    this.ctx.fillRect(
      this.player.position.x,
      this.player.position.y,
      this.player.size.x,
      this.player.size.y
    );
    this.ctx.restore();

    for (const particle of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = particle.life / particle.maxLife;
      this.ctx.fillStyle = particle.color;
      this.ctx.shadowBlur = 5;
      this.ctx.shadowColor = particle.color;
      this.ctx.fillRect(
        particle.position.x - particle.size / 2,
        particle.position.y - particle.size / 2,
        particle.size,
        particle.size
      );
      this.ctx.restore();
    }

    this.ctx.restore();
    
    this.ctx.shadowBlur = 0;
  }

  private gameLoop = (currentTime: number): void => {
    if (!this.gameState.isRunning) return;

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.updatePlayer(deltaTime);
    this.updateMovingPlatforms();
    this.updateCrumblingPlatforms();
    this.updateObstacles();
    this.updateSwitches();
    this.updateParticles();
    this.updateCamera();
    
    if (Math.floor(currentTime / 1000) !== Math.floor((currentTime - deltaTime) / 1000)) {
      this.updateTimer();
    }
    
    this.render();

    this.animationId = requestAnimationFrame(this.gameLoop);
  };

  public start(): void {
    this.gameState.isRunning = true;
    this.gameState.gameMode = 'playing';
    this.gameState.keysCollected = 0;
    this.gameState.timeRemaining = this.currentLevel.timeLimit;
    this.updateCameraBounds();
    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);
  }

  public startLevel(levelIndex: number): void {
    this.gameState.currentLevel = levelIndex;
    this.currentLevel = this.levels[levelIndex];
    this.resetLevel();
    this.start();
  }

  public showLevelSelect(): void {
    this.gameState.gameMode = 'levelSelect';
    this.gameState.isRunning = false;
  }

  public showMainMenu(): void {
    this.gameState.gameMode = 'menu';
    this.gameState.isRunning = false;
    this.gameState.gameWon = false;
    this.gameState.gameOver = false;
  }
  public stop(): void {
    this.gameState.isRunning = false;
    this.gameState.gameMode = 'menu';
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  public restart(): void {
    this.gameState.currentLevel = 0;
    this.gameState.gameWon = false;
    this.gameState.gameOver = false;
    this.gameState.gameMode = 'playing';
    this.gameState.lives = 3;
    this.gameState.score = 0;
    this.currentLevel = this.levels[0];
    this.resetLevel();
    this.start();
  }

  public getGameState(): GameState {
    return { ...this.gameState };
  }
}