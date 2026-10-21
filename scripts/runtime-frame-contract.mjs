import path from 'node:path';
import { attachTigerFrames } from '../prototype-2d/src/tiger-animation.js';
import { attachBearFrames } from '../prototype-2d/src/bear-animation.js';
import { attachBullFrames } from '../prototype-2d/src/bull-animation.js';
import { attachWolfFrames } from '../prototype-2d/src/wolf-animation.js';
import { attachMonkeyFrames } from '../prototype-2d/src/monkey-animation.js';
import { attachDeerFrames } from '../prototype-2d/src/deer-animation.js';
import { attachHawkFrames } from '../prototype-2d/src/hawk-animation.js';
import { attachSnakeFrames } from '../prototype-2d/src/snake-animation.js';

const contracts = new Map([
  ['assets/enemy-tiger-battle-v1-frames.json', attachTigerFrames],
  ['assets/enemy-bear-battle-v1-frames.json', attachBearFrames],
  ['assets/enemy-bull-battle-v1-frames.json', attachBullFrames],
  ['assets/enemy-wolf-battle-v1-frames.json', attachWolfFrames],
  ['assets/enemy-monkey-battle-v1-frames.json', attachMonkeyFrames],
  ['assets/enemy-deer-battle-v1-frames.json', attachDeerFrames],
  ['assets/enemy-hawk-battle-v1-frames.json', attachHawkFrames],
  ['assets/enemy-snake-battle-v3-frames.json', attachSnakeFrames],
]);
const states = ['idle', 'move', 'attack', 'hit', 'death'];
const rectangleFields = ['index', 'state', 'x', 'y', 'w', 'h'];

export const isRuntimeFrameContract = relative => contracts.has(relative.replaceAll(path.sep, '/'));

// Repository contracts retain provenance. Public responses and archives only
// carry fields consumed by the runtime, including a nested field allowlist.
export function serializeRuntimeFrameContract(relative, text) {
  const attach = contracts.get(relative.replaceAll(path.sep, '/'));
  if (!attach) throw new Error('Unknown public frame contract');
  const source = JSON.parse(text);
  const runtime = {
    size: source.size?.slice(0, 2),
    referenceBodyHeight: source.referenceBodyHeight,
    previewRootXs: source.previewRootXs?.slice(),
    previewBaselines: source.previewBaselines?.slice(),
    states: Object.fromEntries(states.map(state => [state, source.states?.[state]?.slice()])),
    sourceRects: source.sourceRects?.map(rect => Object.fromEntries(rectangleFields.map(key => [key, rect[key]]))),
  };
  // A projection must remain a fully usable contract, not silently ship a
  // corrupt crop or weaken the existing species-specific validation.
  attach({ width: 1774, height: 887 }, runtime);
  return JSON.stringify(runtime, null, 2) + '\n';
}
