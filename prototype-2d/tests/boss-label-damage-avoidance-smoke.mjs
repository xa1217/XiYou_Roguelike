import assert from 'node:assert/strict';
import fs from 'node:fs';
import { GameRenderer } from '../src/renderer.js';

// Narrow renderer gate: production feedback may keep transient damage labels
// outside the finite rectangles reserved for already-laid-out Boss nameplates.
// This is world-space geometry only; it does not promise HUD, pixel, or
// number-to-number occlusion.
const tests = [], results = [];
const test = (name, run) => tests.push({ name, run });
const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value); Object.values(value).forEach(freeze);
  }
  return value;
};
const overlap = (a, b, gap = 3) => a.left < b.right + gap && a.right > b.left - gap
  && a.top < b.bottom + gap && a.bottom > b.top - gap;
const boss = extra => ({ id: 'boss', kind: 'boss', name: '寅将军', final: true, x: 500, y: 500, radius: 34, ...extra });
const label = extra => ({ x: 500, y: 406.5, damage: 7, size: 17, ttl: 1, maxTtl: 1, ...extra });

function harness(view = { left: 0, right: 2000, top: 0, bottom: 2000 }) {
  const calls = [], stack = [];
  const ctx = { globalAlpha: 1, fillStyle: '#000', strokeStyle: '#000', lineWidth: 1, font: '10px sans-serif', textAlign: 'start', textBaseline: 'alphabetic' };
  const styles = () => Object.fromEntries(['globalAlpha', 'fillStyle', 'strokeStyle', 'lineWidth', 'font', 'textAlign', 'textBaseline'].map(key => [key, ctx[key]]));
  const record = (name, args) => {
    for (const value of args) if (typeof value === 'number') assert.ok(Number.isFinite(value), `${name}: non-finite Canvas argument`);
    calls.push({ name, args, ...styles() });
  };
  for (const name of ['beginPath', 'closePath', 'moveTo', 'lineTo', 'quadraticCurveTo', 'bezierCurveTo', 'arc', 'fill', 'stroke', 'fillRect', 'strokeRect', 'fillText', 'strokeText', 'setTransform', 'translate', 'scale', 'rotate', 'clip', 'drawImage']) ctx[name] = (...args) => record(name, args);
  ctx.save = () => { stack.push(styles()); record('save', []); };
  ctx.restore = () => { assert.ok(stack.length, 'unbalanced Canvas restore'); Object.assign(ctx, stack.pop()); record('restore', []); };
  ctx.measureText = text => ({ width: String(text).length * 10, actualBoundingBoxLeft: 0, actualBoundingBoxRight: String(text).length * 5, actualBoundingBoxAscent: 9, actualBoundingBoxDescent: 3 });
  const renderer = new GameRenderer({ width: 0, height: 0, getContext: () => ctx }, { width: 390, height: 844, showHud: false });
  renderer._view = view;
  return {
    renderer, calls, stack,
    draw(state, enemies = [], options) {
      calls.length = 0;
      const before = structuredClone({ state, enemies });
      renderer._drawCombatFeedback(ctx, { ...state }, enemies, options);
      assert.deepEqual({ state, enemies }, before, 'feedback changed its input');
      assert.equal(stack.length, 0, 'Canvas stack leaked');
      return { rect: renderer._damageLabelRects[0] ? { ...renderer._damageLabelRects[0] } : null,
        translate: calls.find(call => call.name === 'translate')?.args || null };
    },
  };
}

test('nearby damage moves outside the finite Boss nameplate rectangle', () => {
  const h = harness(), target = freeze(boss());
  h.renderer._layoutBossLabels([target]);
  const slot = { ...h.renderer._bossLabelRects[0] };
  const state = freeze({ damageNumbers: [freeze(label({ x: 500, y: (slot.top + slot.bottom) / 2 }))] });
  const before = structuredClone(state), result = h.draw(state, [target], { avoidBossLabels: true });
  assert.equal(h.renderer.stats.damageBossCandidates, 1);
  assert.equal(h.renderer.stats.damageBossMoved, 1);
  assert.equal(h.renderer.stats.damageBossUnresolved, 0);
  assert.equal(overlap(result.rect, slot), false, 'moved number still intersects Boss nameplate');
  assert.equal(h.calls.filter(call => call.name === 'fillText').length, 1, 'number was not drawn exactly once');
  assert.deepEqual(state, before);
  h.renderer.dispose();
});

