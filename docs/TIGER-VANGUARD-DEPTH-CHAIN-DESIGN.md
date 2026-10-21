# 原链深度重复控制：证据层诊断设计

状态：DESIGN_ONLY / BROWSER_NOT_RUN / NOT_READY。本次只制定、校验设计并运行本地项目测试；没有新网页验收，也不解释或冲销历史FAIL。

## 已锁定的输入与缺口

依据 STATUS.md、docs/REQUIREMENTS-ACCEPTANCE.md 与 depth-control/2026-10-14T06-20-05-385Z/closeout.json。旧结果仍为5139主图差、玩家透明代理支持域外8点、三种代理前后差0。8点坐标及RGBA保留于原 root-pixel-review.json；最大通道差1仍是严格FAIL，不改容差或扩大mask。

复用现有候选页、悟空源图、motion/layout/feedback/depth helper。已有用途、尺寸和SHA先校验，不生成图片。实现基底选 browser-tiger-vanguard-chain-png-control.mjs：它覆盖完整已登记main/annotation调用并镜像原变换链。旧transform-chain-control含交错getImageData且缺完整非玩家记录；新depth-control的逐命令proxy CTM回填和单A/B不能作为重复控制证明。

## 单次实验的固定次序

唯一Edge、唯一页面、唯一8088服务，真实首页→选角→战斗，先保存debug=false的入口。随后仍明确使用300秒加速、清集合、重定位、direct damage与25ms部分子系统夹具，不称自然五分钟。

| 帧 | 原玩家执行顺序 | 观察、导出路径 |
| --- | --- | --- |
| A1、A2 | 玩家→候选→反馈 | 两帧都开启同样完整trace与三proxy |
| B1、B2 | 候选→原玩家→反馈 | 两帧都开启同样完整trace与三proxy |

四帧在同一同步evaluate内完成；来源decode等await只能发生在四帧之前。不插入RAF、截图、引擎推进或额外等待，每帧原玩家与拦截方法各1次。三张390×844 proxy逐帧重置并复用；不重置或改变主Canvas创建属性、尺寸或DPR。每帧固定导出main→playerLayer→playerSprite→candidate，所有组相同。共16份夹具PNG加1份真实入口PNG；不录屏、不建立第二窗口。

main.getImageData拒绝守卫安装于来源decode后、恢复hook前，调用必须0；不是整个浏览器生命周期无readback，toDataURL本身也是readback。context/browser/server关闭后才离线解码PNG。分组次序仍存在历史/读取混杂，本实验不证明GPU/CPU、抗锯齿或getImageData因果。

## 原链与失败关闭

三proxy只重放实际原setTransform/resetTransform/translate/scale/rotate/transform/save/restore的原参数，首个实际命令必须setTransform。不得把getter矩阵回填到main或proxy。每次变换后的main与proxy CTM精确比较；每次paint前同步实际可用样式和dash，另表记录，不把proxy条目混入main不变量。玩家完整path/paint走原路径，当前sprite与候选仅镜像成功drawImage。

B只允许一次有明确tag的样式保存事务：记录排队入口与flush时实际CTM必须相同，save→原玩家样式/dash安装→执行同一原玩家→restore；记录恢复后状态精确等于flush前。事务的save/restore也镜像原链。无效token/身份/单目标/接触守卫、迟到/CTM不一致或重复pending一律记录FAIL，不能以fallback完成后仍算成功。

观察方法清单包括背景/世界/玩家/候选/血条/反馈/HUD/annotation的transform、path、paint、clip、dash、文本和measureText实际返回。全部实际draw源用稳定身份、来源文件、SHA、尺寸及本地HTTP字节回核。首玩家path必须beginPath；clip/未知Path2D/未锁源/非有限参数/未支持操作/trace超限/栈下溢或不平衡一律失败。保存方法入口前后实际CTM/全部可用style/dash/context属性、源参数与原Canvas异常；不能声称已穷尽Canvas API或直接证明初始native path/clip/stack。

## 精确对照门槛

1. A1=A2、B1=B2：完整main trace、原顺序、engine/RNG/renderer elapsed/UI/视野/CTM/styles/数字与血条记录及主PNG逐RGBA零差。
2. 跨A/B比较先将state ID解引用为实际值、image ref映射为锁定来源，保留完整原日志；只去掉renderToken等明确登记的观察标签。不能整段删除transform、style或未识别字段。
3. 跨模式玩家段逐命令恒等（包括原transform）；非玩家段只允许移除移动的player段和精确标记的一次depthTransaction。其余背景/候选/bar/feedback/HUD/annotation的调用、参数、实际入口状态与相对顺序必须恒等；若不恒等，保存差异，不靠扩大白名单解决。
4. 三种proxy的四帧PNG精确相同。四组A1/B1、A1/B2、A2/B1、A2/B2主差图的坐标和RGBA必须相同。跨模式变化须大于0，玩家前后alpha>0并集外变化必须0，双方alpha>8交叠须大于0。任何非零异常均FAIL，保留全部域外坐标/RGBA，不做膨胀或通道容差。
5. 零页面/console error/warning/HTTP/失败请求/外网；保存cleanup、hook引用还原、dispose与8088零监听证明。来源、历史FAIL、生产资源及两ZIP的保护哈希前后一致。

四帧内的主图精确零差控制失败，就没有可解释的深度对照；不继续生成素材、接入或发布。proxy重复成立也不自动证明其与main精确支持域等价。

## 归档与结果边界

另建版本化脚本和唯一新目录，冻结实际执行脚本、完整trace、原PNG、导出顺序、来源/保护哈希、离线像素明细和新npm test完整日志。不得覆盖任何旧报告、截图或执行脚本；权限/连接失败另记录，不冒称浏览器已运行。允许的最高结果仅 REVIEW_EVIDENCE_ONLY，所有艺术、动作、根点、运行、高帧、FPS、公网和发布批准仍false；全局可读性、双向全姿态、死亡、状态牌、自然流程另验。

当前机器可读方案见 scripts/tiger-vanguard-depth-chain-plan.json。verify-tiger-vanguard-depth-chain-design.mjs仅校验方案、反例、库存与保护哈希、执行本地npm test；不会启动网页。下一安全步为实现一个新版本的诊断脚本并先静态审核，不直接重复旧FAIL脚本或接入生产。
