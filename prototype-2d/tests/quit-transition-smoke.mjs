import assert from 'node:assert/strict';
import { NativeGame } from '../src/native-ui.js';

// Regression: pause -> quit to home once froze on a blank screen because the
// fade-out had no RAF left to advance it (fixed 2026-10-25 by keeping the
// loop alive during _fadePhase). This suite locks that behaviour in-tree.
let now = 1000;
let serial = 0;
const pending = new Map();
const audio = { play() {}, startMusic() {}, stopMusic() {}, setMuted() {}, dispose() {} };
const noop = () => {};
const ctx = new Proxy({
  measureText(v) { return { width: String(v).length * 8 }; },
  createLinearGradient() { return { addColorStop() {} }; },
  createRadialGradient() { return { addColorStop() {} }; },
  save: noop, restore: noop,
}, {
  get(t, k) { if (k in t) return t[k]; return () => {}; },
  set(t, k, v) { t[k] = v; return true; },
});
const canvas = { width: 0, height: 0, getContext() { return ctx; } };
const game = new NativeGame(canvas, {
  width: 390, height: 844, pixelRatio: 1, now: () => now, audio,
  load: () => null, save: () => {},
  requestFrame(fn) { const id = ++serial; pending.set(id, fn); return id; },
  cancelFrame(id) { pending.delete(id); },
});
function step(ms) {
  now += ms;
  const item = pending.entries().next().value;
  if (!item) return false;
  pending.delete(item[0]);
  item[1](now);
  return true;
}

game.startRun();
assert.equal(game.screen, 'game');
step(50); step(50);
game.engine.pause();
game.go('home');
let steps = 0;
while (pending.size && steps < 40) { step(50); steps += 1; }
assert.equal(game.screen, 'home', 'quit during pause must reach the home screen');
assert.equal(game._fadePhase, null, 'fade must complete after quit');
console.log('quit-transition smoke: PASS');
