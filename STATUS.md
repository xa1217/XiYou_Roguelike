# 西游·八十一难当前状态

## 2026-10-15 17:23Z：三 Boss 专属动作资产预检完成（未生成/未接入）

对寅将军、熊山君、特处士逐一核对了生产素材目录、SHA-256、尺寸、用途与运行时引用。结果为 `PASS_PRECHECK_NO_REUSABLE_BOSS_FRAMES`：生产目录没有三 Boss 专属 `frames.json` 或动作图集；普通虎/熊/牛 32 姿态表均明确只允许 `stage1 + normal`，不能复用于 Boss；`enemy-boss.svg` 仍是通用向量回退；旧 `enemy-boss-kr-v1.png` 与寅将军候选均为历史/未批准素材。证据：`evidence/current/boss-assets/contract-preflight/20261015T172340Z/report.json`。本步未生成图片、未修改运行时、未重建 ZIP、未重新上传公网；当前 Netlify 入口和原有手工公网复核保持不变。若继续制作 Boss 高帧动作，必须逐个独立生成并通过帧合同预检后才可考虑接入。

## 2026-10-15 17:40Z：预检后本地回归复核通过（公网边界不变）

在未修改生产素材、运行时或 ZIP 的前提下重新运行 `npm test`，结果 `PASS`（17 项引擎回归、8 类普通怪公开 32 帧合同、四角色 600 秒自然战斗、输入/对象池/渲染/平台桩）。最新摘要：`evidence/current/validation.json`。该结果仅证明本地 Node/Canvas 合同；不改变三 Boss 动作缺口，也不升级为真实浏览器、公网、FPS 或微信实机 PASS。网页包 SHA 仍为 `571199412a54e9fc5bb09afe5eebf371f7b35ed3967bf884927c1b0b481724f6`，因此本轮没有重复上传公网。

## 2026-10-15 17:46Z：发布就绪只读审计仍为 NOT_READY

只读审计确认当前 Web ZIP（SHA `571199412a54e9fc5bb09afe5eebf371f7b35ed3967bf884927c1b0b481724f6`，63 entries）和 WeChat ZIP（SHA `e81ad08055084bb870c894e92c136d078fdd88e69f97dda6cdc76e06e7e821c3`，29 entries）均包含预期运行帧资源，但发布门禁仍为 `NOT_READY`：英雄高帧 FAIL、虎先锋 REVIEW、三 Boss 专属动作 `GAP_CONFIRMED`、整体遮挡未完成、当前没有自动公网 PASS。证据：`evidence/current/release-readiness/2026-10-15T17-46-04-308Z/report.json`。审计未重建、未上传或部署任何包。

## 2026-10-15 17:56Z：熊山君候选生成因内置模型不支持而失败（未生成）

按串行素材任务单仅发起一次熊山君独立 8×4 透明动作表候选请求；内置 `image_gen` 在生成前返回 HTTP 400：当前 Codex + ChatGPT 账户不支持 `gpt-5.5`。没有输出图片，也没有修改生产、运行时、ZIP 或公网。未自动切换 CLI/API（需要用户明确授权及 `OPENAI_API_KEY`）。证据：`evidence/current/boss-assets/xiong-shanjun-v1/generation-attempt-20261015T175629Z.json`。普通熊妖图集仍不可复用。

## 2026-10-15 18:02Z：熊山君候选第二路由仍失败（账号池不可用）

为避免重复使用不支持的默认模型，串行改用支持模型路由再次只尝试一次同一熊山君候选；内置 `image_gen` 在生成前返回 HTTP 503 `auth_unavailable`（账号池 2 个候选均不可用）。未生成图片、未改生产/运行时/ZIP/公网，未使用 CLI/API fallback。证据：`evidence/current/boss-assets/xiong-shanjun-v1/generation-attempt-20261015T180213Z.json`。按低频约束不再重试，等待账号池恢复或用户明确授权 CLI/API fallback。

## 2026-10-15 18:15Z：生成失败后保护性清点完成

只读清点确认熊山君候选目录没有 PNG；普通熊妖 PNG/帧 JSON、manifest、native-app.js 以及 Web/WeChat ZIP 的字节与 SHA 均未变化。证据：`evidence/current/boss-assets/xiong-shanjun-v1/post-failure-inventory-20261015T181513Z.json`。未进行新的生图请求、接入、重包或部署。

## 2026-10-15 18:30Z：公网入口工具路径复核失败（不改变公网结论）

对现有 Netlify 地址进行一次只读外部可达性检查时，当前 web 工具返回 `Internal Error` 并报告 URL 不可通过该工具访问。该结果只说明本次工具路径失败，不能推断站点宕机，也不能当作公网 PASS；没有修改、重传或重新部署。证据：`evidence/current/public/20261015T183010Z-netlify-tool-check.json`。最新真实浏览器公网证据仍是 `MANUAL_PUBLIC_RUNTIME_RECHECK`，自动 smoke 仍受浏览器启动限制。

## 2026-10-16 00:44Z：延长等待后生图账号池仍不可用

在上一轮失败后等待超过一小时，仅再次发起一次熊山君候选请求；内置 `image_gen` 仍在生成前返回 HTTP 503 `auth_unavailable`（2 个账号候选均不可用）。没有生成图片或修改生产/运行时/ZIP/公网资源，未使用 CLI/API fallback。证据：`evidence/current/boss-assets/xiong-shanjun-v1/generation-attempt-20261016T004438Z.json`。按低频约束停止继续重试，等待服务恢复或明确 fallback 授权。

## 2026-10-15 19:07Z：低频重试仍受生图账号池阻塞

等待低频窗口后仅重试一次熊山君候选；内置 `image_gen` 仍返回 HTTP 503 `auth_unavailable`（2 个账号候选均不可用）。没有输出图片或修改任何生产/运行时/ZIP/公网资源，未使用 CLI/API fallback。证据：`evidence/current/boss-assets/xiong-shanjun-v1/generation-attempt-20261015T190725Z.json`。按约束停止后续重试，等待账号池恢复或明确 fallback 授权。

## 2026-10-15 16:52Z：上传后虎先锋深度链设计静态审计通过（未启动浏览器）

在不改原 verifier、历史报告、生产素材、运行时、ZIP 或部署的前提下，使用证据层临时 runner 重新绑定当前发布包哈希并完成设计审计。审计结果为 `DESIGN_STATIC_VALIDATED_ONLY`：13 个负向反例、325 个保护文件、当前 web/wx ZIP SHA 均核对通过，内置 `npm test` exit 0；浏览器启动数 0、服务器启动数 0、图片生成数 0，故绝不等同于浏览器或公网 PASS。证据：`evidence/current/tiger-vanguard/depth-chain-design/2026-10-15T16-51-58-935Z/design-audit.json`。原 verifier 未变，整体仍 `NOT_READY`，待下一步在可启动浏览器环境执行 A1/A2、B1/B2 证据层诊断。

## 2026-10-15 14:15Z：上传后公网复核与证据层诊断已完成

当前 Netlify Drop 入口 `https://roaring-malabi-f8d7fa.netlify.app/` 已在真实浏览器通过密码门，并走通首页→选角→战斗→技能选择层；观察到 58 个公网运行资源（含四英雄 v3、tiger/bear/bull/wolf/monkey/deer/hawk v1、snake v3 与对应帧 JSON），控制台异常为 0。证据：`evidence/current/public/20261015T140223Z/netlify-roaring-manual-recheck.json`。这仍是 `MANUAL_PUBLIC_RUNTIME_RECHECK`，不是自动公网 smoke PASS；自动 Playwright 仍因 Edge `spawn EPERM`、Chromium 可执行文件缺失而阻塞。

上传后的虎先锋证据层深度诊断使用当前 ZIP 哈希建立了独立基线，未修改旧证据、生产素材、运行时或部署。结果仍为严格 `FAIL`：主图 5,149 个差异像素，其中 8 个超出完整玩家支持域；三组透明支持域差异为 0，玩家与虎先锋 alpha>8 交叠 4,062。证据：`evidence/current/tiger-vanguard/depth-control/2026-10-15T14-03-42-135Z/browser.json`；临时 post-upload runner 仅留在该证据目录。

本轮 `npm test` 于 14:15:19Z 完成 `PASS`，继续证明运行时与 Node/Canvas 合同有效，但不改变 `runtimeApproved=false`、`highFrameApproved=false`、`publicPass=false`、`releaseReady=false`，整体仍为 `NOT_READY`。下一步仍只允许针对虎先锋支持域/遮挡的证据层诊断，不接入未批准动作、不重建 ZIP、不重新上传。

## 最新公网上传（2026-10-15 13:22Z / 21:22 北京时间）：新鲜 Netlify Drop 入口已建立

已将当前发布包 `dist/xiyou-survivor-web-v1.0.0.zip` 重新上传到 Netlify Drop，包 SHA256 为 `571199412a54e9fc5bb09afe5eebf371f7b35ed3967bf884927c1b0b481724f6`。新公网测试地址：`https://roaring-malabi-f8d7fa.netlify.app/`。上传范围仅为当前网页运行资源；未上传源码、`legacy-source`、历史 evidence、密钥或本机配置。旧地址 `cerulean-mandazi-90ad05.netlify.app` 已被 Netlify 暂停，因此不得继续引用旧地址。

内置真实浏览器已通过密码门进入新地址，页面标题为“西游·八十一难 · 微信Canvas验证”，页面正文为“微信Canvas同代码验证 · WASD / 方向键移动 · 空格闪避”。该入口确认记录见 `evidence/current/public/20261015T1230Z/netlify-roaring-manual.json`。这是真实公网可达/页面入口确认，不等同于完整自动 smoke PASS。

本轮自动 `browser-public-smoke` 仍受当前执行环境限制：Edge 启动返回 `spawn EPERM`，切换到内置 Chromium 又缺少 Playwright 浏览器可执行文件；因此没有把手工结果冒充自动公网 PASS。脚本已修复预期探针 404 文本匹配，并新增可选 `BROWSER_CHANNEL=none`；`node --check scripts/browser-public-smoke.mjs` 与 `npm test` 均通过。下一次在可启动 Playwright 浏览器的环境中，使用新地址重新生成完整公网 smoke 证据。

## 最新公网测试尝试（2026-10-14 11:22Z / 19:22 北京时间）：代理链路仍不可用，公网未上传成功

按用户要求复查公网失败原因并尝试恢复。当前 workspace 服务仍由 `scripts/serve.mjs` 监听 `127.0.0.1:8088`，本地资源与 allowlist 未改；`node --check scripts/browser-public-smoke.mjs` 通过。为绕过直连 Cloudflare edge 的 TCP/UDP 7844 限制，本轮经本机 SOCKS 代理建立了 Cloudflare Quick Tunnel，入口 `https://typical-tension-inexpensive-angeles.trycloudflare.com/` 曾成功申请但 connector 到 edge 的 TLS/HTTP2 握手持续 EOF，真实 Edge 最终返回 **530 / Error 1033**；失败日志、URL 与批准权限下的真实 Edge smoke 均保存在 `evidence/current/public/20261014T1042Z/cloudflare-http2-proxy-approved/`（含失败截图、HTTP 530、页面文本）。这证明代理没有接管 cloudflared 的 edge socket，不能把“申请到 URL”当作可用公网部署。

随后复用已有 `tmp/localtunnel-proxy.mjs`（同一 SOCKS 代理）取得 `https://heavy-loops-sit.loca.lt/`，两个远端连接建立后立即关闭；真实 Edge smoke 返回 **503 Tunnel Unavailable**，证据在 `evidence/current/public/20261014T1042Z/localtunnel-proxy-approved/`。最后一次经代理的匿名 Serveo SSH 入口在握手后被远端关闭，失败记录见 `evidence/current/public/20261014T1042Z/serveo-proxy-fail.json`。没有上传源码、证据、legacy-source、密钥或本机配置，也没有覆盖/重建 ZIP。

同一时段公网通道失败后未把本地结果冒充公网通过：本地 8088 仍可返回 HTTP 200；公网 `publicPass=false`，整体 `NOT_READY`。要完成真正公网测试，需要可用的稳定托管/反向通道（或放行 Cloudflare edge TCP/UDP 7844），之后再用新版 `scripts/browser-public-smoke.mjs` 串行验收；当前不存在可交付公网 URL。

排查收尾：`npm test` 于 2026-10-14T11:28:08Z 完成 exit 0 / PASS（当前运行时契约、17 项引擎回归、八类普通怪 32 帧契约、四角色 600 秒自然战斗、正常输入、对象池、渲染与平台桩）。该本地 PASS 仅证明工作区回归，不改变上面的公网 FAIL 或项目 `NOT_READY` 状态。

## 最新公网测试尝试（2026-10-14 09:41Z / 17:41 北京时间）：临时通道外部 FAIL，本地复核 PASS

按用户要求，本轮只使用当前 workspace 运行资源启动了限定 allowlist 的 `scripts/serve.mjs`（8088），没有重建或覆盖 `dist` ZIP，也没有公开仓库、证据、legacy-source、密钥或本机配置。先后建立了两个 Cloudflare Quick Tunnel 测试尝试：HTTP/2 URL `https://disc-place-papers-eric.trycloudflare.com/`，QUIC URL `https://belt-array-floors-buses.trycloudflare.com/`。真实 Edge 访问第二个 URL 返回 **530**，随后 `scripts/browser-public-smoke.mjs` 在外部 URL 等待 Canvas 超时；报告中记录了 530、`ERR_CONNECTION_CLOSED` 与 Cloudflare 边缘 TLS/QUIC/HTTP2 连接失败。两份完整 tunnel 日志、外部 smoke 报告和 URL 均保存在 `evidence/current/public/20261014T0920Z/`，没有用本地结果冲销公网 FAIL。测试结束后已关闭临时 tunnel 与 8088 服务，当前没有公网可用 URL。

作为安全对照，关闭公网通道后同一 workspace 重新启动 8088，并在真实 Edge 以 `http://127.0.0.1:8088/` 串行运行同一 smoke：**PASS**（首页→选角→战斗、八类运行帧契约、路径隔离、调试关闭、约 9 秒自然推进、异常/请求门禁）；该结果仅代表本地 workspace，证据为 `evidence/current/public/20261014T0920Z/browser-public-smoke-local-followup.json`，不是公网 PASS。`npm test` 同步为 exit 0 / PASS，仍不改变整体 `NOT_READY`、`publicPass=false`、`runtimeApproved=false`、`highFrameApproved=false`、`releaseReady=false`。

公网失败原因是当前环境到 Cloudflare edge 的传输受限（HTTP/2 TCP/7844 blocked、QUIC intermittent timeout/TLS EOF），不是运行资源 allowlist 或本地页面门禁失败。下一次公网复验需要可用的稳定外部通道；不得复用本轮已失效 URL、不得把本地 PASS 或历史 502/530 当公网通过。

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

## 最新合成连续播放（2026-10-14 09:07，北京时间）：实际标签0–31可读，仍REVIEW

单个离线Edge正常1倍速、无seek，将08:56已锁定合成WebM播放至真实ended（currentTime=3.126323s）；只解码原字节，没有重录、游戏实例或新UI。83个呈现回调mediaTime单调0.061→3.126s，最大观察间隔70ms；每回调保存原尺寸标签+精灵ROI，3张接触表已由根代理和独立代理静态逐格读取。烧录idle0–7/move8–15/attack16–23/hit24–27/death28–31全部出现，含idle#6/#7、move15→8→attack16及末态审查保持；这是录像标签观察，不是自动精灵像素身份或连续人工运动批准。

