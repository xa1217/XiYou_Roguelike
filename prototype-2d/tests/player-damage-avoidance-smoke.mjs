import assert from 'node:assert/strict';
import { GameRenderer } from '../src/renderer.js';

// Narrow renderer gate for the one new occlusion boundary: a damage label may
// move around the conservative player-body box, but the engine-owned number,
// style and lifetime remain unchanged.  This is not a pixel, HUD, GPU or
// WeChat-device approval and it does not attempt number-to-number avoidance.
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
const playerRect = player => {
  const r = Math.max(9, Math.min(52, Number(player.radius) || 18));
  return { left: player.x - r * 1.5, right: player.x + r * 1.5,
    top: player.y - r * 2.58, bottom: player.y + r * 1.5 };
};
const label = (extra = {}) => ({ x: 500, y: 487, damage: 7, size: 17, ttl: 1, maxTtl: 1, ...extra });
const target = (extra = {}) => ({ id: 'target', kind: 'normal', variant: 'wolf', x: 500, y: 510,
  radius: 15, hp: 90, maxHp: 100, ...extra });

function harness(view = { left: 0, right: 2000, top: 0, bottom: 2000 }) {
  const calls = [], stack = [];
  const ctx = { globalAlpha: 1, fillStyle: '#000', strokeStyle: '#000', lineWidth: 1,
    font: '10px sans-serif', textAlign: 'start', textBaseline: 'alphabetic' };
  const styles = () => Object.fromEntries(['globalAlpha', 'fillStyle', 'strokeStyle', 'lineWidth', 'font', 'textAlign', 'textBaseline']
    .map(key => [key, ctx[key]]));
  const record = (name, args) => {
    for (const value of args) if (typeof value === 'number') assert.ok(Number.isFinite(value), `${name}: non-finite argument`);
    calls.push({ name, args, ...styles() });
  };
  for (const name of ['beginPath', 'closePath', 'moveTo', 'lineTo', 'fill', 'stroke', 'fillText', 'strokeText', 'translate', 'rotate']) {
    ctx[name] = (...args) => record(name, args);
  }
  ctx.save = () => { stack.push(styles()); record('save', []); };
  ctx.restore = () => { assert.ok(stack.length, 'Canvas restore without save'); Object.assign(ctx, stack.pop()); record('restore', []); };
  ctx.measureText = text => ({ width: String(text).length * 8 });
  const renderer = new GameRenderer({ width: 0, height: 0, getContext: () => ctx }, { width: 390, height: 844, showHud: false });
  renderer._view = view;
  return {
    renderer, ctx, calls, stack,
    draw(state, enemies = [], options) {
      calls.length = 0;
      renderer._drawCombatFeedback(ctx, state, enemies, options);
      assert.equal(stack.length, 0, 'feedback must balance Canvas save/restore');
      return {
        translate: calls.find(call => call.name === 'translate')?.args || null,
        text: calls.find(call => call.name === 'fillText')?.args?.[0] ?? null,
        rect: renderer._damageLabelRects[0] ? { ...renderer._damageLabelRects[0] } : null,
      };
    },
  };
}

test('nearby damage moves to a finite non-overlapping player candidate without changing text', () => {
  const h = harness(), player = freeze({ x: 500, y: 500, radius: 18 });
  const state = freeze({ player, damageNumbers: [freeze(label())] });
  const before = structuredClone(state), result = h.draw(state, freeze([target()]), { avoidPlayer: true });
  assert.equal(h.renderer.stats.damagePlayerCandidates, 1);
  assert.equal(h.renderer.stats.damagePlayerMoved, 1);
  assert.equal(h.renderer.stats.damagePlayerUnresolved, 0);
  assert.notDeepEqual(result.translate, [500, 487], 'a colliding label must use a different candidate');
  assert.equal(result.text, '7');
  assert.equal(overlap(result.rect, playerRect(player)), false, 'moved damage rect still intersects the hero box');
  assert.deepEqual(state, before, 'player or damage state was mutated');
  h.renderer.dispose();
});

