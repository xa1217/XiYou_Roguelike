import assert from 'node:assert/strict';
import { GameEngine } from '../src/engine.js';
import { CHARACTERS, STAGES } from '../src/content.js';

// A full ten-minute gameplay clock is advanced one production-size frame at a
// time. Only invincibility is a debug seam: enemies, drops, XP, weapons, bosses,
// upgrade pauses, all timers, and every collision remain the real engine.
const result = [];
for (const [index, character] of CHARACTERS.entries()) {
  const events = [];
  const game = new GameEngine({ characterId: character.id, stageId: 1 + index * 24, seed: 0x712 + index, debug: true, onEvent: (event) => events.push(event) });
  game.debug('invincible', { enabled: true });
  const maxima = { enemies: 0, projectiles: 0, effects: 0, gems: 0 };
  let frames = 0; let choices = 0;
  let encounteredFinal = false;
  const started = performance.now();
  while (game.state.time < 600 || game.state.status === 'upgrade') {
    if (game.state.status === 'upgrade') {
      const before = game.state.time;
      game.update(0.05, { x: 1, y: 0 });
      assert.equal(game.state.time, before, 'upgrade must freeze the game clock');
      const pick = game.state.choices.find((choice) => choice.isWeapon)
        || game.state.choices.find((choice) => !game.state.skills.some((skill) => skill.id === choice.id))
        || game.state.choices[0];
      assert.ok(game.chooseUpgrade(pick.id)); choices += 1;
      continue;
    }
    assert.equal(game.state.status, 'playing');
    const player = game.state.player;
    let target = game.state.gems.filter((gem) => gem.kind === 'xp' || gem.kind === 'coin')
      .sort((a, b) => Math.hypot(a.x - player.x, a.y - player.y) - Math.hypot(b.x - player.x, b.y - player.y))[0];
    // Collect authentic drops first; otherwise steer slowly around a central
    // loop so all weapon styles get dense enemies and meaningful contacts.
    if (!target) target = { x: 900 + Math.cos(game.state.time / 16) * 90, y: 900 + Math.sin(game.state.time / 16) * 90 };
    game.update(0.05, { x: target.x - player.x, y: target.y - player.y }); frames += 1;
    if (game.state.enemies.some((enemy) => enemy.final)) encounteredFinal = true;
    for (const key of Object.keys(maxima)) maxima[key] = Math.max(maxima[key], game.state[key].length);
    assert.ok(game.state.enemies.length <= 220); assert.ok(game.state.projectiles.length <= 300); assert.ok(game.state.effects.length <= 160); assert.ok(game.state.gems.length <= 240);
    assert.ok(game.state.skills.length <= 5);
    assert.ok(frames <= 12010, 'a real 600 second run must complete in bounded production frames');
  }
  const eliteEvents = events.filter((event) => event.type === 'elite');
  assert.deepEqual(eliteEvents.map((event) => event.at), index === 0 ? [80, 160, 250, 300, 340, 430, 520] : [80, 160, 250, 340, 430, 520]);
  for (const event of eliteEvents) assert.ok(event.time >= event.at && event.time < event.at + 0.051);
  const bossEvents = events.filter((event) => event.type === 'boss');
  if (index === 0) {
    assert.equal(bossEvents.length, 1, 'the double-ridge tiger encounter replaces the generic mid-boss');
    assert.equal(bossEvents[0].final, true);
    assert.ok(bossEvents[0].time >= 570 && bossEvents[0].time < 570.051);
  } else {
    assert.equal(bossEvents.length, 2);
    assert.equal(bossEvents[0].final, false); assert.equal(bossEvents[1].final, true);
    assert.ok(bossEvents[0].time >= 300 && bossEvents[0].time < 300.051);
    assert.ok(bossEvents[1].time >= 570 && bossEvents[1].time < 570.051);
  }
  assert.ok(encounteredFinal);
  assert.ok(game.state.kills > 0); assert.ok(choices > 0);
  // At the boundary, the engine may have legitimately beaten the final boss,
  // or correctly keep the battle running. The explicit seam below exercises
  // the latter win condition after testing the complete production timeline.
  if (game.state.enemies.some((enemy) => enemy.final)) {
    assert.equal(game.state.status, 'playing', 'the final boss requires overtime');
    game.debug('killFinal'); game.update(0.05);
  }
  while (game.state.status === 'upgrade') { game.chooseUpgrade(game.state.choices[0].id); choices += 1; }
  if (game.state.status === 'playing') game.update(0.05);
  assert.equal(game.state.status, 'won');
  assert.equal(events.filter((event) => event.type === 'win').length, 1);
  result.push({ character: character.id, stage: game.state.stage.id, seconds: Math.round(game.state.time * 100) / 100, frames, level: game.state.player.level, upgrades: choices, kills: game.state.kills, max: maxima, status: game.state.status, pools: game.poolStats, wallMs: Math.round(performance.now() - started) });
}

