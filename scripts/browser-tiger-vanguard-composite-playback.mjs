import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

// Play locked recorded pixels once. No pose redraw, new game or recapture.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inputFile = 'evidence/current/tiger-vanguard/composite-preview/2026-10-14T00-56-08-837Z/browser.json';
const inputHash = '13612e911efa2a7c74f3d13129372715188082ac13137cddb053af2d8dde7839';
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const read = f => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const rel = f => path.relative(root, f).replaceAll('\\', '/');
const prior = read(inputFile);
const priorDir = path.posix.dirname(inputFile);
const expected = { ...prior.protectedAfter, [inputFile]: inputHash,
  'scripts/browser-tiger-vanguard-composite-preview.mjs': prior.scriptSha256,
  [prior.video.file]: prior.video.sha256,
  ...Object.fromEntries(prior.screenshots.map(s => [s.file, s.sha256])),
  ...Object.fromEntries(['review.md', 'handoff.json'].map(f => {
    const file = `${priorDir}/${f}`; return [file, hash(fs.readFileSync(path.join(root, file)))];
  })) };
const fingerprint = () => Object.fromEntries(Object.keys(expected).map(f => [f, hash(fs.readFileSync(path.join(root, f)))]));
const generatedAt = new Date().toISOString();
const output = path.join(root, 'evidence/current/tiger-vanguard/composite-playback', generatedAt.replaceAll(':', '-').replaceAll('.', '-'));
fs.mkdirSync(output, { recursive: true });
const report = { generatedAt, result: 'FAIL',
  scope: 'Single normal-rate continuous playback of immutable historical-frozen-background composite bytes; not new UI, natural gameplay, human motion-quality, runtime or FPS acceptance.',
  input: { file: inputFile, sha256: inputHash }, video: prior.video,
  sourceDrawingLogOnly: { indices: prior.capture.sourceLogSeenIndices, timeline: prior.capture.timeline,
    actionMs: prior.capture.actionMs, fixtureReviewHoldMs: prior.capture.fixtureHoldMs },
  newGameInstance: false, realUiEntryThisRun: false, syntheticTimeline: true, pseudoHealthBar: true,
  recordingIncludesHistoricalFrozenBackground: true, observerMayAffectPresentation: true,
  humanMotionReviewed: false, rootApproved: false, runtimeApproved: false, highFrameApproved: false,
  fpsAcceptance: false, publicPass: false, releaseReady: false, serverStarted: false,
  scriptSha256: hash(fs.readFileSync(fileURLToPath(import.meta.url))),
  protectedBefore: fingerprint(), pageErrors: [], consoleErrors: [], failedRequests: [], externalRequests: [], screenshots: [] };
