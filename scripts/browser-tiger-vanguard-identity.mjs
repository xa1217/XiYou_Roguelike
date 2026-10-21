import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const startedAt = new Date().toISOString();
const output = path.join(root, 'evidence/current/tiger-vanguard/identity', startedAt.replaceAll(':', '-').replaceAll('.', '-'));
fs.mkdirSync(output, { recursive: true });
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const fingerprint = files => Object.fromEntries(files.map(file => [file, hash(fs.readFileSync(path.join(root, file)))]));
const sources = ['prototype-2d/src/engine.js', 'prototype-2d/src/content.js', 'prototype-2d/src/renderer.js',
  'prototype-2d/src/native-ui.js', 'prototype-2d/src/battle-enemy-animation.js', 'scripts/browser-tiger-vanguard-identity.mjs'];
const report = { generatedAt: startedAt, result: 'FAIL', url: process.env.XIYOU_URL || 'http://127.0.0.1:8088/',
  scope: 'Local real Edge after pointer UI entry. Injected time/position/death fixtures are NOT naturally survived five-minute gameplay, animation-quality, FPS, ZIP, public or device acceptance.',
  inputs: fingerprint(sources), pageErrors: [], consoleErrors: [], failedRequests: [], httpErrors: [], externalRequests: [],
  candidateRequests: [], fixtures: [], screenshots: [], publicPass: false, runtimeArtIntegrated: false, releaseReady: false };
