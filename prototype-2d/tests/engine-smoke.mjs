import assert from 'node:assert/strict';
import { GameEngine } from '../src/engine.js';
import { CHARACTERS, ARTIFACTS, STAGES, BALANCE, getWeaponStats } from '../src/content.js';

const tests = [];
const test = (name, run) => tests.push({ name, run });
const close = (actual, expected, message = '') => assert.ok(Math.abs(actual - expected) < 1e-7, `${message} expected ${expected}, got ${actual}`);
// Generic combat fixtures use a non-authored chapter so terrain collision in
// the double-ridge first stage is exercised only by its dedicated test below.
const make = (characterId = 'wukong') => new GameEngine({ characterId, stageId: 2, seed: 712, debug: true });
const foe = (engine, x = 980, y = 900, kind = 'normal') => {
  const enemy = engine.debug('spawn', { kind });
  Object.assign(enemy, { x, y, hp: 100000, maxHp: 100000, speed: 0, radius: 10 });
  return enemy;
};

test('content count and original order checkpoints', () => {
  assert.equal(STAGES.length, 81);
  assert.equal(STAGES[8].name, '陡涧换马');
  assert.equal(STAGES[31].name, '黑河沉没');
  assert.equal(STAGES[79].name, '凌云渡脱胎');
  assert.equal(STAGES[80].name, '通天河遇鼋湿经书');
  assert.equal(CHARACTERS.length, 4);
  assert.equal(ARTIFACTS.length, 8);
});

test('first stage uses the double ridge forest and eight animal families', () => {
  const stage = STAGES[0];
  assert.equal(stage.name, '双叉岭遇妖');
  assert.equal(stage.canonicalTrialName, '金蝉遭贬');
  assert.equal(stage.location, '河州卫外·双叉岭');
  assert.equal(stage.theme, 'forest');
  assert.deepEqual(stage.enemies, ['虎妖', '熊妖', '野牛妖', '苍狼妖', '猿妖', '鹿妖', '鹰妖', '蛇妖']);
  assert.deepEqual(stage.enemyRoster.map((enemy) => enemy.variant), ['tiger', 'bear', 'bull', 'wolf', 'monkey', 'deer', 'hawk', 'snake']);
  assert.deepEqual(stage.finalBosses.map((boss) => [boss.name, boss.variant]), [['寅将军', 'tiger'], ['熊山君', 'bear'], ['特处士', 'bull']]);
  assert.deepEqual(stage.finalBosses[2].aliases, ['待处士']);
  assert.deepEqual(stage.finalBosses.map((boss) => [boss.bossId, boss.actionId]), [['yin-general', 'yin-general'], ['xiong-shanjun', 'xiong-shanjun'], ['te-chushi', 'te-chushi']]);
  const engine = new GameEngine({ stageId: 1, seed: 91, debug: true });
  const families = new Set();
  for (let i = 0; i < 160; i += 1) families.add(engine.debug('spawn').variant);
  assert.deepEqual([...families].sort(), ['bear', 'bull', 'deer', 'hawk', 'monkey', 'snake', 'tiger', 'wolf']);
});

test('double ridge keeps both clearings open and funnels movement through the stone pass', () => {
  const engine = new GameEngine({ stageId: 1, seed: 92 });
  const player = engine.state.player;
  assert.equal(engine.state.battlefield.mapAssetKey, 'doublefork');
  const startY = player.y;
  engine.update(1, { x: 0, y: -1 });
  assert.ok(player.y < startY, 'the hero can climb from the central pass into the upper clearing');
  const upperY = player.y;
  engine.update(1, { x: -1, y: 0 });
  const upperX = player.x;
  engine.update(2, { x: 0, y: 1 });
  assert.ok(player.y > upperY, 'the same pass remains traversable in both directions');
  assert.equal(player.x, upperX, 'straight traversal keeps the central path aligned');
  player.x = 740; player.y = 690;
  const before = { x: player.x, y: player.y };
  engine.update(1, { x: 0, y: 1 });
  assert.deepEqual({ x: player.x, y: player.y }, before, 'mountain ridge blocks a side route outside the path');
});

