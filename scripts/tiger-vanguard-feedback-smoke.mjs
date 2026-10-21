import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { GameEngine } from '../prototype-2d/src/engine.js';
import { GameRenderer } from '../prototype-2d/src/renderer.js';
import { createVanguardEventPreview } from './tiger-vanguard-event-preview.mjs';
import { projectVanguardLayout } from './tiger-vanguard-layout-draft.mjs';
import { synchronizeVanguardFeedbackRects } from './tiger-vanguard-feedback-draft.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, f))).digest('hex');
const layoutFile = 'evidence/current/tiger-vanguard/layout-draft/2026-10-14T01-50-14-837Z/layout-draft.json';
const motionFile = 'evidence/current/tiger-vanguard/motion-draft/2026-10-13T12-00-07-310Z/motion-draft.json';
assert.equal(sha(layoutFile), '35cc74c1353e0004948cf1c3c3dca72c23bc66bb27ea69dbd30d7a18a345023c');
assert.equal(sha(motionFile), 'b1fc330ce13c962701b5ae38f36e23a96cd3154f7a025874c5ced29fa34a6cc5');
const layout = JSON.parse(fs.readFileSync(path.join(root, layoutFile))), motion = JSON.parse(fs.readFileSync(path.join(root, motionFile)));
const engine = new GameEngine({ seed: 141017, stageId: 1, characterId: 'wukong' });
const preview = createVanguardEventPreview(motion);
engine.onEvent = event => preview.consume(event, engine.state);
engine.elapsed = engine.state.time = 300; engine.advanceSpawns();
const leader = engine.state.enemies.find(e => e.encounterIdentity), player = engine.state.player;
player.x = 900; player.y = 1260; leader.x = 915; leader.y = 1275; engine.state.enemies = [leader];
preview.sampleEnemy(leader, engine.state); engine.damageEnemy(leader, 1, {});
for (let i = 0; i < 6; i++) { engine.elapsed += .025; engine.state.time = engine.elapsed; engine.updateEffects(.025); engine.updateEnemies(.025); }
const pose = preview.sampleEnemy(leader, engine.state), geometry = projectVanguardLayout(layout, pose);
const binding = { enemy: leader, id: leader.id, identity: leader.encounterIdentity };
const cacheValue = { renderToken: 7, body: geometry.draw, bar: { left: geometry.bar.left, right: geometry.bar.right, top: geometry.bar.y, bottom: geometry.bar.bottom } };
const ctx = { font: '', fillStyle: '', strokeStyle: '', globalAlpha: 1, lineWidth: 1, textAlign: '', textBaseline: '' }, calls = [];
const styles = () => Object.fromEntries(['font','fillStyle','strokeStyle','lineWidth','textAlign','textBaseline'].map(k => [k, ctx[k]]));
for (const name of ['save','restore','beginPath','closePath','moveTo','lineTo','fill','stroke','translate','rotate','fillText','strokeText','fillRect','quadraticCurveTo'])
  ctx[name] = (...args) => calls.push({ name, args, ...styles() });
