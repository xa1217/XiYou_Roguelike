// Dedicated atlases for the three named first-stage final bosses.
// Binding is identity-only: an entity must carry the engine-issued
// battleSpriteId AND the matching frozen bossIdentity. Variant, name or a
// copied sprite ID alone never suffices, and ordinary species atlases are
// never used for these bosses (or vice versa). Mid-bosses (including the
// tiger vanguard) and later-stage bosses stay on the vector identity rig
// until they receive their own scoped contracts.
export const BOSS_FPS = Object.freeze({ idle: 8, move: 12, attack: 16, hit: 16, death: 10 });

export const BOSS_DEFS = Object.freeze({
  'yin-general': Object.freeze({
    bossId: 'yin-general', spriteId: 'yin-general-boss-v1', referenceBodyHeight: 168,
    frameCounts: Object.freeze({ idle: 8, move: 8, attack: 8, hit: 4, death: 4 }), healthBarOffset: 2.85,
  }),
  'xiong-shanjun': Object.freeze({
    bossId: 'xiong-shanjun', spriteId: 'xiong-shanjun-boss-v1', referenceBodyHeight: 190,
    frameCounts: Object.freeze({ idle: 8, move: 8, attack: 8, hit: 4, death: 4 }), healthBarOffset: 2.9,
  }),
  'te-chushi': Object.freeze({
    bossId: 'te-chushi', spriteId: 'te-chushi-boss-v1', referenceBodyHeight: 165,
    // The authored sheet genuinely contains seven move and seven attack
    // poses; the counts record that instead of padding with duplicates.
    frameCounts: Object.freeze({ idle: 8, move: 7, attack: 7, hit: 4, death: 4 }), healthBarOffset: 2.8,
  }),
});

export function bossSpriteIdFor(bossId) {
  return BOSS_DEFS[bossId]?.spriteId || null;
}

export function isBattleBoss(entity, bossId) {
  const def = BOSS_DEFS[bossId];
  return Boolean(def) && entity?.battleSpriteId === def.spriteId
    && entity.bossIdentity?.bossId === bossId
    && (entity.kind === 'boss' || (entity.kind === 'death' && entity.enemyKind === 'boss'));
}

export function attachBossFrames(bossId) {
  const def = BOSS_DEFS[bossId];
  if (!def) throw new Error(`Unknown boss atlas: ${bossId}`);
  const totalFrames = Object.values(def.frameCounts).reduce((sum, count) => sum + count, 0);
  return function attach(image, contract) {
    const width = Number(image?.naturalWidth || image?.width);
    const height = Number(image?.naturalHeight || image?.height);
    if (width !== 1774 || height !== 887 || contract?.size?.[0] !== width || contract?.size?.[1] !== height
        || contract.referenceBodyHeight !== def.referenceBodyHeight || contract.sourceRects?.length !== totalFrames
        || contract.previewRootXs?.length !== 8 || contract.previewBaselines?.length !== 4) {
      throw new Error(`Invalid ${bossId} boss atlas dimensions/anchors`);
    }
    const states = {};
    let expectedIndex = 0;
    // Rows cannot be derived from the global index: te-chushi legitimately
    // has 8/7/7/8 frames per row. Each rectangle instead proves its own
    // cell — poses are bottom-aligned on a row baseline and horizontally
    // centered on a column root (both within a pixel in these contracts).
    const expectedRow = { idle: 0, move: 1, attack: 2, hit: 3, death: 3 };
    for (const [state, count] of Object.entries(def.frameCounts)) {
      const sequence = contract.states?.[state];
      if (sequence?.length !== count) throw new Error(`Invalid ${bossId} ${state} frame count`);
      states[state] = sequence.map(index => {
        if (index !== expectedIndex++) throw new Error(`Invalid ${bossId} frame order`);
        const source = contract.sourceRects[index];
        if (source?.index !== index || source.state !== state
            || ![source.x, source.y, source.w, source.h].every(Number.isFinite)
            || source.x < 0 || source.y < 0 || source.w <= 0 || source.h <= 0
            || source.x + source.w > width || source.y + source.h > height) {
          throw new Error(`Invalid ${bossId} source rectangle ${index}`);
        }
        const bottom = source.y + source.h;
        let row = -1, rowDistance = Infinity;
        contract.previewBaselines.forEach((baseline, i) => {
          const distance = Math.abs(baseline - bottom);
          if (distance < rowDistance) { rowDistance = distance; row = i; }
        });
        const col = Math.min(7, Math.max(0, Math.floor((source.x + source.w / 2) / (width / 8))));
        const rootX = contract.previewRootXs[col];
        if (row !== expectedRow[state] || rowDistance > 3 || !Number.isFinite(rootX)
            || Math.abs(rootX - (source.x + source.w / 2)) > 4) {
          throw new Error(`Invalid ${bossId} source rectangle ${index} anchors`);
        }
        return Object.freeze({ x: source.x, y: source.y, w: source.w, h: source.h, rootX, baseline: contract.previewBaselines[row] });
      });
      Object.freeze(states[state]);
    }
    image.__bossBattleSprite = true;
    image.__prioritySprite = true;
    image.__bossSpriteId = def.spriteId;
    image.__bossFrames = Object.freeze({ referenceBodyHeight: def.referenceBodyHeight, states: Object.freeze(states) });
    return image;
  };
}

export function bossDrawFrame(bossId, image, state, frameIndex, radius) {
  const def = BOSS_DEFS[bossId];
  if (!def || !image?.__bossBattleSprite || image.__bossSpriteId !== def.spriteId || !image.__bossFrames) return null;
  const resolvedState = state === 'stun' ? 'hit' : (def.frameCounts[state] ? state : 'idle');
  const frames = image.__bossFrames.states[resolvedState];
  const index = Math.max(0, Math.floor(Number(frameIndex) || 0));
  const frame = frames[['idle', 'move'].includes(resolvedState) ? index % frames.length : Math.min(index, frames.length - 1)];
  const scale = radius * 3.2 / image.__bossFrames.referenceBodyHeight;
  // One source-pixel scale across all poses, exactly like the species
  // atlases: no stretch-to-fit, bob, rotation or squash.
  return { x: frame.x, y: frame.y, w: frame.w, h: frame.h,
    dx: (frame.x - frame.rootX) * scale, dy: radius * .7 + (frame.y - frame.baseline) * scale,
    dw: frame.w * scale, dh: frame.h * scale };
}
