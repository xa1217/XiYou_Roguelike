import { isPreviewVanguard } from './tiger-vanguard-event-preview.mjs';

// EVIDENCE ONLY. Deliberately restricted to one live target, no world effects
// or projectiles. This is a circular contact gate, not sprite pixel overlap.
export function planVanguardPlayerDepth(state, player, binding, renderToken, enabled) {
  const no = reason => ({ defer: false, reason });
  if (enabled !== true) return no('DISABLED');
  if (!Number.isSafeInteger(renderToken) || renderToken <= 0) return no('INVALID_RENDER_TOKEN');
  if (state?.status !== 'playing' || player !== state.player) return no('NOT_CURRENT_PLAYING_PLAYER');
  const enemy = binding?.enemy;
  if (!isPreviewVanguard(enemy, state) || enemy.kind !== 'elite' || binding.id !== enemy.id
    || binding.identity !== enemy.encounterIdentity || !(enemy.hp > 0)) return no('NOT_BOUND_LIVE_VANGUARD');
  if (!Array.isArray(state.enemies) || state.enemies.length !== 1 || state.enemies[0] !== enemy
    || !Array.isArray(state.effects) || state.effects.length || !Array.isArray(state.projectiles) || state.projectiles.length) return no('NOT_SINGLE_EMPTY_EFFECT_FIXTURE');
  if (![player.x, player.y, player.radius, enemy.x, enemy.y, enemy.radius].every(Number.isFinite)
    || player.radius < 9 || player.radius > 52 || enemy.radius < 7 || enemy.radius > 72) return no('INVALID_GEOMETRY');
  const distance = Math.hypot(enemy.x-player.x, enemy.y-player.y), contactDistance = player.radius + enemy.radius;
  if (enemy.y < player.y || distance > contactDistance) return no('NOT_BEHIND_CONTACT');
  return { defer: true, reason: 'SINGLE_BOUND_CONTACT_ONLY', renderToken, distance, contactDistance };
}
