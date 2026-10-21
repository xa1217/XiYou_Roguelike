# 普通熊妖32姿态：素材预检交接

更新时间：2026-10-10（Asia/Shanghai）。本文件记录接入前的素材预检阶段，当时尚未接入/批准/上线；保留其失败与有限PASS边界。后续局内接入已完成，当前状态见 [BEAR-RUNTIME-HANDOFF.md](BEAR-RUNTIME-HANDOFF.md)，不要将下文历史候选标记误作当前状态。

## 素材与查重结论

- 目标仅为首关 `stage1 + normal + bear`。熊山君虽然也使用 `variant=bear`，仍是独立Boss，不得共用普通熊妖表。
- 生成前核对现有副本73份媒体、69个唯一SHA、4组可解释重复，以及原项目现役素材目录（只读）和本聊天生成图目录；没有同用途的普通熊妖动作表。旧creature/brute/boss单姿态图和已接入的虎妖表均不代替熊妖，也不重生成。依据见 `evidence/current/bear/generation-preflight.json`。
- 10月9日内置imagegen产出初稿，攻击行相接，只能分离31个独立块，预检为REVIEW；一次内置布局编辑增加留白，终稿得到32个独立块。初稿未复制进素材目录。生成与修正prompt在 `prompts/enemy-bear-battle-v1-sheet.txt`、`prompts/enemy-bear-battle-v1-layout-edit.txt`。
- 最终文件为 `prototype-2d/assets/enemy-bear-battle-v1-sheet.png`：1774×887、978099 bytes，SHA256 `49cf7d76bc03808b7a7b8d0ec07e4c0fdd21876d4524a14d26b8ca1207b2571f`。它原样复制自工具结果，未脚本重绘、重编码或逐帧拉伸；10月10日恢复验收没有再生成图片。
- 本轮重新扫描为74份媒体、70个唯一SHA、4组可解释重复；manifest无缺失资源、无尺寸/bytes/hash差异。已有熊妖候选应继续复用，禁止再生成同用途副本。

## 帧契约与待验证项

`prototype-2d/assets/enemy-bear-battle-v1-frames.json` 保持 `approvedForRuntime:false`；manifest对应 `runtimeApproved:false`。PNG/JSON未加入生产加载器、静态服务或发布allowlist。

|状态|独立姿态|预览设定fps|
|---|---:|---:|
|idle|8|8|
|move|8|12|
|attack|8|16|
|hit|4|16|
|death|4|10|

这些是动作序列设定，不是实测游戏帧率。表为4行、每行8个姿态，间距不等；必须使用实测 `sourceRects`，不得均分图片。使用136源像素参考体高统一缩放，预览体高48/56/96px，左向镜像原图。

实测矩形包含全部alpha>8的像素，并向外留2px；矩形外仍有3629个极淡像素，最高alpha=5，不应声称保留全部非透明像素。复核未见明显裁切或邻帧混入，攻击行最小可见间隔35px。

预览固定行/列根点仍标为 `provisional`。move可见底部距48px预览基线约0.35～2.47px，尚需动态和局内地面接触检查，不能仅凭静态图断言是自然抬脚或没有漂浮。不同帧像素与32姿态数量也不能直接证明动画流畅、解剖连续或最终高帧质量合格。

## 本次真实验证

|检查|证据|结果与保证边界|
|---|---|---|
|最终PNG透明、隔离、尺寸、哈希、32独立块|`evidence/current/bear/asset-preflight.json`|10月10日新跑PASS；只读像素预检，不改图|
|真实Edge独立绘制|`evidence/current/bear/browser-preflight.json`|2026-10-10T04:46:20Z启动，约6秒结束；PNG解码、五状态8/8/8/4/4不同像素、左右镜像、91次绘制覆盖全部姿态、页面错误0|
|录像文件输出|`evidence/current/bear/animation-preview.webm`|293852 bytes，SHA256 `a7199c7410dac38f8d6004eb6843dce9a2cea043d36454db7a1b34c8742a29b7`；浏览器播放动作表的独立录像，不是直接生成视频或生产游戏录像|
|当前素材去重与登记|`evidence/current/asset-dedup-audit.json`|2026-10-10T04:56:52Z，74/70/4，PASS|
|当前运行代码回归|`evidence/current/validation.json`|`npm test`新跑至2026-10-10T04:57:07Z，PASS；17机制+11虎妖+8状态回归、四角色600秒、正常输入、对象池、渲染及平台桩|
|登记、运行隔离与包未改变|`evidence/current/bear/handoff-verification.json`|10月10日新查PASS；PNG/截图/录像哈希一致，候选未进入loader/serve/release，现有ZIP哈希/bytes不变，当前运行文件与前轮staging一致（网页debug发布替换除外）|

预览截图为同目录 `atlas-right-48px.png`、`atlas-left-48px.png`、`motion-sample-48-56-96px.png`，已目视复核。报告中的 `decoded` 仅指PNG解码；`previewRecorded`仅验证录像文件输出和非空阈值，**未额外回读解码/播放验收WebM**。91次绘制覆盖不保证编码器保留91帧或全部姿态，更不是稳定30fps证据。

本轮只有一个素材任务，浏览器串行；仅复用一个只读复核代理。此次预检报告 `browserClosed:true`、无cleanupError，说明脚本自建浏览器已关闭；该字段不代表整台机器不存在其他浏览器或后台进程。

收尾只读进程快照于2026-10-10T05:02:43Z未发现熊妖预检Node或Playwright Edge根进程；当时可用内存约21.5GiB/总31.9GiB。没有终止任何进程，不将一次快照当作未来无429或整机无浏览器的保证；原始数值保存在上述handoff-verification中。

### 失败与恢复记录

- `draft-preflight.json` 保留初稿31块的REVIEW，`layout-preflight.json` 保留编辑后32块的PASS，两者不互相覆盖。
- `browser-fail-1791552551296.json` 保留首次沙箱启动EPERM，不改成PASS。
- 旧录制只写出左右atlas后未完成，恢复时会话已不存在；无法证明当时具体卡在哪个await。`interrupted-recording-review.json`明确为INCOMPLETE，不计为浏览器通过。
- 预检脚本已改为有限Node驱动采集、阶段checkpoint、绘制循环总时限、浏览器evaluate与录像收尾/关闭超时；本次新运行完整结束。停止媒体轨道并关闭自建浏览器，避免无界等待占用素材通道。

## 下一步与发布边界

1. 下轮复用这份PNG/JSON，只接入首关普通熊妖，先验证身份隔离、统一比例和脚底/动作切换；不得让熊山君套用普通熊妖。
2. 接入时保持碰撞、伤害、随机数、移动和对象池规则不变；验证自然移动、接触攻击、受击、死亡、双朝向、暂停恢复及视野边缘，夹具与自然生产流程证据分开。
3. 通过真实游戏验证后才批准运行时并更新loader/serve/release边界。现阶段不改运行资源allowlist，不重建或部署10月9日本地候选包。
4. 其余6类普通怪、虎先锋、3名Boss动作，英雄最终高帧质量、整体遮挡和公网验收仍未完成；熊妖预检成功不解除上线阻断。外部公网上次502仍未解决，本轮没有公网重测。

10月9日的虎妖/状态/角色/整体游戏浏览器记录保留其原日期，不算作10月10日新跑；本次新增真实浏览器证据仅为普通熊妖独立素材预检。
