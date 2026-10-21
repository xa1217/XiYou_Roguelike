# 虎先锋既有overlay录屏连续播放审计

时间：2026-10-14 08:47，北京时间（00:47Z）。结果：`REVIEW_RECORDED_OVERLAY_CONTINUOUS_PLAYBACK`。

单个离线真实Edge以正常1倍速度、无seek连续播放已有WebM原字节至真实ended。输入仍为327646 bytes、SHA `bbb1880278853b09c4547e5ffe2e03eaa1f33ef3aca045ddfa47274dc99b9a7d`；没有重绘候选或录新视频，没有游戏服务/联网/生产修改。

## 实际记录

390×844，容器时长2.534066s；loadeddata→playing→ended，播放结束currentTime=2.534066、paused=true、readyState=4。观察墙钟约2576.6ms，保存73次呈现回调；实际观察媒体时间0.101→2.534s，最大相邻媒体间隔69ms。首0.101s及间隔内未逐帧观察，不能宣称全部编码帧覆盖、零掉帧或由此反推游戏FPS。回调还执行像素读取和有限采样编码，观察器可能影响呈现。

复用原rAF源日志，按每个首次连续姿态区间的中点建立30个目标；在媒体时间附近提取225×175原尺寸ROI（排除顶部时间标签），最大目标距离39.2ms。目标编号是源日志估计，不是对解码姿态作自动身份识别；有损编码也不能要求像素与源PNG相等。

根代理和独立代理静态查看30格接触表，未见首轮透明画布未清空造成的旧姿态累积；hit四格可见单个左向姿态，death后两格为单个伏地轮廓。此为静态抽样观察，不是人工连续运动质量批准。全部采样前clearRect，30张ROI及接触表/逐回调报告保存于本目录。

页面/console/失败请求/外网请求0，context/浏览器正常关闭，未启动服务。08:49:24本轮npm test PASS，完整日志`npm-test.txt`与`npm-validation.json`归档。111受保护输入/素材/运行资源/原证据/ZIP在浏览器与测试后哈希不变。

## 门禁与下一步

原视频只有overlay，不含底层游戏；原源日志只有30个唯一姿态，idle#6/#7缺失。固定屏幕根点、伪血条、冻结vector底层和录制时序不是真实敌人世界位置或攻击/受击/死亡事件。`humanMotionReviewed=false`、`runtimeApproved=false`、`highFrameApproved=false`、`fpsAcceptance=false`、`publicPass=false`，整体仍NOT_READY。

下一步只补证据层缺口：一次完整idle周期，以及冻结底层+overlay的明确合成录制；标注非自然战斗，复用现有32姿态和草案，不生图、不改生产、不重建ZIP或部署。不再重复本次解码、30目标采样或既有库存审计。
