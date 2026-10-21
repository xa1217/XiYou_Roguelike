import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'evidence/current/status-badges');
fs.mkdirSync(output, { recursive: true });
const base = process.env.XIYOU_URL || 'http://127.0.0.1:8088/';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const report = { generatedAt: new Date().toISOString(), url: base, result: 'FAIL',
  scope: 'local real Edge; not external public or WeChat device',
  pageErrors: [], failedRequests: [], screenshots: [], fixtures: [] };
let browser;
try {
  const playwright = await loadPlaywright();
  browser = await playwright.chromium.launch(browserLaunchOptions());
  report.browser = browser.version();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  page.on('pageerror', error => report.pageErrors.push(String(error)));
  page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  const shot = async name => {
    const file = path.join(output, `${name}.png`);
    const bytes = await page.screenshot({ path: file });
    const row = { name, file: path.relative(root, file).replaceAll('\\', '/'), bytes: bytes.length, sha256: hash(bytes) };
    report.screenshots.push(row); return row;
  };
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.xiyou?.enemyImages?.tiger?.__tigerBattleSprite === true);
  await page.mouse.click(195, 485);
  await page.waitForTimeout(500);
  await page.mouse.click(195, 615);
  await page.waitForFunction(() => window.xiyou?.engine?.state.status === 'playing');
  report.natural = await page.evaluate(() => {
    const g = window.xiyou, e = g.engine, r = g.renderer;
    g.cancel(g.frame); g.frame = 0; g.running = false;
    const samples = [], glyphs = [], draw = r._drawStatusBadge;
    r._drawStatusBadge = function(ctx, descriptor, ...args) {
      glyphs.push(descriptor.glyph); return draw.call(this, ctx, descriptor, ...args);
    };
    for (let i = 0; i < 240 && e.state.status !== 'lost'; i++) {
      if (e.state.status === 'upgrade') e.chooseUpgrade((e.state.choices.find(c => c.isWeapon) || e.state.choices[0]).id);
      e.update(.05, {}); g.renderDt = 0; glyphs.length = 0; g.draw();
      g.cancel(g.frame); g.frame = 0; g.running = false;
      const enemies = r._enemyDrawList;
      samples.push({ time: e.state.time, visible: enemies.length,
        normalSpeed: enemies.filter(a => a.slow === 1 && !a.stun && !a.burn?.ttl && !a.bleeds?.length && !a.knockback && !a.statusText && !a.debuff && !a.status).length,
        slowed: enemies.filter(a => a.slow > 0 && a.slow < 1).length, glyphs: [...glyphs], stats: { ...r.stats } });
    }
    r._drawStatusBadge = draw;
    return { seed: e.seed, status: e.state.status, time: e.state.time, samples,
      note: 'Normal pointer entry then 240 production updates with legal upgrade input; no debug, spawn, HP, time or enemy-state mutation.' };
  });
  await shot('natural-battle-390x844');
  await page.keyboard.press('p'); await page.waitForTimeout(500);
  const clockA = await page.evaluate(() => window.xiyou.engine.state.time);
  const pausedA = await shot('natural-paused-a');
  await page.waitForTimeout(200);
  const clockB = await page.evaluate(() => window.xiyou.engine.state.time);
  const pausedB = await shot('natural-paused-b');
  await page.keyboard.press('p'); await page.waitForTimeout(160);
  report.pause = { clockA, clockB, imageFrozen: pausedA.sha256 === pausedB.sha256,
    resumed: await page.evaluate(time => window.xiyou.engine.state.time > time, clockB) };

  // All following captures are labelled renderer-only fixtures, NOT natural
  // status triggers. Node tests separately exercise real rope enter/exit.
  await page.evaluate(async () => {
    const g = window.xiyou;
    window.__badgeAssets = { heroImages: g.heroImages, enemyImages: g.enemyImages, stage: g.engine.state.stage };
    g.dispose();
    window.__badgeRendererClass = (await import('./src/renderer.js')).GameRenderer;
    window.__tigerFrame = (await import('./src/tiger-animation.js')).tigerDrawFrame;
  });
  for (const [width, height] of [[390, 844], [360, 640]]) {
    await page.setViewportSize({ width, height });
    for (const mode of ['status', 'recovered', 'crowd']) {
      const fixture = await page.evaluate(({ width, height, mode }) => {
        window.__badgeRenderer?.dispose();
        const canvas = document.createElement('canvas');
        document.body.replaceChildren(canvas);
        document.body.style.cssText = 'margin:0;display:block;background:#ebe7d5;';
        canvas.style.cssText = `width:${width}px;height:${height}px;display:block;max-width:none;max-height:none;border:0;border-radius:0;`;
        const r = window.__badgeRenderer = new window.__badgeRendererClass(canvas, {
          width, height, pixelRatio: 1, showHud: false, battleArtMode: 'authoredFrames', ...window.__badgeAssets });
        const p = { x: 900, y: 900, radius: 18, hp: 100, maxHp: 100, animationState: 'idle', animationFrames: 2, frameIndex: 0 };
        const make = (id, x, y, extra = {}) => ({ id, x, y, radius: 15, hp: 50, maxHp: 100, kind: 'normal', variant: 'tiger',
          battleSpriteId: 'tiger-normal-v1', animationState: 'idle', animationFrames: 8, frameIndex: id % 8, facing: 0, slow: 1, ...extra });
        const cases = [ ['正常', {}], ['减速', { slow: .65 }], ['击退', { knockback: 1 }],
          ['眩晕', { stun: .4 }], ['燃烧', { burn: { ttl: 1 } }], ['流血', { bleeds: [{ ttl: 1 }] }] ];
        const enemies = mode === 'crowd'
          ? Array.from({ length: 132 }, (_, i) => make(i, 792 + (i % 12) * 19.5, 765 + Math.floor(i / 12) * 24,
            { slow: .65, kind: i === 131 ? 'elite' : 'normal', battleSpriteId: i === 131 ? undefined : 'tiger-normal-v1' }))
          : cases.map(([, extra], i) => make(i, 815 + (i % 3) * 85, i < 3 ? 785 : 995, mode === 'recovered' ? {} : extra));
        const state = { status: 'playing', time: 12, player: p, character: { id: 'wukong' }, stage: window.__badgeAssets.stage,
          battlefield: { mapAssetKey: 'doublefork' }, enemies, effects: [], gems: [], projectiles: [], damageNumbers: [] };
        const glyphs = [], draw = r._drawStatusBadge;
        r._drawStatusBadge = function(ctx, descriptor, x, y, w) {
          glyphs.push({ glyph: descriptor.glyph, x, y, width: w }); return draw.call(this, ctx, descriptor, x, y, w);
        };
        const original = JSON.stringify(state);
        const drawFixture = () => {
          glyphs.length = 0; r.render(state, 0);
          const ctx = canvas.getContext('2d'), zoom = r._zoom(p);
          ctx.fillStyle = '#201923'; ctx.font = '13px sans-serif'; ctx.textAlign = 'left';
          ctx.fillText(`渲染夹具 · ${mode} · 非自然触发`, 12, 25);
          if (mode !== 'crowd') cases.forEach(([name], i) => {
            ctx.textAlign = 'center'; ctx.fillText(mode === 'recovered' ? `${name}→恢复` : name,
              width / 2 + (enemies[i].x - r.camera.x) * zoom, height / 2 + (enemies[i].y + 25 - r.camera.y) * zoom);
          });
          ctx.textAlign = 'left'; ctx.fillText(`提示 ${r.stats.statusBadges} / 候选 ${r.stats.statusCandidates}`, 12, height - 15);
        };
        window.__drawBadgeFixture = drawFixture;
        drawFixture();
        const rects = r._statusBadgeRects.slice(0, r.stats.statusBadges).map(rect => ({ ...rect }));
        const box = { left: p.x - p.radius * 1.5, right: p.x + p.radius * 1.5, top: p.y - p.radius * 2.58, bottom: p.y + p.radius * 1.5 };
        const overlaps = (a, b) => a.left < b.right + 3 && a.right > b.left - 3 && a.top < b.bottom + 3 && a.bottom > b.top - 3;
        const view = r._view;
        const tigerClearance = enemies.filter(a => a.battleSpriteId).every(a => {
          const f = window.__tigerFrame(window.__badgeAssets.enemyImages.tiger, a.animationState, a.frameIndex, a.radius);
          return r._enemyHealthBarY(a, a.radius) + 4 < a.y + f.dy;
        });
        return { mode, width, height, glyphs: [...glyphs], rects, stats: { ...r.stats },
          checks: {
            semantic: mode === 'status' ? glyphs.map(g => g.glyph).sort().join('') === ['慢','退','晕','燃','血'].sort().join('')
              : mode === 'recovered' ? glyphs.length === 0 : glyphs.length === 12 && r.stats.statusSuppressed > 0,
            bounded: glyphs.length <= 12,
            nonOverlapping: rects.every((a, i) => rects.slice(i + 1).every(b => !overlaps(a, b))),
            avoidsPlayer: rects.every(a => !overlaps(a, box)),
            inView: rects.every(a => a.left >= view.left && a.right <= view.right && a.top >= view.top && a.bottom <= view.bottom),
            noMutation: original === JSON.stringify(state), tigerClearance,
          } };
      }, { width, height, mode });
      const a = await shot(`fixture-${mode}-${width}x${height}`);
      await page.waitForTimeout(100);
      await page.evaluate(() => window.__drawBadgeFixture());
      const b = await page.screenshot();
      fixture.checks.repeatedDrawStable = a.sha256 === hash(b);
      report.fixtures.push(fixture);
    }
  }
  await page.evaluate(() => window.__badgeRenderer.dispose());
  report.checks = {
    normalEnemiesObserved: report.natural.samples.some(s => s.normalSpeed > 0),
    noFalseSlow: report.natural.samples.every(s => s.slowed > 0 || !s.glyphs.includes('慢')),
    pauseResume: report.pause.clockA === report.pause.clockB && report.pause.imageFrozen && report.pause.resumed,
    fixtures: report.fixtures.length === 6 && report.fixtures.every(f => Object.values(f.checks).every(Boolean)),
    noErrors: report.pageErrors.length === 0 && report.failedRequests.length === 0,
  };
  report.result = Object.values(report.checks).every(Boolean) ? 'PASS' : 'FAIL';
} catch (error) {
  report.error = String(error?.stack || error);
} finally {
  if (browser) await browser.close();
  fs.writeFileSync(path.join(output, 'browser.json'), JSON.stringify(report, null, 2));
  if (report.result !== 'PASS') fs.writeFileSync(path.join(output, `browser-fail-${Date.now()}.json`), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ result: report.result, checks: report.checks, fixtures: report.fixtures.map(f => ({ mode: f.mode, width: f.width, checks: f.checks })), error: report.error }, null, 2));
if (report.result !== 'PASS') process.exitCode = 1;
