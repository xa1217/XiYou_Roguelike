# 需求 → 实现 → 验收

## 原玩家单次贴身深度对照（2026-10-14 14:20，北京时间）：真实网页仍FAIL，保留原始证据

本轮安全步仅复核并归档深度失败，不再启动浏览器或生图，不修改生产、ZIP或公网部署。唯一真实Edge首页→选角→战斗后使用明确300秒加速、清集合/重定位/direct damage/25ms部分子系统夹具，非自然五分钟。证据 `evidence/current/tiger-vanguard/depth-control/2026-10-14T06-20-05-385Z/` 为 **FAIL**：5139个主图差异像素，玩家完整透明proxy并集外8个；三组proxy前后差均0、alpha>8双方交叠4062、玩家proxy alpha>0为8449。唯一失败门禁为 `mainPixelsChangedInsideWholePlayerSupport`，不加容差、不扩大mask、不改判定。

原玩家/拦截各1次，原玩家→候选确实反转为候选→原玩家；已覆盖玩家50项命令、实际源参数/矩阵/样式、数字/血条/状态与RNG记录一致，main CTM未回填，血条样式事务有记录；守卫期间额外main.getImageData调用0，toDataURL仍是readback。**本脚本proxy采用逐命令矩阵回填，不是前轮完整原变换链镜像；本run只保存A/B各1帧，没有同run A/A或B/B重复控制，完整非玩家main trace及初始native path/clip/stack未证明。** proxy与实际main支持域等价仍false，不能断言8像素的后端/抗锯齿因果。根代理静态看两主图与三种proxy等6份唯一图：悟空脸/胸身显露更多，但与虎先锋脸/肩臂和无敌环仍混叠，双方艺术可读性未批准。

05:51离线解码漏导入导致ReferenceError、06:15服务子进程spawn EPERM、06:20像素门禁FAIL三份报告均保留，按记录SHA保存执行脚本快照；仅修复node:url导入后经权限审查完成06:20单Edge，未将前置门禁冒充网页PASS。302保护文件、9PNG、脚本/报告与两ZIP核验见本轮closeout；全新npm test完整输出见 `npm-test.log`/`npm-test.json`，本地测试不冲销网页FAIL。context/browser/server关闭、hook恢复与dispose有记录，页面/console error/warning/请求/HTTP/外网0，8088监听核验另记。独立代理完整复核因503不可用未交付，只返回初步门禁/支持域局限观察；不冒称完整独立PASS、不重试制造并发。总体 `NOT_READY`，所有艺术/motion/root/runtime/highFrame/FPS/public/release批准false。

下一安全步：只制定“完整原变换链镜像、同run A/A/B/B、完整非玩家main trace”的证据层诊断设计，保留本轮8像素精确坐标和原始FAIL；先证明同模式重复与观察路径，不能用历史稳定结果替代本run控制。不接入、打包、部署或放宽门槛。下文“下一步”为历史。

## 无额外main.getImageData的原链镜像基线（2026-10-14 12:16，北京时间）：单例稳定，仅证据层REVIEW

仅新增证据脚本 `scripts/browser-tiger-vanguard-chain-png-control.mjs`，唯一真实Edge首页→选角→战斗（debug=false、time≈1s）后仍明确300秒加速、清集合/重定位/direct damage/25ms部分子系统夹具，非自然五分钟。六帧同一同步evaluate，无await/RAF插入；帧1–3关闭镜像，帧4–6启用3张透明proxy并逐帧重置390×844，从首个原setTransform镜像完整原变换链，原玩家→候选、原玩家与拦截各1次。main.getImageData拒绝守卫在来源decode后安装至hook恢复期间调用0；不泛称整个浏览器生命周期无读取，main/proxy.toDataURL仍是readback。

证据 `evidence/current/tiger-vanguard/chain-png-control/2026-10-14T04-16-08-521Z/` 为 `REVIEW_EVIDENCE_ONLY_SAME_DEPTH_CHAIN_PNG_BASELINE`：六主PNG全部同SHA，五个相邻精确RGBA比较差0；逐帧保存的9proxy PNG按种类4→5/5→6差均0，alpha>0像素playerLayer8323/playerSprite7465/candidate10705。六帧已覆盖main/annotation/source记录严格相同：每帧395命令、74状态、26 style键、33 transforms；玩家58=8transform+50path/paint。开启帧各151矩阵核=3×33+50+1+1、203独立proxy表条目=99transform+52paint+52style安装，proxy四表对frame4逐值一致；main不变量不混入proxy记录。三个真实来源ref/尺寸/SHA、两本地HTTP回核、最终数字/bar、完整view/HUD/UI/engine/RNG/elapsed及CTM/styles/dash/实际TextMetrics皆无差，栈余额0/clip0，主尺寸与context创建配置未改。

根代理静态看16PNG的5张唯一字节内容，独立代理解码全部16PNG并复核完整trace、276保护及冻结script/report哈希；**主图虎先锋仍明显遮住悟空面部、胸身和手臂，双方可读性未通过**。本轮稳定不冲销三深度FAIL、原链FAIL和无proxy读取顺序FAIL，也不证明getImageData或GPU/CPU后端因果：跨run elapsed/RNG不同，annotation文案改变、组序和导出历史混杂，不能跨run像素归因。proxy仅透明栅格代理，精确main支持域等价与初始native path/clip/stack未证明；willReadFrequently:true是请求属性，不是已确认CPU backend，console warning0也不识别实际后端。

31render/6consume/20RNG，elapsed固定1.004100000001491；hook引用还原、dispose及context/browser/server关闭记录齐全，页面/console error/warning/请求/HTTP/外网0。12:17:08–12:17:15新npm test exit0/PASS，49163字符完整输出归档，独立于网页证据层结果；276保护和16PNG/script/report、素材/候选表/motion/layout/两ZIP未变。未生图/录屏、生产修改、打包/部署或公网复验；总体 `NOT_READY`，可读性/motion/root/runtime/highFrame/FPS/public/release批准仍false。

下一安全步：仅新增证据层“无额外main.getImageData、原玩家单次贴身深度对照”脚本，先在同一run保留同深度重复控制，再尝试原玩家路径延后至候选之后、反馈之前；不getter→setter回填矩阵，不新增第二次人物绘制。保存前后完整三proxy PNG、实际源参数/CTM/styles、数字/bar/engine/RNG/UI，关闭浏览器后精确解码；支持域外零变化及双方艺术可读性仍严格审查，任一FAIL保留匹配脚本，不放宽门槛、不接入/打包/部署。 下文“下一步”为历史。


## 无proxy主图重复/读取顺序控制（2026-10-14 11:55，北京时间）：仍FAIL，不依赖人物镜像复现

仅新增证据脚本 `scripts/browser-tiger-vanguard-main-readback-control.mjs`，不改生产主Canvas创建/尺寸/绘制顺序，不建proxy。单真实Edge进入首页→选角→战斗后仍明确300秒加速、清集合/重定位/direct damage/25ms部分子系统夹具；非自然五分钟。六帧同一同步evaluate，无await/RAF插入；原玩家→候选，玩家原方法各1次。

`evidence/current/tiger-vanguard/main-readback-control/2026-10-14T03-55-06-392Z/` 为 **FAIL**：帧1–3只主PNG，帧4–6主PNG→getImageData；关闭浏览器后解码，1→2/2→3/3→4/4→5差均0，5→6差265010（唯一失败门禁allSixPngPixelsStable）。同帧4/5/6 PNG与各自1316640字节RGBA8/sRGB raw差0。独立解码7PNG/3raw确认：bbox x0–389/y15–824、772行、最大通道差47；banner1129/顶部UI32788/战区230322/底部UI771，239969像素最大差1/20409差2/4632差≥3，不能称只在人物边缘发生的微差。

完整已覆盖main方法记录六帧严格相同：每帧395命令、74状态、26 style键、33 transforms；玩家58方法含transform、annotation5方法入独立segment，contextAfter在banner之后。三个真实图源ref/尺寸/SHA及两本地HTTP回核、原view/HUD、engine/RNG/elapsed、完整原UI/press/joy/input、CTM/styles/dash及measureText实际指标皆核对无差。没有active motion/press/RAF，栈余额0/clip0。此单例无proxy也能复现主图不稳定，镜像不是复现该观察现象的必要条件；**不证明getImageData或后端因果**。PNG-only本身仍是readback，两组顺序/历史混杂；context attrs相同（willReadFrequently=false等）不识别实际GPU/CPU backend，console warning未收集。方法入口状态不是逐setter跟踪，初始native path/clip/stack仍不可完整直接验证；跨轮elapsed/RNG等不同，不作跨run像素归因。

根代理看全部7PNG，独立代理复算完整trace、PNG/raw与256保护哈希，玩家仍被虎先锋遮挡。31render/6consume/16RNG，elapsed固定1.0036999999955305；hook引用还原、dispose及context/browser/server关闭均记录，页面/console error/请求/HTTP/外网0。11:57:19新npm test exit0/PASS完整归档，不覆盖网页FAIL；256保护、7PNG/3raw/scripts/report及源图/候选表/motion/layout/两ZIP未变。未生图/录屏、改生产、打包/部署/公网复验；前序三深度FAIL和原链FAIL保留。总体 `NOT_READY`，当前可读性/motion/root/runtime/highFrame/FPS/public/release批准仍false。

下一安全步：仅建立证据层“无额外main.getImageData的同深度原链镜像基线”：单真实Edge六帧，原玩家各1次、原顺序，完整main/annotation/source trace保持；原始变换链镜像及proxy调用/读取另表，逐帧保存主/proxy PNG后在关闭浏览器后解码比较。main.toDataURL仍为readback，不称无读取或无干扰；另记console warning供诊断，不变主context创建/尺寸/阈值、不宣称跨run像素恒等或已证明读取因果。保留匹配FAIL，先确认该基线重复性，再另步恢复深度对照，不接入/打包/部署。 下文“下一步”为历史。


## 原始变换链控制（2026-10-14 11:29，北京时间）：重复主图 FAIL，未恢复深度对照

仅新增证据脚本 `scripts/browser-tiger-vanguard-transform-chain-control.mjs`；A只记录、B/C从本次draw首个原setTransform开始镜像原save/restore/translate/scale/rotate等链。辅助canvas每帧重置，不getter→setter回填或新增主save/style；原玩家→候选顺序不变，A/B/C玩家原方法各1次。单真实Edge首页→选角→战斗后仍明确300秒加速、重定位/direct damage/25ms部分子系统夹具，非自然五分钟。

`evidence/current/tiger-vanguard/transform-chain-control/2026-10-14T03-29-15-654Z/` 为 **FAIL**：A关闭→B开启镜像主图差0，B→C同模式重复主图差265128（唯一失败门禁noMainFramePixelChanges）。早前commentary将差异归于关闭→开启不准确，此处纠正。独立解码10PNG复算一致：边界x0–389/y15–824、772行、最大单通道差47；banner1201/顶部UI32788/战区230368/底部UI771。240667像素最大差1、20239差2、4222差≥3，不能称仅人物边缘微差或放宽门槛。

所登记源CTM、50项玩家命令、候选body、bar入口、数字paint/字段、frameContext开始/结束matrix/styles/dash/尺寸及30项transform链A/B/C严格相同。B/C主/proxy逐矩阵检查各142=3×30+50+2，A为0；三proxy前后各差0、并集0，alpha>0像素layer8343/sprite7465/candidate10705。矩阵/重复proxy成立不冲销主图FAIL；透明proxy不是精确main支持域，初始clip/path/native stack仍不能完整直接验证，整帧背景/HUD paint参数及backend/readback配置未穷尽记录。栅格/读取后端变化只是尚未隔离的假设，不是诊断或上轮深度失败的唯一原因。

