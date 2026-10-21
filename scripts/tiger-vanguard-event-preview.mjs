import { selectDraftPose } from './tiger-vanguard-motion-draft.mjs';

// EVIDENCE ONLY. Keeps all visual clocks outside engine entities/effects.
// There is no authoritative attack event for this elite: do not infer one
// from a player-hit event without a sourceId.
export function isPreviewVanguard(entity, state) {
  const identity = entity?.encounterIdentity;
  return state?.stage?.id === 1 && Object.isFrozen(identity)
    && identity?.encounterId === 'tiger-vanguard' && identity?.actionId === 'tiger-vanguard'
    && identity?.variant === 'tiger' && entity.variant === 'tiger'
    && (entity.kind === 'elite' || (entity.kind === 'death' && entity.enemyKind === 'elite'));
}

export function createVanguardEventPreview(draft) {
  const records = new Map(), events = [];
  const ensure = (enemy, state) => {
    if (!isPreviewVanguard(enemy, state) || enemy.kind !== 'elite') return null;
    let record = records.get(enemy.id);
    if (!record) {
      record = { id: enemy.id, identity: enemy.encounterIdentity, radius: enemy.radius,
        facing: enemy.facing, locomotion: 'move', locomotionAt: state.time, hitAt: null, deathAt: null, deathEffect: null };
      records.set(enemy.id, record);
    }
    return record;
  };
  return {
    attackEventSupported: false,
    events,
    consume(event, state) {
      const enemy = event?.enemy;
      if (!isPreviewVanguard(enemy, state)) return false;
      if (event.type !== 'kill' && !(event.type === 'hit' && event.target === 'enemy')) return false;
      const record = ensure(enemy, state);
      record.facing = enemy.facing;
      if (event.type === 'hit') record.hitAt = state.time;
      else {
        const effect = state.effects.find(effect => effect.kind === 'death'
          && effect.encounterIdentity === enemy.encounterIdentity && effect.x === enemy.x && effect.y === enemy.y);
        if (!effect) throw new Error('Kill event has no matching existing death effect');
        record.deathAt = state.time; record.deathEffect = effect;
      }
      events.push({ type: event.type, target: event.target || null, enemyId: enemy.id, at: state.time,
        hitTimer: enemy.hitTimer, hp: enemy.hp, visualOnly: true });
      return true;
    },
    sampleEnemy(enemy, state) {
      const record = ensure(enemy, state);
      if (!record || record.deathAt !== null || enemy.hp <= 0) return null;
      record.facing = enemy.facing;
      const locomotion = enemy.animationState === 'idle' || enemy.animationState === 'intro' ? 'idle' : 'move';
      if (record.locomotion !== locomotion) { record.locomotion = locomotion; record.locomotionAt = state.time; }
      const hitMs = record.hitAt === null ? Infinity : Math.max(0, (state.time - record.hitAt) * 1000);
      const pose = hitMs + 1e-7 < draft.states.hit.durationMs
        ? selectDraftPose(draft, 'hit', hitMs, locomotion)
        : selectDraftPose(draft, locomotion, Math.max(0, (state.time - record.locomotionAt) * 1000), locomotion);
      return { ...pose, enemyId: record.id, x: enemy.x, y: enemy.y, radius: enemy.radius,
        facing: Math.cos(record.facing || 0) < 0 ? -1 : 1, hp: enemy.hp, maxHp: enemy.maxHp,
        actualHitTimer: enemy.hitTimer, visualHitRemainingMs: Math.max(0, draft.states.hit.durationMs - hitMs) };
    },
    sampleEffect(effect, state) {
      if (!isPreviewVanguard(effect, state) || effect.kind !== 'death' || effect.ttl <= 0) return null;
      const record = [...records.values()].find(record => record.deathEffect === effect);
      if (!record || !state.effects.includes(effect)) return null;
      return { ...selectDraftPose(draft, 'death', Math.max(0, (state.time - record.deathAt) * 1000)),
        enemyId: record.id, x: effect.x, y: effect.y, radius: record.radius,
        facing: Math.cos(record.facing || 0) < 0 ? -1 : 1, actualEffectTtl: effect.ttl };
    },
    reconcile(state) {
      for (const [id, record] of records) {
        const alive = state.enemies.some(enemy => enemy.id === id && enemy.encounterIdentity === record.identity);
        const dying = record.deathEffect && state.effects.includes(record.deathEffect)
          && isPreviewVanguard(record.deathEffect, state) && record.deathEffect.ttl > 0;
        if (!alive && !dying) records.delete(id);
      }
    },
    get retainedRecords() { return records.size; },
  };
}
