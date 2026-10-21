import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'evidence', 'current', 'animation');
fs.mkdirSync(output, { recursive: true });
const playwright = await loadPlaywright();
const browser = await playwright.chromium.launch(browserLaunchOptions());
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const base = process.env.XIYOU_URL || 'http://127.0.0.1:8088/';
const consoleMessages = [];
const pageErrors = [];
page.on('console', message => consoleMessages.push({ type: message.type(), text: message.text().slice(0, 500) }));
page.on('pageerror', error => pageErrors.push(String(error?.stack || error).slice(0, 1000)));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const clip = { x: 82, y: 210, width: 226, height: 300 };
const shot = async (name, region = null) => {
  const file = path.join(output, `${name}.png`);
  const bytes = await page.screenshot({ path: file, clip: region || undefined });
  return { name, file: path.relative(root, file), bytes: fs.statSync(file).size, sha256: hash(bytes) };
};
const state = () => page.evaluate(() => {
  const g = window.xiyou, e = g?.engine, s = e?.state;
  const imageInfo = (image, extra = {}) => image ? ({
    src: image.currentSrc || image.src || '', naturalWidth: image.naturalWidth || image.width || 0,
    naturalHeight: image.naturalHeight || image.height || 0, complete: Boolean(image.complete), ...extra
  }) : null;
  const list = (value) => Object.fromEntries(Object.entries(value || {}).map(([key, image]) => [key, imageInfo(image, {
    priority: Boolean(image.__prioritySprite), v2: Boolean(image.__v2BattleSprite), v3: Boolean(image.__v3BattleSprite),
    battleFrameContract: image.__battleFrameContract || null,
    sourceRects: image.__sourceRects || image.__sourceRect || null
  })]));
  const maps = Object.fromEntries(Object.entries(g?.mapImages || {}).map(([theme, layers]) => [theme, Object.fromEntries(Object.entries(layers || {}).map(([layer, image]) => [layer, imageInfo(image)]))]));
  return {
    screen: g?.screen, status: s?.status || null, time: s?.time || 0, kills: s?.kills || 0,
    level: s?.player?.level || 0, xp: s?.player?.xp || 0,
    player: s?.player ? { animationState: s.player.animationState, frameIndex: s.player.frameIndex, pose: s.player.pose || null, animationFrames: s.player.animationFrames } : null,
    heroes: list(g?.heroImages), skills: list(g?.skillImages), enemies: list(g?.enemyImages), maps,
    renderer: g?.renderer ? { mapAssetDraws: g.renderer.mapAssetDraws || 0, elapsed: g.renderer.elapsed || 0, battleArtMode: g.renderer.battleArtMode, battleSceneMode: g.renderer.battleSceneMode } : null,
    uiMotion: g?.getUIMotionState?.() || null
  };
});
const waitAssets = async () => page.waitForFunction(() => {
  const g = window.xiyou;
  const hero = g?.heroImages || {}, skill = g?.skillImages || {};
  const loaded = image => Boolean(image && (image.complete === undefined || image.complete) && (image.naturalWidth || image.width));
  const heroReady = ['wukong', 'tangsanzang', 'bajie', 'shajing'].every(key => loaded(hero[key]) && hero[key].__v3BattleSprite === true);
  const skillReady = ['weapon:wukong', 'weapon:tangsanzang', 'weapon:bajie', 'weapon:shajing', 'purple-gourd', 'iron-fan', 'diamond-snare', 'nine-dragon', 'lotus-lantern', 'golden-rope', 'moon-mirror', 'samadhi-fire'].every(key => loaded(skill[key]));
  return heroReady && skillReady;
}, null, { timeout: 15000 }).catch(() => null);
const stopRaf = () => page.evaluate(() => { const g = window.xiyou; if (!g) return; if (g.frame) g.cancel(g.frame); g.frame = 0; g.running = false; });
const waitUiIdle = async (timeout = 1600) => page.waitForFunction(() => {
  const motion = window.xiyou?.getUIMotionState?.();
  return !motion || (!motion.active && !motion.pressActive);
}, null, { timeout }).catch(() => {});
const stepProduction = async (dt = .05, input = { x: 0, y: 0 }) => page.evaluate(({ dt, input }) => {
  const g = window.xiyou, e = g?.engine; if (!e || e.state.status !== 'playing') return null;
  // GameEngine intentionally caps one update at 50ms. Split an accelerated
  // sample into legal production updates so .15 means .15, rather than .05.
  let remaining = Math.max(0, Number(dt) || 0), updates = 0;
  while (remaining > 0.000001 && e.state.status === 'playing') {
    const step = Math.min(.05, remaining); e.update(step, input); remaining -= step; updates += 1;
  }
  g.draw();
  return { time: e.state.time, status: e.state.status, level: e.state.player.level, kills: e.state.kills, frameIndex: e.state.player.frameIndex, pose: e.state.player.pose || null, updates, requestedDt: dt };
}, { dt, input });

