# 虎先锋局内动态候选叠加复核（evidence-only）

时间：2026-10-13 15:47:17Z

## 结论

真实 Edge 从首页点击进入选角和战斗，等待自然敌人出现后只冻结底层 RAF（保持 `engine.state.status=playing`，不打开暂停模态），在真实 vector Canvas 上附加独立 overlay canvas，以证据层 ghost 依次绘制 idle → move → attack → hit → death。最终结果为 `REVIEW_INCONTEXT_CANDIDATE_DYNAMIC_OVERLAY`。候选图、candidate table 与 motion draft 均未进入 loader、manifest 或 renderer。

## 本轮证据

- 390×844 场景，入口前自然状态 `screen=game`、`status=playing`、`time≈1.433s`、`enemies=1`、`rendererMode=vector`。底层暂停方式为取消 RAF 与 `game.running=false`，不是点击暂停按钮，也没有 `engine.pause()` 模态。
- overlay 是独立第二 canvas，固定屏幕锚点 `x=276`、`ground=474`、86px standing-reference 比例；不是生产敌人的世界坐标、碰撞盒或血条。五张截图已人工查看：idle #3、move #12、attack #23、hit #26（左向）、death #31（右向）。双向仍为跨状态抽样，不是每状态双向验收。
- 动态 overlay rAF 共 693 ticks、约2566ms，覆盖五状态；WebM 为 `327646` bytes、SHA `bbb1880278853b09c4547e5ffe2e03eaa1f33ef3aca045ddfa47274dc99b9a7d`。`captureStream(30)` 只记录请求值，不是 FPS 测量；录制轨道已停止，未人工观看动态视频。
- `browser.json`、底层截图、五张动态截图、WebM、`npm-validation.json` 与 `handoff.json` 在本目录。页面、console、失败请求、HTTP、外网请求均为0；浏览器已关闭，本地服务已停止。
- 15:32:12Z 沙箱 Edge `spawn EPERM` 失败保留；15:33 首次授权运行未等到敌人，脚本随后加入自然敌人等待；15:36 复核去除暂停模态后又校准 hit 截图时间，15:47 为最终有效证据。

## 未批准与边界

`overlayOnly=true`、`runtimeApproved=false`、`highFrameApproved=false`、`publicPass=false`。ghost 与 vector 玩家/敌人同屏不等于虎先锋运行时接入；冻结底层战斗不等于自然持续战斗，rAF tick 与30fps请求不等于 GPU/手机/微信 FPS。没有自然虎先锋身份、真实运行时血条/碰撞/攻击事件或移动端验收。未改生产素材/代码/manifest，未重建 ZIP、未部署。
