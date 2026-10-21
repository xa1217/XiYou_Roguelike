import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Read-only source-pixel reuse audit. Never edits or repacks either PNG and
// never changes a runtime asset contract or approves an animation.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'evidence/current/tiger-vanguard');
const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE || '', '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
let PNG;
try { ({ PNG } = await import('pngjs')); }
catch { ({ PNG } = await import(pathToFileURL(path.join(modules, 'pngjs/lib/png.js')))); }
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const fingerprint = files => Object.fromEntries(files.map(file => [file, hash(fs.readFileSync(path.join(root, file)))]));
const walk = folder => fs.readdirSync(path.join(root, folder), { withFileTypes: true }).flatMap(entry =>
  entry.isDirectory() ? walk(`${folder}/${entry.name}`) : [`${folder}/${entry.name}`]);
const runtimeReferenceFiles = ['prototype-2d/native-app.js', ...walk('prototype-2d/src'), 'prototype-2d/assets/manifest.json',
  'scripts/serve.mjs', 'scripts/release.mjs', 'scripts/runtime-frame-contract.mjs'];
const protectedFiles = [...new Set([...runtimeReferenceFiles, ...walk('prototype-2d/assets'),
  ...fs.readdirSync(path.join(root, 'dist')).filter(file => file.endsWith('.zip')).map(file => `dist/${file}`),
  ...['v1', 'v2'].map(version => `evidence/current/tiger-vanguard/candidate-${version}-sheet.png`)])];
const report = { generatedAt: new Date().toISOString(), result: 'FAIL', scope: 'Evidence-only two-page source reuse feasibility; not animation quality, runtime, ZIP, public or device acceptance.',
  protectedBefore: fingerprint(protectedFiles), sourcePages: [], frames: [], checks: {}, runtimeApproved: false, highFrameApproved: false, publicPass: false };
try {
  const sources = new Map();
  for (const version of ['v1', 'v2']) {
    const file = `evidence/current/tiger-vanguard/candidate-${version}-sheet.png`, bytes = fs.readFileSync(path.join(root, file));
    const png = PNG.sync.read(bytes), preflight = JSON.parse(fs.readFileSync(path.join(dir, `asset-preflight-${version}.json`), 'utf8'));
    if (hash(bytes) !== preflight.sha256 || png.width !== preflight.width || png.height !== preflight.height) throw new Error(`${version}: source no longer matches measured preflight`);
    sources.set(version, { png, preflight });
    report.sourcePages.push({ id: version, file, sha256: hash(bytes), bytes: bytes.length, width: png.width, height: png.height,
      purpose: 'Tiger Vanguard candidate only; not ordinary tiger or a final Boss', selectedStates: version === 'v1' ? ['attack'] : ['idle', 'move', 'hit', 'death'] });
  }
  for (let index = 0; index < 32; index++) {
    const page = index >= 16 && index < 24 ? 'v1' : 'v2', { png, preflight } = sources.get(page);
    const frame = preflight.frames.find(frame => frame.index === index);
    if (!frame) throw new Error(`Missing source region ${page}:${index}`);
    const { x, y, w, h } = frame.rect, padding = 2;
    const pixels = Buffer.alloc(w * h * 4);
    for (let row = 0; row < h; row++) png.data.copy(pixels, row * w * 4, ((y + row) * png.width + x) * 4, ((y + row) * png.width + x + w) * 4);
    const rgbaSha256 = hash(pixels), thresholds = [];
    for (const alphaThreshold of [8, 16]) {
      let visible = 0, guardPixels = 0;
      for (let py = y - padding; py < y + h + padding; py++) for (let px = x - padding; px < x + w + padding; px++) {
        if (px < 0 || py < 0 || px >= png.width || py >= png.height) continue;
        if (png.data[(py * png.width + px) * 4 + 3] <= alphaThreshold) continue;
        if (px >= x && px < x + w && py >= y && py < y + h) visible++;
        else guardPixels++;
      }
      thresholds.push({ alphaThreshold, visible, guardPixels });
    }
    report.frames.push({ index, state: frame.state, page, sourceRect: { x: x - padding, y: y - padding, w: w + padding * 2, h: h + padding * 2 },
      visibleRect: { ...frame.rect }, rgbaSha256, thresholds,
      sourceMeasurementsMatch: rgbaSha256 === frame.rgbaSha256 && thresholds[0].visible === frame.visiblePixels,
      paddingInsideSource: x >= padding && y >= padding && x + w + padding <= png.width && y + h + padding <= png.height,
      anchorStatus: 'UNREVIEWED: browser preview uses bbox bottom-center, not an authored ground pivot' });
  }
  const expectedCounts = { idle: 8, move: 8, attack: 8, hit: 4, death: 4 };
  report.stateCounts = Object.fromEntries(Object.keys(expectedCounts).map(state => [state, report.frames.filter(frame => frame.state === state).length]));
  report.runtimeReferences = runtimeReferenceFiles.filter(file => {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    return report.sourcePages.some(page => source.includes(path.basename(page.file)) || source.includes(page.sha256));
  });
  report.checks = {
    exactly32IndexedRegions: report.frames.length === 32 && report.frames.every((frame, index) => frame.index === index),
    expectedStateCounts: Object.entries(expectedCounts).every(([state, count]) => report.stateCounts[state] === count),
    distinctSourcePixels: new Set(report.frames.map(frame => frame.rgbaSha256)).size === 32,
    originalMeasurementsMatch: report.frames.every(frame => frame.sourceMeasurementsMatch),
    selectedCropsInsideSource: report.frames.every(frame => frame.paddingInsideSource),
    twoThresholdTransparentGuards: report.frames.every(frame => frame.thresholds.every(row => row.visible > 0 && row.guardPixels === 0)),
    noProductionReferences: report.runtimeReferences.length === 0,
  };
  report.transitionRisk = { from: 'v2 idle[7]', to: 'v1 attack[0]', sourceVisibleHeight: [report.frames[7].visibleRect.h, report.frames[16].visibleRect.h],
    previewHeightAt64: [report.frames[7].visibleRect.h, report.frames[16].visibleRect.h].map(height => Number((height * 64 / 193).toFixed(3))),
    note: 'One fixed source-pixel scale, not per-frame normalization. Cross-page identity, body scale, weapon continuity and ground pivots remain unapproved; differing bbox heights alone do not prove or disprove quality.' };
  report.result = Object.values(report.checks).every(Boolean) ? 'REVIEW_32_SOURCE_REGIONS_AVAILABLE' : 'REVIEW_SOURCE_REUSE_FAILED';
} catch (error) { report.error = String(error.stack || error); }
report.protectedAfter = fingerprint(protectedFiles);
report.protectedUnchanged = JSON.stringify(report.protectedBefore) === JSON.stringify(report.protectedAfter);
if (!report.protectedUnchanged) report.result = 'FAIL';
report.finishedAt = new Date().toISOString();
fs.writeFileSync(path.join(dir, 'reuse-plan-node.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ result: report.result, stateCounts: report.stateCounts, checks: report.checks, transitionRisk: report.transitionRisk,
  protectedUnchanged: report.protectedUnchanged, runtimeApproved: report.runtimeApproved, error: report.error }, null, 2));
if (report.result === 'FAIL') process.exitCode = 1;
