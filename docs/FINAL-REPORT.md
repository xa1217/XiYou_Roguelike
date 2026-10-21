# 西游·八十一难本轮推进报告

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

更新时间：2026-10-14（Asia/Shanghai）

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

## 最新合成连续播放（2026-10-14 09:07，北京时间）：补实际记录标签覆盖，未批准运行时

单离线Edge正常速无seek播放锁定WebM至真实ended，未重录/开游戏。83个实际呈现回调0.061→3.126s、最大间隔70ms；83原尺寸ROI和3接触表的烧录标签由根代理与独立代理静态读取，0–31皆出现，含idle#6/#7及终态审查保持。标签不是自动精灵像素身份，不代表连续人工运动质量；回调内编码会影响观察，仍不保证编码全帧/零掉帧或游戏FPS。

证据 `evidence/current/tiger-vanguard/composite-playback/2026-10-14T01-07-09-754Z/`（含独立label-observation、完整测试及handoff），无累积，背景ROI最大均值通道偏差1，错误/外网0、浏览器关闭、无服务；09:10:00新npm test PASS，131保护哈希和新媒体/脚本未变。未生图/改生产/ZIP/部署，全部动作/根点/运行时/高帧/公网批准仍false，仍 `NOT_READY`。

下一步只推进真实身份/事件驱动的证据层预览，候选随真实世界位置/事件而非固定合成点；保持原伤害/控制/死亡TTL，不将未批准候选写生产契约，不再重复播放/解码/库存。

## 最新冻结场景合成（2026-10-14 08:56，北京时间）：完整源序列录制，批准门禁不变

复用现有32姿态候选、草案及历史390×844冻结场景PNG，仅证据层离线单Edge合成；没有新游戏或真实UI入口。每tick清空重绘底图，源日志含全部32索引及idle末两帧；固定点/伪血条/合成状态明示，动作2850ms后250ms终态审查保持不能当420ms死亡TTL通过。

最终目录 `evidence/current/tiger-vanguard/composite-preview/2026-10-14T00-56-08-837Z/`，WebM 281422 bytes（SHA `01ba53ec…67e8`）、解码390×844、容器时长3.126323s。7张seek采样确认历史背景，另6张直接夹具图，13图静态查看无累积；源32日志、seek请求、680rAF及30录制请求不证明录像全部姿态、连续质量或FPS。错误/外网0，浏览器关闭、无服务，113保护哈希不变；08:59:07新npm test PASS完整归档。

仍 `REVIEW_FROZEN_BITMAP_FULL32_COMPOSITE` / `NOT_READY`，人工动态/根点/运行时/高帧/公网全部未批准。未生图/改生产/重建ZIP/部署。下一步只连续播放此新WebM并核对实际呈现覆盖/衔接，不再次录制或重复库存检查；本地证据不能升级公网结论。

## 最新连续播放核对（2026-10-14 08:47，北京时间）：已有overlay可连续播放，质量门禁未升级

单个离线Edge正常速度、无seek播放原录屏至真实ended；390×844、2.534066s。保存73次呈现回调及原源日志30目标周边ROI，静态接触表无旧姿态累积；回调不是FPS，目标编号不是自动姿态识别，首0.101s未逐帧观察、最大媒体间隔69ms，不宣称全编码帧或零掉帧。

证据 `evidence/current/tiger-vanguard/incontext-playback/2026-10-14T00-47-59-083Z/`，错误/外网0，浏览器关闭，无服务，111保护哈希不变，08:49:24新npm test PASS归档。原视频只有overlay、缺idle#6/#7；连续播放审计不是人工运动质量、自然战斗、运行时或公网批准。未生图/改生产/重建ZIP/部署，仍 `NOT_READY`；下一步只补完整idle及明确冻结底层合成录屏，不重复同一审查。

## 最新录屏技术核对（2026-10-14 08:39，北京时间）：overlay可解码，不是整局视频或动作批准

复用已有WebM原字节，离线单Edge解码390×844、时长2.534066s；五状态内部与死亡尾段共6张实际解码图已静态查看，排除时间文字后五状态精灵区域签名不同。原录制只含独立overlay，不含底层游戏；原rAF日志只覆盖30姿态，不等于全32帧或FPS。本轮没有连续动态质量、自然战斗或运行时验收。

首轮解码采样器未清空透明canvas导致累积叠影，已reject并保留；补 `clearRect` 后串行复验，无该采样累积，不归因素材或WebM。最终证据 `evidence/current/tiger-vanguard/incontext-decode/2026-10-14T00-39-29-649Z/`，`REVIEW_RECORDED_OVERLAY_DECODE_ONLY`；错误/外网请求0，浏览器已关闭，无服务，102保护文件哈希不变，08:40:56新npm test PASS与日志已归档。未生图、未改生产/ZIP、未部署；动作/高帧/公网仍未批准，门禁 `NOT_READY`。

## 最新局内动态检查（2026-10-13 15:47Z）：候选 ghost 叠加完成技术复核，仍未接入

真实 Edge 从首页→选角→战斗等待自然敌人（1 个）后，取消底层 RAF 并保持 `engine.state.status=playing`，在真实 vector Canvas 上增加第二个独立 overlay，按 motion draft 动态绘制 idle/move/attack/hit/death。五张截图已查看：idle #3、move #12、attack #23、hit #26 左向、death #31。overlay 固定屏幕锚点，不是运行时世界坐标/血条/碰撞。

最终证据目录 `evidence/current/tiger-vanguard/incontext-dynamic/2026-10-13T15-47-17-378Z/`，693 rAF tick、约2566ms、WebM 327646 bytes SHA `bbb1880278853b09c4547e5ffe2e03eaa1f33ef3aca045ddfa47274dc99b9a7d`；页面、console、请求和外网错误0，浏览器及服务已关。`captureStream(30)` 仅为录制请求值，未人工动态观看，不作FPS结论。未改生产资源/代码、未重建 ZIP、未部署；发布门禁仍 `NOT_READY`，`runtimeApproved=false`、`highFrameApproved=false`、`publicPass=false`。

## 最新局内静态检查（2026-10-13 14:38Z）：候选叠加仍未接入运行时

真实 Edge 通过首页→选角→战斗后，在暂停的 vector 游戏画布上增加独立 canvas，静态绘制虎先锋 idle/move/attack/hit/death 五个抽样状态。叠加固定屏幕 `x=276`、`ground=474` 与 86px standing-reference 比例；hit 左向、其余右向，不能代替每状态双向或真实世界坐标、血条验收。暂停由取消 RAF 和 `engine.pause()` 完成，不是点击暂停按钮；death 只抽样末帧，不证明 TTL。

证据目录 `evidence/current/tiger-vanguard/incontext-review/2026-10-13T14-38-16-457Z/` 含 `browser.json`、六张截图、`review.md`、`handoff.json` 与本地 `npm-validation.json`。底层仍 `rendererMode=vector`，候选/草案未被运行时引用；页面、console、失败请求、HTTP、外网请求为0。未修改生产代码/素材/manifest/ZIP，未部署；`overlayOnly=true`、`runtimeApproved=false`、`highFrameApproved=false`、`publicPass=false`，整体继续 `NOT_READY`。

## 最新候选小步（2026-10-13 13:11Z）：根线与换帧漂移完成静态复核

已查看三张根线/终态截图，并按64px报告数据记录各状态相邻帧alpha质心漂移：idle1.001×0.705px、move5.931×3.007px、attack7.549×6.659px、hit1.284×1.453px、death5.373×6.990px。数值只描述像素外轮廓漂移；刀、尾和倒地变化会影响质心，不能批准作者根点、脚底或动画质量。

静态截图中的状态地平线连贯，局内接地、血条、朝向、攻击可读性和动态观看仍待检查。记录 `evidence/current/tiger-vanguard/motion-draft/2026-10-13T12-00-07-310Z/root-drift-review.json`，没有生产改动，发布门禁仍 `NOT_READY`。

## 最新候选小步（2026-10-13 12:39Z）：虎先锋根点与时序草案完成技术复核

复用完整32姿态候选表建立证据层草案，固定每页源比例与状态地平线，列根点只作登记假设，死亡底部包含刀的像素只作代理。独立草案时钟覆盖 idle8、move12、attack16、hit16、death10 源姿态/秒；攻击/受击回移动，死亡保持末帧，未改变战斗计时或死亡TTL。

真实Edge双向48/64px草案对照、时钟边界、实际WebM重新解码和5个采样签名检查完成；Node 20/60Hz合成时钟遍历全部姿态。证据目录 `evidence/current/tiger-vanguard/motion-draft/2026-10-13T12-00-07-310Z/`，12:39:42Z `npm test` PASS。录屏与草案都未进行人工动态质量或FPS批准，未接入、打包或部署，发布门禁仍 `NOT_READY`。

## 最新候选小步（2026-10-13 11:22Z）：完整32姿态复用表与真实浏览器录屏已保存

仅引用29个原v1区域与已有三帧补丁，形成显式idle8/move8/attack8/hit4/death4候选表；未新增/改写图片或运行图集。8项表自检与双阈值裁切/隔离检查通过；单Edge完整状态遍历、64/48px双向与6张已查看截图通过技术预览，另存原生Canvas录屏。首次Playwright录屏缺ffmpeg的失败保留，未下载依赖，关闭后串行使用浏览器自身录制成功。

