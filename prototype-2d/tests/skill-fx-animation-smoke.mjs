// Skill-effect sprite strips: the four signature-weapon effects prefer
// their painted strip when one is loaded and keep the exact vector effect
// otherwise.  This gate pins the routing (kinds, frame math, fallback) —
// it never touches the engine, so gameplay cannot change here.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SKILL_FX, attachSkillFx, skillFxReady, skillFxFrameRect, skillFxIdForEffect } from '../src/skill-fx-animation.js';
import { GameRenderer } from '../src/renderer.js';

const results = [];
const check = (name, fn) => { try { fn(); results.push({ name, status: 'PASS' }); } catch (error) { results.push({ name, status: 'FAIL', error: error.message }); } };
const strip = (id) => attachSkillFx({ width: SKILL_FX[id].cell * SKILL_FX[id].frames, height: SKILL_FX[id].cell }, id);

function makeCtx() {
  const draws = [];
  const target = { draws, canvas: { width: 390, height: 844 }, globalAlpha: 1 };
  const ctx = new Proxy(target, {
    get(t, prop) {
      if (prop in t) return t[prop];
      return (...args) => { if (prop === 'drawImage') draws.push(args); };
    },
    set(t, prop, value) { t[prop] = value; return true; },
  });
  return ctx;
}
const makeRenderer = (skillFxImages) => new GameRenderer(
  { width: 390, height: 844, getContext: () => makeCtx() },
  { width: 390, height: 844, skillFxImages: skillFxImages || {} },
);

check('attach accepts the exact strip geometry and rejects everything else', () => {
  for (const id of Object.keys(SKILL_FX)) assert.ok(skillFxReady(strip(id)), id);
  assert.equal(attachSkillFx({ width: 1000, height: 256 }, 'slash-arc'), null);
  assert.equal(attachSkillFx({ width: 1536, height: 255 }, 'slash-arc'), null);
  assert.equal(attachSkillFx({ width: 1536, height: 256 }, 'nope'), null);
  assert.equal(attachSkillFx(null, 'slash-arc'), null);
});

check('signature kinds and the four painted artifact kinds route to strips', () => {
  assert.equal(skillFxIdForEffect('sweep'), 'slash-arc');
  assert.equal(skillFxIdForEffect('heavy-sweep'), 'slash-arc');
  assert.equal(skillFxIdForEffect('hoe-line'), 'rake-sweep');
  assert.equal(skillFxIdForEffect('staff-ring'), 'water-ring');
  assert.equal(skillFxIdForEffect('fan'), 'fan-wave');
  assert.equal(skillFxIdForEffect('gourd'), 'gourd-vortex');
  assert.equal(skillFxIdForEffect('palm-strike'), 'palm-burst');
  assert.equal(skillFxIdForEffect('mountain'), 'fire-burst');
  assert.equal(skillFxIdForEffect('bead'), 'gold-bead');
  assert.equal(skillFxIdForEffect('skull-bead'), 'gold-bead');
  assert.equal(skillFxIdForEffect('fire-trail'), 'fire-pool');
  assert.equal(skillFxIdForEffect('fire-pool'), 'fire-pool');
  assert.equal(skillFxIdForEffect('monkey-clone'), 'monkey-clone');
  assert.equal(skillFxIdForEffect('whirl'), 'whirl-pool');
  for (const kind of ['rope', 'lotus', 'fire-ring', 'explosion', 'hit-burst', 'dash']) {
    assert.equal(skillFxIdForEffect(kind), null, kind);
  }
});

check('renderer draws batch-3 strips (monkey clones and whirl pools)', () => {
  const images = { 'monkey-clone': strip('monkey-clone'), 'whirl-pool': strip('whirl-pool') };
  const renderer = makeRenderer(images);
  renderer.elapsed = 0;
  const clone = makeCtx();
  renderer._drawEffect(clone, { x: 100, y: 100, radius: 16, kind: 'monkey-clone', ttl: 3, maxTtl: 4, angle: 0, vx: 120, vy: 0, color: '#e6a43a' });
  assert.equal(clone.draws.length, 1, 'monkey clone strip drawn');
  assert.equal(clone.draws[0][0], images['monkey-clone']);
  const cloneL = makeCtx();
  renderer._drawEffect(cloneL, { x: 100, y: 100, radius: 16, kind: 'monkey-clone', ttl: 3, maxTtl: 4, angle: 0, vx: -120, vy: 0, color: '#e6a43a' });
  assert.equal(cloneL.draws.length, 1, 'leftward clone drawn (flipped)');
  const whirl = makeCtx();
  renderer._drawEffect(whirl, { x: 100, y: 100, radius: 30, kind: 'whirl', ttl: 1.2, maxTtl: 2, angle: 0, color: '#8bb8bf' });
  assert.equal(whirl.draws.length, 1, 'whirl pool strip drawn');
  assert.equal(whirl.draws[0][0], images['whirl-pool']);
});

