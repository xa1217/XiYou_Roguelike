import assert from 'node:assert/strict';
import fs from 'node:fs';
import { GameEngine } from '../src/engine.js';
import { newSave, recordRun } from '../src/progression.js';

const rows = [];
for (const [index, characterId] of ['wukong', 'tangseng', 'bajie', 'wujing'].entries()) {
  const events = [];
  const engine = new GameEngine({ characterId, stageId: 1 + index * 24, seed: 0x2718 + index, onEvent: (event) => events.push(event) });
  let frames = 0; let dashes = 0; let upgrades = 0;
  while (frames < 15000 && (engine.state.status === 'playing' || engine.state.status === 'upgrade')) {
    if (engine.state.status === 'upgrade') {
      const player = engine.state.player;
      const choice = engine.state.choices.find((item) => item.isWeapon)
        || engine.state.choices.find((item) => !engine.state.skills.some((skill) => skill.id === item.id))
        || engine.state.choices[0];
      assert.ok(choice, 'normal run must always offer a choice');
      const before = engine.state.time;
      assert.equal(engine.chooseUpgrade(choice.id), true);
      assert.equal(engine.state.time, before, 'upgrade selection itself must not advance time');
      upgrades += 1;
      continue;
    }
    const player = engine.state.player;
    const target = engine.state.gems.slice().sort((a, b) => Math.hypot(a.x - player.x, a.y - player.y) - Math.hypot(b.x - player.x, b.y - player.y))[0]
      || { x: 900 + Math.cos(engine.state.time / 17) * 145, y: 900 + Math.sin(engine.state.time / 17) * 145 };
    // This is the same public input path used by the mini-program joystick.
    engine.update(0.05, { x: target.x - player.x, y: target.y - player.y });
    if (engine.state.player.dashCooldown <= 0 && engine.state.enemies.length > 70) {
      if (engine.useDash({ x: target.x - player.x, y: target.y - player.y })) dashes += 1;
    }
    frames += 1;
  }
  assert.notEqual(engine.state.status, 'lost', `${characterId} should survive a normal seeded run`);
  assert.equal(engine.state.status, 'won', `${characterId} should finish its final boss`);
  assert.ok(engine.state.time >= 600 && engine.state.time < 680);
  assert.ok(engine.state.kills >= 600);
  const eliteEvents = events.filter((event) => event.type === 'elite');
  const expectedEliteTimes = engine.state.stage.id === 1 ? [120, 240, 300, 360, 480] : [120, 240, 360, 480];
  assert.deepEqual(eliteEvents.map((event) => event.at), expectedEliteTimes);
  const bossEvents = events.filter((event) => event.type === 'boss');
  assert.equal(bossEvents.length, engine.state.stage.id === 1 ? 1 : 2);
  const damageEvents = events.filter((event) => event.type === 'hit' && event.target === 'player');
  const damageTaken = damageEvents.reduce((sum, event) => sum + event.amount, 0);
  assert.ok(damageTaken > 0, 'normal run must retain authentic damage rather than silently grant invulnerability');
  const finalKills = events.filter((event) => event.type === 'kill' && event.final);
  assert.equal(finalKills.length, engine.state.stage.id === 1 ? 3 : 1, 'all final guardians must die to real combat');
  const save = newSave();
  const eliteKills = events.filter((event) => event.type === 'kill' && event.enemy.kind === 'elite').length;
  const completion = recordRun(save, engine.state, { elites: eliteKills, dashes });
  assert.equal(completion.won, true);
  assert.ok(completion.reward >= 180 && completion.reward <= 500, `reward out of expected range: ${completion.reward}`);
  rows.push({ characterId, stageId: engine.state.stage.id, seed: 0x2718 + index, status: engine.state.status, time: Number(engine.state.time.toFixed(2)), frames, kills: engine.state.kills, level: engine.state.player.level, hp: Number(engine.state.player.hp.toFixed(2)), upgrades, dashes, hitsTaken: damageEvents.length, damageTaken: Number(damageTaken.toFixed(2)), eliteKills, finalBossNaturalKills: finalKills.length, expectedFinalBosses: engine.state.stage.finalBosses?.length || 1, reward: completion.reward, score: completion.score, bossTimes: bossEvents.map((event) => Number(event.time.toFixed(2))), eliteTimes: events.filter((event) => event.type === 'elite').map((event) => event.at) });
}

const report = { generatedAt: new Date().toISOString(), mode: 'normal-player-input', note: 'No debug seam, invincibility, forced kill, or direct state mutation was used.', rows, verdict: 'PASS' };
fs.mkdirSync('evidence/current', { recursive: true });
fs.writeFileSync('evidence/current/normal-run.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
