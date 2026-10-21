import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { GameEngine } from '../src/engine.js';
import { GameRenderer } from '../src/renderer.js';
import { BALANCE } from '../src/content.js';
import { TIGER_SPRITE_ID, attachTigerFrames, isBattleTiger } from '../src/tiger-animation.js';
import { BEAR_SPRITE_ID, attachBearFrames, isBattleBear } from '../src/bear-animation.js';
import { battleEnemyAnimation, battleEnemySpriteId } from '../src/battle-enemy-animation.js';
import {
  WOLF_SPRITE_ID, WOLF_FRAME_COUNTS, WOLF_FPS,
  isBattleWolf, attachWolfFrames, wolfDrawFrame,
} from '../src/wolf-animation.js';

// This is a deterministic Node/Canvas-mock gate, not browser or GPU evidence.
// Read the real, irregular atlas contract; a synthetic evenly divided sheet
// would conceal cropping and per-pose stretch regressions.
const contract = JSON.parse(fs.readFileSync(new URL('../assets/enemy-wolf-battle-v1-frames.json', import.meta.url), 'utf8'));
const sheetBytes = fs.readFileSync(new URL('../assets/enemy-wolf-battle-v1-sheet.png', import.meta.url));
const tests = [];
const test = (name, run) => tests.push({ name, run });
const close = (actual, expected, label = '') => assert.ok(Math.abs(actual - expected) < 1e-7, `${label}: expected ${expected}, got ${actual}`);
const copy = value => structuredClone(value);
const ids = count => Array.from({ length: count }, (_, i) => i);
const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    Object.values(value).forEach(freeze);
  }
  return value;
};
const makeImage = (data = contract) => attachWolfFrames({
  complete: true, width: contract.size[0], height: contract.size[1],
  naturalWidth: contract.size[0], naturalHeight: contract.size[1],
}, data);

function fixture({ stageId = 1, tagged = true, variant = 'wolf', x = 980, y = 500, speed = 42 } = {}) {
  const events = [];
  const engine = new GameEngine({ stageId, seed: 790, debug: true, onEvent: event => events.push(event) });
  // Isolate one enemy while preserving the actual update/contact/damage path.
  engine.state.skills = [];
  engine.spawnAccumulator = -100000;
  Object.assign(engine.state.player, { x: 900, y: 500, hp: 10000, maxHp: 10000 });
  const enemy = engine.spawnEnemy('normal', 0, { name: { wolf: '苍狼妖', bear: '熊妖', tiger: '虎妖' }[variant], variant });
  Object.assign(enemy, { x, y, speed, radius: 15, hp: 100000, maxHp: 100000, damage: 20 });
  if (!tagged) delete enemy.battleSpriteId;
  return { engine, enemy, events };
}

// The untagged control uses the unchanged generic enemy path. Only the new
// visual metadata is stripped; positions, damage, timers used by gameplay,
// drops, collision, status and every other snapshot field must still agree.
const visualFields = new Set(['battleSpriteId', 'animationState', 'animationFrames', 'frameIndex', 'frameTime', 'visualAttackTimer', 'visualHitTimer', 'bodyRadius']);
function gameplaySnapshot(engine) {
  const strip = value => {
    if (Array.isArray(value)) return value.map(strip);
    if (!value || typeof value !== 'object') return value;
    return Object.fromEntries(Object.entries(value)
      .filter(([key]) => !visualFields.has(key) && !(value.kind === 'death' && key === 'facing'))
      .map(([key, item]) => [key, strip(item)]));
  };
  return strip(engine.getSnapshot());
}

function multiply(a, b) {
  return [
    a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3],
    a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5],
  ];
}

function mockCanvas() {
  const calls = [], draws = [], stack = [];
  let matrix = [1, 0, 0, 1, 0, 0];
  const ctx = { globalAlpha: 1 };
  const record = (op, args) => {
    for (const value of args) if (typeof value === 'number') assert.ok(Number.isFinite(value), `${op} contains a non-finite argument`);
    if (op === 'arc') assert.ok(args[2] >= 0, 'negative arc radius');
    calls.push({ op, args });
  };
  for (const op of ['beginPath', 'closePath', 'moveTo', 'lineTo', 'quadraticCurveTo', 'bezierCurveTo', 'arc', 'fill', 'stroke', 'fillRect', 'strokeRect', 'clearRect', 'fillText', 'strokeText', 'clip']) {
    ctx[op] = (...args) => record(op, args);
  }
  ctx.save = () => { record('save', []); stack.push({ matrix: [...matrix], alpha: ctx.globalAlpha }); };
  ctx.restore = () => {
    record('restore', []);
    const state = stack.pop(); assert.ok(state, 'unbalanced Canvas restore');
    matrix = state.matrix; ctx.globalAlpha = state.alpha;
  };
  ctx.setTransform = (...args) => { record('setTransform', args); matrix = [...args]; };
  ctx.translate = (x, y) => { record('translate', [x, y]); matrix = multiply(matrix, [1, 0, 0, 1, x, y]); };
  ctx.scale = (x, y) => { record('scale', [x, y]); matrix = multiply(matrix, [x, 0, 0, y, 0, 0]); };
  ctx.rotate = angle => {
    record('rotate', [angle]);
    matrix = multiply(matrix, [Math.cos(angle), Math.sin(angle), -Math.sin(angle), Math.cos(angle), 0, 0]);
  };
  ctx.drawImage = (...args) => { record('drawImage', args); draws.push({ args, matrix: [...matrix], alpha: ctx.globalAlpha }); };
  ctx.measureText = text => ({ width: String(text).length * 8 });
  const canvas = { width: 0, height: 0, getContext: () => ctx };
  return { canvas, ctx, calls, draws, stack, reset() { calls.length = 0; draws.length = 0; } };
}

