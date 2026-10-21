import assert from 'node:assert/strict';
import fs from 'node:fs';
import { GameEngine } from '../src/engine.js';
import { GameRenderer } from '../src/renderer.js';

// Narrow gate: status badges avoid the current damage-label rectangles.
// It does not promise body/HUD/number-to-number avoidance or browser pixels.
const tests = [], results = [];
const test = (name, run) => tests.push({ name, run });
const close = (a, b, note = '') => assert.ok(Math.abs(a - b) < 1e-7, `${note}: expected ${b}, got ${a}`);
const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value); Object.values(value).forEach(freeze);
  }
  return value;
};
const enemy = extra => ({ id: 'target', kind: 'normal', variant: 'wolf', x: 400, y: 500, radius: 15, hp: 90, maxHp: 100, stun: 1, ...extra });
const label = extra => ({ x: 400, y: 469.25, damage: 7, size: 17, ttl: 1, maxTtl: 1, ...extra });
const overlaps = (a, b) => a.left < b.right + 3 && a.right > b.left - 3 && a.top < b.bottom + 3 && a.bottom > b.top - 3;
const baseY = target => target.y - target.radius * 1.85 - 11;

function harness({ metrics, showHud = false } = {}) {
  const calls = [], badges = [], stack = [], measurements = [];
  const ctx = { globalAlpha: 1, fillStyle: '#000', strokeStyle: '#000', lineWidth: 1,
    font: '10px sans-serif', textAlign: 'start', textBaseline: 'alphabetic' };
  const styles = () => Object.fromEntries(['globalAlpha', 'fillStyle', 'strokeStyle', 'lineWidth', 'font', 'textAlign', 'textBaseline'].map(key => [key, ctx[key]]));
  const record = (name, args) => {
    for (const value of args) if (typeof value === 'number') assert.ok(Number.isFinite(value), `${name}: non-finite Canvas argument`);
    assert.ok(Number.isFinite(ctx.globalAlpha) && Number.isFinite(ctx.lineWidth));
    calls.push({ name, args, ...styles() });
  };
  for (const name of ['beginPath', 'closePath', 'moveTo', 'lineTo', 'quadraticCurveTo', 'bezierCurveTo', 'arc', 'fill', 'stroke', 'fillRect', 'strokeRect', 'clearRect', 'fillText', 'strokeText', 'setTransform', 'translate', 'scale', 'rotate', 'clip', 'drawImage']) {
    ctx[name] = (...args) => record(name, args);
  }
  ctx.save = () => { stack.push(styles()); record('save', []); };
  ctx.restore = () => { assert.ok(stack.length, 'unbalanced Canvas restore'); Object.assign(ctx, stack.pop()); record('restore', []); };
  if (metrics !== false) ctx.measureText = text => {
    measurements.push(text);
    return typeof metrics === 'function' ? metrics(text, ctx.font) : metrics || { width: String(text).length * 10 };
  };
  const renderer = new GameRenderer({ width: 0, height: 0, getContext: () => ctx }, { width: 390, height: 844, showHud });
  renderer._view = { left: 0, right: 2000, top: 0, bottom: 2000 };
  const h = { renderer, ctx, calls, badges, stack, measurements, numberCalls: [], passed: null };
  const drawBadge = renderer._drawStatusBadge.bind(renderer);
  renderer._drawStatusBadge = (context, descriptor, x, y, width) => {
    badges.push({ glyph: descriptor.glyph, x, y, left: x - width / 2, right: x + width / 2, top: y - 8, bottom: y + 8 });
    drawBadge(context, descriptor, x, y, width);
  };
  const drawBadges = renderer._drawStatusBadges.bind(renderer);
  renderer._drawStatusBadges = (...args) => {
    h.numberCalls = structuredClone(calls);
    h.passed = { rects: args[3], count: args[4] };
    return drawBadges(...args);
  };
  h.reset = () => { calls.length = 0; badges.length = 0; measurements.length = 0; h.numberCalls = []; h.passed = null; };
  h.draw = (state = {}, targets = [], player = state.player) => {
    h.reset(); const before = structuredClone({ state, targets, player });
    renderer._drawCombatFeedback(ctx, { ...state, player }, targets);
    assert.deepEqual({ state, targets, player }, before, 'feedback changed its input');
    assert.equal(stack.length, 0); return badges;
  };
  h.direct = (targets, player, ...rectArgs) => { h.reset(); renderer._drawStatusBadges(ctx, targets, player, ...rectArgs); assert.equal(stack.length, 0); return badges; };
  return h;
}

