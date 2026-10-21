# 普通野牛妖32姿态：独立素材预检交接

更新时间：2026-10-10（Asia/Shanghai）。这是接入前的历史候选预检记录，保留当时未批准/未接入的结论，不代表最新状态。后续已复用本PNG完成局内接入与批准，见 [BULL-RUNTIME-HANDOFF.md](BULL-RUNTIME-HANDOFF.md)，并完成本地候选ZIP验收，见 [BULL-RELEASE-HANDOFF.md](BULL-RELEASE-HANDOFF.md)；没有重生成或上线。本预检阶段同名Node/素材库存/public证据的副本位于`work/bull-runtime-backup-20261010T082708Z/evidence-current/`，勿用后来覆盖的文件冒充当时结果。

## 素材与查重

- 目标仅为首关 `stage1 + normal + bull`。Boss特处士（历史别名待处士）也使用 `variant=bull`，未来必须同时检查关卡与敌人类型，不能共用普通牛表。
- 生成前核对当前副本74份媒体/70个唯一SHA/4组可解释重复、原项目现役素材目录（只读）及本聊天8张生成图，没有普通野牛动作表。旧角妖/石甲山精是单姿态，不是普通牛动作；现有英雄、虎、熊、图标、音频和地图不重做。详见 `evidence/current/bull/generation-preflight.json`。
- 使用内置imagegen生成1次初稿，再做1次定向布局编辑；初稿攻击行相接，仅31隔离块，保留REVIEW但未复制进资产目录。终稿32块原样复制，未脚本重绘、重编码或逐帧拉伸。恢复预检期间没有再调用生成。
- 保存路径：`prototype-2d/assets/enemy-bull-battle-v1-sheet.png`，1774×887、1,137,073 bytes；SHA256 `88835913f75054ec232ff3507d7a6fd27bde22ea40a7b004de028262e4408acb`。
- Prompt：`prompts/enemy-bull-battle-v1-sheet.txt`、`prompts/enemy-bull-battle-v1-layout-edit.txt`。工具源路径留在仓库追溯，不进入公共服务或发布包。
- 本次登记后审计PASS：75份媒体、71个唯一SHA、4组可解释重复，manifest无缺失及尺寸/bytes/hash差异。

## 契约与质量边界

`prototype-2d/assets/enemy-bull-battle-v1-frames.json` 的 `approvedForRuntime:false`、manifest的 `runtimeApproved:false` 均保持不变。未加入生产加载器、共享动画注册表、serve或release白名单。

|状态|独立姿态|预览设定fps|
|---|---:|---:|
|idle|8|8|
|move|8|12|
|attack|8|16|
|hit|4|16|
|death|4|10|

这些是序列设定，不是实测游戏帧率。必须使用32个实测 `sourceRects`，每边外扩2px；4行间距不等，不得均分图。以150源像素参考体高统一缩放，预览为48/56/96px，不逐帧拉伸或贴底。

像素检查覆盖全部alpha>8的像素；不宣称囊括所有极淡非透明像素。四行最小可见横向间隔为67/59/32/49px，未发现邻姿态混入。固定列根点 `[141,357,577,782,996,1213,1424,1642]` 和行基线 `[228,435,640,843]` 仍为provisional。

只读复核测得可见底部相对行基线偏移：idle为−1～0、move为−3～0、attack为−5～+3、hit为−4～−2、death为−1～+2源像素。48px比例下最大约−1.60～+0.96px；需在局内确认落脚与动作切换，不是重复生成的理由。左右图集及动作抽样已目视，48px形象可辨，未见明显截断或串格；这不证明动画衔接或最终质量完美。

## 本次新验证

