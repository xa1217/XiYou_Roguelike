import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

// One real Edge tab, local data URLs only. Never expose this candidate via serve/release.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const preflightFile = path.resolve(root, process.argv[2] || 'missing-preflight');
if (!preflightFile.startsWith(path.join(root, 'evidence/current/wujing-layout') + path.sep)) throw new Error('Expected candidate preflight');
const folder = path.dirname(preflightFile), preflight = JSON.parse(fs.readFileSync(preflightFile));
const output = path.join(folder, `browser-${new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')}`);
fs.mkdirSync(output, { recursive: true });
const relative = file => path.relative(root, file).replaceAll('\\', '/');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const report = { generatedAt: new Date().toISOString(), result: 'EXECUTION_FAILED',
  scope: 'Real Edge candidate-only local HTML preview. Not gameplay, runtime fix, FPS, high-frame animation, public internet, ZIP or device acceptance.',
  preflight: relative(preflightFile), preflightSha256: hash(fs.readFileSync(preflightFile)),
  scriptSha256: hash(fs.readFileSync(fileURLToPath(import.meta.url))),
  runtimeApproved: false, highFrameApproved: false, candidateLayoutPassed: false,
  pageErrors: [], consoleErrors: [], requestFailures: [], screenshots: [], serverStarted: false, previewChecksPassed: false };
