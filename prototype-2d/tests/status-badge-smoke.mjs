import assert from 'node:assert/strict';
import fs from 'node:fs';
import { GameEngine } from '../src/engine.js';
import { GameRenderer } from '../src/renderer.js';
import { TIGER_SPRITE_ID, attachTigerFrames, tigerDrawFrame } from '../src/tiger-animation.js';

// This gate inspects real engine state and Canvas commands in Node. It does
// not claim browser pixel, GPU, mobile readability or WeChat-device evidence.
const tests = [], results = [];
const test = (name, run) => tests.push({ name, run });
const close = (actual, expected, label = '') => assert.ok(Math.abs(actual - expected) < 1e-7, `${label}: expected ${expected}, got ${actual}`);
const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value); Object.values(value).forEach(freeze);
  }
  return value;
};
const enemy = (extra = {}) => ({ id: 'enemy-test', kind: 'normal', variant: 'wolf', name: '苍狼妖', x: 400, y: 400, radius: 15, hp: 50, maxHp: 100, slow: 1, stun: 0, knockback: 0, ...extra });
const intersects = (a, b, gap = 0) => a.left < b.right + gap && a.right > b.left - gap && a.top < b.bottom + gap && a.bottom > b.top - gap;

function harness(options = {}) {
  const calls = [], badges = [], stack = [];
  const ctx = { globalAlpha: 1 };
  for (const name of ['beginPath', 'closePath', 'moveTo', 'lineTo', 'quadraticCurveTo', 'bezierCurveTo', 'arc', 'fill', 'stroke', 'fillRect', 'strokeRect', 'clearRect', 'fillText', 'strokeText', 'setTransform', 'translate', 'scale', 'rotate', 'clip', 'drawImage']) {
    ctx[name] = (...args) => {
      for (const value of args) if (typeof value === 'number') assert.ok(Number.isFinite(value), `${name}: non-finite Canvas argument`);
      calls.push({ name, args });
    };
  }
  ctx.save = () => { stack.push(ctx.globalAlpha); calls.push({ name: 'save', args: [] }); };
  ctx.restore = () => { assert.ok(stack.length, 'Canvas restore must be balanced'); ctx.globalAlpha = stack.pop(); calls.push({ name: 'restore', args: [] }); };
  ctx.measureText = text => ({ width: String(text).length * 8 });
  const renderer = new GameRenderer({ width: 0, height: 0, getContext: () => ctx }, { width: 390, height: 844, showHud: false, ...options });
  renderer._view = { left: 0, right: 2000, top: 0, bottom: 2000 };
  const draw = renderer._drawStatusBadge.bind(renderer);
  renderer._drawStatusBadge = (context, descriptor, x, y, width) => {
    badges.push({ glyph: descriptor.glyph, color: descriptor.color, x, y, width, left: x - width / 2, right: x + width / 2, top: y - 8, bottom: y + 8 });
    draw(context, descriptor, x, y, width);
  };
  return {
    ctx, renderer, badges, calls, stack,
    reset() { badges.length = 0; calls.length = 0; },
    draw(enemies, player) {
      this.reset();
      const before = JSON.stringify({ enemies, player });
      renderer._drawStatusBadges(ctx, enemies, player);
      assert.equal(JSON.stringify({ enemies, player }), before, 'status placement mutated its input');
      assert.equal(stack.length, 0);
      return badges.map(item => item.glyph);
    },
  };
}

test('only an active speed multiplier between zero and one produces a slow badge', () => {
  const h = harness();
  const clean = [undefined, null, 0, -1, 1, 1.2, NaN, Infinity, -Infinity];
  for (const slow of clean) {
    assert.deepEqual(h.draw(freeze([enemy({ slow })])), [], `slow=${String(slow)} is not an active slow`);
    assert.equal(h.renderer.stats.statusCandidates, 0);
  }
  for (const slow of [.32, .4, .55, .62, .65, .78, .82, .85, .9]) {
    assert.deepEqual(h.draw(freeze([enemy({ slow })])), ['慢']);
    assert.equal(h.renderer.stats.statusBadges, 1);
  }
  assert.deepEqual(h.draw(freeze([enemy({ slow: 1, nextSlow: .4 })])), [], 'pending nextSlow must not be mistaken for the current speed');
  assert.deepEqual(h.draw(freeze([enemy({ slow: 1, knockback: .25 })])), ['退'], 'normal speed must not swallow knockback feedback');
  h.renderer.dispose();
});