await page.goto(base, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.mouse.click(195, 485); // enter journey
await waitUiIdle();
await page.mouse.click(285, 180); // Tang Sanzang
await page.mouse.click(195, 615); // start trial
await waitUiIdle();
await page.waitForFunction(() => window.xiyou?.engine?.state?.status === 'playing', null, { timeout: 5000 });
await waitAssets();
await page.waitForTimeout(450);
const loadedBeforeBattle = await state();
const screenshots = [];
screenshots.push(await shot('battle-resource-ready-390x844'));

// Adjacent actor frames: crop excludes the clock/HUD so hashes prove pose/art
// movement rather than text changing. The state frameIndex/pose is recorded too.
await stopRaf();
await stepProduction(.05, { x: .85, y: .18 });
const activeA = await state(); const activeShotA = await shot('actor-active-a', clip);
await stepProduction(.15, { x: .85, y: .18 });
const activeB = await state(); const activeShotB = await shot('actor-active-b', clip);

// User pause path. Two captures must be identical in the actor crop and the
// simulation frameIndex must not advance while paused.
await page.keyboard.press('p');
await waitUiIdle();
await page.waitForTimeout(220);
const pausedA = await state(); const pausedShotA = await shot('actor-paused-a', clip);
await page.waitForTimeout(220);
const pausedB = await state(); const pausedShotB = await shot('actor-paused-b', clip);
await page.keyboard.press('p');
await page.waitForTimeout(260);
const resumed = await state(); const resumedShot = await shot('actor-resumed', clip);

// Real input window: no debug seam or state mutation. This is the user-facing
// path and remains wall-clock evidence; the following production update loop
// is separately labelled accelerated simulation.
await page.keyboard.down('d');
await page.waitForTimeout(20000);
await page.keyboard.up('d');
const realtime = await state();
screenshots.push(await shot('normal-gameplay-20s-390x844'));

// Accelerated production simulation: calls only the public update loop,
// movement input, and legal upgrade selection. It never writes time, HP,
// invulnerability, final-boss flags, kills, or any other state field.
await stopRaf();
const accelerated = await page.evaluate(() => {
  const g = window.xiyou, e = g?.engine; if (!e) return { ok: false };
  let frames = 0, upgrades = 0, guard = 0;
  while (e.state.status === 'playing' && e.state.time < 60 && frames < 1500) {
    e.update(.05, { x: .76, y: .32 }); frames += 1;
    while (e.state.status === 'upgrade' && e.state.choices?.length && guard++ < 40) {
      e.chooseUpgrade(e.state.choices[0].id); upgrades += 1;
    }
  }
  while (e.state.status === 'upgrade' && e.state.choices?.length && guard++ < 40) { e.chooseUpgrade(e.state.choices[0].id); upgrades += 1; }
  g.draw();
  return { ok: true, mode: 'accelerated-production-update', frames, simulatedSeconds: e.state.time, status: e.state.status, kills: e.state.kills, level: e.state.player.level, upgrades, noDebugMutation: true };
});
const acceleratedState = await state();
screenshots.push(await shot('accelerated-gameplay-60s-390x844'));
const resources = await state();
const report = {
  generatedAt: new Date().toISOString(), url: base, viewport: '390x844 DPR1', screenshots,
  loadedBeforeBattle, resources, realtime, accelerated,
  animation: {
    clip, activeA, activeB, activeShotA, activeShotB,
    pausedA, pausedB, pausedShotA, pausedShotB, resumed, resumedShot,
    // A legal production step may cross from move into attack and reset the
    // local frame counter to zero. Count that state transition as a real
    // authored-frame change; comparing only frameIndex would reject a valid
    // animation boundary.
    activeFrameAdvanced: activeA.player?.frameIndex !== activeB.player?.frameIndex
      || activeA.player?.animationState !== activeB.player?.animationState
      || activeA.player?.pose !== activeB.player?.pose,
    activeHashChanged: activeShotA.sha256 !== activeShotB.sha256,
    pauseFrameStable: pausedA.player?.frameIndex === pausedB.player?.frameIndex && pausedA.player?.pose === pausedB.player?.pose,
    pauseHashStable: pausedShotA.sha256 === pausedShotB.sha256,
    resumeFrameContinued: resumed.player?.frameIndex !== pausedB.player?.frameIndex
      || resumed.player?.animationState !== pausedB.player?.animationState
      || resumed.player?.pose !== pausedB.player?.pose,
    resumeHashChanged: resumedShot.sha256 !== pausedShotB.sha256,
    uiEntranceSettled: loadedBeforeBattle.uiMotion?.active === false,
    uiPauseSettled: pausedA.uiMotion?.active === false && pausedB.uiMotion?.active === false
  },
  assetAssertions: {
    battleMode: resources.renderer?.battleArtMode === 'authoredFrames' && resources.renderer?.battleSceneMode === 'vector',
    heroV3Sheets: ['wukong', 'tangsanzang', 'bajie', 'shajing'].every(key => resources.heroes?.[key]?.v3 && resources.heroes?.[key]?.battleFrameContract?.pivot),
    heroFrameCounts: ['wukong', 'tangsanzang', 'bajie', 'shajing'].every(key => Number(resources.heroes?.[key]?.battleFrameContract?.cols || 0) * Number(resources.heroes?.[key]?.battleFrameContract?.rows || 0) >= 8),
    skillIcons: ['weapon:wukong', 'weapon:tangsanzang', 'weapon:bajie', 'weapon:shajing', 'purple-gourd', 'iron-fan', 'diamond-snare', 'nine-dragon', 'lotus-lantern', 'golden-rope', 'moon-mirror', 'samadhi-fire'].every(key => resources.skills?.[key]?.naturalWidth > 0),
    battleMapVector: Number(resources.renderer?.mapAssetDraws || 0) === 0
  },
  consoleMessages, pageErrors,
  verdict: 'PENDING'
};
report.verdict = Object.values(report.assetAssertions).every(Boolean)
  && report.animation.activeFrameAdvanced && report.animation.activeHashChanged
  && report.animation.pauseFrameStable && report.animation.pauseHashStable
  && report.animation.resumeFrameContinued && report.animation.resumeHashChanged
  && report.animation.uiEntranceSettled && report.animation.uiPauseSettled
  && report.realtime.time > 10 && report.accelerated.ok && report.accelerated.simulatedSeconds >= 55
  && report.pageErrors.length === 0 ? 'PASS' : 'FAIL';
fs.writeFileSync(path.join(root, 'evidence', 'current', 'browser-animation-smoke.json'), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(output, 'browser-animation-smoke.json'), JSON.stringify(report, null, 2));
await page.evaluate(() => window.xiyou?.dispose?.());
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (report.verdict !== 'PASS') process.exitCode = 1;
