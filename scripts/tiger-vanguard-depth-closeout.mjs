import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Offline evidence closeout only. Never opens a browser or changes game code.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directory = 'evidence/current/tiger-vanguard/depth-control/2026-10-14T06-20-05-385Z';
const scriptFile = 'scripts/browser-tiger-vanguard-depth-control.mjs';
const closeoutScriptFile = path.relative(root, fileURLToPath(import.meta.url)).replaceAll('\\', '/');
const readBytes = file => fs.readFileSync(path.join(root, file));
const read = file => JSON.parse(readBytes(file));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const fingerprint = files => Object.fromEntries(files.map(file => [file, hash(readBytes(file))]));
const writeNew = (file, bytes) => fs.writeFileSync(path.join(root, file), bytes, { flag: 'wx' });
const writeJson = (name, value) => writeNew(`${directory}/${name}`, `${JSON.stringify(value, null, 2)}\n`);
assert.equal(fs.existsSync(path.join(root, directory, 'closeout.json')), false, 'Do not overwrite a closeout');
const browserFile = `${directory}/browser.json`, report = read(browserFile);
const scriptBytes = readBytes(scriptFile);
assert.equal(report.result, 'FAIL');
assert.equal(hash(scriptBytes), report.scriptSha256);
const protectedFiles = Object.keys(report.protectedAfter);
assert.equal(protectedFiles.length, 302);
assert.deepEqual(fingerprint(protectedFiles), report.protectedAfter);
const originalDirectory = 'evidence/current/tiger-vanguard/depth-control/2026-10-14T05-51-20-859Z';
const restrictedDirectory = 'evidence/current/tiger-vanguard/depth-control/2026-10-14T06-15-01-093Z';
const originalReport = read(`${originalDirectory}/browser.json`);
const restrictedReport = read(`${restrictedDirectory}/browser.json`);
const originalScript = Buffer.from(scriptBytes.toString('utf8').replace(
  "import { fileURLToPath, pathToFileURL } from 'node:url';",
  "import { fileURLToPath } from 'node:url';"));
assert.equal(hash(originalScript), originalReport.scriptSha256, 'Reconstructed original must match executed hash');
assert.equal(hash(scriptBytes), restrictedReport.scriptSha256);
assert.equal(originalReport.result, 'FAIL');
assert.match(originalReport.pixelAnalysisError, /pathToFileURL is not defined/);
assert.equal(restrictedReport.result, 'FAIL');
assert.match(restrictedReport.error, /spawn EPERM/);
const observedFiles = [...new Set([
  ...protectedFiles, scriptFile, closeoutScriptFile, browserFile,
  ...report.screenshots.map(s => s.file), `${originalDirectory}/browser.json`, `${restrictedDirectory}/browser.json`,
  ...originalReport.screenshots.map(s => s.file)
])];
const observedBefore = fingerprint(observedFiles);
for (const run of [report, originalReport]) for (const screenshot of run.screenshots) {
  const bytes = readBytes(screenshot.file);
  assert.equal(bytes.length, screenshot.bytes);
  assert.equal(hash(bytes), screenshot.sha256);
}

const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE || '',
  '.cache', 'codex-runtimes', 'codex-primary-runtime', 'dependencies', 'node', 'node_modules');