test('distant damage keeps its transform and does not count Boss avoidance', () => {
  const h = harness(), target = freeze(boss());
  h.renderer._layoutBossLabels([target]);
  const result = h.draw(freeze({ damageNumbers: [freeze(label({ x: 1100, y: 900 }))] }), [target], { avoidBossLabels: true });
  assert.deepEqual(result.translate, [1100, 900]);
  assert.equal(h.renderer.stats.damageBossCandidates, 0);
  assert.equal(h.renderer.stats.damageBossMoved, 0);
  assert.equal(h.renderer.stats.damageBossUnresolved, 0);
  h.renderer.dispose();
});

test('direct helper callers retain the legacy transform when Boss avoidance is omitted', () => {
  const h = harness(), target = freeze(boss());
  h.renderer._layoutBossLabels([target]);
  const result = h.draw(freeze({ damageNumbers: [freeze(label())] }), [target]);
  assert.deepEqual(result.translate, [500, 406.5]);
  assert.equal(h.renderer.stats.damageBossCandidates, 0);
  assert.equal(h.renderer.stats.damageBossMoved, 0);
  assert.equal(h.renderer.stats.damageBossUnresolved, 0);
  h.renderer.dispose();
});

test('candidate exhaustion draws in place and records an explicit unresolved Boss collision', () => {
  const h = harness({ left: 490, right: 510, top: 390, bottom: 430 }), target = freeze(boss());
  // Keep the reserved label in this deliberately tiny viewport. The regular
  // layout pass would move it until it fits, so this fixture isolates the
  // feedback pass's fail-closed behavior when every number candidate is out.
  h.renderer._bossLabelRects.push({ id: target.id, offset: 0, left: 448, right: 552, top: 395.5, bottom: 417.5 });
  const result = h.draw(freeze({ damageNumbers: [freeze(label())] }), [target], { avoidBossLabels: true });
  assert.deepEqual(result.translate, [500, 406.5]);
  assert.equal(h.renderer.stats.damageBossCandidates, 1);
  assert.equal(h.renderer.stats.damageBossMoved, 0);
  assert.equal(h.renderer.stats.damageBossUnresolved, 1);
  assert.equal(h.calls.filter(call => call.name === 'fillText').length, 1);
  h.renderer.dispose();
});

test('Boss label array and damage slots remain bounded and release without actor references', () => {
  const h = harness(), target = freeze(boss());
  h.renderer._layoutBossLabels([target]);
  const labels = h.renderer._bossLabelRects;
  const state = freeze({ damageNumbers: [freeze(label({ x: 1100, y: 900 }))] });
  h.draw(state, [target], { avoidBossLabels: true });
  const damage = h.renderer._damageLabelRects, damageSlot = damage[0];
  for (let frame = 0; frame < 30; frame += 1) {
    h.renderer._layoutBossLabels([target]);
    h.draw(state, [target], { avoidBossLabels: true });
    assert.equal(h.renderer._bossLabelRects, labels);
    assert.equal(h.renderer._damageLabelRects, damage);
    assert.equal(h.renderer._damageLabelRects[0], damageSlot);
    assert.ok(Object.values(h.renderer._bossLabelRects[0]).every(value => typeof value === 'number' || typeof value === 'string'));
    assert.ok(Object.values(h.renderer._damageLabelRects[0]).every(value => typeof value === 'number' && Number.isFinite(value)));
  }
  h.renderer.dispose();
  assert.equal(labels.length, 0); assert.equal(damage.length, 0);
});

let failures = 0;
for (const { name, run } of tests) {
  try { run(); results.push({ name, result: 'PASS' }); console.log(`PASS ${name}`); }
  catch (error) { failures += 1; results.push({ name, result: 'FAIL', message: error.message }); console.error(`FAIL ${name}\n${error.stack}`); }
}
const report = {
  ok: failures === 0, generatedAt: new Date().toISOString(), tests: results,
  totals: { tests: tests.length, passed: tests.length - failures, failed: failures, repeatedFrozenFrames: 30 },
  runtime: { kind: 'Node.js with deterministic Canvas command recording', nodeVersion: process.version },
  boundary: { realBrowser: false, pixelRendering: false, bodyAvoidance: false, healthBars: false, hudAvoidance: false, numberToNumberAvoidance: false, gpuPerformance: false, wechatDevice: false },
  strategy: { obstacle: 'laid-out Boss nameplate rectangle', candidates: ['above', 'left', 'right', 'below'], gap: 4, unresolved: 'draw original label and count damageBossUnresolved' },
  note: 'Renderer-only finite Boss-nameplate avoidance. This is not a pixel, HUD, number-to-number, or global occlusion guarantee.',
};
const output = new URL('../../evidence/current/boss-label-damage-avoidance/', import.meta.url);
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(new URL('node.json', output), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (failures) process.exitCode = 1;