11:22:20Z新全套测试PASS，91受检保护文件/ZIP未变，错误/外网请求0，浏览器和录制轨道关闭，无本地服务。最终目录 `evidence/current/tiger-vanguard/full-candidate/2026-10-13T11-20-21-840Z/`包含表、录屏、报告、测试输出及详细`review.md`。全部根点仍为临时包围盒底中心，录屏未作人工动态质量批准；下一步完成全状态根点/节奏草案，继续复用、不重生图。整体`NOT_READY`，未接入/打包/部署，非局内、高帧、FPS或公网PASS。

## 最新有限检查（2026-10-13 11:06Z）：既有死亡补丁完成局部衔接源预览

没有生成新素材。现有原death[1]与补丁death[2/3]完成统一页面比例、两种诊断对齐、64/48px双向真实Edge三截图；静态可辨支撑→伏地→平伏，末帧尾/后腿更延展，原内容变化仍然保留。人工肩部点不是精确中心，含刀最低点不是身体接地合同；绘制日志不冒充人工动态流畅度、局内或FPS验收。

11:06:26Z新全套回归PASS，91保护哈希不变，浏览器关闭、未启动服务、错误及外网请求0。最终证据为 `evidence/current/tiger-vanguard/death-seam/2026-10-13T11-05-40-965Z/`；11:03初稿标注已更正且原证据保留。下一步在证据目录整理29原区+3补丁的完整32姿态候选预览，不再重复端点测量或生图。整体`NOT_READY`，未接入/打包/部署，公网未验收。

## 最新有限检查（2026-10-13 10:52Z）：复用候选完成待机接缝诊断

仅检查原idle[6]→补丁idle[7]→原idle[0]及原7控制，不生成或修改素材。近侧脚底对齐、每源固定比例、128px与64/48px双向三截图已查看；真实单Edge两档源姿态速度绘制端点后停止，但没有以绘制日志冒充人工流畅度判断。初次窗口包含上方裤腿/腰带侧缘而在浏览器启动前失败，修正后通过独立解码测量，原记录保留。

10:52:35Z全套测试新跑PASS；91项受检源图/补丁/运行资源/ZIP未变，浏览器关闭、无服务/联网。证据和判定边界见 `evidence/current/tiger-vanguard/idle-seam/2026-10-13T10-51-24-318Z/review.md`。候选仍REVIEW，不由静态轮廓差异自动判合格或失败；下一步复用检查死亡衔接。整体`NOT_READY`，未接入/打包/部署，非公网、局内、FPS或实机PASS。

## 最新素材小步（2026-10-13 07:10Z）：一次三帧局部编辑已完成，保留候选而不接入

imagegen技能约束本轮使用内置编辑、v1唯一源图、非破坏性另存和先验证后接入。仅请求7/30/31三张现有姿态的边缘/间距修复，不重生其余29帧。原始输出完整复制为 `evidence/current/tiger-vanguard/local-repair/2026-10-13T06-27-44-991Z/candidate-v1-three-frame-patch.png`（2172×724、704203 bytes、SHA `e04bdf48…10e5a`），完整提示词为同目录 `prompt.txt`；只调用一次，没有CLI回退或并发窗口。

候选3区域在alpha>8/16下分离，2px边界与100px人物间隔通过，但50px外边距只得到46px。真实单Edge原图与128/64/48px双向对照3截图已查看，像素吻合，错误/外网请求0；浏览器已关闭。倒地末帧尾巴/躯干更展开、头眼处理变化，因此尚不批准直接替换；全图统一比例不代表作者根点或完整动画衔接通过。

07:10:23Z全套测试PASS，90受检原图/运行资源/ZIP不变，未启动服务，未接入/打包/部署。浏览器与回归证据已归档，详见同目录 `handoff.json`。下一步复用现候选作有限衔接审查，不立即重复生图；总体 `NOT_READY`，非局内、高帧、公网、FPS或实机PASS。

## 最新素材小步（2026-10-13 05:45Z）：纠正虎先锋缺帧误判，确定v1三帧局部修复范围

新只读单源库存区分“横向投影分组”“二维连通组件”和“语义动作”：v1在alpha>8/16下都有32个主要组件，四张死亡图实际存在；旧31是包含零散边缘归组后的横向区域数，不足以证明缺最后一张死亡图。初轮统计未纳入hit[3]/death[0]的8/1个零散边缘像素，已更正并保留初始报告，原PNG没有改动或删边。

29个区域通过双阈值2px隔离检查；索引7待机刀尖触画布右边，30/31死亡主体虽分离但完整矩形与边界带入邻体。这将布局修复范围收敛到同一v1的三帧，避免继续混用v2或重生32帧整表。29区仅是源复用候选，造型一致性、脚底根点、节奏/流畅度与局内可读性没有被本库存批准。

最终归档 `evidence/current/tiger-vanguard/single-source/2026-10-13T05-44-03-776Z/` 含5项诊断自检、Node、05:44:50Z单Edge离线预览、3张人工查看截图及05:44:12Z全套测试PASS。浏览器alpha计数吻合，错误/外网请求0，90保护文件不变；浏览器已关、未启动服务。详见 `single-source/handoff.json`。未改生产/PNG、未生图、未打包或部署，仍 `NOT_READY`；不是局内、公网、ZIP、FPS或实机PASS。

## 最新素材判定（2026-10-13 04:44Z）：排除虎先锋仅靠根点平移的跨稿接入

本步只复用两张现有候选，重新核对源SHA/尺寸/用途/像素及零生产引用，用四个待机/攻击过渡端点检查脚底对齐是否足以解决跨稿衔接。初次脚底窗口未覆盖全部脚趾边缘，扩大后串行复核，v2末待机根点x由52修为49.5源像素；两轮诊断均保留，未并发浏览器、未编辑PNG。

最终真实Edge离线诊断为 `REVIEW_ENDPOINT_ALIGNMENT_ONLY`：128px旧bbox/脚底对齐对照、64/48px双向共3截图，技术检查通过，页面/console/请求错误与外网请求均0。人工检查确认胸甲/领口、护腕、腿甲与刀轮廓变化在对齐后仍存在，故不批准只移动根点的混稿接入。高度190/171/171/191源像素不是单独的失败依据；本步只检查四端点，未批准完整32帧、受击/死亡根点或否定所有源级修复方案。

04:44:06Z `npm test` PASS，90受检运行/候选/ZIP文件未变。证据及明确判定见 `evidence/current/tiger-vanguard/continuity/handoff.json`；浏览器已关闭、未启动服务、未生成新素材、未接入、未重建ZIP或部署。下一步先确认一套一致造型的可复用帧与缺口，不能以脚底对齐或32个不同区域数替代动画验收。候选仍REVIEW，整体 `NOT_READY`，非局内、公网、FPS或实机PASS。

## 最新安全小步（2026-10-13 04:22Z）：完成虎先锋身份准备，未接入候选动画

本步仅在首关300秒定时调度为虎先锋赋予独立冻结身份 `tiger-vanguard`，并让死亡特效保留、池对象再利用前清空。普通虎、同名通用精英、手动传入内容记录、中Boss、三位最终Boss及其他关卡不能获得该身份；渲染与战斗规则不变。它是后续独立动作契约的准备，不是候选素材批准。

新Node门禁6项通过；修改前后16组固定种子组合的状态/事件/池/RNG哈希完全一致（仅剔除新增元数据）；04:19:51Z `npm test` PASS。04:22:04Z→04:22:09Z单Edge通过真实UI进入战斗后，300秒、强制死亡/复用、570秒三Boss夹具全部通过，4截图、console/page/request/HTTP错误为0，没有候选或外网请求。截图人工检查确认虎先锋仍显示既有通用矢量精英，身份有无不改变冻结像素；不能把技术PASS当作造型/动作质量或自然存活五分钟。

归档及哈希见 `evidence/current/tiger-vanguard/identity/handoff.json`。78受检素材/候选/渲染与发布相关文件及ZIP未变；正常测试构建更新两份共享bundle，未重建ZIP、未部署，浏览器及8088服务已停。候选保持REVIEW和 `runtimeApproved=false`，跨稿连续性与根点仍须先验收，英雄/首领高帧、当前ZIP及公网继续 `NOT_READY`。

## 最新素材小步（2026-10-13 03:55Z）：虎先锋不新增素材的双页复用方案完成诊断，仍未接入

两份旧稿可互补选取32个源区域：v2提供待机/移动/受击/死亡24区域，v1提供攻击8区域。重新测量源像素和双阈值透明边界后，裁切无触边、哈希均不同且无生产引用；原始两张整表的REVIEW结论不变，没有生成第三张或重新拼装PNG。

`evidence/current/tiger-vanguard/reuse-plan-node.json` 与 `reuse-review/2026-10-13T03-54-57-639Z/browser.json` 保存候选诊断：单Edge完成64px双向、48px右向、32区域播放与5张截图，页面/console/请求错误为0，无联网，浏览器已关闭。此浏览器结果为 `REVIEW_SOURCE_PREVIEW_ONLY`，不是游戏运行或FPS验收。主代理查看统一比例截图后仍保留跨稿身形、胸甲/腰带、刀形与根点/衔接风险；192→171源像素的待机/攻击首帧高度差不能用逐帧拉伸遮盖。

03:54:06Z全套测试PASS，90个受检运行/源图/ZIP文件SHA未变，未启动服务、未接入、未部署。交接 `evidence/current/tiger-vanguard/reuse-handoff.json` 明确下一步先校核造型连续性与作者定义根点，不因整表缺帧继续生成；英雄、首领最终动画、当前ZIP和公网仍 `NOT_READY`。

## 最新安全小步（2026-10-13 03:42Z）：安全区零值边界与恢复已完成本地验证

