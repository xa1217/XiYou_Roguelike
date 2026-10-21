import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'evidence/current/bear');
fs.mkdirSync(output, { recursive: true });
const base = process.env.XIYOU_URL || 'http://127.0.0.1:8088/';
const report = { generatedAt: new Date().toISOString(), url: base, scope: 'local real Edge; not external public or WeChat device',
  mode: 'UI entry, then accelerated production update with legal movement/upgrade input; no debug or HP/spawn/kill/time mutation',
  pageErrors: [], failedRequests: [], screenshots: [], result: 'FAIL' };
const hash = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
const checkpoint = phase => {
  report.phase = phase; report.updatedAt = new Date().toISOString();
  fs.writeFileSync(path.join(output, 'browser-runtime.json'), JSON.stringify(report, null, 2));
};
const bounded = async (promise, label, ms = 15000) => {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} exceeded ${ms}ms`)), ms);
  })]); } finally { clearTimeout(timer); }
};
let browser;
try {
  report.result = 'RUNNING'; checkpoint('starting');
  const playwright = await loadPlaywright();
  browser = await playwright.chromium.launch(browserLaunchOptions());
  report.browser = browser.version();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  page.setDefaultTimeout(15000);
  const evaluate = page.evaluate.bind(page);
  page.evaluate = (fn, args) => bounded(evaluate(fn, args), 'browser evaluation');
  page.on('pageerror', error => report.pageErrors.push(String(error)));
  page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  const shot = async name => {
    const file = path.join(output, `${name}.png`);
    const bytes = await page.screenshot({ path: file });
    const row = { name, file: path.relative(root, file).replaceAll('\\', '/'), bytes: bytes.length, sha256: hash(bytes) };
    report.screenshots.push(row); return row;
  };
  await page.goto(base, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForFunction(() => window.xiyou?.enemyImages?.bear?.__bearBattleSprite === true, null, { timeout: 15000 });
  await page.mouse.click(195, 485);
  await page.waitForTimeout(500);
  await page.mouse.click(195, 615);
  await page.waitForFunction(() => window.xiyou?.engine?.state.status === 'playing');
  report.entry = await page.evaluate(() => {
    const g = window.xiyou, image = g.enemyImages.bear;
    if (g.frame) g.cancel(g.frame); g.frame = 0; g.running = false;
    const audit = window.__bearAudit = { seen: { move: [], attack: [], hit: [], death: [] }, facing: [], captured: [],
      drawCalls: [], events: { hits: 0, kills: 0 }, steps: 0, upgrades: 0, peakEnemies: 0, peakEffects: 0, renderMs: [] };
    const onEvent = g.engine.onEvent;
    g.engine.onEvent = event => {
      if (event.enemy?.battleSpriteId === 'bear-normal-v1') {
        if (event.type === 'hit' && event.target === 'enemy') audit.events.hits++;
        if (event.type === 'kill') audit.events.kills++;
      }
      onEvent(event);
    };
    const drawImage = g.ctx.drawImage.bind(g.ctx);
    g.ctx.drawImage = (source, ...args) => {
      if (source === image) {
        const [x,y,w,h,dx,dy,dw,dh] = args, transform = g.ctx.getTransform();
        const frame = Object.entries(image.__bearFrames.states).flatMap(([state, rects]) => rects.map((rect, index) => ({ ...rect, state, index })))
          .find(rect => rect.x === x && rect.y === y && rect.w === w && rect.h === h);
        const left = Math.min(transform.a * dx + transform.e, transform.a * (dx + dw) + transform.e);
        const top = transform.d * dy + transform.f;
        if (frame && left < 390 && left + Math.abs(transform.a * dw) > 0 && top > 146 && top + Math.abs(transform.d * dh) < 742) {
          const facing = transform.a < 0 ? 'left' : 'right';
          if (audit.seen[frame.state] && !audit.seen[frame.state].includes(frame.index)) audit.seen[frame.state].push(frame.index);
          if (!audit.facing.includes(facing)) audit.facing.push(facing);
          audit.drawCalls.push({ state: frame.state, index: frame.index, facing, source: [x,y,w,h], destination: [dx,dy,dw,dh], left, top });
        }
      }
      return drawImage(source, ...args);
    };
    return { seed: g.engine.seed, character: g.engine.character.id, stage: g.engine.stage.id,
      source: image.currentSrc, width: image.naturalWidth, height: image.naturalHeight,
      battleArtMode: g.renderer.battleArtMode, battleSceneMode: g.renderer.battleSceneMode };
  });
  let pauseChecked = false;
  checkpoint('natural-production-simulation');
  for (let batch = 0; batch < 100; batch++) {
    const sample = await page.evaluate(() => {
      const g = window.xiyou, e = g.engine, a = window.__bearAudit;
      if (g.frame) g.cancel(g.frame); g.frame = 0; g.running = false;
      for (let step = 0; step < 40 && e.state.time < 90 && e.state.status !== 'lost'; step++) {
        if (e.state.status === 'upgrade') {
          e.chooseUpgrade((e.state.choices.find(choice => !choice.isWeapon) || e.state.choices[0]).id); a.upgrades++;
        }
        const p = e.state.player;
        const target = e.state.enemies.filter(enemy => enemy.battleSpriteId === 'bear-normal-v1')
          .sort((l, r) => Math.hypot(l.x-p.x,l.y-p.y) - Math.hypot(r.x-p.x,r.y-p.y))[0];
        // First let naturally spawned bears approach in view for an entire
        // walk cycle; chasing immediately can interrupt the final walk pose
        // with contact/hits. This changes only legal player input, not actors.
        const corpse = e.state.effects.find(effect => effect.kind === 'death' && effect.battleSpriteId === 'bear-normal-v1'
          && Math.hypot(effect.x-p.x,effect.y-p.y) < 80);
        // Step away after a natural kill so the hero does not cover the prone
        // body in the evidence capture. Still ordinary joystick input only.
        const input = corpse ? { x: p.x-corpse.x, y: p.y-corpse.y || 1 }
          : target && a.seen.move.length === 8 ? { x: target.x-p.x, y: target.y-p.y } : {};
        e.update(.05, input); a.steps++;
        a.peakEnemies = Math.max(a.peakEnemies, e.state.enemies.length);
        a.peakEffects = Math.max(a.peakEffects, e.state.effects.length);
        a.drawCalls = []; g.renderDt = 0;
        const start = performance.now(); g.draw(); a.renderMs.push(performance.now() - start);
        if (g.frame) g.cancel(g.frame); g.frame = 0; g.running = false;
        const capture = a.drawCalls.find(call => ['move:0','attack:0','attack:7','hit:0','hit:3','death:0','death:3'].includes(`${call.state}:${call.index}`)
          && !a.captured.includes(`${call.state}:${call.index}`));
        if (capture) {
          a.captured.push(`${capture.state}:${capture.index}`);
          return { capture, time: e.state.time, seen: a.seen, facing: a.facing, status: e.state.status };
        }
        if (Object.values(a.seen).map(list => list.length).join(',') === '8,8,4,4' && a.facing.length === 2) break;
      }
      return { time: e.state.time, seen: a.seen, facing: a.facing, status: e.state.status };
    });
    if (sample.capture) {
      const saved = await shot(`natural-${sample.capture.state}-${sample.capture.index}`);
      saved.sample = sample;
    }
    if (!pauseChecked && sample.capture?.state === 'attack' && sample.status === 'playing') {
      const clocks = () => page.evaluate(() => {
        const s = window.xiyou.engine.state;
        return { time: s.time, status: s.status,
          actors: [...s.enemies, ...s.effects].filter(e => e.battleSpriteId).map(e => [e.id,e.animationState,e.frameIndex,e.frameTime,e.ttl,e.visualAttackTimer,e.visualHitTimer]) };
      });
      await page.keyboard.press('p'); await page.waitForTimeout(500);
      const a = await clocks(), imageA = await shot('runtime-paused-a');
      await page.waitForTimeout(200);
      const b = await clocks(), imageB = await shot('runtime-paused-b');
      await page.keyboard.press('p'); await page.waitForTimeout(140);
      const resumed = await clocks();
      report.pause = { a, b, resumedState: resumed, clocksFrozen: JSON.stringify(a) === JSON.stringify(b),
        imageFrozen: imageA.sha256 === imageB.sha256, resumed: resumed.time > b.time };
      pauseChecked = true;
    }
    if (Object.values(sample.seen).map(list => list.length).join(',') === '8,8,4,4' && sample.facing.length === 2) break;
    if (sample.time >= 90 || sample.status === 'lost') break;
  }
  report.natural = await page.evaluate(() => {
    const a = window.__bearAudit, g = window.xiyou, s = g.engine.state;
    const times = a.renderMs.slice().sort((l,r)=>l-r);
    return { seed: g.engine.seed, time: s.time, status: s.status, seen: a.seen, facing: a.facing, events: a.events,
      steps: a.steps, upgrades: a.upgrades, peakEnemies: a.peakEnemies, peakEffects: a.peakEffects,
      renderP95Ms: times[Math.floor(times.length*.95)], mapAssetDraws: g.renderer.mapAssetDraws,
      note: 'Accelerated real production simulation and Canvas draws; render timings are desktop samples, not phone FPS.' };
  });
  await shot('runtime-natural-battle');
  checkpoint('natural-production-captured');
  // Separate visual fixture: every authored pose through the actual renderer,
  // at its 48px body scale. These are NOT counted as naturally triggered frames.
  await page.evaluate(() => window.xiyou.dispose());
  await page.setViewportSize({ width: 896, height: 620 });
  for (const facing of [0, Math.PI]) {
    const fixture = await page.evaluate(async facing => {
      const { GameRenderer } = await import('./src/renderer.js');
      const image = window.xiyou.enemyImages.bear;
      const canvas = document.createElement('canvas');
      document.body.replaceChildren(canvas);
      document.body.style.cssText='margin:0;display:block;background:#ddd;';
      canvas.style.cssText='width:896px;height:620px;display:block;max-width:none;max-height:none;border:0;border-radius:0;';
      const renderer = new GameRenderer(canvas, { width: 896, height: 620, pixelRatio: 1, battleArtMode: 'authoredFrames', enemyImages: { bear: image } });
      const ctx = canvas.getContext('2d'); ctx.fillStyle='#ebe7d5'; ctx.fillRect(0,0,896,620);
      ctx.fillStyle='#30271e';ctx.font='16px sans-serif';ctx.fillText(`Production renderer fixture · 48px · ${facing ? 'left' : 'right'} (not natural gameplay)`,16,24);
      const hashes = {};
      for (const [row, state] of ['idle','move','attack','hit','death'].entries()) {
        const count = image.__bearFrames.states[state].length;
        for (let index=0;index<count;index++) {
          const x=56+index*112,y=95+row*116;
          const actor={x,y,radius:15,bodyRadius:15,kind:state==='death'?'death':'normal',enemyKind:'normal',variant:'bear',battleSpriteId:'bear-normal-v1',facing,
            animationState:state,animationFrames:count,frameIndex:index,ttl:.42-index*.1,maxTtl:.42};
          ctx.strokeStyle='#c0c4b1';ctx.beginPath();ctx.moveTo(x-52,y+10.5);ctx.lineTo(x+52,y+10.5);ctx.stroke();
          if(state==='death')renderer._drawEffect(ctx,actor);else renderer._drawEnemy(ctx,actor,{x:x+10,y},{});
          ctx.fillStyle='#30271e';ctx.font='12px sans-serif';ctx.fillText(`${state} ${index}`,x-25,y+35);
          hashes[`${state}:${index}`]=Array.from(ctx.getImageData(x-55,y-52,110,74).data).reduce((h,v)=>Math.imul(h^v,16777619)>>>0,2166136261);
        }
      }
      renderer.dispose();
      return { facing, frames: Object.keys(hashes).length, distinctRenderedCells: new Set(Object.values(hashes)).size };
    }, facing);
    const saved = await shot(`runtime-fixture-${facing ? 'left' : 'right'}`); saved.fixture = fixture;
  }
  report.checks = {
    naturalFrames: Object.values(report.natural.seen).map(list => list.length).join(',') === '8,8,4,4',
    naturalDamageAndDeath: report.natural.events.hits > 0 && report.natural.events.kills > 0,
    bothOrientations: report.natural.facing.length === 2,
    pauseResume: Boolean(report.pause?.clocksFrozen && report.pause.imageFrozen && report.pause.resumed),
    noStaticBattleMap: report.natural.mapAssetDraws === 0,
    boundedActors: report.natural.peakEnemies <= 220 && report.natural.peakEffects <= 160,
    fixture32Each: report.screenshots.filter(row => row.fixture).every(row => row.fixture.frames === 32 && row.fixture.distinctRenderedCells === 32),
    noErrors: report.pageErrors.length === 0 && report.failedRequests.length === 0,
  };
  report.result = Object.values(report.checks).every(Boolean) ? 'PASS' : 'FAIL';
} catch (error) {
  report.result = 'FAIL';
  report.error = String(error?.stack || error);
} finally {
  if (browser) {
    try { await bounded(browser.close(), 'browser cleanup', 5000); report.browserClosed = true; }
    catch (error) { report.cleanupError = String(error); report.result = 'FAIL'; }
  }
  checkpoint('finished');
  if (report.result !== 'PASS') fs.writeFileSync(path.join(output, `runtime-fail-${Date.now()}.json`), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ result: report.result, checks: report.checks, natural: report.natural, error: report.error }, null, 2));
if (report.result !== 'PASS') process.exitCode = 1;
