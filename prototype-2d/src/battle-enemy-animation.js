import { TIGER_SPRITE_ID, TIGER_FRAME_COUNTS, TIGER_FPS, isBattleTiger, tigerDrawFrame } from './tiger-animation.js';
import { BEAR_SPRITE_ID, BEAR_FRAME_COUNTS, BEAR_FPS, isBattleBear, bearDrawFrame } from './bear-animation.js';
import { BULL_SPRITE_ID, BULL_FRAME_COUNTS, BULL_FPS, isBattleBull, bullDrawFrame } from './bull-animation.js';
import { WOLF_SPRITE_ID, WOLF_FRAME_COUNTS, WOLF_FPS, isBattleWolf, wolfDrawFrame } from './wolf-animation.js';
import { MONKEY_SPRITE_ID, MONKEY_FRAME_COUNTS, MONKEY_FPS, isBattleMonkey, monkeyDrawFrame } from './monkey-animation.js';
import { DEER_SPRITE_ID, DEER_FRAME_COUNTS, DEER_FPS, isBattleDeer, deerDrawFrame } from './deer-animation.js';
import { HAWK_SPRITE_ID, HAWK_FRAME_COUNTS, HAWK_FPS, isBattleHawk, hawkDrawFrame } from './hawk-animation.js';
import { SNAKE_SPRITE_ID, SNAKE_FRAME_COUNTS, SNAKE_FPS, isBattleSnake, snakeDrawFrame } from './snake-animation.js';

// One shared decision for clocks, retained death identity, culling and drawing.
// No per-frame allocations and no variant-only match for elites or bosses.
const actors = Object.freeze({
  tiger: Object.freeze({ id: TIGER_SPRITE_ID, variant: 'tiger', frames: TIGER_FRAME_COUNTS, fps: TIGER_FPS, healthBarOffset: 3.05, matches: isBattleTiger, drawFrame: tigerDrawFrame }),
  bear: Object.freeze({ id: BEAR_SPRITE_ID, variant: 'bear', frames: BEAR_FRAME_COUNTS, fps: BEAR_FPS, healthBarOffset: 3.4, matches: isBattleBear, drawFrame: bearDrawFrame }),
  bull: Object.freeze({ id: BULL_SPRITE_ID, variant: 'bull', frames: BULL_FRAME_COUNTS, fps: BULL_FPS, healthBarOffset: 3.45, matches: isBattleBull, drawFrame: bullDrawFrame }),
  wolf: Object.freeze({ id: WOLF_SPRITE_ID, variant: 'wolf', frames: WOLF_FRAME_COUNTS, fps: WOLF_FPS, healthBarOffset: 3.35, matches: isBattleWolf, drawFrame: wolfDrawFrame }),
  monkey: Object.freeze({ id: MONKEY_SPRITE_ID, variant: 'monkey', frames: MONKEY_FRAME_COUNTS, fps: MONKEY_FPS, healthBarOffset: 3.35, matches: isBattleMonkey, drawFrame: monkeyDrawFrame }),
  deer: Object.freeze({ id: DEER_SPRITE_ID, variant: 'deer', frames: DEER_FRAME_COUNTS, fps: DEER_FPS, healthBarOffset: 3.55, matches: isBattleDeer, drawFrame: deerDrawFrame }),
  hawk: Object.freeze({ id: HAWK_SPRITE_ID, variant: 'hawk', frames: HAWK_FRAME_COUNTS, fps: HAWK_FPS, healthBarOffset: 3.7, matches: isBattleHawk, drawFrame: hawkDrawFrame }),
  snake: Object.freeze({ id: SNAKE_SPRITE_ID, variant: 'snake', frames: SNAKE_FRAME_COUNTS, fps: SNAKE_FPS, healthBarOffset: 3.45, matches: isBattleSnake, drawFrame: snakeDrawFrame }),
});

export function battleEnemyAnimation(entity) {
  const actor = actors[entity?.variant];
  return actor?.matches?.(entity) ? actor : null;
}

export function battleEnemySpriteId(stageId, kind, variant) {
  return stageId === 1 && kind === 'normal' ? actors[variant]?.id || null : null;
}