根代理静态看全部10PNG，独立代理解码/重构记录及核236保护文件、图/scripts/report哈希；玩家仍被遮挡。28render/6consume/18RNG，elapsed固定1.001700000002981，hook引用还原、dispose及context/browser/server关闭均记录，页面/console/请求/HTTP/外网错误0。本轮11:34:10新npm test exit0/PASS完整归档，不能覆盖网页FAIL；首次输出保存编排错误与再次测试说明一并留存，无第二次浏览器运行。236保护、源图/候选表/motion/layout/两ZIP不变；未生图/录屏、改生产/打包/部署/公网复验。总体 `NOT_READY`，所有可读性/motion/root/runtime/highFrame/FPS/public/release批准仍false，旧三深度FAIL保留。

下一安全步：仅建立证据层同深度、无proxy的主画布重复绘制/读取隔离控制：保持每帧原玩家方法1次，不改主Canvas创建配置、不重置主画布或放宽阈值；记录整帧背景/HUD等绘制参数、读取顺序及可取得的context属性，有限对照逐帧主画布读取与延后读取路径。先确认主图重复性，再另步恢复深度对照；保留本次FAIL及匹配脚本，不重跑覆盖、不接入/打包/部署。 下文“下一步”为历史。


## 同深度矩阵回填控制（2026-10-14 11:09，北京时间）：复现微差，主图无变化，不批准深度

仅新增 `scripts/browser-tiger-vanguard-transform-control.mjs`，A读入口矩阵、B只回填同样六数，原玩家→候选顺序和每模式原玩家方法1次不变；无新增主Canvas save/restore/style/dash安装，实际玩家/候选/血条入口/数字paint矩阵均记录。单真实Edge首页→选角→战斗后明确300秒加速、重定位/direct damage/25ms部分子系统夹具，非自然五分钟。

`evidence/current/tiger-vanguard/transform-control/2026-10-14T03-09-23-021Z/` 为 `DIAGNOSTIC_COMPLETED_SAME_DEPTH_TRANSFORM_ROUND_TRIP`：world与hero e/f微差复现，但两张主图逐像素相同（变化0，PNG SHA相同）；前后透明proxy差playerLayer56/playerSprite82/candidate0、并集82。不能将proxy差视作主画布变化或上轮5671/21/50的唯一根因；本轮玩家a/c朝向符号、elapsed/RNG与上轮不同。候选/血条/数字CTM也微变，只有非矩阵args/styles/几何/字段/TTL及state/RNG/renderer.elapsed相同，不能称完整源矩阵恒等。

根代理看9PNG，独立代理解码复算0/56/82/0/82并核218保护/scripts/hash，玩家仍被遮挡。三proxy是镜像栅格代理，不是精确main支持域；原Canvas调用在镜像catch外、可能被renderer吞异常，PNG.kind残留旧depth措辞，均记局限并保留实际运行脚本/报告原字节，不升级为深度/艺术PASS。

27render/6consume/14RNG，hook引用还原、dispose及context/browser/server关闭明确记录，页面/console/请求/HTTP/外网错误0。本轮新npm test PASS完整归档，218保护、9图/scripts/报告不变，旧三FAIL保留；不改素材/生产/ZIP、不录屏/部署/公网复验。总体 `NOT_READY`，所有可读性、motion/root/runtime/highFrame/FPS/public/release批准仍false。

下一安全步：仅建立证据层原始变换调用链镜像草案（包含玩家入口前world链、原setTransform参数及translate/scale/rotate/save/restore），不逐命令从getter回填矩阵；先保持同深度、单次玩家原方法，核源矩阵逐值一致、主图与重复proxy稳定，原Canvas异常先登记再抛出并保存完整前后mask。稳定也不自动证明透明proxy是精确主Canvas支持域；完成控制后另步恢复深度对照，不本轮接入/打包/部署。 下文“下一步”为历史。

## 玩家单次贴身深度草案（2026-10-14 10:50，北京时间）：真实网页严格对照 FAIL，未接入

仅新增3份证据层脚本，精确首关调度身份、单活体、接触/后方、空effects/projectiles守卫；4组Node PASS仅证明调度边界。真实Edge首页→选角→战斗之后仍是明确300秒加速、重定位、direct damage及25ms子系统夹具，非自然五分钟。只将同一次原玩家调用延至候选之后/原反馈之前，完整玩家影子、尾迹、受击与无敌环也随原路径绘制；没有新增轮廓方案。

`evidence/current/tiger-vanguard/player-depth-draft/2026-10-14T02-41-17-069Z/` 保留3次串行FAIL：10:45原不变量、10:49像素/mask、10:50详细诊断。末次两模式原玩家各1次且顺序确实反转，但50项玩家命令的矩阵e/f发生微差：source e 195→195.00001621246338，f 422.39389475496137→422.3938442102226；args/styles/dash及a–d、候选body/bar、数字最终paint/字段、state/RNG未变。5671差异像素、完整玩家paint支持域外21、三mask差异50，严格门禁不通过。矩阵回填/镜像栅格精度仅为合理推断，尚未隔离证明；不得加容差或扩大mask掩盖失败。

根代理静态看全部8PNG，独立代理看3关键图并核204保护文件、末次6PNG/scripts：玩家面部/胸身/手臂显露更多，但与虎先锋脸/肩臂仍混叠，双方艺术可读性未批准。独立PNG复算5671变化和已存after支持域外21（最大通道差2）；before三mask未落盘，不能独立复算报告的mask差异50。outsideActorOverlap75不是门槛且不含bar；“额外主Canvas人物绘制0”为代码常量，不称独立计数。Canvas全局状态/当前path恒等未证明。

末次27render/6consume/18RNG只读检查及hook引用还原、dispose明确记录；前两次未返回该两项旗标，不能补称确认。三次context/browser/server均关闭、页面/console/请求/HTTP/外网错误0。10:54:14本轮新npm test PASS完整归档，204保护和全部新证据哈希不变；该PASS不冲销草案FAIL。未生图/录屏/生产接入/ZIP重建/部署/公网复验，整体仍 `NOT_READY`；所有玩家/敌人可读性、动作、根点、runtime/highFrame/FPS/public/release批准均false。

下一安全步：证据层同深度、单次玩家绘制的矩阵 round-trip 控制：隔离 getTransform→setTransform→原 translate/scale/rotate 是否引入 e/f 或像素差，另存前后三张透明mask供计数独立复算。保持严格阈值、原素材/位置/伤害/TTL/数字/血条；不再次以当前覆盖脚本重跑/覆盖三份失败，不接入生产/打包/部署。 下文“下一步”为历史。

## 贴身玩家轮廓提示（2026-10-14 10:30，北京时间）：技术对照成立，艺术可读性未通过

本轮只新增证据层内轮廓草案，没有生成/修改素材。复用本帧成功drawImage的玩家与后绘虎先锋实际source/dest、完整矩阵（含镜头/DPR/朝向/pose）和绘制设置；不重调_drawPlayer/动作采样。固定3张390×844透明辅助画布，alpha>8玩家内侧2屏幕像素环只与后绘候选alpha交叠区相交，提示在原数字/状态反馈之前复合，实际血条交叠0。缺失/旧token、非后绘、透明/不交叠、视口截断均失败关闭或无提示；5组Node仅合成RGBA检查。

单真实Edge入口debug=false、time≈1s，随后明确300秒加速、重定位、direct damage与25ms子系统夹具，非自然玩法；DPR1、hit#26朝左单例。两模式玩家原路径各1次，提示另复合1次独立记账；身体/血条、所有实际source参数/矩阵、数字字段及最终paint/位置、状态/RNG均不变。玩家6911个alpha>8屏幕像素、交叠4616、提示1035，均为阈值代理而非真实身体/不可见像素语义。1035差异像素全部在精确提示mask内，mask外0。

证据 `evidence/current/tiger-vanguard/player-outline-draft/2026-10-14T02-27-22-432Z/`，`REVIEW_EVIDENCE_ONLY_OCCLUDED_PLAYER_OUTLINE`。根代理静态看6PNG，独立代理看4关键图并复核186保护文件/6PNG及脚本哈希：**头发、抬手与部分衣缘可定位，但头线穿过虎先锋脸、手臂线叠护肩，与黄色尾迹混线，玩家面部和身体细节仍不可读。轮廓提示不能称遮挡已解决，艺术可读性未通过。** 现有英雄裁切与少量重复源动作缺陷不因本提示消除。

27render/6consume只读核验，原hook引用还原、辅助画布降至1×1、dispose及context/browser/server关闭，错误/外网0；10:30:57新npm test PASS完整日志归档，186保护哈希和新6PNG/scripts/Node/browser不变，源PNG/生产/ZIP未改。未录屏/部署/公网复验；空状态牌、死亡、本例之外姿态/方向/多怪/其他DPR、连续运行成本均未验，不作高帧/FPS或全局批准。`playerReadabilityApproved=false`、`outlineArtReadabilityPassed=false`、`humanMotionReviewed=false`、`rootApproved=false`、`runtimeApproved=false`、`highFrameApproved=false`、`fpsAcceptance=false`、`publicPass=false`，整体仍 `NOT_READY`。

下一安全步只在证据层对照“玩家单次绘制的贴身深度优先”草案：复用现有玩家路径，仅延后同一接触夹具的玩家绘制次序、不新增第二次人物绘制；保持世界位置/碰撞/伤害/素材/比例/动作时序/数字和血条，实证玩家与敌人双方可读性，不接入生产或上线。 下文下一步为历史。


## 候选反馈矩形同步（2026-10-14 10:18，北京时间）：受击数字冲突收敛，仍REVIEW

仅在证据层让原伤害数字有限避让读取同一render实际绘制的虎先锋body/bar四边；每draw重建外部WeakMap并递增有效token，精确首关调度对象/id/冻结identity引用，原builder只调用一次、同buffer/长度、非目标槽不改。新增6项Node检查包含缺失token与不可写槽位的无部分写入门禁；512末槽无bar不追加，仍不批准极限遮挡。

单真实Edge首页→选角→战斗（debug=false、time≈1s），随后明确300秒加速、重定位、direct damage和25ms子系统夹具，非自然战斗。hit#26朝左before/after身体/血条/镜头/状态/RNG及数字值1、字段/顺序/TTL/样式/旋转均不变，仅由既有有限算法改变数字最终绘制位置：旧label screenY305.584–343.938与barY306.416–313.536重叠，新label落在x111.388–147.024/y373.250–411.604，登记enemy/player/HUD矩形与视野检查通过、unresolved=0。931差异像素均在旧/新数字+星芒AABB±3px，遮罩外0；这是单例有限矩形/静态像素对照，非全局像素或玩家真实精灵包围盒保证。

证据 `evidence/current/tiger-vanguard/feedback-draft/2026-10-14T02-18-07-729Z/`，结果 `REVIEW_EVIDENCE_ONLY_SHARED_FEEDBACK_RECTS`；根代理看5PNG，独立代理只读复核hit对照与保护哈希。50render/8consume只读核验、hook引用还原、dispose及context/browser/server关闭，页面/console/请求/HTTP/外网错误0；10:18:45新npm test PASS完整归档，173保护哈希与5PNG/新scripts/Node/browser不变，未生图/录屏/生产接入/ZIP重建/部署/公网复验。