本步只修正 `NativeGame.resize` 的底部边界默认值：有限坐标 0 不再等同缺省，缺省/null/非有限值仍使用屏幕高度。无可玩区时沿用既有全屏 fail-closed 障碍，数字保留原位绘制并计数，恢复正常边界后重新正常排布；renderer、战斗引擎与素材未改。

真实 Edge 前后报告分别为 `evidence/current/hud-occlusion/2026-10-13T03-40-45-508Z/browser.json`（11例仅零值场景失败）与 `2026-10-13T03-41-44-099Z/browser.json`（11/11 PASS，console/page/request/HTTP 均0）。新增八项 Node 边界与既有四组生产场景通过，`npm test` 于 03:41:26Z PASS；通用网页流程于 03:42:38Z PASS，九截图、console/pageerror 均0，不宣称其未采集的请求计数。

交接 `evidence/current/hud-occlusion/safe-area-zero-handoff.json` 保存本轮日期、哈希、保护文件检查与清理记录；浏览器和服务已停，70个受检文件及既有 ZIP 哈希不变。零值夹具没有可玩区，测试通过仅代表边界正确识别、有限绘制和恢复，不代表此异常输入下界面可玩或数字无遮挡。英雄高帧、虎先锋/三 Boss 动作、整体可读性、当前 ZIP 与公网仍 `NOT_READY`；未生成素材、未重建 ZIP、未部署。

## 最新安全小步（2026-10-13 03:28Z）：敌人/HUD 交叉遮挡伤害数字的本地修复完成

真实 Edge 先复现了 390×844 和 360×640 下的交叉遮挡：数字碰到顶部敌人时，原四个候选仍留在 HUD 后面。本步仅在该交叉条件下补充两个 HUD 垂直边界候选，保留原四候选及全部障碍/视野检查，总计最多六候选；没有修改引擎数值、素材、HUD 或非法边界的 fail-closed 行为。

- 修复前：`evidence/current/hud-occlusion/2026-10-13T03-24-21-081Z/browser.json`，七例中仅两项敌人/HUD 交叉冲突失败。修复后：`2026-10-13T03-26-41-421Z/browser.json`，七例全部 PASS，console/page/request/HTTP 错误均 0，完整数字矩形在可玩区、重复绘制稳定、冻结状态不变。场景为明确注入夹具，不是自然战斗冲突全覆盖。
- Node 专项增加四组 NativeGame 实际视野、尺寸、安全区与 DPR 生产路径，于 03:26:47Z PASS；`npm test` 于 03:26:51Z PASS。通用真实 Edge 流程于 03:28:21Z PASS，九张截图，正常战斗反馈与 console/pageerror 零错误；通用报告未采集 request/HTTP 计数。
- 本轮交接、原始失败说明、证据与源码哈希见 `evidence/current/hud-occlusion/handoff-2026-10-13T03-28Z.md`。引擎、扫描素材和既有 ZIP 哈希未变，浏览器与本地 8088 服务已关闭；`safeArea.bottom=0` 适配边界留待后续。

本步只验收有限包围盒修复和本地回归，不是全局/modal/像素级遮挡、FPS、公网、当前 ZIP 或微信实机通过。英雄高帧、虎先锋/三 Boss 专属动作与公网门禁仍 `NOT_READY`，未生成素材、未重建 ZIP、未部署。

## 最新只读发布门禁（2026-10-13 02:17Z）：网页 ZIP 仍过期，继续保持 NOT_READY

授权外执行 `scripts/audit-release-readiness.mjs`，报告 `evidence/current/release-readiness/2026-10-13T02-17-31-922Z/report.json`。当前网页 ZIP SHA `9c9bd515b0e8dcb5c4d4101838f1ebc3679b0f425ab31685909503c9519ae097` 仍缺狼、猴、鹿、鹰、蛇共 10 个帧 JSON/PNG；微信 ZIP SHA `f017493aaf8eeebccc1ac040ded0397a8bfcc4f8d0cbee56e6be5b04e4dec4e2` 按策略不含网页帧资源。报告结论 `NOT_READY`：英雄高帧、虎先锋/三 Boss 专属动作、公网 PASS 未完成，不重建 ZIP、不部署、不上线。

## 最新安全小步（2026-10-13 02:03Z）：HUD 有限包围盒避让专项通过，授权外真实 Edge 回归通过

本轮只补齐局内 HUD 对伤害数字的有限包围盒避让：NativeGame 的 CSS 顶/底安全带由 `renderer.js` 按 camera/zoom 逆变换成最多两个 world-space 障碍；顶部冲突优先向下、底部冲突优先向上，非法边界 fail-closed 保留原位并记录 `damageHudUnresolved`。不乘 DPR，不改引擎数值、伤害、TTL、RNG、素材或 modal 覆盖层。

- `prototype-2d/tests/hud-occlusion-smoke.mjs` 已纳入 `scripts/validate.mjs`，专项证据 `evidence/current/hud-occlusion/node.json`；`npm test` 于 `2026-10-13T01:56:58Z` PASS，统一结果 `evidence/current/validation.json`。
- 授权外串行本地 8088 的真实 Edge `browser-visual-smoke` 于 `2026-10-13T02:03:13Z` PASS，`evidence/current/visual.json` 覆盖首页、选角、战斗、暂停、升级、三 Boss、结算与 390×844/360×640，页面/请求/console/pageerror 为 0；服务已停止且端口空闲。受限启动失败原样保留于 `evidence/current/visual/browser-launch-failure-20261013T0157.json`。
- 证据边界：仅保证有限 HUD 顶/底包围盒避让与 fail-closed 绘制，不是像素级、全局或 modal 遮挡保证，也不构成当前 ZIP、公网、微信实机或发布 PASS。英雄高帧、虎先锋/三 Boss 独立动作、整体可读性和公网门禁继续 `NOT_READY`，不打包、不部署、不上线。

## 最新安全审计（2026-10-12 20:03Z）：虎先锋候选仍缺 3 个独立姿态，未接入

只读核对虎先锋 v2 候选后确认：图集 1774×887、2,101,074 bytes、SHA `03fadd…92e62`，攻击行只有 5 个区域，29/32 独立姿态，结论保持 `REVIEW`。当前运行时仍使用 v1；v2 未进入 loader、allowlist、runtime contract、manifest 或 release 清单。证据 `evidence/current/tiger-vanguard/next-gap-audit.json` 已保存，未生成第三稿、未修改 ZIP 或部署，不构成虎先锋完整动作或发布 PASS。

## 最新素材小步（2026-10-12 19:47Z）：悟净源级新候选布局预检未通过，未接入

本轮针对悟净源图上排姿态污染只生成一张透明 4×2 候选，并先完成库存边界核对与像素预检。候选 `evidence/current/hero-highframe/wujing-source-candidate-2026-10-12T19-36Z/hero-wujing-source-candidate-v1.png` 的 SHA256 为 `b0364a6b66867079eb177cb963d659a6aa3bcc4f247caa52af0eddc505cda616`，尺寸 1774×887、1,775,106 bytes。预检发现 alpha>8/16 下 7 个主要连通组件跨越 4×2 单元，组件分布 `[1,1,1,1,2,3,3,3]`，内部边界仍有可见像素且 30px 透明间距不满足，结论 `REVIEW_LAYOUT_CONSTRAINTS_NOT_MET`。

候选保留在证据区，未进入 manifest、运行时、ZIP、公网或部署，未生成第二张候选；因此不构成高帧、局内或发布 PASS，门禁仍 `NOT_READY`。

## 最新安全小步（2026-10-12 18:38Z）：伤害数字之间有限避让并完成本地 Edge 复核

生产 `render()` 在既有玩家身体、敌人身体/血条和 Boss 名牌避让之外启用 `avoidDamageLabels:true`；每个数字只检查此前本帧已接受的有限数字矩形，冲突时尝试上/左/右/下四个世界视野内候选，候选同时避开既有障碍，候选耗尽仍原位绘制并记录 `damageLabelUnresolved`，未改引擎顺序、伤害、TTL、旋转、星芒、RNG、素材或 HUD。

`damage-label-avoidance-smoke.mjs` 5/5 PASS，已纳入 `scripts/validate.mjs`；证据 `evidence/current/damage-label-avoidance/node.json`。`npm test` 于 `2026-10-12T18:36:36Z` PASS（`evidence/current/validation.json`）。授权外串行本地 8088 的真实 Edge `browser-visual-smoke` 于 `2026-10-12T18:38:05Z` PASS，`evidence/current/visual.json` 页面/请求/console/pageerror 为 0，服务已停止且端口无监听。

该证据只保证有限数字-数字包围盒避让与 fail-closed 绘制，不覆盖像素级身体、HUD 或全局遮挡，不构成当前 ZIP、公网、微信实机或发布 PASS。英雄高帧、虎先锋/三 Boss 专属动作、整体遮挡和公网仍保持 `NOT_READY`。

## 最新安全小步（2026-10-12 18:27Z）：伤害数字有限避让 Boss 名牌并完成本地 Edge 复核

生产 `render()` 在玩家身体、敌人身体/血条之外启用 `avoidBossLabels:true`。伤害数字与已布局 Boss 名牌有限矩形冲突时，只尝试上/左/右/下四个世界视野内候选，候选同时避开既有障碍；候选耗尽仍原位绘制并记录 `damageBossUnresolved`，未改引擎、伤害、TTL、旋转、星芒、RNG、素材或 HUD。

