import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { buildVanguardLayoutDraft, projectVanguardLayout } from './tiger-vanguard-layout-draft.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, f))).digest('hex');
const candidateFile = 'evidence/current/tiger-vanguard/full-candidate/2026-10-13T11-20-21-840Z/candidate-table.json';
const motionFile = 'evidence/current/tiger-vanguard/motion-draft/2026-10-13T12-00-07-310Z/motion-draft.json';
assert.equal(sha(candidateFile), '8ea3d6e36fd490f5f81f8a6b13b5f1166c41c7a88c73bf1648162bdf1b91f75f');
assert.equal(sha(motionFile), 'b1fc330ce13c962701b5ae38f36e23a96cd3154f7a025874c5ced29fa34a6cc5');
const candidate = JSON.parse(fs.readFileSync(path.join(root, candidateFile))), motion = JSON.parse(fs.readFileSync(path.join(root, motionFile)));
const inputsBefore = JSON.stringify([candidate, motion]), draft = buildVanguardLayoutDraft(candidate, motion);
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`);
let geometryChecks = 0, aliveBarChecks = 0;
const oldOverlapIndices = [], offsets = [];
for (const radius of [7, 25, 72]) {
  const barYs = new Set();
  for (const facing of [-1, 1]) for (const f of candidate.frames) {
    const pose = { index: f.index, x: 1010, y: 1320, radius, facing };
    const g = projectVanguardLayout(draft, pose), m = motion.frames[f.index];
    const scale = radius * 3.2 / f.standingReferenceHeight, floor = pose.y + radius * .7;
    const left = (f.visibleRect.x - f.sourceRect.x - m.pivot.x) * scale;
    const right = (f.visibleRect.x - f.sourceRect.x + f.visibleRect.w - m.pivot.x) * scale;
    close(g.visibleAlpha8Proxy.left, pose.x + (facing === 1 ? left : -right));
    close(g.visibleAlpha8Proxy.right, pose.x + (facing === 1 ? right : -left));
    close(g.visibleAlpha8Proxy.top, floor + (f.visibleRect.y - f.sourceRect.y - m.pivot.y) * scale);
    assert.ok(g.visibleAlpha8Proxy.left >= g.draw.left - 1e-9 && g.visibleAlpha8Proxy.right <= g.draw.right + 1e-9);
    assert.ok(g.visibleAlpha8Proxy.top >= g.draw.top - 1e-9 && g.visibleAlpha8Proxy.bottom <= g.draw.bottom + 1e-9);
    if (f.state === 'death') assert.equal(g.bar, null);
    else {
      assert.ok(g.bar.bottom <= g.draw.top - 4 + 1e-9);
      close(g.bar.width, Math.max(20, radius * 2.3)); close(g.bar.height, Math.max(3, g.bar.width * .08));
      close(g.bar.x, pose.x); barYs.add(g.bar.y); aliveBarChecks++;
      const oldTop = pose.y - 1.85 * radius, oldBottom = oldTop + g.bar.height;
      if (radius === 25 && facing === 1 && oldBottom > g.visibleAlpha8Proxy.top && oldTop < g.visibleAlpha8Proxy.bottom) oldOverlapIndices.push(f.index);
    }
    geometryChecks++;
  }
  assert.equal(barYs.size, 1); offsets.push({ radius, barY: [...barYs][0], offsetFromEnemyY: 1320 - [...barYs][0] });
}
for (const p of [{ index: 32, x: 0, y: 0, radius: 25, facing: 1 }, { index: 0, x: NaN, y: 0, radius: 25, facing: 1 },
  { index: 0, x: 0, y: 0, radius: 0, facing: 1 }, { index: 0, x: 0, y: 0, radius: 25, facing: 0 }]) assert.equal(projectVanguardLayout(draft, p), null);
for (const change of [c => c.frames[0].standingReferenceHeight = 171, c => c.frames[0].visibleRect.x = -1,
  c => c.frames[0].index = 1, c => c.frames[0].sourceRect.w++]) {
  const bad = structuredClone(candidate); change(bad); assert.throws(() => buildVanguardLayoutDraft(bad, motion));
}
assert.equal(JSON.stringify([candidate, motion]), inputsBefore); assert.ok(Object.isFrozen(draft));
const generatedAt = new Date().toISOString(), dir = path.join(root, 'evidence/current/tiger-vanguard/layout-draft', generatedAt.replaceAll(':', '-').replaceAll('.', '-'));
fs.mkdirSync(dir, { recursive: true });
const layoutFile = path.join(dir, 'layout-draft.json'); fs.writeFileSync(layoutFile, JSON.stringify(draft, null, 2));
const report = { generatedAt, result: 'PASS_EVIDENCE_ONLY_FIXED_SCALE_BOUNDS',
  scope: 'Locked-source rectangle math only; alpha>8 visible-bbox proxy plus full-draw conservative envelope. Not pixel/global occlusion, gameplay, runtime integration, browser, motion, FPS or public acceptance.',
  inputs: { [candidateFile]: sha(candidateFile), [motionFile]: sha(motionFile) },
  layout: { file: path.relative(root, layoutFile).replaceAll('\\', '/'), sha256: crypto.createHash('sha256').update(fs.readFileSync(layoutFile)).digest('hex') },
  checks: { geometryChecks, aliveBarChecks, all32BothFacingsAtThreeRadii: true, alphaProxyContainedInDrawRect: true,
    stableAlive28BarYPerRadius: true, originalWidthHeightRules: true, noDeathBar: true, invalidInputsRejected: true, inputsUnchanged: true },
  aliveDrawEnvelope: draft.aliveDrawEnvelope, aliveVisibleAlpha8Envelope: draft.aliveVisibleAlpha8Envelope,
  oldGenericBarOverlapsVisibleBoxIndicesAtRadius25: oldOverlapIndices, offsets,
  healthBarLayoutApproved: false, playerReadabilityApproved: false, viewportEdgeApproved: false,
  runtimeApproved: false, highFrameApproved: false, publicPass: false, releaseReady: false };
fs.writeFileSync(path.join(dir, 'node.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ file: path.relative(root, path.join(dir, 'node.json')).replaceAll('\\', '/'), result: report.result, checks: report.checks, offsets }, null, 2));