**虎先锋贴身身体仍明显遮玩家，死亡躯体交叠和右侧裁切仍开放。** 本例statusRects前后皆[]，不能称状态牌已通过；死亡未加入数字障碍，实际事件覆盖仅move#8–13、hit#24–27、death#28–31，attack仍无归属事件，原120ms实际hit与420ms死亡到期不变。不宣称自然五分钟/双向全状态/连续运动/高帧/FPS/公网验收；`healthBarLayoutApproved=false`、`playerReadabilityApproved=false`、`humanMotionReviewed=false`、`rootApproved=false`、`runtimeApproved=false`、`highFrameApproved=false`、`fpsAcceptance=false`、`publicPass=false`，整体仍 `NOT_READY`。

下一安全步只建立证据层贴身交叠时玩家轮廓提示的单例对照，复用现有玩家绘制路径、保持实际世界位置/碰撞/伤害/数字/血条和动作时序，不挪人物、缩裁切或重生素材掩盖身体遮挡；未批准前不写生产契约、打包或上线。 下文下一步为历史。


## 血条有限布局（2026-10-14 09:54，北京时间）：自身离头，新增数字冲突，仍REVIEW

仅复用锁定32姿态/根点草案，新增证据层固定比例包围盒与稳定血条基线；不改PNG/生产或发布包。alpha>8 visibleRect为历史代理，完整draw crop含2px guard，非语义身体/碰撞或新像素测量。活体28姿态含尚无事件的attack#18仅作保守预留：worldTop=y-2.932941r，barY=top-4-h，w=max(20,2.3r)、h=max(3,.08w)；r25血条相对原位置上移35.673529 world单位，不逐帧/朝向抖动。Node192几何/168bar检查仅数学边界，不能当32帧动作验收。

单真实Edge首页→选角→战斗后明确300秒加速、重定位、直接伤害和25ms子系统夹具，非自然五分钟/完整gameplay。move#8/#12、hit#26三组before/after同pose/camera/state/RNG，只改候选自身barY，原x/宽高/hp ratio/颜色保留；1107/1417/1380差异像素均在旧新bar矩形±3px遮罩内，遮罩外0，自身draw顶与bar底留13.8824/13.4118/17.1765 world单位。实际事件绘制仍仅move#8–13、hit4/death4，不借Node数学32帧宣称全态/双向/高帧；player-hit缺归属，attack未预览，原120ms实际hit/420ms死亡到期未改。

证据 `evidence/current/tiger-vanguard/layout-draft/2026-10-14T01-50-14-837Z/`，`REVIEW_EVIDENCE_ONLY_STABLE_OWN_BAR_LAYOUT`；根代理看9PNG、独立代理看三对6PNG及公式。**自身血条已离头，但新bar在hit图y306.416–313.536与数字“1”约y309/310上缘/黑描边接触叠压；信息可读性仍不通过。** 当前damageObstacleGeometryUpdated=false，数字避让仍旧generic障碍。贴身覆玩家、伏地重叠、右侧裁切继续存在；world-start新bar.right409.732和candidate.visible.right446.807均超390，follow身体仍超视野。不宣称全局/像素/艺术/连续运动/FPS批准。

09:55:27本轮新npm test PASS完整日志/摘要归档，156保护哈希、新9图/三scripts/layout/Node/browser不变。53render/8consume observer只读核验、hook引用还原检查、dispose及context/browser/server关闭，错误/外网0。未生图/录屏/生产接入/ZIP重建/部署/公网复验；`healthBarLayoutApproved=false`、`humanMotionReviewed=false`、`rootApproved=false`、`runtimeApproved=false`、`highFrameApproved=false`、`fpsAcceptance=false`、`publicPass=false`，整体仍 `NOT_READY`。

下一安全步只在证据层让伤害数字有限避让消费同一候选body/bar矩形，有限复核当前hit对照；保持数字值/样式/TTL/战斗及body世界位置，不挪玩家/抑制数字/缩裁切掩盖冲突，不编造attack或接入生产/打包/上线。贴身身体、视口和运动质量保持开放，不重复生图/库存/全录屏播放；下文下一步为历史。

## 真实身份/事件预览（2026-10-14 09:31，北京时间）：世界跟随技术REVIEW，血条与贴身可读性未通过

单个真实Edge通过首页→选角→战斗（debug=false、time≈1s），其后仅在页面内存按首关冻结encounterIdentity替换候选body；显式300秒加速、清集合、重定位、直接damageEnemy及25ms只推进updateEffects/updateEnemies子系统，非自然五分钟或完整gameplay。候选跟随真实worldXY/camera/zoom/朝向，外部Map消费enemy-hit/kill；250ms视觉hit不延长实际120ms，death遵守原420ms。原hp/maxHp及血条位置/宽度保留。虎先锋elite无attackPattern；player-hit无enemy/sourceId、玩家attack不可归属，均拒绝，attackEventSupported=false、attackPreviewed=false。

证据 `evidence/current/tiger-vanguard/event-preview/2026-10-14T01-27-39-382Z/`：Node off/on状态/事件/RNG17次及值/内部调度/池一致，71次只读核验；浏览器48draw/8consume无observer状态/RNG写入，但夹具本身有显式写入。Browser只覆盖move#8–13、hit#24–27、death#28–31，不以Node的move8时钟补足浏览器覆盖，不宣称idle/attack/全双向。根代理已静态看10PNG，独立代理复核四关键图及报告：**原通用精英血条穿候选头/脸、贴身候选遮住玩家、右侧视野裁切，候选局部布局FAIL/整体REVIEW**。无累积观察不等于艺术/连续运动质量或FPS批准，也不泛化为自然战斗。

09:36:20本轮新npm test PASS、完整输出/摘要和review/handoff归档；137保护哈希、新10图/三脚本未变，错误/外网0、context/browser/server已关。首稿在池复用后读death.maxTtl误报.01，已明确reject且保留，最终creation标量.42；expiry snapshot.lastDraw为先前历史draw，当前PNG/effects/retained0证明已消失。未生图、生产接入、ZIP重建、部署或公网复验。Node技术PASS不冲销视觉缺陷，`humanMotionReviewed=false`、`rootApproved=false`、`healthBarLayoutApproved=false`、`runtimeApproved=false`、`highFrameApproved=false`、`fpsAcceptance=false`、`publicPass=false`，整体仍 `NOT_READY`。

下一安全步只复用32姿态/固定源比例，建立证据层候选实际包围盒与稳定血条避让草案，有限复核同夹具；保持原HP/宽度/伤害/控制/世界位置/死亡TTL，不挪玩家掩盖身体遮挡、不凭player-hit编造attack、不写生产契约/打包/上线。贴身身体和边缘缺陷保持开放，不重复播放/库存/生图；前序“下一步”为历史记录。

## 最新合成连续播放（2026-10-14 09:07，北京时间）：录屏烧录标签完整，不升级动作门禁

离线单Edge复用08:56原WebM，1倍速无seek真实ended，390×844、3.126323s；83回调mediaTime0.061→3.126s、最大观察间隔70ms。保存83张原生标签+精灵ROI、1张loadeddata ROI及3张接触表，根代理与独立代理静态读取录像烧录编号0–31，含idle末两帧及五状态衔接；区别于原生成日志/近目标估计，也不等于自动姿态像素身份或连续人工质量验收。

最终证据 `evidence/current/tiger-vanguard/composite-playback/2026-10-14T01-07-09-754Z/`，`label-observation.json`分别保留回调mediaTime与烧录t；回调内PNG编码可能影响观察，不保证全编码帧/零掉帧，不作FPS结论。背景ROI最大均值通道偏差1、无累积，错误/外网0、浏览器关闭、无服务；09:10:00本轮npm test PASS及完整日志归档，131保护哈希不变。

没有重录、新游戏/UI、素材生成、生产改动、ZIP或部署；`humanMotionReviewed=false`、`rootApproved=false`、`runtimeApproved=false`、`highFrameApproved=false`、`publicPass=false`，整体 `NOT_READY`。下一步只做真实身份/事件驱动的证据层候选预览，不能改变原伤害/控制/死亡TTL或将未批准素材写入生产；不再重复同一播放/解码/库存。

## 最新冻结场景合成（2026-10-14 08:56，北京时间）：32源绘制覆盖，不是运行时验收

离线单Edge仅使用已锁定候选/草案与15:47历史冻结PNG，未新建游戏或重走UI。每tick清空重绘背景，源日志遍历32索引（含idle#6/#7）；固定点、伪血条和2850ms合成动作+250ms终态审查保持明确标为非实时战斗，不修改或批准真实攻击/受击/死亡计时。

`evidence/current/tiger-vanguard/composite-preview/2026-10-14T00-56-08-837Z/`：WebM 281422 bytes、SHA `01ba53ec…67e8`，390×844、容器时长3.126323s；7张实际字节seek解码图背景ROI最大均值通道偏差1，另6张直接夹具图。13图静态查看无累积；seek请求不是实际帧mediaTime，32源绘制不等于录像全32姿态或人工动态质量。30请求率/680rAF不是FPS。

错误/外网0，浏览器关闭、无服务，113保护哈希不变；08:59:07新npm test PASS/日志归档。结果 `REVIEW_FROZEN_BITMAP_FULL32_COMPOSITE`，`newGameInstance=false`、`realUiEntryThisRun=false`、`humanMotionReviewed=false`、`rootApproved=false`、`runtimeApproved=false`、`highFrameApproved=false`、`publicPass=false`，整体仍 `NOT_READY`。未生图/改生产/打包/部署；下一步只对新录屏连续播放及实际呈现覆盖作核对，不再重录或重复库存。

## 最新连续播放核对（2026-10-14 08:47，北京时间）：仅已有overlay连续可播

离线单Edge在1倍速度、无seek下将15:47原WebM播放至真实ended；390×844、2.534066s，73次呈现回调覆盖观察时间0.101→2.534s，最大间隔69ms，不证明全编码帧/零掉帧或FPS。原日志30目标周边的30张原尺寸ROI与接触表已静态查看，无首轮采样器透明累积；编号仅源日志估计，非准确姿态身份或动态质量批准。

最终证据 `evidence/current/tiger-vanguard/incontext-playback/2026-10-14T00-47-59-083Z/`，`REVIEW_RECORDED_OVERLAY_CONTINUOUS_PLAYBACK`；错误/外网0、浏览器关闭、无服务，111保护哈希不变，08:49:24新npm test PASS与完整日志归档。原视频仍无底层游戏且缺idle#6/#7；`humanMotionReviewed=false`、`runtimeApproved=false`、`highFrameApproved=false`、`publicPass=false`。未生图/改生产/重建ZIP/部署，整体仍 `NOT_READY`；下一步仅补证据层完整idle及明确冻结底层合成录屏，不冒充自然战斗。

## 最新录屏技术核对（2026-10-14 08:39，北京时间）：只验已有overlay字节的解码

单个离线真实Edge重新解码15:47原WebM（SHA `bbb1880278853b09c4547e5ffe2e03eaa1f33ef3aca045ddfa47274dc99b9a7d`），390×844、容器时长2.534066s；五状态内部与死亡尾段6个实际呈现采样为0.236/0.937/1.635/2.003/2.370/2.468s。排除时间文字后的精灵区域五状态签名不同，接触表仅作静态查看，不能批准流畅度/根点/真实攻击受击死亡时序。

原录制源是独立 `overlay.captureStream(30)`，不包含底层游戏；局内背景只在原PNG。原rAF日志仅遍历30姿态，idle末两帧未覆盖；本轮没有全32帧、自然战斗、持续末帧保持或FPS验收。首轮采样器未清空透明画布造成旧姿态叠影，保留reject记录；补 `clearRect` 后串行复验正常，不能据首轮判素材或编码有缺陷。

