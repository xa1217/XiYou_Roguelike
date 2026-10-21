# 西游·八十一难 implementation contract v1.0.0

更新时间：2026-10-04。本文是当前独立副本的可执行契约。**网页 Canvas 版本是本轮验收主线；微信小游戏工程已生成并保持可编译结构，但真实 AppID、开发者工具和真机验收延期。**旧源码只读保存在 `legacy-source/`。

## 运行入口与模块边界

- `prototype-2d/index.html` → `native-app.js`：浏览器发布入口。它只装配 Canvas、`NativeGame`、浏览器 `AudioManager`、localStorage 与 Pointer/键盘输入。
- `prototype-2d/src/engine.js`：无 DOM、无音频、无 wx 的确定性战斗状态机；`GameEngine` 是规则唯一来源。
- `prototype-2d/src/renderer.js`：Canvas 2D 绘制、摄像机、可视剔除、质量档；不改变游戏状态。
- `prototype-2d/src/native-ui.js`：首页、角色/关卡、图鉴、天赋、每日目标、HUD、升级、暂停和结算；暂停/升级/结算时停止 RAF，继续或重开显式唤醒。
- `prototype-2d/src/content.js`：四角色、八法宝、81 难地点/妖首/主题、平衡常量；非战斗难明确标 `sourceNote` 的原创心魔守关改编。
- `prototype-2d/src/progression.js`：本机存档校验、章节解锁、天赋、每日目标一次领取、战绩。
- `prototype-2d/src/audio.js`：浏览器 Web Audio；微信使用 `wechat-game/audio.js` 的 WxAudio 适配器。
- `wechat-game/`：`compileType=game` 的原生小游戏装配，`core/bundle.js` 由 `npm run build` 生成；可选卡面在 illustrations 分包，WAV 在 assets/audio。

## 核心 API

```js
new GameEngine({
  characterId: 'wukong' | 'tangseng' | 'bajie' | 'wujing',
  stageId: 1..81,
  seed: number,
  talents: object,
  difficulty: 'normal' | 'hard',
  onEvent(event) {}
})
```

`engine.update(dtSeconds, {x, y})` 接收移动输入；生产步长上限 0.05 秒。`chooseUpgrade(id)`、`pause()`、`resume()`、`useDash({x,y})`、`getSnapshot()`、`dispose()` 是公开动作。`engine.state` 是内部权威状态，不能由 UI 改写。

状态至少包含 `status`（`playing | paused | upgrade | won | lost`）、600 秒计时、角色/等级/经验、1 把本命武器加最多 4 件法宝、敌人/投射物/效果/经验掉落、击杀与伤害统计。敌人、投射物、效果和掉落保持硬上限，长局使用对象池；快照才复制数组。

## 玩法不变量

- 每难 600 秒；普通怪随时间递增，精英在 120/240/360/480 秒出现；精英同阶段普通怪 5 倍生命。
- 中期首领在 300 秒，最终首领在 570 秒；600 秒到达时最终首领尚未死亡仍继续战斗，击败它才进入 `won`。
- 击杀只产生掉落经验；经验升级进入冻结状态并提供三选一。候选尽量包含本命武器和两件未满法宝；最多 5 槽。全满后候选为已装备技能的合法升级，待处理升级不会丢失。
- 悟空第三击重击与第五级 30% 眩晕；唐僧停留/光点/弹射/击退；八戒三段流血、3/6/9 火鸟与末级爆炸；沙僧每五击三漩涡并按等级提供吸附/减速。具体数值由 `content.js` 返回，不在 UI 重写。
- 升级、暂停、死亡、结算不推进战斗时钟；后台隐藏冻结输入并持久化，重复前台不会产生第二 RAF 循环。

## 质量与平台约束

Canvas 2D 只使用可用基础 API；渲染器不使用每帧随机数，不使用 emoji 作为精灵。浏览器采用可视剔除、排序数组复用和对象池；微信内存告警切换低画质。安全区、DPR、触摸 identifier、wx onHide/onShow/onMemoryWarning 与监听解除由 `wechat-game/game.js` 统一处理。

公网/发布网页副本的 `native-app.js` 必须将 `debug:false` 固定；调试 seam 仅允许本机开发构建使用。微信发布包不包含网页调试代码、测试、生成脚本、legacy、证据或个人配置。

## 验证、原型与发布

- `npm test` 串行运行当前机制、四角色 600 秒生产步长、渲染和平台桩；`evidence/current/validation.json` 保存结果。
- `npm run serve` 仅服务 `prototype-2d/`；`npm run build` 生成两份微信共享核心 bundle。
- `docs/prototypes/THROWAWAY-rules.html` 是按 `$prototype` 生成的单文件逻辑原型。它用真实 `GameEngine` 演示 600 秒/精英/双首领、升级冻结和五槽。结论已吸收到正式引擎：最终首领未死不能在 600 秒自动胜利；升级冻结且满槽只给已有技能合法升级。原型无持久化、无生产依赖，不进入发布包。
- `npm run release` 先构建共享 bundle，再生成 `dist/xiyou-survivor-web-v<version>.zip` 与 `dist/xiyou-survivor-wechat-game-v<version>.zip`；清单列出实际文件并明确排除范围。公网通道必须从发布副本或受控静态根启动，不能将 `legacy-source/`、tests 或 debug 构建暴露。

## 来源与商用边界

源归档代表性文件已使用 UnRAR 原始字节与 SHA256 核验，证据在 `evidence/current/copy-provenance.json`。美术为本轮原创程序化/生成素材，音频为程序化生成 WAV；不包含现代第三方素材。真实微信 AppID、登录、云存档、广告、分享统计、支付、审核和真机性能数据仍未接入，不能在报告中表述为已验收商用服务。
