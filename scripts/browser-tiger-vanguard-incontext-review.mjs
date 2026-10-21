import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const candidateFile = 'evidence/current/tiger-vanguard/full-candidate/2026-10-13T11-20-21-840Z/candidate-table.json';
const candidate = JSON.parse(fs.readFileSync(path.join(root, candidateFile), 'utf8'));
const motionFile = 'evidence/current/tiger-vanguard/motion-draft/2026-10-13T12-00-07-310Z/motion-draft.json';
const motion = JSON.parse(fs.readFileSync(path.join(root, motionFile), 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const rel = file => path.relative(root, file).replaceAll('\\', '/');
const generatedAt = new Date().toISOString();
const output = path.join(root, 'evidence/current/tiger-vanguard/incontext-review', generatedAt.replaceAll(':', '-').replaceAll('.', '-'));
fs.mkdirSync(output, { recursive: true });
const sourceBytes = Object.fromEntries(candidate.pages.map(page => [page.id, fs.readFileSync(path.join(root, page.file))]));
const report = {
  generatedAt, result: 'FAIL', url: process.env.XIYOU_URL || 'http://127.0.0.1:8088/native.html?debug=1',
  scope: 'Local real Edge gameplay scene with an evidence-only candidate overlay; overlay is not runtime integration or gameplay/FPS/public acceptance.',
  candidate: { file: candidateFile, sha256: hash(fs.readFileSync(path.join(root, candidateFile))), motionFile, motionSha256: hash(fs.readFileSync(path.join(root, motionFile))), frames: 32 },
  sourcePages: candidate.pages.map(page => ({ id: page.id, file: page.file, sha256: page.sha256, dimensions: [page.width, page.height] })),
  runtimeReferences: [], pageErrors: [], consoleErrors: [], failedRequests: [], httpErrors: [], externalRequests: [], screenshots: [],
  runtimeApproved: false, highFrameApproved: false, publicPass: false, overlayOnly: true,
};
const protectedFiles = ['prototype-2d/src/engine.js', 'prototype-2d/src/renderer.js', 'prototype-2d/src/battle-enemy-animation.js', 'prototype-2d/native-app.js', 'prototype-2d/assets/manifest.json', candidateFile, motionFile];
const before = Object.fromEntries(protectedFiles.map(file => [file, hash(fs.readFileSync(path.join(root, file)))]));
let browser, context;
const bounded = async (promise, name, ms = 20000) => { let timer; try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${name} timeout`)), ms); })]); } finally { clearTimeout(timer); } };
try {
  const host = new URL(report.url).hostname;
  if (!['127.0.0.1', 'localhost'].includes(host)) throw new Error('In-context fixture requires localhost');
  const sourceText = protectedFiles.filter(file => file.startsWith('prototype-2d/src/') || file === 'prototype-2d/native-app.js').map(file => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');
  report.runtimeReferences = [candidateFile, motionFile].filter(value => sourceText.includes(path.basename(value)) || sourceText.includes(value));
  if (report.runtimeReferences.length) throw new Error('Candidate unexpectedly referenced by runtime source');
  const playwright = await loadPlaywright(); browser = await playwright.chromium.launch(browserLaunchOptions()); report.browser = browser.version();
  context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const page = await context.newPage(); page.setDefaultTimeout(15000);
  page.on('pageerror', error => report.pageErrors.push(String(error?.stack || error)));
  page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
  page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure()?.errorText || null }));
  page.on('response', response => { if (response.status() >= 400) report.httpErrors.push({ url: response.url(), status: response.status() }); });
  page.on('request', request => { const u = new URL(request.url()); if (u.protocol.startsWith('http') && u.origin !== new URL(report.url).origin) report.externalRequests.push(u.href); });
  await page.goto(report.url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForFunction(() => window.xiyou?.screen === 'home');
  await page.mouse.click(195, 485);
  await page.waitForFunction(() => window.xiyou?.screen === 'select');
  await page.mouse.click(195, 615);
  await page.waitForFunction(() => window.xiyou?.engine?.state?.status === 'playing');
  await page.waitForTimeout(1200);
  await page.evaluate(() => { const g = window.xiyou; g.cancel(g.frame); g.frame = 0; g.running = false; g.engine.pause(); g.draw(); });
  const scene = await page.evaluate(() => {
    const g = window.xiyou, c = document.querySelector('canvas'), r = c.getBoundingClientRect(), s = g.engine.state;
    return { screen: g.screen, status: s.status, time: s.time, canvas: { width: c.width, height: c.height, cssWidth: r.width, cssHeight: r.height }, player: { x: s.player.x, y: s.player.y, radius: s.player.radius }, enemies: s.enemies.length, rendererMode: g.renderer?.battleSceneMode || null };
  });
  report.scene = scene;
  const pagesForBrowser = candidate.pages.map(pageInfo => ({ ...pageInfo, src: `data:image/png;base64,${sourceBytes[pageInfo.id].toString('base64')}` }));
  const overlay = await page.evaluate(async ({ pages, candidate, motion }) => {
    const base = document.querySelector('canvas'), rect = base.getBoundingClientRect(), overlay = document.createElement('canvas');
    overlay.width = 390; overlay.height = 844; overlay.style.cssText = `position:absolute;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;pointer-events:none;z-index:20`;
    base.parentElement.style.position = 'relative'; base.parentElement.appendChild(overlay);
    const ctx = overlay.getContext('2d'), images = {};
    for (const p of pages) { const image = new Image(); image.src = p.src; await image.decode(); images[p.id] = image; }
    const byIndex = Object.fromEntries(candidate.frames.map(frame => [frame.index, frame]));
    const draftByIndex = Object.fromEntries(motion.frames.map(frame => [frame.index, frame]));
    const drawFrame = (index, facing, label, tint = '#d7b45f') => {
      const frame = byIndex[index], draftFrame = draftByIndex[index], source = frame.sourceRect, scale = 86 / frame.standingReferenceHeight;
      const x = 276, ground = 474, y = ground;
      ctx.clearRect(0, 0, overlay.width, overlay.height);
      ctx.fillStyle = 'rgba(16,11,20,.72)'; ctx.fillRect(200, 278, 170, 36);
      ctx.fillStyle = '#f9e8b1'; ctx.font = 'bold 13px sans-serif'; ctx.fillText(`虎先锋候选夹具 · ${label}`, 208, 301);
      ctx.strokeStyle = '#e7d79c'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 68, ground); ctx.lineTo(x + 68, ground); ctx.stroke();
      ctx.strokeStyle = tint; ctx.beginPath(); ctx.moveTo(x, ground - 102); ctx.lineTo(x, ground + 8); ctx.stroke();
      ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(x - 44, ground - 116, 88, 6); ctx.fillStyle = '#82dc6a'; ctx.fillRect(x - 44, ground - 116, 72, 6);
      ctx.save(); ctx.translate(x, y); ctx.scale(facing, 1); ctx.drawImage(images[frame.page], source.x, source.y, source.w, source.h, -draftFrame.pivot.x * scale, -draftFrame.pivot.y * scale, source.w * scale, source.h * scale); ctx.restore();
      return { index, state: frame.state, facing, ground, root: draftFrame.pivot, label, framePage: frame.page };
    };
    window.__tigerOverlay = { drawFrame, canvas: overlay, remove: () => overlay.remove() };
    return { overlayCss: { width: rect.width, height: rect.height }, sourceImages: Object.fromEntries(Object.entries(images).map(([id, image]) => [id, [image.naturalWidth, image.naturalHeight]])), sceneOverlay: true };
  }, { pages: pagesForBrowser, candidate, motion });
  report.overlay = overlay;
  const shot = async (name) => { const file = path.join(output, `${name}.png`), bytes = await page.screenshot({ path: file }); report.screenshots.push({ file: rel(file), bytes: bytes.length, sha256: hash(bytes) }); };
  await shot('battle-scene-base-paused');
  const states = [
    ['idle', 0, 1, '待机/接地'], ['move', 13, 1, '移动/保留离地姿态'], ['attack', 19, 1, '攻击/挥刀'], ['hit', 26, -1, '受击/左向'], ['death', 31, 1, '死亡/末帧保持']
  ];
  report.frames = [];
  for (const [state, index, facing, label] of states) { report.frames.push(await page.evaluate(({ index, facing, label }) => window.__tigerOverlay.drawFrame(index, facing, label), { index, facing, label })); await shot(`battle-scene-${state}`); }
  report.frameChecks = await page.evaluate(() => ({ overlayPresent: Boolean(window.__tigerOverlay?.canvas?.isConnected), underlyingGameCanvasCount: document.querySelectorAll('canvas').length, pausedStatus: window.xiyou?.engine?.state?.status, underlyingTime: window.xiyou?.engine?.state?.time }));
  await page.evaluate(() => window.__tigerOverlay?.remove());
  report.checks = {
    realUiEntry: report.scene?.screen === 'game' && report.scene?.status === 'paused',
    candidatePagesDecoded: report.overlay?.sourceImages?.v1?.[0] === 1774 && report.overlay?.sourceImages?.patch?.[0] === 2172,
    fiveStatesDrawnInScene: report.frames?.length === 5 && new Set(report.frames.map(frame => frame.state)).size === 5,
    facingBothDirections: report.frames?.some(frame => frame.facing === -1) && report.frames?.some(frame => frame.facing === 1),
    groundAndHealthGuidesDrawn: report.frames?.every(frame => frame.root && frame.ground === 474),
    overlayWasSeparateFromRuntime: report.frameChecks?.underlyingGameCanvasCount === 2 && report.runtimeReferences.length === 0,
    noErrorsOrExternalNetwork: !report.pageErrors.length && !report.consoleErrors.length && !report.failedRequests.length && !report.httpErrors.length && !report.externalRequests.length,
  };
  report.result = Object.values(report.checks).every(Boolean) ? 'REVIEW_INCONTEXT_CANDIDATE_OVERLAY' : 'FAIL';
} catch (error) { report.error = String(error.stack || error); }
finally {
  if (context) try { await bounded(context.close(), 'context close'); report.contextClosed = true; } catch (error) { report.cleanupError = String(error); report.result = 'FAIL'; }
  if (browser) try { await bounded(browser.close(), 'browser close'); report.browserClosed = true; } catch (error) { report.cleanupError = String(error); report.result = 'FAIL'; }
  report.protectedBefore = before; report.protectedAfter = Object.fromEntries(protectedFiles.map(file => [file, hash(fs.readFileSync(path.join(root, file)))]));
  report.protectedUnchanged = JSON.stringify(report.protectedBefore) === JSON.stringify(report.protectedAfter); if (!report.protectedUnchanged) report.result = 'FAIL';
  report.finishedAt = new Date().toISOString(); fs.writeFileSync(path.join(output, 'browser.json'), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ output: rel(path.join(output, 'browser.json')), result: report.result, scene: report.scene, frames: report.frames, checks: report.checks, screenshots: report.screenshots.length, protectedUnchanged: report.protectedUnchanged, browserClosed: report.browserClosed, error: report.error }, null, 2));
if (report.result === 'FAIL') process.exitCode = 1;