最终证据 `evidence/current/tiger-vanguard/incontext-decode/2026-10-14T00-39-29-649Z/`，`REVIEW_RECORDED_OVERLAY_DECODE_ONLY`；页面/console/请求/外网错误0，浏览器关闭，无服务，102保护哈希不变。08:40:56新 `npm test` PASS与完整日志归档；`humanMotionReviewed=false`、`runtimeApproved=false`、`highFrameApproved=false`、`publicPass=false`。未生图/改生产/重建ZIP/部署，整体仍 `NOT_READY`。

## 最新局内动态检查（2026-10-13 15:47Z）：候选 ghost 仍未接入运行时

真实 Edge 完成首页→选角→战斗并等待自然敌人（`enemies=1`），只取消底层 RAF/设置 `game.running=false` 保持 `engine.state.status=playing`，避免暂停模态；在真实 vector Canvas 上加第二个独立 overlay，以 motion draft 时序动态绘制 idle/move/attack/hit/death。390×844 五张动态截图已人工查看，抽样为 idle #3、move #12、attack #23、hit #26 左向、death #31。

证据 `evidence/current/tiger-vanguard/incontext-dynamic/2026-10-13T15-47-17-378Z/` 含 `browser.json`、五张动态图、WebM、`npm-validation.json`、`review.md`、`handoff.json`；693 rAF tick/约2566ms，WebM SHA `bbb1880278853b09c4547e5ffe2e03eaa1f33ef3aca045ddfa47274dc99b9a7d`，页面/console/失败请求/HTTP/外网错误为0。`captureStream(30)` 不代表FPS；录屏未人工动态观看。历史沙箱启动失败和两次校准记录保留。

本轮未改生产代码、素材、manifest或发布包，未重建 ZIP、未部署。ghost 是独立 evidence-only overlay，候选/草案无运行时引用；`overlayOnly=true`、`runtimeApproved=false`、`highFrameApproved=false`、`publicPass=false`，不构成自然战斗、GPU/微信 FPS、公网或设备通过，整体仍 `NOT_READY`。

## 最新局内静态检查（2026-10-13 14:38Z）：虎先锋候选叠加不是运行时接入

真实 Edge 完成首页→选角→战斗入口后，在暂停的 vector 游戏画布上附加独立 canvas，绘制候选 idle/move/attack/hit/death 五个状态抽样。场景 390×844，叠加固定 `x=276`、`ground=474` 与 86px standing-reference 比例，仅为证据层可读性检查；不代表真实敌人世界坐标、血条或碰撞位置。hit 为左向，其余为右向，双向并未覆盖每个状态。

`browser.json`、六张截图、`review.md` 与 `handoff.json` 位于 `evidence/current/tiger-vanguard/incontext-review/2026-10-13T14-38-16-457Z/`。暂停通过取消 RAF 并调用 `engine.pause()`，不是点击暂停控件；death 只抽样末帧，不证明计时/TTL。候选表、motion draft 与源图无运行时引用，底层 renderer 仍为 `vector`；页面、console、失败请求、HTTP 和外网请求为0。

本轮未改生产代码、素材或发布包，未重建 ZIP、未部署。`overlayOnly=true`、`runtimeApproved=false`、`highFrameApproved=false`、`publicPass=false`；本地 `npm test` 归档不扩展为动态、高帧、FPS、当前 ZIP、公网或设备验收，整体仍 `NOT_READY`。

## 最新候选小步（2026-10-13 13:11Z）：虎先锋根线与换帧漂移完成静态复核，仍未接入

已查看根点注册的三张真实Edge截图，并复核64px alpha质心相邻帧诊断：idle最大草案漂移1.001×0.705px，move5.931×3.007px（frame13保留离地间隙），attack7.549×6.659px，hit1.284×1.453px，death5.373×6.990px。草案减少了idle/hit的包围盒跳动；attack的挥刀与躯干变化、death的倒地变化仍是真实姿态运动。

人工静态观察认为各状态地平线在截图中连贯，但alpha质心受刀/尾影响，death代理还包含刀，不能批准人体根点、骨骼连续性、局内读法或FPS。完整记录为 `evidence/current/tiger-vanguard/motion-draft/2026-10-13T12-00-07-310Z/root-drift-review.json` 与同目录 `review.md`；没有改图、运行时或发布包。`dynamicMotionReviewed=false`、`rootApproved=false`、`highFrameApproved=false`、`publicPass=false`，下一步需在游戏场景检查接地、朝向、血条和攻击可读性，整体仍 `NOT_READY`。

## 最新候选小步（2026-10-13 12:39Z）：虎先锋完整状态根点/时序草案完成，仍未接入

在已完成的29个原v1区域+3个既有补丁候选表上，新增证据层根点与时序草案；未生成、拼装或修改图片，也未写入运行时合同。每页只用固定170/443源比例；idle/move/attack/hit使用源列横向登记与状态地平线假设，death使用含刀的可见底部代理，均不是作者根点。草案时序为8/12/16/16/10源姿态每秒，death400ms与现有精英death TTL0.42s相容；动作时钟独立于伤害、受击和死亡规则。

真实Edge在同一候选像素上完成双向48/64px对照、状态边界与合成中断序列；浏览器重新解码实际录制WebM的5个采样，5个签名均不同。Node与浏览器时钟结果一致，20/60Hz合成时钟遍历全部32姿态，攻击/受击回移动、death保持末帧。证据 `evidence/current/tiger-vanguard/motion-draft/2026-10-13T12-00-07-310Z/`，含 `motion-draft.json`、两张注册对照、终态截图、`motion-draft.webm` 与 `npm-validation.json`；12:39:42Z `npm test` PASS，页面/console/请求/外网错误0。

该步骤仍为 `REVIEW_FULL_STATE_REGISTRATION_TIMING_DRAFT`：录屏未人工动态观看，浏览器录制30只是请求值，不是FPS测量；根点、连续性、局内战斗读法、艺术质量、公网、当前ZIP与设备均未通过。候选未接入/打包/部署，`runtimeApproved=false`、`highFrameApproved=false`、`publicPass=false`，整体 `NOT_READY`。详见 [`docs/TIGER-VANGUARD-CANDIDATE-HANDOFF.md`](TIGER-VANGUARD-CANDIDATE-HANDOFF.md)。

## 最新候选小步（2026-10-13 11:22Z）：32姿态复用表和全状态技术预览完成

`tiger-vanguard/full-candidate/2026-10-13T11-20-21-840Z/`保存显式29原区+3补丁候选表（idle8/move8/attack8/hit4/death4）、8项表自检、真实Edge6截图、原生Canvas录屏和11:22:20Z全套回归PASS。32源裁切各异、双阈值2px隔离、64/48px双向独立绘制和全部状态遍历通过；每源固定比例、全部临时bbox根点，不能当作作者根点/完整动画或局内验收。

首次外置录屏组件缺失的失败保留，未安装依赖，改用浏览器原生录制串行完成。录屏未被声明为人工动态质量或GPU/FPS通过。91保护文件/ZIP不变，错误/外网请求0，浏览器与采集轨道关闭，无服务/接入/打包/部署；`runtimeApproved=false`、`highFrameApproved=false`、`publicPass=false`，整体`NOT_READY`。下一步复用同表做全状态根点/时序草案，不重生图或重复端点审查；详见同目录`review.md`。

## 最新有限检查（2026-10-13 11:06Z）：死亡接缝预览完成，非完整动画批准

新证据 `tiger-vanguard/death-seam/2026-10-13T11-05-40-965Z/`包含现有v1与补丁death[1→2→3]的真实单Edge三截图、64/48px双向、两档非循环绘制日志和11:06:26Z全套回归PASS。每源固定170/443比例，Node/浏览器双阈值测量一致；人工肩部近似点与含刀最低点仅作两种对齐敏感性对照，非作者根点或人体接地保证。尾/腿延展等源内容差异仍在，静态差异与绘制日志都不能直接定动画质量。

91保护文件/ZIP不变，浏览器已关、未启动服务、错误/外网请求0。未生图/接入/打包/部署，候选仍REVIEW、整体`NOT_READY`，公网未验收。下一步只在证据目录形成29原区+3补丁的32姿态候选表与完整序列预览，不重复相同端点审查；详见同目录`review.md`。

## 最新有限检查（2026-10-13 10:52Z）：待机接缝诊断完成，不是动画批准

`tiger-vanguard/idle-seam/2026-10-13T10-51-24-318Z/`记录既有v1与补丁的四端点固定脚底、三截图人工对照及真实Edge按6/12源姿态每秒绘制两条接缝。每源唯一170/443比例，双阈值脚底测量吻合；64/48px双朝向技术预览通过，不等于完整待机/死亡节奏、局内、FPS或公网PASS。首轮检查窗口过高而失败，修正后串行复核，原失败保留。

10:52:35Z新全套测试PASS，91项保护哈希不变，浏览器已关、未启动服务、错误及外网请求0。未生成或改素材、未接入/打包/部署。人工观察与局限见同目录`review.md`；补丁继续REVIEW，下一步复用检查死亡衔接。`runtimeApproved=false`、`highFrameApproved=false`、`publicPass=false`、整体`NOT_READY`。

## 最新素材小步（2026-10-13 07:10Z）：三帧局部修复仅通过隔离检查，替换仍REVIEW

内置imagegen以v1为唯一编辑目标，只输出7/30/31三帧补丁，未重生整表；原稿与另外29区保持字节不变。候选2172×724、704203 bytes、SHA `e04bdf485aae996872827efe6ad8ef9e575eb7671a7e101f70c5c8f54b510e5a`，位置与完整提示词见 `evidence/current/tiger-vanguard/local-repair/2026-10-13T06-27-44-991Z/handoff.json`。

双阈值3区域、2px隔离和100px间隔通过；50px外留白要求未满足（最小46px）。07:10Z单Edge离线3截图和独立像素检查通过，错误/联网0；07:10:23Z全套回归PASS并已归档，90保护文件未变，浏览器关闭、未启动服务。人工对照发现倒地尾巴/躯干展开及头眼处理变化，不能当作仅移动原图的修复；原帧→候选的根点/时序衔接未验收。

保留一次候选，先复用审查，不立即再生成。`runtimeApproved=false`、`highFrameApproved=false`，未接入、未重建ZIP/部署，整体 `NOT_READY`；技术预览不冒充局内、公网、FPS或实机PASS。

## 最新素材小步（2026-10-13 05:45Z）：虎先锋单源复用范围与三处布局缺陷已定位

v1旧“31独立姿态/缺一帧”是将横向分组数误作语义姿态数。新SHA/尺寸/用途/引用核对后，alpha>8/16均测得32个主要八连通组件，人工看图确认四张死亡图存在；保留零散边缘后的alpha>8横向分组才是31。该更正不批准32帧动画。

v1可隔离源候选为29区（idle7/move8/attack8/hit4/death2）；索引7的刀尖触画布右边，30/31两张倒地人物主体不相连但完整矩形夹入邻体，须局部源级处理。不能通过阈值删边、缩裁切、改根点、重复帧或混入v2掩盖；保护其余29区，不为凑数重生整表。

最终 `evidence/current/tiger-vanguard/single-source/2026-10-13T05-44-03-776Z/` 保存5项诊断自检、新Node、真实单Edge离线原图/缺陷放大/64px库存3截图及05:44:12Z `npm test` PASS；浏览器计数吻合，错误/外网请求0，90保护文件不变，已关闭、未启动服务。交接为 `single-source/handoff.json`；初轮漏计零散边缘的报告被更正并保留。

