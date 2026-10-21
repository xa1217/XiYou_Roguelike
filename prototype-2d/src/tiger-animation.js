// The ordinary chapter-one tiger owns this atlas. Elite/Boss tiger variants
// deliberately keep their separate rigs; a shared variant is not an art key.
export const TIGER_SPRITE_ID = 'tiger-normal-v1';
export const TIGER_FRAME_COUNTS = Object.freeze({ idle: 8, move: 8, attack: 8, hit: 4, death: 4 });
export const TIGER_FPS = Object.freeze({ idle: 8, move: 12, attack: 16, hit: 16, death: 10 });

export function isBattleTiger(entity) {
  return entity?.battleSpriteId === TIGER_SPRITE_ID && entity.variant === 'tiger'
    && (entity.kind === 'normal' || (entity.kind === 'death' && entity.enemyKind === 'normal'));
}

export function attachTigerFrames(image, contract) {
  const width = Number(image?.naturalWidth || image?.width);
  const height = Number(image?.naturalHeight || image?.height);
  if (width !== 1774 || height !== 887 || contract?.size?.[0] !== width || contract?.size?.[1] !== height
      || contract.referenceBodyHeight !== 130 || contract.sourceRects?.length !== 32
      || contract.previewRootXs?.length !== 8 || contract.previewBaselines?.length !== 4) {
    throw new Error('Invalid ordinary tiger atlas dimensions/anchors');
  }
  const states = {};
  let expectedIndex = 0;
  for (const [state, count] of Object.entries(TIGER_FRAME_COUNTS)) {
    const sequence = contract.states?.[state];
    if (sequence?.length !== count) throw new Error(`Invalid tiger ${state} frame count`);
    states[state] = sequence.map(index => {
      if (index !== expectedIndex++) throw new Error('Invalid tiger frame order');
      const source = contract.sourceRects[index];
      const rootX = contract.previewRootXs[index % 8];
      const baseline = contract.previewBaselines[Math.floor(index / 8)];
      if (source?.index !== index || source.state !== state
          || ![source.x, source.y, source.w, source.h, rootX, baseline].every(Number.isFinite)
          || source.x < 0 || source.y < 0 || source.w <= 0 || source.h <= 0
          || source.x + source.w > width || source.y + source.h > height) {
        throw new Error(`Invalid tiger source rectangle ${index}`);
      }
      return Object.freeze({ x: source.x, y: source.y, w: source.w, h: source.h, rootX, baseline });
    });
    Object.freeze(states[state]);
  }
  image.__tigerBattleSprite = true;
  image.__prioritySprite = true;
  image.__tigerFrames = Object.freeze({ referenceBodyHeight: 130, states: Object.freeze(states) });
  return image;
}

export function tigerDrawFrame(image, state, frameIndex, radius) {
  if (!image?.__tigerBattleSprite || !image.__tigerFrames) return null;
  const resolvedState = state === 'stun' ? 'hit' : (TIGER_FRAME_COUNTS[state] ? state : 'idle');
  const frames = image.__tigerFrames.states[resolvedState];
  const index = Math.max(0, Math.floor(Number(frameIndex) || 0));
  const frame = frames[['idle', 'move'].includes(resolvedState) ? index % frames.length : Math.min(index, frames.length - 1)];
  const scale = radius * 3.2 / image.__tigerFrames.referenceBodyHeight;
  // Keep a single source-pixel scale across all poses, including the prone
  // death poses. No stretch-to-fit, extra bob, rotation or squash is applied.
  return { x: frame.x, y: frame.y, w: frame.w, h: frame.h,
    dx: (frame.x - frame.rootX) * scale, dy: radius * .7 + (frame.y - frame.baseline) * scale,
    dw: frame.w * scale, dh: frame.h * scale };
}
