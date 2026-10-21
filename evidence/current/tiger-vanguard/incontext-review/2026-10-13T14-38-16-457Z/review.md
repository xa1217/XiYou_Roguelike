# 虎先锋局内候选叠加复核（evidence-only）

时间：2026-10-13 14:38:16Z

## 结论

`browser.json` 的结果为 `REVIEW_INCONTEXT_CANDIDATE_OVERLAY`。真实 Edge 从首页点击进入选角和战斗后，在暂停的游戏画布上另加一个独立 canvas，静态绘制虎先锋候选的 idle / move / attack / hit / death 五个抽样状态。底层游戏仍为 `rendererMode=vector`，候选 PNG、候选表和时序草案没有运行时引用；这是局内可读性证据层，不是运行时接入、动态动画、高帧、当前 ZIP 或公网验收。

## 已核对

- 场景为 390×844、Canvas 390×844、`status=paused`、`time≈1.237s`、1 个敌人；页面、console、失败请求、HTTP 和外网请求均为 0。
- 候选表 32 姿态分布为 idle8 / move8 / attack8 / hit4 / death4；v1 源图 1774×887，局部补丁 2172×724，SHA 与 `browser.json` 一致。
- overlay 使用独立 canvas，固定屏幕坐标 `x=276`、`ground=474`，86px standing-reference 比例；这不是生产敌人的世界坐标、真实血条或碰撞位置。
- 五张状态图可读：idle 接地、move 保留离地姿态、attack 挥刀、hit 左向、death 末帧。双向仅在不同状态抽样（hit 左向，其余右向），不是五状态各自双向验收。
- “暂停”由页面脚本取消 RAF 并调用 `engine.pause()` 后绘制，不是点击暂停按钮的交互验收；death 只抽取末帧，不证明死亡计时/TTL/末帧保持。
- 保护文件 SHA 前后不变，浏览器和本地服务均已关闭。`npm-validation.json` 归档的是同一工作区本地 `npm test`，其 PASS 不扩展到公网或 FPS。

## 未批准与后续边界

`runtimeApproved=false`、`highFrameApproved=false`、`publicPass=false`。未写 manifest、loader、renderer 或引擎，未重建 ZIP，未部署。仍需在真实自然战斗中验证接地、朝向、血条、攻击可读性、连续换帧和实际 FPS；不能把本 overlay 或本地回归 PASS 当作最终通过。
