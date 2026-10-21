# 四英雄高帧与裁切基线审计

时间：2026-10-11 08:02:47Z→08:02:54Z（北京时间16:02）；分支 `work/codex/xiyou-commercial`。

结论：`OBSERVED_BASELINE_DEFECT`。本步没有修复游戏、生成/重绘素材、重建发布包或部署。当前四张v3图已加载，但“动画索引有8项”和“能绘制出不同像素”不能证明有8个完整独立姿态。

## 新证据与边界

本次独立目录：[`hero-highframe/2026-10-11T08-02-47-308Z/`](../evidence/current/hero-highframe/2026-10-11T08-02-47-308Z/)。

- [`browser.json`](../evidence/current/hero-highframe/2026-10-11T08-02-47-308Z/browser.json)：一个真实Edge 155.0.4283.45，自有127.0.0.1:8093服务；首页→选角→沙悟净→入山，通过真实键盘输入运行到约2.36游戏秒。自然记录见idle0..5、move0..7、attack0..3，未声称自然覆盖攻击全8帧/其他状态/其他英雄。页面异常、console错误、请求失败均0。
- 真实玩法截图 `natural-wujing-moving.png` 的命名表示按住D后的采样时段，并不保证截屏瞬间是move状态（该时段有自动attack）；`natural-wujing-stationary.png` 是释放D后采样。不要据文件名推断状态。`natural.draws` 是每个state:index最后一次绘制的去重集合，不是按时间排序的视频/帧率序列。
- 四张 `*-source-cuts.png` 是原PNG叠加当前运行时切线的诊断视图；四张 `*-renderer-move-attack.png` 使用加载的生产图片与实际`_drawPlayer`，克隆玩家字段构造move/attack、左右各8帧，共128个样本。样本明确是夹具，不是自然游戏状态覆盖，也不是最终流畅度/FPS验收。
- [`handoff-verification.json`](../evidence/current/hero-highframe/2026-10-11T08-02-47-308Z/handoff-verification.json) 记录浏览器报告/截图/诊断源码SHA、135个保护文件以及新回归快照。原始PNG未编辑；屏幕证据不进入素材manifest或发布资源。
- 首次受限启动服务 `spawn EPERM` 保留在 [`08-02-24-208Z/browser.json`](../evidence/current/hero-highframe/2026-10-11T08-02-24-208Z/browser.json)。获准后串行重跑；`browser.close()`完成，自有服务PID17460的退出事件已收到。只保证本测试对象关闭，不声称系统无其他浏览器或端口。

## 素材身份核对

四张现有PNG均1774×887，文件大小/SHA与manifest一致，用途是当前局内战斗表，不是立绘。运行时加载在 `native-app.js` 的 `battleV3Files`/`attachBattleV3Frames`；精美选角卡仍是独立资源。本步没有生成任何新素材。

|运行ID / PNG文件名|bytes|SHA256|
|---|---:|---|
|wukong / hero-wukong-battle-v3-sheet.png|1,387,002|6d5e900a45300320f5072f6c0072c59975d9db9d8fa564c8e4418d0996d19127|
|tangsanzang / hero-tangseng-battle-v3-sheet.png|1,942,037|08f1819dd09725a94908906cf12f4294724ce425f9a763768de0d723f1487b61|
|bajie / hero-bajie-battle-v3-sheet.png|1,490,905|74e1332bc908e992fab2277902dcbcb2be1558896172470f4af4b4d98647e54b|
|shajing / hero-wujing-battle-v3-sheet.png|1,558,610|8788002d9482ab92797dc0dfb41742b28e811d18c5a764485c54ae1578dce747|

## 具体缺陷

1. **悟净布局与统一4×2合同不符。** 原图目视上排5个人物、下排3个人物；443.5×443.5均分裁切穿过人物躯干和武器，部分格包含两个残缺人物。真实UI键盘输入截图可见身体/武器截断；独立双向生产renderer样本清楚复现串格。因此不是只有metadata不规范的问题。
2. **其余三英雄的武器/特效也跨格。** 悟空突刺金箍棒穿过中间竖线，唐僧下排杖/法术/飘带跨边界，八戒下排耙头越界。原图与实际renderer样本均已目视。边界alpha相邻像素统计仅是预警，不能单独推算连接组件、完整姿态数或动作质量。
3. **八项调度不等于八个独立动作。** 所有英雄使用相同的重复序列；下面数量来自本次页面实际加载的frameGrid，不是历史声明。

