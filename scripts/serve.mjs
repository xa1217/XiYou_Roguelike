import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isRuntimeFrameContract, serializeRuntimeFrameContract } from './runtime-frame-contract.mjs';

const defaultBase = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../prototype-2d');
const base = path.resolve(process.env.SERVE_ROOT || defaultBase);
const port = Number(process.env.PORT || 8088);
const mime = {
  '.js': 'application/javascript', '.html': 'text/html', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.wav': 'audio/wav', '.png': 'image/png', '.ico': 'image/x-icon',
};
// Keep the public test channel to the current playable runtime. Source notes,
// candidate maps, generators, tests and manifests stay on the repository only.
const runtimeFiles = new Set([
  'index.html', 'native.html', 'native-app.js',
  'src/audio.js', 'src/content.js', 'src/engine.js', 'src/native-ui.js', 'src/progression.js', 'src/renderer.js',
  'src/tiger-animation.js', 'src/bear-animation.js', 'src/bull-animation.js', 'src/wolf-animation.js', 'src/monkey-animation.js', 'src/deer-animation.js', 'src/hawk-animation.js', 'src/snake-animation.js', 'src/boss-animation.js', 'src/battle-enemy-animation.js', 'src/skill-fx-animation.js', 'src/scene-collision.js',
  'assets/enemy-tiger-battle-v1-sheet.png', 'assets/enemy-tiger-battle-v1-frames.json',
  'assets/enemy-bear-battle-v1-sheet.png', 'assets/enemy-bear-battle-v1-frames.json',
  'assets/enemy-bull-battle-v1-sheet.png', 'assets/enemy-bull-battle-v1-frames.json',
  'assets/enemy-wolf-battle-v1-sheet.png', 'assets/enemy-wolf-battle-v1-frames.json',
  'assets/enemy-monkey-battle-v1-sheet.png', 'assets/enemy-monkey-battle-v1-frames.json',
  'assets/enemy-deer-battle-v1-sheet.png', 'assets/enemy-deer-battle-v1-frames.json',
  'assets/enemy-hawk-battle-v1-sheet.png', 'assets/enemy-hawk-battle-v1-frames.json',
  'assets/enemy-snake-battle-v3-sheet.png', 'assets/enemy-snake-battle-v3-frames.json',
  'assets/enemy-yin-general-battle-v1-sheet.png', 'assets/enemy-yin-general-battle-v1-frames.json',
  'assets/skill-fx-slash-arc.png', 'assets/skill-fx-light-orb.png', 'assets/skill-fx-rake-sweep.png', 'assets/skill-fx-water-ring.png',
  'assets/skill-fx-fan-wave.png', 'assets/skill-fx-gourd-vortex.png', 'assets/skill-fx-palm-burst.png', 'assets/skill-fx-fire-burst.png',
  'assets/skill-fx-fire-wheel.png', 'assets/skill-fx-ring-spin.png', 'assets/skill-fx-gold-bead.png', 'assets/skill-fx-fire-pool.png',
  'assets/skill-fx-monkey-clone.png', 'assets/skill-fx-whirl-pool.png',
  'assets/enemy-xiong-shanjun-battle-v1-sheet.png', 'assets/enemy-xiong-shanjun-battle-v1-frames.json',
  'assets/enemy-te-chushi-battle-v1-sheet.png', 'assets/enemy-te-chushi-battle-v1-frames.json',
  'assets/hero-cards-v2-comic.png',
  'assets/ui-paper.jpg', 'assets/ui-wood.jpg', 'assets/ui-patrol.jpg', 'assets/ui-chapter.jpg', 'assets/ui-poster.jpg',
  'assets/hero-wukong.svg', 'assets/hero-tangseng.svg', 'assets/hero-bajie.svg', 'assets/hero-wujing.svg',
  'assets/hero-wukong-battle-v3-sheet.png', 'assets/hero-tangseng-battle-v3-sheet.png', 'assets/hero-bajie-battle-v3-sheet.png', 'assets/hero-wujing-battle-v3-sheet.png',
  'assets/skill-icon-wukong.png', 'assets/skill-icon-tangsanzang.png', 'assets/skill-icon-bajie.png', 'assets/skill-icon-shajing.png',
  'assets/skill-icon-purple-gourd.png', 'assets/skill-icon-iron-fan.png', 'assets/skill-icon-diamond-snare.png', 'assets/skill-icon-nine-dragon.png',
  'assets/skill-icon-lotus-lantern.png', 'assets/skill-icon-golden-rope.png', 'assets/skill-icon-moon-mirror.png', 'assets/skill-icon-samadhi-fire.png',
  'assets/enemy-creature.svg', 'assets/enemy-brute.svg', 'assets/enemy-bird.svg', 'assets/enemy-spider.svg', 'assets/enemy-boss.svg',
  'assets/map-doublefork-high-ridge-v1.png', 'assets/map-forest-qv1.png', 'assets/map-temple-qv1.png',
  'assets/map-water-qv1.png', 'assets/map-fire-qv1.png', 'assets/map-sand-qv1.png', 'assets/map-snow-qv1.png',
]);
const publicMode = !process.env.SERVE_ROOT || process.env.SERVE_PUBLIC === '1';
const normalizeRequest = pathname => pathname.replace(/^\/+/, '').replaceAll('\\', '/');

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url || '/', 'http://localhost').pathname);
  } catch {
    res.writeHead(400); return res.end('Bad request');
  }
  const relative = normalizeRequest(pathname === '/' ? '/index.html' : pathname);
  if (relative === 'favicon.ico') { res.writeHead(204, { 'Cache-Control': 'no-store' }); return res.end(); }
  const file = path.resolve(base, relative);
  if (!file.startsWith(`${base}${path.sep}`) || (publicMode && !runtimeFiles.has(relative))) {
    res.writeHead(404, { 'Cache-Control': 'no-store' }); return res.end('Not found');
  }
  fs.stat(file, (statError, info) => {
    if (statError || !info.isFile()) {
      res.writeHead(404, { 'Cache-Control': 'no-store' }); return res.end('Not found');
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, { Allow: 'GET, HEAD' }); return res.end('Method not allowed'); }
    if (publicMode && isRuntimeFrameContract(relative)) {
      fs.readFile(file, 'utf8', (readError, source) => {
        try {
          if (readError) throw readError;
          const body = serializeRuntimeFrameContract(relative, source);
          res.writeHead(200, { 'Content-Type': mime['.json'], 'Content-Length': Buffer.byteLength(body), 'Cache-Control': 'no-store' });
          res.end(req.method === 'HEAD' ? undefined : body);
        } catch {
          res.writeHead(500, { 'Cache-Control': 'no-store' }); res.end('Runtime contract unavailable');
        }
      });
      return;
    }
    const headers = {
      'Content-Type': mime[path.extname(file)] || 'application/octet-stream',
      'Content-Length': String(info.size),
      'Cache-Control': 'no-store',
    };
    if (req.method === 'HEAD') { res.writeHead(200, headers); return res.end(); }
    if (req.method !== 'GET') { res.writeHead(405, { Allow: 'GET, HEAD' }); return res.end('Method not allowed'); }
    res.writeHead(200, headers);
    fs.createReadStream(file).pipe(res);
  });
});
server.on('error', error => { console.error(`Serve failed on 127.0.0.1:${port}: ${error.message}`); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`西游试玩 http://127.0.0.1:${port} ; 原生Canvas验证 http://127.0.0.1:${port}/native.html`));