`boss-label-damage-avoidance-smoke.mjs` 5/5 PASS，已纳入 `scripts/validate.mjs`；证据 `evidence/current/boss-label-damage-avoidance/node.json`。`npm test` 于 `2026-10-12T18:24:17Z` PASS（`evidence/current/validation.json`）。授权外串行本地 8088 的真实 Edge `browser-visual-smoke` 于 `2026-10-12T18:26:59Z` PASS，`evidence/current/visual.json` 页面/请求/console/pageerror 为 0，服务已停止且端口无监听。

该证据只保证有限 Boss 名牌矩形避让与 fail-closed 绘制，不覆盖像素级身体、HUD、数字互相或全局遮挡，不构成当前 ZIP、公网、微信实机或发布 PASS。英雄高帧、虎先锋/三 Boss 专属动作、整体遮挡和公网仍保持 `NOT_READY`。

## 最新安全小步（2026-10-12 18:08Z）：伤害数字有限避让敌人身体与血条并完成本地 Edge 复核

生产 `render()` 在既有玩家身体框避让之外启用 `avoidEnemies:true`。普通/精英/Boss 使用有限保守身体矩形并登记可见血条矩形；数字只在世界视野内尝试上/左/右/下四个候选，候选耗尽仍绘制原位并计数，未改引擎、伤害、TTL、旋转、星芒、RNG、素材或 HUD。

`enemy-damage-avoidance-smoke.mjs` 6/6 PASS，已纳入 `scripts/validate.mjs`；证据 `evidence/current/enemy-damage-avoidance/node.json`。`npm test` 于 `2026-10-12T18:06:13Z` PASS（`evidence/current/validation.json`）。受限 Edge `spawn EPERM` 失败不作为通过；随后授权外串行本地 8088 真实 Edge `browser-visual-smoke` 于 `2026-10-12T18:08:21Z` PASS，`evidence/current/visual.json` 页面/请求/console/pageerror 为 0，服务已停止且端口无监听。

该证据只保证有限敌人身体/血条包围盒避让与 fail-closed 绘制，不覆盖像素级身体、HUD、数字互相或全局遮挡，不构成当前 ZIP、公网、微信实机或发布 PASS。英雄高帧、虎先锋/三 Boss 专属动作、整体遮挡和公网仍保持 `NOT_READY`。

## 最新安全小步（2026-10-12 17:37Z）：伤害数字有限避让玩家身体并完成本地 Edge 复核

本步仅在 `prototype-2d/src/renderer.js` 增加生产 render 的 `avoidPlayer` 有限候选：近身伤害数字与玩家保守身体框冲突时尝试上/左/右/下，完整落在当前世界视野且保留间隔才移动；候选耗尽仍原位绘制。引擎数值、TTL、旋转、星芒、RNG、素材和 HUD 均未改。

`prototype-2d/tests/player-damage-avoidance-smoke.mjs` 已进入 `scripts/validate.mjs`，Node 专项 5/5 PASS（`evidence/current/player-damage-avoidance/node.json`）；`npm test` 于 17:34Z PASS（日志 `evidence/current/player-damage-avoidance/2026-10-13T01-34-25-037Z/npm-test.txt`）。受限 Edge `spawn EPERM` 失败保留于 `evidence/current/player-damage-overlap/2026-10-12T17-34-45Z/browser.json`；授权外本地 8088 串行真实 Edge 于 17:37Z PASS（`evidence/current/player-damage-overlap/2026-10-12T17-37-36Z/browser.json`），页面/请求/console 错误为 0，服务已停止且端口无监听。

同一代码状态下的 `browser-visual-smoke` 于 17:42Z 也在串行本地 8088 服务上的真实 Edge PASS，输出 `evidence/current/player-damage-avoidance/2026-10-13T01-42-17-606Z/browser-visual-smoke.txt`，覆盖首页、选角、战斗、暂停、升级、三 Boss、结算及双移动视口，页面/请求/console 错误为 0；服务已停止。

该证据只覆盖保守玩家身体矩形的有限避让与 fail-closed 绘制，不覆盖像素级身体、血条、HUD、数字互相或全局遮挡；不构成当前 ZIP、公网、微信实机或发布 PASS。英雄高帧、虎先锋/三 Boss 专属动作、整体遮挡和公网仍保持 `NOT_READY`。

## 最新安全检查（2026-10-12 17:02Z）：只读发布门禁仍 NOT_READY

串行运行 `scripts/audit-release-readiness.mjs`，没有重建、解压、上传或部署。工作区八类普通怪帧 JSON/PNG 齐全；现有网页 ZIP SHA `9c9bd515b0e8dcb5c4d4101838f1ebc3679b0f425ab31685909503c9519ae097` 仍缺狼、猴、鹿、鹰、蛇共 10 个帧资源，微信 ZIP SHA `f017493aaf8eeebccc1ac040ded0397a8bfcc4f8d0cbee56e6be5b04e4dec4e2` 按策略不含网页帧资源。报告：`evidence/current/release-readiness/2026-10-12T17-02-23-974Z/report.json`，结论 `NOT_READY`、`deployAuthorized=false`、`publicPass=false`；沙箱 `spawnSync git EPERM` 失败保留于 `evidence/current/release-readiness-attempts/2026-10-13T01-02-23-783Z/sandbox-failure.json`。英雄高帧、虎先锋/三 Boss 专属动作、整体遮挡与公网仍未完成，不打包、不部署、不上线。

## 最新安全小步（2026-10-12 16:52Z）：Boss 标签布局专项与本地 Edge 复核通过

新增 `prototype-2d/tests/boss-label-layout-smoke.mjs` 并加入 `scripts/validate.mjs`。专项覆盖三 Boss 近距名牌互不重叠、玩家避让、状态不变、Canvas 栈平衡与复用缓冲清理；不覆盖身体、血条、伤害数字、HUD 或全局遮挡。`npm test` 于 `2026-10-12T16:48:07Z` PASS，日志：`evidence/current/boss-label-layout/2026-10-13T00-48-07-267Z/npm-test.txt`。

受限 Edge 首次启动的 `spawn EPERM` 已原样保留；随后受限外串行本地 8088 服务上的 Edge 于 `2026-10-12T16:52:45Z` PASS，`evidence/current/visual.json` 页面、请求、console/pageerror 均为 0，9 张截图更新；脚本输出：`evidence/current/browser-recheck/2026-10-13T00-52-21-193Z/browser-visual-smoke.txt`。服务已停止。此为当前工作区浏览器回归，不等于 Boss 独立高帧动作、当前 ZIP、公网或微信实机 PASS；发布门禁仍 `NOT_READY`。

## 最新素材步（2026-10-12 16:15Z）：寅将军动作表单次候选未通过 alpha 隔离

在查明没有可复用的 Boss 动作表后，仅进行一次低频内置 ImageGen 生成。候选 `1774×887`，SHA256 `3bcfe483529722987ed7a919c56495132fa96e1ac6d2e83a69604fc29a70d057`；预检实际分离区域为 5/8/6/6，独立帧 25/32，存在武器跨格和边缘裁切风险，因此标记 `REVIEW`，不接入、不打包、不部署。证据：`evidence/current/boss-assets/yin-general-v1/asset-preflight.json`，交接：`docs/YIN-GENERAL-CANDIDATE-HANDOFF.md`。

本轮已停止连续生成，避免 429 和重复素材；三 Boss 仍使用已通过浏览器复核的身份矢量回退，独立高帧动作仍未完成。

## 最新安全步（2026-10-12 15:58Z）：三位最终 Boss 的身份矢量外观回退通过本地 Edge 复核

在没有合格独立 Boss 动作表之前，本轮只把 `bossIdentity.bossId` 接到 Canvas 矢量回退：寅将军为虎纹双刃、熊山君为熊形重锤、特处士为牛角钩镰；未绑定身份、精英、未知和跨关 Boss 保持旧通用路径。没有生成/复用 PNG，没有改战斗规则，也没有把该回退称为高帧动画。

`prototype-2d/tests/boss-identity-render-smoke.mjs` 已加入全套 gate；`npm test`（`2026-10-12T15:55:09Z`）PASS，日志位于 `evidence/current/boss-identity-vector/2026-10-12T15-55-08-329Z/npm-test.txt`。串行本地 8088 服务上的真实 Edge（`2026-10-12T15:58:42Z`）覆盖首页、选角、战斗、暂停、升级、三 Boss、结算和 390×844/360×640，页面/请求/console 错误为 0；报告为 `evidence/current/visual.json`，服务已关闭。

这只是当前工作区的身份视觉回退与浏览器回归 PASS；四英雄高帧、虎先锋合格 32 姿态、三 Boss 专属动作素材、整体遮挡、当前 ZIP 真实解压和公网通道仍是阻塞项。发布门禁继续 `NOT_READY`，不打包、不部署、不上线。

## 最新安全步（2026-10-11 17:33Z）：本地 Edge 视觉回归通过，公网仍未验

保留先前 Edge `spawn EPERM` 失败后，本地 8088 服务启动并串行重跑 `browser-visual-smoke` 成功。`evidence/current/visual.json`（17:33:29Z）记录真实 Edge 首页、选角、战斗、暂停、升级、Boss、结算与双移动视口，页面/请求/console 错误为 0；服务已关闭。该 PASS 仅说明当前工作区回归未被身份契约破坏，不冲销英雄高帧、Boss 专属动作、整体遮挡、当前 ZIP、公网或微信实机阻塞。

## 最新检查（2026-10-11 17:27Z）：真实 Edge 复核受 EPERM 阻断