const bounded = async (promise, name, ms = 20000) => {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${name} timeout`)), ms); })]); }
  finally { clearTimeout(timer); }
};
let browser;
try {
  if (!['127.0.0.1', 'localhost'].includes(new URL(report.url).hostname)) throw new Error('Identity fixtures are local-only');
  const playwright = await loadPlaywright();
  browser = await playwright.chromium.launch(browserLaunchOptions());
  report.browser = browser.version();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  page.setDefaultTimeout(15000);
  const evaluate = (fn, arg) => bounded(page.evaluate(fn, arg), 'evaluation');
  page.on('pageerror', error => report.pageErrors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
  page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  page.on('response', response => { if (response.status() >= 400) report.httpErrors.push({ url: response.url(), status: response.status() }); });
  page.on('request', request => {
    const url = new URL(request.url());
    if (url.protocol.startsWith('http') && url.origin !== new URL(report.url).origin) report.externalRequests.push(url.href);
    if (/candidate-v[12]-sheet|tiger-vanguard|reuse-review/.test(url.pathname)) report.candidateRequests.push(url.href);
  });
  const shot = async name => {
    const file = path.join(output, `${name}.png`), bytes = await page.screenshot({ path: file });
    report.screenshots.push({ file: path.relative(root, file).replaceAll('\\', '/'), bytes: bytes.length, sha256: hash(bytes) });
  };
  await page.goto(report.url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForFunction(() => window.xiyou?.enemyImages?.snake?.__snakeBattleSprite === true);
  await page.mouse.click(195, 485);
  await page.waitForFunction(() => window.xiyou?.screen === 'select' && !window.xiyou.getUIMotionState().active);
  await page.mouse.click(195, 615);
  await page.waitForFunction(() => window.xiyou?.engine?.state?.status === 'playing' && window.xiyou.engine.state.time >= 2);
  report.uiEntry = await evaluate(() => {
    const g = window.xiyou;
    g.cancel(g.frame); g.frame = 0; g.running = false; g.renderDt = 0;
    return { status: g.engine.state.status, screen: g.screen, time: g.engine.state.time,
      debug: g.platform.debug, canvasCount: document.querySelectorAll('canvas').length,
      identityCount: g.engine.state.enemies.filter(enemy => enemy.encounterIdentity).length };
  });
  await shot('natural-ui-entry');
  for (const file of sources.slice(0, -1)) {
    const response = await page.request.get(new URL(file.replace('prototype-2d/', ''), report.url).href);
    if (response.status() !== 200 || hash(await response.body()) !== report.inputs[file]) throw new Error(`Served source mismatch: ${file}`);
  }
  report.fixtures.push(await evaluate(async () => {
    const { battleEnemyAnimation } = await import('/src/battle-enemy-animation.js');
    const g = window.xiyou, e = g.engine, s = e.state, events = [];
    // Deliberately injected timing fixture on the engine entered by real UI.
    // It does not claim the player naturally survived from 2s to 300s.
    for (const key of ['enemies', 'projectiles', 'effects', 'gems', 'damageNumbers']) s[key].length = 0;
    const onEvent = e.onEvent;
    e.onEvent = event => { if (event.encounter) events.push({ type: event.type, at: event.at }); onEvent(event); };
    e.elapsed = 299.90; s.time = e.elapsed; e.update(.05);
    const beforeCount = s.enemies.filter(enemy => enemy.encounterIdentity).length;
    e.elapsed = 299.95; s.time = e.elapsed; e.update(.05);
    const leader = s.enemies.find(enemy => enemy.encounterIdentity);
    if (!leader) throw new Error('Scheduled Vanguard has no independent identity');
    const ordinary = e.spawnEnemy('normal', 0, { variant: 'tiger' });
    const homonym = e.spawnEnemy('elite', 0, e.stage.eliteEncounters[0]);
    e.advanceSpawns();
    const identityCount = s.enemies.filter(enemy => enemy.encounterIdentity).length;
    const bossCount = s.enemies.filter(enemy => enemy.kind === 'boss').length;
    // Reposition only for inspection; preserve all combat sizes and stats.
    s.enemies = [leader, ordinary, homonym];
    for (const [enemy, x, y] of [[leader, -74, -75], [homonym, 74, -75], [ordinary, 70, 90]]) {
      enemy.x = s.player.x + x; enemy.y = s.player.y + y;
    }
    const records = [], original = g.renderer._drawEnemy;
    g.renderer._drawEnemy = function(ctx, enemy, ...args) {
      records.push({ id: enemy.id, kind: enemy.kind, name: enemy.name, encounterIdentity: enemy.encounterIdentity,
        actorId: battleEnemyAnimation(enemy)?.id || null });
      return original.call(this, ctx, enemy, ...args);
    };
    try { g.draw(); } finally { g.renderer._drawEnemy = original; }
    const pixelsWithIdentity = g.canvas.toDataURL(), identity = leader.encounterIdentity;
    leader.encounterIdentity = null; g.draw();
    const metadataOnlyPixels = pixelsWithIdentity === g.canvas.toDataURL();
    leader.encounterIdentity = identity; g.draw();
    window.__vanguardIdentityFixture = { leader, ordinary, homonym, events, battleEnemyAnimation };
    return { name: 'injected-300s-spawn-and-identity-isolation', mode: 'accelerated timing plus inspection positions', time: s.time, records,
      checks: { noneBefore300: beforeCount === 0, exactlyOneAt300: identityCount === 1,
        stableIdentity: JSON.stringify(identity) === JSON.stringify({ encounterId: 'tiger-vanguard', variant: 'tiger', actionId: 'tiger-vanguard' }),
        frozenIdentity: Object.isFrozen(identity), singleEncounterEvent: events.length === 1, noDuplicateMidBoss: bossCount === 0 && e.bossSpawned,
        ordinaryIsSeparate: ordinary.encounterIdentity === null && battleEnemyAnimation(ordinary)?.id === 'tiger-normal-v1',
        homonymUnbound: homonym.encounterIdentity === null && battleEnemyAnimation(homonym) === null,
        vanguardNotOrdinaryArt: battleEnemyAnimation(leader) === null && !leader.battleSpriteId,
        actuallyDrawn: [leader, ordinary, homonym].every(enemy => records.some(record => record.id === enemy.id)), metadataOnlyPixels } };
  }));
  await shot('scheduled-vanguard-and-unbound-controls-fixture');
  report.fixtures.push(await evaluate(() => {
    const g = window.xiyou, e = g.engine, f = window.__vanguardIdentityFixture;
    e.state.effects.length = 0; e.pools.effect.length = 0;
    e.killEnemy(f.leader);
    f.death = e.state.effects.find(effect => effect.kind === 'death');
    const before = JSON.stringify(e.state), drawn = [], original = g.renderer._drawEffect;
    g.renderer._drawEffect = function(ctx, effect) { drawn.push(effect); return original.call(this, ctx, effect); };
    try { g.draw(); } finally { g.renderer._drawEffect = original; }
    return { name: 'injected-kill-retains-death-identity', mode: 'forced kill of scheduled entity', identity: f.death.encounterIdentity,
      checks: { sameFrozenIdentity: f.death.encounterIdentity === f.leader.encounterIdentity && Object.isFrozen(f.death.encounterIdentity),
        deadElite: f.death.enemyKind === 'elite' && !e.state.enemies.includes(f.leader),
        unboundBossAndNormalArt: f.death.bossIdentity === null && f.battleEnemyAnimation(f.death) === null,
        actuallyDrawn: drawn.includes(f.death), renderPreservesState: before === JSON.stringify(e.state) } };
  }));
  await shot('vanguard-death-fixture');
  report.fixtures.push(await evaluate(() => {
    const g = window.xiyou, e = g.engine, f = window.__vanguardIdentityFixture;
    e.updateEffects(.5);
    const expired = e.state.effects.length === 0 && e.pools.effect.includes(f.death);
    e.effect({ kind: 'hit-burst', x: f.death.x, y: f.death.y, radius: 12, ttl: .01 });
    const reuseCleared = e.state.effects[0] === f.death && f.death.encounterIdentity === undefined;
    e.updateEffects(.05); e.killEnemy(f.ordinary);
    const ordinaryDeath = e.state.effects[0] === f.death && f.death.encounterIdentity === null && f.battleEnemyAnimation(f.death)?.id === 'tiger-normal-v1';
    e.updateEffects(.5);
    e.elapsed = 569.95; e.state.time = e.elapsed; e.update(.05);
    const bosses = e.state.enemies.filter(enemy => enemy.final);
    const bossesIsolated = bosses.length === 3 && bosses.every(boss => boss.encounterIdentity === null && boss.bossIdentity?.bossId && f.battleEnemyAnimation(boss) === null);
    const bossIds = bosses.map(boss => boss.bossIdentity?.bossId);
    e.state.enemies = bosses;
    for (const [i, boss] of bosses.entries()) { boss.x = e.state.player.x + [-75, 75, 0][i]; boss.y = e.state.player.y + [-110, -15, 120][i]; }
    e.pause(); const paused = JSON.stringify(e.getSnapshot()); e.update(.05);
    const pauseStable = paused === JSON.stringify(e.getSnapshot()); e.resume(); g.draw();
    return { name: 'pool-reuse-and-final-guardians', mode: 'explicit TTL steps and accelerated 570s fixture', bossIds,
      checks: { expired, reuseCleared, ordinaryDeath, bossesIsolated, distinctBossIds: new Set(bossIds).size === 3,
        vanguardNeverRespawned: f.events.length === 1 && e.state.enemies.every(enemy => !enemy.encounterIdentity), pauseStable } };
  }));
  await shot('three-guardians-with-separate-identities-fixture');
  await evaluate(() => { window.xiyou.dispose(); delete window.__vanguardIdentityFixture; });
  report.checks = { realPointerUiEntry: report.uiEntry.status === 'playing' && report.uiEntry.debug === false
      && report.uiEntry.canvasCount === 1 && report.uiEntry.time >= 2 && report.uiEntry.identityCount === 0,
    allFixtures: report.fixtures.length === 3 && report.fixtures.every(f => Object.values(f.checks).every(Boolean)),
    noErrors: !report.pageErrors.length && !report.consoleErrors.length && !report.failedRequests.length && !report.httpErrors.length,
    noCandidateOrExternalRequests: !report.candidateRequests.length && !report.externalRequests.length,
    sourcesUnchanged: JSON.stringify(fingerprint(sources)) === JSON.stringify(report.inputs) };
  report.result = Object.values(report.checks).every(Boolean) ? 'PASS' : 'FAIL';
} catch (error) { report.error = String(error?.stack || error); }
finally {
  if (browser) {
    try { await bounded(browser.close(), 'browser close', 15000); report.browserClosed = true; }
    catch (error) { report.cleanupError = String(error); report.result = 'FAIL'; }
  }
  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(path.join(output, 'browser.json'), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ output: path.relative(root, output).replaceAll('\\', '/'), result: report.result, checks: report.checks,
  fixtures: report.fixtures.map(f => ({ name: f.name, failed: Object.entries(f.checks).filter(([, pass]) => !pass).map(([name]) => name) })),
  browserClosed: report.browserClosed, error: report.error }, null, 2));
if (report.result !== 'PASS') process.exitCode = 1;
