import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stamp = new Date().toISOString().replaceAll(':', '-').replace(/\.\d{3}Z$/, 'Z');
const output = path.join(root, 'evidence', 'current', 'player-damage-overlap', stamp);
fs.mkdirSync(output, { recursive: true });
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const report = {
  generatedAt: new Date().toISOString(),
  result: 'FAIL',
  url: process.env.XIYOU_URL || 'http://127.0.0.1:8088/',
  scope: 'local real Edge; player-body conservative envelope versus damage labels; no HUD, health-bar, number-to-number, internet, ZIP or device approval',
  pageErrors: [], consoleErrors: [], failedRequests: [], screenshots: [],
};
const bounded = async (promise, label, ms = 20000) => {
  let timer;
  try {
    return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${label} timeout`)), ms); })]);
  } finally { clearTimeout(timer); }
};
const overlap = (a, b, pad = 3) => a.left < b.right + pad && a.right > b.left - pad && a.top < b.bottom + pad && a.bottom > b.top - pad;
const playerBox = player => {
  const radius = Math.max(9, Math.min(52, Number(player.radius) || 18));
  return { left: Number(player.x) - radius * 1.5, right: Number(player.x) + radius * 1.5,
    top: Number(player.y) - radius * 2.58, bottom: Number(player.y) + radius * 1.5 };
};
let browser;
try {
  const playwright = await loadPlaywright();
  browser = await playwright.chromium.launch(browserLaunchOptions());
  report.browser = browser.version();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  page.setDefaultTimeout(20000);
  page.on('pageerror', error => report.pageErrors.push(String(error?.stack || error)));
  page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
  page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  const shot = async name => {
    const file = path.join(output, `${name}.png`);
    const bytes = await page.screenshot({ path: file });
    report.screenshots.push({ file: path.relative(root, file).replaceAll('\\', '/'), bytes: bytes.length, sha256: hash(bytes) });
  };

  await page.goto(`${report.url}?debug=1`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(250);
  await page.mouse.click(195, 485);
  await page.waitForTimeout(250);
  await page.mouse.click(195, 615);
  await page.waitForFunction(() => window.xiyou?.engine?.state?.status === 'playing');
  await page.waitForTimeout(5000);
  report.natural = await page.evaluate(() => {
    const g = window.xiyou, s = g?.engine?.state;
    return { damageNumbers: s?.damageNumbers?.map(item => ({ ...item })) || [], time: s?.time || 0, status: s?.status || null,
      battleArtMode: g?.renderer?.battleArtMode || null, battleSceneMode: g?.renderer?.battleSceneMode || null };
  });
  await shot('natural-battle');

  report.accelerated = await page.evaluate(() => {
    const g = window.xiyou, e = g?.engine;
    if (!g || !e) return { observed: false, reason: 'game-not-ready' };
    if (g.frame) g.cancel(g.frame); g.frame = 0; g.running = false;
    let steps = 0;
    while (steps++ < 700 && e.state.status !== 'lost' && !e.state.damageNumbers.length) {
      if (e.state.status === 'upgrade') e.chooseUpgrade(e.state.choices[0].id);
      const p = e.state.player;
      const target = e.state.enemies.reduce((best, item) => !best || Math.hypot(item.x - p.x, item.y - p.y) < Math.hypot(best.x - p.x, best.y - p.y) ? item : best, null);
      e.update(.05, target ? { x: target.x - p.x, y: target.y - p.y } : {});
      g.renderDt = 0; g.draw();
      if (g.frame) g.cancel(g.frame); g.frame = 0; g.running = false;
    }
    return { observed: e.state.damageNumbers.length > 0, steps, time: e.state.time, damageNumbers: e.state.damageNumbers.map(item => ({ ...item })) };
  });

  report.fixture = await page.evaluate(async () => {
    const g = window.xiyou;
    const { GameRenderer } = await import('./src/renderer.js');
    const canvas = document.createElement('canvas'); canvas.width = 390; canvas.height = 844;
    const renderer = new GameRenderer(canvas, { width: 390, height: 844, pixelRatio: 1, showHud: false, battleArtMode: 'authoredFrames', battleSceneMode: 'vector' });
    renderer._view = { left: 0, right: 1800, top: 0, bottom: 1800 };
    const player = { x: 900, y: 900, radius: 18, hp: 100, maxHp: 100 };
    const near = { id: 'near', x: 900, y: 910, radius: 15, hp: 90, maxHp: 100, kind: 'normal', variant: 'wolf', statusText: '眩晕' };
    const nearLabel = { x: 900, y: 887, damage: 7, ttl: 1, maxTtl: 1, size: 17 };
    const state = { status: 'paused', time: 12, player, enemies: [near], damageNumbers: [nearLabel] };
    const before = JSON.stringify(state);
    const original = renderer._drawCombatFeedback;
    let renderOptions;
    renderer._drawCombatFeedback = function wrapped(...args) { renderOptions = args[3]; return original.apply(this, args); };
    renderer._drawCombatFeedback(renderer.ctx, state, state.enemies, { avoidPlayer: true });
    const firstRect = renderer._damageLabelRects[0] ? { ...renderer._damageLabelRects[0] } : null;
    const firstStats = { ...renderer.stats };
    const firstCount = renderer.stats.damagePlayerMoved;
    const stateUnchanged = JSON.stringify(state) === before;
    renderer._drawCombatFeedback(renderer.ctx, state, state.enemies, { avoidPlayer: true });
    const secondRect = renderer._damageLabelRects[0] ? { ...renderer._damageLabelRects[0] } : null;
    const repeated = JSON.stringify(firstRect) === JSON.stringify(secondRect) && firstCount === renderer.stats.damagePlayerMoved;
    const radius = Math.max(9, Math.min(52, Number(player.radius) || 18));
    const body = { left: Number(player.x) - radius * 1.5, right: Number(player.x) + radius * 1.5,
      top: Number(player.y) - radius * 2.58, bottom: Number(player.y) + radius * 1.5 };
    const intersects = (a, b, pad = 3) => a.left < b.right + pad && a.right > b.left - pad && a.top < b.bottom + pad && a.bottom > b.top - pad;
    const nearAvoided = Boolean(firstRect) && !intersects(firstRect, body);

    const far = { x: 1200, y: 1000, damage: 7, ttl: 1, maxTtl: 1, size: 17 };
    renderer._drawCombatFeedback(renderer.ctx, { player, enemies: [], damageNumbers: [far] }, [], { avoidPlayer: true });
    const farRect = renderer._damageLabelRects[0] ? { ...renderer._damageLabelRects[0] } : null;
    const expectedFarY = far.y;
    const farUnmoved = Boolean(farRect) && Math.abs((farRect.top + farRect.bottom) / 2 - expectedFarY) < 1e-6 && renderer.stats.damagePlayerMoved === 0;

    // Keep a valid but deliberately tiny viewport so every finite candidate
    // is rejected by the same world-bound check used in production.
    renderer._view = { left: 899.999, right: 900.001, top: 899.999, bottom: 900.001 };
    const crowded = { x: 900, y: 900, damage: 999, ttl: 1, maxTtl: 1, size: 24 };
    renderer._drawCombatFeedback(renderer.ctx, { player, enemies: [], damageNumbers: [crowded] }, [], { avoidPlayer: true });
    const unresolved = renderer.stats.damagePlayerUnresolved >= 1 && renderer.stats.damagePlayerMoved === 0;
    renderer._view = { left: 0, right: 1800, top: 0, bottom: 1800 };
    const productionState = { ...state, enemies: [], damageNumbers: [] };
    renderer.render(productionState, 0);
    const productionPassesAvoidance = Boolean(renderOptions?.avoidPlayer === true);
    const fixture = { nearRect: firstRect, body, firstStats, nearAvoided, stateUnchanged, repeated, farRect, farUnmoved,
      unresolved, productionPassesAvoidance, rendererStatsAfter: { ...renderer.stats } };
    renderer.dispose();
    return fixture;
  });
  report.checks = {
    acceleratedDamageObserved: Boolean(report.accelerated?.observed),
    naturalOrAcceleratedEvidence: Boolean(report.natural?.damageNumbers?.length || report.accelerated?.observed),
    nearDamageAvoided: Boolean(report.fixture?.nearAvoided),
    noInputMutation: Boolean(report.fixture?.stateUnchanged),
    repeatStable: Boolean(report.fixture?.repeated),
    farDamageUnmoved: Boolean(report.fixture?.farUnmoved),
    unresolvedStillDraws: Boolean(report.fixture?.unresolved),
    renderEnablesAvoidance: Boolean(report.fixture?.productionPassesAvoidance),
    noErrors: !report.pageErrors.length && !report.consoleErrors.length && !report.failedRequests.length,
  };
  report.result = Object.values(report.checks).every(Boolean) ? 'PASS' : 'FAIL';
} catch (error) {
  report.error = String(error?.stack || error);
} finally {
  if (browser) {
    try { await bounded(browser.close(), 'cleanup', 15000); report.browserClosed = true; }
    catch (error) { report.cleanupError = String(error); report.result = 'FAIL'; }
  }
  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(path.join(output, 'browser.json'), `${JSON.stringify(report, null, 2)}\n`);
}
console.log(JSON.stringify({ result: report.result, checks: report.checks, fixture: report.fixture, error: report.error, output: path.relative(root, output) }, null, 2));
if (report.result !== 'PASS') process.exitCode = 1;
