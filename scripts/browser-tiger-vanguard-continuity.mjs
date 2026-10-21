import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

// Read-only diagnostic of four neutral transition endpoints. Foot windows
// are review annotations, NOT an approved 32-frame animation/root contract.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const startedAt = new Date().toISOString();
const output = path.join(root, 'evidence/current/tiger-vanguard/continuity', startedAt.replaceAll(':', '-').replaceAll('.', '-'));
fs.mkdirSync(output, { recursive: true });
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const auditFile = 'evidence/current/tiger-vanguard/reuse-plan-node.json';
const auditBytes = fs.readFileSync(path.join(root, auditFile)), audit = JSON.parse(auditBytes);
const fingerprint = files => Object.fromEntries(files.map(file => [file, hash(fs.readFileSync(path.join(root, file)))]));
const scriptFile = 'scripts/browser-tiger-vanguard-continuity.mjs';
const report = { generatedAt: startedAt, result: 'FAIL', scope: 'Four source-pixel endpoint/foot-alignment diagnostics only; not gameplay, full animation continuity, approved roots, FPS, ZIP, public or device acceptance.',
  input: { file: auditFile, sha256: hash(auditBytes), use: 'Prior measured rectangles; source bytes/pixels/bounds/references rechecked this run, not reuse of old acceptance.' },
  scriptSha256: hash(fs.readFileSync(path.join(root, scriptFile))),
  protectedBefore: fingerprint(Object.keys(audit.protectedBefore)), sources: [], endpoints: [], screenshots: [],
  pageErrors: [], consoleErrors: [], failedRequests: [], externalRequests: [], runtimeApproved: false, highFrameApproved: false, publicPass: false };
