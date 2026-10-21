import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { GameEngine } from '../src/engine.js';
import { GameRenderer } from '../src/renderer.js';
import { BALANCE } from '../src/content.js';
import { battleEnemyAnimation, battleEnemySpriteId } from '../src/battle-enemy-animation.js';
import {
  SNAKE_SPRITE_ID, SNAKE_FRAME_COUNTS, SNAKE_FPS,
  isBattleSnake, attachSnakeFrames, snakeDrawFrame,
} from '../src/snake-animation.js';

// Deterministic Node/Canvas gate for the measured ordinary-snake atlas. This
// proves the real crops, identity isolation and renderer draw contract; it is
// not a browser, GPU, mobile-FPS or final-animation-quality approval.
const contract = JSON.parse(fs.readFileSync(new URL('../assets/enemy-snake-battle-v3-frames.json', import.meta.url), 'utf8'));
const preflight = JSON.parse(fs.readFileSync(new URL('../../evidence/current/snake/asset-preflight-v3.json', import.meta.url), 'utf8'));
const sheetBytes = fs.readFileSync(new URL('../assets/enemy-snake-battle-v3-sheet.png', import.meta.url));
const ids = count => Array.from({ length: count }, (_, index) => index);
const close = (actual, expected, label = '') => assert.ok(Math.abs(actual - expected) < 1e-7, `${label}: expected ${expected}, got ${actual}`);
const copy = value => structuredClone(value);
const makeImage = (data = contract) => attachSnakeFrames({ complete: true, width: 1774, height: 887, naturalWidth: 1774, naturalHeight: 887 }, data);

function fixture({ tagged = true, x = 980, y = 500, speed = 42 } = {}) {
  const events = [];
  const engine = new GameEngine({ stageId: 1, seed: 1841, debug: true, onEvent: event => events.push(event) });
  engine.state.skills = []; engine.spawnAccumulator = -100000;
  Object.assign(engine.state.player, { x: 900, y: 500, hp: 10000, maxHp: 10000 });
  const enemy = engine.spawnEnemy('normal', 0, { name: '蛇妖', variant: 'snake' });
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
  const canvas = { width: 390, height: 844, getContext: () => ctx };
  return { canvas, ctx, calls, draws, stack, reset() { calls.length = 0; draws.length = 0; } };
}

const theme = { ink: '#071b24', accent: '#f44a48', sticker: '#ffe84e' };
const rendererFixture = image => {
  const mock = mockCanvas();
  const renderer = new GameRenderer(mock.canvas, { width: 390, height: 844, showHud: false, battleArtMode: 'authoredFrames', enemyImages: image ? { snake: image } : {} });
  return { ...mock, renderer };
};

const tests = [];
const test = (name, run) => tests.push({ name, run });

