import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

// Isolated candidate-only browser preview. This deliberately does not load
// the game, register an actor, or publish the failed candidate.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'evidence/current/tiger-vanguard');
const version = process.argv[2] || 'v1';
const pngPath = path.join(dir, `candidate-${version}-sheet.png`);
const preflightPath = path.join(dir, `asset-preflight-${version}.json`);
const outputPath = path.join(dir, `browser-candidate-${version}-preflight.json`);
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const png = fs.readFileSync(pngPath);
const preflight = JSON.parse(fs.readFileSync(preflightPath, 'utf8'));
const report = {
  generatedAt: new Date().toISOString(),
  result: 'FAIL',
  scope: 'Single real Edge decode/draw preview of a rejected Tiger Vanguard candidate; not production gameplay, runtime approval, ZIP, public or FPS evidence.',
  asset: { path: `evidence/current/tiger-vanguard/candidate-${version}-sheet.png`, sha256: hash(png), bytes: png.length, size: [preflight.width, preflight.height] },
  sourcePreflight: { path: `evidence/current/tiger-vanguard/asset-preflight-${version}.json`, result: preflight.result, checks: preflight.checks },
  pageErrors: [],
};
let browser;
try {
  const pw = await loadPlaywright();
  browser = await pw.chromium.launch(browserLaunchOptions());
  report.browser = browser.version();
  const page = await browser.newPage({ viewport: { width: 1100, height: 760 }, deviceScaleFactor: 1 });
  page.setDefaultTimeout(10000);
  page.on('pageerror', error => report.pageErrors.push(String(error)));
  await page.setContent('<!doctype html><meta charset="utf-8"><title>Tiger Vanguard candidate preflight</title><style>body{margin:0;background:#efe9d5}canvas{display:block}</style><canvas width="1100" height="760"></canvas>');
  const result = await page.evaluate(async ({ src, frames, width, height, version }) => {
    const image = new Image();
    image.src = src;
    await image.decode();
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = '#efe9d5'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#302920'; ctx.font = '20px sans-serif';
    ctx.fillText(`双叉岭虎先锋候选 ${version} · 真实Edge独立预检 · REVIEW/FAIL候选，不是局内运行`, 18, 30);
    ctx.font = '13px sans-serif';
    ctx.fillText(`PNG ${width}×${height} · 实测alpha区域 ${frames.length}/32；第32格缺失，保留原始失败稿`, 18, 53);
    const sample = document.createElement('canvas'); sample.width = 160; sample.height = 150;
    const sampleCtx = sample.getContext('2d', { willReadFrequently: true });
    const rendered = [];
    for (const frame of frames) {
      const row = frame.row, column = frame.column;
      const x = 8 + column * 136, y = 70 + row * 166;
      ctx.strokeStyle = '#bbb59e'; ctx.strokeRect(x, y, 124, 148);
      ctx.fillStyle = '#302920'; ctx.font = '11px sans-serif'; ctx.fillText(`${frame.state} ${frame.index}`, x + 6, y + 16);
      ctx.strokeStyle = '#bdc8ae'; ctx.beginPath(); ctx.moveTo(x + 6, y + 126); ctx.lineTo(x + 118, y + 126); ctx.stroke();
      const scale = 92 / Math.max(frame.rect.w, frame.rect.h);
      const drawW = frame.rect.w * scale, drawH = frame.rect.h * scale;
      ctx.drawImage(image, frame.rect.x, frame.rect.y, frame.rect.w, frame.rect.h,
        x + 62 - drawW / 2, y + 126 - drawH, drawW, drawH);
      sampleCtx.clearRect(0, 0, sample.width, sample.height);
      sampleCtx.drawImage(image, frame.rect.x, frame.rect.y, frame.rect.w, frame.rect.h, 80 - drawW / 2, 130 - drawH, drawW, drawH);
      const pixels = sampleCtx.getImageData(0, 0, sample.width, sample.height).data;
      let h = 2166136261;
      for (const byte of pixels) h = Math.imul(h ^ byte, 16777619);
      rendered.push({ index: frame.index, state: frame.state, pixelHash: h >>> 0 });
    }
    ctx.fillStyle = '#8b2f2f'; ctx.font = '17px sans-serif'; ctx.fillText('预检结论：PNG可解码并可绘制，但布局检查失败（死亡行7区域/31独立姿态/边缘裁切）', 18, 748);
    return { decoded: image.complete && image.naturalWidth === width && image.naturalHeight === height, rendered, distinctRendered: new Set(rendered.map(item => item.pixelHash)).size };
  }, { src: `data:image/png;base64,${png.toString('base64')}`, frames: preflight.frames, width: preflight.width, height: preflight.height, version });
  const screenshotPath = path.join(dir, `browser-candidate-${version}-atlas.png`);
  const screenshotBytes = await page.screenshot({ path: screenshotPath });
  report.browserDecode = result;
  report.screenshot = { path: `evidence/current/tiger-vanguard/browser-candidate-${version}-atlas.png`, sha256: hash(screenshotBytes), bytes: screenshotBytes.length };
  report.checks = {
    browserDecoded: result.decoded,
    allMeasuredRegionsDrawn: result.rendered.length === preflight.frames.length,
    browserDistinctRenderedRegions: result.distinctRendered === preflight.uniqueFrames,
    noPageErrors: report.pageErrors.length === 0,
    sourceLayoutApproved: false,
  };
  report.result = Object.values(report.checks).every(Boolean) ? 'PASS' : 'REVIEW';
} catch (error) {
  report.error = String(error?.stack || error);
}
finally {
  if (browser) {
    try { await browser.close(); report.browserClosed = true; }
    catch (error) { report.cleanupError = String(error); }
  }
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
}
console.log(JSON.stringify(report, null, 2));
if (report.result === 'FAIL') process.exitCode = 1;
