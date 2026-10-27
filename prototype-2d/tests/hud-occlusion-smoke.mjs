import assert from 'node:assert/strict';
import fs from 'node:fs';
import { GameRenderer } from '../src/renderer.js';
import { NativeGame, HUD_BAND_TOP } from '../src/native-ui.js';

const calls = [], stack = [];
const ctx = { globalAlpha: 1, fillStyle: '#000', strokeStyle: '#000', lineWidth: 1, font: '10px sans-serif', textAlign: 'start', textBaseline: 'alphabetic' };
const style = () => Object.fromEntries(['globalAlpha', 'fillStyle', 'strokeStyle', 'lineWidth', 'font', 'textAlign', 'textBaseline'].map(key => [key, ctx[key]]));
const record = (name, args) => { for (const value of args) if (typeof value === 'number') assert.ok(Number.isFinite(value), `${name}: non-finite Canvas argument`); calls.push({ name, args, ...style() }); };
for (const name of ['beginPath', 'closePath', 'moveTo', 'lineTo', 'quadraticCurveTo', 'bezierCurveTo', 'arc', 'rect', 'ellipse', 'fill', 'stroke', 'fillRect', 'strokeRect', 'fillText', 'strokeText', 'setTransform', 'translate', 'scale', 'rotate', 'clip', 'drawImage']) ctx[name] = (...args) => record(name, args);
ctx.save = () => { stack.push(style()); record('save', []); };
ctx.restore = () => { assert.ok(stack.length, 'unbalanced Canvas restore'); Object.assign(ctx, stack.pop()); record('restore', []); };
ctx.measureText = text => ({ width: String(text).length * 10, actualBoundingBoxLeft: 0, actualBoundingBoxRight: String(text).length * 5, actualBoundingBoxAscent: 9, actualBoundingBoxDescent: 3 });
ctx.createLinearGradient = () => ({ addColorStop: () => {} });
ctx.createRadialGradient = () => ({ addColorStop: () => {} });
const canvas = { width: 0, height: 0, getContext: () => ctx };
const renderer = new GameRenderer(canvas, { width: 390, height: 844, pixelRatio: 2, showHud: false });
renderer.camera = { x: 900, y: 900 };
renderer._view = { left: 705, top: 478, right: 1095, bottom: 1322 };

const label = (y) => ({ x: 900, y, damage: 7, text: '7', size: 17, ttl: 1, maxTtl: 1 });
renderer.setHudScreenBounds({ left: 0, right: 390, top: 135, bottom: 689 });
renderer._updateHudOcclusionRects(1);
assert.equal(renderer._hudOcclusionRects.length, 2, 'top and bottom HUD bands should be bounded');
const top = renderer._hudOcclusionRects[0];
assert.equal((top.top + top.bottom) / 2, (478 + 613) / 2, 'CSS HUD bounds convert through camera/zoom without DPR scaling');

renderer._drawCombatFeedback(ctx, { damageNumbers: [label(560)] }, [], { avoidHud: true });
assert.equal(renderer.stats.damageHudCandidates, 1);
assert.equal(renderer.stats.damageHudMoved, 1, 'label in top HUD band should move into the world safe band');
assert.equal(renderer.stats.damageHudUnresolved, 0);
assert.ok(calls.some(call => call.name === 'translate' && call.args[1] > 560), 'moved label should be below the top HUD band');
assert.equal(stack.length, 0, 'Canvas stack leaked after HUD avoidance');

calls.length = 0;
renderer.setHudScreenBounds({ top: 900, bottom: -1 });
renderer._updateHudOcclusionRects(1);
assert.equal(renderer._hudOcclusionRects.length, 1, 'invalid safe band fails closed to one full-screen obstacle');
renderer._drawCombatFeedback(ctx, { damageNumbers: [label(900)] }, [], { avoidHud: true });
assert.equal(renderer.stats.damageHudCandidates, 1);
assert.equal(renderer.stats.damageHudMoved, 0);
assert.equal(renderer.stats.damageHudUnresolved, 1, 'full-screen invalid HUD bounds must retain the label and report unresolved');
assert.equal(stack.length, 0);

renderer.dispose();
assert.equal(renderer._hudOcclusionRects.length, 0);

// Exercise the full NativeGame -> render path at production zoom and resize,
// with enemies underneath both HUD bands rather than isolated numbers only.
const game = new NativeGame(canvas, { width: 390, height: 844, pixelRatio: 2,
  requestFrame: () => 1, cancelFrame: () => {}, now: () => 1000 });
