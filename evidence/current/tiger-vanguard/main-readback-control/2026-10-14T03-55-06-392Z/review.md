# 无proxy主画布重复/读取顺序控制：FAIL（未恢复深度）

证据目录：evidence/current/tiger-vanguard/main-readback-control/2026-10-14T03-55-06-392Z/
唯一真实Edge 155.0.4283.45，2026-10-14 11:55（北京时间），390×844 / DPR1。只新增scripts/browser-tiger-vanguard-main-readback-control.mjs，不改生产Canvas创建设置/尺寸/绘制顺序/素材。六帧同一同步page.evaluate，无await/RAF/截图插入；原玩家→候选、玩家原方法各1次。没有创建透明proxy。

## 已实证

1. 帧1–3只导出主PNG，帧4–6逐帧主PNG→getImageData，9次读取全部在render之外；PNG-only不是无读取，toDataURL本身也是readback。
2. 关闭context/browser/server之后Node解码六PNG：1→2/2→3/3→4/4→5差均0，5→6差265010，最大通道差47，bbox x0–389/y15–824。唯一失败门禁allSixPngPixelsStable=false。同帧4/5/6 PNG与各自1316640字节RGBA8/sRGB raw差均0，3原始文件共3949920字节。
3. 独立pngjs解码全部7PNG/raw复算一致：5→6有772行差，239969像素最大差1、20409差2、4632差≥3；banner1129/top UI32788/arena230322/bottom UI771，RGBA变化计数260897/16434/18267/0。不是只在人物边缘发生的微差。
4. 六帧完整已覆盖main方法记录严格相同：每帧395命令、74状态表条目、26 style键、33 transforms、玩家58方法（含transform）、annotation5原main方法、3 drawImage源引用。全方法CTM/styles/dash、measureText实际指标、source args/hash/尺寸/对象ref、真实view/HUD、context最终pre-read状态、原始uiAnimation/press/joy/input与engine/RNG/elapsed/反馈均纳入严比。独立重构无差或悬空state/source ref；栈余额0、underflow false、clip0。
5. 真实hero PNG1774×887、候选v1 PNG1774×887、weapon SVG128×128三引用稳定；两运行source HTTP200且SHA一致（本地），candidate锁定dataURL。仅所用来源，不冒称32姿态或公网验收。
6. 31render/6consume只读检查，16RNG、elapsed固定1.0036999999955305。UI inactive/press=null/joy=null/running=false/frame=0/renderDt=0。页面/console error/失败请求/HTTP/外网0，hook引用还原、dispose及context/browser/server关闭明确记录；独立审查这些旗标不是独立进程观察。

## 有限结论与局限

无人物镜像仍可在本夹具复现主图不稳定，因此镜像不是复现这一观察现象的必要条件。不能据此证明getImageData/后端是原因或解释上轮深度失败的唯一根因：两组顺序及之前draw/export/read历史混杂，PNG序列自身亦读取；getContextAttributes相同（alpha=true/srgb/unorm8/desynchronized=false/willReadFrequently=false）不识别实际GPU/CPU backend，console warning未收集。与上轮elapsed/RNG等不同，不作跨run像素恒等推论。

property赋值只在方法入口/变换后采样，未逐setter追踪；initial native path/clip/stack不可完整直接验证；覆盖当前实际方法集合不是所有Canvas API保证。异常会令evaluate拒绝而丢失未返回的部分trace/raw，本轮没有该错误，不能泛称失败总有完整证据。证据banner5方法已入独立annotation segment，最终contextAfter在banner之后采样。

入口真实首页→选角→战斗（debug=false/time≈1.0037s），之后明确300秒加速、清集合/重定位/direct damage及25ms部分子系统夹具，非自然五分钟。只hit26、单目标、空状态牌，未验attack/death/双向全态/高帧/FPS。根代理看7PNG，独立代理看5/6主图：玩家仍被虎先锋遮挡，原英雄裁切/重复源动作缺陷未修。肉眼接近不冲销265010像素FAIL。

## 新测试与交接

11:57:19–11:57:26新npm test exit0/PASS，完整49163字符原输出归档；该PASS不冲销真实Edge FAIL。根代理新测试后复核256保护、7PNG/3raw/script/browser不变，独立复核一致；源图/candidate-table/motion/layout和两ZIP不变。脚本SHA 52c00393e65a2d71314c068b24d783f4ebc49b268de85c35e472cae841df2ba3，browserSHA 89cf8cfe1680e62c207d364f3f31a7dc0cdc3f190892d6a9e8b6f1aa9b483a58。不生图/录屏、改生产、重建ZIP、部署、公网复验；前序三深度FAIL与原链控制FAIL保持。所有可读性/motion/root/runtime/highFrame/FPS/public/release批准仍false，总体NOT_READY。

## 下一唯一安全步

仅建立证据层“无额外main.getImageData的同深度原链镜像基线”：单真实Edge六帧，原玩家各1次、原顺序，完整main/annotation/source trace保持；原始变换链镜像及proxy调用/读取另表，逐帧保存主/proxy PNG后在关闭浏览器后解码比较。main.toDataURL仍为readback，不称无读取或无干扰；另记console warning供诊断，不变主context创建/尺寸/阈值、不宣称跨run像素恒等或已证明读取因果。保留匹配FAIL，先确认该基线重复性，再另步恢复深度对照，不接入/打包/部署。

