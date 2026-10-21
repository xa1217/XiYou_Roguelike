import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), nodeFile = process.argv[2];
if (!/^evidence\/current\/tiger-vanguard\/feedback-draft\/[\w-]+\/node\.json$/.test(nodeFile || '')) throw Error('Explicit feedback node evidence required');
const output = path.dirname(path.join(root, nodeFile)), hash = b => crypto.createHash('sha256').update(b).digest('hex');
const rel = f => path.relative(root, f).replaceAll('\\', '/'), read = f => JSON.parse(fs.readFileSync(path.join(root, f)));
const previousFile = 'evidence/current/tiger-vanguard/layout-draft/2026-10-14T01-50-14-837Z/browser.json';
const previous = read(previousFile), node = read(nodeFile), candidateFile = previous.candidate.file;
const candidate = read(candidateFile), motion = read(previous.motionDraft.file), layout = read(node.layout.file);
const priorDirectory = path.posix.dirname(previousFile);
const extra = ['scripts/browser-tiger-vanguard-layout-draft.mjs', 'scripts/tiger-vanguard-feedback-draft.mjs',
  'scripts/tiger-vanguard-feedback-smoke.mjs', nodeFile,
  ...['review.md', 'handoff.json', 'closeout.json'].map(f => `${priorDirectory}/${f}`)];
const expected = { ...previous.protectedAfter, [previousFile]: '9da917c7e2bc38fc60233fac3e1880f5d8f4be0bdaf3745f33f582787fdef5fe',
  ...Object.fromEntries(previous.screenshots.map(s => [s.file, s.sha256])),
  ...Object.fromEntries(extra.map(f => [f, hash(fs.readFileSync(path.join(root, f)))])) };
const fingerprint = () => Object.fromEntries(Object.keys(expected).map(f => [f, hash(fs.readFileSync(path.join(root, f)))]));
const report = { generatedAt: new Date().toISOString(), result: 'FAIL',
  scope: 'Evidence-only local pointer UI then explicit accelerated/reposition/direct-damage/partial subsystem fixture. Both modes retain raised own bar; only current-render candidate body/bar obstacle slots differ. Existing finite number algorithm unchanged. Not production, natural gameplay, motion, global occlusion, FPS or public acceptance.',
  url: 'http://127.0.0.1:8088/', priorEvidence: { file: previousFile, sha256: expected[previousFile] },
  candidate: previous.candidate, motionDraft: previous.motionDraft, nodeEvidence: { file: nodeFile, sha256: expected[nodeFile] },
  layout: node.layout, scriptSha256: hash(fs.readFileSync(fileURLToPath(import.meta.url))), protectedBefore: fingerprint(),
  screenshots: [], pageErrors: [], consoleErrors: [], failedRequests: [], httpErrors: [], externalRequests: [], runtimeReferences: [],
  humanMotionReviewed: false, rootApproved: false, healthBarLayoutApproved: false, playerReadabilityApproved: false,
  viewportEdgeApproved: false, statusBadgeGeometryUpdated: false, deathFeedbackObstaclesIntegrated: false,
  extremeMissingBarAt512Approved: false, attackEventSupported: false, attackPreviewed: false, runtimeApproved: false,
  highFrameApproved: false, fpsAcceptance: false, publicPass: false, releaseReady: false };
