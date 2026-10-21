import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

// Evidence-only source preview. No crop PNGs, production roots or asset edits.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const relative = f => path.relative(root, f).replaceAll('\\', '/');
const baseline = read('evidence/current/tiger-vanguard/idle-seam/2026-10-13T10-51-24-318Z/browser.json');
const inventory = read('evidence/current/tiger-vanguard/single-source/2026-10-13T05-44-03-776Z/node.json');
const fingerprint = () => Object.fromEntries(Object.keys(baseline.protectedBefore).map(f => [f, hash(fs.readFileSync(path.join(root, f)))]));
const generatedAt = new Date().toISOString();
const output = path.join(root, 'evidence/current/tiger-vanguard/death-seam', generatedAt.replaceAll(':', '-').replaceAll('.', '-'));
fs.mkdirSync(output, { recursive: true });
const report = { generatedAt, result: 'FAIL',
  scope: 'Original death[1] to existing patch death[2/3] only; original death[2/3] are contaminated source controls, not runtime crops. Diagnostic ground/shoulder references, not authored roots, complete death animation, gameplay, FPS, device, ZIP or public approval.',
  scriptSha256: hash(fs.readFileSync(fileURLToPath(import.meta.url))), protectedBefore: fingerprint(),
  runtimeApproved: false, highFrameApproved: false, publicPass: false,
  sources: [], frames: [], screenshots: [], pageErrors: [], consoleErrors: [], failedRequests: [], externalRequests: [] };