game.startRun(); game.running = false; game.renderDt = 0;
const productionCases = [];
for (const sample of [
  { width: 390, height: 844, dpr: 2, safe: { top: 0, bottom: 844 } },
  { width: 390, height: 844, dpr: 2, safe: { top: 44, bottom: 810 } },
  { width: 360, height: 640, dpr: 1, safe: { top: 24, bottom: 616 } },
  { width: 390, height: 844, dpr: 2, safe: { top: 0, bottom: 844 } },
]) {
  const { width, height, dpr, safe } = sample;
  const r = game.renderer, state = game.engine.state;
  state.enemies = []; state.damageNumbers = [];
  game.resize(width, height, dpr, safe);
  const topY = game.top + HUD_BAND_TOP, bottomY = height - game.bottom - 90;
  const view = { ...r._view };
  const fromScreen = (x, y) => ({ x: view.left + x / width * (view.right - view.left), y: view.top + y / height * (view.bottom - view.top) });
  const toScreen = rect => ({ left: (rect.left - view.left) / (view.right - view.left) * width,
    right: (rect.right - view.left) / (view.right - view.left) * width,
    top: (rect.top - view.top) / (view.bottom - view.top) * height,
    bottom: (rect.bottom - view.top) / (view.bottom - view.top) * height });
  state.damageNumbers = [[width / 2, 65], [width / 2, height - 20], [52, (topY + bottomY) / 2]].map(([x, y], i) => ({
    ...fromScreen(x, y), text: String(701 + i), damage: 701 + i, size: 17, ttl: 1, maxTtl: 1,
  }));
  state.enemies = state.damageNumbers.slice(0, 2).map((label, i) => ({ id: `hud-${i}`, x: label.x, y: label.y,
    radius: 17, hp: 50, maxHp: 100, kind: 'normal', variant: 'tiger', battleSpriteId: 'tiger-normal-v1',
    animationState: 'idle', animationFrames: 8, frameIndex: 0, facing: 0 }));
  const before = JSON.stringify(state);
  calls.length = 0; game.draw();
  const rects = r._damageLabelRects.slice(0, 3).map(toScreen);
  assert.equal(r.stats.damageHudCandidates, 2);
  assert.equal(r.stats.damageHudMoved, 2, 'both enemy/HUD crossings need a playable candidate');
  assert.equal(r.stats.damageHudUnresolved, 0);
  assert.equal(r.stats.damageEnemyCandidates, 2);
  assert.equal(r.stats.damageEnemyMoved, 2, 'HUD movement must also clear enemy geometry');
  assert.equal(r.stats.damageEnemyUnresolved, 0);
  assert.ok(rects.every(rect => rect.left >= 0 && rect.right <= width && rect.top >= topY && rect.bottom <= bottomY), 'complete number envelope stays inside actual CSS safe band');
  assert.ok(r._damageLabelRects.slice(0, 3).every(rect => r._damageEnemyRects.every(enemy => !r._rectsOverlap(rect, enemy, 3))));
  assert.equal(calls.filter(call => call.name === 'fillText' && ['701', '702', '703'].includes(call.args[0])).length, 3);
  assert.ok(Math.abs((rects[2].left + rects[2].right) / 2 - 52) < 1e-6, 'safe label does not move');
  assert.equal(canvas.width, width * dpr); assert.equal(canvas.height, height * dpr);
  const firstRects = JSON.stringify(r._damageLabelRects);
  game.draw();
  assert.equal(JSON.stringify(r._damageLabelRects), firstRects);
  assert.equal(JSON.stringify(state), before, 'rendering must not change simulation');
  assert.equal(stack.length, 0);
  productionCases.push({ ...sample, zoom: r._zoom(state.player), safeBand: { top: topY, bottom: bottomY }, rects,
    damageHudCandidates: r.stats.damageHudCandidates, damageHudMoved: r.stats.damageHudMoved, damageHudUnresolved: r.stats.damageHudUnresolved });
}

