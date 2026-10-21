import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { isRuntimeFrameContract, serializeRuntimeFrameContract } from './runtime-frame-contract.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const version = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version;
const out = path.join(root, 'dist');
const staging = path.join(root, 'work', 'release-staging');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const copy = (src, dst) => { fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst); };
const clean = dir => {
  const target = path.resolve(dir);
  if (!target.startsWith(root + path.sep) || ![out, staging].includes(target)) throw new Error(`Refusing to clean unexpected release path: ${target}`);
  fs.rmSync(target, { recursive: true, force: true });
};
const files = dir => {
  const result = [];
  const walk = p => fs.readdirSync(p, { withFileTypes: true }).forEach(entry => {
    const full = path.join(p, entry.name);
    if (entry.isDirectory()) walk(full); else result.push(path.relative(dir, full).replaceAll(path.sep, '/'));
  });
  walk(dir); return result.sort();
};
const zip = (source, destination) => {
  const result = spawnSync('tar', ['-a', '-c', '-f', destination, '-C', source, '.'], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`ZIP creation failed: ${result.stderr || result.stdout}`);
};
const writeManifest = (dir, channel, included, notes) => {
  const manifest = { product: '西游·八十一难', version, channel, createdAt: new Date().toISOString(), debugEnabled: false, included: [...included, 'RELEASE-MANIFEST.json'], notes };
  fs.writeFileSync(path.join(dir, 'RELEASE-MANIFEST.json'), JSON.stringify(manifest, null, 2));
  return manifest;
};

// Ensure the generated WeChat core bundle is derived from the current shared source.
const build = spawnSync(process.execPath, ['scripts/build.mjs'], { cwd: root, encoding: 'utf8' });
if (build.status !== 0) throw new Error(build.stderr || 'scripts/build.mjs failed');
clean(staging); clean(out); fs.mkdirSync(out, { recursive: true });

const web = path.join(staging, 'web');
for (const name of ['index.html', 'native.html']) copy(path.join(root, 'prototype-2d', name), path.join(web, name));
// Public builds never expose the local debug seam, even if ?debug=1 is appended.
const nativeApp = fs.readFileSync(path.join(root, 'prototype-2d/native-app.js'), 'utf8')
  .replace(/debug\s*:\s*[^,]+(?=,audio)/, 'debug:false');
