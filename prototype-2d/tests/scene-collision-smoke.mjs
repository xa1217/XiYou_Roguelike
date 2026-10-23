import assert from 'node:assert/strict';
import { GameEngine } from '../src/engine.js';
import { sceneCircleBlocked, sceneMaskHas } from '../src/scene-collision.js';

// Scene collision must match the painted backgrounds (playtest, 2026-10-23):
// mountains, rivers, lava, ponds and ruins block movement; plazas, paths
// and bridges stay open. Points are world coordinates in the 1800x1800
// world, chosen inside the named painted features.
const W = 1800;
const results = [];
const check = (name, fn) => { try { fn(); results.push({ name, status: 'PASS' }); } catch (error) { results.push({ name, status: 'FAIL', error: String(error && error.message || error) }); } };

const BLOCKED = {
  water: [[900, 90], [200, 450], [900, 1650], [1500, 1450], [90, 900]],
  fire: [[900, 110], [90, 700], [900, 1620], [700, 1330], [1500, 1300], [1710, 800]],
  sand: [[900, 130], [300, 500], [900, 90], [1240, 1480], [1500, 300], [300, 1400]],
  snow: [[900, 130], [300, 500], [1240, 1480], [1560, 300], [200, 1300], [900, 130]],
  forest: [[900, 110], [110, 700], [1350, 1520], [830, 1620], [90, 1500]],
  temple: [[900, 110], [110, 700], [1350, 1520], [830, 1620], [90, 1500]],
};
const OPEN = {
  water: [[900, 900], [700, 700], [1100, 1000], [300, 900], [250, 1520], [900, 500]],
  fire: [[900, 900], [700, 700], [1100, 1000], [500, 900], [1300, 900], [900, 500]],
  sand: [[900, 900], [700, 700], [1100, 1000], [500, 900], [1300, 900], [250, 1600]],
  snow: [[900, 900], [700, 700], [1100, 1000], [500, 900], [1300, 900], [1400, 500]],
  forest: [[900, 900], [700, 700], [1100, 1000], [500, 900], [1300, 900], [300, 1550]],
  temple: [[900, 900], [700, 700], [1100, 1000], [500, 900], [1300, 900], [300, 1550]],
};

for (const key of Object.keys(BLOCKED)) {
  check(`${key}: painted terrain masses block a player-sized circle`, () => {
    assert.equal(sceneMaskHas(key), true);
    for (const [x, y] of BLOCKED[key]) assert.equal(sceneCircleBlocked(key, x, y, 14, W), true, `${key} (${x},${y}) should be blocked`);
  });
  check(`${key}: plaza, paths and spawn stay open`, () => {
    for (const [x, y] of OPEN[key]) assert.equal(sceneCircleBlocked(key, x, y, 14, W), false, `${key} (${x},${y}) should be open`);
  });
}

check('engine: themed stage movement is stopped by scenery but slides along it', () => {
  const stage = { id: 2 };
  const engine = new GameEngine({ characterId: 'wukong', stageId: 3, seed: 7, debug: true });
  // Stage 3 is a water-theme stage: walking north from spawn reaches the
  // far shore well before the world edge.
  const p = engine.state.player;
  Object.assign(p, { x: 900, y: 900 });
  let lastY = p.y;
  for (let i = 0; i < 240; i++) { engine.movePlayer(0, -6); lastY = p.y; }
  assert.ok(lastY > 300, `player should be stopped by the northern river/hills, stopped at y=${lastY}`);
  assert.equal(engine.isWalkable(p.x, p.y, p.radius), true, 'player must rest on walkable ground');
  engine.dispose();
});

check('engine: doublefork keeps its authored ridge rule (no mask regression)', () => {
  const engine = new GameEngine({ characterId: 'wukong', stageId: 1, seed: 7, debug: true });
  assert.equal(engine.isWalkable(300, 900, 14), false, 'ridge blocks off-pass');
  assert.equal(engine.isWalkable(900, 900, 14), true, 'stone pass open');
  assert.equal(engine.isWalkable(300, 300, 14), true, 'north clearing open');
  engine.dispose();
});

check('engine: a dash cannot tunnel through scenery or strand the hero inside it', () => {
  const engine = new GameEngine({ characterId: 'wukong', stageId: 10, seed: 7, debug: true }); // stage 10: fire
  const p = engine.state.player;
  // West of the fire ruin cluster (blocked x 666..1116, y 1188..1476):
  // repeated east dashes must stop at the wall, never land inside it.
  Object.assign(p, { x: 600, y: 1330 });
  for (let i = 0; i < 6; i++) {
    engine.useDash({ x: 1, y: 0 });
    p.dashCooldown = 0;
    assert.equal(engine.isWalkable(p.x, p.y, p.radius), true, `dash ${i} stranded the hero inside scenery at (${p.x},${p.y})`);
    assert.ok(p.x < 666, `dash ${i} tunneled through the ruin wall to x=${p.x}`);
  }
  // Unstick: an entity placed just inside the wall edge escapes to
  // walkable ground on its next move instead of staying trapped.
  Object.assign(p, { x: 690, y: 1330 });
  assert.equal(engine.isWalkable(p.x, p.y, p.radius), false, 'fixture point must start inside the wall');
  engine.movePlayer(-6, 0);
  assert.equal(engine.isWalkable(p.x, p.y, p.radius), true, 'unstick must return the hero to walkable ground');
  engine.dispose();
});

check('engine: spawn points always land on walkable ground in every theme', () => {
  for (const stageId of [2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    const engine = new GameEngine({ characterId: 'wujing', stageId, seed: 42, debug: true });
    for (let i = 0; i < 24; i++) {
      const point = engine.spawnPoint();
      assert.equal(engine.isWalkable(point.x, point.y, 24), true, `stage ${stageId} spawn (${point.x},${point.y}) must be walkable`);
    }
    engine.dispose();
  }
});

const failed = results.filter(r => r.status !== 'PASS');
console.log(JSON.stringify({ passed: results.length - failed.length, total: results.length, results }, null, 1));
if (failed.length) process.exit(1);
