# 虎先锋既有overlay录屏的实际字节解码

时间：2026-10-14 08:39，北京时间（00:39Z）。结果：`REVIEW_RECORDED_OVERLAY_DECODE_ONLY`。

## 本轮事实

只读取15:47既有327646-byte WebM（SHA `bbb1880278853b09c4547e5ffe2e03eaa1f33ef3aca045ddfa47274dc99b9a7d`），由单个离线真实Edge解码，没有新绘制候选或重新录制。容器报告390×844、2.534066s；在0.25/0.95/1.65/2.025/2.40/2.50s请求seek，呈现帧回调实际mediaTime为0.236/0.937/1.635/2.003/2.370/2.468s。回调累计计数是6次采样的呈现次数，不是编码总帧数或FPS。

解码接触表已静态查看：文字分别为idle#1、move#10、attack#19、hit#25（左向）、death#30/#31；姿态单独可见，死亡采样没有站立姿态叠在上方。排除时间标签的ROI为x158/y332/225×175，五状态签名不同；签名只能确认像素差异，不能自动识别姿态或判断艺术/动画质量。

页面/console/失败请求/外网请求均0，浏览器和context已关闭，未启动服务。08:40:56本轮npm test PASS，完整输出`npm-test.txt`与`npm-validation.json`在本目录。102个受保护文件在浏览器及测试后哈希不变。

## 保留的采样器失败

00:37首轮虽技术解码成功，复用采样canvas未在drawImage前clearRect，透明图像source-over累积旧采样，导致hit/death多姿态残影及旧文字。这是检查脚本缺陷，首轮目录`../2026-10-14T00-37-24-661Z/`和`rejected-review.json`保留；不能将其接触表作为合格证据，也不能据此判源图或WebM有缺陷。补clearRect后关闭前一浏览器再串行复验，最终图无该采样累积。

## 结论边界

原录制调用`overlay.captureStream(30)`，只含透明overlay层，不含底层vector游戏；原动态PNG才有局内同屏背景。原rAF日志仅覆盖30个源索引，idle#6/#7未遍历，本轮没有全32帧解码证明。六个静态采样不是人工连续观看，death末帧快照不证明结束后保持，也不证明真实攻击/受击/死亡时序。

`codecDecodeOnly=true`、`overlayOnly=true`、`humanMotionReviewed=false`、`runtimeApproved=false`、`highFrameApproved=false`、`fpsAcceptance=false`、`publicPass=false`。候选和草案零生产引用，未生图、改生产、重建ZIP或部署。整体仍`NOT_READY`；下一步连续观看已有录屏并对照原局内图，未批准动作前不接入。
