import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

// Evidence-only compositor: a locked historical scene PNG plus existing poses.
// No new game instance, runtime adapter, image generation or performance claim.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const priorFile = 'evidence/current/tiger-vanguard/incontext-dynamic/2026-10-13T15-47-17-378Z/browser.json';
const playbackFile = 'evidence/current/tiger-vanguard/incontext-playback/2026-10-14T00-47-59-083Z/browser.json';
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const read = f => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const rel = f => path.relative(root, f).replaceAll('\\', '/');
const prior = read(priorFile), previous = read(playbackFile);
const background = prior.screenshots.find(s => s.kind === 'underlying-paused-game');
const candidate = read(prior.candidate.file), motion = read(prior.motionDraft.file);
const expected = { ...previous.protectedAfter,
  [playbackFile]: '2340abd01070646d4885e637b8cb735023539806fb9badf1dac56984a2d3856c',
  'scripts/browser-tiger-vanguard-recording-playback.mjs': previous.scriptSha256 };
const fingerprint = () => Object.fromEntries(Object.keys(expected).map(f => [f, hash(fs.readFileSync(path.join(root, f)))]));
const generatedAt = new Date().toISOString();
const output = path.join(root, 'evidence/current/tiger-vanguard/composite-preview', generatedAt.replaceAll(':', '-').replaceAll('.', '-'));
fs.mkdirSync(output, { recursive: true });
const report = { generatedAt, result: 'FAIL',
  scope: 'Historical frozen scene PNG + existing candidate poses in an evidence-only compositor. NOT a new runtime scene, natural battle, FPS or public acceptance.',
  priorUiEvidence: { file: priorFile, generatedAt: prior.generatedAt, scene: prior.sceneBeforeOverlay },
  background, candidate: prior.candidate, motionDraft: prior.motionDraft,
  newGameInstance: false, realUiEntryThisRun: false, recordingIncludesFrozenBackground: true,
  syntheticTimeline: true, pseudoHealthBar: true, fixedScreenAnchor: { x: 276, ground: 474, standingReferencePixels: 86 },
  humanMotionReviewed: false, rootApproved: false, runtimeApproved: false, highFrameApproved: false,
  fpsAcceptance: false, publicPass: false, releaseReady: false, serverStarted: false,
  scriptSha256: hash(fs.readFileSync(fileURLToPath(import.meta.url))),
  protectedBefore: fingerprint(), runtimeReferences: [], pageErrors: [], consoleErrors: [], failedRequests: [], externalRequests: [], screenshots: [] };