const bounded = async (promise, label, ms = 20000) => {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${label} timeout`)), ms); })]); }
  finally { clearTimeout(timer); }
};
let browser;
try {
  const candidateBytes = fs.readFileSync(path.join(root, preflight.input));
  const originalFile = path.join(root, 'prototype-2d/assets/hero-wujing-battle-v3-sheet.png'), originalBytes = fs.readFileSync(originalFile);
  assert.equal(hash(candidateBytes), preflight.sha256); assert.equal(hash(originalBytes), preflight.originalSha256);
  const playwright = await loadPlaywright();
  browser = await playwright.chromium.launch({ ...browserLaunchOptions(), timeout: 20000 });
  report.browserVersion = browser.version(); report.browserStartedAt = new Date().toISOString();
  const page = await browser.newPage({ viewport: { width: 1800, height: 990 }, deviceScaleFactor: 1 });
  page.on('pageerror', error => report.pageErrors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
  page.on('requestfailed', request => report.requestFailures.push({ url: request.url().slice(0, 200), error: request.failure()?.errorText }));
  await page.setContent('<!doctype html><html lang="en"><meta charset="utf-8"><title>Wujing candidate-only inspection</title><style>body{margin:0;background:#233039}canvas{display:block}</style><canvas id="preview" width="1800" height="990"></canvas></html>');
  report.decoded = await bounded(page.evaluate(async data => {
    window.inspectionImages = {};
    const result = {};
    for (const [name, url] of Object.entries(data)) {
      const img = new Image(); img.src = url; await img.decode(); window.inspectionImages[name] = img;
      result[name] = { width: img.naturalWidth, height: img.naturalHeight, complete: img.complete };
    }
    return result;
  }, { original: `data:image/png;base64,${originalBytes.toString('base64')}`, candidate: `data:image/png;base64,${candidateBytes.toString('base64')}` }), 'PNG decode');
  assert.deepEqual(report.decoded.candidate, { width: preflight.width, height: preflight.height, complete: true });
  const measurement = preflight.measurements.find(m => m.alphaGreaterThan === 8);
  assert.equal(measurement.candidates.length, 8);
  for (const mode of ['original-source', 'candidate-source-grid', 'candidate-padded', 'candidate-equal-cell']) {
    const result = await bounded(page.evaluate(({ mode, measurement }) => {
      const canvas = document.getElementById('preview'), ctx = canvas.getContext('2d');
      const calls = [];
      ctx.fillStyle = '#233039'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 23px sans-serif'; ctx.fillText(`EVIDENCE ONLY / ${mode}`, 16, 30);
      ctx.font = '16px sans-serif'; ctx.fillText('Not integrated. No runtime, pose-preservation, high-frame or internet approval.', 16, 53);
      const draw = (img, ...args) => { calls.push(args); ctx.drawImage(img, ...args); };
      if (mode.endsWith('source') || mode === 'candidate-source-grid') {
        const image = window.inspectionImages[mode === 'original-source' ? 'original' : 'candidate'];
        draw(image, 12, 76);
        if (mode === 'candidate-source-grid') {
          ctx.strokeStyle = '#7297ff'; ctx.setLineDash([7, 5]); ctx.lineWidth = 1;
          for (let col = 0; col <= 4; col++) { ctx.beginPath(); ctx.moveTo(12 + col * image.width / 4, 76); ctx.lineTo(12 + col * image.width / 4, 76 + image.height); ctx.stroke(); }
          for (let row = 0; row <= 2; row++) { ctx.beginPath(); ctx.moveTo(12, 76 + row * image.height / 2); ctx.lineTo(12 + image.width, 76 + row * image.height / 2); ctx.stroke(); }
          ctx.setLineDash([]);
          for (const item of measurement.candidates) {
            const r = item.padded.rect; ctx.strokeStyle = item.padded.foreignMajorPixels ? '#ff6d62' : '#75dba4';
            ctx.lineWidth = 2; ctx.strokeRect(12 + r.x, 76 + r.y, r.w, r.h);
            ctx.fillStyle = ctx.strokeStyle; ctx.fillText(`${item.index}: foreign=${item.padded.foreignMajorPixels}`, 12 + r.x, 71 + r.y);
          }
        }
      } else {
        const scale = 0.65, image = window.inspectionImages.candidate;
        for (const item of measurement.candidates) {
          const r = mode === 'candidate-padded' ? item.padded.rect : item.equalCell.rect;
          const x = 12 + item.index % 4 * 448, y = 87 + Math.floor(item.index / 4) * 440;
          ctx.fillStyle = '#31434c'; ctx.fillRect(x, y, 432, 420);
          ctx.fillStyle = '#fff'; ctx.font = '17px sans-serif'; ctx.fillText(`pose ${item.index} / uniform preview scale 0.65`, x + 10, y + 25);
          ctx.font = '15px sans-serif';
          const stat = mode === 'candidate-padded' ? item.padded : item.equalCell;
          ctx.fillText(`foreign=${stat.foreignMajorPixels}; lost=${stat.lostOwnMajorPixels}`, x + 10, y + 49);
          draw(image, r.x, r.y, r.w, r.h, x + (432 - r.w * scale) / 2, y + 85 + (300 - r.h * scale) / 2, r.w * scale, r.h * scale);
        }
      }
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let fnv = 2166136261;
      for (let i = 0; i < pixels.length; i++) fnv = Math.imul(fnv ^ pixels[i], 16777619) >>> 0;
      return { mode, actualCanvasDrawCalls: calls, canvasRgbaFNV1a: fnv.toString(16),
        previewScale: mode.includes('padded') || mode.includes('equal-cell') ? 0.65 : 1,
        note: 'Per-card translation/centering is for inspection only; not proposed runtime roots or body scale.' };
    }, { mode, measurement }), 'render preview');
    if (mode === 'candidate-padded' || mode === 'candidate-equal-cell') {
      assert.equal(result.actualCanvasDrawCalls.length, 8);
      for (let i = 0; i < 8; i++) {
        const r = mode === 'candidate-padded' ? measurement.candidates[i].padded.rect : measurement.candidates[i].equalCell.rect;
        assert.deepEqual(result.actualCanvasDrawCalls[i].slice(0, 4), [r.x, r.y, r.w, r.h]);
        assert.equal(result.actualCanvasDrawCalls[i][6], r.w * 0.65); assert.equal(result.actualCanvasDrawCalls[i][7], r.h * 0.65);
      }
    } else assert.equal(result.actualCanvasDrawCalls.length, 1);
    const file = path.join(output, `${mode}.png`), screenshot = await page.screenshot({ path: file });
    report.screenshots.push({ file: relative(file), sha256: hash(screenshot), bytes: screenshot.length, ...result });
  }
  assert.equal(report.pageErrors.length + report.consoleErrors.length + report.requestFailures.length, 0);
  report.previewChecksPassed = true; report.result = 'REVIEW_LAYOUT_CONSTRAINTS_NOT_MET';
} catch (error) { report.error = String(error.stack || error); process.exitCode = 1; }
finally {
  if (browser) {
    try { await bounded(browser.close(), 'browser close', 10000); report.ownedBrowserClosed = true; }
    catch (error) { report.cleanupError = String(error); report.ownedBrowserClosed = false; report.result = 'EXECUTION_FAILED'; process.exitCode = 1; }
  }
  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(path.join(output, 'browser.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ output: relative(output), result: report.result, previewChecksPassed: report.previewChecksPassed, screenshots: report.screenshots.length, ownedBrowserClosed: report.ownedBrowserClosed, error: report.error }));
}