test('one conflicting label chooses only the second/third slot or suppresses all three', () => {
  const h = harness(), target = freeze(enemy({})), y = baseY(target);
  for (const [offset, expectedOffset] of [[8, -19], [0, -38], [-19, null]]) {
    h.draw(freeze({ damageNumbers: [label({ y: y + offset })] }), [target]);
    assert.equal(h.passed.count, 1); assert.equal(h.passed.rects, h.renderer._damageLabelRects);
    assert.equal(h.renderer.stats.statusCandidates, 1);
    assert.equal(h.badges.length, expectedOffset === null ? 0 : 1);
    assert.equal(h.renderer.stats.statusSuppressed, expectedOffset === null ? 1 : 0);
    if (expectedOffset !== null) {
      close(h.badges[0].y, y + expectedOffset);
      assert.equal(overlaps(h.badges[0], h.renderer._damageLabelRects[0]), false);
    }
    assert.equal(h.numberCalls.filter(call => call.name === 'fillText').length, 1, 'suppression must affect the badge, never the number');
  }
  h.renderer.dispose();
});

test('rotated bounds cover measured overhangs, critical outlines, decimals and the whole starburst', () => {
  const cases = [
    [label({ damage: 7 }), { width: 10, actualBoundingBoxLeft: 5, actualBoundingBoxRight: 5, actualBoundingBoxAscent: 9, actualBoundingBoxDescent: 3 }],
    [label({ damage: 12345, critical: true, size: 22, ttl: .5 }), { width: 96, actualBoundingBoxLeft: 67, actualBoundingBoxRight: 43, actualBoundingBoxAscent: 23, actualBoundingBoxDescent: 8 }],
    [label({ damage: '0.3', ttl: .2 }), { width: 25, actualBoundingBoxLeft: 14, actualBoundingBoxRight: 13, actualBoundingBoxAscent: 15, actualBoundingBoxDescent: 4 }],
    [label({ text: 'WIDE', size: 24 }), { width: 8, actualBoundingBoxLeft: 40, actualBoundingBoxRight: 3, actualBoundingBoxAscent: 2, actualBoundingBoxDescent: 27 }],
    [label({ text: 'x', damage: 90, size: 12 }), { width: 1, actualBoundingBoxLeft: .5, actualBoundingBoxRight: .5, actualBoundingBoxAscent: 1, actualBoundingBoxDescent: 1 }],
  ];
  for (const [item, metrics] of cases) {
    const h = harness({ metrics }); h.draw(freeze({ damageNumbers: [item] }));
    const rect = h.renderer._damageLabelRects[0], outline = (item.critical ? 3.5 : 2.8) / 2;
    // Independently derive the miter extension from the adjacent inner
    // vertices (.42 radius, 45 degrees) instead of copying the reserve pad.
    const tipHalfSide = .42 * Math.SQRT1_2;
    const starMiter = .6 * Math.hypot(1 - tipHalfSide, tipHalfSide) / tipHalfSide;
    assert.ok(starMiter > 1.5 && starMiter < 1.6, 'star tip geometry changed');
    const burst = 9 + Math.min(90, Math.max(0, Number(item.damage) || 0)) * .045 + starMiter;
    const halfW = Math.max(metrics.width / 2, Math.abs(metrics.actualBoundingBoxLeft), Math.abs(metrics.actualBoundingBoxRight)) + outline;
    const halfH = Math.max(item.size * .6, Math.abs(metrics.actualBoundingBoxAscent), Math.abs(metrics.actualBoundingBoxDescent)) + outline;
    const angle = Math.sin((item.x + item.y) * .03) * .08, cos = Math.cos(angle), sin = Math.sin(angle);
    const centerY = item.y - (1 - item.ttl / item.maxTtl) * 28;
    for (const px of [-Math.max(halfW, burst), Math.max(halfW, burst)]) for (const py of [-Math.max(halfH, burst), Math.max(halfH, burst)]) {
      const x = item.x + px * cos - py * sin, y = centerY + px * sin + py * cos;
      assert.ok(x >= rect.left - 1e-7 && x <= rect.right + 1e-7 && y >= rect.top - 1e-7 && y <= rect.bottom + 1e-7, 'rotated text/burst corner escaped protection');
    }
    close((rect.left + rect.right) / 2, item.x); close((rect.top + rect.bottom) / 2, centerY);
    assert.deepEqual(Object.keys(rect).sort(), ['bottom', 'left', 'right', 'top']);
    assert.ok(Object.values(rect).every(Number.isFinite)); assert.equal(h.measurements.length, 1);
    h.renderer.dispose();
  }
});

