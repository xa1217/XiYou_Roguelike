import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { GameEngine } from '../src/engine.js';
import { GameRenderer } from '../src/renderer.js';
import { battleEnemyAnimation, battleEnemySpriteId } from '../src/battle-enemy-animation.js';
import {
  HAWK_SPRITE_ID, HAWK_FRAME_COUNTS, HAWK_FPS,
  isBattleHawk, attachHawkFrames, hawkDrawFrame,
} from '../src/hawk-animation.js';

// Deterministic Node/Canvas gate for the measured ordinary-hawk atlas. This
// proves the real crops, identity isolation and renderer draw contract; it is
// not a browser, GPU, mobile-FPS or final-animation-quality approval.
const contract = JSON.parse(fs.readFileSync(new URL('../assets/enemy-hawk-battle-v1-frames.json', import.meta.url), 'utf8'));
const sheetBytes = fs.readFileSync(new URL('../assets/enemy-hawk-battle-v1-sheet.png', import.meta.url));
const ids = count => Array.from({ length: count }, (_, index) => index);
const close = (actual, expected, label = '') => assert.ok(Math.abs(actual - expected) < 1e-7, `${label}: expected ${expected}, got ${actual}`);
const copy = value => structuredClone(value);
const makeImage = (data = contract) => attachHawkFrames({ complete: true, width: 1774, height: 887, naturalWidth: 1774, naturalHeight: 887 }, data);

function fixture({ tagged = true } = {}) {
  const engine = new GameEngine({ stageId: 1, seed: 1481, debug: true });
  engine.state.skills = []; engine.spawnAccumulator = -100000;
  Object.assign(engine.state.player, { x: 900, y: 500, hp: 10000, maxHp: 10000 });
  const enemy = engine.spawnEnemy('normal', 0, { name: '鹰妖', variant: 'hawk' });
  Object.assign(enemy, { x: 980, y: 500, speed: 42, radius: 15, hp: 100000, maxHp: 100000, damage: 20 });
  if (!tagged) delete enemy.battleSpriteId;
  return { engine, enemy };
}

function mockCanvas() {
  const draws = [], stack = [];
  const noop = () => {};
  const ctx = new Proxy({ drawImage: (...args) => draws.push(args), save: () => stack.push(1), restore: () => stack.pop(), measureText: text => ({ width: String(text).length * 8 }) }, {
    get(target, key) { return key in target ? target[key] : noop; },
    set(target, key, value) { target[key] = value; return true; },
  });
  const canvas = { width: 390, height: 844, getContext: () => ctx };
  return { canvas, ctx, draws, stack };
}

const tests = [];
const test = (name, run) => tests.push({ name, run });