if (!/debug\s*:\s*false\b/.test(nativeApp)) throw new Error('Release safety check failed: browser debug is not hard-disabled');
fs.mkdirSync(web, { recursive: true }); fs.writeFileSync(path.join(web, 'native-app.js'), nativeApp);
for (const name of fs.readdirSync(path.join(root, 'prototype-2d/src'))) {
  if (name.endsWith('.js')) copy(path.join(root, 'prototype-2d/src', name), path.join(web, 'src', name));
}
// Include only assets referenced by the current browser runtime. Candidate
// maps, retired art, manifests, README files and generators must never enter a
// public release or become reachable through a public static server.
const assetRoot = path.join(root, 'prototype-2d/assets');
const runtimeAssets = [
  'hero-cards-v2-comic.png',
  'hero-wukong.svg', 'hero-tangseng.svg', 'hero-bajie.svg', 'hero-wujing.svg',
  'hero-wukong-battle-v3-sheet.png', 'hero-tangseng-battle-v3-sheet.png', 'hero-bajie-battle-v3-sheet.png', 'hero-wujing-battle-v3-sheet.png',
  'enemy-tiger-battle-v1-sheet.png', 'enemy-tiger-battle-v1-frames.json',
  'enemy-bear-battle-v1-sheet.png', 'enemy-bear-battle-v1-frames.json',
  'enemy-bull-battle-v1-sheet.png', 'enemy-bull-battle-v1-frames.json',
  'enemy-wolf-battle-v1-sheet.png', 'enemy-wolf-battle-v1-frames.json',
  'enemy-monkey-battle-v1-sheet.png', 'enemy-monkey-battle-v1-frames.json',
  'enemy-deer-battle-v1-sheet.png', 'enemy-deer-battle-v1-frames.json',
  'enemy-hawk-battle-v1-sheet.png', 'enemy-hawk-battle-v1-frames.json',
  'enemy-snake-battle-v3-sheet.png', 'enemy-snake-battle-v3-frames.json',
  'weapon-skill-wukong.svg', 'weapon-skill-tangseng.svg', 'weapon-skill-bajie.svg', 'weapon-skill-wujing.svg',
  'artifact-purple-gourd.svg', 'artifact-iron-fan.svg', 'artifact-diamond-snare.svg', 'artifact-nine-dragon.svg',
  'artifact-lotus-lantern.svg', 'artifact-golden-rope.svg', 'artifact-moon-mirror.svg', 'artifact-samadhi-fire.svg',
  'enemy-creature.svg', 'enemy-brute.svg', 'enemy-bird.svg', 'enemy-spider.svg', 'enemy-boss.svg',
];
for (const name of runtimeAssets) {
  const source = path.join(assetRoot, name);
  if (!fs.existsSync(source)) throw new Error(`Missing runtime artwork: ${name}`);
  const relative = `assets/${name}`;
  if (isRuntimeFrameContract(relative)) {
    const target = path.join(web, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, serializeRuntimeFrameContract(relative, fs.readFileSync(source, 'utf8')));
  } else copy(source, path.join(web, relative));
}
for (const match of nativeApp.matchAll(/(?:['"`]\.\/assets\/)([^'"`]+)['"`]/g)) {
  if (!match[1].includes('${') && !fs.existsSync(path.join(web, 'assets', match[1]))) throw new Error(`Missing release artwork: ${match[1]}`);
}
const webManifest = writeManifest(web, 'web', files(web), [
  'Static Canvas runtime only; no tests, generators, legacy source, local evidence, credentials or package manager metadata.',
  'The debug constructor flag is hard-disabled in this release copy. Use the repository localhost build for debug seams.'
]);
const webZip = path.join(out, `xiyou-survivor-web-v${version}.zip`); zip(web, webZip);

const wx = path.join(staging, 'wechat-game');
const wxFiles = [
  'game.js', 'game.json', 'project.config.json', 'audio.js', 'core/bundle.js',
  'assets/audio', 'illustrations/game.js', 'illustrations/hero-cards-v1.png'
];
for (const entry of wxFiles) {
  const source = path.join(root, 'wechat-game', entry);
  if (!fs.existsSync(source)) throw new Error(`Missing runtime file: ${entry}`);
  if (fs.statSync(source).isDirectory()) for (const file of files(source)) copy(path.join(source, file), path.join(wx, entry, file));
  else copy(source, path.join(wx, entry));
}
const wxManifest = writeManifest(wx, 'wechat-game', files(wx), [
  'Native compileType=game runtime. Web debug code, tests, legacy source, generators, local evidence, private config and credentials are excluded.',
  'Replace touristappid in project.config.json with the publisher AppID before importing into WeChat DevTools; this repository deliberately leaves real AppID unconfigured.'
]);
const wxZip = path.join(out, `xiyou-survivor-wechat-game-v${version}.zip`); zip(wx, wxZip);

const summary = {
  version,
  web: { zip: path.relative(root, webZip).replaceAll(path.sep, '/'), bytes: fs.statSync(webZip).size, sha256: hash(webZip), files: webManifest.included },
  wechatGame: { zip: path.relative(root, wxZip).replaceAll(path.sep, '/'), bytes: fs.statSync(wxZip).size, sha256: hash(wxZip), files: wxManifest.included }
};
fs.writeFileSync(path.join(out, 'RELEASE-MANIFEST.json'), JSON.stringify(summary, null, 2));
console.log(`RELEASE PASS: ${summary.web.zip} (${summary.web.bytes} bytes); ${summary.wechatGame.zip} (${summary.wechatGame.bytes} bytes)`);