test('PNG hash, measured crops and frame timing remain unchanged', () => {
  assert.equal(SNAKE_SPRITE_ID, 'snake-normal-v3');
  assert.deepEqual(SNAKE_FRAME_COUNTS, { idle: 8, move: 8, attack: 8, hit: 4, death: 4 });
  assert.deepEqual(SNAKE_FPS, { idle: 8, move: 12, attack: 16, hit: 16, death: 10 });
  assert.deepEqual(contract.fps, SNAKE_FPS, 'the measured contract and runtime clocks must agree');
  assert.deepEqual([...sheetBytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.deepEqual([sheetBytes.readUInt32BE(16), sheetBytes.readUInt32BE(20)], [1774, 887]);
  assert.equal(createHash('sha256').update(sheetBytes).digest('hex'), contract.sha256);
  assert.equal(contract.sha256, 'c10c9f951f871e0f398cef9a7ef36c46065df4fb986ed2d0bb8b246da11b0ec2', 'reuse the measured snake v3 PNG unchanged');
  assert.equal(contract.referenceBodyHeight, 170);
  assert.deepEqual(contract.previewRootXs, [125, 345, 565, 787, 999, 1227, 1449, 1667]);
  assert.deepEqual(contract.previewBaselines, [210, 428, 652, 871]);
  assert.deepEqual({ stageId: contract.identity.stageId, kind: contract.identity.kind, variant: contract.identity.variant }, { stageId: 1, kind: 'normal', variant: 'snake' });
  const before = JSON.stringify(contract), image = makeImage(), used = [], crops = new Set();
  assert.equal(image.__snakeBattleSprite, true); assert.equal(image.__prioritySprite, true);
  for (const [state, count] of Object.entries(SNAKE_FRAME_COUNTS)) {
    assert.equal(contract.states[state].length, count);
    for (let frameIndex = 0; frameIndex < count; frameIndex += 1) {
      const index = contract.states[state][frameIndex], rect = contract.sourceRects[index]; used.push(index); crops.add([rect.x, rect.y, rect.w, rect.h].join(','));
      for (const radius of [7, 15, 30, 72]) {
        const frame = snakeDrawFrame(image, state, frameIndex, radius), scale = radius * 3.2 / 170;
        assert.deepEqual([frame.x, frame.y, frame.w, frame.h], [rect.x, rect.y, rect.w, rect.h]);
        close(frame.dw / rect.w, scale); close(frame.dh / rect.h, scale);
        close(frame.dx, (rect.x - contract.previewRootXs[index % 8]) * scale);
        close(frame.dy, radius * .7 + (rect.y - contract.previewBaselines[Math.floor(index / 8)]) * scale);
      }
    }
  }
  assert.deepEqual(used, ids(32)); assert.equal(crops.size, 32); assert.equal(JSON.stringify(contract), before);
  assert.deepEqual(snakeDrawFrame(image, 'move', 8, 15), snakeDrawFrame(image, 'move', 0, 15));
  assert.deepEqual(snakeDrawFrame(image, 'idle', 8, 15), snakeDrawFrame(image, 'idle', 0, 15));
  for (const state of ['attack', 'hit', 'death']) assert.deepEqual(snakeDrawFrame(image, state, 100, 15), snakeDrawFrame(image, state, SNAKE_FRAME_COUNTS[state] - 1, 15));
  assert.deepEqual(snakeDrawFrame(image, 'stun', 3, 15), snakeDrawFrame(image, 'hit', 3, 15));
  assert.equal(snakeDrawFrame(null, 'move', 0, 15), null);
});

test('alpha preflight agrees with every measured crop and invalid contracts are rejected', () => {
  assert.equal(preflight.result, 'PASS');
  assert.equal(preflight.sha256, contract.sha256);
  assert.equal(preflight.frames.length, 32);
  assert.ok(Object.values(preflight.checks).every(Boolean));
  for (const frame of preflight.frames) {
    const source = contract.sourceRects[frame.index], rect = frame.rect;
    assert.equal(source.state, frame.state);
    assert.deepEqual([source.x, source.y, source.w, source.h], [rect.x - 2, rect.y - 2, rect.w + 4, rect.h + 4], `crop ${frame.index} must contain the whole measured pose plus padding`);
  }
  assert.throws(() => attachSnakeFrames({ width: 8, height: 4 }, contract), /Invalid/);
  for (const mutate of [
    data => { data.states.move[0] = 0; }, data => { data.sourceRects[31].x = data.size[0]; },
    data => { data.previewBaselines[3] = NaN; }, data => { data.sourceRects[0].w = 0; },
    data => { data.referenceBodyHeight = 136; }, data => { data.previewRootXs.pop(); },
  ]) { const invalid = copy(contract); mutate(invalid); assert.throws(() => makeImage(invalid), /Invalid/); }
});

test('only first-stage normal snakes acquire the art identity', () => {
  const { engine, enemy } = fixture();
  assert.equal(enemy.battleSpriteId, SNAKE_SPRITE_ID); assert.equal(isBattleSnake(enemy), true);
  assert.equal(battleEnemySpriteId(1, 'normal', 'snake'), SNAKE_SPRITE_ID);
  assert.equal(battleEnemyAnimation(enemy)?.id, SNAKE_SPRITE_ID);
  for (const stageId of [0, 2, 81, '1', undefined]) assert.notEqual(battleEnemySpriteId(stageId, 'normal', 'snake'), SNAKE_SPRITE_ID);
  for (const kind of ['elite', 'boss', 'death', undefined]) assert.equal(battleEnemySpriteId(1, kind, 'snake'), null);
  const elite = engine.spawnEnemy('elite', 0, { name: '蛇妖精英', variant: 'snake' });
  const boss = engine.spawnBoss(true, { name: '蛇妖王', variant: 'snake' });
  for (const other of [elite, boss]) { assert.notEqual(other.battleSpriteId, SNAKE_SPRITE_ID); assert.equal(isBattleSnake(other), false); }
  for (const impostor of [{ ...enemy, battleSpriteId: undefined }, { ...enemy, variant: 'tiger' }, { ...elite, battleSpriteId: SNAKE_SPRITE_ID }, { ...boss, battleSpriteId: SNAKE_SPRITE_ID }, { ...enemy, kind: 'death' }, null, {}]) assert.equal(isBattleSnake(impostor), false);
  assert.equal(isBattleSnake({ ...enemy, kind: 'death', enemyKind: 'normal' }), true);
  engine.dispose();
});

test('only the left-facing authored idle-4 source is normalized before actor-facing mirroring', () => {
  const image = makeImage();
  for (const [state, count] of Object.entries(SNAKE_FRAME_COUNTS)) for (let index = 0; index < count; index += 1) {
    assert.equal(snakeDrawFrame(image, state, index, 15).mirrorX, state === 'idle' && index === 4);
  }
  assert.equal(snakeDrawFrame(image, 'idle', 12, 15).mirrorX, true);
  assert.equal(snakeDrawFrame(image, 'idle', 13, 15).mirrorX, false);
});

test('idle and move clocks independently traverse all eight frames', () => {
  const { engine, enemy } = fixture();
  for (const state of ['idle', 'move']) {
    engine.setAnimation(enemy, state); const seen = new Set();
    for (let i = 0; i < 180; i += 1) {
      engine.stepEnemyAnimation(enemy, state, 1 / 120, 99);
      assert.equal(enemy.animationFrames, 8); seen.add(enemy.frameIndex);
    }
    assert.deepEqual([...seen].sort((a, b) => a - b), ids(8), `${state} must use the snake clock`);
  }
  engine.dispose();
});

test('natural contact shows all attack frames without changing movement, damage or RNG', () => {
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
    } else if (firstAttackAt === null) assert.equal(authored.enemy.visualAttackTimer, 0, 'no attack while approaching');
    if (firstAttackAt !== null && authored.engine.state.time - firstAttackAt > .3 && authored.engine.state.time - firstAttackAt < .4) {
      assert.ok(authored.enemy.x < firstAttackX, 'visual attack must not stop pursuit');
    }
  }
  assert.ok(firstAttackAt > 0, 'the enemy must reach contact through engine movement');
  assert.deepEqual([...frames].sort((a, b) => a - b), ids(8));
  assert.equal(authored.engine.rng(), control.engine.rng(), 'visual timers must not consume RNG');
  authored.engine.dispose(); control.engine.dispose();
});

