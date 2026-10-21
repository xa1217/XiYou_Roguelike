import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

// One offline headless Edge page; original source pixels only. Not gameplay.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const input = path.resolve(root, process.argv[2] || '');
assert.ok(input.startsWith(path.join(root, 'evidence/current/tiger-vanguard/single-source') + path.sep) && path.basename(input) === 'node.json');
const inputBytes = fs.readFileSync(input), audit = JSON.parse(inputBytes), dir = path.dirname(input);
assert.equal(audit.result, 'REVIEW_SINGLE_SOURCE_ISOLATION_INVENTORY');
assert.ok(!fs.existsSync(path.join(dir, 'browser.json')), 'Do not overwrite a previous browser run');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const fingerprint = () => Object.fromEntries(Object.keys(audit.protectedBefore).map(file => [file, hash(fs.readFileSync(path.join(root, file)))]));
const report = { generatedAt: new Date().toISOString(), result: 'FAIL', scope: 'Offline original v1 source inventory preview; not repaired art, animation/root approval, game integration, public, FPS, ZIP or device acceptance.',
  sourceAudit: { file: path.relative(root, input).replaceAll('\\', '/'), sha256: hash(inputBytes) }, source: audit.source,
  scriptSha256: hash(fs.readFileSync(fileURLToPath(import.meta.url))), protectedBefore: fingerprint(),
  screenshots: [], pageErrors: [], consoleErrors: [], failedRequests: [], externalRequests: [],
  runtimeApproved: false, highFrameApproved: false, publicPass: false };
