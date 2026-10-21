import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'evidence', 'current', 'public');
fs.mkdirSync(output, { recursive: true });
const playwright = await loadPlaywright();
const base = process.env.XIYOU_URL || 'http://127.0.0.1:8088/';
const browser = await playwright.chromium.launch(browserLaunchOptions());
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const consoleMessages = [], pageErrors = [], failedRequests = [], consoleErrors = [];
page.on('console', message => { if (message.type() === 'error') consoleErrors.push({ type: message.type(), text: message.text().slice(0, 300), url: message.location()?.url || '' }); });
page.on('console', message => consoleMessages.push({ type: message.type(), text: message.text().slice(0, 300) }));
page.on('pageerror', error => pageErrors.push(String(error?.stack || error).slice(0, 1000)));
page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText || 'failed' }));
const shot = async name => { const file = path.join(output, `${name}.png`); await page.screenshot({ path: file }); return { file: path.relative(root, file), bytes: fs.statSync(file).size }; };
const state = () => page.evaluate(() => {
  const g = window.xiyou, e = g?.engine, s = e?.state;
  const image = value => value ? { src: value.currentSrc || value.src || '', width: value.naturalWidth || value.width || 0, height: value.naturalHeight || value.height || 0, complete: Boolean(value.complete) } : null;
  return {
    screen: g?.screen || null, status: s?.status || null, time: s?.time || 0, enemies: s?.enemies?.length || 0,
    projectiles: s?.projectiles?.length || 0, effects: s?.effects?.length || 0, damageNumbers: s?.damageNumbers?.length || 0,
    player: s?.player ? { animationState: s.player.animationState, frameIndex: s.player.frameIndex, animationFrames: s.player.animationFrames } : null,
    mapAssetKey: s?.battlefield?.mapAssetKey || null,
    resources: { hero: image(g?.heroImages?.tangsanzang), heroes: Object.fromEntries(Object.entries(g?.heroImages || {}).map(([id, value]) => [id, image(value)])), enemy: image(g?.enemyImages?.creature), tiger: image(g?.enemyImages?.tiger), bear: image(g?.enemyImages?.bear), bull: image(g?.enemyImages?.bull), wolf: image(g?.enemyImages?.wolf), monkey: image(g?.enemyImages?.monkey), deer: image(g?.enemyImages?.deer), hawk: image(g?.enemyImages?.hawk), snake: image(g?.enemyImages?.snake), map: image(g?.mapImages?.doublefork?.back) },
    renderer: g?.renderer ? { battleArtMode: g.renderer.battleArtMode, battleSceneMode: g.renderer.battleSceneMode, mapAssetDraws: g.renderer.mapAssetDraws || 0 } : null,
    metrics: g?.getMetrics?.() || null
  };
});