test('real rope slow enters and recovers through nextSlow without changing movement rules', () => {
  const h = harness(), engine = new GameEngine({ stageId: 2, seed: 141, debug: true });
  engine.state.skills = []; engine.spawnAccumulator = -100000;
  Object.assign(engine.state.player, { x: 900, y: 500 });
  const target = engine.spawnEnemy('normal', 0, { name: '苍狼妖', variant: 'wolf' });
  Object.assign(target, { x: 980, y: 500, speed: 40, hp: 100000, maxHp: 100000 });
  engine.update(.01); assert.equal(target.slow, 1); assert.deepEqual(h.draw([target]), []);
  engine.effect({ kind: 'rope', x: target.x, y: target.y, radius: 60, ttl: .02 });
  const observations = [];
  for (let i = 0; i < 3; i += 1) {
    const x = target.x; engine.update(.01);
    observations.push({ slow: target.slow, nextSlow: target.nextSlow, glyphs: h.draw([target]), moved: x - target.x });
  }
  assert.deepEqual(observations.map(item => item.slow), [.65, .65, 1]);
  assert.deepEqual(observations.map(item => item.nextSlow), [1, 1, 1]);
  assert.deepEqual(observations.map(item => item.glyphs), [['慢'], ['慢'], []]);
  observations.forEach(item => close(item.moved, 40 * item.slow * .01, 'badge state agrees with actual speed'));
  assert.equal(engine.state.effects.length, 0);
  engine.dispose(); h.renderer.dispose();
});

test('status priority recovers from stun through burn, bleed, slow and knockback to no badge', () => {
  const h = harness();
  const base = enemy({ stun: 1, burn: { ttl: 1 }, bleeds: [{ tick: 0, ticks: [.1] }], slow: .65, knockback: .2 });
  const cases = [
    [base, '晕'],
    [{ ...base, stun: 0 }, '燃'],
    [{ ...base, stun: 0, burn: { ttl: 0 } }, '血'],
    [{ ...base, stun: 0, burn: { ttl: 0 }, bleeds: [] }, '慢'],
    [{ ...base, stun: 0, burn: { ttl: 0 }, bleeds: [], slow: 1 }, '退'],
    [{ ...base, stun: 0, burn: { ttl: 0 }, bleeds: [], slow: 1, knockback: 0 }, null],
  ];
  for (const [target, glyph] of cases) {
    assert.deepEqual(h.draw(freeze([target])), glyph ? [glyph] : []);
    assert.ok(h.renderer.stats.statusBadges <= 1, 'multiple statuses should not become stacked labels');
  }
  for (const [property, value, glyph] of [['statusText', '燃烧', '燃'], ['debuff', { name: '减速' }, '慢'], ['status', { id: '击退' }, '退']]) {
    assert.deepEqual(h.draw(freeze([enemy({ [property]: value })])), [glyph], 'supported legacy/debug labels normalize to compact glyphs');
  }
  for (const label of ['最终妖王', '妖王', '寅将军']) {
    assert.deepEqual(h.draw(freeze([enemy({ kind: 'boss', name: '寅将军', statusText: label })])), [], 'a Boss nameplate must not produce a duplicate status badge');
  }
  h.renderer.dispose();
});

test('crowded status badges have a twelve-label cap, named-threat priority and non-overlapping bounded slots', () => {
  const h = harness();
  const normals = Array.from({ length: 20 }, (_, i) => enemy({ id: `normal-${i}`, x: 100 + i * 70, y: 500, slow: .65 }));
  const targets = freeze([...normals,
    enemy({ id: 'elite', kind: 'elite', x: 100, y: 700, stun: 1 }),
    enemy({ id: 'boss', kind: 'boss', x: 240, y: 700, burn: { ttl: 1 } }),
  ]);
  h.draw(targets);
  assert.equal(h.renderer.stats.statusCandidates, 22);
  assert.equal(h.renderer.stats.statusBadges, 12);
  assert.equal(h.renderer.stats.statusSuppressed, 10);
  assert.deepEqual(h.badges.slice(0, 2).map(item => item.glyph), ['晕', '燃'], 'elite/Boss badges must be placed before ordinary mobs even if listed last');
  for (let i = 0; i < h.badges.length; i += 1) for (let j = i + 1; j < h.badges.length; j += 1) {
    assert.equal(intersects(h.badges[i], h.badges[j], 3), false, 'badges overlap or lose their three-unit gap');
  }
  assert.ok(h.renderer._statusBadgeRects.length <= 12);
  const crowded = freeze(Array.from({ length: 50 }, (_, i) => enemy({ id: `crowded-${i}`, x: 500, y: 500, slow: .65 })));
  h.draw(crowded);
  assert.equal(h.renderer.stats.statusCandidates, 50);
  assert.equal(h.renderer.stats.statusBadges, 3);
  assert.equal(h.renderer.stats.statusSuppressed, 47);
  const firstY = h.renderer._enemyHealthBarY(crowded[0], 15) - 11;
  assert.deepEqual(h.badges.map(item => item.y), [firstY, firstY - 19, firstY - 38], 'placement may use only three bounded vertical slots');
  for (let i = 0; i < h.badges.length; i += 1) for (let j = i + 1; j < h.badges.length; j += 1) assert.equal(intersects(h.badges[i], h.badges[j], 3), false);
  h.renderer.dispose();
});

