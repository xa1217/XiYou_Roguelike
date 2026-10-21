import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Evidence only. Pixel components and x-projection runs are not semantic poses.
// Never edits, thresholds, masks, exports or repacks the source image.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const generatedAt = new Date().toISOString();
const output = path.join(root, 'evidence/current/tiger-vanguard/single-source', generatedAt.replaceAll(':', '-').replaceAll('.', '-'));
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const walk = dir => fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`]);
const references = ['prototype-2d/native-app.js', ...walk('prototype-2d/src'), 'prototype-2d/assets/manifest.json',
  'scripts/serve.mjs', 'scripts/release.mjs', 'scripts/runtime-frame-contract.mjs'];
const protectedFiles = [...new Set([...references, ...walk('prototype-2d/assets'),
  ...walk('dist').filter(f => f.endsWith('.zip')),
  ...['v1', 'v2'].map(v => `evidence/current/tiger-vanguard/candidate-${v}-sheet.png`)])];
const fingerprint = () => Object.fromEntries(protectedFiles.map(f => [f, sha(fs.readFileSync(path.join(root, f)))]));
const report = { generatedAt, result: 'FAIL', scope: 'Single-source v1 pixel isolation/edge defect inventory only; no animation, root, runtime, ZIP, public, FPS or device approval.',
  scriptSha256: sha(fs.readFileSync(fileURLToPath(import.meta.url))), protectedBefore: fingerprint(), runtimeApproved: false, highFrameApproved: false, publicPass: false };

const inside = (r, x, y) => x >= r.x && y >= r.y && x < r.x + r.w && y < r.y + r.h;
const expand = (r, pad) => ({ x: r.x - pad, y: r.y - pad, w: r.w + 2 * pad, h: r.h + 2 * pad });
const union = (a, b) => ({ x: Math.min(a.x, b.x), y: Math.min(a.y, b.y),
  w: Math.max(a.x + a.w, b.x + b.w) - Math.min(a.x, b.x), h: Math.max(a.y + a.h, b.y + b.h) - Math.min(a.y, b.y) });
const inSource = (p, r) => r.x >= 0 && r.y >= 0 && r.x + r.w <= p.width && r.y + r.h <= p.height;
const runs = counts => {
  const out = [];
  for (let i = 0; i < counts.length; i++) if (counts[i]) {
    const start = i;
    while (i + 1 < counts.length && counts[i + 1]) i++;
    out.push({ start, end: i });
  }
  return out;
};
function components(png, threshold) {
  const { width, height, data } = png, labels = new Int32Array(width * height), queue = new Int32Array(width * height), items = [];
  for (let start = 0; start < labels.length; start++) {
    if (labels[start] || data[start * 4 + 3] <= threshold) continue;
    const id = items.length + 1;
    let head = 0, tail = 1, minX = width, minY = height, maxX = -1, maxY = -1;
    queue[0] = start; labels[start] = id;
    while (head < tail) {
      const p = queue[head++], x = p % width, y = Math.floor(p / width);
      minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const n = ny * width + nx;
        if (!labels[n] && data[n * 4 + 3] > threshold) { labels[n] = id; queue[tail++] = n; }
      }
    }
    items.push({ id, pixels: tail, rect: { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 } });
  }
  return { labels, items };
}
function projection(png, threshold) {
  const rows = new Uint32Array(png.height);
  for (let y = 0; y < png.height; y++) for (let x = 0; x < png.width; x++) if (png.data[(y * png.width + x) * 4 + 3] > threshold) rows[y]++;
  return runs(rows).map(band => {
    const columns = new Uint32Array(png.width);
    for (let y = band.start; y <= band.end; y++) for (let x = 0; x < png.width; x++) if (png.data[(y * png.width + x) * 4 + 3] > threshold) columns[x]++;
    const regions = runs(columns).map(run => {
      let top = png.height, bottom = -1, visible = 0;
      for (let y = band.start; y <= band.end; y++) for (let x = run.start; x <= run.end; x++) if (png.data[(y * png.width + x) * 4 + 3] > threshold) {
        top = Math.min(top, y); bottom = Math.max(bottom, y); visible++;
      }
      return { rect: { x: run.start, y: top, w: run.end - run.start + 1, h: bottom - top + 1 }, visible };
    });
    return { top: band.start, bottom: band.end, regions };
  });
}
function inspectRect(png, threshold, r, labels, ownId, majorIds) {
  const padded = expand(r, 2);
  let visible = 0, guardPixels = 0, foreignMajorInRect = 0, foreignMajorInGuard = 0, sourceEdgePixels = 0;
  for (let y = Math.max(0, padded.y); y < Math.min(png.height, padded.y + padded.h); y++) {
    for (let x = Math.max(0, padded.x); x < Math.min(png.width, padded.x + padded.w); x++) {
      const pixel = y * png.width + x;
      if (png.data[pixel * 4 + 3] <= threshold) continue;
      const foreign = labels[pixel] !== ownId && majorIds.has(labels[pixel]);
      if (inside(r, x, y)) {
        visible++; if (foreign) foreignMajorInRect++;
        if (x === 0 || y === 0 || x === png.width - 1 || y === png.height - 1) sourceEdgePixels++;
      }
      else { guardPixels++; if (foreign) foreignMajorInGuard++; }
    }
  }
  return { threshold, visible, guardPixels, foreignMajorInRect, foreignMajorInGuard, sourceEdgePixels, paddingInsideSource: inSource(png, padded) };
}
function retainNearbyFringe(band, major) {
  const groups = band.regions.map(r => ({ ...r, bodyIds: major.filter(b => inside(r.rect, b.rect.x, b.rect.y)).map(b => b.id), fringe: [] }));
  const bodies = groups.filter(g => g.bodyIds.length), detached = groups.filter(g => !g.bodyIds.length);
  for (const fragment of detached) {
    const distances = bodies.map(group => ({ group, gap: Math.max(group.rect.x - fragment.rect.x - fragment.rect.w, fragment.rect.x - group.rect.x - group.rect.w, 0) }))
      .sort((a, b) => a.gap - b.gap);
    // Include nearby detached fringe without removing or assigning image pixels.
    // Ambiguous or distant fragments must be reviewed instead of silently lost.
    assert.ok(distances[0] && distances[0].gap <= 2 && distances[0].gap < (distances[1]?.gap ?? Infinity), 'Unowned/ambiguous detached fringe');
    const nearest = distances[0].group;
    nearest.fringe.push({ rect: fragment.rect, visible: fragment.visible, horizontalGap: distances[0].gap });
    nearest.rect = union(nearest.rect, fragment.rect); nearest.visible += fragment.visible;
  }
  assert.equal(groups.reduce((sum, g) => sum + (g.bodyIds.length ? 0 : g.visible), 0), bodies.reduce((sum, g) => sum + g.fringe.reduce((s, f) => s + f.visible, 0), 0));
  return bodies;
}
function selfTest() {
  const fixture = (width, height, points) => {
    const data = Buffer.alloc(width * height * 4);
    points.forEach(([x, y]) => { data[(y * width + x) * 4 + 3] = 255; });
    return { width, height, data };
  };
  const p = fixture(8, 7, [[2, 2], [3, 2], [3, 5], [4, 5]]), c = components(p, 8);
  assert.equal(c.items.length, 2);
  assert.equal(runs(Uint8Array.from({ length: 8 }, (_, x) => [2, 3, 4].includes(x) ? 1 : 0)).length, 1);
  assert.equal(components(fixture(4, 4, [[1, 1], [2, 2]]), 8).items.length, 1);
  assert.equal(inSource(p, expand({ x: 0, y: 2, w: 2, h: 2 }, 2)), false);
  const stats = inspectRect(p, 8, { x: 2, y: 2, w: 2, h: 4 }, c.labels, c.items[0].id, new Set(c.items.map(i => i.id)));
  assert.equal(stats.foreignMajorInRect, 1); assert.equal(stats.foreignMajorInGuard, 1);
  const groups = retainNearbyFringe({ regions: [{ rect: { x: 2, y: 2, w: 1, h: 1 }, visible: 1 }, { rect: { x: 4, y: 1, w: 2, h: 4 }, visible: 8 }] },
    [{ id: 1, rect: { x: 4, y: 1, w: 2, h: 4 } }]);
  assert.deepEqual(groups[0].rect, { x: 2, y: 1, w: 4, h: 4 }); assert.equal(groups[0].visible, 9);
  return { result: 'PASS', checks: ['projection-is-not-component-count', 'eight-connected-diagonal', 'edge-padding-rejected', 'foreign-body-crop-and-guard-counts', 'detached-fringe-retained'] };
}
try {
  report.selfTest = selfTest();
  let PNG;
  try { ({ PNG } = await import('pngjs')); } catch {
    const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE || '', '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
    ({ PNG } = await import(pathToFileURL(path.join(modules, 'pngjs/lib/png.js'))));
  }
  const file = 'evidence/current/tiger-vanguard/candidate-v1-sheet.png', bytes = fs.readFileSync(path.join(root, file)), png = PNG.sync.read(bytes);
  report.source = { file, sha256: sha(bytes), bytes: bytes.length, width: png.width, height: png.height,
    purpose: 'Existing armored Tiger Vanguard draft v1 only, not ordinary tiger or final Boss; no v2 mixing.' };
  assert.equal(report.source.sha256, '9f59a6bab970bd3a4b68383a392488c9634a61e5fd4a71152af786fc4ee34824');
  assert.deepEqual([png.width, png.height], [1774, 887]);
  const measured = [8, 16].map(threshold => {
    const c = components(png, threshold), bands = projection(png, threshold), major = c.items.filter(i => i.pixels >= 1000);
    assert.equal(bands.length, 4, 'Unexpected source row layout');
    const ordered = bands.flatMap((b, row) => major.filter(i => i.rect.y >= b.top && i.rect.y + i.rect.h - 1 <= b.bottom)
      .sort((a, z) => a.rect.x - z.rect.x).map((i, column) => ({ ...i, row, column, index: row * 8 + column })));
    assert.equal(ordered.length, 32, 'Not 32 large components; do not infer missing semantic poses from this');
    assert.ok(bands.every((_, row) => ordered.filter(i => i.row === row).length === 8));
    return { threshold, ...c, bands, major: ordered, groups: bands.map((b, row) => retainNearbyFringe(b, ordered.filter(i => i.row === row))) };
  });
  report.measurementPolicy = { alphaThresholds: [8, 16], connectivity: 8, majorComponentMinPixels: 1000, guard: 2,
    limits: 'Large components are machine labels, not authored poses. Whole projection regions retain all pixels; detached fringe-only x runs within two blank columns are included in the nearest unambiguous body region, not masked away. For the merged death pair, tight component boxes are probes only; no ownership assigned to detached fringe, no pixels removed. Alpha<=8 is preserved in source bytes but not certified as a transparent guard.' };
  report.thresholds = measured.map(m => ({ threshold: m.threshold, totalComponents: m.items.length, majorComponentCount: m.major.length,
    projectionRegionCount: m.bands.reduce((sum, b) => sum + b.regions.length, 0),
    fringeRetainedRegionCount: m.groups.reduce((sum, groups) => sum + groups.length, 0),
    rows: m.bands.map((b, row) => ({ row, top: b.top, bottom: b.bottom, rawProjectionRegions: b.regions.length, fringeRetainedRegions: m.groups[row].length,
      fringe: m.groups[row].flatMap(g => g.fringe), majorComponents: m.major.filter(i => i.row === row).length })),
    deathPair: m.major.slice(30).map(({ id, pixels, rect, index }) => ({ id, pixels, rect, index })) }));
  report.candidates = measured[0].major.map(body => {
    const region = measured[0].groups[body.row].find(r => inside(r.rect, body.rect.x, body.rect.y));
    assert.ok(region);
    const regionBodies = measured[0].major.filter(m => m.row === body.row && inside(region.rect, m.rect.x, m.rect.y));
    const rect = regionBodies.length === 1 ? region.rect : body.rect;
    const pixels = Buffer.alloc(rect.w * rect.h * 4);
    for (let y = 0; y < rect.h; y++) png.data.copy(pixels, y * rect.w * 4, ((rect.y + y) * png.width + rect.x) * 4, ((rect.y + y) * png.width + rect.x + rect.w) * 4);
    const checks = measured.map(m => inspectRect(png, m.threshold, rect, m.labels, m.major[body.index].id, new Set(m.major.map(i => i.id))));
    const isolated = regionBodies.length === 1 && checks.every(c => c.paddingInsideSource && c.guardPixels === 0 && c.foreignMajorInRect === 0);
    const state = ['idle', 'move', 'attack', body.column < 4 ? 'hit' : 'death'][body.row];
    return { index: body.index, row: body.row, column: body.column, state, stateIndex: body.row === 3 ? body.column % 4 : body.column,
      rect, rgbaSha256: sha(pixels), cropType: regionBodies.length === 1 ? 'whole-projection-region' : 'main-component-probe-only',
      projectionRegionBodyIndices: regionBodies.map(b => b.index), checks, isolationCandidate: isolated,
      status: isolated ? 'ISOLATED_SOURCE_CANDIDATE_NOT_ANIMATION_APPROVAL' : regionBodies.length > 1 ? 'DEATH_PAIR_RECTANGLE_ISOLATION_UNRESOLVED'
        : checks.some(c => !c.paddingInsideSource) ? 'SOURCE_EDGE_REPAIR_REQUIRED' : 'TRANSPARENT_GUARD_UNRESOLVED' };
  });
  report.runtimeReferences = references.filter(f => {
    const text = fs.readFileSync(path.join(root, f), 'utf8');
    return text.includes(path.basename(file)) || text.includes(report.source.sha256);
  });
  report.summary = { componentCandidateCount: report.candidates.length,
    isolatedCandidateIndices: report.candidates.filter(c => c.isolationCandidate).map(c => c.index),
    defectIndices: report.candidates.filter(c => !c.isolationCandidate).map(c => c.index),
    isolatedCounts: Object.fromEntries(['idle', 'move', 'attack', 'hit', 'death'].map(state => [state, report.candidates.filter(c => c.state === state && c.isolationCandidate).length])),
    interpretation: 'v1 has 32 large source components, not a proven missing death drawing. Alpha>8 x projection merges the final pair because their x extents overlap; alpha>16 separates those x runs. 31 regions must not be called 31 semantic poses. Animation distinctness/quality still require human review.' };
  report.checks = { selfTestsPassed: report.selfTest.result === 'PASS', thirtyTwoLargeComponentsAtBothThresholds: measured.every(m => m.major.length === 32),
    candidatePixelHashesDistinct: new Set(report.candidates.map(c => c.rgbaSha256)).size === 32, noProductionReferences: report.runtimeReferences.length === 0 };
  report.result = Object.values(report.checks).every(Boolean) ? 'REVIEW_SINGLE_SOURCE_ISOLATION_INVENTORY' : 'FAIL';
} catch (error) { report.error = String(error.stack || error); }
report.protectedAfter = fingerprint();
report.protectedUnchanged = JSON.stringify(report.protectedBefore) === JSON.stringify(report.protectedAfter);
if (!report.protectedUnchanged) report.result = 'FAIL';
report.finishedAt = new Date().toISOString();
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, 'node.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ output: path.relative(root, output).replaceAll('\\', '/'), result: report.result, summary: report.summary,
  thresholds: report.thresholds, defects: report.candidates?.filter(c => !c.isolationCandidate), checks: report.checks,
  protectedUnchanged: report.protectedUnchanged, error: report.error }, null, 2));
if (report.result === 'FAIL') process.exitCode = 1;