test('double ridge tiger elite and three guardians obey the full victory boundary', () => {
  const events = []; const engine = new GameEngine({ stageId: 1, seed: 19, debug: true, onEvent: (event) => events.push(event) });
  engine.debug('time', { value: 299.95 }); engine.update(.05);
  const tiger = engine.state.enemies.find((enemy) => enemy.kind === 'elite' && enemy.name === '双叉岭虎先锋');
  assert.ok(tiger, 'the 300 second tiger encounter must be an elite');
  assert.equal(tiger.variant, 'tiger');
  assert.equal(engine.state.enemies.filter((enemy) => enemy.kind === 'boss' && !enemy.final).length, 0, 'the authored tiger encounter replaces the generic mid-boss');
  assert.equal(events.filter((event) => event.type === 'elite' && event.at === 300)[0].replacesMidBoss, true);
  engine.debug('time', { value: 569.95 }); engine.update(.05);
  const guardians = engine.state.enemies.filter((enemy) => enemy.final);
  assert.deepEqual(guardians.map((enemy) => [enemy.name, enemy.variant]), [['寅将军', 'tiger'], ['熊山君', 'bear'], ['特处士', 'bull']]);
  assert.deepEqual(guardians[2].aliases, ['待处士']);
  assert.deepEqual(guardians.map((enemy) => enemy.bossIdentity), [
    { bossId: 'yin-general', variant: 'tiger', actionId: 'yin-general' },
    { bossId: 'xiong-shanjun', variant: 'bear', actionId: 'xiong-shanjun' },
    { bossId: 'te-chushi', variant: 'bull', actionId: 'te-chushi' },
  ]);
  const midEngine = new GameEngine({ stageId: 1, seed: 92, debug: true });
  const genericMid = midEngine.spawnBoss(false, { name: '虎小首领', variant: 'tiger', bossId: 'should-not-bind', actionId: 'should-not-bind' });
  assert.equal(genericMid.bossIdentity, null, 'mid-bosses cannot inherit final guardian identity');
  const laterStage = new GameEngine({ stageId: 2, seed: 93, debug: true });
  const laterBoss = laterStage.spawnBoss(true, { name: '后续首领', variant: 'tiger', bossId: 'cross-stage', actionId: 'cross-stage' });
  assert.equal(laterBoss.bossIdentity, null, 'generic later-stage bosses remain unbound');
  assert.deepEqual(events.filter((event) => event.type === 'boss' && event.final)[0].names, ['寅将军', '熊山君', '特处士']);
  engine.debug('time', { value: 600 });
  engine.debug('damage', { id: guardians[0].id, amount: guardians[0].hp });
  engine.debug('damage', { id: guardians[1].id, amount: guardians[1].hp });
  engine.update(.01); assert.equal(engine.state.status, 'playing', 'the last living guardian prevents victory after 600 seconds');
  engine.debug('damage', { id: guardians[2].id, amount: guardians[2].hp });
  engine.update(.01); assert.equal(engine.state.status, 'won');
  assert.equal(events.filter((event) => event.type === 'kill' && event.final).length, 3);

  const early = new GameEngine({ stageId: 1, seed: 20, debug: true });
  early.debug('time', { value: 570 }); early.update(.01); early.debug('killFinal'); early.update(.01);
  assert.equal(early.state.status, 'playing', 'all three kills before 600 seconds still cannot finish the stage');
});

