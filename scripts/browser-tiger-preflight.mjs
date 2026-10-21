import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'evidence/current/tiger');
fs.mkdirSync(output, { recursive: true });
const contract = JSON.parse(fs.readFileSync(path.join(root, 'prototype-2d/assets/enemy-tiger-battle-v1-frames.json'), 'utf8'));
const png = fs.readFileSync(path.join(root, 'prototype-2d/assets', contract.asset));
const sha256 = data => crypto.createHash('sha256').update(data).digest('hex');
if (sha256(png) !== contract.sha256) throw new Error('Frame contract does not match current PNG');
const report = { generatedAt: new Date().toISOString(), scope: 'Real Edge atlas preflight only, not gameplay animation acceptance. Runtime remains unchanged.', assetSha256: contract.sha256, result: 'FAIL', pageErrors: [] };
let browser;
try {
  const pw = await loadPlaywright();
  browser = await pw.chromium.launch(browserLaunchOptions());
  report.browser = await browser.version();
  const page = await browser.newPage({ viewport: { width: 1180, height: 700 }, deviceScaleFactor: 1 });
  page.on('pageerror', error => report.pageErrors.push(String(error)));
  await page.setContent('<!doctype html><meta charset="utf-8"><title>Tiger atlas preflight</title><style>body{margin:0;background:#ede7d8;color:#25392e;font:16px sans-serif}h1{font-size:20px;margin:12px}p{margin:12px;font-size:13px}canvas{display:block}</style><h1>首关普通虎妖 · 32 姿态素材预检（尚未接入局内）</h1><p>按实测坐标裁切；统一源像素缩放，不把不同姿态拉伸至同一方框。上：48px实际比例；下：动作抽样。</p><canvas id="sheet" width="1180" height="456"></canvas><canvas id="motion" width="1180" height="146"></canvas>');
  report.decode = await page.evaluate(async ({ contract, src }) => {
    const image = new Image(); image.src = src; await image.decode();
    const ctx = document.querySelector('#sheet').getContext('2d');
    const draw = (ctx, index, x, baseline, height = 48, mirror = false) => {
      const f = contract.sourceRects[index], row = Math.floor(index / 8), col = index % 8;
      const scale = height / contract.referenceBodyHeight;
      ctx.save(); ctx.translate(x, baseline); ctx.scale(mirror ? -1 : 1, 1);
      ctx.drawImage(image, f.x, f.y, f.w, f.h, (f.x - contract.previewRootXs[col]) * scale, (f.y - contract.previewBaselines[row]) * scale, f.w * scale, f.h * scale);
      ctx.restore();
    };
    ctx.fillStyle = '#f6f1e5'; ctx.fillRect(0, 0, 1180, 456);
    contract.sourceRects.forEach((f, i) => {
      const col = i % 8, row = Math.floor(i / 8), x = col * 147, y = row * 114;
      ctx.strokeStyle = '#c8c5b9'; ctx.strokeRect(x + 6, y + 6, 135, 102);
      ctx.fillStyle = '#344c3d'; ctx.font = '12px sans-serif'; ctx.fillText(`${f.state} ${i}`, x + 12, y + 23);
      ctx.strokeStyle = '#b7c5b4'; ctx.beginPath(); ctx.moveTo(x + 16, y + 88); ctx.lineTo(x + 130, y + 88); ctx.stroke();
      draw(ctx, i, x + 70, y + 86);
    });
    const sample = document.createElement('canvas'); sample.width = 180; sample.height = 136;
    const sampleCtx = sample.getContext('2d');
    window.tigerSample = (index, mirror = false) => { sampleCtx.clearRect(0, 0, 180, 136); draw(sampleCtx, index, 90, 113, 96, mirror); return sample.toDataURL(); };
    window.tigerMotion = step => {
      const m = document.querySelector('#motion').getContext('2d'); m.clearRect(0, 0, 1180, 146);
      Object.entries(contract.states).forEach(([state, indices], lane) => {
        const index = indices[state === 'death' ? Math.min(step, indices.length - 1) : step % indices.length];
        m.fillStyle = '#344c3d'; m.font = '14px sans-serif'; m.fillText(state, lane * 230 + 14, 20);
        draw(m, index, lane * 230 + 115, 136, 96);
      });
    };
    window.tigerMotion(0);
    return { width: image.naturalWidth, height: image.naturalHeight, complete: image.complete, sourceRectCount: contract.sourceRects.length };
  }, { contract, src: `data:image/png;base64,${png.toString('base64')}` });
  report.states = {};
  for (const [state, indices] of Object.entries(contract.states)) {
    const hashes = [];
    for (const index of indices) hashes.push(sha256(await page.evaluate(index => window.tigerSample(index), index)));
    report.states[state] = { frames: indices.length, distinctRenderedFrames: new Set(hashes).size, hashes };
  }
  const left = await page.evaluate(() => window.tigerSample(8, true));
  const right = await page.evaluate(() => window.tigerSample(8, false));
  report.leftRightDiffer = sha256(left) !== sha256(right);
  await page.screenshot({ path: path.join(output, 'atlas-48px-preflight.png') });
  await page.evaluate(() => window.tigerMotion(3));
  await page.screenshot({ path: path.join(output, 'pose-samples-preflight.png') });
  report.screenshots = ['evidence/current/tiger/atlas-48px-preflight.png', 'evidence/current/tiger/pose-samples-preflight.png'];
  report.result = report.decode.complete && report.decode.sourceRectCount === 32 && Object.values(report.states).every(s => s.frames === s.distinctRenderedFrames) && report.leftRightDiffer && report.pageErrors.length === 0 ? 'PASS' : 'FAIL';
} catch (error) { report.error = String(error?.stack || error); }
finally {
  if (browser) await browser.close();
  fs.writeFileSync(path.join(output, 'browser-preflight.json'), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify(report, null, 2));
if (report.result !== 'PASS') process.exitCode = 1;