证据 `evidence/current/tiger-vanguard/composite-playback/2026-10-14T01-07-09-754Z/`，`REVIEW_FROZEN_COMPOSITE_CONTINUOUS_PLAYBACK`；87张输出PNG（83回调ROI+1loadeddata+3表），无旧姿态累积，历史背景ROI最大均值通道偏差1。回调内PNG编码可能影响呈现，回调数/70ms间隔不等于FPS、全编码帧或零掉帧。页面/console/请求/外网错误0，浏览器已关、无服务；09:10:00新npm test PASS完整归档，131保护哈希和新媒体/脚本未变。

`humanMotionReviewed=false`、`rootApproved=false`、`runtimeApproved=false`、`highFrameApproved=false`、`publicPass=false`，整体仍 `NOT_READY`。未改生产/源图/ZIP或部署。下一步仅建立证据层首关虎先锋真实身份/事件驱动预览，让候选跟随真实世界位置与事件；不再重复录屏解码、播放或库存，视觉时钟不得改变伤害/控制/死亡TTL，未批准素材仍不写生产契约。

## 最新冻结场景合成（2026-10-14 08:56，北京时间）：补齐32源绘制，仍为证据层REVIEW

只复用已锁定候选表、motion draft 和15:47历史冻结场景PNG，单个离线Edge合成录屏；没有重新进入游戏，`newGameInstance=false`、`realUiEntryThisRun=false`。每tick清空并重绘背景，源日志遍历idle8/move8/attack8/hit4/death4共32索引，含此前缺失的idle#6/#7。固定点/伪血条/合成时序明确标注，非自然战斗；2850ms动作后另250ms审查保持，不改420ms死亡TTL或真实受击计时。

证据 `evidence/current/tiger-vanguard/composite-preview/2026-10-14T00-56-08-837Z/`，`REVIEW_FROZEN_BITMAP_FULL32_COMPOSITE`；WebM 281422 bytes、SHA `01ba53ec…67e8`，实际字节解码390×844、容器时长3.126323s，7张seek采样背景ROI通道均值最大偏差1，证实录屏含历史背景。6张直接夹具图及7张解码图已静态查看，无旧姿态累积；seek请求时间不等于实际呈现时间，日志32源覆盖不证明视频32姿态全覆盖。680个rAF tick和30录制请求都不是FPS。

页面/console/请求/外网错误0，浏览器关闭、无服务；08:59:07本轮新npm test PASS与完整日志归档，113保护哈希及新截图/录屏未变。未生图/改生产/重建ZIP/部署。`humanMotionReviewed=false`、`rootApproved=false`、`runtimeApproved=false`、`highFrameApproved=false`、`publicPass=false`，仍 `NOT_READY`。下一步仅连续播放这份新录屏并核对实际呈现的完整idle及状态衔接，不重录/重复库存审查，也不凭本地证据接入或上线；以下“下一步”为当时历史记录。

## 最新连续播放核对（2026-10-14 08:47，北京时间）：已有overlay播放至真实结束，仍REVIEW

单个离线真实Edge以1倍速度、无seek连续播放15:47原WebM至 `ended=true`，390×844、2.534066s。73次呈现回调的媒体时间单调递增0.101→2.534s，最大观察间隔69ms；这些是本浏览器观察结果，不是全编码帧、零掉帧或游戏FPS保证。

在原源日志30个首次姿态区间中点附近取得30张原尺寸ROI（排除时间标签，最大目标距离39.2ms）；根代理和独立代理静态看接触表未见旧姿态累积。页眉明确编号为源日志估计，不能自动证明准确姿态身份、艺术/运动质量。证据 `evidence/current/tiger-vanguard/incontext-playback/2026-10-14T00-47-59-083Z/`，结果 `REVIEW_RECORDED_OVERLAY_CONTINUOUS_PLAYBACK`；错误/联网0，浏览器已关，无服务。08:49:24新npm test PASS与完整日志归档，111保护哈希不变。

原录制仅overlay、无底层游戏，idle#6/#7缺失；本步不是人工连续观看或真实运行时事件验收，`humanMotionReviewed=false`、`runtimeApproved=false`、`highFrameApproved=false`、`publicPass=false`，仍 `NOT_READY`。未生图/改生产/重建ZIP/部署。下一步只在证据层补完整idle周期与冻结底层+overlay合成录制，明确非自然战斗，不重复本次采样/库存审查。

## 最新录屏技术核对（2026-10-14 08:39，北京时间）：已有 overlay WebM 可解码，仍未批准动作

复用15:47录屏原字节（SHA `bbb1880278853b09c4547e5ffe2e03eaa1f33ef3aca045ddfa47274dc99b9a7d`），单个离线真实Edge解码为390×844、容器时长2.534066s；在五状态内部及死亡尾段取得6张独立解码图，实际呈现时间为0.236/0.937/1.635/2.003/2.370/2.468s。排除时间文字的精灵区域五状态签名不同，接触表已静态查看，不等于连续动态质量通过。

明确补充：原WebM只来自 `overlay.captureStream(30)`，不含底层游戏背景；局内同屏证据在原PNG，不在该视频。原绘制日志仅覆盖30个姿态（idle末两帧未覆盖）；呈现回调计数、rAF次数、容器时长与30fps请求都不能推导游戏FPS或全32帧验收。

最终证据 `evidence/current/tiger-vanguard/incontext-decode/2026-10-14T00-39-29-649Z/`，结果 `REVIEW_RECORDED_OVERLAY_DECODE_ONLY`。首轮00:37采样画布未清空导致透明帧累积，已明确reject并保留，补 `clearRect` 后串行复验图像无该累积；不是素材/WebM缺陷判定。页面/console/请求/外网错误0，浏览器已关，无服务。08:40:56本轮 `npm test` PASS、完整日志及归档已保存；102项保护文件（含原证据/素材/运行资源/ZIP）前后哈希不变。

本步仅新增解码检查与证据，未生成素材、未改生产、未重建ZIP或部署。`humanMotionReviewed=false`、`runtimeApproved=false`、`highFrameApproved=false`、`publicPass=false`，整体仍 `NOT_READY`；下一步连续观看已有录屏并对照原局内图，未通过动态/根点/时序质量前不接入。

## 最新局内动态检查（2026-10-13 15:47Z）：虎先锋候选 ghost 叠加仍为 evidence-only REVIEW

真实 Edge 从首页→选角→战斗等待自然敌人出现（`enemies=1`），冻结底层 RAF 但保持 `engine.state.status=playing`，不打开暂停模态；在 vector 游戏 Canvas 上附加独立 overlay canvas，以证据层 ghost 依次绘制 idle/move/attack/hit/death。五张截图已查看（idle #3、move #12、attack #23、hit #26 左向、death #31），候选 ghost 与玩家/真实敌人同屏可读。

动态证据目录 `evidence/current/tiger-vanguard/incontext-dynamic/2026-10-13T15-47-17-378Z/`：693 个 rAF tick、约2566ms、WebM 327646 bytes（SHA `bbb1880278853b09c4547e5ffe2e03eaa1f33ef3aca045ddfa47274dc99b9a7d`）、页面/console/请求/HTTP/外网错误0；`captureStream(30)` 是请求值，不是FPS测量，录屏未人工动态观看。15:32 沙箱 `spawn EPERM`、15:33零敌人、15:36时间校准失败均保留，15:47为最终复核。

本步仍未修改生产素材、manifest、loader、renderer或引擎，未重建 ZIP、未部署。`overlayOnly=true`、`runtimeApproved=false`、`highFrameApproved=false`、`publicPass=false`；ghost、冻结战斗与本地 npm PASS 均不等于虎先锋运行时、高帧、自然战斗、FPS、公网或设备验收，整体继续 `NOT_READY`。

## 最新局内静态检查（2026-10-13 14:38Z）：虎先锋候选叠加仍为 evidence-only REVIEW

真实 Edge 从首页点击进入选角和战斗后，在暂停游戏画布上附加独立 canvas，静态绘制虎先锋候选 idle/move/attack/hit/death 五个抽样状态。底层场景为 390×844、`rendererMode=vector`；叠加使用固定屏幕坐标 `x=276`、`ground=474` 与 86px standing-reference 比例，不是生产敌人的世界位置、真实血条或碰撞位置。五张状态截图可读，但双向仅为跨状态抽样（hit 左向，其余右向），不是五状态各双向验收。

暂停由脚本取消 RAF 并调用 `engine.pause()`，不是点击暂停按钮；death 仅抽取末帧，不证明 TTL/末帧保持。候选表、motion draft 与两张源图均未被运行时引用；页面、console、失败请求、HTTP 和外网请求均为0。证据与交接见 `evidence/current/tiger-vanguard/incontext-review/2026-10-13T14-38-16-457Z/`，其中 `npm-validation.json` 只是同一工作区本地回归归档。

本步未修改生产素材、manifest、loader、renderer 或引擎，未重建 ZIP、未部署。`overlayOnly=true`、`runtimeApproved=false`、`highFrameApproved=false`、`publicPass=false`；仍需自然战斗接地/朝向/血条/攻击可读性、连续动态与实际 FPS 验收，整体继续 `NOT_READY`。

## 最新候选小步（2026-10-13 13:11Z）：虎先锋根线与换帧漂移完成静态复核，仍REVIEW

已查看64/48px双向注册对照和终态截图，并从真实Edge报告提取64px alpha质心相邻帧诊断：idle草案最大1.001×0.705px，move5.931×3.007px（frame13保留离地间隙），attack7.549×6.659px，hit1.284×1.453px，death5.373×6.990px。idle/hit的包围盒跳动有所收敛，attack挥刀/躯干和death倒地的位移属于姿态变化；alpha质心含刀尾，不能作为骨骼或脚底测量。

静态根线连贯性已记录在 `evidence/current/tiger-vanguard/motion-draft/2026-10-13T12-00-07-310Z/root-drift-review.json`，没有改图、运行时、ZIP或引擎。`dynamicMotionReviewed=false`、`rootApproved=false`、`highFrameApproved=false`、`publicPass=false`；下一步是局内场景接地/朝向/血条/攻击可读性检查，整体继续 `NOT_READY`。

## 最新候选小步（2026-10-13 12:39Z）：虎先锋完整状态根点与时序草案已完成技术复核

复用已锁定的32姿态候选表，没有生成或改写图片。新增 `scripts/tiger-vanguard-motion-draft.mjs` 与 `scripts/browser-tiger-vanguard-motion-draft.mjs` 只建立证据层注册草案：每页保留一个源比例，横向用源列登记假设，待机/移动/攻击/受击使用显式状态地平线，死亡使用含刀的可见底部代理；所有根点都标为未批准。节奏草案为 idle8、move12、attack16、hit16、death10 源姿态/秒，死亡400ms落在现有精英死亡特效420ms内；不改伤害、受击、对象池、引擎或运行资源。

真实单Edge读取同一32裁切并复核 48/64px 双向草案对照；Node 与浏览器时钟边界一致，20/60Hz合成时钟遍历全部姿态，攻击/受击中断回移动，死亡保持末帧。原生Canvas录制 1,088,504 bytes，随后由浏览器从实际WebM字节重新解码并取得5个不同采样签名；这是技术录制检查，不是人工动态质量或GPU/FPS验收。3张截图已查看，页面/console/请求/外网错误0，浏览器已关闭，无服务。

证据目录 `evidence/current/tiger-vanguard/motion-draft/2026-10-13T12-00-07-310Z/`：草案SHA `b1fc330c…a6cc5`，录屏SHA `e75a826b…d2ff4`，当前 `npm test` 于12:39:42Z PASS，归档校验SHA `203afbed…0fc38`；候选表作为第92项受保护输入，全部受保护文件未变。草案仍 `REVIEW`，`runtimeApproved=false`、`highFrameApproved=false`、`publicPass=false`，未写生产manifest/加载器，整体 `NOT_READY`。

## 最新候选小步（2026-10-13 11:22Z）：虎先锋29原区+3补丁已形成完整32姿态表和真实预览录屏

`evidence/current/tiger-vanguard/full-candidate/2026-10-13T11-20-21-840Z/candidate-table.json`显式登记idle8/move8/attack8/hit4/death4；32裁切各异、双阈值2px隔离和8项表自检通过。每源固定170/443比例，全部使用同一种未批准的包围盒底中心诊断点，不混入局部脚底点，不重生图片或拼装图集。

单Edge全状态按12源姿态每秒遍历，64/48px双向各32个不同绘制结果，6截图已查看，保存409093-byte原生Canvas WebM录屏。首轮Playwright录屏因缺ffmpeg失败已保留；未下载依赖，关闭后改用Edge自带录制串行完成。录屏存在不代表人工动态质量/游戏FPS通过；根点、节奏和局内阅读仍未批准。

11:22:20Z新`npm test` PASS；91保护文件/ZIP不变，错误/外网请求0，录制轨道、context、浏览器已关，未启动服务。详见同目录`review.md`。下一步复用该表完成全状态根点/时序草案与换帧漂移检查，不重复生图/库存/端点审查；候选仍REVIEW、整体`NOT_READY`，未接入/打包/部署，公网未验收。

## 最新有限检查（2026-10-13 11:06Z）：虎先锋死亡接缝源预览完成，候选仍REVIEW

复用原death[1]与现补丁death[2/3]，原末两帧保留污染像素作控制；固定170/443全源比例，分别检查包围盒底中心和人工肩部x/含刀最低点两种诊断放置。最终单Edge三截图已查看，64/48px双向与6/12源姿态每秒的非循环绘制顺序通过；肩部点是近似参照，不是作者根点，未由日志宣称动画流畅度。尾/后腿延展和眼部变化仍在，也不单凭这些静态差异判动作失败。

11:06:26Z新`npm test` PASS，91保护文件及ZIP不变，浏览器已关、未启动服务、错误/外网请求0。最终证据 `evidence/current/tiger-vanguard/death-seam/2026-10-13T11-05-40-965Z/`（含三截图、完整测试日志与`review.md`）；11:03初轮过强的“护肩中心”标注已更正，原记录保留。下一步仅在证据目录建立29原区+3补丁的32姿态候选表/完整预览，不再重复同一端点测量或生图；仍`NOT_READY`，未接入/打包/部署，非局内、公网或FPS PASS。

## 最新有限检查（2026-10-13 10:52Z）：虎先锋待机接缝已作固定脚底对照，仍REVIEW

只复用既有三帧补丁，核验原idle[6]→补丁idle[7]→原idle[0]，原idle[7]作控制；每源固定170/443比例，未逐帧缩放。单Edge离线三截图已查看，alpha>8/16脚底测量与Node吻合，64/48px双向、6/12源姿态每秒的两条三端点序列均绘制后停止；不是完整八帧待机、人工视频流畅度、局内或FPS批准。首轮脚底窗口误含上方裤腿/腰带侧缘，启动浏览器前失败，修正窗口后串行重验，失败记录保留。

新`npm test`10:52:35Z PASS；91保护文件（含补丁）及ZIP哈希不变，浏览器关闭、未启动服务、错误/外网请求0。证据与人工观察见 `evidence/current/tiger-vanguard/idle-seam/2026-10-13T10-51-24-318Z/review.md`。轮廓/线条差异未被静态检查自动判为合格或失败；候选仍不接入。下一步仅复用补丁检查死亡衔接；未生图/打包/部署，整体`NOT_READY`，公网未验收。

## 最新素材小步（2026-10-13 07:10Z）：虎先锋三帧局部候选已分离，尚不批准替换