check('renderer draws batch-2 strips (beads, fire pool, wheel and ring projectiles)', () => {
  const images = { 'gold-bead': strip('gold-bead'), 'fire-pool': strip('fire-pool'), 'fire-wheel': strip('fire-wheel'), 'ring-spin': strip('ring-spin') };
  const renderer = makeRenderer(images);
  renderer.elapsed = 0;
  const bead = makeCtx();
  renderer._drawEffect(bead, { x: 100, y: 100, radius: 10, kind: 'bead', ttl: 5, maxTtl: 6.1, angle: 0, color: '#d9b77b' });
  assert.equal(bead.draws.length, 1, 'bead strip drawn');
  assert.equal(bead.draws[0][0], images['gold-bead']);
  const pool = makeCtx();
  renderer._drawEffect(pool, { x: 100, y: 100, radius: 14, kind: 'fire-trail', ttl: 2, maxTtl: 3, angle: 0, color: '#ef7650' });
  assert.equal(pool.draws.length, 1, 'fire pool strip drawn');
  assert.equal(pool.draws[0][0], images['fire-pool']);
  const wheel = makeCtx();
  renderer._drawProjectile(wheel, { x: 50, y: 50, vx: 100, vy: 0, radius: 16, kind: 'fire-wheel', color: '#f3873c' });
  assert.equal(wheel.draws.length, 1, 'fire wheel strip drawn');
  assert.equal(wheel.draws[0][0], images['fire-wheel']);
  const ring = makeCtx();
  renderer._drawProjectile(ring, { x: 50, y: 50, vx: 100, vy: 0, radius: 12, kind: 'ring', color: '#e7cb75' });
  assert.equal(ring.draws.length, 1, 'ring strip drawn');
  assert.equal(ring.draws[0][0], images['ring-spin']);
  const child = makeCtx();
  renderer._drawProjectile(child, { x: 50, y: 50, vx: -80, vy: 20, radius: 9, kind: 'ring-child', color: '#e7cb75' });
  assert.equal(child.draws.length, 1, 'ring child strip drawn');
});

check('renderer draws the artifact strips (cones, palm, delayed fire burst)', () => {
  const images = { 'fan-wave': strip('fan-wave'), 'gourd-vortex': strip('gourd-vortex'), 'palm-burst': strip('palm-burst'), 'fire-burst': strip('fire-burst') };
  const renderer = makeRenderer(images);
  renderer.elapsed = 0;
  const fan = makeCtx();
  renderer._drawEffect(fan, { x: 100, y: 100, radius: 120, kind: 'fan', ttl: 0.175, maxTtl: 0.35, angle: 0.4, color: '#68c2aa' });
  assert.equal(fan.draws.length, 1, 'fan strip drawn');
  assert.equal(fan.draws[0][0], images['fan-wave']);
  assert.equal(fan.draws[0][1], 768, 'fan frame follows progress');
  const gourd = makeCtx();
  renderer._drawEffect(gourd, { x: 100, y: 100, radius: 150, kind: 'gourd', ttl: 2.0, maxTtl: 2.4, angle: 0.2, color: '#a879cb' });
  assert.equal(gourd.draws.length, 1, 'gourd strip drawn');
  assert.equal(gourd.draws[0][0], images['gourd-vortex']);
  const palm = makeCtx();
  renderer._drawEffect(palm, { x: 100, y: 100, radius: 40, kind: 'palm-strike', ttl: 0.25, maxTtl: 0.5, angle: 0.9, color: '#e7cb80', delay: 0.3 });
  assert.equal(palm.draws.length, 1, 'palm strip drawn');
  assert.equal(palm.draws[0][0], images['palm-burst']);
  // Samadhi burst: during the delay the falling-rock vector telegraph owns
  // the effect; after the delay the painted burst takes over.
  const during = makeCtx();
  renderer._drawEffect(during, { x: 100, y: 100, radius: 90, kind: 'mountain', ttl: 0.7, maxTtl: 0.8, delay: 0.45, color: '#b58d65' });
  assert.equal(during.draws.length, 0, 'mountain stays vector during its delay');
  const burst = makeCtx();
  renderer._drawEffect(burst, { x: 100, y: 100, radius: 90, kind: 'mountain', ttl: 0.2, maxTtl: 0.8, delay: 0.45, color: '#b58d65' });
  assert.equal(burst.draws.length, 1, 'fire burst strip drawn after the delay');
  assert.equal(burst.draws[0][0], images['fire-burst']);
  assert.equal(burst.draws[0][1], 512, 'burst frame follows post-delay phase');
});

