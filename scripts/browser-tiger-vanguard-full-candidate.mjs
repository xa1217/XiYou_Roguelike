import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

// Evidence-only manifest and preview of existing pixels. Never emits an atlas,
// edits an image, or registers the candidate in any game/serve/release contract.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const rel = f => path.relative(root, f).replaceAll('\\', '/');
const baseline = read('evidence/current/tiger-vanguard/death-seam/2026-10-13T11-05-40-965Z/browser.json');
const inventory = read('evidence/current/tiger-vanguard/single-source/2026-10-13T05-44-03-776Z/node.json');
const fingerprint = () => Object.fromEntries(Object.keys(baseline.protectedBefore).map(f => [f, hash(fs.readFileSync(path.join(root, f)))]));
const generatedAt = new Date().toISOString();
const output = path.join(root, 'evidence/current/tiger-vanguard/full-candidate', generatedAt.replaceAll(':', '-').replaceAll('.', '-'));
fs.mkdirSync(output, { recursive: true });
const stateRanges = { idle: [0, 8], move: [8, 8], attack: [16, 8], hit: [24, 4], death: [28, 4] };
const patches = { 7: { x: 46, y: 148, w: 525, h: 443 }, 30: { x: 699, y: 400, w: 620, h: 224 }, 31: { x: 1452, y: 431, w: 657, h: 192 } };
const report = { generatedAt, result: 'FAIL', scope: 'Evidence-only explicit32 candidate table and full-state source preview; NOT animation quality, authored roots, game integration, gameplay, public, ZIP, FPS or device acceptance.',
  scriptSha256: hash(fs.readFileSync(fileURLToPath(import.meta.url))), protectedBefore: fingerprint(),
  runtimeApproved: false, highFrameApproved: false, publicPass: false,
  selfTests: [], screenshots: [], pageErrors: [], consoleErrors: [], failedRequests: [], externalRequests: [] };