- 用内置imagegen对现有v1只编辑一次，输出索引7/30/31三帧的独立补丁，不重生32帧整表，不覆盖原PNG；其余29区仍保留原像素。原始输出逐字节复制到 `evidence/current/tiger-vanguard/local-repair/2026-10-13T06-27-44-991Z/candidate-v1-three-frame-patch.png`，2172×724、704203 bytes、SHA `e04bdf48…10e5a`；同目录保存完整 `prompt.txt` 和生成前哈希/尺寸/用途/零引用检查。
- alpha>8/16均有3个隔离区域，2px边界与100px人物间隔通过（alpha>8间隔128/133）；提示要求50px外边距未完全满足，最小46px。单Edge离线原图、128px对照、64/48px双向共3截图已人工查看，像素计数吻合、页面/console/请求错误及外网请求均0，浏览器已关闭、未启动服务。
- 暂不批准直接替换：倒地末帧的尾巴/躯干轮廓比原稿更展开，前一倒地的头部/眼部处理也有变化，不是仅增加留白。每页仅按站姿170/443设一个全局比例，没有逐帧拉伸；静态对照不替代原待机/死亡序列与候选的根点、节奏和衔接验收。
- 07:10:23Z `npm test`新跑PASS，90个保护文件和既有ZIP未变；浏览器报告和归档回归在同目录 `review/2026-10-13T07-10-12-432Z/`，完整交接为 `handoff.json`。先复用这张候选做有限衔接审查，不立即重复生图。未接入/打包/部署，仍 `NOT_READY`，不是局内、高帧、公网、FPS或实机PASS。

## 最新素材小步（2026-10-13 05:45Z）：虎先锋v1单源布局缺口收敛为三帧

- 只读重查v1源SHA/1774×887尺寸/用途/零生产引用：alpha>8/16均有32个主要八连通组件，人工看原图确认四张死亡图都在。**旧“31独立姿态/缺最后一帧”应更正为31个横向分组区域**，不是语义姿态数；原始逐列扫描含零散边缘时为33区域，保留并归组这些边缘后为31，不能由计数直接批准动画。
- 同一v1中29个区域有双阈值2px隔离边界（idle7/move8/attack8/hit4/death2），布局障碍限于索引7/30/31：idle[7]刀尖触原图右缘20/19像素；death[2/3]主体不连接，但alpha>8完整bbox分别带入邻体6/1像素，2px边界仍不净。提高阈值、缩裁切或改根点都不是源级修复。
- 最终新证据 `evidence/current/tiger-vanguard/single-source/2026-10-13T05-44-03-776Z/` 含Node、单Edge离线浏览器与3张已人工检查截图、05:44:12Z全套测试PASS。浏览器像素计数与Node一致，console/page/request错误及外网请求均0；90受检文件哈希未变，浏览器已关，未启动服务。初轮遗漏零散边缘的统计已更正且原报告保留，不作为最终结论。
- 交接 `evidence/current/tiger-vanguard/single-source/handoff.json` 明确下一步只针对v1这三帧做局部源级修复，保护其余29区域，不混v2、不重生整表。**29只是可隔离源区域，不是29帧动画质量已批准**；根点、造型连续性与动作节奏仍待验收。本轮未改PNG/生产、未生图、未打包/部署，仍 `NOT_READY`，非局内/公网/FPS/实机PASS。

## 最新素材判定（2026-10-13 04:44Z）：虎先锋跨稿不能只靠脚底平移接入

- 重新核对v1/v2源SHA、1774×887尺寸、用途、四个过渡端点的RGBA像素及生产引用（0），没有改图或生成素材。新诊断脚本只对v2 idle末/首帧与v1 attack首/末帧标出近侧脚底窗口，用alpha>8/16测量下缘；统一源比例，对比旧bbox锚点与脚底对齐，另看64/48px双向。
- 单Edge离线页面最终证据为 `evidence/current/tiger-vanguard/continuity/2026-10-13T04-41-02-531Z/browser.json`，3截图、技术检查通过、console/page/request错误及外网请求均0。首轮窗口有左脚趾被框边排除，已扩大窗口后串行重验；v2末待机根点x由52修为49.5源像素，原记录保留，未并发开窗。
- 主代理检查三截图后不批准“仅靠根点平移”的双稿直接拼接：脚底对齐后，v2与v1端点仍有胸甲/领口、护腕、腿甲与刀轮廓变化；头顶到支撑脚分别190/171/171/191源像素，高度差只是辅助观察而非单独判错标准。平移不会改变这些可见结构。本结论不等于证明任何源级修复都不可行，也不批准剩余28帧/死亡根点。
- 04:44:06Z `npm test` 新跑PASS；90个受检运行资源/候选/ZIP哈希未变，浏览器已关闭且未启动服务。归档及判定边界见 `evidence/current/tiger-vanguard/continuity/handoff.json`。下一步先明确一套一致造型的可复用帧与缺口，不再把改根点当作混稿造型修复，不为凑32帧重复生图。候选仍REVIEW、未接入，整体 `NOT_READY`；非局内、公网、FPS、ZIP或实机PASS，未部署。

## 最新安全小步（2026-10-13 04:22Z）：虎先锋出生/死亡身份独立，尚未接入动作

- `content.js` 为300秒虎先锋登记 `encounterId/actionId=tiger-vanguard`；只有首关定时调度成功生成的精英获得冻结的 `encounterIdentity`。同名/同变体普通怪、通用精英、直接传入同一内容记录的手动出生、中 Boss、三位最终 Boss 和跨关记录均不绑定。死亡特效保留身份，对象池再利用前清空；没有改调度、伤害、随机数或渲染。
- 新门禁 `tiger-vanguard-identity-smoke.mjs` 的6项专项通过；修改前先采集16组固定种子/关卡/难度/池开关基线，修改后剔除新增身份元数据后的状态、事件、池和RNG哈希全部一致。全套 `npm test` 于04:19:51Z PASS（正常构建同步两份共享bundle，未重建ZIP）。
- 单Edge真实指针从首页进入战斗后，300秒出生、死亡/池复用、570秒三Boss共3组明确加速/重定位夹具通过；4张截图，console/page/request/HTTP错误均0，没有候选或外部请求。移除/恢复身份字段的冻结画面逐像素相同，截图确认仍为通用精英外观，不能作为专属动画完成。证据归档于 `evidence/current/tiger-vanguard/identity/2026-10-13T04-22-04-744Z/`，不是自然存活五分钟、最终视觉、FPS、公网、ZIP或实机验收。
- 78个受检素材/候选图/渲染与发布相关文件及既有ZIP哈希未变；浏览器与本地8088服务已关闭。交接为 `evidence/current/tiger-vanguard/identity/handoff.json`。候选保持 `REVIEW`、`runtimeApproved=false`；下一步仍先校核跨稿造型/根点/衔接，不能凭身份准备接入未批准素材。整体 `NOT_READY`，未生成、未接入新素材、未部署。

## 最新素材小步（2026-10-13 03:55Z）：虎先锋两稿互补可选出32个源区域，跨稿动画仍 REVIEW

- 未生成第三张、未改 PNG。复核哈希/尺寸/用途/引用后，选用 v2 的 idle8/move8/hit4/death4 与 v1 的 attack8；32 个裁切像素哈希不同、源测量一致、2px 透明边界在 alpha>8/16 下无邻区像素、所选帧不触边，生产引用为 0。原 v1/v2 整表失败结论不变。
- `evidence/current/tiger-vanguard/reuse-plan-node.json` 为 `REVIEW_32_SOURCE_REGIONS_AVAILABLE`；单 Edge/单页面的 `reuse-review/2026-10-13T03-54-57-639Z/browser.json` 为 `REVIEW_SOURCE_PREVIEW_ONLY`，64px 双向/48px 右向均绘制32个不同区域，源序列播放遍历32区域，页面/console/请求错误为0，无联网。未生成或重新拼装运行图集。
- 人工检查统一比例截图后仍不批准跨稿动画：v2待机末帧→v1攻击首帧可见高度192→171源像素，身形、胸甲/腰带和刀的轮廓有变化；临时包围盒底中心不等于已验收脚底根点。不能用逐帧拉伸或重复帧掩盖差异。后续先评估造型连续性和根点，不因整表缺帧再次生成。
- 本轮 `npm test` 于03:54:06Z PASS，90个受检源图/运行资源/ZIP哈希不变，浏览器已关闭、未启动网页服务。交接与精确哈希：`evidence/current/tiger-vanguard/reuse-handoff.json`。此为候选复用诊断，不是局内、自然战斗、高帧质量、当前ZIP、公网或实机PASS；仍 `NOT_READY`，未接入、未打包、未部署。

## 最新安全小步（2026-10-13 03:42Z）：安全区 bottom=0 不再误作缺省值，本地边界与恢复回归通过

- `NativeGame.resize` 保留明确的有限底部坐标 0；缺省/null/非有限值仍使用屏幕高度兜底。不再把无可玩区域误判为正常安全带；沿用 renderer 的全屏 fail-closed 障碍，数字保留原位绘制并计数 unresolved，恢复有效安全区后正常避让。未改 renderer、引擎数值或素材。
- 修复前 `evidence/current/hud-occlusion/2026-10-13T03-40-45-508Z/browser.json` 的 11 例中仅零值边界失败；修复后 `2026-10-13T03-41-44-099Z/browser.json` 为 11/11 PASS，console/page/request/HTTP 错误均 0。新增八项 Node 边界场景与既有四组生产场景通过；本轮 `npm test` 于 03:41:26Z PASS，通用 Edge 流程于 03:42:38Z PASS（九截图、console/pageerror 为 0；未采集请求计数）。
- 精确日期/哈希/前后证据：`evidence/current/hud-occlusion/safe-area-zero-handoff.json`。70 个受检保护文件与 ZIP 哈希不变；浏览器和本地服务已关闭，03:43:35Z 确认 8088 无监听。零值场景为无可玩区的注入夹具，不代表该异常输入下界面可玩或数字可见，也不是实机安全区验收。
- 此次只完成适配边界修复；英雄高帧、虎先锋/三 Boss 动作、整体可读性、公网和当前 ZIP 仍未验收，保持 `NOT_READY`，未生成素材、未重建 ZIP、未部署。

## 最新安全小步（2026-10-13 03:28Z）：修复敌人与 HUD 交叉遮挡伤害数字，当前本地复核通过

- 真实 Edge 在 390×844、360×640 复现旧缺陷：数字同时碰到敌人与顶部 HUD 时，原四个角色边缘候选全部仍被 HUD 遮挡。`renderer.js` 现保留原四候选，并在交叉冲突时优先追加两个 HUD 上下边界候选（总计最多六个）；所有候选仍检查全部障碍与真实视野，非法边界和候选耗尽仍保留原位并计数。未改引擎数值、素材或 HUD 本身。
- 前后专项分别为 `evidence/current/hud-occlusion/2026-10-13T03-24-21-081Z/browser.json`（仅两项交叉冲突失败）与 `2026-10-13T03-26-41-421Z/browser.json`（七项全部 PASS）。单 Edge/单页面串行覆盖双尺寸、上下边缘、安全区、playing 状态 resize、DPR 适配夹具与恢复尺寸；完整数字包围盒、冻结状态、重复像素均通过，console/page/request/HTTP 错误均为 0。专项是明确注入的确定性夹具，不冒充自然战斗冲突全覆盖。
- Node 专项已改用真实相机视野并覆盖四组 NativeGame 生产尺寸/安全区/DPR，`evidence/current/hud-occlusion/node.json` 于 03:26:47Z PASS；`npm test` 于 03:26:51Z 全量 PASS。通用 Edge 流程于 03:28:21Z PASS，`evidence/current/visual.json` 有九张截图、正常战斗伤害反馈、console/pageerror 为 0；该通用报告不记录 request/HTTP 计数。
- 交接与精确哈希：`evidence/current/hud-occlusion/handoff-2026-10-13T03-28Z.md`。本轮保护文件和既有 ZIP 哈希未变，浏览器与本地服务已关闭，03:31:53Z 确认 8088 无监听。`safeArea.bottom=0` 的适配边界留待后续，不扩大本步范围。
- 本步不是像素级、全局/modal 遮挡、FPS、公网、当前 ZIP 或微信实机验收。英雄高帧、虎先锋/三 Boss 专属动作与公网门禁仍 `NOT_READY`，未生成素材、未重建 ZIP、未部署。

## 最新只读发布门禁（2026-10-13 02:17Z）：当前 ZIP 仍过期，保持 NOT_READY

授权外运行 `scripts/audit-release-readiness.mjs`，报告 `evidence/current/release-readiness/2026-10-13T02-17-31-922Z/report.json`。网页 ZIP SHA `9c9bd515b0e8dcb5c4d4101838f1ebc3679b0f425ab31685909503c9519ae097` 相对当前工作区仍缺狼、猴、鹿、鹰、蛇共 10 个帧 JSON/PNG；微信 ZIP SHA `f017493aaf8eeebccc1ac040ded0397a8bfcc4f8d0cbee56e6be5b04e4dec4e2` 按策略不含网页帧资源。英雄高帧、虎先锋/三 Boss 专属动作与公网当前 PASS 仍未完成，结论 `NOT_READY`、不重建 ZIP、不部署、不上线。

## 最新安全小步（2026-10-13 02:03Z）：HUD 有限包围盒避让专项通过，本地 Edge 复核通过

- `prototype-2d/src/renderer.js` 现在接收 NativeGame 的 CSS HUD 安全带并按 camera/zoom 逆变换为最多两个 world-space 遮挡矩形；顶部带优先向下、底部带优先向上，非法边界 fail-closed 保留原位并计数 `damageHudUnresolved`。不乘 DPR，不改引擎数值、伤害、TTL、RNG、素材或 modal 覆盖层。
- `prototype-2d/tests/hud-occlusion-smoke.mjs` 已加入 `scripts/validate.mjs`；专项通过并写入 `evidence/current/hud-occlusion/node.json`。`npm test` 于 `2026-10-13T01:56:58Z` 全量 PASS，统一证据为 `evidence/current/validation.json`。
- 授权外串行本地 8088 的真实 Edge `browser-visual-smoke` 于 `2026-10-13T02:03:13Z` PASS，`evidence/current/visual.json` 覆盖首页、选角、战斗、暂停、升级、三 Boss、结算和 390×844/360×640，页面/请求/console/pageerror 均为 0；服务已停止且 8088 无监听。受限启动的 `spawn EPERM` 失败另存于 `evidence/current/visual/browser-launch-failure-20261013T0157.json`。
- 该步只保证有限 HUD 顶/底包围盒避让与 fail-closed 绘制，不是像素级、全局或 modal 遮挡保证；不覆盖公网、当前 ZIP、微信实机或发布 PASS。英雄高帧、虎先锋/三 Boss 专属动作、整体可读性与公网仍保持 `NOT_READY`，不打包、不部署、不上线。

## 最新安全审计（2026-10-12 20:03Z）：虎先锋候选仍缺 3 个独立姿态，未接入

- 只读核对 `docs/TIGER-VANGUARD-CANDIDATE-HANDOFF.md` 与 `evidence/current/tiger-vanguard/v2-handoff.json`：v2 候选 1774×887、2,101,074 bytes、SHA `03fadd…92e62`，攻击行只有 5 个区域，合计 29/32 独立姿态，结论仍为 `REVIEW`。
- 当前运行时仍使用 v1（1774×887、1,166,282 bytes）；v2 未出现在 loader、serve allowlist、runtime contract、manifest 或 release 清单中。报告 `evidence/current/tiger-vanguard/next-gap-audit.json` 已核对 SHA/尺寸/用途/引用，未生成第三稿、未改运行时、ZIP 或部署。
- 不把候选解码或本地审计当作虎先锋完整动作、发布或公网 PASS；继续保持 `NOT_READY`，下一步先评估布局方案而非重复生成。

