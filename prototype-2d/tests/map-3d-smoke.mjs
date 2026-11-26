// Map 3D smoke (2026-11-26): the high-angle 3/4 map treatment — mask-driven
// relief faces + SE shadows baked under the actors, altitude haze, squashed
// SE cast shadows under the hero/enemies, and a parallax foreground veil
// drawn after the actors — must be visible in a real render, must reuse the
// collision mask exactly, and must not change collision or the vector path's
// zero-image-draws contract. Uses the same recording-Canvas pattern as
// render-smoke; no browser, no pixels.
import assert from 'node:assert/strict';
import { GameRenderer } from '../src/renderer.js';
import { NativeGame } from '../src/native-ui.js';
import { sceneBlockedCells, sceneCircleBlocked } from '../src/scene-collision.js';

const METHODS = ['beginPath', 'closePath', 'moveTo', 'lineTo', 'quadraticCurveTo',
  'bezierCurveTo', 'arc', 'fill', 'stroke', 'fillRect', 'strokeRect', 'clearRect',
  'fillText', 'setTransform', 'translate', 'scale', 'rotate', 'clip', 'drawImage'];
const DEEP = 'rgba(11,74,77,'; // forest theme.deep #0b4a4d
const PLAYER_SHADOW = 'rgba(36,26,18,0.5)';
const ENEMY_SHADOW = 'rgba(36,26,18,0.45)';

function mockCanvas(withGradients = true) {
  const ops = [];
  const ctx = { fillStyle: null, strokeStyle: null, globalAlpha: 1, font: '', textAlign: '', textBaseline: '' };
  for (const op of METHODS) {
    ctx[op] = (...args) => {
      ops.push({ op, args, fillStyle: ctx.fillStyle, globalAlpha: ctx.globalAlpha });
      for (const a of args) if (typeof a === 'number') assert.ok(Number.isFinite(a), `${op}: non-finite arg`);
      if (op === 'arc') assert.ok(args[2] >= 0, 'arc radius must be >= 0');
    };
  }
  ctx.save = () => { ops.push({ op: 'save', args: [] }); ctx._stack = (ctx._stack || 0) + 1; };
  ctx.restore = () => { ops.push({ op: 'restore', args: [] }); ctx._stack = (ctx._stack || 0) - 1; assert.ok(ctx._stack >= 0, 'unbalanced restore'); };
  if (withGradients) {
    ctx.createLinearGradient = (...args) => { ops.push({ op: 'createLinearGradient', args }); return { addColorStop() {} }; };
    ctx.createRadialGradient = (...args) => { ops.push({ op: 'createRadialGradient', args }); return { addColorStop() {} }; };
  }
  const canvas = { width: 0, height: 0, getContext: () => ctx };
  return { canvas, ctx, ops };
}

const paintedImage = { naturalWidth: 1024, naturalHeight: 1024, complete: true };
const makeState = (x, y, mapAssetKey = null, theme = 'forest') => ({
  status: 'playing', time: 154, stage: { theme, ...(mapAssetKey ? { mapAssetKey } : {}) }, character: { id: 'wukong' },
  player: { x, y, radius: 18, hp: 145, maxHp: 145, xp: 7, xpNext: 30, level: 4, facing: Math.PI, invulnerable: 0 },
  enemies: [{ id: 1, x: x + 40, y: y + 30, radius: 15, kind: 'normal', name: 'wolf', variant: 'wolf', hp: 50, maxHp: 100, stun: 0, flash: 0 }],
  gems: [], projectiles: [], effects: [], damageNumbers: [],
});
const render = (mapImages, x, y, withGradients = true, mapAssetKey = null, theme = 'forest') => {
  const { canvas, ctx, ops } = mockCanvas(withGradients);
  const renderer = new GameRenderer(canvas, { width: 390, height: 844, pixelRatio: 1, showHud: false, ...(mapImages ? { mapImages } : {}) });
  const originalRandom = Math.random;
  Math.random = () => { throw new Error('renderer must not use Math.random per frame'); };
  // dt 0 snaps the camera straight to its target, so veil parallax offsets
  // are exact instead of one smoothing step in from the spawn centre.
  try { renderer.render(makeState(x, y, mapAssetKey, theme), 0); } finally { Math.random = originalRandom; }
  assert.equal(ctx._stack || 0, 0, 'save/restore must balance');
  return { renderer, ops };
};
const reliefRects = ops => ops.filter(o => o.op === 'fillRect' && typeof o.fillStyle === 'string' && o.fillStyle.startsWith(DEEP));
const veilDraws = ops => ops.filter(o => o.op === 'drawImage' && o.args.length === 9 && o.args[7] === 1800 && o.args[8] === 44 && o.args[6] >= 1580);
const results = [];
const check = (name, fn) => { try { fn(); results.push(name); } catch (e) { console.error(`FAIL ${name}: ${e.message}`); process.exitCode = 1; } };