const bounded = async (promise, name, ms = 15000) => {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${name} timeout`)), ms); })]); }
  finally { clearTimeout(timer); }
};
let browser, context;
try {
  assert.deepEqual(report.protectedBefore, expected);
  const backgroundBytes = fs.readFileSync(path.join(root, background.file));
  assert.equal(backgroundBytes.length, background.bytes); assert.equal(hash(backgroundBytes), background.sha256);
  assert.equal(hash(fs.readFileSync(path.join(root, prior.candidate.file))), prior.candidate.sha256);
  assert.equal(hash(fs.readFileSync(path.join(root, prior.motionDraft.file))), prior.motionDraft.sha256);
  const pages = candidate.pages.map(p => {
    const bytes = fs.readFileSync(path.join(root, p.file)); assert.equal(hash(bytes), p.sha256);
    return { ...p, src: `data:image/png;base64,${bytes.toString('base64')}` };
  });
  const runtimeFiles = [
    ...fs.readdirSync(path.join(root, 'prototype-2d/src')).filter(f => f.endsWith('.js')).map(f => `prototype-2d/src/${f}`),
    'prototype-2d/native-app.js', 'prototype-2d/assets/manifest.json', 'scripts/serve.mjs', 'scripts/release.mjs',
  ];
  const names = [prior.candidate.file, prior.motionDraft.file, ...candidate.pages.map(p => p.file)];
  report.runtimeReferences = runtimeFiles.flatMap(file => {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    return names.filter(n => text.includes(n) || text.includes(path.basename(n))).map(n => ({ file, name: n }));
  });
  assert.equal(report.runtimeReferences.length, 0);
  const pw = await loadPlaywright(); browser = await pw.chromium.launch(browserLaunchOptions()); report.browser = browser.version();
  context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on('pageerror', e => report.pageErrors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
  page.on('requestfailed', r => report.failedRequests.push({ url: r.url(), error: r.failure()?.errorText }));
  page.on('request', r => { if (/^https?:/.test(r.url())) report.externalRequests.push(r.url()); });
  await page.route('http://**/*', r => r.abort()); await page.route('https://**/*', r => r.abort());
  await page.setContent('<!doctype html><meta charset="utf-8"><title>Historical scene composite · REVIEW</title><style>body{margin:0}canvas{display:block}</style><canvas width="390" height="844"></canvas>');
  const capture = await bounded(page.evaluate(async ({ baseSrc, pages, candidate, motion }) => {
    const base = new Image(); base.src = baseSrc; await base.decode();
    const images = {}, decodedSources = {};
    for (const p of pages) { const im = new Image(); im.src = p.src; await im.decode(); images[p.id] = im; decodedSources[p.id] = [im.naturalWidth, im.naturalHeight]; }
    const canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d', { willReadFrequently: true });
    const timeline = [ { state: 'idle', durationMs: 1000, facing: 1 }, { state: 'move', durationMs: 700, facing: 1 },
      { state: 'attack', durationMs: 500, facing: 1 }, { state: 'hit', durationMs: 250, facing: -1 }, { state: 'death', durationMs: 400, facing: 1 } ];
    const actionMs = 2850, fixtureHoldMs = 250, totalMs = actionMs + fixtureHoldMs;
    const choose = elapsed => {
      if (elapsed >= actionMs) return { state: 'death', index: 31, facing: 1, heldForReviewOnly: true };
      let local = Math.max(0, elapsed);
      for (const segment of timeline) {
        if (local < segment.durationMs) {
          const spec = motion.states[segment.state];
          const slot = spec.loop ? Math.floor(local / 1000 * spec.sourcePosesPerSecond) % spec.frames.length : Math.min(spec.frames.length - 1, Math.floor(local / 1000 * spec.sourcePosesPerSecond));
          return { state: segment.state, index: spec.frames[slot], facing: segment.facing, heldForReviewOnly: false };
        }
        local -= segment.durationMs;
      }
      throw new Error('Composite timeline missing pose');
    };
    const draw = (pose, elapsed) => {
      // Opaque base redraw removes old frame pixels before every composite draw.
      ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(base, 0, 0);
      ctx.fillStyle = '#2a1729'; ctx.fillRect(0, 0, 390, 24); ctx.fillStyle = '#ffe6b5'; ctx.font = 'bold 10px sans-serif';
      ctx.fillText('EVIDENCE ONLY / HISTORICAL FROZEN PNG / NOT RUNTIME', 6, 16);
      ctx.fillStyle = 'rgba(16,11,20,.8)'; ctx.fillRect(182, 260, 200, 72); ctx.fillStyle = '#f9e8b1'; ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`候选合成 ${pose.state} #${pose.index} ${pose.heldForReviewOnly ? '审查保持' : ''}`, 189, 280);
      ctx.fillText(`t=${Math.round(elapsed)}ms · ${pose.facing < 0 ? '左' : '右'}向`, 189, 298);
      ctx.fillText('固定点 / 伪血条 / 非实时战斗', 189, 316);
      const x = 276, ground = 474;
      ctx.strokeStyle = '#e7d79c'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 68, ground); ctx.lineTo(x + 68, ground); ctx.stroke();
      ctx.strokeStyle = '#d7b45f'; ctx.beginPath(); ctx.moveTo(x, ground - 102); ctx.lineTo(x, ground + 8); ctx.stroke();
      ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(x - 44, ground - 116, 88, 6); ctx.fillStyle = '#82dc6a'; ctx.fillRect(x - 44, ground - 116, 72, 6);
      const f = candidate.frames[pose.index], m = motion.frames[pose.index], scale = 86 / f.standingReferenceHeight, r = f.sourceRect;
      ctx.save(); ctx.translate(x, ground); ctx.scale(pose.facing, 1);
      ctx.drawImage(images[f.page], r.x, r.y, r.w, r.h, -m.pivot.x * scale, -m.pivot.y * scale, r.w * scale, r.h * scale); ctx.restore();
    };
    const baseRoi = { x: 80, y: 540, width: 24, height: 24 };
    const meanRgb = pixels => { const out = [0, 0, 0]; for (let i = 0; i < pixels.length; i += 4) for (let c = 0; c < 3; c++) out[c] += pixels[i + c]; return out.map(v => v / (pixels.length / 4)); };
    ctx.drawImage(base, 0, 0); const backgroundRoiMeanRgb = meanRgb(ctx.getImageData(baseRoi.x, baseRoi.y, baseRoi.width, baseRoi.height).data);
    draw(choose(0), 0);
    const stream = canvas.captureStream(30), mimeType = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8'].find(m => MediaRecorder.isTypeSupported(m));
    if (!mimeType) { stream.getTracks().forEach(t => t.stop()); throw new Error('Native WebM unavailable'); }
    const recorder = new MediaRecorder(stream, { mimeType }), chunks = [], ticks = [], seen = new Set(), snapshots = [], wanted = new Set([0, 7, 13, 19, 25, 31]);
    let start, callback;
    try {
      const recorded = await new Promise((resolve, reject) => {
        recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
        recorder.onerror = e => reject(new Error(String(e.error)));
        recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
        recorder.start();
        const tick = now => {
          start ??= now; const elapsed = now - start, pose = choose(elapsed); draw(pose, elapsed); seen.add(pose.index);
          ticks.push({ elapsedMs: elapsed, ...pose });
          if (wanted.delete(pose.index)) snapshots.push({ ...pose, elapsedMs: elapsed, pngBase64: canvas.toDataURL('image/png').split(',')[1] });
          if (elapsed >= totalMs) { recorder.stop(); stream.getTracks().forEach(t => t.stop()); return; }
          callback = requestAnimationFrame(tick);
        };
        callback = requestAnimationFrame(tick);
      });
      const videoBytes = new Uint8Array(await recorded.arrayBuffer()); let binary = '';
      for (let i = 0; i < videoBytes.length; i += 8192) binary += String.fromCharCode(...videoBytes.subarray(i, i + 8192));
      const video = document.createElement('video'); video.muted = true; video.playsInline = true; document.body.appendChild(video);
      const url = URL.createObjectURL(recorded), decodedSamples = [];
      const once = name => new Promise((resolve, reject) => {
        const finish = error => { clearTimeout(timer); video.removeEventListener(name, ok); video.removeEventListener('error', bad); error ? reject(error) : resolve(); };
        const ok = () => finish(), bad = () => finish(new Error(`Recorded video error ${video.error?.code}`));
        const timer = setTimeout(() => finish(new Error(`Recorded video ${name} timeout`)), 5000);
        video.addEventListener(name, ok, { once: true }); video.addEventListener('error', bad, { once: true });
      });
      try {
        const loaded = once('loadeddata'); video.src = url; await loaded;
        const sampleCanvas = document.createElement('canvas'); sampleCanvas.width = video.videoWidth; sampleCanvas.height = video.videoHeight;
        const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
        for (const time of [.10, .925, 1.45, 1.95, 2.35, 2.775, 3.05]) {
          const seeked = once('seeked'); video.currentTime = time; await seeked;
          sampleCtx.clearRect(0, 0, sampleCanvas.width, sampleCanvas.height); sampleCtx.drawImage(video, 0, 0);
          const rgb = meanRgb(sampleCtx.getImageData(baseRoi.x, baseRoi.y, baseRoi.width, baseRoi.height).data);
          decodedSamples.push({ requestedTime: time, playheadAfterSeek: video.currentTime, backgroundRoiMeanRgb: rgb,
            maxBackgroundChannelDeviation: Math.max(...rgb.map((v, i) => Math.abs(v - backgroundRoiMeanRgb[i]))),
            pngBase64: sampleCanvas.toDataURL('image/png').split(',')[1] });
        }
        return { baseDecodedDimensions: [base.naturalWidth, base.naturalHeight], decodedSources, timeline, actionMs, fixtureHoldMs, totalMs,
          sourceLogSeenIndices: [...seen].sort((a, b) => a - b), ticks, snapshots, base64: btoa(binary), mimeType,
          requestedCaptureRateNotFps: 30, tracksStopped: stream.getTracks().every(t => t.readyState === 'ended'),
          recordingDecode: { width: video.videoWidth, height: video.videoHeight, durationReported: Number.isFinite(video.duration) ? video.duration : String(video.duration),
            backgroundRoi: baseRoi, backgroundRoiMeanRgb, samples: decodedSamples, sampledFromActualRecording: true, samplerClearedPerSample: true } };
      } finally { video.pause(); video.removeAttribute('src'); video.load(); video.remove(); URL.revokeObjectURL(url); }
    } finally { if (callback !== undefined) cancelAnimationFrame(callback); if (recorder.state !== 'inactive') recorder.stop(); stream.getTracks().forEach(t => t.stop()); }
  }, { baseSrc: `data:image/png;base64,${backgroundBytes.toString('base64')}`, pages, candidate, motion }), 'composite capture and actual recording decode', 30000);
  assert.deepEqual(capture.baseDecodedDimensions, [390, 844]);
  assert.deepEqual(capture.sourceLogSeenIndices, Array.from({ length: 32 }, (_, i) => i));
  assert.deepEqual(capture.decodedSources, Object.fromEntries(candidate.pages.map(p => [p.id, [p.width, p.height]])));
  assert.equal(capture.tracksStopped, true);
  assert.equal(capture.recordingDecode.width, 390); assert.equal(capture.recordingDecode.height, 844);
  for (const [kind, samples] of [['fixture', capture.snapshots], ['decoded', capture.recordingDecode.samples]]) {
    for (const [i, sample] of samples.entries()) {
      const bytes = Buffer.from(sample.pngBase64, 'base64'); delete sample.pngBase64;
      const file = path.join(output, `${kind}-${kind === 'fixture' ? sample.index : i}.png`); fs.writeFileSync(file, bytes);
      sample.snapshot = { file: rel(file), bytes: bytes.length, sha256: hash(bytes), kind: `${kind}-historical-bitmap-plus-candidate` }; report.screenshots.push(sample.snapshot);
    }
  }
  assert.ok(capture.recordingDecode.samples.every(s => s.maxBackgroundChannelDeviation < 15));
  const videoBytes = Buffer.from(capture.base64, 'base64'); delete capture.base64;
  assert.equal(videoBytes.subarray(0, 4).toString('hex'), '1a45dfa3');
  const videoFile = path.join(output, 'frozen-scene-full32-composite.webm'); fs.writeFileSync(videoFile, videoBytes);
  report.video = { file: rel(videoFile), bytes: videoBytes.length, sha256: hash(videoBytes), mimeType: capture.mimeType, includesHistoricalFrozenBackground: true };
  report.capture = capture;
  report.checks = { originalInputsUnchanged: true, all32SourceIndicesDrawnInFixture: true, fullIdleCycleDrawn: true,
    actualWebmDecodedWithBackgroundRoi: true, samplerCleared: true, tracksStopped: true,
    noErrorsOrExternalNetwork: !report.pageErrors.length && !report.consoleErrors.length && !report.failedRequests.length && !report.externalRequests.length };
  report.result = Object.values(report.checks).every(Boolean) ? 'REVIEW_FROZEN_BITMAP_FULL32_COMPOSITE' : 'FAIL';
} catch (error) { report.error = String(error.stack || error); }
finally {
  if (context) try { await bounded(context.close(), 'context close'); report.contextClosed = true; } catch (e) { report.cleanupError = String(e); report.result = 'FAIL'; }
  if (browser) try { await bounded(browser.close(), 'browser close'); report.browserClosed = true; } catch (e) { report.cleanupError = String(e); report.result = 'FAIL'; }
  report.protectedAfter = fingerprint(); report.protectedUnchanged = JSON.stringify(report.protectedBefore) === JSON.stringify(report.protectedAfter);
  if (!report.protectedUnchanged) report.result = 'FAIL';
  report.finishedAt = new Date().toISOString(); fs.writeFileSync(path.join(output, 'browser.json'), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ file: rel(path.join(output, 'browser.json')), result: report.result, checks: report.checks, video: report.video,
  seen: report.capture?.sourceLogSeenIndices, protectedUnchanged: report.protectedUnchanged, browserClosed: report.browserClosed, error: report.error }, null, 2));
if (report.result === 'FAIL') process.exitCode = 1;
