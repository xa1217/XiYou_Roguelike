# 虎先锋局内动态候选叠加复核（evidence-only）

时间：2026-10-13 15:39:40Z

## 结论

真实 Edge 从首页点击进入选角和战斗，等待自然敌人出现后冻结底层战斗画面，在真实 vector Canvas 上附加独立 overlay canvas，以证据层 ghost 依次绘制 idle → move → attack → hit → death。最终结果为 `REVIEW_INCONTEXT_CANDIDATE_DYNAMIC_OVERLAY`。底层仍不是虎先锋运行时素材；候选图、candidate table 与 motion draft 均未进入 loader/manifest/renderer。

## 本轮证据

- 390×844 场景，入口前自然状态 `screen=game`、`status=playing`、`enemies=1`、`rendererMode=vector`；冻结只取消 RAF 并设 `game.running=false`，没有 `engine.pause()` 模态，也不是点击暂停按钮。
- overlay 为独立第二 canvas，固定屏幕锚点 `x=276`、`ground=474`、86px standing-reference 比例；不是生产敌人的世界坐标、碰撞盒或血条。五张截图可读，包含 idle #3、move #13、attack #23、hit #28（左向抽样不足以代表每状态双向）、death #31。
- 真实 overlay rAF 共 694 ticks、约2564ms；`captureStream(30)` 只记录请求值，不是 FPS 测量。WebM 327? 以 `browser.json` 的最终字节数/SHA 为准，录制轨道已停止；未人工观看动态视频。
- `browser.json`、五张动态截图、底层截图、`incontext-dynamic-overlay.webm`、`npm-validation.json` 与 `handoff.json` 均在本目录。页面、console、失败请求、HTTP、外网请求为0；浏览器已关闭，本地服务已停止。
- 15:32:12Z 沙箱 Edge 启动因 `spawn EPERM` 失败并保留原始报告；15:33 首次授权运行未等到敌人，随后脚本加上自然敌人等待并于15:39复核通过。后者为本轮最终证据。

## 未批准与边界

`overlayOnly=true`、`runtimeApproved=false`、`highFrameApproved=false`、`publicPass=false`。ghost 与 vector 玩家/敌人同屏不等于虎先锋已接入；底层冻结战斗不等于自然持续战斗，rAF tick 与30fps请求不等于 GPU/手机/微信 FPS。没有自然虎先锋身份、真实运行时血条/碰撞/攻击事件或移动端验收。未改生产素材/代码/manifest，未重建 ZIP、未部署。