|验证|证据|结果与边界|
|---|---|---|
|PNG隔离、透明、尺寸、哈希和32不同姿态|`evidence/current/bull/asset-preflight.json`|10月10日新跑PASS；只读像素预检|
|独立真实Edge预览|`evidence/current/bull/browser-preflight.json`|08:14:57Z启动，08:15:07Z完整结束；PNG解码、逐状态不同像素、左右镜像、91次绘制覆盖、页面错误0|
|录制数据播放回读|同上 `previewDecode`|1000×720，播放结束4.154秒，90个解码回调/90种抽样像素；确认可播放且像素变化|
|素材去重与登记|`evidence/current/asset-dedup-audit.json`|75/71/4，PASS；不代表同用途判断可仅靠哈希|
|当前运行代码回归|`evidence/current/validation.json`|08:17:08Z完成的新npm test PASS；17机制+11虎妖+13熊妖+8状态回归及四角色600秒/正常输入/对象池/渲染/平台桩，公开帧JSON专项通过|
|交接与隔离核对|`evidence/current/bull/handoff-verification.json`|原PNG、截图、录像哈希一致；候选标记与身份正确；运行源码/发布边界和原ZIP哈希未变；上一阶段证据备份匹配|

预览文件在 `evidence/current/bull/`：`atlas-right-48px.png`、`atlas-left-48px.png`、`motion-sample-48-56-96px.png`、`animation-preview.webm`。录像为276425 bytes，SHA256 `9b8aea834df7b34e5a0f31e45745875d6b7d2995a10b67d2a528a5edf14bd608`。

录像来自浏览器播放动作表，不是直接生成视频或生产游戏录像。播放回读对象是内存中的录制dataUrl，磁盘文件另核SHA；不能说已从磁盘重新播放。91次绘制、90个解码回调及不同采样像素不证明每个源姿态都被编码、固定30fps、游戏性能或主观流畅度合格。

通用脚本为 `scripts/browser-actor-preflight.mjs bull`；原 `browser-bear-preflight.mjs` 保留兼容入口。本次新加有界WebM解码播放检查、幂等清理和中性标题；没有重跑熊妖独立预检，也没有把旧熊妖录像升级为已回读。

## 失败保留、并发与包边界

- `draft-preflight.json` 保留31块初稿REVIEW，`layout-preflight.json` 保留终稿32块PASS。
- `browser-fail-1791616690731.json` 保留首次沙箱启动 `spawn EPERM`。获准后仅启动一个Edge并完整重跑；失败没有覆盖为PASS。
- 只有一个素材任务、一个串行测试浏览器，复用一个只读复核代理。报告 `browserClosed:true`，无清理错误；08:19:04Z只读快照没有匹配的预检Node或headless/Playwright Edge，可用内存约21.1GiB/总31.9GiB。未终止任何其他进程；不保证未来不会429，也不声称整机无其他后台进程。
- 上一阶段证据与旧manifest已在 `work/bull-preflight-backup-20261010T054206Z/` 备份；当前npm test更新的是Node证据，不能混作上一阶段的新浏览器验收。
- 本次未重建ZIP：网页包仍11,495,592 bytes、SHA `66308f0516ac8ea68aaf35a42f4038ebdf9fd1fadd8f8f1503f926d4379d8468`；微信包仍5,043,356 bytes、SHA `b74a0b67f25a9ef01043e82b9876a7727b3ce6c40cd7272bd7e53a87dfe1d34c`。均为此前熊妖候选包，不含牛候选。

## 下一步

1. 复用牛PNG/JSON，只接入第1关普通野牛，排除特处士/精英/其他关卡；串行维护共享契约，不修改原项目。
2. 先验证统一比例、固定脚底和状态衔接，再检验自然move/attack/hit/death、双朝向、暂停恢复、死亡回收、血条和视野边缘；保持碰撞、伤害、移动、RNG和对象池规则不变。
3. 局内通过后再批准运行时及更新公共运行字段白名单，随后单独验包；独立素材预检不能替代以上门槛。
4. 仍有6类普通怪未接入专属动作（其中牛已有候选，另5类尚缺素材）、虎先锋和3Boss动作待补。英雄最终高帧质量、身体/血条/伤害数字/HUD整体可读性、公网仍未完成；PNG请求永久挂起的watchdog也仍是既有未解决边界，本步骤没有扩展修复。

整体游戏浏览器、音频和外部公网本次没有重跑；之前公网502记录继续保留，不把本地预检/测试PASS当公网PASS。微信AppID/实机/商用服务依约延期。全部完成才上线的条件未满足，未部署。