本步只完成精确库存与布局缺口定位，不是源图已修、完整动作/根点/局内/公网/ZIP/FPS/实机验收。候选 `runtimeApproved=false`、`highFrameApproved=false`，整体 `NOT_READY`；未生成、未改图、未接入或部署。

## 最新素材判定（2026-10-13 04:44Z）：虎先锋双稿直接拼接未获批准

四个过渡端点在源SHA/尺寸/像素/零生产引用重查后，完成近侧支撑脚对齐、旧bbox对照及64/48px双向检查。最终单Edge离线报告 `evidence/current/tiger-vanguard/continuity/2026-10-13T04-41-02-531Z/browser.json` 为 `REVIEW_ENDPOINT_ALIGNMENT_ONLY`，3截图、技术检查通过、console/page/request错误及外网请求均0。初次脚底窗口修正后已串行复测，旧证据保留。

人工判定：脚底对齐后胸甲/领口、护腕、腿甲和刀轮廓差异仍在，不批准只靠平移根点的跨稿拼接。头顶至脚底190/171/171/191源像素只作辅助数据，不把蹲伏高度差单独当作造型失败；这也不是其余帧/死亡根点或“任何修复均不可能”的结论。

04:44:06Z全套测试新跑PASS，90受检文件未变，浏览器已关、未启动服务。详见 `evidence/current/tiger-vanguard/continuity/handoff.json`；未生成、未改图、未接入、未打包/部署，候选仍REVIEW，整体 `NOT_READY`，不冒充高帧、局内或公网PASS。

## 最新安全小步（2026-10-13 04:22Z）：虎先锋定时身份隔离通过，动作仍未批准

首关300秒定时虎先锋现在携带冻结的 `encounterIdentity:{encounterId:'tiger-vanguard',variant:'tiger',actionId:'tiger-vanguard'}`，死亡保留，对象池复用前清空。通用出生忽略同名/同变体/伪身份字段，Boss与其他关卡不绑定；不接入动作素材、不修改渲染或战斗数值。

6项Node门禁、16组修改前后固定种子哈希比较和04:19:51Z全套测试通过；单Edge经真实UI进入后完成3组加速身份夹具、4截图、零console/page/request/HTTP错误，无候选或外网请求。冻结画面有无身份元数据像素一致。归档 `evidence/current/tiger-vanguard/identity/2026-10-13T04-22-04-744Z/` 含本轮Node、全套结果及真实浏览器证据；详见 `identity/handoff.json`。

只验收身份边界，不证明自然五分钟战斗、虎先锋专属动画、造型融合、FPS、公网、ZIP或微信实机。78受检文件不变，正常测试构建同步两份bundle但未重建ZIP，服务已停；候选仍REVIEW、未接入，整体 `NOT_READY`。

## 最新素材小步（2026-10-13 03:55Z）：虎先锋旧稿32区域互补复用可行，动画与接入未批准

不生成新图，仅从 v2 选 idle8/move8/hit4/death4，从 v1 选 attack8。`evidence/current/tiger-vanguard/reuse-plan-node.json` 重新验证 SHA/尺寸/源像素、32个不同区域、alpha>8/16 的2px透明边界、无触边和无生产引用，结论 `REVIEW_32_SOURCE_REGIONS_AVAILABLE`。

单 Edge 的 `reuse-review/2026-10-13T03-54-57-639Z/browser.json` 技术预览通过：64px双向、48px右向与32区域源序列播放，错误/外网请求为0，5截图；总结果保持 `REVIEW_SOURCE_PREVIEW_ONLY`。统一比例跨稿截图仍有身形、胸甲/腰带和刀形差异，脚底/死亡根点与衔接未验收；32个不同像素区域不等于32个最终合格动作。没有新图、图集拼装、运行接入或部署。

03:54:06Z `npm test` 新跑 PASS，90受检文件哈希未变。完整交接为 `evidence/current/tiger-vanguard/reuse-handoff.json`；不复用03:42Z通用网页报告为本轮证据，也不把候选预览当作局内、公网、ZIP、FPS或实机PASS。整体仍 `NOT_READY`。

## 最新安全小步（2026-10-13 03:42Z）：安全区零值边界修复与本地恢复验收

`NativeGame.resize` 不再把有限 `safeArea.bottom=0` 当成缺省值，保留缺省/null/非有限值的屏幕高度兜底。无可玩区时沿用 renderer 的全屏 fail-closed 障碍，保留数字绘制位置并计数 unresolved；有效边界恢复后正常排布。不改 renderer、引擎或素材。

- `evidence/current/hud-occlusion/2026-10-13T03-40-45-508Z/browser.json`：11 例仅零值场景失败；`2026-10-13T03-41-44-099Z/browser.json`：11/11 PASS，console/page/request/HTTP 错误均 0。新增八个 Node 边界与四组生产场景通过；`npm test` 于 03:41:26Z PASS，通用 Edge 于 03:42:38Z PASS，九截图、console/pageerror 零错误（不采集请求计数）。
- 证据、保护文件与源码哈希见 `evidence/current/hud-occlusion/safe-area-zero-handoff.json`。服务已停，未生成素材/重建 ZIP/部署。零值场景是没有可玩区的明确注入夹具，只验证有限 fail-closed、保留绘制与恢复，不宣称异常输入下可玩/无遮挡，也不是公网、实机或全局遮挡验收。整体仍 `NOT_READY`。

## 最新安全小步（2026-10-13 03:28Z）：敌人/HUD 交叉遮挡缺陷已修复，本地专项与流程回归通过

- 旧实现真实 Edge 在 390×844、360×640 的两项交叉冲突失败；数字沿敌人四边移动仍出不了 HUD。`renderer.js` 只补充两个 HUD 垂直边界候选，保留原四候选、全部碰撞/视野检查及 fail-closed 行为，总计最多六个候选。
- 明确的前后证据：`evidence/current/hud-occlusion/2026-10-13T03-24-21-081Z/browser.json` 为 5/7 PASS；`2026-10-13T03-26-41-421Z/browser.json` 为 7/7 PASS，console/page/request/HTTP 错误均 0。单浏览器串行覆盖实际尺寸变更、上下 HUD、安全区、DPR 适配夹具和重复绘制；使用真实 Canvas 字形度量与完整变换验证数字包围盒，夹具不是自然冲突全覆盖。
- `hud-occlusion-smoke.mjs` 增加四组 NativeGame 生产路径并修正 mock 视野；Node 于 03:26:47Z PASS，`npm test` 于 03:26:51Z PASS。通用 Edge 于 03:28:21Z PASS、九截图、console/pageerror 为 0（不记录 request/HTTP 计数）。交接含当前证据哈希：`evidence/current/hud-occlusion/handoff-2026-10-13T03-28Z.md`。
- 只验收有限包围盒修复与本地回归，不覆盖全局、modal、像素级、FPS、自然战斗冲突全集、公网、当前 ZIP 或微信实机。引擎/扫描素材/既有 ZIP 哈希未变，服务已停；`safeArea.bottom=0` 边界未改。英雄高帧、虎先锋/三 Boss 独立动作与公网仍 `NOT_READY`，不打包、不部署。

## 最新只读发布门禁（2026-10-13 02:17Z）：网页 ZIP 仍缺帧资源，保持 NOT_READY

授权外运行 `scripts/audit-release-readiness.mjs`，证据 `evidence/current/release-readiness/2026-10-13T02-17-31-922Z/report.json`。当前网页 ZIP SHA `9c9bd515b0e8dcb5c4d4101838f1ebc3679b0f425ab31685909503c9519ae097` 仍缺狼、猴、鹿、鹰、蛇共 10 个帧 JSON/PNG；微信 ZIP SHA `f017493aaf8eeebccc1ac040ded0397a8bfcc4f8d0cbee56e6be5b04e4dec4e2` 按发布策略不含网页帧资源。英雄/首领动作与公网 PASS 未完成，未重建、未部署，结论 `NOT_READY`。

## 最新安全小步（2026-10-13 02:03Z）：HUD 有限包围盒避让专项与真实 Edge 回归通过

- `renderer.js` 将 NativeGame 提供的 CSS HUD 顶/底安全带按当前 camera/zoom 逆变换为有限 world-space 障碍（最多两个）；顶部冲突优先向下、底部冲突优先向上，非法边界 fail-closed 保留数字并记录 unresolved，不重复乘 DPR，不改变引擎数值或素材。
- `prototype-2d/tests/hud-occlusion-smoke.mjs` 已进入 `scripts/validate.mjs`，专项证据为 `evidence/current/hud-occlusion/node.json`；`npm test` 于 `2026-10-13T01:56:58Z` PASS，统一结果为 `evidence/current/validation.json`。
- 授权外串行本地 8088 的真实 Edge 于 `2026-10-13T02:03:13Z` PASS，`evidence/current/visual.json` 页面/请求/console/pageerror 均为 0，覆盖双移动视口及战斗流程；服务已停止。受限启动失败 `spawn EPERM` 已单独记录在 `evidence/current/visual/browser-launch-failure-20261013T0157.json`。
- 验收边界：这只是有限 HUD 顶/底包围盒避让，不覆盖像素级、全局或 modal 遮挡，也不是公网、当前 ZIP、微信实机或发布 PASS；英雄高帧、虎先锋/三 Boss 独立动作和公网门禁仍 `NOT_READY`。

## 最新安全审计（2026-10-12 20:03Z）：虎先锋候选仍缺 3 个独立姿态，未接入

只读核对 `docs/TIGER-VANGUARD-CANDIDATE-HANDOFF.md` 与 `evidence/current/tiger-vanguard/v2-handoff.json`：v2 候选 1774×887、2,101,074 bytes、SHA `03fadd…92e62`，攻击行只有 5 个区域，合计 29/32 独立姿态，仍为 `REVIEW`。当前运行时继续使用 v1；v2 不在 loader、serve allowlist、runtime contract、manifest 或 release 清单中。

- `evidence/current/tiger-vanguard/next-gap-audit.json` 已记录 SHA/尺寸/用途/运行时引用核对；未生成第三稿，未修改 manifest/运行时/ZIP/部署。
- 候选解码与本地审计不构成虎先锋完整动作、发布或公网 PASS；下一步应先评估不同布局策略，避免重复生成。

## 最新素材小步（2026-10-12 19:47Z）：悟净源级新候选布局预检未通过，未接入

针对既有悟净上排姿态无法用轴对齐矩形隔离的门禁缺口，本轮只生成一张新的透明 4×2 候选并先做 SHA/尺寸/用途/运行时边界核对。候选位于 `evidence/current/hero-highframe/wujing-source-candidate-2026-10-12T19-36Z/hero-wujing-source-candidate-v1.png`，SHA256 `b0364a6b66867079eb177cb963d659a6aa3bcc4f247caa52af0eddc505cda616`，1774×887、1,775,106 bytes。

- 像素预检 `preflight.json`：alpha>8/16 均为 7 个主要连通组件跨 4×2 单元；主要组件分布 `[1,1,1,1,2,3,3,3]`，内部边界仍有可见像素，30px 透明间距不满足。
- 结论 `REVIEW_LAYOUT_CONSTRAINTS_NOT_MET`。未接入 manifest/loader/renderer，未重建 ZIP、未部署、未公网验收；不把候选预检当作真实高帧或发布 PASS，也未生成第二张同用途候选。

