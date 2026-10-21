import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { GameEngine } from '../src/engine.js';
import { GameRenderer } from '../src/renderer.js';
import { BALANCE } from '../src/content.js';
import { battleEnemyAnimation, battleEnemySpriteId } from '../src/battle-enemy-animation.js';
import {
  DEER_SPRITE_ID, DEER_FRAME_COUNTS, DEER_FPS,
  isBattleDeer, attachDeerFrames, deerDrawFrame,
} from '../src/deer-animation.js';

// Deterministic Node/Canvas-mock gate. This checks the real, irregular PNG
// atlas and runtime crop contract; it is not browser, GPU, mobile FPS or
// final animation-quality evidence.
const contract = JSON.parse(fs.readFileSync(new URL('../assets/enemy-deer-battle-v1-frames.json', import.meta.url), 'utf8'));
const sheetBytes = fs.readFileSync(new URL('../assets/enemy-deer-battle-v1-sheet.png', import.meta.url));
const tests = [];
const test = (name, run) => tests.push({ name, run });
const ids = count => Array.from({ length: count }, (_, index) => index);
const close = (actual, expected, label = '') => assert.ok(Math.abs(actual - expected) < 1e-7, `${label}: expected ${expected}, got ${actual}`);
const copy = value => structuredClone(value);
const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value); Object.values(value).forEach(freeze);
  }
  return value;
};
const makeImage = (data = contract) => attachDeerFrames({
  complete: true, width: contract.size[0], height: contract.size[1],
  naturalWidth: contract.size[0], naturalHeight: contract.size[1],
}, data);

function fixture({ stageId = 1, tagged = true, x = 980, y = 500, speed = 42 } = {}) {
  const events = [];
  const engine = new GameEngine({ stageId, seed: 790, debug: true, onEvent: event => events.push(event) });
  engine.state.skills = [];
  engine.spawnAccumulator = -100000;
  Object.assign(engine.state.player, { x: 900, y: 500, hp: 10000, maxHp: 10000 });
  const enemy = engine.spawnEnemy('normal', 0, { name: '鹿妖', variant: 'deer' });
  Object.assign(enemy, { x, y, speed, radius: 15, hp: 100000, maxHp: 100000, damage: 20 });
  if (!tagged) delete enemy.battleSpriteId;
  return { engine, enemy, events };
}

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
    calls.push({ op, args });
  };
  for (const op of ['beginPath', 'closePath', 'moveTo', 'lineTo', 'quadraticCurveTo', 'bezierCurveTo', 'arc', 'fill', 'stroke', 'fillRect', 'strokeRect', 'clearRect', 'fillText', 'strokeText', 'clip']) ctx[op] = (...args) => record(op, args);
  ctx.save = () => { record('save', []); stack.push({ matrix: [...matrix], alpha: ctx.globalAlpha }); };
  ctx.restore = () => { record('restore', []); const state = stack.pop(); assert.ok(state, 'unbalanced Canvas restore'); matrix = state.matrix; ctx.globalAlpha = state.alpha; };
  ctx.setTransform = (...args) => { record('setTransform', args); matrix = [...args]; };
  ctx.translate = (x, y) => { record('translate', [x, y]); matrix = multiply(matrix, [1, 0, 0, 1, x, y]); };
  ctx.scale = (x, y) => { record('scale', [x, y]); matrix = multiply(matrix, [x, 0, 0, y, 0, 0]); };
  ctx.rotate = angle => { record('rotate', [angle]); matrix = multiply(matrix, [Math.cos(angle), Math.sin(angle), -Math.sin(angle), Math.cos(angle), 0, 0]); };
  ctx.drawImage = (...args) => { record('drawImage', args); draws.push({ args, matrix: [...matrix], alpha: ctx.globalAlpha }); };
  ctx.measureText = text => ({ width: String(text).length * 8 });
  const canvas = { width: 0, height: 0, getContext: () => ctx };
  return { canvas, ctx, calls, draws, stack, reset() { calls.length = 0; draws.length = 0; } };
}

