// The ordinary chapter-one snake owns this atlas. Elite/Boss snake variants
// deliberately keep their separate rigs; a shared variant is not an art key.
export const SNAKE_SPRITE_ID = 'snake-normal-v3';
export const SNAKE_FRAME_COUNTS = Object.freeze({ idle: 8, move: 8, attack: 8, hit: 4, death: 4 });
export const SNAKE_FPS = Object.freeze({ idle: 8, move: 12, attack: 16, hit: 16, death: 10 });

export function isBattleSnake(entity) {
  return entity?.battleSpriteId === SNAKE_SPRITE_ID && entity.variant === 'snake'
    && (entity.kind === 'normal' || (entity.kind === 'death' && entity.enemyKind === 'normal'));
}

export function attachSnakeFrames(image, contract) {
  const width = Number(image?.naturalWidth || image?.width);
  const height = Number(image?.naturalHeight || image?.height);
  if (width !== 1774 || height !== 887 || contract?.size?.[0] !== width || contract?.size?.[1] !== height
      || contract.referenceBodyHeight !== 170 || contract.sourceRects?.length !== 32
      || contract.previewRootXs?.length !== 8 || contract.previewBaselines?.length !== 4) {
    throw new Error('Invalid ordinary snake atlas dimensions/anchors');
  }
  const states = {};
  let expectedIndex = 0;
  for (const [state, count] of Object.entries(SNAKE_FRAME_COUNTS)) {
    const sequence = contract.states?.[state];
    if (sequence?.length !== count) throw new Error(`Invalid snake ${state} frame count`);
    states[state] = sequence.map(index => {
      if (index !== expectedIndex++) throw new Error('Invalid snake frame order');
      const source = contract.sourceRects[index];
      const rootX = contract.previewRootXs[index % 8];
      const baseline = contract.previewBaselines[Math.floor(index / 8)];
      if (source?.index !== index || source.state !== state
          || ![source.x, source.y, source.w, source.h, rootX, baseline].every(Number.isFinite)
          || source.x < 0 || source.y < 0 || source.w <= 0 || source.h <= 0
          || source.x + source.w > width || source.y + source.h > height) {
        throw new Error(`Invalid snake source rectangle ${index}`);
      }
      // Source idle-4 faces left. Normalize it before the entity facing is
      // applied; retain the original PNG and the same fixed root/scale.
      return Object.freeze({ x: source.x, y: source.y, w: source.w, h: source.h, rootX, baseline, mirrorX: index === 4 });
    });
    Object.freeze(states[state]);
  }
  image.__snakeBattleSprite = true;
  image.__prioritySprite = true;
  image.__snakeFrames = Object.freeze({ referenceBodyHeight: 170, states: Object.freeze(states) });
  return image;
}

export function snakeDrawFrame(image, state, frameIndex, radius) {
  if (!image?.__snakeBattleSprite || !image.__snakeFrames) return null;
  const resolvedState = state === 'stun' ? 'hit' : (SNAKE_FRAME_COUNTS[state] ? state : 'idle');
  const frames = image.__snakeFrames.states[resolvedState];
  const index = Math.max(0, Math.floor(Number(frameIndex) || 0));
  const frame = ['idle', 'move'].includes(resolvedState) ? frames[index % frames.length] : frames[Math.min(index, frames.length - 1)];
  const scale = radius * 3.2 / image.__snakeFrames.referenceBodyHeight;
  return { x: frame.x, y: frame.y, w: frame.w, h: frame.h, mirrorX: frame.mirrorX,
    dx: (frame.x - frame.rootX) * scale, dy: radius * .7 + (frame.y - frame.baseline) * scale,
    dw: frame.w * scale, dh: frame.h * scale };
}
