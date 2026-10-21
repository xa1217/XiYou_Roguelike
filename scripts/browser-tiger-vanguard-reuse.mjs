import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

// Isolated review only. No game, server, runtime registration, new art or
// repacked sprite sheet. Screenshots are diagnostics of existing PNG crops.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stamp = new Date().toISOString();
const output = path.join(root, 'evidence/current/tiger-vanguard/reuse-review', stamp.replaceAll(':', '-').replaceAll('.', '-'));
fs.mkdirSync(output, { recursive: true });
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const auditFile = 'evidence/current/tiger-vanguard/reuse-plan-node.json';
const auditBytes = fs.readFileSync(path.join(root, auditFile)), audit = JSON.parse(auditBytes);
const report = { generatedAt: stamp, result: 'FAIL', scope: 'Single local Edge source-reuse candidate preview; not gameplay, animation quality, ZIP, public, device or FPS acceptance.',
  audit: { file: auditFile, sha256: hash(auditBytes), result: audit.result }, inputs: audit.sourcePages,
  pageErrors: [], consoleErrors: [], failedRequests: [], unexpectedRequests: [], screenshots: [], runtimeApproved: false, highFrameApproved: false, publicPass: false };
const fingerprint = () => Object.fromEntries(Object.keys(audit.protectedBefore).map(file => [file, hash(fs.readFileSync(path.join(root, file)))]));
report.protectedBefore = fingerprint();
const bounded = async (promise, label, ms = 15000) => {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${label} timeout`)), ms); })]); }
  finally { clearTimeout(timer); }
};
let browser;
try {
  if (audit.result !== 'REVIEW_32_SOURCE_REGIONS_AVAILABLE' || !audit.protectedUnchanged) throw new Error('Source reuse audit is not ready for a diagnostic preview');
  const pages = audit.sourcePages.map(page => {
    const bytes = fs.readFileSync(path.join(root, page.file));
    if (hash(bytes) !== page.sha256) throw new Error(`Changed candidate source: ${page.id}`);
    return { ...page, src: `data:image/png;base64,${bytes.toString('base64')}` };
  });
  const pw = await loadPlaywright();
  browser = await pw.chromium.launch(browserLaunchOptions()); report.browser = browser.version();
  const page = await browser.newPage({ viewport: { width: 1000, height: 660 }, deviceScaleFactor: 1 });
  page.setDefaultTimeout(15000);
  page.on('pageerror', error => report.pageErrors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
  page.on('requestfailed', request => report.failedRequests.push(request.url()));
  page.on('request', request => { if (/^https?:/.test(request.url())) report.unexpectedRequests.push(request.url()); });
  await page.setContent('<!doctype html><meta charset="utf-8"><title>虎先锋复用方案·未接入</title><style>body{margin:0;background:#eee6d1}canvas{display:block}</style><canvas width="1000" height="660"></canvas>');
  report.decoded = await bounded(page.evaluate(async ({ pages, frames }) => {
    const images = {};
    for (const source of pages) { const image = new Image(); image.src = source.src; await image.decode(); images[source.id] = image; }
    const canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d', { willReadFrequently: true });
    const paint = (frame, x, y, height, facing = 1, target = ctx) => {
      const r = frame.sourceRect, scale = height / 193;
      target.save(); target.translate(x, y); target.scale(facing * scale, scale);
      target.drawImage(images[frame.page], r.x, r.y, r.w, r.h, -r.w / 2, -r.h, r.w, r.h); target.restore();
    };
    const clear = (title, sub) => {
      ctx.fillStyle = '#eee6d1'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#302c24'; ctx.font = 'bold 21px sans-serif'; ctx.fillText(title, 20, 30);
      ctx.font = '13px sans-serif'; ctx.fillText(sub, 20, 54);
    };
    window.reusePreview = { images, frames, paint, clear, ctx, canvas };
    return pages.map(source => ({ page: source.id, width: images[source.id].naturalWidth, height: images[source.id].naturalHeight,
      complete: images[source.id].complete, dimensionsMatch: images[source.id].naturalWidth === source.width && images[source.id].naturalHeight === source.height }));
  }, { pages, frames: audit.frames }), 'decode');
  const shot = async name => {
    const file = path.join(output, `${name}.png`), bytes = await page.screenshot({ path: file });
    report.screenshots.push({ file: path.relative(root, file).replaceAll('\\', '/'), sha256: hash(bytes), bytes: bytes.length });
  };
  report.contactSheets = [];
  for (const sample of [{ height: 64, facing: 1 }, { height: 48, facing: 1 }, { height: 64, facing: -1 }]) {
    const result = await bounded(page.evaluate(({ height, facing }) => {
      const p = window.reusePreview, { ctx, frames, clear, paint } = p;
      clear(`虎先锋双页复用 · 32个源区域 · ${height}px参照 · ${facing === 1 ? '右向' : '左向'}`,
        'v2：待机/移动/受击/死亡；v1：攻击。统一源像素比例，未接入游戏；底部中心仅为诊断锚点。');
      const hashes = [], scratch = document.createElement('canvas'); scratch.width = scratch.height = 128;
      const sc = scratch.getContext('2d', { willReadFrequently: true });
      for (const frame of frames) {
        const x = 5 + frame.index % 8 * 124, y = 76 + Math.floor(frame.index / 8) * 133;
        ctx.strokeStyle = '#c5bda7'; ctx.strokeRect(x, y, 120, 126);
        ctx.fillStyle = '#302c24'; ctx.font = '11px sans-serif'; ctx.fillText(`${frame.page} ${frame.state} ${frame.index}`, x + 5, y + 16);
        ctx.strokeStyle = '#9caa8d'; ctx.beginPath(); ctx.moveTo(x + 4, y + 113); ctx.lineTo(x + 116, y + 113); ctx.stroke();
        paint(frame, x + 60, y + 113, height, facing);
        sc.clearRect(0, 0, 128, 128); paint(frame, 64, 112, height, facing, sc);
        let h = 2166136261; for (const byte of sc.getImageData(0, 0, 128, 128).data) h = Math.imul(h ^ byte, 16777619);
        hashes.push({ index: frame.index, page: frame.page, hash: h >>> 0 });
      }
      ctx.fillStyle = '#9b352b'; ctx.font = '15px sans-serif'; ctx.fillText('REVIEW：32区域可复用 ≠ 32姿态最终动画通过；跨稿造型/比例/根点/衔接仍未批准。', 20, 642);
      return { height, facing, rendered: hashes.length, distinctRendered: new Set(hashes.map(item => item.hash)).size, hashes };
    }, sample), 'contact sheet');
    report.contactSheets.push(result); await shot(`contact-${sample.height}-${sample.facing === 1 ? 'right' : 'left'}`);
  }
  report.transition = await bounded(page.evaluate(() => {
    const { frames, clear, ctx, paint } = window.reusePreview, indices = [7, 16, 17, 18, 23, 0];
    clear('跨稿衔接检查 · 同一源像素比例 · 未批准', '待机v2 → 攻击v1 → 待机v2；128px参考放大。不要用逐帧缩放隐藏轮廓变化。');
    indices.forEach((index, slot) => {
      const frame = frames[index], x = 80 + slot * 165;
      ctx.fillStyle = '#302c24'; ctx.font = '13px sans-serif'; ctx.fillText(`${frame.page} ${frame.state}[${index}]`, x - 65, 111);
      ctx.strokeStyle = '#9caa8d'; ctx.beginPath(); ctx.moveTo(x - 72, 330); ctx.lineTo(x + 72, 330); ctx.stroke();
      paint(frame, x, 330, 128);
    });
    ctx.fillStyle = '#9b352b'; ctx.font = '16px sans-serif';
    ctx.fillText('诊断锚点仅为包围盒底部中心：不能据此批准脚底稳定、死亡根点或动作流畅度。', 20, 390);
    ctx.fillText('v2 idle[7] 与 v1 attack[0] 可见高度192→171源像素；这是待审风险，不做逐帧拉伸补偿。', 20, 424);
    return { indices, sourceScale: 128 / 193, anchor: 'bbox-bottom-center, unreviewed', runtime: false };
  }), 'transition');
  await shot('cross-page-transition');
  report.playback = await bounded(page.evaluate(async () => {
    const { frames, clear, ctx, paint } = window.reusePreview, seen = new Set(); let samples = 0, start;
    await new Promise(resolve => {
      const draw = now => {
        start ??= now; const elapsed = now - start, index = Math.floor(elapsed / (1000 / 12)) % 32;
        clear('源区域播放诊断 · 不等于局内高帧验收', '12个源姿态/秒；单Canvas、统一比例、无整图旋转或逐帧缩放；造型与根点仍待审。');
        paint(frames[index], 500, 370, 64); ctx.fillStyle = '#302c24'; ctx.font = '17px sans-serif';
        ctx.fillText(`${frames[index].page} ${frames[index].state} ${index}`, 420, 420); seen.add(index); samples++;
        if (seen.size === 32 || elapsed > 6000) resolve(); else requestAnimationFrame(draw);
      }; requestAnimationFrame(draw);
    });
    return { seen: [...seen].sort((a, b) => a - b), canvasSamples: samples, targetSourceFramesPerSecond: 12, fpsAcceptance: false };
  }), 'source playback', 10000);
  await shot('source-playback');
  report.checks = { decodedBothSources: report.decoded.length === 2 && report.decoded.every(row => row.complete && row.dimensionsMatch),
    allRegionsDistinctAtBothSizesAndFacings: report.contactSheets.every(row => row.rendered === 32 && row.distinctRendered === 32),
    playbackVisited32: report.playback.seen.length === 32,
    noErrorsOrNetwork: !report.pageErrors.length && !report.consoleErrors.length && !report.failedRequests.length && !report.unexpectedRequests.length };
  report.technicalPreviewPassed = Object.values(report.checks).every(Boolean);
  report.result = report.technicalPreviewPassed ? 'REVIEW_SOURCE_PREVIEW_ONLY' : 'FAIL';
} catch (error) { report.error = String(error.stack || error); }
finally {
  if (browser) try { await bounded(browser.close(), 'browser cleanup'); report.browserClosed = true; }
  catch (error) { report.cleanupError = String(error); report.result = 'FAIL'; }
  report.protectedAfter = fingerprint(); report.protectedUnchanged = JSON.stringify(report.protectedBefore) === JSON.stringify(report.protectedAfter);
  if (!report.protectedUnchanged) report.result = 'FAIL';
  report.finishedAt = new Date().toISOString(); fs.writeFileSync(path.join(output, 'browser.json'), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ output: path.relative(root, output).replaceAll('\\', '/'), result: report.result, checks: report.checks,
  protectedUnchanged: report.protectedUnchanged, browserClosed: report.browserClosed, error: report.error }, null, 2));
if (report.result === 'FAIL') process.exitCode = 1;
