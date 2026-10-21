import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Read-only raster inspection. No pixel edits, generated crops or encoded
// image outputs; this cannot approve runtime use or animation continuity.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const input = path.resolve(root, process.argv[2] || 'prototype-2d/assets/enemy-bear-battle-v1-sheet.png');
const output = path.resolve(root, process.argv[3] || 'evidence/current/bear/asset-preflight.json');
if (!output.startsWith(path.join(root, 'evidence') + path.sep)) throw new Error('Evidence output must stay inside this workspace evidence directory');
const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE || '', '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
let PNG;
try { ({ PNG } = await import('pngjs')); }
catch { ({ PNG } = await import(pathToFileURL(path.join(modules, 'pngjs/lib/png.js')))); }
const bytes = fs.readFileSync(input), png = PNG.sync.read(bytes);
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const threshold = 8;
const bands = values => {
  const result = []; let start = -1, last = -1;
  for (let i = 0; i < values.length; i++) if (values[i]) {
    if (start < 0) start = i;
    else if (i - last > 5) { result.push([start, last]); start = i; }
    last = i;
  }
  if (start >= 0) result.push([start, last]);
  return result.filter(([first, end]) => end - first > 5);
};
let visiblePixels = 0, transparentPixels = 0;
const rows = new Uint32Array(png.height);
for (let y = 0; y < png.height; y++) for (let x = 0; x < png.width; x++) {
  const a = png.data[(y * png.width + x) * 4 + 3];
  if (a === 0) transparentPixels++;
  if (a > threshold) { rows[y]++; visiblePixels++; }
}
const rowBands = bands(rows), frames = [];
const rowSummary = rowBands.map(([top, bottom], row) => {
  const columns = new Uint32Array(png.width);
  for (let y = top; y <= bottom; y++) for (let x = 0; x < png.width; x++) {
    if (png.data[(y * png.width + x) * 4 + 3] > threshold) columns[x]++;
  }
  const columnBands = bands(columns);
  columnBands.forEach(([left, right], column) => {
    let minY = bottom, maxY = top, count = 0;
    for (let y = top; y <= bottom; y++) for (let x = left; x <= right; x++) if (png.data[(y * png.width + x) * 4 + 3] > threshold) {
      minY = Math.min(minY, y); maxY = Math.max(maxY, y); count++;
    }
    const w = right - left + 1, h = maxY - minY + 1, pixels = Buffer.alloc(w * h * 4);
    for (let y = minY; y <= maxY; y++) png.data.copy(pixels, (y - minY) * w * 4, (y * png.width + left) * 4, (y * png.width + right + 1) * 4);
    frames.push({ index: row * 8 + column, row, column,
      state: row === 0 ? 'idle' : row === 1 ? 'move' : row === 2 ? 'attack' : column < 4 ? 'hit' : 'death',
      rect: { x: left, y: minY, w, h }, visiblePixels: count, rgbaSha256: hash(pixels) });
  });
  return { row, top, bottom, frameCount: columnBands.length,
    minimumHorizontalGap: columnBands.length > 1 ? Math.min(...columnBands.slice(1).map(([left], i) => left - columnBands[i][1] - 1)) : 0 };
});
const uniqueFrames = new Set(frames.map(f => f.rgbaSha256)).size;
const classifiedPixels = frames.reduce((sum, f) => sum + f.visiblePixels, 0);
const checks = {
  transparentBackground: transparentPixels / (png.width * png.height) > .4,
  fourIsolatedRows: rowBands.length === 4,
  eightIsolatedFiguresPerRow: rowSummary.every(row => row.frameCount === 8 && row.minimumHorizontalGap >= 6),
  thirtyTwoDistinctFrames: frames.length === 32 && uniqueFrames === 32,
  allVisiblePixelsAccountedFor: classifiedPixels === visiblePixels,
  noCanvasEdgeClipping: frames.every(f => f.rect.x > 1 && f.rect.y > 1 && f.rect.x + f.rect.w < png.width - 1 && f.rect.y + f.rect.h < png.height - 1),
};
const report = { generatedAt: new Date().toISOString(), input, bytes: bytes.length, sha256: hash(bytes),
  width: png.width, height: png.height, alphaThreshold: threshold, transparentPixels, visiblePixels, classifiedPixels,
  uniqueFrames, rowSummary, frames, checks, result: Object.values(checks).every(Boolean) ? 'PASS' : 'REVIEW',
  scope: 'Read-only PNG isolation/alpha/unique-pixel preflight. Distinct hashes are NOT evidence of smooth animation, consistent anatomy or runtime approval.' };
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ output, width: png.width, height: png.height, bytes: bytes.length, sha256: report.sha256,
  rowSummary, uniqueFrames, checks, result: report.result }, null, 2));
if (report.result !== 'PASS') process.exitCode = 1;
