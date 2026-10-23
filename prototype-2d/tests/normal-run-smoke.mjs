import assert from 'node:assert/strict';
import fs from 'node:fs';
import { GameEngine } from '../src/engine.js';
import { newSave, recordRun } from '../src/progression.js';

const rows = [];
for (const [index, characterId] of ['wukong', 'tangseng', 'bajie', 'wujing'].entries()) {
  const events = [];
  const engine = new GameEngine({ characterId, stageId: 1 + index * 24, seed: 0x2718 + index, onEvent: (event) => events.push(event) });
  let frames = 0; let dashes = 0; let upgrades = 0;
  // Navigation for the input model (2026-10-23): painted scenery now blocks
  // movement (scene collision masks + the doublefork ridge), and a target
  // gem can lie straight behind a ruin or cliff. A human player walks
  // around; a pure seek vector presses into the wall forever and dies
  // pinned. The pilot therefore checks the straight line to its target
  // and, only when scenery blocks it, follows a BFS path over the same
  // isWalkable rule the engine enforces (grid 60x60, replanned at most
  // every 10 frames, string-pulled). Assertions below are unchanged.
  const NAV_CELL = 30; const NAV_N = 60;
  const navWalk = (cx, cy) => engine.isWalkable(cx * NAV_CELL + NAV_CELL / 2, cy * NAV_CELL + NAV_CELL / 2, engine.state.player.radius);
  const navSnap = (x, y) => {
    const cx = Math.max(0, Math.min(NAV_N - 1, Math.floor(x / NAV_CELL)));
    const cy = Math.max(0, Math.min(NAV_N - 1, Math.floor(y / NAV_CELL)));
    if (navWalk(cx, cy)) return [cx, cy];
    for (let ring = 1; ring < 8; ring++) for (let dy = -ring; dy <= ring; dy++) for (let dx = -ring; dx <= ring; dx++) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) !== ring) continue;
      const nx = cx + dx; const ny = cy + dy;
      if (nx >= 0 && ny >= 0 && nx < NAV_N && ny < NAV_N && navWalk(nx, ny)) return [nx, ny];
    }
    return [cx, cy];
  };
  const navLineClear = (x0, y0, x1, y1) => {
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.max(1, Math.ceil(dist / 15));
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      if (!engine.isWalkable(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, engine.state.player.radius)) return false;
    }
    return true;
  };
  const navPlan = (from, to) => {
    const [sx, sy] = navSnap(from.x, from.y);
    const [gx, gy] = navSnap(to.x, to.y);
    const key = (x, y) => y * NAV_N + x;
    const prev = new Map([[key(sx, sy), -1]]);
    const queue = [[sx, sy]];
    while (queue.length) {
      const [cx, cy] = queue.shift();
      if (cx === gx && cy === gy) break;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx; const ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= NAV_N || ny >= NAV_N || prev.has(key(nx, ny)) || !navWalk(nx, ny)) continue;
        prev.set(key(nx, ny), key(cx, cy)); queue.push([nx, ny]);
      }
    }
    if (!prev.has(key(gx, gy))) return null;
    const cells = [];
    for (let k = key(gx, gy); k !== -1; k = prev.get(k)) cells.push([k % NAV_N, Math.floor(k / NAV_N)]);
    cells.reverse();
    const points = cells.map(([cx, cy]) => ({ x: cx * NAV_CELL + NAV_CELL / 2, y: cy * NAV_CELL + NAV_CELL / 2 }));
    points[points.length - 1] = { x: to.x, y: to.y };
    // String-pulling: drop every waypoint the straight line renders moot.
    const pulled = [points[0]];
    let anchor = { x: from.x, y: from.y };
    for (let i = 1; i < points.length; i++) {
      if (!navLineClear(anchor.x, anchor.y, points[i].x, points[i].y)) { pulled.push(points[i - 1]); anchor = points[i - 1]; }
    }
    pulled.push(points[points.length - 1]);
    return pulled.slice(1);
  };
  let navPath = null; let navCooldown = 0;
  // Breadcrumb backtracking: the pilot records where it has been (a
  // proven-traversable trail). If it makes no progress toward its target
  // for a few seconds — wedged in a scenic pocket whose exit lane is
  // narrower than a grid cell — it walks its own trail back out, the way
  // a human player retreats from a dead end, until the line clears.
  const crumbs = [];
  let bestTargetDist = Infinity; let progressless = 0; let backtracking = false; let lastTargetKey = '';
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
    if (!crumbs.length || Math.hypot(player.x - crumbs[crumbs.length - 1].x, player.y - crumbs[crumbs.length - 1].y) >= 15) {
      crumbs.push({ x: player.x, y: player.y });
      if (crumbs.length > 600) crumbs.shift();
    }
    const targetKey = `${Math.round(target.x / 30)},${Math.round(target.y / 30)}`;
    if (targetKey !== lastTargetKey) { lastTargetKey = targetKey; bestTargetDist = Infinity; progressless = 0; }
    const targetDist = Math.hypot(target.x - player.x, target.y - player.y);
    if (targetDist < bestTargetDist - 5) { bestTargetDist = targetDist; progressless = 0; } else progressless += 1;
    if (!backtracking && progressless >= 70 && crumbs.length > 4) { backtracking = true; navPath = null; }
    let seekTarget = target;
    if (backtracking) {
      while (crumbs.length > 1 && Math.hypot(crumbs[crumbs.length - 1].x - player.x, crumbs[crumbs.length - 1].y - player.y) < 16) crumbs.pop();
      const crumb = crumbs[crumbs.length - 1];
      if (!crumb || navLineClear(player.x, player.y, target.x, target.y)) { backtracking = false; progressless = 0; bestTargetDist = Infinity; }
      else seekTarget = crumb;
    } else if (!navLineClear(player.x, player.y, target.x, target.y)) {
      if (!navPath || navCooldown <= 0) { navPath = navPlan(player, target); navCooldown = 10; }
      navCooldown -= 1;
      while (navPath && navPath.length && Math.hypot(navPath[0].x - player.x, navPath[0].y - player.y) < 20) navPath.shift();
      if (navPath && navPath.length) seekTarget = navPath[0];
    } else navPath = null;
    engine.update(0.05, { x: seekTarget.x - player.x, y: seekTarget.y - player.y });
    if (engine.state.player.dashCooldown <= 0 && engine.state.enemies.length > 70) {
      if (engine.useDash({ x: seekTarget.x - player.x, y: seekTarget.y - player.y })) dashes += 1;
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
