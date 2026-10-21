# 牛版本地候选包验收

后续证据提示：普通苍狼候选预检已完成，但尚未接入或打包，本页牛版ZIP仍是当前本地候选。狼步骤重跑的同名Node/库存证据不属于本页包验收时点；本页原始Node/库存证据见`work/wolf-preflight-backup-20261010T091809Z/evidence-current/`。public实际解压网页报告本步未重跑，详情见 [WOLF-ANIMATION-HANDOFF.md](WOLF-ANIMATION-HANDOFF.md)。

日期：2026-10-10（Asia/Shanghai）。本步骤仅重建并验收本地候选ZIP，没有生成图片、改变玩法、上传或部署。其余动作、整体遮挡与公网仍未完成，不能上线。

## 当前候选包

|包|文件数|bytes|SHA256|
|---|---:|---:|---|
|`dist/xiyou-survivor-web-v1.0.0.zip`|46|12,591,435|`9c9bd515b0e8dcb5c4d4101838f1ebc3679b0f425ab31685909503c9519ae097`|
|`dist/xiyou-survivor-wechat-game-v1.0.0.zip`|25|5,043,614|`f017493aaf8eeebccc1ac040ded0397a8bfcc4f8d0cbee56e6be5b04e4dec4e2`|

网页比旧熊包增加牛模块、PNG及精简帧JSON。微信核心同步当前共享模块，但图片仍走原向量回退，AppID仍是`touristappid`；本次不是微信实机验收。

公开帧JSON仅输出`size/referenceBodyHeight/previewRootXs/previewBaselines/states/sourceRects`，状态和矩形子字段也受限。原始生成来源、prompt及批准记录保留仓库，不进入网页或包。验包核对内外manifest、显式allowlist、staging、当前源码、ZIP字节/SHA及禁止路径；既定私钥/本机路径标记扫描没有命中，不声称扫描穷尽一切秘密模式。

## 本次新证据

|范围|证据|结果与边界|
|---|---|---|
|Node门禁|`evidence/current/validation.json`、`bull/npm-test-release.txt`|09:04:57.601Z新跑PASS；17机制+11虎+13熊+13牛+8状态，四角色600秒、正常输入、池/渲染/平台桩及三物种公开帧契约；不是微信实机|
|旧包与证据备份|`bull/release-preflight.json`|旧包实哈希及13份上一轮证据核对通过；没有删除原项目/素材|
|候选ZIP内容|`bull/release-verification.json`|09:06:23Z PASS；网页46项/微信25项；实际解压至`work/release-validation/bull-20261010T090309Z/`，不是workspace替代|
|实际解压网页|`browser-public-smoke.json`|真实Edge报告标记09:07:24.501Z，目标`archive-extracted-bull-20261010T090309Z`；本地首页→选角→战斗、约9秒推进、四角色/虎/熊/牛资源、三份帧JSON、强制debug关闭与路径隔离通过|
|本地HTTP正文|`bull/release-http.json`|虎/熊/牛JSON GET/HEAD均200，正文及长度4473/4464/4464 bytes一致；正文、网页入口和牛PNG与实际解压件SHA相同|
|素材库存|`asset-dedup-audit.json`|本轮重新审计75份/71唯一SHA/4组解释副本；没有图片生成、重编码或改像素|
|最终汇总|`bull/release-handoff-verification.json`|新包、运行文件、截图/报告哈希、历史备份和未部署边界|

浏览器服务使用`SERVE_ROOT=<牛版ZIP解压目录>/web`、`SERVE_PUBLIC=1`，只绑定`127.0.0.1:8091`；测试URL带`?debug=1`仍关闭debug。7条控制台404全部对应刻意的阻断探测，pageErrors/failedRequests为0，不能写“控制台零错误”。报告`generatedAt`是启动/生成标记，没有脚本内结束时间。

已目视选角和约10秒战斗截图。选角卡面保持局外用途；战斗截图只证明该段入口/角色/安静向量场景正常，不能证明牛所有自然动作被看见、接触无遮挡、最终高帧美术质量或手机FPS。本轮没有重跑牛/熊/虎、角色动画、整体视觉、状态和音频的全部专用浏览器；上一轮动作接入证据仍按 [BULL-RUNTIME-HANDOFF.md](BULL-RUNTIME-HANDOFF.md) 的时间与范围解释。音频现存独立报告为10月8日，不计为本轮新验证。

牛PNG仍为1774×887、1,137,073 bytes、SHA256 `88835913f75054ec232ff3507d7a6fd27bde22ea40a7b004de028262e4408acb`。本轮只把manifest/源帧契约的生命周期说明改成“已入本地候选包”，批准状态和6字段运行投影不变；此类仓库元数据不影响已验ZIP字节。

## 失败、恢复与收尾

首次受限环境`npm run release`在子构建阶段失败，详细子错误码未被现有脚本输出；不捏造具体原因。原始输出保存在`bull/release-build-sandbox-fail.json`，授权重跑后通过。浏览器直接在授权下启动一个无头Edge，完成后关闭；没有并发浏览器或额外素材窗口。

构建前确认`F:/Project/Xiyou_Survivor_Commercial/dist`和`work/release-staging`的解析路径及无重解析点，仅清理/重建这两个生成目录。旧熊妖ZIP、完整`evidence/current`及旧素材manifest保存于`work/release-backups/pre-bull-20261010T090309Z/`，可恢复；原项目/legacy与现有素材未删除。

上一轮`bull/runtime-verification.json`中的旧包、metadata和同名Node/public证据哈希属于当时快照，应对照上述备份，不拿当前已覆盖的同名文件证明历史时点。旧熊包实际解压网页记录继续在`work/bull-runtime-backup-20261010T082708Z/evidence-current/browser-public-smoke.json`保留。

只复用一个只读审查代理，四个发布/服务文件检查已完成，无新增阻塞；未让代理写共享文件或开浏览器。自建测试浏览器与8091服务已退出，09:09:55Z授权只读快照无匹配的测试/无头浏览器/8091监听残留，可用20.92GiB/总31.9GiB。其余21个node后台进程未擅自终止，工作集约1320.4MiB；工作集可能共享页面，不是独占内存。详见`bull/release-process-cleanup.json`，不保证未来无429。

## 后续边界

普通虎/熊/牛均已入本地候选包，不再重复生成。继续串行查重后补5类普通怪（狼/猴/鹿/鹰/蛇）、虎先锋及3Boss专属动作，并整理英雄最终高帧质量和身体/血条/数字/HUD整体可读性。牛接触攻击被悟空遮挡仍是明确待办。

外部公网旧502本轮未重测，状态仍未通过；本地验包和网页PASS不能替代公网PASS。PNG请求自身缺挂起watchdog的既有边界未在本步骤解决。微信AppID/实机/商用服务依约延期。用户要求全完成才上线的条件仍未满足，未上传、未部署。