test('hit traverses four frames, holds the last pose and preserves damage/stun/movement rules', () => {
  const authored = fixture(), control = fixture({ tagged: false });
  for (const item of [authored, control]) item.engine.damageEnemy(item.enemy, 7, { knockback: .12, stun: .18 });
  close(authored.enemy.hitTimer, .12, 'gameplay hit timer');
  close(authored.enemy.visualHitTimer, .25, 'visual hit timer');
  close(authored.enemy.hp, 99993, 'damage amount'); assert.equal(authored.enemy.frameIndex, 0);
  const frames = new Set([0]); let movedWhileShowingHit = false;
  for (let i = 0; i < 60; i += 1) {
    const x = authored.enemy.x;
    authored.engine.update(.005); control.engine.update(.005);
    assert.deepEqual(gameplaySnapshot(authored.engine), gameplaySnapshot(control.engine), `hit changed gameplay on tick ${i}`);
    if (authored.enemy.animationState === 'hit') {
      assert.equal(authored.enemy.animationFrames, 4); frames.add(authored.enemy.frameIndex);
      if (i >= 38) assert.equal(authored.enemy.frameIndex, 3, 'late hit must hold the last frame without wrapping');
      if (authored.enemy.x !== x && authored.enemy.hitTimer === 0) movedWhileShowingHit = true;
    }
  }
  assert.deepEqual([...frames].sort((a, b) => a - b), ids(4));
  assert.ok(movedWhileShowingHit, 'visual hit duration must not extend movement lock');
  assert.equal(authored.enemy.visualHitTimer, 0); assert.equal(authored.enemy.animationState, 'move');
  assert.equal(authored.engine.rng(), control.engine.rng());
  authored.engine.dispose(); control.engine.dispose();
});

test('a hit interrupts contact attack and a new contact swing starts after hit recovery', () => {
  const { engine, enemy } = fixture({ x: 932 }); engine.update(.01);
  assert.equal(enemy.animationState, 'attack'); assert.ok(enemy.visualAttackTimer > 0);
  engine.damageEnemy(enemy, 1);
  assert.equal(enemy.animationState, 'hit'); assert.equal(enemy.visualAttackTimer, 0);
  assert.equal(enemy.frameIndex, 0); close(enemy.visualHitTimer, .25);
  const frames = new Set([0]);
  for (let i = 0; i < 29; i += 1) {
    engine.update(1 / 120);
    assert.equal(enemy.animationState, 'hit'); assert.equal(enemy.visualAttackTimer, 0);
    frames.add(enemy.frameIndex);
  }
  assert.deepEqual([...frames].sort((a, b) => a - b), ids(4));
  engine.update(1 / 120);
  assert.equal(enemy.animationState, 'attack'); assert.equal(enemy.frameIndex, 0);
  close(enemy.visualAttackTimer, .5, 'recovered contact starts a fresh swing');
  engine.dispose();
});