test('missing or unusable text metrics use finite conservative bounds', () => {
  for (const metrics of [false, {}, { width: NaN, actualBoundingBoxLeft: Infinity, actualBoundingBoxAscent: NaN }]) {
    const h = harness({ metrics }), item = label({ text: '12345', damage: 0, size: 24 });
    h.draw(freeze({ damageNumbers: [item] }));
    const rect = h.renderer._damageLabelRects[0];
    assert.ok(Object.values(rect).every(Number.isFinite));
    assert.ok(rect.right - rect.left >= item.text.length * item.size, 'missing metrics under-reserved the text width');
    h.renderer.dispose();
  }
});

test('empty frames and direct legacy calls never reuse old damage protection', () => {
  const h = harness(), target = freeze(enemy({})), y = baseY(target);
  h.draw(freeze({ damageNumbers: [label({ y: y - 19 })] }), [target]); assert.equal(h.badges.length, 0);
  const buffer = h.renderer._damageLabelRects, slot = buffer[0];
  for (const state of [{ damageNumbers: [] }, {}, { damageNumbers: [null, {}, { text: null }] }, { damageNumbers: [], floatingTexts: [label({})] }]) {
    h.draw(freeze(state), [target]); assert.equal(h.passed.count, 0);
    assert.equal(h.renderer._damageLabelRects, buffer); assert.equal(buffer[0], slot);
    assert.equal(h.badges.length, 1); close(h.badges[0].y, y); assert.equal(h.numberCalls.length, 0);
  }
  h.direct([target]); assert.equal(h.badges.length, 1); close(h.badges[0].y, y);
  const blocked = [{ left: 390, right: 410, top: y - 60, bottom: y + 20 }];
  h.direct([target], undefined, blocked); assert.equal(h.badges.length, 0, 'fourth argument defaults to its array length');
  h.direct([target], undefined, blocked, 0); assert.equal(h.badges.length, 1, 'explicit current count must exclude stale slots');
  h.renderer.dispose(); assert.equal(buffer.length, 0);
});