const theme = { ink: '#071b24', accent: '#f44a48', sticker: '#ffe84e' };
const rendererFixture = image => {
  const mock = mockCanvas();
  const renderer = new GameRenderer(mock.canvas, { width: 390, height: 844, showHud: false, battleArtMode: 'authoredFrames', enemyImages: image ? { deer: image } : {} });
  return { ...mock, renderer };
};

test('real deer PNG and JSON retain 32 distinct measured crops', () => {
  assert.equal(DEER_SPRITE_ID, 'deer-normal-v1');
  assert.deepEqual(DEER_FRAME_COUNTS, { idle: 8, move: 8, attack: 8, hit: 4, death: 4 });
  assert.deepEqual(DEER_FPS, { idle: 8, move: 12, attack: 16, hit: 16, death: 10 });
  assert.deepEqual([...sheetBytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.deepEqual([sheetBytes.readUInt32BE(16), sheetBytes.readUInt32BE(20)], contract.size);
  assert.equal(createHash('sha256').update(sheetBytes).digest('hex'), contract.sha256);
  assert.equal(contract.sha256, '721ce755d768daca09100f7346c0f1eab6a46f2a4f1aa0ce5b0cc0def33e621e', 'reuse the measured deer PNG unchanged');
  assert.equal(contract.referenceBodyHeight, 205);
  assert.deepEqual(contract.previewRootXs, [111, 333, 554, 776, 998, 1220, 1441, 1663]);
  assert.deepEqual(contract.previewBaselines, [220, 438, 660, 872]);
  assert.deepEqual({ stageId: contract.identity.stageId, kind: contract.identity.kind, variant: contract.identity.variant }, { stageId: 1, kind: 'normal', variant: 'deer' });
  const before = JSON.stringify(contract), image = makeImage(freeze(copy(contract))), used = [], crops = new Set();
  assert.equal(image.__deerBattleSprite, true); assert.equal(image.__prioritySprite, true);
  for (const [state, count] of Object.entries(DEER_FRAME_COUNTS)) {
    assert.equal(contract.states[state].length, count);
    for (let frameIndex = 0; frameIndex < count; frameIndex += 1) {
      const index = contract.states[state][frameIndex], rect = contract.sourceRects[index]; used.push(index); crops.add([rect.x, rect.y, rect.w, rect.h].join(','));
      for (const radius of [7, 15, 30, 72]) {
        const frame = deerDrawFrame(image, state, frameIndex, radius), scale = radius * 3.2 / 205;
        assert.deepEqual([frame.x, frame.y, frame.w, frame.h], [rect.x, rect.y, rect.w, rect.h]);
        close(frame.dw / rect.w, scale); close(frame.dh / rect.h, scale);
        close(frame.dx, (rect.x - contract.previewRootXs[index % 8]) * scale);
        close(frame.dy, radius * .7 + (rect.y - contract.previewBaselines[Math.floor(index / 8)]) * scale);
      }
    }
  }
  assert.deepEqual(used, ids(32)); assert.equal(crops.size, 32); assert.equal(JSON.stringify(contract), before);
  assert.deepEqual(deerDrawFrame(image, 'move', 8, 15), deerDrawFrame(image, 'move', 0, 15));
  assert.deepEqual(deerDrawFrame(image, 'idle', 8, 15), deerDrawFrame(image, 'idle', 0, 15));
  for (const state of ['attack', 'hit', 'death']) assert.deepEqual(deerDrawFrame(image, state, 100, 15), deerDrawFrame(image, state, DEER_FRAME_COUNTS[state] - 1, 15));
  assert.deepEqual(deerDrawFrame(image, 'stun', 3, 15), deerDrawFrame(image, 'hit', 3, 15));
  assert.equal(deerDrawFrame(null, 'move', 0, 15), null);
});

test('invalid dimensions, ordering, anchors and crops are rejected', () => {
  assert.throws(() => attachDeerFrames({ width: 8, height: 4 }, contract), /Invalid/);
  for (const mutate of [
    data => { data.states.move[0] = 0; }, data => { data.sourceRects[31].x = data.size[0]; },
    data => { data.previewBaselines[3] = NaN; }, data => { data.sourceRects[0].w = 0; },
    data => { data.referenceBodyHeight = 136; }, data => { data.previewRootXs.pop(); },
  ]) { const invalid = copy(contract); mutate(invalid); assert.throws(() => makeImage(invalid), /Invalid/); }
});

test('every crop contains its independent PNG alpha bounds and excludes neighboring poses', () => {
  const audit = JSON.parse(fs.readFileSync(new URL('../../evidence/current/deer/asset-preflight.json', import.meta.url), 'utf8'));
  assert.equal(audit.result, 'PASS');
  assert.equal(audit.sha256, createHash('sha256').update(sheetBytes).digest('hex'));
  assert.equal(audit.frames.length, 32);
  assert.ok(Object.values(audit.checks).every(Boolean));
  for (const frame of audit.frames) {
    const r = contract.sourceRects[frame.index], a = frame.rect;
    assert.equal(r.state, frame.state);
    assert.deepEqual([r.x, r.y, r.w, r.h], [a.x - 2, a.y - 2, a.w + 4, a.h + 4], `crop ${frame.index} must contain the whole measured pose plus padding`);
    for (const other of audit.frames) if (other.index !== frame.index) {
      const b = other.rect;
      assert.ok(r.x + r.w <= b.x || b.x + b.w <= r.x || r.y + r.h <= b.y || b.y + b.h <= r.y, `crop ${frame.index} intersects pose ${other.index}`);
    }
  }
});

test('only the left-facing authored idle-7 source is normalized before actor-facing mirroring', () => {
  const image = makeImage();
  for (const [state, count] of Object.entries(DEER_FRAME_COUNTS)) for (let index = 0; index < count; index++) {
    assert.equal(deerDrawFrame(image, state, index, 15).mirrorX, state === 'idle' && index === 7);
  }
  assert.equal(deerDrawFrame(image, 'idle', 15, 15).mirrorX, true);
  assert.equal(deerDrawFrame(image, 'idle', 16, 15).mirrorX, false);
});

test('only first-stage normal deer acquire the art identity', () => {
  const { engine, enemy } = fixture();
  assert.equal(enemy.battleSpriteId, DEER_SPRITE_ID); assert.equal(isBattleDeer(enemy), true);
  assert.equal(battleEnemySpriteId(1, 'normal', 'deer'), DEER_SPRITE_ID);
  for (const stageId of [0, 2, 81, '1', undefined]) assert.notEqual(battleEnemySpriteId(stageId, 'normal', 'deer'), DEER_SPRITE_ID);
  for (const kind of ['elite', 'boss', 'death', undefined]) assert.notEqual(battleEnemySpriteId(1, kind, 'deer'), DEER_SPRITE_ID);
  const elite = engine.spawnEnemy('elite', 0, { name: '鹿妖精英', variant: 'deer' });
  const boss = engine.spawnBoss(true, { name: '鹿妖王', variant: 'deer' });
  for (const other of [elite, boss]) { assert.notEqual(other.battleSpriteId, DEER_SPRITE_ID); assert.equal(isBattleDeer(other), false); }
  for (const impostor of [{ ...enemy, battleSpriteId: undefined }, { ...enemy, variant: 'tiger' }, { ...elite, battleSpriteId: DEER_SPRITE_ID }, { ...boss, battleSpriteId: DEER_SPRITE_ID }, { ...enemy, kind: 'death', enemyKind: 'elite' }, { ...enemy, kind: 'death' }, null, {}]) assert.equal(isBattleDeer(impostor), false);
  assert.equal(isBattleDeer({ ...enemy, kind: 'death', enemyKind: 'normal' }), true);
  engine.dispose();
});

test('idle and move clocks independently traverse all eight frames', () => {
  const { engine, enemy } = fixture();
  for (const state of ['idle', 'move']) {
    engine.setAnimation(enemy, state); const seen = new Set();
    for (let i = 0; i < 180; i += 1) { engine.stepEnemyAnimation(enemy, state, 1 / 120, 99); assert.equal(enemy.animationFrames, 8); seen.add(enemy.frameIndex); }
    assert.deepEqual([...seen].sort((a, b) => a - b), ids(8));
  }
  engine.dispose();
});

test('natural contact preserves gameplay while showing all attack frames', () => {
  const authored = fixture(), control = fixture({ tagged: false }); const frames = new Set(); let firstAttackAt = null;
  for (let i = 0; i < 400; i += 1) {
    authored.engine.update(1 / 120); control.engine.update(1 / 120);
    assert.deepEqual(gameplaySnapshot(authored.engine), gameplaySnapshot(control.engine), `gameplay diverged on tick ${i}`);
    if (authored.enemy.animationState === 'attack') { if (firstAttackAt === null) firstAttackAt = authored.engine.state.time; assert.equal(authored.enemy.animationFrames, 8); if (authored.engine.state.time - firstAttackAt < .49) frames.add(authored.enemy.frameIndex); }
  }
  assert.ok(firstAttackAt > 0); assert.deepEqual([...frames].sort((a, b) => a - b), ids(8));
  assert.equal(authored.engine.rng(), control.engine.rng()); authored.engine.dispose(); control.engine.dispose();
});

test('pause freezes authored attack/hit/death clocks and resume advances them', () => {
  for (const state of ['attack', 'hit', 'death']) {
    const { engine, enemy } = fixture({ x: state === 'attack' ? 932 : 980 }); engine.update(.01);
    if (state === 'hit') engine.damageEnemy(enemy, 1); if (state === 'death') engine.damageEnemy(enemy, enemy.hp);
    const entity = state === 'death' ? engine.state.effects.find(isBattleDeer) : enemy; assert.equal(entity.animationState, state);
    engine.pause(); const paused = engine.getSnapshot(), frameTime = entity.frameTime;
    for (let i = 0; i < 12; i += 1) engine.update(.05, { x: 1 }); assert.deepEqual(engine.getSnapshot(), paused);
    engine.resume(); engine.update(.05); assert.ok(entity.frameTime > frameTime); engine.dispose();
  }
});

test('death retains deer identity once, expires and clears pooled fields', () => {
  const { engine, enemy } = fixture(); enemy.facing = Math.PI; const radius = enemy.radius; engine.damageEnemy(enemy, enemy.hp);
  const death = engine.state.effects.find(isBattleDeer); assert.ok(death); assert.equal(death.animationFrames, 4); assert.equal(death.facing, Math.PI); assert.equal(death.bodyRadius, radius); assert.equal(death.maxTtl, .42);
  const seen = new Set(); while (engine.state.effects.includes(death)) { seen.add(death.frameIndex); engine.updateEffects(1 / 120); }
  assert.deepEqual([...seen], ids(4)); assert.equal(engine.pools.effect.includes(death), true);
  engine.effect({ x: 1, y: 2, kind: 'impact', radius: 8, ttl: .01 }); const reused = engine.state.effects.at(-1); assert.equal(reused, death);
  for (const key of ['battleSpriteId', 'facing', 'bodyRadius', 'enemyKind', 'variant', 'animationState', 'animationFrames', 'frameTime', 'frameIndex']) assert.equal(reused[key], undefined, `recycled impact retained deer ${key}`);
  assert.equal(isBattleDeer(reused), false); engine.updateEffects(.05); engine.dispose(); assert.ok(engine.poolStats.released.effect >= 2); assert.ok(engine.pools.effect.length <= BALANCE.maxEffects);
});

test('renderer draws every crop in both directions without synthetic rotation', () => {
  const image = makeImage(), mock = rendererFixture(image), { engine, enemy } = fixture(); let checked = 0;
  for (const [state, count] of Object.entries(DEER_FRAME_COUNTS)) for (let frameIndex = 0; frameIndex < count; frameIndex += 1) for (const facing of [0, Math.PI]) {
    const entity = freeze({ ...enemy, x: 120, y: 220, facing, animationState: state, frameIndex, animationFrames: count, ...(state === 'death' ? { kind: 'death', enemyKind: 'normal', bodyRadius: enemy.radius, radius: enemy.radius * 1.25, ttl: .35, maxTtl: .42 } : {}) });
    mock.reset(); if (state === 'death') mock.renderer._drawEffect(mock.ctx, entity); else mock.renderer._drawEnemy(mock.ctx, entity, engine.state.player, theme);
    assert.equal(mock.draws.length, 1, `${state}:${frameIndex} must draw one deer crop`); const frame = deerDrawFrame(image, state, frameIndex, enemy.radius);
    assert.equal(mock.draws[0].args[0], image); assert.deepEqual(mock.draws[0].args.slice(1), [frame.x, frame.y, frame.w, frame.h, frame.dx, frame.dy, frame.dw, frame.dh]);
    [(facing === 0 ? 1 : -1) * (frame.mirrorX ? -1 : 1), 0, 0, 1, entity.x, entity.y].forEach((value, index) => close(mock.draws[0].matrix[index], value, 'only translation and source/actor mirror are permitted'));
    assert.equal(mock.calls.some(call => call.op === 'rotate'), false); assert.equal(mock.stack.length, 0); checked += 1;
  }
  assert.equal(checked, 64); engine.dispose(); mock.renderer.dispose();
});

test('renderer rejects untagged, elite and Boss deer and falls back safely', () => {
  const image = makeImage(), { engine, enemy } = fixture(), valid = rendererFixture(image);
  for (const other of [{ ...enemy, battleSpriteId: undefined }, { ...enemy, variant: 'tiger' }, { ...enemy, kind: 'elite' }, { ...enemy, kind: 'boss' }]) { valid.reset(); valid.renderer._drawEnemy(valid.ctx, freeze(other), engine.state.player, theme); assert.equal(valid.draws.length, 0); assert.ok(valid.calls.some(call => call.op === 'fill')); assert.equal(valid.stack.length, 0); }
  for (const missing of [undefined, { complete: false, naturalWidth: 0, naturalHeight: 0, width: 0, height: 0 }, { complete: true, width: 1774, height: 887 }]) { const fallback = rendererFixture(missing); fallback.renderer._drawEnemy(fallback.ctx, freeze({ ...enemy }), engine.state.player, theme); assert.equal(fallback.draws.length, 0); fallback.renderer.dispose(); }
  valid.renderer.dispose(); engine.dispose();
});

let failures = 0;
for (const { name, run } of tests) { try { run(); console.log(`PASS ${name}`); } catch (error) { failures += 1; console.error(`FAIL ${name}\n${error.stack}`); } }
if (failures) process.exitCode = 1;
else {
  const report = { ok: true, generatedAt: new Date().toISOString(), tests: tests.length, atlasFrames: 32, mirroredCanvasChecks: 64, runtime: { kind: 'Node.js with deterministic Canvas mock', nodeVersion: process.version }, boundary: { realBrowser: false, pixelRendering: false, gpuPerformance: false, wechatDevice: false }, note: 'Node/Canvas mock only; real-browser evidence is a separate gate.' };
  const output = new URL('../../evidence/current/deer/', import.meta.url); fs.mkdirSync(output, { recursive: true }); fs.writeFileSync(new URL('engine-runtime.json', output), `${JSON.stringify(report, null, 2)}\n`); console.log(JSON.stringify(report, null, 2));
}