check('frame rect follows the phase and clamps at both ends', () => {
  const image = strip('slash-arc');
  assert.deepEqual([skillFxFrameRect(image, 0).x, skillFxFrameRect(image, 0).frame], [0, 0]);
  assert.deepEqual([skillFxFrameRect(image, 0.5).x, skillFxFrameRect(image, 0.5).frame], [768, 3]);
  assert.equal(skillFxFrameRect(image, 0.9999).frame, 5);
  assert.equal(skillFxFrameRect(image, 1).frame, 5);
  assert.equal(skillFxFrameRect(image, -2).frame, 0);
  assert.equal(skillFxFrameRect(image, Number.NaN).frame, 0);
  assert.equal(skillFxFrameRect({ width: 1536, height: 256 }, 0.5), null, 'untagged image');
});

check('renderer draws the strip for sweep, hoe-line and staff-ring with progress frames', () => {
  const images = { 'slash-arc': strip('slash-arc'), 'rake-sweep': strip('rake-sweep'), 'water-ring': strip('water-ring') };
  const renderer = makeRenderer(images);
  const cases = [
    { kind: 'sweep', ttl: 0.09, maxTtl: 0.18, angle: 0.3, sx: 768 },
    { kind: 'heavy-sweep', ttl: 0.18, maxTtl: 0.18, angle: 0, sx: 0 },
    { kind: 'hoe-line', ttl: 0.11, maxTtl: 0.22, angle: 0.5, width: 30, length: 120, sx: 768 },
    { kind: 'staff-ring', ttl: 0.06, maxTtl: 0.24, angle: 0, sx: 1024 },
  ];
  for (const c of cases) {
    const ctx = makeCtx();
    renderer._drawEffect(ctx, { x: 100, y: 100, radius: 60, color: '#e6a43a', ...c });
    assert.equal(ctx.draws.length, 1, c.kind);
    assert.equal(ctx.draws[0][0], images[skillFxIdForEffect(c.kind)], c.kind);
    assert.equal(ctx.draws[0][1], c.sx, `${c.kind} frame x`);
  }
});

check('renderer draws the orb strip for light-orb projectiles', () => {
  const orb = strip('light-orb');
  const renderer = makeRenderer({ 'light-orb': orb });
  renderer.elapsed = 0;
  const ctx = makeCtx();
  renderer._drawProjectile(ctx, { x: 50, y: 50, vx: 100, vy: 0, radius: 9, kind: 'light-orb', color: '#35d7ff' });
  assert.equal(ctx.draws.length, 1);
  assert.equal(ctx.draws[0][0], orb);
  assert.equal(ctx.draws[0][1], 0);
});

check('without a loaded strip every effect keeps the vector path', () => {
  const renderer = makeRenderer({});
  for (const effect of [
    { kind: 'sweep', ttl: 0.09, maxTtl: 0.18, angle: 0.3 },
    { kind: 'hoe-line', ttl: 0.11, maxTtl: 0.22, angle: 0.5, width: 30 },
    { kind: 'staff-ring', ttl: 0.06, maxTtl: 0.24, angle: 0 },
    { kind: 'fan', ttl: 0.175, maxTtl: 0.35, angle: 0.4 },
    { kind: 'gourd', ttl: 2.0, maxTtl: 2.4, angle: 0.2 },
    { kind: 'palm-strike', ttl: 0.25, maxTtl: 0.5, angle: 0.9, delay: 0.3 },
    { kind: 'mountain', ttl: 0.2, maxTtl: 0.8, delay: 0.45 },
    { kind: 'bead', ttl: 5, maxTtl: 6.1, angle: 0 },
    { kind: 'fire-trail', ttl: 2, maxTtl: 3, angle: 0 },
    { kind: 'monkey-clone', ttl: 3, maxTtl: 4, angle: 0, vx: 120, vy: 0 },
    { kind: 'whirl', ttl: 1.2, maxTtl: 2, angle: 0 },
  ]) {
    const ctx = makeCtx();
    renderer._drawEffect(ctx, { x: 100, y: 100, radius: 60, color: '#e6a43a', ...effect });
    assert.equal(ctx.draws.length, 0, effect.kind);
  }
  const ctx = makeCtx();
  renderer._drawProjectile(ctx, { x: 50, y: 50, vx: 100, vy: 0, radius: 9, kind: 'light-orb', color: '#35d7ff' });
  assert.equal(ctx.draws.length, 0, 'orb fallback');
  for (const kind of ['fire-wheel', 'ring', 'ring-child']) {
    const pctx = makeCtx();
    renderer._drawProjectile(pctx, { x: 50, y: 50, vx: 100, vy: 0, radius: 12, kind, color: '#f3873c' });
    assert.equal(pctx.draws.length, 0, `${kind} fallback`);
  }
  // An untagged image in the map is not a strip: still the vector path.
  const renderer2 = makeRenderer({ 'slash-arc': { width: 1536, height: 256 } });
  const ctx2 = makeCtx();
  renderer2._drawEffect(ctx2, { x: 100, y: 100, radius: 60, kind: 'sweep', ttl: 0.09, maxTtl: 0.18, angle: 0, color: '#e6a43a' });
  assert.equal(ctx2.draws.length, 0, 'untagged fallback');
});