test('at most 48 numeric slots are reused and oversized compatible collections fail closed', () => {
  const h = harness(), targets = freeze([enemy({}), enemy({ id: 'elite', kind: 'elite', x: 800 }), enemy({ id: 'boss', kind: 'boss', x: 1200 })]);
  const items = freeze(Array.from({ length: 48 }, (_, index) => label({ x: 40 + index * 30, y: 100 })));
  h.draw({ damageNumbers: items }, targets);
  const buffer = h.renderer._damageLabelRects, slots = [...buffer];
  assert.equal(buffer.length, 48); assert.equal(h.badges.length, 3, '48 non-overlapping numbers must not suppress all badges');
  for (let frame = 0; frame < 120; frame += 1) {
    h.draw({ damageNumbers: items }, targets); assert.equal(h.renderer._damageLabelRects, buffer);
    assert.equal(buffer.length, 48); assert.equal(h.measurements.length, 48);
    buffer.forEach((slot, index) => {
      assert.equal(slot, slots[index]); assert.ok(Object.values(slot).every(value => typeof value === 'number' && Number.isFinite(value)));
    });
  }
  for (const collection of ['damageNumbers', 'floatingTexts', 'combatText']) {
    h.draw(freeze({ [collection]: [...items, label({ x: 1700, y: 100 }), null, {}] }), targets);
    assert.equal(h.passed.count, 49); assert.equal(buffer.length, 48); assert.equal(h.measurements.length, 48);
    assert.equal(h.numberCalls.filter(call => call.name === 'fillText').length, 49, 'overflow must not drop any number');
    assert.equal(h.renderer.stats.statusCandidates, 3); assert.equal(h.renderer.stats.statusBadges, 0); assert.equal(h.renderer.stats.statusSuppressed, 3);
  }
  h.draw({ damageNumbers: items }, targets); assert.equal(h.badges.length, 3, 'overflow suppression leaked to the next bounded frame');
  h.draw({ damageNumbers: [] }, targets); assert.equal(h.badges.length, 3); assert.equal(h.passed.count, 0);
  h.renderer.dispose(); assert.equal(buffer.length, 0);
});

test('damage avoidance preserves original player, other-badge and viewport restrictions', () => {
  const h = harness(), target = freeze(enemy({})), y = baseY(target);
  h.renderer._view = { left: 0, right: 800, top: y - 12, bottom: 800 };
  h.draw({ damageNumbers: [] }, [target]); assert.equal(h.badges.length, 1);
  h.draw({ damageNumbers: [label({ y: y + 8 })] }, [target]);
  assert.equal(h.badges.length, 0, 'a collision must not move the badge beyond the viewport');
  h.renderer._view = { left: 0, right: 2000, top: 0, bottom: 2000 };
  const near = freeze(enemy({ x: 500, y: 510 })), player = freeze({ x: 500, y: 500, radius: 18 });
  h.draw({ damageNumbers: [] }, [near], player); assert.equal(h.badges.length, 1);
  const onlySlotY = h.badges[0].y; close(onlySlotY, baseY(near) - 38);
  h.draw({ damageNumbers: [label({ x: 500, y: onlySlotY })] }, [near], player);
  assert.equal(h.badges.length, 0, 'damage avoidance must not reintroduce a player collision');
  const crowded = freeze([target, enemy({ id: 'second' })]);
  h.draw({ damageNumbers: [label({ y: y + 8 })] }, crowded);
  assert.equal(h.badges.length, 2); close(h.badges[0].y, y - 19); close(h.badges[1].y, y - 38);
  assert.equal(overlaps(h.badges[0], h.badges[1]), false);
  for (const badge of h.badges) assert.equal(overlaps(badge, h.renderer._damageLabelRects[0]), false);
  h.renderer.dispose();
});

test('damage drawing remains unchanged by status collisions, metrics and showHud', () => {
  const state = freeze({ damageNumbers: [label({ damage: '0.3' }), label({ text: '破甲', value: 120, critical: true, size: 22 })] });
  const baseline = harness({ metrics: false }); baseline.draw(state);
  const expected = structuredClone(baseline.numberCalls);
  for (const showHud of [false, true]) {
    const h = harness({ showHud, metrics: { width: 100, actualBoundingBoxAscent: 25, actualBoundingBoxDescent: 10 } });
    h.draw(state, freeze([enemy({})]));
    assert.deepEqual(h.numberCalls, expected, 'reservation changed number geometry, timing, decoration or text paint');
    assert.deepEqual(h.numberCalls.filter(call => ['fill', 'stroke', 'strokeText', 'fillText'].includes(call.name)).map(call => call.name), ['fill', 'stroke', 'strokeText', 'fillText', 'fill', 'stroke', 'strokeText', 'fillText']);
    assert.deepEqual(h.numberCalls.filter(call => call.name === 'fillText').map(call => call.args[0]), ['0.3', '破甲']);
    h.renderer.dispose();
  }
  baseline.renderer.dispose();
});