check('relief faces+shadows draw in the painted path, under the actors', () => {
  const { renderer, ops } = render({ forest: { back: paintedImage } }, 900, 200);
  assert.ok(reliefRects(ops).length >= 20, `expected relief rects, got ${reliefRects(ops).length}`);
  assert.ok(renderer.mapAssetDraws >= 1, 'painted map still draws its image');
});

check('relief faces+shadows draw in the vector path without image draws', () => {
  const { renderer, ops } = render(null, 900, 200);
  assert.ok(reliefRects(ops).length >= 20, `expected relief rects, got ${reliefRects(ops).length}`);
  assert.equal(renderer.mapAssetDraws, 0, 'vector map must stay image-free');
});

check('altitude haze uses a gradient when available, degrades without one', () => {
  const { ops } = render({ forest: { back: paintedImage } }, 900, 900);
  assert.ok(ops.some(o => o.op === 'createLinearGradient'), 'expected a gradient for the haze');
  const noGrad = render({ forest: { back: paintedImage } }, 900, 900, false);
  assert.ok(reliefRects(noGrad.ops).length >= 20, 'relief must not depend on gradients');
});

check('actors get squashed SE cast shadows', () => {
  const { ops } = render({ forest: { back: paintedImage } }, 900, 900);
  assert.ok(ops.some(o => o.op === 'fill' && o.fillStyle === PLAYER_SHADOW), 'hero shadow missing');
  assert.ok(ops.some(o => o.op === 'fill' && o.fillStyle === ENEMY_SHADOW), 'enemy shadow missing');
});

check('foreground veil draws after the actors only when the south band is in view', () => {
  const south = render({ forest: { back: paintedImage } }, 900, 1700);
  const veil = veilDraws(south.ops);
  assert.ok(veil.length >= 1, `expected veil slices near the south edge, got ${veil.length}`);
  const shadowIdx = south.ops.findIndex(o => o.op === 'fill' && o.fillStyle === PLAYER_SHADOW);
  const veilIdx = south.ops.findIndex(o => o.op === 'drawImage' && o.args.length === 9 && o.args[7] === 1800 && o.args[8] === 44);
  assert.ok(shadowIdx >= 0 && veilIdx > shadowIdx, 'veil must draw after the actors');
  const north = render({ forest: { back: paintedImage } }, 900, 200);
  assert.equal(veilDraws(north.ops).length, 0, 'veil must stay off when its band is off-view');
});

check('foreground veil parallaxes with the camera', () => {
  const west = render({ forest: { back: paintedImage } }, 500, 1700);
  const east = render({ forest: { back: paintedImage } }, 1300, 1700);
  const dx = ops => veilDraws(ops)[0].args[5];
  assert.notEqual(dx(west.ops), dx(east.ops), 'veil offset must follow the camera');
  assert.ok(dx(west.ops) >= -6 && dx(east.ops) <= 18, `veil offset in range, got ${dx(west.ops)} / ${dx(east.ops)}`);
});

check('relief geometry is exactly the collision mask', () => {
  const cells = sceneBlockedCells('forest');
  assert.ok(cells.length > 1000, `forest mask should have many blocked cells, got ${cells.length}`);
  for (let i = 0; i < cells.length; i += 37) {
    const [c, r] = cells[i];
    assert.equal(sceneCircleBlocked('forest', c * 15 + 7, r * 15 + 7, 1, 1800), true, `cell ${c},${r} must be blocked`);
  }
  assert.equal(sceneCircleBlocked('forest', 900, 900, 14, 1800), false, 'spawn plaza stays open');
  assert.equal(sceneCircleBlocked('forest', 900, 110, 14, 1800), true, 'north cliffs stay blocked');
});

