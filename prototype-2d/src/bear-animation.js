// The ordinary chapter-one bear owns this atlas. Elite/Boss bear variants
// deliberately keep their separate rigs; a shared variant is not an art key.
export const BEAR_SPRITE_ID = 'bear-normal-v1';
export const BEAR_FRAME_COUNTS = Object.freeze({ idle: 8, move: 8, attack: 8, hit: 4, death: 4 });
export const BEAR_FPS = Object.freeze({ idle: 8, move: 12, attack: 16, hit: 16, death: 10 });

export function isBattleBear(entity) {
  return entity?.battleSpriteId === BEAR_SPRITE_ID && entity.variant === 'bear'
    && (entity.kind === 'normal' || (entity.kind === 'death' && entity.enemyKind === 'normal'));
}

export function attachBearFrames(image, contract) {
  const width = Number(image?.naturalWidth || image?.width);
  const height = Number(image?.naturalHeight || image?.height);
  if (width !== 1774 || height !== 887 || contract?.size?.[0] !== width || contract?.size?.[1] !== height
      || contract.referenceBodyHeight !== 136 || contract.sourceRects?.length !== 32
      || contract.previewRootXs?.length !== 8 || contract.previewBaselines?.length !== 4) {
    throw new Error('Invalid ordinary bear atlas dimensions/anchors');
  }
  const states = {};
  let expectedIndex = 0;
  for (const [state, count] of Object.entries(BEAR_FRAME_COUNTS)) {
    const sequence = contract.states?.[state];
    if (sequence?.length !== count) throw new Error(`Invalid bear ${state} frame count`);
    states[state] = sequence.map(index => {
      if (index !== expectedIndex++) throw new Error('Invalid bear frame order');
      const source = contract.sourceRects[index];
      const rootX = contract.previewRootXs[index % 8];
      const baseline = contract.previewBaselines[Math.floor(index / 8)];
      if (source?.index !== index || source.state !== state
          || ![source.x, source.y, source.w, source.h, rootX, baseline].every(Number.isFinite)
          || source.x < 0 || source.y < 0 || source.w <= 0 || source.h <= 0
          || source.x + source.w > width || source.y + source.h > height) {
        throw new Error(`Invalid bear source rectangle ${index}`);
      }
      return Object.freeze({ x: source.x, y: source.y, w: source.w, h: source.h, rootX, baseline });
    });
    Object.freeze(states[state]);
  }
  image.__bearBattleSprite = true;
  image.__prioritySprite = true;
  image.__bearFrames = Object.freeze({ referenceBodyHeight: 136, states: Object.freeze(states) });
  return image;
}

export function bearDrawFrame(image, state, frameIndex, radius) {
  if (!image?.__bearBattleSprite || !image.__bearFrames) return null;
  const resolvedState = state === 'stun' ? 'hit' : (BEAR_FRAME_COUNTS[state] ? state : 'idle');
  const frames = image.__bearFrames.states[resolvedState];
  const index = Math.max(0, Math.floor(Number(frameIndex) || 0));
  const frame = frames[['idle', 'move'].includes(resolvedState) ? index % frames.length : Math.min(index, frames.length - 1)];
  const scale = radius * 3.2 / image.__bearFrames.referenceBodyHeight;
  // Keep a single source-pixel scale across all poses, including the prone
  // death poses. No stretch-to-fit, extra bob, rotation or squash is applied.
  return { x: frame.x, y: frame.y, w: frame.w, h: frame.h,
    dx: (frame.x - frame.rootX) * scale, dy: radius * .7 + (frame.y - frame.baseline) * scale,
    dw: frame.w * scale, dh: frame.h * scale };
}
