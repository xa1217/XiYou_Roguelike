import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { GameEngine } from '../src/engine.js';
import { GameRenderer } from '../src/renderer.js';
import { BALANCE } from '../src/content.js';
import { TIGER_SPRITE_ID, attachTigerFrames, isBattleTiger } from '../src/tiger-animation.js';
import { battleEnemyAnimation } from '../src/battle-enemy-animation.js';
import {
  BEAR_SPRITE_ID, BEAR_FRAME_COUNTS, BEAR_FPS,
  isBattleBear, attachBearFrames, bearDrawFrame,
} from '../src/bear-animation.js';

// This is a deterministic Node/Canvas-mock gate, not browser or GPU evidence.
// Read the real, irregular atlas contract; a synthetic evenly divided sheet
// would conceal cropping and per-pose stretch regressions.
const contract = JSON.parse(fs.readFileSync(new URL('../assets/enemy-bear-battle-v1-frames.json', import.meta.url), 'utf8'));
const sheetBytes = fs.readFileSync(new URL('../assets/enemy-bear-battle-v1-sheet.png', import.meta.url));
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
const makeImage = (data = contract) => attachBearFrames({
  complete: true, width: contract.size[0], height: contract.size[1],
  naturalWidth: contract.size[0], naturalHeight: contract.size[1],
}, data);

function fixture({ stageId = 1, tagged = true, x = 980, y = 500, speed = 42 } = {}) {
  const events = [];
  const engine = new GameEngine({ stageId, seed: 790, debug: true, onEvent: event => events.push(event) });
  // Isolate one enemy while preserving the actual update/contact/damage path.
  engine.state.skills = [];
  engine.spawnAccumulator = -100000;
  Object.assign(engine.state.player, { x: 900, y: 500, hp: 10000, maxHp: 10000 });
  const enemy = engine.spawnEnemy('normal', 0, { name: '熊妖', variant: 'bear' });
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
  const renderer = new GameRenderer(mock.canvas, { width: 390, height: 844, showHud: false, battleArtMode: mode, enemyImages: image ? { bear: image } : {} });
  return { ...mock, renderer };
}
const drawArgs = frame => [frame.x, frame.y, frame.w, frame.h, frame.dx, frame.dy, frame.dw, frame.dh];

