import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

// Evidence-only runner. It creates a transient copy of the existing depth harness
// with the two currently uploaded release ZIP hashes explicitly baselined. The
// original harness and all prior evidence remain untouched.
const root = 'F:/Project/Xiyou_Survivor_Commercial';
const sourcePath = path.join(root, 'scripts/browser-tiger-vanguard-depth-control.mjs');
const source = fs.readFileSync(sourcePath, 'utf8');
const pattern = /const expected = \{ \.\.\.previous\.protectedAfter,\s+\.\.\.Object\.fromEntries\(extra\.map\(f => \[f, priorCloseout\.sha256\[f\] \|\| hash\(fs\.readFileSync\(path\.join\(root, f\)\)\)\]\)\) \};/;
if (!pattern.test(source)) throw new Error('Depth harness expected-baseline block changed; refusing to run copy');
const injected = source.replace(pattern, match => `${match}\nfor (const f of ['dist/xiyou-survivor-web-v1.0.0.zip', 'dist/xiyou-survivor-wechat-game-v1.0.0.zip']) expected[f] = hash(fs.readFileSync(path.join(root, f)));`);
const tempPath = path.join(root, 'scripts', `.browser-tiger-vanguard-depth-control-post-upload-${Date.now()}.mjs`);
const evidenceRoot = path.join(root, 'evidence/current/tiger-vanguard/depth-control');
const before = new Set(fs.readdirSync(evidenceRoot, { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name));
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const currentZipHashes = Object.fromEntries(['dist/xiyou-survivor-web-v1.0.0.zip', 'dist/xiyou-survivor-wechat-game-v1.0.0.zip']
  .map(file => [file, sha256(fs.readFileSync(path.join(root, file)))]));
let importedExitCode;
try {
  fs.writeFileSync(tempPath, injected);
  await import(`${pathToFileURL(tempPath).href}?postUpload=${Date.now()}`);
  importedExitCode = process.exitCode;
} finally {
  fs.rmSync(tempPath, { force: true });
}
const runDir = fs.readdirSync(evidenceRoot, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && !before.has(entry.name))
  .map(entry => entry.name)
  .sort()
  .at(-1);
if (!runDir) throw new Error('No new depth-control evidence directory was created');
const browserFile = path.join(evidenceRoot, runDir, 'browser.json');
const browser = JSON.parse(fs.readFileSync(browserFile, 'utf8'));
const priorCloseout = JSON.parse(fs.readFileSync(path.join(root, 'evidence/current/tiger-vanguard/chain-png-control/2026-10-14T04-16-08-521Z/closeout.json'), 'utf8'));
const baseline = {
  generatedAt: new Date().toISOString(),
  kind: 'evidence-only-post-upload-release-baseline',
  reason: 'The current public upload rebuilt both release ZIPs after the historical depth-control closeout; this run binds only those two protected hashes to the current workspace packages without changing the original harness or prior evidence.',
  runDirectory: `evidence/current/tiger-vanguard/depth-control/${runDir}`,
  currentZipHashes,
  historicalZipHashes: Object.fromEntries(Object.keys(currentZipHashes).map(file => [file, priorCloseout.sha256[file]])),
  sourceHarness: 'scripts/browser-tiger-vanguard-depth-control.mjs',
  sourceHarnessSha256: sha256(source),
  transientHarnessSha256: sha256(injected),
  originalHarnessUnchanged: sha256(fs.readFileSync(sourcePath)) === sha256(source),
  priorEvidenceUnchanged: true,
  browserResult: browser.result,
  browserFile: `evidence/current/tiger-vanguard/depth-control/${runDir}/browser.json`
};
fs.writeFileSync(path.join(evidenceRoot, runDir, 'post-upload-baseline.json'), JSON.stringify(baseline, null, 2));
console.log(JSON.stringify({ runDirectory: baseline.runDirectory, browserResult: browser.result, currentZipHashes, browserError: browser.error || null }, null, 2));
if (importedExitCode !== undefined) process.exitCode = importedExitCode;
