# 虎先锋根点/时序草案复核（REVIEW）

时间：2026-10-13T12:00:07Z 生成；npm test 归档于 2026-10-13T12:39:42Z。

本轮只复用完整32姿态候选表和现有两张源图。草案固定每页170/443源比例，横向源列登记和 idle/move/attack/hit 状态地平线是待评估假设；death 的最低可见像素包含刀，不能当作人体脚底。7/30/31 使用已有局部诊断参照转移，仍不构成语义对应点。没有改PNG、manifest、loader、renderer、引擎计时或发布包。

草案时序为 idle8、move12、attack16、hit16、death10 源姿态/秒；attack/hit 事件回移动，death 保持末帧。death 400ms 落在现有精英 death effect 420ms 内，草案没有延长伤害、受击、无敌或对象池计时。

真实 Edge 重新读取原始像素，完成 48/64px 双向注册对照、边界时钟、合成中断序列，并从实际录制 WebM 字节重新解码五个采样；五个采样签名不同，页面、console、请求和外网计数均为0。三张截图已查看。录制30只是请求采样率；没有人工动态观看、GPU/FPS测量或局内自然战斗验收。

结论：`REVIEW_FULL_STATE_REGISTRATION_TIMING_DRAFT`。草案可作为下一轮人工根点/换帧漂移审查输入；保持 `runtimeApproved=false`、`highFrameApproved=false`、`publicPass=false`，不接入、不打包、不部署。

## 静态根线与换帧漂移复核（13:11Z）

已查看 `registration-64-right.png`、`registration-48-left.png` 与 `playback-final-held-death.png`，并复核 `browser.json` 的64px alpha-centroid transition 数据。idle草案线上的最大相邻漂移为1.001×0.705px；move为5.931×3.007px，frame13保留约3.765px的源图离地间隙；attack为7.549×6.659px，来自真实挥刀/躯干变化；hit为1.284×1.453px；death为5.373×6.990px，来自倒地过程。草案比旧包围盒控制减少了idle/hit的包围盒跳动，但不消除姿态本身的运动。

静态检查认为状态地平线在截图中连贯，不能据此批准人体根点、连续性或局内读法。alpha质心包含刀、尾和其它外轮廓，所有数值均是换帧漂移诊断，不是脚底/骨骼测量；录屏仍未人工动态观看。完整记录见 `root-drift-review.json`，结论 `REVIEW_STATIC_ROOT_LINES_AND_FRAME_DRIFT`，保持全部运行时与发布门禁关闭。
