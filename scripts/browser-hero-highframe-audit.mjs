import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

// Diagnostic only. Never changes a production image, frame contract or engine.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
const output = path.join(root, 'evidence/current/hero-highframe', stamp);
fs.mkdirSync(output, { recursive: true });
const relative = file => path.relative(root, file).replaceAll('\\', '/');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const inventory = JSON.parse(fs.readFileSync(path.join(root, 'evidence/current/asset-dedup-audit.json'), 'utf8'));
const protectedPaths = [...new Set([
  ...walk(path.join(root, 'prototype-2d')).map(relative),
  ...inventory.inventory.map(item => item.path),
  ...walk(path.join(root, 'dist')).filter(file => file.endsWith('.zip')).map(relative),
  'scripts/build.mjs', 'scripts/serve.mjs', 'scripts/release.mjs', 'scripts/runtime-frame-contract.mjs',
])].sort();
const snapshot = () => Object.fromEntries(protectedPaths.map(file => [file, hash(fs.readFileSync(path.join(root, file)))]));
const report = {
  generatedAt: new Date().toISOString(), result: 'EXECUTION_FAILED',
  scope: 'local workspace real Edge; one UI gameplay sample plus explicitly synthetic renderer fixtures; no FPS, internet, ZIP or WeChat acceptance',
  output: relative(output), url: 'http://127.0.0.1:8093/',
  diagnosticSha256: hash(fs.readFileSync(fileURLToPath(import.meta.url))),
  protectedBefore: snapshot(), heroes: {}, screenshots: [], pageErrors: [], consoleErrors: [], failedRequests: [],
  releaseApproved: false, highFrameQualityApproved: false,
};
// Preserve only the small reports that the subsequent npm test / inventory audit overwrite.
report.previousEvidence = [];
for (const file of walk(path.join(root, 'evidence/current')).filter(file => /(?:validation|normal-run|full-run|platform|engine-runtime|public-contract-node|node|asset-dedup-audit)\.json$/.test(file) && !file.includes(`${path.sep}hero-highframe${path.sep}`))) {
  const local = path.relative(path.join(root, 'evidence/current'), file);
  const target = path.join(output, 'previous-evidence', local);
  fs.mkdirSync(path.dirname(target), { recursive: true }); fs.copyFileSync(file, target);
  report.previousEvidence.push({ file: relative(file), backup: relative(target), sha256: hash(fs.readFileSync(file)) });
}
fs.writeFileSync(path.join(output, 'baseline.json'), JSON.stringify(report, null, 2));
const bounded = async (promise, label, ms = 20000) => {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${label} timeout`)), ms); })]); }
  finally { clearTimeout(timer); }
};
let browser, server;
try {
  const serverEnv = { ...process.env, PORT: '8093' };
  delete serverEnv.SERVE_ROOT; delete serverEnv.SERVE_PUBLIC;
  server = spawn(process.execPath, ['scripts/serve.mjs'], { cwd: root, env: serverEnv, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  report.server = { pid: server.pid, stdout: '', stderr: '', exitObserved: false };
  const serverExited = new Promise(resolve => server.once('exit', (code, signal) => { report.server.exitObserved = true; report.server.exitCode = code; report.server.signal = signal; resolve(); }));
  server.__auditExited = serverExited;
  await bounded(new Promise((resolve, reject) => {
    server.once('error', reject);
    server.once('exit', code => reject(new Error(`Owned server exited before ready (${code})`)));
    server.stdout.on('data', bytes => { report.server.stdout += String(bytes); if (report.server.stdout.includes('http://127.0.0.1:8093/')) resolve(); });
    server.stderr.on('data', bytes => { report.server.stderr += String(bytes); });
  }), 'owned server readiness', 10000);
  const playwright = await loadPlaywright();
  browser = await playwright.chromium.launch({ ...browserLaunchOptions(), timeout: 20000 });
  report.browser = browser.version();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  page.setDefaultTimeout(15000);
  const evaluate = (fn, arg) => bounded(page.evaluate(fn, arg), 'page evaluation');
  page.on('pageerror', error => report.pageErrors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
  page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  const shot = async name => {
    const file = path.join(output, `${name}.png`);
    const bytes = await page.screenshot({ path: file });
    report.screenshots.push({ file: relative(file), bytes: bytes.length, sha256: hash(bytes) });
  };
  const clickButton = async label => {
    const point = await evaluate(label => {
      const g = window.xiyou, b = g.buttons.find(button => button.label === label);
      if (!b) throw new Error(`Game button unavailable: ${label}`);
      const rect = g.canvas.getBoundingClientRect();
      return { x: rect.left + (b.x + b.w / 2) * rect.width / g.w, y: rect.top + (b.y + b.h / 2) * rect.height / g.h };
    }, label);
    await page.mouse.click(point.x, point.y);
    await page.waitForFunction(() => !window.xiyou.getUIMotionState().active && !window.xiyou.getUIMotionState().pressActive);
  };
  await page.goto(report.url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForFunction(() => ['wukong', 'tangsanzang', 'bajie', 'shajing'].every(id => window.xiyou?.heroImages?.[id]?.__v3BattleSprite));
  await clickButton('踏上西行'); await clickButton('沙悟净');
  await shot('ui-wujing-selected');
  await clickButton('入山 · 开始十分钟试炼');
  await page.waitForFunction(() => window.xiyou?.engine?.state?.status === 'playing');
  await evaluate(() => {
    const g = window.xiyou, ctx = g.renderer.ctx, drawImage = ctx.drawImage.bind(ctx);
    window.__heroNatural = new Map();
    ctx.drawImage = (...args) => {
      if (args[0] === g.heroImages.shajing) {
        const p = g.engine.state.player, m = ctx.getTransform();
        window.__heroNatural.set(`${p.animationState}:${p.frameIndex}`, {
          state: p.animationState, frameIndex: p.frameIndex, animationFrames: p.animationFrames,
          time: g.engine.state.time, sourceRect: args.slice(1, 5), destination: args.slice(5),
          matrix: [m.a, m.b, m.c, m.d, m.e, m.f],
        });
      }
      return drawImage(...args);
    };
  });
  await page.keyboard.down('d'); await page.waitForTimeout(1600);
  await shot('natural-wujing-moving');
  await page.keyboard.up('d'); await page.waitForTimeout(700);
  report.natural = await evaluate(() => {
    const g = window.xiyou, s = g.engine.state;
    if (g.frame) g.cancel(g.frame); g.frame = 0; g.running = false;
    return { mode: 'Real UI selection and keyboard input; wall-clock gameplay, then RAF stopped without mutating simulation fields',
      character: s.character.id, status: s.status, time: s.time, player: { ...s.player }, draws: [...window.__heroNatural.values()],
      battleArtMode: g.renderer.battleArtMode, battleSceneMode: g.renderer.battleSceneMode, mapAssetDraws: g.renderer.mapAssetDraws };
  });
  await shot('natural-wujing-stationary');
  report.heroes = await evaluate(() => {
    const g = window.xiyou, result = {};
    for (const id of ['wukong', 'tangsanzang', 'bajie', 'shajing']) {
      const image = g.heroImages[id], contract = image.__battleFrameContract, grid = image.__frameGrids[id];
      const canvas = document.createElement('canvas'); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true }); ctx.drawImage(image, 0, 0);
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height), cuts = [];
      const alpha = (x, y) => data[(y * canvas.width + x) * 4 + 3] >= 16;
      // Occupied pixels on both sides of a cut are a warning, not a connected-pose count.
      for (let col = 1; col < contract.cols; col++) {
        const x = image.naturalWidth * col / contract.cols, left = Math.ceil(x) - 1, right = Math.ceil(x);
        for (let row = 0; row < contract.rows; row++) {
          let count = 0;
          for (let y = Math.ceil(row * image.naturalHeight / contract.rows); y < Math.ceil((row + 1) * image.naturalHeight / contract.rows); y++) if (alpha(left, y) && alpha(right, y)) count++;
          cuts.push({ axis: 'x', x, row, occupiedPairs: count });
        }
      }
      const y = image.naturalHeight / contract.rows;
      let acrossRow = 0;
      for (let x = 0; x < image.naturalWidth; x++) if (alpha(x, Math.ceil(y) - 1) && alpha(x, Math.ceil(y))) acrossRow++;
      cuts.push({ axis: 'y', y, occupiedPairs: acrossRow });
      result[id] = { src: image.currentSrc || image.src, width: image.naturalWidth, height: image.naturalHeight, contract,
        states: Object.fromEntries(Object.entries(grid.states).map(([state, value]) => {
          const keys = value.rects.map(r => JSON.stringify([r.x, r.y, r.w, r.h]));
          const unique = [...new Set(keys)];
          return [state, { scheduledFrames: value.frames, uniqueSourceRectangles: unique.length,
            rectangleSequence: keys.map(key => unique.indexOf(key)), rectangles: value.rects }];
        })), cutWarnings: cuts };
    }
    window.__heroAuditAssets = g.heroImages;
    window.__heroAuditPlayer = { ...g.engine.state.player };
    window.__heroRendererClass = g.renderer.constructor;
    g.dispose();
    return result;
  });
  for (const [id, info] of Object.entries(report.heroes)) {
    const file = path.join(root, 'prototype-2d', new URL(info.src).pathname);
    const bytes = fs.readFileSync(file);
    info.asset = { file: relative(file), bytes: bytes.length, sha256: hash(bytes), purpose: 'current battlefield sheet; not a portrait' };
    await page.setViewportSize({ width: 1120, height: 700 });
    await evaluate(id => {
      const image = window.__heroAuditAssets[id], c = document.createElement('canvas');
      c.width = 1120; c.height = 700; c.style.cssText = 'display:block;width:1120px;height:700px;max-width:none;max-height:none;border:0;border-radius:0';
      document.body.replaceChildren(c); document.body.style.cssText = 'margin:0;display:block';
      const ctx = c.getContext('2d'), x = 30, y = 95, scale = 1060 / image.naturalWidth;
      ctx.fillStyle = '#eee6d3'; ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = '#2b2522'; ctx.font = 'bold 24px sans-serif'; ctx.fillText(`${id}: original PNG + runtime crop boundaries`, 30, 34);
      ctx.font = '16px sans-serif'; ctx.fillText('Diagnostic overlay only. Red lines are uniform runtime cuts; NOT an approved sprite grid.', 30, 66);
      ctx.drawImage(image, x, y, image.naturalWidth * scale, image.naturalHeight * scale);
      const { cols, rows } = image.__battleFrameContract; ctx.strokeStyle = '#d11158'; ctx.lineWidth = 2;
      for (let col = 1; col < cols; col++) { const xx = x + col * image.naturalWidth / cols * scale; ctx.beginPath(); ctx.moveTo(xx, y); ctx.lineTo(xx, y + image.naturalHeight * scale); ctx.stroke(); }
      for (let row = 1; row < rows; row++) { const yy = y + row * image.naturalHeight / rows * scale; ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + image.naturalWidth * scale, yy); ctx.stroke(); }
      ctx.fillStyle = '#2b2522'; ctx.fillText(`${image.naturalWidth} x ${image.naturalHeight}; declared ${cols} x ${rows}; original asset bytes unchanged`, 30, 665);
    }, id);
    await shot(`${id}-source-cuts`);
    await page.setViewportSize({ width: 1120, height: 780 });
    info.rendererFixture = await evaluate(id => {
      const image = window.__heroAuditAssets[id], canvas = document.createElement('canvas');
      canvas.style.cssText = 'display:block;width:1120px;height:780px;max-width:none;max-height:none;border:0;border-radius:0';
      document.body.replaceChildren(canvas);
      const renderer = new window.__heroRendererClass(canvas, { width: 1120, height: 780, pixelRatio: 1, showHud: false, battleArtMode: 'authoredFrames', heroImages: window.__heroAuditAssets });
      const ctx = renderer.ctx, records = [], originalDraw = ctx.drawImage.bind(ctx);
      let sample;
      ctx.drawImage = (...args) => {
        if (args[0] === image) { const m = ctx.getTransform(); records.push({ ...sample, sourceRect: args.slice(1, 5), destination: args.slice(5), matrix: [m.a, m.b, m.c, m.d, m.e, m.f] }); }
        return originalDraw(...args);
      };
      ctx.fillStyle = '#eee6d3'; ctx.fillRect(0, 0, 1120, 780);
      ctx.fillStyle = '#2b2522'; ctx.font = 'bold 23px sans-serif'; ctx.fillText(`${id}: actual _drawPlayer renderer fixtures`, 24, 34);
      ctx.font = '16px sans-serif'; ctx.fillText('Cloned entities, not natural gameplay. No source-image correction. Radius 22; grid labels are schedule indices.', 24, 65);
      for (const [row, [state, facing]] of [['move', 0], ['attack', 0], ['move', Math.PI], ['attack', Math.PI]].entries()) {
        const sequence = image.__frameGrids[id].states[state];
        const unique = new Set(sequence.rects.map(rect => JSON.stringify(rect))).size;
        ctx.fillStyle = '#2b2522'; ctx.font = '16px sans-serif';
        ctx.fillText(`${state}, ${facing === 0 ? 'right' : 'left'}: ${sequence.frames} scheduled / ${unique} unique source rectangles`, 24, 102 + row * 160);
        for (let frameIndex = 0; frameIndex < sequence.frames; frameIndex++) {
          const x = 81 + frameIndex * 136, y = 176 + row * 160;
          ctx.strokeStyle = '#c2b59a'; ctx.lineWidth = 1; ctx.strokeRect(x - 64, y - 60, 128, 130);
          ctx.fillStyle = '#2b2522'; ctx.font = '13px sans-serif'; ctx.fillText(`#${frameIndex}`, x - 59, y + 65);
          sample = { state, facing: facing === 0 ? 'right' : 'left', frameIndex };
          renderer._drawPlayer(ctx, { ...window.__heroAuditPlayer, x, y, radius: 22, facing, animationState: state, animationFrames: sequence.frames,
            frameIndex, hitFlash: 0, attackFlash: 0, invulnerable: 0 }, id);
        }
      }
      renderer.dispose();
      return { scope: 'Synthetic cloned-player renderer fixtures; not natural states, FPS or pose-quality approval', records };
    }, id);
    await shot(`${id}-renderer-move-attack`);
  }
  report.checks = {
    realWujingDraws: report.natural.draws.length > 0 && ['wujing', 'shajing'].includes(report.natural.character),
    fourSheetsDecoded: Object.keys(report.heroes).length === 4,
    fixturesUsedActualRects: Object.values(report.heroes).every(hero => hero.rendererFixture.records.length === 32 && hero.rendererFixture.records.every(record => {
      const r = hero.states[record.state].rectangles[record.frameIndex];
      return JSON.stringify(record.sourceRect) === JSON.stringify([r.x, r.y, r.w, r.h]);
    })),
    noUnexpectedBrowserErrors: !report.pageErrors.length && !report.consoleErrors.length && !report.failedRequests.length,
  };
  report.findings = {
    repeatedMoveAndAttackRects: Object.values(report.heroes).every(hero => hero.states.move.uniqueSourceRectangles < hero.states.move.scheduledFrames && hero.states.attack.uniqueSourceRectangles < hero.states.attack.scheduledFrames),
    allSheetsHaveOccupiedCropBoundaries: Object.values(report.heroes).every(hero => hero.cutWarnings.some(cut => cut.occupiedPairs > 0)),
    wholeSpriteRotationOrScale: Object.values(report.heroes).every(hero => hero.rendererFixture.records.some(record => Math.abs(record.matrix[1]) > .0001 || Math.abs(record.matrix[2]) > .0001 || Math.abs(record.matrix[3] - 1) > .0001)),
    note: 'Rectangle counts and boundary alpha warnings are not independent complete-pose counts; screenshots require human inspection.',
  };
  report.result = Object.values(report.checks).every(Boolean)
    ? report.findings.repeatedMoveAndAttackRects ? 'OBSERVED_BASELINE_DEFECT' : 'REVIEW'
    : 'EXECUTION_FAILED';
} catch (error) { report.error = String(error?.stack || error); }
finally {
  if (browser) {
    try { await bounded(browser.close(), 'browser close', 15000); report.browserClosed = true; }
    catch (error) { report.browserCleanupError = String(error); report.result = 'EXECUTION_FAILED'; }
  }
  if (server?.pid && !report.server.exitObserved) {
    report.server.stopRequested = server.kill();
    try { await bounded(server.__auditExited, 'owned server exit', 10000); }
    catch (error) { report.server.cleanupError = String(error); report.result = 'EXECUTION_FAILED'; }
  }
  report.protectedAfter = snapshot();
  report.protectedChanged = protectedPaths.filter(file => report.protectedBefore[file] !== report.protectedAfter[file]);
  if (report.protectedChanged.length) report.result = 'EXECUTION_FAILED';
  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(path.join(output, 'browser.json'), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ output: relative(output), result: report.result, checks: report.checks, findings: report.findings,
  error: report.error, browserClosed: report.browserClosed, server: report.server, changed: report.protectedChanged }, null, 2));
if (report.result === 'EXECUTION_FAILED') process.exitCode = 1;
