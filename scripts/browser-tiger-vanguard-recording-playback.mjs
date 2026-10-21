import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

// Continuous playback of existing recorded pixels, never fresh candidate drawing.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const decodeFile = 'evidence/current/tiger-vanguard/incontext-decode/2026-10-14T00-39-29-649Z/browser.json';
const decodeHash = '583ad3a56b2762cf6f82bc73990f9e99daaed96e84ecedb9ac9a2f3862551929';
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const read = f => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const rel = f => path.relative(root, f).replaceAll('\\', '/');
const decode = read(decodeFile), prior = read(decode.inputReport.file);
const expected = { ...decode.protectedAfter, [decodeFile]: decodeHash,
  ...Object.fromEntries(decode.screenshots.map(s => [s.file, s.sha256])),
  'scripts/browser-tiger-vanguard-incontext-decode.mjs': decode.scriptSha256 };
const fingerprint = () => Object.fromEntries(Object.keys(expected).map(f => [f, hash(fs.readFileSync(path.join(root, f)))]));
const targets = [];
// Only one target per source-log pose. These are schedule estimates, not decoded
// pose identification; encoded mediaTime and source RAF clocks can be offset.
for (const tick of prior.playback.ticks) {
  let target = targets.find(t => t.index === tick.index);
  if (!target) { target = { index: tick.index, state: tick.state, facing: tick.facing, firstMs: tick.elapsedMs, lastMs: tick.elapsedMs }; targets.push(target); }
  else if (targets.at(-1) === target) target.lastMs = tick.elapsedMs;
}
for (const target of targets) target.time = (target.firstMs + target.lastMs) / 2000;
const generatedAt = new Date().toISOString();
const output = path.join(root, 'evidence/current/tiger-vanguard/incontext-playback', generatedAt.replaceAll(':', '-').replaceAll('.', '-'));
fs.mkdirSync(output, { recursive: true });
const report = { generatedAt, result: 'FAIL',
  scope: 'Continuous real-Edge playback of immutable overlay-only recording; not human motion-quality, game simulation or FPS acceptance.',
  inputDecode: { file: decodeFile, sha256: hash(fs.readFileSync(path.join(root, decodeFile))) },
  video: decode.video, sourceLogTargets: targets,
  recordingIncludesUnderlyingGame: false, codecPlaybackOnly: true, observerMayAffectPresentation: true,
  humanMotionReviewed: false, runtimeApproved: false, highFrameApproved: false, fpsAcceptance: false,
  publicPass: false, releaseReady: false, serverStarted: false,
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
  assert.equal(decode.result, 'REVIEW_RECORDED_OVERLAY_DECODE_ONLY');
  assert.equal(targets.length, 30);
  assert.deepEqual(Array.from({ length: 32 }, (_, i) => i).filter(i => !targets.some(t => t.index === i)), [6, 7]);
  const bytes = fs.readFileSync(path.join(root, decode.video.file));
  assert.equal(bytes.length, decode.video.bytes); assert.equal(hash(bytes), decode.video.sha256);
  const pw = await loadPlaywright(); browser = await pw.chromium.launch(browserLaunchOptions()); report.browser = browser.version();
  context = await browser.newContext({ viewport: { width: 1360, height: 1060 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on('pageerror', e => report.pageErrors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
  page.on('requestfailed', r => report.failedRequests.push({ url: r.url(), error: r.failure()?.errorText }));
  page.on('request', r => { if (/^https?:/.test(r.url())) report.externalRequests.push(r.url()); });
  await page.route('http://**/*', r => r.abort()); await page.route('https://**/*', r => r.abort());
  await page.setContent('<!doctype html><meta charset="utf-8"><title>Existing overlay playback · REVIEW</title><style>body{margin:0;background:#eee6d1}canvas{display:block}video{position:absolute;left:0;top:0;width:390px;height:844px}</style><canvas width="1360" height="1060"></canvas>');
  const played = await bounded(page.evaluate(async ({ base64, mimeType, targets }) => {
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const url = URL.createObjectURL(new Blob([bytes], { type: mimeType }));
    const video = document.createElement('video'); video.muted = true; video.playsInline = true; video.playbackRate = 1; document.body.appendChild(video);
    const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d', { willReadFrequently: true });
    const roi = { x: 158, y: 332, width: 225, height: 175, excludesTimeLabel: true };
    const crop = document.createElement('canvas'); crop.width = roi.width; crop.height = roi.height; const cropCtx = crop.getContext('2d');
    const events = [], frames = [], selected = targets.map(target => ({ target, distance: Infinity }));
    const mark = name => events.push({ name, wallTime: performance.now(), currentTime: video.currentTime, readyState: video.readyState });
    for (const name of ['loadeddata', 'playing', 'waiting', 'stalled', 'ended', 'error']) video.addEventListener(name, () => mark(name));
    const once = (name, ms) => new Promise((resolve, reject) => {
      const finish = error => { clearTimeout(timer); video.removeEventListener(name, ok); video.removeEventListener('error', bad); error ? reject(error) : resolve(); };
      const ok = () => finish(), bad = () => finish(new Error(`Video error ${video.error?.code}`));
      const timer = setTimeout(() => finish(new Error(`Video ${name} timeout`)), ms);
      video.addEventListener(name, ok, { once: true }); video.addEventListener('error', bad, { once: true });
    });
    const signature = pixels => { let code = 2166136261; for (const b of pixels) code = Math.imul(code ^ b, 16777619); return code >>> 0; };
    let callback;
    try {
      const loaded = once('loadeddata', 5000); video.src = url; await loaded;
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      const before = { currentTime: video.currentTime, paused: video.paused, ended: video.ended, playbackRate: video.playbackRate };
      const start = performance.now();
      const observe = (now, metadata) => {
        callback = undefined;
        ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(video, 0, 0);
        const pixels = ctx.getImageData(roi.x, roi.y, roi.width, roi.height);
        const frame = { callbackWallTime: now, mediaTime: metadata.mediaTime, presentedFrames: metadata.presentedFrames,
          presentationTime: metadata.presentationTime, expectedDisplayTime: metadata.expectedDisplayTime, spriteRoiSignature: signature(pixels.data) };
        frames.push(frame);
        for (const sample of selected) {
          const distance = Math.abs(metadata.mediaTime - sample.target.time);
          if (distance <= .05 && distance < sample.distance) {
            cropCtx.clearRect(0, 0, crop.width, crop.height); cropCtx.putImageData(pixels, 0, 0);
            Object.assign(sample, { distance, mediaTime: metadata.mediaTime, spriteRoiSignature: frame.spriteRoiSignature,
              pngBase64: crop.toDataURL('image/png').split(',')[1], sourceLogEstimateNotDecodedIdentity: true });
          }
        }
        if (!video.ended) callback = video.requestVideoFrameCallback(observe);
      };
      const ended = once('ended', 10000);
      callback = video.requestVideoFrameCallback(observe); await video.play(); await ended;
      const playbackWallMs = performance.now() - start;
      if (callback !== undefined) { video.cancelVideoFrameCallback(callback); callback = undefined; }
      const after = { currentTime: video.currentTime, paused: video.paused, ended: video.ended, readyState: video.readyState };
      // Native-size extracted pixel crops only; no sprite redraws or scaling.
      const sheet = document.querySelector('canvas'), sc = sheet.getContext('2d'); sc.fillStyle = '#eee6d1'; sc.fillRect(0, 0, sheet.width, sheet.height);
      sc.fillStyle = '#302c24'; sc.font = 'bold 17px sans-serif'; sc.fillText('CONTINUOUS RECORDED PIXELS · target IDs are SOURCE-LOG ESTIMATES · REVIEW / NO FPS', 10, 25);
      for (const [i, sample] of selected.entries()) {
        if (!sample.pngBase64) continue;
        const image = new Image(); image.src = `data:image/png;base64,${sample.pngBase64}`; await image.decode();
        const x = 5 + i % 6 * 225, y = 58 + Math.floor(i / 6) * 200;
        sc.fillStyle = '#302c24'; sc.font = '12px sans-serif'; sc.fillText(`${sample.target.state} target#${sample.target.index} @${sample.mediaTime.toFixed(3)}s`, x, y - 8); sc.drawImage(image, x, y);
      }
      return { width: video.videoWidth, height: video.videoHeight,
        durationReported: Number.isFinite(video.duration) ? video.duration : String(video.duration),
        before, after, playbackWallMs, events, frames, selected, roi,
        samplerClearedPerCallback: true, noSeeking: true, continuousPlaybackEnded: after.ended,
        callbackCountNotFps: frames.length, sourceIdentityRecognitionPerformed: false };
    } finally {
      if (callback !== undefined) video.cancelVideoFrameCallback(callback);
      video.pause(); video.removeAttribute('src'); video.load(); video.remove(); URL.revokeObjectURL(url);
    }
  }, { base64: bytes.toString('base64'), mimeType: prior.playback.mimeType, targets }), 'continuous actual WebM playback', 20000);
  assert.equal(played.width, 390); assert.equal(played.height, 844);
  assert.equal(played.before.currentTime, 0); assert.equal(played.before.playbackRate, 1); assert.equal(played.after.ended, true);
  assert.ok(played.events.some(e => e.name === 'playing')); assert.ok(played.events.some(e => e.name === 'ended'));
  assert.ok(played.frames.length > 20);
  assert.ok(played.frames.at(-1).mediaTime > 2.45);
  for (let i = 1; i < played.frames.length; i++) assert.ok(played.frames[i].mediaTime > played.frames[i - 1].mediaTime);
  for (const sample of played.selected) {
    assert.ok(sample.pngBase64, `No near-target recorded sample for source-log #${sample.target.index}`);
    const bytes = Buffer.from(sample.pngBase64, 'base64'); delete sample.pngBase64;
    const file = path.join(output, `recorded-target-${String(sample.target.index).padStart(2, '0')}.png`); fs.writeFileSync(file, bytes);
    sample.snapshot = { file: rel(file), bytes: bytes.length, sha256: hash(bytes), kind: 'native-recorded-pixel-roi-no-time-text' };
    report.screenshots.push(sample.snapshot);
  }
  report.playback = played;
  const file = path.join(output, 'continuous-contact-sheet.png'), png = await page.screenshot({ path: file });
  report.screenshots.push({ file: rel(file), bytes: png.length, sha256: hash(png), kind: 'native-recorded-pixel-roi-contact-sheet' });
  report.checks = { exactPriorRecording: true, realEndedAtNormalRateWithoutSeek: true, monotonicPresentedMediaTimes: true,
    nearAll30SourceLogTargets: true, samplerClearedPerCallback: true,
    noErrorsOrExternalNetwork: !report.pageErrors.length && !report.consoleErrors.length && !report.failedRequests.length && !report.externalRequests.length };
  report.result = Object.values(report.checks).every(Boolean) ? 'REVIEW_RECORDED_OVERLAY_CONTINUOUS_PLAYBACK' : 'FAIL';
} catch (error) { report.error = String(error.stack || error); }
finally {
  if (context) try { await bounded(context.close(), 'context close'); report.contextClosed = true; } catch (e) { report.cleanupError = String(e); report.result = 'FAIL'; }
  if (browser) try { await bounded(browser.close(), 'browser close'); report.browserClosed = true; } catch (e) { report.cleanupError = String(e); report.result = 'FAIL'; }
  report.protectedAfter = fingerprint(); report.protectedUnchanged = JSON.stringify(report.protectedBefore) === JSON.stringify(report.protectedAfter);
  if (!report.protectedUnchanged) report.result = 'FAIL';
  report.finishedAt = new Date().toISOString(); fs.writeFileSync(path.join(output, 'browser.json'), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ file: rel(path.join(output, 'browser.json')), result: report.result, checks: report.checks,
  callbacks: report.playback?.frames.length, ended: report.playback?.after.ended, samples: report.playback?.selected.length,
  protectedUnchanged: report.protectedUnchanged, browserClosed: report.browserClosed, error: report.error }, null, 2));
if (report.result === 'FAIL') process.exitCode = 1;
