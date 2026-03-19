export const CANVAS_WIDTH = 960;
export const CANVAS_HEIGHT = 540;
export const GRID_SIZE = 40;

export const PATHS = [
  [
    { x: -30, y: 120 },
    { x: 180, y: 120 },
    { x: 180, y: 340 },
    { x: 420, y: 340 },
    { x: 420, y: 180 },
    { x: 690, y: 180 },
    { x: 690, y: 430 },
    { x: 1000, y: 430 }
  ],
  [
    { x: -30, y: 420 },
    { x: 230, y: 420 },
    { x: 230, y: 230 },
    { x: 510, y: 230 },
    { x: 510, y: 390 },
    { x: 760, y: 390 },
    { x: 760, y: 140 },
    { x: 1000, y: 140 }
  ]
];

export const TOWER_TYPES = {
  bolt: {
    label: 'Bolt',
    cost: 50,
    damage: 15,
    range: 135,
    fireRate: 1.25,
    color: '#ffd166'
  },
  burst: {
    label: 'Burst',
    cost: 75,
    damage: 9,
    range: 120,
    fireRate: 0.9,
    splashRadius: 42,
    color: '#ef476f'
  },
  frost: {
    label: 'Frost',
    cost: 65,
    damage: 6,
    range: 112,
    fireRate: 1.0,
    slowFactor: 0.48,
    slowDuration: 1.6,
    color: '#7bdff2'
  }
};

export const ENEMY_TYPES = {
  scout: {
    hp: 42,
    speed: 86,
    reward: 8,
    armor: 0,
    color: '#90be6d'
  },
  brute: {
    hp: 95,
    speed: 58,
    reward: 14,
    armor: 0.22,
    color: '#f8961e'
  },
  tank: {
    hp: 180,
    speed: 39,
    reward: 24,
    armor: 0.38,
    color: '#f3722c'
  }
};

export function createInitialState() {
  return {
    mode: 'menu',
    lives: 20,
    gold: 150,
    waveNumber: 0,
    maxWaves: 12,
    activeWave: false,
    pathIndex: 0,
    selectedTowerType: 'bolt',
    overdriveCharge: 0,
    overdriveTimer: 0,
    spawnQueue: [],
    spawnDelay: 0,
    towers: [],
    enemies: [],
    crate: null,
    crateCooldown: 6,
    infoMessage: 'Press N to start Wave 1',
    messageTimer: 0
  };
}

export function createWavePlan(waveNumber) {
  const plan = [];
  const scouts = 6 + waveNumber * 2;
  const brutes = Math.max(0, waveNumber - 1) * 2;
  const tanks = Math.max(0, waveNumber - 3);

  for (let i = 0; i < scouts; i += 1) {
    plan.push('scout');
  }
  for (let i = 0; i < brutes; i += 1) {
    plan.push('brute');
  }
  for (let i = 0; i < tanks; i += 1) {
    plan.push('tank');
  }

  return plan;
}
