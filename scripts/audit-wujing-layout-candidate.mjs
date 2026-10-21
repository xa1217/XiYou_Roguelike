import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Read-only PNG diagnostics. No crop files, raster edits or runtime changes.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const folder = path.resolve(root, process.argv[2] || 'missing-candidate-directory');
if (!folder.startsWith(path.join(root, 'evidence/current/wujing-layout') + path.sep)) throw new Error('Expected candidate evidence folder');
const relative = file => path.relative(root, file).replaceAll('\\', '/');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE || '', '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const { PNG } = await import(pathToFileURL(path.join(modules, 'pngjs/lib/png.js')));
const input = path.join(folder, 'hero-wujing-layout-v1-candidate.png');
const bytes = fs.readFileSync(input), png = PNG.sync.read(bytes), count = png.width * png.height;
const measure = threshold => {
  const labels = new Int32Array(count), queue = new Int32Array(count), components = [];
  let visiblePixels = 0, edgePixels = 0;
  for (let i = 0; i < count; i++) {
    if (png.data[i * 4 + 3] <= threshold) continue;
    visiblePixels++;
    const ix = i % png.width, iy = Math.floor(i / png.width);
    if (ix === 0 || iy === 0 || ix === png.width - 1 || iy === png.height - 1) edgePixels++;
    if (labels[i]) continue;
    const label = components.length + 1;
    let head = 0, tail = 1, minX = png.width, minY = png.height, maxX = 0, maxY = 0;
    queue[0] = i; labels[i] = label;
    while (head < tail) {
      const current = queue[head++], x = current % png.width, y = Math.floor(current / png.width);
      minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
      const add = next => {
        if (next >= 0 && !labels[next] && png.data[next * 4 + 3] > threshold) { labels[next] = label; queue[tail++] = next; }
      };
      add(x > 0 ? current - 1 : -1); add(x + 1 < png.width ? current + 1 : -1);
      add(y > 0 ? current - png.width : -1); add(y + 1 < png.height ? current + png.width : -1);
    }
    components.push({ label, pixels: tail, x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 });
  }
  const major = components.filter(c => c.pixels >= 10000).sort((a, b) => Math.floor(a.y / (png.height / 2)) - Math.floor(b.y / (png.height / 2)) || a.x - b.x);
  const majorIndex = new Map(major.map((c, i) => [c.label, i]));
  const inRect = (x, y, r) => x >= r.x && y >= r.y && x < r.x + r.w && y < r.y + r.h;
  const inspect = (rect, component) => {
    let ownPixels = 0, minorPixels = 0; const foreignByIndex = {};
    for (let y = Math.max(0, Math.floor(rect.y)); y < Math.min(png.height, Math.ceil(rect.y + rect.h)); y++) {
      for (let x = Math.max(0, Math.floor(rect.x)); x < Math.min(png.width, Math.ceil(rect.x + rect.w)); x++) {
        if (!inRect(x + 0.5, y + 0.5, rect)) continue;
        const label = labels[y * png.width + x]; if (!label) continue;
        if (label === component.label) ownPixels++;
        else if (majorIndex.has(label)) { const index = majorIndex.get(label); foreignByIndex[index] = (foreignByIndex[index] || 0) + 1; }
        else minorPixels++;
      }
    }
    return { rect, ownPixels, lostOwnMajorPixels: component.pixels - ownPixels, minorPixels, foreignByIndex,
      foreignMajorPixels: Object.values(foreignByIndex).reduce((a, b) => a + b, 0) };
  };
  const candidates = major.map((c, index) => {
    const cell = { x: index % 4 * png.width / 4, y: Math.floor(index / 4) * png.height / 2, w: png.width / 4, h: png.height / 2 };
    const tight = { x: c.x, y: c.y, w: c.w, h: c.h };
    const padded = { x: Math.max(0, c.x - 2), y: Math.max(0, c.y - 2), w: Math.min(png.width, c.x + c.w + 2) - Math.max(0, c.x - 2), h: Math.min(png.height, c.y + c.h + 2) - Math.max(0, c.y - 2) };
    return { index, component: c, row: c.y < png.height / 2 ? 0 : 1,
      tight: inspect(tight, c), padded: inspect(padded, c), equalCell: inspect(cell, c),
      equalCellMargins: { left: c.x - cell.x, top: c.y - cell.y, right: cell.x + cell.w - c.x - c.w, bottom: cell.y + cell.h - c.y - c.h } };
  });
  const minor = components.filter(c => c.pixels < 10000);
  let unassignedMinorPixelsOutsideMajorRects = 0;
  for (let i = 0; i < count; i++) {
    if (!labels[i] || majorIndex.has(labels[i])) continue;
    if (!major.some(c => inRect(i % png.width, Math.floor(i / png.width), c))) unassignedMinorPixelsOutsideMajorRects++;
  }
  const rowCounts = [0, 1].map(row => candidates.filter(c => c.row === row).length);
  return { alphaGreaterThan: threshold, connectivity: '4-neighbor', majorMinimumPixels: 10000,
    visiblePixels, transparentPixelsAtThreshold: count - visiblePixels, edgePixels, totalComponents: components.length,
    majorComponents: major.length, rowCounts, exactlyEightMajorComponentsInFourByTwo: major.length === 8 && rowCounts[0] === 4 && rowCounts[1] === 4,
    minorComponents: minor, minorPixels: minor.reduce((sum, c) => sum + c.pixels, 0), unassignedMinorPixelsOutsideMajorRects,
    candidates, allPaddedMajorRectsIsolated: major.length === 8 && candidates.every(c => c.padded.foreignMajorPixels === 0 && c.padded.lostOwnMajorPixels === 0),
    allEqualCellsContainWholeMajor: major.length === 8 && candidates.every(c => c.equalCell.lostOwnMajorPixels === 0 && c.equalCell.foreignMajorPixels === 0),
    allEqualCellsHaveRequestedMargins: major.length === 8 && candidates.every(c => Object.values(c.equalCellMargins).every(n => n >= 30)) };
};
const measurements = [0, 8, 16].map(measure);
const inventory = JSON.parse(fs.readFileSync(path.join(root, 'evidence/current/asset-dedup-audit.json')));
const baseline = JSON.parse(fs.readFileSync(path.join(folder, 'baseline.json')));
const report = { generatedAt: new Date().toISOString(), scope: 'Evidence-only eight-pose layout-edit candidate diagnostics; not production animation acceptance',
  input: relative(input), sha256: hash(bytes), bytes: bytes.length, width: png.width, height: png.height,
  originalSha256: hash(fs.readFileSync(path.join(root, baseline.original))), originalMatchesBefore: hash(fs.readFileSync(path.join(root, baseline.original))) === baseline.originalSha256,
  candidateDuplicatesInMediaInventory: inventory.inventory.filter(item => item.sha256 === hash(bytes)).map(item => item.path),
  measurements, candidateLayoutPassed: false, runtimeApproved: false, highFrameApproved: false,
  result: measurements.some(m => !m.exactlyEightMajorComponentsInFourByTwo || !m.allPaddedMajorRectsIsolated || !m.allEqualCellsHaveRequestedMargins) ? 'REVIEW_LAYOUT_CONSTRAINTS_NOT_MET' : 'REVIEW_REQUIRES_SEMANTIC_POSE_AND_SCALE_CHECK',
  limitations: ['Major connected components are not semantic pose counts.', 'Minor and detached components remain explicit; complete weapons require visual review.', 'Equal-cell checks are only diagnostic and are not a proposed runtime contract.', 'No head/body uniform-scale or pose-preservation approval can be inferred from bbox dimensions.', 'No new source poses, high-frame animation, gameplay, FPS, ZIP, public-internet or device acceptance.'],
  scriptSha256: hash(fs.readFileSync(fileURLToPath(import.meta.url))) };
const output = path.join(folder, `preflight-${new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')}.json`);
fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ output: relative(output), sha256: report.sha256, size: [png.width, png.height], result: report.result,
  measurements: measurements.map(m => ({ alpha: m.alphaGreaterThan, major: m.majorComponents, rows: m.rowCounts, edge: m.edgePixels,
    paddedIsolated: m.allPaddedMajorRectsIsolated, equalCellsComplete: m.allEqualCellsContainWholeMajor, margin30: m.allEqualCellsHaveRequestedMargins,
    minorPixels: m.minorPixels, unassignedMinorPixels: m.unassignedMinorPixelsOutsideMajorRects,
    actors: m.candidates.map(c => ({ index: c.index, rect: c.tight.rect, paddedForeign: c.padded.foreignMajorPixels, equalCellLost: c.equalCell.lostOwnMajorPixels, equalCellForeign: c.equalCell.foreignMajorPixels, margins: c.equalCellMargins })) })) }, null, 2));