test('real PNG and JSON specify 32 distinct explicit crops at one source-pixel scale', () => {
  assert.equal(BEAR_SPRITE_ID, 'bear-normal-v1');
  assert.deepEqual(BEAR_FRAME_COUNTS, { idle: 8, move: 8, attack: 8, hit: 4, death: 4 });
  assert.deepEqual(BEAR_FPS, { idle: 8, move: 12, attack: 16, hit: 16, death: 10 });
  assert.deepEqual([...sheetBytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.deepEqual([sheetBytes.readUInt32BE(16), sheetBytes.readUInt32BE(20)], contract.size);
  assert.equal(createHash('sha256').update(sheetBytes).digest('hex'), contract.sha256);
  const before = JSON.stringify(contract), image = makeImage(freeze(copy(contract)));
  assert.equal(image.__bearBattleSprite, true);
  assert.equal(image.__prioritySprite, true);
  const used = [], crops = new Set();
  for (const [state, count] of Object.entries(BEAR_FRAME_COUNTS)) {
    assert.equal(contract.states[state].length, count);
    for (let frameIndex = 0; frameIndex < count; frameIndex += 1) {
      const index = contract.states[state][frameIndex], rect = contract.sourceRects[index];
      used.push(index); crops.add([rect.x, rect.y, rect.w, rect.h].join(','));
      for (const radius of [15, 30]) {
        const result = bearDrawFrame(image, state, frameIndex, radius), scale = radius * 3.2 / 136;
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
  assert.deepEqual(bearDrawFrame(image, 'move', 8, 15), bearDrawFrame(image, 'move', 0, 15), 'walk loops');
  assert.deepEqual(bearDrawFrame(image, 'idle', 8, 15), bearDrawFrame(image, 'idle', 0, 15), 'idle loops');
  for (const state of ['attack', 'hit', 'death']) {
    assert.deepEqual(bearDrawFrame(image, state, 100, 15), bearDrawFrame(image, state, BEAR_FRAME_COUNTS[state] - 1, 15), `${state} holds its final pose`);
  }
  assert.deepEqual(bearDrawFrame(image, 'stun', 3, 15), bearDrawFrame(image, 'hit', 3, 15));
  assert.equal(bearDrawFrame(null, 'move', 0, 15), null);
});

test('invalid dimensions, duplicate frame order and out-of-bounds rectangles are rejected', () => {
  assert.throws(() => attachBearFrames({ width: 8, height: 4 }, contract), /Invalid/);
  for (const mutate of [
    data => { data.states.move[0] = 0; },
    data => { data.sourceRects[31].x = data.size[0]; },
    data => { data.previewBaselines[3] = NaN; },
    data => { data.sourceRects[0].w = 0; },
  ]) {
    const invalid = copy(contract); mutate(invalid);
    assert.throws(() => makeImage(invalid), /Invalid/);
  }
});

test('only first-stage normal bears acquire the art identity, including retained death identity', () => {
  const { engine, enemy } = fixture();
  assert.equal(enemy.battleSpriteId, BEAR_SPRITE_ID); assert.equal(isBattleBear(enemy), true);
  const elite = engine.spawnEnemy('elite', 0, { name: '熊妖精英', variant: 'bear' });
  const boss = engine.spawnBoss(true, { name: '熊山君', variant: 'bear' });
  const tiger = engine.spawnEnemy('normal', 0, { name: '虎妖', variant: 'tiger' });
  const later = fixture({ stageId: 2 });
  for (const other of [elite, boss, tiger, later.enemy]) {
    assert.notEqual(other.battleSpriteId, BEAR_SPRITE_ID);
    assert.equal(isBattleBear(other), false);
  }
  for (const impostor of [
    { ...enemy, battleSpriteId: undefined }, { ...enemy, variant: 'tiger' },
    { ...elite, battleSpriteId: BEAR_SPRITE_ID }, { ...boss, battleSpriteId: BEAR_SPRITE_ID },
    { ...enemy, kind: 'death', enemyKind: 'elite' }, { ...enemy, kind: 'death', enemyKind: 'boss' },
    { ...enemy, kind: 'death' },
  ]) assert.equal(isBattleBear(impostor), false, 'variant/name or a copied art ID alone is insufficient');
  assert.equal(isBattleBear({ ...enemy, kind: 'death', enemyKind: 'normal' }), true);
  engine.dispose(); later.engine.dispose();
});

test('ordinary bear idle and walk independently traverse all eight frames and loop', () => {
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

test('pause freezes bear attack, hit and retained death clocks; resume advances them', () => {
  for (const state of ['attack', 'hit', 'death']) {
    const { engine, enemy } = fixture({ x: state === 'attack' ? 932 : 980 });
    engine.update(.01);
    if (state === 'hit') engine.damageEnemy(enemy, 1);
    if (state === 'death') engine.damageEnemy(enemy, enemy.hp);
    const entity = state === 'death' ? engine.state.effects.find(isBattleBear) : enemy;
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
    const death = engine.state.effects.find(isBattleBear);
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
      assert.equal(reused[key], undefined, `recycled impact retained bear ${key}`);
    }
    assert.equal(isBattleBear(reused), false);
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
  for (const [state, count] of Object.entries(BEAR_FRAME_COUNTS)) {
    for (let frameIndex = 0; frameIndex < count; frameIndex += 1) {
      for (const facing of [0, Math.PI]) {
        const entity = freeze({ ...enemy, x: 120, y: 220, facing, animationState: state, frameIndex, animationFrames: count,
          ...(state === 'death' ? { kind: 'death', enemyKind: 'normal', bodyRadius: enemy.radius, radius: enemy.radius * 1.25, ttl: .35, maxTtl: .42 } : {}) });
        const before = JSON.stringify(entity); mock.reset(); mock.renderer.elapsed = 17.3;
        if (state === 'death') mock.renderer._drawEffect(mock.ctx, entity);
        else mock.renderer._drawEnemy(mock.ctx, entity, engine.state.player, theme);
        assert.equal(mock.draws.length, 1, `${state}:${frameIndex} must draw exactly one bear crop`);
        const [draw] = mock.draws, expected = bearDrawFrame(image, state, frameIndex, enemy.radius);
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

test('renderer rejects elite/Boss/untagged identities and falls back safely when the bear sheet is absent', () => {
  const image = makeImage(), { engine, enemy } = fixture();
  const valid = rendererFixture(image);
  for (const other of [
    { ...enemy, battleSpriteId: undefined }, { ...enemy, variant: 'tiger' },
    { ...enemy, kind: 'elite', name: '熊妖精英' }, { ...enemy, kind: 'boss', name: '熊山君' },
  ]) {
    valid.reset(); valid.renderer._drawEnemy(valid.ctx, freeze(other), engine.state.player, theme);
    assert.equal(valid.draws.length, 0, `${other.name}/${other.kind} must not use the ordinary bear atlas`);
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

test('viewport culling preserves visible bear limbs and death poses beyond all four screen edges', () => {
  const image = makeImage(), mock = rendererFixture(image), { engine, enemy } = fixture();
  const base = { ...engine.getSnapshot(), player: { ...engine.state.player, x: 900, y: 900 }, enemies: [], effects: [], projectiles: [], gems: [], damageNumbers: [] };
  mock.renderer.render(base, 0);
  const view = { ...mock.renderer._view }, radius = enemy.radius;
  const cases = [
    { name: 'live-right', state: 'attack', frameIndex: 4, x: view.right + 25, y: 900, facing: 0 },
    { name: 'live-left', state: 'attack', frameIndex: 4, x: view.left - 30, y: 900, facing: 0 },
    { name: 'live-below', state: 'attack', frameIndex: 6, x: 900, y: view.bottom + 30, facing: 0 },
    { name: 'live-above', state: 'attack', frameIndex: 3, x: 900, y: view.top - 8, facing: Math.PI },
    { name: 'death-right', state: 'death', frameIndex: 3, x: view.right + 33, y: 900, facing: 0 },
    { name: 'death-left', state: 'death', frameIndex: 3, x: view.left - 33, y: 900, facing: Math.PI },
    { name: 'death-below', state: 'death', frameIndex: 0, x: 900, y: view.bottom + 20, facing: 0 },
    { name: 'death-above', state: 'death', frameIndex: 3, x: 900, y: view.top - 8, facing: Math.PI },
  ];
  // These side fixtures would have been rejected by the generic body/burst
  // bounds even though the authored hand, tail or prone body is still visible.
  assert.ok(25 > radius * 1.35 + 4, 'live edge fixture must exceed the old horizontal margin');
  assert.ok(33 > radius * 1.25 * 1.4 + 6, 'death edge fixture must exceed the old effect margin');
  for (const entry of cases) {
    const death = entry.state === 'death';
    const entity = { ...enemy, ...entry, animationState: entry.state, animationFrames: BEAR_FRAME_COUNTS[entry.state],
      ...(death ? { kind: 'death', enemyKind: 'normal', bodyRadius: radius, radius: radius * 1.25, ttl: .35, maxTtl: .42 } : {}) };
    const frame = bearDrawFrame(image, entry.state, entry.frameIndex, radius), facing = entry.facing === 0 ? 1 : -1;
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
    assert.equal(mock.draws.filter(draw => draw.args[0] === image).length, 0, 'truly offscreen bears must remain culled');
    assert.equal(mock.renderer.stats[death ? 'culledEffects' : 'culledEnemies'], 1);
    assert.equal(mock.stack.length, 0);
  }
  engine.dispose(); mock.renderer.dispose();
});

test('bear health bars and status badges clear all pose bounds without per-frame anchor jitter', () => {
  const image = makeImage(), mock = rendererFixture(image), { engine, enemy } = fixture();
  let boundChecks = 0;
  for (const radius of [7, 15, 30, 72]) for (const [state, count] of Object.entries(BEAR_FRAME_COUNTS)) {
    const target = { ...enemy, x: 100, y: 400, radius, hp: 50, maxHp: 100, animationState: state, animationFrames: count, stun: 1 };
    const y = mock.renderer._enemyHealthBarY(target, radius);
    close(y, target.y - radius * 3.4);
    for (let index = 0; index < count; index++) {
      target.frameIndex = index;
      const frame = bearDrawFrame(image, state, index, radius);
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

test('bear and tiger identities, images and pooled death records cannot cross species', () => {
  const tigerContract = JSON.parse(fs.readFileSync(new URL('../assets/enemy-tiger-battle-v1-frames.json', import.meta.url), 'utf8'));
  const tigerImage = attachTigerFrames({ complete: true, width: 1774, height: 887 }, tigerContract);
  const bearImage = makeImage(), { engine, enemy } = fixture(), mock = rendererFixture(bearImage);
  mock.renderer.enemyImages.tiger = tigerImage;
  const tiger = engine.spawnEnemy('normal', 0, { name: '虎妖', variant: 'tiger' });
  for (const actor of [enemy, tiger]) {
    mock.reset(); mock.renderer._drawEnemy(mock.ctx, actor, engine.state.player, theme);
    assert.equal(mock.draws.length, 1);
    assert.equal(mock.draws[0].args[0], actor === enemy ? bearImage : tigerImage);
  }
  for (const wrong of [{ ...enemy, battleSpriteId: TIGER_SPRITE_ID }, { ...tiger, battleSpriteId: BEAR_SPRITE_ID }]) {
    assert.equal(battleEnemyAnimation(wrong), null);
    mock.reset(); mock.renderer._drawEnemy(mock.ctx, wrong, engine.state.player, theme);
    assert.equal(mock.draws.length, 0);
  }
  enemy.facing = Math.PI; engine.killEnemy(enemy);
  const pooled = engine.state.effects.find(isBattleBear);
  engine.updateEffects(.5);
  engine.effect({ x: 1, y: 2, kind: 'impact', radius: 7, ttl: .01 });
  assert.equal(engine.state.effects.at(-1), pooled);
  assert.equal(battleEnemyAnimation(pooled), null);
  engine.updateEffects(.02);
  tiger.facing = 0; engine.killEnemy(tiger);
  const tigerDeath = engine.state.effects.find(isBattleTiger);
  assert.equal(tigerDeath, pooled);
  assert.equal(tigerDeath.battleSpriteId, TIGER_SPRITE_ID);
  assert.equal(tigerDeath.facing, 0); assert.equal(tigerDeath.bodyRadius, tiger.radius);
  assert.equal(isBattleBear(tigerDeath), false);
  engine.dispose(); mock.renderer.dispose();
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
    viewportEdgeChecks: { visibleOutsideRoots: 8, fullyOffscreenRejected: 2 },
    runtime: { kind: 'Node.js with deterministic Canvas mock', nodeVersion: process.version },
    boundary: { realBrowser: false, pixelRendering: false, gpuPerformance: false, wechatDevice: false },
    note: 'Node/Canvas mock only; this verifies simulation and Canvas calls, not decoded browser pixels, GPU performance or WeChat-device behavior. Real-browser evidence is a separate gate.',
  };
  const output = new URL('../../evidence/current/bear/', import.meta.url);
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(new URL('engine-runtime.json', output), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
}
