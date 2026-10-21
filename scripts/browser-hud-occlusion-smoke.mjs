import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const startedAt = new Date().toISOString();
const output = path.join(root, 'evidence/current/hud-occlusion', startedAt.replaceAll(':', '-').replaceAll('.', '-'));
fs.mkdirSync(output, { recursive: true });
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const sourceFiles = ['prototype-2d/src/renderer.js', 'prototype-2d/src/native-ui.js', 'scripts/browser-hud-occlusion-smoke.mjs'];
const protectedFiles = ['prototype-2d/src/engine.js', ...fs.readdirSync(path.join(root, 'prototype-2d/assets')).map(name => `prototype-2d/assets/${name}`),
  ...fs.readdirSync(path.join(root, 'dist')).filter(name => name.endsWith('.zip')).map(name => `dist/${name}`)]
  .filter(file => fs.statSync(path.join(root, file)).isFile());
const fingerprint = files => Object.fromEntries(files.map(file => [file, hash(fs.readFileSync(path.join(root, file)))]));
const report = {
  generatedAt: startedAt, result: 'FAIL', url: process.env.XIYOU_URL || 'http://127.0.0.1:8088/',
  scope: 'Local real Edge NativeGame HUD-band fixtures after real pointer UI entry; not natural combat conflict coverage, global/modal/pixel-perfect occlusion, internet, ZIP or device acceptance.',
  inputs: fingerprint(sourceFiles), protectedBefore: fingerprint(protectedFiles),
  pageErrors: [], consoleErrors: [], failedRequests: [], httpErrors: [], fixtures: [], screenshots: [],
  publicPass: false, wechatDevice: false,
};
const bounded = async (promise, label, ms = 20000) => {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${label} timeout`)), ms); })]); }
  finally { clearTimeout(timer); }
};
let browser;
try {
  if (!['127.0.0.1', 'localhost'].includes(new URL(report.url).hostname)) throw new Error('HUD fixtures are local-only');
  const playwright = await loadPlaywright();
  browser = await playwright.chromium.launch(browserLaunchOptions());
  report.browser = browser.version();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  page.setDefaultTimeout(20000);
  const evaluate = (fn, arg) => bounded(page.evaluate(fn, arg), 'evaluation');
  page.on('pageerror', error => report.pageErrors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
  page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  page.on('response', response => { if (response.status() >= 400) report.httpErrors.push({ url: response.url(), status: response.status() }); });
  const shot = async name => {
    const file = path.join(output, `${name}.png`), bytes = await page.screenshot({ path: file });
    report.screenshots.push({ file: path.relative(root, file).replaceAll('\\', '/'), bytes: bytes.length, sha256: hash(bytes) });
    return hash(bytes);
  };
  await page.goto(report.url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForFunction(() => window.xiyou?.enemyImages?.snake?.__snakeBattleSprite === true);
  await page.mouse.click(195, 485);
  await page.waitForFunction(() => window.xiyou?.screen === 'select' && !window.xiyou.getUIMotionState().active);
  await page.mouse.click(195, 615);
  await page.waitForFunction(() => window.xiyou?.engine?.state?.status === 'playing');
  report.uiEntry = await evaluate(() => {
    const g = window.xiyou;
    g.cancel(g.frame); g.frame = 0; g.running = false; g.renderDt = 0;
    return { screen: g.screen, status: g.engine.state.status, time: g.engine.state.time, browserDpr: window.devicePixelRatio,
      nativeDpr: g.dpr, debug: g.platform.debug, canvasCount: document.querySelectorAll('canvas').length };
  });
  for (const file of sourceFiles.slice(0, 2)) {
    const response = await page.request.get(new URL(file.replace('prototype-2d/', ''), report.url).href);
    if (response.status() !== 200 || hash(await response.body()) !== report.inputs[file]) throw new Error(`Served source mismatch: ${file}`);
  }
  const cases = [
    { name: 'default-390x844-dpr2', width: 390, height: 844 },
    { name: 'enemy-hud-390x844-dpr2', width: 390, height: 844, withEnemies: true },
    { name: 'safe-390x844-dpr2', width: 390, height: 844, safe: { top: 44, bottom: 810 }, dpr: 2 },
    { name: 'resize-360x640-dpr2', width: 360, height: 640 },
    { name: 'enemy-hud-360x640-dpr2', width: 360, height: 640, withEnemies: true },
    { name: 'safe-360x640-dpr1', width: 360, height: 640, safe: { top: 24, bottom: 616 }, dpr: 1 },
    { name: 'zero-bottom-360x640-dpr1', width: 360, height: 640, safe: { top: 24, bottom: 0 }, dpr: 1, invalidHud: true, expectedBottomInset: 640 },
    { name: 'missing-bottom-360x640-dpr1', width: 360, height: 640, safe: { top: 24 }, dpr: 1, expectedBottomInset: 12 },
    { name: 'null-bottom-360x640-dpr1', width: 360, height: 640, safe: { top: 24, bottom: null }, dpr: 1, expectedBottomInset: 12 },
    { name: 'restored-bottom-360x640-dpr1', width: 360, height: 640, safe: { top: 24, bottom: 616 }, dpr: 1, expectedBottomInset: 24 },
    { name: 'regrow-390x844-dpr2', width: 390, height: 844 },
  ];
  for (const sample of cases) {
    await page.setViewportSize({ width: sample.width, height: sample.height });
    await page.waitForFunction(({ width, height }) => window.xiyou?.w === width && window.xiyou?.h === height, sample);
    const fixture = await evaluate(sample => {
      const g = window.xiyou, r = g.renderer, s = g.engine.state, c = g.ctx;
      g.cancel(g.frame); g.frame = 0; g.running = false; g.renderDt = 0;
      if (sample.safe) g.resize(sample.width, sample.height, sample.dpr, sample.safe);
      // Explicit local fixture, never reported as naturally occurring damage.
      s.enemies = []; s.projectiles = []; s.effects = []; s.gems = []; s.damageNumbers = [];
      g.draw();
      const width = g.w, height = g.h, dpr = g.dpr, top = g.top + 135, bottom = height - g.bottom - 90;
      const view = { ...r._view };
      const seeds = [{ text: '701', sx: width / 2, sy: 65 },
        { text: '702', sx: width / 2, sy: height - (sample.invalidHud ? 45 : 20) }, { text: '703', sx: 52, sy: sample.invalidHud ? height / 2 : (top + bottom) / 2 }];
      s.damageNumbers = seeds.map(seed => ({ x: view.left + seed.sx / width * (view.right - view.left),
        y: view.top + seed.sy / height * (view.bottom - view.top), text: seed.text, damage: Number(seed.text), size: 17, ttl: 1, maxTtl: 1 }));
      if (sample.withEnemies) s.enemies = s.damageNumbers.slice(0, 2).map((label, i) => ({ id: `hud-enemy-${i}`,
        x: label.x, y: label.y, radius: 17, hp: 50, maxHp: 100, kind: 'normal', variant: 'tiger',
        battleSpriteId: 'tiger-normal-v1', animationState: 'idle', animationFrames: 8, frameIndex: 0, facing: 0 }));
      const before = JSON.stringify(s), glyphs = [], hudPaints = [], feedbackOptions = [];
      const originals = { fillText: c.fillText, fillRect: c.fillRect, feedback: r._drawCombatFeedback, render: r.render };
      let hudPhase = false;
      r.render = function(...args) { hudPhase = false; const value = originals.render.apply(this, args); hudPhase = true; return value; };
      r._drawCombatFeedback = function(...args) { feedbackOptions.push({ ...args[3] }); return originals.feedback.apply(this, args); };
      c.fillText = function(...args) {
        const seed = seeds.find(seed => seed.text === String(args[0]));
        if (!hudPhase && seed) {
          const m = c.getTransform(), metrics = c.measureText(seed.text), outline = 2.8 / 2;
          // Independent envelope from real Canvas glyph metrics and the
          // actual complete transform (including rotation, zoom and DPR).
          const halfW = Math.max(9 + 90 * .045 + 1.6, metrics.width / 2 + outline,
            Math.abs(metrics.actualBoundingBoxLeft) + outline, Math.abs(metrics.actualBoundingBoxRight) + outline);
          const halfH = Math.max(9 + 90 * .045 + 1.6, 17 * .6 + outline,
            Math.abs(metrics.actualBoundingBoxAscent) + outline, Math.abs(metrics.actualBoundingBoxDescent) + outline);
          const rx = (Math.abs(m.a) * halfW + Math.abs(m.c) * halfH) / dpr;
          const ry = (Math.abs(m.b) * halfW + Math.abs(m.d) * halfH) / dpr;
          glyphs.push({ text: seed.text, x: m.e / dpr, y: m.f / dpr, left: m.e / dpr - rx, right: m.e / dpr + rx,
            top: m.f / dpr - ry, bottom: m.f / dpr + ry, transform: [m.a, m.b, m.c, m.d, m.e, m.f] });
        }
        return originals.fillText.apply(this, args);
      };
      c.fillRect = function(...args) {
        if (hudPhase && args[0] === 0 && args[2] === width) hudPaints.push({ top: args[1], bottom: args[1] + args[3] });
        return originals.fillRect.apply(this, args);
      };
      const draw = () => { glyphs.length = 0; hudPaints.length = 0; feedbackOptions.length = 0; g.draw(); };
      let result;
      try {
        draw();
        const first = JSON.stringify(glyphs);
        draw();
        const bandRects = r._hudOcclusionRects.map(rect => ({ ...rect }));
        const projectX = x => (x - r._view.left) / (r._view.right - r._view.left) * width;
        const projectY = y => (y - r._view.top) / (r._view.bottom - r._view.top) * height;
        // Browser Canvas transforms may round through float32 internally;
        // 0.001 CSS px is well below a pixel and still catches real movement.
        const approx = (a, b) => Math.abs(a - b) < .001;
        const inside = box => box.left >= 0 && box.right <= width && box.top >= top && box.bottom <= bottom;
        const inViewport = box => box.left >= 0 && box.right <= width && box.top >= 0 && box.bottom <= height;
        result = { name: sample.name, mode: sample.safe ? 'Injected adapter safe-area/DPR fixture' : 'Real browser resize while NativeGame remains playing',
          width, height, dpr, browserDpr: window.devicePixelRatio, safe: sample.safe || { top: 0, bottom: height },
          safeBand: { top, bottom }, bottomInset: g.bottom, expectedInvalidHud: !!sample.invalidHud, view: { ...r._view }, camera: { ...r.camera },
          hudBounds: { ...r._hudScreenBounds }, bandRects, hudPaints: structuredClone(hudPaints),
          glyphs: structuredClone(glyphs), stats: { ...r.stats }, checks: {
            productionHudOption: feedbackOptions.length === 1 && feedbackOptions[0].avoidHud === true,
            allThreeDrawn: glyphs.length === 3 && glyphs.map(glyph => glyph.text).join(',') === '701,702,703',
            bottomInsetMatchesInput: sample.expectedBottomInset === undefined || g.bottom === sample.expectedBottomInset,
            hudInvalidMatchesInput: r._hudScreenBounds.invalid === !!sample.invalidHud,
            labelBoundsRespectBoundary: glyphs.length === 3 && glyphs.every(sample.invalidHud ? inViewport : inside),
            topLabelPositionPolicy: (sample.invalidHud ? approx(glyphs[0]?.y, seeds[0].sy) : glyphs[0]?.y > seeds[0].sy) && approx(glyphs[0]?.x, seeds[0].sx),
            bottomLabelPositionPolicy: (sample.invalidHud ? approx(glyphs[1]?.y, seeds[1].sy) : glyphs[1]?.y < seeds[1].sy) && approx(glyphs[1]?.x, seeds[1].sx),
            safeLabelUnchanged: approx(glyphs[2]?.x, seeds[2].sx) && approx(glyphs[2]?.y, seeds[2].sy),
            nativeHudPaintMatchesBands: hudPaints.some(p => p.top === 0 && p.bottom === top - 1)
              && hudPaints.some(p => p.bottom === top) && hudPaints.some(p => p.top === bottom),
            hudObstacleGeometry: sample.invalidHud ? (bandRects.length === 1
              && approx(projectX(bandRects[0].left), 0) && approx(projectX(bandRects[0].right), width)
              && approx(projectY(bandRects[0].top), 0) && approx(projectY(bandRects[0].bottom), height)) : (bandRects.length === 2 && bandRects.every(Boolean)
              && approx(projectY(bandRects[0].top), 0) && approx(projectY(bandRects[0].bottom), top)
              && approx(projectY(bandRects[1].top), bottom) && approx(projectY(bandRects[1].bottom), height)),
            movedCounters: sample.invalidHud
              ? r.stats.damageHudCandidates === 3 && r.stats.damageHudMoved === 0 && r.stats.damageHudUnresolved === 3
              : r.stats.damageHudCandidates === 2 && r.stats.damageHudMoved === 2 && r.stats.damageHudUnresolved === 0,
            enemyCrossingResolved: !sample.withEnemies || (r.stats.damageEnemyCandidates === 2 && r.stats.damageEnemyMoved === 2
              && r.stats.damageEnemyUnresolved === 0),
            frozenStateUnchanged: before === JSON.stringify(s), repeatedGlyphsStable: first === JSON.stringify(glyphs),
            stillPlaying: s.status === 'playing', canvasDimensions: g.canvas.width === width * dpr && g.canvas.height === height * dpr,
          } };
      } finally {
        c.fillText = originals.fillText; c.fillRect = originals.fillRect;
        r._drawCombatFeedback = originals.feedback; r.render = originals.render;
        g.cancel(g.frame); g.frame = 0; g.running = false;
      }
      return result;
    }, sample);
    const firstHash = await shot(sample.name);
    await evaluate(() => { window.xiyou.draw(); window.xiyou.cancel(window.xiyou.frame); window.xiyou.frame = 0; });
    fixture.checks.repeatedPixelsStable = firstHash === hash(await page.screenshot());
    report.fixtures.push(fixture);
  }
  await evaluate(() => window.xiyou.dispose());
  report.checks = {
    realPointerUiEntry: report.uiEntry.status === 'playing' && report.uiEntry.canvasCount === 1 && report.uiEntry.debug === false,
    allFixtures: report.fixtures.length === cases.length && report.fixtures.every(f => Object.values(f.checks).every(Boolean)),
    noErrors: !report.pageErrors.length && !report.consoleErrors.length && !report.failedRequests.length && !report.httpErrors.length,
    sourcesUnchanged: JSON.stringify(fingerprint(sourceFiles)) === JSON.stringify(report.inputs),
  };
  report.result = Object.values(report.checks).every(Boolean) ? 'PASS' : 'FAIL';
} catch (error) { report.error = String(error?.stack || error); }
finally {
  if (browser) {
    try { await bounded(browser.close(), 'browser cleanup', 15000); report.browserClosed = true; }
    catch (error) { report.cleanupError = String(error); report.result = 'FAIL'; }
  }
  report.protectedAfter = fingerprint(protectedFiles);
  report.protectedUnchanged = JSON.stringify(report.protectedBefore) === JSON.stringify(report.protectedAfter);
  if (!report.protectedUnchanged) report.result = 'FAIL';
  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(path.join(output, 'browser.json'), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ output: path.relative(root, output).replaceAll('\\', '/'), result: report.result,
  fixtures: report.fixtures.map(f => ({ name: f.name, failed: Object.entries(f.checks).filter(([, pass]) => !pass).map(([name]) => name) })),
  protectedUnchanged: report.protectedUnchanged, browserClosed: report.browserClosed, error: report.error }, null, 2));
if (report.result !== 'PASS') process.exitCode = 1;
