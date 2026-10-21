# 同深度矩阵round-trip控制：诊断完成，不是深度修复PASS

A在原玩家入口读取CTM；B读取相同值后一次六数setTransform。两模式保持原player→candidate顺序、原玩家方法各调用一次，没有新增主Canvas save/restore或style/dash安装。辅助画布逐命令镜像，实际bar入口CTM/参数另记录，未把screenBox当实际绘制证明。

单真实Edge 155.0.4283.45 首页→选角→战斗，debug=false/time 1.0012999999970211，随后明确300秒加速、重定位/direct damage/25ms部分updateEffects/updateEnemies夹具，非自然五分钟。9PNG是UI入口、A/B主图、A/B各3透明proxy。未生图/录屏、改生产/ZIP、部署或公网复验。

## 观察结果

DIAGNOSTIC_COMPLETED_SAME_DEPTH_TRANSFORM_ROUND_TRIP 的12项控制检查true；strict matrix equality=false/full-frame pixel equality=true/mask equality=false，都是诊断字段，不是宽松深度批准。

入口world e/f从(-1197.8571939468384,-1528.0000715255737)变为(-1197.857177734375,-1528.0001220703125)；hero source e/f从(195,422.39389475496137)变为(195.00001621246338,422.3938442102226)。50个player-command CTM、candidate-source、health-bar-entry和2个feedback-paint CTM都微变。非矩阵args/styles/dash、世界几何/理想screenBox、数字字段/TTL/labelRects/空statusRects以及pair state/RNG/renderer.elapsed相同；不能把剥离CTM的不变量称完整绘制恒等。

主图变化像素0，两PNG字节/hash相同（8f37c5e614c1db56d5956ea76c19f76bfbd59596adda189bbc73a63611d70ba8）。proxy差playerLayer56/playerSprite82/candidate0、并集82；所有before/after mask已保存，独立代理逐类复算一致（fullLayer最大通道差5、sprite最大8）。outsideMirroredPlayerPaintProxy=0仅因为主图无变化，不证明proxy精准覆盖main支持。

该setter+后续原变换链在本夹具可产生微矩阵差与proxy漂移，但没观察到main栅格变化；不能解释上轮5671变化/21域外/50mask差的唯一原因。跨轮hero a/c朝向符号反转（本轮a<0,c>0），renderer.elapsed=1.0012999999970211、RNG14，非旧轮同一完整冻结姿态。根代理看9图；独立 /root/player_depth_guard_review 解码9图并复算0/56/82/0/82、核218保护/hash。玩家仍被虎先锋身体遮挡，未审自然运动/双方最终可读性。

## 局限与收尾

原Canvas调用在镜像try/catch之外，renderer可能吞该层异常；页面/console错误0、fixture.errors=[]只按实际记录描述，不能保证所有原Canvas调用未异常。PNG.kind仍为旧single-player-depth措辞，report scope、目录、文件名、主图header明确本次transform control，不是深度复验。保持运行脚本/报告原字节；当前逐命令CTM回填proxy是待验证方法，不当精确main支持域。

27render/6consume只读检查、14RNG，pair renderer.elapsed不变；hook引用还原（含bar）、三canvas降1×1、dispose/context/browser/server关闭均明确记录，8088收尾无listener。页面/console/请求/HTTP/外网错误0，旧三depth FAIL保留。

新npm test 2026-10-14T03:11:48.194Z→2026-10-14T03:13:17.910Z exit0，完整49163字符输出未截断归档；证据脚本另node --check。npm gate不执行证据脚本，PASS仅本地workspace回归，不覆盖旧草案失败/艺术/高帧/FPS/公网/发布包验收。218保护、9PNG、脚本/browser报告新哈希不变，候选表/motion/layout/源PNG/两ZIP不改。四文档同步本轮诊断，整体NOT_READY，所有批准false。

电脑操作技能促使先审本地控制与确认范围，实际沿用项目既有单浏览器CLI验收入口，没有操作用户桌面窗口或第三方发送/上传。

## 下一步

仅建立证据层原始变换调用链镜像草案（包含玩家入口前world链、原setTransform参数及translate/scale/rotate/save/restore），不逐命令从getter回填矩阵；先保持同深度、单次玩家原方法，核源矩阵逐值一致、主图与重复proxy稳定，原Canvas异常先登记再抛出并保存完整前后mask。稳定也不自动证明透明proxy是精确主Canvas支持域；完成控制后另步恢复深度对照，不本轮接入/打包/部署。