test('animation follows attacks, hit interruption, dash, intro and bounded death effects', () => {
  const engine = make(); const player = engine.state.player; const enemy = foe(engine);
  assert.equal(player.animationState, 'idle');
  engine.fireWeapon(engine.state.skills[0]); engine.update(.01);
  assert.equal(player.animationState, 'attack');
  assert.equal(player.animationFrames, 8);
  engine.damagePlayer(4); assert.equal(player.animationState, 'hit');
  assert.equal(player.frameIndex, 0, 'interruption starts the new pose at its first frame');
  assert.equal(engine.useDash({ x: 1 }), true); assert.equal(player.animationState, 'dash');
  assert.equal(player.animationFrames, 8);
  engine.pause(); const paused = engine.getSnapshot(); engine.update(.05);
  assert.deepEqual(engine.getSnapshot(), paused, 'pause freezes animation clocks too'); engine.resume();
  for (let i = 0; i < 10; i += 1) engine.update(.05, { x: 1 });
  assert.equal(player.animationState, 'move', 'the dash naturally yields to movement');
  engine.damageEnemy(enemy, 1); assert.equal(enemy.animationState, 'hit');
  const boss = engine.spawnBoss(true); const spawnX = boss.x; const spawnY = boss.y;
  assert.equal(boss.animationState, 'intro');
  engine.update(.05); assert.equal(boss.x, spawnX); assert.equal(boss.y, spawnY);
  assert.ok(boss.spawnProgress > 0 && boss.spawnProgress < 1);
  engine.damageEnemy(enemy, enemy.hp);
  const death = engine.state.effects.find((effect) => effect.kind === 'death');
  assert.ok(death); assert.equal(death.animationState, 'death'); assert.equal(death.animationFrames, 8);
  assert.equal(death.variant, enemy.variant);
  const guardianEngine = new GameEngine({ stageId: 1, seed: 93, debug: true });
  const guardianForDeath = guardianEngine.spawnBoss(true, STAGES[0].finalBosses[0]);
  guardianEngine.damageEnemy(guardianForDeath, guardianForDeath.hp);
  const guardianDeath = guardianEngine.state.effects.find((effect) => effect.kind === 'death' && effect.bossIdentity);
  assert.deepEqual(guardianDeath?.bossIdentity, { bossId: 'yin-general', variant: 'tiger', actionId: 'yin-general' });
  for (let i = 0; i < 25; i += 1) engine.updateEffects(.05);
  assert.equal(engine.state.effects.some((effect) => effect.kind === 'death'), false, 'death effects expire into the bounded effect pool');
  for (let i = 0; i < 400; i += 1) { const target = engine.debug('spawn'); engine.debug('damage', { id: target.id, amount: target.hp }); }
  assert.ok(engine.state.effects.length <= BALANCE.maxEffects);
  assert.ok(engine.poolStats.released.effect > 0);
});

test('dt cap, pause, dash boundaries and deterministic seed', () => {
  const a = make(); const b = make();
  a.update(9, { x: 1, y: 0 }); b.update(0.05, { x: 1, y: 0 });
  close(a.state.time, 0.05); close(a.state.player.x, b.state.player.x);
  a.pause(); a.update(1); close(a.state.time, 0.05); a.resume();
  assert.equal(a.useDash({ x: 1, y: 0 }), true);
  assert.equal(a.useDash({ x: 1, y: 0 }), false);
  a.state.player.x = 1795; a.state.player.dashCooldown = 0; a.useDash({ x: 1, y: 0 });
  assert.equal(a.state.player.x, 1782);
  const c = make(); const d = make();
  for (let i = 0; i < 60; i += 1) { c.update(0.05); d.update(0.05); }
  assert.deepEqual(c.getSnapshot(), d.getSnapshot());
});

test('one weapon, four artifacts, three legal choices, pending levels', () => {
  const e = make(); e.collectGem({ kind: 'xp', value: 1000 });
  assert.equal(e.state.status, 'upgrade'); assert.ok(e.pendingUpgrades > 1);
  const pending = e.pendingUpgrades;
  let count = 0;
  while (e.state.status === 'upgrade') {
    assert.equal(e.state.choices.length, 3);
    assert.equal(e.chooseUpgrade('not-an-option'), false);
    assert.equal(e.chooseUpgrade(e.state.choices[0].id), true);
    count += 1; assert.ok(count < 50);
  }
  assert.equal(count, pending);
  e.state.skills = [{ id: 'weapon:wukong', level: 5, isWeapon: true }, ...ARTIFACTS.slice(0, 4).map((a) => ({ id: a.id, level: 4, isWeapon: false }))];
  const ids = new Set(e.state.skills.map((s) => s.id));
  for (let i = 0; i < 30; i += 1) assert.ok(e.makeChoices().every((c) => ids.has(c.id) || c.boon));
  e.state.skills.forEach((s) => { s.level = 5; });
  assert.ok(e.makeChoices().every((c) => c.boon));
});