const { PNG } = await import(pathToFileURL(path.join(modules, 'pngjs', 'lib', 'png.js')));
const decoded = Object.fromEntries(report.screenshots.map(s => [path.basename(s.file, '.png'), PNG.sync.read(readBytes(s.file))]));
for (const png of Object.values(decoded)) { assert.equal(png.width, 390); assert.equal(png.height, 844); }
const mainBefore = decoded['hit26-original-depth'], mainAfter = decoded['hit26-player-contact-priority'];
const layerBefore = decoded['before-player-full-paint-support'], layerAfter = decoded['after-player-full-paint-support'];
const sprite = decoded['before-player-current-source-draw'], candidate = decoded['before-candidate-current-source-draw'];
const diff = (before, after) => {
  let changedPixels = 0, maxAbsChannelDelta = 0, minX = before.width, maxX = -1, minY = before.height, maxY = -1;
  for (let i = 0; i < before.data.length; i += 4) {
    let delta = 0;
    for (let k = 0; k < 4; k++) delta = Math.max(delta, Math.abs(before.data[i + k] - after.data[i + k]));
    if (!delta) continue;
    changedPixels++; maxAbsChannelDelta = Math.max(maxAbsChannelDelta, delta);
    const x = (i / 4) % before.width, y = Math.floor(i / 4 / before.width);
    minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }
  return { changedPixels, maxAbsChannelDelta, bboxInclusive: changedPixels ? { minX, maxX, minY, maxY } : null };
};
const outsidePixels = [];
let bodyAlphaOverlap = 0, paintSupportPixels = 0;
for (let i = 0; i < mainBefore.data.length; i += 4) {
  if (layerBefore.data[i + 3] > 0) paintSupportPixels++;
  if (sprite.data[i + 3] > 8 && candidate.data[i + 3] > 8) bodyAlphaOverlap++;
  const before = [...mainBefore.data.subarray(i, i + 4)], after = [...mainAfter.data.subarray(i, i + 4)];
  if (!before.some((value, k) => value !== after[k]) || layerBefore.data[i + 3] || layerAfter.data[i + 3]) continue;
  outsidePixels.push({ x: (i / 4) % 390, y: Math.floor(i / 4 / 390), before, after,
    maxAbsChannelDelta: Math.max(...before.map((value, k) => Math.abs(value - after[k]))),
    beforeLayerAlpha: layerBefore.data[i + 3], afterLayerAlpha: layerAfter.data[i + 3],
    playerSpriteAlpha: sprite.data[i + 3], candidateAlpha: candidate.data[i + 3] });
}
const recomputed = {
  main: diff(mainBefore, mainAfter), playerLayer: diff(layerBefore, layerAfter),
  playerSprite: diff(sprite, decoded['after-player-current-source-draw']),
  candidate: diff(candidate, decoded['after-candidate-current-source-draw']),
  outsidePlayerPaintSupport: outsidePixels.length, bodyAlphaOverlap, paintSupportPixels
};
for (const [key, value] of Object.entries(recomputed)) assert.deepEqual(value, report.pixelComparisons[key]);
assert.equal(outsidePixels.length, 8);
assert.deepEqual(Object.entries(report.checks).filter(([, pass]) => !pass).map(([name]) => name), ['mainPixelsChangedInsideWholePlayerSupport']);
const frameInvariant = frame => ({ draw: { ...frame.draw, renderToken: undefined },
  captures: Object.fromEntries(Object.entries(frame.captures).map(([key, entries]) => [key,
    entries.map(entry => ({ ...entry, renderToken: undefined, sequence: undefined }))])),
  playerCommands: frame.playerCommands, paints: frame.paints, numbers: frame.numbers,
  labelRects: frame.labelRects, statusRects: frame.statusRects,
  originalPlayerCalls: frame.originalPlayerCalls, interceptedPlayerCalls: frame.interceptedPlayerCalls });
assert.deepEqual(frameInvariant(report.fixture.before), frameInvariant(report.fixture.after));
const approvalNames = ['humanMotionReviewed', 'rootApproved', 'healthBarLayoutApproved', 'playerReadabilityApproved',
  'viewportEdgeApproved', 'statusBadgeGeometryUpdated', 'deathFeedbackObstaclesIntegrated',
  'extremeMissingBarAt512Approved', 'attackEventSupported', 'attackPreviewed', 'runtimeApproved',
  'highFrameApproved', 'fpsAcceptance', 'publicPass', 'releaseReady', 'proxyEquivalentToActualMainPaintSupportProven'];
for (const name of approvalNames) assert.equal(report[name], false);
const approvals = Object.fromEntries(approvalNames.map(name => [name, false]));

// Only an exact hash-matched source snapshot is saved; no prior report is changed.
writeNew(`${originalDirectory}/executed-script.mjs`, originalScript);
writeNew(`${restrictedDirectory}/executed-script.mjs`, scriptBytes);
writeNew(`${directory}/executed-script.mjs`, scriptBytes);
writeJson('root-pixel-review.json', { checkedAt: new Date().toISOString(), result: 'FAIL',
  scope: 'Root offline recomputation only; not a completed independent-agent audit or new browser run.',
  browserFile, browserSha256: observedBefore[browserFile], scriptSha256: hash(scriptBytes),
  decodedPngCount: report.screenshots.length, recomputed, outsidePixels,
  playerCommandsEachMode: report.fixture.before.playerCommands.length,
  sourceDrawAndPlayerCommandInvariantConfirmed: true, approvals,
  limitations: [
    'Transparent proxy alpha support is not proven equivalent to exact main-canvas paint support.',
    'The new depth script uses per-command proxy getTransform/setTransform, not the stable baseline full original transform-chain mirror.',
    'Only one before and one after main frame were captured in this run; no same-run A/A or B/B repeat control.',
    'Full non-player main trace and initial native current-path/clip/stack equivalence are not proven.',
    'No cause attributed to antialiasing, getImageData, GPU/CPU backend or draw order alone; threshold unchanged.',
    'Real pointer UI followed by explicit 300-second/partial-subsystem fixture; not natural five-minute survival.',
    'Single DPR1 hit26 pose, empty status badges, no death/attack/high-frame/FPS/public acceptance.'
  ] });

