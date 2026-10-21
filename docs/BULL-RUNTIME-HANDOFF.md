# 普通野牛32姿态局内接入

更新时间：2026-10-10（Asia/Shanghai）。本项为牛局内接入阶段记录，0次素材生成；该阶段没有打包或部署。随后已完成牛版本地候选包验收，最新包状态见 [BULL-RELEASE-HANDOFF.md](BULL-RELEASE-HANDOFF.md)。本文件保留接入当时的时间、旧包哈希和未打包边界；同名证据更新前副本在`work/release-backups/pre-bull-20261010T090309Z/evidence-current/`。公网及用户要求全完成才上线的条件仍未满足。

## 复用与身份边界

复用 `prototype-2d/assets/enemy-bull-battle-v1-sheet.png`，1774×887、1,137,073 bytes，SHA256 `88835913f75054ec232ff3507d7a6fd27bde22ea40a7b004de028262e4408acb`。未重绘、重编码或修改像素。前期生成1次及布局编辑1次属于上一阶段，详见 [BULL-ANIMATION-HANDOFF.md](BULL-ANIMATION-HANDOFF.md)，不能计成本轮新生成。

只有 `stage.id===1 && kind==='normal' && variant==='bull'` 在出生时获得 `bull-normal-v1`。使用时再检查ID/物种/类型；死亡要求原 `enemyKind==='normal'`。特处士（待处士）、精英、其他关卡不共用普通牛图。

新增 `bull-animation.js`，复用现有共享注册表贯穿时钟、死亡、裁剪、血条与绘图。`native-app.js`仍串行加载PNG/实测JSON，失败保留向量回退；引擎、renderer、虎/熊模块本轮字节未变。PNG无限悬挂请求仍缺watchdog，这是既有未解决边界，不声称所有超时已解决。

## 动作与画面规则

- idle8/move8循环，attack8/hit4/death4单次到末姿态；fps设定8/12/16/16/10，不是实测游戏FPS。接触攻击视觉0.5秒、受击视觉0.25秒，原伤害/移动/碰撞/掉落/RNG规则不变。
- 死亡保留原身份、朝向和bodyRadius，4姿态按10fps播放，原0.42秒生命周期回收；三物种全部6个有向池复用组合隔离，牛Boss也不能继承普通牛素材。
- 使用32个实测矩形，不均分图。以150源像素参考体高统一缩放，radius15对应48世界像素；根点为固定列 `[141,357,577,782,996,1213,1424,1642]` 与行基线 `[228,435,640,843]`，不逐帧贴底、拉伸、摇摆或压扁。
- 血条偏移3.45r，Node检查4个半径×32姿态共128组包围；四边裁切验证保留可见肢体及死亡姿态。截图未见明显串格/裁切/脚底异常，但不等于最终主观动画质量通过。
- 自然接触攻击/受击仍存在英雄身体遮挡；`natural-attack-7.png`中牛被悟空主体严重遮挡。自然帧覆盖只证明可视区drawImage调用，不能证明每帧无遮挡或每帧均自然双向触发。此问题继续列为全局可读性待办。

## 本轮新验证

以下均为本地工作区 `http://127.0.0.1:8091/` 或Node，不是ZIP解压件、公网或微信实机。浏览器只串行启动；时间均为UTC。

|范围|证据|时间与结论|
|---|---|---|
|牛局内真实Edge|`evidence/current/bull/browser-runtime.json`|08:31:23.557Z→08:31:28.638Z，PASS；正常UI后合法输入驱动24.36游戏秒/484步加速生产模拟，自然move8/attack8/hit4/death4、累计左右向、2次命中/1次击杀；暂停图像和时钟冻结、恢复继续；页面/请求错误0|
|牛生产renderer夹具|同报告的`runtime-fixture-left/right.png`|32姿态×左右48px，各32个不同图像格；明确与自然触发覆盖分开，不是独立素材预检|
|虎/熊局内回归|`tiger/browser-runtime.json`、`bear/browser-runtime.json`|本轮分别08:33:40Z、08:33:53Z标记，均PASS；熊08:33:58Z结束，不复用旧PASS|
|四角色动画|`animation/browser-animation-smoke.json`|08:34:57Z标记，PASS；真实资源/帧变化、暂停恢复、向量地图边界|
|整体页面/状态提示|`visual.json`、`status-badges/browser.json`|08:37:04Z、08:38:29Z标记，PASS；正常流程和升级/Boss/结算/密集状态夹具分开|
|本地正常网页与访问隔离|`browser-public-smoke.json`|08:38:43.665Z生成标记，报告无结束时间；目标`workspace-bull-runtime-20261010T082708Z`。三物种PNG/模块/JSON、首页→选角→战斗、9秒实时推进、debug关闭通过；7条404是刻意探测，pageErrors/failedRequests为0|
|最终Node门禁|`validation.json`、`bull/npm-test-final.txt`|08:44:42.950Z，npm test PASS；17机制+11虎+13熊+13牛+8状态，四角色600秒、正常输入、对象池、渲染和平台桩；mainBytes2447601/artBytes3072775|
|牛专项/公开帧JSON|`bull/engine-runtime.json`、`bull/public-contract-node.json`|08:44:38Z、08:44:37Z，13牛专项及虎/熊/牛6字段投影/嵌套隐私/等价/坏数据拒绝PASS|
|素材查重|`asset-dedup-audit.json`|08:44:37.075Z，75份媒体/71唯一SHA/4组解释副本，尺寸/bytes/hash无差异|

