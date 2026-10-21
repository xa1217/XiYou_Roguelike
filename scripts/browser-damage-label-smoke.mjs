import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const phase = process.env.XIYOU_DAMAGE_PHASE === 'before' ? 'before' : 'after';
const output = path.join(root, 'evidence/current/damage-labels', phase);
fs.mkdirSync(output, { recursive: true });
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const report = {
  generatedAt: new Date().toISOString(), phase, result: 'FAIL',
  url: process.env.XIYOU_URL || 'http://127.0.0.1:8088/',
  scope: 'local workspace real Edge; damage-label paint order only; not public internet, package, global occlusion or device approval',
  inputs: Object.fromEntries(['prototype-2d/src/renderer.js', 'prototype-2d/src/engine.js', 'scripts/browser-damage-label-smoke.mjs'].map(file => [file, hash(fs.readFileSync(path.join(root, file)))])),
  pageErrors: [], consoleErrors: [], failedRequests: [], screenshots: [],
};
const bounded = async (promise, label, ms = 20000) => {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${label} timeout`)), ms); })]); }
  finally { clearTimeout(timer); }
};
let browser;
try {
  const playwright = await loadPlaywright();
  browser = await playwright.chromium.launch(browserLaunchOptions());
  report.browser = browser.version();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  page.setDefaultTimeout(20000);
  const evaluate = (fn, args) => bounded(page.evaluate(fn, args), 'evaluation');
  page.on('pageerror', error => report.pageErrors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
  page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  const shot = async name => {
    const file = path.join(output, `${name}.png`);
    const bytes = await page.screenshot({ path: file });
    report.screenshots.push({ file: path.relative(root, file).replaceAll('\\', '/'), bytes: bytes.length, sha256: hash(bytes) });
  };
  await page.goto(report.url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForFunction(() => window.xiyou?.enemyImages?.snake?.__snakeBattleSprite === true);
  await page.mouse.click(195, 485);
  await page.waitForTimeout(350);
  await page.mouse.click(195, 615);
  await page.waitForFunction(() => window.xiyou?.engine?.state?.status === 'playing');
  report.natural = await evaluate(() => {
    const g = window.xiyou, e = g.engine;
    if (g.frame) g.cancel(g.frame);
    g.frame = 0; g.running = false;
    let steps = 0, sample = null;
    while (steps++ < 800 && e.state.status !== 'lost') {
      if (e.state.status === 'upgrade') e.chooseUpgrade(e.state.choices[0].id);
      const p = e.state.player;
      const target = e.state.enemies.reduce((best, enemy) => !best || Math.hypot(enemy.x - p.x, enemy.y - p.y) < Math.hypot(best.x - p.x, best.y - p.y) ? enemy : best, null);
      e.update(.05, target ? { x: target.x - p.x, y: target.y - p.y } : {});
      g.renderDt = 0; g.draw();
      if (g.frame) g.cancel(g.frame);
      g.frame = 0; g.running = false;
      const r = g.renderer, zoom = r._zoom(p);
      const visible = e.state.damageNumbers.filter(item => {
        const x = (item.x - r.camera.x) * zoom + g.w / 2;
        const y = (item.y - (1 - item.ttl / item.maxTtl) * 28 - r.camera.y) * zoom + g.h / 2;
        return x > 40 && x < g.w - 40 && y > g.top + 170 && y < g.h - g.bottom - 115;
      });
      if (visible.length) { sample = visible.map(item => ({ ...item })); break; }
    }
    return { mode: 'UI then legal-input accelerated production simulation; no forced damage or state mutation',
      sample, steps, gameTime: e.state.time, status: e.state.status,
      battleArtMode: g.renderer.battleArtMode, battleSceneMode: g.renderer.battleSceneMode, mapAssetDraws: g.renderer.mapAssetDraws };
  });
  await shot('natural-damage');
  await evaluate(() => window.xiyou.dispose());
  await page.setViewportSize({ width: 640, height: 280 });
  report.fixture = await evaluate(async () => {
    const { GameRenderer } = await import('./src/renderer.js');
    const canvas = document.createElement('canvas'); canvas.width = 640; canvas.height = 280;
    document.body.replaceChildren(canvas); document.body.style.cssText = 'margin:0;background:#ebe7d5;';
    canvas.style.cssText = 'display:block;width:640px;height:280px;max-width:none;max-height:none;margin:0;';
    const ctx = canvas.getContext('2d');
    const renderer = new GameRenderer(canvas, { width: 640, height: 280, pixelRatio: 1, showHud: false });
    const draw = [];
    for (const op of ['fill', 'stroke', 'strokeText', 'fillText']) {
      const original = ctx[op].bind(ctx);
      ctx[op] = (...args) => { draw.push({ op, text: ['strokeText', 'fillText'].includes(op) ? String(args[0]) : null, fillStyle: ctx.fillStyle, strokeStyle: ctx.strokeStyle, lineWidth: ctx.lineWidth }); return original(...args); };
    }
    ctx.fillStyle = '#ebe7d5'; ctx.fillRect(0, 0, 640, 280);
    ctx.fillStyle = '#30271e'; ctx.font = '15px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('Production damage-label fixture (not natural gameplay)', 16, 25);
    const samples = [
      { damage: 23, size: 17, critical: false }, { damage: 105, size: 22, critical: true },
      { damage: '0.8', size: 17, critical: false }, { damage: 999, size: 22, critical: true },
    ];
    const rows = [];
    for (let i = 0; i < samples.length; i++) {
      for (const life of [1, .5]) {
        const item = { x: 80 + i * 160, y: life === 1 ? 90 : 210, ttl: 1.25 * life, maxTtl: 1.25, ...samples[i] };
        const inputBefore = JSON.stringify(item); draw.length = 0;
        renderer._drawCombatFeedback(ctx, { damageNumbers: [item] }, []);
        rows.push({ text: String(item.damage), critical: item.critical, life,
          textOnTop: draw.at(-1)?.op === 'fillText' && draw.at(-2)?.op === 'strokeText',
          burstBeforeText: draw.findIndex(v => v.op === 'fill') < draw.findIndex(v => v.op === 'strokeText'),
          outlineWidth: draw.find(v => v.op === 'strokeText')?.lineWidth,
          valuePreserved: draw.filter(v => v.op === 'fillText').every(v => v.text === String(item.damage)),
          inputUnchanged: inputBefore === JSON.stringify(item), paintOrder: draw.map(v => v.op) });
      }
    }
    renderer.dispose();
    return { rows, note: 'same 8 production-renderer samples before/after; normal/critical/integer/decimal at two lifetimes' };
  });
  await shot('label-fixture');
  report.checks = {
    naturalDamageObserved: report.natural.sample?.length > 0,
    mapModes: report.natural.battleArtMode === 'authoredFrames' && report.natural.battleSceneMode === 'vector' && report.natural.mapAssetDraws === 0,
    textOnTop: report.fixture.rows.every(item => item.textOnTop && item.burstBeforeText),
    originalValuesAndOutline: report.fixture.rows.every(item => item.valuePreserved && item.inputUnchanged && Math.abs(item.outlineWidth - (item.critical ? 3.5 : 2.8)) < 1e-6),
    noErrors: !report.pageErrors.length && !report.consoleErrors.length && !report.failedRequests.length,
  };
  report.result = phase === 'before' && !report.checks.textOnTop && report.checks.naturalDamageObserved && report.checks.noErrors
    ? 'OBSERVED_BASELINE_DEFECT' : Object.values(report.checks).every(Boolean) ? 'PASS' : 'FAIL';
} catch (error) { report.error = String(error?.stack || error); }
finally {
  if (browser) { try { await bounded(browser.close(), 'cleanup', 15000); report.browserClosed = true; } catch (error) { report.cleanupError = String(error); report.result = 'FAIL'; } }
  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(path.join(output, 'browser.json'), JSON.stringify(report, null, 2));
  if (report.result === 'FAIL') fs.writeFileSync(path.join(output, `failure-${Date.now()}.json`), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ phase, result: report.result, checks: report.checks, error: report.error }, null, 2));
if (report.result === 'FAIL') process.exitCode = 1;