const report = { generatedAt: new Date().toISOString(), url: base, buildTarget: process.env.XIYOU_BUILD || 'workspace', mode: 'public-no-debug-normal-flow', screenshots: [], consoleMessages, consoleErrors, pageErrors, failedRequests, result: 'FAIL' };
try {
  await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('canvas', { timeout: 30000 });
  const pathChecks = await page.evaluate(async () => {
    const probe = async (path) => ({ path, status: await fetch(path, { cache: 'no-store' }).then(response => response.status).catch(() => 0) });
    const allowed = await probe('/assets/hero-wukong-battle-v3-sheet.png');
    const allowedTiger = [];
    for (const path of ['/src/tiger-animation.js', '/assets/enemy-tiger-battle-v1-sheet.png', '/assets/enemy-tiger-battle-v1-frames.json']) allowedTiger.push(await probe(path));
    const allowedBear = [];
    for (const path of ['/src/bear-animation.js', '/src/battle-enemy-animation.js', '/assets/enemy-bear-battle-v1-sheet.png', '/assets/enemy-bear-battle-v1-frames.json']) allowedBear.push(await probe(path));
    const allowedBull = [];
    for (const path of ['/src/bull-animation.js', '/assets/enemy-bull-battle-v1-sheet.png', '/assets/enemy-bull-battle-v1-frames.json']) allowedBull.push(await probe(path));
    const allowedWolf = [];
    for (const path of ['/src/wolf-animation.js', '/src/battle-enemy-animation.js', '/assets/enemy-wolf-battle-v1-sheet.png', '/assets/enemy-wolf-battle-v1-frames.json']) allowedWolf.push(await probe(path));
    const allowedMonkey = [];
    for (const path of ['/src/monkey-animation.js', '/src/battle-enemy-animation.js', '/assets/enemy-monkey-battle-v1-sheet.png', '/assets/enemy-monkey-battle-v1-frames.json']) allowedMonkey.push(await probe(path));
    const allowedDeer = [];
    for (const path of ['/src/deer-animation.js', '/src/battle-enemy-animation.js', '/assets/enemy-deer-battle-v1-sheet.png', '/assets/enemy-deer-battle-v1-frames.json']) allowedDeer.push(await probe(path));
    const allowedHawk = [];
    for (const path of ['/src/hawk-animation.js', '/src/battle-enemy-animation.js', '/assets/enemy-hawk-battle-v1-sheet.png', '/assets/enemy-hawk-battle-v1-frames.json']) allowedHawk.push(await probe(path));
    const allowedSnake = [];
    for (const path of ['/src/snake-animation.js', '/assets/enemy-snake-battle-v3-sheet.png', '/assets/enemy-snake-battle-v3-frames.json']) allowedSnake.push(await probe(path));
    const runtimeContracts = [];
    for (const species of ['tiger', 'bear', 'bull', 'wolf', 'monkey', 'deer', 'hawk', 'snake']) {
      const version = species === 'snake' ? 'v3' : 'v1';
      const path = `/assets/enemy-${species}-battle-${version}-frames.json`;
      const response = await fetch(path, { cache: 'no-store' });
      const contract = await response.json();
      const fields = ['size', 'referenceBodyHeight', 'previewRootXs', 'previewBaselines', 'states', 'sourceRects'];
      const rectFields = ['index', 'state', 'x', 'y', 'w', 'h'];
      const exact = (actual, expected) => actual.length === expected.length && actual.every(key => expected.includes(key));
      const pass = response.ok && exact(Object.keys(contract), fields)
        && exact(Object.keys(contract.states || {}), ['idle', 'move', 'attack', 'hit', 'death'])
        && contract.sourceRects?.length === 32 && contract.sourceRects.every(rect => exact(Object.keys(rect), rectFields));
      runtimeContracts.push({ path, status: response.status, pass, frames: contract.sourceRects?.length || 0 });
    }
    const blocked = [];
    for (const path of ['/assets/manifest.json', '/assets/generate-art-assets.mjs', '/assets/hero-battle-v2-atlas.png', '/assets/map-doublefork-v2.png', '/assets/hero-cards-v1.png', '/tests/engine-smoke.mjs', '/%2e%2e/%2e%2e/README.md']) blocked.push(await probe(path));
    for (const path of ['/assets/enemy-snake-battle-v1-sheet.png', '/assets/enemy-snake-battle-v2-sheet.png']) blocked.push(await probe(path));
    return { allowed, allowedTiger, allowedBear, allowedBull, allowedWolf, allowedMonkey, allowedDeer, allowedHawk, allowedSnake, runtimeContracts, blocked, pass: allowed.status === 200 && allowedTiger.every(item => item.status === 200) && allowedBear.every(item => item.status === 200) && allowedBull.every(item => item.status === 200) && allowedWolf.every(item => item.status === 200) && allowedMonkey.every(item => item.status === 200) && allowedDeer.every(item => item.status === 200) && allowedHawk.every(item => item.status === 200) && allowedSnake.every(item => item.status === 200) && runtimeContracts.every(item => item.pass) && blocked.every(item => item.status === 404) };
  });
  report.pathIsolation = { ...pathChecks };
  await page.waitForFunction(() => {
    const g = window.xiyou;
    const ready = image => image && image.complete && (image.naturalWidth || image.width);
    return ['wukong', 'tangsanzang', 'bajie', 'shajing'].every(id => ready(g?.heroImages?.[id]) && g.heroImages[id].__v3BattleSprite === true)
      && ready(g?.enemyImages?.tiger) && g.enemyImages.tiger.__tigerBattleSprite === true
      && ready(g?.enemyImages?.bear) && g.enemyImages.bear.__bearBattleSprite === true
      && ready(g?.enemyImages?.bull) && g.enemyImages.bull.__bullBattleSprite === true
      && ready(g?.enemyImages?.wolf) && g.enemyImages.wolf.__wolfBattleSprite === true
      && ready(g?.enemyImages?.monkey) && g.enemyImages.monkey.__monkeyBattleSprite === true
      && ready(g?.enemyImages?.deer) && g.enemyImages.deer.__deerBattleSprite === true
      && ready(g?.enemyImages?.hawk) && g.enemyImages.hawk.__hawkBattleSprite === true
      && ready(g?.enemyImages?.snake) && g.enemyImages.snake.__snakeBattleSprite === true;
  }, null, { timeout: 60000 });
  await page.waitForTimeout(500);
  report.screenshots.push(await shot('home-390x844'));
  await page.mouse.click(195, 485);
  await page.waitForTimeout(800);
  report.screenshots.push(await shot('character-select-390x844'));
  await page.mouse.click(285, 180);
  await page.mouse.click(195, 615);
  await page.waitForFunction(() => window.xiyou?.engine?.state?.status === 'playing', null, { timeout: 15000 });
  await page.waitForTimeout(1200);
  const before = await state();
  report.screenshots.push(await shot('battle-public-390x844'));
  const frameSamples = [before.player];
  for (let i = 0; i < 8; i += 1) { await page.waitForTimeout(120); frameSamples.push((await state()).player); }
  await page.waitForTimeout(8000);
  const after = await state();
  report.screenshots.push(await shot('battle-public-9s-390x844'));
  report.before = before; report.after = after;
  report.debugDisabled = await page.evaluate(() => window.xiyou?.platform?.debug === false && window.xiyou?.engine?.debugMode === false);
  report.animation = { frameSamples, frameChanged: frameSamples.some(sample => sample?.frameIndex !== before.player?.frameIndex || sample?.animationState !== before.player?.animationState), timeAdvanced: after.time > before.time + 5 };
  const expectedProbeUrls = new Set(pathChecks.blocked.map(item => new URL(item.path, base).href));
  const isExpectedProbeError = item => expectedProbeUrls.has(item.url)
    && item.text === 'Failed to load resource: the server responded with a status of 404 (Not Found)';
  report.pathIsolation.expectedProbeConsoleErrors = consoleErrors.filter(isExpectedProbeError).length;
  report.unexpectedConsoleErrors = consoleErrors.filter(item => !isExpectedProbeError(item));
  report.result = pageErrors.length === 0 && report.unexpectedConsoleErrors.length === 0 && failedRequests.length === 0 && pathChecks.pass && report.debugDisabled && after.status === 'playing' && after.mapAssetKey === 'doublefork' && after.renderer?.battleArtMode === 'authoredFrames' && after.renderer?.battleSceneMode === 'vector' && after.renderer?.mapAssetDraws === 0 && report.animation.frameChanged && report.animation.timeAdvanced ? 'PASS' : 'FAIL';
} catch (error) { report.error = String(error?.stack || error); }
await page.evaluate(() => window.xiyou?.dispose?.()).catch(() => {});
await browser.close();
fs.writeFileSync(path.join(root, 'evidence', 'current', 'browser-public-smoke.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (report.result !== 'PASS') process.exitCode = 1;