## 最新安全小步（2026-10-12 18:38Z）：伤害数字之间有限避让并完成本地 Edge 复核

生产 `render()` 在既有玩家身体、敌人身体/血条和 Boss 名牌避让之外启用 `avoidDamageLabels:true`；每个数字只检查此前本帧已接受的有限数字矩形，冲突时尝试上/左/右/下四个世界视野内候选，候选同时避开既有障碍，候选耗尽仍原位绘制并记录 `damageLabelUnresolved`。未改引擎顺序、伤害值、TTL、旋转、星芒、RNG、素材或 HUD；直接 helper 默认关闭保持兼容。

- `prototype-2d/tests/damage-label-avoidance-smoke.mjs` 已纳入 `scripts/validate.mjs`，5/5 Node/Canvas mock PASS；证据 `evidence/current/damage-label-avoidance/node.json`。`npm test` 于 `2026-10-12T18:36:36Z` PASS，完整结果 `evidence/current/validation.json`。
- 授权外串行本地 8088 的真实 Edge `browser-visual-smoke` 于 `2026-10-12T18:38:05Z` PASS，`evidence/current/visual.json` 页面/请求/console/pageerror 均为 0，正常战斗观察到 2 个伤害数字，覆盖首页、选角、战斗、暂停、升级、三 Boss、结算和双移动视口；服务已停止且无监听。
- 结论只覆盖有限数字-数字包围盒、输入顺序不变和 fail-closed 绘制，不覆盖像素级身体、HUD 或全局遮挡，也不构成当前 ZIP、公网、微信实机或发布 PASS。英雄高帧、虎先锋/三 Boss 专属动作、整体遮挡和公网仍未通过，发布门禁保持 `NOT_READY`。

## 最新安全小步（2026-10-12 18:27Z）：伤害数字有限避让 Boss 名牌并完成本地 Edge 复核

生产 `render()` 在玩家身体、敌人身体/血条之外启用 `avoidBossLabels:true`。伤害数字与已布局 Boss 名牌有限矩形冲突时，只尝试上/左/右/下四个世界视野内候选，候选同时避开玩家、敌人身体/血条与 Boss 名牌；候选耗尽仍原位绘制并记录 `damageBossUnresolved`。未改引擎数值、TTL、旋转、星芒、RNG、素材或 HUD。

- `prototype-2d/tests/boss-label-damage-avoidance-smoke.mjs` 已纳入 `scripts/validate.mjs`，5/5 Node/Canvas mock PASS；证据 `evidence/current/boss-label-damage-avoidance/node.json`。`npm test` 于 `2026-10-12T18:24:17Z` PASS，完整结果 `evidence/current/validation.json`。
- 授权外串行本地 8088 的真实 Edge `browser-visual-smoke` 于 `2026-10-12T18:26:59Z` PASS，`evidence/current/visual.json` 页面/请求/console/pageerror 均为 0，覆盖首页、选角、战斗、暂停、升级、三 Boss、结算和双移动视口；服务已停止且无监听。
- 结论只覆盖有限 Boss 名牌矩形、输入不变和 fail-closed 绘制，不覆盖像素级身体、HUD、数字互相或全局遮挡，也不构成当前 ZIP、公网、微信实机或发布 PASS。英雄高帧、虎先锋/三 Boss 专属动作、整体遮挡和公网仍未通过，发布门禁保持 `NOT_READY`。

## 最新安全小步（2026-10-12 18:08Z）：伤害数字有限避让敌人身体与血条并完成本地 Edge 复核

本步在既有 `avoidPlayer` 之外，为生产 `render()` 启用 `avoidEnemies:true`。普通/精英/Boss 采用有限保守身体包围盒，并为可见血条加入障碍矩形；数字只尝试上/左/右/下四个有限候选，必须在世界视野内且不与玩家、敌人身体/血条障碍相交，候选耗尽仍原位绘制并计数。未改引擎数值、TTL、旋转、星芒、RNG、素材或 HUD。

- `prototype-2d/tests/enemy-damage-avoidance-smoke.mjs` 已纳入 `scripts/validate.mjs`，6/6 Node/Canvas mock PASS；证据 `evidence/current/enemy-damage-avoidance/node.json`。`npm test` 于 `2026-10-12T18:06:13Z` PASS，完整结果为 `evidence/current/validation.json`。
- 受限 Edge 启动的 `spawn EPERM` 失败不冒充 PASS；随后授权外串行本地 8088 的真实 Edge `browser-visual-smoke` 于 `2026-10-12T18:08:21Z` PASS，`evidence/current/visual.json` 页面/请求/console/pageerror 均为 0，覆盖首页、选角、战斗、暂停、升级、三 Boss、结算和双移动视口；服务已停止且无监听。
- 结论只覆盖有限敌人身体/血条包围盒、输入不变和 fail-closed 绘制，不覆盖像素级身体、HUD、数字互相或全局遮挡，也不构成当前 ZIP、公网、微信实机或发布 PASS。英雄高帧、虎先锋/三 Boss 专属动作、整体遮挡和公网仍未通过，发布门禁保持 `NOT_READY`。

## 最新安全小步（2026-10-12 17:37Z）：伤害数字有限避让玩家身体并完成本地 Edge 复核

本步仅在 `prototype-2d/src/renderer.js` 为伤害数字加入生产 render 可选 `avoidPlayer` 路径：数字与玩家保守身体框冲突时在有限的上/左/右/下候选中移动，候选必须在当前世界视野内；无可行候选时原位绘制并保留数值。直接 helper 调用默认不启用，未改引擎、伤害、TTL、旋转、星芒、RNG、素材或 HUD。

- `prototype-2d/tests/player-damage-avoidance-smoke.mjs` 已纳入 `scripts/validate.mjs`，5/5 Node/Canvas mock PASS；证据 `evidence/current/player-damage-avoidance/node.json`。
- `npm test` 于 `2026-10-12T17:34:25Z` PASS，日志为 `evidence/current/player-damage-avoidance/2026-10-13T01-34-25-037Z/npm-test.txt`。受限 Edge `spawn EPERM` 失败原样保留于 `evidence/current/player-damage-overlap/2026-10-12T17-34-45Z/browser.json`；授权外本地 8088 串行 Edge 于 `2026-10-12T17:37:36Z` PASS，报告 `evidence/current/player-damage-overlap/2026-10-12T17-37-36Z/browser.json`，页面/请求/console 错误为 0，服务已停止且无监听。
- 同一代码状态下 `browser-visual-smoke` 于 `2026-10-12T17:42:42Z` 在串行本地 8088 服务上的真实 Edge PASS，输出 `evidence/current/player-damage-avoidance/2026-10-13T01-42-17-606Z/browser-visual-smoke.txt`，覆盖首页、选角、战斗、暂停、升级、三 Boss、结算及双移动视口，页面/请求/console 错误为 0；服务已停止。
- 结论只覆盖保守玩家身体矩形、有限候选、输入不变和 fail-closed 绘制；不覆盖像素级身体、血条、HUD、数字互相或全局遮挡，也不构成当前 ZIP、公网、微信实机或发布 PASS。整体发布门禁仍 `NOT_READY`。

## 最新安全检查（2026-10-12 17:02Z）：只读发布门禁仍 NOT_READY

串行运行 `scripts/audit-release-readiness.mjs`，没有重建、解压、上传或部署。工作区八类普通怪帧 JSON/PNG 齐全；现有网页 ZIP（SHA `9c9bd515b0e8dcb5c4d4101838f1ebc3679b0f425ab31685909503c9519ae097`）仍缺狼、猴、鹿、鹰、蛇共 10 个帧资源，微信 ZIP（SHA `f017493aaf8eeebccc1ac040ded0397a8bfcc4f8d0cbee56e6be5b04e4dec4e2`）按策略不含网页帧资源。报告为 `evidence/current/release-readiness/2026-10-12T17-02-23-974Z/report.json`，`deployAuthorized=false`、`publicPass=false`。沙箱 `spawnSync git EPERM` 失败已留存于 `evidence/current/release-readiness-attempts/2026-10-13T01-02-23-783Z/sandbox-failure.json`，授权外只读重跑成功。英雄高帧、虎先锋/三 Boss 专属动作、整体遮挡、公网仍未通过，发布门禁保持 `NOT_READY`。

## 最新安全小步（2026-10-12 16:52Z）：Boss 标签布局专项与本地 Edge 复核通过

新增 `prototype-2d/tests/boss-label-layout-smoke.mjs` 并纳入 `scripts/validate.mjs`。专项只保证三 Boss 近距离名牌互不重叠、避让玩家、状态不被修改、Canvas 栈平衡与复用缓冲清理；不扩展为身体、血条、伤害数字、HUD 或全局可读性通过。`npm test` 于 `2026-10-12T16:48:07Z` PASS，日志为 `evidence/current/boss-label-layout/2026-10-13T00-48-07-267Z/npm-test.txt`。

受限 Edge 首次尝试的 `spawn EPERM` 保留在 `evidence/current/browser-recheck/2026-10-13T00-51-32-098Z/`；之后受限外串行本地 8088 服务上的真实 Edge 于 `2026-10-12T16:52:45Z` PASS，`evidence/current/visual.json` 页面、请求、console/pageerror 均为 0，输出为 `evidence/current/browser-recheck/2026-10-13T00-52-21-193Z/browser-visual-smoke.txt`。这是当前工作区浏览器回归，不是公网、当前 ZIP、Boss 独立高帧动作或微信实机 PASS；发布门禁仍 `NOT_READY`。

## 最新素材任务（2026-10-12 16:15Z）：寅将军独立动作候选预检 REVIEW，未接入

先核对现有 Boss PNG、manifest 和运行时引用后确认没有可复用同用途素材；本轮仅串行调用一次内置 ImageGen，生成新的 1774×887 透明 8×4 候选。`evidence/current/boss-assets/yin-general-v1/asset-preflight.json` 显示四行只分离出 5/8/6/6 区域、25/32 独立帧，存在武器跨格与边缘裁切风险，结论 `REVIEW`。候选 SHA 为 `3bcfe483529722987ed7a919c56495132fa96e1ac6d2e83a69604fc29a70d057`。

该失败候选仅保留在证据目录，不进入生产资产、manifest、loader、renderer、ZIP 或公网；本轮不连续重试，未将其写成动画或局内 PASS。交接见 [`docs/YIN-GENERAL-CANDIDATE-HANDOFF.md`](YIN-GENERAL-CANDIDATE-HANDOFF.md)。

## 最新安全小步（2026-10-12 15:58Z）：首关三位最终 Boss 的身份矢量回退隔离

在等待三套独立 32 姿态 Boss 素材通过查重、alpha、根点和真实局内预检前，本步只使用代码原生 Canvas 轮廓承接已经建立的 `bossIdentity.bossId`：`yin-general`、`xiong-shanjun`、`te-chushi` 各自拥有不同配色、头部标志和武器；普通/精英/未知/跨关身份不匹配时继续通用向量回退。未生成、未重编码、未接入任何 Boss PNG/JSON，不改战斗规则。

专项与全套证据：`prototype-2d/tests/boss-identity-render-smoke.mjs` 已加入 `scripts/validate.mjs`；`npm test` 于 `2026-10-12T15:55:09Z` PASS，日志为 `evidence/current/boss-identity-vector/2026-10-12T15-55-08-329Z/npm-test.txt`。真实 Edge 于 `2026-10-12T15:58:42Z` 在串行本地 8088 服务通过首页→选角→战斗→暂停/升级/Boss/结算及双移动视口，`evidence/current/visual.json` 记录页面、请求和 console 错误均为 0；这不是公网、ZIP、微信实机或 Boss 高帧动作 PASS。

