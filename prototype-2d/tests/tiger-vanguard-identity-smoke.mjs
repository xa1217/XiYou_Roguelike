import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { GameEngine } from '../src/engine.js';
import { BALANCE, STAGES } from '../src/content.js';
import { battleEnemyAnimation } from '../src/battle-enemy-animation.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const output = path.join(root, 'evidence/current/tiger-vanguard/identity');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const files = ['prototype-2d/src/engine.js', 'prototype-2d/src/content.js', 'prototype-2d/tests/tiger-vanguard-identity-smoke.mjs'];
const fingerprints = () => Object.fromEntries(files.map(file => [file, hash(fs.readFileSync(path.join(root, file)))]));
const identity = { encounterId: 'tiger-vanguard', variant: 'tiger', actionId: 'tiger-vanguard' };
const make = (options = {}) => new GameEngine({ stageId: 1, seed: 19, debug: true, ...options });
const at = (engine, time) => { engine.debug('time', { value: time }); engine.advanceSpawns(); };

// Captured from the pre-change engine. Only the new identity metadata is
// excluded; simulation state, events, pools, IDs and RNG samples remain exact.
const GAMEPLAY_BASELINE = {
  '1/19/normal/pool': '0464d701a4189ffd0733a4b390f5eb85daecce3acb7d4cbe042336bb21413e1f',
  '1/19/normal/no-pool': '2125a186308c12bbdbc6f0358f1c221425777eb4ce1532f7a487b75fb319caaa',
  '1/19/hard/pool': 'b12b1d57b5ee6a70f128d269f2b9c0188b54e6d096b6ad35826ed0d713f85e62',
  '1/19/hard/no-pool': '0adb59a82580ab92a83861535792b2559261ef9e16cde9db1e6526013cebe80e',
  '1/712/normal/pool': '1f73b7210d2b5482e346dd97ddd32fc7c7156f5c616e609bf8c382c11fbd2d6b',
  '1/712/normal/no-pool': '9cb40cd11ea44dae5997aa85d52f0fdd020ae470fc642662f35fcc7e03da84b3',
  '1/712/hard/pool': 'c2ca0d12e8fa2f0d5175c2c61a373dfa264c14374e0369a8547e6d28d277ba1c',
  '1/712/hard/no-pool': '1df49a5520f7cf15541fc1043325bf91895794a65e300f5490703c139a176fa5',
  '2/19/normal/pool': '5459598a26f7abc4cce0796a04a89b502346d85371c13c9009582218c355e97b',
  '2/19/normal/no-pool': '56de78fa521fd57809d31cae582ad476e5ca111d9884e8784b0f48f6eb799885',
  '2/19/hard/pool': '42d962da06322d6823d007c61f5f91ad7133e3aabdda2d689b88ecfd3eda7ea5',
  '2/19/hard/no-pool': '515a4f6a4e75043054ca39c473c0d21373efacb0c057ba228fa99b73781c34c3',
  '2/712/normal/pool': '7067c02caaa34b75276f8773f2445a53520b95b4ecdb22b5cb90f8099226dabb',
  '2/712/normal/no-pool': '4ee762bd0a1a0dfda3b5bd524d156c8291abf1a6230154cdd4a9d42186d397a0',
  '2/712/hard/pool': 'c5f8bd8493da302fb53c223ac150c5b8dd4cd1bdb40f4fd0427bbc190ecb2cd6',
  '2/712/hard/no-pool': '195c8142b16a8e4ead438952cce5251027ea0d01879ab948119fd9e952b52113',
};
function gameplayProbe() {
  const results = {};
  const serialize = value => JSON.stringify(value, function(key, item) {
    if (key === 'encounterIdentity') return undefined;
    if ((key === 'encounterId' || key === 'actionId') && this.at === 300 && this.replacesMidBoss === true) return undefined;
    return item instanceof Set ? [...item] : item;
  });
  for (const stageId of [1, 2]) for (const seed of [19, 712]) for (const difficulty of ['normal', 'hard']) for (const pooling of [true, false]) {
    const events = [];
    const e = make({ stageId, seed, difficulty, onEvent: event => events.push(JSON.parse(serialize(event))) });
    e.debug('invincible'); e.debug('pooling', { enabled: pooling });
    const random = e.rng; let rngCalls = 0;
    e.rng = () => { rngCalls += 1; return random(); };
    const checkpoints = [];
    const sample = name => checkpoints.push({ name, state: e.getSnapshot(), pools: e.pools, poolStats: e.poolStats,
      nextId: e.nextId, rngCalls, elites: [...e.elitesSpawned], bossSpawned: e.bossSpawned, finalBossSpawned: e.finalBossSpawned });
    // Serialize each checkpoint now so later pool reuse cannot change it.
    const capture = name => { sample(name); checkpoints[checkpoints.length - 1] = JSON.parse(serialize(checkpoints.at(-1))); };
    for (const time of [119.95, 239.95, 299.90, 299.95, 359.95, 479.95, 569.95, 599.95]) {
      while (e.state.status === 'upgrade') e.chooseUpgrade(e.state.choices[0].id);
      e.debug('time', { value: time }); e.update(.05, { x: 1, y: -1 }); capture(`time-${time}`);
      if (time === 299.95) {
        const target = e.state.enemies.find(enemy => enemy.name === '双叉岭虎先锋' || enemy.kind === 'boss');
        assert.ok(target, 'baseline must exercise the scheduled leader');
        e.damageEnemy(target, target.hp + 1); capture('leader-death');
        e.updateEffects(.8); e.effect({ kind: 'identity-probe', x: 0, y: 0, ttl: .1 }); capture('recycled-effect');
      }
    }
    results[`${stageId}/${seed}/${difficulty}/${pooling ? 'pool' : 'no-pool'}`] = hash(serialize({ checkpoints, events, rngCalls, nextRandom: [e.rng(), e.rng(), e.rng()] }));
    e.dispose();
  }
  return results;
}

