# 伤害数字自身装饰覆字：有限修复

2026-10-11。本步只调整renderer中的绘制顺序，不生成素材、不修改引擎、不重建ZIP或部署。

旧顺序是数字描边→数字填充→星芒填充/描边；半透明实心星芒在相同坐标直接覆盖字形。修正为星芒填充/描边→恢复文字样式→数字描边/填充。保留原2.8/3.5描边、字号/颜色、位置/旋转、浮动进度、数量和生命周期。

## 实际证据

- `evidence/current/damage-labels/before/browser.json`：05:20:54.566Z→05:21:00.598Z，单Edge，首页→选角→战斗后通过合法移动输入产生真实伤害；8个固定renderer样本均观察到旧顺序，结果为 `OBSERVED_BASELINE_DEFECT`，不记PASS。
- `evidence/current/damage-labels/after/browser.json`：05:22:28.377Z→05:22:30.930Z，单Edge，同样的8样本（普通/暴击/整数/小数，两种剩余生命比例）全部满足文字最后绘制；另存自然伤害截图，不冒充固定夹具为自然玩法。页面异常、失败请求、console错误为0，browserClosed=true；局内仍为authoredFrames+vector、mapAssetDraws=0。
- 两版 `label-fixture.png` 已目视：数字不再被自身星芒覆盖。两版自然截图是独立真实流程、不是同seed逐像素比较；修复后仍存在数字压住角色身体的情况，未宣称避让完成。
- 修复前Canvas将2.8回读为2.799999952316284，原严格等号的描边检查因此为false。修复后验收使用1e-6数值容差，生产描边值未变；历史baseline报告保持原样，不回写成PASS。
- `prototype-2d/tests/damage-label-smoke.mjs`：6项新回归，验证绘制顺序、普通/暴击/小数字符及兼容输入、文字与星芒样式/几何不变、showHud:false、冻结输入/暂停确定性、真实伤害记录/TTL/池不变、空值有限坐标和Canvas栈平衡。独立末次05:23:47.231Z PASS，已接入npm gate。
- `evidence/current/damage-labels/npm-test.txt`、`evidence/current/validation.json`：05:23:34.967Z全套新跑PASS，包含八物种、原机制、四角色600秒、正常输入、对象池、渲染与平台桩。不是GPU或微信设备验收。
- `evidence/current/damage-labels/handoff-verification.json`：80份既有媒体和engine hash未改，修复后浏览器三个输入hash一致，两份dist ZIP hash未改。

原renderer和上一轮同名Node报告备份于 `work/damage-label-backup-20261011T0525Z/`。首次受限Edge启动EPERM单独留存，授权后串行成功；自己启动的服务已退出，05:24:34Z无8088/8091监听，没有停止无关用户进程。

本地公开入口/公网、ZIP解压网页、其它动画浏览器专项和微信实机未在本步重跑，旧报告按原时间解释。虎先锋、三Boss、最终英雄/蛇视觉、整体身体/血条/数字/HUD遮挡及发布门槛仍待完成，不上线。