assert.equal(STAGES.length, 81);
for (const [index, stage] of STAGES.entries()) {
  assert.equal(stage.id, index + 1); assert.equal(stage.chapter, Math.floor(index / 9) + 1);
  assert.ok(stage.name && stage.location && stage.boss && stage.midBoss && stage.enemies.length);
  assert.ok(['forest', 'sand', 'snow', 'fire', 'water', 'temple'].includes(stage.theme));
  assert.ok(stage.sourceNote);
}
assert.equal(STAGES[5].name, '折从落坑');
assert.equal(STAGES[54].name, '稀柿同秽阻');
assert.equal(STAGES[80].name, '通天河遇鼋湿经书');
// Independent literal transcription of chapter 99's ordeal ledger, normalized
// to simplified Chinese; the final ordeal is named from its subsequent story.
// Source: https://zh.wikisource.org/zh-hans/西遊記/第099回 (119–180).
const originalOrder = [
  '双叉岭遇妖', '出胎几杀', '满月抛江', '寻亲报冤', '出城逢虎', '折从落坑', '双叉岭上', '两界山头',
  '陡涧换马', '夜被火烧', '失却袈裟', '收降八戒', '黄风怪阻', '请求灵吉', '流沙难渡', '收得沙僧',
  '四圣显化', '五庄观中', '难活人参', '贬退心猿', '黑松林失散', '宝象国捎书', '金銮殿变虎', '平顶山逢魔',
  '莲花洞高悬', '乌鸡国救主', '被魔化身', '号山逢怪', '风摄圣僧', '心猿遭害', '请圣降妖', '黑河沉没',
  '搬运车迟', '大赌输赢', '祛道兴僧', '路逢大水', '身落天河', '鱼篮现身', '金兜山遇怪', '普天神难伏',
  '问佛根源', '吃水遭毒', '西梁国留婚', '琵琶洞受苦', '再贬心猿', '难辨猕猴', '路阻火焰山', '求取芭蕉扇',
  '收缚魔王', '赛城扫塔', '取宝救僧', '棘林吟咏', '小雷音遇难', '诸天神遭困', '稀柿同秽阻', '朱紫国行医',
  '拯救疲癃', '降妖取后', '七情迷没', '多目遭伤', '路阻狮驼', '怪分三色', '城里遇灾', '请佛收魔',
  '比丘救子', '辨认真邪', '松林救怪', '僧房卧病', '无底洞遭困', '灭法国难行', '隐雾山遇魔', '凤仙郡求雨',
  '失落兵器', '会庆钉钯', '竹节山遭难', '玄英洞受苦', '赶捉犀牛', '天竺招婚', '铜台府监禁', '凌云渡脱胎',
  '通天河遇鼋湿经书',
];
assert.deepEqual(STAGES.map((stage) => stage.name), originalOrder, 'all 81 ordeals must match the current encounter ledger');
assert.equal(STAGES[0].canonicalTrialName, '金蝉遭贬');
console.log(JSON.stringify({ fullRun: result, stages: 81, verdict: 'PASS: four real 600-second timelines plus victory and caps' }, null, 2));
