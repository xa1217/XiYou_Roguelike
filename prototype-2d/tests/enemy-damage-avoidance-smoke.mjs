import assert from 'node:assert/strict';
import fs from 'node:fs';
import { GameRenderer } from '../src/renderer.js';

// Narrow renderer gate: damage labels avoid finite enemy body/health-bar
// rectangles when production opts in. It does not promise pixel, HUD, or
// number-to-number occlusion.
const tests = [], results = [];
const test = (name, run) => tests.push({ name, run });
const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value); Object.values(value).forEach(freeze);
  }
  return value;
};
const enemy = extra => ({ id: 'enemy', kind: 'normal', variant: 'wolf', x: 500, y: 500, radius: 15, hp: 90, maxHp: 100, ...extra });
const label = extra => ({ x: 500, y: 500, damage: 7, size: 17, ttl: 1, maxTtl: 1, ...extra });
const overlap = (a, b, gap = 3) => a.left < b.right + gap && a.right > b.left - gap && a.top < b.bottom + gap && a.bottom > b.top - gap;

function harness() {
  const calls = [], stack = [];
  const ctx = { globalAlpha: 1, fillStyle: '#000', strokeStyle: '#000', lineWidth: 1, font: '10px sans-serif', textAlign: 'start', textBaseline: 'alphabetic' };
  const styles = () => Object.fromEntries(['globalAlpha', 'fillStyle', 'strokeStyle', 'lineWidth', 'font', 'textAlign', 'textBaseline'].map(key => [key, ctx[key]]));
  const record = (name, args) => {
    for (const value of args) if (typeof value === 'number') assert.ok(Number.isFinite(value), `${name}: non-finite Canvas argument`);
    calls.push({ name, args, ...styles() });
  };
  for (const name of ['beginPath', 'closePath', 'moveTo', 'lineTo', 'quadraticCurveTo', 'bezierCurveTo', 'arc', 'fill', 'stroke', 'fillRect', 'strokeRect', 'clearRect', 'fillText', 'strokeText', 'setTransform', 'translate', 'scale', 'rotate', 'clip', 'drawImage']) ctx[name] = (...args) => record(name, args);
  ctx.save = () => { stack.push(styles()); record('save', []); };
  ctx.restore = () => { assert.ok(stack.length, 'unbalanced Canvas restore'); Object.assign(ctx, stack.pop()); record('restore', []); };
  ctx.measureText = text => ({ width: String(text).length * 10, actualBoundingBoxLeft: 0, actualBoundingBoxRight: String(text).length * 5, actualBoundingBoxAscent: 9, actualBoundingBoxDescent: 3 });
  const renderer = new GameRenderer({ width: 0, height: 0, getContext: () => ctx }, { width: 390, height: 844, showHud: false });
  renderer._view = { left: 0, right: 2000, top: 0, bottom: 2000 };
  const draw = (state, enemies, options = { avoidEnemies: true }) => {
    calls.length = 0;
    const before = structuredClone({ state, enemies });
    renderer._drawCombatFeedback(ctx, { ...state }, enemies, options);
    assert.deepEqual({ state, enemies }, before, 'feedback changed its input');
    assert.equal(stack.length, 0, 'Canvas stack leaked');
    return calls;
  };
  return { renderer, calls, draw, stack };
}

test('ordinary, elite and boss labels leave finite body/health rectangles', () => {
  for (const kind of ['normal', 'elite', 'boss']) {
    const h = harness(), target = freeze(enemy({ id: kind, kind }));
    h.draw(freeze({ damageNumbers: [label()] }), [target]);
    assert.equal(h.renderer.stats.damageEnemyCandidates, 1, `${kind}: collision counted`);
    assert.equal(h.renderer.stats.damageEnemyMoved, 1, `${kind}: finite candidate selected`);
    const rect = h.renderer._damageLabelRects[0];
    for (const obstacle of h.renderer._damageEnemyRects) assert.equal(overlap(rect, obstacle), false, `${kind}: label intersects enemy obstacle`);
    assert.equal(h.calls.filter(call => call.name === 'fillText').length, 1, `${kind}: number was not dropped`);
    h.renderer.dispose();
  }
});

test('authored and generic enemy obstacle buffers include health bars and reuse numeric slots', () => {
  const h = harness();
  const authored = freeze(enemy({ id: 'authored', battleSpriteId: 'wolf-normal-v1' }));
  const generic = freeze(enemy({ id: 'generic', variant: 'creature', x: 800, y: 600, kind: 'elite', radius: 22 }));
  h.draw(freeze({ damageNumbers: [] }), [authored, generic]);
  assert.equal(h.renderer._damageEnemyRects.length, 4, 'each visible injured enemy reserves body and health bar');
  assert.ok(h.renderer._damageEnemyRects.every(rect => Object.values(rect).every(Number.isFinite)), 'obstacle buffer is numeric');
  const buffer = h.renderer._damageEnemyRects, slots = [...buffer];
  for (let frame = 0; frame < 30; frame += 1) {
    h.draw(freeze({ damageNumbers: [] }), [authored, generic]);
    assert.equal(h.renderer._damageEnemyRects, buffer);
    assert.deepEqual(buffer, slots);
  }
  h.renderer.dispose(); assert.equal(buffer.length, 0);
});

