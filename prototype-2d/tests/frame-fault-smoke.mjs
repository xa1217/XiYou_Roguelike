import assert from 'node:assert/strict';
import { NativeGame } from '../src/native-ui.js';

// Fault containment: a throw inside a frame (engine update or render) must
// never kill the RAF loop. One bad frame is skipped; a sustained failure
// (90 consecutive) bails out to the home screen instead of freezing.
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
const makeGame = () => new NativeGame(canvas, {
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

// 1) A single render fault is contained: no throw escapes, the loop lives.
{
  const game = makeGame();
  game.startRun();
  step(50); step(50);
  const render = game.renderer.render.bind(game.renderer);
  let armed = true;
  game.renderer.render = (...args) => { if (armed) { armed = false; throw new Error('injected render fault'); } return render(...args); };
  assert.doesNotThrow(() => step(50), 'one render fault escaped the frame loop');
  assert.equal(game.screen, 'game', 'one fault must not leave the run');
  assert.ok(pending.size >= 1, 'RAF loop died after one fault');
  step(50); step(50);
  assert.equal(game.screen, 'game');
  game.dispose();
  pending.clear();
}

// 2) A single engine-update fault is contained the same way.
{
  const game = makeGame();
  game.startRun();
  step(50);
  const update = game.engine.update.bind(game.engine);
  let armed = true;
  game.engine.update = (...args) => { if (armed) { armed = false; throw new Error('injected update fault'); } return update(...args); };
  assert.doesNotThrow(() => step(50), 'one update fault escaped the frame loop');
  assert.equal(game.screen, 'game');
  assert.ok(pending.size >= 1, 'RAF loop died after an update fault');
  game.dispose();
  pending.clear();
}

// 3) Sustained failure bails out to home instead of freezing on a dead frame.
{
  const game = makeGame();
  game.startRun();
  step(50);
  game.renderer.render = () => { throw new Error('persistent render fault'); };
  for (let i = 0; i < 120 && game.screen === 'game'; i += 1) step(33);
  assert.equal(game.screen, 'home', 'sustained faults must bail out to home');
  assert.equal(game.engine, null, 'bail-out must dispose the run');
  game.dispose();
  pending.clear();
}

console.log('frame-fault smoke: PASS');
