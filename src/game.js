import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  ENEMY_TYPES,
  GRID_SIZE,
  PATHS,
  TOWER_TYPES,
  createInitialState,
  createWavePlan
} from './state.js';

const FRAME_MS = 1000 / 60;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function distanceSquared(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

function distancePointToSegment(px, py, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const lenSq = abx * abx + aby * aby;
  if (lenSq === 0) {
    return Math.hypot(px - ax, py - ay);
  }
  const t = clamp(((px - ax) * abx + (py - ay) * aby) / lenSq, 0, 1);
  const cx = ax + abx * t;
  const cy = ay + aby * t;
  return Math.hypot(px - cx, py - cy);
}

function pointTooCloseToPath(point, path) {
  for (let i = 0; i < path.length - 1; i += 1) {
    const a = path[i];
    const b = path[i + 1];
    if (distancePointToSegment(point.x, point.y, a.x, a.y, b.x, b.y) < 28) {
      return true;
    }
  }
  return false;
}

export class TowerDefenseGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.state = createInitialState();
    this.lastTimestamp = 0;
    this.accumulator = 0;
    this.running = false;

    this.handleClick = this.handleClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.loop = this.loop.bind(this);
  }

  start() {
    if (this.running) {
      return;
    }

    this.running = true;
    this.canvas.addEventListener('click', this.handleClick);
    window.addEventListener('keydown', this.handleKeydown);

    window.advanceTime = (ms) => this.advanceTime(ms);
    window.render_game_to_text = () => this.renderGameToText();

    requestAnimationFrame(this.loop);
  }

  reset() {
    this.state = createInitialState();
  }

  loop(timestamp) {
    if (!this.running) {
      return;
    }

    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
    }

    const deltaMs = Math.min(100, timestamp - this.lastTimestamp);
    this.lastTimestamp = timestamp;
    this.accumulator += deltaMs;

    while (this.accumulator >= FRAME_MS) {
      this.update(FRAME_MS / 1000);
      this.accumulator -= FRAME_MS;
    }

    this.render();
    requestAnimationFrame(this.loop);
  }

  advanceTime(ms) {
    const steps = Math.max(1, Math.round(ms / FRAME_MS));
    for (let i = 0; i < steps; i += 1) {
      this.update(FRAME_MS / 1000);
    }
    this.render();
  }

  setMessage(text, duration = 1.8) {
    this.state.infoMessage = text;
    this.state.messageTimer = duration;
  }

  startWave() {
    const state = this.state;
    if (state.mode !== 'playing' || state.activeWave) {
      return;
    }

    if (state.waveNumber >= state.maxWaves) {
      this.setMessage('All waves complete. Hold the line.');
      return;
    }

    state.waveNumber += 1;
    state.activeWave = true;
    state.spawnQueue = createWavePlan(state.waveNumber);
    state.spawnDelay = 0;
    state.crateCooldown = 4;

    if (state.waveNumber % 3 === 0) {
      state.pathIndex = (state.pathIndex + 1) % PATHS.length;
      this.setMessage(`Wave ${state.waveNumber}: Path shifted`);
    } else {
      this.setMessage(`Wave ${state.waveNumber} started`);
    }
  }

  spawnEnemy(enemyTypeKey) {
    const state = this.state;
    const enemyType = ENEMY_TYPES[enemyTypeKey];
    if (!enemyType) {
      return;
    }

    const path = PATHS[state.pathIndex];
    const spawnPoint = path[0];

    state.enemies.push({
      id: `${enemyTypeKey}-${crypto.randomUUID()}`,
      type: enemyTypeKey,
      pathIndex: state.pathIndex,
      waypointIndex: 1,
      x: spawnPoint.x,
      y: spawnPoint.y,
      hp: enemyType.hp,
      maxHp: enemyType.hp,
      slowTimer: 0,
      slowFactor: 1
    });
  }

  createCrate() {
    const margin = 70;
    this.state.crate = {
      x: margin + Math.random() * (CANVAS_WIDTH - margin * 2),
      y: margin + Math.random() * (CANVAS_HEIGHT - margin * 2),
      ttl: 4.2,
      radius: 16
    };
  }

  tryCollectCrate(x, y) {
    const { crate } = this.state;
    if (!crate) {
      return false;
    }

    const distSq = distanceSquared(x, y, crate.x, crate.y);
    if (distSq > crate.radius * crate.radius) {
      return false;
    }

    this.state.gold += 34;
    this.state.overdriveCharge = clamp(this.state.overdriveCharge + 12, 0, 100);
    this.state.crate = null;
    this.state.crateCooldown = 9;
    this.setMessage('Risk crate secured: +34 gold');
    return true;
  }

  toCanvasPoint(event) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }

  placeTower(rawX, rawY) {
    const state = this.state;
    const towerType = TOWER_TYPES[state.selectedTowerType];
    if (!towerType) {
      return;
    }

    if (state.gold < towerType.cost) {
      this.setMessage('Not enough gold');
      return;
    }

    const x = clamp(Math.round(rawX / GRID_SIZE) * GRID_SIZE, GRID_SIZE / 2, CANVAS_WIDTH - GRID_SIZE / 2);
    const y = clamp(Math.round(rawY / GRID_SIZE) * GRID_SIZE, GRID_SIZE / 2, CANVAS_HEIGHT - GRID_SIZE / 2);

    const nearExistingTower = state.towers.some((tower) => distanceSquared(tower.x, tower.y, x, y) < 26 * 26);
    if (nearExistingTower) {
      this.setMessage('A tower is already there');
      return;
    }

    const blockedByPath = PATHS.some((path) => pointTooCloseToPath({ x, y }, path));
    if (blockedByPath) {
      this.setMessage('Cannot place tower on a lane');
      return;
    }

    state.towers.push({
      x,
      y,
      type: state.selectedTowerType,
      cooldown: 0
    });

    state.gold -= towerType.cost;
  }

  handleClick(event) {
    const state = this.state;
    const point = this.toCanvasPoint(event);

    if (state.mode === 'menu') {
      state.mode = 'playing';
      this.setMessage('Build towers, then press N to start Wave 1');
      return;
    }

    if (state.mode === 'defeat' || state.mode === 'victory') {
      this.reset();
      return;
    }

    if (this.tryCollectCrate(point.x, point.y)) {
      return;
    }

    this.placeTower(point.x, point.y);
  }

  handleKeydown(event) {
    const key = event.key.toLowerCase();

    if (key === 'f') {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        this.canvas.requestFullscreen().catch(() => {});
      }
      return;
    }

    if (key === 'r') {
      this.reset();
      return;
    }

    if (key === '1') {
      this.state.selectedTowerType = 'bolt';
      return;
    }
    if (key === '2') {
      this.state.selectedTowerType = 'burst';
      return;
    }
    if (key === '3') {
      this.state.selectedTowerType = 'frost';
      return;
    }

    if (this.state.mode !== 'playing') {
      return;
    }

    if (key === 'n') {
      this.startWave();
      return;
    }

    if (key === 'o') {
      if (this.state.overdriveCharge >= 100 && this.state.overdriveTimer <= 0) {
        this.state.overdriveCharge = 0;
        this.state.overdriveTimer = 8;
        this.setMessage('Overdrive active: fire-rate boosted for 8s');
      }
    }
  }

  updateSpawning(dt) {
    const state = this.state;
    if (!state.activeWave) {
      return;
    }

    state.spawnDelay -= dt;
    if (state.spawnDelay <= 0 && state.spawnQueue.length > 0) {
      const nextType = state.spawnQueue.shift();
      this.spawnEnemy(nextType);
      state.spawnDelay = 0.68;
    }

    if (state.spawnQueue.length === 0 && state.enemies.length === 0) {
      state.activeWave = false;
      this.setMessage(`Wave ${state.waveNumber} cleared`);

      if (state.waveNumber >= state.maxWaves) {
        state.mode = 'victory';
      }
    }
  }

  updateEnemies(dt) {
    const state = this.state;

    for (const enemy of state.enemies) {
      const enemyType = ENEMY_TYPES[enemy.type];
      enemy.slowTimer = Math.max(0, enemy.slowTimer - dt);
      if (enemy.slowTimer <= 0) {
        enemy.slowFactor = 1;
      }

      const path = PATHS[enemy.pathIndex];
      const target = path[enemy.waypointIndex];
      if (!target) {
        state.lives -= 1;
        enemy.hp = -1;
        continue;
      }

      const dx = target.x - enemy.x;
      const dy = target.y - enemy.y;
      const distance = Math.hypot(dx, dy);

      const speed = enemyType.speed * enemy.slowFactor;
      const step = speed * dt;

      if (distance <= step) {
        enemy.x = target.x;
        enemy.y = target.y;
        enemy.waypointIndex += 1;
      } else {
        enemy.x += (dx / distance) * step;
        enemy.y += (dy / distance) * step;
      }
    }

    state.enemies = state.enemies.filter((enemy) => enemy.hp > 0);

    if (state.lives <= 0) {
      state.mode = 'defeat';
      state.activeWave = false;
      state.spawnQueue = [];
      this.setMessage('Core lost');
    }
  }

  towerDamageMultiplier(tower) {
    if (tower.type !== 'burst') {
      return 1;
    }

    const nearFrost = this.state.towers.some((other) => {
      if (other === tower || other.type !== 'frost') {
        return false;
      }
      return distanceSquared(other.x, other.y, tower.x, tower.y) <= 95 * 95;
    });

    return nearFrost ? 1.24 : 1;
  }

  hitEnemy(enemy, rawDamage, sourceTower) {
    const enemyType = ENEMY_TYPES[enemy.type];
    const mitigated = rawDamage * (1 - enemyType.armor);
    enemy.hp -= mitigated;

    if (sourceTower.type === 'frost') {
      enemy.slowTimer = Math.max(enemy.slowTimer, TOWER_TYPES.frost.slowDuration);
      enemy.slowFactor = Math.min(enemy.slowFactor, TOWER_TYPES.frost.slowFactor);
    }
  }

  updateCombat(dt) {
    const state = this.state;
    const overdriveBoost = state.overdriveTimer > 0 ? 1.65 : 1;

    for (const tower of state.towers) {
      const towerType = TOWER_TYPES[tower.type];
      tower.cooldown -= dt;
      if (tower.cooldown > 0 || state.enemies.length === 0) {
        continue;
      }

      let target = null;
      let furthestProgress = -1;

      for (const enemy of state.enemies) {
        if (distanceSquared(tower.x, tower.y, enemy.x, enemy.y) > towerType.range * towerType.range) {
          continue;
        }

        const progress = enemy.waypointIndex + enemy.x * 0.001;
        if (progress > furthestProgress) {
          furthestProgress = progress;
          target = enemy;
        }
      }

      if (!target) {
        continue;
      }

      const synergy = this.towerDamageMultiplier(tower);
      const damage = towerType.damage * synergy;

      if (tower.type === 'burst') {
        for (const enemy of state.enemies) {
          if (distanceSquared(enemy.x, enemy.y, target.x, target.y) <= towerType.splashRadius * towerType.splashRadius) {
            this.hitEnemy(enemy, damage, tower);
          }
        }
      } else {
        this.hitEnemy(target, damage, tower);
      }

      tower.cooldown = 1 / (towerType.fireRate * overdriveBoost);
    }

    let defeatedCount = 0;
    for (const enemy of state.enemies) {
      if (enemy.hp <= 0) {
        const enemyType = ENEMY_TYPES[enemy.type];
        state.gold += enemyType.reward;
        state.overdriveCharge = clamp(state.overdriveCharge + 7, 0, 100);
        defeatedCount += 1;
      }
    }

    if (defeatedCount > 0 && state.overdriveCharge >= 100 && state.overdriveTimer <= 0) {
      this.setMessage('Overdrive ready: press O');
    }

    state.enemies = state.enemies.filter((enemy) => enemy.hp > 0);
  }

  updateCrate(dt) {
    const state = this.state;

    if (state.activeWave && !state.crate) {
      state.crateCooldown -= dt;
      if (state.crateCooldown <= 0) {
        this.createCrate();
      }
    }

    if (state.crate) {
      state.crate.ttl -= dt;
      if (state.crate.ttl <= 0) {
        state.crate = null;
        state.crateCooldown = 8;
      }
    }
  }

  update(dt) {
    const state = this.state;

    if (state.messageTimer > 0) {
      state.messageTimer -= dt;
      if (state.messageTimer <= 0) {
        state.infoMessage = '';
      }
    }

    if (state.mode !== 'playing') {
      return;
    }

    if (state.overdriveTimer > 0) {
      state.overdriveTimer = Math.max(0, state.overdriveTimer - dt);
    }

    this.updateSpawning(dt);
    this.updateEnemies(dt);
    this.updateCombat(dt);
    this.updateCrate(dt);
  }

  drawBackground() {
    const { ctx } = this;
    const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#143544');
    gradient.addColorStop(1, '#112a36');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.strokeStyle = 'rgba(198, 231, 210, 0.08)';
    ctx.lineWidth = 1;
    for (let x = GRID_SIZE; x < CANVAS_WIDTH; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = GRID_SIZE; y < CANVAS_HEIGHT; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }
  }

  drawPath(path, isActive) {
    const { ctx } = this;
    ctx.strokeStyle = isActive ? 'rgba(242, 203, 5, 0.8)' : 'rgba(166, 186, 196, 0.35)';
    ctx.lineWidth = isActive ? 28 : 22;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i += 1) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.stroke();
  }

  drawTowers() {
    const { ctx, state } = this;
    for (const tower of state.towers) {
      const towerType = TOWER_TYPES[tower.type];
      ctx.fillStyle = towerType.color;
      ctx.beginPath();
      ctx.arc(tower.x, tower.y, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(tower.x, tower.y, 6, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  drawEnemies() {
    const { ctx, state } = this;

    for (const enemy of state.enemies) {
      const enemyType = ENEMY_TYPES[enemy.type];
      ctx.fillStyle = enemyType.color;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, 10, 0, Math.PI * 2);
      ctx.fill();

      const hpWidth = 22;
      const ratio = Math.max(0, enemy.hp / enemy.maxHp);
      ctx.fillStyle = 'rgba(11, 24, 28, 0.8)';
      ctx.fillRect(enemy.x - hpWidth / 2, enemy.y - 16, hpWidth, 4);
      ctx.fillStyle = '#65d6a3';
      ctx.fillRect(enemy.x - hpWidth / 2, enemy.y - 16, hpWidth * ratio, 4);
    }
  }

  drawCrate() {
    const crate = this.state.crate;
    if (!crate) {
      return;
    }

    const { ctx } = this;
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.roundRect(crate.x - 12, crate.y - 12, 24, 24, 4);
    ctx.fill();

    ctx.strokeStyle = '#8a6200';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#553d00';
    ctx.fillRect(crate.x - 2, crate.y - 12, 4, 24);
  }

  drawHud() {
    const { ctx, state } = this;
    ctx.fillStyle = 'rgba(7, 12, 15, 0.75)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, 54);

    ctx.fillStyle = '#e6f7ff';
    ctx.font = '16px "Chakra Petch", sans-serif';
    ctx.fillText(`Lives: ${state.lives}`, 14, 30);
    ctx.fillText(`Gold: ${state.gold}`, 128, 30);
    ctx.fillText(`Wave: ${state.waveNumber}/${state.maxWaves}`, 242, 30);
    ctx.fillText(`Selected: ${TOWER_TYPES[state.selectedTowerType].label}`, 400, 30);

    const overdrivePct = Math.round(state.overdriveCharge);
    const overdriveLabel = state.overdriveTimer > 0 ? `Overdrive ${state.overdriveTimer.toFixed(1)}s` : `Charge ${overdrivePct}%`;
    ctx.fillStyle = state.overdriveTimer > 0 ? '#ffd166' : '#9de2ff';
    ctx.fillText(overdriveLabel, 660, 30);

    if (state.infoMessage) {
      ctx.font = '14px "Nunito", sans-serif';
      ctx.fillStyle = '#d5f2df';
      ctx.fillText(state.infoMessage, 14, 49);
    }
  }

  drawOverlay() {
    const { ctx, state } = this;
    if (state.mode === 'playing') {
      return;
    }

    ctx.fillStyle = 'rgba(3, 10, 14, 0.68)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#f2fbff';
    ctx.font = '42px "Chakra Petch", sans-serif';

    if (state.mode === 'menu') {
      ctx.fillText('Path Shift TD', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 28);
      ctx.font = '19px "Nunito", sans-serif';
      ctx.fillText('Click anywhere to begin, place towers, then press N for Wave 1.', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 8);
      ctx.fillText('Every 3 waves the lane shifts. Collect crates. Trigger overdrive with O.', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 38);
    } else if (state.mode === 'defeat') {
      ctx.fillText('Defeat', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 16);
      ctx.font = '22px "Nunito", sans-serif';
      ctx.fillText('Press R or click to restart.', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 26);
    } else if (state.mode === 'victory') {
      ctx.fillText('Victory', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 16);
      ctx.font = '22px "Nunito", sans-serif';
      ctx.fillText('All 12 waves cleared. Press R or click to play again.', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 26);
    }

    ctx.textAlign = 'start';
  }

  render() {
    this.drawBackground();

    for (let i = 0; i < PATHS.length; i += 1) {
      this.drawPath(PATHS[i], i === this.state.pathIndex);
    }

    this.drawTowers();
    this.drawEnemies();
    this.drawCrate();
    this.drawHud();
    this.drawOverlay();
  }

  renderGameToText() {
    const state = this.state;
    const payload = {
      coordinateSystem: 'origin at top-left, +x right, +y down',
      mode: state.mode,
      resources: {
        lives: state.lives,
        gold: state.gold,
        overdriveCharge: Number(state.overdriveCharge.toFixed(1)),
        overdriveTimer: Number(state.overdriveTimer.toFixed(2))
      },
      wave: {
        current: state.waveNumber,
        max: state.maxWaves,
        active: state.activeWave,
        enemiesWaiting: state.spawnQueue.length
      },
      selectedTowerType: state.selectedTowerType,
      activePath: state.pathIndex,
      towers: state.towers.map((tower) => ({
        x: Number(tower.x.toFixed(1)),
        y: Number(tower.y.toFixed(1)),
        type: tower.type,
        cooldown: Number(Math.max(0, tower.cooldown).toFixed(2))
      })),
      enemies: state.enemies.map((enemy) => ({
        x: Number(enemy.x.toFixed(1)),
        y: Number(enemy.y.toFixed(1)),
        type: enemy.type,
        hp: Number(enemy.hp.toFixed(1)),
        slowTimer: Number(enemy.slowTimer.toFixed(2))
      })),
      crate: state.crate
        ? {
            x: Number(state.crate.x.toFixed(1)),
            y: Number(state.crate.y.toFixed(1)),
            ttl: Number(state.crate.ttl.toFixed(2))
          }
        : null
    };

    return JSON.stringify(payload);
  }
}