const bounded = async (promise, name, ms = 15000) => {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${name} timeout`)), ms); })]); }
  finally { clearTimeout(timer); }
};
let browser, context;
try {
  assert.deepEqual(report.protectedBefore, expected);
  assert.equal(prior.result, 'REVIEW_FROZEN_BITMAP_FULL32_COMPOSITE');
  assert.deepEqual(prior.capture.sourceLogSeenIndices, Array.from({ length: 32 }, (_, i) => i));
  const bytes = fs.readFileSync(path.join(root, prior.video.file));
  assert.equal(bytes.length, prior.video.bytes); assert.equal(hash(bytes), prior.video.sha256);
  const pw = await loadPlaywright(); browser = await pw.chromium.launch(browserLaunchOptions()); report.browser = browser.version();
  context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on('pageerror', e => report.pageErrors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
  page.on('requestfailed', r => report.failedRequests.push({ url: r.url(), error: r.failure()?.errorText }));
  page.on('request', r => { if (/^https?:/.test(r.url())) report.externalRequests.push(r.url()); });
  await page.route('http://**/*', r => r.abort()); await page.route('https://**/*', r => r.abort());
  await page.setContent('<!doctype html><meta charset="utf-8"><title>Locked composite playback · REVIEW</title><style>body{margin:0}video{display:block;width:390px;height:844px}</style>');
  const played = await bounded(page.evaluate(async ({ base64, mimeType, backgroundMean }) => {
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const url = URL.createObjectURL(new Blob([bytes], { type: mimeType }));
    const video = document.createElement('video'); video.muted = true; video.playsInline = true; video.playbackRate = 1; document.body.appendChild(video);
    const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d', { willReadFrequently: true });
    const labelRoi = { x: 182, y: 260, width: 200, height: 72 };
    const spriteRoi = { x: 158, y: 332, width: 225, height: 175 };
    const backgroundRoi = { x: 80, y: 540, width: 24, height: 24 };
    const crop = document.createElement('canvas'); crop.width = 225; crop.height = 247; const cc = crop.getContext('2d');
    const frames = [], events = [];
    for (const name of ['loadeddata', 'playing', 'waiting', 'stalled', 'seeking', 'seeked', 'ended', 'error']) {
      video.addEventListener(name, () => events.push({ name, wallTime: performance.now(), currentTime: video.currentTime, readyState: video.readyState }));
    }
    const once = (name, ms) => new Promise((resolve, reject) => {
      const finish = error => { clearTimeout(timer); video.removeEventListener(name, ok); video.removeEventListener('error', bad); error ? reject(error) : resolve(); };
      const ok = () => finish(), bad = () => finish(new Error(`Video error ${video.error?.code}`));
      const timer = setTimeout(() => finish(new Error(`Video ${name} timeout`)), ms);
      video.addEventListener(name, ok, { once: true }); video.addEventListener('error', bad, { once: true });
    });
    const signature = data => { let code = 2166136261; for (const b of data) code = Math.imul(code ^ b, 16777619); return code >>> 0; };
    const capture = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(video, 0, 0);
      cc.clearRect(0, 0, crop.width, crop.height);
      cc.drawImage(canvas, labelRoi.x, labelRoi.y, labelRoi.width, labelRoi.height, 0, 0, labelRoi.width, labelRoi.height);
      cc.drawImage(canvas, spriteRoi.x, spriteRoi.y, spriteRoi.width, spriteRoi.height, 0, 72, spriteRoi.width, spriteRoi.height);
      const data = ctx.getImageData(backgroundRoi.x, backgroundRoi.y, backgroundRoi.width, backgroundRoi.height).data;
      const mean = [0, 0, 0]; for (let i = 0; i < data.length; i += 4) for (let c = 0; c < 3; c++) mean[c] += data[i + c];
      const rgb = mean.map(v => v / (data.length / 4));
      return { pngBase64: crop.toDataURL('image/png').split(',')[1],
        labelSignature: signature(ctx.getImageData(labelRoi.x, labelRoi.y, labelRoi.width, labelRoi.height).data),
        spriteSignature: signature(ctx.getImageData(spriteRoi.x, spriteRoi.y, spriteRoi.width, spriteRoi.height).data),
        backgroundRoiMeanRgb: rgb, maxBackgroundChannelDeviation: Math.max(...rgb.map((v, i) => Math.abs(v - backgroundMean[i]))) };
    };
    let callback;
    try {
      const loaded = once('loadeddata', 5000); video.src = url; await loaded;
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      const before = { currentTime: video.currentTime, paused: video.paused, ended: video.ended, playbackRate: video.playbackRate };
      const preplay = { kind: 'loadeddata-not-presented-callback', currentTime: video.currentTime, ...capture() };
      const observe = (now, metadata) => {
        callback = undefined;
        frames.push({ sequence: frames.length, callbackWallTime: now, mediaTime: metadata.mediaTime,
          presentedFrames: metadata.presentedFrames, presentationTime: metadata.presentationTime,
          expectedDisplayTime: metadata.expectedDisplayTime, ...capture() });
        if (!video.ended) callback = video.requestVideoFrameCallback(observe);
      };
      const ended = once('ended', 10000), start = performance.now();
      callback = video.requestVideoFrameCallback(observe); await video.play(); await ended;
      const playbackWallMs = performance.now() - start;
      if (callback !== undefined) { video.cancelVideoFrameCallback(callback); callback = undefined; }
      const after = { currentTime: video.currentTime, paused: video.paused, ended: video.ended, readyState: video.readyState };
      const sheets = [];
      // Contact sheets contain only actual recorded label/sprite pixels at 1:1.
      for (let startIndex = 0; startIndex < frames.length; startIndex += 30) {
        const batch = frames.slice(startIndex, startIndex + 30), sheet = document.createElement('canvas');
        sheet.width = 1250; sheet.height = 50 + Math.ceil(batch.length / 5) * 282;
        const sc = sheet.getContext('2d'); sc.fillStyle = '#eee6d1'; sc.fillRect(0, 0, sheet.width, sheet.height);
        sc.fillStyle = '#302c24'; sc.font = 'bold 15px sans-serif';
        sc.fillText('ACTUAL PRESENTED RECORDED PIXELS / HISTORICAL FROZEN COMPOSITE / REVIEW / NO FPS', 8, 22);
        sc.font = '12px sans-serif'; sc.fillText('Caption: callback sequence + actual mediaTime; burned labels are not automatic sprite identity.', 8, 40);
        for (const [i, frame] of batch.entries()) {
          const image = new Image(); image.src = `data:image/png;base64,${frame.pngBase64}`; await image.decode();
          const x = 8 + i % 5 * 250, y = 50 + Math.floor(i / 5) * 282;
          sc.fillStyle = '#302c24'; sc.font = '12px sans-serif'; sc.fillText(`cb#${frame.sequence} media=${frame.mediaTime.toFixed(3)}s`, x, y + 14);
          sc.drawImage(image, x, y + 24); image.src = '';
        }
        sheets.push({ firstCallback: batch[0].sequence, lastCallback: batch.at(-1).sequence, width: sheet.width, height: sheet.height,
          pngBase64: sheet.toDataURL('image/png').split(',')[1] });
      }
      return { width: video.videoWidth, height: video.videoHeight,
        durationReported: Number.isFinite(video.duration) ? video.duration : String(video.duration),
        before, after, preplay, playbackWallMs, events, frames, sheets, labelRoi, spriteRoi, backgroundRoi,
        samplerClearedPerCallback: true, noSeeking: !events.some(e => e.name === 'seeking' || e.name === 'seeked'),
        continuousPlaybackEnded: after.ended, callbackCountNotFps: frames.length,
        firstObservedMediaTime: frames[0]?.mediaTime, lastObservedMediaTime: frames.at(-1)?.mediaTime,
        maxObservedMediaGapSeconds: Math.max(0, ...frames.slice(1).map((f, i) => f.mediaTime - frames[i].mediaTime)),
        burnedLabelsAutomaticallyRecognized: false, spritePixelIdentityRecognitionPerformed: false,
        allEncodedFramesObservedApproved: false, zeroDroppedFramesApproved: false };
    } finally {
      if (callback !== undefined) video.cancelVideoFrameCallback(callback);
      video.pause(); video.removeAttribute('src'); video.load(); video.remove(); URL.revokeObjectURL(url);
    }
  }, { base64: bytes.toString('base64'), mimeType: prior.video.mimeType,
    backgroundMean: prior.capture.recordingDecode.backgroundRoiMeanRgb }), 'continuous immutable composite playback', 25000);
  const savePng = (sample, name, kind) => {
    const bytes = Buffer.from(sample.pngBase64, 'base64'); delete sample.pngBase64;
    const file = path.join(output, name); fs.writeFileSync(file, bytes);
    sample.snapshot = { file: rel(file), bytes: bytes.length, sha256: hash(bytes), kind }; report.screenshots.push(sample.snapshot);
  };
  savePng(played.preplay, 'loadeddata-roi.png', 'actual-decoded-preplay-label-and-sprite-native-roi');
  for (const frame of played.frames) savePng(frame, `presented-${String(frame.sequence).padStart(3, '0')}.png`, 'actual-presented-recorded-label-and-sprite-native-roi');
  for (const [i, sheet] of played.sheets.entries()) savePng(sheet, `contact-sheet-${i}.png`, 'actual-presented-native-roi-contact-sheet');
  report.playback = played;
  assert.equal(played.width, 390); assert.equal(played.height, 844);
  assert.equal(played.before.currentTime, 0); assert.equal(played.before.playbackRate, 1);
  assert.equal(played.after.ended, true); assert.equal(played.noSeeking, true); assert.ok(played.frames.length > 0);
  assert.ok(played.events.some(e => e.name === 'playing')); assert.ok(played.events.some(e => e.name === 'ended'));
  for (let i = 1; i < played.frames.length; i++) assert.ok(played.frames[i].mediaTime > played.frames[i - 1].mediaTime);
  assert.ok(played.frames.every(f => f.maxBackgroundChannelDeviation < 15));
  report.checks = { exactImmutableRecording: true, normalRateNoSeekRealEnded: true, monotonicObservedMediaTimes: true,
    nativeRecordedPixelsSavedPerObservedCallback: true, samplerCleared: true, historicalBackgroundRoiPresent: true,
    noErrorsOrExternalNetwork: !report.pageErrors.length && !report.consoleErrors.length && !report.failedRequests.length && !report.externalRequests.length };
  report.result = Object.values(report.checks).every(Boolean) ? 'REVIEW_FROZEN_COMPOSITE_CONTINUOUS_PLAYBACK' : 'FAIL';
} catch (error) { report.error = String(error.stack || error); }
finally {
  if (context) try { await bounded(context.close(), 'context close'); report.contextClosed = true; } catch (e) { report.cleanupError = String(e); report.result = 'FAIL'; }
  if (browser) try { await bounded(browser.close(), 'browser close'); report.browserClosed = true; } catch (e) { report.cleanupError = String(e); report.result = 'FAIL'; }
  report.protectedAfter = fingerprint(); report.protectedUnchanged = JSON.stringify(report.protectedBefore) === JSON.stringify(report.protectedAfter);
  if (!report.protectedUnchanged) report.result = 'FAIL';
  report.finishedAt = new Date().toISOString(); fs.writeFileSync(path.join(output, 'browser.json'), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ file: rel(path.join(output, 'browser.json')), result: report.result, checks: report.checks,
  callbacks: report.playback?.frames.length, firstMediaTime: report.playback?.firstObservedMediaTime,
  lastMediaTime: report.playback?.lastObservedMediaTime, maxObservedGap: report.playback?.maxObservedMediaGapSeconds,
  sheets: report.playback?.sheets.map(s => s.snapshot.file), protectedUnchanged: report.protectedUnchanged,
  browserClosed: report.browserClosed, error: report.error }, null, 2));
if (report.result === 'FAIL') process.exitCode = 1;