## 最新素材小步（2026-10-12 19:47Z）：悟净源级新候选布局预检未通过，未接入

- 依据现有悟净原图的源级矩形污染证据，仅串行生成一张全新透明 4×2 候选，保存于 `evidence/current/hero-highframe/wujing-source-candidate-2026-10-12T19-36Z/hero-wujing-source-candidate-v1.png`；原图 `hero-wujing-battle-v3-sheet.png`、manifest、运行时和历史候选均未覆盖，未重复生成第二张。
- 候选 SHA256 `b0364a6b66867079eb177cb963d659a6aa3bcc4f247caa52af0eddc505cda616`，1774×887、1,775,106 bytes。像素预检 `preflight.json` 在 alpha>8/16 下均仅得到 7 个主要连通组件跨越 4×2 单元，cell 主要组件数 `[1,1,1,1,2,3,3,3]`，内部边界仍有 alpha 像素，30px 透明边距不满足，结论 `REVIEW_LAYOUT_CONSTRAINTS_NOT_MET`。
- 候选不进入 `manifest.json`、`native-app.js`、`renderer.js`、ZIP 或公网；未宣称高帧、局内、发布或公网 PASS。下一步须先获得能保证独立姿态/透明间距的源级方案，继续保持 `NOT_READY`。

## 最新安全小步（2026-10-12 18:38Z）：伤害数字之间有限避让并完成本地 Edge 复核

- 生产 `render()` 在既有玩家身体、敌人身体/血条和 Boss 名牌避让之外启用 `avoidDamageLabels:true`；每个数字只检查此前本帧已接受的有限数字矩形，冲突时尝试上/左/右/下四个世界视野内候选，候选同时避开既有障碍，候选耗尽仍原位绘制并记录 `damageLabelUnresolved`。未改引擎顺序、伤害值、TTL、旋转、星芒、RNG、素材或 HUD；直接 helper 默认关闭保持兼容。
- 新增 `prototype-2d/tests/damage-label-avoidance-smoke.mjs` 并纳入 `scripts/validate.mjs`；5/5 Node/Canvas mock PASS，证据 `evidence/current/damage-label-avoidance/node.json`。`npm test` 于 `2026-10-12T18:36:36Z` PASS，完整结果 `evidence/current/validation.json`。
- 同一代码状态下授权外串行本地 8088 的真实 Edge `browser-visual-smoke` 于 `2026-10-12T18:38:05Z` PASS，`evidence/current/visual.json` 页面/请求/console/pageerror 均为 0，正常战斗观察到 2 个伤害数字，覆盖首页、选角、战斗、暂停、升级、三 Boss、结算和双移动视口；服务已停止，端口无监听。
- 结论仅覆盖有限数字-数字包围盒避让与 fail-closed 绘制，不覆盖像素级身体、HUD 或全局遮挡，也不构成当前 ZIP、公网、微信实机或发布 PASS。英雄高帧、虎先锋/三 Boss 专属动作、整体遮挡、公网和发布门禁继续 `NOT_READY`，不打包、不部署、不上线。

## 最新安全小步（2026-10-12 18:27Z）：伤害数字有限避让 Boss 名牌并完成本地 Edge 复核

- 生产 `render()` 在玩家身体、敌人身体/血条之外启用 `avoidBossLabels:true`；伤害数字与已布局的 Boss 名牌有限矩形冲突时，只尝试上/左/右/下四个世界视野内候选，候选同时避开玩家、敌人身体/血条与 Boss 名牌，候选耗尽仍原位绘制并记录 `damageBossUnresolved`。输入状态、伤害值、TTL、旋转、星芒、RNG、素材和 HUD 未改。
- 新增 `prototype-2d/tests/boss-label-damage-avoidance-smoke.mjs` 并纳入 `scripts/validate.mjs`；5/5 Node/Canvas mock PASS，证据 `evidence/current/boss-label-damage-avoidance/node.json`。`npm test` 于 `2026-10-12T18:24:17Z` PASS，完整结果 `evidence/current/validation.json`。
- 同一代码状态下授权外串行本地 8088 的真实 Edge `browser-visual-smoke` 于 `2026-10-12T18:26:59Z` PASS，`evidence/current/visual.json` 页面/请求/console/pageerror 均为 0，覆盖首页、选角、战斗、暂停、升级、三 Boss、结算和双移动视口；服务已停止，端口无监听。
- 结论仅覆盖有限 Boss 名牌矩形避让与 fail-closed 绘制，不覆盖像素级身体、HUD、数字互相或全局遮挡，也不构成当前 ZIP、公网、微信实机或发布 PASS。英雄高帧、虎先锋/三 Boss 专属动作、整体遮挡、公网和发布门禁继续 `NOT_READY`，不打包、不部署、不上线。

## 最新安全小步（2026-10-12 18:08Z）：伤害数字有限避让敌人身体与血条并完成本地 Edge 复核

- `prototype-2d/src/renderer.js` 的生产 `render()` 现在在既有玩家身体框避让之外启用 `avoidEnemies:true`：普通/精英/Boss 使用有限的保守身体矩形，并为可见血条登记矩形；近身数字仅尝试上/左/右/下四个有限候选，候选必须留在世界视野且避开玩家、敌人身体/血条与已登记障碍，候选耗尽仍原位绘制并计数。输入状态、伤害值、TTL、旋转、星芒、RNG、素材和 HUD 未改。
- 新增 `prototype-2d/tests/enemy-damage-avoidance-smoke.mjs` 并纳入 `scripts/validate.mjs`；6/6 Node/Canvas mock PASS（普通/精英/Boss、血条缓冲复用、远离保持原位、拥挤 fail-closed、状态牌兼容、48 数字冻结复绘/Canvas 栈/输入不变），证据 `evidence/current/enemy-damage-avoidance/node.json`。
- `npm test` 于 `2026-10-12T18:06:13Z` PASS，`evidence/current/validation.json` 为本轮完整 gate 结果；受限 Edge 首次启动 `spawn EPERM` 失败仅作为环境限制记录，随后授权外串行本地 8088 的真实 Edge `browser-visual-smoke` 于 `2026-10-12T18:08:21Z` PASS，`evidence/current/visual.json` 页面/请求/console/pageerror 均为 0，覆盖首页、选角、战斗、暂停、升级、三 Boss、结算和双移动视口；服务已停止且 8088 无监听。
- 结论仅覆盖有限敌人身体/血条包围盒避让与 fail-closed 绘制，不覆盖像素级身体、HUD、数字互相或全局遮挡，也不构成当前 ZIP、公网、微信实机或发布 PASS。英雄高帧、虎先锋/三 Boss 专属动作、整体遮挡、公网和发布门禁继续 `NOT_READY`，不打包、不部署、不上线。

## 最新安全小步（2026-10-12 17:37Z）：伤害数字有限避让玩家身体并完成本地 Edge 复核

本步仅在 renderer 的 `_drawCombatFeedback` 增加可选 `avoidPlayer` 路径，生产 `render()` 显式开启；直接调用默认保持旧变换。数字与玩家保守身体框（`x±1.5r`、`y−2.58r..y+1.5r`）冲突时，只尝试上/左/右/下四个有限候选，候选必须完整落在当前世界视野内并留 4px 间隔；全部不适用时原位绘制并计数，不丢失数值。未改引擎伤害、TTL、角度、星芒、字体、RNG、素材或 HUD。

- 新 gate `prototype-2d/tests/player-damage-avoidance-smoke.mjs` 已加入 `scripts/validate.mjs`。5 项 Node/Canvas mock 专项覆盖近身移动、远离保持原位、旧 direct API、候选耗尽 fail-closed、冻结输入/复用 buffer/Canvas 栈；`evidence/current/player-damage-avoidance/node.json` 为 5/5 PASS。
- `npm test` 于 `2026-10-12T17:34:25Z` PASS，完整日志：`evidence/current/player-damage-avoidance/2026-10-13T01-34-25-037Z/npm-test.txt`；受限 Edge 首次 `spawn EPERM` 原始失败保存在 `evidence/current/player-damage-overlap/2026-10-12T17-34-45Z/browser.json`。
- 授权外串行本地 8088 服务上的真实 Edge 于 `2026-10-12T17:37:36Z` PASS：正常 UI/加速生产证据观察到真实伤害数字；近身数字移出身体框、重复绘制稳定、远离数字不移动、候选耗尽仍绘制、生产 render 传入 `avoidPlayer:true`，页面/请求/console 错误均为 0。报告与截图：`evidence/current/player-damage-overlap/2026-10-12T17-37-36Z/browser.json`；服务停止且 8088 无监听。
- 同一代码状态下串行 `browser-visual-smoke` 于 `2026-10-12T17:42:42Z` PASS，输出保存在 `evidence/current/player-damage-avoidance/2026-10-13T01-42-17-606Z/browser-visual-smoke.txt`，`evidence/current/visual.json` 覆盖首页、选角、战斗、暂停、升级、三 Boss、结算及双移动视口，页面/请求/console 错误为 0；服务已停止。
- 这是 renderer 的保守身体包围盒有限保证，不是像素级身体、血条、HUD、数字互相或全局遮挡通过；仍不等于当前 ZIP、公网、微信实机或商用发布 PASS。英雄高帧、虎先锋/三 Boss 专属动作、整体遮挡和公网继续 `NOT_READY`，不打包、不部署、不上线。

## 最新安全检查（2026-10-12 17:02Z）：只读发布门禁仍 NOT_READY

串行运行 `scripts/audit-release-readiness.mjs`，未重建、解压、上传或部署。工作区八类普通怪帧 JSON/PNG 均齐全，但现有网页 ZIP SHA `9c9bd515b0e8dcb5c4d4101838f1ebc3679b0f425ab31685909503c9519ae097` 仍缺狼、猴、鹿、鹰、蛇的 10 个帧资源；微信 ZIP SHA `f017493aaf8eeebccc1ac040ded0397a8bfcc4f8d0cbee56e6be5b04e4dec4e2` 按策略不含网页帧资源，不以此判错。

报告：`evidence/current/release-readiness/2026-10-12T17-02-23-974Z/report.json`，结论 `NOT_READY`、`deployAuthorized=false`、`publicPass=false`。沙箱首次执行的 `spawnSync git EPERM` 已保留于 `evidence/current/release-readiness-attempts/2026-10-13T01-02-23-783Z/sandbox-failure.json`，授权外只读重跑成功。英雄高帧、虎先锋/三 Boss 专属动作、整体遮挡和公网当前 PASS 仍未完成；不打包、不部署、不上线。

## 最新安全小步（2026-10-12 16:52Z）：Boss 标签布局专项与本地 Edge 复核通过

本步只验证并固化首关多 Boss 名牌布局：新增 `prototype-2d/tests/boss-label-layout-smoke.mjs` 并加入 `scripts/validate.mjs`。专项覆盖三 Boss 近距离标签互不重叠、避让玩家、输入状态不变、有限数值矩形、Canvas `save/restore` 平衡以及 `dispose` 清空复用缓冲；不宣称身体、血条、伤害数字或 HUD 的全局遮挡已经解决。

- `npm test` 于 `2026-10-12T16:48:07Z` PASS，新增 gate 输出与全套日志保存在 `evidence/current/boss-label-layout/2026-10-13T00-48-07-267Z/npm-test.txt`；`validation.json` 结果为 `PASS`。
- 先按网页优先尝试受限 Edge，Playwright `spawn EPERM` 原始失败保存在 `evidence/current/browser-recheck/2026-10-13T00-51-32-098Z/`；随后在受限外串行启动本地 8088 服务并重跑 Edge，于 `2026-10-12T16:52:45Z` PASS。当前 `evidence/visual.json` 页面、console、pageerror 均为 0，9 张截图已更新；输出保存在 `evidence/current/browser-recheck/2026-10-13T00-52-21-193Z/browser-visual-smoke.txt`。服务已停止、8088 无监听。
- 本地浏览器 PASS 只证明当前工作区回归；不等于 Boss 独立高帧动作、当前网页 ZIP、外部公网、微信实机或商用发布 PASS。发布门禁继续 `NOT_READY`，不打包、不部署、不上线。

## 最新素材任务（2026-10-12 16:15Z）：寅将军首张独立动作候选预检 REVIEW，未接入

按串行低频规则先查现有 Boss PNG/manifest/运行时引用，确认没有可复用的同用途素材；本次只调用一次内置 ImageGen，生成全新 1774×887 透明 8×4 候选并保存证据。SHA256 `3bcfe483529722987ed7a919c56495132fa96e1ac6d2e83a69604fc29a70d057`，预检见 `evidence/current/boss-assets/yin-general-v1/asset-preflight.json`。

预检实际得到 5/8/6/6 个分离区域、25/32 独立帧，存在武器跨格/边界污染，结论 `REVIEW`；候选不进入生产素材、manifest、loader、renderer、ZIP 或公网，也不复用历史 `enemy-boss-kr-v1.png`。已停止本轮连续生成，交接见 `docs/YIN-GENERAL-CANDIDATE-HANDOFF.md`。三 Boss 身份矢量回退仍保留；独立高帧动作未完成。

## 最新安全小步（2026-10-12 15:58Z）：三位首关 Boss 身份矢量回退已隔离，真实 Edge 复核通过

本步只为已有 `bossIdentity.bossId` 增加确定性的 Canvas 矢量外观分支：寅将军（`yin-general`）使用虎纹/双刃，熊山君（`xiong-shanjun`）使用熊形/重锤，特处士（`te-chushi`）使用牛角/钩镰。普通 Boss、精英、未知或跨关身份继续走原通用回退；没有复用普通动物动作表、历史 Boss PNG 或未通过预检的虎先锋候选，也没有改伤害、调度、动画时钟、对象池或生成素材。

- 新边界专项 `prototype-2d/tests/boss-identity-render-smoke.mjs`：三种命名 Boss 的绘制调用/配色各不相同，普通/精英/未知身份保持回退，Canvas 栈与数值均有限；已加入 `npm test` gate。
- `npm test` 于 `2026-10-12T15:55:09Z` PASS，日志：`evidence/current/boss-identity-vector/2026-10-12T15-55-08-329Z/npm-test.txt`。
- 串行本地服务上的真实 Edge 于 `2026-10-12T15:58:42Z` PASS：首页、选角、战斗、暂停、升级、三 Boss、结算、390×844/360×640，页面/请求/console 错误为 0；报告：`evidence/current/visual.json`，本轮脚本输出：`evidence/current/boss-identity-vector/2026-10-12T15-58-16-958Z/browser-visual-smoke.txt`。服务已停止。该 PASS 只证明当前工作区回归，不是三 Boss 专属高帧动作、微信实机、当前 ZIP 或公网 PASS。

英雄真实高帧裁切、虎先锋合格 32 姿态、三 Boss 独立动作表、局内整体遮挡、当前网页 ZIP 重建/解压和公网通道仍未完成；保持 `NOT_READY`，不打包、不部署、不上线。

## 最新安全检查（2026-10-11 17:33Z）：Edge 复核在本地服务启动后通过，非公网 PASS

