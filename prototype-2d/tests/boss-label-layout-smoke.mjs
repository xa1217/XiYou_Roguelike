import assert from 'node:assert/strict';
import { GameRenderer } from '../src/renderer.js';

// Regression gate for the compact final-Boss nameplates.  The layout pass is
// renderer-owned geometry only: it must not mutate simulation state, and the
// labels must remain separated from one another and from the player silhouette.
const stack = [];
const calls = [];
const ctx = {
  globalAlpha: 1, fillStyle: '#000', strokeStyle: '#000', lineWidth: 1,
  font: '12px sans-serif', textAlign: 'center', textBaseline: 'middle',
  save() { stack.push({ globalAlpha: this.globalAlpha, fillStyle: this.fillStyle, strokeStyle: this.strokeStyle, lineWidth: this.lineWidth, font: this.font, textAlign: this.textAlign, textBaseline: this.textBaseline }); calls.push('save'); },
  restore() { assert.ok(stack.length, 'Canvas restore without save'); Object.assign(this, stack.pop()); calls.push('restore'); },
};
for (const name of ['beginPath', 'closePath', 'moveTo', 'lineTo', 'quadraticCurveTo', 'arc', 'fill', 'stroke', 'fillRect', 'strokeRect', 'translate', 'fillText']) {
  ctx[name] = (...args) => {
    for (const arg of args) assert.ok(typeof arg !== 'number' || Number.isFinite(arg), `${name} received a non-finite argument`);
    calls.push(name);
  };
}

const canvas = { width: 390, height: 844, getContext: () => ctx };
const renderer = new GameRenderer(canvas, { width: 390, height: 844, pixelRatio: 1, showHud: false });
renderer._view = { left: 0, right: 2000, top: 0, bottom: 2000 };

const player = Object.freeze({ x: 1080, y: 900, radius: 18 });
const enemies = Object.freeze([
  Object.freeze({ id: 'yin', kind: 'boss', x: 1000, y: 900, radius: 34, final: true, name: '寅将军' }),
  Object.freeze({ id: 'xiong', kind: 'boss', x: 1060, y: 900, radius: 34, final: true, name: '熊山君' }),
  Object.freeze({ id: 'te', kind: 'boss', x: 1120, y: 900, radius: 34, final: true, name: '特处士' }),
]);
const snapshot = structuredClone({ player, enemies });
renderer._layoutBossLabels(enemies, player);
const labels = renderer._bossLabelRects.map(slot => ({ ...slot }));
assert.equal(labels.length, 3, 'all visible Bosses need a reserved label slot');
assert.ok(labels.every(slot => ['offset', 'left', 'right', 'top', 'bottom'].every(key => Number.isFinite(slot[key]))), 'label rectangles must be finite');
const overlaps = (a, b) => a.left < b.right + 4 && a.right > b.left - 4 && a.top < b.bottom + 4 && a.bottom > b.top - 4;
for (let i = 0; i < labels.length; i += 1) {
  for (let j = i + 1; j < labels.length; j += 1) assert.equal(overlaps(labels[i], labels[j]), false, `Boss labels ${i}/${j} overlap`);
  const playerBox = { left: player.x - player.radius * 1.5, right: player.x + player.radius * 1.5, top: player.y - player.radius * 2.2, bottom: player.y + player.radius * 1.4 };
  assert.equal(overlaps(labels[i], playerBox), false, `Boss label ${i} overlaps player`);
}
assert.ok(labels.some(slot => slot.offset !== 0), 'crowded Boss labels should use a displaced candidate');
assert.deepEqual({ player, enemies }, snapshot, 'Boss label layout mutated simulation state');

for (const [index, enemy] of enemies.entries()) {
  renderer._drawBossLabel(ctx, enemy.x, enemy.y - enemy.radius * 2.75 + labels[index].offset, enemy);
}
assert.equal(stack.length, 0, 'Boss label drawing must balance Canvas save/restore');
assert.equal(calls.filter(name => name === 'save').length, 3);
assert.equal(calls.filter(name => name === 'restore').length, 3);

renderer.dispose();
assert.equal(renderer._bossLabelRects.length, 0, 'dispose must release the reusable label buffer');
console.log(JSON.stringify({
  ok: true,
  tests: ['three crowded Boss labels are separated', 'player silhouette is avoided', 'state remains unchanged', 'Canvas stack remains balanced'],
  offsets: labels.map(slot => slot.offset),
  rectangles: labels,
}, null, 2));
