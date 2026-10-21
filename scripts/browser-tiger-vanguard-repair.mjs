import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

// Original-pixel diagnostics only. Never edits a PNG or a production contract.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.resolve(root, process.argv[2] || '');
assert.ok(dir.startsWith(path.join(root, 'evidence/current/tiger-vanguard/local-repair') + path.sep));
const { PNG } = createRequire(import.meta.url)(path.join(process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules'), 'pngjs'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const relative = file => path.relative(root, file).replaceAll('\\', '/');
const before = read(path.join(dir, 'pre-edit.json'));
const prior = read(path.join(root, 'evidence/current/tiger-vanguard/single-source/2026-10-13T05-44-03-776Z/node.json'));
const fingerprint = () => Object.fromEntries(Object.keys(before.protectedBefore).map(f => [f, hash(fs.readFileSync(path.join(root, f)))]));
const generatedAt = new Date().toISOString();
const output = path.join(dir, 'review', generatedAt.replaceAll(':', '-').replaceAll('.', '-'));
fs.mkdirSync(output, { recursive: true });
const report = { generatedAt, result: 'FAIL', scope: 'Three-frame local repair candidate geometry and original-source visual comparison only; not animation continuity, runtime, gameplay, public, ZIP, device or FPS approval.',
  scriptSha256: hash(fs.readFileSync(fileURLToPath(import.meta.url))), protectedBefore: fingerprint(),
  screenshots: [], pageErrors: [], consoleErrors: [], failedRequests: [], externalRequests: [], runtimeApproved: false, highFrameApproved: false, publicPass: false };
function regions(png, threshold) {
  const columns = new Uint32Array(png.width);
  for (let y = 0; y < png.height; y++) for (let x = 0; x < png.width; x++) if (png.data[(y * png.width + x) * 4 + 3] > threshold) columns[x]++;
  const frames = [];
  for (let x = 0; x < png.width; x++) if (columns[x]) {
    const left = x; while (x + 1 < png.width && columns[x + 1]) x++;
    let top = png.height, bottom = -1, visible = 0;
    for (let px = left; px <= x; px++) for (let y = 0; y < png.height; y++) if (png.data[(y * png.width + px) * 4 + 3] > threshold) {
      top = Math.min(top, y); bottom = Math.max(bottom, y); visible++;
    }
    frames.push({ rect: { x: left, y: top, w: x - left + 1, h: bottom - top + 1 }, visible });
  }
  return frames;
}
const bounded = async (promise, name) => { let timer; try {
  return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${name} timeout`)), 15000); })]);
} finally { clearTimeout(timer); } };
let browser;
try {
  assert.deepEqual(report.protectedBefore, before.protectedBefore, 'Original protected files changed');
  const sourceBytes = fs.readFileSync(path.join(root, before.source.file)), source = PNG.sync.read(sourceBytes);
  assert.equal(hash(sourceBytes), before.source.sha256);
  const candidateFile = path.join(dir, 'candidate-v1-three-frame-patch.png'), bytes = fs.readFileSync(candidateFile), png = PNG.sync.read(bytes);
  assert.equal(hash(bytes), 'e04bdf485aae996872827efe6ad8ef9e575eb7671a7e101f70c5c8f54b510e5a');
  report.source = before.source;
  report.candidate = { file: relative(candidateFile), sha256: hash(bytes), bytes: bytes.length, width: png.width, height: png.height,
    purpose: 'v1 indices7/30/31 local repair patch only; original other29 remain untouched', mode: 'built-in image_gen edit', generatedAssetCount: 1 };
  report.preflight = [8, 16].map(threshold => {
    const frames = regions(png, threshold);
    return { threshold, frames, horizontalGaps: frames.slice(1).map((f, i) => f.rect.x - frames[i].rect.x - frames[i].rect.w),
      edgeMargins: frames.map(({ rect: r }) => ({ left: r.x, top: r.y, right: png.width - r.x - r.w, bottom: png.height - r.y - r.h })) };
  });
  assert.ok(report.preflight.every(p => p.frames.length === 3), 'Unexpected candidate layout: cannot assign three source slots');
  report.geometryChecks = {
    exactlyThreeRegionsBothThresholds: report.preflight.every(p => p.frames.length === 3),
    twoPixelIsolation: report.preflight.every(p => p.horizontalGaps.every(g => g >= 4) && p.edgeMargins.every(m => Object.values(m).every(v => v >= 2))),
    requested50PixelOuterMargin: report.preflight.every(p => p.edgeMargins.every(m => Object.values(m).every(v => v >= 50))),
    requested100PixelGutters: report.preflight.every(p => p.horizontalGaps.every(g => g >= 100))
  };
  const frames = [7, 30, 31].map((index, i) => ({ index, original: prior.candidates[index].rect, candidate: report.preflight[0].frames[i].rect }));
  report.comparison = { frames, originalStandingHeight: frames[0].original.h, candidateStandingHeight: frames[0].candidate.h,
    policy: 'One whole-page scale per source, calibrated using its standing region height. Both death frames retain this same scale; no per-pose normalization, rotation or root claim. Bbox bottom-centers are diagnostic placement only.' };
  const references = Object.keys(before.protectedBefore).filter(f => f.startsWith('prototype-2d/src/') || ['prototype-2d/native-app.js', 'prototype-2d/assets/manifest.json', 'scripts/serve.mjs', 'scripts/release.mjs', 'scripts/runtime-frame-contract.mjs'].includes(f));
  report.productionReferences = references.filter(f => fs.readFileSync(path.join(root, f), 'utf8').includes(path.basename(candidateFile)));
  assert.equal(report.productionReferences.length, 0);
  const pw = await loadPlaywright(); browser = await pw.chromium.launch(browserLaunchOptions()); report.browser = browser.version();
  const page = await browser.newPage({ viewport: { width: 1180, height: 740 }, deviceScaleFactor: 1 });
  page.setDefaultTimeout(15000);
  page.on('pageerror', e => report.pageErrors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
  page.on('requestfailed', r => report.failedRequests.push(r.url()));
  page.on('request', r => { if (/^https?:/.test(r.url())) report.externalRequests.push(r.url()); });
  await page.route('http://**/*', r => r.abort()); await page.route('https://**/*', r => r.abort());
  await page.setContent('<!doctype html><meta charset="utf-8"><title>三帧局部修复候选·REVIEW</title><style>body{margin:0;background:#eee6d1}canvas{display:block}</style><canvas width="1180" height="740"></canvas>');
  report.decoded = await bounded(page.evaluate(async ({ sources, frames, preflight }) => {
    const images = {};
    for (const [id, src] of Object.entries(sources)) { const image = new Image(); image.src = src; await image.decode(); images[id] = image; }
    const raw = document.createElement('canvas'); raw.width = images.candidate.width; raw.height = images.candidate.height;
    const rc = raw.getContext('2d', { willReadFrequently: true }); rc.drawImage(images.candidate, 0, 0);
    const pixels = rc.getImageData(0, 0, raw.width, raw.height).data;
    const counts = preflight.flatMap(p => p.frames.map((f, i) => {
      let visible = 0; const r = f.rect;
      for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) if (pixels[(y * raw.width + x) * 4 + 3] > p.threshold) visible++;
      return { threshold: p.threshold, index: i, visible, matched: visible === f.visible };
    }));
    const canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d');
    const clear = (title, note) => { ctx.fillStyle = '#eee6d1'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#302c24'; ctx.font = 'bold 20px sans-serif'; ctx.fillText(title, 20, 30); ctx.font = '13px sans-serif'; ctx.fillText(note, 20, 56); };
    const paint = (id, frame, x, y, height, facing = 1) => {
      const r = frame[id], scale = height / frames[0][id].h;
      ctx.save(); ctx.translate(x, y); ctx.scale(scale * facing, scale);
      ctx.drawImage(images[id], r.x, r.y, r.w, r.h, -r.w / 2, -r.h, r.w, r.h); ctx.restore();
    };
    window.repairPreview = { images, frames, canvas, ctx, clear, paint };
    return { sizes: Object.fromEntries(Object.entries(images).map(([id, im]) => [id, [im.naturalWidth, im.naturalHeight]])), counts, allMatch: counts.every(c => c.matched) };
  }, { sources: { original: `data:image/png;base64,${sourceBytes.toString('base64')}`, candidate: `data:image/png;base64,${bytes.toString('base64')}` }, frames, preflight: report.preflight }), 'decode');
  const shot = async name => { const file = path.join(output, `${name}.png`), bytes = await page.screenshot({ path: file }); report.screenshots.push({ file: relative(file), sha256: hash(bytes), bytes: bytes.length }); };
  await bounded(page.evaluate(() => {
    const { images, ctx, clear } = window.repairPreview;
    clear('三帧修复候选原图 · 仅生成一次 · 未接入', '只包含原v1的idle[7]与death[2/3]修复候选；其他29区域仍保留原图。可裁切不等于造型/动画批准。');
    ctx.drawImage(images.candidate, 20, 135, 1140, images.candidate.height * 1140 / images.candidate.width);
    ctx.fillStyle = '#9b352b'; ctx.font = '15px sans-serif'; ctx.fillText('原始透明PNG，未重绘/裁出/拼装；需要与同一v1源图对照。', 20, 674);
  }), 'patch'); await shot('patch-original');
  await bounded(page.evaluate(() => {
    const { frames, ctx, clear, paint } = window.repairPreview;
    clear('原v1（上）与局部修复候选（下） · 128px站姿参照', '每张源图只设一个全局比例；倒地图不单独放大。对照脸、刀、护腕、裤腿、尾巴与姿态，未批准根点。');
    frames.forEach((f, i) => {
      const x = 200 + i * 388; ctx.font = '14px sans-serif'; ctx.fillText(`原索引 ${f.index}`, x - 80, 100);
      paint('original', f, x, 294, 128); paint('candidate', f, x, 584, 128);
      for (const y of [294, 584]) { ctx.strokeStyle = '#aaa58f'; ctx.beginPath(); ctx.moveTo(x - 150, y); ctx.lineTo(x + 150, y); ctx.stroke(); }
    });
    ctx.fillStyle = '#9b352b'; ctx.font = '15px sans-serif'; ctx.fillText('旧死亡裁切保留邻区像素作诊断；此页不是32帧序列、局内、FPS或公网验收。', 20, 696);
  }), 'large comparison'); await shot('source-vs-patch-128');
  await bounded(page.evaluate(() => {
    const { frames, ctx, clear, paint } = window.repairPreview;
    clear('64px/48px · 右向/镜像左向 · 每组左原稿，右候选', '单一全局比例保留死亡姿态相对站姿的真实大小；不逐帧缩放掩盖比例变化。');
    for (const [row, height, facing] of [[0, 64, 1], [1, 48, 1], [2, 64, -1], [3, 48, -1]]) {
      const y = 217 + row * 154; ctx.fillStyle = '#302c24'; ctx.font = '12px sans-serif'; ctx.fillText(`${height}px ${facing > 0 ? '右' : '左'}`, 12, y - 90);
      frames.forEach((f, i) => { const x = 114 + i * 384; paint('original', f, x, y, height, facing); paint('candidate', f, x + 153, y, height, facing);
        ctx.fillText(`原${f.index}`, x - 20, y + 22); ctx.fillText(`候选${f.index}`, x + 133, y + 22); });
    }
  }), 'small comparisons'); await shot('source-vs-patch-64-48');
  report.checks = { geometryIsolation: report.geometryChecks.twoPixelIsolation,
    decodedSizesMatch: JSON.stringify(report.decoded.sizes.original) === JSON.stringify([source.width, source.height]) && JSON.stringify(report.decoded.sizes.candidate) === JSON.stringify([png.width, png.height]),
    candidateAlphaCountsMatchNode: report.decoded.allMatch, noProductionReferences: report.productionReferences.length === 0,
    noErrorsOrNetwork: !report.pageErrors.length && !report.consoleErrors.length && !report.failedRequests.length && !report.externalRequests.length };
  report.technicalPreviewPassed = Object.values(report.checks).every(Boolean);
  report.result = report.technicalPreviewPassed ? 'REVIEW_REPAIR_GEOMETRY_ONLY' : 'FAIL';
} catch (error) { report.error = String(error.stack || error); }
finally {
  if (browser) try { await bounded(browser.close(), 'cleanup'); report.browserClosed = true; } catch (error) { report.cleanupError = String(error); report.result = 'FAIL'; }
  report.protectedAfter = fingerprint(); report.protectedUnchanged = JSON.stringify(report.protectedBefore) === JSON.stringify(report.protectedAfter);
  if (!report.protectedUnchanged) report.result = 'FAIL';
  report.finishedAt = new Date().toISOString(); fs.writeFileSync(path.join(output, 'browser.json'), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ file: relative(path.join(output, 'browser.json')), result: report.result, candidate: report.candidate,
  geometryChecks: report.geometryChecks, checks: report.checks, browserClosed: report.browserClosed, protectedUnchanged: report.protectedUnchanged, error: report.error }, null, 2));
if (report.result === 'FAIL') process.exitCode = 1;
