import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const phase = process.env.XIYOU_FEEDBACK_PHASE === 'before' ? 'before' : 'after';
const output = path.join(root, 'evidence/current/feedback-overlap', phase);
fs.mkdirSync(output, { recursive: true });
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const report = {
  generatedAt: new Date().toISOString(), phase, result: 'FAIL',
  url: process.env.XIYOU_URL || 'http://127.0.0.1:8088/',
  scope: 'local real Edge; status badges versus damage-label envelopes only; no internet, ZIP, body/HUD or device approval',
  inputs: Object.fromEntries(['prototype-2d/src/renderer.js', 'prototype-2d/src/engine.js', 'scripts/browser-feedback-overlap-smoke.mjs'].map(file => [file, hash(fs.readFileSync(path.join(root, file)))])),
  pageErrors: [], consoleErrors: [], failedRequests: [], screenshots: [], fixtures: [],
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
  const evaluate = (fn, arg) => bounded(page.evaluate(fn, arg), 'evaluation');
  page.on('pageerror', error => report.pageErrors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
  page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  const shot = async name => {
    const file = path.join(output, `${name}.png`), bytes = await page.screenshot({ path: file });
    report.screenshots.push({ file: path.relative(root, file).replaceAll('\\', '/'), bytes: bytes.length, sha256: hash(bytes) });
    return hash(bytes);
  };
  await page.goto(report.url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForFunction(() => window.xiyou?.enemyImages?.snake?.__snakeBattleSprite === true);
  await page.mouse.click(195, 485); await page.waitForTimeout(350);
  await page.mouse.click(195, 615);
  await page.waitForFunction(() => window.xiyou?.engine?.state?.status === 'playing');
  report.natural = await evaluate(() => {
    const g = window.xiyou, e = g.engine;
    if (g.frame) g.cancel(g.frame);
    g.frame = 0; g.running = false;
    let steps = 0;
    while (steps++ < 500 && e.state.status !== 'lost') {
      if (e.state.status === 'upgrade') e.chooseUpgrade(e.state.choices[0].id);
      const p = e.state.player;
      const target = e.state.enemies.reduce((best, a) => !best || Math.hypot(a.x - p.x, a.y - p.y) < Math.hypot(best.x - p.x, best.y - p.y) ? a : best, null);
      e.update(.05, target ? { x: target.x - p.x, y: target.y - p.y } : {});
      g.renderDt = 0; g.draw();
      if (g.frame) g.cancel(g.frame);
      g.frame = 0; g.running = false;
      if (e.state.damageNumbers.length) break;
    }
    return { mode: 'UI entry then legal-input accelerated production simulation; not a natural status/number conflict claim',
      steps, time: e.state.time, damageNumbers: e.state.damageNumbers.map(n => ({ ...n })),
      battleArtMode: g.renderer.battleArtMode, battleSceneMode: g.renderer.battleSceneMode, mapAssetDraws: g.renderer.mapAssetDraws };
  });
  await shot('natural-damage');
  await evaluate(async () => {
    const g = window.xiyou;
    window.__overlapAssets = { heroImages: g.heroImages, enemyImages: g.enemyImages, stage: g.engine.state.stage };
    g.dispose(); window.__overlapRendererClass = (await import('./src/renderer.js')).GameRenderer;
  });
  for (const [width, height] of [[390, 844], [360, 640]]) {
    await page.setViewportSize({ width, height });
    const fixture = await evaluate(({ width, height }) => {
      window.__overlapRenderer?.dispose();
      const canvas = document.createElement('canvas'); document.body.replaceChildren(canvas);
      document.body.style.cssText = 'margin:0;display:block;background:#ebe7d5;';
      canvas.style.cssText = `width:${width}px;height:${height}px;display:block;max-width:none;max-height:none;border:0;border-radius:0;`;
      const r = window.__overlapRenderer = new window.__overlapRendererClass(canvas, {
        width, height, pixelRatio: 1, showHud: false, battleArtMode: 'authoredFrames', ...window.__overlapAssets });
      const p = { x: 900, y: 900, radius: 18, hp: 100, maxHp: 100, animationState: 'idle', animationFrames: 2, frameIndex: 0 };
      const enemies = [[832, 797], [968, 797], [832, 1010], [968, 1010]].map(([x, y], i) => ({
        id: i, x, y, radius: 15, hp: 50, maxHp: 100, kind: 'normal', variant: 'tiger', battleSpriteId: 'tiger-normal-v1',
        animationState: 'idle', animationFrames: 8, frameIndex: i, facing: 0, slow: .65,
      }));
      const bases = enemies.map(a => r._enemyHealthBarY(a, 15) - 11);
      const labels = [
        { x: enemies[0].x, y: bases[0], damage: 23, size: 17, ttl: 1, maxTtl: 1 },
        ...[0, -38].map(offset => ({ x: enemies[1].x, y: bases[1] + offset, damage: 105, critical: true, size: 22, ttl: 1, maxTtl: 1 })),
        { x: enemies[3].x, y: bases[3] + 14, damage: '0.8', size: 17, ttl: .5, maxTtl: 1 },
      ];
      const state = { status: 'paused', time: 12, player: p, character: { id: 'wukong' }, stage: window.__overlapAssets.stage,
        battlefield: { mapAssetKey: 'doublefork' }, enemies, effects: [], gems: [], projectiles: [], damageNumbers: labels };
      const ctx = canvas.getContext('2d'), badges = [], glyphs = [];
      const drawBadge = r._drawStatusBadge.bind(r), fillText = ctx.fillText.bind(ctx);
      r._drawStatusBadge = (context, descriptor, x, y, w) => {
        badges.push({ x, y, left: x - w / 2, right: x + w / 2, top: y - 8, bottom: y + 8 });
        return drawBadge(context, descriptor, x, y, w);
      };
      ctx.fillText = (...args) => {
        if (['23', '105', '0.8'].includes(String(args[0]))) {
          const matrix = ctx.getTransform();
          glyphs.push({ text: String(args[0]), matrix: [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f], fillStyle: ctx.fillStyle, font: ctx.font });
        }
        return fillText(...args);
      };
      // Independent conservative envelope from actual Canvas font metrics;
      // the real transform is separately captured above, not production slots.
      const bounds = labels.map(label => {
        const progress = 1 - label.ttl / label.maxTtl, theta = Math.sin((label.x + label.y) * .03) * .08;
        ctx.font = `900 ${label.size}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const metrics = ctx.measureText(String(label.damage)), outline = (label.critical ? 3.5 : 2.8) / 2;
        const burst = 9 + Math.min(90, Number(label.damage)) * .045 + 1.6;
        const halfW = Math.max(burst, Math.max(metrics.width / 2, metrics.actualBoundingBoxLeft, metrics.actualBoundingBoxRight) + outline);
        const halfH = Math.max(burst, Math.max(label.size * .6, metrics.actualBoundingBoxAscent, metrics.actualBoundingBoxDescent) + outline);
        const rx = Math.abs(Math.cos(theta)) * halfW + Math.abs(Math.sin(theta)) * halfH;
        const ry = Math.abs(Math.sin(theta)) * halfW + Math.abs(Math.cos(theta)) * halfH;
        return { left: label.x - rx, right: label.x + rx, top: label.y - progress * 28 - ry, bottom: label.y - progress * 28 + ry };
      });
      const original = JSON.stringify(state);
      const draw = () => {
        badges.length = 0; glyphs.length = 0; r.render(state, 0);
        ctx.fillStyle = '#201923'; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('Renderer fixture: status vs damage (not natural)', 10, 24);
        ctx.fillText(`Status ${r.stats.statusBadges}/4; damage labels ${labels.length}`, 10, height - 18);
      };
      window.__drawOverlapFixture = draw; draw();
      const overlap = (a, b) => a.left < b.right + 3 && a.right > b.left - 3 && a.top < b.bottom + 3 && a.bottom > b.top - 3;
      const result = { width, height, badges: badges.map(b => ({ ...b })), glyphs: structuredClone(glyphs), damageBounds: bounds,
        stats: { ...r.stats }, checks: {
          avoidsDamage: badges.every(a => bounds.every(b => !overlap(a, b))),
          boundedSlots: badges.every(b => enemies.some((e, i) => e.x === b.x && [0, -19, -38].some(offset => Math.abs(b.y - bases[i] - offset) < 1e-6))),
          allDamageDrawn: glyphs.map(g => g.text).join(',') === labels.map(a => String(a.damage)).join(','),
          noMutation: JSON.stringify(state) === original,
          expectedStatusPolicy: badges.length === 3 && r.stats.statusSuppressed === 1 && badges.some(b => b.x === enemies[2].x && b.y === bases[2]),
          mapModes: r.battleArtMode === 'authoredFrames' && r.battleSceneMode === 'vector' && r.mapAssetDraws === 0,
        } };
      return result;
    }, { width, height });
    const firstHash = await shot(`fixture-${width}x${height}`);
    await evaluate(() => window.__drawOverlapFixture());
    fixture.checks.repeatedDrawStable = firstHash === hash(await page.screenshot());
    report.fixtures.push(fixture);
  }
  await evaluate(() => window.__overlapRenderer.dispose());
  report.checks = {
    naturalDamageObserved: report.natural.damageNumbers.length > 0,
    fixtureChecks: report.fixtures.length === 2 && report.fixtures.every(f => Object.values(f.checks).every(Boolean)),
    noErrors: !report.pageErrors.length && !report.consoleErrors.length && !report.failedRequests.length,
  };
  report.result = phase === 'before' && report.fixtures.some(f => !f.checks.avoidsDamage) && report.checks.noErrors
    ? 'OBSERVED_BASELINE_DEFECT' : Object.values(report.checks).every(Boolean) ? 'PASS' : 'FAIL';
} catch (error) { report.error = String(error?.stack || error); }
finally {
  if (browser) { try { await bounded(browser.close(), 'cleanup', 15000); report.browserClosed = true; } catch (error) { report.cleanupError = String(error); report.result = 'FAIL'; } }
  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(path.join(output, 'browser.json'), JSON.stringify(report, null, 2));
  if (report.result === 'FAIL') fs.writeFileSync(path.join(output, `failure-${Date.now()}.json`), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ phase, result: report.result, checks: report.checks, fixtures: report.fixtures.map(f => f.checks), error: report.error }, null, 2));
if (report.result === 'FAIL') process.exitCode = 1;
