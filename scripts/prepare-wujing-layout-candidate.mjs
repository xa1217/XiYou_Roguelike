import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

// Evidence only: this never changes an asset, runtime contract or release package.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const relative = file => path.relative(root, file).replaceAll('\\', '/');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const prior = JSON.parse(fs.readFileSync(path.join(root, 'evidence/current/wujing-crop-isolation/2026-10-11T08-23-36-875Z/baseline.json')));
const stamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
const output = path.join(root, 'evidence/current/wujing-layout', stamp);
fs.mkdirSync(output, { recursive: true });
const baseline = {
  generatedAt: new Date().toISOString(), output: relative(output),
  purpose: 'One built-in edit of the existing Wujing eight-pose sheet: layout repair candidate only',
  protected: Object.fromEntries(Object.keys(prior.protected).map(file => [file, hash(path.join(root, file))])),
  previousEvidence: [], runtimeApproved: false, highFrameApproved: false,
  original: 'prototype-2d/assets/hero-wujing-battle-v3-sheet.png',
  originalPurpose: 'Battlefield action sheet; not a portrait. Gameplay wujing; renderer alias shajing.',
  originalDimensions: [1774, 887],
  runtimeReferences: ['prototype-2d/native-app.js: battleV3Files.shajing / attachBattleV3Frames', 'prototype-2d/src/renderer.js: _drawPlayer / spriteFrameRect'],
  priorConclusion: 'REVIEW_RECTANGULAR_CROP_CONTAMINATION; retain all eight original poses and full weapons',
  preparerSha256: hash(fileURLToPath(import.meta.url)),
};
baseline.changedSincePrior = Object.keys(prior.protected).filter(file => prior.protected[file] !== baseline.protected[file]);
baseline.originalSha256 = baseline.protected[baseline.original];
baseline.originalBytes = fs.statSync(path.join(root, baseline.original)).size;
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'prototype-2d/assets/manifest.json')));
const declared = manifest.assets.find(asset => asset.path === path.basename(baseline.original));
baseline.manifestMatches = declared?.sha256?.toLowerCase() === baseline.originalSha256 && declared?.bytes === baseline.originalBytes && declared?.size?.every((n, i) => n === baseline.originalDimensions[i]);
for (const { file } of prior.previousEvidence) {
  const target = path.join(output, 'previous-evidence', file.slice('evidence/current/'.length));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(root, file), target, fs.constants.COPYFILE_EXCL);
  baseline.previousEvidence.push({ file, backup: relative(target), sha256: hash(target) });
}
fs.writeFileSync(path.join(output, 'baseline.json'), JSON.stringify(baseline, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ output: relative(output), protectedCount: Object.keys(baseline.protected).length, backupCount: baseline.previousEvidence.length, originalSha256: baseline.originalSha256, originalBytes: baseline.originalBytes, manifestMatches: baseline.manifestMatches, changedSincePrior: baseline.changedSincePrior }));
if (!baseline.manifestMatches || baseline.changedSincePrior.length) process.exitCode = 1;
