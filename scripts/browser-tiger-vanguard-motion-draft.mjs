import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';
import { createMotionDraft, selectDraftPose, draftPlacement } from './tiger-vanguard-motion-draft.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inputFile = 'evidence/current/tiger-vanguard/full-candidate/2026-10-13T11-20-21-840Z/candidate-table.json';
const inputHash = '8ea3d6e36fd490f5f81f8a6b13b5f1166c41c7a88c73bf1648162bdf1b91f75f';
const read = f => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const rel = f => path.relative(root, f).replaceAll('\\', '/');
const prior = read('evidence/current/tiger-vanguard/full-candidate/2026-10-13T11-20-21-840Z/browser.json');
const protectedPaths = [...Object.keys(prior.protectedBefore), inputFile];
const fingerprint = () => Object.fromEntries(protectedPaths.map(f => [f, hash(fs.readFileSync(path.join(root, f)))]));
const generatedAt = new Date().toISOString();
const output = path.join(root, 'evidence/current/tiger-vanguard/motion-draft', generatedAt.replaceAll(':', '-').replaceAll('.', '-'));
fs.mkdirSync(output, { recursive: true });
const report = { generatedAt, result: 'FAIL', scope: 'Full-state source registration/timing draft, not a production contract or game/public/FPS acceptance',
  protectedBefore: fingerprint(), selfTests: [], screenshots: [], pageErrors: [], consoleErrors: [], failedRequests: [], externalRequests: [],
  runtimeApproved: false, highFrameApproved: false, publicPass: false, serverStarted: false,
  scriptSha256: hash(fs.readFileSync(fileURLToPath(import.meta.url))),
  helperSha256: hash(fs.readFileSync(path.join(root, 'scripts/tiger-vanguard-motion-draft.mjs'))) };
