# 普通熊妖32姿态局内接入

更新时间：2026-10-10（Asia/Shanghai）。本项记录首关普通熊妖接入和本地运行验收；没有新增/修改图片像素，未上线。本接入阶段尚未重建下载包，后续已经完成候选包验收，最新包状态见 [BEAR-RELEASE-HANDOFF.md](BEAR-RELEASE-HANDOFF.md)。

## 复用与身份边界

复用 `enemy-bear-battle-v1-sheet.png`，1774×887、978099 bytes，SHA256仍为 `49cf7d76bc03808b7a7b8d0ec07e4c0fdd21876d4524a14d26b8ca1207b2571f`。裁切矩形和136源像素统一比例不变，禁止重复生成。前期生成/预检及失败记录见 [BEAR-ANIMATION-HANDOFF.md](BEAR-ANIMATION-HANDOFF.md)。

出生只允许 `stage.id===1 && kind==='normal' && variant==='bear'` 获得 `bear-normal-v1`。使用时再次同时校验ID、variant、kind；死亡另要求原 `enemyKind==='normal'`。熊山君、精英、其他关卡和虎妖都不共享熊妖表。

新增 `bear-animation.js` 与小型 `battle-enemy-animation.js` 注册表，共享身份选择贯穿引擎与渲染；原虎妖公开API保留。注册表不在每帧分配对象。网页图片及实测JSON串行完成后才交给renderer，坏JSON/请求失败/JSON等待10秒超时均保留向量回退。PNG自身仍只依赖onload/onerror，没有无限悬挂请求的watchdog；此既有网络边界未在本轮解决，不宣称所有网络挂起均已处理。

## 动作与画面规则

- idle8/move8循环；attack8/hit4/death4单次到末姿态。接触挥爪视觉0.5秒、受击视觉0.25秒，不改变原0.12秒受击规则、移动、碰撞、伤害、掉落、随机数或无敌时间。
- 死亡保留原ID、朝向、bodyRadius，4姿态按10fps播放，在原0.42秒生命周期回收；不拿放大的特效半径拉伸尸体。熊死亡→impact→虎死亡的池复用单独验证，字段不串用。
- 体高48世界像素（radius15），所有姿态按 `radius*3.2/136` 等比绘制，只平移/左右镜像，不附加摇摆、旋转、压扁或逐帧贴底。
- 保留同一固定行/列根点；48px生产渲染夹具和自然游戏截图未见明显脚底/裁切异常。move的轻微抬脚仍来自原图；此结论不等于“完美动画”或最终主观高帧质量验收。
- 所有姿态包围为X约[-2.2824r,+2.9177r]、Y约[-2.8059r,+.7471r]，双向和死亡均使用3.4r+4裁剪余量。熊妖血条稳定偏移3.4r，避免套用虎妖3.05r后小尺寸压头；状态牌跟随稳定血条，不按每帧顶点跳动。

## 本轮新证据

|范围|入口/证据|结果及边界|
|---|---|---|
|熊妖Node专项|`prototype-2d/tests/bear-animation-smoke.mjs`；`evidence/current/bear/engine-runtime.json`|13项PASS：32裁切/64镜像、身份/跨物种隔离、状态时钟、玩法/RNG不变、暂停、死亡/池、四边裁剪、128个血条包围检查及状态牌|
|熊妖真实游戏绘制|`scripts/browser-bear-smoke.mjs`；`evidence/current/bear/browser-runtime.json`|真实Edge，正常UI后合法输入驱动加速生产模拟，约13.37游戏秒；自然move8/attack8/hit4/death4、双朝向、2次受击事件/1次击杀、暂停图像/时钟冻结及恢复，页面/请求错误0|
|虎妖回归|`evidence/current/tiger/browser-runtime.json`|本轮新跑真实Edge PASS，未复用旧浏览器PASS|
|角色动画/整体页面/状态提示|`animation/browser-animation-smoke.json`、`visual.json`、`status-badges/browser.json`|本轮串行新跑PASS；正常游戏与明确标注的升级/Boss/结算/密集状态夹具分开，不冒充自然触发|
|本地访问边界/正常流程|`evidence/current/browser-public-smoke.json`|本轮针对workspace本地服务验证熊/虎/注册表资源允许，内部文件拒绝；不是现有ZIP的验证，也不是外部公网|
|整体Node门禁|`evidence/current/validation.json`|本轮npm test：17机制+11虎妖+13熊妖+8状态专项及长局/对象池/渲染/平台桩；不是微信真机|

`browser-runtime.json`中的32姿态48px左右生产渲染夹具单独标注，不计入自然触发帧。截图 `runtime-fixture-left/right.png`、`natural-move-0.png`、`natural-hit-*`、`natural-death-*`已目视检查。渲染时间只是桌面样本，不是手机FPS；上轮独立WebM也不是本次游戏录像。

首次浏览器启动的EPERM原始报告保留为 `evidence/current/bear/runtime-fail-*.json`，授权单浏览器重跑后通过。脚本为evaluate/关闭设时限并保存阶段checkpoint，最后关闭自建浏览器。全程没有图片生成并发，仅复用一个只读复核代理。

最终汇总见 [runtime-verification.json](../evidence/current/bear/runtime-verification.json)，记录本轮证据与源文件哈希、PNG未变、旧ZIP未变且不含熊妖、未重建/未部署边界。测试自建浏览器和本地服务均已关闭；2026-10-10T05:22:42Z只读进程快照未见匹配的测试Node/Playwright根进程，空闲内存约21.8GiB。此快照不代表整机无浏览器，也不保证未来不会发生429。

## 发布与后续

帧契约 `approvedForRuntime:true`、manifest `runtimeApproved:true`。native加载、serve与release明确资源清单已更新；微信核心bundle由本轮测试重建，微信图像仍走原向量回退。

**该接入阶段未运行npm run release、未部署**；当时`dist/`和`work/release-staging/`仍为10月9日状态提示版。之后已按 [BEAR-RELEASE-HANDOFF.md](BEAR-RELEASE-HANDOFF.md) 重建并验证本地候选包，但没有上线；其余6类普通怪、虎先锋和3名Boss动作仍待补。此文中的workspace网页、npm test等当时证据已复制到`work/release-backups/pre-bear-20261010T052706Z/evidence-current/`，当前同名文件可能是后续新跑，不混用历史哈希。

英雄最终高帧质量、整体身体/血条/伤害数字/HUD遮挡、公网502后重验仍未完成。音频没有改动，也没有重跑音频专项。用户要求全部完成才上线，因此继续保持未上线。
