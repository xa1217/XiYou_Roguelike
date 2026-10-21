# 锁定合成录像连续播放审查

结论`REVIEW_FROZEN_COMPOSITE_CONTINUOUS_PLAYBACK`，整体`NOT_READY`。只解码原WebM，不生成图、不重绘候选、不重录、不运行新游戏/UI或服务，不改生产资源、ZIP或部署。

## 本轮实际浏览器证据

- 原视频281422 bytes、VP9、SHA `01ba53ecb59c55549d57a740d3b3134640654df0ef06368338fe063a56df67e8`；输入合成报告SHA `13612e911efa2a7c74f3d13129372715188082ac13137cddb053af2d8dde7839`。
- 单个离线真实Edge从currentTime0/rate1/paused到playing，再到真实ended/currentTime3.126323/readyState4；无seeking、seeked、waiting、stalled或error事件。
- 390×844；83个rVFC的mediaTime单调0.061→3.126s，最大观察间隔70ms。保留每回调presentedFrames、presentationTime、expectedDisplayTime与wallTime，不把这些计数当FPS或编码总帧数。
- 原尺寸提取标签200×72、精灵225×175组合成225×247像素；每回调/预播放采样均清空，无候选重绘或缩放。保存83回调PNG+1loadeddata PNG+3接触表。背景ROI均值最大通道偏差1（技术门限15）。

## 根代理与独立代理静态读取

双方按original尺寸逐格查看三张接触表；烧录标签0–31全部可读，详见`label-observation.json`，不是源日志最近目标推测。idle#6 cb19–22、#7 cb23–25；move#15 cb41–43→move#8 cb44→attack#16 cb45–46；hit#24 cb60、#25 cb61–62、#26 cb63、#27 cb64；death#28 cb65–67、#29 cb68–71、#30 cb72–73、#31 cb74–82，最后cb76–82明确审查保持。

三表未见旧站姿/攻击累积到受击/死亡，历史背景及固定玩家一致。页眉明确ACTUAL PRESENTED RECORDED PIXELS / HISTORICAL FROZEN COMPOSITE / REVIEW / NO FPS，标签不是自动精灵身份。攻击刀与固定玩家头部交叉，倒地邻近其脚部，静态源变化保留；不据固定位置批准自然接触、血条或全局遮挡。

这是AI代理静态标签读取，不是真人连续动态观看。烧录t与实际mediaTime属于不同录制/播放时钟，分别保存，不强制相等；例如末回调mediaTime3.126s、烧录t3085ms。83回调并未批准全编码帧或零掉帧；回调内PNG编码可能影响呈现覆盖，观察间隔不是源动画运动质量失败/游戏FPS判断。250ms审查保持不是运行时死亡TTL。

## 测试、保护与边界

2026-10-14T01:10:00.034Z本轮新`npm test` exit0、validation PASS；完整日志和归档保存，非复用上一轮PASS。131保护文件在浏览器前后及npm后SHA不变，87张新PNG与脚本也吻合报告。页面/console/失败请求/外网请求0，context/browser已关闭、无服务。

`humanMotionReviewed=false`、`rootApproved=false`、`runtimeApproved=false`、`highFrameApproved=false`、`fpsAcceptance=false`、`publicPass=false`、`releaseReady=false`。不是新UI、自然战斗、生产接入、最终视觉、ZIP解压、公网或微信验收。

下一安全小步仅建立证据层首关虎先锋真实身份/事件驱动预览，使候选跟随世界位置与真实攻击/命中/死亡事件；视觉时钟与原伤害/控制/死亡TTL隔离，未批准源不得写生产契约。不重复本次解码/播放/静态覆盖或库存，不生图/接入/打包/部署。