test('fixed weapon timing, precise three-tick rake bleeding', () => {
  for (let level = 1; level <= 5; level += 1) {
    close(getWeaponStats('tangseng', level).cooldown, 1.5);
    close(getWeaponStats('bajie', level).cooldown, 1);
    const expected = [[0.015, 0.015, 0.02], [0.03, 0.03, 0.04], [0.045, 0.045, 0.06], [0.06, 0.06, 0.08], [0.075, 0.075, 0.1]][level - 1];
    const e = make('bajie'); const enemy = foe(e);
    e.hitLine(0, 250, 30, 100, expected);
    const afterHit = enemy.hp;
    for (let tick = 0; tick < 3; tick += 1) {
      for (let i = 0; i < 20; i += 1) e.updateEnemies(0.05);
      close(afterHit - enemy.hp, expected.slice(0, tick + 1).reduce((a, v) => a + v * 100, 0), `bleed L${level} tick${tick + 1}`);
    }
  }
});

test('wukong exact every third heavy strike and 30 percent stun boundary', () => {
  const e = make(); const enemy = foe(e);
  e.state.skills[0].level = 5; e.rng = () => 0.299;
  e.fireWeapon(e.state.skills[0]); assert.equal(enemy.stun, 0);
  e.fireWeapon(e.state.skills[0]); assert.equal(enemy.stun, 0);
  const before = enemy.hp; e.fireWeapon(e.state.skills[0]);
  close(before - enemy.hp, 28 * 1.3 * 3); assert.ok(enemy.stun > 0);
  enemy.stun = 0; e.rng = () => 0.3; e.weaponShots = 2; e.fireWeapon(e.state.skills[0]);
  assert.equal(enemy.stun, 0);
});

test('swept projectile collision without tunnelling or skipped victims', () => {
  const e = make('tangseng'); const a = foe(e, 950, 900); const b = foe(e, 1000, 900);
  e.projectile({ x: 900, y: 900, vx: 3000, vy: 0, radius: 4, ttl: 1, kind: 'light-orb', damage: 30, pierce: true });
  e.updateProjectiles(0.05); close(a.hp, 99970); close(b.hp, 99970);
});

test('holy orb exact linger, fifteen sparks and five bounces at level five', () => {
  const e = make('tangseng'); const a = foe(e, 960, 900); const b = foe(e, 1000, 900);
  e.state.skills[0].level = 5; e.fireWeapon(e.state.skills[0]);
  for (let i = 0; i < 5; i += 1) e.updateProjectiles(0.05);
  const orb = e.state.projectiles.find((p) => p.kind === 'light-orb');
  assert.ok(orb?.anchored); close(orb.vx, 0); close(orb.vy, 0);
  const sparks = e.state.projectiles.filter((p) => p.kind === 'light-spark');
  assert.equal(sparks.length, 15); assert.equal(sparks[0].maxBounces, 5); assert.equal(sparks[0].targetLimit, 5);
  assert.ok(a.knockback > 0 || b.knockback > 0);
});

test('light spark visits two targets with exactly five bounce transitions', () => {
  const e = make('tangseng'); const a = foe(e, 960, 900); const b = foe(e, 1000, 900);
  e.projectile({ x: 960, y: 900, vx: 0, vy: 0, radius: 4, ttl: 5, kind: 'light-spark', damage: 100, targetId: a.id, targetIds: [a.id, b.id], speed: 420, maxBounces: 5, bounceCount: 0 });
  const shot = e.state.projectiles[0];
  for (let i = 0; i < 80 && e.state.projectiles.length; i += 1) e.updateProjectiles(0.05);
  assert.equal(e.state.projectiles.length, 0); assert.equal(shot.bounceCount, 6);
  close(100000 - a.hp, 300); close(100000 - b.hp, 300);
});

