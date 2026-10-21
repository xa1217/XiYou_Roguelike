# 微信平台与割草玩法第一方研究

研究日期：2026-10-04（Asia/Tokyo）。范围：本项目《西游·八十一难》的原生微信小游戏工程、Canvas 输入与生命周期、代码包发布约束，以及割草玩法的产品依据。

## 1. 结论与证据边界

本项目的主要微信交付形态应为原生**微信小游戏**：使用 `game.js` 入口、`game.json` 配置，以及 `project.config.json` 的 `compileType: "game"`。官方示例还可能将运行根目录命名为 `miniprogram/`；目录名字不会将小游戏变成小程序页面。依据是微信团队维护的 [小游戏 API 示例](https://github.com/wechat-miniprogram/minigame-demo)、[项目配置](https://github.com/wechat-miniprogram/minigame-demo/blob/master/project.config.json) 和 [快速启动模板](https://github.com/wechat-miniprogram/miniprogram-game-quickstart)。

这次成功读取了微信官方 GitHub 示例、官方 API 类型声明、官方 Canvas 引擎文档及官方 SDK 更新记录。微信开发者文档网站的部分页面在研究环境中返回不可抓取错误，因此没有将失败页面当成已读取证据。API 主证据固定到微信官方类型仓库提交 `4cae82af7f3c4339d1f11aea8e672fb16051d24a`（提交日期 2026-07-27），[固定版本源文件](https://github.com/wechat-miniprogram/minigame-api-typings/blob/4cae82af7f3c4339d1f11aea8e672fb16051d24a/types/wx/lib.wx.api.d.ts)。

“市场最火”没有统一的公开第一方全量实时榜单。本报告确认高认知度产品的玩法和近期第一方更新，不宣称本项目选择的是 2026 年中国微信小游戏营收或活跃人数第一名的模式。Habby 的 [Survivor.io 官方商店页](https://play.google.com/store/apps/details?hl=en_US&id=com.dxx.firenow) 在查询时显示 50M+ 累计下载、2026-09-08 更新；这些数据仅代表该商店范围，不能等同微信小游戏市场份额。

## 2. 原生工程与运行时

| 项目 | 第一方证据 | 本项目决策 |
| --- | --- | --- |
| 工程入口 | 官方 quickstart 的 [game.js](https://github.com/wechat-miniprogram/miniprogram-game-quickstart/blob/master/game.js) 导入适配器、主类后启动；[game.json](https://raw.githubusercontent.com/wechat-miniprogram/miniprogram-game-quickstart/master/game.json) 指定屏幕方向 | 单一游戏入口初始化平台适配器、Canvas、输入、保存、音频及主循环 |
| 开发者工具类型 | 官方 demo 的 [project.config.json](https://github.com/wechat-miniprogram/minigame-demo/blob/master/project.config.json) 为 game 编译类型 | 交付独立 `wechat-minigame/` 工程，使用真实小游戏 AppID 填写配置 |
| 首个画布 | 官方 [wx.createCanvas 声明](https://github.com/wechat-miniprogram/minigame-api-typings/blob/4cae82af7f3c4339d1f11aea8e672fb16051d24a/types/wx/lib.wx.api.d.ts#L15015) 说明首次为屏幕画布，后续为离屏画布 | 主画布只创建一次；静态背景缓存采用后续创建的离屏画布 |
| 帧循环 | 官方 [requestAnimationFrame / cancelAnimationFrame 声明](https://github.com/wechat-miniprogram/minigame-api-typings/blob/4cae82af7f3c4339d1f11aea8e672fb16051d24a/types/wx/lib.wx.api.d.ts#L24028) 是全局接口 | 平台层使用全局帧接口；销毁和后台状态取消已排队帧 |
| 渲染与业务 | 官方 [Canvas Layout 平台适配文档](https://wechat-miniprogram.github.io/minigame-canvas-engine/tutorial/platform.html) 将设备尺寸、像素比、画布和输入封装为环境方法 | 模拟和 renderer 无 DOM、wx、Audio 依赖；小游戏入口负责平台差异 |

小程序的 `Page/WXML/WXSS` 页面工程可以作为其他产品形态，但不能代替上述小游戏原生入口。当前独立副本的旧页面实现保留作参考；正式小游戏运行工程由平台适配层承载。

## 3. 生命周期、尺寸、安全区与触摸

### 3.1 生命周期

官方类型声明列出 [wx.onHide / offHide](https://github.com/wechat-miniprogram/minigame-api-typings/blob/4cae82af7f3c4339d1f11aea8e672fb16051d24a/types/wx/lib.wx.api.d.ts#L19032) 和 [wx.onShow / offShow](https://github.com/wechat-miniprogram/minigame-api-typings/blob/4cae82af7f3c4339d1f11aea8e672fb16051d24a/types/wx/lib.wx.api.d.ts#L19343)。对应官方文档的正确路径含 `/base/app/life-cycle/`。

工程实现选择：进入后台时暂停模拟、停止音频和帧循环、清除摇杆/按键输入、保存进度；回到前台后重置帧时间戳并显示继续操作。不能把切到微信聊天或锁屏期间的墙钟差值灌入 10 分钟战斗。用户手动暂停、升级选择与背景暂停保持独立原因，避免关闭升级菜单时错误解除后台暂停。销毁时用原监听函数解除监听，避免重复进入界面累积回调。这些是依据官方生命周期设计的本项目实现要求，官方并未规定必须使用本项目这套状态机。

### 3.2 窗口与安全区

官方 [wx.getWindowInfo](https://github.com/wechat-miniprogram/minigame-api-typings/blob/4cae82af7f3c4339d1f11aea8e672fb16051d24a/types/wx/lib.wx.api.d.ts#L14982) 从基础库 2.25.3 提供窗口信息；声明中包含逻辑窗口宽高、pixelRatio、screenTop 和 safeArea。官方 [WindowInfo 定义](https://github.com/wechat-miniprogram/minigame-api-typings/blob/4cae82af7f3c4339d1f11aea8e672fb16051d24a/types/wx/lib.wx.api.d.ts) 说明部分机型可能不返回 safeArea，需要自行兼容。

工程实现选择：

- 优先能力检测 `wx.getWindowInfo`；兼容路径读 `wx.getSystemInfoSync`，即使异常或空对象也提供合理默认尺寸。
- 游戏逻辑和触摸统一使用逻辑像素；Canvas backing store 乘 DPR，绘制坐标只缩放一次。
- 顶部信息、暂停、升级选择和结算按钮放在安全区内；底部摇杆与闪避按钮避开系统手势区。
- 安全区缺失时退回完整逻辑窗口，不假设固定刘海高度。
- 窗口变化后同步刷新 Canvas、UI 命中区和摇杆位置；竖屏作为本项目默认方向。
- 为功耗与内存控制可在项目层限制有效 DPR；该限制是工程选择，不能声称为微信官方强制上限。

### 3.3 触摸

官方 [触摸监听](https://github.com/wechat-miniprogram/minigame-api-typings/blob/4cae82af7f3c4339d1f11aea8e672fb16051d24a/types/wx/lib.wx.api.d.ts#L19386) 和 [Layout 平台适配](https://wechat-miniprogram.github.io/minigame-canvas-engine/tutorial/platform.html) 包括 onTouchStart、onTouchMove、onTouchEnd、onTouchCancel 与对应 off 方法。官方声明说明 Windows/Mac 上触摸事件可能由鼠标事件转换。

工程实现选择：移动使用浮动或固定虚拟摇杆并锁定触点 identifier；第二触点可点击闪避，不能夺走移动触点。TouchEnd 与 TouchCancel 均归零移动，后台切换也归零。命中检测使用 clientX/clientY 对应逻辑坐标，统一经过一次画布布局变换。开发者工具鼠标可验证操作流程，但不能替代真机多指、滑出画布、微信菜单弹出和系统手势测试。

## 4. 包体、资源与发布

旧网络文章常混用小程序和小游戏的包体数值。此次直接可读取的第一方新证据是官方 [Unity/团结 SDK CHANGELOG](https://github.com/wechat-miniprogram/minigame-tuanjie-transform-sdk/blob/main/CHANGELOG.md)：2024-12-18 条目记录“首资源包放小游戏分包时，总大小调整为 30MB”。这能确认该 SDK 场景发生过扩容，**不能据此推导所有账号、所有原生小游戏、所有分包类型当前都享有同一上传上限**。

由于 [原生分包指南](https://developers.weixin.qq.com/minigame/dev/guide/base-ability/subpackages.html) 在本环境无法读取，本报告不把旧 4MB / 20MB 数字写成已经核实的 2026 年统一硬性规则。实际账号配额和上传检查须以开发者工具及微信公众平台当前结果为准。

本项目采用可执行的保守策略：运行代码和必需音频优先留在首包，目标首包小于 1.5MB；大型角色卡面与展示预览保留在资源目录，可经排除规则、分包或后续远程资源方案管理。**1.5MB 是本项目启动性能预算，并非平台容量承诺。** 当前内置 imagegen 四角色原图为 3,072,734 bytes，不能在未测量总包时自动塞入首包。

微信官方 [miniprogram-ci](https://github.com/wechat-miniprogram/miniprogram-ci-dist) 提供编译结果、代码依赖分析和包体信息，上传/预览需要管理员配置上传密钥及 IP 白名单。正式发布阶段应记录主包/分包实际大小、AppID、基础库范围、iOS/Android 真机结果；当前没有替用户创建平台资质或声称已审核上线。

## 5. 第一方割草玩法依据与补齐设计

| 第一方产品材料 | 已确认玩法 | 对本项目的采用方式 |
| --- | --- | --- |
| Habby [Survivor.io 官方产品介绍](https://play.google.com/store/apps/details?hl=en_US&id=com.dxx.firenow) | 单手控制、密集妖群式敌潮、roguelite 技能组合、不同关卡难度 | 自动攻击 + 单手移动 + 每级三选一；以明确危险预兆和大量消灭反馈形成核心节奏 |
| 国内 [弹壳特攻队官方商店介绍](https://apps.apple.com/cn/app/id1628270358) | 求生、割草、随机技能叠加组合，持续章节更新 | 保留用户既定 10 分钟 / 81 难框架；每局只有本命武器 + 四件法宝，控制手机端决策量 |
| poncle [Adventures FAQ](https://poncle.games/adventures-faq) | 独立章节叙事、重组角色/物品、指定存活或击杀条件、金币回流主游戏 | 81 难采用各自地点与主题首领；每日目标和局外功德天赋让一次失败仍有可读进度 |
| poncle [Local Co-Op FAQ](https://poncle.games/coop-faq) | 合作不作为强制内容解锁条件 | 当前以完整单人体验交付；联机仅作为未来功能，不阻塞单人 81 难路线 |

上述资料说明的是产品机制，不代表复制竞品数值、广告策略、美术或商业结果。本项目的四角色技能间隔、五级武器、三选一、技能槽、精英/BOSS 时间与 10 分钟时长来自用户需求及本项目设计，不能归因到未核实的竞品细节。

本项目自行补齐的可落地设计：

1. **局内闭环**：移动避敌 → 自动攻击 → 拾取经验 → 升级三选一 → 武器/法宝构筑 → 精英与首领 → 结算。升级冻结敌人和战斗时钟；保留排队升级，经验不会被吞掉。
2. **八件法宝**：紫金葫芦、芭蕉扇、金刚琢、九龙神火罩、宝莲灯、捆仙绳、月光宝盒、三昧真火。分别覆盖聚怪爆破、前向击退、回旋控制、环形火场、治疗、束缚、脱围、范围灼烧；每件五级。
3. **构筑边界**：固定一件角色武器，最多四件法宝；优先提供武器升级和两件法宝候选，满级后提供精通增益。治疗不是无限叠加逃课，首领必须真正击败。
4. **持续进度**：功德金币、天赋树、章节解锁、每日目标、首次通关奖励、可重试挑战。奖励只在真实结算后入账，避免重开重复领取。
5. **公平交互**：暂停、音量、质量等级、触摸容错、失败重试和明确奖励说明。可选激励视频的复活/奖励入口只有真实平台配置后才出现，不显示虚假“观看广告成功”。
6. **性能取舍**：普通敌人硬上限、项目与特效硬上限、画面外绘制裁剪、静态地图缓存；视觉密度通过刷怪波次、击杀粒子和地图移动营造。没有把竞品“1000+同屏”宣传当成本项目必须保持的对象数。
7. **原创内容**：原著公共领域人物与地点重新设计；现代作品仅用作机制理解，未拷贝它们的动画、截图、音频或角色服装。

商业化的“可商用”应拆为当前原创资产与运行工程、发布账号与审核、真实广告及后端、防作弊与结算监控四层。本仓库交付不能替代实际账号审核、版号/资质判断和真机发布验收；这些由发布方按照具体经营方式完成。

## 6. 原创素材与技能执行记录

### asset-gen

已读取 `C:/Users/wangxr/.codex/skills/asset-gen/SKILL.md` 并检查 `tools/asset_gen.py`。只检查凭据存在布尔值，未输出任何值。XAI_API_KEY、GEMINI_API_KEY、GOOGLE_API_KEY、TRIPO_API_KEY、TRIPO_API_TOKEN 均未设置；requests、xai_sdk、google.genai 模块均缺失。`asset_gen.py --help` 实際运行因缺少 requests 而失败，未提交付费任务、未产生外部 API 成功素材。

### 内置 imagegen fallback

已读取 imagegen 技能并使用内置 `image_gen.imagegen` 成功生成一张原创四角色卡面合图，复制到 `prototype-2d/assets/hero-cards-v1.png`。生成图包含完整孙悟空、唐三藏、猪八戒、沙悟净及各自武器，暖金、朱砂、墨色、云纹背景，无文字、logo、水印。已目视检查四面板构图与角色辨识。该素材定位为角色选择/宣传卡面；战斗仍使用确定性 Canvas 原创绘制，卡面不是战斗动画帧。

SVG 预览图集与图标为原创代码绘制，和 renderer 的线条、配色一致；资产尺寸、来源、sourceRect、用途与生成 prompt 由 `prototype-2d/assets/manifest.json`、`README.md` 记录。

## 7. 建议交付验收记录

| 验收项 | 需要记录的证据 |
| --- | --- |
| 原生工程 | `game.js/game.json/project.config.json` 可导入，编译类型为 game |
| 前后台 | 20 次切换无重复帧循环、无被动时间推进、无卡住摇杆 |
| 尺寸输入 | iOS/Android、刘海/非刘海、DPR 1–3、双指闪避、touchcancel |
| 完整战斗 | 四角色五级武器、四法宝上限、三选一、精英120/240/360/480秒、BOSS300/570秒 |
| 结算存档 | 胜负正确、首领结束条件、首次奖励不可重复、异常存档恢复 |
| 性能 | 10 分钟及延时首领战的帧耗时、内存峰值和对象硬上限 |
| 包体 | 首包/分包实际字节数与真实账号上传检查 |
| 发布 | 真实 AppID、隐私文档、真实广告标识、真机与审核结果 |

本研究是根代理实现和最终报告的依据；表中未出现已通过的具体证据时，不代表该项已经验收。