test('pause freezes attack, hit and retained death clocks; resume advances them', () => {
  for (const state of ['attack', 'hit', 'death']) {
    const { engine, enemy } = fixture({ x: state === 'attack' ? 932 : 980 }); engine.update(.01);
    if (state === 'hit') engine.damageEnemy(enemy, 1);
    if (state === 'death') engine.damageEnemy(enemy, enemy.hp);
    const entity = state === 'death' ? engine.state.effects.find(isBattleSnake) : enemy;
    assert.ok(entity); assert.equal(entity.animationState, state);
    assert.equal(engine.pause(), 'paused');
    const paused = engine.getSnapshot(), frameTime = entity.frameTime, ttl = entity.ttl;
    for (let i = 0; i < 12; i += 1) engine.update(.05, { x: 1 });
    assert.deepEqual(engine.getSnapshot(), paused, `${state} advanced while paused`);
    assert.equal(engine.resume(), 'playing'); engine.update(.05);
    assert.ok(entity.frameTime > frameTime, `${state} did not advance after resume`);
    if (state === 'death') close(entity.ttl, ttl - .05, 'resumed death lifetime');
    engine.dispose();
  }
});

test('death preserves identity/body size, plays once, expires at .42s and clears recycled fields', () => {
  for (const dt of [1 / 120, .05]) {
    const { engine, enemy, events } = fixture({ x: 1200 });
    enemy.facing = Math.PI; const radius = enemy.radius; engine.damageEnemy(enemy, enemy.hp);
    const death = engine.state.effects.find(isBattleSnake);
    assert.ok(death); assert.equal(death.kind, 'death'); assert.equal(death.battleSpriteId, SNAKE_SPRITE_ID);
    assert.equal(engine.state.enemies.includes(enemy), false); assert.equal(engine.state.kills, 1);
    assert.equal(death.animationFrames, 4); assert.equal(death.facing, Math.PI); assert.equal(death.bodyRadius, radius);
    close(death.radius, radius * 1.25); close(death.ttl, .42); close(death.maxTtl, .42);
    const gemCount = engine.state.gems.length;
    engine.killEnemy(enemy); engine.damageEnemy(enemy, 1);
    assert.equal(engine.state.effects.filter(isBattleSnake).length, 1, 'repeated kill must not duplicate the death');
    assert.equal(engine.state.kills, 1); assert.equal(engine.state.gems.length, gemCount);
    assert.equal(events.filter(event => event.type === 'kill').length, 1);
    const frames = new Set([death.frameIndex]); let ticks = 0;
    while (death.ttl > .001) {
      const previous = death.frameIndex;
      engine.update(Math.min(dt, death.ttl - .000001)); ticks += 1;
      assert.ok(engine.state.effects.includes(death), 'death expired before .42s');
      assert.ok(death.frameIndex >= previous && death.frameIndex <= 3, 'death must never wrap');
      frames.add(death.frameIndex); assert.ok(ticks < 100, 'death lifetime did not advance');
    }
    assert.deepEqual([...frames], ids(4)); assert.equal(death.frameIndex, 3);
    assert.ok(engine.state.time < .42); close(engine.state.time + death.ttl, .42, 'death expiry boundary');
    engine.update(death.ttl);
    close(engine.state.time, .42); assert.equal(engine.state.effects.includes(death), false);
    assert.equal(engine.pools.effect.includes(death), true); assert.equal(engine.poolStats.released.effect, 1);
    engine.effect({ x: 1, y: 2, kind: 'impact', radius: 8, ttl: .01 });
    const reused = engine.state.effects.at(-1); assert.equal(reused, death, 'expired death should be reused');
    for (const key of ['battleSpriteId', 'facing', 'bodyRadius', 'enemyKind', 'variant', 'animationState', 'animationFrames', 'frameTime', 'frameIndex', 'visualAttackTimer', 'visualHitTimer']) {
      assert.equal(reused[key], undefined, `recycled impact retained snake ${key}`);
    }
    assert.equal(isBattleSnake(reused), false); assert.equal(battleEnemyAnimation(reused), null);
    engine.update(.05); assert.equal(engine.poolStats.released.effect, 2);
    assert.ok(engine.pools.effect.length <= BALANCE.maxEffects); engine.dispose();
    assert.equal(engine.state.effects.length, 0); assert.ok(Object.values(engine.pools).every(pool => pool.length === 0));
  }
});