check('doublefork relief uses the doublefork mask', () => {
  const { ops } = render({ doublefork: { back: { naturalWidth: 941, naturalHeight: 1672, complete: true } } }, 900, 900, true, 'doublefork');
  assert.ok(reliefRects(ops).length >= 20, `expected doublefork relief rects, got ${reliefRects(ops).length}`);
});

// Regression (2026-11-26 browser acceptance): the web shell pre-seeds
// mapImages with empty placeholder objects {forest:{},temple:{},doublefork:{}}.
// The old imageReady counted a plain {} as ready (complete === undefined),
// so stage 2 temple took the painted path with no image — drawImage threw,
// the map rendered as flat paper purple, and the vector fallback never ran.
// An empty placeholder must fall back to the vector plate (sky wash .38,
// scatter, relief), and a real painted image must take the painted path.
const TEMPLE_SKY_WASH = 'rgba(118,82,213,0.38)'; // temple sky #7652d5
const TEMPLE_DEEP = 'rgba(36,21,82,'; // temple deep #241552
check('empty placeholder mapImages fall back to the vector plate', () => {
  const { renderer, ops } = render({ forest: {}, temple: {}, doublefork: {} }, 900, 900, true, null, 'temple');
  assert.equal(renderer.mapAssetDraws, 0, 'no painted image must draw');
  assert.ok(ops.some(o => o.op === 'fillRect' && o.fillStyle === TEMPLE_SKY_WASH), 'vector plate sky wash must draw');
  const relief = ops.filter(o => o.op === 'fillRect' && typeof o.fillStyle === 'string' && o.fillStyle.startsWith(TEMPLE_DEEP));
  assert.ok(relief.length >= 20, `expected temple relief rects, got ${relief.length}`);
});

check('real painted temple image takes the painted path', () => {
  const { renderer, ops } = render({ temple: { back: paintedImage } }, 900, 900, true, null, 'temple');
  assert.ok(renderer.mapAssetDraws >= 1, 'painted temple image must draw');
  assert.ok(!ops.some(o => o.op === 'fillRect' && o.fillStyle === TEMPLE_SKY_WASH), 'vector plate must not draw when the painting is present');
});

// Regression (2026-11-26): native-app.js attaches the scene loader to the
// game instance (game.loadMapScene), while startRun only consulted
// this.platform.loadMapScene — which the platform options object never
// carries — so no theme scene was ever requested except the eagerly loaded
// doublefork. startRun must call the instance-attached loader.
check('startRun calls the scene loader attached to the game instance', () => {
  const audio = { play() {}, startMusic() {}, stopMusic() {}, setMuted() {}, dispose() {} };
  const noop = () => {};
  const ctx2 = new Proxy({
    measureText(v) { return { width: String(v).length * 8 }; },
    createLinearGradient() { return { addColorStop() {} }; },
    createRadialGradient() { return { addColorStop() {} }; },
    save: noop, restore: noop,
  }, {
    get(t, k) { if (k in t) return t[k]; return () => {}; },
    set(t, k, v) { t[k] = v; return true; },
  });
  const canvas2 = { width: 0, height: 0, getContext() { return ctx2; } };
  const loaded = [];
  const game2 = new NativeGame(canvas2, {
    width: 390, height: 844, pixelRatio: 1, now: () => 1000, audio,
    load: () => null, save: () => {},
    requestFrame() { return 0; }, cancelFrame() {},
  });
  game2.loadMapScene = (key) => { loaded.push(key); };
  game2.stageId = 2; // 出胎几杀, temple theme, no mapAssetKey
  game2.startRun();
  assert.deepEqual(loaded, ['temple']);
});

for (const name of results) console.log(`PASS ${name}`);
console.log(`MAP-3D PASS: ${results.length} checks`);