身份契约后的串行 `browser-visual-smoke` 未能启动 Playwright Edge（`spawn EPERM`），因此没有新的真实网页 PASS；失败原始记录见 `evidence/current/browser-recheck/2026-10-11T17-27-26-293Z/attempt-failure.json`，历史视觉证据未复用。

## 最新安全步（2026-10-11 17:18Z）：三最终 Boss 身份契约隔离（非动画完成）

首关寅将军、熊山君、特处士现在拥有唯一 `bossId`/`actionId`，仅首关 `finalBoss` 实体透传 `bossIdentity`；普通/精英/中 Boss、虎先锋和其他关卡均不绑定普通动物动作表，死亡特效保留身份后由对象池清空。`npm test` 新跑 PASS，证据为 `evidence/current/boss-identity-contract/2026-10-11T17-18-18-482Z/npm-test.txt`。这不等于三 Boss 专属动作、英雄高帧、全局遮挡、当前 ZIP 或公网验收；发布门禁仍 `NOT_READY`，未部署。

## 最新安全步（2026-10-11 16:34Z）：发布门禁盘点仍未就绪

只读核对工作区运行资源与现有 ZIP：网页 ZIP 仍为旧候选并缺狼/猴/鹿/鹰/蛇帧资源；英雄高帧、虎先锋、三 Boss、整体遮挡和公网当前 PASS 仍是阻塞项。微信包按策略只含 core/vector 与音频。没有重建、部署或公网冒充，证据为 `evidence/current/release-readiness/2026-10-11T16-34-14-926Z/report.json`，结论 `NOT_READY`。

## 最新安全步（2026-10-11 15:07Z）：悟净布局候选退回

本步只调用一次内置 imagegen 编辑现有悟净战斗表，生成 4×2 布局候选并做 alpha 像素诊断、单 Edge 候选预览、`npm test` 和素材审计。候选第 5/6 姿态仍有邻人像素，均分单元还会截断武器/衣带，因此 `candidateLayoutPassed=false`；原图、运行时、ZIP、公网均未改。交接见 [`docs/WUJING-LAYOUT-CANDIDATE-HANDOFF.md`](WUJING-LAYOUT-CANDIDATE-HANDOFF.md)。

## 结论

最新安全步（2026-10-11 08:24Z）：悟净纯矩形裁切修复方案已排除。完整保留上排第2～5个人物时仍夹入邻人武器/衣角，真实Edge预览验证了像素测量结果；缩小矩形会丢掉本人部件，调整锚点无法改变源图内容，因此候选不接入。08:25:39Z新回归及80/76/4库存审计通过，135个保护文件SHA不变。未修生产、未生成/编辑图片、未打包或部署。下一步先隔离原图姿态布局，仍不得称为高帧完成；详见 [`WUJING-CROP-ISOLATION.md`](WUJING-CROP-ISOLATION.md)。

当前最新结论（2026-10-11 08:02Z）：尚不能上线。单Edge真实网页确认悟净错误裁切，四英雄move8/attack8分别只复用3/2个源矩形，再叠加整图变换；四英雄原图切线与双向renderer样本明确保存为 `OBSERVED_BASELINE_DEFECT`。本次是审计留证，不是修复或高帧PASS。新08:03:16Z npm test及80/76/4素材库存审计通过，135个保护文件/素材/manifest/两ZIP SHA不变；首次受限失败保留，自有测试浏览器/服务已退出。

下一步先核准悟净完整裁切/根点；这只能解决串格，不能补足真实高帧。虎先锋/3Boss、蛇最终视觉、整体遮挡、当前候选包和公网门槛继续未完成，未打包或部署；微信实机/账号服务按现行范围延期，不作为网页上线前置。详见 [`HERO-HIGHFRAME-BASELINE.md`](HERO-HIGHFRAME-BASELINE.md)。以下为历史步骤，不能把其局部PASS等同于当前完整验收。

最新虎先锋v2单次定向修复仍未通过布局门槛：死亡行已分开、画布边界通过，但攻击行粘连（5区域、29/32独立姿态）。两份候选均保留为REVIEW，不接入、不打包、不部署；已停止连续生成。生产回归和80/76/4素材审计新跑通过。详见 `evidence/current/tiger-vanguard/v2-handoff.json`。

本轮最新仅完成虎先锋专属候选的查重、一次内置imagegen生成和独立真实Edge预检。候选PNG保留在证据目录，未接入游戏、公开资源、ZIP或部署；alpha布局预检为REVIEW（死亡行7区域、31/32独立帧、边缘裁切）。06:19:49Z npm test PASS，80份媒体/76唯一SHA/4解释副本审计PASS，生成前后运行源/manifest/现有dist ZIP SHA不变。完整证据见 [`TIGER-VANGUARD-CANDIDATE-HANDOFF.md`](TIGER-VANGUARD-CANDIDATE-HANDOFF.md)。

最新一步只补状态牌对伤害数字的有限避让：真实Edge05:37:10Z基线、05:44:13Z最终修复后双尺寸夹具及自然伤害截图已留存，8项专项与05:47:30Z新npm test通过，80份现有媒体和引擎SHA不变。数字内容、位置和画法未改；近身数字仍覆盖角色，整体视觉未批准。八类普通怪已在上一阶段完成本地32姿态接入，dist ZIP仍是缺狼/猴/鹿/鹰/蛇的牛版，未重建、未部署；公网本轮未测。

当前playable battle使用四张4×2角色表、普通虎/熊/牛/狼/猴/鹿/鹰/蛇各32姿态表与Canvas向量地图；精美卡面和旧单姿态图仅用于选角、图鉴、预览或追溯。虎先锋和3Boss仍缺专属动作，英雄最终高帧质量、蛇类最终造型与连续流畅度、全局可读性未批准。自然截图依然存在近身身体/血条/数字/HUD遮挡。外部公网此前502，本次未重测，不以本地PASS替代；当前ZIP也尚未重建。全完成才上线的条件未满足，未上线；微信AppID、真机和商用服务依约延期。下文历史阶段保留原日期，不计为本次浏览器重跑。

## 最新安全小步（2026-10-11）：状态牌与数字有限避让

原三候选状态牌布局现在排斥本帧数字与星芒的旋转包围盒，三个位置均冲突就抑制该状态牌；数字保留原内容/坐标/绘制顺序，状态语义和引擎规则不变。两个尺寸的固定renderer夹具从4牌变3牌，4个数字的Canvas变换、字体和颜色与基线一致；另存真实UI合法输入的伤害截图，不把夹具当自然冲突覆盖。8项独立Node包含48/49数量、120帧缓存复用、20帧暂停/RNG、尖角描边/测量回退等边界；全套、资源hash和两ZIP不变核验通过。

首次浏览器受限失败与一次测试断言误关联同列敌人的失败JSON均保留，最终代码已重验并关闭测试浏览器/服务；05:47:06Z无匹配测试进程或8088/8091监听。详见 [`FEEDBACK-OVERLAP-HANDOFF.md`](FEEDBACK-OVERLAP-HANDOFF.md)。未解决身体/血条/HUD及数字彼此遮挡，未重跑公网、当前ZIP解压或微信实机。

## 前一步（2026-10-11）：数字自身装饰覆字

根因是同一数字先画描边/填充、后画实心星芒，造成装饰压住字形。现在星芒先画，数字及其原描边最后画，伤害、节奏、尺寸、位置与素材不变。`evidence/current/damage-labels/before/`记录真实基线缺陷，`after/`记录05:22:28Z→05:22:30Z本地单Edge修复后PASS；自然流程和夹具分别标注，零页面/请求/console错误。6项Node与全套回归新跑通过，浏览器与自启服务已关闭。这里只消除数字自身覆字，不代表敌人/玩家/HUD互相避让通过，详见 [`DAMAGE-LABEL-PAINT-ORDER.md`](DAMAGE-LABEL-PAINT-ORDER.md)。

## 前一步（2026-10-11）：普通蛇32姿态本地接入

复用已通过预检的v3，不再生成。加载器显式选v3，idle index4源朝向由模块归一，alpha实测矩形+2px、170源像素统一比例、暂定固定根点；只允许stage1+normal+snake。四类状态自然绘制覆盖和截图、左右32姿态独立夹具、暂停冻结恢复均通过；自然idle为空，未冒称覆盖。蛇12项Node包含精确Canvas变换/裁切、原玩法不变、单次死亡0.42秒及对象池字段清理。

公开入口验收修复了忽略路径探测后console错误的问题：只排除精确预期路径的完整404错误，其他全程错误均判失败。真实Edge复测八物种资源200、六字段合同和正常流程通过，9个预期404、0意外错误；范围只是本地workspace。证据、源SHA、失败候选、最终视觉边界和未变ZIP见 [`SNAKE-RUNTIME-HANDOFF.md`](SNAKE-RUNTIME-HANDOFF.md)。首次浏览器受限启动失败单独留存，授权后串行测试并关闭；05:06:03Z无匹配测试残留、可用内存21.53GiB。

## 最新安全推进（2026-10-10）：普通鹰妖32姿态接入与真实Edge验收

本步在生成前审计媒体SHA、尺寸、用途和运行时引用，确认没有普通鹰妖同用途动作表；内置imagegen仅调用一次，保存1774×887透明PNG原字节。独立alpha审计按实测bounds外扩2px，使用加权alpha中心建立列根点与固定行基线，没有逐帧底部吸附或脚本重绘。共享注册、加载、公开合同和allowlist已加入，出生身份只绑定stage1+normal+hawk，精英/Boss/其他关卡向量回退。

