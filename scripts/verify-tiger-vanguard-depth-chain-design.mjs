import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Design verification only. No browser import, server launch, network or raster edits.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const planFile = 'scripts/tiger-vanguard-depth-chain-plan.json';
const verifierFile = path.relative(root, fileURLToPath(import.meta.url)).replaceAll('\\', '/');
const bytes = file => fs.readFileSync(path.join(root, file));
const read = file => JSON.parse(bytes(file));
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const plan = read(planFile), checks = [];
function validate(p) {
  assert.equal(p.schema, 'xiyou-depth-chain-diagnostic-design/v1');
  assert.equal(p.scope, 'DESIGN_ONLY'); assert.equal(p.browserStatus, 'NOT_RUN');
  assert.equal(p.maximumFutureResult, 'REVIEW_EVIDENCE_ONLY'); assert.equal(p.overall, 'NOT_READY');
  assert.equal(p.assetPolicy, 'REUSE_LOCKED_PAGES_NO_GENERATION');
  assert.deepEqual(p.futureRun.frames, ['A1','A2','B1','B2'].map((id, i) => ({ id, depth: i < 2 ? 'original' : 'deferred-once', mirror: true })));
  const r = p.futureRun;
  assert.equal(r.browserCount, 1); assert.equal(r.pageCount, 1); assert.equal(r.serverPort, 8088);
  assert.deepEqual(r.viewport, { width: 390, height: 844, dpr: 1 });
  for (const key of ['synchronousBlock', 'proxyResetPerFrame', 'decodeOnlyAfterAllClosed', 'pngExportIsReadback']) assert.equal(r[key], true);
  for (const key of ['interframeAwaitRafOrStateAdvance','mainCanvasResetOrConfigChange','naturalFiveMinuteSurvival']) assert.equal(r[key], false);
  assert.equal(r.originalPlayerCallsPerFrame, 1); assert.equal(r.interceptedPlayerCallsPerFrame, 1);
  assert.equal(r.proxyCanvasCount, 3); assert.equal(r.mainGetImageDataGuardCalls, 0);
  assert.deepEqual(r.exportOrder, ['main','playerLayer','playerSprite','candidate']);
  assert.equal(r.fixturePngCount, 16); assert.equal(r.realEntryPngCount, 1);
  assert.equal(p.mirror.mode, 'ORIGINAL_TRANSFORM_CALL_CHAIN');
  assert.deepEqual(p.mirror.methods, ['save','restore','setTransform','resetTransform','translate','scale','rotate','transform']);
  assert.equal(p.mirror.getterToSetterMatrixRefill, false); assert.equal(p.mirror.exactMatrixChecks, true);
  assert.equal(p.mirror.stylesAndDashRecordedSeparately, true); assert.equal(p.mirror.proxyEquivalentToActualMainPaintSupportProven, false);
  assert.deepEqual(p.trace.segments, ['background','world','player','candidate','bar','feedback','hud','annotation']);
  assert.equal(p.trace.stateIdsResolvedBeforeComparison, true); assert.equal(p.trace.imageRefsResolvedBeforeComparison, true);
  assert.deepEqual(p.trace.crossModeRemovalWhitelist, ['moved-player-segment','one-tagged-depth-style-transaction']);
  assert.equal(p.trace.removeWholeTransformOrStyleTrace, false); assert.equal(p.trace.firstCommand, 'setTransform');
  assert.equal(p.trace.firstPlayerPath, 'beginPath'); assert.equal(p.trace.clipCalls, 0);
  assert.equal(p.trace.stackBalance, 0); assert.equal(p.trace.stackUnderflow, false);
  assert.equal(p.trace.maximumCommandsPerFrame, 30000); assert.equal(p.trace.unknownOperationPolicy, 'FAIL_CLOSED');
  assert.deepEqual(p.pixels.sameModePairs, [['A1','A2'],['B1','B2']]);
  assert.deepEqual(p.pixels.crossModePairs, [['A1','B1'],['A1','B2'],['A2','B1'],['A2','B2']]);
  for (const key of ['sameModeChangedPixels','proxyChangedPixels','outsidePlayerAlphaUnionChangedPixels','supportAlphaThreshold','channelTolerance','maskDilationPixels']) assert.equal(p.pixels[key], 0);
  assert.equal(p.pixels.bodyOverlapAlphaThreshold, 8);
  for (const key of ['allCrossDifferenceMapsExact','crossChangedPixelsMustBePositive','preserveEveryOutsidePixelRgba']) assert.equal(p.pixels[key], true);
  assert.deepEqual(p.limitations, { phaseOrderConfounded: true, actualBackendIdentified: false, initialNativePathClipStackProven: false, causalDiagnosisProven: false });
  assert.deepEqual(Object.keys(p.approvals).sort(), ['humanMotionReviewed','rootApproved','playerReadabilityApproved','healthBarLayoutApproved','viewportEdgeApproved','runtimeApproved','highFrameApproved','fpsAcceptance','publicPass','releaseReady'].sort());
  assert.ok(Object.values(p.approvals).every(value => value === false));
}
validate(plan); checks.push('fixed design schedule, exact gates and all approvals false');
for (const [name, mutate] of [
  ['missing repeat', p => p.futureRun.frames.splice(1, 1)],
  ['mixed observer path', p => p.futureRun.frames[0].mirror = false],
  ['second player draw', p => p.futureRun.originalPlayerCallsPerFrame = 2],
  ['getter matrix refill', p => p.mirror.getterToSetterMatrixRefill = true],
  ['main readback added', p => p.futureRun.mainGetImageDataGuardCalls = 1],
  ['whole transform trace excluded', p => p.trace.removeWholeTransformOrStyleTrace = true],
  ['HUD trace omitted', p => p.trace.segments.splice(6, 1)],
  ['channel tolerance widened', p => p.pixels.channelTolerance = 1],
  ['mask dilated', p => p.pixels.maskDilationPixels = 1],
  ['missing cross pair', p => p.pixels.crossModePairs.pop()],
  ['premature public approval', p => p.approvals.publicPass = true],
  ['design reported as browser PASS', p => p.browserStatus = 'PASS'],
  ['unsupported causal claim', p => p.limitations.causalDiagnosisProven = true]
]) {
  const bad = structuredClone(plan); mutate(bad); assert.throws(() => validate(bad)); checks.push(`reject ${name}`);
}
const prior = read(plan.priorReport), closeout = read(plan.priorCloseout);
assert.equal(hash(bytes(plan.priorReport)), plan.priorReportSha256);
assert.equal(hash(bytes(plan.baseScript)), plan.baseScriptSha256);
assert.equal(prior.result, 'FAIL'); assert.equal(closeout.browserResult, 'FAIL');
assert.equal(prior.pixelComparisons.changedPixels, 5139); assert.equal(prior.pixelComparisons.outsidePlayerPaintSupport, 8);
const frozen = { ...prior.protectedAfter,
  ...Object.fromEntries(Object.entries(closeout.sha256).filter(([file]) => file !== 'STATUS.md' && !file.startsWith('docs/'))),
  [plan.priorReport]: plan.priorReportSha256,
  [plan.baseScript]: plan.baseScriptSha256 };
