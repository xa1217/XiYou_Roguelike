import assert from 'node:assert/strict';
import fs from 'node:fs';
import { GameRenderer } from '../src/renderer.js';

// Narrow renderer gate: damage numbers may keep finite world-space distance
// from already accepted damage-number rectangles when production opts in.
// This does not claim pixel, HUD, or global readability.
const tests = [], results = [];
const test = (name, run) => tests.push({ name, run });
const overlap = (a, b, gap = 3) => a.left < b.right + gap && a.right > b.left - gap
  && a.top < b.bottom + gap && a.bottom > b.top - gap;
const label = extra => ({ x: 400, y: 400, damage: 7, text: '7', size: 17, ttl: 1, maxTtl: 1, ...extra });

function harness(view = { left: 0, right: 1800, top: 0, bottom: 1800 }) {
  const calls = [], stack = [];
  const ctx = { globalAlpha: 1, fillStyle: '#000', strokeStyle: '#000', lineWidth: 1, font: '10px sans-serif', textAlign: 'start', textBaseline: 'alphabetic' };
  const style = () => Object.fromEntries(['globalAlpha', 'fillStyle', 'strokeStyle', 'lineWidth', 'font', 'textAlign', 'textBaseline'].map(key => [key, ctx[key]]));
  const record = (name, args) => {
    for (const value of args) if (typeof value === 'number') assert.ok(Number.isFinite(value), `${name}: non-finite Canvas argument`);
    calls.push({ name, args, ...style() });
  };
  for (const name of ['beginPath', 'closePath', 'moveTo', 'lineTo', 'quadraticCurveTo', 'bezierCurveTo', 'arc', 'fill', 'stroke', 'fillRect', 'strokeRect', 'fillText', 'strokeText', 'setTransform', 'translate', 'scale', 'rotate', 'clip', 'drawImage']) ctx[name] = (...args) => record(name, args);
  ctx.save = () => { stack.push(style()); record('save', []); };
  ctx.restore = () => { assert.ok(stack.length, 'unbalanced Canvas restore'); Object.assign(ctx, stack.pop()); record('restore', []); };
  ctx.measureText = text => ({ width: String(text).length * 10, actualBoundingBoxLeft: 0, actualBoundingBoxRight: String(text).length * 5, actualBoundingBoxAscent: 9, actualBoundingBoxDescent: 3 });
  const renderer = new GameRenderer({ width: 0, height: 0, getContext: () => ctx }, { width: 390, height: 844, showHud: false });
  renderer._view = view;
  return {
    renderer, calls, stack,
    draw(state, options) {
      calls.length = 0;
      const before = structuredClone(state);
      renderer._drawCombatFeedback(ctx, { ...state }, [], options);
      assert.deepEqual(state, before, 'feedback changed its input');
      assert.equal(stack.length, 0, 'Canvas stack leaked');
      return { rects: renderer._damageLabelRects.slice(0, state.damageNumbers.length).map(rect => rect && { ...rect }), translates: calls.filter(call => call.name === 'translate').map(call => call.args) };
    },
  };
}

test('nearby labels move to finite non-overlapping candidates', () => {
  const h = harness(), state = { damageNumbers: [label(), label()] };
  const result = h.draw(state, { avoidDamageLabels: true });
  assert.equal(h.renderer.stats.damageLabelCandidates, 1);
  assert.equal(h.renderer.stats.damageLabelMoved, 1);
  assert.equal(h.renderer.stats.damageLabelUnresolved, 0);
  assert.equal(overlap(result.rects[0], result.rects[1]), false, 'moved number still intersects the prior number');
  assert.deepEqual(result.translates[0], [400, 400]);
  assert.equal(result.translates[1][0], 400);
  assert.ok(result.translates[1][1] < 400, 'finite candidate should move above the prior number');
  h.renderer.dispose();
});

test('distant labels keep world transforms and do not count number avoidance', () => {
  const h = harness(), state = { damageNumbers: [label({ x: 400, y: 400 }), label({ x: 600, y: 500 })] };
  const result = h.draw(state, { avoidDamageLabels: true });
  assert.deepEqual(result.translates.slice(-2), [[400, 400], [600, 500]]);
  assert.equal(h.renderer.stats.damageLabelCandidates, 0);
  assert.equal(h.renderer.stats.damageLabelMoved, 0);
  assert.equal(h.renderer.stats.damageLabelUnresolved, 0);
  h.renderer.dispose();
});

test('direct helper callers retain legacy transforms when number avoidance is omitted', () => {
  const h = harness(), state = { damageNumbers: [label(), label()] };
  const result = h.draw(state);
  assert.deepEqual(result.translates.slice(-2), [[400, 400], [400, 400]]);
  assert.equal(h.renderer.stats.damageLabelCandidates, 0);
  assert.equal(h.renderer.stats.damageLabelMoved, 0);
  assert.equal(h.renderer.stats.damageLabelUnresolved, 0);
  h.renderer.dispose();
});

test('finite candidates fail closed while every label remains drawn', () => {
  const h = harness(), state = { damageNumbers: Array.from({ length: 6 }, () => label()) };
  const result = h.draw(state, { avoidDamageLabels: true });
  assert.equal(h.renderer.stats.damageLabelCandidates, 5);
  assert.equal(h.renderer.stats.damageLabelMoved, 4);
  assert.equal(h.renderer.stats.damageLabelUnresolved, 1);
  assert.equal(result.translates.length, 6, 'candidate exhaustion dropped a number');
  assert.equal(h.calls.filter(call => call.name === 'fillText').length, 6, 'each number must still be painted');
  h.renderer.dispose();
});

test('bounded numeric slots are reused and cleared on dispose', () => {
  const h = harness(), state = { damageNumbers: [label(), label()] };
  const buffer = h.renderer._damageLabelRects;
  h.draw(state, { avoidDamageLabels: true });
  const slots = buffer.slice(0, 2);
  for (let frame = 0; frame < 30; frame += 1) {
    h.draw(state, { avoidDamageLabels: true });
    assert.equal(h.renderer._damageLabelRects, buffer);
    assert.equal(h.renderer._damageLabelRects[0], slots[0]);
    assert.equal(h.renderer._damageLabelRects[1], slots[1]);
    assert.ok(h.renderer._damageLabelRects.slice(0, 2).every(rect => Object.values(rect).every(value => Number.isFinite(value))));
  }
  h.renderer.dispose();
  assert.equal(buffer.length, 0);
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
  boundary: { realBrowser: false, pixelRendering: false, bodyAvoidance: false, healthBars: false, bossLabelAvoidance: false, hudAvoidance: false, numberToNumberAvoidance: true, gpuPerformance: false, wechatDevice: false },
  strategy: { obstacle: 'previously accepted damage-number rectangle', candidates: ['above', 'left', 'right', 'below'], gap: 4, unresolved: 'draw original label and count damageLabelUnresolved' },
  note: 'Renderer-only finite damage-number-to-number avoidance. This is not a pixel, HUD, or global occlusion guarantee.',
};
const output = new URL('../../evidence/current/damage-label-avoidance/', import.meta.url);
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(new URL('node.json', output), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (failures) process.exitCode = 1;
