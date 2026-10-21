import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Read-only feasibility audit: no PNG crops, masks, re-encoding or runtime edits.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
const output = path.join(root, 'evidence/current/wujing-crop-isolation', stamp);
fs.mkdirSync(output, { recursive: true });
const relative = file => path.relative(root, file).replaceAll('\\', '/');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const priorAudit = JSON.parse(fs.readFileSync(path.join(root, 'evidence/current/hero-highframe/2026-10-11T08-02-47-308Z/browser.json'), 'utf8'));
const baseline = {
  generatedAt: new Date().toISOString(),
  protected: Object.fromEntries(Object.keys(priorAudit.protectedBefore).map(file => [file, hash(fs.readFileSync(path.join(root, file)))])),
  previousEvidence: [],
};
for (const old of priorAudit.previousEvidence) {
  const target = path.join(output, 'previous-evidence', old.file.slice('evidence/current/'.length));
  fs.mkdirSync(path.dirname(target), { recursive: true }); fs.copyFileSync(path.join(root, old.file), target);
  baseline.previousEvidence.push({ file: old.file, backup: relative(target), sha256: hash(fs.readFileSync(target)) });
}
fs.writeFileSync(path.join(output, 'baseline.json'), JSON.stringify(baseline, null, 2));
const input = 'prototype-2d/assets/hero-wujing-battle-v3-sheet.png';
const bytes = fs.readFileSync(path.join(root, input));
let PNG;
try { ({ PNG } = await import('pngjs')); }
catch {
  const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE || '', '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
  ({ PNG } = await import(pathToFileURL(path.join(modules, 'pngjs/lib/png.js'))));
}
const png = PNG.sync.read(bytes), count = png.width * png.height;
function measure(threshold) {
  const labels = new Int32Array(count), queue = new Int32Array(count), components = [];
  let visiblePixels = 0;
  for (let i = 0; i < count; i++) {
    if (png.data[i * 4 + 3] <= threshold) continue;
    visiblePixels++;
    if (labels[i]) continue;
    const label = components.length + 1;
    let head = 0, tail = 1, minX = png.width, minY = png.height, maxX = 0, maxY = 0;
    queue[0] = i; labels[i] = label;
    while (head < tail) {
      const current = queue[head++], x = current % png.width, y = Math.floor(current / png.width);
      minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      const add = next => { if (next >= 0 && !labels[next] && png.data[next * 4 + 3] > threshold) { labels[next] = label; queue[tail++] = next; } };
      add(x > 0 ? current - 1 : -1); add(x + 1 < png.width ? current + 1 : -1);
      add(y > 0 ? current - png.width : -1); add(y + 1 < png.height ? current + png.width : -1);
    }
    components.push({ label, pixels: tail, x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 });
  }
  const major = components.filter(component => component.pixels >= 10000)
    .sort((a, b) => Math.floor(a.y / (png.height / 2)) - Math.floor(b.y / (png.height / 2)) || a.x - b.x);
  const majorIndex = new Map(major.map((component, index) => [component.label, index]));
  const candidates = major.map((component, index) => {
    const inspect = padding => {
      const rect = { x: Math.max(0, component.x - padding), y: Math.max(0, component.y - padding),
        w: Math.min(png.width, component.x + component.w + padding) - Math.max(0, component.x - padding),
        h: Math.min(png.height, component.y + component.h + padding) - Math.max(0, component.y - padding) };
      let ownPixels = 0, minorPixels = 0; const neighborPixelsByIndex = {};
      for (let y = rect.y; y < rect.y + rect.h; y++) for (let x = rect.x; x < rect.x + rect.w; x++) {
        const label = labels[y * png.width + x]; if (!label) continue;
        if (label === component.label) ownPixels++;
        else if (majorIndex.has(label)) { const other = majorIndex.get(label); neighborPixelsByIndex[other] = (neighborPixelsByIndex[other] || 0) + 1; }
        else minorPixels++;
      }
      return { rect, ownPixels, minorPixels, neighborPixelsByIndex,
        neighborPixels: Object.values(neighborPixelsByIndex).reduce((sum, n) => sum + n, 0),
        entireMajorComponentPreserved: ownPixels === component.pixels };
    };
    return { index, row: component.y < png.height / 2 ? 0 : 1, component, tight: inspect(0), padded: inspect(2) };
  });
  return { alphaGreaterThan: threshold, connectivity: '4-neighbor', majorMinimumPixels: 10000,
    totalComponents: components.length, majorComponents: major.length, visiblePixels,
    minorComponentPixels: components.filter(component => component.pixels < 10000).reduce((sum, component) => sum + component.pixels, 0),
    rowCounts: [0, 1].map(row => candidates.filter(item => item.row === row).length), candidates,
    allTightRectsIsolated: candidates.every(item => item.tight.neighborPixels === 0),
    allPaddedRectsIsolated: candidates.every(item => item.padded.neighborPixels === 0) };
}
const measurements = [measure(0), measure(8)];
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'prototype-2d/assets/manifest.json'), 'utf8'));
const declared = manifest.assets.find(item => item.path === 'hero-wujing-battle-v3-sheet.png');
const report = {
  generatedAt: new Date().toISOString(), output: relative(output), input, bytes: bytes.length, sha256: hash(bytes),
  width: png.width, height: png.height, purpose: 'existing Wujing battlefield sprite; not a portrait or final high-frame sheet',
  references: { loader: 'prototype-2d/native-app.js: battleV3Files.shajing / attachBattleV3Frames', renderer: 'prototype-2d/src/renderer.js: _drawPlayer / spriteFrameRect' },
  manifestMatches: declared?.sha256?.toLowerCase() === hash(bytes) && declared?.bytes === bytes.length && declared?.size?.[0] === png.width && declared?.size?.[1] === png.height,
  measurements, runtimeApproved: false, animationQualityApproved: false,
  result: measurements.some(m => !m.allTightRectsIsolated) ? 'REVIEW_RECTANGULAR_CROP_CONTAMINATION' : 'REVIEW_REQUIRES_VISUAL_AND_ANCHOR_VALIDATION',
  reasoning: 'An axis-aligned rectangle containing every major-component pixel must contain its tight bounding box. Any other major-component pixel already inside that box cannot be removed by rectangle coordinates or padding without losing part of the intended component. Root offsets/scales do not change source-pixel contamination.',
  limitations: [
    'Connected components and bounding boxes are not semantic pose or animation-quality approvals.',
    'Small detached components remain explicitly unassigned; no claim that every soft fringe belongs to the right actor.',
    'No alternative mask, image edit, source regeneration, frame anchor or production fix is approved by this audit.',
  ],
  scriptSha256: hash(fs.readFileSync(fileURLToPath(import.meta.url))),
};
fs.writeFileSync(path.join(output, 'preflight.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ output: relative(output), result: report.result, manifestMatches: report.manifestMatches,
  measurements: measurements.map(m => ({ alphaGreaterThan: m.alphaGreaterThan, rows: m.rowCounts, minorPixels: m.minorComponentPixels,
    contaminated: m.candidates.filter(c => c.tight.neighborPixels > 0).map(c => ({ index: c.index, tightForeign: c.tight.neighborPixels, paddedForeign: c.padded.neighborPixels })) })) }, null, 2));
// REVIEW is an expected diagnostic finding, not a successful runtime gate.
if (!report.manifestMatches || measurements.some(m => m.majorComponents !== 8)) process.exitCode = 1;
