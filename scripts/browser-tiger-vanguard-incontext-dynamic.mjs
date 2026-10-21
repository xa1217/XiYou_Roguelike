import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const candidateFile = 'evidence/current/tiger-vanguard/full-candidate/2026-10-13T11-20-21-840Z/candidate-table.json';
const motionFile = 'evidence/current/tiger-vanguard/motion-draft/2026-10-13T12-00-07-310Z/motion-draft.json';
const candidate = JSON.parse(fs.readFileSync(path.join(root, candidateFile), 'utf8'));
const motion = JSON.parse(fs.readFileSync(path.join(root, motionFile), 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const rel = file => path.relative(root, file).replaceAll('\\', '/');
const generatedAt = new Date().toISOString();
const output = path.join(root, 'evidence/current/tiger-vanguard/incontext-dynamic', generatedAt.replaceAll(':', '-').replaceAll('.', '-'));
fs.mkdirSync(output, { recursive: true });
const report = {
  generatedAt,
  result: 'FAIL',
  scope: 'Real Edge local battle scene with an evidence-only dynamic candidate overlay; not runtime integration, natural gameplay/FPS or public acceptance.',
  candidate: { file: candidateFile, sha256: hash(fs.readFileSync(path.join(root, candidateFile))), frames: 32 },
  motionDraft: { file: motionFile, sha256: hash(fs.readFileSync(path.join(root, motionFile))) },
  runtimeReferences: [],
  pageErrors: [],
  consoleErrors: [],
  failedRequests: [],
  httpErrors: [],
  externalRequests: [],
  screenshots: [],
  overlayOnly: true,
  runtimeApproved: false,
  highFrameApproved: false,
  publicPass: false,
};
const protectedFiles = [
  'prototype-2d/src/engine.js', 'prototype-2d/src/renderer.js', 'prototype-2d/src/battle-enemy-animation.js',
  'prototype-2d/native-app.js', 'prototype-2d/assets/manifest.json', candidateFile, motionFile,
];
const fingerprint = () => Object.fromEntries(protectedFiles.map(file => [file, hash(fs.readFileSync(path.join(root, file)))]));
report.protectedBefore = fingerprint();
const bounded = async (promise, name, ms = 30000) => {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${name} timeout`)), ms); })]); }
  finally { clearTimeout(timer); }
};

let browser, context;
try {
  const runtimeText = [
    ...fs.readdirSync(path.join(root, 'prototype-2d/src'), { withFileTypes: true })
      .filter(entry => entry.isFile() && entry.name.endsWith('.js'))
      .map(entry => fs.readFileSync(path.join(root, 'prototype-2d/src', entry.name), 'utf8')),
    fs.readFileSync(path.join(root, 'prototype-2d/native-app.js'), 'utf8'),
    fs.readFileSync(path.join(root, 'prototype-2d/assets/manifest.json'), 'utf8'),
  ].join('\n');
  report.runtimeReferences = [candidateFile, motionFile]
    .filter(value => runtimeText.includes(path.basename(value)) || runtimeText.includes(value));
  if (report.runtimeReferences.length) throw new Error('Candidate unexpectedly referenced by runtime source');

  const playwright = await loadPlaywright();
  browser = await playwright.chromium.launch(browserLaunchOptions());
  report.browser = browser.version();
  context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  page.on('pageerror', error => report.pageErrors.push(String(error?.stack || error)));
  page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
  page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure()?.errorText || null }));
  page.on('response', response => { if (response.status() >= 400) report.httpErrors.push({ url: response.url(), status: response.status() }); });
  page.on('request', request => {
    const url = new URL(request.url());
    if (url.protocol.startsWith('http') && url.origin !== new URL(process.env.XIYOU_URL || 'http://127.0.0.1:8088/native.html').origin) report.externalRequests.push(url.href);
  });
  const url = process.env.XIYOU_URL || 'http://127.0.0.1:8088/native.html?debug=1';
  if (!['127.0.0.1', 'localhost'].includes(new URL(url).hostname)) throw new Error('Dynamic fixture requires localhost');
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForFunction(() => window.xiyou?.screen === 'home');
  await page.mouse.click(195, 485);
  await page.waitForFunction(() => window.xiyou?.screen === 'select');
  await page.mouse.click(195, 615);
  await page.waitForFunction(() => window.xiyou?.engine?.state?.status === 'playing');
  await page.waitForFunction(() => (window.xiyou?.engine?.state?.enemies?.length || 0) > 0, null, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(250);

  report.sceneBeforeOverlay = await page.evaluate(() => {
    const g = window.xiyou, canvas = document.querySelector('canvas'), rect = canvas?.getBoundingClientRect();
    return { screen: g?.screen, status: g?.engine?.state?.status, time: g?.engine?.state?.time, enemies: g?.engine?.state?.enemies?.length || 0,
      canvas: canvas ? { width: canvas.width, height: canvas.height, cssWidth: rect.width, cssHeight: rect.height } : null,
      rendererMode: g?.renderer?.battleSceneMode || null };
  });
  const baseFile = path.join(output, 'battle-scene-base-paused.png');
  report.pausedBy = 'page.evaluate cancel RAF + game.running=false while engine remains playing; no pause-button interaction and no engine.pause modal';
  await page.evaluate(() => {
    const g = window.xiyou;
    if (!g?.engine) throw new Error('Game engine unavailable');
    g.cancel(g.frame); g.frame = 0; g.running = false; g.draw();
  });
  await page.screenshot({ path: baseFile });
  report.screenshots.push({ file: rel(baseFile), bytes: fs.statSync(baseFile).size, sha256: hash(fs.readFileSync(baseFile)), kind: 'underlying-paused-game' });

  const sourceBytes = Object.fromEntries(candidate.pages.map(pageInfo => [pageInfo.id, fs.readFileSync(path.join(root, pageInfo.file))]));
  const setup = await page.evaluate(async ({ pages, candidate, motion }) => {
    const base = document.querySelector('canvas');
    if (!base) throw new Error('Underlying game canvas missing');
    const rect = base.getBoundingClientRect();
    const overlay = document.createElement('canvas');
    overlay.width = 390; overlay.height = 844;
    overlay.style.cssText = `position:absolute;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;pointer-events:none;z-index:20`;
    base.parentElement.style.position = 'relative'; base.parentElement.appendChild(overlay);
    const ctx = overlay.getContext('2d');
    const images = {};
    for (const source of pages) { const image = new Image(); image.src = source.src; await image.decode(); images[source.id] = image; }
    const byIndex = Object.fromEntries(candidate.frames.map(frame => [frame.index, frame]));
    const draftByIndex = Object.fromEntries(motion.frames.map(frame => [frame.index, frame]));
    const timeline = [
      { state: 'idle', durationMs: 700, facing: 1 }, { state: 'move', durationMs: 700, facing: 1 },
      { state: 'attack', durationMs: 500, facing: 1 }, { state: 'hit', durationMs: 250, facing: -1 },
      { state: 'death', durationMs: 400, facing: 1 },
    ];
    const totalMs = timeline.reduce((sum, item) => sum + item.durationMs, 0);
    const choose = elapsed => {
      let remaining = Math.max(0, Math.min(totalMs - 0.001, elapsed)), start = 0;
      for (const segment of timeline) {
        if (remaining < segment.durationMs) {
          const spec = motion.states[segment.state];
          const index = spec.loop ? Math.min(spec.frames.length - 1, Math.floor((remaining / 1000) * spec.sourcePosesPerSecond) % spec.frames.length) : Math.min(spec.frames.length - 1, Math.floor((remaining / 1000) * spec.sourcePosesPerSecond));
          return { state: segment.state, facing: segment.facing, index: spec.frames[index], localMs: remaining, startMs: start };
        }
        remaining -= segment.durationMs; start += segment.durationMs;
      }
      return { state: 'death', facing: 1, index: 31, localMs: 400, startMs: totalMs - 400 };
    };
    const draw = pose => {
      const frame = byIndex[pose.index], draftFrame = draftByIndex[pose.index];
      const scale = 86 / frame.standingReferenceHeight, x = 276, ground = 474;
      ctx.clearRect(0, 0, overlay.width, overlay.height);
      ctx.fillStyle = 'rgba(16,11,20,.76)'; ctx.fillRect(182, 266, 190, 64);
      ctx.fillStyle = '#f9e8b1'; ctx.font = 'bold 12px sans-serif'; ctx.fillText(`虎先锋候选 ghost · ${pose.state} #${pose.index}`, 190, 286);
      ctx.fillText(`t=${Math.round(pose.elapsedMs)}ms · ${pose.facing < 0 ? '左向' : '右向'}`, 190, 304);
      ctx.strokeStyle = '#e7d79c'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 68, ground); ctx.lineTo(x + 68, ground); ctx.stroke();
      ctx.strokeStyle = '#d7b45f'; ctx.beginPath(); ctx.moveTo(x, ground - 102); ctx.lineTo(x, ground + 8); ctx.stroke();
      ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(x - 44, ground - 116, 88, 6); ctx.fillStyle = '#82dc6a'; ctx.fillRect(x - 44, ground - 116, 72, 6);
      ctx.save(); ctx.translate(x, ground); ctx.scale(pose.facing, 1);
      ctx.drawImage(images[frame.page], frame.sourceRect.x, frame.sourceRect.y, frame.sourceRect.w, frame.sourceRect.h,
        -draftFrame.pivot.x * scale, -draftFrame.pivot.y * scale, frame.sourceRect.w * scale, frame.sourceRect.h * scale);
      ctx.restore();
    };
    const stream = overlay.captureStream(30);
    const mimeType = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find(value => MediaRecorder.isTypeSupported(value));
    if (!mimeType) throw new Error('No native WebM codec');
    const recorder = new MediaRecorder(stream, { mimeType }), chunks = [], ticks = [], intervals = [], states = [];
    let started = 0, last = 0, raf = 0;
    const result = new Promise((resolve, reject) => {
      recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      recorder.onerror = event => reject(new Error(String(event.error || 'MediaRecorder error')));
      recorder.onstop = async () => {
        try {
          const bytes = new Uint8Array(await new Blob(chunks, { type: mimeType }).arrayBuffer());
          let binary = ''; for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
          window.__dynamicOverlayResult = { base64: btoa(binary), mimeType, elapsedMs: performance.now() - started, tickCount: ticks.length, ticks, intervals,
            states: [...new Set(states)], recordingRateRequested: 30, fpsAcceptance: false, tracksStopped: stream.getTracks().every(track => track.readyState === 'ended'),
            overlayCanvasCount: document.querySelectorAll('canvas').length, underlying: { status: window.xiyou?.engine?.state?.status, time: window.xiyou?.engine?.state?.time } };
          resolve(window.__dynamicOverlayResult);
        } catch (error) { reject(error); }
      };
      recorder.start();
      const tick = now => {
        started ||= now; const elapsed = now - started; const pose = choose(elapsed); pose.elapsedMs = elapsed; draw(pose);
        if (last) intervals.push(Number((now - last).toFixed(3))); last = now; ticks.push({ elapsedMs: Number(elapsed.toFixed(3)), state: pose.state, index: pose.index, facing: pose.facing }); states.push(pose.state);
        if (elapsed >= totalMs) { draw({ ...pose, state: 'death', index: 31, elapsedMs: totalMs }); recorder.stop(); stream.getTracks().forEach(track => track.stop()); return; }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    window.__dynamicOverlay = { canvas: overlay, result, cancel: () => { cancelAnimationFrame(raf); if (recorder.state !== 'inactive') recorder.stop(); stream.getTracks().forEach(track => track.stop()); overlay.remove(); } };
    return { overlayCss: { width: rect.width, height: rect.height }, sourceImages: Object.fromEntries(Object.entries(images).map(([id, image]) => [id, [image.naturalWidth, image.naturalHeight]])), overlayCanvasCount: document.querySelectorAll('canvas').length, fixedAnchor: { x: 276, ground: 474 }, timeline, totalMs, sceneOverlay: true };
  }, { pages: candidate.pages.map(pageInfo => ({ ...pageInfo, src: `data:image/png;base64,${sourceBytes[pageInfo.id].toString('base64')}` })), candidate, motion });
  report.overlay = setup;
  const shot = async (name, kind) => { const file = path.join(output, `${name}.png`), bytes = await page.screenshot({ path: file }); report.screenshots.push({ file: rel(file), bytes: bytes.length, sha256: hash(bytes), kind }); };
  for (const [delay, name] of [[350, 'dynamic-idle'], [700, 'dynamic-move'], [700, 'dynamic-attack'], [200, 'dynamic-hit'], [600, 'dynamic-death']]) { await page.waitForTimeout(delay); await shot(name, 'underlying-paused-game-plus-evidence-overlay'); }
  const dynamic = await page.evaluate(() => window.__dynamicOverlay?.result);
  const result = await dynamic;
  const { base64, ...playback } = result;
  const videoBytes = Buffer.from(base64, 'base64');
  const videoFile = path.join(output, 'incontext-dynamic-overlay.webm'); fs.writeFileSync(videoFile, videoBytes);
  report.playback = { ...playback, file: rel(videoFile), bytes: videoBytes.length, sha256: hash(videoBytes), humanMotionReviewed: false };
  report.frameChecks = await page.evaluate(() => ({ overlayPresent: Boolean(window.__dynamicOverlay?.canvas?.isConnected), canvasCount: document.querySelectorAll('canvas').length, pausedStatus: window.xiyou?.engine?.state?.status, underlyingTime: window.xiyou?.engine?.state?.time }));
  await page.evaluate(() => window.__dynamicOverlay?.cancel());
  report.checks = {
    realUiEntry: report.sceneBeforeOverlay?.screen === 'game' && report.sceneBeforeOverlay?.status === 'playing',
    underlyingEnemyPresent: Number(report.sceneBeforeOverlay?.enemies || 0) > 0,
    candidatePagesDecoded: report.overlay?.sourceImages?.v1?.[0] === 1774 && report.overlay?.sourceImages?.patch?.[0] === 2172,
    fiveStatesAnimated: report.playback?.states?.includes('idle') && report.playback?.states?.includes('move') && report.playback?.states?.includes('attack') && report.playback?.states?.includes('hit') && report.playback?.states?.includes('death'),
    separateOverlay: report.frameChecks?.canvasCount === 2 && report.runtimeReferences.length === 0,
    underlyingFrozenWithoutPauseModal: report.frameChecks?.pausedStatus === 'playing',
    noErrorsOrExternalNetwork: !report.pageErrors.length && !report.consoleErrors.length && !report.failedRequests.length && !report.httpErrors.length && !report.externalRequests.length,
  };
  report.result = Object.values(report.checks).every(Boolean) ? 'REVIEW_INCONTEXT_CANDIDATE_DYNAMIC_OVERLAY' : 'FAIL';
} catch (error) {
  report.error = String(error?.stack || error);
} finally {
  if (context) try { await bounded(context.close(), 'context close'); report.contextClosed = true; } catch (error) { report.cleanupError = String(error); }
  if (browser) try { await bounded(browser.close(), 'browser close'); report.browserClosed = true; } catch (error) { report.cleanupError = String(error); }
  report.protectedAfter = fingerprint(); report.protectedUnchanged = JSON.stringify(report.protectedBefore) === JSON.stringify(report.protectedAfter);
  if (!report.protectedUnchanged) report.result = 'FAIL';
  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(path.join(output, 'browser.json'), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ file: rel(path.join(output, 'browser.json')), result: report.result, checks: report.checks, playback: report.playback, protectedUnchanged: report.protectedUnchanged, browserClosed: report.browserClosed, error: report.error }, null, 2));
if (report.result === 'FAIL') process.exitCode = 1;