- PNG SHA256 `eaa6d8e639c9a29f1d94bcded105b584168ebc67efe9c78017b1f78e2c6cd9e7`；帧合同 `prototype-2d/assets/enemy-hawk-battle-v1-frames.json`，prompt `prompts/enemy-hawk-battle-v1-sheet.txt`。
- `evidence/current/hawk/engine-runtime.json` 3项Node专项PASS；`browser-runtime.json` 单Edge自然move8/attack8/hit4/death4、双向、命中50次/击杀26次、暂停/地图模式与32姿态夹具PASS；idle自然覆盖为空，未强行声称。
- `evidence/current/validation.json` 与 `asset-dedup-audit.json`为本轮新证据：npm test七物种公开契约PASS；媒体79/75/4 PASS。`browser-public-smoke.json`为当前workspace七物种公开入口PASS（不是公网、ZIP解压件或微信实机）；7个404为路径隔离探测。

本轮不宣称动画“完美”、移动端FPS、公网PASS、ZIP解压PASS或微信实机PASS。现有dist仍是牛版候选包，需等蛇/虎先锋/3Boss专属动作、整体遮挡及公网门槛完成后再统一重建与部署。

## 最新安全推进（2026-10-10）：普通鹿妖32姿态接入与修正后验收

本步在生成前审计媒体SHA、尺寸、用途和运行时引用，确认没有普通鹿妖同用途动作表；内置imagegen仅调用一次，保存1774×887透明PNG原字节。独立alpha审计发现均分格会夹断姿态，改用实测alpha bounds外扩2px；发现idle index7源画面朝左，未改PNG而由 `deer-animation.js` 做帧朝向归一。共享注册、加载、公开合同和allowlist已加入，出生身份只绑定stage1+normal+deer，精英/Boss/其他关卡向量回退。

- PNG SHA256 `721ce755d768daca09100f7346c0f1eab6a46f2a4f1aa0ce5b0cc0def33e621e`；帧合同 `prototype-2d/assets/enemy-deer-battle-v1-frames.json`，prompt `prompts/enemy-deer-battle-v1-sheet.txt`。
- `evidence/current/deer/engine-runtime.json` 11项Node专项PASS；`browser-runtime.json` 单Edge自然move8/attack8/hit4/death4、双向、命中/击杀、暂停恢复、左右32姿态夹具与无页面错误PASS。idle自然覆盖为空，未强行声称；夹具不冒充自然玩法。
- `npm-test.txt`、`validation.json` 和`asset-dedup-audit.json`为本轮新证据：npm test 17机制+11虎+13熊+13牛+13狼+9猴+11鹿+8状态；媒体78/74/4 PASS。
- `browser-public-smoke.json`为当前workspace六物种公开入口PASS（不是公网、ZIP解压件或微信实机）；7个404为路径隔离探测。内存/监听只读快照15:54:58Z显示无8088/8091匹配监听或本轮测试进程，约20.55GiB可用。

本轮不宣称动画“完美”、移动端FPS、公网PASS、ZIP解压PASS或微信实机PASS。现有dist仍是牛版候选包，需等全部局内素材/整体遮挡及公网门槛完成后再统一重建与部署。

## 最新安全推进（2026-10-10）：普通苍狼局内运行时接入

本步严格复用已查重的 `enemy-wolf-battle-v1-sheet.png` 与32矩形帧JSON，没有生成、重绘或重编码素材。`wolf-animation.js`、共享敌人注册、串行加载、公开契约投影、serve allowlist 和 release 清单均已接入；身份只允许 `stage1+normal+wolf`，Boss/精英/其他关卡继续走向量回退。

- `evidence/current/wolf/engine-runtime.json`：13项Node/Canvas专项PASS，覆盖32裁切、64左右镜像、自然攻击/受击/死亡、暂停恢复、死亡池字段清空、跨物种隔离、边缘裁切与128个血条包围。
- `evidence/current/wolf/browser-runtime.json`：本地单Edge正常UI→选角→战斗，生产流自然move8/attack8/hit4/death4、双朝向、命中/击杀、暂停截图与时钟冻结/恢复；32姿态左右48px夹具单列；页面错误/失败请求0。首次EPERM和一次清理超时失败报告保留，最终重跑已记录 `browserClosed:true`。
- `evidence/current/browser-public-smoke.json`：本地workspace入口四物种PNG/JSON均200，公开6字段契约32帧、路径隔离、调试关闭和约9秒战斗PASS；7个404是刻意阻断探测。该报告不是公网或当前ZIP解压验收。
- `evidence/current/validation.json`：`npm test`覆盖17机制、11虎、13熊、13牛、13狼、8状态及四角色600秒/正常输入/对象池/渲染/平台桩；主包2.34MiB、可选素材2.93MiB。

本步仍不宣称动画完美、移动端FPS、公网PASS或微信实机PASS。完整交接见 [`WOLF-RUNTIME-HANDOFF.md`](WOLF-RUNTIME-HANDOFF.md)；素材预检历史见 [`WOLF-ANIMATION-HANDOFF.md`](WOLF-ANIMATION-HANDOFF.md)。

## 前一步（2026-10-10）：普通苍狼候选预检（历史）

生成前确认当前75份媒体/71唯一SHA、原项目与legacy用途以及本聊天10张生成图均无狼动作表。内置imagegen生成一次，1774×887、1,410,175 bytes原PNG已复制入项目；32姿态idle8/move8/attack8/hit4/death4，保留真实alpha，没有代码重绘/重编码。完整prompt、来源和SHA登记在manifest，两个运行批准标记保持false。

09:31:04.610Z→09:31:14.415Z的独立Edge检查完成PNG解码、左右48px图集、逐状态不同像素和91次绘制覆盖；录制dataUrl回读1000×720、90个解码回调/90种抽样像素、4.173秒播放结束。原图与3张截图已目视，没有明显截断或串格；不代表最终动画流畅度、每个姿态编码覆盖、游戏FPS或自然局内验收。170源像素统一比例与固定根点仍provisional。

新npm test通过17机制+11虎+13熊+13牛+8状态及四角色600秒、正常输入、对象池、渲染、平台桩/三物种公开帧契约；没有狼局内专项。新素材审计76份/72唯一SHA/4解释副本，旧媒体与牛版ZIP不变。仅扩展独立预检脚本的物种白名单，没有改生产加载器、共享注册、serve/release或玩法。

首次浏览器启动EPERM保留，授权后单Edge完整结束并关闭；09:34:02Z无匹配测试/无头浏览器残留，可用内存约21.01GiB。上一轮证据在`work/wolf-preflight-backup-20261010T091809Z/`；本轮不重跑整体/物种局内/音频/公网/实际ZIP网页。完整交接、素材/录像/prompt与复用接入门槛见 [`WOLF-ANIMATION-HANDOFF.md`](WOLF-ANIMATION-HANDOFF.md)。

## 前一步（2026-10-10）：牛版本地候选ZIP

以下保留历史包验收范围；同名Node/库存证据以`work/wolf-preflight-backup-20261010T091809Z/evidence-current/`中的阶段副本为准，未修改的public报告仍属于该牛ZIP历史步骤。

09:04:57.601Z新的npm test通过，17机制+11虎+13熊+13牛+8状态及长局/平台桩不复用旧PASS。打包后的46/25项清单、字节、SHA256、staging、内外manifest和当前运行源码一致；只输出运行资源，公开虎/熊/牛JSON仅6字段及受限嵌套数据。帧契约后来只更新“已入本地候选包”生命周期说明，公开运行投影未变化。

09:07:24Z标记的真实Edge报告目标`archive-extracted-bull-20261010T090309Z`，服务指向验包后解压目录且`SERVE_PUBLIC=1`。首页→选角→战斗、约9秒实时推进、四角色/虎/熊/牛资源加载、三份精简JSON、7项预期404阻断、`?debug=1`仍关闭debug通过。HTTP另核GET/HEAD正文长度及入口/牛PNG与解压件字节一致，不是用workspace冒充ZIP或公网。

首次受限环境子构建失败保留，授权重跑通过；旧包和完整上一轮证据已备份至`work/release-backups/pre-bull-20261010T090309Z/`，生成目录重建可恢复，未删素材或改原项目。测试浏览器与8091服务已关闭，09:09:55Z只读快照无匹配残留、空闲20.92GiB。仅复用一个已结束的轻量只读代理，不新开素材窗口。

完整交接见 [`BULL-RELEASE-HANDOFF.md`](BULL-RELEASE-HANDOFF.md) 及`evidence/current/bull/release-handoff-verification.json`。本项只验证候选包，不宣称全部高帧动作、整体遮挡、公网或微信实机完成，未上线。

## 前一步（2026-10-10）：普通野牛局内运行（历史记录）

以下保留接入当时未打包的范围，后续已由上节补齐本地候选包验收。该阶段同名证据在`work/release-backups/pre-bull-20261010T090309Z/evidence-current/`，当前public报告不再是该阶段workspace报告。

复用1774×887、1,137,073 bytes原PNG及32个实测裁切，150源像素统一比例、固定行列根点、48世界像素基准体高和3.45r血条偏移；不逐帧贴底/拉伸。仅出生身份stage1+normal+bull绑定牛表，Boss/精英与其他关卡排除；死亡保持朝向/体型，0.42秒回收。共享注册、串行加载、公开6字段投影、serve/release清单和构建顺序已更新，原引擎、renderer和虎/熊模块本轮未改。