test('paused real-engine collision is deterministic and leaves damage, pools and RNG untouched', () => {
  const create = () => {
    const engine = new GameEngine({ stageId: 2, seed: 9426, debug: true });
    engine.state.skills = []; engine.spawnAccumulator = -100000;
    const target = engine.spawnEnemy('normal', 0, { variant: 'wolf' });
    Object.assign(target, { x: 400, y: 400, radius: 15, hp: 100, maxHp: 100, stun: 1 });
    engine.damageEnemy(target, 7);
    for (let tick = 0; tick < 7; tick += 1) engine.update(.05);
    engine.update(.04); engine.pause(); return engine;
  };
  const engine = create(), control = create(), h = harness();
  const before = engine.getSnapshot(), state = freeze(structuredClone(before));
  const records = engine.state.damageNumbers, record = records[0], poolStats = structuredClone(engine.poolStats);
  assert.equal(records.length, 1); close(record.y - (1 - record.ttl / record.maxTtl) * 28, 361.244);
  h.draw(state, state.enemies, state.player);
  assert.equal(h.badges.length, 1); assert.ok(h.badges[0].y < baseY(state.enemies[0]), 'real damage did not displace the overlapping status badge');
  const commands = structuredClone(h.calls), rects = structuredClone(h.renderer._damageLabelRects), badges = structuredClone(h.badges);
  const random = Math.random; Math.random = () => { throw new Error('renderer must not introduce random placement'); };
  try {
    for (let tick = 0; tick < 20; tick += 1) {
      engine.update(.05, { x: 1 }); control.update(.05, { x: 1 });
      h.draw(state, state.enemies, state.player);
      assert.deepEqual(h.calls, commands); assert.deepEqual(h.badges, badges); assert.deepEqual(h.renderer._damageLabelRects, rects);
      assert.deepEqual(engine.getSnapshot(), before); assert.deepEqual(state, before); assert.deepEqual(engine.poolStats, poolStats);
      assert.equal(engine.state.damageNumbers, records); assert.equal(records[0], record); assert.equal(records.length, 1);
    }
  } finally { Math.random = random; }
  assert.equal(engine.rng(), control.rng(), 'rendering consumed the gameplay RNG');
  engine.dispose(); control.dispose(); h.renderer.dispose();
});

let failures = 0;
for (const { name, run } of tests) {
  try { run(); results.push({ name, result: 'PASS' }); console.log(`PASS ${name}`); }
  catch (error) { failures += 1; results.push({ name, result: 'FAIL', message: error.message }); console.error(`FAIL ${name}\n${error.stack}`); }
}
const report = {
  ok: failures === 0, generatedAt: new Date().toISOString(), tests: results,
  totals: { tests: tests.length, passed: tests.length - failures, failed: failures, rectangleLimit: 48, reuseFrames: 120, pausedFrames: 20 },
  runtime: { kind: 'Node.js with deterministic Canvas command recording', nodeVersion: process.version },
  boundary: { realBrowser: false, pixelRendering: false, bodyAvoidance: false, hudAvoidance: false, numberToNumberAvoidance: false, gpuPerformance: false, wechatDevice: false },
  note: 'Only current damage-label bounds versus the three existing status-badge slots; no global overlap or final visual-quality approval.',
};
const output = new URL('../../evidence/current/feedback-overlap/', import.meta.url);
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(new URL('node.json', output), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (failures) process.exitCode = 1;
