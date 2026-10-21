# 深度对照失败归档

结论为 FAIL，整体 NOT_READY。本轮只离线复核并归档已取得的真实Edge证据，不再启动浏览器，不生图、不改生产、不打包或部署。原始 browser.json/PNG 不改写；失败阈值不放宽。

根代理静态检查6份唯一图：真实UI、before/after主图、玩家完整paint proxy、玩家当前sprite proxy、候选sprite proxy。另3份after proxy与before字节相同；配对精确解码见 root-pixel-review.json。玩家面部、胸身显露更多，但玩家头部与虎先锋面部/护肩接壤和混叠，无敌环及黄色尾迹进一步交叉；不批准双方艺术可读性。

主图差异5139，完整玩家透明proxy alpha支持域外8；三proxy前后差0。支持域外8个像素的坐标、RGBA和通道差原样保存，不删除小差、不扩mask。这里是proxy代理，不是已证明的main精确支持域；未查明因果，不能称后端/抗锯齿问题或已解决。

相较前轮原链基线，新脚本采用逐命令getTransform→setTransform的proxy重放；仅主CTM未回填。它没有在同一run做同模式重复，未穷尽非玩家main trace和初始native path/clip/stack。50项玩家命令及已登记源/数字/血条/状态记录一致，不足以将当前FAIL升级为深度批准。

05:51缺失pathToFileURL导入后的离线ReferenceError、06:15 spawn EPERM、06:20像素FAIL保持独立报告和匹配SHA脚本快照。新npm test为本地项目验证，完整日志另存，不冒充浏览器/高帧/FPS/公网PASS。

独立代理只完成读取报告/脚本和门禁局限初步观察，随后503不可用；完整PNG、哈希和视觉独立复核未交付，具体见 independent-review.json。本轮不重试或新开窗口。

下一步只制定完整原链镜像与同run A/A/B/B诊断设计；新实验必须另立文件和证据，保持所有批准false及既有FAIL原字节。
