import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { GameEngine } from '../prototype-2d/src/engine.js';
import { createVanguardEventPreview } from './tiger-vanguard-event-preview.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const motionFile = 'evidence/current/tiger-vanguard/motion-draft/2026-10-13T12-00-07-310Z/motion-draft.json';
const draft = JSON.parse(fs.readFileSync(path.join(root, motionFile), 'utf8'));
assert.equal(hash(fs.readFileSync(path.join(root, motionFile))), 'b1fc330ce13c962701b5ae38f36e23a96cd3154f7a025874c5ced29fa34a6cc5');
const run = enabled => {
  const engine = new GameEngine({ seed: 141017, stageId: 1, characterId: 'wukong' });
  const preview = enabled ? createVanguardEventPreview(draft) : null;
  let rngCalls = 0, unchangedReads = 0;
  const rngValues = [], observerErrors = [];
  const rng = engine.rng; engine.rng = () => { rngCalls++; const value = rng(); rngValues.push(value); return value; };
  const emitted = [];
  engine.onEvent = event => {
    emitted.push({ type: event.type, target: event.target || null, enemyId: event.enemy?.id || null, amount: event.amount || 0, time: event.time });
    if (preview) {
      try {
        const before = JSON.stringify(engine.state), calls = rngCalls;
        preview.consume(event, engine.state);
        assert.equal(JSON.stringify(engine.state), before); assert.equal(rngCalls, calls); unchangedReads++;
      } catch (error) { observerErrors.push(String(error)); }
    }
  };
  // Explicit accelerated-spawn/position/subsystem fixture, not natural play.
  engine.elapsed = engine.state.time = 300; engine.advanceSpawns();
  const leader = engine.state.enemies.find(enemy => enemy.encounterIdentity);
  assert.ok(leader); engine.state.enemies = [leader];
  const player = engine.state.player; player.x = 900; player.y = 1260;
  leader.x = 1010; leader.y = 1320;
  const samples = [];
  const sample = () => {
    if (!preview) return;
    const before = JSON.stringify(engine.state), calls = rngCalls;
    const pose = preview.sampleEnemy(leader, engine.state); if (pose) samples.push(pose);
    for (const effect of engine.state.effects) { const pose = preview.sampleEffect(effect, engine.state); if (pose) samples.push(pose); }
    preview.reconcile(engine.state); assert.equal(JSON.stringify(engine.state), before); assert.equal(rngCalls, calls); unchangedReads++;
  };
  const step = dt => { engine.elapsed += dt; engine.state.time = engine.elapsed; engine.updateEffects(dt); engine.updateEnemies(dt); sample(); };
  sample(); for (let i = 0; i < 32; i++) step(.025);
  leader.x = player.x + 15; leader.y = player.y + 15; player.invulnerable = 0;
  step(.025); // Real player-hit lacks sourceId: no candidate attack trigger.
  engine.damageEnemy(leader, 1, {}); sample();
  for (let i = 0; i < 11; i++) step(.025);
  const atEnd = preview?.sampleEnemy(leader, engine.state);
  engine.damageEnemy(leader, leader.hp + 1, {}); sample();
  const death = engine.state.effects.find(effect => effect.kind === 'death');
  assert.equal(death.maxTtl, .42);
  const deathMaxTtlAtCreation = death.maxTtl;
  for (let i = 0; i < 17; i++) step(.025);
  engine.effect({ kind: 'hit-burst', x: leader.x, y: leader.y, radius: 12, ttl: .01 });
  const reusedBound = preview?.sampleEffect(engine.state.effects[0], engine.state);
  if (preview) {
    const ordinary = { ...leader, kind: 'normal', encounterIdentity: null, hp: 1 };
    const homonym = { ...leader, encounterIdentity: null, hp: 1 };
    assert.equal(preview.sampleEnemy(ordinary, engine.state), null);
    assert.equal(preview.sampleEnemy(homonym, engine.state), null);
    assert.equal(preview.sampleEnemy({ ...leader, hp: 1 }, { ...engine.state, stage: { id: 2 } }), null);
    assert.equal(preview.attackEventSupported, false);
    assert.equal(atEnd.state, 'move'); assert.equal(atEnd.actualHitTimer, 0);
    assert.equal(preview.retainedRecords, 0); assert.equal(reusedBound, null);
    for (const [state, ids] of [['move', [8,9,10,11,12,13,14,15]], ['hit', [24,25,26,27]], ['death', [28,29,30,31]]]) {
      assert.deepEqual([...new Set(samples.filter(pose => pose.state === state).map(pose => pose.index))].sort((a,b)=>a-b), ids);
    }
    assert.ok(samples.some(pose => pose.state === 'hit' && pose.actualHitTimer === 0 && pose.visualHitRemainingMs > 0));
    assert.ok(!samples.some(pose => pose.state === 'attack'));
  }
  assert.deepEqual(observerErrors, []);
  return { stateSha256: hash(JSON.stringify(engine.state)), emittedSha256: hash(JSON.stringify(emitted)), rngCalls,
    rngValuesSha256: hash(JSON.stringify(rngValues)), observerErrors,
    internalScheduleSha256: hash(JSON.stringify({ nextId: engine.nextId, elapsed: engine.elapsed, spawnAccumulator: engine.spawnAccumulator,
      elitesSpawned: [...engine.elitesSpawned], bossSpawned: engine.bossSpawned, finalBossSpawned: engine.finalBossSpawned, weaponShots: engine.weaponShots })),
    poolSha256: hash(JSON.stringify({ pools: engine.pools, stats: engine.poolStats })), unchangedReads,
    sampledSourceIndices: preview ? [...new Set(samples.map(pose=>pose.index))].sort((a,b)=>a-b) : [],
    states: preview ? [...new Set(samples.map(pose=>pose.state))] : [], actualDeathTtlAtCreation: deathMaxTtlAtCreation };
};
const baseline = run(false), preview = run(true);
for (const key of ['stateSha256', 'emittedSha256', 'rngCalls', 'rngValuesSha256', 'internalScheduleSha256', 'poolSha256', 'actualDeathTtlAtCreation']) assert.equal(preview[key], baseline[key], key);
const generatedAt = new Date().toISOString(), output = path.join(root, 'evidence/current/tiger-vanguard/event-preview', generatedAt.replaceAll(':','-').replaceAll('.','-'));
fs.mkdirSync(output, { recursive: true });
const report = { generatedAt, result: 'PASS_EVIDENCE_ONLY_EVENT_CLOCK',
  scope: 'Accelerated 300s, repositioned, direct-damage, fixed-step engine subsystem fixture; not natural gameplay, runtime integration, browser quality or public acceptance.',
  baseline, preview, checks: { exactGameplayEventsRngPoolMatch: true, noEngineWritesByPreview: true,
    move8Hit4Death4SourceClockCoverage: true, isolated250msHitDoesNotExtendActual120msHit: true,
    existing420msDeathExpiryAndPoolReuse: true, identityAndStageGuards: true, noInventedAttackEvent: true },
  attackEventSupported: false, runtimeApproved: false, highFrameApproved: false, publicPass: false, releaseReady: false };
const file = path.join(output, 'node.json'); fs.writeFileSync(file, JSON.stringify(report,null,2));
console.log(JSON.stringify({ file: path.relative(root,file).replaceAll('\\','/'), result: report.result, checks: report.checks, preview },null,2));
