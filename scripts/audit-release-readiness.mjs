import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Read-only release gate audit. It never rebuilds, extracts, uploads or deploys a package.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const relative = file => path.relative(root, file).replaceAll('\\', '/');
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const listZip = file => execFileSync('tar', ['-tf', file], { cwd: root, encoding: 'utf8', windowsHide: true })
  .split(/\r?\n/).map(line => line.trim().replace(/^\.\//, '')).filter(Boolean);
const sourceAssets = fs.readdirSync(path.join(root, 'prototype-2d/assets')).filter(name => /\.(png|svg|json|wav)$/i.test(name));
const currentRuntimeFrames = ['enemy-tiger-battle-v1-frames.json', 'enemy-bear-battle-v1-frames.json', 'enemy-bull-battle-v1-frames.json', 'enemy-wolf-battle-v1-frames.json', 'enemy-monkey-battle-v1-frames.json', 'enemy-deer-battle-v1-frames.json', 'enemy-hawk-battle-v1-frames.json', 'enemy-snake-battle-v3-frames.json'];
const currentRuntimeSheets = currentRuntimeFrames.map(file => file.replace(/-frames\.json$/, '-sheet.png'));
const expectedWebAssets = [...currentRuntimeFrames, ...currentRuntimeSheets, 'hero-wukong-battle-v3-sheet.png', 'hero-tangseng-battle-v3-sheet.png', 'hero-bajie-battle-v3-sheet.png', 'hero-wujing-battle-v3-sheet.png'];
const dist = {};
for (const name of ['xiyou-survivor-web-v1.0.0.zip', 'xiyou-survivor-wechat-game-v1.0.0.zip']) {
  const file = path.join(root, 'dist', name);
  if (!fs.existsSync(file)) { dist[name] = { exists: false }; continue; }
  let entries = [], error = null;
  try { entries = listZip(file); } catch (e) { error = String(e); }
  const assetEntries = new Set(entries.filter(entry => entry.startsWith('assets/')).map(entry => entry.slice('assets/'.length)));
  const expected = name.includes('-web-') ? expectedWebAssets : [];
  const missingExpectedRuntimeAssets = expected.filter(asset => !assetEntries.has(asset));
  dist[name] = { exists: true, bytes: fs.statSync(file).size, sha256: sha(file), entries: entries.length, expectedContract: name.includes('-web-') ? 'current browser authored-frame assets' : 'WeChat core/vector package; browser authored-frame assets intentionally excluded by release policy', missingExpectedRuntimeAssets, error };
}
const sourceMissingExpected = expectedWebAssets.filter(asset => !sourceAssets.includes(asset));
const runtimeSource = fs.readFileSync(path.join(root, 'prototype-2d/native-app.js'), 'utf8');
const releaseScript = fs.readFileSync(path.join(root, 'scripts/release.mjs'), 'utf8');
const report = {
  generatedAt: new Date().toISOString(),
  scope: 'Read-only pre-deployment readiness audit; no package rebuild, extraction, upload or deployment',
  workspace: { branch: execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim(), sourceAssets: sourceAssets.length, sourceMissingExpected, runtimeFrames: currentRuntimeFrames, runtimeSheets: currentRuntimeSheets, expectedWebAssets },
  runtimeRegistration: {
    normalEightFrameModulesPresent: ['tiger-animation.js', 'bear-animation.js', 'bull-animation.js', 'wolf-animation.js', 'monkey-animation.js', 'deer-animation.js', 'hawk-animation.js', 'snake-animation.js'].map(file => ({ file, present: fs.existsSync(path.join(root, 'prototype-2d/src', file)) })),
    nativeLoadsWujingBattleSheet: runtimeSource.includes("shajing:'hero-wujing-battle-v3-sheet.png'"),
    releaseMentionsWolfMonkeyDeerHawkSnake: ['enemy-wolf-battle-v1-sheet.png', 'enemy-monkey-battle-v1-sheet.png', 'enemy-deer-battle-v1-sheet.png', 'enemy-hawk-battle-v1-sheet.png', 'enemy-snake-battle-v3-sheet.png'].map(file => ({ file, listed: releaseScript.includes(file) })),
  },
  packages: dist,
  blockers: [
    { id: 'hero-highframe', status: 'FAIL', evidence: 'docs/HERO-HIGHFRAME-BASELINE.md; docs/WUJING-LAYOUT-CANDIDATE-HANDOFF.md', detail: '四英雄真实高帧/完整源裁切未通过；悟净布局候选 REVIEW。' },
    { id: 'tiger-vanguard', status: 'REVIEW', evidence: 'docs/TIGER-VANGUARD-CANDIDATE-HANDOFF.md', detail: '虎先锋候选 29/32 独立姿态，未接入。' },
    { id: 'final-boss-actions', status: 'GAP_CONFIRMED', evidence: 'evidence/current/tiger-vanguard/boss-action-gap-audit.json', detail: '寅将军、熊山君、特处士无专属动作表，当前通用向量回退。' },
    { id: 'overall-occlusion', status: 'INCOMPLETE', evidence: 'STATUS.md; docs/REQUIREMENTS-ACCEPTANCE.md', detail: '近身角色/血条/伤害数字/HUD整体可读性仍未完成。' },
    { id: 'public-internet', status: 'NOT_RETESTED', evidence: 'evidence/current/public/external-quic-fail-20261005T1951.json', detail: '当前没有公网 PASS，不能由本地 Edge 或 workspace smoke 代替。' },
    { id: 'wechat-device', status: 'DEFERRED', evidence: 'docs/REQUIREMENTS-ACCEPTANCE.md', detail: '微信 AppID、真机 FPS/内存和商用服务按范围延期，不是当前网页上线替代证据。' },
  ],
  gates: { allReleaseBlockersResolved: false, deployAuthorized: false, packageRebuildAllowedAfterFixes: false, publicPass: false },
  conclusion: 'NOT_READY: current dist ZIPs are stale relative to the workspace runtime frame inventory, hero high-frame and boss action gates remain unresolved, and public internet has no current PASS. Do not deploy.',
};
const output = path.join(root, 'evidence/current/release-readiness', new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-'));
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ output: relative(path.join(output, 'report.json')), conclusion: report.conclusion, packages: Object.fromEntries(Object.entries(dist).map(([name, item]) => [name, { sha256: item.sha256, missingExpectedRuntimeAssets: item.missingExpectedRuntimeAssets }])) }, null, 2));