const theme = { ink: '#071b24', accent: '#f44a48', sticker: '#ffe84e' };
function rendererFixture(image, mode = 'authoredFrames') {
  const mock = mockCanvas();
  const renderer = new GameRenderer(mock.canvas, { width: 390, height: 844, showHud: false, battleArtMode: mode, enemyImages: image ? { wolf: image } : {} });
  return { ...mock, renderer };
}
const drawArgs = frame => [frame.x, frame.y, frame.w, frame.h, frame.dx, frame.dy, frame.dw, frame.dh];

test('real PNG and JSON specify 32 distinct explicit crops at one source-pixel scale', () => {
  assert.equal(WOLF_SPRITE_ID, 'wolf-normal-v1');
  assert.deepEqual(WOLF_FRAME_COUNTS, { idle: 8, move: 8, attack: 8, hit: 4, death: 4 });
  assert.deepEqual(WOLF_FPS, { idle: 8, move: 12, attack: 16, hit: 16, death: 10 });
  assert.deepEqual([...sheetBytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.deepEqual([sheetBytes.readUInt32BE(16), sheetBytes.readUInt32BE(20)], contract.size);
  assert.equal(createHash('sha256').update(sheetBytes).digest('hex'), contract.sha256);
  assert.equal(contract.sha256, 'b116553b99a397f2fd0c28076000246e9c3528c6b28d7ab6f2482927db8d8299', 'reuse the measured wolf PNG unchanged');
  assert.equal(contract.referenceBodyHeight, 170);
  assert.deepEqual(contract.previewRootXs, [113, 335, 557, 779, 1000, 1222, 1443, 1665]);
  assert.deepEqual(contract.previewBaselines, [208, 430, 650, 866]);
  assert.deepEqual({ stageId: contract.identity.stageId, kind: contract.identity.kind, variant: contract.identity.variant }, { stageId: 1, kind: 'normal', variant: 'wolf' });
  const before = JSON.stringify(contract), image = makeImage(freeze(copy(contract)));
  assert.equal(image.__wolfBattleSprite, true);
  assert.equal(image.__prioritySprite, true);
  const used = [], crops = new Set();
  for (const [state, count] of Object.entries(WOLF_FRAME_COUNTS)) {
    assert.equal(contract.states[state].length, count);
    for (let frameIndex = 0; frameIndex < count; frameIndex += 1) {
      const index = contract.states[state][frameIndex], rect = contract.sourceRects[index];
      used.push(index); crops.add([rect.x, rect.y, rect.w, rect.h].join(','));
      for (const radius of [7, 15, 30, 72]) {
        const result = wolfDrawFrame(image, state, frameIndex, radius), scale = radius * 3.2 / 170;
        assert.deepEqual([result.x, result.y, result.w, result.h], [rect.x, rect.y, rect.w, rect.h], `${state}:${frameIndex} must use its authored rectangle`);
        close(result.dw / rect.w, scale, `${state}:${frameIndex} horizontal source scale`);
        close(result.dh / rect.h, scale, `${state}:${frameIndex} vertical source scale`);
        close(result.dx, (rect.x - contract.previewRootXs[index % 8]) * scale, 'root X anchor');
        close(result.dy, radius * .7 + (rect.y - contract.previewBaselines[Math.floor(index / 8)]) * scale, 'foot baseline');
      }
    }
  }
  assert.deepEqual(used, ids(32)); assert.equal(crops.size, 32);
  assert.equal(JSON.stringify(contract), before, 'attaching an atlas must not rewrite the source contract');
  assert.deepEqual(wolfDrawFrame(image, 'move', 8, 15), wolfDrawFrame(image, 'move', 0, 15), 'walk loops');
  assert.deepEqual(wolfDrawFrame(image, 'idle', 8, 15), wolfDrawFrame(image, 'idle', 0, 15), 'idle loops');
  for (const state of ['attack', 'hit', 'death']) {
    assert.deepEqual(wolfDrawFrame(image, state, 100, 15), wolfDrawFrame(image, state, WOLF_FRAME_COUNTS[state] - 1, 15), `${state} holds its final pose`);
  }
  assert.deepEqual(wolfDrawFrame(image, 'stun', 3, 15), wolfDrawFrame(image, 'hit', 3, 15));
  assert.equal(wolfDrawFrame(null, 'move', 0, 15), null);
  assert.equal(wolfDrawFrame({}, 'move', 0, 15), null);
  assert.deepEqual(wolfDrawFrame(image, 'unknown', 0, 15), wolfDrawFrame(image, 'idle', 0, 15));
  for (const invalidIndex of [-3, NaN, undefined]) {
    assert.deepEqual(wolfDrawFrame(image, 'move', invalidIndex, 15), wolfDrawFrame(image, 'move', 0, 15), 'invalid/negative frame indices fall back to the initial pose');
  }
});

test('invalid dimensions, duplicate frame order and out-of-bounds rectangles are rejected', () => {
  assert.throws(() => attachWolfFrames({ width: 8, height: 4 }, contract), /Invalid/);
  assert.throws(() => attachWolfFrames(null, contract), /Invalid/);
  assert.throws(() => makeImage(null), /Invalid/);
  for (const mutate of [
    data => { data.states.move[0] = 0; },
    data => { data.sourceRects[31].x = data.size[0]; },
    data => { data.previewBaselines[3] = NaN; },
    data => { data.sourceRects[0].w = 0; },
    data => { data.referenceBodyHeight = 136; },
    data => { data.size[1] = 888; },
    data => { data.sourceRects.pop(); },
    data => { data.sourceRects[0].index = 1; },
    data => { data.sourceRects[0].state = 'move'; },
    data => { data.sourceRects[0].x = -1; },
    data => { data.sourceRects[0].h = Infinity; },
    data => { data.previewRootXs[0] = NaN; },
    data => { data.previewRootXs.pop(); },
    data => { data.states.death.pop(); },
  ]) {
    const invalid = copy(contract); mutate(invalid);
    assert.throws(() => makeImage(invalid), /Invalid/);
  }
});

test('only first-stage normal wolves acquire the art identity; named wolf Bosses cannot share it', () => {
  const { engine, enemy } = fixture();
  assert.equal(enemy.battleSpriteId, WOLF_SPRITE_ID); assert.equal(isBattleWolf(enemy), true);
  assert.equal(battleEnemySpriteId(1, 'normal', 'wolf'), WOLF_SPRITE_ID);
  for (const stageId of [0, 2, 3, 81, '1', undefined]) {
    assert.notEqual(battleEnemySpriteId(stageId, 'normal', 'wolf'), WOLF_SPRITE_ID, 'only the actual first-stage ID binds the wolf atlas');
  }
  for (const kind of ['elite', 'boss', 'death', undefined]) assert.notEqual(battleEnemySpriteId(1, kind, 'wolf'), WOLF_SPRITE_ID);
  for (const variant of ['bear', 'tiger', 'unknown', undefined]) assert.notEqual(battleEnemySpriteId(1, 'normal', variant), WOLF_SPRITE_ID);
  const elite = engine.spawnEnemy('elite', 0, { name: '苍狼妖精英', variant: 'wolf' });
  const boss = engine.spawnBoss(true, { name: '特处士', variant: 'wolf' });
  const aliasBoss = engine.spawnBoss(true, { name: '待处士', variant: 'wolf' });
  const bear = engine.spawnEnemy('normal', 0, { name: '熊妖', variant: 'bear' });
  const tiger = engine.spawnEnemy('normal', 0, { name: '虎妖', variant: 'tiger' });
  const later = fixture({ stageId: 2 });
  for (const other of [elite, boss, aliasBoss, bear, tiger, later.enemy]) {
    assert.notEqual(other.battleSpriteId, WOLF_SPRITE_ID);
    assert.equal(isBattleWolf(other), false);
  }
  for (const impostor of [
    { ...enemy, battleSpriteId: undefined }, { ...enemy, variant: 'bear' }, { ...enemy, variant: 'tiger' },
    { ...elite, battleSpriteId: WOLF_SPRITE_ID }, { ...boss, battleSpriteId: WOLF_SPRITE_ID },
    { ...aliasBoss, battleSpriteId: WOLF_SPRITE_ID },
    { ...enemy, kind: 'death', enemyKind: 'elite' }, { ...enemy, kind: 'death', enemyKind: 'boss' },
    { ...enemy, kind: 'death' }, null, {},
  ]) assert.equal(isBattleWolf(impostor), false, 'variant/name or a copied art ID alone is insufficient');
  assert.equal(isBattleWolf({ ...enemy, kind: 'death', enemyKind: 'normal' }), true);
  engine.dispose(); later.engine.dispose();
});

test('ordinary wolf idle and walk independently traverse all eight frames and loop', () => {
  const { engine, enemy } = fixture();
  for (const state of ['idle', 'move']) {
    engine.setAnimation(enemy, state);
    const seen = new Set();
    for (let i = 0; i < 180; i += 1) {
      engine.stepEnemyAnimation(enemy, state, 1 / 120, 99);
      assert.equal(enemy.animationFrames, 8);
      assert.ok(enemy.frameIndex >= 0 && enemy.frameIndex < 8);
      seen.add(enemy.frameIndex);
    }
    assert.deepEqual([...seen].sort((a, b) => a - b), ids(8), `${state} must not inherit the generic six-frame idle clock`);
  }
  engine.dispose();
});

test('natural contact shows all eight attack frames without changing movement, contact damage or RNG', () => {
  const authored = fixture(), control = fixture({ tagged: false });
  const frames = new Set(); let firstAttackAt = null, firstAttackX = null;
  for (let i = 0; i < 400; i += 1) {
    authored.engine.update(1 / 120); control.engine.update(1 / 120);
    assert.deepEqual(gameplaySnapshot(authored.engine), gameplaySnapshot(control.engine), `gameplay diverged on tick ${i}`);
    if (authored.enemy.animationState === 'attack') {
      if (firstAttackAt === null) {
        firstAttackAt = authored.engine.state.time; firstAttackX = authored.enemy.x;
        assert.ok(Math.hypot(authored.enemy.x - 900, authored.enemy.y - 500) <= authored.enemy.radius + authored.engine.state.player.radius);
        close(authored.enemy.visualAttackTimer, .5, 'contact visual duration');
        close(10000 - authored.engine.state.player.hp, authored.enemy.damage * .05, 'original contact damage');
      }
      assert.equal(authored.enemy.animationFrames, 8);
      if (authored.engine.state.time - firstAttackAt < .49) frames.add(authored.enemy.frameIndex);
    } else if (firstAttackAt === null) {
      assert.equal(authored.enemy.visualAttackTimer, 0, 'no attack is invented while approaching');
    }
    if (firstAttackAt !== null && authored.engine.state.time - firstAttackAt > .3 && authored.engine.state.time - firstAttackAt < .4) {
      assert.ok(authored.enemy.x < firstAttackX, 'visual swing must not stop pursuit');
    }
  }
  assert.ok(firstAttackAt > 0, 'fixture must trigger its attack by moving into contact');
  assert.deepEqual([...frames].sort((a, b) => a - b), ids(8));
  assert.equal(authored.engine.rng(), control.engine.rng(), 'visual timers must not consume RNG');
  authored.engine.dispose(); control.engine.dispose();
});

test('hit uses four frames, holds the last pose and leaves the original damage/stun/movement rules intact', () => {
  const authored = fixture(), control = fixture({ tagged: false });
  for (const item of [authored, control]) item.engine.damageEnemy(item.enemy, 7, { knockback: .12, stun: .18 });
  close(authored.enemy.hitTimer, .12, 'gameplay hit timer');
  close(authored.enemy.visualHitTimer, .25, 'visual hit timer');
  close(authored.enemy.hp, 99993, 'damage amount');
  assert.equal(authored.enemy.frameIndex, 0);
  const frames = new Set([0]); let movedWhileShowingHit = false;
  for (let i = 0; i < 60; i += 1) {
    const x = authored.enemy.x;
    authored.engine.update(.005); control.engine.update(.005);
    assert.deepEqual(gameplaySnapshot(authored.engine), gameplaySnapshot(control.engine), `hit changed gameplay on tick ${i}`);
    if (authored.enemy.animationState === 'hit') {
      assert.equal(authored.enemy.animationFrames, 4); frames.add(authored.enemy.frameIndex);
      if (i >= 38) assert.equal(authored.enemy.frameIndex, 3, 'late hit presentation holds the final frame, never wraps');
      if (authored.enemy.x !== x && authored.enemy.hitTimer === 0) movedWhileShowingHit = true;
    }
  }
  assert.deepEqual([...frames].sort((a, b) => a - b), ids(4));
  assert.ok(movedWhileShowingHit, 'the longer visual hit must not extend movement lock');
  assert.equal(authored.enemy.visualHitTimer, 0);
  assert.equal(authored.enemy.animationState, 'move');
  authored.engine.dispose(); control.engine.dispose();
});

test('pause freezes wolf attack, hit and retained death clocks; resume advances them', () => {
  for (const state of ['attack', 'hit', 'death']) {
    const { engine, enemy } = fixture({ x: state === 'attack' ? 932 : 980 });
    engine.update(.01);
    if (state === 'hit') engine.damageEnemy(enemy, 1);
    if (state === 'death') engine.damageEnemy(enemy, enemy.hp);
    const entity = state === 'death' ? engine.state.effects.find(isBattleWolf) : enemy;
    assert.equal(entity.animationState, state);
    engine.pause();
    const paused = engine.getSnapshot(), frameTime = entity.frameTime;
    for (let i = 0; i < 12; i += 1) engine.update(.05, { x: 1 });
    assert.deepEqual(engine.getSnapshot(), paused, `${state} advanced while paused`);
    engine.resume(); engine.update(.05);
    assert.ok(entity.frameTime > frameTime, `${state} did not continue after resume`);
    engine.dispose();
  }
});

test('death preserves facing/body size, presents 0..3 once, expires at .42s and clears recycled fields', () => {
  for (const dt of [1 / 120, .05]) {
    const { engine, enemy } = fixture();
    enemy.facing = Math.PI; const radius = enemy.radius;
    engine.damageEnemy(enemy, enemy.hp);
    const death = engine.state.effects.find(isBattleWolf);
    assert.ok(death); assert.equal(death.kind, 'death');
    assert.equal(engine.state.enemies.includes(enemy), false); assert.equal(engine.state.kills, 1);
    assert.equal(death.animationFrames, 4); assert.equal(death.facing, Math.PI); assert.equal(death.bodyRadius, radius);
    close(death.maxTtl, .42, 'unchanged death lifetime');
    const frames = [death.frameIndex]; let elapsed = 0;
    while (engine.state.effects.includes(death)) {
      const previous = death.frameIndex;
      engine.updateEffects(dt); elapsed += dt;
      assert.ok(death.frameIndex >= previous && death.frameIndex <= 3, 'death must be monotonic without wrapping');
      if (engine.state.effects.includes(death)) frames.push(death.frameIndex);
      assert.ok(elapsed < .5, 'death effect leaked beyond its bounded lifetime');
    }
    assert.deepEqual([...new Set(frames)], ids(4));
    assert.equal(frames.at(-1), 3);
    assert.ok(elapsed >= .42 - 1e-7 && elapsed <= .42 + dt + 1e-7);
    assert.equal(engine.pools.effect.includes(death), true);
    engine.effect({ x: 1, y: 2, kind: 'impact', radius: 8, ttl: .01 });
    const reused = engine.state.effects.at(-1);
    assert.equal(reused, death, 'expired death effect should be reused');
    for (const key of ['battleSpriteId', 'facing', 'bodyRadius', 'enemyKind', 'variant', 'animationState', 'animationFrames', 'frameTime', 'frameIndex']) {
      assert.equal(reused[key], undefined, `recycled impact retained wolf ${key}`);
    }
    assert.equal(isBattleWolf(reused), false);
    engine.updateEffects(.05);
    assert.equal(engine.state.effects.length, 0);
    assert.ok(engine.pools.effect.length <= BALANCE.maxEffects);
    assert.ok(engine.poolStats.released.effect >= 2 && engine.poolStats.reused.effect >= 1);
    engine.dispose(); assert.equal(engine.pools.effect.length, 0);
  }
});

test('Canvas draws all 32 crops in both directions without bob, rotation, squash or death stretch', () => {
  const image = makeImage(), mock = rendererFixture(image);
  const { engine, enemy } = fixture();
  let checked = 0;
  for (const [state, count] of Object.entries(WOLF_FRAME_COUNTS)) {
    for (let frameIndex = 0; frameIndex < count; frameIndex += 1) {
      for (const facing of [0, Math.PI]) {
        const entity = freeze({ ...enemy, x: 120, y: 220, facing, animationState: state, frameIndex, animationFrames: count,
          ...(state === 'death' ? { kind: 'death', enemyKind: 'normal', bodyRadius: enemy.radius, radius: enemy.radius * 1.25, ttl: .35, maxTtl: .42 } : {}) });
        const before = JSON.stringify(entity); mock.reset(); mock.renderer.elapsed = 17.3;
        if (state === 'death') mock.renderer._drawEffect(mock.ctx, entity);
        else mock.renderer._drawEnemy(mock.ctx, entity, engine.state.player, theme);
        assert.equal(mock.draws.length, 1, `${state}:${frameIndex} must draw exactly one wolf crop`);
        const [draw] = mock.draws, expected = wolfDrawFrame(image, state, frameIndex, enemy.radius);
        assert.equal(draw.args[0], image);
        draw.args.slice(1).forEach((value, i) => close(value, drawArgs(expected)[i], `${state}:${frameIndex} Canvas crop/destination ${i}`));
        [facing === 0 ? 1 : -1, 0, 0, 1, entity.x, entity.y].forEach((value, i) => close(draw.matrix[i], value, 'only world translation and horizontal mirror are permitted'));
        assert.equal(mock.calls.some(call => call.op === 'rotate'), false, 'authored poses must not acquire a synthetic wobble');
        assert.equal(JSON.stringify(entity), before, 'rendering mutated simulation state');
        assert.equal(mock.stack.length, 0); checked += 1;
      }
    }
  }
  assert.equal(checked, 64);
  engine.dispose(); mock.renderer.dispose();
});

test('renderer rejects elite/Boss/untagged identities and falls back safely when the wolf sheet is absent', () => {
  const image = makeImage(), { engine, enemy } = fixture();
  const valid = rendererFixture(image);
  for (const other of [
    { ...enemy, battleSpriteId: undefined }, { ...enemy, variant: 'tiger' }, { ...enemy, variant: 'bear' },
    { ...enemy, kind: 'elite', name: '苍狼妖精英' }, { ...enemy, kind: 'boss', name: '特处士' },
    { ...enemy, kind: 'boss', name: '待处士' },
  ]) {
    valid.reset(); valid.renderer._drawEnemy(valid.ctx, freeze(other), engine.state.player, theme);
    assert.equal(valid.draws.length, 0, `${other.name}/${other.kind} must not use the ordinary wolf atlas`);
    assert.ok(valid.calls.some(call => call.op === 'fill'), 'non-bound enemies keep their vector body');
    assert.equal(valid.stack.length, 0);
  }
  for (const missing of [undefined, { complete: false, naturalWidth: 0, naturalHeight: 0, width: 0, height: 0 }, { complete: true, width: 1774, height: 887 }]) {
    const fallback = rendererFixture(missing);
    fallback.renderer._drawEnemy(fallback.ctx, freeze({ ...enemy }), engine.state.player, theme);
    fallback.renderer._drawEffect(fallback.ctx, freeze({ ...enemy, kind: 'death', enemyKind: 'normal', bodyRadius: enemy.radius, animationState: 'death', animationFrames: 4, ttl: .3, maxTtl: .42 }));
    assert.equal(fallback.draws.length, 0, 'an unavailable or unattached image must never enter drawImage');
    assert.ok(fallback.calls.some(call => call.op === 'fill'));
    assert.equal(fallback.stack.length, 0); fallback.renderer.dispose();
  }
  const vector = rendererFixture(image, 'vector');
  vector.renderer._drawEnemy(vector.ctx, enemy, engine.state.player, theme);
  assert.equal(vector.draws.length, 0, 'vector mode must remain independent of authored resources');
  valid.renderer.dispose(); vector.renderer.dispose(); engine.dispose();
});

test('viewport culling preserves visible wolf limbs and death poses beyond all four screen edges', () => {
  const image = makeImage(), mock = rendererFixture(image), { engine, enemy } = fixture();
  const base = { ...engine.getSnapshot(), player: { ...engine.state.player, x: 900, y: 900 }, enemies: [], effects: [], projectiles: [], gems: [], damageNumbers: [] };
  mock.renderer.render(base, 0);
  const view = { ...mock.renderer._view }, radius = enemy.radius;
  const cases = [
    { name: 'live-right', state: 'attack', frameIndex: 4, x: view.right + 20, y: 900, facing: 0 },
    { name: 'live-left', state: 'attack', frameIndex: 4, x: view.left - 20, y: 900, facing: 0 },
    { name: 'live-below', state: 'attack', frameIndex: 6, x: 900, y: view.bottom + 30, facing: 0 },
    { name: 'live-above', state: 'attack', frameIndex: 3, x: 900, y: view.top - 8, facing: Math.PI },
    { name: 'death-right', state: 'death', frameIndex: 0, x: view.right + 20, y: 900, facing: 0 },
    { name: 'death-left', state: 'death', frameIndex: 0, x: view.left - 20, y: 900, facing: Math.PI },
    { name: 'death-below', state: 'death', frameIndex: 0, x: 900, y: view.bottom + 20, facing: 0 },
    { name: 'death-above', state: 'death', frameIndex: 3, x: 900, y: view.top - 8, facing: Math.PI },
  ];
  // The wolf's attacking silhouette extends beyond the generic live margin.
  // Its prone pose is narrower than the bear's: retain a genuine intersection
  // with this atlas, rather than copying a bear-only 33px death-edge fixture.
  assert.ok(20 > radius, 'live edge root must be outside its original collision body');
  assert.ok(20 > radius, 'death edge root must be outside its original collision body');
  for (const entry of cases) {
    const death = entry.state === 'death';
    const entity = { ...enemy, ...entry, animationState: entry.state, animationFrames: WOLF_FRAME_COUNTS[entry.state],
      ...(death ? { kind: 'death', enemyKind: 'normal', bodyRadius: radius, radius: radius * 1.25, ttl: .35, maxTtl: .42 } : {}) };
    const frame = wolfDrawFrame(image, entry.state, entry.frameIndex, radius), facing = entry.facing === 0 ? 1 : -1;
    const left = entity.x + (facing > 0 ? frame.dx : -frame.dx - frame.dw);
    const right = left + frame.dw, top = entity.y + frame.dy, bottom = top + frame.dh;
    assert.ok(entity.x < view.left || entity.x > view.right || entity.y < view.top || entity.y > view.bottom, `${entry.name} root must be outside the viewport`);
    assert.ok(right > view.left && left < view.right && bottom > view.top && top < view.bottom, `${entry.name} authored pixels must intersect the viewport`);
    const state = freeze({ ...base, enemies: death ? [] : [entity], effects: death ? [entity] : [] });
    const before = JSON.stringify(state); mock.reset(); mock.renderer.render(state, 0);
    const draws = mock.draws.filter(draw => draw.args[0] === image);
    assert.equal(draws.length, 1, `${entry.name} visible pose was prematurely culled`);
    assert.equal(mock.renderer.stats[death ? 'effects' : 'enemies'], 1);
    assert.equal(mock.renderer.stats[death ? 'culledEffects' : 'culledEnemies'], 0);
    assert.deepEqual(draws[0].args.slice(1, 5), [frame.x, frame.y, frame.w, frame.h]);
    assert.equal(JSON.stringify(state), before); assert.equal(mock.stack.length, 0);
  }
  for (const death of [false, true]) {
    const entity = { ...enemy, x: view.right + 200, y: 900,
      ...(death ? { kind: 'death', enemyKind: 'normal', bodyRadius: radius, radius: radius * 1.25, animationState: 'death', animationFrames: 4, ttl: .35, maxTtl: .42 } : {}) };
    mock.reset(); mock.renderer.render(freeze({ ...base, enemies: death ? [] : [entity], effects: death ? [entity] : [] }), 0);
    assert.equal(mock.draws.filter(draw => draw.args[0] === image).length, 0, 'truly offscreen wolves must remain culled');
    assert.equal(mock.renderer.stats[death ? 'culledEffects' : 'culledEnemies'], 1);
    assert.equal(mock.stack.length, 0);
  }
  engine.dispose(); mock.renderer.dispose();
});

test('wolf health bars and status badges clear all pose bounds without per-frame anchor jitter', () => {
  const image = makeImage(), mock = rendererFixture(image), { engine, enemy } = fixture();
  let boundChecks = 0;
  for (const radius of [7, 15, 30, 72]) for (const [state, count] of Object.entries(WOLF_FRAME_COUNTS)) {
    const target = { ...enemy, x: 100, y: 400, radius, hp: 50, maxHp: 100, animationState: state, animationFrames: count, stun: 1 };
    const y = mock.renderer._enemyHealthBarY(target, radius);
    close(y, target.y - radius * 3.35);
    for (let index = 0; index < count; index++) {
      target.frameIndex = index;
      const frame = wolfDrawFrame(image, state, index, radius);
      const barHeight = Math.max(3, Math.max(20, radius * 2.3) * .08);
      assert.ok(y + barHeight + 1 <= target.y + frame.dy, `${radius}/${state}/${index} bar overlaps crop`);
      close(mock.renderer._enemyHealthBarY(target, radius), y, 'stable full-atlas anchor');
      boundChecks++;
    }
    const badges = [];
    mock.renderer._drawStatusBadge = (_ctx, _descriptor, _x, badgeY, _width) => badges.push(badgeY);
    mock.renderer._drawStatusBadges(mock.ctx, [target], { x: -1000, y: -1000, radius: 18 });
    assert.equal(badges.length, 1); close(badges[0], y - 11);
  }
  assert.equal(boundChecks, 128);
  engine.dispose(); mock.renderer.dispose();
});

test('wolf/bear/tiger identities, images and pooled death records stay isolated across all six ordered pairs', () => {
  const companionImage = (variant, attach) => {
    const data = JSON.parse(fs.readFileSync(new URL(`../assets/enemy-${variant}-battle-v1-frames.json`, import.meta.url), 'utf8'));
    return attach({ complete: true, width: data.size[0], height: data.size[1] }, data);
  };
  const species = [
    { variant: 'wolf', id: WOLF_SPRITE_ID, matches: isBattleWolf, image: makeImage() },
    { variant: 'bear', id: BEAR_SPRITE_ID, matches: isBattleBear, image: companionImage('bear', attachBearFrames) },
    { variant: 'tiger', id: TIGER_SPRITE_ID, matches: isBattleTiger, image: companionImage('tiger', attachTigerFrames) },
  ];
  const images = Object.fromEntries(species.map(actor => [actor.variant, actor.image]));
  const recycledFields = ['battleSpriteId', 'facing', 'bodyRadius', 'enemyKind', 'variant', 'animationState', 'animationFrames', 'frameTime', 'frameIndex'];
  let pairs = 0;
  for (const source of species) for (const target of species) {
    if (source === target) continue;
    const { engine, enemy } = fixture({ variant: source.variant }), mock = rendererFixture(images.wolf);
    mock.renderer.enemyImages = { ...images };
    const next = engine.spawnEnemy('normal', 0, { name: target.variant, variant: target.variant });
    Object.assign(enemy, { facing: Math.PI, frameIndex: 2 });
    Object.assign(next, { x: 1020, y: 500, radius: 30, facing: 0, frameIndex: 2 });
    for (const [entity, expected] of [[enemy, source], [next, target]]) {
      assert.equal(entity.battleSpriteId, expected.id);
      assert.equal(battleEnemyAnimation(entity)?.variant, expected.variant);
      for (const other of species) assert.equal(other.matches(entity), other === expected);
      mock.reset(); mock.renderer._drawEnemy(mock.ctx, entity, engine.state.player, theme);
      assert.equal(mock.draws.length, 1); assert.equal(mock.draws[0].args[0], expected.image);
      assert.equal(mock.stack.length, 0);
    }
    for (const wrong of [{ ...enemy, battleSpriteId: target.id }, { ...next, battleSpriteId: source.id }]) {
      assert.equal(battleEnemyAnimation(wrong), null);
      mock.reset(); mock.renderer._drawEnemy(mock.ctx, wrong, engine.state.player, theme);
      assert.equal(mock.draws.length, 0, 'a mismatched species/art ID must retain vector fallback');
      assert.equal(battleEnemyAnimation({ ...wrong, kind: 'death', enemyKind: 'normal' }), null);
      assert.equal(mock.stack.length, 0);
    }
    // Swapping a fully attached companion image under the wrong key must not
    // silently draw a different species with the correct entity identity.
    mock.renderer.enemyImages[source.variant] = target.image;
    mock.reset(); mock.renderer._drawEnemy(mock.ctx, enemy, engine.state.player, theme);
    assert.equal(mock.draws.length, 0, 'an attached companion atlas is not a wolf/bear/tiger substitute');
    assert.equal(mock.stack.length, 0); mock.renderer.enemyImages[source.variant] = source.image;

    engine.killEnemy(enemy);
    const pooled = engine.state.effects.find(source.matches);
    assert.ok(pooled); assert.equal(pooled.facing, Math.PI); assert.equal(pooled.bodyRadius, 15);
    mock.reset(); mock.renderer._drawEffect(mock.ctx, pooled);
    assert.equal(mock.draws.length, 1); assert.equal(mock.draws[0].args[0], source.image);
    engine.updateEffects(.5);
    assert.equal(engine.state.effects.length, 0); assert.equal(engine.pools.effect.includes(pooled), true);
    engine.effect({ x: 1, y: 2, kind: 'impact', radius: 7, ttl: .01 });
    assert.equal(engine.state.effects.at(-1), pooled);
    for (const key of recycledFields) assert.equal(pooled[key], undefined, `impact retained ${source.variant} ${key}`);
    assert.equal(battleEnemyAnimation(pooled), null);
    engine.updateEffects(.02);

    engine.killEnemy(next);
    const nextDeath = engine.state.effects.find(target.matches);
    assert.equal(nextDeath, pooled, `${source.variant} -> ${target.variant} must exercise the same pooled object`);
    assert.equal(nextDeath.battleSpriteId, target.id);
    assert.equal(nextDeath.variant, target.variant); assert.equal(nextDeath.enemyKind, 'normal');
    assert.equal(nextDeath.facing, 0); assert.equal(nextDeath.bodyRadius, 30);
    assert.equal(nextDeath.frameIndex, 0); assert.equal(nextDeath.frameTime, 0);
    for (const other of species) assert.equal(other.matches(nextDeath), other === target);
    mock.reset(); mock.renderer._drawEffect(mock.ctx, nextDeath);
    assert.equal(mock.draws.length, 1); assert.equal(mock.draws[0].args[0], target.image);
    assert.equal(mock.stack.length, 0);
    engine.updateEffects(.5);

    // Even after an ordinary authored death, the reused record for the wolf
    // Boss must not retain a normal sprite ID, facing or body-radius payload.
    const boss = engine.spawnBoss(true, { name: '特处士', variant: 'wolf' });
    engine.killEnemy(boss);
    const bossDeath = engine.state.effects.find(effect => effect.kind === 'death' && effect.enemyKind === 'boss');
    assert.equal(bossDeath, pooled); assert.equal(bossDeath.variant, 'wolf');
    for (const key of ['battleSpriteId', 'facing', 'bodyRadius']) assert.equal(bossDeath[key], undefined);
    assert.equal(battleEnemyAnimation(bossDeath), null);
    mock.reset(); mock.renderer._drawEffect(mock.ctx, bossDeath);
    assert.equal(mock.draws.length, 0, '特处士 must never inherit the ordinary wolf death sheet through pooling');
    assert.equal(mock.stack.length, 0);
    assert.equal(engine.poolStats.created.effect, 1);
    assert.ok(engine.poolStats.reused.effect >= 3);
    engine.dispose(); mock.renderer.dispose(); pairs++;
  }
  assert.equal(pairs, 6);
});

let failures = 0;
for (const { name, run } of tests) {
  try { run(); console.log(`PASS ${name}`); }
  catch (error) { failures += 1; console.error(`FAIL ${name}\n${error.stack}`); }
}
if (failures) process.exitCode = 1;
else {
  const report = {
    ok: true, generatedAt: new Date().toISOString(),
    tests: tests.length, testNames: tests.map(({ name }) => name),
    atlasFrames: 32, mirroredCanvasChecks: 64,
    healthBarBounds: { checks: 128, radii: [7, 15, 30, 72], stableRadiusOffset: 3.35 },
    crossSpecies: { variants: ['wolf', 'bear', 'tiger'], orderedPairs: 6, pooledBossExclusion: '特处士' },
    viewportEdgeChecks: { visibleOutsideRoots: 8, fullyOffscreenRejected: 2 },
    runtime: { kind: 'Node.js with deterministic Canvas mock', nodeVersion: process.version },
    boundary: { realBrowser: false, pixelRendering: false, gpuPerformance: false, wechatDevice: false },
    note: 'Node/Canvas mock only; this verifies simulation and Canvas calls, not decoded browser pixels, GPU performance or WeChat-device behavior. Real-browser evidence is a separate gate.',
  };
  const output = new URL('../../evidence/current/wolf/', import.meta.url);
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(new URL('engine-runtime.json', output), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
}