const bounded = async (promise, name, ms = 15000) => { let timer; try {
  return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(Error(`${name} timeout`)), ms); })]);
} finally { clearTimeout(timer); } };
let server, browser, context;
try {
  assert.deepEqual(report.protectedBefore, expected); assert.equal(node.result, 'PASS_EVIDENCE_ONLY_SHARED_FEEDBACK_RECTS');
  assert.equal(expected[node.layout.file], node.layout.sha256);
  for (const f of ['prototype-2d/native-app.js', 'prototype-2d/assets/manifest.json', 'scripts/serve.mjs', 'scripts/release.mjs',
    ...fs.readdirSync(path.join(root, 'prototype-2d/src')).filter(f => f.endsWith('.js')).map(f => `prototype-2d/src/${f}`)]) {
    const source = fs.readFileSync(path.join(root, f), 'utf8');
    for (const name of ['tiger-vanguard-feedback-draft', candidateFile, previous.motionDraft.file, ...candidate.pages.map(p => p.file)])
      if (source.includes(name) || source.includes(path.basename(name))) report.runtimeReferences.push({ file: f, name });
  }
  assert.equal(report.runtimeReferences.length, 0);
  const pages = candidate.pages.map(p => { const bytes = fs.readFileSync(path.join(root, p.file)); assert.equal(hash(bytes), p.sha256);
    return { ...p, src: `data:image/png;base64,${bytes.toString('base64')}` }; });
  const moduleUrl = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
  const clockUrl = moduleUrl(fs.readFileSync(path.join(root, 'scripts/tiger-vanguard-motion-draft.mjs'), 'utf8'));
  const observerUrl = moduleUrl(fs.readFileSync(path.join(root, 'scripts/tiger-vanguard-event-preview.mjs'), 'utf8')
    .replace("'./tiger-vanguard-motion-draft.mjs'", JSON.stringify(clockUrl)));
  const layoutUrl = moduleUrl(fs.readFileSync(path.join(root, 'scripts/tiger-vanguard-layout-draft.mjs'), 'utf8'));
  const feedbackUrl = moduleUrl(fs.readFileSync(path.join(root, 'scripts/tiger-vanguard-feedback-draft.mjs'), 'utf8')
    .replace("'./tiger-vanguard-event-preview.mjs'", JSON.stringify(observerUrl)));
  server = spawn(process.execPath, ['scripts/serve.mjs'], { cwd: root, env: { ...process.env, PORT: '8088' }, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  report.serverOutput = '';
  await bounded(new Promise((resolve, reject) => { server.once('error', reject); server.once('exit', c => reject(Error(`Server exited ${c}`)));
    server.stdout.on('data', b => { report.serverOutput += b; if (report.serverOutput.includes('127.0.0.1:8088')) resolve(); });
    server.stderr.on('data', b => { report.serverOutput += b; }); }), 'server startup');
  const pw = await loadPlaywright(); browser = await pw.chromium.launch(browserLaunchOptions()); report.browser = browser.version();
  context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const page = await context.newPage(); page.setDefaultTimeout(15000);
  page.on('pageerror', e => report.pageErrors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
  page.on('requestfailed', r => report.failedRequests.push({ url: r.url(), error: r.failure()?.errorText }));
  page.on('response', r => { if (r.status() >= 400) report.httpErrors.push({ url: r.url(), status: r.status() }); });
  page.on('request', r => { if (/^https?:/.test(r.url()) && new URL(r.url()).origin !== 'http://127.0.0.1:8088') report.externalRequests.push(r.url()); });
  await page.route('https://**/*', r => r.abort());
  await page.goto(report.url, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.xiyou?.enemyImages?.snake?.__snakeBattleSprite === true);
  await page.mouse.click(195, 485);
  await page.waitForFunction(() => window.xiyou?.screen === 'select' && !window.xiyou.getUIMotionState().active);
  await page.mouse.click(195, 615);
  await page.waitForFunction(() => window.xiyou?.engine?.state?.status === 'playing' && window.xiyou.engine.state.time >= 1);
  report.uiEntry = await page.evaluate(() => { const g = window.xiyou; g.cancel(g.frame); g.frame = 0; g.running = false; g.renderDt = 0; g.draw();
    return { screen: g.screen, status: g.engine.state.status, debug: g.platform.debug, time: g.engine.state.time }; });
  const entryFile = path.join(output, 'real-ui-before-fixture.png'), entry = await page.screenshot({ path: entryFile });
  report.screenshots.push({ file: rel(entryFile), bytes: entry.length, sha256: hash(entry), kind: 'real-ui-before-explicit-fixture' });
  for (const f of ['prototype-2d/src/engine.js', 'prototype-2d/src/renderer.js', 'prototype-2d/native-app.js']) {
    const response = await page.request.get(new URL(f.replace('prototype-2d/', ''), report.url).href);
    assert.equal(response.status(), 200); assert.equal(hash(await response.body()), expected[f]);
  }
  const fixture = await bounded(page.evaluate(async ({ observerUrl, layoutUrl, feedbackUrl, pages, candidate, motion, layout }) => {
    const { createVanguardEventPreview } = await import(observerUrl);
    const { projectVanguardLayout } = await import(layoutUrl);
    const { synchronizeVanguardFeedbackRects } = await import(feedbackUrl);
    const g = window.xiyou, e = g.engine, s = e.state, r = g.renderer, preview = createVanguardEventPreview(motion), images = {};
    for (const p of pages) { const im = new Image(); im.src = p.src; await im.decode();
      if (im.naturalWidth !== p.width || im.naturalHeight !== p.height) throw Error('Source dimensions differ'); images[p.id] = im; }
    const saved = { event: e.onEvent, rng: e.rng, enemy: r._drawEnemy, effect: r._drawEffect,
      obstacles: r._enemyDamageOcclusionRects, feedback: r._drawCombatFeedback, fillText: g.ctx.fillText, strokeText: g.ctx.strokeText };
    const draws = [], events = [], errors = [], snapshots = [], syncs = [], feedbacks = [];
    let mode = 'before', calls = 0, renderChecks = 0, consumerChecks = 0, renderToken = 0, geometryCache = new WeakMap(), binding, inFeedback = false, paints;
    e.rng = () => { calls++; return saved.rng(); };
    e.onEvent = event => { const before = JSON.stringify(s), beforeCalls = calls;
      try { const accepted = preview.consume(event, s); events.push({ type: event.type, target: event.target || null, accepted, sourceId: event.sourceId || null, at: s.time });
        if (JSON.stringify(s) !== before || beforeCalls !== calls) throw Error('Observer writes state/RNG'); consumerChecks++;
      } catch (error) { errors.push(String(error)); } finally { saved.event(event); } };
    const screenBox = box => { const zoom = r._zoom(s.player); return { left: r.width / 2 + (box.left - r.camera.x) * zoom,
      right: r.width / 2 + (box.right - r.camera.x) * zoom, top: r.height / 2 + (box.top - r.camera.y) * zoom,
      bottom: r.height / 2 + (box.bottom - r.camera.y) * zoom }; };
    const drawPose = (ctx, pose, kind, entity) => {
      const f = candidate.frames[pose.index], m = motion.frames[pose.index], geometry = projectVanguardLayout(layout, pose), scale = pose.radius * 3.2 / f.standingReferenceHeight;
      ctx.save(); ctx.translate(pose.x, geometry.ground); ctx.scale(pose.facing, 1);
      ctx.drawImage(images[f.page], f.sourceRect.x, f.sourceRect.y, f.sourceRect.w, f.sourceRect.h,
        -m.pivot.x * scale, -m.pivot.y * scale, f.sourceRect.w * scale, f.sourceRect.h * scale); ctx.restore();
      const bar = kind === 'elite' ? { left: geometry.bar.left, right: geometry.bar.right, top: geometry.bar.y, bottom: geometry.bar.bottom } : null;
      if (bar) r._drawHealthBar(ctx, pose.x, bar.top, pose.radius * 2.3, pose.hp / pose.maxHp, '#e66b35');
      if (bar && entity === binding?.enemy) geometryCache.set(entity, { renderToken, body: geometry.draw, bar });
      draws.push({ mode, renderToken, kind, at: s.time, pose, geometry, bar, camera: { ...r.camera }, zoom: r._zoom(s.player),
        screenBody: screenBox(geometry.draw), screenVisibleProxy: screenBox(geometry.visibleAlpha8Proxy), screenBar: bar ? screenBox(bar) : null });
    };
    r._drawEnemy = function (ctx, enemy, ...args) { const pose = preview.sampleEnemy(enemy, s);
      if (!pose) return saved.enemy.call(this, ctx, enemy, ...args); drawPose(ctx, pose, 'elite', enemy); };
    r._drawEffect = function (ctx, effect) { const pose = preview.sampleEffect(effect, s);
      if (!pose) return saved.effect.call(this, ctx, effect); drawPose(ctx, pose, 'death', effect); };
    r._enemyDamageOcclusionRects = function (enemies) {
      const rects = saved.obstacles.call(this, enemies), before = structuredClone(rects);
      const result = mode === 'after' ? synchronizeVanguardFeedbackRects(rects, enemies,
        { state: s, binding, renderToken, geometryFor: enemy => geometryCache.get(enemy) }) : null;
      if (result?.errors.length) errors.push(...result.errors);
      syncs.push({ mode, renderToken, before, after: structuredClone(rects), result, sameBuffer: rects === this._damageEnemyRects,
        inputIds: enemies.map(enemy => enemy?.id || null) }); return rects;
    };
    for (const name of ['fillText', 'strokeText']) g.ctx[name] = function (...args) {
      if (inFeedback) { const t = this.getTransform(); paints.push({ name, args, font: this.font, fill: this.fillStyle, stroke: this.strokeStyle,
        lineWidth: this.lineWidth, textAlign: this.textAlign, textBaseline: this.textBaseline, globalAlpha: this.globalAlpha,
        transform: { a: t.a, b: t.b, c: t.c, d: t.d, e: t.e, f: t.f } }); }
      return saved[name].apply(this, args);
    };
    r._drawCombatFeedback = function (ctx, state, enemies, options) {
      paints = []; inFeedback = true;
      try { saved.feedback.call(this, ctx, state, enemies, options); }
      finally { inFeedback = false; feedbacks.push({ mode, renderToken, paints, numbers: structuredClone(state.damageNumbers),
        labelRects: structuredClone(this._damageLabelRects), screenLabelRects: this._damageLabelRects.map(screenBox),
        enemyRects: structuredClone(this._damageEnemyRects), playerRect: this._playerOcclusionRect(state.player),
        hudRects: structuredClone(this._hudOcclusionRects), statusRects: structuredClone(this._statusBadgeRects), view: { ...this._view }, stats: { ...this.stats } }); }
    };
    const draw = () => { const before = JSON.stringify(s), beforeCalls = calls; geometryCache = new WeakMap(); renderToken++; g.renderDt = 0; g.draw(); preview.reconcile(s);
      if (JSON.stringify(s) !== before || calls !== beforeCalls) throw Error('Draw writes state/RNG'); renderChecks++;
      const c = g.ctx; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#2a1729'; c.fillRect(0, 0, 390, 24);
      c.fillStyle = '#ffe6b5'; c.font = 'bold 9px sans-serif'; c.fillText('EVIDENCE ONLY / FEEDBACK RECTS / DIRECT DAMAGE FIXTURE', 5, 15); c.restore(); };
    const shot = name => snapshots.push({ name, at: s.time, mode, lastDraw: draws.at(-1) || null, pngBase64: g.canvas.toDataURL('image/png').split(',')[1] });
    const step = dt => { e.elapsed += dt; s.time = e.elapsed; e.updateEffects(dt); e.updateEnemies(dt); };
    try {
      for (const key of ['enemies', 'effects', 'projectiles', 'gems', 'damageNumbers']) s[key].length = 0;
      e.elapsed = s.time = 299.95; e.update(.05);
      const leader = s.enemies.find(enemy => enemy.encounterIdentity?.encounterId === 'tiger-vanguard');
      if (!leader) throw Error('No scheduled Vanguard'); binding = { enemy: leader, id: leader.id, identity: leader.encounterIdentity };
      const ordinary = e.spawnEnemy('normal', 0, { variant: 'tiger' }), homonym = e.spawnEnemy('elite', 0, e.stage.eliteEncounters[0]);
      s.enemies = [leader, ordinary, homonym]; s.effects.length = 0; s.projectiles.length = 0; s.gems.length = 0; s.damageNumbers.length = 0;
      s.player.x = 900; s.player.y = 1260; leader.x = 1010; leader.y = 1320; ordinary.x = 790; ordinary.y = 1340; homonym.x = 1000; homonym.y = 1150;
      mode = 'after'; draw(); const controlSync = syncs.at(-1);
      for (let i = 0; i < 16; i++) { step(.025); draw(); }
      s.enemies = [leader]; leader.x = s.player.x + 15; leader.y = s.player.y + 15; s.player.invulnerable = 0; step(.025); draw();
      e.damageEnemy(leader, 1, {}); draw(); for (let i = 0; i < 6; i++) { step(.025); draw(); }
      const stateBefore = JSON.stringify(s), callsBefore = calls;
      mode = 'before'; draw(); shot('hit26-generic-obstacles'); const beforeDraw = draws.at(-1), beforeFeedback = feedbacks.at(-1), beforePixels = g.ctx.getImageData(0,0,390,844).data;
      mode = 'after'; draw(); shot('hit26-current-draw-obstacles'); const afterDraw = draws.at(-1), afterFeedback = feedbacks.at(-1), afterPixels = g.ctx.getImageData(0,0,390,844).data;
      if (JSON.stringify(s) !== stateBefore || calls !== callsBefore) throw Error('Pair changed state/RNG');
      const drawInvariant = d => ({ pose: d.pose, geometry: d.geometry, bar: d.bar, camera: d.camera, zoom: d.zoom });
      if (JSON.stringify(drawInvariant(beforeDraw)) !== JSON.stringify(drawInvariant(afterDraw))) throw Error('Pair body/bar/camera changed');
      const styleInvariant = p => ({ ...p, transform: { a:p.transform.a, b:p.transform.b, c:p.transform.c, d:p.transform.d } });
      if (JSON.stringify(beforeFeedback.paints.map(styleInvariant)) !== JSON.stringify(afterFeedback.paints.map(styleInvariant))) throw Error('Feedback values/style/rotation changed');
      if (JSON.stringify(beforeFeedback.numbers) !== JSON.stringify(afterFeedback.numbers)) throw Error('Number fields/TTL changed');
      const one = afterFeedback.paints.filter(p => p.name === 'fillText' && p.args[0] === '1');
      if (one.length !== 1 || afterFeedback.labelRects.length !== 1) throw Error('Number 1 missing or extra feedback');
      const label = afterFeedback.labelRects[0], overlaps = r._rectsOverlap.bind(r);
      const clearance = { enemies: !afterFeedback.enemyRects.some(b => overlaps(label,b,3)), player: !overlaps(label,afterFeedback.playerRect,3),
        hud: !afterFeedback.hudRects.some(b => overlaps(label,b,3)), inView: r._damageRectInView(label) };
      let changedPixels = 0, outsideNumberMasks = 0; const masks = [...beforeFeedback.screenLabelRects, ...afterFeedback.screenLabelRects];
      for (let p = 0; p < beforePixels.length; p += 4) if ([0,1,2,3].some(c => beforePixels[p+c] !== afterPixels[p+c])) {
        changedPixels++; const x = p/4%390, y = Math.floor(p/4/390);
        if (!masks.some(b => x >= Math.floor(b.left)-3 && x <= Math.ceil(b.right)+3 && y >= Math.floor(b.top)-3 && y <= Math.ceil(b.bottom)+3)) outsideNumberMasks++;
      }
      if (!changedPixels || outsideNumberMasks) throw Error('Pixel changes not confined to number/burst AABBs');
      const comparison = { beforeDraw, afterDraw, beforeFeedback, afterFeedback, samePoseBarCameraStateRng: true,
        sameNumberFieldsOrderTtlStyleRotation: true, changedPixels, outsideNumberMasks, masks, clearance,
        statusRectsUnchanged: JSON.stringify(beforeFeedback.statusRects) === JSON.stringify(afterFeedback.statusRects),
        beforeActualBarOverlap: overlaps(beforeFeedback.labelRects[0], beforeDraw.bar,3) };
      for (let i = 0; i < 5; i++) { step(.025); draw(); } e.damageEnemy(leader, leader.hp + 1, {}); draw();
      const death = s.effects.find(effect => effect.kind === 'death' && effect.encounterIdentity === binding.identity), deathTtlAtCreation = death.maxTtl;
      for (let i = 0; i < 14; i++) { step(.025); draw(); } shot('death-frame31-no-bar');
      for (let i = 0; i < 3; i++) { step(.025); draw(); } shot('original-death-expired');
      return { comparison, controlSync, snapshots, draws, events, errors, syncs, renderChecks, consumerChecks, rngCalls: calls,
        deathTtlAtCreation, expired: !s.effects.includes(death) && preview.retainedRecords === 0,
        controlsUnbound: ordinary.encounterIdentity === null && homonym.encounterIdentity === null,
        attackPreviewed: draws.some(d => d.pose.state === 'attack'), partialEngineStepFixture: true, naturalFiveMinuteSurvival: false,
        damageObstacleGeometryUpdated: true, currentRenderCacheOnly: true, rendererMode: r.battleSceneMode, artMode: r.battleArtMode };
    } finally { e.onEvent = saved.event; e.rng = saved.rng; r._drawEnemy = saved.enemy; r._drawEffect = saved.effect;
      r._enemyDamageOcclusionRects = saved.obstacles; r._drawCombatFeedback = saved.feedback; g.ctx.fillText = saved.fillText; g.ctx.strokeText = saved.strokeText;
      if (e.onEvent !== saved.event || e.rng !== saved.rng || r._drawEnemy !== saved.enemy || r._drawEffect !== saved.effect
        || r._enemyDamageOcclusionRects !== saved.obstacles || r._drawCombatFeedback !== saved.feedback
        || g.ctx.fillText !== saved.fillText || g.ctx.strokeText !== saved.strokeText) throw Error('Hook restoration differs'); g.draw(); }
  }, { observerUrl, layoutUrl, feedbackUrl, pages, candidate, motion, layout }), 'limited feedback fixture', 20000);
  for (const s of fixture.snapshots) { const bytes = Buffer.from(s.pngBase64, 'base64'); delete s.pngBase64;
    const f = path.join(output, `${s.name}.png`); fs.writeFileSync(f, bytes); s.snapshot = { file: rel(f), bytes: bytes.length, sha256: hash(bytes), kind: 'explicit-evidence-only-feedback-fixture' }; report.screenshots.push(s.snapshot); }
  report.fixture = fixture; assert.deepEqual(fixture.errors, []); assert.equal(fixture.deathTtlAtCreation, .42); assert.equal(fixture.expired, true);
  assert.equal(fixture.attackPreviewed, false); assert.equal(fixture.controlsUnbound, true); report.hookReferenceRestorationChecked = true;
  report.disposed = await page.evaluate(() => { window.xiyou.dispose(); return window.xiyou.disposed; });
  const c = fixture.comparison, sync = fixture.controlSync;
  const targetSlots = sync.result.replacements.flatMap(x => [x.bodyIndex,x.barIndex]).filter(x => x !== null);
  report.checks = { realPointerUiBeforeFixture: report.uiEntry.screen === 'game' && !report.uiEntry.debug,
    targetSlotSyncOnly: sync.result.applied && sync.sameBuffer && sync.before.length === sync.after.length && sync.before.every((b,i) => targetSlots.includes(i) || JSON.stringify(b) === JSON.stringify(sync.after[i])),
    sameStateBodyBarCameraRng: c.samePoseBarCameraStateRng, sameNumberContentFieldsTtlStyleRotation: c.sameNumberFieldsOrderTtlStyleRotation,
    oldConflictReproduced: c.beforeActualBarOverlap, finiteRegisteredClearance: Object.values(c.clearance).every(Boolean),
    noUnresolvedAtHitFixture: ['damageEnemyUnresolved','damagePlayerUnresolved','damageHudUnresolved','damageLabelUnresolved'].every(k => c.afterFeedback.stats[k] === 0),
    pixelChangesConfinedToNumberBurst: c.changedPixels > 0 && c.outsideNumberMasks === 0, statusRectsUnchangedAtFixture: c.statusRectsUnchanged,
    noInventedAttack: true, originalDeathExpiry: true, noProductionReferences: report.runtimeReferences.length === 0,
    noErrorsOrExternalNetwork: !report.pageErrors.length && !report.consoleErrors.length && !report.failedRequests.length && !report.httpErrors.length && !report.externalRequests.length };
  report.result = Object.values(report.checks).every(Boolean) ? 'REVIEW_EVIDENCE_ONLY_SHARED_FEEDBACK_RECTS' : 'FAIL';
} catch (error) { report.error = String(error.stack || error); }
finally {
  if (context) try { await bounded(context.close(), 'context close'); report.contextClosed = true; } catch (e) { report.cleanupError = String(e); report.result = 'FAIL'; }
  if (browser) try { await bounded(browser.close(), 'browser close'); report.browserClosed = true; } catch (e) { report.cleanupError = String(e); report.result = 'FAIL'; }
  if (server) try { const stopped = new Promise(resolve => server.once('close', resolve)); server.kill(); await bounded(stopped, 'server close'); report.serverClosed = true; } catch (e) { report.cleanupError = String(e); report.result = 'FAIL'; }
  report.protectedAfter = fingerprint(); report.protectedUnchanged = JSON.stringify(report.protectedBefore) === JSON.stringify(report.protectedAfter);
  if (!report.protectedUnchanged) report.result = 'FAIL'; report.finishedAt = new Date().toISOString(); fs.writeFileSync(path.join(output, 'browser.json'), JSON.stringify(report,null,2));
}
console.log(JSON.stringify({ file: rel(path.join(output,'browser.json')), result: report.result, checks: report.checks,
  screenshots: report.screenshots.length, protectedFiles: Object.keys(expected).length, protectedUnchanged: report.protectedUnchanged,
  browserClosed: report.browserClosed, serverClosed: report.serverClosed, error: report.error },null,2));
if (report.result === 'FAIL') process.exitCode = 1;
