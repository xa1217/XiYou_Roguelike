import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const actor = process.argv[2] || 'bear';
const actorNames = { bear: '普通熊妖', bull: '普通野牛妖', wolf: '普通苍狼妖' };
if (!actorNames[actor]) throw new Error('Unsupported isolated actor preflight');
const label = actorNames[actor];
const output = path.join(root, `evidence/current/${actor}`);
fs.mkdirSync(output, { recursive: true });
const contract = JSON.parse(fs.readFileSync(path.join(root, `prototype-2d/assets/enemy-${actor}-battle-v1-frames.json`), 'utf8'));
const png = fs.readFileSync(path.join(root, 'prototype-2d/assets', contract.asset));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const report = { generatedAt: new Date().toISOString(), result: 'FAIL', scope: 'Real Edge isolated asset preview, NOT production gameplay or public acceptance',
  assetSha256: hash(png), actor, sourceContractRuntimeApproved: contract.approvedForRuntime === true, approvedForRuntime: false, pageErrors: [], screenshots: [] };
const reportPath = path.join(output, 'browser-preflight.json');
const checkpoint = phase => {
  report.phase = phase; report.updatedAt = new Date().toISOString();
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
};
// page.evaluate has no default timeout. Bound it on the Node side as well as
// recorder events, so a suspended page/codec cannot occupy the asset lane.
const bounded = async (promise, label, ms = 10000) => {
  let timer;
  try {
    return await Promise.race([promise, new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    })]);
  } finally { clearTimeout(timer); }
};
let browser;
try {
  report.result = 'RUNNING'; checkpoint('starting');
  if (report.assetSha256 !== contract.sha256) throw new Error('PNG hash differs from measured contract');
  const pw = await loadPlaywright();
  browser = await pw.chromium.launch(browserLaunchOptions());
  report.browser = browser.version();
  const page = await browser.newPage({ viewport: { width: 1000, height: 720 }, deviceScaleFactor: 1 });
  page.setDefaultTimeout(10000);
  const evaluate = (fn, args) => bounded(page.evaluate(fn, args), 'browser evaluation');
  page.on('pageerror', error => report.pageErrors.push(String(error)));
  await page.setContent(`<!doctype html><meta charset="utf-8"><title>${label} asset preflight</title><style>body{margin:0;background:#ebe7d5}canvas{display:block}</style><canvas width="1000" height="720"></canvas>`);
  report.decode = await evaluate(async ({ contract, src, label }) => {
    const image = new Image(); image.src = src; await image.decode();
    const canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d');
    const draw = (context, index, x, baseline, height = 48, mirror = false) => {
      const f = contract.sourceRects[index], scale = height / contract.referenceBodyHeight;
      context.save(); context.translate(x, baseline); context.scale(mirror ? -1 : 1, 1);
      context.drawImage(image, f.x, f.y, f.w, f.h, (f.x - contract.previewRootXs[index % 8]) * scale,
        (f.y - contract.previewBaselines[Math.floor(index / 8)]) * scale, f.w * scale, f.h * scale);
      context.restore();
    };
    const sample = document.createElement('canvas'); sample.width = 220; sample.height = 150;
    const c = sample.getContext('2d');
    window.actorSample = (index, mirror = false) => {
      c.clearRect(0, 0, 220, 150); draw(c, index, 110, 130, 96, mirror); return sample.toDataURL();
    };
    window.actorAtlas = (mirror = false) => {
      ctx.fillStyle = '#ebe7d5'; ctx.fillRect(0, 0, 1000, 720);
      ctx.fillStyle = '#302920'; ctx.font = '20px sans-serif'; ctx.fillText(`${label}32姿态 · ${mirror ? '左向镜像' : '右向原图'} · 独立素材预览，非本次局内验收`, 16, 28);
      ctx.font = '13px sans-serif'; ctx.fillText('上：统一48px体高；下：96px动作抽样。实测裁切，不拉伸各帧。', 16, 52);
      contract.sourceRects.forEach((f, i) => {
        const x = (i % 8) * 125, y = 67 + Math.floor(i / 8) * 122;
        ctx.strokeStyle = '#b8b6a8'; ctx.strokeRect(x + 5, y + 3, 115, 115);
        ctx.fillStyle = '#302920'; ctx.font = '12px sans-serif'; ctx.fillText(`${f.state} ${i}`, x + 10, y + 20);
        ctx.strokeStyle = '#bdc8ae'; ctx.beginPath(); ctx.moveTo(x + 10, y + 96); ctx.lineTo(x + 115, y + 96); ctx.stroke();
        draw(ctx, i, x + 61, y + 94, 48, mirror);
      });
      for (const [i, index] of [0, 10, 20, 24, 31].entries()) draw(ctx, index, 95 + i * 198, 700, 96, mirror);
    };
    window.actorMotion = seconds => {
      ctx.fillStyle = '#ebe7d5'; ctx.fillRect(0, 0, 1000, 720);
      ctx.fillStyle = '#302920'; ctx.font = '20px sans-serif'; ctx.fillText(`${label} · 独立动作预览（非游戏录像或本次局内验收）`, 16, 28);
      ctx.font = '13px sans-serif'; ctx.fillText('右向48px / 左向56px / 放大96px；受击与死亡播到末帧停住；原PNG未改写。', 16, 53);
      const seen = {};
      Object.entries(contract.states).forEach(([state, indices], row) => {
        const step = Math.floor(seconds * contract.fps[state]);
        const local = ['hit', 'death', 'attack'].includes(state) ? Math.min(step, indices.length - 1) : step % indices.length;
        seen[state] = local;
        const baseline = 176 + row * 126;
        ctx.fillStyle = '#302920'; ctx.font = '15px sans-serif'; ctx.fillText(`${state} ${local + 1}/${indices.length}`, 16, baseline - 30);
        ctx.strokeStyle = '#bdc8ae'; ctx.beginPath(); ctx.moveTo(175, baseline); ctx.lineTo(960, baseline); ctx.stroke();
        draw(ctx, indices[local], 265, baseline, 48);
        draw(ctx, indices[local], 505, baseline, 56, true);
        draw(ctx, indices[local], 795, baseline, 96);
      });
      return seen;
    };
    window.startActorPreview = () => {
      const stream = canvas.captureStream(0), chunks = [], seen = Object.fromEntries(Object.keys(contract.states).map(key => [key, new Set()]));
      const track = stream.getVideoTracks()[0];
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 1000000 });
      const capture = window.__actorCapture = { stream, track, recorder, chunks, seen, mimeType, paints: 0, error: null };
      capture.done = new Promise(resolve => {
        recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
        recorder.onerror = event => { capture.error = event.error?.message || 'MediaRecorder failed'; resolve(); };
        recorder.onstop = resolve;
      });
      recorder.start(100);
      return { mimeType, manualCapture: typeof track.requestFrame === 'function' };
    };
    window.stepActorPreview = seconds => {
      const capture = window.__actorCapture;
      if (capture.error) throw new Error(capture.error);
      for (const [key, index] of Object.entries(window.actorMotion(seconds))) capture.seen[key].add(index);
      capture.track.requestFrame(); capture.paints++;
    };
    window.stopActorPreview = async () => {
      const capture = window.__actorCapture; let timer;
      try {
        capture.recorder.stop();
        await Promise.race([capture.done, new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error('MediaRecorder finalization exceeded 5000ms')), 5000);
        })]);
        if (capture.error) throw new Error(capture.error);
        const blob = new Blob(capture.chunks, { type: capture.mimeType });
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader(); reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error('Preview recording could not be read')); reader.readAsDataURL(blob);
        });
        return { dataUrl, mimeType: capture.mimeType, paints: capture.paints,
          seen: Object.fromEntries(Object.entries(capture.seen).map(([key, values]) => [key, [...values].sort((a,b) => a-b)])) };
      } finally {
        clearTimeout(timer); capture.stream.getTracks().forEach(track => track.stop());
      }
    };
    window.actorAtlas();
    return { complete: image.complete, width: image.naturalWidth, height: image.naturalHeight };
  }, { contract, src: `data:image/png;base64,${png.toString('base64')}`, label });
  report.states = {};
  for (const [state, indices] of Object.entries(contract.states)) {
    const hashes = [];
    for (const index of indices) hashes.push(hash(await evaluate(index => window.actorSample(index), index)));
    report.states[state] = { frames: indices.length, distinctRenderedFrames: new Set(hashes).size, hashes };
  }
  report.leftRightDiffer = hash(await evaluate(() => window.actorSample(8, true))) !== hash(await evaluate(() => window.actorSample(8, false)));
  const shot = async name => {
    const file = path.join(output, name), bytes = await page.screenshot({ path: file });
    report.screenshots.push({ file: path.relative(root, file).replaceAll('\\', '/'), sha256: hash(bytes) });
  };
  await shot('atlas-right-48px.png');
  await evaluate(() => window.actorAtlas(true)); await shot('atlas-left-48px.png');
  checkpoint('atlas-decoded-and-captured');
  report.recording = await evaluate(() => window.startActorPreview());
  if (!report.recording.manualCapture) throw new Error('Manual Canvas frame capture unsupported');
  checkpoint('recording-node-driven-frames');
  // Node owns the finite frame loop. No requestAnimationFrame promise can
  // strand the test when a background/headless page stops receiving frames.
  const recordingStart = Date.now();
  for (let step = 0; step <= 90; step++) {
    if (Date.now() - recordingStart > 15000) throw new Error('Preview frame loop exceeded 15000ms');
    await evaluate(seconds => window.stepActorPreview(seconds), step / 30);
    await new Promise(resolve => setTimeout(resolve, 34));
  }
  checkpoint('finalizing-recording');
  const recording = await evaluate(() => window.stopActorPreview());
  const video = Buffer.from(recording.dataUrl.split(',')[1], 'base64');
  fs.writeFileSync(path.join(output, 'animation-preview.webm'), video);
  const { dataUrl, ...capture } = recording;
  report.preview = { ...capture, file: `evidence/current/${actor}/animation-preview.webm`, bytes: video.length, sha256: hash(video),
    note: 'Finite Node-driven Canvas frame-sheet preview recorded in a real browser, not directly generated video, real-time game performance or production-game evidence.' };
  // Decode and play the emitted WebM back in the same isolated browser.
  // This proves a usable video with changing decoded pixels, not that every
  // source pose was retained by the codec or that gameplay meets mobile FPS.
  report.previewDecode = await evaluate(dataUrl => new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const sample = document.createElement('canvas'); sample.width = 160; sample.height = 115;
    const context = sample.getContext('2d', { willReadFrequently: true });
    const hashes = new Set(); let frames = 0, callback, timer, settled = false;
    const finish = (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      video.onended = null; video.onerror = null;
      if (callback !== undefined) video.cancelVideoFrameCallback(callback);
      const decoded = { decoded: !error, ended: video.ended, width: video.videoWidth, height: video.videoHeight,
        decodedFrames: frames, distinctSampledPixels: hashes.size, playedSeconds: video.currentTime,
        note: 'Readback of recorded isolated preview; not all-source-pose codec coverage, final animation quality or game FPS.' };
      video.pause(); video.removeAttribute('src'); video.load(); video.remove();
      if (error) reject(error); else resolve(decoded);
    };
    video.muted = true; video.playsInline = true;
    video.style.cssText = 'position:fixed;right:0;bottom:0;width:160px;height:115px';
    document.body.appendChild(video);
    if (typeof video.requestVideoFrameCallback !== 'function') return finish(new Error('Video frame readback unsupported'));
    const frame = () => {
      context.drawImage(video, 0, 0, sample.width, sample.height);
      let h = 2166136261;
      for (const byte of context.getImageData(0, 0, sample.width, sample.height).data) h = Math.imul(h ^ byte, 16777619);
      hashes.add(h >>> 0); frames++;
      callback = video.requestVideoFrameCallback(frame);
    };
    video.onended = () => finish(); video.onerror = () => finish(new Error('Recorded WebM decode failed'));
    timer = setTimeout(() => finish(new Error('Recorded WebM playback exceeded 8000ms')), 8000);
    callback = video.requestVideoFrameCallback(frame);
    video.src = dataUrl; video.play().catch(finish);
  }), recording.dataUrl);
  await evaluate(() => window.actorMotion(.26)); await shot('motion-sample-48-56-96px.png');
  report.checks = {
    decoded: report.decode.complete && report.decode.width === contract.size[0] && report.decode.height === contract.size[1],
    distinctPixels: Object.values(report.states).every(s => s.frames === s.distinctRenderedFrames),
    mirrored: report.leftRightDiffer,
    animationCoverage: Object.entries(contract.states).every(([key, frames]) => capture.seen[key].length === frames.length),
    previewRecorded: video.length > 1000,
    videoReadback: report.previewDecode.decoded && report.previewDecode.ended && report.previewDecode.width === 1000 && report.previewDecode.height === 720 && report.previewDecode.decodedFrames >= 10 && report.previewDecode.distinctSampledPixels >= 8,
    noErrors: report.pageErrors.length === 0,
  };
  report.result = Object.values(report.checks).every(Boolean) ? 'PASS' : 'FAIL';
} catch (error) { report.result = 'FAIL'; report.error = String(error?.stack || error); }
finally {
  if (browser) {
    try { await bounded(browser.close(), 'browser cleanup', 5000); report.browserClosed = true; }
    catch (error) { report.cleanupError = String(error); report.result = 'FAIL'; }
  }
  checkpoint('finished');
  if (report.result !== 'PASS') fs.writeFileSync(path.join(output, `browser-fail-${Date.now()}.json`), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ result: report.result, checks: report.checks, decode: report.decode, preview: report.preview, error: report.error }, null, 2));
if (report.result !== 'PASS') process.exitCode = 1;