const startedAt = new Date().toISOString();
const npmCli = path.join(path.dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js');
assert.equal(fs.existsSync(npmCli), true, 'Use installed npm CLI');
const test = spawnSync(process.execPath, [npmCli, 'test'], { cwd: root, windowsHide: true,
  encoding: 'utf8', timeout: 60000, maxBuffer: 8 * 1024 * 1024 });
const output = `${test.stdout || ''}${test.stderr || ''}`;
writeNew(`${directory}/npm-test.log`, output);
writeJson('npm-test.json', { command: 'npm test', runner: process.execPath, npmCli, startedAt,
  finishedAt: new Date().toISOString(), exitCode: test.status, signal: test.signal,
  error: test.error ? String(test.error) : null, outputCharacters: output.length,
  result: test.status === 0 && !test.error ? 'PASS_LOCAL_NPM_ONLY' : 'FAIL',
  scope: 'Fresh local project validation; cannot override browser FAIL or prove artistic/high-frame/FPS/public acceptance.' });
assert.equal(test.error, undefined);
assert.equal(test.status, 0);
assert.deepEqual(fingerprint(observedFiles), observedBefore, 'Protected files and raw evidence changed after testing');
const ps = path.join(process.env.SystemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');
const listener = spawnSync(ps, ['-NoProfile', '-NonInteractive', '-Command',
  "@(Get-NetTCPConnection -LocalPort 8088 -State Listen -ErrorAction SilentlyContinue).Count"],
  { cwd: root, windowsHide: true, encoding: 'utf8', timeout: 15000 });
assert.equal(listener.error, undefined); assert.equal(listener.status, 0); assert.match(listener.stdout.trim(), /^\d+$/);
const actual8088ListenerCount = Number(listener.stdout.trim());
assert.equal(actual8088ListenerCount, 0);
const docFiles = ['STATUS.md', 'docs/REQUIREMENTS-ACCEPTANCE.md', 'docs/FINAL-REPORT.md', 'docs/TIGER-VANGUARD-CANDIDATE-HANDOFF.md'];
for (const file of docFiles) assert.match(readBytes(file).toString('utf8').slice(0, 4000), /5139/);
const preservedFailures = [originalDirectory, restrictedDirectory, directory].map(dir => {
  const file = `${dir}/browser.json`, run = read(file);
  return { file, result: run.result, sha256: hash(readBytes(file)), executedScriptSha256: hash(readBytes(`${dir}/executed-script.mjs`)),
    recordedScriptSha256: run.scriptSha256, screenshotCount: run.screenshots.length };
});
writeJson('handoff.json', { generatedAt: new Date().toISOString(), result: 'FAIL', overall: 'NOT_READY',
  scope: report.scope, recomputed, approvals, rawBrowserReportUnchanged: true, freshNpmExitCode: test.status,
  protectedFilesChecked: protectedFiles.length, actual8088ListenerCount, completeIndependentReviewAvailable: false,
  nextStep: 'Design only: full original transform-chain proxy mirror, same-run A/A/B/B and complete non-player main trace. Preserve all FAIL bytes and thresholds; no production integration, browser rerun, new assets, release or deployment in this closeout.' });
const artifacts = fs.readdirSync(path.join(root, directory)).filter(name => name !== 'closeout.json').map(name => `${directory}/${name}`);
writeJson('closeout.json', { checkedAt: new Date().toISOString(), browserResult: 'FAIL', overall: 'NOT_READY',
  protectedFilesChecked: protectedFiles.length, protectedChanged: [], observedRawEvidenceUnchanged: true,
  screenshotsChecked: report.screenshots.length, recomputed, preservedFailures,
  completeIndependentReviewAvailable: false, independentReviewFailure: '503 auth_unavailable; full pixel/hash review not delivered; no retry this turn.',
  freshNpmExitCode: test.status, actual8088ListenerCount, approvals,
  sha256: fingerprint([...artifacts, ...docFiles, scriptFile, closeoutScriptFile]) });
console.log(JSON.stringify({ closeout: `${directory}/closeout.json`, browserResult: report.result,
  changedPixels: recomputed.main.changedPixels, outsidePlayerPaintSupport: outsidePixels.length,
  npmExitCode: test.status, protectedFilesChecked: protectedFiles.length, actual8088ListenerCount,
  independentReviewComplete: false, overall: 'NOT_READY' }, null, 2));
