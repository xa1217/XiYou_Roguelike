import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Inspection only: never rewrites, crops or rasterizes the source artwork.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const runtimeModules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE || '', '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
let PNG;
try { ({ PNG } = await import('pngjs')); }
catch { ({ PNG } = await import(pathToFileURL(path.join(runtimeModules, 'pngjs/lib/png.js')))); }
const asset = 'prototype-2d/assets/enemy-tiger-battle-v1-sheet.png';
const file = fs.readFileSync(path.join(root, asset));
const png = PNG.sync.read(file);
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const threshold = 8; // Ignore sub-visible antialiasing noise, not real edges.
const bands = values => {
  const result = []; let start = -1, last = -1;
  for (let i = 0; i < values.length; i++) {
    if (values[i] > 0) {
      if (start < 0) start = i;
      else if (i - last > 5) { result.push([start, last]); start = i; }
      last = i;
    }
  }
  if (start >= 0) result.push([start, last]);
  return result.filter(([a, b]) => b - a > 5);
};
let transparentPixels = 0, visiblePixels = 0;
const rows = new Uint32Array(png.height);
for (let y = 0; y < png.height; y++) for (let x = 0; x < png.width; x++) {
  const alpha = png.data[(y * png.width + x) * 4 + 3];
  if (alpha === 0) transparentPixels++;
  if (alpha > threshold) { rows[y]++; visiblePixels++; }
}
const rowBands = bands(rows);
const frames = [];
const rowSummary = rowBands.map(([top, bottom], row) => {
  const columns = new Uint32Array(png.width);
  for (let y = top; y <= bottom; y++) for (let x = 0; x < png.width; x++) {
    if (png.data[(y * png.width + x) * 4 + 3] > threshold) columns[x]++;
  }
  const columnBands = bands(columns);
  columnBands.forEach(([left, right], column) => {
    let minY = bottom, maxY = top, count = 0;
    for (let y = top; y <= bottom; y++) for (let x = left; x <= right; x++) {
      if (png.data[(y * png.width + x) * 4 + 3] > threshold) { minY = Math.min(minY, y); maxY = Math.max(maxY, y); count++; }
    }
    const w = right - left + 1, h = maxY - minY + 1;
    const pixels = Buffer.alloc(w * h * 4);
    for (let y = minY; y <= maxY; y++) png.data.copy(pixels, (y - minY) * w * 4, (y * png.width + left) * 4, (y * png.width + right + 1) * 4);
    const index = row * 8 + column;
    frames.push({ index, row, column, state: row === 0 ? 'idle' : row === 1 ? 'move' : row === 2 ? 'attack' : column < 4 ? 'hit' : 'death', rect: { x: left, y: minY, w, h }, visiblePixels: count, rgbaSha256: hash(pixels) });
  });
  return { row, top, bottom, frameCount: columnBands.length, minimumHorizontalGap: columnBands.length > 1 ? Math.min(...columnBands.slice(1).map(([left], i) => left - columnBands[i][1] - 1)) : 0 };
});
const classifiedPixels = frames.reduce((sum, frame) => sum + frame.visiblePixels, 0);
const uniqueFrameCount = new Set(frames.map(frame => frame.rgbaSha256)).size;
const checks = {
  transparentBackground: transparentPixels / (png.width * png.height) > .4,
  fourIsolatedRows: rowBands.length === 4,
  eightIsolatedFiguresPerRow: rowSummary.every(row => row.frameCount === 8 && row.minimumHorizontalGap >= 6),
  thirtyTwoDistinctFrames: frames.length === 32 && uniqueFrameCount === 32,
  allVisiblePixelsAccountedFor: classifiedPixels === visiblePixels,
  noCanvasEdgeClipping: frames.every(f => f.rect.x > 0 && f.rect.y > 0 && f.rect.x + f.rect.w < png.width && f.rect.y + f.rect.h < png.height),
};
const contract = JSON.parse(fs.readFileSync(path.join(root, 'prototype-2d/assets/enemy-tiger-battle-v1-frames.json'), 'utf8'));
checks.contractMatchesSource = contract.sha256 === hash(file) && contract.size[0] === png.width && contract.size[1] === png.height;
checks.contractCoversMeasuredFrames = contract.sourceRects.length === 32 && frames.length === 32 && frames.every((f, i) => {
  const c = contract.sourceRects[i];
  return c.index === i && c.state === f.state && c.x === f.rect.x - 2 && c.y === f.rect.y - 2 && c.w === f.rect.w + 4 && c.h === f.rect.h + 4;
});
const report = {
  generatedAt: new Date().toISOString(), asset, bytes: file.length, sha256: hash(file),
  width: png.width, height: png.height, alphaThreshold: threshold, transparentPixels, visiblePixels, classifiedPixels, uniqueFrameCount,
  rowSummary, frames, checks, result: Object.values(checks).every(Boolean) ? 'PASS' : 'REVIEW',
  scope: 'Read-only PNG alpha/pose-isolation preflight, not gameplay animation acceptance. Use measured rectangles; generated row spacing is not a mathematically exact 8x4 grid. Runtime not changed or approved by this report.',
};
const output = path.join(root, 'evidence/current/tiger/asset-preflight.json');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (report.result !== 'PASS') process.exitCode = 1;