test('eight specified artifact rules replace legacy effects at every level', () => {
  const monkeyCount=[3,6,9,12,15], interceptCount=[1,1,2,2,3], beadCount=[1,3,5,6,9], wheelCount=[1,1,2,2,2], ringBounces=[3,5,7,9,11];
  for(let level=1;level<=5;level++) {
    const stats={damage:1,power:1,radius:90,duration:2,cooldown:12};
    const monkeys=make(); monkeys.state.player.hp=10; monkeys.fireArtifact({id:'lotus-lantern',level},stats);
    assert.equal(monkeys.state.effects.length,monkeyCount[level-1]); assert.ok(monkeys.state.effects.every(fx=>fx.kind==='monkey-clone'&&fx.intercepts===interceptCount[level-1])); close(monkeys.state.player.hp,10);
    const palms=make();palms.fireArtifact({id:'moon-mirror',level},stats);assert.equal(palms.state.effects.length,level);assert.ok(palms.state.effects.every(fx=>fx.kind==='palm-strike'&&fx.symbol==='卍'));
    if(level===1)close(palms.state.effects[0].radius,36);
    const beads=make();beads.fireArtifact({id:'golden-rope',level},stats);assert.equal(beads.state.effects.length,beadCount[level-1]);assert.ok(beads.state.effects.every(fx=>fx.kind===(level===5?'skull-bead':'bead')));
    const wheels=make();wheels.fireArtifact({id:'nine-dragon',level},stats);assert.equal(wheels.state.projectiles.length,wheelCount[level-1]);wheels.updateProjectiles(.05);assert.ok(wheels.state.effects.every(fx=>fx.kind==='fire-trail'&&fx.maxTtl===level));
    if(level>=3)assert.ok(wheels.state.projectiles[0].radius>13);
    const ring=make();const victim=foe(ring,960,900);ring.fireArtifact({id:'diamond-snare',level},stats);const parent=ring.state.projectiles[0];assert.equal(parent.maxBounces,ringBounces[level-1]);assert.equal(parent.aoeTargets,level);
    const before=ring.state.projectiles.length;ring.bounceRing(parent,victim);assert.ok(parent.vx<0,'first collision reflects backwards');
    const children=ring.state.projectiles.filter(p=>p.child);assert.equal(children.length,level>=5?2:level>=3?1:0);
    if(children.length){assert.equal(children[0].maxBounces,level===5?5:level===4?4:3);const n=ring.state.projectiles.length;ring.bounceRing(children[0],victim);assert.equal(ring.state.projectiles.length,n,'children must never split recursively');}
    const mountains=make();const mountainVictim=foe(mountains,980,900);mountains.fireArtifact({id:'samadhi-fire',level},stats);assert.equal(mountains.state.effects[0].kind,'mountain');if(level===1)close(mountains.state.effects[0].radius,90);
    const hp=mountainVictim.hp;mountains.updateEffects(.05);close(mountainVictim.hp,hp);for(let i=0;i<10;i++)mountains.updateEffects(.05);assert.ok(mountainVictim.hp<hp,'mountain deals a delayed landing hit');
  }
  const gourd=make();const normal=foe(gourd,1080,900);const elite=foe(gourd,1080,900,'elite');const boss=foe(gourd,1080,900);boss.kind='boss';
  gourd.fireArtifact({id:'purple-gourd',level:5},{damage:1,power:1});gourd.updateEffects(.05);assert.equal(gourd.state.kills,0,'far ordinary enemies must be drawn to the mouth before dying');
  for(let i=0;i<50;i++)gourd.updateEffects(.05);assert.equal(gourd.state.kills,1);assert.ok(elite.hp>0&&elite.hp<100000);assert.ok(boss.hp>0&&boss.hp<100000);
  const fan=make();const normalFan=foe(fan,980,900);const eliteFan=foe(fan,980,900,'elite');const bossFan=foe(fan,980,900);bossFan.kind='boss';fan.fireArtifact({id:'iron-fan',level:5},{damage:1,power:1});assert.equal(fan.state.effects.length,2);assert.ok(normalFan.x>eliteFan.x&&eliteFan.x>bossFan.x);
});
test('bajie hoe-line effect carries the exact damage range as its length', () => {
  const engine = new GameEngine({ characterId: 'bajie', stageId: 2, seed: 5, debug: true });
  foe(engine, 1000, 900);
  const weapon = engine.state.skills.find((skill) => skill.isWeapon);
  engine.fireWeapon(weapon);
  const fx = engine.state.effects.find((effect) => effect.kind === 'hoe-line');
  assert.ok(fx, 'hoe-line effect exists');
  const stats = getWeaponStats('bajie', weapon.level);
  assert.equal(fx.radius, stats.range);
  assert.equal(fx.length, stats.range, 'visual length must equal the damage range');
  engine.dispose();
});

