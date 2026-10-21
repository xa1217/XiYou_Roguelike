import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'evidence', 'current', 'visual');
fs.mkdirSync(output, { recursive: true });
const playwright = await loadPlaywright();
const browser = await playwright.chromium.launch(browserLaunchOptions());
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const base = process.env.XIYOU_URL || 'http://127.0.0.1:8088/';
const shots = [];
const consoleMessages = [];
const pageErrors = [];
page.on('console', message => consoleMessages.push({ type: message.type(), text: message.text().slice(0, 500) }));
page.on('pageerror', error => pageErrors.push(String(error?.stack || error).slice(0, 1000)));
const resourceReport = () => page.evaluate(() => {
  const g = window.xiyou;
  const rectKey = rect => rect ? [rect.x, rect.y, rect.w, rect.h].map(value => Number(value)).join(':') : '';
  const frameGridInfo = image => {
    if (!image) return null;
    const id = image.__battleFrameContract?.id;
    const grid = id ? image.__frameGrids?.[id] : null;
    const states = Object.fromEntries(Object.entries(grid?.states || {}).map(([state, value]) => [state, {
      frames: Number(value?.frames || 0),
      rects: Array.isArray(value?.rects) ? value.rects : []
    }]));
    const rects = Object.values(states).flatMap(value => value.rects || []);
    const independentRectKeys = [...new Set(rects.map(rectKey).filter(Boolean))];
    return {
      source: grid?.source || null,
      states,
      independentRectCount: independentRectKeys.length,
      independentRectKeys
    };
  };
  const info = image => image ? ({
    src: image.currentSrc || image.src || '',
    naturalWidth: image.naturalWidth || image.width || 0,
    naturalHeight: image.naturalHeight || image.height || 0,
    complete: Boolean(image.complete),
    priority: Boolean(image.__prioritySprite),
    v3: Boolean(image.__v3BattleSprite),
    battleFrameContract: image.__battleFrameContract || null,
    frameGrid: frameGridInfo(image),
    sourceRects: image.__sourceRects || image.__sourceRect || null
  }) : null;
  const table = value => Object.fromEntries(Object.entries(value || {}).map(([key, image]) => [key, info(image)]));
  const maps = Object.fromEntries(Object.entries(g?.mapImages || {}).map(([theme, layers]) => [theme, table(layers)]));
  return {
    heroes: table(g?.heroImages),
    enemies: table(g?.enemyImages),
    maps,
    mapAssetKey: g?.engine?.state?.battlefield?.mapAssetKey || g?.engine?.state?.stage?.mapAssetKey || null,
    renderer: g?.renderer ? {
      battleArtMode: g.renderer.battleArtMode || null,
      battleSceneMode: g.renderer.battleSceneMode || null,
      mapAssetDraws: g.renderer.mapAssetDraws || 0
    } : null,
    mapAssetDraws: g?.renderer?.mapAssetDraws || 0
  };
});
const capture = async (name) => { const file = path.join(output, `${name}.png`); await page.screenshot({ path: file, fullPage: false }); shots.push({ name, file: path.relative(root, file), bytes: fs.statSync(file).size }); };
const waitUiIdle = async (timeout = 1600) => page.waitForFunction(() => {
  const motion = window.xiyou?.getUIMotionState?.();
  return !motion || (!motion.active && !motion.pressActive);
}, null, { timeout }).catch(() => {});