const bounded = async (promise, name, ms = 15000) => {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${name} timeout`)), ms); })]); }
  finally { clearTimeout(timer); }
};
let browser;
try {
  let PNG;
  try { ({ PNG } = await import('pngjs')); } catch {
    const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE || '', '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
    ({ PNG } = await import(pathToFileURL(path.join(modules, 'pngjs/lib/png.js'))));
  }
  const pages = audit.sourcePages.map(source => {
    const bytes = fs.readFileSync(path.join(root, source.file)), png = PNG.sync.read(bytes);
    if (hash(bytes) !== source.sha256 || png.width !== source.width || png.height !== source.height) throw new Error(`Changed source ${source.id}`);
    report.sources.push({ ...source, sha256: hash(bytes), bytes: bytes.length, width: png.width, height: png.height });
    return { ...source, png, src: `data:image/png;base64,${bytes.toString('base64')}` };
  });
  // Crop-local, manually selected windows around the near-side supporting
  // foot. The alpha edge supplies a repeatable diagnostic alignment point.
  const windows = { 0: { x: 20, y: 169, w: 62, h: 26 }, 7: { x: 30, y: 169, w: 62, h: 26 },
    16: { x: 31, y: 146, w: 65, h: 27 }, 23: { x: 30, y: 145, w: 65, h: 29 } };
  for (const index of [7, 16, 23, 0]) {
    const frame = audit.frames[index], r = frame.sourceRect, v = frame.visibleRect, png = pages.find(p => p.id === frame.page).png, window = windows[index];
    const pixels = Buffer.alloc(v.w * v.h * 4);
    for (let y = 0; y < v.h; y++) png.data.copy(pixels, y * v.w * 4, ((v.y + y) * png.width + v.x) * 4, ((v.y + y) * png.width + v.x + v.w) * 4);
    if (hash(pixels) !== frame.rgbaSha256 || r.x < 0 || r.y < 0 || r.x + r.w > png.width || r.y + r.h > png.height) throw new Error(`Changed crop ${index}`);
    if (window.x < 0 || window.y < 0 || window.x + window.w > r.w || window.y + window.h > r.h) throw new Error(`Foot window outside crop ${index}`);
    const measurements = [8, 16].map(threshold => {
      const points = [];
      for (let y = window.y; y < window.y + window.h; y++) for (let x = window.x; x < window.x + window.w; x++) {
        if (png.data[((r.y + y) * png.width + r.x + x) * 4 + 3] > threshold) points.push({ x, y });
      }
      if (!points.length) throw new Error(`Empty foot window ${index}`);
      const bottom = Math.max(...points.map(p => p.y)), edge = points.filter(p => p.y >= bottom - 2);
      const left = Math.min(...edge.map(p => p.x)), right = Math.max(...edge.map(p => p.x));
      return { threshold, visible: points.length, bottom, edgeLeft: left, edgeRight: right, root: { x: (left + right) / 2, y: bottom + 1 } };
    });
    const pivot = measurements[1].root;
    report.endpoints.push({ index, state: frame.state, page: frame.page, sourceRect: r, sourcePixelSha256: frame.rgbaSha256,
      footWindow: window, footMeasurements: measurements, pivot, visibleHeight: v.h,
      anchorStatus: 'DIAGNOSTIC_SUPPORT_FOOT_ONLY; not an authored runtime root',
      bboxPivot: { x: r.w / 2, y: r.h },
      headTopToGround: pivot.y - (v.y - r.y),
      displacementFromOldBboxAt64: { x: (r.w / 2 - pivot.x) * 64 / 193, y: (r.h - pivot.y) * 64 / 193 } });
  }
  const referenceFiles = Object.keys(audit.protectedBefore).filter(file => file.startsWith('prototype-2d/src/')
    || ['prototype-2d/native-app.js', 'prototype-2d/assets/manifest.json', 'scripts/serve.mjs', 'scripts/release.mjs', 'scripts/runtime-frame-contract.mjs'].includes(file));
  report.runtimeReferences = referenceFiles.filter(file => {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    return report.sources.some(source => text.includes(path.basename(source.file)) || text.includes(source.sha256));
  });
  if (report.runtimeReferences.length) throw new Error('Unapproved candidate has a production reference');
  const pw = await loadPlaywright(); browser = await pw.chromium.launch(browserLaunchOptions()); report.browser = browser.version();
  const page = await browser.newPage({ viewport: { width: 1000, height: 920 }, deviceScaleFactor: 1 });
  page.on('pageerror', error => report.pageErrors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
  page.on('requestfailed', request => report.failedRequests.push(request.url()));
  page.on('request', request => { if (/^https?:/.test(request.url())) report.externalRequests.push(request.url()); });
  await page.setContent('<!doctype html><meta charset="utf-8"><title>虎先锋端点衔接诊断·未接入</title><style>body{margin:0;background:#eee6d1}canvas{display:block}</style><canvas width="1000" height="920"></canvas>');
  report.decoded = await bounded(page.evaluate(async ({ pages, frames }) => {
    const images = {};
    for (const page of pages) { const image = new Image(); image.src = page.src; await image.decode(); images[page.id] = image; }
    const canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d');
    const clear = (title, note) => {
      ctx.fillStyle = '#eee6d1'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#302c24'; ctx.font = 'bold 21px sans-serif'; ctx.fillText(title, 20, 32);
      ctx.font = '13px sans-serif'; ctx.fillText(note, 20, 58);
    };
    const paint = (frame, x, y, scale, anchor = frame.pivot, facing = 1) => {
      const r = frame.sourceRect;
      ctx.save(); ctx.translate(x, y); ctx.scale(scale * facing, scale);
      ctx.drawImage(images[frame.page], r.x, r.y, r.w, r.h, -anchor.x, -anchor.y, r.w, r.h);
      ctx.restore();
    };
    const cross = (x, y) => { ctx.strokeStyle = '#168d7b'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 8, y); ctx.lineTo(x + 8, y); ctx.moveTo(x, y - 8); ctx.lineTo(x, y + 8); ctx.stroke(); };
    window.continuityPreview = { images, frames, canvas, ctx, clear, paint, cross };
    return pages.map(p => ({ id: p.id, width: images[p.id].naturalWidth, height: images[p.id].naturalHeight,
      matched: images[p.id].naturalWidth === p.width && images[p.id].naturalHeight === p.height }));
  }, { pages: pages.map(({ png, ...page }) => page), frames: report.endpoints }), 'decode');
  const shot = async name => {
    const file = path.join(output, `${name}.png`), bytes = await page.screenshot({ path: file });
    report.screenshots.push({ file: path.relative(root, file).replaceAll('\\', '/'), bytes: bytes.length, sha256: hash(bytes) });
  };
  await bounded(page.evaluate(() => {
    const { frames, ctx, clear, paint, cross } = window.continuityPreview;
    clear('支撑脚窗口检查 · 四个过渡端点 · 原像素未改', '绿色框是人工选取的脚底检查区域；十字由alpha>16最低三行测出，仅用于平移诊断，不是全动作根点批准。');
    frames.forEach((frame, i) => {
      const x = 60 + i % 2 * 495, y = 116 + Math.floor(i / 2) * 390, scale = 1.6, w = frame.footWindow;
      ctx.fillStyle = '#302c24'; ctx.font = '15px sans-serif'; ctx.fillText(`${frame.page} ${frame.state}[${frame.index}] · crop ${frame.sourceRect.w}×${frame.sourceRect.h}`, x, y - 18);
      paint(frame, x, y, scale, { x: 0, y: 0 });
      ctx.strokeStyle = '#168d7b'; ctx.strokeRect(x + w.x * scale, y + w.y * scale, w.w * scale, w.h * scale);
      cross(x + frame.pivot.x * scale, y + frame.pivot.y * scale);
    });
    ctx.fillStyle = '#9b352b'; ctx.font = '15px sans-serif'; ctx.fillText('只移动裁切的绘制位置；不旋转、不缩放单帧、不重绘、不生成新素材。', 20, 906);
  }), 'foot inspection');
  await shot('support-foot-windows');
  await page.setViewportSize({ width: 1000, height: 680 });
  await bounded(page.evaluate(() => {
    const p = window.continuityPreview, { ctx, frames, clear, paint, cross } = p; p.canvas.height = 680;
    clear('同一源像素比例对照 · 128px参照 · 仅平移', '上排：旧包围盒底中心；下排：近侧支撑脚alpha边缘对齐。对照胸甲/领口/腰带/刀形，不能只凭高度判断动作质量。');
    frames.forEach((frame, i) => {
      const x = 75 + i * 244, scale = 128 / 193;
      ctx.fillStyle = '#302c24'; ctx.font = '13px sans-serif'; ctx.fillText(`${frame.page} ${frame.state}[${frame.index}]`, x - 48, 108);
      for (const [y, anchor] of [[300, frame.bboxPivot], [570, frame.pivot]]) {
        ctx.strokeStyle = '#c1bba7'; ctx.beginPath(); ctx.moveTo(x - 55, y); ctx.lineTo(x + 145, y); ctx.stroke();
        paint(frame, x, y, scale, anchor); cross(x + (frame.pivot.x - anchor.x) * scale, y + (frame.pivot.y - anchor.y) * scale);
      }
    });
    ctx.fillStyle = '#9b352b'; ctx.font = '16px sans-serif'; ctx.fillText('脚底对齐只消除位置变量，不会改变造型。四端点检查不批准其余攻击、受击或死亡根点。', 20, 647);
  }), 'aligned comparison');
  await shot('bbox-vs-support-foot-128');
  report.smallScale = await bounded(page.evaluate(() => {
    const { frames, ctx, clear, paint, cross } = window.continuityPreview, records = [];
    clear('端点造型 · 64px / 48px · 右向 / 镜像左向', '所有行使用相同源像素参照193；绿色十字固定脚底。不是逐帧身高归一，也不是完整动画或局内验收。');
    for (const [row, height, facing] of [[0, 64, 1], [1, 48, 1], [2, 64, -1], [3, 48, -1]]) {
      const y = 207 + row * 142;
      ctx.fillStyle = '#302c24'; ctx.font = '12px sans-serif'; ctx.fillText(`${height}px ${facing === 1 ? '右向' : '左向'}`, 10, y - 90);
      for (const [i, frame] of frames.entries()) {
        const x = (facing === 1 ? 100 : 170) + i * 235;
        paint(frame, x, y, height / 193, frame.pivot, facing); cross(x, y);
        ctx.fillText(`${frame.page} ${frame.state}[${frame.index}]`, x - 35, y + 19);
        records.push({ index: frame.index, page: frame.page, height, facing, sourceScale: height / 193, root: { x, y } });
      }
    }
    return records;
  }), 'small-scale comparison');
  await shot('support-foot-aligned-64-48-both-facings');
  report.checks = { sourcesDecoded: report.decoded.length === 2 && report.decoded.every(x => x.matched),
    fourEndpointsMeasured: report.endpoints.length === 4 && report.endpoints.every(f => f.footMeasurements.every(m => m.visible > 0)),
    bothScalesAndFacings: report.smallScale.length === 16, noRuntimeReferences: report.runtimeReferences.length === 0,
    noErrorsOrNetwork: !report.pageErrors.length && !report.consoleErrors.length && !report.failedRequests.length && !report.externalRequests.length };
  report.technicalPreviewPassed = Object.values(report.checks).every(Boolean);
  report.result = report.technicalPreviewPassed ? 'REVIEW_ENDPOINT_ALIGNMENT_ONLY' : 'FAIL';
} catch (error) { report.error = String(error?.stack || error); }
finally {
  if (browser) try { await bounded(browser.close(), 'browser cleanup'); report.browserClosed = true; }
  catch (error) { report.cleanupError = String(error); report.result = 'FAIL'; }
  report.protectedAfter = fingerprint(Object.keys(report.protectedBefore));
  report.protectedUnchanged = JSON.stringify(report.protectedBefore) === JSON.stringify(report.protectedAfter);
  if (!report.protectedUnchanged) report.result = 'FAIL';
  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(path.join(output, 'browser.json'), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ output: path.relative(root, output).replaceAll('\\', '/'), result: report.result, checks: report.checks,
  endpoints: report.endpoints.map(f => ({ index: f.index, page: f.page, pivot: f.pivot, headTopToGround: f.headTopToGround })),
  browserClosed: report.browserClosed, protectedUnchanged: report.protectedUnchanged, error: report.error }, null, 2));
if (report.result === 'FAIL') process.exitCode = 1;