在保留先前 `spawn EPERM` 失败证据后，串行启动当前 `8088` 本地服务并以受限外启动 Edge 重跑 `node scripts/browser-visual-smoke.mjs`。本轮真实 Edge 从首页→选角→战斗、暂停/升级/Boss/结算及 390×844/360×640 视口通过，`battleArtMode=authoredFrames`、`battleSceneMode=vector`、`mapAssetDraws=0`，Boss 三人阵容与 600 秒胜利边界通过，页面/请求/console 错误均为 0。新报告写入 `evidence/current/visual.json`，时间 `2026-10-11T17:33:29Z`；测试服务已关闭，无 8088 监听。

该 PASS 只证明当前工作区的真实浏览器回归未被身份契约破坏，不等于四英雄高帧缺陷、虎先锋/三 Boss 专属动作、整体遮挡、当前 ZIP 解压、公网或微信实机验收；不打包、不部署。

## 最新安全检查（2026-10-11 17:27Z）：Boss 身份契约后的真实 Edge 复核受 EPERM 阻断

按网页验收优先尝试串行运行 `node scripts/browser-visual-smoke.mjs`，Playwright 启动 Edge 时返回 `browserType.launch: spawn EPERM`，未产生新的浏览器 PASS，也未复用历史 `visual.json`。原始失败保存在 `evidence/current/browser-recheck/2026-10-11T17-27-26-293Z/attempt-failure.json`。身份契约代码与上一条本地 `npm test` 证据不变；不宣称真实网页、公网、ZIP 或部署通过。

## 最新安全小步（2026-10-11 17:18Z）：首关三位最终 Boss 身份契约已隔离，未接入动作

本步只补运行时身份边界，不生成或接入 Boss 动作素材，不改变伤害、调度、变体、对象池或渲染回退：首关寅将军、熊山君、特处士分别登记稳定的 `bossId`/`actionId`（`yin-general`、`xiong-shanjun`、`te-chushi`），`spawnBoss(true)` 仅在首关透传 `bossIdentity:{bossId,variant,actionId}`。普通怪、精英、虎先锋/中 Boss 和其他关卡 Boss 均保持 `null`，不按 `variant` 共用普通动物动作表。

- 击杀死亡特效显式保留 `bossIdentity`；对象池回收仍由统一字段清空保证，不残留跨敌人身份。边界回归覆盖三位 ID 唯一性、别名、首关专属 guard、跨关伪 ID、中 Boss 伪 ID 以及死亡特效保留。
- `npm test` 于 `2026-10-11T17:18:18Z` PASS；最新日志保存在 `evidence/current/boss-identity-contract/2026-10-11T17-18-18-482Z/npm-test.txt`。这只是身份契约与本地回归 PASS，不是 Boss 专属动画、局内遮挡、当前 ZIP、公网或微信实机 PASS。
- 当前发布门禁仍为 `NOT_READY`：英雄高帧/悟净布局、虎先锋合格 32 姿态、三 Boss 专属动作、整体遮挡、当前 ZIP 重建/真实解压验收与公网通道仍未完成；不打包、不部署、不上线。

## 最新安全推进（2026-10-11 16:34Z）：只读发布门禁盘点确认未就绪，不部署

完成一次只读工作区/ZIP 发布盘点，未重建、解压写入、上传或部署。证据见 `evidence/current/release-readiness/2026-10-11T16-34-14-926Z/report.json`，脚本为 `scripts/audit-release-readiness.mjs`。

- 当前网页 ZIP SHA `9c9bd515b0e8dcb5c4d4101838f1ebc3679b0f425ab31685909503c9519ae097`，相对当前工作区缺狼、猴、鹿、鹰、蛇的 10 个帧 JSON/PNG；它仍是旧牛版本候选，不能发布。微信 ZIP SHA `f017493aaf8eeebccc1ac040ded0397a8bfcc4f8d0cbee56e6be5b04e4dec4e2` 按现行发布策略只含 core/vector 与音频，不以网页帧资源缺失判错。
- 门禁仍有未完成项：四英雄真实高帧/悟净布局、虎先锋专属合格 32 姿态、寅将军/熊山君/特处士专属动作、局内整体遮挡整理和当前公网通道 PASS。微信真机和商用账号服务按范围延期。
- 结论 `NOT_READY`、`deployAuthorized=false`、`publicPass=false`。此前受限启动和脚本变量错误失败记录见 `evidence/current/release-readiness/attempt-failures.json`；修正后盘点成功。下一步不能上线，需先完成至少一个真实缺口并重新回归/重建包/公网验收。

## 最新安全推进（2026-10-11 15:07Z）：悟净单次布局编辑候选仍未通过，未接入

本步只对现有 `hero-wujing-battle-v3-sheet.png` 做了一次内置 `image_gen` 布局编辑，目标是保留原 8 个姿态、完整武器和统一比例并改为 4×2 透明布局。候选未覆盖原图，未进入运行时、发布包或公网。

- 候选与提示词、生成记录、预检和交接证据集中在 [`docs/WUJING-LAYOUT-CANDIDATE-HANDOFF.md`](docs/WUJING-LAYOUT-CANDIDATE-HANDOFF.md) 与 `evidence/current/wujing-layout/2026-10-11T08-43-56-039Z/`。候选 PNG 1774×887，SHA256 `4f73bfe347907b17b10a56eb65bdd316e30ef5abef51a1ad23e525957091364f`；原图 SHA `8788002d9482ab92797dc0dfb41742b28e811d18c5a764485c54ae1578dce747` 未变。
- alpha>8 预检确认 8 个主体、上下各 4 个，但第 5/6 姿态的完整裁切框仍夹入邻人像素（tight 12/90，padding 27/178）；均分单元会丢失主体并夹入邻人，30px 透明留白不满足，结论 `REVIEW_LAYOUT_CONSTRAINTS_NOT_MET`。
- 单 Edge 155.0.4283.45 候选专用 data-URL 预览完成，4 张截图、PNG 解码和 Canvas 参数检查通过，页面/请求/console 错误为 0；这只是候选观察，不是局内、FPS 或高帧验收。独立复核代理先后遇到 429/503，已停止重试，没有伪造批准。
- 本轮 `npm test` 与 80 媒体/76 唯一 SHA/4 解释副本素材审计通过；交接核验显示 135 个保护文件与原图未变。`candidateLayoutPassed=false`、`runtimeApproved=false`、`highFrameApproved=false`，不接入、不打包、不部署。

下一步必须先获得新的源级姿态隔离方案，再单独建立固定根点/统一比例并做局内真实浏览器验证；本候选不能补齐真实高帧，网页门槛完成前不上线。

## 最新安全推进（2026-10-11 08:24Z）：悟净纯矩形裁切修复不可行，候选未接入

在上一步缺陷基础上，本步只验证“复用原PNG、仅改裁切”的可行性。4邻域连通测量及真实Edge候选预览确认：悟净人物本身未粘连，但上排第2～5个人物的最小完整矩形仍含邻人物969/1571/3513/1606个alpha>8像素；外扩2px后更多。任何保全这些人物的矩形都会包含这些残片，改5列、缩小裁切或调整根点均不能安全解决。下排三姿态矩形没有其他大人物污染，不能据此删掉上排动作或宣布整表合格。

- `evidence/current/wujing-crop-isolation/2026-10-11T08-23-36-875Z/` 保存双alpha阈值测量、真实网页基线与tight/+2候选预览。单Edge于08:24:51Z→08:24:57Z完成，意外错误0，结论仍为 `REVIEW_RECTANGULAR_CROP_CONTAMINATION`，不是修复/高帧/局内/公网PASS。真实键盘截图另存实际move frame3的绘制元数据；预览按格缩放仅用于观察，不是运行比例/锚点方案。
- 08:25:39Z新npm test PASS，08:25:40Z新库存审计80/76/4 PASS；135个保护文件和全部80媒体SHA不变，两ZIP未改。首轮预检SHA大小写比较误报、受限服务启动EPERM均独立保留；修正比较器后重跑，自有浏览器/服务正常关闭。

本步没有修复生产错切，也没有生成、编辑或重编码PNG。下一步应先对现有悟净图做单张隔离布局修复、保持人物/完整武器与一致比例并留透明间距，通过预检后才做锚点与接入；不再重复尝试纯矩形坐标微调。修布局仍不等于补齐高帧。其他网页发布门槛保持未完成，不上线；微信实机仍延期。见 [`docs/WUJING-CROP-ISOLATION.md`](docs/WUJING-CROP-ISOLATION.md)。

## 基线（2026-10-11 08:02Z）：四英雄高帧缺陷已实证，未修复

本步只读核对英雄素材SHA/尺寸/用途/运行引用，并新增诊断脚本、真实浏览器证据及交接文档；没有生成图片或修改生产素材/运行时，没有重建ZIP或部署。单Edge于08:02:47Z→08:02:54Z（北京时间16:02）确认：四英雄的move8只重复3个源裁切，attack8只重复2个源裁切，实际绘制还叠加整图旋转/缩放；这不等于8个完整独立姿态。悟净原图为上5下3，加载器却按4×2均切，真实UI进入后的键盘输入画面和双向renderer样本均可见角色被截断/混入邻帧。

- 诊断结论是 `OBSERVED_BASELINE_DEFECT`，不是动画PASS。其他三英雄也有武器/特效跨均分边界，截图已目视；alpha边界像素数只用于警告，不作为姿态数量。8张原图切线/renderer截图与3张UI/玩法截图分开标注，克隆夹具不是自然玩法。
- 新 `npm test` 于08:03:16Z PASS；08:03:37Z素材审计仍80份媒体/76唯一SHA/4组可解释副本。135个受保护源文件/素材/manifest/现有ZIP在浏览器和回归前后SHA不变。测试通过只证明现有机制/平台桩，不覆盖上述视觉缺陷。
- 证据目录 `evidence/current/hero-highframe/2026-10-11T08-02-47-308Z/` 包含不可覆盖的本次浏览器报告、完整测试日志、21份当前回归快照、旧证据备份和 `handoff-verification.json`。首次受限启动EPERM单独保留；自有浏览器正常关闭、8093服务进程退出已由测试句柄确认，不宣称系统内无其他进程。

当时计划下一步测量悟净完整裁切/固定根点；现已由上节证实纯矩形方案不可行，不能继续按此方案直接接入。虎先锋/3Boss专属动作、蛇最终视觉、整体遮挡、当前ZIP重建/解压和公网验收仍未完成。微信实机/账号服务继续延期，不列为网页上线前置。详见 [`docs/HERO-HIGHFRAME-BASELINE.md`](docs/HERO-HIGHFRAME-BASELINE.md)。以下记录按各自历史时间解释，不复用为本轮PASS。

## 前一步（2026-10-11）：虎先锋v2修复仍未通过

单次低频内置imagegen修复v2后，死亡行与边缘裁切已改善，但攻击行粘连为5区域，合计29/32独立姿态，维持REVIEW。v1/v2均只留证据、不进入生产/公开资源/ZIP，不继续第三次即时生成。独立真实Edge可解码并绘制实测区域，不能视为局内动画PASS；新npm test及80份媒体/76唯一SHA/4解释副本审计通过。详见 `evidence/current/tiger-vanguard/v2-handoff.json` 与 `docs/TIGER-VANGUARD-CANDIDATE-HANDOFF.md`。

## 最新安全推进（2026-10-11）：虎先锋候选仅预检，未接入

本步先核对媒体SHA、尺寸、用途与运行时引用，确认没有可复用的“双叉岭虎先锋”专属动作表；普通虎表只绑定 `stage1+normal+tiger`，历史通用精英/Boss单图也不适用。内置 imagegen 串行生成1张独立候选，原PNG直接复制到 `evidence/current/tiger-vanguard/`，未改生产素材、玩法、加载器、allowlist、发布包或部署。

- 候选 `1774×887`、`1,985,514` bytes，SHA256 `9f59a6bab970bd3a4b68383a392488c9634a61e5fd4a71152af786fc4ee34824`；橙毛黑纹、钢灰短甲、朱红腰带、短弯刀，身份上区别于普通虎妖与寅将军。
- 只读alpha预检为 `REVIEW`：前3行各8区域，但死亡行只有7个连通区域；共31/32独立帧，另有边缘裁切。证据见 `evidence/current/tiger-vanguard/asset-preflight-v1.json`。
- 单个真实Edge（155.0.4283.45）可解码并绘制这31个实测区域，页面错误0；报告明确标为候选预览，不是局内、FPS、公网或发布验收。证据见 `browser-candidate-preflight.json`。
- `npm test` 于06:19:49Z PASS；80份媒体/76唯一SHA/4解释副本审计PASS。生成前后24个运行源、manifest与现有dist ZIP SHA均 `UNCHANGED`。完整交接见 [`docs/TIGER-VANGUARD-CANDIDATE-HANDOFF.md`](docs/TIGER-VANGUARD-CANDIDATE-HANDOFF.md)。

本候选不进入运行时，暂不连续重试生成；后续仍需虎先锋合格32姿态、三Boss专属动作、英雄高帧、整体遮挡、当前ZIP重建/解压和公网验收，网页门槛完成前不上线；微信实机按当前范围延期。

更新时间：2026-10-11（本轮仅补状态牌对伤害数字的有限避让；8项专项、05:47:30Z新npm test和双尺寸真实Edge修复前后证据已保存）。当前八类普通怪均有32姿态本地接入，80份库存媒体SHA未改；蛇最终造型/流畅度、英雄高帧质量、虎先锋、3Boss、身体/血条/数字/HUD整体遮挡、当前ZIP与公网仍未完成，未部署、不上线。

## 最新安全小步（2026-10-11）：状态牌不再覆住伤害数字

只在原三个状态牌候选位置中增加本帧数字/星芒旋转包围盒检查；包含文字实际尺寸、原描边与星芒miter尖角，三个候选均冲突则沿用状态牌抑制策略。数字的内容、位置、画法和生命周期不变，引擎、素材与HUD未修改；矩形最多48个并复用，兼容输入超48时只抑制状态牌。

- `evidence/current/feedback-overlap/before/browser.json`05:37:10Z记录两个尺寸的真实基线覆字缺陷；`after/browser.json`05:44:13Z→05:44:18Z单Edge PASS。390×844/360×640夹具均从4牌变为3牌，避让或抑制后不压数字，4个数字Canvas变换/值/样式与基线一致，重复绘制稳定，页面/请求/console错误均0。另保存真实UI后合法输入产生的伤害截图，夹具明确不等于自然冲突覆盖。
- `feedback-overlap/node.json`8专项及`npm-test.txt`、`validation.json`05:47:30Z全套新跑PASS，原八物种/机制/600秒/正常输入/平台桩回归通过。`handoff-verification.json`核80份媒体、引擎SHA、两ZIP不变，浏览器源码与截图hash一致。
- 首次浏览器EPERM和一次验收脚本误关联同列敌人的失败JSON保留；最终代码已重验。浏览器自闭、自启服务已退出；05:47:06Z授权只读确认无匹配测试进程/8088或8091监听，原证据备份在`work/feedback-overlap-backup-20261011T0530Z/`。

本步没有新增素材、重跑公网/公开入口/ZIP网页或部署；自然截图仍有近身数字压住角色，不能宣称全局遮挡已解决。详见 [`docs/FEEDBACK-OVERLAP-HANDOFF.md`](docs/FEEDBACK-OVERLAP-HANDOFF.md)。

## 最新安全小步（2026-10-11）：伤害数字自身装饰覆字修复

真实Edge修复前8个固定renderer样本确认旧顺序为 `strokeText → fillText → 星芒fill/stroke`，装饰实心部分遮盖数字。现在只将同一星芒移到数字描边/填充之前，并在其后恢复文字自身颜色与2.8/3.5描边；没有改伤害值、位置、尺寸、旋转、生命周期、引擎状态或素材，没有扩展到全局避让。

