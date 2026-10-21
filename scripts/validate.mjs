import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
const errors = [];
const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => (
  entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]
));

for (const file of [
  ...walk('prototype-2d/src'),
  ...walk('wechat-game'),
  ...walk('wechat-miniprogram/miniprogram'),
]) {
  if (file.endsWith('.js')) {
    try {
      if (file.startsWith(path.join('prototype-2d', 'src'))) {
        // These shared modules are native ESM. Importing them performs the
        // same parser check as `node --check` and is safe: they have no page
        // or platform side effects at module scope.
        await import(`${pathToFileURL(path.resolve(file)).href}?syntax=${encodeURIComponent(file)}`);
      } else {
        // Generated WeChat files are classic scripts and may use `require`;
        // parsing them as a function avoids executing platform code.
        new Function(fs.readFileSync(file, 'utf8')); // eslint-disable-line no-new-func
      }
    } catch (error) {
      errors.push(`${file}: ${error.message}`);
    }
  } else if (file.endsWith('.json')) {
    try {
      JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
    } catch (error) {
      errors.push(`${file}: ${error.message}`);
    }
  }
}

const config = JSON.parse(fs.readFileSync('wechat-game/project.config.json', 'utf8'));
if (config.compileType !== 'game') errors.push('Primary WeChat deliverable must be native game');
const gameConfig = JSON.parse(fs.readFileSync('wechat-game/game.json', 'utf8'));
if (gameConfig.deviceOrientation !== 'portrait') errors.push('Portrait orientation required');

for (const theme of ['forest', 'sand', 'snow', 'fire', 'water', 'temple']) {
  const file = `wechat-game/assets/audio/bgm-${theme}.wav`;
  if (!fs.existsSync(file)) {
    errors.push(`Missing ${file}`);
  } else {
    const bytes = fs.readFileSync(file);
    if (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.readUInt32LE(24) !== 11025) {
      errors.push(`Invalid generated WAV ${file}`);
    }
  }
}

// Running gates in-process is equivalent to the former child-process loop
// while remaining usable in restricted Windows runners where spawnSync(node)
// returns EPERM. Every module gets a unique query string so a future rerun
// cannot accidentally reuse a previous module state.
const gates = [
  'scripts/build.mjs',
  'scripts/test-runtime-contracts.mjs',
  'prototype-2d/tests/engine-smoke.mjs',
  'prototype-2d/tests/tiger-vanguard-identity-smoke.mjs',
  'prototype-2d/tests/tiger-animation-smoke.mjs',
  'prototype-2d/tests/bear-animation-smoke.mjs',
  'prototype-2d/tests/bull-animation-smoke.mjs',
  'prototype-2d/tests/wolf-animation-smoke.mjs',
  'prototype-2d/tests/monkey-animation-smoke.mjs',
  'prototype-2d/tests/deer-animation-smoke.mjs',
  'prototype-2d/tests/hawk-animation-smoke.mjs',
  'prototype-2d/tests/snake-animation-smoke.mjs',
  'prototype-2d/tests/status-badge-smoke.mjs',
  'prototype-2d/tests/damage-label-smoke.mjs',
  'prototype-2d/tests/feedback-overlap-smoke.mjs',
  'prototype-2d/tests/player-damage-avoidance-smoke.mjs',
  'prototype-2d/tests/enemy-damage-avoidance-smoke.mjs',
  'prototype-2d/tests/boss-label-damage-avoidance-smoke.mjs',
  'prototype-2d/tests/damage-label-avoidance-smoke.mjs',
  'prototype-2d/tests/hud-occlusion-smoke.mjs',
  'prototype-2d/tests/boss-identity-render-smoke.mjs',
  'prototype-2d/tests/boss-label-layout-smoke.mjs',
  'prototype-2d/tests/full-run-smoke.mjs',
  'prototype-2d/tests/normal-run-smoke.mjs',
  'prototype-2d/tests/pool-smoke.mjs',
  'prototype-2d/tests/render-smoke.mjs',
  'scripts/test-platform.mjs',
];
for (const script of gates) {
  if (!fs.existsSync(script)) {
    errors.push(`Required gate missing ${script}`);
    continue;
  }
  process.exitCode = 0;
  try {
    await import(`${pathToFileURL(path.resolve(script)).href}?gate=${encodeURIComponent(script)}`);
    if (process.exitCode && process.exitCode !== 0) errors.push(`${script}: exited with ${process.exitCode}`);
  } catch (error) {
    errors.push(`${script}: ${error?.stack || error}`);
  } finally {
    process.exitCode = 0;
  }
}

const files = walk('wechat-game');
const mainBytes = files.filter((file) => !file.startsWith(path.join('wechat-game', 'illustrations')))
  .reduce((total, file) => total + fs.statSync(file).size, 0);
const artBytes = files.filter((file) => file.startsWith(path.join('wechat-game', 'illustrations')))
  .reduce((total, file) => total + fs.statSync(file).size, 0);
if (mainBytes > 4 * 1024 * 1024) errors.push('Main package exceeds conservative 4MB budget');
if (artBytes > 4 * 1024 * 1024) errors.push('Illustration package exceeds conservative 4MB budget');

const result = {
  date: new Date().toISOString(),
  version: '1.0.0',
  result: errors.length ? 'FAIL' : 'PASS',
  mainBytes,
  artBytes,
  totalBytes: mainBytes + artBytes,
  errors,
};
fs.mkdirSync('evidence/current', { recursive: true });
fs.writeFileSync('evidence/current/validation.json', JSON.stringify(result, null, 2));
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`VALIDATE PASS: current version only; main ${(mainBytes / 1024 / 1024).toFixed(2)}MiB; optional art ${(artBytes / 1024 / 1024).toFixed(2)}MiB`);
}
