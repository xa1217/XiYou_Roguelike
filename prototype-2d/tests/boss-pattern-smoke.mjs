import assert from 'node:assert/strict';
import { GameEngine } from '../src/engine.js';

const tests = [];
const test = (name, run) => tests.push({ name, run });
const advance = (engine, seconds, input = {}) => {
  for (let remaining = seconds; remaining > 1e-8; remaining -= 0.05) engine.update(Math.min(0.05, remaining), input);
};

// Arrange a single authored guardian in the upper clearing. Real update/input,
// damage, projectile and pause paths remain active; only unrelated auto-fire is
// omitted so it cannot kill the guardian before its behaviour is observed.
const encounter = (variant) => {
  const events = [];
  const engine = new GameEngine({ stageId: 1, characterId: 'wukong', seed: 824, onEvent: (event) => events.push(event) });
  Object.assign(engine.state.player, { x: 900, y: 450 });
  engine.state.skills = [];
  const boss = engine.spawnBoss(true, engine.state.stage.finalBosses.find((item) => item.variant === variant));
  Object.assign(boss, { x: 900, y: 200, speed: 0, spawnTimer: 0, attackCooldown: 0 });
  return { engine, boss, events };
};

test('tiger locks a visible fan warning before firing five avoidable claw waves', () => {
  const { engine, boss } = encounter('tiger');
  const hp = engine.state.player.hp;
  engine.update(0.05);
  assert.equal(boss.attackPattern, 'tiger-claw');
  assert.equal(boss.attackPhase, 'windup');
  assert.ok(boss.attackWindup >= 0.65, 'the player gets at least 650ms of visible warning');
  const warning = engine.state.effects.find((effect) => effect.sourceId === boss.id);
  assert.equal(warning.warningShape, 'cone');
  assert.equal(engine.state.projectiles.filter((shot) => shot.hostile).length, 0, 'windup must not release damaging waves');
  const aim = boss.attackAngle;
  advance(engine, 0.6, { x: 1 });
  assert.equal(engine.state.player.hp, hp, 'telegraph is harmless');
  assert.equal(boss.attackAngle, aim, 'moving after the warning does not rotate its locked aim');
  advance(engine, 0.15, { x: 1 });
  const waves = engine.state.projectiles.filter((shot) => shot.bossPattern === 'tiger-claw');
  assert.equal(waves.length, 5);
  assert.ok(new Set(waves.map((shot) => shot.vx.toFixed(2))).size === 5, 'the waves fan out in distinct directions');
  assert.ok(waves.every((shot) => shot.hostile && shot.damage > 0));
  advance(engine, 1, { x: 1 });
  assert.equal(engine.state.player.hp, hp, 'a lateral escape during the warning avoids the whole fan');
});

test('bear telegraphs a target circle, pauses deterministically, and only slams players who stay inside', () => {
  const safe = encounter('bear');
  const hp = safe.engine.state.player.hp;
  safe.engine.update(0.05);
  assert.equal(safe.boss.attackPattern, 'bear-slam');
  assert.equal(safe.boss.attackPhase, 'windup');
  const warning = safe.engine.state.effects.find((effect) => effect.sourceId === safe.boss.id);
  assert.equal(warning.warningShape, 'circle');
  assert.ok(warning.radius >= 100 && safe.boss.attackWindup >= 0.8);
  safe.engine.pause(); const paused = safe.engine.getSnapshot(); safe.engine.update(1); assert.deepEqual(safe.engine.getSnapshot(), paused, 'pause freezes the bear telegraph and timer'); safe.engine.resume();
  advance(safe.engine, 0.92, { x: -1 });
  assert.equal(safe.engine.state.player.hp, hp, 'leaving the marked circle avoids the slam');

  const hit = encounter('bear');
  const hitHp = hit.engine.state.player.hp;
  hit.engine.update(0.05); advance(hit.engine, 0.9);
  assert.ok(hit.engine.state.player.hp < hitHp, 'remaining in the marked circle takes slam damage');
  assert.ok(hit.events.some((event) => event.type === 'boss-attack' && event.pattern === 'bear-slam' && event.phase === 'active'));
});

test('bull locks a line telegraph and charges along it, allowing a side-step escape', () => {
  const safe = encounter('bull');
  const hp = safe.engine.state.player.hp;
  safe.engine.update(0.05);
  assert.equal(safe.boss.attackPattern, 'bull-charge');
  assert.equal(safe.boss.attackPhase, 'windup');
  const warning = safe.engine.state.effects.find((effect) => effect.sourceId === safe.boss.id);
  assert.equal(warning.warningShape, 'line');
  assert.ok(warning.length > 200 && safe.boss.attackWindup >= 0.55);
  advance(safe.engine, 1.1, { x: -1 });
  assert.equal(safe.engine.state.player.hp, hp, 'a side-step out of the charge line avoids impact');
  assert.ok(['active', 'recovery', 'cooldown'].includes(safe.boss.attackPhase));

  const hit = encounter('bull');
  const hitHp = hit.engine.state.player.hp;
  hit.engine.update(0.05); advance(hit.engine, 1.1);
  assert.ok(hit.engine.state.player.hp < hitHp, 'a stationary player is struck by the charge');
});

for (const { name, run } of tests) { run(); console.log(`PASS ${name}`); }
console.log(`Passed ${tests.length} authored Boss pattern regressions.`);