test('PNG hash, measured crops and frame timing remain unchanged', () => {
  assert.equal(HAWK_SPRITE_ID, 'hawk-normal-v1');
  assert.deepEqual(HAWK_FRAME_COUNTS, { idle: 8, move: 8, attack: 8, hit: 4, death: 4 });
  assert.deepEqual(HAWK_FPS, { idle: 8, move: 12, attack: 16, hit: 16, death: 10 });
  assert.deepEqual([...sheetBytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.deepEqual([sheetBytes.readUInt32BE(16), sheetBytes.readUInt32BE(20)], [1774, 887]);
  assert.equal(createHash('sha256').update(sheetBytes).digest('hex'), contract.sha256);
  assert.equal(contract.sha256, 'eaa6d8e639c9a29f1d94bcded105b584168ebc67efe9c78017b1f78e2c6cd9e7');
  assert.equal(contract.referenceBodyHeight, 180);
  assert.deepEqual(contract.previewRootXs, [130, 340, 562, 775, 989, 1210, 1423, 1651]);
  assert.deepEqual(contract.previewBaselines, [232, 447, 660, 849]);
  assert.deepEqual({ stageId: contract.identity.stageId, kind: contract.identity.kind, variant: contract.identity.variant }, { stageId: 1, kind: 'normal', variant: 'hawk' });
  const image = makeImage(), used = [], crops = new Set();
  for (const [state, count] of Object.entries(HAWK_FRAME_COUNTS)) {
    assert.equal(contract.states[state].length, count);
    for (let frameIndex = 0; frameIndex < count; frameIndex += 1) {
      const index = contract.states[state][frameIndex], rect = contract.sourceRects[index]; used.push(index); crops.add([rect.x, rect.y, rect.w, rect.h].join(','));
      for (const radius of [7, 15, 30, 72]) {
        const frame = hawkDrawFrame(image, state, frameIndex, radius), scale = radius * 3.2 / 180;
        assert.deepEqual([frame.x, frame.y, frame.w, frame.h], [rect.x, rect.y, rect.w, rect.h]);
        close(frame.dw / rect.w, scale); close(frame.dh / rect.h, scale);
        close(frame.dx, (rect.x - contract.previewRootXs[index % 8]) * scale);
        close(frame.dy, radius * .7 + (rect.y - contract.previewBaselines[Math.floor(index / 8)]) * scale);
      }
    }
  }
  assert.deepEqual(used, ids(32)); assert.equal(crops.size, 32);
  assert.deepEqual(hawkDrawFrame(image, 'move', 8, 15), hawkDrawFrame(image, 'move', 0, 15));
  for (const state of ['attack', 'hit', 'death']) assert.deepEqual(hawkDrawFrame(image, state, 100, 15), hawkDrawFrame(image, state, HAWK_FRAME_COUNTS[state] - 1, 15));
  assert.deepEqual(hawkDrawFrame(image, 'stun', 3, 15), hawkDrawFrame(image, 'hit', 3, 15));
});

test('invalid contracts and identity boundaries are rejected', () => {
  assert.throws(() => attachHawkFrames({ width: 8, height: 4 }, contract), /Invalid/);
  for (const mutate of [data => { data.states.move[0] = 0; }, data => { data.sourceRects[31].x = data.size[0]; }, data => { data.previewBaselines[3] = NaN; }, data => { data.referenceBodyHeight = 136; }]) {
    const invalid = copy(contract); mutate(invalid); assert.throws(() => makeImage(invalid), /Invalid/);
  }
  const { engine, enemy } = fixture();
  assert.equal(enemy.battleSpriteId, HAWK_SPRITE_ID); assert.equal(isBattleHawk(enemy), true);
  assert.equal(battleEnemySpriteId(1, 'normal', 'hawk'), HAWK_SPRITE_ID);
  for (const stageId of [0, 2, 81, '1', undefined]) assert.notEqual(battleEnemySpriteId(stageId, 'normal', 'hawk'), HAWK_SPRITE_ID);
  for (const kind of ['elite', 'boss', 'death', undefined]) assert.equal(battleEnemySpriteId(1, kind, 'hawk'), null);
  for (const impostor of [{ ...enemy, battleSpriteId: undefined }, { ...enemy, variant: 'tiger' }, { ...enemy, kind: 'elite' }, { ...enemy, kind: 'death' }, null, {}]) assert.equal(isBattleHawk(impostor), false);
  assert.equal(isBattleHawk({ ...enemy, kind: 'death', enemyKind: 'normal' }), true);
  engine.dispose();
});

test('renderer draws all authored crops in both directions and rejects untagged fallback', () => {
  const image = makeImage(), mock = mockCanvas(), renderer = new GameRenderer(mock.canvas, { width: 390, height: 844, showHud: false, battleArtMode: 'authoredFrames', enemyImages: { hawk: image } });
  const { engine, enemy } = fixture();
  let checked = 0;
  for (const [state, count] of Object.entries(HAWK_FRAME_COUNTS)) for (let frameIndex = 0; frameIndex < count; frameIndex += 1) for (const facing of [0, Math.PI]) {
    mock.draws.length = 0; const entity = { ...enemy, x: 120, y: 220, facing, animationState: state, frameIndex, animationFrames: count };
    if (state === 'death') Object.assign(entity, { kind: 'death', enemyKind: 'normal', bodyRadius: enemy.radius, radius: enemy.radius * 1.25, ttl: .35, maxTtl: .42 });
    renderer._drawEnemy(mock.ctx, entity, engine.state.player, { ink: '#071b24', accent: '#f44a48', sticker: '#ffe84e' });
    assert.equal(mock.draws.length, 1, `${state}:${frameIndex} must draw one hawk crop`); checked += 1;
  }
  assert.equal(checked, 64); assert.equal(mock.stack.length, 0);
  mock.draws.length = 0; renderer._drawEnemy(mock.ctx, { ...enemy, battleSpriteId: undefined }, engine.state.player, { ink: '#071b24', accent: '#f44a48', sticker: '#ffe84e' });
  assert.equal(mock.draws.length, 0); renderer.dispose(); engine.dispose();
});

let failures = 0;
for (const { name, run } of tests) { try { run(); console.log(`PASS ${name}`); } catch (error) { failures += 1; console.error(`FAIL ${name}\n${error.stack}`); } }
if (failures) process.exitCode = 1;
else {
  const report = { ok: true, generatedAt: new Date().toISOString(), tests: tests.length, atlasFrames: 32, mirroredCanvasChecks: 64, runtime: { kind: 'Node.js with deterministic Canvas mock', nodeVersion: process.version }, boundary: { realBrowser: false, pixelRendering: false, gpuPerformance: false, wechatDevice: false }, note: 'Node/Canvas mock only; real-browser evidence is a separate gate.' };
  const output = new URL('../../evidence/current/hawk/', import.meta.url); fs.mkdirSync(output, { recursive: true }); fs.writeFileSync(new URL('engine-runtime.json', output), `${JSON.stringify(report, null, 2)}\n`); console.log(JSON.stringify(report, null, 2));
}