test('renderer applies exact source crops and source/actor mirrors, with body-sized death effects', () => {
  const image = makeImage(), mock = rendererFixture(image);
  const { engine, enemy } = fixture(); let checked = 0;
  for (const [state, count] of Object.entries(SNAKE_FRAME_COUNTS)) for (let frameIndex = 0; frameIndex < count; frameIndex += 1) for (const facing of [0, Math.PI]) {
    const entity = Object.freeze({ ...enemy, x: 120, y: 220, facing, animationState: state, frameIndex, animationFrames: count,
      ...(state === 'death' ? { kind: 'death', enemyKind: 'normal', bodyRadius: enemy.radius, radius: enemy.radius * 1.25, ttl: .35, maxTtl: .42 } : {}) });
    mock.reset();
    if (state === 'death') mock.renderer._drawEffect(mock.ctx, entity);
    else mock.renderer._drawEnemy(mock.ctx, entity, engine.state.player, theme);
    assert.equal(mock.draws.length, 1, `${state}:${frameIndex} must draw one snake crop`);
    const index = contract.states[state][frameIndex], rect = contract.sourceRects[index], scale = enemy.radius * 3.2 / 170;
    const expected = [rect.x, rect.y, rect.w, rect.h,
      (rect.x - contract.previewRootXs[index % 8]) * scale,
      enemy.radius * .7 + (rect.y - contract.previewBaselines[Math.floor(index / 8)]) * scale,
      rect.w * scale, rect.h * scale];
    assert.equal(mock.draws[0].args[0], image); assert.deepEqual(mock.draws[0].args.slice(1), expected, `${state}:${frameIndex} source and destination crop`);
    const direction = (facing === 0 ? 1 : -1) * (state === 'idle' && frameIndex === 4 ? -1 : 1);
    assert.deepEqual(mock.calls.filter(call => call.op === 'translate').map(call => call.args), [[entity.x, entity.y]]);
    assert.deepEqual(mock.calls.filter(call => call.op === 'scale').map(call => call.args), [[direction, 1]]);
    [direction, 0, 0, 1, entity.x, entity.y].forEach((value, index) => close(mock.draws[0].matrix[index], value, 'only fixed translation and source/actor mirrors are permitted'));
    assert.equal(mock.calls.some(call => call.op === 'rotate'), false, 'authored poses must not receive synthetic rotation');
    assert.equal(mock.stack.length, 0); checked += 1;
  }
  assert.equal(checked, 64); mock.renderer.dispose(); engine.dispose();
});

test('renderer rejects untagged, elite and Boss snakes and falls back safely', () => {
  const image = makeImage(), { engine, enemy } = fixture(), valid = rendererFixture(image);
  for (const other of [{ ...enemy, battleSpriteId: undefined }, { ...enemy, variant: 'tiger' }, { ...enemy, kind: 'elite' }, { ...enemy, kind: 'boss' }]) {
    valid.reset(); valid.renderer._drawEnemy(valid.ctx, Object.freeze(other), engine.state.player, theme);
    assert.equal(valid.draws.length, 0); assert.ok(valid.calls.some(call => call.op === 'fill')); assert.equal(valid.stack.length, 0);
  }
  for (const missing of [undefined, { complete: false, naturalWidth: 0, naturalHeight: 0, width: 0, height: 0 }, { complete: true, width: 1774, height: 887 }]) {
    const fallback = rendererFixture(missing);
    fallback.renderer._drawEnemy(fallback.ctx, Object.freeze({ ...enemy }), engine.state.player, theme);
    assert.equal(fallback.draws.length, 0); assert.equal(fallback.stack.length, 0); fallback.renderer.dispose();
  }
  valid.renderer.dispose(); engine.dispose();
});

let failures = 0;
for (const { name, run } of tests) { try { run(); console.log(`PASS ${name}`); } catch (error) { failures += 1; console.error(`FAIL ${name}\n${error.stack}`); } }
if (failures) process.exitCode = 1;
else {
  const report = { ok: true, generatedAt: new Date().toISOString(), tests: tests.length, atlasFrames: 32, mirroredCanvasChecks: 64, runtime: { kind: 'Node.js with deterministic Canvas mock', nodeVersion: process.version }, boundary: { realBrowser: false, pixelRendering: false, gpuPerformance: false, wechatDevice: false }, note: 'Node/Canvas mock only; real-browser evidence is a separate gate.' };
  const output = new URL('../../evidence/current/snake/', import.meta.url); fs.mkdirSync(output, { recursive: true }); fs.writeFileSync(new URL('engine-runtime.json', output), `${JSON.stringify(report, null, 2)}\n`); console.log(JSON.stringify(report, null, 2));
}