- `evidence/current/damage-labels/before/browser.json` 于05:20:54Z→05:21:00Z记录 `OBSERVED_BASELINE_DEFECT`，不是PASS；`after/browser.json` 于05:22:28Z→05:22:30Z单Edge PASS，包含真实UI进入后的合法输入自然伤害截图和相同8样本夹具，页面异常/请求失败/console错误均0。已目视数字不再被自身星芒覆盖，近身数字仍叠在角色上，整体遮挡未解决。
- `damage-labels/node.json` 6项专项PASS；`damage-labels/npm-test.txt` 与 `validation.json` 为05:23:34Z新跑全套PASS，原八物种/机制/600秒/平台桩回归通过。Node专项另于05:23:47Z独立复跑，未冒充微信实机。
- `damage-labels/handoff-verification.json`确认80份既有媒体和engine SHA不变、修复后浏览器源码hash一致、dist两ZIP不变。首次受限Edge启动EPERM保留，授权后串行完成并关闭；本轮服务已退出，05:24:34Z无8088/8091监听。前一轮同名Node证据备份在 `work/damage-label-backup-20261011T0525Z/`。

本步没有新增素材、重跑公网/公开入口/ZIP网页或部署。上一轮蛇与public浏览器报告保留原时间，不当成本步新跑；后续仍从尚未完成的专属动作或全局遮挡中选一个安全步骤。详细边界见 [`docs/DAMAGE-LABEL-PAINT-ORDER.md`](docs/DAMAGE-LABEL-PAINT-ORDER.md)。

## 最新安全推进（2026-10-11）：普通蛇v3接入、真实Edge与验收门禁修正

本步完成已有蛇v3候选接入，不再生成图片。此前蛇缺口查重后串行生成的v1跨行粘连、v2最小间隔5px未达6px门槛，均为REVIEW，只留在 `evidence/current/snake/rejected-*`；v3通过预检，原PNG未重绘/重编码。实测alpha bounds外扩2px，170源像素统一比例、暂定固定列根点/行基线，idle index4源朝向由模块归一；仅绑定stage1+normal+snake，精英/Boss/其他关卡保持向量回退。

- v3：1774×887、1,749,032 bytes，SHA256 `c10c9f951f871e0f398cef9a7ef36c46065df4fb986ed2d0bb8b246da11b0ec2`；idle8/move8/attack8/hit4/death4。加载器显式选择v3，公开allowlist/六字段合同/构建与发布清单已加入，失败稿与来源提示词不公开。
- `evidence/current/snake/npm-test.txt`、`engine-runtime.json`：npm test于05:03:26Z PASS；17机制+11虎+13熊+13牛+13狼+9猴+11鹿+3鹰+12蛇+8状态、四角色600秒、正常输入、池/渲染/平台桩与八物种公开合同通过。蛇专项断言64次双向真实变换/裁切、攻击受击/暂停、0.42秒死亡单次回收与池清理，未改变原玩法规则。
- `evidence/current/snake/browser-runtime.json`：单Edge于05:05:07Z→05:05:11Z从首页→选角→战斗，合法输入加速生产模拟覆盖move8/attack8/hit4/death4、左右、命中2次/击杀1次；保存四类状态截图、稳定暂停截图和左右32姿态renderer夹具。页面异常/失败请求/console错误为0，暂停冻结/恢复、`authoredFrames + vector`、`mapAssetDraws=0`通过。自然idle为空，不冒称覆盖；夹具不是自然玩法，未测真实运行FPS。
- `evidence/current/browser-public-smoke.json`：05:01:19Z单Edge验证本地workspace八物种PNG/JSON/模块200、32帧六字段合同、约9秒正常流程和调试关闭；9个404为精确路径阻断探测。修复了旧验收脚本忽略探测后console错误的漏洞，现仅排除精确URL+完整404文本，其他全程错误必须FAIL；意外错误为0。本地公开入口不等于公网或ZIP解压件。
- `evidence/current/asset-dedup-audit.json`：05:02:24Z库存80份媒体/76唯一SHA/4解释副本，metadata一致。首次Edge启动EPERM和两份失败候选均保留；原Node/浏览器证据备份在 `work/snake-integration-backup-20261011T0440Z/`。测试浏览器自闭，测试服务已停，05:06:03Z只读快照无匹配进程/8088或8091监听，可用21.53/31.90GiB。

目视左右夹具未见明显串格或裁切；蛇目前是带角鳞片的人形造型，最终蛇类辨识和连续流畅度未批准。自然近身截图仍有身体/数字遮挡（移动截帧也可能被UI覆盖），不能以32个不同像素或draw调用通过冒称可读性完善。`runtimeApproved:true`仅为本地技术接入。

当前dist仍是牛版候选ZIP，缺狼/猴/鹿/鹰/蛇，两个ZIP SHA与进入本步前一致；本步未重建/解压验包/部署，未重测外部公网。下一步应从虎先锋专属动作、三Boss、英雄最终高帧或整体遮挡中选一个真实缺口；先查库存与用途，不重生成八类普通怪。详见 [`docs/SNAKE-RUNTIME-HANDOFF.md`](docs/SNAKE-RUNTIME-HANDOFF.md)。以下历史记录保留原时间，不视为本轮浏览器重跑。

## 最新安全推进（2026-10-10）：普通鹰妖32姿态局内接入与真实Edge验收

本轮先查当前媒体SHA、尺寸、用途和运行时引用，确认没有可复用的普通鹰妖动作表；仅调用一次内置 imagegen 生成 `enemy-hawk-battle-v1-sheet.png`，原PNG直接保存，未重绘、重编码或重复生成。随后按预检alpha bounds外扩2px建立不均分帧合同；加权alpha中心确定8列根点，固定行基线，未对任何姿态做逐帧底部吸附或合成镜像。共享注册、串行加载、公开契约、allowlist与发布清单已加入鹰，仅绑定 `stage1+normal+hawk`，精英/Boss/其他关卡继续向量回退。

- 鹰PNG为1774×887、1,776,852 bytes，SHA256 `eaa6d8e639c9a29f1d94bcded105b584168ebc67efe9c78017b1f78e2c6cd9e7`；32姿态 idle8/move8/attack8/hit4/death4，实测alpha矩形外扩2px，180源像素统一比例、固定根点。证据：[`enemy-hawk-battle-v1-frames.json`](prototype-2d/assets/enemy-hawk-battle-v1-frames.json)、[`prompts/enemy-hawk-battle-v1-sheet.txt`](prompts/enemy-hawk-battle-v1-sheet.txt)。
- `evidence/current/hawk/engine-runtime.json`：3项Node/Canvas专项PASS，含32裁切、64左右镜像、状态身份隔离、边界合同与未标记回退。
- `evidence/current/hawk/browser-runtime.json`：单个真实Edge于18:24:27Z→18:24:32Z从首页→选角→战斗，合法输入加速生产流覆盖move8/attack8/hit4/death4、双朝向、命中50次/击杀26次；32姿态实际renderer夹具32个不同格，页面错误/失败请求0，`battleArtMode=authoredFrames`、`battleSceneMode=vector`、`mapAssetDraws=0`通过。idle自然没有强行声称；夹具明确不是自然玩法。
- `evidence/current/hawk/public-contract-node.json`、`evidence/current/validation.json`：七物种公开帧合同与npm test于18:25:11Z PASS；`evidence/current/browser-public-smoke.json`于18:26:27Z单个真实Edge验证当前workspace七物种资源/JSON/模块200、32帧合同、路径隔离、调试关闭和约9秒正常流程通过；7个404是刻意阻断探测。它不是公网、当前ZIP解压或微信实机验收。
- `evidence/current/asset-dedup-audit.json`：79份媒体、75个唯一SHA、4组可解释副本，PASS；本轮没有重复生成其他素材。18:29:51Z审计显示鹰SHA独立，manifest无尺寸/bytes/hash差异。

鹰/鹿/猴的 `runtimeApproved:true` 只表示本地运行时接入，不等于整体视觉、移动端FPS、公网、ZIP或微信实机批准。现有 `dist/` 仍为牛版候选ZIP（缺狼/猴/鹿/鹰），未重建、未部署；外部公网继续保持未验收。

## 最新安全推进（2026-10-10）：普通鹿妖32姿态局内接入与修正后验收

本轮先查当前媒体SHA、尺寸、用途和运行时引用，确认没有可复用的普通鹿妖动作表；仅调用一次内置 imagegen 生成 `enemy-deer-battle-v1-sheet.png`，原PNG直接保存，未重绘、重编码或重复生成。随后独立alpha审计发现均分格会夹断部分姿态，已改为实测alpha bounds+2px矩形；发现idle index7源画面朝左，未改PNG而在鹿模块记录 `mirrorX` 归一。共享注册、串行加载、公开契约与allowlist已加入鹿，仅绑定 `stage1+normal+deer`，精英/Boss/其他关卡继续向量回退。

- 鹿PNG为1774×887、1,894,732 bytes，SHA256 `721ce755d768daca09100f7346c0f1eab6a46f2a4f1aa0ce5b0cc0def33e621e`；32姿态 idle8/move8/attack8/hit4/death4，实测矩形、205源像素统一比例、固定根点。证据：[`enemy-deer-battle-v1-frames.json`](prototype-2d/assets/enemy-deer-battle-v1-frames.json)、[`prompts/enemy-deer-battle-v1-sheet.txt`](prompts/enemy-deer-battle-v1-sheet.txt)。
- `evidence/current/deer/engine-runtime.json`：11项Node/Canvas专项PASS，包含独立alpha bounds、不串格、身份隔离、暂停/死亡池、64次双向绘制与边缘裁切。
- `evidence/current/deer/browser-runtime.json`：单个真实Edge于15:52:54Z→15:52:58Z从首页→选角→战斗，合法输入自然覆盖move8/attack8/hit4/death4、左右朝向、命中3次/击杀1次；左右32姿态夹具、暂停冻结/恢复、`authoredFrames + vector`、`mapAssetDraws=0`及页面错误0通过。idle自然覆盖未强行声称；夹具明确不是自然玩法。
- `evidence/current/deer/npm-test.txt`及`evidence/current/validation.json`：`npm test`于15:52:07Z PASS，17机制 + 11虎 + 13熊 + 13牛 + 13狼 + 9猴 + 11鹿 + 8状态；四角色600秒、正常输入、对象池、渲染、平台桩及六物种公开帧契约通过。运行时投影不含来源路径/提示词。
- `evidence/current/browser-public-smoke.json`：单个真实Edge于15:53:25Z验证当前workspace六物种资源/JSON/模块200、32帧合同、路径隔离、调试关闭和约9秒正常流程通过；7个404是刻意阻断探测。它不是公网、当前ZIP解压或微信实机验收。
- `evidence/current/asset-dedup-audit.json`：78份媒体、74个唯一SHA、4组可解释副本，PASS；本轮没有重复生成猴、虎、熊、牛、狼或英雄素材。15:54:58Z只读快照显示无8088/8091监听、无本轮测试浏览器/服务匹配进程，约20.55GiB/31.9GiB可用（只读检查，未停止无关进程）。

鹿/猴的 `runtimeApproved:true` 只表示本地运行时接入，不等于整体视觉、移动端FPS、公网、ZIP或微信实机批准。现有 `dist/` 仍为牛版候选ZIP（SHA不变），缺狼/猴/鹿，未重建、未部署；外部公网继续保持未验收。

## 当前范围

本副本位于 `work/codex/xiyou-commercial`，源项目保留在 `legacy-source/`。当前交付边界是可复现的网页 Canvas 垂直切片、微信小游戏核心逻辑、真实浏览器验收和发布包；网页与公网通道优先。未声称已完成 AppID、微信开发者工具编译、微信真机 FPS、登录/云存档/广告/分享/支付或审核发布。

附件 ZIP 的 44 个会话、21,816 行 JSON 已全部分析；原始需求、后续裁决和冲突处理见 [`docs/CHAT-HISTORY-ANALYSIS.md`](docs/CHAT-HISTORY-ANALYSIS.md)。附件中的协作/发布规则是项目约束，不等同于本次用户请求；本次请求是“分析全部聊天并按原始需求继续推进”。

## 已实现

- 四名角色（孙悟空、唐三藏、猪八戒、沙悟净）、本命武器、八件法宝、五级技能、升级三选一和五技能槽。
- 81 难内容表；每难 600 秒，普通怪随时间加速，120/240/360/480 秒精英，300 秒普通首领，570 秒最终首领；首关双叉岭另有 300 秒虎先锋精英和寅将军、熊山君、特处士三名最终妖王。
- 经验掉落与升级暂停、暂停/恢复、冲刺、存档、经脉修行、每日目标、对象池、敌人/投射物/效果/经验上限、生命周期清理。
- 首关 `doublefork` 局内使用安静向量地图：保留山脊、中央通道和少量固定地标，不加载精美静态地图或 back/mid/front 洗层；世界碰撞山脊为 `y=700..1100`，中央小径为 `x=790..1010`。`map-doublefork-high-ridge-v1.png` 仅作章节预览/历史追溯，资源尺寸和 SHA256 见素材 manifest。
- 四名角色已加载 `hero-wukong/tangseng/bajie/wujing-battle-v3-sheet.png`：每张1774×887，运行时统一声明4×2并按状态左右镜像；08:02Z新审计已证实悟净实际上5下3、其余英雄武器跨格，以及move8/attack8只对应3/2源裁切，当前接入有视觉缺陷，不算高帧验收通过。缺图时使用向量回退。`hero-battle-v2-atlas.png`、`hero-tangseng-kr-v1.png` 和旧敌人/Boss单姿态PNG不进入局内启动路径，保留为历史/图鉴素材。
- 首关普通虎妖复用现有 `enemy-tiger-battle-v1-sheet.png` 的32独立姿态（idle8/move8/attack8/hit4/death4）；按实测矩形、固定脚底和统一比例绘制，不叠加拉伸/摇摆。出生身份只绑定 stage1+normal+tiger，虎先锋/寅将军不共用。自然接触攻击与受击有独立视觉时钟，死亡保留朝向/体型并单次播放，0.42秒回收；原伤害、移动、随机数与对象池规则不变。
- 普通熊妖已复用 `enemy-bear-battle-v1-sheet.png` 接入：1774×887、978099 bytes，32姿态8/8/8/4/4，PNG哈希未变。只绑定stage1+normal+bear，不用于Boss熊山君；136源像素统一比例、固定根点、血条3.4r偏移、独立视觉时钟和死亡单次回收。`runtimeApproved:true`；已进入10月10日本地候选ZIP，未部署。
- 普通野牛已复用 `enemy-bull-battle-v1-sheet.png` 接入：1774×887、1,137,073 bytes、32姿态，PNG哈希未变。仅stage1+normal+bull，不用于特处士（待处士）；150源像素统一比例、固定根点、血条3.45r、单次死亡0.42秒回收。局内与Node专项通过；已进入10月10日牛版本地候选ZIP并验实际解压网页，未部署。
- 普通猴妖已查重后新增 `enemy-monkey-battle-v1-sheet.png`：1774×887、1,379,382 bytes，SHA256 `eda548ce95da339409595a8f226509d2aa4de206e3ed3867cf7f750118ad4b44`，32姿态 idle8/move8/attack8/hit4/death4。仅绑定stage1+normal+monkey，不用于精英/Boss/其他关卡；165源像素统一比例、固定根点、血条3.35r，原碰撞、伤害、移动、掉落、RNG和对象池规则不变。Node 9项与真实Edge自然move8/attack8/hit4/death4、双向、命中/击杀、32姿态夹具通过；已加入当前工作区公开allowlist与合同投影，尚未重建发布包或部署。
- 局内模式固定为 `battleArtMode: "authoredFrames"` + `battleSceneMode: "vector"`；真实多帧角色与地图路径层分离，`mapAssetDraws === 0` 是没有误加载精美静态地图的预期值。移动、攻击、受击、眩晕、闪避、Boss 入场、死亡仍由引擎动画状态驱动。
- 新增 4 个本命武器技能图标（`weapon-skill-*.svg`），分别对应四名角色；复用已有 8 个法宝图标，在网页 HUD、升级卡和法宝图鉴中显示，微信端保留向量回退。
- BGM/SFX、升级/Boss/受击/击杀/UI 反馈；伤害数字和状态标签。局内保留地图、敌人/角色、投射物、特效与 HUD 的清晰层级。
- 状态提示按真实倍率判断减速（`0<slow<1`），正常`slow=1`不误报或吞掉击退；紧凑单字状态每帧最多12个，优先Boss/精英，有限避让其他状态牌和玩家。虎妖血条移出完整姿态包围，眩晕不再叠画星环。此项不代表所有身体/数字/HUD遮挡均解决。
- 公共网页服务只暴露显式运行时 allowlist，并拒绝 manifest、生成器、测试、候选/历史资源和路径穿越；发布脚本使用同一运行时资源边界。

