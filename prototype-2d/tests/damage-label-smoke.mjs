import assert from 'node:assert/strict';
import fs from 'node:fs';
import { GameEngine } from '../src/engine.js';
import { GameRenderer } from '../src/renderer.js';

// Local Canvas-command regression for damage-label self-occlusion only.
// This does not approve actor/HUD avoidance, browser pixels or final readability.
const tests = [], results = [];
const test = (name, run) => tests.push({ name, run });
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-7, `expected ${expected}, got ${actual}`);
const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value); Object.values(value).forEach(freeze);
  }
  return value;
};
const label = extra => ({ x: 120, y: 220, ttl: 1, maxTtl: 1, damage: 7, size: 17, ...extra });

function harness(showHud = false) {
  const calls = [], stack = [];
  const ctx = { globalAlpha: 1, fillStyle: '#000', strokeStyle: '#000', lineWidth: 1,
    font: '10px sans-serif', textAlign: 'start', textBaseline: 'alphabetic' };
  const styles = () => Object.fromEntries(['globalAlpha', 'fillStyle', 'strokeStyle', 'lineWidth', 'font', 'textAlign', 'textBaseline'].map(key => [key, ctx[key]]));
  const record = (name, args) => {
    for (const value of args) if (typeof value === 'number') assert.ok(Number.isFinite(value), `${name}: non-finite Canvas argument`);
    assert.ok(Number.isFinite(ctx.lineWidth) && Number.isFinite(ctx.globalAlpha), 'non-finite Canvas style');
    calls.push({ name, args, ...styles() });
  };
  for (const name of ['beginPath', 'closePath', 'moveTo', 'lineTo', 'fill', 'stroke', 'fillText', 'strokeText', 'translate', 'rotate']) {
    ctx[name] = (...args) => record(name, args);
  }
  ctx.save = () => { stack.push(styles()); record('save', []); };
  ctx.restore = () => { assert.ok(stack.length, 'unbalanced Canvas restore'); Object.assign(ctx, stack.pop()); record('restore', []); };
  const renderer = new GameRenderer({ width: 0, height: 0, getContext: () => ctx }, { width: 390, height: 844, showHud });
  return { renderer, ctx, calls, stack, draw(state) {
    calls.length = 0;
    renderer._drawCombatFeedback(ctx, state, []);
    assert.equal(stack.length, 0, 'Canvas state leaked from feedback');
    return calls;
  } };
}

test('normal, critical, decimal and text/value/damage labels keep their exact text and style', () => {
  const h = harness();
  const cases = [
    [label({ damage: 7 }), '7', '#fff0a6'],
    [label({ damage: 120, critical: true, size: 22, color: '#fff03d' }), '120', '#fff03d'],
    [label({ damage: '0.3' }), '0.3', '#fff0a6'],
    [label({ damage: 0 }), '0', '#fff0a6'],
    [label({ text: '破甲', value: 123, damage: 99 }), '破甲', '#ffdd3d'],
    [label({ value: 42, damage: 99 }), '42', '#fff0a6'],
  ];
  for (const [item, text, color] of cases) {
    const state = freeze({ damageNumbers: [item] }), before = JSON.stringify(state);
    const calls = h.draw(state), glyphs = calls.filter(call => ['strokeText', 'fillText'].includes(call.name));
    assert.deepEqual(glyphs.map(call => [call.name, ...call.args]), [['strokeText', text, 0, 0], ['fillText', text, 0, 0]]);
    assert.equal(glyphs[0].strokeStyle, '#101020'); assert.equal(glyphs[0].lineWidth, item.critical ? 3.5 : 2.8);
    assert.equal(glyphs[1].fillStyle, color);
    for (const glyph of glyphs) {
      assert.equal(glyph.font, `900 ${item.size}px sans-serif`);
      assert.equal(glyph.textAlign, 'center'); assert.equal(glyph.textBaseline, 'middle');
    }
    assert.equal(JSON.stringify(state), before, 'rendering changed a frozen label');
  }
  h.renderer.dispose();
});

test('every starburst fill/stroke precedes its number and the number is painted last', () => {
  const h = harness();
  const items = [label({ damage: 7 }), label({ damage: 120, critical: true }), label({ damage: '0.3' })];
  const calls = h.draw(freeze({ damageNumbers: items }));
  const painting = calls.filter(call => ['fill', 'stroke', 'strokeText', 'fillText'].includes(call.name));
  assert.deepEqual(painting.map(call => call.name), items.flatMap(() => ['fill', 'stroke', 'strokeText', 'fillText']), 'a later starburst paint must not cover its own number');
  assert.equal(calls.filter(call => call.name === 'save').length, items.length);
  assert.equal(calls.filter(call => call.name === 'restore').length, items.length);
  for (let i = 0; i < items.length; i += 1) {
    const outline = painting[i * 4 + 2];
    assert.equal(outline.strokeStyle, '#101020', 'number must not inherit the starburst outline');
    assert.equal(outline.lineWidth, items[i].critical ? 3.5 : 2.8);
  }
  h.renderer.dispose();
});

