import {
  ARTIFACTS,
  BALANCE,
  CHARACTERS,
  getArtifactStats,
  getStage,
  getWeaponStats,
} from './content.js';
import { battleEnemyAnimation, battleEnemySpriteId, battleBossSpriteId } from './battle-enemy-animation.js';

const TAU = Math.PI * 2;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const normalize = (x, y) => {
  const length = Math.hypot(x, y);
  return length > 0.001 ? { x: x / length, y: y / length } : { x: 0, y: 0 };
};

// Entity animation clocks are part of the simulation snapshot, so pausing and
// replaying the engine also freezes or repeats every visible transition.
const ANIMATION_FRAMES = Object.freeze({
  // Battle art is vector-rigged rather than a single polished illustration.
  // Keep enough simulation frames for a readable Kingdom-Rush-like cadence;
  // the renderer turns each frame into a distinct limb/weapon pose.
  idle: 6, move: 8, attack: 8, hit: 4, stun: 4, dash: 8, intro: 10, death: 8,
});
const animationFrames = (state) => ANIMATION_FRAMES[state] || ANIMATION_FRAMES.idle;

function mulberry32(seed) {
  let value = (Number(seed) >>> 0) || 0x9e3779b9;
  return () => {
    value |= 0; value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WEAPON_PREFIX = 'weapon:';
// Playtest change (2026-10-21): normals arrive in waves every WAVE_SECONDS.
// Small waves are single-species; every 5th wave is a big mixed-species wave.
const WAVE_SECONDS = 5;
const BIG_WAVE_EVERY = 5;

export class GameEngine {
  constructor(options = {}) {
    this.options = options;
    this.debugMode = options.debug === true;
    this.debugInvincible = false;
    this.seed = Number(options.seed == null ? Date.now() : options.seed) >>> 0;
    this.random = mulberry32(this.seed);
    this.character = CHARACTERS.find((item) => item.id === options.characterId) || CHARACTERS[0];
    this.stage = getStage(options.stageId || 1);
    this.talents = options.talents || {};
    this.difficulty = options.difficulty === 'hard' ? 'hard' : 'normal';
    this.onEvent = typeof options.onEvent === 'function' ? options.onEvent : () => {};
    this.nextId = 1;
    this.disposed = false;
    this.elapsed = 0;
    this.weaponShots = 0;
    this.spawnAccumulator = WAVE_SECONDS - 1;
    this.waveIndex = 0;
    this.elitesSpawned = new Set();
    this.bossSpawned = false;
    this.finalBossSpawned = false;
    this.pendingUpgrades = 0;
    this.poolingEnabled = true;
    this.pools = { projectile: [], effect: [], gem: [] };
    this.poolStats = { created: { projectile: 0, effect: 0, gem: 0 }, reused: { projectile: 0, effect: 0, gem: 0 }, released: { projectile: 0, effect: 0, gem: 0 } };
    this.rng = this.random;
    this.state = this.createState();
  }

  createState() {
    const talentMultiplier = (name, fallback = 0) => Number(this.talents[name] || fallback);
    const hpBonus = clamp(talentMultiplier('iron-body') * 0.035, 0, 0.35);
    const speedBonus = clamp(talentMultiplier('swift-cloud') * 0.025, 0, 0.25);
    const character = this.character;
    const maxHp = Math.round(character.stats.hp * (1 + hpBonus));
    const skills = [{ id: `${WEAPON_PREFIX}${character.id}`, level: 1, isWeapon: true }];
    return {
      status: 'playing', time: 0,
      player: {
        x: BALANCE.worldSize / 2, y: BALANCE.worldSize / 2,
        hp: maxHp, maxHp, radius: BALANCE.playerRadius, speed: character.stats.speed * (1 + speedBonus),
        facing: 0, level: 1, xp: 0, xpNext: 24, invulnerable: 0, dashCooldown: 0,
        animationState: 'idle', frameIndex: 0, frameTime: 0, animationFrames: animationFrames('idle'),
        attackTimer: 0, hitTimer: 0, dashTimer: 0,
      },
      enemies: [], projectiles: [], effects: [], gems: [], damageNumbers: [], skills,
      choices: [], kills: 0, damage: 0,
      stage: this.stage, battlefield: this.stage.encounterName ? {
        id: 'double-ridge', name: this.stage.encounterName, theme: this.stage.theme,
        mapAssetKey: this.stage.mapAssetKey || null,
        openCenter: true, perimeter: 'mountain-forest',
        ridgeRect: this.stage.mapAssetKey === 'doublefork' ? { x: 0, y: 700, width: BALANCE.worldSize, height: 400 } : null,
        pathCorridor: this.stage.mapAssetKey === 'doublefork' ? { x: 790, y: 700, width: 220, height: 400 } : null,
      } : null,
      character: this.character, seed: this.seed,
      coins: 0,
    };
  }

  emit(event) {
    try { this.onEvent({ time: this.state.time, ...event }); } catch (_) { /* consumer errors never stop simulation */ }
  }

  allocId(prefix) { return `${prefix}-${this.nextId++}`; }

  setAnimation(entity, state, frameCount = animationFrames(state)) {
    if (!entity) return;
    const nextState = state || 'idle';
    if (entity.animationState !== nextState) {
      entity.animationState = nextState; entity.frameIndex = 0; entity.frameTime = 0;
    }
    entity.animationFrames = Math.max(1, Number(frameCount) || animationFrames(nextState));
  }

  stepAnimation(entity, state, dt, frameRate = 10, frameCount = animationFrames(state)) {
    if (!entity) return;
    this.setAnimation(entity, state, frameCount);
    const duration = 1 / Math.max(1, Number(frameRate) || 10);
    entity.frameTime = Math.max(0, Number(entity.frameTime) || 0) + Math.max(0, Number(dt) || 0);
    while (entity.frameTime >= duration) {
      entity.frameTime -= duration;
      entity.frameIndex = (Math.max(0, Number(entity.frameIndex) || 0) + 1) % entity.animationFrames;
    }
  }

  stepEnemyAnimation(enemy, state, dt, frameRate) {
    const actor = battleEnemyAnimation(enemy);
    if (!actor) { this.stepAnimation(enemy, state, dt, frameRate); return; }
    const authoredState = state === 'stun' ? 'hit' : state;
    const count = actor.frames[authoredState] || actor.frames.idle;
    const fps = actor.fps[authoredState] || actor.fps.idle;
    this.setAnimation(enemy, state, count);
    const loop = state === 'idle' || state === 'move';
    enemy.frameTime = Math.max(0, enemy.frameTime || 0) + dt;
    if (loop) enemy.frameTime %= count / fps;
    else enemy.frameTime = Math.min(enemy.frameTime, count / fps);
    enemy.frameIndex = Math.min(count - 1, Math.floor((enemy.frameTime + 1e-8) * fps));
  }

  // The first chapter's authored map has a steep central ridge. Only the
  // narrow stone pass through the ridge is traversable; both open clearings
  // remain fully walkable. The testable seam is this small movement helper,
  // which also lets dash and joystick movement share the same terrain rule.
  isWalkable(x, y, radius = this.state?.player?.radius || BALANCE.playerRadius) {
    const battlefield = this.state?.battlefield;
    if (battlefield?.mapAssetKey !== 'doublefork') return true;
    const r = Math.max(0, Number(radius) || 0);
    const ridge = battlefield.ridgeRect || { x: 0, y: 700, width: BALANCE.worldSize, height: 400 };
    const corridor = battlefield.pathCorridor || { x: 790, y: 700, width: 220, height: 400 };
    const ridgeTop = ridge.y;
    const ridgeBottom = ridge.y + ridge.height;
    const pathLeft = corridor.x;
    const pathRight = corridor.x + corridor.width;
    if (y + r <= ridgeTop || y - r >= ridgeBottom) return true;
    return x - r >= pathLeft && x + r <= pathRight;
  }

  movePlayer(dx, dy) {
    return this.moveEntity(this.state.player, dx, dy, this.state.player.radius);
  }

  moveEntity(entity, dx, dy, radius = entity?.radius || BALANCE.playerRadius) {
    if (!entity) return false;
    const nextX = clamp(entity.x + (Number(dx) || 0), radius, BALANCE.worldSize - radius);
    const nextY = clamp(entity.y + (Number(dy) || 0), radius, BALANCE.worldSize - radius);
    // Try the full vector first, then slide along a clear axis so the ridge
    // feels like a solid boundary instead of trapping the joystick.
    if (this.isWalkable(nextX, nextY, radius)) { entity.x = nextX; entity.y = nextY; return true; }
    let moved = false;
    if (this.isWalkable(nextX, entity.y, radius)) { entity.x = nextX; moved = true; }
    if (this.isWalkable(entity.x, nextY, radius)) { entity.y = nextY; moved = true; }
    return moved;
  }

  playerAnimationState(direction) {
    const player = this.state.player;
    if (player.dashTimer > 0) return 'dash';
    if (player.hitTimer > 0) return 'hit';
    if (player.attackTimer > 0) return 'attack';
    return direction?.x || direction?.y ? 'move' : 'idle';
  }

  update(dtSeconds, input = {}) {
    if (this.disposed || this.state.status !== 'playing') return this.state;
    const dt = clamp(Number(dtSeconds) || 0, 0, 0.05);
    if (!dt) return this.state;
    this.state.player.speedBoost = Math.max(0, (this.state.player.speedBoost || 0) - dt);
    this.state.player.attackFlash = Math.max(0, (this.state.player.attackFlash || 0) - dt);
    this.state.player.hitFlash = Math.max(0, (this.state.player.hitFlash || 0) - dt);
    this.state.player.attackTimer = Math.max(0, (this.state.player.attackTimer || 0) - dt);
    this.state.player.hitTimer = Math.max(0, (this.state.player.hitTimer || 0) - dt);
    this.state.player.dashTimer = Math.max(0, (this.state.player.dashTimer || 0) - dt);
    for (let i = this.state.damageNumbers.length - 1; i >= 0; i -= 1) {
      const number = this.state.damageNumbers[i]; number.ttl -= dt; number.y -= 18 * dt;
      if (number.ttl <= 0) this.state.damageNumbers.splice(i, 1);
    }
    const direction = normalize(Number(input.x) || 0, Number(input.y) || 0);
    if (direction.x || direction.y) {
      const moveSpeed = this.state.player.speed * (this.state.player.speedBoost > 0 ? 1.03 : 1);
      this.state.player.facing = Math.atan2(direction.y, direction.x);
      this.movePlayer(direction.x * moveSpeed * dt, direction.y * moveSpeed * dt);
    }
    this.elapsed += dt;
    this.state.time = this.elapsed;
    this.state.player.invulnerable = Math.max(0, this.state.player.invulnerable - dt);
    this.state.player.dashCooldown = Math.max(0, this.state.player.dashCooldown - dt);
    this.spawnAccumulator += dt;
    this.advanceSpawns();
    this.updateEffects(dt);
    this.updateEnemies(dt);
    if (this.state.status !== 'playing') return this.state;
    this.updateProjectiles(dt);
    this.updateGems(dt);
    if (this.state.status === 'playing') this.autoAttack(dt);
    this.stepAnimation(this.state.player, this.playerAnimationState(direction), dt, 12);
    this.trimCaps();
    this.checkVictory();
    return this.state;
  }

  advanceSpawns() {
    const time = this.state.time;
    // Wave spawning replaces the old per-enemy trickle: the accumulator now
    // counts toward whole waves, so overall pressure still follows
    // spawnInterval(time) via the batch size computed in spawnWave.
    while (this.spawnAccumulator >= WAVE_SECONDS && this.state.enemies.length < BALANCE.maxEnemies) {
      this.spawnAccumulator -= WAVE_SECONDS;
      this.spawnWave(time);
    }
    BALANCE.eliteTimes.forEach((mark, index) => {
      if (time >= mark && !this.elitesSpawned.has(mark)) {
        this.elitesSpawned.add(mark);
        const count = 1 + Math.floor(index / 2);
        for (let i = 0; i < count; i += 1) this.spawnEnemy('elite', index + i);
        this.emit({ type: 'elite', at: mark, index, count });
      }
    });
    for (const encounter of this.stage.eliteEncounters || []) {
      if (time >= encounter.at && !this.elitesSpawned.has(encounter.at)) {
        this.elitesSpawned.add(encounter.at);
        const authoredLeader = this.spawnEnemy('elite', 0, encounter);
        // Bind only at the authored scheduling site, never by tiger variant,
        // display name or a generic spawn override. This identity reserves a
        // future action contract; it does not approve or select any artwork.
        if (authoredLeader && this.stage.id === 1 && encounter.encounterId && encounter.actionId) {
          authoredLeader.encounterIdentity = Object.freeze({ encounterId: encounter.encounterId, variant: encounter.variant || null, actionId: encounter.actionId });
        }
        // Authored encounters can occupy the generic mid-boss slot. Mark the
        // slot consumed after spawning the authored leader, preventing two
        // different leaders from appearing on the same frame. Keep seeded
        // runs reproducible: the skipped generic boss would have sampled one
        // additional spawn point, so consume the same sample without adding
        // an entity. This also preserves the authored leader's original spawn
        // position in the random stream.
        if (encounter.replacesMidBoss === true && encounter.at === BALANCE.bossTime) {
          this.spawnPoint();
          this.bossSpawned = true;
        }
        this.emit({ type: 'elite', at: encounter.at, count: 1, encounter: true, replacesMidBoss: encounter.replacesMidBoss === true, names: [encounter.name] });
      }
    }
    if (time >= BALANCE.bossTime && !this.bossSpawned) {
      this.bossSpawned = true;
      const boss = this.spawnBoss(false, this.stage.enemyRoster ? { variant: 'tiger' } : {});
      this.emit({ type: 'boss', final: false, names: boss ? [boss.name] : [] });
    }
    if (time >= BALANCE.finalBossTime && !this.finalBossSpawned) {
      this.finalBossSpawned = true;
      const roster = this.stage.finalBosses ? this.stage.finalBosses.map((boss) => this.spawnBoss(true, boss)) : [this.spawnBoss(true)];
      this.emit({ type: 'boss', final: true, names: roster.filter(Boolean).map((boss) => boss.name) });
    }
  }

  spawnInterval(time) {
    // 1.18s at start, reaching 0.22s near the final minute.
    return clamp(1.18 - (time / BALANCE.duration) * 0.96, 0.22, 1.18);
  }

  spawnWave(time) {
    const roster = this.stage.enemyRoster || this.stage.enemies || [];
    const index = this.waveIndex;
    this.waveIndex += 1;
    const big = index % BIG_WAVE_EVERY === BIG_WAVE_EVERY - 1;
    // Batch size preserves the old trickle's throughput over one wave
    // window; big waves double it and mix every species in the roster.
    const batch = Math.max(1, Math.round(WAVE_SECONDS / this.spawnInterval(time))) * (big ? 2 : 1);
    let forced;
    if (!big && roster.length) {
      // Small wave: a single species, rotating through the roster so each
      // kind gets its own wave before the next big mixed wave lands.
      const entry = roster[index % roster.length];
      forced = typeof entry === 'string' ? { name: entry } : { name: entry.name, variant: entry.variant };
    }
    let spawned = 0;
    for (let i = 0; i < batch && this.state.enemies.length < BALANCE.maxEnemies; i += 1) {
      if (this.spawnEnemy('normal', 0, forced)) spawned += 1;
    }
    this.emit({ type: 'wave', index, big, count: spawned, species: big ? null : (forced ? forced.name : null) });
  }

  spawnPoint() {
    const player = this.state.player;
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const angle = this.rng() * TAU;
      const radius = 470 + this.rng() * 130;
      const point = { x: clamp(player.x + Math.cos(angle) * radius, 24, BALANCE.worldSize - 24), y: clamp(player.y + Math.sin(angle) * radius, 24, BALANCE.worldSize - 24) };
      if (this.isWalkable(point.x, point.y, 24)) return point;
    }
    // If the random ring lands inside the ridge repeatedly, place the spawn
    // on the stable stone pass so it remains reachable from either clearing.
    return { x: 900, y: clamp(player.y, 24, BALANCE.worldSize - 24) };
  }

  spawnEnemy(kind = 'normal', variant = 0, override = {}) {
    if (this.state.enemies.length >= BALANCE.maxEnemies) {
      if (kind === 'normal') return null;
      const index = this.state.enemies.findIndex((enemy) => enemy.kind === 'normal');
      if (index < 0) return null;
      this.state.enemies.splice(index, 1);
    }
    const position = this.spawnPoint();
    const progress = clamp(this.state.time / BALANCE.duration, 0, 1);
    const hard = this.difficulty === 'hard' ? 1.25 : 1;
    const levelScale = 1 + progress * 1.5;
    const chapterScale = 1 + (this.stage.chapter - 1) * 0.085;
    const normalNames = this.stage.enemyRoster || this.stage.enemies;
    let hp = 36 * levelScale * chapterScale * hard;
    let speed = 42 + progress * 28;
    let radius = 15;
    const selected = normalNames[Math.floor(this.rng() * normalNames.length)] || '山野妖怪';
    let name = typeof selected === 'string' ? selected : selected.name;
    let variantName = typeof selected === 'string' ? undefined : selected.variant;
    let color = '#725d5a';
    if (kind === 'elite') {
      hp *= 5;
      speed *= 1.12;
      radius = 25;
      name = `${this.stage.midBoss}·精锐`;
      if (this.stage.enemyRoster) variantName = 'tiger';
      color = '#c48a53';
    }
    name = override.name || name; variantName = override.variant || variantName;
    const enemy = {
      id: this.allocId('enemy'), x: position.x, y: position.y, hp, maxHp: hp, radius,
      kind, name, variant: variantName || variant, variantName, color, speed, stun: 0, flash: 0,
      facing: 0,
      animationState: 'move', frameIndex: 0, frameTime: 0, animationFrames: animationFrames('move'),
      hitTimer: 0, spawnProgress: 1, spawnTimer: 0,
      damage: (8 + progress * 12) * (kind === 'elite' ? 1.5 : 1) * chapterScale * hard,
      xp: override.xp || (kind === 'elite' ? 9 : 2),
      encounterIdentity: null,
    };
    const battleSpriteId = battleEnemySpriteId(this.stage.id, kind, enemy.variant);
    if (battleSpriteId) {
      Object.assign(enemy, { battleSpriteId, visualAttackTimer: 0, visualHitTimer: 0 });
    }
    this.state.enemies.push(enemy);
    return enemy;
  }

  spawnBoss(finalBoss, override = {}) {
    if (this.state.enemies.length >= BALANCE.maxEnemies) {
      const expendable = this.state.enemies.findIndex((enemy) => !enemy.final && enemy.kind === 'normal');
      if (expendable < 0) return null;
      this.state.enemies.splice(expendable, 1);
    }
    const position = this.spawnPoint();
    const progress = clamp(this.state.time / BALANCE.duration, 0, 1);
    const chapterScale = 1 + (this.stage.chapter - 1) * 0.085;
    const hp = (finalBoss ? 1900 : 800) * (1 + progress * 1.15) * chapterScale * (this.difficulty === 'hard' ? 1.25 : 1) * (override.hpScale || 1);
    // Final guardians may carry a stable, boss-only identity for a future
    // renderer.  Variant remains encounter metadata and must never be used as
    // a boss sprite lookup.  Mid-bosses and generic later-stage bosses stay
    // explicitly unbound until they receive their own scoped contract.
    const bossIdentity = finalBoss && this.stage.id === 1 && override.bossId && override.actionId
      ? Object.freeze({ bossId: override.bossId, variant: override.variant || null, actionId: override.actionId })
      : null;
    const boss = {
      id: this.allocId('boss'), x: position.x, y: position.y, hp, maxHp: hp, radius: override.radius || (finalBoss ? 62 : 48),
      kind: 'boss', name: override.name || (finalBoss ? this.stage.boss : this.stage.midBoss), variant: override.variant || (finalBoss ? 1 : 0), aliases: [...(override.aliases || [])],
      color: finalBoss ? '#9b4e86' : '#a56a46', speed: finalBoss ? 34 : 38, stun: 0, flash: 0, facing: 0,
      animationState: 'intro', frameIndex: 0, frameTime: 0, animationFrames: animationFrames('intro'),
      hitTimer: 0, spawnProgress: 0, spawnTimer: 1.2,
      damage: (finalBoss ? 35 : 24) * chapterScale * (override.damageScale || 1), xp: override.xp || (finalBoss ? 80 : 30), coin: override.coin || (finalBoss ? 80 : 35), final: finalBoss,
      bossIdentity,
      encounterIdentity: null,
    };
    if (this.stage.id === 1 && ['tiger', 'bear', 'bull'].includes(boss.variant)) {
      const attackPattern = { tiger: 'tiger-claw', bear: 'bear-slam', bull: 'bull-charge' }[boss.variant];
      Object.assign(boss, { attackPattern, attackPhase: 'cooldown', attackCooldown: 4, attackWindup: 0, attackTimer: 0, attackHit: false });
    }
    // Named first-stage final bosses acquire their dedicated atlas through
    // the frozen identity only. Unbound bosses keep the vector identity rig.
    const battleSpriteId = battleBossSpriteId(this.stage.id, bossIdentity);
    if (battleSpriteId) {
      Object.assign(boss, { battleSpriteId, visualAttackTimer: 0, visualHitTimer: 0 });
    }
    this.state.enemies.push(boss);
    return boss;
  }

  updateBossPattern(boss, dt) {
    const player = this.state.player;
    const aimVector = normalize(player.x - boss.x, player.y - boss.y);
    if (aimVector.x || aimVector.y) boss.facing = Math.atan2(aimVector.y, aimVector.x);
    if (boss.attackPhase === 'windup') {
      boss.attackWindup = Math.max(0, boss.attackWindup - dt);
      if (boss.attackWindup <= 1e-8) {
        boss.attackPhase = 'active';
        boss.attackHit = false;
        boss.attackTimer = boss.attackPattern === 'bull-charge' ? 0.72 : boss.attackPattern === 'bear-slam' ? 0.26 : 0.28;
        boss.attackDuration = boss.attackTimer;
        if (boss.attackPattern === 'tiger-claw') {
          for (let j = 0; j < 5; j += 1) {
            const angle = boss.attackAngle + (j - 2) * 0.18;
            this.projectile({ x: boss.x, y: boss.y, vx: Math.cos(angle) * 200, vy: Math.sin(angle) * 200, radius: 9, color: '#f7af67', kind: 'boss-orb', bossPattern: 'tiger-claw', sourceId: boss.id, ttl: 2.6, damage: boss.damage * 0.7, hostile: true });
          }
        } else if (boss.attackPattern === 'bear-slam') {
          const target = boss.attackTarget;
          const radius = boss.attackRadius;
          this.effect({ x: target.x, y: target.y, kind: 'explosion', bossPattern: 'bear-slam', sourceId: boss.id, radius, color: '#d9935f', ttl: 0.28 });
          if (distance(target, player) <= radius + player.radius) this.damagePlayer(boss.damage * 1.25);
        } else if (boss.attackPattern === 'bull-charge') {
          boss.attackSpeed = 290;
        }
        this.emit({ type: 'boss-attack', sourceId: boss.id, pattern: boss.attackPattern, phase: 'active' });
      }
      return;
    }
    if (boss.attackPhase === 'active' || boss.attackPhase === 'recovery') {
      if (boss.attackPhase === 'active' && boss.attackPattern === 'bull-charge') {
        this.moveEntity(boss, Math.cos(boss.attackAngle) * boss.attackSpeed * dt, Math.sin(boss.attackAngle) * boss.attackSpeed * dt, boss.radius);
        if (!boss.attackHit && distance(boss, player) <= boss.radius + player.radius + 8) {
          boss.attackHit = true;
          this.damagePlayer(boss.damage * 1.05);
        }
      }
      boss.attackTimer = Math.max(0, boss.attackTimer - dt);
      if (boss.attackTimer <= 1e-8) {
        if (boss.attackPhase === 'active') { boss.attackPhase = 'recovery'; boss.attackTimer = 0.6; boss.attackDuration = 0.6; }
        else { boss.attackPhase = 'cooldown'; boss.attackCooldown = 5.5; }
      }
      return;
    }
    const vector = normalize(player.x - boss.x, player.y - boss.y);
    this.moveEntity(boss, vector.x * boss.speed * (boss.slow || 1) * dt, vector.y * boss.speed * (boss.slow || 1) * dt, boss.radius);
    boss.attackCooldown = Math.max(0, boss.attackCooldown - dt);
    if (boss.attackCooldown > 0) return;
    boss.attackPhase = 'windup';
    boss.attackWindup = boss.attackPattern === 'bull-charge' ? 0.62 : boss.attackPattern === 'bear-slam' ? 0.88 : 0.7;
    boss.attackWindupDuration = boss.attackWindup;
    boss.attackAngle = Math.atan2(player.y - boss.y, player.x - boss.x);
    boss.attackTarget = { x: player.x, y: player.y };
    if (boss.attackPattern === 'tiger-claw') {
      this.effect({ x: boss.x, y: boss.y, kind: 'warning', warningShape: 'cone', bossPattern: boss.attackPattern, sourceId: boss.id, radius: 520, length: 520, arc: 0.84, angle: boss.attackAngle, color: '#f7af67', ttl: boss.attackWindup });
    } else if (boss.attackPattern === 'bear-slam') {
      boss.attackRadius = 116;
      this.effect({ x: boss.attackTarget.x, y: boss.attackTarget.y, kind: 'warning', warningShape: 'circle', bossPattern: boss.attackPattern, sourceId: boss.id, radius: boss.attackRadius, color: '#d9935f', ttl: boss.attackWindup });
    } else {
      const chargeDistance = Math.min(520, distance(boss, player));
      this.effect({ x: boss.x, y: boss.y, kind: 'warning', warningShape: 'line', bossPattern: boss.attackPattern, sourceId: boss.id, radius: 42, width: 42, length: chargeDistance, angle: boss.attackAngle, color: '#d9bc74', ttl: boss.attackWindup });
    }
    this.emit({ type: 'boss-attack', sourceId: boss.id, pattern: boss.attackPattern, phase: 'windup' });
  }

  updateEnemies(dt) {
    const player = this.state.player;
    for (const enemy of this.state.enemies.slice()) {
      enemy.slow = enemy.nextSlow || 1;
      enemy.nextSlow = 1;
      enemy.stun = Math.max(0, enemy.stun - dt);
      enemy.knockback = Math.max(0, (enemy.knockback || 0) - dt);
      enemy.flash = Math.max(0, enemy.flash - dt);
      enemy.hitTimer = Math.max(0, (enemy.hitTimer || 0) - dt);
      const actor = battleEnemyAnimation(enemy);
      if (actor) {
        enemy.visualAttackTimer = Math.max(0, enemy.visualAttackTimer - dt);
        enemy.visualHitTimer = Math.max(0, enemy.visualHitTimer - dt);
      }
      if (enemy.spawnTimer > 0) {
        enemy.spawnTimer = Math.max(0, enemy.spawnTimer - dt);
        enemy.spawnProgress = clamp(1 - enemy.spawnTimer / 1.2, 0, 1);
        this.stepAnimation(enemy, 'intro', dt, 10);
        continue;
      }
      enemy.spawnProgress = 1;
      if (enemy.burn?.ttl > 0) {
        this.damageEnemy(enemy, enemy.burn.damage * Math.min(dt, enemy.burn.ttl), {});
        enemy.burn.ttl = Math.max(0, enemy.burn.ttl - dt);
      }
      if (enemy.bleeds?.length) {
        for (let b = enemy.bleeds.length - 1; b >= 0; b -= 1) {
          const bleed = enemy.bleeds[b];
          bleed.timer -= dt;
          if (bleed.timer <= 0 && bleed.tick < bleed.ticks.length) {
            this.damageEnemy(enemy, bleed.baseDamage * bleed.ticks[bleed.tick], { knockback: 0 });
            bleed.tick += 1; bleed.timer += 1;
          }
          if (bleed.tick >= bleed.ticks.length) enemy.bleeds.splice(b, 1);
        }
      }
      if (enemy.hp <= 0 || enemy.stun > 0 || enemy.knockback > 0) {
        this.stepEnemyAnimation(enemy, (actor ? enemy.visualHitTimer : enemy.hitTimer) > 0 ? 'hit' : enemy.stun > 0 ? 'stun' : 'idle', dt, 10);
        continue;
      }
      const vector = normalize(player.x - enemy.x, player.y - enemy.y);
      if (vector.x || vector.y) enemy.facing = Math.atan2(vector.y, vector.x);
      const speed = enemy.speed * (enemy.slow || 1);
      if (enemy.attackPattern) this.updateBossPattern(enemy, dt);
      else this.moveEntity(enemy, vector.x * speed * dt, vector.y * speed * dt, enemy.radius);
      if (enemy.kind === 'boss' && !enemy.attackPattern) {
        enemy.attackCooldown = (enemy.attackCooldown == null ? 4 : enemy.attackCooldown) - dt;
        if (enemy.attackCooldown <= 0) {
          enemy.attackCooldown = enemy.final ? 5.5 : 7;
          const count = enemy.final ? 7 : 4;
          const aim = Math.atan2(player.y - enemy.y, player.x - enemy.x);
          for (let j = 0; j < count; j += 1) {
            const angle = aim + (j - (count - 1) / 2) * 0.22;
            this.projectile({ x: enemy.x, y: enemy.y, vx: Math.cos(angle) * 160, vy: Math.sin(angle) * 160, radius: 9, color: '#d15c70', kind: 'boss-orb', ttl: 4, damage: enemy.damage * 0.7, hostile: true });
          }
          this.effect({ x: player.x, y: player.y, kind: 'warning', radius: enemy.final ? 74 : 56, color: '#da6377', ttl: 1.1, hostileDamage: enemy.damage * 0.9 });
        }
      }
      const touching = distance(enemy, player) <= enemy.radius + player.radius;
      if (actor && touching && enemy.visualAttackTimer <= 1e-8 && enemy.visualHitTimer <= 1e-8) {
        // Visual-only contact swing. Do not gate damage, movement, RNG, or
        // collision with this timer; player invulnerability is unchanged.
        enemy.visualAttackTimer = actor.frames.attack / actor.fps.attack;
        this.setAnimation(enemy, 'attack', actor.frames.attack);
        enemy.frameTime = 0; enemy.frameIndex = 0;
      }
      if ((!enemy.attackPattern || enemy.attackPhase === 'cooldown') && touching && player.invulnerable <= 0) {
        // Contact chips away at health; discrete boss volleys are the large
        // threats. A fixed contact scale keeps damage identical at 20/60 FPS.
        this.damagePlayer(enemy.damage * 0.05);
        if (this.state.status === 'lost') break;
      }
      this.stepEnemyAnimation(enemy, (actor ? enemy.visualHitTimer : enemy.hitTimer) > 1e-8 ? 'hit' : enemy.attackWindup > 0 || enemy.attackTimer > 0 || enemy.visualAttackTimer > 0 ? 'attack' : 'move', dt, enemy.kind === 'boss' ? 8 : 12);
    }
    this.separateEnemies();
  }

  // Playtest addition (2026-10-22): soft body separation. Enemies steer to
  // the exact same point (the player) with no mutual collision, so a
  // converging wave interpenetrated into one stacked blob — visible
  // clipping the user reported. After each movement tick, overlapping
  // bodies are eased apart along their axis, weighted by mass (radius^2)
  // so bosses barely yield, and enemies are kept out of the player's disc
  // so the hero is never stood inside of. Pushes go through moveEntity, so
  // ridge and world bounds still apply. Iteration follows the stable enemy
  // array order with an index-hash tiebreak for coincident bodies: fully
  // deterministic and consumes no RNG.
  separateEnemies() {
    const enemies = this.state.enemies;
    const player = this.state.player;
    const cell = 64;
    const grid = new Map();
    for (let i = 0; i < enemies.length; i += 1) {
      const key = `${Math.floor(enemies[i].x / cell)},${Math.floor(enemies[i].y / cell)}`;
      const bucket = grid.get(key);
      if (bucket) bucket.push(i); else grid.set(key, [i]);
    }
    const push = (enemy, dx, dy) => { if (dx || dy) this.moveEntity(enemy, dx, dy, enemy.radius); };
    for (let i = 0; i < enemies.length; i += 1) {
      const a = enemies[i];
      if (a.hp <= 0) continue;
      if (player && player.hp > 0) {
        const dx = a.x - player.x, dy = a.y - player.y;
        const min = (a.radius + player.radius) * .92;
        const d2 = dx * dx + dy * dy;
        if (d2 < min * min) {
          const d = Math.sqrt(d2);
          if (d > 1e-4) push(a, dx / d * (min - d), dy / d * (min - d));
          else push(a, min, 0);
        }
      }
      const cx = Math.floor(a.x / cell), cy = Math.floor(a.y / cell);
      for (let gx = cx - 1; gx <= cx + 1; gx += 1) for (let gy = cy - 1; gy <= cy + 1; gy += 1) {
        const bucket = grid.get(`${gx},${gy}`);
        if (!bucket) continue;
        for (const j of bucket) {
          if (j <= i) continue;
          const b = enemies[j];
          if (b.hp <= 0) continue;
          const dx = b.x - a.x, dy = b.y - a.y;
          const min = (a.radius + b.radius) * .82;
          const d2 = dx * dx + dy * dy;
          if (d2 >= min * min) continue;
          const d = Math.sqrt(d2);
          let ux, uy;
          if (d > 1e-4) { ux = dx / d; uy = dy / d; } else { const t = ((i * 31 + j * 17) % 628) / 100; ux = Math.cos(t); uy = Math.sin(t); }
          const overlap = min - d;
          const ma = a.radius * a.radius, mb = b.radius * b.radius, total = ma + mb;
          push(a, -ux * overlap * (mb / total), -uy * overlap * (mb / total));
          push(b, ux * overlap * (ma / total), uy * overlap * (ma / total));
        }
      }
    }
  }

  autoAttack(dt) {
    const weaponSkill = this.state.skills.find((skill) => skill.isWeapon);
    if (!weaponSkill) return;
    weaponSkill.cooldown = Math.max(0, (weaponSkill.cooldown || 0) - dt);
    if (weaponSkill.cooldown <= 0) {
      weaponSkill.cooldown = getWeaponStats(this.character.id, weaponSkill.level).cooldown;
      this.fireWeapon(weaponSkill);
    }
    for (const skill of this.state.skills) {
      if (skill.isWeapon || skill.level <= 0) continue;
      skill.cooldown = Math.max(0, (skill.cooldown || 0) - dt);
      if (skill.cooldown <= 0) {
        const stats = getArtifactStats(skill.id, skill.level);
        skill.cooldown = stats.cooldown;
        this.fireArtifact(skill, stats);
      }
    }
  }

  fireWeapon(skill) {
    const stats = getWeaponStats(this.character.id, skill.level);
    const player = this.state.player;
    const baseDamage = this.character.stats.damage * stats.damage * (1 + clamp(Number(this.talents['sharp-eye'] || 0) * 0.03, 0, 0.3) + (player.damageBonus || 0));
    const target = this.nearestEnemy();
    const angle = target ? Math.atan2(target.y - player.y, target.x - player.x) : player.facing;
    player.facing = angle;
    player.attackFlash = 0.2; player.attackAngle = angle;
    player.attackTimer = Math.max(player.attackTimer || 0, 0.24);
    this.weaponShots += 1;
    this.emit({ type: 'attack', weapon: this.character.id });
    if (this.character.id === 'wukong') {
      const heavy = stats.heavyEvery && this.weaponShots % stats.heavyEvery === 0;
      this.effect({ x: player.x, y: player.y, kind: heavy ? 'heavy-sweep' : 'sweep', radius: stats.range * (heavy ? stats.heavyRadius : 1), angle, color: this.character.color, ttl: 0.18 });
      const arc = (stats.arc || 1.15) * (heavy ? 1.25 : 1);
      this.hitCone(angle, stats.range * (heavy ? stats.heavyRadius : 1), arc, baseDamage * (heavy ? stats.heavyMultiplier : 1), heavy ? stats.stunChance || 0 : 0, heavy);
    } else if (this.character.id === 'tangseng') {
      const targetDistance = target ? Math.min(distance(target, player), stats.range) : stats.range;
      const targetPoint = { x: player.x + Math.cos(angle) * targetDistance, y: player.y + Math.sin(angle) * targetDistance };
      this.projectile({ x: player.x, y: player.y, vx: Math.cos(angle) * stats.projectileSpeed, vy: Math.sin(angle) * stats.projectileSpeed, radius: stats.radius, color: this.character.color, kind: 'light-orb', ttl: targetDistance / stats.projectileSpeed + stats.linger + 0.05, damage: baseDamage, target: targetPoint, linger: stats.linger, bounce: stats.bounce, targetLimit: stats.bounceTargets || (skill.level >= 5 ? 5 : skill.level >= 4 ? 3 : 2), split: stats.split, knockback: stats.knockback, pierce: true });
    } else if (this.character.id === 'bajie') {
      this.effect({ x: player.x, y: player.y, kind: 'hoe-line', radius: stats.range, angle, color: this.character.color, ttl: 0.22, width: stats.width });
      this.hitLine(angle, stats.range, stats.width, baseDamage, stats.bleedTicks);
      const birds = stats.birds || 0;
      for (let i = 0; i < birds; i += 1) {
        const spread = (i - (birds - 1) / 2) * 0.14;
        const birdTarget = this.sortedEnemies(player)[i % Math.max(1, this.state.enemies.length)];
        this.projectile({ x: player.x, y: player.y, vx: Math.cos(angle + spread) * 290, vy: Math.sin(angle + spread) * 290, radius: 9, color: '#f58c42', kind: 'fire-bird', ttl: 1.6, damage: baseDamage * 0.55, explosion: stats.explosion, targetId: birdTarget?.id, speed: 290 });
      }
    } else {
      this.effect({ x: player.x, y: player.y, kind: 'staff-ring', radius: stats.range, angle: 0, color: this.character.color, ttl: 0.24 });
      this.hitCircle(player.x, player.y, stats.range, baseDamage);
      if (stats.whirlDuration && this.weaponShots % stats.whirlEvery === 0) {
        for (const direction of [-1, 0, 1]) {
          this.effect({ x: player.x + direction * stats.range * 0.75, y: player.y + (direction === 0 ? -stats.range * 0.75 : 0), kind: 'whirl', radius: stats.whirlRadius || (skill.level >= 4 ? 36 : 18), color: '#8bb8bf', ttl: stats.whirlDuration, damage: baseDamage * stats.whirlDamage / Math.max(stats.whirlDuration, 0.1), slowPower: skill.level, pull: stats.pull || 0, hitIds: true });
        }
      }
    }
  }

  fireArtifact(skill, stats) {
    const player = this.state.player;
    const level = skill.level;
    const target = this.nearestEnemy();
    const angle = target ? Math.atan2(target.y - player.y, target.x - player.x) : player.facing;
    player.attackFlash = Math.max(player.attackFlash || 0, 0.18); player.attackAngle = angle;
    player.attackTimer = Math.max(player.attackTimer || 0, 0.22);
    const damage = this.character.stats.damage * stats.damage * stats.power * (1 + clamp(Number(this.talents['sharp-eye'] || 0) * 0.03, 0, 0.3) + (player.damageBonus || 0));
    this.emit({ type: 'attack', artifact: skill.id });
    if (skill.id === 'lotus-lantern') {
      const count = [3, 6, 9, 12, 15][level - 1];
      const intercepts = [1, 1, 2, 2, 3][level - 1];
      for (let i = 0; i < count; i += 1) {
        const direction = angle + i / count * TAU;
        this.effect({ x: player.x, y: player.y, kind: 'monkey-clone', radius: 16, angle: direction, color: '#e6a43a', ttl: 4, damage: damage * (0.6 + level * 0.1), intercepts, vx: Math.cos(direction) * 165, vy: Math.sin(direction) * 165, hitIds: true });
      }
    } else if (skill.id === 'moon-mirror') {
      for (let i = 0; i < level; i += 1) {
        const direction = level === 1 ? angle : level === 2 ? angle + (i === 0 ? -Math.PI / 2 : Math.PI / 2) : angle + i / level * TAU;
        const x = player.x + Math.cos(direction) * (78 + level * 10);
        const y = player.y + Math.sin(direction) * (78 + level * 10);
        this.effect({ x, y, kind: 'palm-strike', radius: 36 * (1 + (level - 1) * 0.18), angle: direction, color: '#e7cb80', ttl: 0.5, delay: 0.3, burstDamage: damage * (1.8 + level * 0.15), symbol: '卍' });
      }
    } else if (skill.id === 'golden-rope') {
      const count = [1, 3, 5, 6, 9][level - 1];
      for (let i = this.state.effects.length - 1; i >= 0; i -= 1) if (this.state.effects[i].artifactId === skill.id) { this.release('effect', this.state.effects[i]); this.state.effects.splice(i, 1); }
      for (let i = 0; i < count; i += 1) this.effect({ x: player.x, y: player.y, kind: level === 5 ? 'skull-bead' : 'bead', radius: 8 + level, angle: i / count * TAU, color: level === 5 ? '#f0e4c6' : '#d9b77b', ttl: stats.cooldown + 0.1, damage: damage * 0.17, orbitRadius: 55 + level * 6, angularSpeed: 1.4 + level * 0.45, artifactId: skill.id, hitIds: true });
    } else if (skill.id === 'purple-gourd') {
      this.effect({ x: player.x, y: player.y, kind: 'gourd', radius: 175 + level * 25, angle, arc: 1.1 + level * 0.1, color: '#a879cb', ttl: 2.4, damage: damage * 0.22, pull: 90 + level * 30, slowPower: level, followPlayer: true });
    } else if (skill.id === 'samadhi-fire') {
      const point = target && distance(target, player) < 440 ? target : { x: player.x + Math.cos(angle) * 150, y: player.y + Math.sin(angle) * 150 };
      this.effect({ x: point.x, y: point.y, kind: 'mountain', radius: 90 * (1 + (level - 1) * 0.2), angle, color: '#b58d65', ttl: 0.8, delay: 0.45, burstDamage: damage * (2.1 + level * 0.35), silverHorn: true });
    } else if (skill.id === 'iron-fan') {
      const directions = level >= 4 ? [angle, angle + Math.PI] : [angle];
      for (const direction of directions) {
        this.effect({ x: player.x, y: player.y, kind: 'fan', radius: 160 + level * 25, angle: direction, color: '#68c2aa', ttl: 0.35, arc: 1.45 + level * 0.12 });
        for (const enemy of this.state.enemies.slice()) {
          const difference = Math.atan2(enemy.y - player.y, enemy.x - player.x) - direction;
          if (distance(enemy, player) > 160 + level * 25 + enemy.radius || Math.abs(Math.atan2(Math.sin(difference), Math.cos(difference))) > (1.45 + level * 0.12) / 2) continue;
          this.damageEnemy(enemy, damage * 0.32, { knockback: enemy.kind === 'normal' ? 140 + level * 24 : enemy.kind === 'elite' ? 45 + level * 8 : 10 + level * 3 });
          enemy.knockback = Math.max(enemy.knockback || 0, 0.25);
        }
      }
    } else if (skill.id === 'nine-dragon') {
      const count = [1, 1, 2, 2, 2][level - 1];
      for (let i = 0; i < count; i += 1) {
        const direction = angle + (i - (count - 1) / 2) * 0.12;
        this.projectile({ x: player.x, y: player.y, vx: Math.cos(direction) * 600, vy: Math.sin(direction) * 600, radius: level >= 3 ? 22 + level * 2 : 13, color: '#f3873c', kind: 'fire-wheel', ttl: 0.9, damage: damage * 0.9, pierce: true, trail: level, trailTimer: 0 });
      }
    } else if (skill.id === 'diamond-snare') {
      this.projectile({ x: player.x, y: player.y, vx: Math.cos(angle) * 410, vy: Math.sin(angle) * 410, radius: 12, color: '#e7cb75', kind: 'ring', ttl: 7, damage: damage * 1.4, targetId: target?.id, speed: 410, maxBounces: [3, 5, 7, 9, 11][level - 1], bounceCount: 0, aoeTargets: level, splitChildren: level >= 5 ? 2 : level >= 3 ? 1 : 0, childBounces: level >= 5 ? 5 : level === 4 ? 4 : 3, child: false, pierce: true, bounds: { x: player.x - 330, y: player.y - 390, w: 660, h: 780 }, hitIds: true });
    }
  }
  nearestEnemy() {
    const player = this.state.player;
    let best = null; let bestDistance = Infinity;
    for (const enemy of this.state.enemies) { const d = distance(enemy, player); if (d < bestDistance) { best = enemy; bestDistance = d; } }
    return best;
  }

  sortedEnemies(origin, predicate = () => true) {
    return this.state.enemies.filter(predicate).sort((a, b) => distance(a, origin) - distance(b, origin));
  }

  projectile(data) {
    if (this.state.projectiles.length >= BALANCE.maxProjectiles) return;
    this.state.projectiles.push(this.acquire('projectile', { id: this.allocId('projectile'), x: 0, y: 0, vx: 0, vy: 0, radius: 5, color: '#fff', ...data, ttl: data.ttl == null ? 1 : data.ttl, age: 0 }));
  }

  effect(data) {
    if (this.state.effects.length >= BALANCE.maxEffects) return;
    const ttl = data.ttl == null ? 0.2 : data.ttl;
    this.state.effects.push(this.acquire('effect', { id: this.allocId('effect'), x: data.x, y: data.y, kind: data.kind, radius: data.radius || 0, angle: data.angle || 0, color: data.color || '#fff', ttl, maxTtl: ttl, ...data }));
  }

  acquire(kind, data) {
    let object = this.poolingEnabled ? this.pools[kind].pop() : null;
    if (object) this.poolStats.reused[kind] += 1;
    else { object = {}; this.poolStats.created[kind] += 1; }
    const hit = object.hit instanceof Set ? object.hit : null;
    const hitIds = object.hitIds instanceof Set ? object.hitIds : null;
    // Reset values while retaining stable property slots; no entity from a
    // previous attack can leave a target, explosion, or damage flag behind.
    for (const key of Object.keys(object)) object[key] = undefined;
    Object.assign(object, data);
    if (kind === 'projectile') { object.hit = hit || new Set(); object.hit.clear(); }
    if (kind === 'effect' && data.hitIds) { object.hitIds = hitIds || new Set(); object.hitIds.clear(); }
    return object;
  }

  release(kind, object) {
    const limit = kind === 'projectile' ? BALANCE.maxProjectiles : kind === 'gem' ? BALANCE.maxGems : BALANCE.maxEffects;
    if (this.poolingEnabled && this.pools[kind].length < limit) this.pools[kind].push(object);
    this.poolStats.released[kind] += 1;
  }

  updateProjectiles(dt) {
    for (let i = this.state.projectiles.length - 1; i >= 0; i -= 1) {
      const shot = this.state.projectiles[i];
      const previous = { x: shot.x, y: shot.y };
      shot.age += dt; shot.ttl -= dt;
      const wasAnchored = shot.anchored;
      if (shot.returning) {
        const direction = normalize(this.state.player.x - shot.x, this.state.player.y - shot.y);
        shot.vx = direction.x * (shot.speed || 390); shot.vy = direction.y * (shot.speed || 390);
        if (distance(shot, this.state.player) < 22) shot.ttl = 0;
      }
      if (shot.targetId && !shot.anchored) {
        const target = this.state.enemies.find((enemy) => enemy.id === shot.targetId && enemy.hp > 0);
        if (target) {
          const direction = normalize(target.x - shot.x, target.y - shot.y);
          const speed = shot.speed || 420; shot.vx = direction.x * speed; shot.vy = direction.y * speed;
        }
      }
      shot.x += shot.vx * dt; shot.y += shot.vy * dt;
      if (shot.kind === 'fire-wheel' && shot.trail) {
        shot.trailTimer = (shot.trailTimer || 0) - dt;
        if (shot.trailTimer <= 0) { shot.trailTimer = 0.07; this.effect({ x: shot.x, y: shot.y, kind: 'fire-trail', radius: shot.radius, color: '#ef7650', ttl: shot.trail, damage: (shot.damage || 10) * 0.09 }); }
      }
      if ((shot.kind === 'ring' || shot.kind === 'ring-child') && shot.bounds) {
        const bounds = shot.bounds;
        if (shot.x < bounds.x || shot.x > bounds.x + bounds.w) { shot.vx *= -1; shot.x = clamp(shot.x, bounds.x, bounds.x + bounds.w); this.bounceRing(shot, null); }
        if (shot.y < bounds.y || shot.y > bounds.y + bounds.h) { shot.vy *= -1; shot.y = clamp(shot.y, bounds.y, bounds.y + bounds.h); this.bounceRing(shot, null); }
      }
      if (shot.kind === 'light-orb' && shot.target && !shot.anchored && this.segmentDistance(previous, shot, shot.target) <= 0.01) {
        shot.x = shot.target.x; shot.y = shot.target.y;
        shot.vx = 0; shot.vy = 0; shot.anchored = true; shot.ttl = shot.linger || 0;
        if (shot.split) this.splitOrb(shot);
      }
      if (wasAnchored && shot.kind === 'light-orb') {
        for (const enemy of this.state.enemies.slice()) if (distance(enemy, shot) <= 32 + enemy.radius) this.damageEnemy(enemy, shot.damage * dt, {});
      }
      if (shot.hostile) {
        const player = this.state.player;
        if (this.segmentDistance(previous, shot, player) <= shot.radius + player.radius) { this.damagePlayer(shot.damage); shot.ttl = 0; }
      }
      for (const enemy of this.state.enemies.slice()) {
        if (shot.hostile || wasAnchored && shot.kind === 'light-orb') break;
        if (shot.hit.has(enemy.id)) continue;
        if (this.segmentDistance(previous, shot, enemy) <= (shot.radius || 5) + enemy.radius) {
          shot.hit.add(enemy.id);
          this.damageEnemy(enemy, shot.damage || 12, { knockback: shot.knockback, stun: shot.stun || 0 });
          if (enemy.hp <= 0 && shot.refundOnKill && shot.refundSkill) {
            const skill = this.state.skills.find((item) => item.id === shot.refundSkill);
            if (skill) skill.cooldown = Math.max(0, (skill.cooldown || 0) - shot.refundOnKill);
          }
          if (shot.refund && shot.refundSkill) {
            const skill = this.state.skills.find((item) => item.id === shot.refundSkill);
            if (skill) skill.cooldown = Math.max(0, (skill.cooldown || 0) - shot.refund);
          }
          if (shot.explosion) this.explodeProjectile(shot);
          if (shot.returnToPlayer && !shot.returning) { shot.returning = true; shot.targetId = null; shot.pierce = true; }
          if (shot.kind === 'light-spark' || shot.kind === 'moon-blade') {
            shot.bounceCount = (shot.bounceCount || 0) + 1;
            if (shot.bounceCount <= (shot.maxBounces || 0)) {
              const pool = (shot.targetIds || []).map((id) => this.state.enemies.find((item) => item.id === id && item.hp > 0)).filter(Boolean);
              const next = this.sortedEnemies(shot, (item) => pool.includes(item) && item.id !== enemy.id)[0];
              if (next) { shot.targetId = next.id; shot.hit.clear(); shot.hit.add(enemy.id); }
              else shot.ttl = 0;
            } else shot.ttl = 0;
            break;
          }
          if (shot.kind === 'ring' || shot.kind === 'ring-child') {
            this.bounceRing(shot, enemy);
            break;
          }
          if (!shot.pierce) { shot.ttl = 0; break; }
        }
      }
      if (shot.ttl <= 0 || shot.x < -120 || shot.y < -120 || shot.x > BALANCE.worldSize + 120 || shot.y > BALANCE.worldSize + 120) {
        if (shot.explosion && !shot.exploded) this.explodeProjectile(shot);
        this.state.projectiles.splice(i, 1);
        this.release('projectile', shot);
      }
    }
  }

  splitOrb(orb) {
    const pool = this.sortedEnemies(orb, (enemy) => enemy.kind === 'normal').slice(0, orb.targetLimit || 2);
    for (let i = 0; i < Math.min(orb.split, 15); i += 1) {
      const angle = i / orb.split * TAU;
      this.projectile({ x: orb.x, y: orb.y, vx: Math.cos(angle) * 420, vy: Math.sin(angle) * 420, radius: 4, color: '#d8f8ff', kind: 'light-spark', ttl: 3, damage: orb.damage * 0.28, targetId: pool[i % Math.max(pool.length, 1)]?.id, targetIds: pool.map((item) => item.id), speed: 420, maxBounces: orb.bounce || 0, bounceCount: 0, targetLimit: orb.targetLimit || 2 });
    }
  }

  bounceRing(shot, enemy) {
    shot.bounceCount = (shot.bounceCount || 0) + 1;
    shot.targetId = null; shot.hit.clear(); if (enemy) shot.hit.add(enemy.id);
    if (enemy) {
      const nearby = this.sortedEnemies(enemy, (candidate) => candidate.id !== enemy.id && distance(candidate, enemy) < 110).slice(0, Math.max(0, (shot.aoeTargets || 1) - 1));
      for (const candidate of nearby) this.damageEnemy(candidate, shot.damage * 0.45, {});
      if (shot.bounceCount === 1) { shot.vx *= -1; shot.vy *= -1; }
      else { const angle = Math.atan2(shot.vy, shot.vx) + Math.PI + 0.28; shot.vx = Math.cos(angle) * shot.speed; shot.vy = Math.sin(angle) * shot.speed; }
    } else {
      for (const candidate of this.sortedEnemies(shot, (item) => distance(item, shot) < 110).slice(0, shot.aoeTargets || 1)) this.damageEnemy(candidate, shot.damage * 0.45, {});
    }
    if (!shot.child && shot.splitChildren) for (let i = 0; i < shot.splitChildren; i += 1) {
        const angle = Math.atan2(shot.vy, shot.vx) + Math.PI + (i - (shot.splitChildren - 1) / 2) * 0.8;
        this.projectile({ x: shot.x, y: shot.y, vx: Math.cos(angle) * 360, vy: Math.sin(angle) * 360, radius: 8, color: '#e7cb75', kind: 'ring-child', ttl: 5, damage: shot.damage * 0.4, speed: 360, maxBounces: shot.childBounces, bounceCount: 0, aoeTargets: 1, splitChildren: 0, child: true, pierce: true, bounds: { ...shot.bounds } });
    }
    if (shot.bounceCount >= shot.maxBounces) shot.ttl = 0;
  }

  explodeProjectile(shot) {
    if (shot.exploded) return;
    shot.exploded = true;
    this.effect({ x: shot.x, y: shot.y, kind: 'explosion', radius: shot.explosion, color: shot.color, ttl: 0.28 });
    this.hitCircle(shot.x, shot.y, shot.explosion, (shot.damage || 12) * 0.65);
  }

  damagePlayer(amount) {
    const player = this.state.player;
    if (this.debugMode && this.debugInvincible) return;
    if (this.state.status !== 'playing' || player.invulnerable > 0) return;
    const value = amount * (1 - clamp(Number(this.talents.warding || 0) * 0.025, 0, 0.25));
    const absorbed = Math.min(player.shield || 0, value);
    player.shield = Math.max(0, (player.shield || 0) - absorbed); player.hp -= value - absorbed;
    player.invulnerable = 0.6; this.emit({ type: 'hit', target: 'player', amount: value });
    player.hitFlash = 0.28;
    player.hitTimer = 0.28; this.setAnimation(player, 'hit');
    if (player.hp <= 0) {
      if (this.character.id === 'bajie' && !player.lastStandUsed) { player.hp = 1; player.lastStandUsed = true; player.invulnerable = 2; }
      else this.lose();
    }
  }

  segmentDistance(a, b, point) {
    const dx = b.x - a.x; const dy = b.y - a.y;
    const lengthSq = dx * dx + dy * dy;
    const t = lengthSq ? clamp(((point.x - a.x) * dx + (point.y - a.y) * dy) / lengthSq, 0, 1) : 0;
    return Math.hypot(point.x - (a.x + dx * t), point.y - (a.y + dy * t));
  }

  updateEffects(dt) {
    for (let i = this.state.effects.length - 1; i >= 0; i -= 1) {
      const effect = this.state.effects[i];
      // Authored telegraphs stay synchronized with the boss even when stun or
      // knockback delays its windup. They never damage by merely expiring.
      if (effect.kind === 'warning' && effect.bossPattern) {
        const owner = this.state.enemies.find((enemy) => enemy.id === effect.sourceId && enemy.hp > 0);
        effect.ttl = owner?.attackPhase === 'windup' ? owner.attackWindup + dt : 0;
      }
      const activeDt = Math.min(dt, Math.max(0, effect.ttl)); effect.ttl -= dt;
      const actor = battleEnemyAnimation(effect);
      if (actor && effect.animationState === 'death') {
        effect.frameTime = Math.min(effect.maxTtl, Math.max(0, effect.maxTtl - effect.ttl));
        effect.animationFrames = actor.frames.death;
        effect.frameIndex = Math.min(actor.frames.death - 1, Math.floor((effect.frameTime + 1e-8) * actor.fps.death));
      } else if (effect.animationState) this.stepAnimation(effect, effect.animationState, activeDt, effect.animationState === 'death' ? 14 : 10);
      if (effect.followPlayer) { effect.x = this.state.player.x; effect.y = this.state.player.y; }
      if (effect.kind === 'bead' || effect.kind === 'skull-bead') {
        effect.x = this.state.player.x + Math.cos(effect.angle + this.state.time * effect.angularSpeed) * effect.orbitRadius;
        effect.y = this.state.player.y + Math.sin(effect.angle + this.state.time * effect.angularSpeed) * effect.orbitRadius;
      }
      if (effect.kind === 'monkey-clone') {
        const target = this.sortedEnemies(effect, (enemy) => !effect.hitIds.has(enemy.id) && distance(enemy, effect) < 210)[0];
        if (target) { const direction = normalize(target.x - effect.x, target.y - effect.y); effect.vx = direction.x * 165; effect.vy = direction.y * 165; }
        effect.x += effect.vx * activeDt; effect.y += effect.vy * activeDt;
        for (const enemy of this.state.enemies.slice()) if (!effect.hitIds.has(enemy.id) && distance(enemy, effect) < effect.radius + enemy.radius) {
          effect.hitIds.add(enemy.id); this.damageEnemy(enemy, effect.damage, {}); enemy.stun = Math.max(enemy.stun, 1.1); effect.intercepts -= 1;
          if (effect.intercepts <= 0) { effect.ttl = 0; break; }
        }
      }
      if (effect.delay > 0) { effect.delay -= activeDt; if (effect.delay <= 0 && effect.burstDamage) { this.hitCircle(effect.x, effect.y, effect.radius, effect.burstDamage); effect.burstDamage = 0; } }
      if (effect.kind === 'gourd') {
        const mouth = { x: effect.x + Math.cos(effect.angle) * 28, y: effect.y + Math.sin(effect.angle) * 28 };
        for (const enemy of this.state.enemies.slice()) {
          const relative = Math.atan2(enemy.y - effect.y, enemy.x - effect.x) - effect.angle;
          if (distance(effect, enemy) > effect.radius + enemy.radius || Math.abs(Math.atan2(Math.sin(relative), Math.cos(relative))) > effect.arc / 2) continue;
          if (enemy.kind === 'normal') {
            const direction = normalize(mouth.x - enemy.x, mouth.y - enemy.y);
            const pull = Math.min(distance(enemy, mouth), effect.pull * activeDt);
            enemy.x += direction.x * pull; enemy.y += direction.y * pull; enemy.nextSlow = Math.min(enemy.nextSlow || 1, 0.4);
            if (distance(enemy, mouth) <= 18 + enemy.radius * 0.3) this.damageEnemy(enemy, enemy.hp, {});
          } else {
            this.damageEnemy(enemy, effect.damage * activeDt, {});
            enemy.nextSlow = Math.min(enemy.nextSlow || 1, enemy.kind === 'elite' ? 0.62 : 0.85);
          }
        }
      }
      if (['whirl', 'fire-ring', 'rope', 'fire-mark', 'poison', 'fire-pool', 'fan', 'bead', 'skull-bead', 'fire-trail'].includes(effect.kind)) {
        for (const enemy of this.state.enemies.slice()) if (distance(effect, enemy) <= effect.radius + enemy.radius) {
          if (effect.kind === 'fan') {
            const difference = Math.atan2(enemy.y - effect.y, enemy.x - effect.x) - effect.angle;
            if (Math.abs(Math.atan2(Math.sin(difference), Math.cos(difference))) > 0.75) continue;
          }
          this.damageEnemy(enemy, (effect.damage == null ? 4 : effect.damage) * activeDt, { knockback: 0 });
          if (effect.kind === 'whirl') {
            if (this.character.id === 'wujing' && !effect.hitIds?.has(enemy.id)) {
              effect.hitIds?.add(enemy.id);
              this.state.player.whirlHits = (this.state.player.whirlHits || 0) + 1;
              if (this.state.player.whirlHits >= 12) { this.state.player.whirlHits = 0; this.state.player.shield = Math.min(30, (this.state.player.shield || 0) + 10); }
            }
            const level = effect.slowPower || 3;
            const slow = level >= 5 ? (enemy.kind === 'normal' ? 0.32 : enemy.kind === 'elite' ? 0.62 : 0.82) : level >= 4 ? (enemy.kind === 'normal' ? 0.55 : 0.78) : 0.9;
            enemy.nextSlow = Math.min(enemy.nextSlow || 1, slow);
            if (effect.pull) {
              const pull = normalize(effect.x - enemy.x, effect.y - enemy.y);
              const strength = enemy.kind === 'normal' ? 1 : enemy.kind === 'elite' ? 0.4 : 0.12;
              enemy.x += pull.x * effect.pull * activeDt * strength; enemy.y += pull.y * effect.pull * activeDt * strength;
            }
          }
        }
      }
      if (effect.kind === 'rope') for (const enemy of this.state.enemies) if (distance(effect, enemy) <= effect.radius) enemy.nextSlow = Math.min(enemy.nextSlow || 1, 0.65);
      if (effect.ttl <= 0) {
        if (effect.hostileDamage && distance(effect, this.state.player) <= effect.radius + this.state.player.radius) this.damagePlayer(effect.hostileDamage);
        if (effect.burstDamage) {
          this.hitCircle(effect.x, effect.y, effect.radius, effect.burstDamage);
          this.effect({ x: effect.x, y: effect.y, kind: 'explosion', radius: effect.radius, color: effect.color, ttl: 0.25 });
        }
        if (effect.fireAfter) this.effect({ x: effect.x, y: effect.y, kind: 'fire-pool', radius: effect.radius, color: '#ee8054', ttl: 3, damage: (effect.damage || 6) * 0.4 });
        this.state.effects.splice(i, 1);
        this.release('effect', effect);
      }
    }
  }

  hitCircle(x, y, radius, amount) {
    for (const enemy of this.state.enemies.slice()) if (Math.hypot(enemy.x - x, enemy.y - y) <= radius + enemy.radius) this.damageEnemy(enemy, amount, {});
  }

  hitCone(angle, radius, arc, amount, stunChance = 0, critical = false) {
    const player = this.state.player;
    for (const enemy of this.state.enemies.slice()) {
      const d = distance(enemy, player); if (d > radius + enemy.radius) continue;
      let delta = Math.atan2(enemy.y - player.y, enemy.x - player.x) - angle;
      delta = Math.atan2(Math.sin(delta), Math.cos(delta));
      if (Math.abs(delta) <= arc / 2) this.damageEnemy(enemy, amount, { stun: this.rng() < stunChance ? 1.4 : 0, critical });
    }
  }

  hitLine(angle, length, width, amount, bleedTicks = null) {
    const player = this.state.player;
    for (const enemy of this.state.enemies.slice()) {
      const dx = enemy.x - player.x; const dy = enemy.y - player.y;
      const forward = dx * Math.cos(angle) + dy * Math.sin(angle);
      const lateral = Math.abs(-dx * Math.sin(angle) + dy * Math.cos(angle));
      if (forward >= 0 && forward <= length && lateral <= width + enemy.radius) {
        this.damageEnemy(enemy, amount, {});
        if (bleedTicks) {
          if (!enemy.bleeds) enemy.bleeds = [];
          // Every hit has three exact one-second ticks. Up to three concurrent
          // applications fit the one-second attack rhythm and stay bounded.
          enemy.bleeds.push({ baseDamage: amount, ticks: bleedTicks.slice(), tick: 0, timer: 1 });
          if (enemy.bleeds.length > 3) enemy.bleeds.shift();
        }
      }
    }
  }

  damageEnemy(enemy, amount, options = {}) {
    if (!enemy || enemy.hp <= 0) return;
    const value = Math.max(0, Number(amount) || 0);
    enemy.hp -= value; enemy.flash = 0.12; this.state.damage += value;
    const actor = battleEnemyAnimation(enemy);
    if (actor) {
      if (enemy.visualHitTimer <= 1e-8) { enemy.frameTime = 0; enemy.frameIndex = 0; }
      enemy.visualHitTimer = actor.frames.hit / actor.fps.hit;
      enemy.visualAttackTimer = 0;
    }
    enemy.hitTimer = Math.max(enemy.hitTimer || 0, 0.12); this.setAnimation(enemy, 'hit');
    // Per-target feedback throttling bounds orbit/DoT labels without changing
    // damage, status application or the RNG stream. Every hit still emits below.
    // Playtest display rule (2026-10-22): labels show whole numbers only. A hit
    // that rounds to zero (sub-point DoT ticks from whirl/fire pools) stays
    // silent instead of floating "0.0"/"0.1"; the damage value is untouched.
    const shownDamage = Math.round(value);
    if (value > 0 && shownDamage > 0 && this.state.time >= (enemy.feedbackAt || -1)) {
      enemy.feedbackAt = this.state.time + .09;
      this.state.damageNumbers.push({ x: enemy.x, y: enemy.y - enemy.radius - 8, damage: shownDamage, ttl: 1.25, maxTtl: 1.25, color: options.critical ? '#fff03d' : '#fff3b8', critical: Boolean(options.critical), size: options.critical ? 22 : 17 });
      if (this.state.damageNumbers.length > 48) this.state.damageNumbers.splice(0, this.state.damageNumbers.length - 48);
    }
    this.emit({ type: 'hit', target: 'enemy', amount: value, critical: Boolean(options.critical), enemy });
    if (options.knockback && options.knockback <= 1) {
      enemy.knockback = Math.max(enemy.knockback || 0, options.knockback);
      const away = normalize(enemy.x - this.state.player.x, enemy.y - this.state.player.y);
      enemy.x += away.x * 14; enemy.y += away.y * 14;
    } else if (options.knockback) {
      const away = normalize(enemy.x - this.state.player.x, enemy.y - this.state.player.y);
      enemy.x += away.x * options.knockback; enemy.y += away.y * options.knockback;
    }
    if (options.stun) enemy.stun = Math.max(enemy.stun, options.stun);
    if (enemy.hp <= 0) this.killEnemy(enemy);
  }

  killEnemy(enemy) {
    const index = this.state.enemies.indexOf(enemy); if (index < 0) return;
    const actor = battleEnemyAnimation(enemy);
    this.effect({
      x: enemy.x, y: enemy.y, kind: 'death', radius: enemy.radius * (enemy.kind === 'boss' ? 1.8 : 1.25),
      color: enemy.kind === 'boss' ? '#ffcf4f' : (enemy.color || '#f2a14a'), ttl: enemy.kind === 'boss' ? 0.72 : 0.42,
      animationState: 'death', frameIndex: 0, frameTime: 0, animationFrames: actor ? actor.frames.death : animationFrames('death'),
      enemyKind: enemy.kind, variant: enemy.variant, name: enemy.name, final: Boolean(enemy.final), bossIdentity: enemy.bossIdentity || null,
      encounterIdentity: enemy.encounterIdentity || null,
      ...(actor ? { battleSpriteId: actor.id, facing: enemy.facing, bodyRadius: enemy.radius } : {}),
    });
    this.state.enemies.splice(index, 1); this.state.kills += 1;
    const value = enemy.xp || 2;
    this.dropGem(enemy.x, enemy.y, value, 'xp');
    if (enemy.kind === 'boss') { this.dropGem(enemy.x, enemy.y, enemy.coin || (enemy.final ? 80 : 35), 'coin'); this.emit({ type: 'kill', enemy, boss: true, final: Boolean(enemy.final) }); }
    else {
      if (this.rng() < 0.045) this.dropGem(enemy.x + 8, enemy.y, 1, 'heal');
      if (enemy.kind === 'elite' || this.rng() < 0.22) this.dropGem(enemy.x - 8, enemy.y, enemy.kind === 'elite' ? 5 : 1, 'coin');
      if (this.rng() < 0.004) this.dropGem(enemy.x, enemy.y + 8, 1, 'magnet');
      this.emit({ type: 'kill', enemy });
    }
  }

  dropGem(x, y, value, kind) {
    if (this.state.gems.length >= BALANCE.maxGems) {
      const compatible = this.state.gems.find((gem) => gem.kind === kind);
      if (compatible) { compatible.value += value; return; }
      const displaced = this.state.gems.shift();
      const receiver = this.state.gems.find((gem) => gem.kind === displaced.kind);
      if (receiver) receiver.value += displaced.value;
      this.release('gem', displaced);
    }
    this.state.gems.push(this.acquire('gem', { id: this.allocId('gem'), x, y, value, kind }));
  }

  updateGems(dt = 0.05) {
    const player = this.state.player;
    for (let i = this.state.gems.length - 1; i >= 0; i -= 1) {
      const gem = this.state.gems[i];
      const d = distance(gem, player);
      const pickupRadius = 30 + (Number(this.talents.fortune || 0) * 8);
      if (d <= pickupRadius) {
        this.state.gems.splice(i, 1); this.collectGem(gem); this.release('gem', gem); continue;
      }
      if (d < 170 && gem.kind === 'xp' || gem.magnetized) {
        const vector = normalize(player.x - gem.x, player.y - gem.y);
        gem.x += vector.x * 270 * dt; gem.y += vector.y * 270 * dt;
      }
    }
  }

  collectGem(gem) {
    if (gem.kind === 'xp') {
      this.state.player.xp += gem.value * (1 + clamp(Number(this.talents.fortune || 0) * 0.04, 0, 0.4));
      while (this.state.player.xp >= this.state.player.xpNext) {
        this.state.player.xp -= this.state.player.xpNext;
        this.state.player.level += 1;
        // A full run reaches roughly 23–26 upgrades from authentic drops.
        // Exponential requirements previously stopped most builds at level 12.
        const level = this.state.player.level;
        this.state.player.xpNext = Math.round(22 + level * 3 + level * level * 0.15);
        this.pendingUpgrades += 1;
      }
      if (this.pendingUpgrades && this.state.status === 'playing') this.openUpgrade();
    } else if (gem.kind === 'heal') this.state.player.hp = Math.min(this.state.player.maxHp, this.state.player.hp + this.state.player.maxHp * 0.12);
    else if (gem.kind === 'coin') this.state.coins += Math.round(gem.value * (1 + clamp(Number(this.talents.fortune || 0) * 0.04, 0, 0.4)));
    else if (gem.kind === 'magnet') for (const remaining of this.state.gems) remaining.magnetized = true;
    this.emit({ type: 'pickup', kind: gem.kind, value: gem.value });
    if (this.character.id === 'wukong' && gem.kind === 'xp') this.state.player.speedBoost = 0.75;
  }

  openUpgrade() {
    this.state.status = 'upgrade';
    if (this.character.id === 'tangseng') this.state.player.hp = Math.min(this.state.player.maxHp, this.state.player.hp + this.state.player.maxHp * 0.06);
    this.state.choices = this.makeChoices();
    this.emit({ type: 'upgrade', choices: this.state.choices });
  }

  makeChoices() {
    const owned = this.state.skills;
    const weapon = owned.find((skill) => skill.isWeapon);
    const choices = [];
    if (weapon && weapon.level < 5) choices.push(this.choiceFor(weapon.id, weapon.level));
    const candidates = ARTIFACTS.filter((artifact) => {
      const skill = owned.find((item) => item.id === artifact.id);
      return skill ? skill.level < 5 : owned.length < 5;
    });
    const shuffled = candidates.slice();
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(this.rng() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    for (const artifact of shuffled) {
      if (choices.length >= 3) break;
      const existing = owned.find((skill) => skill.id === artifact.id);
      choices.push(this.choiceFor(artifact.id, existing ? existing.level : 0));
    }
    const maxed = owned.length >= 5 && owned.every((skill) => skill.level >= 5);
    while (choices.length < 3) choices.push({ id: `boon:${choices.length}`, name: maxed ? '功德精进' : '临战心得', description: '提升 8% 伤害并回复 8% 生命。', level: 1, isWeapon: false, color: '#eacb82', icon: 'boon', boon: true });
    return choices.slice(0, 3);
  }

  choiceFor(id, level) {
    if (id.startsWith(WEAPON_PREFIX)) {
      const next = level + 1; return { id, name: this.character.weapon, description: this.character.weaponLevels[next - 1] || '武器精进', level: next, isWeapon: true, color: this.character.color, icon: 'weapon' };
    }
    const artifact = ARTIFACTS.find((item) => item.id === id);
    const next = level + 1;
    return { id, name: artifact ? artifact.name : id, description: artifact ? (artifact.levels[next - 1] || artifact.description) : '法宝精进', level: next, isWeapon: false, color: artifact ? artifact.color : '#eacb82', icon: artifact ? artifact.icon : 'artifact' };
  }

  chooseUpgrade(id) {
    if (this.disposed || this.state.status !== 'upgrade') return false;
    const choice = this.state.choices.find((item) => item.id === id);
    if (!choice) return false;
    if (choice.boon) {
      this.state.player.maxHp = Math.round(this.state.player.maxHp * 1.04); this.state.player.hp = Math.min(this.state.player.maxHp, this.state.player.hp + this.state.player.maxHp * 0.08); this.state.player.damageBonus = (this.state.player.damageBonus || 0) + 0.08;
    } else {
      let skill = this.state.skills.find((item) => item.id === choice.id);
      if (skill) skill.level = Math.min(5, skill.level + 1);
      else if (this.state.skills.length < 5) { skill = { id: choice.id, level: 1, isWeapon: Boolean(choice.isWeapon), cooldown: 0 }; this.state.skills.push(skill); }
      else return false;
    }
    this.pendingUpgrades = Math.max(0, this.pendingUpgrades - 1);
    this.state.choices = []; this.state.status = 'playing'; this.emit({ type: 'upgrade', selected: choice.id });
    if (this.pendingUpgrades > 0) this.openUpgrade();
    return true;
  }

  pause() { if (this.state.status === 'playing') this.state.status = 'paused'; return this.state.status; }
  resume() { if (this.state.status === 'paused') this.state.status = 'playing'; return this.state.status; }

  useDash(input = {}, fromArtifact = false) {
    if (this.disposed || this.state.status !== 'playing') return false;
    if (!fromArtifact && this.state.player.dashCooldown > 0) return false;
    const hasDirection = Math.hypot(Number(input.x) || 0, Number(input.y) || 0) > 0.001;
    const direction = hasDirection ? normalize(Number(input.x) || 0, Number(input.y) || 0) : { x: Math.cos(this.state.player.facing), y: Math.sin(this.state.player.facing) };
    const cooldown = 5 * (1 - clamp(Number(this.talents['dash-master'] || 0) * 0.045, 0, 0.36));
    this.movePlayer(direction.x * 180, direction.y * 180);
    this.state.player.invulnerable = 0.45; this.state.player.dashCooldown = fromArtifact ? Math.min(this.state.player.dashCooldown, cooldown * 0.5) : cooldown;
    this.state.player.dashTimer = 0.42; this.setAnimation(this.state.player, 'dash');
    this.effect({ x: this.state.player.x, y: this.state.player.y, kind: 'dash', radius: 34, angle: this.state.player.facing, color: '#bde9ff', ttl: 0.25 });
    this.emit({ type: 'dash' }); return true;
  }

  checkVictory() {
    if (this.state.status !== 'playing') return;
    if (this.state.time >= BALANCE.duration && this.finalBossSpawned && !this.state.enemies.some((enemy) => enemy.final)) {
      this.state.status = 'won'; this.emit({ type: 'win' });
    }
  }
  lose() { if (this.state.status === 'playing' || this.state.status === 'upgrade') { this.state.status = 'lost'; this.emit({ type: 'lose' }); } }

  trimCaps() {
    while (this.state.enemies.length > BALANCE.maxEnemies) this.state.enemies.shift();
    while (this.state.projectiles.length > BALANCE.maxProjectiles) this.release('projectile', this.state.projectiles.shift());
    while (this.state.effects.length > BALANCE.maxEffects) this.release('effect', this.state.effects.shift());
    while (this.state.gems.length > BALANCE.maxGems) this.state.gems.shift();
  }

  debug(action, payload = {}) {
    if (!this.debugMode) return false;
    if (action === 'invincible') { this.debugInvincible = payload.enabled !== false; return true; }
    if (action === 'pooling') { this.poolingEnabled = payload.enabled !== false; for (const pool of Object.values(this.pools)) pool.length = 0; return true; }
    if (action === 'spawn') return this.spawnEnemy(payload.kind || 'normal', payload.variant || 0);
    if (action === 'damage') { const enemy = this.state.enemies.find((item) => item.id === payload.id) || this.state.enemies[0]; if (enemy) this.damageEnemy(enemy, payload.amount || enemy.hp); return true; }
    if (action === 'xp') { this.dropGem(this.state.player.x, this.state.player.y, payload.value || 100, 'xp'); return true; }
    if (action === 'time') { this.elapsed = Number(payload.value) || 0; this.state.time = this.elapsed; return true; }
    if (action === 'killFinal') { for (const enemy of this.state.enemies.filter((item) => item.final)) this.killEnemy(enemy); return true; }
    return false;
  }

  getSnapshot() {
    return JSON.parse(JSON.stringify(this.state, (key, value) => value instanceof Set ? Array.from(value) : value));
  }

  dispose() { this.disposed = true; this.state.enemies.length = 0; this.state.projectiles.length = 0; this.state.effects.length = 0; this.state.gems.length = 0; for (const pool of Object.values(this.pools)) pool.length = 0; this.onEvent = () => {}; }
}

export default GameEngine;

