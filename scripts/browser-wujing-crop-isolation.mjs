import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const folder = path.resolve(root, process.argv[2] || 'missing-preflight-directory');
if (!folder.startsWith(path.join(root, 'evidence/current/wujing-crop-isolation') + path.sep)) throw new Error('Expected a local Wujing audit directory');
const preflight = JSON.parse(fs.readFileSync(path.join(folder, 'preflight.json'), 'utf8'));
const stamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
const output = path.join(folder, `browser-${stamp}`);
fs.mkdirSync(output, { recursive: true });
const relative = file => path.relative(root, file).replaceAll('\\', '/');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const report = { generatedAt: new Date().toISOString(), result: 'EXECUTION_FAILED', output: relative(output),
  preflightSha256: hash(fs.readFileSync(path.join(folder, 'preflight.json'))), scriptSha256: hash(fs.readFileSync(fileURLToPath(import.meta.url))),
  url: 'http://127.0.0.1:8093/', scope: 'local real Edge gameplay baseline plus unintegrated measured-crop previews; not a runtime fix, high-frame, public, archive or device gate',
  pageErrors: [], consoleErrors: [], requestFailures: [], screenshots: [], runtimeApproved: false, rectangularIsolationApproved: false };
const bounded = async (promise, label, ms = 20000) => {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${label} timeout`)), ms); })]); }
  finally { clearTimeout(timer); }
};
let browser, server, serverExit;
try {
  if (!preflight.manifestMatches || preflight.sha256 !== hash(fs.readFileSync(path.join(root, preflight.input)))) throw new Error('Preflight asset identity mismatch');
  const env = { ...process.env, PORT: '8093' }; delete env.SERVE_ROOT; delete env.SERVE_PUBLIC;
  server = spawn(process.execPath, ['scripts/serve.mjs'], { cwd: root, env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  report.server = { pid: server.pid, stdout: '', stderr: '', exitObserved: false };
  serverExit = new Promise(resolve => server.once('exit', (code, signal) => { Object.assign(report.server, { exitObserved: true, code, signal }); resolve(); }));
  await bounded(new Promise((resolve, reject) => {
    server.once('error', reject); server.once('exit', code => reject(new Error(`Server exited (${code})`)));
    server.stdout.on('data', bytes => { report.server.stdout += bytes; if (report.server.stdout.includes('http://127.0.0.1:8093/')) resolve(); });
    server.stderr.on('data', bytes => { report.server.stderr += bytes; });
  }), 'server readiness', 10000);
  const playwright = await loadPlaywright(); browser = await playwright.chromium.launch({ ...browserLaunchOptions(), timeout: 20000 });
  report.browserVersion = browser.version();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 }); page.setDefaultTimeout(15000);
  page.on('pageerror', error => report.pageErrors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
  page.on('requestfailed', request => report.requestFailures.push({ url: request.url(), error: request.failure()?.errorText }));
  const evaluate = (fn, arg) => bounded(page.evaluate(fn, arg), 'page evaluation');
  const shot = async (name, metadata) => {
    const file = path.join(output, `${name}.png`), bytes = await page.screenshot({ path: file });
    report.screenshots.push({ file: relative(file), bytes: bytes.length, sha256: hash(bytes), metadata });
  };
  await page.goto(report.url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForFunction(() => window.xiyou?.heroImages?.shajing?.__v3BattleSprite && window.xiyou?.enemyImages?.snake?.__snakeBattleSprite);
  const click = async label => {
    const point = await evaluate(label => {
      const g = window.xiyou, b = g.buttons.find(button => button.label === label), r = g.canvas.getBoundingClientRect();
      if (!b) throw new Error(`Missing button ${label}`);
      return { x: r.left + (b.x + b.w / 2) * r.width / g.w, y: r.top + (b.y + b.h / 2) * r.height / g.h };
    }, label);
    await page.mouse.click(point.x, point.y);
    await page.waitForFunction(() => !window.xiyou.getUIMotionState().active && !window.xiyou.getUIMotionState().pressActive);
  };
  await click('踏上西行'); await click('沙悟净'); await click('入山 · 开始十分钟试炼');
  await page.waitForFunction(() => window.xiyou.engine.state.status === 'playing');
  await evaluate(() => {
    const g = window.xiyou, ctx = g.renderer.ctx, original = ctx.drawImage.bind(ctx);
    ctx.drawImage = (...args) => {
      if (args[0] === g.heroImages.shajing) {
        const s = g.engine.state;
        window.__wujingLastDraw = { time: s.time, state: s.player.animationState, frameIndex: s.player.frameIndex,
          sourceRect: args.slice(1, 5), character: s.character.id, radius: s.player.radius };
      }
      return original(...args);
    };
  });
  await page.keyboard.down('d'); await page.waitForTimeout(1150);
  report.natural = await evaluate(() => {
    const g = window.xiyou;
    if (g.frame) g.cancel(g.frame); g.frame = 0; g.running = false;
    return { mode: 'UI selection + wall-clock keyboard input, RAF frozen without changing simulation state; exact last-draw metadata attached',
      status: g.engine.state.status, lastDraw: window.__wujingLastDraw,
      battleArtMode: g.renderer.battleArtMode, battleSceneMode: g.renderer.battleSceneMode, mapAssetDraws: g.renderer.mapAssetDraws };
  });
  await shot('baseline-keyboard-sample', report.natural);
  await page.keyboard.up('d');
  report.asset = await evaluate(() => {
    const g = window.xiyou, image = window.__wujingCropSource = g.heroImages.shajing;
    const meta = { src: image.currentSrc || image.src, width: image.naturalWidth, height: image.naturalHeight };
    g.dispose(); return meta;
  });
  await page.setViewportSize({ width: 1440, height: 930 });
  for (const mode of ['source-overlay', 'candidate-tight', 'candidate-padded']) {
    const result = await evaluate(({ mode, measurement }) => {
      const image = window.__wujingCropSource, c = document.createElement('canvas'); c.width = 1440; c.height = 930;
      c.style.cssText = 'display:block;width:1440px;height:930px;max-width:none;max-height:none;border:0;border-radius:0';
      document.body.replaceChildren(c); document.body.style.cssText = 'margin:0;display:block';
      const ctx = c.getContext('2d'), draws = [], original = ctx.drawImage.bind(ctx);
      ctx.drawImage = (...args) => { draws.push(args.slice(1)); return original(...args); };
      ctx.fillStyle = '#eee6d3'; ctx.fillRect(0, 0, c.width, c.height); ctx.fillStyle = '#302521'; ctx.font = 'bold 25px sans-serif';
      ctx.fillText(`Wujing crop feasibility: ${mode} — REVIEW / NOT INTEGRATED`, 25, 36);
      ctx.font = '17px sans-serif'; ctx.fillText('Original PNG pixels. Candidate rectangles only, not production animation or a fixed gameplay result.', 25, 68);
      if (mode === 'source-overlay') {
        const scale = 1360 / image.naturalWidth, x = 40, y = 140;
        ctx.drawImage(image, x, y, image.naturalWidth * scale, image.naturalHeight * scale);
        for (const candidate of measurement.candidates) {
          const rect = candidate.tight.rect;
          ctx.strokeStyle = candidate.tight.neighborPixels ? '#c3104b' : '#327638'; ctx.lineWidth = 2;
          ctx.strokeRect(x + rect.x * scale, y + rect.y * scale, rect.w * scale, rect.h * scale);
          ctx.fillStyle = '#302521'; ctx.font = '16px sans-serif';
          ctx.fillText(`#${candidate.index}: ${candidate.tight.neighborPixels} foreign pixels`, x + rect.x * scale, y + rect.y * scale - 8);
        }
      } else {
        for (const candidate of measurement.candidates) {
          const variant = mode === 'candidate-tight' ? candidate.tight : candidate.padded, rect = variant.rect;
          const x = 20 + candidate.index % 4 * 355, y = 110 + Math.floor(candidate.index / 4) * 390;
          ctx.strokeStyle = variant.neighborPixels ? '#c3104b' : '#327638'; ctx.lineWidth = 2; ctx.strokeRect(x, y, 336, 360);
          ctx.fillStyle = '#302521'; ctx.font = 'bold 16px sans-serif'; ctx.fillText(`#${candidate.index}  foreign actor pixels: ${variant.neighborPixels}`, x + 9, y + 25);
          const scale = Math.min(310 / rect.w, 285 / rect.h), w = rect.w * scale, h = rect.h * scale;
          ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h, x + (336 - w) / 2, y + 52 + (285 - h) / 2, w, h);
          ctx.font = '13px sans-serif'; ctx.fillText(`${rect.x},${rect.y} ${rect.w}x${rect.h}; full major component kept`, x + 9, y + 349);
        }
      }
      ctx.fillStyle = '#302521'; ctx.font = '16px sans-serif'; ctx.fillText('Alpha > 8, four-neighbor major components; red = other major actor pixels inside a complete crop.', 25, 910);
      return { mode, scope: 'Unintegrated diagnostic display; per-cell fit is for inspection only, NOT a runtime scale/root proposal', draws };
    }, { mode, measurement: preflight.measurements.find(m => m.alphaGreaterThan === 8) });
    await shot(mode, result);
  }
  report.checks = {
    expectedImage: report.asset.width === preflight.width && report.asset.height === preflight.height && report.asset.src.endsWith('/assets/hero-wujing-battle-v3-sheet.png'),
    realGameplaySample: report.natural.status === 'playing' && report.natural.lastDraw?.character === 'wujing' && report.natural.lastDraw.time > 1,
    candidateDrawsMatch: report.screenshots.filter(s => s.metadata.mode?.startsWith('candidate-')).every(s => {
      const candidates = preflight.measurements.find(m => m.alphaGreaterThan === 8).candidates;
      return s.metadata.draws.length === 8 && s.metadata.draws.every((draw, i) => {
        const rect = candidates[i][s.metadata.mode === 'candidate-tight' ? 'tight' : 'padded'].rect;
        return JSON.stringify(draw.slice(0, 4)) === JSON.stringify([rect.x, rect.y, rect.w, rect.h]);
      });
    }),
    noErrors: !report.pageErrors.length && !report.consoleErrors.length && !report.requestFailures.length,
  };
  report.result = Object.values(report.checks).every(Boolean) ? 'REVIEW_RECTANGULAR_CROP_CONTAMINATION' : 'EXECUTION_FAILED';
} catch (error) { report.error = String(error?.stack || error); }
finally {
  if (browser) try { await bounded(browser.close(), 'browser close', 15000); report.browserClosed = true; }
  catch (error) { report.cleanupError = String(error); report.result = 'EXECUTION_FAILED'; }
  if (server?.pid && !report.server.exitObserved) {
    report.server.stopRequested = server.kill();
    try { await bounded(serverExit, 'owned server exit', 10000); }
    catch (error) { report.server.cleanupError = String(error); report.result = 'EXECUTION_FAILED'; }
  }
  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(path.join(output, 'browser.json'), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ output: relative(output), result: report.result, checks: report.checks, error: report.error,
  browserClosed: report.browserClosed, server: report.server }, null, 2));
if (report.result === 'EXECUTION_FAILED') process.exitCode = 1;