const bounded = async (promise, name) => {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${name} timeout`)), 15000); })]); }
  finally { clearTimeout(timer); }
};
let browser;
try {
  assert.deepEqual(report.protectedBefore, audit.protectedAfter, 'Protected source changed since fresh Node inventory');
  const bytes = fs.readFileSync(path.join(root, audit.source.file)); assert.equal(hash(bytes), audit.source.sha256);
  const pw = await loadPlaywright(); browser = await pw.chromium.launch(browserLaunchOptions()); report.browser = browser.version();
  const page = await browser.newPage({ viewport: { width: 1220, height: 760 }, deviceScaleFactor: 1 });
  page.setDefaultTimeout(15000);
  page.on('pageerror', e => report.pageErrors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
  page.on('requestfailed', r => report.failedRequests.push(r.url()));
  page.on('request', r => { if (/^https?:/.test(r.url())) report.externalRequests.push(r.url()); });
  await page.route('http://**/*', route => route.abort());
  await page.route('https://**/*', route => route.abort());
  await page.setContent('<!doctype html><meta charset="utf-8"><title>虎先锋v1单源库存·未接入</title><style>body{margin:0;background:#eee6d1}canvas{display:block}</style><canvas width="1220" height="760"></canvas>');
  report.pixelChecks = await bounded(page.evaluate(async ({ src, source, candidates }) => {
    const image = new Image(); image.src = src; await image.decode();
    const raw = document.createElement('canvas'); raw.width = image.naturalWidth; raw.height = image.naturalHeight;
    const rawCtx = raw.getContext('2d', { willReadFrequently: true }); rawCtx.drawImage(image, 0, 0);
    const data = rawCtx.getImageData(0, 0, raw.width, raw.height).data;
    const measured = candidates.map(c => ({ index: c.index, thresholds: [8, 16].map(threshold => {
      let visible = 0, guardPixels = 0, sourceEdgePixels = 0; const r = c.rect;
      for (let y = Math.max(0, r.y - 2); y < Math.min(raw.height, r.y + r.h + 2); y++) {
        for (let x = Math.max(0, r.x - 2); x < Math.min(raw.width, r.x + r.w + 2); x++) {
          if (data[(y * raw.width + x) * 4 + 3] <= threshold) continue;
          if (x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h) {
            visible++; if (x === 0 || y === 0 || x === raw.width - 1 || y === raw.height - 1) sourceEdgePixels++;
          } else guardPixels++;
        }
      }
      const expected = c.checks.find(m => m.threshold === threshold);
      return { threshold, visible, guardPixels, sourceEdgePixels,
        matchesNode: expected.visible === visible && expected.guardPixels === guardPixels && expected.sourceEdgePixels === sourceEdgePixels };
    }) }));
    const canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d');
    const clear = (title, note) => {
      ctx.fillStyle = '#eee6d1'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#302c24'; ctx.font = 'bold 21px sans-serif'; ctx.fillText(title, 20, 30);
      ctx.font = '13px sans-serif'; ctx.fillText(note, 20, 54);
    };
    window.inventoryPreview = { image, canvas, ctx, candidates, clear };
    return { decoded: image.naturalWidth === source.width && image.naturalHeight === source.height, measured,
      allMatch: measured.every(m => m.thresholds.every(t => t.matchesNode)) };
  }, { src: `data:image/png;base64,${bytes.toString('base64')}`, source: audit.source, candidates: audit.candidates }), 'decode and alpha check');
  const shot = async name => {
    const file = path.join(dir, `${name}.png`), bytes = await page.screenshot({ path: file });
    report.screenshots.push({ file: path.relative(root, file).replaceAll('\\', '/'), bytes: bytes.length, sha256: hash(bytes) });
  };
  await bounded(page.evaluate(() => {
    const { image, ctx, clear, candidates } = window.inventoryPreview, scale = 0.66, x = 24, y = 88;
    clear('虎先锋 v1 · 同一源稿32个大组件库存 · 原PNG未改', '绿色仅代表29个隔离区域候选；红色7/30/31仍需源级处理。组件数不是独立动作质量或高帧验收。');
    ctx.drawImage(image, x, y, image.width * scale, image.height * scale);
    for (const c of candidates) {
      const r = c.rect; ctx.strokeStyle = c.isolationCandidate ? '#168d7b' : '#b52732'; ctx.lineWidth = c.isolationCandidate ? 1 : 2;
      ctx.strokeRect(x + r.x * scale, y + r.y * scale, r.w * scale, r.h * scale);
      ctx.fillStyle = '#302c24'; ctx.font = '12px sans-serif'; ctx.fillText(`${c.index} ${c.state}[${c.stateIndex}]`, x + r.x * scale, y + r.y * scale - 5);
    }
    ctx.fillStyle = '#9b352b'; ctx.font = '15px sans-serif'; ctx.fillText('idle[7]刀尖触右边；death[2/3]主体互不连接，但完整矩形与2px边界仍夹入邻人像素。', 20, 724);
  }), 'source overview');
  await shot('v1-source-inventory');
  await bounded(page.evaluate(() => {
    const { image, ctx, clear, candidates } = window.inventoryPreview;
    clear('三个隔离缺陷的原像素放大 · 不修图、不删半透明边缘', '左上：idle[7]右边界；右上：death[2/3]整体；下方：两死亡姿态的邻接边缘，原像素放大8倍。');
    ctx.drawImage(image, 1560, 25, 214, 205, 35, 98, 321, 307.5);
    ctx.strokeStyle = '#b52732'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(356, 98); ctx.lineTo(356, 406); ctx.stroke();
    ctx.fillStyle = '#9b352b'; ctx.font = '13px sans-serif'; ctx.fillText('红线是原画布x=1774，不是可补出的透明留白', 24, 433);
    ctx.drawImage(image, 1320, 745, 454, 120, 460, 120, 726.4, 192);
    for (const index of [30, 31]) {
      const r = candidates[index].rect; ctx.strokeStyle = index === 30 ? '#b52732' : '#168d7b';
      ctx.strokeRect(460 + (r.x - 1320) * 1.6, 120 + (r.y - 745) * 1.6, r.w * 1.6, r.h * 1.6);
      ctx.fillStyle = '#302c24'; ctx.fillText(`${index}: x=${r.x}..${r.x + r.w - 1}`, 460 + (r.x - 1320) * 1.6, 347);
    }
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, 1535, 807, 35, 40, 595, 385, 280, 320);
    ctx.imageSmoothingEnabled = true;
    ctx.strokeStyle = '#b52732'; ctx.strokeRect(595 + (1552 - 1535) * 8, 385, 8, 320);
    ctx.fillStyle = '#302c24'; ctx.font = '13px sans-serif';
    ctx.fillText('x=1552共同列（红框）内两主体不接触；矩形却会纳入对方像素。', 420, 738);
    ctx.fillText('alpha>8：tight crop分别带入邻体6/1像素', 35, 509);
    ctx.fillText('alpha>16：tight crop无邻体，但2px guard仍有15/10像素', 35, 535);
    ctx.fillText('提高阈值不是修复；源像素未丢弃。', 35, 561);
  }), 'defect closeups');
  await shot('v1-three-defects');
  report.drawn = await bounded(page.evaluate(() => {
    const { image, ctx, clear, candidates } = window.inventoryPreview, records = [], scale = 64 / 191;
    clear('v1完整候选库存 · 单一源像素比例 · 64px参照', '29个隔离区域 + 3个未批准诊断裁切；包围盒底中心只为排列，不是脚底根点或序列动画验收。');
    candidates.forEach((c, i) => {
      const x = 12 + i % 8 * 151, y = 82 + Math.floor(i / 8) * 159, r = c.rect;
      ctx.strokeStyle = c.isolationCandidate ? '#168d7b' : '#b52732'; ctx.strokeRect(x, y, 142, 145);
      ctx.fillStyle = '#302c24'; ctx.font = '12px sans-serif'; ctx.fillText(`${i} ${c.state}[${c.stateIndex}]`, x + 6, y + 20);
      ctx.drawImage(image, r.x, r.y, r.w, r.h, x + 71 - r.w * scale / 2, y + 112 - r.h * scale, r.w * scale, r.h * scale);
      ctx.fillStyle = c.isolationCandidate ? '#168d7b' : '#b52732'; ctx.fillText(c.isolationCandidate ? '仅隔离候选' : '不可接入', x + 6, y + 134);
      records.push({ index: i, sourceRect: r, sourceScale: scale, isolationCandidate: c.isolationCandidate });
    });
    return records;
  }), 'same-source grid');
  await shot('v1-candidate-grid-64');
  report.checks = { originalSourceDecoded: report.pixelChecks.decoded, alphaCountsMatchFreshNode: report.pixelChecks.allMatch,
    all32CandidateBoxesDrawn: report.drawn.length === 32, sourceProtectionMatches: true,
    noErrorsOrNetwork: !report.pageErrors.length && !report.consoleErrors.length && !report.failedRequests.length && !report.externalRequests.length };
  report.technicalPreviewPassed = Object.values(report.checks).every(Boolean);
  report.result = report.technicalPreviewPassed ? 'REVIEW_SINGLE_SOURCE_INVENTORY_ONLY' : 'FAIL';
} catch (error) { report.error = String(error.stack || error); }
finally {
  if (browser) try { await bounded(browser.close(), 'browser cleanup'); report.browserClosed = true; }
  catch (error) { report.cleanupError = String(error); report.result = 'FAIL'; }
  report.protectedAfter = fingerprint(); report.protectedUnchanged = JSON.stringify(report.protectedBefore) === JSON.stringify(report.protectedAfter);
  if (!report.protectedUnchanged) report.result = 'FAIL';
  report.finishedAt = new Date().toISOString(); fs.writeFileSync(path.join(dir, 'browser.json'), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ file: path.relative(root, path.join(dir, 'browser.json')).replaceAll('\\', '/'), result: report.result,
  checks: report.checks, browserClosed: report.browserClosed, protectedUnchanged: report.protectedUnchanged, error: report.error }, null, 2));
if (report.result === 'FAIL') process.exitCode = 1;
