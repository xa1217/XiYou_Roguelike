import assert from 'node:assert/strict';
import { GameRenderer } from '../src/renderer.js';

const methods = ['beginPath', 'closePath', 'moveTo', 'lineTo', 'quadraticCurveTo', 'bezierCurveTo', 'arc', 'fill', 'stroke', 'fillRect', 'strokeRect', 'clearRect', 'fillText', 'setTransform', 'translate', 'scale', 'rotate', 'clip'];

function fixture() {
  const calls = [];
  const styles = { fill: [], stroke: [] };
  const counters = { stack: 0, badArgs: [] };
  const ctx = {};
  for (const op of methods) ctx[op] = (...args) => {
    calls.push({ op, args });
    for (const arg of args) if (typeof arg === 'number' && !Number.isFinite(arg)) counters.badArgs.push({ op, args });
  };
  ctx.save = () => { counters.stack += 1; calls.push({ op: 'save', args: [] }); };
  ctx.restore = () => { counters.stack -= 1; calls.push({ op: 'restore', args: [] }); assert.ok(counters.stack >= 0, 'unbalanced Canvas restore'); };
  Object.defineProperty(ctx, 'fillStyle', { set(value) { styles.fill.push(String(value)); }, get() { return styles.fill.at(-1); } });
  Object.defineProperty(ctx, 'strokeStyle', { set(value) { styles.stroke.push(String(value)); }, get() { return styles.stroke.at(-1); } });
  const canvas = { width: 390, height: 844, getContext: type => { assert.equal(type, '2d'); return ctx; } };
  return { canvas, ctx, calls, styles, counters };
}

const theme = { ink: '#071b24', accent: '#f44a48', sticker: '#ffe84e' };
const player = { x: 960, y: 900 };
const base = { x: 900, y: 900, radius: 34, kind: 'boss', hp: 800, maxHp: 1000, id: 1, final: true, animationState: 'idle', animationFrames: 8, frameIndex: 0, variant: 'tiger' };

const f = fixture();
const renderer = new GameRenderer(f.canvas, { width: 390, height: 844, pixelRatio: 1, showHud: false });
const draw = enemy => {
  f.calls.length = 0; f.styles.fill.length = 0; f.styles.stroke.length = 0;
  renderer._drawEnemy(f.ctx, enemy, player, theme);
  assert.equal(f.counters.stack, 0);
  assert.deepEqual(f.counters.badArgs, []);
  return { calls: f.calls.map(call => call.op), fill: [...f.styles.fill], stroke: [...f.styles.stroke] };
};

const yin = draw({ ...base, bossIdentity: { bossId: 'yin-general', variant: 'tiger', actionId: 'yin-general' } });
const xiong = draw({ ...base, id: 2, variant: 'bear', bossIdentity: { bossId: 'xiong-shanjun', variant: 'bear', actionId: 'xiong-shanjun' } });
const te = draw({ ...base, id: 3, variant: 'bull', bossIdentity: { bossId: 'te-chushi', variant: 'bull', actionId: 'te-chushi' } });
assert.ok(yin.fill.includes('#a94435'), '寅将军 profile must paint its red body');
assert.ok(xiong.fill.includes('#6f4938'), '熊山君 profile must paint its brown body');
assert.ok(te.fill.includes('#597064'), '特处士 profile must paint its teal body');
assert.notDeepEqual(yin.fill, xiong.fill, 'named Boss profiles must not collapse to one palette');
assert.notDeepEqual(xiong.fill, te.fill, 'named Boss profiles must not collapse to one palette');
assert.ok(yin.calls.includes('lineTo') && xiong.calls.includes('arc') && te.calls.includes('quadraticCurveTo'), 'each named profile must emit its identity geometry');

const ordinary = draw({ ...base, id: 4, bossIdentity: null, variant: 'tiger' });
assert.ok(!ordinary.fill.includes('#a94435') && !ordinary.fill.includes('#6f4938') && !ordinary.fill.includes('#597064'), 'unbound bosses keep the generic vector fallback');
const elite = draw({ ...base, id: 5, kind: 'elite', final: false, bossIdentity: { bossId: 'yin-general', variant: 'tiger', actionId: 'yin-general' } });
assert.ok(!elite.fill.includes('#a94435'), 'elite identity payload must not opt into final Boss visuals');
const unknown = draw({ ...base, id: 6, bossIdentity: { bossId: 'cross-stage', variant: 'tiger', actionId: 'cross-stage' } });
assert.ok(!unknown.fill.includes('#a94435') && !unknown.fill.includes('#6f4938') && !unknown.fill.includes('#597064'), 'unknown/cross-stage identity keeps fallback');

renderer.dispose();
console.log(JSON.stringify({
  ok: true,
  tests: ['three named final Boss vector profiles are distinct', 'ordinary, elite, and unknown identities remain on fallback'],
  namedBosses: { yin: yin.fill, xiong: xiong.fill, te: te.fill },
  fallbackCalls: ordinary.calls.length,
  note: 'Vector identity fallback is not a dedicated high-frame asset or a public deployment claim.'
}, null, 2));