## 阶段记录（2026-10-10）：普通猴妖32姿态局内接入

本轮先审计当前媒体库存、SHA、尺寸、用途和运行时引用，确认没有可复用的普通猴妖动作表；只调用一次内置 imagegen 生成1774×887透明动作表，原PNG直接复制，未脚本重绘、重编码或重复生成。共享动画注册、串行加载、公开契约、serve allowlist、release清单、微信核心构建和npm gate已加入猴妖；身份只允许 `stage1+normal+monkey`，精英/Boss/其他关卡继续使用向量回退。

- `evidence/current/monkey/asset-preflight.json`：77份媒体、73个唯一SHA、4组可解释副本；PNG透明背景、四行八列、32独立姿态、边缘无裁切通过。帧合同 `enemy-monkey-battle-v1-frames.json` 使用实测矩形、165源像素统一比例、固定根点，`runtimeApproved:false` 保留到正式整体发布门槛。
- `evidence/current/monkey/engine-runtime.json`：9项Node/Canvas专项PASS，含32裁切、64左右镜像、自然攻击/受击/死亡、暂停恢复、死亡池字段清空与身份隔离。
- `evidence/current/monkey/browser-runtime.json`：单个真实Edge（约14:03，127.0.0.1:8088）从首页→选角→战斗，生产流覆盖move8/attack8/hit4/death4、双朝向、命中48次/击杀18次；32姿态实际renderer夹具32个不同格，页面错误/失败请求0，`battleArtMode=authoredFrames`、`battleSceneMode=vector`、`mapAssetDraws=0`。
- `evidence/current/browser-public-smoke.json`：本地workspace公开入口同一单Edge流程通过，猴妖PNG/JSON/模块均200，5物种公开合同均32帧，路径隔离和调试关闭通过；不是公网或ZIP解压验收。`evidence/current/monkey/npm-test.txt` 留存本轮npm test完整输出，平台桩也通过。

本轮不宣称猴妖动画完美、移动端FPS、公网PASS、ZIP解压PASS或微信实机PASS。下一步应继续对鹿/鹰/蛇中一个缺口做同样的查重后单次生成；所有素材、整体遮挡和公网验收完成前仍不上线。

## 阶段记录（2026-10-10）：普通苍狼32姿态局内接入

本轮没有生成图片，直接复用上一轮已查重并保留原SHA的普通苍狼图集与实测帧JSON。共享动画注册、串行加载、公开帧契约、serve allowlist 和 release 清单已接入；碰撞、伤害、移动、掉落、RNG和对象池没有改动。运行时批准仅代表本地网页接入门槛通过，不等于移动端、公网、微信实机或“完美动画”批准。

- `npm test` 于 `2026-10-10T12:12:13Z` PASS：17机制 + 11虎 + 13熊 + 13牛 + 13狼 + 8状态；四角色600秒、正常输入、对象池、渲染和平台桩通过；四物种公开帧JSON投影通过。
- `evidence/current/wolf/engine-runtime.json`：13项专项PASS，含32裁切、64左右镜像、自然攻击/受击/死亡、暂停恢复、死亡池字段清空、跨物种隔离、8边缘裁切和128血条包围。
- `evidence/current/wolf/browser-runtime.json`：单个真实Edge（最新12:19:08Z→12:19:12Z）在本地 `127.0.0.1:8088` 从首页→选角→战斗，生产流自然覆盖move8/attack8/hit4/death4、双朝向、命中/击杀、暂停截图与时钟冻结/恢复；32姿态左右48px夹具另列，页面错误与失败请求0。首次受限启动EPERM和一次清理超时均保留，最终授权重跑Edge正常关闭。
- `evidence/current/browser-public-smoke.json`：本地workspace公开入口PASS（最新12:21:13Z），四物种资源与32帧公开契约均200，路径隔离、调试关闭和约9秒正常战斗通过；不是公网或ZIP解压验收。
- 图集 `b116553b…8d8299` 未改字节，`approvedForRuntime:true` 仅表示本地接入通过。详细边界与失败记录见 [`docs/WOLF-RUNTIME-HANDOFF.md`](docs/WOLF-RUNTIME-HANDOFF.md)。

当前 `dist/` ZIP 仍是未含狼的牛版本，未重建、未部署；下一步仍需补猴/鹿/鹰/蛇、虎先锋、三Boss专属动作并整理整体遮挡，完成后再重建候选包和真实解压验收。

## 最新安全推进（2026-10-10）：普通苍狼32姿态候选预检

本轮只补缺失素材与独立验证：先核当前副本75份媒体、原项目/legacy只读用途，以及本聊天10张生成图的SHA/身份，没有可复用狼动作。内置imagegen只生成1次，初稿即有32个隔离姿态，原样保存1774×887、1,410,175 bytes PNG；没有布局编辑、脚本重绘或重做虎/熊/牛/英雄。

- 状态为idle8/move8/attack8/hit4/death4；32实测矩形每边外扩2px、170源像素统一比例，固定行列根点仍为provisional。目标仅stage1+normal+wolf，不能替代凌虚子/奎木狼或其他精英/Boss。
- 独立真实Edge于09:31:04.610Z启动、09:31:14.415Z结束PASS，PNG解码/逐状态不同像素/左右镜像/全姿态绘制覆盖/页面错误0；输出左右48px图集、48/56/96px抽样及可播放WebM。录像数据回读90个解码回调、90种抽样像素、4.173秒播放结束，不等于每个源姿态均被编码、游戏FPS、最终流畅度或局内验收。
- npm test于09:33:09.086Z新跑PASS（17机制+11虎+13熊+13牛+8状态、四角色600秒、正常输入、池/渲染/平台桩和三物种公开契约）；没有狼局内测试，因为尚未接入。素材审计76份媒体/72唯一SHA/4解释副本、metadata一致。
- `runtimeApproved:false`/`approvedForRuntime:false`保持；未进入native-app/共享注册/serve/release，牛版本地候选ZIP未重建。上一轮同名Node/库存证据和manifest已备份至`work/wolf-preflight-backup-20261010T091809Z/`；整体游戏、音频、公网、ZIP解压网页本轮均未重跑。
- 首次浏览器启动EPERM单独保留，授权后一个Edge串行完成并关闭。09:34:02Z只读快照无匹配测试/无头浏览器残留，可用约21.01GiB/总31.9GiB；未结束无关进程，不保证未来无429。

完整交接与prompt见 [`docs/WOLF-ANIMATION-HANDOFF.md`](docs/WOLF-ANIMATION-HANDOFF.md)，汇总为`evidence/current/wolf/handoff-verification.json`。下一步直接复用此狼候选做局内接入，不再生成同用途狼表；另外猴/鹿/鹰/蛇、虎先锋与3Boss仍缺动作，整体遮挡和公网仍待验，未满足全完成上线条件。

## 前一步（2026-10-10）：牛版本地候选包验收

以下保留当时包验收范围；该阶段同名Node/库存证据可从`work/wolf-preflight-backup-20261010T091809Z/evidence-current/`恢复，当前public浏览器报告仍是该牛ZIP的历史实际解压网页证据，不计为狼步骤的新跑。

本轮只完成本地候选包重建与验证，没有生成/修改素材像素、改玩法或部署。网页46项、微信25项与当前运行资源清单、内外manifest、staging及源码一致；公开虎/熊/牛帧JSON只有6个运行字段，不含本机来源或提示词路径。

- `npm test`于09:04:57.601Z新跑PASS：17机制+11虎+13熊+13牛+8状态、四角色600秒、正常输入、对象池、渲染、平台桩及三物种公共帧契约；不是微信实机。
- 09:06:23Z验包PASS，实际解压到`work/release-validation/bull-20261010T090309Z/`。真实Edge报告标记09:07:24Z，目标`archive-extracted-bull-20261010T090309Z`，不是workspace。首页→选角→战斗、约9秒实时推进、四角色/虎/熊/牛资源、三份精简帧JSON、禁止路径404、`?debug=1`仍关闭debug通过。7条404是刻意探测，页面异常/失败请求0。
- HTTP另核实虎/熊/牛帧JSON的GET/HEAD长度4473/4464/4464 bytes及返回正文与解压件一致；网页入口与牛PNG字节也和解压件一致。截图已目视，仅证明入口和此段正常流程，不替代全部动作/遮挡质量验收。
- 首次受限环境构建失败保留，授权重跑通过；旧ZIP及完整上一轮证据可从`work/release-backups/pre-bull-20261010T090309Z/`恢复。生成目录已重建，未删除素材或修改原项目。素材再审计仍75/71/4。
- 单测试浏览器及8091服务均已关闭；09:09:55Z只读快照无匹配测试/无头浏览器/监听残留，空闲约20.92GiB。不终止无关进程、不保证未来无429。仅复用一个已结束的只读审查代理。

完整交接见 [`docs/BULL-RELEASE-HANDOFF.md`](docs/BULL-RELEASE-HANDOFF.md)，汇总为`evidence/current/bull/release-handoff-verification.json`。本轮未重跑牛/熊/虎/角色/整体视觉/状态/音频全部专用浏览器，也未重测外部公网；专用动画仍按上一轮各自时间解释。下一步继续补真正缺失的5类普通怪/虎先锋/3Boss动作并整理整体遮挡，公网仍单独待验，不能将本地候选通过当作上线。

## 前一步（2026-10-10）：普通野牛妖局内接入（历史记录）

以下保留当时“未打包”的范围；现已由上节补齐本地候选包验收。该阶段同名证据已备份到`work/release-backups/pre-bull-20261010T090309Z/evidence-current/`，不能用当前public报告冒充当时workspace结果。

本轮0次素材生成，复用此前已查重的PNG与32个实测裁切；共享注册表、串行图片/JSON加载、构建顺序、公共服务与发布脚本清单已补牛。引擎、renderer及虎/熊模块本轮未改；碰撞、伤害、移动、掉落、RNG与对象池规则不变。metadata已批准局内运行，不代表最终全局画面质量。

- 牛真实Edge于08:31:23Z启动、08:31:28Z结束PASS：正常UI后合法输入驱动约24.36游戏秒、484步加速生产模拟，自然绘制move8/attack8/hit4/death4、双朝向、暂停图像/时钟冻结及恢复；32姿态左右48px生产夹具另列。提交绘制不等于每帧无遮挡，接触攻击/受击仍可被英雄身体遮挡。
- 虎、熊、四角色动画、整体页面和状态提示真实浏览器均串行新跑PASS；本地正常网页报告标记08:38:43Z、目标`workspace-bull-runtime-20261010T082708Z`，三物种公开帧JSON、资源访问边界、调试关闭及9秒推进通过。7条404为刻意阻断探测；页面异常与请求失败0。该报告不是ZIP解压件或公网验证。
- 最终metadata/发布清单更新后，`npm test`于08:44:42Z新跑PASS：17机制+11虎+13熊+13牛+8状态及四角色600秒、正常输入、对象池、渲染、平台桩；三物种公开JSON等价/隐私专项通过。素材重新审计75份/71唯一SHA/4组解释副本，未改PNG。
- 未重跑音频、公网或微信实机；未重建/部署ZIP。之前证据备份在`work/bull-runtime-backup-20261010T082708Z/evidence-current/`，包括原熊妖ZIP解压网页报告，不把同名新文件当历史证据。

完整交接见 [`docs/BULL-RUNTIME-HANDOFF.md`](docs/BULL-RUNTIME-HANDOFF.md)，最终证据为`evidence/current/bull/runtime-verification.json`。本轮自建浏览器与8091本地服务已关闭；进程/内存快照见汇总，不保证未来不会429。下一步单独重建并验牛版本地候选包，或继续查重后补真正缺少的5类普通怪动作；全完成才上线的条件仍未满足。

## 前一步（2026-10-10）：普通野牛妖候选预检（历史记录）

以下保留当时的候选状态和测试时间，不是最新局内状态；同名证据更新前副本见上述备份，当前运行状态以上节为准。

查重确认缺少普通牛动作表后，内置imagegen生成1次并定向修正1次布局；只保留32姿态终稿，恢复预检没有再生成。1774×887、1,137,073 bytes，idle8/move8/attack8/hit4/death4，SHA与工具原图一致。原PNG未脚本重绘或重编码；特处士/待处士Boss不可共用。

单Edge独立预览08:14:57Z→08:15:07Z完成，PNG解码、不同像素、左右镜像、全姿态绘制覆盖通过；录制数据回读到1000×720、90个解码回调和90种抽样像素。左右48px图集及48/56/96px抽样已检查，但不是局内或最终流畅度验收。实测裁切每边外扩2px、150源像素统一比例，固定根点仍为provisional。

最新npm test于08:17:08Z完成PASS；库存75份媒体/71唯一SHA/4组解释副本。候选保持 `runtimeApproved:false`，未加入loader/serve/release，原熊妖版ZIP哈希未变。首次EPERM保留，授权重跑后自建浏览器已关闭；只读快照无本测试残留，可用内存约21.1GiB。没有重跑整体游戏网页、音频或公网，不复用旧PASS。

下一步复用牛候选做局内接入和真实运行验收；其余5类普通怪、虎先锋、3Boss仍缺动作素材。完整边界、失败、录像、prompt与备份见 [`docs/BULL-ANIMATION-HANDOFF.md`](docs/BULL-ANIMATION-HANDOFF.md)，汇总为 `evidence/current/bull/handoff-verification.json`。

## 前一步（2026-10-10）：熊妖版候选包验收

该阶段已重建网页/微信候选包，仅本地验包，不上线。网页43项、微信25项与当时内外清单、运行资源白名单和哈希一致；实际从ZIP解压后用单个真实Edge验证首页→选角→战斗、约9秒实时推进、虎/熊及四角色资源加载、禁止路径404、`?debug=1`仍关闭调试。当时`browser-public-smoke.json`目标是`archive-extracted-bear-20261010T052706Z`，已备份至`work/bull-runtime-backup-20261010T082708Z/evidence-current/`；当前同名文件是最新牛接入工作区报告，不是该ZIP报告。

验包发现熊妖原始帧JSON带本机生成来源；已用同一显式字段投影处理公共服务和发布包，只输出6个运行字段及受限嵌套数据，仓库原始追溯保留。专项Node验证帧完全等价、嵌套信息排除、幂等及坏数据拒绝；npm test重新通过。首次沙箱构建/浏览器启动失败单独保留，授权重跑通过，不改写失败记录。