牛真实Edge08:31:23Z→08:31:28Z PASS：正常UI后合法输入驱动约24.36游戏秒加速生产模拟，move8/attack8/hit4/death4均观测到绘制、累计双朝向、暂停图像/时钟冻结与恢复；左右32姿态48px生产夹具另列。自然drawImage覆盖不等于所有姿态无遮挡，也不等于每帧均自然双向触发；截图仍显示接触遮挡。

虎/熊、四角色、整体页面、状态真实浏览器新跑通过；08:38:43Z标记的public报告目标为`workspace-bull-runtime-20261010T082708Z`，三物种资源/受限帧JSON、正常流程、debug关闭、9秒推进及7项预期404阻断通过。最终npm test于08:44:42Z完成PASS：17机制+11虎+13熊+13牛+8状态及长局/平台桩。资产再审计75/71/4，不复用候选预检代替局内证据。

本轮没有重跑音频、公网、微信实机或发布构建。服务与测试浏览器已关闭；完整证据/源文件哈希、进程快照、局内批准与旧ZIP边界见 [`BULL-RUNTIME-HANDOFF.md`](BULL-RUNTIME-HANDOFF.md) 和 `evidence/current/bull/runtime-verification.json`。上一步同名证据已保存在`work/bull-runtime-backup-20261010T082708Z/evidence-current/`。

## 前一步（2026-10-10）：普通野牛候选预检（历史记录）

以下为当时尚未接入的记录，当前运行状态以上节为准；当时同名证据见上述备份，不把后续覆盖的文件用于证明历史时点。

终稿1774×887、1,137,073 bytes，32姿态为8/8/8/4/4；已保存PNG、实测裁切契约及两份prompt，内置来源SHA与原图一致。150源像素统一比例、固定根点仍为provisional，禁止均分图、逐帧拉伸或重复生成。

单Edge独立预览于08:14:57Z启动、08:15:07Z完整结束，PNG解码、不同像素、左右镜像、全姿态绘制覆盖通过；输出左右48px图集、48/56/96px抽样与WebM。录制dataUrl回读确认1000×720、90个解码回调/90种抽样像素并播放结束，不等于所有源姿态被编码、最终流畅度、生产游戏或公网PASS。

08:17:08Z新的npm test通过，17机制+11虎妖+13熊妖+8状态回归及长局/平台桩不复用旧PASS；最新库存75/71/4，manifest无差异。牛仍未进入loader/serve/release，自建浏览器已关闭；EPERM失败保留，旧包/原项目不动。完整证据和下一步局内接入门槛见 [`BULL-ANIMATION-HANDOFF.md`](BULL-ANIMATION-HANDOFF.md)。

## 前一步（2026-10-10）：本地候选ZIP

该阶段网页43项/微信25项与当时显式运行文件清单、源码、staging和内外manifest一致，包内不带legacy、历史证据、生成脚本或本机账号配置。验包发现帧JSON混有本机生成来源后，公共服务与打包改为同一6字段投影，并限制嵌套字段；原始仓库追溯保留，动画裁切数据不变。此后牛接入已改变源码，旧包不再与当前源码一致。

真实Edge从实际ZIP解压件进入首页→选角→战斗，约9秒实时推进、帧变化、四角色/虎/熊素材加载、资源隔离和强制debug关闭通过。只代表本地候选包，未重跑外部公网或所有专用动画/音频浏览器。旧包和重跑前证据已备份；沙箱构建/浏览器启动失败保留后授权重跑，测试服务/浏览器已关闭。详见 [`BEAR-RELEASE-HANDOFF.md`](BEAR-RELEASE-HANDOFF.md)。

## 前一步（2026-10-10）：普通熊妖局内接入

共享注册表串起出生身份、时钟、死亡、裁剪与绘制。普通熊妖保持136源像素统一比例与固定根点，熊妖血条单独3.4r偏移；attack/hit/death视觉分别为0.5/0.25/0.42秒，不改变玩法或RNG，死亡不拉伸并清理复用字段。

13项熊妖Node专项覆盖身份/跨物种、状态、玩法对照、池、32裁切64镜像、四边视野和128个血条包围。真实Edge正常UI后合法输入加速生产模拟，自然move8/attack8/hit4/death4、双朝向、暂停冻结恢复通过；左右48px生产renderer夹具另列。图片与现有素材均未重复生成。

虎妖、角色动画、整体视觉、状态提示和本地网页新跑PASS，npm test新跑17机制+11虎妖+13熊妖+8状态专项及长局/平台桩。公网、音频未重跑；本地网页证据针对workspace，不覆盖10月9日旧ZIP。截图未见明显脚底/裁切异常，但不宣称最终全局视觉完美。完整证据与有限保证见 [`BEAR-RUNTIME-HANDOFF.md`](BEAR-RUNTIME-HANDOFF.md)。

## 前一步（2026-10-10）：普通熊妖素材预检

生成前核对当前副本、原项目现役素材目录（只读）及本聊天生成图，没有同用途熊妖动作表。10月9日初稿攻击行相接，经过一次内置布局编辑后保留终稿，原PNG未脚本重绘；10月10日恢复中断预检并完成登记。

- 最终PNG为1774×887、978099 bytes，32姿态idle8/move8/attack8/hit4/death4；SHA256 `49cf7d76bc03808b7a7b8d0ec07e4c0fdd21876d4524a14d26b8ca1207b2571f`。使用实测裁切、136源像素统一比例；锚点provisional，局内脚底和衔接待验。
- 真实Edge于2026-10-10T04:46:20Z启动并完整结束：PNG解码、逐状态不同像素、镜像、91次绘制覆盖全部姿态、页面错误0。输出左右atlas和独立动作录像；未回读解码WebM，不宣称录像保留91帧、流畅度、实时FPS或生产游戏通过。
- `audit-actor-sheet`、`audit-assets`与 `npm test` 本次新跑通过。库存74份媒体、70个唯一SHA、4组可解释重复；manifest无缺失与metadata差异。测试于2026-10-10T04:57:07Z完成，17机制+11虎妖+8状态回归及长局/平台桩通过。
- 仅一个素材任务、串行浏览器和一个复用的只读复核代理；脚本自建浏览器已关闭。初稿REVIEW、首次EPERM、旧录像INCOMPLETE分别保留，没有覆盖为PASS。

当时预检阶段交接见 [`BEAR-ANIMATION-HANDOFF.md`](BEAR-ANIMATION-HANDOFF.md)。该阶段候选未进入loader/serve/release；随后完成局内接入和本地候选包验收。此段不替代最新运行状态。

## v3 视觉切换与验收（2026-10-09历史阶段）

- 四张当前局内角色表：`hero-wukong-battle-v3-sheet.png`、`hero-tangseng-battle-v3-sheet.png`、`hero-bajie-battle-v3-sheet.png`、`hero-wujing-battle-v3-sheet.png`；每张实测 1774×887、4×2 透明帧格，manifest 登记 bytes、SHA256、pivot 和状态 fps。
- 角色状态序列覆盖 idle、move、attack、hit、stun、dash、intro、death；renderer 按真实帧裁切并对左向移动镜像，缺图时回退到同状态的确定性向量 rig。旧 `hero-battle-v2-atlas.png`、`hero-tangseng-kr-v1.png` 和旧敌人/Boss 单姿态 PNG 不在 playable battle 启动路径。
- 局内地图改为安静的 `vector` 场景：双叉岭山脊、中央通道和少量固定地标由 Canvas 每帧绘制；精美地图 PNG/SVG 不再作为 back/mid/front 洗层，`renderer.mapAssetDraws === 0` 是预期的“没有误加载静态地图”信号。
- 连接超时、429 或公网失败时只记录原始失败并继续本地安全验证；未重新生成的证据不能写成 v3 PASS。
- `npm test`、`browser-animation-smoke`、`browser-visual-smoke`、`browser-public-smoke`、`audit-assets` 和 `npm run release` 已在本轮串行执行并通过。真实浏览器验收使用单窗口，避免并发请求造成 429；公网等价 smoke 的刻意 404 探测是 allowlist 的预期阻断。
- 10月9日该轮素材扫描为73个文件、69个唯一SHA-256、4组可解释重复；四张英雄表各8格，虎妖32独立姿态。该次接入未生成或重编码图片。网页发布包已纳入虎妖PNG、实测JSON与共享模块，仍排除legacy、历史证据、测试、生成器、密钥与本机账号配置。

## 历史推进（2026-10-09）：复用普通虎妖32姿态完成局内接入

前一轮用内置imagegen生成的PNG直接复用，SHA不变，不重生成。仅首关normal+tiger获得专属身份，虎先锋和寅将军不共用；实测矩形以130源像素统一比例、固定脚底绘制，不叠加拉伸、旋转或摇摆。自然接触攻击0.5秒/受击视觉0.25秒不改变伤害、碰撞、移动或随机数；死亡保留朝向/原体型，0→3单次播放并在原0.42秒TTL回收。

`npm test`新增11项虎妖回归全部通过。真实Edge正常UI进入后，合法输入驱动的加速生产模拟实测move8/attack8/hit4/death4、双朝向、键盘暂停图像/时钟冻结与恢复，页面/请求错误为0。32姿态左右48px生产渲染夹具独立标注，不能当作自然游戏或手机FPS。证据 `evidence/current/tiger/browser-runtime.json`、`engine-runtime.json`；完整记录见 [`TIGER-ANIMATION-HANDOFF.md`](TIGER-ANIMATION-HANDOFF.md)。首次沙箱EPERM、首次移动末帧未完整覆盖的FAIL均保留；随后合法输入改为先等待完整走近再攻击并重跑通过，没有篡改游戏状态。