await page.goto(`${base}?debug=1`, { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
await waitUiIdle();
await capture('home-390x844');
await page.mouse.click(195, 485); // 踏上西行
await waitUiIdle();
await capture('character-select-390x844');
await page.mouse.click(285, 180); // 唐三藏：真实光球弹道可见
await page.mouse.click(195, 615); // 入山
await waitUiIdle();
await page.waitForTimeout(15000);
await page.waitForFunction(() => {
  const g = window.xiyou;
  const ids = ['wukong', 'tangsanzang', 'bajie', 'shajing'];
  const ready = image => {
    const id = image?.__battleFrameContract?.id;
    const grid = id ? image.__frameGrids?.[id] : null;
    const rects = Object.values(grid?.states || {}).flatMap(state => state?.rects || []);
    const unique = new Set(rects.map(rect => [rect.x, rect.y, rect.w, rect.h].map(value => Number(value)).join(':')).filter(Boolean));
    return Boolean(image && image.complete && (image.naturalWidth || image.width) && image.__v3BattleSprite === true && unique.size >= 8);
  };
  return ids.every(id => ready(g?.heroImages?.[id]));
}, null, { timeout: 30000 }).catch(() => {});
await page.waitForFunction(() => { const s = window.xiyou?.engine?.state; return Boolean(s && (s.projectiles?.length || s.effects?.length)); }, null, { timeout: 3000 }).catch(() => {});
await capture('battle-390x844');
const battleMetrics = await page.evaluate(() => window.xiyou?.getMetrics?.() || null);
const normalBattleState = await page.evaluate(() => { const s = window.xiyou?.engine?.state; return s ? { character: s.character?.id, status: s.status, time: s.time, enemies: s.enemies?.length || 0, projectiles: s.projectiles?.map(x => x.kind) || [], effects: s.effects?.map(x => x.kind) || [], damageNumbers: s.damageNumbers?.length || 0, hp: s.player?.hp } : null; });
const naturalDamageSamples = [];
for (let i = 0; i < 8; i += 1) { await page.waitForTimeout(100); naturalDamageSamples.push(await page.evaluate(() => window.xiyou?.engine?.state?.damageNumbers?.length || 0)); }
const battleResources = await resourceReport();

// A localhost-only paused art fixture exposes every major silhouette in the
// current renderer for visual review. It does not feed gameplay or validation
// numbers; the normal battle screenshot above is the playable evidence.
const fixture = await page.evaluate(() => {
  const game = window.xiyou; const engine = game?.engine; if (!engine) return { ok: false };
  const state = engine.state; const p = state.player; engine.pause();
  const enemies = [];
  for (let i = 0; i < 5; i += 1) { const e = engine.debug('spawn', { kind: i === 3 ? 'elite' : 'normal', variant: i }); if (e) { e.x = p.x + (i - 2) * 48; e.y = p.y - 92 + (i % 2) * 44; e.statusText = i % 2 ? '眩晕' : '燃烧'; enemies.push(e); } }
  const boss = engine.spawnBoss(true); boss.x = p.x + 110; boss.y = p.y - 12; boss.statusText = '最终妖王'; enemies.push(boss);
  const effects = [
    ['monkey-clone', -112, -72, 18, '#e6a43a'], ['palm-strike', -40, -92, 42, '#e7cb80'],
    ['bead', 44, -86, 10, '#d9b77b'], ['skull-bead', 100, -62, 11, '#f0e4c6'],
    ['gourd', 105, 66, 46, '#a879cb'], ['mountain', 0, 112, 52, '#b58d65'],
    ['fan', -100, 80, 48, '#68c2aa'], ['fire-trail', 84, 112, 28, '#ef7650'],
    ['heavy-sweep', -55, 44, 46, '#f6c751'], ['explosion', 70, 40, 30, '#ef6b43'],
  ];
  for (const [kind, ox, oy, radius, color] of effects) engine.effect({ x: p.x + ox, y: p.y + oy, kind, radius, color, ttl: 4, maxTtl: 4, angle: Math.atan2(oy, ox), symbol: '卍', hitIds: kind === 'monkey-clone' });
  engine.projectile({ x: p.x - 120, y: p.y + 12, vx: 90, vy: -20, radius: 11, color: '#ef7650', kind: 'fire-wheel', ttl: 4 });
  engine.projectile({ x: p.x + 10, y: p.y - 128, vx: 10, vy: 80, radius: 10, color: '#dfd0ff', kind: 'ring', ttl: 4 });
  state.damageNumbers = [{ x: p.x - 74, y: p.y + 10, damage: 128, ttl: 4, maxTtl: 4, color: '#ffdf43' }, { x: p.x + 82, y: p.y - 42, damage: 36, ttl: 4, maxTtl: 4, color: '#fff0a6' }];
  game.cancel(game.frame); game.running = false; engine.resume(); game.draw();
  return { ok: true, enemies: enemies.length, effects: state.effects.length, projectiles: state.projectiles.length };
});
await page.waitForTimeout(80);
await capture('combat-showcase-fixture-390x844');

await page.keyboard.press('p'); // normal user pause after the fixture restored playing state
await waitUiIdle();
await capture('pause-390x844');
const paused = await page.evaluate(() => ({ status: window.xiyou?.engine?.state?.status, running: window.xiyou?.running }));
await page.keyboard.press('p'); // resume
await waitUiIdle();
await page.waitForTimeout(120);
const resumed = await page.evaluate(() => ({ status: window.xiyou?.engine?.state?.status, running: window.xiyou?.running }));

// Debug-only local harnesses make the upgrade, mid/final Boss and settlement
// compositions reproducible without waiting ten real minutes. They exercise
// the same NativeGame overlays and renderer used by the playable run.
// Engine frames cap dt at .05, so each scheduled boundary uses one real frame.
const upgradeHarness = await page.evaluate(() => { const g = window.xiyou; const e = g?.engine; if (!e) return { ok: false }; e.state.gems.length = 0; e.debug('xp', { value: 40 }); e.update(.02); g.running = false; g.cancel(g.frame); g.draw(); return { ok: true, status: e.state.status, choices: e.state.choices?.length || 0 }; });
await waitUiIdle(); await capture('upgrade-debug-harness-390x844');
const bossHarness = await page.evaluate(() => { const g = window.xiyou; const e = g?.engine; if (!e) return { ok: false }; let guard = 0; while (e.state.status === 'upgrade' && e.state.choices?.[0] && guard++ < 12) e.chooseUpgrade(e.state.choices[0].id); e.state.gems.length = 0; e.state.enemies = e.state.enemies.filter((enemy) => !enemy.final); e.debug('time', { value: 569.95 }); e.update(.05); while (e.state.status === 'upgrade' && e.state.choices?.[0] && guard++ < 24) e.chooseUpgrade(e.state.choices[0].id); const p = e.state.player; const places = [[-80,-72],[80,-72],[-80,72],[80,72]]; for (const [i,b] of e.state.enemies.filter(x => x.kind === 'boss').entries()) { const place = places[i] || [i * 42, 0]; b.radius = Math.min(Number(b.radius) || 50, 30); b.x = p.x + place[0]; b.y = p.y + place[1]; } const stage = e.stage || {}; const elite = (stage.eliteEncounters || []).find(x => Number(x.at) === 300) || null; g.running = false; g.cancel(g.frame); g.draw(); return { ok: true, status: e.state.status, time: e.state.time, bosses: e.state.enemies.filter(x => x.kind === 'boss').length, bossNames: e.state.enemies.filter(x => x.kind === 'boss').map(x => x.name), finalBossNames: e.state.enemies.filter(x => x.kind === 'boss' && x.final).map(x => x.name), finalBossSpawned: e.finalBossSpawned, stage: { id: stage.id, name: stage.name, location: stage.location, theme: stage.theme, mapAssetKey: stage.mapAssetKey || e.state.battlefield?.mapAssetKey || null, enemyVariants: (stage.enemyRoster || []).map(x => x.variant), enemies: stage.enemies || [], midBoss: stage.midBoss, finalBosses: (stage.finalBosses || []).map(x => x.name) }, elite300: elite }; });
await waitUiIdle(); await capture('boss-debug-harness-390x844');
const resultHarness = await page.evaluate(() => { const g = window.xiyou; const e = g?.engine; if (!e) return { ok: false }; e.debug('time', { value: 599.95 }); e.update(.05); for (const boss of e.state.enemies.filter((enemy) => enemy.kind === 'boss').slice()) e.damageEnemy(boss, boss.hp + 1); e.checkVictory(); g.running = false; g.cancel(g.frame); g.draw(); return { ok: true, status: e.state.status, time: e.state.time, finalBossSpawned: e.finalBossSpawned, finalBosses: e.state.enemies.filter((enemy) => enemy.final).length, remainingBosses: e.state.enemies.filter((enemy) => enemy.kind === 'boss').length }; });
await waitUiIdle(); await capture('result-debug-harness-390x844');

await page.setViewportSize({ width: 360, height: 640 });
await page.evaluate(() => window.xiyou?.go?.('home'));
await waitUiIdle();
await capture('home-360x640');
const mobileLayout = await page.evaluate(() => ({ width: window.xiyou?.w, height: window.xiyou?.h, buttons: window.xiyou?.buttons?.length }));
const resources = battleResources;
const consoleErrors = consoleMessages.filter(message => message.type === 'error');
await page.evaluate(() => window.xiyou?.dispose?.());
await browser.close();

const requiredFinalBosses = ['寅将军', '熊山君'];
const requiredBattleHeroes = ['wukong', 'tangsanzang', 'bajie', 'shajing'];
const battleAssetAssertions = {
  authoredFrames: resources?.renderer?.battleArtMode === 'authoredFrames',
  vectorBattleScene: resources?.renderer?.battleSceneMode === 'vector',
  battleMapVector: Number(resources?.renderer?.mapAssetDraws ?? resources?.mapAssetDraws ?? 0) === 0,
  v3HeroSheets: requiredBattleHeroes.every(id => {
    const hero = resources?.heroes?.[id];
    return hero?.v3 === true && hero?.complete === true && Number(hero?.naturalWidth || 0) > 0;
  }),
  v3FrameContracts: requiredBattleHeroes.every(id => {
    const contract = resources?.heroes?.[id]?.battleFrameContract;
    return contract?.id === id && Number(contract?.cols || 0) * Number(contract?.rows || 0) >= 8;
  }),
  independentFrameRects: requiredBattleHeroes.every(id => Number(resources?.heroes?.[id]?.frameGrid?.independentRectCount || 0) >= 8)
};
const stageOneAssertions = {
  firstStage: bossHarness?.stage?.id === 1 && bossHarness?.stage?.name?.includes('双叉岭') && bossHarness?.stage?.location?.includes('双叉岭'),
  mapTheme: bossHarness?.stage?.theme === 'forest' && (bossHarness?.stage?.mapAssetKey === 'doublefork' || resources?.mapAssetKey === 'doublefork'),
  perimeterRoster: ['tiger', 'bear', 'bull', 'wolf', 'monkey', 'deer', 'hawk', 'snake'].every(variant => bossHarness?.stage?.enemyVariants?.includes(variant)),
  finalBossRoster: requiredFinalBosses.every(name => bossHarness?.finalBossNames?.includes(name)) && bossHarness?.finalBossNames?.some(name => name === '特处士' || name === '待处士'),
  midBoss: String(bossHarness?.stage?.midBoss || '').includes('虎小首领'),
  elite300: String(bossHarness?.elite300?.name || '').includes('虎') && bossHarness?.elite300?.variant === 'tiger'
};
// The 300s tiger vanguard occupies the mid-boss slot for this stage. The
// final wave therefore contains exactly the three canonical novel bosses;
// accepting four here would mask a duplicate mid-boss spawn.
stageOneAssertions.bossComposition = bossHarness?.bosses === 3
  && bossHarness?.finalBossNames?.length === 3
  && bossHarness?.finalBossNames?.every(name => bossHarness?.bossNames?.includes(name))
  && bossHarness?.elite300?.replacesMidBoss === true;
// The playable smoke uses the default Tang Sanzang loadout. Its level-one
// attack intentionally has one light-orb at a time and no persistent area
// effect, so requiring *multiple* projectiles/effects makes the check depend
// on a particular weapon/upgrade roll rather than on visible gameplay. The
// deterministic showcase fixture below covers the full multi-projectile and
// effect vocabulary. Here we assert the real run emitted at least one attack
// channel plus live damage feedback.
const naturalFeedback = {
  primaryAttackVisible: Number(battleMetrics?.peakProjectiles || 0) > 0 || Number(battleMetrics?.peakEffects || 0) > 0,
  damageNumbersVisible: Number(normalBattleState?.damageNumbers || 0) > 0 || naturalDamageSamples.some(value => Number(value) > 0)
};
const report = {
  generatedAt: new Date().toISOString(),
  url: base,
  browser: `Playwright ${process.env.BROWSER_CHANNEL || (process.platform === 'win32' ? 'msedge' : 'chromium')} headless ${browser.version()}`,
  viewports: ['390x844 DPR1', '360x640 DPR1'],
  screenshots: shots,
  battleMetrics,
  normalBattleState,
  naturalDamageSamples,
  naturalFeedback,
  resources,
  battleAssetAssertions,
  visualFixture: fixture,
  paused,
  resumed,
  upgradeHarness,
  bossHarness,
  resultHarness,
  mobileLayout,
  consoleMessages,
  consoleErrors,
  pageErrors,
  stageOneAssertions,
  result: paused?.status === 'paused' && paused?.running === false && resumed?.status === 'playing' && resumed?.running === true && upgradeHarness?.status === 'upgrade' && upgradeHarness?.choices === 3 && bossHarness?.time === 570 && stageOneAssertions.bossComposition && bossHarness?.finalBossSpawned === true && resultHarness?.status === 'won' && resultHarness?.time === 600 && resultHarness?.finalBossSpawned === true && resultHarness?.finalBosses === 0 && resultHarness?.remainingBosses === 0 && Object.values(stageOneAssertions).every(Boolean) && Object.values(naturalFeedback).every(Boolean) && Object.values(battleAssetAssertions).every(Boolean) && resources?.mapAssetKey === 'doublefork' && pageErrors.length === 0 && consoleErrors.length === 0 ? 'PASS' : 'FAIL',
  note: 'Screenshots come from the current native Canvas entry and real pointer/keyboard events. The combat-showcase, upgrade, Boss and result harnesses are localhost-only deterministic renderer/UI reviews; the normal battle capture remains separate playable evidence. Headless browser evidence is not a WeChat device FPS claim.'
};
fs.writeFileSync(path.join(root, 'evidence', 'current', 'visual.json'), JSON.stringify(report, null, 2));
if (report.result !== 'PASS') process.exitCode = 1;
console.log(JSON.stringify(report, null, 2));