fs.mkdirSync(output, { recursive: true });
if (process.argv.includes('--capture-baseline')) {
  const report = { generatedAt: new Date().toISOString(), result: 'PRE_CHANGE_BASELINE', inputs: fingerprints(), gameplay: gameplayProbe() };
  const file = path.join(output, 'gameplay-before.json');
  fs.writeFileSync(file, JSON.stringify(report, null, 2), { flag: 'wx' });
  console.log(JSON.stringify(report, null, 2));
} else {
  const tests = [];
  const test = (name, run) => { try { run(); tests.push({ name, pass: true }); } catch (error) { tests.push({ name, pass: false, error: String(error.stack || error) }); } };
  test('authored encounter IDs are stable, frozen and separate from final guardians', () => {
    const encounter = STAGES[0].eliteEncounters[0];
    assert.equal(encounter.encounterId, identity.encounterId);
    assert.equal(encounter.actionId, identity.actionId);
    assert.ok(Object.isFrozen(encounter));
    assert.equal(encounter.at, 300); assert.equal(encounter.replacesMidBoss, true);
    for (const boss of STAGES[0].finalBosses) assert.notEqual(boss.actionId, encounter.actionId);
  });
  test('only the scheduled 300s elite receives identity, once, replacing the mid-boss', () => {
    const events = [], e = make({ onEvent: event => events.push(event) });
    e.debug('time', { value: 299.90 }); e.update(.05);
    assert.equal(e.state.enemies.filter(enemy => enemy.encounterIdentity).length, 0);
    e.debug('time', { value: 299.95 }); e.update(.05);
    const leaders = e.state.enemies.filter(enemy => enemy.encounterIdentity);
    assert.equal(leaders.length, 1);
    const leader = leaders[0];
    assert.deepEqual(leader.encounterIdentity, identity); assert.ok(Object.isFrozen(leader.encounterIdentity));
    assert.throws(() => { leader.encounterIdentity.actionId = 'tiger-normal-v1'; }, TypeError);
    assert.equal(leader.kind, 'elite'); assert.equal(leader.variant, 'tiger');
    assert.equal(leader.maxHp, 315); assert.equal(leader.speed, 56 * 1.12); assert.equal(leader.damage, 21); assert.equal(leader.xp, 30);
    assert.equal(leader.battleSpriteId, undefined); assert.equal(battleEnemyAnimation(leader), null);
    assert.equal(e.state.enemies.filter(enemy => enemy.kind === 'boss').length, 0); assert.equal(e.bossSpawned, true);
    at(e, 300); at(e, 600);
    assert.equal(e.state.enemies.filter(enemy => enemy.encounterIdentity).length, 1);
    assert.equal(events.filter(event => event.encounter && event.at === 300).length, 1);
    assert.equal(e.state.enemies.filter(enemy => enemy.final).length, 3);
    e.killEnemy(leader); at(e, 600);
    assert.equal(e.state.enemies.filter(enemy => enemy.encounterIdentity).length, 0);
    assert.equal(events.filter(event => event.encounter && event.at === 300).length, 1);
    e.dispose();
  });
  test('names, tiger variants and override IDs cannot bind generic spawns or bosses', () => {
    const e = make(), encounter = STAGES[0].eliteEncounters[0];
    for (const kind of ['normal', 'elite']) for (const override of [encounter, { ...encounter, encounterIdentity: identity }, { name: encounter.name, variant: 'tiger' }]) {
      const enemy = e.spawnEnemy(kind, 0, override);
      assert.equal(enemy.encounterIdentity, null);
      assert.equal(battleEnemyAnimation(enemy)?.id || null, kind === 'normal' ? 'tiger-normal-v1' : null);
    }
    for (const final of [false, true]) for (const override of [encounter, ...STAGES[0].finalBosses]) {
      const boss = e.spawnBoss(final, override);
      assert.equal(boss.encounterIdentity, null); assert.equal(battleEnemyAnimation(boss), null);
    }
    e.dispose();
  });
  test('stage guard and enemy cap do not create phantom encounter identities', () => {
    const later = make({ stageId: 2 });
    later.stage = { ...later.stage, eliteEncounters: STAGES[0].eliteEncounters };
    at(later, 300);
    assert.ok(later.state.enemies.every(enemy => enemy.encounterIdentity === null));
    later.dispose();
    const capped = make();
    for (let i = 0; i < BALANCE.maxEnemies; i += 1) capped.spawnEnemy('elite');
    at(capped, 300);
    assert.equal(capped.state.enemies.length, BALANCE.maxEnemies);
    assert.ok(capped.state.enemies.every(enemy => enemy.encounterIdentity === null));
    capped.dispose();
  });
  test('death retains frozen identity; pooled reuse clears it before unrelated effects', () => {
    const e = make(); at(e, 300);
    const leader = e.state.enemies.find(enemy => enemy.encounterIdentity);
    e.killEnemy(leader);
    const death = e.state.effects.find(effect => effect.kind === 'death');
    assert.equal(death.encounterIdentity, leader.encounterIdentity); assert.deepEqual(death.encounterIdentity, identity);
    assert.equal(death.bossIdentity, null); assert.equal(death.enemyKind, 'elite');
    assert.equal(battleEnemyAnimation(death), null); assert.equal(death.battleSpriteId, undefined);
    e.updateEffects(.5); assert.equal(e.state.effects.length, 0);
    e.effect({ kind: 'test-unrelated', x: 0, y: 0, ttl: .01 });
    assert.equal(e.state.effects[0], death); assert.equal(death.encounterIdentity, undefined);
    e.updateEffects(.05);
    const ordinary = e.spawnEnemy('normal', 0, { variant: 'tiger' }); e.killEnemy(ordinary);
    assert.equal(e.state.effects[0], death); assert.equal(death.encounterIdentity, null);
    assert.equal(battleEnemyAnimation(death)?.id, 'tiger-normal-v1');
    e.updateEffects(.5);
    const boss = e.spawnBoss(true, STAGES[0].finalBosses[0]); e.killEnemy(boss);
    assert.equal(e.state.effects[0], death); assert.equal(death.encounterIdentity, null);
    assert.equal(death.bossIdentity.bossId, 'yin-general');
    e.dispose(); assert.equal(e.pools.effect.length, 0); assert.equal(e.state.effects.length, 0);
  });
  const gameplay = gameplayProbe();
  test('16 fixed-seed configurations preserve pre-change gameplay, pool and RNG hashes', () => assert.deepEqual(gameplay, GAMEPLAY_BASELINE));
  const report = { generatedAt: new Date().toISOString(), result: tests.every(test => test.pass) ? 'PASS' : 'FAIL',
    scope: 'Identity metadata only; no animation, visual, public, ZIP or device acceptance.', inputs: fingerprints(), tests, gameplay,
    runtimeArtIntegrated: false, publicPass: false, releaseReady: false };
  fs.writeFileSync(path.join(output, 'node.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (report.result !== 'PASS') process.exitCode = 1;
}
