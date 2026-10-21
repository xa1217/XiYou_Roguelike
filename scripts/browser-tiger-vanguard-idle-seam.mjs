import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

// Diagnostic source-pixel preview only: no image writes or production changes.
// The support-foot annotations below are NOT authored runtime pivots.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const patchDir = 'evidence/current/tiger-vanguard/local-repair/2026-10-13T06-27-44-991Z';
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const rel = file => path.relative(root, file).replaceAll('\\', '/');
const baseline = read(`${patchDir}/pre-edit.json`);
const inventory = read('evidence/current/tiger-vanguard/single-source/2026-10-13T05-44-03-776Z/node.json');
const patchFile = `${patchDir}/candidate-v1-three-frame-patch.png`;
const expected = { ...baseline.protectedBefore, [patchFile]: 'e04bdf485aae996872827efe6ad8ef9e575eb7671a7e101f70c5c8f54b510e5a' };
const fingerprint = () => Object.fromEntries(Object.keys(expected).map(f => [f, hash(fs.readFileSync(path.join(root, f)))]));
const startedAt = new Date().toISOString();
const output = path.join(root, 'evidence/current/tiger-vanguard/idle-seam', startedAt.replaceAll(':', '-').replaceAll('.', '-'));
fs.mkdirSync(output, { recursive: true });
const report = { generatedAt: startedAt, result: 'FAIL',
  scope: 'Only v1 idle[6] -> patch idle[7] -> v1 idle[0], with original idle[7] control. Diagnostic foot placement and source-sequence playback; not the entire idle cycle, authored pivots, gameplay, animation quality, death continuity, public, ZIP, device or FPS acceptance.',
  scriptSha256: hash(fs.readFileSync(fileURLToPath(import.meta.url))), protectedBefore: fingerprint(),
  runtimeApproved: false, highFrameApproved: false, publicPass: false, deploymentPerformed: false,
  sources: [], endpoints: [], screenshots: [], pageErrors: [], consoleErrors: [], failedRequests: [], externalRequests: [] };