|状态|调度帧数|不同源矩形数|
|---|---:|---:|
|idle|6|4|
|move|8|3|
|attack|8|2|
|hit|4|2|
|stun|4|3|
|dash|8|2|
|intro|10|4|
|death|8|4|

这些是矩形数，不保证矩形里有一个完整正确姿态；悟净尤其不能称“3个完整移动姿态”。当前attack源索引为4,4,5,5,4,5,5,4。

合理的动画可以保帧，重复矩形本身不是通用失败条件。当前诊断脚本的自动result侧重发现重复序列，不应直接作为未来所有动画的质量门禁；本次缺陷结论同时依据源裁切数量、边界告警以及人工目视确认的截断/串格，人工结论另存 `visual-review.json`。后续若复用脚本验收修复，需先完善该判据，不能只改到8个不同矩形就标PASS。

4. **重复图像仍叠加整图变换。** `_drawPlayer` 在源图绘制前调用 `animationPose` 的位移/旋转/非等比缩放；本次128个真实Canvas绘制记录保留源矩形、目标大小和矩阵，可看到同一裁切被不同变换绘制。动画画面hash不同不能证明源姿态增加。声明的pivot不构成实测的各姿态统一根点合同。
5. **旧测试存在覆盖边界。** `browser-animation-smoke.mjs` 的格数/画面变化检查和旧`browser-visual-smoke.mjs`的不同矩形检查，只能证明加载与变化；不能验证人物完整隔离或真正独立动作。本步没有修改这些生产回归门禁，也没有把旧PASS重写为本轮PASS。

## 回归与保全

[`npm-test.txt`](../evidence/current/hero-highframe/2026-10-11T08-02-47-308Z/npm-test.txt) 为本步完整新跑日志，退出码0，最终validation时间08:03:16.149Z。17机制、八普通怪专项、8状态牌、6伤害数字、8反馈避让、四角色600秒模拟、正常输入、池/渲染/平台桩、八物种公开合同均通过。它们没有验证上述完整人物/高帧质量，不能冲销视觉FAIL；平台部分不是微信实机。

`full-run.json` 是历史文件，本步没有重新写入；四角色600秒重跑证据在本次完整日志。21份本次重写的JSON/库存报告复制到 `current-regression/`，22份覆盖前旧报告保留在 `previous-evidence/`，各自时间/SHA在交接记录内。08:03:37.099Z新库存审计80媒体、76唯一SHA、4组可解释副本、metadata无差异。

浏览器和npm回归后135个保护文件SHA不变（含全部prototype-2d文件、80份既有媒体、manifest、相关发布/服务源码和两ZIP；去重后计数）。`npm test`按既有流程重新生成微信派生bundle，但未改网页生产源或现有ZIP。未修改原项目/legacy资源。

当前ZIP仍为旧牛版候选，缺后续五物种：web SHA `9c9bd515b0e8dcb5c4d4101838f1ebc3679b0f425ab31685909503c9519ae097`；wechat SHA `f017493aaf8eeebccc1ac040ded0397a8bfcc4f8d0cbee56e6be5b04e4dec4e2`。本次没有ZIP解压网页、公网、音频浏览器或微信实机重验；历史外部502仍按原日期记录，不能声称现在已测公网成功或再次失败。

## 下一个安全步骤

后续08:24Z已经执行下面的可分离性检查，结果为纯矩形方案不可行；以下保留当时计划，当前下一步以 [`WUJING-CROP-ISOLATION.md`](WUJING-CROP-ISOLATION.md) 为准。

先对现有悟净PNG测量完整人物/武器的独立裁切、统一比例和固定根点，确认无邻人残片后再单独接入验证，不能只把cols改成5或继续均分；测量不成立就保留REVIEW，不直接裁掉身体/武器。该步骤仅修复裁切，仍然不等于完成英雄高帧。后续真实动作补齐需要独立缺口/去重审计，素材任务继续单窗口串行低频。

网页发布还受英雄完整动作、虎先锋与3Boss专属动作、蛇最终造型/连续性、整体遮挡、当前候选包及公网验收约束；当前未完成不上线。微信AppID/实机/账号商业服务延期，不能把它们加回网页发布前置条件。