## 10月9日安全推进：状态提示修复

该轮状态显示修复：`slow=1`是正常速度，旧`slow>0`条件导致全体误报并吞掉击退反馈。现以真实倍率判断减速，状态牌最多12个并有限避让，虎妖血条锚点移出32姿态包围，眩晕不重复画星环。新增8项Node回归已加入`npm test`；10月9日单Edge专项覆盖正常UI后240次生产更新、暂停恢复，以及明确标注的6组双尺寸状态/恢复/密集夹具。详见 [`STATUS-BADGE-HANDOFF.md`](STATUS-BADGE-HANDOFF.md)。其余敌人身体/血条、伤害数字和HUD不在此项避让保证内。

## 聊天历史与指令边界

附件 `codex-sessions-20261005-163155.zip` 已完整分析：44 个会话、21,816 行 JSON、527,424 个可见文本字符，覆盖清单 SHA256 全部匹配。原始产品需求、后续裁决、冲突处理和“哪些是项目指令而不是用户需求”的区分见 [`CHAT-HISTORY-ANALYSIS.md`](CHAT-HISTORY-ANALYSIS.md)。

本次用户请求是分析全部聊天并依据原始需求继续推进；附件中的 `AGENTS.md`、验收规则、发布排除项和“网页/公网优先、微信实机延后”属于当前项目约束。聊天里的旧 PASS、旧工作树路径、子代理提示词、工具输出以及协作平台/商用账号方向没有被当作新增授权，也没有复用历史证据。

## 历史实现与验证（截至 2026-10-05；不覆盖 v3 改动）

|范围|命令/入口|时间（UTC）|结果与边界|
|---|---|---:|---|
|核心机制与发布门禁|`npm test`|13:44:56|PASS；17 项引擎回归、四角色 600 秒、正常玩家输入、对象池、渲染、平台桩；平台桩明确不是微信真机|
|动画、技能图标与资源|`node scripts/browser-animation-smoke.mjs`|13:57:40|PASS；真实 Edge，4 个本命技能图标与 8 个法宝图标加载，攻击/移动帧变化、暂停帧稳定、恢复后继续、真实 PNG/SVG、双叉岭地图|
|音频|`node scripts/browser-audio-smoke.mjs`|12:39:53|PASS；真实 Chromium `AudioContext` 分析器、事件触发、静音和 dispose；不是主观听评|
|视觉主线|`node scripts/browser-visual-smoke.mjs`|13:59:39|PASS；390×844/360×640，首页、选角、战斗、暂停、升级、Boss、结算、移动尺寸和指标|
|本地公网同等流程|`XIYOU_URL=http://127.0.0.1:8089/ node scripts/browser-public-smoke.mjs`|14:01:16|PASS；正常首页→选角→战斗→9 秒推进、资源 allowlist、路径穿越/测试/生成器/manifest 隔离|
|外部临时通道|`XIYOU_URL=https://doctors-mistakes-mai-marine.trycloudflare.com/ node scripts/browser-public-smoke.mjs`|11:51:01|FAIL；真实 Edge 收到 502，原始记录保存在 `evidence/current/public/external-quic-fail-20261005T1951.json`|

### v3 运行时重验结果（2026-10-09）

|范围|命令/入口|当前结果与边界|
|---|---|---|
|核心机制与平台桩|`npm test`|PASS；17项原引擎+11项虎妖+8项状态回归、四角色600秒、对象池、渲染和平台桩；Node/mock不是微信真机|
|状态提示专项|`node scripts/browser-status-badge-smoke.mjs`|PASS；正常速度不误标、暂停/恢复；双尺寸夹具验证状态正确、恢复消失、12牌上限及有限避让；夹具不是自然触发|
|虎妖局内动画|`node scripts/browser-tiger-smoke.mjs`|PASS；真实Edge自然move8/attack8/hit4/death4、朝向与暂停恢复；32姿态左右48px夹具另行标注|
|真实动画|`node scripts/browser-animation-smoke.mjs`|PASS；四张 v3 表和 12 个技能/法宝图标加载，攻击/移动帧变化、暂停冻结/恢复继续、无页面错误|
|真实视觉|`node scripts/browser-visual-smoke.mjs`|PASS；首页、选角、战斗、暂停、升级、Boss、结算、移动尺寸和自然伤害反馈通过；`battleSceneMode=vector`、`mapAssetDraws=0`|
|本地公网等价流程|`node scripts/browser-public-smoke.mjs`|PASS；allowlist、路径隔离、首页→选角→战斗、9 秒实时推进和动画变化通过；探测的 404 为预期阻断|
|真实音频|`node scripts/browser-audio-smoke.mjs`|PASS；真实 Chromium `AudioContext` 分析器确认攻击、命中、受击、击杀、精英、Boss、拾取、冲刺、UI、暴击、胜负事件有峰值，静音与 dispose 通过|
|素材去重|`node scripts/audit-assets.mjs`|PASS；新增虎妖后73个素材、69个唯一 SHA-256、4组可解释重复；无须重复生成的同用途素材|
|发布构建|`npm run release`|PASS；当前本地候选网页包10,553,223 bytes，微信包5,042,835 bytes，SHA256见 `dist/RELEASE-MANIFEST.json`；微信仅逻辑/向量回退，未部署|

本轮生成的入口文件包括：`evidence/current/validation.json`、`platform.json`、`full-run.json`、`normal-run.json`、`visual.json`、`animation/browser-animation-smoke.json`、`audio.json`、`browser-public-smoke.json`、`asset-dedup-audit.json` 和 `dist/RELEASE-MANIFEST.json`。截图均写入 `evidence/current/`，没有引用 10 月 4 日历史 PASS。

“历史实现与验证”中的10月5日表只作追溯；其地图分层和旧静态帧条件不再是当前门槛。最新状态修复后重新执行Node、状态、虎妖、角色动画、视觉、素材查重、候选包和本地发布包网页验证；只使用新证据评估受影响范围。音频表沿用10月9日前一轮独立音频专项证据，本次没有修改或重新生成音频，不将它计作本次状态专项重验。外部公网与微信实机仍单列未完成。

本轮还修复了微信音频适配器中 `crit` 事件静默的问题：它现在明确复用已有 `hit.wav`，没有新增音频素材；平台桩与真实浏览器音频生命周期重新通过。

## 素材复用与去重

10月10日鹿步骤后重新运行 `scripts/audit-assets.mjs` 生成 [`asset-dedup-audit.json`](../evidence/current/asset-dedup-audit.json)。当前78个文件、74个唯一SHA、4组字节级重复，虎/熊/牛/狼/猴/鹿32姿态均已接入；manifest尺寸/bytes/hash校验通过，本轮只生成一次鹿表。重复组均为legacy镜像、微信包复制或追溯候选，不是重复运行素材。四张v3角色表各8格；技能/法宝图标复用。新素材仍必须先查哈希、尺寸、用途、构图与运行时引用，禁止改名或无意义重编码制造副本。

## 发布包（2026-10-10 牛版本地候选，未部署）

现有本地ZIP已包含牛接入变更，公开帧JSON不含本机生成来源；本轮完成本地验包及实际解压件网页验收，未部署。`dist/RELEASE-MANIFEST.json`描述以下新候选包：

- [`dist/xiyou-survivor-web-v1.0.0.zip`](../dist/xiyou-survivor-web-v1.0.0.zip)：12,591,435 bytes；SHA256 `9c9bd515b0e8dcb5c4d4101838f1ebc3679b0f425ab31685909503c9519ae097`。
- [`dist/xiyou-survivor-wechat-game-v1.0.0.zip`](../dist/xiyou-survivor-wechat-game-v1.0.0.zip)：5,043,614 bytes；SHA256 `f017493aaf8eeebccc1ac040ded0397a8bfcc4f8d0cbee56e6be5b04e4dec4e2`。

`dist/RELEASE-MANIFEST.json` 是包内文件清单。发布包只保留当前运行资源，排除 `legacy-source`、历史证据、测试、生成脚本、密钥和本机账号配置；微信项目仍使用占位 `touristappid`。

牛版网页46项/微信25项核对见`evidence/current/bull/release-verification.json`；当前`browser-public-smoke.json`目标为`archive-extracted-bull-20261010T090309Z`，旧workspace报告在`work/release-backups/pre-bull-20261010T090309Z/evidence-current/`。熊包阶段记录及其备份继续保留，不混作本轮结果。以上均是本地候选，外部公网仍未通过。

## 未完成项与下一步

1. 取得稳定公网托管或允许 QUIC/HTTP2 的网络通道后，重新跑外部 `browser-public-smoke`；在此之前外部公网状态保持 FAIL/未验收。
2. 普通虎/熊/牛/狼/猴/鹿均已完成本地运行时接入，禁止重生成；当前dist仍是未含狼/猴/鹿的牛版ZIP，需待整体素材完成后统一重建。鹰/蛇、虎先锋和3Boss动作待补。英雄8格表的帧变化PASS不等于最终高帧质量达标；接触身体/血条/数字/HUD遮挡仍需整理，不能宣称全部素材或全局视觉完美。
3. 在微信开发者工具填入真实 AppID，检查分包/包体，并在低端 Android/iOS 真机复测 FPS、内存、触摸安全区和资源解码。
4. 接入并验收微信登录、云存档、广告、分享统计、支付、审核发布等商用服务。

以上延期项不影响当前网页垂直切片和微信核心逻辑的本轮验收结论，但不能被表述为已完成。
