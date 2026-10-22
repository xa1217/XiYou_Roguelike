/*
 * 西游·八十一难 — authored skill-effect sprite strips
 *
 * The four signature weapons fire constantly, so their battle effects are
 * the most-seen animation in the game.  Each effect kind can be backed by
 * a painted horizontal strip (square cells, one row) generated for this
 * project:
 *
 *   sweep / heavy-sweep (Wukong)  -> 'slash-arc'  golden staff slash
 *   light-orb projectile (Sanzang)-> 'light-orb'  pulsing prayer orb
 *   hoe-line (Bajie)              -> 'rake-sweep' rake energy streak
 *   staff-ring (Wujing)           -> 'water-ring' expanding water ring
 *
 * Frames advance with the effect's own progress (ttl), so the animation
 * always matches the gameplay timing; the orb loops on renderer time
 * instead.  When a strip has not loaded (or the platform supplies none,
 * as on WeChat), the renderer keeps its procedural vector effect — this
 * module only ever upgrades the pixels, never the mechanics.
 */

export const SKILL_FX = Object.freeze({
  'slash-arc': Object.freeze({ cell: 256, frames: 6 }),
  'light-orb': Object.freeze({ cell: 256, frames: 6 }),
  'rake-sweep': Object.freeze({ cell: 256, frames: 6 }),
  'water-ring': Object.freeze({ cell: 256, frames: 6 }),
  // Acquired-artifact effects (playtest line, 2026-10-22): the treasures a
  // run picks up get the same painted treatment as the signature weapons.
  'fan-wave': Object.freeze({ cell: 256, frames: 6 }),
  'gourd-vortex': Object.freeze({ cell: 256, frames: 6 }),
  'palm-burst': Object.freeze({ cell: 256, frames: 6 }),
  'fire-burst': Object.freeze({ cell: 256, frames: 6 }),
  // Acquired-artifact batch 2 (2026-10-22): the wind-fire wheel and the
  // Qiankun ring are projectiles (routed in _drawProjectile like the orb);
  // the golden rope beads and the wheel's fire trail are effects.
  'fire-wheel': Object.freeze({ cell: 256, frames: 6 }),
  'ring-spin': Object.freeze({ cell: 256, frames: 6 }),
  'gold-bead': Object.freeze({ cell: 256, frames: 6 }),
  'fire-pool': Object.freeze({ cell: 256, frames: 6 }),
});

// The effect kinds each strip serves.  Signature kinds come from the
// weapon code paths; artifact kinds from fireArtifact in the engine.
export function skillFxIdForEffect(kind) {
  if (kind === 'sweep' || kind === 'heavy-sweep') return 'slash-arc';
  if (kind === 'hoe-line') return 'rake-sweep';
  if (kind === 'staff-ring') return 'water-ring';
  if (kind === 'fan') return 'fan-wave';
  if (kind === 'gourd') return 'gourd-vortex';
  if (kind === 'palm-strike') return 'palm-burst';
  if (kind === 'mountain') return 'fire-burst';
  if (kind === 'bead' || kind === 'skull-bead') return 'gold-bead';
  if (kind === 'fire-trail' || kind === 'fire-pool') return 'fire-pool';
  return null;
}

export function attachSkillFx(image, fxId) {
  const def = SKILL_FX[fxId];
  if (!def || !image) return null;
  const width = Number(image.naturalWidth || image.width || 0);
  const height = Number(image.naturalHeight || image.height || 0);
  if (width !== def.cell * def.frames || height !== def.cell) return null;
  image.__skillFx = fxId;
  return image;
}

export function skillFxReady(image) {
  return !!(image && SKILL_FX[image.__skillFx]);
}

// Source rect for a phase in [0, 1].  Phases outside the range clamp to
// the first/last frame so a long-lived effect never samples outside the
// strip.
export function skillFxFrameRect(image, phase) {
  const def = image && SKILL_FX[image.__skillFx];
  if (!def) return null;
  const p = Math.min(0.9999, Math.max(0, Number(phase) || 0));
  const frame = Math.floor(p * def.frames);
  return { x: frame * def.cell, y: 0, w: def.cell, h: def.cell, frame, frames: def.frames };
}
