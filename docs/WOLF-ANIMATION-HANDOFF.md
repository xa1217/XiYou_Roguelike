# 普通苍狼32姿态：独立素材预检交接

更新时间：2026-10-10（Asia/Shanghai）。本步仅完成候选素材生成、登记和独立验证，未接入生产游戏、未批准运行时、未重建ZIP或部署。

## 素材、prompt与查重

- 保存路径：`prototype-2d/assets/enemy-wolf-battle-v1-sheet.png`，1774×887，1,410,175 bytes，SHA256 `b116553b99a397f2fd0c28076000246e9c3528c6b28d7ab6f2482927db8d8299`。
- 完整提示词：[`prompts/enemy-wolf-battle-v1-sheet.txt`](../prompts/enemy-wolf-battle-v1-sheet.txt)。模式为内置imagegen，新图生成1次；不带输入图，无编辑/CLI/API调用。工具原图来源记录在帧JSON和manifest；字节原样复制入本副本，未脚本重绘、裁图输出或重编码。
- 生成前核当前75份媒体/71唯一SHA/4解释副本的哈希、尺寸、用途与运行引用。原项目 `F:/Project/Xiyou_EightyOne_Calamities` 与legacy由复用的只读代理核资产名/manifest/运行用途，无狼专属多帧；没有逐图目视原项目全部图片，不声称做过。原项目未修改。
- 本聊天10张生成PNG均已核SHA：4英雄、虎/熊/牛终稿和3份草稿；未登记虎草稿已目视，非狼。已有英雄、虎/熊/牛、地图、图标和音频不重生成。详见 `evidence/current/wolf/generation-preflight.json`。
- 苍狼身份来自 `content.js:186`，现用回退为双足runner形态。候选是原创灰狼妖，不是狐狸、四足狼、凌虚子/奎木狼或Boss；目标只允许 `stage1+normal+wolf`。
- 生成图一次通过32隔离姿态/透明检查；`draft-preflight.json`针对工具输出，`asset-preflight.json`针对工作区副本，两者SHA相同。本轮没有被弃用或覆盖的狼图。

## 帧契约与质量边界

`enemy-wolf-battle-v1-frames.json` 使用32个实测矩形，每边外扩2px；不要均分图片。状态和预览fps分别为idle8@8、move8@12、attack8@16、hit4@16、death4@10。这是序列设定，不是实测游戏帧率。

全帧统一170源像素参考体高；固定列根点 `[113,335,557,779,1000,1222,1443,1665]`，行基线 `[208,430,650,866]`。不逐帧拉伸、不把每帧最低点重新贴底。锚点仍provisional，需在局内验证语义足底、横向漂移和状态衔接。

可见alpha>8轮廓最低点相对基线：idle 0、move −1～+2、attack −1～0、hit −2～−1、death −1～+1源像素。48px体高下最大约0.56px；轮廓最低点不是语义足底，不能据此批准落脚质量。各行最小可见水平间隔77/45/38/25px；全部alpha>8像素被分类，不宣称覆盖所有极淡alpha像素。

主代理目视原表、左右48px图集和48/56/96px抽样，灰狼头/耳/尾及动作可辨，未见明显截断或串格。形态与逻辑动作可作为接入候选；不同哈希不等于动作衔接完美，尤其跑步周期、咬击/受击与真实接触点仍须局内看。

`approvedForRuntime:false` 与manifest的 `runtimeApproved:false` 均保持；native-app、共享注册、公开帧契约注册、serve和release均无wolf接入。本次脚本仅在 `browser-actor-preflight.mjs` 的物种名表增加wolf，复用原独立预览逻辑。

## 本次新证据

