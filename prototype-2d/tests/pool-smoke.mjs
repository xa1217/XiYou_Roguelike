import assert from 'node:assert/strict';
import { GameEngine } from '../src/engine.js';

function simulate(pooling) {
  const engine = new GameEngine({ characterId: 'bajie', stageId: 49, seed: 712, debug: true });
  engine.debug('invincible', { enabled: true });
  engine.debug('pooling', { enabled: pooling });
  const start = performance.now();
  for (let frame = 0; frame < 12000; frame += 1) {
    while (engine.state.status === 'upgrade') {
      const choice = engine.state.choices.find((item) => item.isWeapon)
        || engine.state.choices.find((item) => !engine.state.skills.some((skill) => skill.id === item.id))
        || engine.state.choices[0];
      engine.chooseUpgrade(choice.id);
    }
    const player = engine.state.player;
    const gem = engine.state.gems.slice().sort((a, b) => Math.hypot(a.x - player.x, a.y - player.y) - Math.hypot(b.x - player.x, b.y - player.y))[0];
    const target = gem || { x: 900 + Math.cos(engine.state.time / 16) * 90, y: 900 + Math.sin(engine.state.time / 16) * 90 };
    engine.update(0.05, { x: target.x - player.x, y: target.y - player.y });
  }
  return { engine, wallMs: Math.round(performance.now() - start) };
}

const before = simulate(false);
const after = simulate(true);
assert.deepEqual(after.engine.getSnapshot(), before.engine.getSnapshot(), 'entity reuse must preserve deterministic gameplay exactly');
const total = (stats) => Object.values(stats.created).reduce((a, b) => a + b, 0);
const allocatedBefore = total(before.engine.poolStats);
const allocatedAfter = total(after.engine.poolStats);
assert.ok(allocatedAfter < allocatedBefore * 0.1, 'the bounded pool must remove at least 90% of entity allocations');
for (const [kind, cap] of [['projectile', 300], ['effect', 160], ['gem', 240]]) assert.ok(after.engine.pools[kind].length <= cap);

const reset = new GameEngine({ seed: 1, debug: true });
reset.projectile({ x: 1, y: 1, vx: 0, vy: 0, kind: 'fire-bird', ttl: 0.001, damage: 20, explosion: 12, targetId: 'stale', hostile: true });
const oldShot = reset.state.projectiles[0];
reset.updateProjectiles(0.05);
reset.projectile({ x: 3, y: 3, vx: 0, vy: 0, kind: 'light-spark', ttl: 1, damage: 10 });
assert.equal(reset.state.projectiles[0], oldShot, 'the projectile object should be reused');
assert.equal(oldShot.explosion, undefined); assert.equal(oldShot.targetId, undefined); assert.equal(oldShot.hostile, undefined); assert.equal(oldShot.hit.size, 0);
reset.dropGem(reset.state.player.x, reset.state.player.y, 1, 'heal'); const oldGem = reset.state.gems[0];
oldGem.magnetized = true; reset.updateGems(0.05);
reset.dropGem(0, 0, 2, 'xp'); assert.equal(reset.state.gems[0], oldGem); assert.equal(oldGem.magnetized, undefined); assert.equal(oldGem.kind, 'xp');
reset.effect({ x: 1, y: 1, kind: 'whirl', radius: 18, ttl: 0.001, hitIds: true });
const oldEffect = reset.state.effects.at(-1); oldEffect.hitIds.add('old-enemy'); reset.updateEffects(0.05);
reset.effect({ x: 1, y: 1, kind: 'whirl', radius: 18, ttl: 1, hitIds: true });
assert.equal(reset.state.effects.at(-1), oldEffect); assert.equal(oldEffect.hitIds.size, 0);
console.log(JSON.stringify({ verdict: 'PASS: identical gameplay, recycled fields reset, bounded pools', baseline: { allocated: allocatedBefore, wallMs: before.wallMs, counts: before.engine.poolStats.created }, pooled: { allocated: allocatedAfter, wallMs: after.wallMs, counts: after.engine.poolStats.created, reused: after.engine.poolStats.reused }, allocationReductionPercent: Number(((1 - allocatedAfter / allocatedBefore) * 100).toFixed(2)) }, null, 2));