test('placement avoids the player and suppresses badges that cannot fit inside the viewport', () => {
  const h = harness(), player = freeze({ x: 500, y: 500, radius: 18 });
  const playerBox = { left: 473, right: 527, top: 500 - 18 * 2.58, bottom: 527 };
  const near = enemy({ x: 500, y: 510, slow: .65 });
  assert.deepEqual(h.draw(freeze([near]), player), ['慢']);
  close(h.badges[0].y, h.renderer._enemyHealthBarY(near, 15) - 11 - 38, 'only the third slot clears the player');
  assert.equal(intersects(h.badges[0], playerBox, 3), false);
  assert.deepEqual(h.draw(freeze([enemy({ x: 500, y: 545, stun: 1 })]), player), []);
  assert.equal(h.renderer.stats.statusSuppressed, 1, 'all three slots intersecting the player are suppressed');
  h.renderer._view = { left: 0, right: 500, top: 0, bottom: 500 };
  for (const [x, y] of [[5, 200], [495, 200], [250, 40], [250, 580]]) {
    assert.deepEqual(h.draw(freeze([enemy({ x, y, slow: .65 })])), [], `out-of-view badge at ${x},${y} must not draw`);
    assert.equal(h.renderer.stats.statusCandidates, 1); assert.equal(h.renderer.stats.statusSuppressed, 1);
  }
  assert.deepEqual(h.draw(freeze([enemy({ x: 250, y: 539, slow: .65 })])), ['慢'], 'a lower-edge badge may move up into a legal slot');
  const placed = h.badges[0];
  assert.ok(placed.left >= 0 && placed.right <= 500 && placed.top >= 0 && placed.bottom <= 500);
  h.renderer.dispose();
});

test('paused rendering is deterministic and never mutates the engine or its frozen snapshot', () => {
  const h = harness(), engine = new GameEngine({ stageId: 2, seed: 145, debug: true });
  engine.state.skills = []; engine.spawnAccumulator = -100000;
  const target = engine.spawnEnemy('normal', 0, { variant: 'wolf' });
  Object.assign(target, { x: 820, y: 820, stun: 1, slow: .65 });
  engine.pause(); const before = engine.getSnapshot(), state = freeze(structuredClone(before));
  h.reset(); h.renderer.render(state, 0);
  const expectedBadges = structuredClone(h.badges), expectedSlots = structuredClone(h.renderer._statusBadgeRects.slice(0, h.renderer.stats.statusBadges));
  assert.equal(expectedBadges.length, 1);
  for (let i = 0; i < 20; i += 1) {
    engine.update(.05, { x: 1 }); h.reset(); h.renderer.render(state, 0);
    assert.deepEqual(h.badges, expectedBadges, 'paused label placement drifted');
    assert.deepEqual(h.renderer._statusBadgeRects.slice(0, h.renderer.stats.statusBadges), expectedSlots);
    assert.deepEqual(engine.getSnapshot(), before); assert.deepEqual(state, before);
    assert.equal(h.stack.length, 0);
  }
  engine.dispose(); h.renderer.dispose();
});

test('badge rectangle storage is numeric, bounded, reused across frames and emptied on dispose', () => {
  const h = harness();
  const targets = freeze(Array.from({ length: 20 }, (_, i) => enemy({ id: `reuse-${i}`, x: 100 + i * 70, y: 500, slow: .65 })));
  h.draw(targets); const buffer = h.renderer._statusBadgeRects, slots = [...buffer];
  assert.equal(buffer.length, 12);
  for (let i = 0; i < 120; i += 1) {
    h.draw(targets); assert.equal(h.renderer._statusBadgeRects, buffer); assert.equal(buffer.length, 12);
    buffer.forEach((slot, index) => {
      assert.equal(slot, slots[index], 'per-frame placement allocated a replacement rectangle');
      assert.ok(Object.values(slot).every(value => typeof value === 'number' && Number.isFinite(value)), 'placement storage must not retain enemies, strings or invalid values');
    });
  }
  h.draw(freeze([enemy()]));
  assert.equal(h.renderer.stats.statusCandidates, 0); assert.equal(h.renderer.stats.statusBadges, 0); assert.equal(h.renderer.stats.statusSuppressed, 0);
  assert.equal(h.renderer._statusBadgeRects, buffer, 'an empty frame should retain reusable storage');
  h.renderer.dispose(); assert.equal(buffer.length, 0);
  const calls = h.calls.length; h.renderer.render({ enemies: targets });
  assert.equal(h.calls.length, calls, 'disposed renderer must not draw');
});

