# 玩家单次贴身深度草案：FAIL，证据层失败收尾

本轮单安全步是原玩家路径单次延期绘制的接触对照；当前不会继续修正或再开浏览器。Node四组调度守卫检查PASS，三次真实Edge草案均FAIL。证据不能扩展为生产、自然战斗、高帧/FPS、双方艺术可读性、公网或发布验收。

## 原始报告保留与范围

- browser.json（02:45Z）：200保护；原源命令/几何/反馈不变量错误，夹具未返回完整对照。只有真实UI入口图。
- diagnostic-browser.json（02:49Z）：202保护；像素支持域/源mask错误，仍未返回完整对照。只有诊断UI入口图。
- diagnostic-detail-browser.json（02:50Z）：204保护；保留完整before/after记录与6PNG，result=FAIL。当前脚本SHA 73f0437175bbffec1010f89292754f70879605adcfe10652ece7d743747ca9f1 匹配此末次；前两次脚本SHA不同，原版本源码未快照，不能声称由当前脚本精确重现前两次。

每次只一个Edge与服务，串行并已关闭。前三份报告及PNG不覆盖。入口debug=false、约1秒，随后清集合/300秒加速/重定位/直接伤害/25ms部分updateEnemies+updateEffects夹具均有显式写入；render/consumer检查仅证明对应观察路径不再写state/RNG，不将夹具称自然流程。

## 详细失败

末次27次render检查、6次consume检查、18次RNG调用。玩家两模式原方法各执行1次，drawImage序列从玩家→候选反转为候选→玩家，延期守卫接受。候选真实source/camera/body/bar及数字值、字段/TTL、最终paint、labelRects、空statusRects未变。

然而captures/playerCommands不变量失败；50条玩家命令差异均仅transform.e/f，args/styles/dash一致、a–d一致。真实hero source矩阵e从195变为195.00001621246338；f从422.39389475496137变为422.3938442102226。原world矩阵e从-1197.8571939468384变为-1197.857177734375，f从-1528.0000715255737变为-1528.0001220703125。候选矩阵不变。延期flush的额外setTransform与辅助canvas逐命令回填可能造成重建/栅格精度变化，但这是代码与日志支持的推断，未做同深度控制实验，不能确定唯一根因。

5671差异像素；报告以before/after完整玩家paint支持域alpha>0并集检查，域外21；三canvas任一通道差异计数50；玩家sprite alpha>8有6911像素、与candidate body交叠4616，完整after paint支持域8312。outsideActorOverlap=75仅诊断、不是门槛：candidate mask只有body无血条，不能泛称变化仅在双方身体交叠。extraMainCanvasActorOrOutlineDraws=0来自常量，不是独立instrumentation。玩家方法会泄漏部分绘制属性/当前path，故不宣称全部Canvas全局状态恒等。

独立代理静态PNG解码重算changedPixels5671、相对已保存after支持域外21，外21最大通道差2；变化包围x167–254/y352–457。before三mask没保存，因此sourceMaskDifferences50只能复核浏览器记录，不能由存盘PNG独立复算；支持域本身仍存在矩阵重建误差，21可能也包含透明量化/镜像重建影响。不以微小通道值放宽FAIL。

## 静态可读性与安全收尾

根代理静态查看全部8张PNG（前两轮UI各1、末次UI/对照/三mask6），独立 /root/player_depth_guard_review 看原深度/优先绘制/完整support3关键图并复核204保护、末次6图与当前脚本hash。优先绘制使玩家脸、胸身、抬手显露，但与虎先锋脸/肩臂仍紧密混叠，现有英雄少量重复源/裁切缺陷未修。既非人工连续动作审查，也不能批准双方可读性。

三次页面/console/请求/HTTP/外网错误0，context/browser/server关闭有记录；只有末次hook引用还原检查和dispose=true明确返回，前两次只能说明源码finally有还原路径并关闭context，不能虚报对应旗标。末次辅助画布降为1×1、pending清空；收尾读8088无listener。

2026-10-14T02:54:14.279Z 新npm test，exit0、完整49162字符输出已归档，未截断；npm-validation.json只证明当前workspace回归，不覆盖草案FAIL。post-test-integrity.json核204保护文件、三新脚本/Node/三FAIL、8PNG均不变，源PNG/两ZIP及候选表/motion/layout锁定哈希不变。未生图、录屏、生产接入、ZIP重建、部署或公网复验。四文档最新节同步FAIL。所有批准false，NOT_READY。

## 下一步

证据层同深度、单次玩家绘制的矩阵 round-trip 控制：隔离 getTransform→setTransform→原 translate/scale/rotate 是否引入 e/f 或像素差，另存前后三张透明mask供计数独立复算。保持严格阈值、原素材/位置/伤害/TTL/数字/血条；不再次以当前覆盖脚本重跑/覆盖三份失败，不接入生产/打包/部署。