check('the four shipped strip files are 1536x256 PNGs that attach', () => {
  for (const id of Object.keys(SKILL_FX)) {
    const path = new URL(`../assets/skill-fx-${id}.png`, import.meta.url);
    const bytes = readFileSync(path);
    assert.deepEqual([...bytes.subarray(0, 4)], [137, 80, 78, 71], `${id} PNG signature`);
    assert.equal(bytes.readUInt32BE(16), 1536, `${id} width`);
    assert.equal(bytes.readUInt32BE(20), 256, `${id} height`);
    assert.ok(attachSkillFx({ width: 1536, height: 256 }, id), `${id} attaches`);
  }
});

check('painted effect extents equal their gameplay radius (length audit)', () => {
  // Forward-reach strips (cone/line): the drawImage dest rect's leading
  // edge must land on the effect radius. Centered strips (rings, pools,
  // bursts): half the dest size must equal the radius. Body glyphs
  // (bead, clone) are pinned at their audited sizes instead.
  const R = 100;
  const forward = [
    ['rake-sweep', { kind: 'hoe-line', radius: R, length: R, width: 40 }],
    ['fan-wave', { kind: 'fan', radius: R }],
    ['gourd-vortex', { kind: 'gourd', radius: R }],
  ];
  const centered = [
    ['slash-arc', { kind: 'sweep', radius: R }],
    ['water-ring', { kind: 'staff-ring', radius: R }],
    ['palm-burst', { kind: 'palm-strike', radius: R }],
    ['fire-burst', { kind: 'mountain', radius: R, delay: 0 }],
    ['whirl-pool', { kind: 'whirl', radius: R }],
    ['fire-pool', { kind: 'fire-trail', radius: R }],
  ];
  const glyphs = [
    ['gold-bead', { kind: 'bead', radius: R }, 120],
    ['monkey-clone', { kind: 'monkey-clone', radius: R, vx: 100 }, 150],
  ];
  const drawOne = (fxId, effect) => {
    const renderer = makeRenderer({ [fxId]: strip(fxId) });
    const ctx = makeCtx();
    renderer._drawEffect(ctx, { x: 100, y: 100, ttl: 0.09, maxTtl: 0.18, angle: 0, color: '#ffffff', ...effect });
    assert.equal(ctx.draws.length, 1, `${fxId} draws its strip once`);
    return ctx.draws[0]; // drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
  };
  for (const [fxId, effect] of forward) {
    const [, , , , , dx, , dw] = drawOne(fxId, effect);
    assert.ok(Math.abs(dx + dw - R) <= 3, `${fxId} leading edge ${dx + dw} must equal range ${R}`);
  }
  for (const [fxId, effect] of centered) {
    const [, , , , , , , dw] = drawOne(fxId, effect);
    assert.ok(Math.abs(dw / 2 - R) <= 3, `${fxId} extent ${dw / 2} must equal radius ${R}`);
  }
  for (const [fxId, effect, extent] of glyphs) {
    const [, , , , , , , dw] = drawOne(fxId, effect);
    assert.ok(Math.abs(dw / 2 - extent) <= 3, `${fxId} glyph extent ${dw / 2} pinned at ${extent}`);
  }
});

const failed = results.filter((r) => r.status === 'FAIL');
console.log(JSON.stringify({ suite: 'skill-fx-animation-smoke', total: results.length, passed: results.length - failed.length, failed: failed.length, results }, null, 2));
if (failed.length) process.exit(1);
