# 原始变换调用链控制：重复主图 FAIL（证据层，未接入）

证据目录：evidence/current/tiger-vanguard/transform-chain-control/2026-10-14T03-29-15-654Z/
真实Edge 155.0.4283.45，2026-10-14 11:29（北京时间），390×844 / DPR1。只新增 scripts/browser-tiger-vanguard-transform-chain-control.mjs；原玩家→候选顺序保持，每帧原玩家方法1次。A记录且关闭镜像，B/C开启镜像并从原第一setTransform开始串行重放原save/restore/setTransform/translate/scale/rotate等链；辅助canvas每帧重置尺寸，不从getter回填矩阵、不新增主save/style或第二次玩家绘制。原/proxy Canvas方法调用、style同步和proxy矩阵检查的异常登记后抛出；不泛称所有原生getter观察都有独立异常登记。

## 失败与有限成立部分

- A→B主图差0（PNG字节与SHA相同）；B→C重复主图差265128，唯一失败门禁为noMainFramePixelChanges。早前“关闭→开启镜像产生差异”的commentary表述不准确，本记录纠正。
- 独立pngjs解码全部10PNG确认上述计数：B→C边界x0–389/y15–824，共772行，最大单通道差47；banner1201、顶部UI32788、战区230368、底部UI771。240667像素最大差1、20239差2、4222差≥3；红通道为主但不能称仅局部1–2误差。alpha通道差0。
- 三proxy前后各差0、并集0；alpha>0像素layer8343/sprite7465/candidate10705，仅透明栅格代理，不是精确main支持域。252980变化像素落在全部proxy alpha并集之外也是代理统计，不是生产支持域保证。
- 所登记A/B/C玩家50命令、两个精灵source/CTM、候选body、真实bar入口、数字最终paint/字段、frameContext开始/结束matrix/styles/dash/尺寸、30项原transform链严格一致。独立代理去除renderToken重构后无差。B/C逐矩阵检查均142，等于3×30+50+2；A为0。栈余额0、underflow false、捕获clip0。
- 28 render / 6 consume只读核验，18 RNG，renderer.elapsed固定1.001700000002981。页面/console/失败请求/HTTP/外网均0；hook引用还原、dispose、context/browser/server关闭明确记录。reviewer审查的是记录字段，不独立观测浏览器进程。

## 仍开放

根代理此前已看三主图+before-layer，本轮补看入口和剩余5proxy，共10PNG；主图肉眼接近不冲销像素FAIL，玩家仍被虎先锋遮挡。既有英雄源裁切/重复动作缺陷未修。入口是真实首页→选角→战斗、debug=false/time≈1s；之后明确300秒加速、集合清理/重定位、direct damage、25ms部分子系统夹具，非自然五分钟。只有hit26单目标、空状态牌，未验attack/death/双向全态/边缘/持续运动。

所登记不变量不等于全部原生Canvas状态：初始clip/path/save stack不能getter完整验证；背景/HUD等整帧paint参数没有穷尽记录，主context的backend/readback设置未记录。主Canvas连续getImageData导致栅格后端/量化变化只是假设，不是诊断。不能由矩阵相等+proxy重复稳定把本次整体升级PASS，亦不能认定上轮深度5671/21/50的唯一原因。

## 新回归与保护

本轮11:34:10–11:34:18新npm test exit0/PASS，完整49163字符原输出归档npm-test.txt；不把该PASS冲销真实Edge FAIL。首次11:33测试输出末尾VALIDATE PASS，但保存undefined session触发编排错误而未留exit元数据，已保存npm-test-first-capture.txt并明确重跑获取exit0；没有第二次浏览器运行。

根代理与独立代理分别核236保护文件、10PNG bytes/SHA/尺寸、脚本与browser报告；新npm之后全部未变。源PNG、candidate-table、motion/layout、网页/微信两ZIP不变。scripts SHA 58c9f24671f6990c373222a2a6c04befad55636c4fc9228500240140f0f8f4a9，browser SHA 5a02e103726d2fc23531106ff9700d0a63ac64ad6bd2e922450e491fcc7c356e。不生图/录屏、改生产或manifest、重建ZIP、部署、公网复验。所有可读性/motion/root/runtime/highFrame/FPS/public/release批准仍false，总体NOT_READY；前序三深度FAIL保留。

## 下一唯一安全步

仅建立证据层同深度、无proxy的主画布重复绘制/读取隔离控制：保持每帧原玩家方法1次，不改主Canvas创建配置、不重置主画布或放宽阈值；记录整帧背景/HUD等绘制参数、读取顺序及可取得的context属性，有限对照逐帧主画布读取与延后读取路径。先确认主图重复性，再另步恢复深度对照；保留本次FAIL及匹配脚本，不重跑覆盖、不接入/打包/部署。

