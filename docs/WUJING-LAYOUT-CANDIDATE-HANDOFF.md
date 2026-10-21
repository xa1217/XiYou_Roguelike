# 悟净布局候选交接（2026-10-11 15:07Z）

本步只保留一次内置 `image_gen` 对现有悟净战斗动作表的候选编辑，并完成本地像素诊断与真实 Edge 预览；生产素材、运行时、发布包和公网均未改动。

候选证据目录：[`evidence/current/wujing-layout/2026-10-11T08-43-56-039Z/`](../evidence/current/wujing-layout/2026-10-11T08-43-56-039Z/)

- 原图：`prototype-2d/assets/hero-wujing-battle-v3-sheet.png`，1774×887，SHA256 `8788002d9482ab92797dc0dfb41742b28e811d18c5a764485c54ae1578dce747`；源文件与 manifest 保持一致。
- 候选：[`hero-wujing-layout-v1-candidate.png`](../evidence/current/wujing-layout/2026-10-11T08-43-56-039Z/hero-wujing-layout-v1-candidate.png)，1774×887，SHA256 `4f73bfe347907b17b10a56eb65bdd316e30ef5abef51a1ad23e525957091364f`。
- 原始提示词：[`prompt.txt`](../evidence/current/wujing-layout/2026-10-11T08-43-56-039Z/prompt.txt)；生成记录：[`generation.json`](../evidence/current/wujing-layout/2026-10-11T08-43-56-039Z/generation.json)。本步只调用一次内置 imagegen，候选原始 PNG 直接复制，未覆盖原图或重编码。
- 预检：[`preflight-2026-10-11T11-39-07-334Z.json`](../evidence/current/wujing-layout/2026-10-11T08-43-56-039Z/preflight-2026-10-11T11-39-07-334Z.json)。alpha>8 下有 8 个主体、上下各 4 个，但第 5/6 个姿态的完整矩形仍含邻人像素（tight 12/90，padding 27/178）；均分 4×2 单元会丢失主体像素并夹入邻人，30px 留白也不满足，结论 `REVIEW_LAYOUT_CONSTRAINTS_NOT_MET`。
- 真实 Edge：[`browser.json`](../evidence/current/wujing-layout/2026-10-11T08-43-56-039Z/browser-2026-10-11T11-41-39-224Z/browser.json)。单 Edge 155.0.4283.45 的候选专用 HTML/data-URL 预览完成，4 张截图、解码和 Canvas 绘制参数检查通过，页面/请求/console 错误为 0；这是候选观察证据，不是局内运行或 FPS 验收。
- 回归：[`npm-test.txt`](../evidence/current/wujing-layout/2026-10-11T08-43-56-039Z/npm-test.txt) 与当前 [`asset-dedup-audit.json`](../evidence/current/asset-dedup-audit.json) 均 PASS；80 份媒体/76 个唯一 SHA/4 组有解释副本。交接核验：[`handoff-verification-2026-10-11T15-07-50-494Z.json`](../evidence/current/wujing-layout/2026-10-11T08-43-56-039Z/handoff-verification-2026-10-11T15-07-50-494Z.json)，原图未变，135 个保护文件 SHA 未变。
- 独立复核代理两次分别遇到 `429 Too Many Requests` 与 `503 auth_unavailable`；已停止重试，没有伪造独立目视批准。根代理已查看原图、候选、网格/外扩/均分单元截图。

## 结论与下一步

候选保持证据区，`candidateLayoutPassed=false`、`runtimeApproved=false`、`highFrameApproved=false`，不接入 `native-app.js`、共享注册、serve allowlist、ZIP 或公网。它只说明“本次单张布局编辑仍不足以隔离 8 个完整姿态”，不能补齐真实高帧动作。下一步应先获得新的源级隔离方案（完整武器/衣物、统一比例、透明间距）再做固定根点和局内验证；在此之前不上线。