test('a distant label keeps its original world transform and no avoidance is counted', () => {
  const h = harness(), state = freeze({ player: freeze({ x: 900, y: 500, radius: 18 }), damageNumbers: [freeze(label())] });
  const result = h.draw(state, freeze([target({ x: 500, y: 510 })]), { avoidPlayer: true });
  assert.deepEqual(result.translate, [500, 487]);
  assert.equal(h.renderer.stats.damagePlayerCandidates, 0);
  assert.equal(h.renderer.stats.damagePlayerMoved, 0);
  assert.equal(h.renderer.stats.damagePlayerUnresolved, 0);
  h.renderer.dispose();
});

test('direct helper callers keep the legacy exact transform when avoidance is omitted or disabled', () => {
  const h = harness(), player = freeze({ x: 500, y: 500, radius: 18 }), state = freeze({ player, damageNumbers: [freeze(label())] });
  for (const options of [undefined, { avoidPlayer: false }]) {
    const result = h.draw(state, freeze([target()]), options);
    assert.deepEqual(result.translate, [500, 487]);
    assert.equal(h.renderer.stats.damagePlayerCandidates, 0);
    assert.equal(h.renderer.stats.damagePlayerMoved, 0);
    assert.equal(h.renderer.stats.damagePlayerUnresolved, 0);
  }
  h.renderer.dispose();
});

test('when every finite candidate is outside the visible world, the number remains drawn in place', () => {
  const h = harness({ left: 450, right: 550, top: 460, bottom: 540 });
  const player = freeze({ x: 500, y: 500, radius: 18 }), state = freeze({ player, damageNumbers: [freeze(label())] });
  const result = h.draw(state, freeze([target()]), { avoidPlayer: true });
  assert.deepEqual(result.translate, [500, 487]);
  assert.equal(result.text, '7', 'fail-closed placement must not drop feedback');
  assert.equal(h.renderer.stats.damagePlayerCandidates, 1);
  assert.equal(h.renderer.stats.damagePlayerMoved, 0);
  assert.equal(h.renderer.stats.damagePlayerUnresolved, 1);
  assert.equal(overlap(result.rect, playerRect(player)), true, 'the unresolved case is explicit, not a false PASS');
  h.renderer.dispose();
});

test('placement storage is numeric, reused and cleared on dispose while repeated frozen frames stay stable', () => {
  const h = harness(), player = freeze({ x: 500, y: 500, radius: 18 });
  const state = freeze({ player, damageNumbers: [freeze(label())] });
  const before = structuredClone(state), first = h.draw(state, freeze([target()]), { avoidPlayer: true });
  const buffer = h.renderer._damageLabelRects, slot = buffer[0], expected = structuredClone(first);
  for (let frame = 0; frame < 60; frame += 1) {
    assert.deepEqual(h.draw(state, freeze([target()]), { avoidPlayer: true }), expected);
    assert.equal(h.renderer._damageLabelRects, buffer);
    assert.equal(buffer[0], slot);
    assert.ok(Object.values(slot).every(value => typeof value === 'number' && Number.isFinite(value)));
    assert.deepEqual(state, before);
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
  totals: { tests: tests.length, passed: tests.length - failures, failed: failures, repeatedFrozenFrames: 60 },
  runtime: { kind: 'Node.js with deterministic Canvas command recording', nodeVersion: process.version },
  boundary: { realBrowser: false, pixelRendering: false, healthBars: false, hudAvoidance: false, numberToNumberAvoidance: false, gpuPerformance: false, wechatDevice: false },
  strategy: { playerBox: 'x±1.5r, y−2.58r..y+1.5r', candidates: ['above', 'left', 'right', 'below'], gap: 4, unresolved: 'draw original label and count damagePlayerUnresolved' },
  note: 'Renderer-only finite player-body avoidance. The conservative box follows the status-badge box and is not a pixel or HUD guarantee.',
};
const output = new URL('../../evidence/current/player-damage-avoidance/', import.meta.url);
import fs from 'node:fs';
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(new URL('node.json', output), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (failures) process.exitCode = 1;