test('tiger health bars clear all 32 authored pose bounds and stun is not drawn twice', () => {
  const contract = JSON.parse(fs.readFileSync(new URL('../assets/enemy-tiger-battle-v1-frames.json', import.meta.url), 'utf8'));
  const image = attachTigerFrames({ complete: true, width: 1774, height: 887, naturalWidth: 1774, naturalHeight: 887 }, contract);
  const h = harness({ battleArtMode: 'authoredFrames', enemyImages: { tiger: image } });
  const healthBars = []; let stars = 0, poseBoundsChecked = 0, livingDrawsChecked = 0;
  const drawHealthBar = h.renderer._drawHealthBar.bind(h.renderer);
  h.renderer._drawHealthBar = (ctx, x, y, width, ratio, color) => { healthBars.push({ x, y, width }); drawHealthBar(ctx, x, y, width, ratio, color); };
  h.renderer._drawStatusStars = () => { stars += 1; };
  for (const radius of [7, 15, 30, 72]) {
    for (const [state, sequence] of Object.entries(contract.states)) {
      for (let frameIndex = 0; frameIndex < sequence.length; frameIndex += 1) {
        const target = freeze(enemy({ kind: 'normal', variant: 'tiger', battleSpriteId: TIGER_SPRITE_ID, radius, x: 500, y: 800,
          animationState: state, frameIndex, animationFrames: sequence.length, stun: 1 }));
        const frame = tigerDrawFrame(image, state, frameIndex, radius);
        const barY = h.renderer._enemyHealthBarY(target, radius), barWidth = radius * 2.3, barHeight = Math.max(3, Math.max(20, barWidth) * .08);
        close(barY, target.y - radius * 3.05, 'stable tiger head anchor');
        assert.ok(barY + barHeight < target.y + frame.dy, `${state}:${frameIndex} radius ${radius}: health bar enters the authored image bounds`);
        poseBoundsChecked += 1;
        // Death effects do not draw health bars. Their four pose bounds are
        // still included above to verify the complete atlas envelope.
        if (state === 'death') continue;
        healthBars.length = 0; h.reset();
        h.renderer._drawEnemy(h.ctx, target, { x: 900, y: 900 }, { ink: '#071b24', accent: '#f44a48', sticker: '#ffe84e' });
        assert.equal(healthBars.length, 1); close(healthBars[0].y, barY, 'actual health-bar command');
        assert.equal(stars, 0, 'stun must not add a second star ring over the authored head');
        assert.equal(h.stack.length, 0); livingDrawsChecked += 1;
      }
    }
  }
  assert.equal(poseBoundsChecked, 32 * 4); assert.equal(livingDrawsChecked, 28 * 4);
  const target = enemy({ variant: 'tiger', battleSpriteId: TIGER_SPRITE_ID, stun: 1, x: 400, y: 400 });
  assert.deepEqual(h.draw(freeze([target])), ['晕']);
  assert.ok(h.badges[0].bottom <= h.renderer._enemyHealthBarY(target, 15) - 3, 'compact status badge keeps a gap above the health bar');
  h.renderer.dispose();
});

let failures = 0;
for (const { name, run } of tests) {
  try { run(); results.push({ name, result: 'PASS' }); console.log(`PASS ${name}`); }
  catch (error) { failures += 1; results.push({ name, result: 'FAIL', message: error.message }); console.error(`FAIL ${name}\n${error.stack}`); }
}
const report = {
  ok: failures === 0, generatedAt: new Date().toISOString(), tests: results,
  totals: { tests: tests.length, passed: tests.length - failures, failed: failures, maxStatusBadges: 12, placementCandidatesPerBadge: 3, tigerAtlasPoses: 32, tigerPoseBoundsChecks: 128, tigerLivingDrawChecks: 112, rectangleReuseFrames: 120 },
  runtime: { kind: 'Node.js with deterministic Canvas mock', nodeVersion: process.version },
  boundary: { realBrowser: false, pixelRendering: false, gpuPerformance: false, wechatDevice: false },
  note: 'Verifies status semantics, bounded placement, Canvas calls and authored crop bounds; not browser pixels, subjective mobile readability, GPU performance or WeChat device behavior.',
};
const output = new URL('../../evidence/current/status-badges/', import.meta.url);
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(new URL('node.json', output), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (failures) process.exitCode = 1;