// A finite zero is an absolute safe-area edge, not a missing value. If it
// leaves no playable band, the renderer must retain labels and report the
// invalid boundary instead of inventing room below it. Nullish/non-finite
// platform values still use the normal viewport fallback.
const boundaryCases = [];
for (const sample of [
  { name: 'explicit-zero', safe: { top: 24, bottom: 0 }, inset: 640, invalid: true },
  { name: 'negative-edge', safe: { top: 24, bottom: -1 }, inset: 640, invalid: true },
  { name: 'inverted-edges', safe: { top: 600, bottom: 320 }, inset: 320, invalid: true },
  { name: 'missing-bottom', safe: { top: 24 }, inset: 12, invalid: false },
  { name: 'null-bottom', safe: { top: 24, bottom: null }, inset: 12, invalid: false },
  { name: 'non-finite-bottom', safe: { top: 24, bottom: NaN }, inset: 12, invalid: false },
  { name: 'infinite-bottom', safe: { top: 24, bottom: Infinity }, inset: 12, invalid: false },
  { name: 'restored-safe-area', safe: { top: 24, bottom: 616 }, inset: 24, invalid: false },
]) {
  const r = game.renderer, state = game.engine.state;
  state.enemies = []; state.damageNumbers = [];
  game.resize(360, 640, 1, sample.safe);
  assert.equal(game.bottom, sample.inset, `${sample.name}: bottom edge must not be replaced by a truthiness fallback`);
  assert.equal(r._hudScreenBounds.invalid, sample.invalid, `${sample.name}: invalid HUD flag`);
  const view = { ...r._view };
  state.damageNumbers = [{ x: view.left + 52 / 360 * (view.right - view.left),
    y: view.top + .5 * (view.bottom - view.top), text: '801', damage: 7, size: 17, ttl: 1, maxTtl: 1 }];
  const before = JSON.stringify(state);
  calls.length = 0; game.draw();
  const rect = r._damageLabelRects[0];
  const center = { x: ((rect.left + rect.right) / 2 - view.left) / (view.right - view.left) * 360,
    y: ((rect.top + rect.bottom) / 2 - view.top) / (view.bottom - view.top) * 640 };
  assert.ok(Math.abs(center.x - 52) < 1e-6 && Math.abs(center.y - 320) < 1e-6, `${sample.name}: original label position retained`);
  assert.equal(r.stats.damageHudCandidates, sample.invalid ? 1 : 0);
  assert.equal(r.stats.damageHudMoved, 0);
  assert.equal(r.stats.damageHudUnresolved, sample.invalid ? 1 : 0);
  assert.equal(r._hudOcclusionRects.length, sample.invalid ? 1 : 2);
  assert.equal(calls.filter(call => call.name === 'fillText' && call.args[0] === '801').length, 1);
  if (sample.invalid) {
    const fullScreen = r._hudOcclusionRects[0];
    for (const edge of ['left', 'top', 'right', 'bottom']) assert.ok(Math.abs(fullScreen[edge] - view[edge]) < 1e-6, `${sample.name}: full-screen fail-closed obstacle`);
  }
  const firstRects = JSON.stringify(r._damageLabelRects);
  game.draw();
  assert.equal(JSON.stringify(r._damageLabelRects), firstRects);
  assert.equal(JSON.stringify(state), before);
  assert.equal(stack.length, 0);
  boundaryCases.push({ name: sample.name, inputBottom: String(sample.safe.bottom), bottomInset: game.bottom,
    hudBounds: { ...r._hudScreenBounds }, center, damageHudUnresolved: r.stats.damageHudUnresolved });
}
game.dispose();
assert.equal(stack.length, 0);
const report = {
  generatedAt: new Date().toISOString(),
  result: 'PASS',
  tests: [
    'CSS-pixel HUD bounds convert to finite world rectangles without DPR multiplication',
    'top-band damage labels move into the playable band',
    'invalid HUD bounds fail closed and retain unresolved labels',
    'Canvas save/restore remains balanced and dispose clears HUD buffers',
    'production NativeGame resize and zoom resolve combined enemy/HUD collisions at both screen edges',
    'four production viewport/safe-area/DPR cases preserve simulation, safe labels and repeated layout',
    'eight safe-area boundary cases preserve finite zero, nullish fallback, fail-closed labels and recovery',
  ],
  productionCases,
  boundaryCases,
  viewport: { cssWidth: 390, cssHeight: 844, pixelRatio: 2 },
  boundary: {
    realBrowser: false,
    pixelRendering: false,
    gpuPerformance: false,
    wechatDevice: false,
  },
  note: 'Node deterministic Canvas-command smoke only; this is finite HUD-band avoidance, not a pixel/global/modal occlusion guarantee.',
};
fs.mkdirSync('evidence/current/hud-occlusion', { recursive: true });
fs.writeFileSync('evidence/current/hud-occlusion/node.json', JSON.stringify(report, null, 2));
console.log('HUD OCCLUSION PASS: bounded CSS HUD conversion, finite avoidance and fail-closed invalid bounds');
