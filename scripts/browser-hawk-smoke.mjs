import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'evidence/current/hawk');
fs.mkdirSync(output, { recursive: true });
const base = process.env.XIYOU_URL || 'http://127.0.0.1:8088/';
const report = { generatedAt: new Date().toISOString(), url: base, scope: 'local real Edge; ordinary stage1 normal hawk only; not external public or WeChat device', mode: 'UI entry then legal-input accelerated production simulation plus renderer fixture', pageErrors: [], failedRequests: [], consoleErrors: [], screenshots: [], result: 'FAIL' };
const hash = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
const checkpoint = phase => { report.phase = phase; report.updatedAt = new Date().toISOString(); fs.writeFileSync(path.join(output, 'browser-runtime.json'), JSON.stringify(report, null, 2)); };
let browser;
try {
  report.result = 'RUNNING'; checkpoint('starting');
  const playwright = await loadPlaywright(); browser = await playwright.chromium.launch(browserLaunchOptions()); report.browser = browser.version();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 }); page.setDefaultTimeout(20000);
  page.on('pageerror', error => report.pageErrors.push(String(error?.stack || error)));
  page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure()?.errorText || 'failed' }));
  page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text().slice(0, 300)); });
  const shot = async name => { const file = path.join(output, `${name}.png`); const bytes = await page.screenshot({ path: file }); const row = { name, file: path.relative(root, file).replaceAll('\\', '/'), bytes: bytes.length, sha256: hash(bytes) }; report.screenshots.push(row); return row; };
  await page.goto(base, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForFunction(() => window.xiyou?.enemyImages?.hawk?.__hawkBattleSprite === true, null, { timeout: 20000 });
  await page.mouse.click(195, 485); await page.waitForTimeout(500); await page.mouse.click(195, 615);
  await page.waitForFunction(() => window.xiyou?.engine?.state?.status === 'playing', null, { timeout: 15000 });
  await page.evaluate(() => {
    const g = window.xiyou; if (g.frame) g.cancel(g.frame); g.frame = 0; g.running = false;
    const image = g.enemyImages.hawk;
    const audit = window.__hawkAudit = { seen: { idle: [], move: [], attack: [], hit: [], death: [] }, facing: [], events: { hits: 0, kills: 0 }, steps: 0, upgrades: 0, peakEnemies: 0 };
    const onEvent = g.engine.onEvent; g.engine.onEvent = event => { if (event.enemy?.battleSpriteId === 'hawk-normal-v1') { if (event.type === 'hit' && event.target === 'enemy') audit.events.hits++; if (event.type === 'kill') audit.events.kills++; } onEvent(event); };
    const drawImage = g.ctx.drawImage.bind(g.ctx); g.ctx.drawImage = (source, ...args) => {
      if (source === image && args.length >= 8) {
        const [x, y, w, h] = args, transform = g.ctx.getTransform?.();
        const frame = Object.entries(image.__hawkFrames.states).flatMap(([state, rects]) => rects.map((rect, index) => ({ ...rect, state, index }))).find(rect => rect.x === x && rect.y === y && rect.w === w && rect.h === h);
        if (frame) { const facing = transform?.a < 0 ? 'left' : 'right'; if (!audit.seen[frame.state].includes(frame.index)) audit.seen[frame.state].push(frame.index); if (!audit.facing.includes(facing)) audit.facing.push(facing); }
      }
      return drawImage(source, ...args);
    };
  });
  checkpoint('natural-production-simulation');
  for (let batch = 0; batch < 100; batch++) {
    const sample = await page.evaluate(() => {
      const g = window.xiyou, e = g.engine, a = window.__hawkAudit;
      if (g.frame) g.cancel(g.frame); g.frame = 0; g.running = false;
      for (let step = 0; step < 40 && e.state.time < 150 && e.state.status !== 'lost'; step++) {
        if (e.state.status === 'upgrade') { e.chooseUpgrade((e.state.choices.find(choice => !choice.isWeapon) || e.state.choices[0]).id); a.upgrades++; }
        const p = e.state.player; const target = e.state.enemies.filter(enemy => enemy.battleSpriteId === 'hawk-normal-v1').sort((l, r) => Math.hypot(l.x - p.x, l.y - p.y) - Math.hypot(r.x - p.x, r.y - p.y))[0];
        e.update(.05, target ? { x: target.x - p.x, y: target.y - p.y } : {}); a.steps++; a.peakEnemies = Math.max(a.peakEnemies, e.state.enemies.length); g.renderDt = 0; g.draw(); if (g.frame) g.cancel(g.frame); g.frame = 0; g.running = false;
      }
      return { time: e.state.time, status: e.state.status, seen: a.seen, facing: a.facing, events: a.events };
    });
    report.samples = report.samples || []; report.samples.push(sample);
    if (Object.values(sample.seen).map(list => list.length).join(',') === '8,8,8,4,4' && sample.facing.length === 2) break;
    if (sample.time >= 150 || sample.status === 'lost') break;
  }
  report.natural = await page.evaluate(() => { const a = window.__hawkAudit, g = window.xiyou, s = g.engine.state; return { time: s.time, status: s.status, seen: a.seen, facing: a.facing, events: a.events, steps: a.steps, upgrades: a.upgrades, peakEnemies: a.peakEnemies, mapAssetDraws: g.renderer.mapAssetDraws, battleArtMode: g.renderer.battleArtMode, battleSceneMode: g.renderer.battleSceneMode }; });
  await shot('runtime-natural-battle');
  const fixture = await page.evaluate(async () => {
    const image = window.xiyou.enemyImages.hawk; const canvas = document.createElement('canvas'); canvas.width = 896; canvas.height = 620; document.body.replaceChildren(canvas); document.body.style.cssText = 'margin:0;display:block;background:#ddd;';
    const { GameRenderer } = await import('./src/renderer.js'); const renderer = new GameRenderer(canvas, { width: 896, height: 620, pixelRatio: 1, battleArtMode: 'authoredFrames', enemyImages: { hawk: image } }); const ctx = canvas.getContext('2d'); const hashes = {};
    for (const [row, state] of ['idle', 'move', 'attack', 'hit', 'death'].entries()) { const count = image.__hawkFrames.states[state].length; for (let index = 0; index < count; index++) { const x = 56 + index * 112, y = 95 + row * 116; const actor = { x, y, radius: 15, bodyRadius: 15, kind: state === 'death' ? 'death' : 'normal', enemyKind: 'normal', variant: 'hawk', battleSpriteId: 'hawk-normal-v1', facing: index % 2 ? Math.PI : 0, animationState: state, animationFrames: count, frameIndex: index, ttl: .42, maxTtl: .42 }; if (state === 'death') renderer._drawEffect(ctx, actor); else renderer._drawEnemy(ctx, actor, { x: x + 10, y }, {}); hashes[`${state}:${index}`] = Array.from(ctx.getImageData(x - 55, y - 52, 110, 74).data).reduce((h, v) => Math.imul(h ^ v, 16777619) >>> 0, 2166136261); } }
    renderer.dispose(); return { frames: Object.keys(hashes).length, distinctRenderedCells: new Set(Object.values(hashes)).size };
  });
  report.fixture = fixture;
  report.checks = { naturalFrames: report.natural.seen.move.length === 8 && report.natural.seen.attack.length === 8 && report.natural.seen.hit.length === 4 && report.natural.seen.death.length === 4, bothOrientations: report.natural.facing.length === 2, naturalDamageAndDeath: report.natural.events.hits > 0 && report.natural.events.kills > 0, fixture32Distinct: fixture.frames === 32 && fixture.distinctRenderedCells === 32, noStaticBattleMap: report.natural.mapAssetDraws === 0, authoredVectorModes: report.natural.battleArtMode === 'authoredFrames' && report.natural.battleSceneMode === 'vector', noErrors: report.pageErrors.length === 0 && report.failedRequests.length === 0 };
  report.result = Object.values(report.checks).every(Boolean) ? 'PASS' : 'FAIL';
} catch (error) { report.result = 'FAIL'; report.error = String(error?.stack || error); }
finally { if (browser) { try { await browser.close(); report.browserClosed = true; } catch (error) { report.cleanupError = String(error); report.result = 'FAIL'; } } checkpoint('finished'); if (report.result !== 'PASS') fs.writeFileSync(path.join(output, `runtime-fail-${Date.now()}.json`), JSON.stringify(report, null, 2)); }
console.log(JSON.stringify({ result: report.result, checks: report.checks, natural: report.natural, fixture: report.fixture, error: report.error }, null, 2));
if (report.result !== 'PASS') process.exitCode = 1;