test('ring ricochets inside the view rect when the platform supplies one', () => {
  const engine = make();
  engine.setViewRect({ x: 400, y: 400, w: 800, h: 600 });
  engine.fireArtifact({ id: 'diamond-snare', level: 1 }, { damage: 1, power: 1, radius: 90, duration: 2, cooldown: 12 });
  const ring = engine.state.projectiles[0];
  assert.ok(ring, 'ring fired');
  ring.targetId = null; ring.x = 900; ring.y = 700; ring.vx = 410; ring.vy = 0;
  let flips = 0, lastSign = Math.sign(ring.vx);
  for (let i = 0; i < 240; i += 1) {
    engine.updateProjectiles(1 / 60);
    if (!engine.state.projectiles.includes(ring)) break;
    assert.ok(ring.x >= 400 + ring.radius - 1e-6 && ring.x <= 1200 - ring.radius + 1e-6, `ring x ${ring.x} must stay in view`);
    assert.ok(ring.y >= 400 + ring.radius - 1e-6 && ring.y <= 1000 - ring.radius + 1e-6, `ring y ${ring.y} must stay in view`);
    if (Math.sign(ring.vx) !== lastSign) { flips += 1; lastSign = Math.sign(ring.vx); }
  }
  assert.ok(flips >= 1, 'ring must bounce off the screen edge at least once');
  assert.ok(ring.bounceCount >= 1, 'screen bounce counts as a bounce');
  engine.dispose();
});

test('ring without a view rect keeps its cast-time box', () => {
  const engine = make();
  engine.fireArtifact({ id: 'diamond-snare', level: 1 }, { damage: 1, power: 1, radius: 90, duration: 2, cooldown: 12 });
  const ring = engine.state.projectiles[0];
  ring.targetId = null;
  for (let i = 0; i < 240; i += 1) {
    engine.updateProjectiles(1 / 60);
    if (!engine.state.projectiles.includes(ring)) break;
    assert.ok(ring.x >= ring.bounds.x - 1e-6 && ring.x <= ring.bounds.x + ring.bounds.w + 1e-6, 'ring stays in cast box');
    assert.ok(ring.y >= ring.bounds.y - 1e-6 && ring.y <= ring.bounds.y + ring.bounds.h + 1e-6, 'ring stays in cast box');
  }
  engine.dispose();
});

test('targetless light sparks ricochet at the screen edges instead of leaving', () => {
  const engine = make();
  engine.setViewRect({ x: 400, y: 400, w: 800, h: 600 });
  engine.projectile({ x: 1150, y: 700, vx: 420, vy: 0, radius: 4, color: '#d8f8ff', kind: 'light-spark', ttl: 3, damage: 10, targetId: null, targetIds: [], speed: 420, maxBounces: 2, bounceCount: 0, targetLimit: 2 });
  const spark = engine.state.projectiles[0];
  for (let i = 0; i < 60; i += 1) engine.updateProjectiles(1 / 60);
  assert.ok(engine.state.projectiles.includes(spark), 'spark survives inside the view');
  assert.ok(spark.x <= 1200 - spark.radius + 1e-6 && spark.vx < 0, `spark reflected at right edge, x=${spark.x} vx=${spark.vx}`);
  engine.dispose();
});

