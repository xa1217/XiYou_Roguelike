import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

// Re-decode an immutable prior recording. No game server, image generation,
// fresh sprite rendering, production integration or performance acceptance.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const priorFile = 'evidence/current/tiger-vanguard/incontext-dynamic/2026-10-13T15-47-17-378Z/browser.json';
const priorHash = 'e7ac769f559981378af83df02e8dade496d07e015652f5ee6e77d749f1c4d87c';
const priorBytes = fs.readFileSync(path.join(root, priorFile));
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const rel = file => path.relative(root, file).replaceAll('\\', '/');
const prior = JSON.parse(priorBytes);
const full = read('evidence/current/tiger-vanguard/full-candidate/2026-10-13T11-20-21-840Z/browser.json');
const protectedExpected = {
  ...full.protectedAfter, ...prior.protectedAfter,
  [priorFile]: priorHash,
  [prior.playback.file]: prior.playback.sha256,
  ...Object.fromEntries(prior.screenshots.map(s => [s.file, s.sha256])),
  'scripts/browser-tiger-vanguard-incontext-dynamic.mjs': hash(fs.readFileSync(path.join(root, 'scripts/browser-tiger-vanguard-incontext-dynamic.mjs'))),
};
const fingerprint = () => Object.fromEntries(Object.keys(protectedExpected).map(file => [file, hash(fs.readFileSync(path.join(root, file)))]));
const generatedAt = new Date().toISOString();
const output = path.join(root, 'evidence/current/tiger-vanguard/incontext-decode', generatedAt.replaceAll(':', '-').replaceAll('.', '-'));
fs.mkdirSync(output, { recursive: true });
const samples = [
  { time: .25, state: 'idle' }, { time: .95, state: 'move' },
  { time: 1.65, state: 'attack' }, { time: 2.025, state: 'hit' },
  { time: 2.40, state: 'death' }, { time: 2.50, state: 'death-tail' },
];
const report = {
  generatedAt, result: 'FAIL',
  scope: 'Actual bytes of the prior overlay-only WebM decoded in real Edge; no underlying game pixels, fresh gameplay or FPS acceptance.',
  inputReport: { file: priorFile, sha256: hash(priorBytes) },
  video: { file: prior.playback.file, bytes: prior.playback.bytes, sha256: prior.playback.sha256 },
  recordingLayers: { includesOverlay: true, includesUnderlyingGame: false, source: 'overlay.captureStream(30)' },
  sourceTimeline: prior.overlay.timeline,
  loggedSourcePoseIndices: [...new Set(prior.playback.ticks.map(t => t.index))].sort((a, b) => a - b),
  scriptSha256: hash(fs.readFileSync(fileURLToPath(import.meta.url))),
  protectedBefore: fingerprint(), pageErrors: [], consoleErrors: [], failedRequests: [], externalRequests: [],
  screenshots: [], codecDecodeOnly: true, overlayOnly: true, humanMotionReviewed: false,
  runtimeApproved: false, highFrameApproved: false, fpsAcceptance: false, publicPass: false,
  releaseReady: false, serverStarted: false,
};
const bounded = async (promise, name, ms = 15000) => {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${name} timeout`)), ms); })]); }
  finally { clearTimeout(timer); }
};
let browser, context;
try {
  assert.deepEqual(report.protectedBefore, protectedExpected);
  assert.equal(prior.result, 'REVIEW_INCONTEXT_CANDIDATE_DYNAMIC_OVERLAY');
  assert.equal(prior.overlayOnly, true);
  assert.equal(prior.runtimeApproved, false);
  assert.equal(prior.highFrameApproved, false);
  assert.equal(prior.publicPass, false);
  const videoBytes = fs.readFileSync(path.join(root, prior.playback.file));
  assert.equal(videoBytes.length, prior.playback.bytes);
  assert.equal(hash(videoBytes), prior.playback.sha256);
  assert.equal(videoBytes.subarray(0, 4).toString('hex'), '1a45dfa3');
  const motion = read(prior.motionDraft.file);
  const runtimeFiles = [
    ...fs.readdirSync(path.join(root, 'prototype-2d/src')).filter(f => f.endsWith('.js')).map(f => `prototype-2d/src/${f}`),
    'prototype-2d/native-app.js', 'prototype-2d/assets/manifest.json', 'scripts/serve.mjs', 'scripts/release.mjs',
  ];
  const names = [prior.candidate.file, prior.motionDraft.file, ...read(prior.candidate.file).pages.map(p => p.file)];
  report.runtimeReferences = runtimeFiles.flatMap(file => {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    return names.filter(name => source.includes(name) || source.includes(path.basename(name))).map(name => ({ file, name }));
  });
  assert.equal(report.runtimeReferences.length, 0);
  const pw = await loadPlaywright();
  browser = await pw.chromium.launch(browserLaunchOptions()); report.browser = browser.version();
  context = await browser.newContext({ viewport: { width: 1200, height: 1800 }, deviceScaleFactor: 1 });
  const page = await context.newPage(); page.setDefaultTimeout(15000);
  page.on('pageerror', e => report.pageErrors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
  page.on('requestfailed', r => report.failedRequests.push({ url: r.url(), error: r.failure()?.errorText }));
  page.on('request', r => { if (/^https?:/.test(r.url())) report.externalRequests.push(r.url()); });
  await page.route('http://**/*', r => r.abort()); await page.route('https://**/*', r => r.abort());
  await page.setContent('<!doctype html><meta charset="utf-8"><title>Recorded overlay decode · REVIEW</title><style>body{margin:0;background:#eee6d1}canvas{display:block}video{position:absolute;left:0;top:0;width:1px;height:1px}</style><canvas width="1200" height="1800"></canvas>');
  const decoded = await bounded(page.evaluate(async ({ base64, mimeType, samples, timeline, motion }) => {
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const url = URL.createObjectURL(new Blob([bytes], { type: mimeType }));
    const video = document.createElement('video'); video.muted = true; video.playsInline = true; document.body.appendChild(video);
    const once = event => new Promise((resolve, reject) => {
      const finish = (error, value) => { clearTimeout(timer); video.removeEventListener(event, ok); video.removeEventListener('error', bad); error ? reject(error) : resolve(value); };
      const ok = e => finish(null, e), bad = () => finish(new Error(`Video ${event} decode error: ${video.error?.code}`));
      const timer = setTimeout(() => finish(new Error(`Video ${event} timeout`)), 5000);
      video.addEventListener(event, ok, { once: true }); video.addEventListener('error', bad, { once: true });
    });
    const sheet = document.querySelector('canvas'), sc = sheet.getContext('2d');
    sc.fillStyle = '#eee6d1'; sc.fillRect(0, 0, sheet.width, sheet.height); sc.fillStyle = '#302c24'; sc.font = 'bold 19px sans-serif';
    sc.fillText('ACTUAL OVERLAY WEBM DECODE · no game background · REVIEW', 12, 27);
    const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d', { willReadFrequently: true });
    const roi = { x: 158, y: 332, width: 225, height: 175, excludesChangingTimeLabel: true };
    const signature = pixels => { let code = 2166136261; for (const byte of pixels) code = Math.imul(code ^ byte, 16777619); return code >>> 0; };
    const expectedPose = mediaTime => {
      let remaining = mediaTime * 1000;
      for (const segment of timeline) {
        if (remaining < segment.durationMs) {
          const spec = motion.states[segment.state];
          const slot = spec.loop ? Math.floor(remaining / 1000 * spec.sourcePosesPerSecond) % spec.frames.length : Math.min(spec.frames.length - 1, Math.floor(remaining / 1000 * spec.sourcePosesPerSecond));
          return { state: segment.state, index: spec.frames[slot], facing: segment.facing, expectedFromDraftOnly: true };
        }
        remaining -= segment.durationMs;
      }
      return { state: 'death', index: 31, facing: 1, expectedFromDraftOnly: true };
    };
    const output = [];
    let activeCallback;
    try {
      const loaded = once('loadeddata'); video.src = url; await loaded; video.pause();
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      for (const [i, sample] of samples.entries()) {
        let callbackTimer;
        const presented = new Promise((resolve, reject) => {
          callbackTimer = setTimeout(() => reject(new Error('Presented video-frame callback timeout')), 5000);
          activeCallback = video.requestVideoFrameCallback((_, metadata) => { clearTimeout(callbackTimer); activeCallback = undefined; resolve({ mediaTime: metadata.mediaTime, presentedFrames: metadata.presentedFrames }); });
        });
        // The callback and seek listener are registered before changing currentTime.
        const seeked = once('seeked'); video.currentTime = sample.time;
        let metadata;
        try { [, metadata] = await Promise.all([seeked, presented]); }
        finally { clearTimeout(callbackTimer); if (activeCallback !== undefined) { video.cancelVideoFrameCallback(activeCallback); activeCallback = undefined; } }
        // WebM alpha is retained. A reused canvas must be cleared before each
        // independent seek snapshot, otherwise earlier samples ghost through.
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0);
        const all = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const pixels = ctx.getImageData(roi.x, roi.y, roi.width, roi.height).data;
        let nonBlackPixels = 0; for (let j = 0; j < pixels.length; j += 4) if (pixels[j] + pixels[j + 1] + pixels[j + 2] > 24) nonBlackPixels++;
        const expected = expectedPose(metadata.mediaTime);
        const x = 10 + (i % 3) * 400, y = 60 + Math.floor(i / 3) * 870;
        sc.fillStyle = '#302c24'; sc.font = '13px sans-serif'; sc.fillText(`${sample.state} @ ${metadata.mediaTime.toFixed(3)}s (expected #${expected.index})`, x, y - 8);
        sc.drawImage(canvas, x, y);
        output.push({ requestedTime: sample.time, playheadAfterSeek: video.currentTime,
          presentedFrame: metadata, stateLabel: sample.state, expected,
          fullSignature: signature(all), spriteRoiSignature: signature(pixels), nonBlackPixels,
          pngBase64: canvas.toDataURL('image/png').split(',')[1] });
      }
      return { width: video.videoWidth, height: video.videoHeight, durationReported: Number.isFinite(video.duration) ? video.duration : String(video.duration),
        roi, samples: output, signatureMeaning: 'FNV diagnostic excluding time text; not frame identity, quality or FPS.',
        decodedFromActualBytes: true, samplerClearedPerFrame: true, mediaTimeFromPresentedFrameCallback: true };
    } finally {
      if (activeCallback !== undefined) video.cancelVideoFrameCallback(activeCallback);
      video.pause(); video.removeAttribute('src'); video.load(); video.remove(); URL.revokeObjectURL(url);
    }
  }, { base64: videoBytes.toString('base64'), mimeType: prior.playback.mimeType, samples, timeline: prior.overlay.timeline, motion }), 'actual recording decode', 45000);
  assert.equal(decoded.width, 390); assert.equal(decoded.height, 844);
  for (const sample of decoded.samples) {
    assert.ok(Math.abs(sample.presentedFrame.mediaTime - sample.requestedTime) < .08);
    assert.ok(sample.nonBlackPixels > 100);
    assert.equal(sample.expected.state, sample.stateLabel.replace('-tail', ''));
    const png = Buffer.from(sample.pngBase64, 'base64'); delete sample.pngBase64;
    const file = path.join(output, `decoded-${sample.stateLabel}.png`); fs.writeFileSync(file, png);
    sample.snapshot = { file: rel(file), bytes: png.length, sha256: hash(png), kind: 'actual-decoded-overlay-no-underlying-game' };
    report.screenshots.push(sample.snapshot);
  }
  decoded.distinctFiveStateSpriteRoiSamples = new Set(decoded.samples.slice(0, 5).map(s => s.spriteRoiSignature)).size;
  assert.equal(decoded.distinctFiveStateSpriteRoiSamples, 5);
  report.recordingDecode = decoded;
  const file = path.join(output, 'decoded-contact-sheet.png'), png = await page.screenshot({ path: file });
  report.screenshots.push({ file: rel(file), bytes: png.length, sha256: hash(png), kind: 'actual-decoded-contact-sheet' });
  report.checks = { exactPriorBytes: true, native390x844Decode: true, interiorFiveStateSampling: true,
    timeLabelExcludedFromRoi: true, samplerClearedPerFrame: decoded.samplerClearedPerFrame, fiveDistinctSpriteRoiSamples: true,
    noErrorsOrExternalNetwork: !report.pageErrors.length && !report.consoleErrors.length && !report.failedRequests.length && !report.externalRequests.length };
  report.result = Object.values(report.checks).every(Boolean) ? 'REVIEW_RECORDED_OVERLAY_DECODE_ONLY' : 'FAIL';
} catch (error) { report.error = String(error.stack || error); }
finally {
  if (context) try { await bounded(context.close(), 'context close'); report.contextClosed = true; } catch (error) { report.cleanupError = String(error); report.result = 'FAIL'; }
  if (browser) try { await bounded(browser.close(), 'browser close'); report.browserClosed = true; } catch (error) { report.cleanupError = String(error); report.result = 'FAIL'; }
  report.protectedAfter = fingerprint(); report.protectedUnchanged = JSON.stringify(report.protectedBefore) === JSON.stringify(report.protectedAfter);
  if (!report.protectedUnchanged) report.result = 'FAIL';
  report.finishedAt = new Date().toISOString(); fs.writeFileSync(path.join(output, 'browser.json'), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ file: rel(path.join(output, 'browser.json')), result: report.result, checks: report.checks,
  recordingDecode: report.recordingDecode, protectedUnchanged: report.protectedUnchanged, browserClosed: report.browserClosed, error: report.error }, null, 2));
if (report.result === 'FAIL') process.exitCode = 1;
