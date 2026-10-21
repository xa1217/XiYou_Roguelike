import assert from 'node:assert/strict';
import { NativeGame } from '../src/native-ui.js';

// A deterministic Canvas/RAF harness proves that UI motion is finite,
// interruptible, and never opens a second loop. It does not emulate a GPU.
let now = 1000;
let serial = 0;
const pending = new Map();
const audio = { play(){}, startMusic(){}, stopMusic(){}, setMuted(){}, dispose(){} };
const noop = () => {};
const ctx = new Proxy({
  measureText(value){ return { width: String(value).length * 8 }; },
  save:noop, restore:noop
}, { get(target, key) {
  if (key in target) return target[key];
  return (...args) => {
    for (const value of args) if (typeof value === 'number') assert.ok(Number.isFinite(value), `${String(key)} received non-finite number`);
  };
}, set(target,key,value){ target[key]=value; return true; } });
const canvas = { width:0, height:0, getContext(type){ assert.equal(type,'2d'); return ctx; } };
const game = new NativeGame(canvas, {
  width:390, height:844, pixelRatio:1, now:()=>now, audio,
  load:()=>null, save:()=>{},
  requestFrame(fn){ assert.ok(pending.size < 1, 'UI created more than one RAF'); const id=++serial; pending.set(id,fn); return id; },
  cancelFrame(id){ pending.delete(id); }
});

function step(ms){
  now += ms;
  const item = pending.entries().next().value;
  if (!item) return;
  pending.delete(item[0]);
  item[1](now);
}

assert.equal(pending.size, 1, 'initial home entrance uses one bounded RAF');
const first = game.getUIMotionState();
assert.equal(first.active, true);
assert.equal(first.frameIndex, 1);
step(90);
const second = game.getUIMotionState();
assert.ok(second.frameIndex > first.frameIndex);
assert.ok(second.progress > first.progress && second.progress < 1);
assert.equal(pending.size, 1);
step(200);
assert.equal(game.getUIMotionState().active, false, 'entrance settles within 250ms');
assert.equal(pending.size, 0, 'static home does not keep an RAF alive');

game.go('select');
assert.equal(pending.size, 1, 'screen transition restarts one entrance');
step(80);
const selectFrame = game.getUIMotionState().frameIndex;
game.touchStart(30, game.top + 110); // first character card; press feedback is transient
assert.equal(game.getUIMotionState().pressActive, true);
assert.ok(pending.size <= 1);
step(240);
assert.equal(game.getUIMotionState().pressActive, false);
assert.equal(pending.size, 0);
assert.ok(game.getUIMotionState().frameIndex >= selectFrame);

game.onHide();
assert.equal(pending.size, 0, 'background cancels the finite UI frame');
const hiddenState = game.getUIMotionState();
now += 1000;
game.onShow();
assert.equal(game.getUIMotionState().active, false, 'foreground does not restart motion while the same screen is stable');
assert.equal(pending.size, 0);
game.dispose();
assert.equal(pending.size, 0, 'dispose cancels every owned frame');
assert.equal(game.getUIMotionState().active, false);

console.log(JSON.stringify({ ok:true, screen:'select', hiddenFrameIndex:hiddenState.frameIndex, finiteDurationMs:250, maxPendingRaf:1, final:game.getUIMotionState() }, null, 2));