test('reordering preserves position, rotation, star size/color and lifetime progress at screen edges', () => {
  const h = harness();
  for (const critical of [false, true]) for (const ttl of [1, .5, 0]) for (const [x, y] of [[0, 0], [390, 0], [0, 844], [390, 844]]) {
    const item = label({ x, y, ttl, critical, damage: 30 }), progress = 1 - ttl;
    const calls = h.draw(freeze({ damageNumbers: [item] }));
    assert.deepEqual(calls.find(call => call.name === 'translate').args, [x, y - progress * 28]);
    close(calls.find(call => call.name === 'rotate').args[0], Math.sin((x + y) * .03) * .08);
    const points = calls.filter(call => ['moveTo', 'lineTo'].includes(call.name));
    assert.equal(points.length, 8);
    for (let i = 0; i < points.length; i += 1) {
      const angle = i * Math.PI * 2 / 8 + progress * .8, radius = (9 + 30 * .045) * (i % 2 ? .42 : 1);
      close(points[i].args[0], Math.cos(angle) * radius); close(points[i].args[1], Math.sin(angle) * radius);
    }
    const burst = calls.find(call => call.name === 'fill'), outline = calls.find(call => call.name === 'stroke');
    assert.equal(burst.fillStyle, `rgba(${critical ? '255,206,49' : '98,233,255'},${.48 * (1 - progress * .7)})`);
    assert.equal(outline.strokeStyle, '#111429'); assert.equal(outline.lineWidth, 1.2);
  }
  h.renderer.dispose();
});

test('legacy collections retain precedence and showHud:false still draws combat feedback', () => {
  const hidden = harness(false), shown = harness(true);
  for (const collection of ['damageNumbers', 'floatingTexts', 'combatText']) {
    const state = freeze({ [collection]: [label({ text: '18.5' })] });
    const hiddenCalls = structuredClone(hidden.draw(state));
    assert.equal(hiddenCalls.filter(call => call.name === 'fillText').length, 1);
    assert.deepEqual(shown.draw(state), hiddenCalls, 'showHud must not change battle-number drawing');
  }
  assert.equal(hidden.draw(freeze({ damageNumbers: [], floatingTexts: [label({})], combatText: [label({})] })).length, 0);
  assert.equal(hidden.draw(freeze({ floatingTexts: [], combatText: [label({})] })).length, 0);
  hidden.renderer.dispose(); shown.renderer.dispose();
});

test('real engine damage record is not duplicated, mutated or advanced by paused rendering', () => {
  const h = harness(), engine = new GameEngine({ stageId: 1, seed: 226, debug: true });
  engine.state.skills = []; engine.spawnAccumulator = -100000;
  const enemy = engine.spawnEnemy('normal', 0, { variant: 'snake' });
  Object.assign(enemy, { x: 900, y: 800, hp: 100, maxHp: 100 });
  engine.damageEnemy(enemy, .25, { critical: true }); engine.pause();
  const records = engine.state.damageNumbers, record = records[0], before = engine.getSnapshot();
  assert.equal(records.length, 1); assert.equal(record.damage, '0.3'); assert.equal(record.ttl, 1.25);
  const frozenState = freeze(structuredClone(before)), poolsBefore = structuredClone(engine.poolStats);
  const expected = structuredClone(h.draw(frozenState));
  for (let i = 0; i < 20; i += 1) {
    engine.update(.05, { x: 1 });
    assert.deepEqual(h.draw(frozenState), expected, 'paused feedback commands drifted');
    assert.deepEqual(h.draw(engine.state), expected, 'live paused feedback differs from its frozen snapshot');
    assert.deepEqual(engine.getSnapshot(), before); assert.deepEqual(frozenState, before);
    assert.equal(engine.state.damageNumbers, records); assert.equal(records.length, 1); assert.equal(records[0], record);
    assert.deepEqual(engine.poolStats, poolsBefore, 'renderer allocated or released engine pooled objects');
  }
  engine.dispose(); h.renderer.dispose();
});

test('empty/missing labels draw no decorations and malformed numeric fields stay finite', () => {
  const h = harness();
  for (const state of [{}, { damageNumbers: [] }, { damageNumbers: null }, { damageNumbers: [null, {}, { text: null }] }]) {
    assert.deepEqual(h.draw(freeze(state)), [], 'there must be no decoration without a number');
  }
  for (const size of [-5, 100, NaN, Infinity]) {
    const item = label({ x: NaN, y: Infinity, ttl: NaN, maxTtl: -Infinity, size });
    const calls = h.draw(freeze({ damageNumbers: [item] }));
    assert.equal(calls.filter(call => call.name === 'fill').length, 1);
    assert.equal(calls.filter(call => call.name === 'fillText').length, 1);
    assert.deepEqual(calls.find(call => call.name === 'translate').args, [0, 0]);
    assert.equal(calls.find(call => call.name === 'fillText').font, `900 ${Number.isFinite(size) ? Math.max(12, Math.min(24, size)) : 16}px sans-serif`);
  }
  h.renderer.dispose();
});

let failures = 0;
for (const { name, run } of tests) {
  try { run(); results.push({ name, result: 'PASS' }); console.log(`PASS ${name}`); }
  catch (error) { failures += 1; results.push({ name, result: 'FAIL', message: error.message }); console.error(`FAIL ${name}\n${error.stack}`); }
}
const report = {
  ok: failures === 0, generatedAt: new Date().toISOString(), tests: results,
  totals: { tests: tests.length, passed: tests.length - failures, failed: failures },
  runtime: { kind: 'Node.js with deterministic Canvas command recording', nodeVersion: process.version },
  boundary: { realBrowser: false, pixelRendering: false, globalOcclusion: false, gpuPerformance: false, wechatDevice: false },
  note: 'Checks decoration-before-text ordering and unchanged label content/geometry/state only; not actor, HUD or global overlap avoidance.',
};
const output = new URL('../../evidence/current/damage-labels/', import.meta.url);
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(new URL('node.json', output), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (failures) process.exitCode = 1;
