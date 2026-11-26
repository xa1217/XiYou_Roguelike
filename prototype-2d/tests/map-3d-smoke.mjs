// Map 3D smoke (2026-11-26, third pass): the high-angle 3/4 map treatment
// is now the painted scene itself plus two real, visible effects - squashed
// SE cast shadows under the hero/enemies, and an altitude haze that darkens
// the playable ground toward the north. The mask-derived relief faces and
// the foreground veil are GONE (removed, not tuned): the relief drew
// geometry along long straight mask edges the painted art does not follow,
// so it read as a dark purple band no matter how soft the alpha (browser
// rounds 2 and 3); the veil only re-sampled the flat ground it covered, so
// it could never occlude anything. The camera overshoot past the world rim
// is continued with the painting's own edge tone (a near band of the
// painting's 40u edge squashed to at most 34u, then a flat fill in the
// edge's sampled mean colour) instead of a solid block of theme paper
// purple or a stretched band that smeared into vertical streaks. The test
// pins the removals (zero deep fillRects, zero veil slices) and the new
// design (haze gradient shape, overshoot near band + edge fill), and keeps
// the collision-mask and loader-regression checks. Uses the same
// recording-Canvas pattern as render-smoke; no browser, no pixels.
import assert from 'node:assert/strict';
import { GameRenderer } from '../src/renderer.js';
import { NativeGame } from '../src/native-ui.js';
import { sceneBlockedCells, sceneCircleBlocked } from '../src/scene-collision.js';

const METHODS = ['beginPath', 'closePath', 'moveTo', 'lineTo', 'quadraticCurveTo',
  'bezierCurveTo', 'arc', 'fill', 'stroke', 'fillRect', 'strokeRect', 'clearRect',
  'fillText', 'setTransform', 'translate', 'scale', 'rotate', 'clip', 'drawImage'];
const FOREST_DEEP = 'rgba(11,74,77,'; // forest theme.deep #0b4a4d
const TEMPLE_DEEP = 'rgba(36,21,82,'; // temple theme.deep #241552
const PLAYER_SHADOW = 'rgba(36,26,18,0.5)';
const ENEMY_SHADOW = 'rgba(36,26,18,0.45)';

function mockCanvas(withGradients = true) {
  const ops = [];
  const gradients = [];
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
    const makeGradient = (...args) => {
      const g = { args, stops: [], addColorStop(offset, color) { this.stops.push([offset, color]); } };
      gradients.push(g);
      ops.push({ op: 'createLinearGradient', args });
      return g;
    };
    ctx.createLinearGradient = makeGradient;
    ctx.createRadialGradient = (...args) => { ops.push({ op: 'createRadialGradient', args }); return { addColorStop() {} }; };
  }
  const canvas = { width: 0, height: 0, getContext: () => ctx };
  return { canvas, ctx, ops, gradients };
}