test('wujing every fifth whirl, exact duration, graded pull and slow', () => {
  for (const [level, duration, radius] of [[3, 1.5, 18], [4, 2, 36], [5, 3, 36]]) {
    const e = make('wujing'); e.state.skills[0].level = level;
    for (let i = 0; i < 4; i += 1) e.fireWeapon(e.state.skills[0]);
    assert.equal(e.state.effects.filter((fx) => fx.kind === 'whirl').length, 0);
    e.fireWeapon(e.state.skills[0]);
    const whirls = e.state.effects.filter((fx) => fx.kind === 'whirl');
    assert.equal(whirls.length, 3); close(whirls[0].maxTtl, duration); close(whirls[0].radius, radius);
    if (level === 5) {
      const normal = foe(e, whirls[0].x + 12, whirls[0].y, 'normal');
      const elite = foe(e, whirls[0].x + 12, whirls[0].y, 'elite');
      const boss = { ...foe(e, whirls[0].x + 12, whirls[0].y), kind: 'boss' }; e.state.enemies.push(boss);
      const previous = normal.x; e.updateEffects(0.05); e.updateEnemies(0.05);
      assert.ok(normal.slow < elite.slow && elite.slow < boss.slow); assert.ok(normal.x < previous);
    }
  }
});

test('elite x5, schedules, overtime until final boss defeated', () => {
  const events = []; const e = new GameEngine({ stageId: 2, debug: true, seed: 4, onEvent: (event) => events.push(event) });
  const normal = e.debug('spawn'); const elite = e.debug('spawn', { kind: 'elite' });
  close(elite.maxHp, normal.maxHp * 5 * 1.035); // batch A (2026-10-28): elites also carry the per-stage factor (stage 2 = x1.035)
  e.debug('time', { value: 570 }); e.update(0.01);
  assert.deepEqual(events.filter((v) => v.type === 'elite').map((v) => v.at), [80, 160, 250, 340, 430, 520]);
  assert.equal(e.state.enemies.filter((v) => v.kind === 'boss').length, 2);
  e.debug('time', { value: 600 }); e.update(0.01); assert.equal(e.state.status, 'playing');
  e.debug('killFinal'); e.update(0.01); assert.equal(e.state.status, 'won');
});

test('hard caps, xp from drops, disposed state and detached snapshots', () => {
  const e = make();
  for (let i = 0; i < 300; i += 1) { e.debug('spawn'); e.projectile({ x: 0, y: 0, vx: 0, vy: 0, ttl: 3 }); e.effect({ x: 0, y: 0, ttl: 4 }); e.dropGem(0, 0, 1, 'xp'); }
  assert.equal(e.state.enemies.length, BALANCE.maxEnemies); assert.ok(e.state.projectiles.length <= 300); assert.ok(e.state.effects.length <= 160); assert.ok(e.state.gems.length <= 240);
  close(e.state.player.xp, 0); const snapshot = e.getSnapshot(); snapshot.player.hp = 1; assert.notEqual(e.state.player.hp, 1);
  e.dispose(); const time = e.state.time; e.update(0.05); close(e.state.time, time); assert.equal(e.useDash({ x: 1 }), false);
});

test('real lethal damage loses and freezes the clock, contact rate is frame independent', () => {
  const game = make(); const enemy = foe(game, 900, 900); enemy.damage = 10000;
  game.update(.05); assert.equal(game.state.status,'lost'); const time=game.state.time;
  game.update(.05,{x:1,y:0}); close(game.state.time,time);
  const fast=make(),slow=make();const a=foe(fast,900,900),b=foe(slow,900,900);a.damage=b.damage=20;
  fast.update(.01);slow.update(.05);close(fast.state.player.hp,slow.state.player.hp);
});

let failures = 0;
for (const entry of tests) {
  try { entry.run(); console.log(`PASS ${entry.name}`); }
  catch (error) { failures += 1; console.error(`FAIL ${entry.name}\n${error.stack}`); }
}
if (failures) process.exitCode = 1;
else console.log(`Passed ${tests.length} meaningful engine regressions.`);

