# 当前验证入口

- npm test：语法/JSON/WAV/包体、公开帧契约最小字段/嵌套排除/帧等价回归、17项原机制回归、11项虎妖、13项熊妖与8项状态专用回归、四条600秒生产步长模拟、渲染有限坐标/清理、平台生命周期和存档。
- scripts/verify-release.ps1：核对两个ZIP与内外manifest、serve显式白名单、当前源文件和staging内容，检查debug关闭、占位AppID与本机来源/密钥标记；通过后解压到全新work/release-validation子目录，不覆盖现存目录。重复运行需用-ExtractDirectory指定新的子目录。
- node scripts/browser-public-smoke.mjs：对XIYOU_URL执行真实Edge正常UI流程、约9秒实时推进、资源加载/精确帧JSON字段与路径隔离；XIYOU_BUILD必须区分workspace/实际ZIP解压件/公网。实际ZIP验收服务须设SERVE_ROOT为解压目录并设SERVE_PUBLIC=1，不能当外部公网PASS。
- node scripts/browser-bear-smoke.mjs：真实Edge正常UI后合法输入驱动加速生产更新，自然move8/attack8/hit4/death4、双朝向、暂停/恢复；32姿态48px生产renderer夹具独立标注。有限evaluate/清理超时、checkpoint及失败报告，证据evidence/current/bear/browser-runtime.json；不生成图片，不代表公网/微信实机。详见docs/BEAR-RUNTIME-HANDOFF.md。
- node scripts/audit-actor-sheet.mjs：默认只读核对普通熊妖PNG的alpha>8边界、32独立块、尺寸和SHA，输出evidence/current/bear/asset-preflight.json；不改像素、不批准局内使用。
- node scripts/browser-bear-preflight.mjs：单个真实Edge独立素材预览；检查PNG解码、逐姿态不同像素、镜像、有限91次绘制覆盖，输出左右atlas、动作抽样和WebM。录像仅检查文件输出，没有回读解码；不是生产游戏、流畅度或实时FPS验收。evaluate、采集循环、收尾与关闭均有限超时，阶段checkpoint与失败单独保留。该预检当时契约为approvedForRuntime:false，后续由运行验收批准；详见docs/BEAR-ANIMATION-HANDOFF.md及docs/BEAR-RUNTIME-HANDOFF.md。
- node scripts/audit-assets.mjs：当前媒体哈希去重与manifest尺寸/bytes/hash核验。2026-10-10熊妖登记后实测74个文件、70个唯一SHA、4组可解释重复。
- node scripts/browser-status-badge-smoke.mjs：单个真实Edge；正常UI进入后的生产更新验证无误减速、键盘暂停/恢复。独立390×844/360×640状态/恢复/132敌人夹具验证12牌上限、互相及玩家避让、虎妖血条间距和重复绘制稳定，不算自然触发。证据evidence/current/status-badges/browser.json；Node真实rope减速生命周期见同目录node.json。失败保留browser-fail-*.json，脚本finally关闭浏览器；整体遮挡范围见docs/STATUS-BADGE-HANDOFF.md。
- node scripts/browser-tiger-smoke.mjs：单个真实Edge；正常UI进入后，用合法移动/升级输入加速生产模拟，收集自然触发的move8/attack8/hit4/death4和左右向，验证暂停冻结/恢复。独立32姿态48px渲染夹具不算自然触发。证据见evidence/current/tiger/browser-runtime.json；首次沙箱启动失败与覆盖不足的失败报告单独保留，不重标PASS。
- npm run serve：仅托管prototype-2d游戏静态资源；打开localhost8088。
- docs/prototypes/THROWAWAY-rules.html：内存规则演示，不是发布入口。
- evidence/current/：本轮实际证据。Node全局模拟不能替代600秒真人试玩；平台桩不能替代微信工具和设备。

2026-10-10熊妖接入阶段已新跑熊/虎真实局内动画、角色动画、状态提示、整体视觉和workspace本地网页；最新候选包阶段另行新跑npm test、公开帧契约专项、ZIP内容核对及实际ZIP解压件的真实Edge正常流程，不冒充重新运行全部动画专项。音频及外部公网未重跑；包验收详见docs/BEAR-RELEASE-HANDOFF.md，未部署。