for (const failure of closeout.preservedFailures) {
  frozen[failure.file] = failure.sha256;
  frozen[`${path.posix.dirname(failure.file)}/executed-script.mjs`] = failure.executedScriptSha256;
  assert.equal(read(failure.file).result, 'FAIL');
}
const fingerprint = () => Object.fromEntries(Object.keys(frozen).map(file => [file, hash(bytes(file))]));
assert.deepEqual(fingerprint(), frozen); checks.push('prior FAIL bytes, execution scripts, production and ZIP hashes frozen');
const candidate = read(prior.candidate.file);
const assetAudit = candidate.pages.map(page => {
  const data = bytes(page.file);
  assert.equal(hash(data), page.sha256); assert.equal(data.length, page.bytes);
  assert.equal(data.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(data.readUInt32BE(16), page.width); assert.equal(data.readUInt32BE(20), page.height);
  return { file: page.file, sha256: page.sha256, bytes: data.length, width: page.width, height: page.height, purpose: 'existing evidence-only tiger-vanguard candidate page', generated: false };
});
const runtimeFiles = ['prototype-2d/native-app.js','prototype-2d/assets/manifest.json','scripts/serve.mjs','scripts/release.mjs',
  ...fs.readdirSync(path.join(root, 'prototype-2d/src')).filter(f => f.endsWith('.js')).map(f => `prototype-2d/src/${f}`)];
const runtimeReferences = [];
for (const file of runtimeFiles) for (const name of [planFile, verifierFile, ...candidate.pages.map(page => page.file)]) {
  const source = bytes(file).toString('utf8');
  if (source.includes(name) || source.includes(path.basename(name))) runtimeReferences.push({ file, name });
}
assert.equal(runtimeReferences.length, 0); checks.push('candidate hash/dimensions and no production references');
const createdAt = new Date().toISOString();
const output = path.join(root, 'evidence/current/tiger-vanguard/depth-chain-design', createdAt.replaceAll(':','-').replaceAll('.','-'));
fs.mkdirSync(output, { recursive: true });
const write = (name, value) => fs.writeFileSync(path.join(output, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
const npmCli = path.join(path.dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js');
assert.ok(fs.existsSync(npmCli));
const startedAt = new Date().toISOString();
const test = spawnSync(process.execPath, [npmCli, 'test'], { cwd: root, windowsHide: true, encoding: 'utf8', timeout: 60000, maxBuffer: 8 * 1024 * 1024 });
const log = `${test.stdout || ''}${test.stderr || ''}`;
fs.writeFileSync(path.join(output, 'npm-test.log'), log, { flag: 'wx' });
write('npm-test.json', { startedAt, finishedAt: new Date().toISOString(), command: 'npm test', exitCode: test.status,
  error: test.error ? String(test.error) : null, outputCharacters: log.length, scope: 'LOCAL_TEST_ONLY_NOT_BROWSER_PUBLIC_OR_ART_ACCEPTANCE' });
assert.equal(test.error, undefined); assert.equal(test.status, 0);
assert.deepEqual(fingerprint(), frozen); checks.push('fresh npm test exit 0 and post-test protected integrity');
const documentFiles = ['docs/TIGER-VANGUARD-DEPTH-CHAIN-DESIGN.md','STATUS.md','docs/REQUIREMENTS-ACCEPTANCE.md','docs/FINAL-REPORT.md','docs/TIGER-VANGUARD-CANDIDATE-HANDOFF.md'];
write('design-audit.json', { createdAt, checkedAt: new Date().toISOString(), result: 'DESIGN_STATIC_VALIDATED_ONLY', browserStatus: 'NOT_RUN',
  overall: 'NOT_READY', checks, assetAudit, runtimeReferences, protectedFilesChecked: Object.keys(frozen).length,
  protectedChanged: [], preservedFailureCount: closeout.preservedFailures.length, priorPixelResult: prior.pixelComparisons,
  npmExitCode: test.status, browserLaunchCount: 0, serverLaunchCount: 0, imageGenerationCount: 0, approvals: plan.approvals,
  sha256: Object.fromEntries([planFile, verifierFile, ...documentFiles].map(file => [file, hash(bytes(file))])) });
console.log(JSON.stringify({ file: path.relative(root, path.join(output, 'design-audit.json')).replaceAll('\\', '/'),
  result: 'DESIGN_STATIC_VALIDATED_ONLY', negativeTests: 13, npmExitCode: test.status, protectedFilesChecked: Object.keys(frozen).length,
  browserStatus: 'NOT_RUN', overall: 'NOT_READY' }, null, 2));