需求状态保持边界：三位 Boss 独立动作表、四英雄真实高帧姿态、虎先锋合格动作表、全局遮挡、当前网页 ZIP 重建/解压和公网通道仍未通过，发布门禁继续 `NOT_READY`。

最新安全检查（2026-10-11 17:33Z）：保留 17:27Z 的 Edge `spawn EPERM` 失败后，在本地 8088 服务上串行重跑真实 Edge 视觉门禁成功。`evidence/current/visual.json`（17:33:29Z）覆盖首页、选角、战斗、暂停、升级、Boss、结算、双移动视口、`authoredFrames + vector`、地图绘制计数和错误门禁；这是当前工作区回归 PASS，不是当前 ZIP、公网或微信实机 PASS。

最新检查（2026-10-11 17:27Z）：Boss 身份契约后的串行真实 Edge 复核因 Playwright `spawn EPERM` 未启动，未产生新的浏览器 PASS；失败证据为 `evidence/current/browser-recheck/2026-10-11T17-27-26-293Z/attempt-failure.json`。历史 `visual.json` 不作为本轮结果。

最新安全小步（2026-10-11 17:18Z，北京时间次日01:18）：首关三位最终 Boss 已建立隔离的身份契约，但未接入任何专属动作素材。

`content.js` 为寅将军、熊山君、特处士登记唯一 `bossId`/`actionId`；`engine.js` 仅对首关 `finalBoss` 透传 `bossIdentity:{bossId,variant,actionId}`，普通怪、精英、中 Boss、虎先锋及其他关卡 Boss 保持 `null`，禁止按 `variant` 复用普通动物动作表。击杀死亡特效保留身份且对象池回收清空旧字段。`evidence/current/boss-identity-contract/2026-10-11T17-18-18-482Z/npm-test.txt` 的 `npm test` PASS 只证明契约/本地回归，不代表三 Boss 专属动画、真实公网或发布包验收。

最新更新（2026-10-11 16:34Z，北京时间次日00:34）：只读发布门禁盘点仍为 `NOT_READY`，不部署。

当前网页 ZIP（SHA `9c9bd515…9ae097`）相对工作区缺狼/猴/鹿/鹰/蛇共 10 个帧 JSON/PNG；英雄高帧、虎先锋、三 Boss 专属动作、整体遮挡和公网当前 PASS 仍未完成。微信 ZIP 按发布策略不含网页美术帧，不能作为网页资源验收。详见 `evidence/current/release-readiness/2026-10-11T16-34-14-926Z/report.json`；`deployAuthorized=false`，未上线。

最新更新（2026-10-11 15:07Z，北京时间23:07）：悟净单次布局编辑候选仍为 REVIEW，未接入。

候选将原 5+3 排列尝试重排为 4×2，但 alpha>8 预检仍发现第 5/6 姿态完整矩形夹入邻人像素（padding 27/178），均分单元截断主体且 30px 透明留白不满足；真实 Edge 候选预览仅验证解码/绘制参数，不能替代局内或高帧验收。候选、提示词、回归、素材审计和交接见 [`docs/WUJING-LAYOUT-CANDIDATE-HANDOFF.md`](WUJING-LAYOUT-CANDIDATE-HANDOFF.md)。原图、135 个保护文件、运行时、ZIP 和公网均未改；`candidateLayoutPassed=false`、`runtimeApproved=false`、`highFrameApproved=false`，不接入、不上线。

最新更新（2026-10-11 08:24Z，北京时间16:24）：悟净“只改矩形裁切”的复用候选未通过。上排第2～5个人物的完整bbox仍包含邻人，双alpha阈值测量与真实Edge预览一致；不能靠改5列/缩小边界/根点偏移修好。未改生产/PNG；08:25:39Z npm test与08:25:40Z 80/76/4审计新跑通过，135个保护文件SHA不变。候选结论REVIEW，英雄视觉项仍FAIL，不上线。下一步须先修原图的姿态间隔再预检，详见 [`WUJING-CROP-ISOLATION.md`](WUJING-CROP-ISOLATION.md)。

最新更新（2026-10-11 08:02Z，北京时间16:02）：英雄高帧基线审计已实证缺陷，未改运行时。四英雄move8/attack8分别仅3/2个不同源裁切，仍叠加整图旋转/缩放；悟净上5下3被错误按4×2均切，真实玩法截图出现人物截断。浏览器结论是 `OBSERVED_BASELINE_DEFECT`，不能由新08:03:16Z npm test PASS覆盖。135份保护文件和80份媒体SHA不变，未打包/部署/公网重测。当前证据与下一步见 [`HERO-HIGHFRAME-BASELINE.md`](HERO-HIGHFRAME-BASELINE.md)。微信实机仍延期，不作为网页上线前置；以下前序记录保留原时间。

最新补充：虎先锋v2定向修复仍为REVIEW（攻击行5区域、29/32独立姿态）；只保留失败证据，不接入、不发布。生产回归与80/76/4素材审计新跑通过，当前全完成上线条件仍不满足。证据见 `evidence/current/tiger-vanguard/v2-handoff.json`。

更新时间：2026-10-11。本步仅完成虎先锋专属候选的查重、单次生成和独立真实Edge解码预检；候选布局为REVIEW，未接入生产、发布包或公网。80份媒体/76唯一SHA/4解释副本审计及06:19:49Z npm test PASS；候选死亡行仅7个连通区域（31/32独立帧）并有边缘裁切，不能以本地候选预览冒充局内或公网PASS。详见 [`docs/TIGER-VANGUARD-CANDIDATE-HANDOFF.md`](TIGER-VANGUARD-CANDIDATE-HANDOFF.md)。

更新时间：2026-10-11。本步仅增加状态牌对数字/星芒旋转包围盒的有限避让，真实Edge05:37:10Z记录基线缺陷、05:44:13Z最终修复后双尺寸PASS；8项新Node专项及05:47:30Z npm test通过，80份媒体和引擎SHA不变，数字内容/位置/样式不变。八类普通怪32姿态接入与05:01:19Z公开workspace入口是上一阶段证据，本步未重跑该入口/公网/当前ZIP解压/微信实机。最终视觉及身体/血条/数字/HUD整体遮挡未批准，dist仍为牛版候选ZIP，未重建或部署。