const paintedImage = { naturalWidth: 1024, naturalHeight: 1024, complete: true };
const makeState = (x, y, mapAssetKey = null, theme = 'forest') => ({
  status: 'playing', time: 154, stage: { theme, ...(mapAssetKey ? { mapAssetKey } : {}) }, character: { id: 'wukong' },
  player: { x, y, radius: 18, hp: 145, maxHp: 145, xp: 7, xpNext: 30, level: 4, facing: Math.PI, invulnerable: 0 },
  enemies: [{ id: 1, x: x + 40, y: y + 30, radius: 15, kind: 'normal', name: 'wolf', variant: 'wolf', hp: 50, maxHp: 100, stun: 0, flash: 0 }],
  gems: [], projectiles: [], effects: [], damageNumbers: [],
});
const render = (mapImages, x, y, withGradients = true, mapAssetKey = null, theme = 'forest') => {
  const { canvas, ctx, ops, gradients } = mockCanvas(withGradients);
  const renderer = new GameRenderer(canvas, { width: 390, height: 844, pixelRatio: 1, showHud: false, ...(mapImages ? { mapImages } : {}) });
  const originalRandom = Math.random;
  Math.random = () => { throw new Error('renderer must not use Math.random per frame'); };
  // dt 0 snaps the camera straight to its target, so view-relative offsets
  // are exact instead of one smoothing step in from the spawn centre.
  try { renderer.render(makeState(x, y, mapAssetKey, theme), 0); } finally { Math.random = originalRandom; }
  assert.equal(ctx._stack || 0, 0, 'save/restore must balance');
  return { renderer, ops, gradients };
};
// The removed relief layer drew its faces/shadows as fillRects in the
// theme's deep colour (alpha .5-.62); the old overshoot filled the margin
// the same way (.85/.92). The haze is a gradient fill, the rim is a stroke
// and the vector plate's deep shapes are path fills - so a deep *fillRect*
// can only be relief or the old overshoot dark fill, both of which are gone.
const deepFillRects = (ops, prefix) => ops.filter(o => o.op === 'fillRect' && typeof o.fillStyle === 'string' && o.fillStyle.startsWith(prefix));
const deepFillRectsAbove = (ops, prefix, minAlpha) => deepFillRects(ops, prefix).filter(o => {
  const m = /rgba\([^,]+,[^,]+,[^,]+,([0-9.]+)\)/.exec(o.fillStyle);
  return o.args[1] < 0 && m && Number(m[1]) >= minAlpha;
});
// Veil slices: 9-arg drawImage, full world width, one 44u slice tall.
const veilSlices = ops => ops.filter(o => o.op === 'drawImage' && o.args.length === 9 && o.args[7] === 1800 && o.args[8] === 44);
// Overshoot near band: 9-arg drawImage whose dest sits above the world
// edge (dy < 0) and is at most 34u tall (the 40u edge squashed, no stretch).
const overshootNearBands = ops => ops.filter(o => o.op === 'drawImage' && o.args.length === 9 && o.args[6] < 0 && o.args[8] > 0 && o.args[8] <= 34);
// Overshoot far fill: a fillRect in the sampled edge colour above y=0.
const edgeFills = (ops, color) => ops.filter(o => o.op === 'fillRect' && o.fillStyle === color && o.args[1] < 0);
const results = [];
const check = (name, fn) => { try { fn(); results.push(name); } catch (e) { console.error(`FAIL ${name}: ${e.message}`); process.exitCode = 1; } };

check('relief is gone: no deep fillRects in the painted path', () => {
  const { renderer, ops } = render({ forest: { back: paintedImage } }, 900, 200);
  assert.equal(deepFillRects(ops, FOREST_DEEP).length, 0, `expected zero relief rects, got ${deepFillRects(ops, FOREST_DEEP).length}`);
  assert.ok(renderer.mapAssetDraws >= 1, 'painted map still draws its image');
});

check('relief is gone: no deep fillRects in the vector path', () => {
  const { renderer, ops } = render(null, 900, 200);
  assert.equal(deepFillRects(ops, FOREST_DEEP).length, 0, `expected zero relief rects, got ${deepFillRects(ops, FOREST_DEEP).length}`);
  assert.equal(renderer.mapAssetDraws, 0, 'vector map must stay image-free');
});

check('relief is gone: no deep fillRects for temple', () => {
  const { ops } = render({ temple: { back: paintedImage } }, 900, 200, true, null, 'temple');
  assert.equal(deepFillRects(ops, TEMPLE_DEEP).length, 0, `expected zero temple relief rects, got ${deepFillRects(ops, TEMPLE_DEEP).length}`);
});

check('altitude haze is a 0..1200 gradient peaking on the north ground', () => {
  const { ops, gradients } = render({ forest: { back: paintedImage } }, 900, 900);
  const haze = gradients.find(g => g.args.join(',') === '0,0,0,1200');
  assert.ok(haze, `expected a 0..1200 haze gradient, got ${JSON.stringify(gradients.map(g => g.args))}`);
  assert.deepEqual(haze.stops, [[0, 'rgba(11,74,77,0.14)'], [350 / 1200, 'rgba(11,74,77,0.32)'], [1, 'rgba(11,74,77,0)']], 'haze must peak at y=350 on the ground north edge and fade by y=1200');
  assert.ok(ops.some(o => o.op === 'fillRect' && o.fillStyle === haze && o.args.join(',') === '0,0,1800,1200'), 'haze gradient must cover the world rect 0,0,1800,1200');
  const noGrad = render({ forest: { back: paintedImage } }, 900, 900, false);
  assert.equal(noGrad.gradients.length, 0, 'no gradients without gradient support');
  assert.ok(noGrad.renderer.mapAssetDraws >= 1, 'render must not depend on gradients');
});