ctx.measureText = text => ({ width: String(text).length * 10, actualBoundingBoxLeft: 5, actualBoundingBoxRight: 5, actualBoundingBoxAscent: 9, actualBoundingBoxDescent: 3 });
const r = new GameRenderer({ getContext: () => ctx }, { width: 390, height: 844, showHud: false });
r._view = { left: 600, right: 1200, top: 900, bottom: 1600 };
const original = r._enemyDamageOcclusionRects;
const context = extra => ({ state: engine.state, binding, renderToken: 7, geometryFor: () => cacheValue, ...extra });
const generic = (id, extra = {}) => ({ id, x: leader.x, y: leader.y, radius: 25, hp: 100, maxHp: 100, kind: 'elite', variant: 'tiger', encounterIdentity: null, ...extra });
const tests = [], record = (name, run) => { run(); tests.push({ name, result: 'PASS' }); };
record('exact scheduled binding replaces only its body/bar numeric slots, same-position controls unchanged', () => {
  const ordinary = generic('ordinary', { kind: 'normal', hp: 90 }), homonym = generic('homonym');
  const enemies = [ordinary, leader, homonym], beforeInput = JSON.stringify(enemies), rects = original.call(r, enemies), baseline = structuredClone(rects), buffer = rects;
  const result = synchronizeVanguardFeedbackRects(rects, enemies, context()); assert.equal(result.applied, true); assert.deepEqual(result.errors, []);
  assert.equal(rects, buffer); assert.equal(rects.length, 6); assert.deepEqual(rects.slice(0,2), baseline.slice(0,2)); assert.deepEqual(rects.slice(4), baseline.slice(4));
  assert.deepEqual(rects[2], geometry.draw); assert.deepEqual(rects[3], cacheValue.bar); assert.equal(JSON.stringify(enemies), beforeInput);
  assert.ok(rects.every(b => Object.keys(b).sort().join(',') === 'bottom,left,right,top' && Object.values(b).every(Number.isFinite)));
});
record('stage/frozen identity/exact object/current-render guards retain original buffers', () => {
  for (const extra of [{ state: { ...engine.state, stage: { id: 2 } } }, { binding: { ...binding, identity: Object.freeze({ ...binding.identity }) } },
    { binding: { ...binding, enemy: { ...leader } } }, { renderToken: 8 }, { geometryFor: () => null }]) {
    const rects = original.call(r, [leader]), baseline = structuredClone(rects);
    const result = synchronizeVanguardFeedbackRects(rects, [leader], context(extra)); assert.equal(result.applied, false); assert.deepEqual(rects, baseline);
  }
});
record('mismatched slot count/null break/invalid geometry fail without partial writes', () => {
  const enemies = [leader, null, generic('after-null')], rects = original.call(r, enemies), baseline = structuredClone(rects);
  assert.equal(rects.length, 2); assert.equal(synchronizeVanguardFeedbackRects(rects, enemies, context()).applied, true);
  const invalid = structuredClone(baseline); invalid.push({ left: 0, right: 1, top: 0, bottom: 1 }); const invalidBefore = structuredClone(invalid);
  assert.deepEqual(synchronizeVanguardFeedbackRects(invalid, enemies, context()).errors, ['SOURCE_SLOT_COUNT_MISMATCH']); assert.deepEqual(invalid, invalidBefore);
  const originalRects = structuredClone(baseline);
  assert.deepEqual(synchronizeVanguardFeedbackRects(originalRects, [leader], context({ geometryFor: () => ({ ...cacheValue, bar: null }) })).errors, ['INVALID_CURRENT_GEOMETRY']);
  assert.deepEqual(originalRects, baseline);
});
record('512 cap can end at target body without appending its missing bar', () => {
  const enemies = [...Array.from({ length: 255 }, (_, i) => generic(`control-${i}`)), generic('healthy', { kind: 'normal' }), leader];
  const rects = original.call(r, enemies), baseline = structuredClone(rects), result = synchronizeVanguardFeedbackRects(rects, enemies, context());
  assert.equal(rects.length, 512); assert.equal(result.replacements[0].bodyIndex, 511); assert.equal(result.replacements[0].barIndex, null);
  assert.equal(result.replacements[0].barMissingAtCap, true); assert.deepEqual(rects.slice(0,511), baseline.slice(0,511));
});
record('missing/invalid render tokens and nonwritable target slots fail before any write', () => {
  for (const renderToken of [undefined, null, 0, -1, 1.5, NaN, Infinity]) {
    const rects = original.call(r, [leader]), baseline = structuredClone(rects);
    assert.deepEqual(synchronizeVanguardFeedbackRects(rects, [leader], context({ renderToken,
      geometryFor: () => ({ ...cacheValue, renderToken }) })).errors, ['INVALID_RENDER_TOKEN']); assert.deepEqual(rects, baseline);
  }
  const rects = original.call(r, [leader]), baseline = structuredClone(rects);
  rects[1] = Object.freeze({ ...rects[1] });
  assert.deepEqual(synchronizeVanguardFeedbackRects(rects, [leader], context()).errors, ['INVALID_SOURCE_TARGET_SLOT']); assert.deepEqual(rects, baseline);
});
record('actual damage number retains content/style/TTL while existing renderer chooses a finite clear candidate', () => {
  const stateBefore = JSON.stringify(engine.state), paint = () => calls.filter(c => ['fillText','strokeText'].includes(c.name));
  calls.length = 0; r._drawCombatFeedback(ctx, engine.state, [leader], { avoidPlayer: true, avoidEnemies: true, avoidDamageLabels: true }); const beforePaint = structuredClone(paint());
  r._enemyDamageOcclusionRects = function (enemies) { const rects = original.call(this, enemies); synchronizeVanguardFeedbackRects(rects, enemies, context()); return rects; };
  calls.length = 0; r._drawCombatFeedback(ctx, engine.state, [leader], { avoidPlayer: true, avoidEnemies: true, avoidDamageLabels: true });
  assert.deepEqual(paint(), beforePaint); assert.equal(paint().filter(c => c.name === 'fillText' && c.args[0] === '1').length, 1);
  for (const b of r._damageEnemyRects) assert.equal(r._rectsOverlap(r._damageLabelRects[0], b, 3), false);
  assert.equal(r.stats.damageEnemyUnresolved, 0); assert.equal(JSON.stringify(engine.state), stateBefore); r._enemyDamageOcclusionRects = original;
});
const generatedAt = new Date().toISOString(), dir = path.join(root, 'evidence/current/tiger-vanguard/feedback-draft', generatedAt.replaceAll(':','-').replaceAll('.','-'));
fs.mkdirSync(dir, { recursive: true });
const report = { generatedAt, result: 'PASS_EVIDENCE_ONLY_SHARED_FEEDBACK_RECTS',
  scope: 'Node Canvas command recording and actual-engine direct-damage fixture. Not pixel/browser, natural gameplay, complete motion, global occlusion, production integration, FPS or public acceptance.',
  layout: { file: layoutFile, sha256: sha(layoutFile) }, motion: { file: motionFile, sha256: sha(motionFile) }, tests,
  fixture: { sourcePoseIndex: pose.index, actualHitTimer: pose.actualHitTimer, visualHitRemainingMs: pose.visualHitRemainingMs, numberValue: engine.state.damageNumbers[0].value ?? engine.state.damageNumbers[0].damage,
    originalStateUnchangedDuringFeedback: true, originalHpAndDamageNumberFieldsUnchanged: true },
  cachePolicy: 'External current-render WeakMap; geometry from actual draw; no resample, stale geometry or entity references in numeric renderer buffer.',
  extremeMissingBarAt512Approved: false, deathFeedbackObstaclesIntegrated: false, statusBadgeGeometryUpdated: false,
  healthBarLayoutApproved: false, playerReadabilityApproved: false, viewportEdgeApproved: false, runtimeApproved: false, highFrameApproved: false, publicPass: false, releaseReady: false };
r.dispose(); report.disposed = r.disposed;
fs.writeFileSync(path.join(dir, 'node.json'), JSON.stringify(report,null,2));
console.log(JSON.stringify({ file: path.relative(root,path.join(dir,'node.json')).replaceAll('\\','/'), result: report.result, tests, fixture: report.fixture },null,2));