test('a distant label keeps its original position and does not count avoidance', () => {
  const h = harness(), target = freeze(enemy());
  h.draw(freeze({ damageNumbers: [label({ x: 1100, y: 900 })] }), [target]);
  const rect = h.renderer._damageLabelRects[0];
  assert.equal((rect.left + rect.right) / 2, 1100);
  assert.equal((rect.top + rect.bottom) / 2, 900);
  assert.equal(h.renderer.stats.damageEnemyCandidates, 0);
  assert.equal(h.renderer.stats.damageEnemyMoved, 0);
  h.renderer.dispose();
});

test('crowded candidates fail closed and still draw the value', () => {
  const h = harness(), target = freeze(enemy());
  h.renderer._view = { left: 490, right: 510, top: 490, bottom: 510 };
  h.draw(freeze({ damageNumbers: [label()] }), [target]);
  const rect = h.renderer._damageLabelRects[0];
  assert.equal((rect.left + rect.right) / 2, 500);
  assert.equal((rect.top + rect.bottom) / 2, 500);
  assert.equal(h.renderer.stats.damageEnemyCandidates, 1);
  assert.equal(h.renderer.stats.damageEnemyMoved, 0);
  assert.equal(h.renderer.stats.damageEnemyUnresolved, 1);
  assert.equal(h.calls.filter(call => call.name === 'fillText').length, 1);
  h.renderer.dispose();
});

test('status badge placement remains compatible with moved damage rectangles', () => {
  const h = harness(), near = freeze(enemy()), statusTarget = freeze(enemy({ id: 'status', x: 1000, y: 900, stun: 1 }));
  h.draw(freeze({ damageNumbers: [label()] }), [near, statusTarget]);
  const rect = h.renderer._damageLabelRects[0];
  const badgeFill = h.calls.filter(call => call.name === 'fillText').map(call => call.args[0]);
  assert.ok(badgeFill.includes('晕'), 'status badge remains drawable');
  // Badge geometry is reserved after the moved number; no stale original slot
  // may be used by the status pass.
  assert.ok(h.renderer._statusBadgeRects.slice(0, h.renderer.stats.statusBadges).every(slot => !overlap(slot, rect)));
  h.renderer.dispose();
});

test('48-label bound, frozen input and repeated Canvas draws stay stable', () => {
  const h = harness(), target = freeze(enemy()), items = freeze(Array.from({ length: 48 }, (_, i) => label({ x: 80 + i * 34, y: 100 })));
  const state = freeze({ damageNumbers: items });
  h.draw(state, [target]);
  const damageBuffer = h.renderer._damageLabelRects, enemyBuffer = h.renderer._damageEnemyRects;
  const firstRects = structuredClone(damageBuffer), firstCommands = structuredClone(h.calls);
  for (let frame = 0; frame < 60; frame += 1) {
    h.draw(state, [target]);
    assert.equal(h.renderer._damageLabelRects, damageBuffer);
    assert.equal(h.renderer._damageEnemyRects, enemyBuffer);
    assert.deepEqual(h.renderer._damageLabelRects, firstRects);
    assert.deepEqual(h.calls, firstCommands);
  }
  h.renderer.dispose(); assert.equal(damageBuffer.length, 0); assert.equal(enemyBuffer.length, 0);
});

let failures = 0;
for (const { name, run } of tests) {
  try { run(); results.push({ name, result: 'PASS' }); console.log(`PASS ${name}`); }
  catch (error) { failures += 1; results.push({ name, result: 'FAIL', message: error.message }); console.error(`FAIL ${name}\n${error.stack}`); }
}
const report = {
  ok: failures === 0, generatedAt: new Date().toISOString(), tests: results,
  totals: { tests: tests.length, passed: tests.length - failures, failed: failures, repeatedFrozenFrames: 60 },
  runtime: { kind: 'Node.js with deterministic Canvas command recording', nodeVersion: process.version },
  boundary: { realBrowser: false, pixelRendering: false, hudAvoidance: false, numberToNumberAvoidance: false, gpuPerformance: false, wechatDevice: false },
  strategy: { obstacles: 'authored/generic enemy body plus visible health bar', candidates: ['above', 'left', 'right', 'below'], gap: 4, unresolved: 'draw original label and count damageEnemyUnresolved' },
  note: 'Renderer-only finite enemy-body/health-bar avoidance. This is not a pixel, HUD, number-to-number, or global occlusion guarantee.',
};
const output = new URL('../../evidence/current/enemy-damage-avoidance/', import.meta.url);
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(new URL('node.json', output), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (failures) process.exitCode = 1;