check('actors get squashed SE cast shadows', () => {
  const { ops } = render({ forest: { back: paintedImage } }, 900, 900);
  assert.ok(ops.some(o => o.op === 'fill' && o.fillStyle === PLAYER_SHADOW), 'hero shadow missing');
  assert.ok(ops.some(o => o.op === 'fill' && o.fillStyle === ENEMY_SHADOW), 'enemy shadow missing');
});

check('veil is gone: no veil slices in any view', () => {
  for (const [x, y, key, theme] of [[900, 1700, null, 'forest'], [900, 200, null, 'forest'], [900, 900, 'doublefork', 'forest']]) {
    const { ops } = render(key ? { doublefork: { back: { naturalWidth: 941, naturalHeight: 1672, complete: true } } } : { forest: { back: paintedImage } }, x, y, true, key, theme);
    assert.equal(veilSlices(ops).length, 0, `expected zero veil slices at (${x},${y}), got ${veilSlices(ops).length}`);
  }
  const vector = render(null, 900, 1700);
  assert.equal(veilSlices(vector.ops).length, 0, 'veil must stay off without a painted scene');
});

check('overshoot continues the painting: near band + sampled edge fill, no dark fill', () => {
  const { ops } = render({ temple: { back: paintedImage } }, 900, 230, true, null, 'temple');
  assert.ok(overshootNearBands(ops).length >= 1, 'expected an overshoot near band above the world edge');
  assert.ok(edgeFills(ops, '#bbad90').length >= 1, 'expected a temple edge-colour far fill above the world edge');
  assert.equal(deepFillRectsAbove(ops, TEMPLE_DEEP, .5).length, 0, 'no dark deep fill may sit above y=0 (old overshoot shade / relief)');
});

check('overshoot edge fill exists for doublefork too', () => {
  const { ops } = render({ doublefork: { back: { naturalWidth: 941, naturalHeight: 1672, complete: true } } }, 900, 300, true, 'doublefork');
  assert.ok(overshootNearBands(ops).length >= 1, 'expected a doublefork overshoot near band');
  assert.ok(edgeFills(ops, '#a69b78').length >= 1, 'expected a doublefork edge-colour far fill');
  assert.equal(deepFillRects(ops, FOREST_DEEP).length, 0, 'no relief rects on doublefork either');
});

check('collision mask is unchanged by the relief removal', () => {
  const cells = sceneBlockedCells('forest');
  assert.ok(cells.length > 1000, `forest mask should have many blocked cells, got ${cells.length}`);
  for (let i = 0; i < cells.length; i += 37) {
    const [c, r] = cells[i];
    assert.equal(sceneCircleBlocked('forest', c * 15 + 7, r * 15 + 7, 1, 1800), true, `cell ${c},${r} must be blocked`);
  }
  assert.equal(sceneCircleBlocked('forest', 900, 900, 14, 1800), false, 'spawn plaza stays open');
  assert.equal(sceneCircleBlocked('forest', 900, 110, 14, 1800), true, 'north cliffs stay blocked');
});

// Regression (2026-11-26 browser acceptance): the web shell pre-seeds
// mapImages with empty placeholder objects {forest:{},temple:{},doublefork:{}}.
// The old imageReady counted a plain {} as ready (complete === undefined),
// so stage 2 temple took the painted path with no image — drawImage threw,
// the map rendered as flat paper purple, and the vector fallback never ran.
// An empty placeholder must fall back to the vector plate (sky wash .38),
// and a real painted image must take the painted path.
const TEMPLE_SKY_WASH = 'rgba(118,82,213,0.38)'; // temple sky #7652d5
check('empty placeholder mapImages fall back to the vector plate', () => {
  const { renderer, ops } = render({ forest: {}, temple: {}, doublefork: {} }, 900, 900, true, null, 'temple');
  assert.equal(renderer.mapAssetDraws, 0, 'no painted image must draw');
  assert.ok(ops.some(o => o.op === 'fillRect' && o.fillStyle === TEMPLE_SKY_WASH), 'vector plate sky wash must draw');
  assert.equal(deepFillRects(ops, TEMPLE_DEEP).length, 0, 'vector plate carries no relief rects');
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