|需求|实现|本轮验收证据/入口|状态|
|---|---|---|---|
|从最新归档复制并保留旧项目|`legacy-source/`、`scripts/provenance.mjs`|`evidence/current/copy-provenance.json`、`docs/COPY-PROVENANCE.md`|**PASS（4 份代表文件逐字节）**|
|网页 Canvas 可启动主线|`prototype-2d/index.html`、`native-app.js`、`src/native-ui.js`|`evidence/current/visual.json`、`browser-public-smoke.json`：真实 Edge 首页→选角→战斗|**PASS（本地真实浏览器）**|
|600 秒关卡、递增刷怪、每 2 分钟精英|`src/engine.js`、`content.js`|`evidence/current/full-run.json`、`normal-run.json`、`npm test`|**PASS（四角色 600 秒）**|
|5/10 分钟首领规则|`src/engine.js`|`engine-smoke`、`normal-run` 的 300/570 秒时序和胜利边界|**PASS（规则与自然流程）**|
|300秒虎先锋身份不串入普通怪/精英/Boss|`content.js` 的 `encounterId/actionId`；`engine.js` 仅首关调度赋予冻结身份，死亡保留、池复用前清空|`tiger-vanguard/identity/handoff.json`：6项Node、16组修改前后固定种子哈希、04:19:51Z全套测试、04:22Z真实Edge 3组明确夹具与4截图|**PASS（本地身份边界）；不等于虎先锋动画/自然五分钟/公网/ZIP/实机PASS**|
|首关三位最终 Boss 身份不串用|`content.js` 的 `bossId/actionId`；`engine.js` 的首关 `bossIdentity` 与死亡保留|`evidence/current/boss-identity-contract/2026-10-11T17:18:18-482Z/npm-test.txt`：ID 唯一性、首关 guard、中 Boss/跨关伪 ID、死亡特效与对象池回收回归|**PASS（身份契约；非 Boss 专属动作或最终视觉）**|
|首关多 Boss 名牌不互相遮挡|`renderer.js` 的 `_layoutBossLabels()` 与 `_bossLabelOffset()`；`boss-label-layout-smoke.mjs`|`evidence/current/boss-label-layout/2026-10-13T00-48-07-267Z/npm-test.txt`：三 Boss 近距、玩家避让、状态不变、Canvas 栈和 `dispose` 回归；`visual.json` 仅作同一工作区浏览器回归|**PASS（名牌布局有限保证；不等于全局遮挡或 Boss 高帧动作）**|
|击杀掉落经验、三选一、1+4 技能槽|`src/engine.js`、`native-ui.js`|`npm test`；`visual.json` 的升级 harness 与真实升级暂停|**PASS（机制 + 浏览器审计）**|
|四角色五级本命武器|`content.js`、`engine.js`、`renderer.js`|引擎回归、渲染回归、浏览器资源证据|**PASS（Node + 真实浏览器）**|
|八法宝与满槽升级|`content.js`、`engine.js`|引擎回归与 `visual.json` 升级 harness|**PASS（机制 + 浏览器审计）**|
|81 难原著顺序、地点、妖首与改编标记|`content.js`、`docs/RESEARCH-WECHAT-AND-MARKET.md`|内容静态检查；`sourceNote` 标注非战斗原创演绎|**PASS（内容表）；改编边界已列明**|
|原创地图、角色、妖怪、法宝、技能图标和攻击特效|`src/renderer.js`、`src/native-ui.js`、`prototype-2d/assets/`|旧`visual.json`/`browser-animation-smoke.json`仅证明加载/可绘制；08:02Z英雄专项实证裁切缺陷。12个技能/法宝图标与向量地图机制保留|**资源加载/机制历史PASS；不等于素材融合、英雄完整裁切或最终动画质量通过**|
|四英雄完整裁切与真实高帧动作|现有v3 PNG；`native-app.js`统一4×2裁切，`renderer.js`重复源裁切后整图变换|08:02Z四英雄基线：move8/attack8仅3/2源裁切，悟净上5下3错切；08:24Z `wujing-crop-isolation/2026-10-11T08-23-36-875Z/`双阈值测量与真实Edge候选预览进一步证实纯矩形修复会带入邻人，不接入|**FAIL（原局内缺陷未修）；纯矩形修复候选REVIEW；新Node回归不冲销视觉失败**|
|素材来源、复用与去重|`prototype-2d/assets/manifest.json`、`scripts/audit-assets.mjs`|本步复用通过alpha预检的蛇v3；此前两份不合格候选只留证据，禁止公开/发布。新审计80个媒体、76唯一hash、4组解释副本；尺寸/bytes/SHA一致，未重生成已有合格素材|**PASS（库存与运行资源边界）；失败候选记录保留**|
|首关普通虎妖多帧动画|`src/tiger-animation.js`、`engine.js`、`renderer.js`、现有PNG/实测JSON|`evidence/current/tiger/browser-runtime.json`、`engine-runtime.json`：生产模拟自然绘制move8/attack8/hit4/death4、左右向、暂停恢复；32姿态48px夹具另行标注；身份隔离/统一比例/死亡回收/边缘裁切|**PASS（本地真实Edge + Node；非公网/微信实机；其余敌人动作待补）**|
|首关普通熊妖32姿态接入|复用PNG/JSON、`bear-animation.js`、共享注册表；仅stage1+normal+bear，不含熊山君|`evidence/current/bear/browser-runtime.json`、`engine-runtime.json`：13专项、自然move8/attack8/hit4/death4、双朝向/暂停恢复；32姿态左右48px生产夹具另列，图片哈希未变|**PASS（本地真实Edge+Node，已接入候选ZIP）；不等于最终动画质量/公网/微信实机**|
|首关普通野牛32姿态接入|复用PNG/实测JSON、`bull-animation.js`；`runtimeApproved:true`，仅stage1+normal+bull，排除特处士/待处士|历史`bull/browser-runtime.json`08:31:23Z自然覆盖/暂停；本轮13项Node新跑；牛包与public实际解压网页仍为09:06/09:07历史证据，狼步骤未重验|**历史局内/候选ZIP PASS，本轮Node PASS；不等于接触无遮挡/最终质量/公网**|
|首关普通苍狼32姿态接入|复用PNG/实测JSON、`wolf-animation.js`、共享注册表；仅stage1+normal+wolf，不含凌虚子/奎木狼、精英或其他关卡；`runtimeApproved:true`|`evidence/current/wolf/engine-runtime.json` 13项Node专项；`wolf/browser-runtime.json`真实Edge自然move8/attack8/hit4/death4、双朝向、暂停恢复、命中/击杀；原预检见`WOLF-ANIMATION-HANDOFF.md`|**PASS（本地真实Edge + Node；非公网/微信实机；不等于整体遮挡/最终移动端质量）**|
|首关普通猴妖32姿态接入|复用PNG/实测JSON、`monkey-animation.js`、共享注册表；仅stage1+normal+monkey，不含精英/Boss；`runtimeApproved:true`仅代表本地接入|`evidence/current/monkey/engine-runtime.json` 9项Node专项；`monkey/browser-runtime.json`单Edge自然move8/attack8/hit4/death4、双朝向、命中/击杀、32姿态夹具；本地workspace公开资源另验|**PASS（本地真实Edge + Node；不等于整体遮挡/公网/微信实机）**|
|首关普通鹿妖32姿态接入|复用单次生成PNG/实测alpha bounds JSON、`deer-animation.js`、共享注册表；仅stage1+normal+deer，不含精英/Boss；idle-7源朝向由模块归一，`runtimeApproved:true`仅代表本地接入|`evidence/current/deer/engine-runtime.json` 11项Node专项；`deer/browser-runtime.json`单Edge自然move8/attack8/hit4/death4、双朝向、暂停恢复、左右32姿态夹具；本地workspace公开资源另验|**PASS（本地真实Edge + Node；不等于整体遮挡/公网/微信实机）**|
|首关普通鹰妖32姿态接入|复用单次生成PNG/实测alpha bounds JSON、`hawk-animation.js`、共享注册表；仅stage1+normal+hawk，不含精英/Boss或其他关卡，`runtimeApproved:true`仅代表本地接入|`evidence/current/hawk/engine-runtime.json` 3项Node专项；`hawk/browser-runtime.json`单Edge自然move8/attack8/hit4/death4、双朝向、命中/击杀、32姿态夹具；`browser-public-smoke.json`另验七物种公开资源|**PASS（本地真实Edge + Node；不等于整体遮挡/公网/微信实机）**|
|首关普通蛇妖32姿态接入|复用v3 PNG/alpha实测JSON、`snake-animation.js`与共享注册；仅stage1+normal+snake，idle4源朝向归一；170源像素固定比例/暂定根点，运行批准仅限本地|`evidence/current/snake/engine-runtime.json`12项Node；`browser-runtime.json`单Edge生产模拟move8/attack8/hit4/death4、双向、命中/击杀、暂停、四类状态截图与左右32姿态夹具；自然idle为空。造型/流畅度和自然近身遮挡仍待验|**PASS（本地技术接入+真实Edge）；非最终视觉/公网/当前ZIP/微信实机**|
|候选包只包含运行资源，不公开本机追溯信息|`runtime-frame-contract.mjs`由serve/release共用；八物种6运行字段投影，原始追溯留仓库|`evidence/current/browser-public-smoke.json`本地workspace：八物种资源200、32帧公开契约、9个路径阻断404及约9秒正常战斗；修复console门禁后意外错误0。当前ZIP仍缺狼/猴/鹿/鹰/蛇，未重建/部署/公网验收|**工作区公开资源PASS；当前发布包/公网仍未验收**|
|状态反馈真实且不过度遮挡|`src/renderer.js`；`status-badge-smoke` Node与浏览器入口|`evidence/current/status-badges/node.json`、`browser.json`：8回归；正常倍率不误减速，5类状态/恢复，最多12牌、牌间/玩家避让、暂停稳定、虎妖头顶空间；6组双尺寸夹具明确非自然触发|**PASS（本项有限保证）；敌人身体/血条/伤害数字/HUD整体避让仍待整理**|
|伤害数字不被自身装饰盖住|`renderer.js`只将同一星芒置于文字描边/填充之前，保持数值/几何/样式/生命周期；6项专项进入npm gate|`evidence/current/damage-labels/before/browser.json`记录基线缺陷；`after/browser.json`真实Edge自然伤害截图+8个明确夹具，零错误；`node.json`6项及新npm test通过|**PASS（自身覆字有限修复）；仍未解决数字与角色/怪物/HUD整体遮挡**|
|状态牌不覆住伤害数字|`renderer.js`复用最多48个本帧旋转数字/星芒矩形，原3候选避让或抑制；不移动/删除数字、不改引擎|`evidence/current/feedback-overlap/before/browser.json`旧缺陷、`after/browser.json`两尺寸真实Edge夹具PASS，4个数字变换/值/样式前后一致；自然伤害另存，不冒称自然冲突。8专项与新npm test通过|**PASS（状态牌vs数字有限保证）；身体/血条/HUD/数字彼此仍未验收**|
|伤害数字有限避让敌人身体/血条|`renderer.js`生产 `avoidEnemies:true`；普通/精英/Boss 身体与可见血条有限矩形，四候选、世界视野约束、候选耗尽原位绘制|`evidence/current/enemy-damage-avoidance/node.json`：6/6专项；`evidence/current/validation.json`：`npm test` PASS；`evidence/current/visual.json`：2026-10-12T18:08:21Z 真实 Edge 页面/请求/console/pageerror 0|**PASS（有限包围盒保证）；不等于像素级、HUD、数字互相或全局遮挡**|
|伤害数字有限避让 Boss 名牌|`renderer.js`生产 `avoidBossLabels:true`；复用已布局 Boss 名牌矩形，四候选、世界视野约束、候选耗尽原位绘制并计数|`evidence/current/boss-label-damage-avoidance/node.json`：5/5专项；`evidence/current/validation.json`：`npm test` PASS；`evidence/current/visual.json`：2026-10-12T18:26:59Z 真实 Edge 页面/请求/console/pageerror 0|**PASS（有限名牌矩形保证）；不等于像素级、HUD、数字互相或全局遮挡**|
|伤害数字之间有限避让|`renderer.js`生产 `avoidDamageLabels:true`；只检查此前已接受的有限数字矩形，四候选、世界视野约束、候选耗尽原位绘制并计数|`evidence/current/damage-label-avoidance/node.json`：5/5专项；`evidence/current/validation.json`：`npm test` PASS；`evidence/current/visual.json`：2026-10-12T18:38:05Z 真实 Edge 页面/请求/console/pageerror 0|**PASS（有限数字矩形保证）；不等于像素级、HUD 或全局遮挡**|
|伤害数字有限避让 HUD 与敌人交叉遮挡|`renderer.js` 最多六候选，检查全部障碍与实际视野；NativeGame 尺寸/安全区/DPR 生产路径专项|`hud-occlusion/2026-10-13T03-24-21-081Z/browser.json` 两例旧缺陷；`2026-10-13T03-26-41-421Z/browser.json` 七例真实 Edge 夹具 PASS；03:26:51Z 全量测试、03:28:21Z 通用浏览器 PASS；哈希见本轮 handoff|**PASS（有限包围盒、本地确定性夹具）；非全局/modal/像素级/FPS/公网/ZIP/实机验收**|
|安全区零值不被误当缺省值，异常边界可恢复|`NativeGame.resize` 保留有限零值，缺省/null/非有限值兜底；无可玩区保留数字并计数|`hud-occlusion/safe-area-zero-handoff.json`：八项 Node 边界、11项真实 Edge 夹具、03:41:26Z 全量测试、03:42:38Z 网页流程 PASS|**PASS（本地边界与恢复）；不保证异常输入下可玩/无遮挡，非公网/实机验收**|
|高帧动作与全部局内素材统一后上线|八类普通怪已有本地32姿态技术接入；英雄专项新增基线缺陷证据，未修改游戏|悟净错切、四英雄重复少量源裁切；虎先锋和3Boss专属动作、蛇最终视觉、全局遮挡未完成；当前ZIP缺狼/猴/鹿/鹰/蛇且公网未验；微信实机延期|**未完成，不上线；本地回归不等于最终视觉或公网通过**|
|局外成长、每日目标、一次领取、存档|`src/progression.js`、`native-ui.js`|`evidence/current/platform.json`|**PASS（平台桩；非微信真机）**|
|BGM、普攻/命中/升级/Boss/受击/死亡/UI 音效与静音|`src/audio.js`、`wechat-game/audio.js`、`assets/audio/*.wav`|`evidence/current/audio.json`为2026-10-08T18:06:01.693Z历史独立证据；本轮平台桩新跑，音频浏览器未重跑|**历史真实AudioContext PASS；非主观听评，不算本轮重验**|
|触摸、键盘、DPR、安全区、后台冻结、资源清理|`native-app.js`、`native-ui.js`、`wechat-game/game.js`|`browser-animation-smoke.json`、`visual.json`、平台桩|**PASS（浏览器/桩；真机延期）**|
|数量硬上限、对象池、渲染剔除、长局内存|`engine.js`、`renderer.js`|`npm test`、`visual.json` 指标|**PASS（Node/真实浏览器指标；非微信 GPU FPS）**|
|公网免费测试通道|`scripts/serve.mjs` + Cloudflare 临时通道|本地 allowlist/路径隔离 PASS；`evidence/current/public/external-quic-fail-20261005T1951.json` 记录外部 502|**外部通道 FAIL（环境传输限制，未冒充 PASS）**|
|微信小游戏打包结构|`wechat-game/`、`scripts/build.mjs`、`scripts/release.mjs`|本次npm test构建/平台桩通过；25项ZIP为既有牛版验收，本轮仅核ZIP哈希不变；图片仍走向量回退，touristappid仍是占位|**结构/桩PASS；候选包未重建，AppID/真机延期**|
|商用账号、云存档、广告、分享统计、支付、审核|未接入|需产品账号和服务配置|**延期，未接入，不宣称完成**|

## 统一规则决策

- 悟空第 3 级采用原稿后文明确的 2 倍重击、原范围 1 倍；第 4/5 级为 2.5 倍/1.5 倍、3 倍/2 倍；第 5 级重击独立 30% 眩晕。
- 沙僧第 3 级漩涡持续 1.5 秒；与原稿同时写出的“三秒”冲突时按明确持续时间实现；第 4/5 级总伤害为武器伤害的 8%/12%，每 5 次攻击生成三枚。
- 最终首领在 570 秒出现；600 秒只是计时节点，未击败不能胜利。
- 原著非战斗磨难不伪造妖首：保留原难名，在 `sourceNote` 标成原创心魔幻境/护行守关演绎。