const bounded = async (promise, name, ms = 15000) => { let timer; try {
  return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${name} timeout`)), ms); })]);
} finally { clearTimeout(timer); } };
function measure(data, width, frame, threshold) {
  const r = frame.visibleRect, s = frame.sourceRect; let visible = 0, guard = 0;
  for (let y = s.y; y < s.y + s.h; y++) for (let x = s.x; x < s.x + s.w; x++) {
    if (data[(y * width + x) * 4 + 3] <= threshold) continue;
    if (x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h) visible++; else guard++;
  }
  return { threshold, visible, guard };
}
function validateTable(t) {
  assert.equal(t.status, 'REVIEW'); assert.equal(t.runtimeApproved, false); assert.equal(t.highFrameApproved, false);
  assert.equal(t.scope, 'EVIDENCE_ONLY_NOT_A_RUNTIME_CONTRACT');
  assert.equal(t.pages.length, 2); assert.deepEqual(t.pages.map(p => p.id), ['v1', 'patch']);
  assert.equal(t.frames.length, 32); assert.equal(new Set(t.frames.map(f => f.rgbaSha256)).size, 32);
  const pageMap = Object.fromEntries(t.pages.map(p => [p.id, p]));
  assert.equal(pageMap.v1.standingReferenceHeight, 170); assert.equal(pageMap.patch.standingReferenceHeight, 443);
  assert.deepEqual(t.frames.filter(f => f.page === 'patch').map(f => f.index), [7, 30, 31]);
  for (const [state, [first, count]] of Object.entries(stateRanges)) {
    assert.deepEqual(t.states[state].frames, Array.from({ length: count }, (_, i) => first + i));
    assert.equal(t.states[state].previewLoop, state === 'idle' || state === 'move');
  }
  for (const [i, f] of t.frames.entries()) {
    assert.equal(f.index, i); const [start, count] = stateRanges[f.state]; assert.ok(i >= start && i < start + count); assert.equal(f.stateIndex, i - start);
    const p = pageMap[f.page], r = f.sourceRect, v = f.visibleRect; assert.ok(p);
    assert.ok([r.x, r.y, r.w, r.h].every(Number.isInteger)); assert.ok(r.w > 0 && r.h > 0);
    assert.ok(r.x >= 0 && r.y >= 0 && r.x + r.w <= p.width && r.y + r.h <= p.height);
    assert.deepEqual(r, { x: v.x - 2, y: v.y - 2, w: v.w + 4, h: v.h + 4 });
    assert.deepEqual(f.diagnosticPivot, { x: v.w / 2 + 2, y: v.h + 2, policy: 'VISIBLE_BBOX_BOTTOM_CENTER_UNAPPROVED' });
    assert.equal(f.standingReferenceHeight, p.standingReferenceHeight);
    assert.ok(f.measurements.every(m => m.visible > 0 && m.guard === 0));
  }
}
let browser, context, table;
try {
  assert.deepEqual(report.protectedBefore, baseline.protectedBefore, 'A protected source/runtime/ZIP changed');
  const { PNG } = createRequire(import.meta.url)(path.join(process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules'), 'pngjs'));
  const pages = baseline.sources.map(s => {
    const bytes = fs.readFileSync(path.join(root, s.file)), png = PNG.sync.read(bytes);
    assert.equal(hash(bytes), s.sha256); assert.equal(png.width, s.width); assert.equal(png.height, s.height);
    return { id: s.id, file: s.file, width: s.width, height: s.height, bytes: bytes.length, sha256: hash(bytes),
      standingReferenceHeight: s.referenceHeight, purpose: s.id === 'v1' ? 'Original29 unchanged regions, excluding7/30/31' : 'Existing local repair regions7/30/31 only',
      png, src: `data:image/png;base64,${bytes.toString('base64')}` };
  });
  table = { schema: 'xiyou-source-candidate-review/v1', id: 'tiger-vanguard-v1-with-three-frame-patch', generatedAt,
    status: 'REVIEW', scope: 'EVIDENCE_ONLY_NOT_A_RUNTIME_CONTRACT', runtimeApproved: false, highFrameApproved: false,
    intendedIdentity: 'tiger-vanguard only; never all elite+tiger, ordinary tiger, or a final Boss',
    pages: pages.map(({ png, src, ...p }) => p),
    scalePolicy: 'One standing-reference scale per page (v1:170, patch:443). No per-pose stretching, rotation or generated in-between frames.',
    rootPolicy: 'All32 use the SAME visible-bbox-bottom-center diagnostic policy. Do not mix earlier endpoint foot/shoulder measurements into unreviewed frames. These are explicitly not authored runtime pivots.',
    timingPolicy: '12 source poses/second for this preview only; not approved gameplay animation durations or display FPS.',
    states: Object.fromEntries(Object.entries(stateRanges).map(([state, [start, count]]) => [state, { frames: Array.from({ length: count }, (_, i) => start + i),
      previewLoop: state === 'idle' || state === 'move', previewEnd: state === 'death' ? 'hold-last-no-revival' : state === 'attack' || state === 'hit' ? 'return-idle0' : 'loop' }])),
    frames: [] };
  for (const original of inventory.candidates) {
    const replaced = Object.hasOwn(patches, original.index), page = pages.find(p => p.id === (replaced ? 'patch' : 'v1'));
    if (!replaced) assert.equal(original.isolationCandidate, true, 'Only the29 isolated v1 regions may be reused');
    const v = replaced ? patches[original.index] : original.rect;
    const pixels = Buffer.alloc(v.w * v.h * 4);
    for (let y = 0; y < v.h; y++) page.png.data.copy(pixels, y * v.w * 4, ((v.y + y) * page.width + v.x) * 4, ((v.y + y) * page.width + v.x + v.w) * 4);
    const rgbaSha256 = hash(pixels); if (!replaced) assert.equal(rgbaSha256, original.rgbaSha256);
    const f = { index: original.index, state: original.state, stateIndex: original.stateIndex, page: page.id,
      visibleRect: v, sourceRect: { x: v.x - 2, y: v.y - 2, w: v.w + 4, h: v.h + 4 }, rgbaSha256,
      standingReferenceHeight: page.standingReferenceHeight,
      diagnosticPivot: { x: v.w / 2 + 2, y: v.h + 2, policy: 'VISIBLE_BBOX_BOTTOM_CENTER_UNAPPROVED' } };
    f.measurements = [8, 16].map(t => measure(page.png.data, page.width, f, t));
    table.frames.push(f);
  }
  validateTable(table); report.selfTests.push('valid29+3 table,32 distinct source crops, expected state counts, whole-page scales and clear2px guards');
  for (const [name, mutate] of [
    ['runtime approval forbidden', t => { t.runtimeApproved = true; }],
    ['wrong replacement index rejected', t => { t.frames[6].page = 'patch'; }],
    ['duplicate crop pixels rejected', t => { t.frames[1].rgbaSha256 = t.frames[0].rgbaSha256; }],
    ['out-of-bounds crop rejected', t => { t.frames[0].sourceRect.x = -1; }],
    ['per-frame scaling rejected', t => { t.frames[0].standingReferenceHeight = 171; }],
    ['wrong state order rejected', t => { t.states.death.frames.reverse(); }],
    ['looping death rejected', t => { t.states.death.previewLoop = true; }]
  ]) { const bad = structuredClone(table); mutate(bad); assert.throws(() => validateTable(bad)); report.selfTests.push(name); }
  const refs = Object.keys(report.protectedBefore).filter(f => f.startsWith('prototype-2d/src/') || ['prototype-2d/native-app.js', 'prototype-2d/assets/manifest.json', 'scripts/serve.mjs', 'scripts/release.mjs', 'scripts/runtime-frame-contract.mjs'].includes(f));
  report.productionReferences = refs.filter(f => { const text = fs.readFileSync(path.join(root, f), 'utf8'); return table.pages.some(p => text.includes(path.basename(p.file)) || text.includes(p.sha256)) || text.includes(table.id); });
  assert.equal(report.productionReferences.length, 0);
  const tableFile = path.join(output, 'candidate-table.json'); fs.writeFileSync(tableFile, JSON.stringify(table, null, 2));
  report.candidateTable = { file: rel(tableFile), sha256: hash(fs.readFileSync(tableFile)), frames: 32, v1: 29, patch: 3,
    stateCounts: Object.fromEntries(Object.entries(table.states).map(([s, v]) => [s, v.frames.length])) };
  const pw = await loadPlaywright(); browser = await pw.chromium.launch(browserLaunchOptions()); report.browser = browser.version();
  // Native canvas capture avoids optional Playwright/host ffmpeg dependencies.
  // The earlier missing-ffmpeg failure remains in its timestamped report.
  context = await browser.newContext({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
  const page = await context.newPage(); page.setDefaultTimeout(15000);
  page.on('pageerror', e => report.pageErrors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
  page.on('requestfailed', r => report.failedRequests.push(r.url()));
  page.on('request', r => { if (/^https?:/.test(r.url())) report.externalRequests.push(r.url()); });
  await page.route('http://**/*', r => r.abort()); await page.route('https://**/*', r => r.abort());
  await page.setContent('<!doctype html><meta charset="utf-8"><title>虎先锋32姿态候选·REVIEW</title><style>body{margin:0;background:#eee6d1}canvas{display:block}</style><canvas width="1440" height="960"></canvas>');
  await page.addScriptTag({ content: `window.measureCandidate = ${measure.toString()};` });
  report.decode = await bounded(page.evaluate(async ({ pages, table }) => {
    const images = {}, sizes = {}, measurements = [];
    for (const p of pages) {
      const im = new Image(); im.src = p.src; await im.decode(); images[p.id] = im; sizes[p.id] = [im.naturalWidth, im.naturalHeight];
      const raw = document.createElement('canvas'); raw.width = im.naturalWidth; raw.height = im.naturalHeight;
      const rc = raw.getContext('2d', { willReadFrequently: true }); rc.drawImage(im, 0, 0); const data = rc.getImageData(0, 0, raw.width, raw.height).data;
      for (const f of table.frames.filter(f => f.page === p.id)) measurements.push({ index: f.index, values: [8, 16].map(t => window.measureCandidate(data, raw.width, f, t)) });
    }
    const canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d');
    const clear = (title, note) => { ctx.fillStyle = '#eee6d1'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#302c24'; ctx.font = 'bold 21px sans-serif'; ctx.fillText(title, 20, 32); ctx.font = '13px sans-serif'; ctx.fillText(note, 20, 58); };
    const paint = (f, x, y, height, facing = 1, target = ctx) => {
      const r = f.sourceRect, p = f.diagnosticPivot, scale = height / f.standingReferenceHeight;
      target.save(); target.translate(x, y); target.scale(scale * facing, scale); target.drawImage(images[f.page], r.x, r.y, r.w, r.h, -p.x, -p.y, r.w, r.h); target.restore();
    };
    window.fullCandidate = { table, canvas, ctx, clear, paint };
    return { sizes, measurements };
  }, { pages: pages.map(({ png, ...p }) => p), table }), 'decode');
  assert.deepEqual(report.decode.sizes, { v1: [1774, 887], patch: [2172, 724] });
  for (const f of table.frames) assert.deepEqual(report.decode.measurements.find(m => m.index === f.index).values, f.measurements);
  const shot = async name => { const file = path.join(output, `${name}.png`), bytes = await page.screenshot({ path: file }); report.screenshots.push({ file: rel(file), sha256: hash(bytes), bytes: bytes.length }); };
  report.contactSheets = [];
  for (const [height, facing] of [[64, 1], [48, 1], [64, -1], [48, -1]]) {
    report.contactSheets.push(await page.evaluate(({ height, facing }) => {
      const { table, ctx, clear, paint } = window.fullCandidate;
      clear(`原v1的29区 + 现补丁3区 · 全32源姿态 · ${height}px站姿参照 ${facing === 1 ? '右向' : '左向'}`, '每源固定170/443比例；所有帧统一采用未批准的包围盒底中心诊断点，未混用个别脚底点。非生产/高帧批准。');
      const scratch = document.createElement('canvas'); scratch.width = scratch.height = 160;
      const sc = scratch.getContext('2d', { willReadFrequently: true }), hashes = [];
      for (const f of table.frames) {
        const x = 14 + f.index % 8 * 177, y = 85 + Math.floor(f.index / 8) * 205;
        ctx.strokeStyle = '#c5bda7'; ctx.strokeRect(x, y, 170, 195); ctx.fillStyle = '#302c24'; ctx.font = '12px sans-serif'; ctx.fillText(`${f.page} ${f.state}[${f.stateIndex}] #${f.index}`, x + 5, y + 20);
        ctx.strokeStyle = '#a7b396'; ctx.beginPath(); ctx.moveTo(x + 5, y + 170); ctx.lineTo(x + 165, y + 170); ctx.stroke(); paint(f, x + 85, y + 170, height, facing);
        sc.clearRect(0, 0, 160, 160); paint(f, 80, 130, height, facing, sc); let code = 2166136261;
        for (const byte of sc.getImageData(0, 0, 160, 160).data) code = Math.imul(code ^ byte, 16777619);
        hashes.push({ index: f.index, signature: code >>> 0 });
      }
      return { height, facing, count: hashes.length, distinctRendered: new Set(hashes.map(h => h.signature)).size, hashes };
    }, { height, facing }));
    await shot(`contact-${height}-${facing === 1 ? 'right' : 'left'}`);
  }
  await page.evaluate(() => {
    const { table, ctx, clear, paint } = window.fullCandidate;
    clear('完整动作源序列 · 96px站姿参照 · 每行一种状态', 'idle8 / move8 / attack8 / hit4 / death4；条带用于观察姿势变化，不把临时包围盒锚点造成的漂移当源图缺陷。');
    Object.entries(table.states).forEach(([state, spec], row) => {
      const y = 236 + row * 168; ctx.fillStyle = '#302c24'; ctx.font = '13px sans-serif'; ctx.fillText(state, 10, y - 116);
      spec.frames.forEach((index, column) => { const f = table.frames[index], x = 120 + column * 174; paint(f, x, y, 96); ctx.fillStyle = '#302c24'; ctx.fillText(`${f.page} ${f.stateIndex}`, x - 37, y + 20); });
    });
  }); await shot('state-filmstrips-96');
  const recordedPlayback = await bounded(page.evaluate(() => new Promise((resolve, reject) => {
    const { table, canvas, ctx, clear, paint } = window.fullCandidate, states = Object.entries(table.states);
    const mimeType = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find(m => MediaRecorder.isTypeSupported(m));
    if (!mimeType || !canvas.captureStream) throw new Error('Native canvas video recording unavailable');
    const stream = canvas.captureStream(30), recorder = new MediaRecorder(stream, { mimeType }), chunks = [];
    let summary, aborted = false;
    recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    recorder.onerror = e => { aborted = true; stream.getTracks().forEach(t => t.stop()); reject(new Error(String(e.error || 'MediaRecorder failure'))); };
    recorder.onstop = async () => { try {
      stream.getTracks().forEach(t => t.stop());
      const bytes = new Uint8Array(await new Blob(chunks, { type: mimeType }).arrayBuffer()); let binary = '';
      for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
      resolve({ playback: summary, video: { mimeType, base64: btoa(binary), captureFramesPerSecond: 30, streamTracksStopped: stream.getTracks().every(t => t.readyState === 'ended') } });
    } catch (error) { reject(error); } };
    recorder.start();
    const seen = Object.fromEntries(states.map(([s]) => [s, new Set()])), transitions = [], last = {}; let start, rafSamples = 0;
    function tick(now) {
      if (aborted) return;
      start ??= now; const elapsedMs = now - start, slot = Math.floor(elapsedMs * 12 / 1000); rafSamples++;
      clear('全状态实时源预览 · 12源姿态/秒 · 已录制浏览器画面', '待机/移动循环；攻击/受击一次后回idle0；死亡一次后保持。所有根点仍未批准；录屏存在不等于人工动态质量通过。');
      states.forEach(([state, spec], col) => {
        let index;
        if (spec.previewLoop) index = spec.frames[slot % spec.frames.length];
        else index = slot < spec.frames.length ? spec.frames[slot] : state === 'death' ? spec.frames.at(-1) : 0;
        if (last[state] !== index) { transitions.push({ state, index, elapsedMs }); last[state] = index; }
        if (spec.frames.includes(index)) seen[state].add(index);
        ctx.fillStyle = '#302c24'; ctx.font = '16px sans-serif'; ctx.fillText(`${state} / #${index}`, 107 + col * 280, 105);
        for (const [row, h, facing] of [[0, 64, 1], [1, 48, 1], [2, 64, -1], [3, 48, -1]]) {
          const x = 157 + col * 280, y = 267 + row * 208; paint(table.frames[index], x, y, h, facing);
          ctx.fillStyle = '#302c24'; ctx.font = '12px sans-serif'; ctx.fillText(`${h}px ${facing === 1 ? '右' : '左'}`, x - 29, y + 25);
        }
      });
      if (elapsedMs >= 2200) { summary = { targetSourcePosesPerSecond: 12, elapsedMs, rafSamples, seen: Object.fromEntries(states.map(([s]) => [s, [...seen[s]].sort((a, b) => a - b)])), transitions, finalIndices: last, fpsAcceptance: false }; recorder.stop(); }
      else requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })), 'full-state playback', 10000);
  report.playback = recordedPlayback.playback;
  const videoBytes = Buffer.from(recordedPlayback.video.base64, 'base64'), videoFile = path.join(output, 'full-state-preview.webm');
  assert.ok(videoBytes.length > 0); assert.equal(videoBytes.subarray(0, 4).toString('hex'), '1a45dfa3', 'Not a WebM/EBML container');
  fs.writeFileSync(videoFile, videoBytes);
  report.recording = { file: rel(videoFile), bytes: videoBytes.length, sha256: hash(videoBytes), mimeType: recordedPlayback.video.mimeType,
    backend: 'Edge canvas.captureStream + MediaRecorder, no host ffmpeg', captureFramesPerSecond: recordedPlayback.video.captureFramesPerSecond,
    streamTracksStopped: recordedPlayback.video.streamTracksStopped, humanMotionReviewCompleted: false };
  await shot('playback-final-held-death');
  report.checks = { tableSelfTests: report.selfTests.length === 8, browserNodeAlphaAndGuardMeasurementsMatch: true, decodedSizesMatch: true,
    all32DistinctAtBothSizesAndFacings: report.contactSheets.every(s => s.count === 32 && s.distinctRendered === 32),
    allStatesTraversed: Object.entries(table.states).every(([s, spec]) => JSON.stringify(report.playback.seen[s]) === JSON.stringify(spec.frames)),
    oneShotStatesFinishCorrectly: report.playback.finalIndices.attack === 0 && report.playback.finalIndices.hit === 0 && report.playback.finalIndices.death === 31,
    noProductionReferences: report.productionReferences.length === 0,
    noErrorsOrNetwork: !report.pageErrors.length && !report.consoleErrors.length && !report.failedRequests.length && !report.externalRequests.length };
  report.result = Object.values(report.checks).every(Boolean) ? 'REVIEW_FULL32_CANDIDATE_PREVIEW_ONLY' : 'FAIL';
} catch (error) { report.error = String(error.stack || error); }
finally {
  if (context) try { await bounded(context.close(), 'context close'); report.contextClosed = true;
  } catch (error) { report.cleanupError = String(error); report.result = 'FAIL'; }
  if (browser) try { await bounded(browser.close(), 'browser close'); report.browserClosed = true; } catch (error) { report.cleanupError = String(error); report.result = 'FAIL'; }
  report.protectedAfter = fingerprint(); report.protectedUnchanged = JSON.stringify(report.protectedBefore) === JSON.stringify(report.protectedAfter);
  if (!report.protectedUnchanged) report.result = 'FAIL';
  report.finishedAt = new Date().toISOString(); fs.writeFileSync(path.join(output, 'browser.json'), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ file: rel(path.join(output, 'browser.json')), result: report.result, candidateTable: report.candidateTable,
  checks: report.checks, recording: report.recording, protectedUnchanged: report.protectedUnchanged, browserClosed: report.browserClosed, error: report.error }, null, 2));
if (report.result === 'FAIL') process.exitCode = 1;