const bounded = async (promise, name, ms = 15000) => { let timer; try {
  return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${name} timeout`)), ms); })]);
} finally { clearTimeout(timer); } };
let browser, context;
try {
  assert.deepEqual(report.protectedBefore, { ...prior.protectedBefore, [inputFile]: inputHash });
  const candidate = read(inputFile), draft = createMotionDraft(candidate, { file: inputFile, sha256: inputHash });
  assert.equal(draft.frames.length, 32); assert.equal(draft.runtimeApproved, false);
  assert.deepEqual(draft.frames.map(f => f.rgbaSha256), candidate.frames.map(f => f.rgbaSha256));
  assert.deepEqual(draft.frames.map(f => f.sourceRect), candidate.frames.map(f => f.sourceRect));
  assert.ok(draft.frames.every(f => Number.isFinite(f.pivot.x) && Number.isFinite(f.pivot.y)));
  report.selfTests.push('All32 input crops/pixels/page-scales retained; finite explicit draft pivots; no production approval');
  for (const [state, spec] of Object.entries(draft.states)) {
    assert.equal(selectDraftPose(draft, state, 0).index, spec.frames[0]);
    spec.frames.forEach((index, slot) => assert.equal(selectDraftPose(draft, state, (slot + .5) * 1000 / spec.sourcePosesPerSecond).index, index));
    const end = selectDraftPose(draft, state, spec.durationMs);
    assert.equal(end.index, spec.loop ? spec.frames[0] : state === 'death' ? 31 : 0);
    if (state === 'attack' || state === 'hit') assert.equal(selectDraftPose(draft, state, spec.durationMs, 'move').index, 8);
    report.selfTests.push(`${state}: all pose midpoints, start and exact end boundary`);
  }
  assert.equal(selectDraftPose(draft, 'death', 999999).index, 31);
  assert.equal(selectDraftPose(draft, 'death', 999999).held, true);
  assert.equal(draft.states.death.durationMs, 400);
  assert.ok(draft.states.death.durationMs <= draft.timingPolicy.eliteDeathEffectTtlSeconds * 1000);
  report.selfTests.push('Death is terminal;400ms fits existing420ms effect TTL without changing it');
  for (const value of [-1, Infinity, NaN]) assert.throws(() => selectDraftPose(draft, 'idle', value));
  assert.throws(() => selectDraftPose(draft, 'unknown', 0));
  assert.throws(() => selectDraftPose(draft, 'attack', 500, 'attack'));
  report.selfTests.push('Invalid clocks/states/resume rejected');
  for (const f of draft.frames) for (const height of [48, 64, 96]) {
    const right = draftPlacement(f, height, 1), left = draftPlacement(f, height, -1);
    assert.equal(right.scale, height / candidate.pages.find(p => p.id === f.page).standingReferenceHeight);
    assert.equal(left.scale, right.scale); assert.equal(left.x, right.x); assert.equal(left.y, right.y);
  }
  const airborne = draft.frames[13];
  assert.equal(airborne.registration.rootY - candidate.frames[13].visibleRect.y - candidate.frames[13].visibleRect.h, 10);
  report.selfTests.push('Only per-page scale and horizontal mirror; move13 retains10 source-pixel airborne gap');
  report.syntheticClocks = [];
  for (const stepMs of [1000 / 60, 50]) for (const state of Object.keys(draft.states)) {
    const seen = new Set(); for (let time = 0; time < draft.states[state].durationMs - 1e-7; time += stepMs) seen.add(selectDraftPose(draft, state, time).index);
    assert.deepEqual([...seen], draft.states[state].frames);
    report.syntheticClocks.push({ stepMs, state, seen: [...seen], simulatedClockOnly: true });
  }
  report.selfTests.push('Synthetic20/60Hz clocks visit all source poses; not browser/game performance');
  const draftFile = path.join(output, 'motion-draft.json'); fs.writeFileSync(draftFile, JSON.stringify(draft, null, 2));
  report.draft = { file: rel(draftFile), sha256: hash(fs.readFileSync(draftFile)) };
  const sources = candidate.pages.map(p => {
    const bytes = fs.readFileSync(path.join(root, p.file)); assert.equal(hash(bytes), p.sha256);
    return { ...p, src: `data:image/png;base64,${bytes.toString('base64')}` };
  });
  const pw = await loadPlaywright(); browser = await pw.chromium.launch(browserLaunchOptions()); report.browser = browser.version();
  context = await browser.newContext({ viewport: { width: 1440, height: 1190 }, deviceScaleFactor: 1 });
  const page = await context.newPage(); page.setDefaultTimeout(15000);
  page.on('pageerror', e => report.pageErrors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
  page.on('requestfailed', r => report.failedRequests.push(r.url()));
  page.on('request', r => { if (/^https?:/.test(r.url())) report.externalRequests.push(r.url()); });
  await page.route('http://**/*', r => r.abort()); await page.route('https://**/*', r => r.abort());
  await page.setContent('<!doctype html><meta charset="utf-8"><title>虎先锋根点/时序草案·REVIEW</title><style>body{margin:0;background:#eee6d1}canvas{display:block}</style><canvas width="1440" height="1190"></canvas>');
  await page.addScriptTag({ content: `window.selectDraftPose = ${selectDraftPose.toString()}; window.draftPlacement = ${draftPlacement.toString()};` });
  report.decoded = await bounded(page.evaluate(async ({ sources, candidate, draft }) => {
    const images = {}, decoded = {}, moments = {};
    for (const p of sources) {
      const im = new Image(); im.src = p.src; await im.decode(); images[p.id] = im; decoded[p.id] = [im.naturalWidth, im.naturalHeight];
      const c = document.createElement('canvas'); c.width = p.width; c.height = p.height;
      const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0); const pixels = x.getImageData(0, 0, c.width, c.height).data;
      for (const f of candidate.frames.filter(f => f.page === p.id)) {
        let alpha = 0, sx = 0, sy = 0;
        for (let y = 0; y < f.sourceRect.h; y++) for (let xx = 0; xx < f.sourceRect.w; xx++) {
          const a = pixels[((y + f.sourceRect.y) * c.width + xx + f.sourceRect.x) * 4 + 3];
          alpha += a; sx += (xx + .5) * a; sy += (y + .5) * a;
        }
        moments[f.index] = { x: sx / alpha, y: sy / alpha, weight: alpha };
      }
    }
    const canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d');
    const clear = (title, note) => { ctx.fillStyle = '#eee6d1'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#302c24'; ctx.font = 'bold 21px sans-serif'; ctx.fillText(title, 20, 30); ctx.font = '13px sans-serif'; ctx.fillText(note, 20, 55); };
    const paint = (index, x, y, height, facing, policy, target = ctx) => {
      const f = draft.frames[index], r = f.sourceRect, d = window.draftPlacement(f, height, facing, policy);
      target.save(); target.translate(x, y); target.scale(facing, 1); target.drawImage(images[f.page], r.x, r.y, r.w, r.h, d.x, d.y, d.w, d.h); target.restore();
    };
    const guide = (x, y, width = 140) => { ctx.strokeStyle = '#9baf99'; ctx.beginPath(); ctx.moveTo(x - width / 2, y); ctx.lineTo(x + width / 2, y); ctx.stroke(); ctx.strokeStyle = '#c87451'; ctx.beginPath(); ctx.moveTo(x, y - 82); ctx.lineTo(x, y + 4); ctx.stroke(); };
    window.motionReview = { candidate, draft, moments, canvas, ctx, clear, paint, guide };
    return decoded;
  }, { sources, candidate, draft }), 'source decode');
  assert.deepEqual(report.decoded, { v1: [1774, 887], patch: [2172, 724] });
  const shot = async name => { const file = path.join(output, `${name}.png`), bytes = await page.screenshot({ path: file }); report.screenshots.push({ file: rel(file), sha256: hash(bytes), bytes: bytes.length }); };
  report.drift = await page.evaluate(() => {
    const { draft, candidate, moments } = window.motionReview;
    const positions = draft.frames.map(f => {
      const scale = 64 / f.standingReferenceHeight, m = moments[f.index], v = candidate.frames[f.index].visibleRect;
      return { index: f.index, state: f.state, alphaCentroidNotAnatomical: true,
        control: { x: (m.x - f.controlPivot.x) * scale, y: (m.y - f.controlPivot.y) * scale },
        draft: { x: (m.x - f.pivot.x) * scale, y: (m.y - f.pivot.y) * scale },
        draftVisibleBottomGap: (f.pivot.y - (v.y + v.h - f.sourceRect.y)) * scale };
    });
    const transitions = [];
    for (const [state, s] of Object.entries(draft.states)) {
      const pairs = s.frames.slice(1).map((to, i) => [s.frames[i], to]);
      if (s.loop) pairs.push([s.frames.at(-1), s.frames[0]]);
      for (const [from, to] of pairs) {
        const a = positions[from], b = positions[to];
        transitions.push({ state, from, to, controlDx: b.control.x - a.control.x, draftDx: b.draft.x - a.draft.x,
          controlDy: b.control.y - a.control.y, draftDy: b.draft.y - a.draft.y });
      }
    }
    return { height: 64, meaning: 'Whole-sprite alpha centroid displacement, sensitive to weapon/tail/pose. NOT pelvis motion, foot sliding or a quality score. No threshold-based animation approval.', positions, transitions };
  });
  report.clockProbes = await page.evaluate(() => {
    const { draft } = window.motionReview, probes = [];
    for (const [state, s] of Object.entries(draft.states)) for (const t of [0, s.durationMs - .001, s.durationMs, s.durationMs + 100, 10000]) {
      probes.push({ state, time: t, result: window.selectDraftPose(draft, state, t, 'move') });
    }
    return probes;
  });
  for (const probe of report.clockProbes) assert.deepEqual(probe.result, selectDraftPose(draft, probe.state, probe.time, 'move'));
  for (const [height, facing] of [[64, 1], [48, -1]]) {
    await page.evaluate(({ height, facing }) => {
      const { draft, ctx, clear, paint, guide } = window.motionReview;
      clear(`全32姿态注册对照 · ${height}px站姿参照 · ${facing === 1 ? '右向' : '左向'}`, '每状态上排=旧bbox， 下排=列根点/状态地平线草案；红线为固定根点，绿线为地平线。死亡仍含刀底部代理，不是已批准脚底。');
      Object.entries(draft.states).forEach(([state, s], row) => {
        ctx.fillStyle = '#302c24'; ctx.font = '13px sans-serif'; ctx.fillText(`${state} ${s.sourcePosesPerSecond}源姿态/s`, 10, 86 + row * 218);
        for (const [offset, policy] of [[0, 'control'], [96, 'draft']]) {
          const y = 173 + row * 218 + offset; ctx.fillStyle = '#302c24'; ctx.fillText(policy === 'control' ? '旧' : '草案', 12, y - 15);
          s.frames.forEach((index, col) => { const x = 115 + col * 175; guide(x, y); paint(index, x, y, height, facing, policy); ctx.fillStyle = '#302c24'; ctx.fillText(`#${index}`, x - 12, y + 17); });
        }
      });
    }, { height, facing });
    await shot(`registration-${height}-${facing === 1 ? 'right' : 'left'}`);
  }
  const capture = await bounded(page.evaluate(() => new Promise((resolve, reject) => {
    const { draft, canvas, ctx, clear, paint, guide } = window.motionReview;
    const mimeType = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8'].find(m => MediaRecorder.isTypeSupported(m));
    if (!mimeType) throw new Error('No native WebM codec');
    const stream = canvas.captureStream(30), recorder = new MediaRecorder(stream, { mimeType }), chunks = [];
    const seen = Object.fromEntries(Object.keys(draft.states).map(s => [s, new Set()])), transitions = [], last = {};
    const events = [{ at: 0, state: 'idle' }, { at: 1000, state: 'move' }, { at: 1700, state: 'attack' }, { at: 1900, state: 'hit' }, { at: 2150, state: 'move' }, { at: 2900, state: 'attack' }, { at: 3400, state: 'move' }, { at: 4100, state: 'death' }];
    let started, elapsedMs = 0, aborted = false;
    recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    recorder.onerror = e => { aborted = true; stream.getTracks().forEach(t => t.stop()); reject(new Error(String(e.error))); };
    recorder.onstop = async () => { try {
      stream.getTracks().forEach(t => t.stop()); const bytes = new Uint8Array(await new Blob(chunks, { type: mimeType }).arrayBuffer()); let binary = '';
      for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
      window.motionVideo = { base64: btoa(binary), mimeType };
      resolve({ base64: window.motionVideo.base64, mimeType, elapsedMs, events, transitions,
        seen: Object.fromEntries(Object.entries(seen).map(([s, set]) => [s, [...set].sort((a, b) => a - b)])), final: last,
        recordingRateRequested: 30, fpsAcceptance: false, tracksStopped: stream.getTracks().every(t => t.readyState === 'ended') });
    } catch (e) { reject(e); } };
    recorder.start();
    function tick(now) {
      if (aborted) return;
      started ??= now; elapsedMs = now - started;
      clear('全状态根点/时序草案 · 真实Edge源序列录制', '上方：状态独立时钟，攻击/受击后回待机；底部：合成事件串（受击打断、回移动、死亡保持）。不是局内伤害/帧率验收。');
      Object.entries(draft.states).forEach(([state, s], col) => {
        const p = window.selectDraftPose(draft, state, elapsedMs);
        if (s.frames.includes(p.index)) seen[state].add(p.index);
        if (last[state] !== p.index) { transitions.push({ track: state, index: p.index, elapsedMs }); last[state] = p.index; }
        ctx.fillStyle = '#302c24'; ctx.font = '15px sans-serif'; ctx.fillText(`${state} #${p.index} / ${s.sourcePosesPerSecond}源姿态/s`, 28 + col * 280, 105);
        for (const [row, h, face] of [[0, 64, 1], [1, 48, -1]]) for (const [offset, policy] of [[0, 'control'], [105, 'draft']]) {
          const x = 155 + col * 280, y = 250 + row * 300 + offset; guide(x, y); paint(p.index, x, y, h, face, policy);
          ctx.fillStyle = '#302c24'; ctx.font = '12px sans-serif'; ctx.fillText(`${policy} ${h}px ${face === 1 ? '右' : '左'}`, x - 48, y + 20);
        }
      });
      const event = events.findLast(e => elapsedMs >= e.at), pose = window.selectDraftPose(draft, event.state, elapsedMs - event.at, 'move');
      if (last.timeline !== pose.index) { transitions.push({ track: 'timeline', state: pose.state, index: pose.index, elapsedMs }); last.timeline = pose.index; }
      ctx.fillStyle = '#302c24'; ctx.font = '16px sans-serif'; ctx.fillText(`合成打断序列 ${event.state} → ${pose.state} #${pose.index}`, 35, 835);
      for (const [x, h, face] of [[340, 96, 1], [760, 64, 1], [1140, 48, -1]]) { guide(x, 1040, 220); paint(pose.index, x, 1040, h, face, 'draft'); }
      if (elapsedMs >= 5100) recorder.stop(); else requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })), 'motion capture', 10000);
  const { base64, ...playback } = capture; report.playback = playback;
  for (const [state, s] of Object.entries(draft.states)) assert.deepEqual(playback.seen[state], s.frames);
  assert.equal(playback.final.timeline, 31); assert.equal(playback.final.death, 31);
  assert.ok(playback.transitions.some(t => t.track === 'timeline' && t.index === 24 && t.elapsedMs >= 1900 && t.elapsedMs < 2150));
  const videoBytes = Buffer.from(base64, 'base64'), videoFile = path.join(output, 'motion-draft.webm');
  assert.equal(videoBytes.subarray(0, 4).toString('hex'), '1a45dfa3'); fs.writeFileSync(videoFile, videoBytes);
  report.video = { file: rel(videoFile), bytes: videoBytes.length, sha256: hash(videoBytes), mimeType: capture.mimeType, humanMotionReviewed: false };
  await shot('playback-final-held-death');
  // Decode and seek the actual recorded bytes, not a fresh rerender. This is a
  // technical recording check, still not a human motion-quality judgement.
  report.recordingDecode = await bounded(page.evaluate(async () => {
    const { base64, mimeType } = window.motionVideo, binary = atob(base64), bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    const url = URL.createObjectURL(new Blob([bytes], { type: mimeType })), video = document.createElement('video'); video.muted = true;
    const once = event => new Promise((resolve, reject) => { video.addEventListener(event, resolve, { once: true }); video.addEventListener('error', () => reject(new Error('Recorded video decode failed')), { once: true }); });
    try {
      const loaded = once('loadeddata'); video.src = url; await loaded;
      const canvas = document.createElement('canvas'); canvas.width = video.videoWidth; canvas.height = video.videoHeight; const ctx = canvas.getContext('2d', { willReadFrequently: true }), samples = [];
      for (const time of [.2, 1.3, 2, 3.15, 4.8]) {
        const seeking = once('seeked'); video.currentTime = time; await seeking; ctx.drawImage(video, 0, 0); let code = 2166136261;
        for (const byte of ctx.getImageData(0, 0, canvas.width, canvas.height).data) code = Math.imul(code ^ byte, 16777619);
        samples.push({ requestedTime: time, actualTime: video.currentTime, signature: code >>> 0 });
      }
      return { width: video.videoWidth, height: video.videoHeight, samples, decodedDistinctSamples: new Set(samples.map(s => s.signature)).size, codecDecodeOnly: true };
    } finally { video.removeAttribute('src'); video.load(); URL.revokeObjectURL(url); }
  }), 'recorded video decode', 12000);
  assert.equal(report.recordingDecode.decodedDistinctSamples, 5);
  report.checks = { all32InputRegionsUnchanged: true, fullStateTimingBoundaries: report.selfTests.length === 10, browserNodeClockProbesMatch: true,
    all32VisitedInRealBrowser: true, syntheticHitInterruptAndTerminalDeath: true, recordedVideoReDecoded: true,
    noErrorsOrNetwork: !report.pageErrors.length && !report.consoleErrors.length && !report.failedRequests.length && !report.externalRequests.length };
  report.result = Object.values(report.checks).every(Boolean) ? 'REVIEW_FULL_STATE_REGISTRATION_TIMING_DRAFT' : 'FAIL';
} catch (error) { report.error = String(error.stack || error); }
finally {
  if (context) try { await bounded(context.close(), 'context close'); report.contextClosed = true; } catch (e) { report.cleanupError = String(e); report.result = 'FAIL'; }
  if (browser) try { await bounded(browser.close(), 'browser close'); report.browserClosed = true; } catch (e) { report.cleanupError = String(e); report.result = 'FAIL'; }
  report.protectedAfter = fingerprint(); report.protectedUnchanged = JSON.stringify(report.protectedBefore) === JSON.stringify(report.protectedAfter);
  if (!report.protectedUnchanged) report.result = 'FAIL';
  report.finishedAt = new Date().toISOString(); fs.writeFileSync(path.join(output, 'browser.json'), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ file: rel(path.join(output, 'browser.json')), result: report.result, draft: report.draft, selfTests: report.selfTests,
  checks: report.checks, video: report.video, recordingDecode: report.recordingDecode, protectedUnchanged: report.protectedUnchanged, browserClosed: report.browserClosed, error: report.error }, null, 2));
if (report.result === 'FAIL') process.exitCode = 1;