const bounded = async (promise, name) => { let timer; try {
  return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${name} timeout`)), 15000); })]);
} finally { clearTimeout(timer); } };

// Shared only by the test's Node and browser measurements; both independently
// decode the PNG and supply the RGBA bytes. Alpha>8/16 do not delete source pixels.
function measureFoot(data, width, rect, window, threshold) {
  let bottom = -1, count = 0, sidePixels = 0;
  for (let y = window.y; y < window.y + window.h; y++) for (let x = window.x; x < window.x + window.w; x++) {
    if (data[((rect.y + y) * width + rect.x + x) * 4 + 3] <= threshold) continue;
    count++; bottom = Math.max(bottom, y);
    if (x === window.x || x === window.x + window.w - 1) sidePixels++;
  }
  if (!count) throw new Error('Empty foot window');
  let left = Infinity, right = -Infinity;
  for (let y = bottom - 2; y <= bottom; y++) for (let x = window.x; x < window.x + window.w; x++) {
    if (data[((rect.y + y) * width + rect.x + x) * 4 + 3] > threshold) { left = Math.min(left, x); right = Math.max(right, x); }
  }
  return { threshold, count, sidePixels, bottom, edgeLeft: left, edgeRight: right, pivot: { x: (left + right) / 2, y: bottom + 1 } };
}
let browser;
try {
  assert.deepEqual(report.protectedBefore, expected, 'A protected source/runtime/ZIP changed since the recorded baseline');
  const { PNG } = createRequire(import.meta.url)(path.join(process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules'), 'pngjs'));
  const pages = [
    { id: 'v1', file: baseline.source.file, width: 1774, height: 887, referenceHeight: 170, purpose: 'Existing Tiger Vanguard v1, idle endpoints/control only' },
    { id: 'patch', file: patchFile, width: 2172, height: 724, referenceHeight: 443, purpose: 'Existing three-frame repair patch, idle[7] region only; both death regions excluded' }
  ].map(s => {
    const bytes = fs.readFileSync(path.join(root, s.file)), png = PNG.sync.read(bytes);
    assert.equal(png.width, s.width); assert.equal(png.height, s.height);
    report.sources.push({ ...s, bytes: bytes.length, sha256: hash(bytes) });
    return { ...s, png, src: `data:image/png;base64,${bytes.toString('base64')}` };
  });
  const definitions = [6, 7, 0].map(index => ({ id: `v1-${index}`, page: 'v1', index, rect: inventory.candidates[index].rect,
    expectedCropSha256: inventory.candidates[index].rgbaSha256, window: { x: 20, y: 154, w: 70, h: inventory.candidates[index].rect.h - 154 } }));
  definitions.splice(2, 0, { id: 'patch-7', page: 'patch', index: 7, rect: { x: 46, y: 148, w: 525, h: 443 }, window: { x: 50, y: 400, w: 155, h: 43 } });
  for (const d of definitions) {
    const source = pages.find(p => p.id === d.page), { png } = source, { rect: r, window: w } = d;
    assert.ok(r.x >= 0 && r.y >= 0 && r.x + r.w <= png.width && r.y + r.h <= png.height);
    assert.ok(w.x >= 0 && w.y >= 0 && w.x + w.w <= r.w && w.y + w.h <= r.h);
    const pixels = Buffer.alloc(r.w * r.h * 4);
    for (let y = 0; y < r.h; y++) png.data.copy(pixels, y * r.w * 4, ((r.y + y) * png.width + r.x) * 4, ((r.y + y) * png.width + r.x + r.w) * 4);
    if (d.expectedCropSha256) assert.equal(hash(pixels), d.expectedCropSha256, 'Source crop pixels changed');
    const footMeasurements = [8, 16].map(t => measureFoot(png.data, png.width, r, w, t));
    assert.ok(footMeasurements.every(m => m.sidePixels === 0), `Foot window cuts visible side pixels: ${d.id}`);
    report.endpoints.push({ ...d, cropSha256: hash(pixels), footMeasurements, pivot: footMeasurements[1].pivot,
      referenceHeight: source.referenceHeight, anchorStatus: 'DIAGNOSTIC_NEAR_SUPPORT_FOOT_NOT_AUTHORED_RUNTIME_ROOT' });
  }
  report.scalePolicy = 'One whole-page scale per source, calibrated to v1 idle[7] height170 / patch standing height443; no per-pose scale, rotation, warping, filtering away edges, or production roots.';
  const referenceFiles = Object.keys(expected).filter(f => f.startsWith('prototype-2d/src/') || ['prototype-2d/native-app.js', 'prototype-2d/assets/manifest.json', 'scripts/serve.mjs', 'scripts/release.mjs', 'scripts/runtime-frame-contract.mjs'].includes(f));
  report.productionReferences = referenceFiles.filter(f => {
    const contents = fs.readFileSync(path.join(root, f), 'utf8');
    return report.sources.some(s => contents.includes(path.basename(s.file)) || contents.includes(s.sha256));
  });
  assert.equal(report.productionReferences.length, 0);
  const pw = await loadPlaywright(); browser = await pw.chromium.launch(browserLaunchOptions()); report.browser = browser.version();
  const page = await browser.newPage({ viewport: { width: 1180, height: 780 }, deviceScaleFactor: 1 });
  page.setDefaultTimeout(15000);
  page.on('pageerror', e => report.pageErrors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
  page.on('requestfailed', r => report.failedRequests.push(r.url()));
  page.on('request', r => { if (/^https?:/.test(r.url())) report.externalRequests.push(r.url()); });
  await page.route('http://**/*', r => r.abort()); await page.route('https://**/*', r => r.abort());
  await page.setContent('<!doctype html><meta charset="utf-8"><title>虎先锋待机接缝·未批准</title><style>body{margin:0;background:#eee6d1}canvas{display:block}</style><canvas width="1180" height="780"></canvas>');
  await page.addScriptTag({ content: `window.measureFoot = ${measureFoot.toString()};` });
  report.decode = await bounded(page.evaluate(async ({ pages, frames }) => {
    const images = {}, measurements = [], sizes = {};
    for (const p of pages) {
      const im = new Image(); im.src = p.src; await im.decode(); images[p.id] = im;
      sizes[p.id] = [im.naturalWidth, im.naturalHeight];
      const raw = document.createElement('canvas'); raw.width = im.naturalWidth; raw.height = im.naturalHeight;
      const rc = raw.getContext('2d', { willReadFrequently: true }); rc.drawImage(im, 0, 0);
      const data = rc.getImageData(0, 0, raw.width, raw.height).data;
      for (const f of frames.filter(f => f.page === p.id)) measurements.push({ id: f.id,
        values: [8, 16].map(t => window.measureFoot(data, raw.width, f.rect, f.window, t)) });
    }
    const canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d');
    const clear = (title, note) => { ctx.fillStyle = '#eee6d1'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#302c24'; ctx.font = 'bold 21px sans-serif'; ctx.fillText(title, 20, 32); ctx.font = '13px sans-serif'; ctx.fillText(note, 20, 59); };
    const cross = (x, y) => { ctx.strokeStyle = '#138c78'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 6, y); ctx.lineTo(x + 6, y); ctx.moveTo(x, y - 6); ctx.lineTo(x, y + 6); ctx.stroke(); };
    const paint = (f, x, y, height, facing = 1, pivot = f.pivot) => {
      const r = f.rect, scale = height / f.referenceHeight;
      ctx.save(); ctx.translate(x, y); ctx.scale(scale * facing, scale); ctx.drawImage(images[f.page], r.x, r.y, r.w, r.h, -pivot.x, -pivot.y, r.w, r.h); ctx.restore();
    };
    window.idleSeam = { frames, canvas, ctx, clear, cross, paint };
    return { sizes, measurements };
  }, { pages: pages.map(({ png, ...p }) => p), frames: report.endpoints }), 'decode and alpha measurement');
  for (const f of report.endpoints) assert.deepEqual(report.decode.measurements.find(m => m.id === f.id).values, f.footMeasurements, 'Browser/Node foot measures differ');
  assert.deepEqual(report.decode.sizes, { v1: [1774, 887], patch: [2172, 724] });
  const shot = async name => { const file = path.join(output, `${name}.png`), bytes = await page.screenshot({ path: file }); report.screenshots.push({ file: rel(file), sha256: hash(bytes), bytes: bytes.length }); };
  await page.evaluate(() => {
    const { frames, ctx, clear, paint, cross } = window.idleSeam;
    clear('近侧支撑脚窗口 · 原待机6 / 原7对照 / 补丁7 / 原0', '框包含近侧足趾与脚底、排除上方裤腿/腰带；底部三行alpha>16确定诊断点。未改像素，未批准动作根点。');
    frames.forEach((f, i) => {
      const x = 35 + i % 2 * 580, y = 105 + Math.floor(i / 2) * 330, h = 240, s = h / f.referenceHeight, w = f.window;
      ctx.fillStyle = '#302c24'; ctx.font = '14px sans-serif'; ctx.fillText(`${f.id} · source ${f.rect.w}×${f.rect.h}`, x, y - 13);
      paint(f, x, y, h, 1, { x: 0, y: 0 }); ctx.strokeStyle = '#138c78'; ctx.strokeRect(x + w.x * s, y + w.y * s, w.w * s, w.h * s); cross(x + f.pivot.x * s, y + f.pivot.y * s);
    });
  }); await shot('support-foot-windows');
  await page.evaluate(() => {
    const { frames, ctx, clear, paint, cross } = window.idleSeam;
    clear('脚底固定 · 128px站姿参照 · 原7作为未修刀边的控制项', '顺序：原6 → 原7（控制）/ 补丁7（替换提案）→ 原0。统一页面比例，仅消除脚底平移变量。');
    frames.forEach((f, i) => { const x = 70 + i * 290, y = 325; paint(f, x, y, 128); cross(x, y); ctx.fillStyle = '#302c24'; ctx.font = '15px sans-serif'; ctx.fillText(f.id, x - 25, y + 28); });
    ctx.font = '14px sans-serif'; ctx.fillText('原7与补丁7叠加的胸腹/刀/远侧脚差异不等于自动艺术失败：需要人工检查。', 20, 420);
    for (const [j, facing] of [[0, 1], [1, -1]]) { const x = 230 + j * 650, y = 705; ctx.globalAlpha = 0.5; paint(frames[1], x, y, 192, facing); paint(frames[2], x, y, 192, facing); ctx.globalAlpha = 1; cross(x, y); }
  }); await shot('fixed-foot-endpoints-and-overlay');
  await page.evaluate(() => {
    const { frames, ctx, clear, paint, cross } = window.idleSeam;
    clear('64px / 48px · 两朝向 · 四端点同脚底对照', '原6 | 原7控制 | 补丁7提案 | 原0；每页全局比例不变，没有逐帧缩放或平滑插值。');
    for (const [row, h, facing] of [[0, 64, 1], [1, 48, 1], [2, 64, -1], [3, 48, -1]]) {
      const y = 213 + row * 163; ctx.fillStyle = '#302c24'; ctx.font = '13px sans-serif'; ctx.fillText(`${h}px ${facing === 1 ? '右' : '左'}`, 20, y - 84);
      frames.forEach((f, i) => { const x = (facing === 1 ? 120 : 170) + i * 285; paint(f, x, y, h, facing); cross(x, y); ctx.fillText(f.id, x - 35, y + 25); });
    }
  }); await shot('idle-seam-64-48-both-facings');
  // Play each diagnostic seam ONCE, then hold. There is no artificial 0->6 loop.
  // 6 and 12 source poses/s are explicit preview rates, not runtime/FPS claims.
  report.playback = [];
  for (const rate of [6, 12]) {
    const played = await bounded(page.evaluate(rate => new Promise(resolve => {
      const { frames, ctx, clear, paint, cross } = window.idleSeam;
      const control = [frames[0], frames[1], frames[3]], proposal = [frames[0], frames[2], frames[3]];
      const log = []; let start, last = -1;
      function tick(now) {
        start ??= now; const phase = Math.min(2, Math.floor((now - start) * rate / 1000));
        if (phase !== last) {
          clear(`一次接缝预览 · ${rate}源姿态/秒 · ${phase === 2 ? '原0后停止' : '播放中'}`, '左：原6→原7→原0；右：原6→补丁7→原0。只有两条接缝，不是完整待机、高帧或自然战斗。');
          const draws = [];
          for (const [row, h, facing] of [[0, 64, 1], [1, 48, 1], [2, 64, -1], [3, 48, -1]]) {
            const y = 213 + row * 163;
            for (const [column, track] of [[0, control], [1, proposal]]) {
              const x = 250 + column * 580; paint(track[phase], x, y, h, facing); cross(x, y);
              ctx.fillStyle = '#302c24'; ctx.font = '13px sans-serif'; ctx.fillText(`${h}px ${facing === 1 ? '右' : '左'} ${track[phase].id}`, x - 40, y + 24);
              draws.push({ id: track[phase].id, height: h, facing, track: column === 0 ? 'control' : 'proposal' });
            }
          }
          log.push({ phase, elapsedMs: now - start, draws }); last = phase;
        }
        if (phase === 2) resolve({ rate, log, stopped: true }); else requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }), rate), `playback ${rate}`);
    report.playback.push(played);
  }
  report.checks = { browserNodeFootMeasurementsMatch: true, decodedSizesMatch: true,
    footWindowSidesClear: report.endpoints.every(f => f.footMeasurements.every(m => m.sidePixels === 0)),
    seamsDrawnAtBothRatesAndAllSizesFacings: report.playback.every(p => p.stopped && p.log.map(l => l.phase).join(',') === '0,1,2' && p.log.every(l => l.draws.length === 8)),
    noProductionReferences: !report.productionReferences.length,
    noErrorsOrNetwork: !report.pageErrors.length && !report.consoleErrors.length && !report.failedRequests.length && !report.externalRequests.length };
  report.technicalPreviewPassed = Object.values(report.checks).every(Boolean);
  report.result = report.technicalPreviewPassed ? 'REVIEW_IDLE_SEAM_DIAGNOSTIC_ONLY' : 'FAIL';
} catch (error) { report.error = String(error.stack || error); }
finally {
  if (browser) try { await bounded(browser.close(), 'cleanup'); report.browserClosed = true; } catch (error) { report.cleanupError = String(error); report.result = 'FAIL'; }
  report.protectedAfter = fingerprint(); report.protectedUnchanged = JSON.stringify(report.protectedBefore) === JSON.stringify(report.protectedAfter);
  if (!report.protectedUnchanged) report.result = 'FAIL';
  report.finishedAt = new Date().toISOString(); fs.writeFileSync(path.join(output, 'browser.json'), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ file: rel(path.join(output, 'browser.json')), result: report.result, checks: report.checks,
  endpoints: report.endpoints.map(f => ({ id: f.id, pivot: f.pivot })), browserClosed: report.browserClosed, protectedUnchanged: report.protectedUnchanged, error: report.error }, null, 2));
if (report.result === 'FAIL') process.exitCode = 1;