已目视 `natural-move-0.png`、`natural-attack-7.png`、`runtime-natural-battle.png`、`runtime-fixture-left/right.png`；复核代理另检查死亡与攻击截图。自然姿态截图保留，不虚构不存在的`natural-hit-0.png`，实际命中截图为`natural-hit-3.png`。本轮没有新录制游戏视频；上一阶段独立WebM不能当作本轮游戏录像。

## 批准、发布与证据隔离

帧契约 `approvedForRuntime:true`、manifest `runtimeApproved:true`，仅批准上述本地运行范围。串行加载、构建顺序、服务和发布资源清单已加入牛；公开JSON仍只投影6个运行字段及受限嵌套字段，本机来源/prompt/审批记录保留仓库，不对网页公开。

`release.mjs`的牛PNG/JSON清单与`verify-release.ps1`的三物种帧JSON识别已更新并通过语法检查，但本轮未执行发布构建或验包。下次验包必须指定新的`ExtractDirectory`/`ReportPath`，不能覆盖旧熊包证据。微信核心bundle已由npm test重建，图片仍走原向量回退；不是微信实机通过。

现有ZIP完全未改，仍是此前熊妖版本，不含牛且不再匹配最新源码：

- 网页：11,495,592 bytes，43项；SHA256 `66308f0516ac8ea68aaf35a42f4038ebdf9fd1fadd8f8f1503f926d4379d8468`。
- 微信：5,043,356 bytes，25项；SHA256 `b74a0b67f25a9ef01043e82b9876a7727b3ce6c40cd7272bd7e53a87dfe1d34c`。

本轮前证据完整备份在 `work/bull-runtime-backup-20261010T082708Z/evidence-current/`，另存旧manifest及牛候选JSON。旧熊包解压网页报告在该备份中的`browser-public-smoke.json`，其目标`archive-extracted-bear-20261010T052706Z`；当前同名public文件只验证牛工作区。最终源文件/截图/报告哈希及批准边界见 [runtime-verification.json](../evidence/current/bull/runtime-verification.json)。

音频未重跑：现存 `audio.json` 时间为2026-10-08T18:06:01.693Z，不能把历史段落标题日期当成新音频验收。外部公网此前502记录保留，本轮未重试/未部署；本地PASS不能替代公网PASS。

## 资源收尾与下一步

只复用一个轻量只读审查代理，没有新开素材窗口。测试浏览器已退出，自建8091服务通过会话停止。首次只读进程检查因沙箱拒绝访问，授权重试成功；08:51:39Z快照未见匹配的测试Node/无头浏览器或8091监听，可用内存20.95GiB/总31.9GiB。其他20个node进程未擅自终止，工作集约1220.1MiB；工作集可能共享页面，不等于独占物理内存。详见 `bull/process-cleanup.json`，不保证未来不会429。

复用代理已完成代码和浏览器/证据基线审查；可选的最终全文文档复核长时间未给结论，已停止以释放并发，不算独立终验PASS。根代理已完成26项汇总检查及42个源文件/报告/截图/ZIP哈希再核对，全部一致。

下一步单独重建/验牛版本地候选ZIP；或串行查重后补缺失的狼/猴/鹿/鹰/蛇、虎先锋和3Boss动作。普通虎/熊/牛不得重复生成。英雄最终高帧质量、接触身体/血条/数字/HUD整体遮挡、公网与既有PNG挂起边界仍未完成；微信AppID/实机/商用服务依约延期。不能以本项通过宣称全部完成或上线。