旧ZIP及重跑前证据已保存在`work/release-backups/pre-bear-20261010T052706Z/`；仅重建生成目录，未删除素材。测试自建浏览器/服务已关闭；本轮0次图片生成、只复用一个只读复核代理。完整证据与恢复路径见[`docs/BEAR-RELEASE-HANDOFF.md`](docs/BEAR-RELEASE-HANDOFF.md)。

## 前一步（2026-10-10）：普通熊妖局内接入

本次0次素材生成，复用已查重的熊妖PNG/实测JSON。共享注册表贯穿出生身份、动画时钟、死亡、裁剪和绘制，保留虎妖API；视觉改动不改变碰撞、伤害、移动、掉落或RNG。

- `npm test`新跑PASS：17机制+11虎妖+13熊妖+8状态回归，四角色600秒、正常输入、对象池、渲染和平台桩。熊妖另验跨物种池复用、32裁切/64镜像、四边裁剪、128个血条包围及状态牌检查。
- `browser-bear-smoke`真实Edge PASS：正常UI后合法输入驱动加速生产更新，自然move8/attack8/hit4/death4、双朝向、暂停图像/时钟冻结与恢复；32姿态左右48px生产renderer夹具另行标注。截图未见明显脚底/裁切异常，不代表最终“完美动画”、手机FPS或公网。
- 虎妖、四角色动画、整体视觉和状态提示浏览器均串行新跑PASS；`browser-public-smoke`本次验证workspace本地入口及新增熊妖资源访问边界，不是现有ZIP或公网验收。当前库存仍74/70/4，原图未修改。
- 首次熊妖局内浏览器沙箱EPERM保留，授权单浏览器重跑后通过。PNG自身挂起时的队列watchdog仍是既有未解决边界；本次只为JSON等待提供10秒超时，不声称所有网络问题已解决。

详见 [`docs/BEAR-RUNTIME-HANDOFF.md`](docs/BEAR-RUNTIME-HANDOFF.md)。该接入阶段未重建下载包；已由上方候选包步骤补齐，但未部署。其余6类普通怪、虎先锋、3名Boss动作、英雄最终高帧质量、整体可读性与公网继续待做。

本轮最终证据汇总：[`evidence/current/bear/runtime-verification.json`](evidence/current/bear/runtime-verification.json)。自建测试浏览器与本地服务已关闭；汇总附只读进程/内存快照，不将本地PASS或旧ZIP当作公网/当前发布包验收。

## 此前步骤（2026-10-10）：普通熊妖独立素材预检

本次只完成熊妖素材预检与登记，没有修改运行时或发布allowlist。10月9日初稿攻击行相接，经一次内置布局编辑修正；10月10日恢复未完成的浏览器录像后，新运行完整结束，期间未再次生成图片。32个实测裁切、不同像素和左右镜像通过；136源像素统一比例，脚底锚点仍为provisional，不能据此批准生产动画。

- `node scripts/browser-bear-preflight.mjs`：2026-10-10T04:46:20Z真实Edge独立预览PASS，PNG解码、全姿态绘制覆盖、页面错误0；输出左右atlas、动作抽样和WebM。91次绘制不代表录像编码保留91帧；WebM未额外回读解码，不宣称流畅度、真实FPS、局内或公网通过。脚本自建浏览器已关闭。
- `node scripts/audit-actor-sheet.mjs` 与 `node scripts/audit-assets.mjs`：新跑PASS；当前74份媒体、70个唯一SHA、4组可解释重复，manifest无尺寸/bytes/hash差异。
- `npm test`：2026-10-10T04:57:07Z新跑PASS，17机制+11虎妖+8状态回归及四角色600秒、正常输入、对象池、渲染、平台桩通过；不是微信真机。
- 初稿REVIEW、启动EPERM、旧录制INCOMPLETE、新预检PASS分别保留。没有重跑整体游戏浏览器、音频、公网或构建发布包，不将10月9日结果算作今天新跑。

详见 [`docs/BEAR-ANIMATION-HANDOFF.md`](docs/BEAR-ANIMATION-HANDOFF.md)。该阶段尚缺熊妖接入，已由上方后续步骤完成；其余6类普通怪/虎先锋/3名Boss、英雄质量、整体可读性和公网仍未完成。

## 历史运行时验收（2026-10-09；当前同名浏览器证据已于10月10日重跑，见最新推进）

本次自动推进复用普通虎妖32姿态完成局内接入，没有生成新图。真实 Edge 正常UI进入后，以合法移动/升级输入运行加速生产模拟，实际绘制覆盖 move8/attack8/hit4/death4、双朝向、暂停冻结/恢复。32姿态48px渲染夹具单独标注，不冒充自然触发；素材预检也不替代局内验收。详见 [`docs/TIGER-ANIMATION-HANDOFF.md`](docs/TIGER-ANIMATION-HANDOFF.md)。

该轮完成状态提示修复；`slow=1`误报是密集“减速”牌的直接原因。新增8项Node回归及单Edge真实网页专项，正常UI后的240次生产更新与6组明确标注的390×844/360×640夹具通过；状态恢复、12牌上限、互相避让、玩家避让、暂停/重复绘制及虎妖头顶空间均有当时证据。详见 [`docs/STATUS-BADGE-HANDOFF.md`](docs/STATUS-BADGE-HANDOFF.md)。10月9日本地候选包已重建，但其余动作与公网仍未完成，因此没有上线。

本轮 v3 改动已完成重新验收，证据均写入 `evidence/current/`，没有复用 10 月 5 日旧 PASS：

- `npm test`：PASS；17 项原引擎回归 + 11 项虎妖回归 + 8 项状态回归、四角色 600 秒自然战斗、正常玩家输入、对象池、渲染和平台桩通过。虎妖覆盖身份隔离、32裁切/64镜像、攻击/受击/死亡、暂停、视野边界、伤害/RNG不变和池字段重置；Node/mock仍明确不是真机。
- `node scripts/browser-status-badge-smoke.mjs`：PASS；2026-10-09T12:04:50Z真实Edge，正常速度无误标、真实键盘暂停/恢复；两种尺寸的5状态/恢复/132敌人夹具分开记录，不冒充自然触发。证据 `evidence/current/status-badges/browser.json`、`node.json`；截图已检查，避让保证不包含其他敌人身体/血条、伤害数字或HUD区域。
- `node scripts/browser-tiger-smoke.mjs`：PASS；单个真实 Edge，生产模拟自然绘制move8/attack8/hit4/death4、左右朝向、暂停截图/时钟一致、恢复继续；32姿态左右48px渲染夹具通过，无页面/请求错误。证据 `evidence/current/tiger/browser-runtime.json`、`engine-runtime.json`；首次沙箱EPERM和首次移动末帧覆盖不足的失败报告保留，未改写为PASS。
- `node scripts/browser-animation-smoke.mjs`：PASS；真实 Edge 单窗口加载四张 1774×887、4×2 v3 表和 12 个技能/法宝图标，确认攻击/移动帧变化、暂停冻结、恢复继续、`authoredFrames + vector`、`mapAssetDraws === 0`，无页面错误。
- `node scripts/browser-visual-smoke.mjs`：PASS；真实 Edge 覆盖首页、选角、战斗、暂停、升级、Boss、结算和 390×844/360×640 移动尺寸；视觉夹具、自然伤害反馈、Boss 阵容和层级指标通过。
- `node scripts/browser-public-smoke.mjs`：PASS（本地发布包）；真实服务 `work/release-staging/web`，新增虎妖PNG/JSON/模块allowlist、路径隔离、首页→选角→战斗、9秒实时推进通过；即使 `?debug=1` 也保持调试关闭。刻意404为预期阻断，不算运行错误，不代表外部公网通过。
- `node scripts/browser-audio-smoke.mjs`：PASS；真实 Chromium `AudioContext` 分析器确认攻击、命中、受击、击杀、精英、Boss、拾取、冲刺、UI、暴击、胜负事件有音频峰值，静音和 dispose 生命周期通过。
- `node scripts/audit-assets.mjs`：PASS；新增虎妖后扫描 73 个素材、69 个唯一 SHA-256、4 组可解释重复，未发现需要重复生成的同用途资源。
- `npm run release`：PASS；已按当前 v3 资源重建网页与微信包，清单和 SHA-256 见 `dist/RELEASE-MANIFEST.json`。

以上均为本地真实浏览器/Node 证据，不等同于外部公网或微信真机验收。外部临时通道此前真实返回 502，继续保持 FAIL，不能用本地 PASS 替代。

## 历史验证（2026-10-05，仅供追溯）

以下是改动前的 2026-10-05 旧记录（仅供追溯，不是当前证据；旧地图 PNG 分层/旧帧裁切结论不再适用于当前 playable battle）：

- 旧 `npm test`：PASS；17 项引擎回归、四角色 600 秒自然战斗、正常玩家输入、对象池、渲染、微信 API 平台桩均通过。平台桩证据明确标记 `wx API simulation, not device`。
- 旧 `evidence/current/visual.json`：真实 Edge/Playwright，390×844 与 360×640；首页、选角、战斗、暂停、升级、Boss、结算和移动尺寸截图/指标 PASS。
- 旧 `evidence/current/animation/browser-animation-smoke.json`：真实 Edge 资源加载、4 个本命技能图标 + 8 个法宝图标、攻击/移动帧变化、暂停帧稳定、恢复后继续、双叉岭地图与分层绘制 PASS；该“分层绘制”结论已被当前 `vector`/`mapAssetDraws=0` 门槛取代。
- 旧 `evidence/current/audio.json`：真实 Chromium `AudioContext` 分析器，攻击/命中/受击/击杀/精英/Boss/拾取/冲刺/UI/胜负等事件均可听见，静音和 dispose 生命周期 PASS。
- 旧 `evidence/current/browser-public-smoke.json`：本地服务执行与公网同等正常流程、静态资源 allowlist、路径隔离、首页→选角→战斗、9 秒实时推进和动画变化 PASS；当时真实 Edge URL 为 `http://127.0.0.1:8089/`。
- 旧 `scripts/audit-assets.mjs` + `evidence/current/asset-dedup-audit.json`：历史扫描曾为68/64；当前扫描已更新为78个媒体、74个唯一SHA、4组解释副本，见10月10日鹿推进段。新增素材必须先过哈希、尺寸、用途和运行时引用去重检查。
- 外部 QUIC 通道在本轮真实 Edge 访问中返回 502（之前通道也出现 530/连接拒绝），失败原始记录保留在 `evidence/current/public/external-quic-fail-20261005T1951.json`。因此公网外部通道不宣称 PASS，归因是当前环境的临时隧道/传输限制，不是把本地 PASS 冒充公网 PASS。
- 旧验证摘要（当时写入 `evidence/current/validation.json`、`platform.json`）：`2026-10-05T13:02:36Z`，PASS；主包 2,418,455 bytes、可选素材 3,072,775 bytes。当前同名证据已由本轮重跑结果覆盖。

## 发布包（2026-10-10 牛版本地候选，未部署）

当前ZIP已包含牛PNG、精简运行帧JSON及牛模块；`dist/RELEASE-MANIFEST.json`描述以下新候选包，已核对当前运行源码并验证真实ZIP解压网页，未部署：

- [`dist/xiyou-survivor-web-v1.0.0.zip`](dist/xiyou-survivor-web-v1.0.0.zip)：12,591,435 bytes；SHA256 `9c9bd515b0e8dcb5c4d4101838f1ebc3679b0f425ab31685909503c9519ae097`。
- [`dist/xiyou-survivor-wechat-game-v1.0.0.zip`](dist/xiyou-survivor-wechat-game-v1.0.0.zip)：5,043,614 bytes；SHA256 `f017493aaf8eeebccc1ac040ded0397a8bfcc4f8d0cbee56e6be5b04e4dec4e2`。

发布包只包含当前运行资源与 `RELEASE-MANIFEST.json`，排除 `legacy-source`、历史证据、测试、生成脚本、密钥和本机账号配置；微信包中的 `touristappid` 仍是占位值。

当时包验收（网页46项/微信25项）见`evidence/current/bull/release-verification.json`；10月10日实际ZIP解压网页的目标为`archive-extracted-bull-20261010T090309Z`。同名`browser-public-smoke.json`后来已更新为八物种workspace证据，不能再把当前该文件视为牛版ZIP解压验收。微信核心此后由npm test更新，但两个ZIP未重建，图片仍向量回退，仍仅核心/结构与平台桩，不是实机；外部公网未重测。

## 仍延期/下一步

1. 取得稳定的公网托管或允许 QUIC/HTTP2 的网络通道后，重新运行 `scripts/browser-public-smoke.mjs`；在此之前保留外部 FAIL，不复用历史 PASS。
2. 普通虎/熊/牛/狼/猴/鹿/鹰/蛇32姿态均已完成本地技术接入，禁止重生成已有同用途素材；当前ZIP仍缺狼/猴/鹿/鹰/蛇。虎先锋和3Boss仍缺专属动作，英雄最终高帧及蛇最终造型/连续流畅度未批准。数字自身覆字与状态牌覆数字已作有限修复，身体/血条/数字/HUD整体可读性、接触攻击遮挡仍待验。下一轮只选一个缺口，见各物种handoff与`docs/FEEDBACK-OVERLAP-HANDOFF.md`。
3. 在微信开发者工具填入真实 AppID，检查分包/包体；在低端 Android/iOS 真机复测 FPS、内存、触摸安全区和资源解码。
4. 接入并验收登录、云存档、广告、分享统计、支付、审核发布等商用服务。

## 文档索引

- 原始聊天全量分析：[`docs/CHAT-HISTORY-ANALYSIS.md`](docs/CHAT-HISTORY-ANALYSIS.md)
- 状态牌与数字有限避让：[`docs/FEEDBACK-OVERLAP-HANDOFF.md`](docs/FEEDBACK-OVERLAP-HANDOFF.md)
- 普通苍狼局内运行：[`docs/WOLF-RUNTIME-HANDOFF.md`](docs/WOLF-RUNTIME-HANDOFF.md)；候选素材预检：[`docs/WOLF-ANIMATION-HANDOFF.md`](docs/WOLF-ANIMATION-HANDOFF.md)
- 最终报告：[`docs/FINAL-REPORT.md`](docs/FINAL-REPORT.md)
- 资源尺寸、来源和 SHA256：`prototype-2d/assets/manifest.json`、`prototype-2d/assets/README.md`
- 视觉、地图和动画验收边界：`docs/VISUAL-DIRECTION.md`
- 普通熊妖运行验收：[`docs/BEAR-RUNTIME-HANDOFF.md`](docs/BEAR-RUNTIME-HANDOFF.md)；前期素材预检：[`docs/BEAR-ANIMATION-HANDOFF.md`](docs/BEAR-ANIMATION-HANDOFF.md)
- 普通野牛候选包验收：[`docs/BULL-RELEASE-HANDOFF.md`](docs/BULL-RELEASE-HANDOFF.md)；局内运行：[`docs/BULL-RUNTIME-HANDOFF.md`](docs/BULL-RUNTIME-HANDOFF.md)；历史预检：[`docs/BULL-ANIMATION-HANDOFF.md`](docs/BULL-ANIMATION-HANDOFF.md)
- 性能约束：`docs/PERFORMANCE-RENDERER.md`
- 测试边界：`docs/TESTING.md`、`docs/REQUIREMENTS-ACCEPTANCE.md`
- 复制来源：`docs/COPY-PROVENANCE.md`
