# 历史冻结场景＋候选合成录屏审查

结果：`REVIEW_FROZEN_BITMAP_FULL32_COMPOSITE`，整体`NOT_READY`。本轮仅补完整源序列与带历史底图的证据层录制，未运行新游戏、素材生成、生产接入、打包或部署。

## 锁定输入与技术观察

- 候选表：`8ea3d6e36fd490f5f81f8a6b13b5f1166c41c7a88c73bf1648162bdf1b91f75f`；草案：`b1fc330ce13c962701b5ae38f36e23a96cd3154f7a025874c5ced29fa34a6cc5`。
- 历史背景：15:47原真实UI证据保存的冻结PNG，390×844、32172 bytes、SHA `6c203a3b82f093e562db5e404c80e420ed99a95604bc9b4724226efd24c62f9f`。当时vector场景time≈1.4328s，本轮`newGameInstance=false`、`realUiEntryThisRun=false`。
- 每tick清空并重绘底图，源绘制日志覆盖idle0–7/move8–15/attack16–23/hit24–27/death28–31全部32索引。680rAF只是绘制观察数量，`captureStream(30)`只是请求率；不是FPS。
- 合成动作区间0–1000/1000–1700/1700–2200/2200–2450/2450–2850ms；2850–3100ms为独立审查保持。move700ms含再次#8；hit250ms与death400ms/hold均不证明真实事件或计时支持，不改420ms死亡TTL。
- 录屏281422 bytes、VP9、SHA `01ba53ecb59c55549d57a740d3b3134640654df0ef06368338fe063a56df67e8`。实际字节解码390×844、容器时长3.126323s；7个seek样本背景ROI均值最大通道偏差1（门限15），确认保存的视频含历史背景，不是原overlay-only录像。

## 静态检查及明确边界

根代理静态查看6张fixture PNG与7张actual-byte decoded PNG；独立代理只读查看fixture-7/25/31及decoded-6，并核对这四图和视频的bytes/SHA。所看图中背景、玩家、标签保持，hit/death未见旧站姿/攻击累积；不以静态图批准流畅度。攻击刀与固定玩家头部有交叉，死亡躯干靠近固定玩家脚部；这是固定合成位置，不是自然碰撞、血量或全局遮挡验收。

顶部明确`EVIDENCE ONLY / HISTORICAL FROZEN PNG / NOT RUNTIME`，中部明确固定点/伪血条/非实时战斗；decoded-6另标审查保持。左右向是hit左、其余右的跨状态抽样，非每状态双向。根点/统一造型/节奏/局内高帧品质仍未批准。

解码PNG烧录标签可读为#0/#6/#12/#18/#25/#30/#31，不是精灵像素自动身份识别。seek请求依次.10/.925/1.45/1.95/2.35/2.775/3.05s，仅保存playhead，没有实际呈现回调mediaTime；最后保存样本标2986ms，不能称精确3.05s姿态或WebM最后编码帧。32源绘制覆盖不证明视频32姿态全覆盖；本新视频尚未连续播放/人工动态观看。

## 回归与保护

`npm test`本轮新跑：2026-10-14T00:59:07.412Z，exit0，validation PASS；完整输出`npm-test.txt`，归档`npm-validation.json`。113个受保护源/运行资源/旧证据/ZIP在浏览器前后及npm后哈希不变，新13图/视频/script也吻合报告。测试只为本地回归，不是公网、ZIP解压、高帧、FPS或设备PASS。

页面/console/失败请求/外网请求为0；context/browser关闭、tracksStopped=true，无服务。候选运行时引用0；web ZIP `9c9bd515b0e8dcb5c4d4101838f1ebc3679b0f425ab31685909503c9519ae097`、微信ZIP `f017493aaf8eeebccc1ac040ded0397a8bfcc4f8d0cbee56e6be5b04e4dec4e2`未重建。

`humanMotionReviewed=false`、`rootApproved=false`、`runtimeApproved=false`、`highFrameApproved=false`、`fpsAcceptance=false`、`publicPass=false`、`releaseReady=false`。下一步仅用单浏览器连续播放本已保存视频，核对实际呈现的完整idle与状态衔接；不再次录制、重生图、重复库存、接入或部署。