const bounded = async (p, name) => { let timer; try { return await Promise.race([p, new Promise((_, reject) => {
  timer = setTimeout(() => reject(new Error(`${name} timeout`)), 15000);
})]); } finally { clearTimeout(timer); } };
function measure(data, width, rect, threshold) {
  let count = 0, left = rect.w, right = -1, top = rect.h, bottom = -1;
  for (let y = 0; y < rect.h; y++) for (let x = 0; x < rect.w; x++) {
    if (data[((rect.y + y) * width + rect.x + x) * 4 + 3] <= threshold) continue;
    count++; left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y);
  }
  if (!count) throw new Error('Empty diagnostic crop');
  return { threshold, count, left, right, top, bottom, ground: bottom + 1 };
}
let browser;
try {
  assert.deepEqual(report.protectedBefore, baseline.protectedBefore, 'Protected files changed');
  const { PNG } = createRequire(import.meta.url)(path.join(process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules'), 'pngjs'));
  const pages = baseline.sources.map(s => {
    const bytes = fs.readFileSync(path.join(root, s.file)), png = PNG.sync.read(bytes);
    assert.equal(hash(bytes), s.sha256); assert.equal(png.width, s.width); assert.equal(png.height, s.height);
    report.sources.push({ ...s, purpose: s.id === 'v1' ? 'Existing v1 death[1/2/3] source regions; [2/3] controls retain known contamination' : 'Existing repair patch death[2/3] regions; no new generation' });
    return { ...s, png, src: `data:image/png;base64,${bytes.toString('base64')}` };
  });
  // Approximate, manually annotated near-side shoulder/upper-arm landmarks.
  // They are NOT measured plate centers or exact semantic correspondences.
  // Only x supplies an alternative alignment; the bbox mode remains as control.
  const shoulder = { 29: { x: 91, y: 38 }, 30: { x: 108, y: 29 }, 31: { x: 116, y: 28 } };
  const definitions = [29, 30, 31].map(index => ({ id: `v1-${index}`, page: 'v1', index,
    rect: inventory.candidates[index].rect, shoulder: shoulder[index], expectedCropSha256: inventory.candidates[index].rgbaSha256 }));
  definitions.push({ id: 'patch-30', page: 'patch', index: 30, rect: { x: 699, y: 400, w: 620, h: 224 }, shoulder: { x: 302, y: 75 } },
    { id: 'patch-31', page: 'patch', index: 31, rect: { x: 1452, y: 431, w: 657, h: 192 }, shoulder: { x: 350, y: 61 } });
  for (const d of definitions) {
    const s = pages.find(p => p.id === d.page), { png } = s, r = d.rect;
    assert.ok(r.x >= 0 && r.y >= 0 && r.x + r.w <= png.width && r.y + r.h <= png.height);
    const crop = Buffer.alloc(r.w * r.h * 4);
    for (let y = 0; y < r.h; y++) png.data.copy(crop, y * r.w * 4, ((r.y + y) * png.width + r.x) * 4, ((r.y + y) * png.width + r.x + r.w) * 4);
    if (d.expectedCropSha256) assert.equal(hash(crop), d.expectedCropSha256);
    const measurements = [8, 16].map(t => measure(png.data, png.width, r, t));
    report.frames.push({ ...d, cropSha256: hash(crop), measurements, referenceHeight: s.referenceHeight,
      pivot: { x: d.shoulder.x, y: measurements[0].ground }, bboxPivot: { x: r.w / 2, y: measurements[0].ground },
      annotationStatus: 'MANUAL_SHOULDER_X_AND_VISIBLE_LOWEST_ALPHA_Y_DIAGNOSTIC_ONLY',
      originalPixelWidthAt64: r.w * 64 / s.referenceHeight, originalPixelHeightAt64: r.h * 64 / s.referenceHeight });
  }
  report.scalePolicy = 'Same standing reference as idle review: original170 / patch443. One scale per source, no per-death pose normalization. Lowest alpha point includes the sword, not a certified body contact point. Shoulder-x and bbox-x views both preserved.';
  const referenceFiles = Object.keys(report.protectedBefore).filter(f => f.startsWith('prototype-2d/src/') || ['prototype-2d/native-app.js', 'prototype-2d/assets/manifest.json', 'scripts/serve.mjs', 'scripts/release.mjs', 'scripts/runtime-frame-contract.mjs'].includes(f));
  report.productionReferences = referenceFiles.filter(f => {
    const contents = fs.readFileSync(path.join(root, f), 'utf8');
    return report.sources.some(s => contents.includes(path.basename(s.file)) || contents.includes(s.sha256));
  });
  assert.equal(report.productionReferences.length, 0);
  const pw = await loadPlaywright(); browser = await pw.chromium.launch(browserLaunchOptions()); report.browser = browser.version();
  const page = await browser.newPage({ viewport: { width: 1240, height: 820 }, deviceScaleFactor: 1 });
  page.setDefaultTimeout(15000);
  page.on('pageerror', e => report.pageErrors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
  page.on('requestfailed', r => report.failedRequests.push(r.url()));
  page.on('request', r => { if (/^https?:/.test(r.url())) report.externalRequests.push(r.url()); });
  await page.route('http://**/*', r => r.abort()); await page.route('https://**/*', r => r.abort());
  await page.setContent('<!doctype html><meta charset="utf-8"><title>虎先锋死亡衔接·仅诊断</title><style>body{margin:0;background:#eee6d1}canvas{display:block}</style><canvas width="1240" height="820"></canvas>');
  await page.addScriptTag({ content: `window.measureDeath = ${measure.toString()};` });
  report.decode = await bounded(page.evaluate(async ({ pages, frames }) => {
    const images = {}, measurements = [], sizes = {};
    for (const p of pages) {
      const im = new Image(); im.src = p.src; await im.decode(); images[p.id] = im; sizes[p.id] = [im.naturalWidth, im.naturalHeight];
      const raw = document.createElement('canvas'); raw.width = im.naturalWidth; raw.height = im.naturalHeight;
      const rc = raw.getContext('2d', { willReadFrequently: true }); rc.drawImage(im, 0, 0); const data = rc.getImageData(0, 0, raw.width, raw.height).data;
      for (const f of frames.filter(f => f.page === p.id)) measurements.push({ id: f.id, values: [8, 16].map(t => window.measureDeath(data, raw.width, f.rect, t)) });
    }
    const canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d');
    const clear = (title, note) => { ctx.fillStyle = '#eee6d1'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#302c24'; ctx.font = 'bold 20px sans-serif'; ctx.fillText(title, 20, 32); ctx.font = '13px sans-serif'; ctx.fillText(note, 20, 58); };
    const paint = (f, x, y, height, facing = 1, anchor = f.pivot, annotation = false) => {
      const r = f.rect, scale = height / f.referenceHeight;
      ctx.save(); ctx.translate(x, y); ctx.scale(scale * facing, scale); ctx.drawImage(images[f.page], r.x, r.y, r.w, r.h, -anchor.x, -anchor.y, r.w, r.h); ctx.restore();
      if (annotation) { const sx = x + (f.shoulder.x - anchor.x) * scale * facing, sy = y + (f.shoulder.y - anchor.y) * scale;
        ctx.strokeStyle = '#00a793'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(sx - 5, sy); ctx.lineTo(sx + 5, sy); ctx.moveTo(sx, sy - 5); ctx.lineTo(sx, y + 4); ctx.stroke(); }
    };
    const ground = (x, y, half = 190) => { ctx.strokeStyle = '#b6ad97'; ctx.beginPath(); ctx.moveTo(x - half, y); ctx.lineTo(x + half, y); ctx.stroke(); };
    const tracks = { control: [frames[0], frames[1], frames[2]], proposal: [frames[0], frames[3], frames[4]] };
    window.deathSeam = { frames, canvas, ctx, clear, paint, ground, tracks };
    return { sizes, measurements };
  }, { pages: pages.map(({ png, ...s }) => s), frames: report.frames }), 'decode');
  assert.deepEqual(report.decode.sizes, { v1: [1774, 887], patch: [2172, 724] });
  for (const f of report.frames) assert.deepEqual(report.decode.measurements.find(m => m.id === f.id).values, f.measurements);
  const shot = async name => { const file = path.join(output, `${name}.png`), bytes = await page.screenshot({ path: file }); report.screenshots.push({ file: relative(file), bytes: bytes.length, sha256: hash(bytes) }); };
  await page.evaluate(() => {
    const { ctx, clear, paint, ground, tracks } = window.deathSeam;
    clear('死亡局部序列 · 上原稿控制 / 下两帧补丁提案 · 240px站姿参照', '十字：人工肩/上臂近似参照（非精确中心，仅x对齐）；横线包含刀的alpha最低点，不是已批准接地/根点。');
    for (const [row, track] of [[0, tracks.control], [1, tracks.proposal]]) track.forEach((f, i) => { const x = 190 + i * 410, y = 351 + row * 335;
      ground(x, y); paint(f, x, y, 240, 1, f.pivot, true); ctx.fillStyle = '#302c24'; ctx.font = '14px sans-serif'; ctx.fillText(f.id, x - 70, y + 28); });
    ctx.fillStyle = '#9b352b'; ctx.fillText('未用待机脚底点；不逐帧放大倒地图、不删除污染像素、不覆盖PNG或生产合同。', 20, 791);
  }); await shot('death-source-and-shoulder-reference');
  await page.evaluate(() => {
    const { ctx, clear, paint, ground, tracks } = window.deathSeam;
    clear('128px站姿参照 · 左包围盒底中心 / 右护肩x与地面 · 不同对齐都保留', '原death[1]→原death[2/3]作控制；原death[1]→补丁death[2/3]作提案。只有位置变化，不改变姿态大小。');
    for (const [row, track] of [[0, tracks.control], [1, tracks.proposal]]) for (const [side, mode] of [[0, 'bboxPivot'], [1, 'pivot']]) track.forEach((f, i) => {
      const x = 102 + side * 620 + i * 197, y = 324 + row * 330; ground(x, y, 88); paint(f, x, y, 128, 1, f[mode]);
      ctx.fillStyle = '#302c24'; ctx.font = '13px sans-serif'; ctx.fillText(f.id, x - 55, y + 25);
    });
  }); await shot('death-alignment-sensitivity-128');
  await page.evaluate(() => {
    const { ctx, clear, paint, ground, tracks } = window.deathSeam;
    clear('64px / 48px · 双朝向 · 左原稿控制 / 右补丁提案', '每列同一地面与护肩x诊断。低分辨率描线、尾巴与体形变化须人工判断；截图不自动批准动作流畅度。');
    for (const [row, h, facing] of [[0, 64, 1], [1, 48, 1], [2, 64, -1], [3, 48, -1]]) {
      const y = 221 + row * 175; ctx.fillStyle = '#302c24'; ctx.font = '13px sans-serif'; ctx.fillText(`${h}px ${facing === 1 ? '右' : '左'}`, 20, y - 108);
      for (const [side, track] of [[0, tracks.control], [1, tracks.proposal]]) track.forEach((f, i) => { const x = 113 + side * 620 + i * 195;
        ground(x, y, 82); paint(f, x, y, h, facing); ctx.fillText(f.id, x - 35, y + 24); });
    }
  }); await shot('death-seam-64-48-both-facings');
  report.playback = [];
  for (const rate of [6, 12]) report.playback.push(await bounded(page.evaluate(rate => new Promise(resolve => {
    const { ctx, clear, paint, ground, tracks } = window.deathSeam; const log = []; let start, last = -1;
    function tick(now) { start ??= now; const phase = Math.min(2, Math.floor((now - start) * rate / 1000));
      if (last !== phase) {
        clear(`一次死亡接缝预览 · ${rate}源姿态/秒 · 不循环复活`, '左原稿控制、右现补丁；只确认实际按顺序绘制，不代表游戏时序、GPU/FPS或人工流畅度批准。');
        const draws = [];
        for (const [row, h, facing] of [[0, 64, 1], [1, 48, 1], [2, 64, -1], [3, 48, -1]]) for (const [side, track] of [[0, tracks.control], [1, tracks.proposal]]) {
          const f = track[phase], x = 305 + side * 620, y = 221 + row * 175; ground(x, y, 140); paint(f, x, y, h, facing);
          ctx.fillStyle = '#302c24'; ctx.font = '13px sans-serif'; ctx.fillText(`${f.id} ${h}px ${facing}`, x - 50, y + 25); draws.push({ id: f.id, height: h, facing, track: side });
        }
        log.push({ phase, elapsedMs: now - start, draws }); last = phase;
      }
      if (phase === 2) resolve({ rate, stopped: true, log }); else requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }), rate), `death playback ${rate}`));
  report.checks = { browserNodeMeasurementsMatch: true, decodedSizesMatch: true, noProductionReferences: !report.productionReferences.length,
    orderedNonLoopingSeamsBothRatesSizesFacings: report.playback.every(p => p.stopped && p.log.map(l => l.phase).join(',') === '0,1,2' && p.log.every(l => l.draws.length === 8)),
    noErrorsOrNetwork: !report.pageErrors.length && !report.consoleErrors.length && !report.failedRequests.length && !report.externalRequests.length };
  report.result = Object.values(report.checks).every(Boolean) ? 'REVIEW_DEATH_SEAM_DIAGNOSTIC_ONLY' : 'FAIL';
} catch (error) { report.error = String(error.stack || error); }
finally {
  if (browser) try { await bounded(browser.close(), 'cleanup'); report.browserClosed = true; } catch (e) { report.cleanupError = String(e); report.result = 'FAIL'; }
  report.protectedAfter = fingerprint(); report.protectedUnchanged = JSON.stringify(report.protectedBefore) === JSON.stringify(report.protectedAfter);
  if (!report.protectedUnchanged) report.result = 'FAIL';
  report.finishedAt = new Date().toISOString(); fs.writeFileSync(path.join(output, 'browser.json'), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ file: relative(path.join(output, 'browser.json')), result: report.result, checks: report.checks,
  protectedUnchanged: report.protectedUnchanged, browserClosed: report.browserClosed, error: report.error }, null, 2));
if (report.result === 'FAIL') process.exitCode = 1;
