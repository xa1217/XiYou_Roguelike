# 熊妖版本地候选包验收

日期：2026-10-10（Asia/Shanghai）。这是历史熊妖候选包验收记录，包已由后续牛版替代，最新见 [BULL-RELEASE-HANDOFF.md](BULL-RELEASE-HANDOFF.md)。本节旧包可在`work/release-backups/pre-bull-20261010T090309Z/dist/`恢复；下列同名网页报告按`work/bull-runtime-backup-20261010T082708Z/evidence-current/`中的熊包阶段副本解释，不代表当前public文件。该阶段只完成本地重建与验证，没有上传、部署或重复生成图片；全完成才上线条件仍未满足。

## 包与运行边界

|候选包|文件数|bytes|SHA256|
|---|---:|---:|---|
|`dist/xiyou-survivor-web-v1.0.0.zip`|43|11,495,592|`66308f0516ac8ea68aaf35a42f4038ebdf9fd1fadd8f8f1503f926d4379d8468`|
|`dist/xiyou-survivor-wechat-game-v1.0.0.zip`|25|5,043,356|`b74a0b67f25a9ef01043e82b9876a7727b3ce6c40cd7272bd7e53a87dfe1d34c`|

`scripts/verify-release.ps1`核对ZIP路径、文件清单、内外manifest、serve运行白名单、staging及当前源文件；原生入口仅作debug硬关闭的预期变换。微信仍为`touristappid`、核心逻辑/向量回退，不是微信实机验收。包内没有legacy、历史证据、生成器、测试或本机账号配置；文本扫描也未见既定本机来源/私钥标记，此扫描不宣称穷尽所有秘密模式。

熊妖PNG保持1774×887、978099 bytes、SHA256 `49cf7d76bc03808b7a7b8d0ec07e4c0fdd21876d4524a14d26b8ca1207b2571f`。虎妖/英雄/图标/音频没有重新生成或重编码。

## 修复：运行帧JSON与来源信息分离

验包发现原始熊妖JSON带本机生成来源和提示词路径。仓库原件保留追溯，`scripts/runtime-frame-contract.mjs`供公共服务与release共同使用，显式投影`size/referenceBodyHeight/previewRootXs/previewBaselines/states/sourceRects`；状态仅5项，矩形仅6个子字段。通过原`attachTigerFrames/attachBearFrames`复验，不改变32姿态、比例或锚点。

专项覆盖顶层/嵌套私有哨兵排除、完整帧等价、幂等、坏矩形/未知契约拒绝、原始源文件不改；加入`npm test`。公共GET/HEAD使用投影后的正文长度，坏契约返回通用500，不把原JSON回传。生成器/追溯helper本身不进入运行包。

## 本次实际证据

- `evidence/current/validation.json`：本次重新运行npm test；17机制+11虎妖+13熊妖+8状态、公开帧投影、四角色600秒、正常输入、池/渲染/平台桩通过。
- `evidence/current/bear/public-contract-node.json`：两类契约最小字段和完整帧等价专项PASS。
- `evidence/current/bear/release-verification.json`：43/25项ZIP内容及哈希PASS；实际解压到`work/release-validation/bear-20261010T052706Z/`，不是用workspace冒充包测试。
- `evidence/current/browser-public-smoke.json`：2026-10-10T05:33:39Z真实Edge，目标`archive-extracted-bear-20261010T052706Z`；服务使用`SERVE_ROOT=<解压件>/web`及`SERVE_PUBLIC=1`，URL仅127.0.0.1。首页→选角→战斗、约9秒实时推进、帧变化、四角色/虎/熊资源及精确契约字段通过；`?debug=1`仍关闭debug，禁止路径404。页面错误/失败请求0，7条控制台404全部对应刻意探测，不是运行错误。
- `evidence/current/bear/release-http.json`：本地虎/熊帧GET/HEAD均200，正文/GET长度/HEAD长度分别4473/4464 bytes一致，不含来源/提示词字段。
- `evidence/current/bear/release-handoff-verification.json`：最终证据与源文件哈希、旧包备份、进程/内存快照和未部署边界。

已目视查看选角和约10秒战斗截图。截图只支持入口/资源加载与本地正常画面检查；不能据此宣布整体美术/英雄高帧质量或密集战斗遮挡合格。本次没有重跑熊/虎/状态/音频的全部专用浏览器，原动作接入证据仍按 [BEAR-RUNTIME-HANDOFF.md](BEAR-RUNTIME-HANDOFF.md) 的同日上一轮范围解释。

## 失败、恢复与收尾

首次沙箱构建在子进程阶段失败（详细spawn错误未被原脚本打印），授权后本地重建通过；首次浏览器启动明确`spawn EPERM`，授权单浏览器重跑通过。原失败分别保留`release-build-fail-*.json`、`release-browser-launch-fail.json`，不改写为PASS。

重建前旧ZIP和完整`evidence/current`已复制到`work/release-backups/pre-bear-20261010T052706Z/dist/`及`evidence-current/`。release只清理并重建已确认的`dist/`和`work/release-staging/`生成目录；旧包可从备份恢复，素材与原项目未删除。前一步`runtime-verification.json`中的旧包/旧证据哈希是当时快照，需对照备份，不是当前候选包结论。

仅复用一个只读复核代理，没有额外素材窗口或图片生成调用。自建测试浏览器及本地服务已关闭；2026-10-10T05:35:55Z只读快照没有匹配的smoke/服务/Playwright根进程，空闲内存约21.5GiB。它不证明整机无浏览器，也不保证未来无429。

下一步查重后串行补齐其余6类普通怪、虎先锋和3名Boss动作，并持续整理英雄最终高帧质量及整体可读性。公网旧502尚未重验，不把本地候选PASS当公网PASS。PNG请求本身没有挂起watchdog的既有边界仍未在本轮处理。