|检查|证据|结果与边界|
|---|---|---|
|真实alpha、尺寸/哈希、32隔离且像素不同姿态|`wolf/asset-preflight.json`|PASS；只读像素检查，不是流畅度或局内通过|
|单Edge独立预览|`wolf/browser-preflight.json`|09:31:04.610Z启动→09:31:14.415Z结束；PNG解码、各状态不同像素、镜像、91次绘制覆盖、页面错误0|
|录制dataUrl播放回读|同上`previewDecode`|1000×720、90解码回调/90种抽样像素，4.173秒播放结束|
|素材库存与manifest|`asset-dedup-audit.json`|76份媒体/72唯一SHA/4解释副本，尺寸/bytes/hash无差异|
|现有生产代码回归|`validation.json`、`wolf/npm-test.txt`|09:33:09.086Z新npm test PASS；17机制+11虎+13熊+13牛+8状态、四角色600秒/正常输入/对象池/渲染/平台桩，三物种公开JSON专项|
|交接、隔离与哈希|`wolf/handoff-verification.json`|原图/截图/视频、批准状态、旧媒体、运行源文件及原ZIP核对；非局内或公网验收|

以上证据均相对于 `evidence/current/`。没有狼局内专项，因为还没接入；没有重跑整体游戏、虎/熊/牛局内、英雄、音频、ZIP解压网页或外部公网，不把既有PASS算作本轮新验。

预览文件为 `wolf/atlas-right-48px.png`、`wolf/atlas-left-48px.png`、`wolf/motion-sample-48-56-96px.png`、`wolf/animation-preview.webm`。录像271799 bytes、SHA256 `059ddebda621075c59ada6d452f8e7ac233a61fa84b54753274f1e7e68f43d78`。

录像是浏览器播放动作表后的有限录制，不是直接生成视频或生产游戏录像。回读使用录制内存dataUrl，磁盘文件另核SHA，不声称已从磁盘重新播放。91次绘制/90解码回调不证明每个源姿态都被编码、恒定30fps、最终流畅度或移动端性能。

## 失败、资源与发布边界

- 首次浏览器启动 `spawn EPERM` 保留在 `wolf/browser-fail-1791624624848.json`；授权后只启动一个Edge重跑成功，`browserClosed:true`，无清理错误。生成时没有浏览器，素材始终单任务串行，仅复用一个只读代理。
- 09:34:02Z只读快照无匹配测试Node/无头或Playwright Edge，可用约21.01GiB/总31.9GiB。没有结束其他进程，不保证整机无其他后台任务或未来无429。首次CIM权限拒绝后获准只读重试。
- 被更新的上一轮Node/库存报告与旧manifest已备份到 `work/wolf-preflight-backup-20261010T091809Z/`；既有public报告仍是牛ZIP历史证据，不冒充本步验收。
- 牛版网页ZIP仍12,591,435 bytes、SHA `9c9bd515b0e8dcb5c4d4101838f1ebc3679b0f425ab31685909503c9519ae097`；微信ZIP仍5,043,614 bytes、SHA `f017493aaf8eeebccc1ac040ded0397a8bfcc4f8d0cbee56e6be5b04e4dec4e2`。均不含狼候选，未重建或部署。

## 下一步

1. 直接复用本狼PNG与实测JSON，只接入首关普通wolf；不得重生成、变成Boss通用皮肤或修改原项目。
2. 串行维护共享注册/加载/白名单；保持碰撞、伤害、移动、RNG与对象池规则不变。验证统一比例、固定根点、脚底与状态衔接，再验自然move/attack/hit/death、左右、暂停恢复、死亡回收、裁切/血条和接触遮挡。
3. 只有局内证据通过后才批准运行时、纳入公开运行字段投影，并另行重建/验证实际ZIP。
4. 猴/鹿/鹰/蛇4类普通怪、虎先锋、3Boss仍缺动作；英雄最终高帧质量、身体/血条/数字/HUD整体可读性与公网仍未完成。PNG请求自身挂起watchdog仍是既有边界；本步没有声称修复。
5. 微信AppID/实机/商用服务依约延期；全完成才上线的条件未满足，不部署。
