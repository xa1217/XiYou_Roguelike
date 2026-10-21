# 原创游戏素材

本目录包含内置 imagegen 生成的高饱和漫画卡面、四张多帧角色表、八张普通敌人32姿态战斗表，以及确定性代码原创绘制的角色、场景、法宝、技能、妖怪 SVG。网页选角使用 `hero-cards-v2-comic.png`；局内战斗只把 `hero-*-battle-v3-sheet.png` 作为角色动作源，四张表均为独立的 4×2 透明帧格（不等于最终高帧质量已批准）。精美卡面、旧单姿态 PNG 和手绘地图 PNG/SVG 仅用于选角、图鉴、章节预览或追溯，不会被当作局内静帧。

## 来源与技能执行

- **asset-gen**：已读取技能、检查工具并实际执行 `asset_gen.py --help`。缺少 requests、xai_sdk、google.genai；XAI/GEMINI/GOOGLE/TRIPO 凭据均不存在，外部 API 未提交任务、未成功调用、未计费。
- **内置 imagegen fallback**：成功调用 `image_gen.imagegen`，生成原创四角色卡面和 v3 多帧战斗表，已复制进本项目。完整 prompt、文件 SHA256、尺寸、帧合同和执行记录见 [manifest.json](manifest.json)。
- **SVG**：本项目新编写的矢量代码，零外部资产、零 AI bitmap；生成脚本 [generate-art-assets.mjs](generate-art-assets.mjs)。SVG中的字体声明使用系统字体，不附带第三方字体文件。
- **PNG 预览**：原 SVG 的确定性栅格化，用于检查和分享；没有更改 AI 卡面的内容。

## 资产清单

| 素材 | 文件 | 源尺寸 | In-game Size | 用途 | 费用/来源 |
| --- | --- | --- | --- | --- | --- |
| 四角色卡面 | hero-cards-v1.png | 1915×821 px，RGB，3,072,734 bytes | 单卡约160×274 px；合图640×274 px | 角色选择/宣传；四面板 sourceRect 见 manifest | 内置 imagegen；工具未报告费用 |
| 四角色漫画卡面（当前主入口） | hero-cards-v2-comic.png | 1870×841 px，RGB，3,016,136 bytes | 单卡约160×274 px；四等分裁切 | 角色选择主卡；高饱和蓝红黄绿、粗黑漫画轮廓、赛璐璐高光、速度线/贴纸 | 内置 imagegen；用户参考图仅用于抽象风格方向 |
| 四名角色局内多帧战斗表 | hero-wukong/tangseng/bajie/wujing-battle-v3-sheet.png | 各1774×887 px，RGBA，4×2 帧格 | 每格约443.5×443.5 px；按角色半径缩放 | 局内真实 idle/move/attack/hit/stun/dash/intro/death 帧；renderer 按状态裁切并镜像 | 内置 imagegen；透明底；当前运行资源 |
| 首关普通虎妖动作表 | enemy-tiger-battle-v1-sheet.png | 1774×887 px，1,166,282 bytes | 130源像素统一比例；普通体高48世界像素 | 32独立姿态；只用于stage1+normal+tiger | 内置imagegen；已接入局内 |
| 首关普通熊妖动作表 | enemy-bear-battle-v1-sheet.png | 1774×887 px，978099 bytes | 136源像素统一比例；体高48世界像素 | 32独立姿态；stage1+normal+bear，不用于熊山君 | 内置imagegen原图复用；已进入10月10日本地候选ZIP，未上线 |
| 首关普通野牛妖动作表 | enemy-bull-battle-v1-sheet.png | 1774×887 px，1137073 bytes | 150源像素统一比例；普通体高48世界像素 | 32独立姿态；仅stage1+normal+bull，不用于特处士/待处士 | 内置imagegen原图复用；已入10月10日本地候选ZIP并验实际解压网页，未上线 |
| 首关普通苍狼妖动作表 | enemy-wolf-battle-v1-sheet.png | 1774×887 px，1410175 bytes | 170源像素统一比例；普通体高48世界像素 | 32独立姿态；仅stage1+normal+wolf，不用于凌虚子/奎木狼 | 内置imagegen原图复用；已接入本地网页，未上线 |
| 首关普通猴妖动作表 | enemy-monkey-battle-v1-sheet.png | 1774×887 px，1379382 bytes | 165源像素统一比例；普通体高48世界像素 | 32独立姿态；仅stage1+normal+monkey，不用于精英/Boss | 内置imagegen；已接入本地网页，未上线 |
| 首关普通鹿妖动作表 | enemy-deer-battle-v1-sheet.png | 1774×887 px，1894732 bytes | 205源像素统一比例；普通体高48世界像素 | 32独立姿态；仅stage1+normal+deer，不用于精英/Boss；idle-7源朝向由模块归一 | 内置imagegen；已接入本地网页，未上线 |
| 首关普通鹰妖动作表 | enemy-hawk-battle-v1-sheet.png | 1774×887 px，1776852 bytes | 180源像素统一比例；普通体高48世界像素 | 32独立姿态；仅stage1+normal+hawk，不用于精英/Boss | 内置imagegen；已接入本地网页，未上线 |
| 首关普通蛇妖动作表 | enemy-snake-battle-v3-sheet.png | 1774×887 px，1749032 bytes | 170源像素统一比例；基准体高48世界像素 | 32独立姿态；仅stage1+normal+snake；idle4源朝向归一 | 复用通过预检的v3；已本地技术接入，最终造型/流畅度未批准，未上线 |
| 历史角色战斗图集 | hero-battle-v2-atlas.png；`hero-tangseng-kr-v1.png` | 2087×753；1312×1199 px | 仅历史/图鉴预览 | 旧单姿态资源，保留作 provenance，不进入当前局内启动 | 内置 imagegen；已从 playable battle 退役 |
| 妖怪/Boss 战斗资源 | enemy-creature/brute/bird/spider/boss.svg；`enemy-boss-kr-v1.png` | SVG 为128—220 px；Boss PNG 为1374×1145 px | 当前局内使用 SVG/Canvas 向量绘制与回退 | 普通、精英、飞行、蛛蝎、Boss 轮廓；高质量 Boss PNG 仅历史/图鉴 | SVG代码原创；PNG 内置 imagegen；旧 PNG 不在启动路径 |
| 六主题预览 | theme-forest/sand/snow/fire/water/temple.svg | 各480×240 px | 240×120 px | 关卡场景预览 | 代码原创 |
| 四个本命技能图标 | weapon-skill-*.svg | 各128×128 px | 28×28 px HUD；40×40 px 升级卡 | 本命武器 HUD/升级卡 | 代码原创；与角色全身图用途不同 |
| 八件法宝 | artifact-*.svg | 各128×128 px | 48×48 px | 图鉴/升级UI | 代码原创 |
| 完整图集 | xiyou-art-preview.svg | 1500×1410 px | 不需运行时打包 | 设计交付预览 | 代码原创 |
| 图集PNG | xiyou-art-preview.png | 1500×1410 px | 不需运行时打包 | 便捷图片查看 | SVG栅格化 |

## 局内动画与地图边界

1. `hero-*-battle-v3-sheet.png` 是局内唯一的角色位图动画源。每张表为 4×2、8 个独立动作格，pivot 为 `(0.5, 0.88)`；状态序列和 fps 见 [manifest.json](manifest.json)。左右移动由 renderer 对真实帧做镜像，缺图时才使用同状态的确定性向量角色，不把一张精美立绘裁边、缩放或平移冒充动画。
2. 局内地图使用 `renderer.js` 的 `battleSceneMode: "vector"`：双叉岭的山脊、中央通道、路径和少量固定地标由 Canvas 每帧绘制，保持角色、敌人、投射物和反馈的层级清晰。`renderer.mapAssetDraws === 0` 是预期值，表示没有绘制精美地图 PNG/SVG；并不表示没有地图。
3. `map-*.png`、`theme-*.svg` 和 `map-doublefork-high-ridge-v1.png` 仍可用于章节预览、图鉴和追溯，但不应重新接回 playable battle 的 back/mid/front 洗层。

## 集成边界

1. 卡面为带宣纸背景的整图，非透明战斗精灵、非帧动画；四面板均分 sourceRect 只用于选角/宣传，不得用在局内。
2. 不将约3.07MB原图自动放进主包；先进行离线压缩或分包，并以真实开发者工具检查结果确认包体。
3. SVG 当前是原始设计资源；微信原生 Canvas 不应直接假设支持 SVG 图片。局内已保留 Canvas 向量绘制回退，章节预览若要显示 SVG，先离线导出 PNG 或经过平台验证。
4. 商业发布的账号、审核、实际广告与后端由发布工程配置；本目录不声称已完成平台审核。

## 重建

```powershell
node prototype-2d/assets/generate-art-assets.mjs
```

脚本重建 22 张 SVG 与预览 SVG，保持现有 AI 卡面和 v3 战斗表原图。完整 prompt、SHA256 与帧 metadata 用于保留素材来源记录；不要以脚本重建旧单姿态战斗 PNG。



## 手绘地图预览资源（不进入局内战斗）

- `map-temple-qv1.png`：1024×683、1,448,511 bytes，寺院/山谷主题后景，SHA256 `1D7627C6153E2583842821CA5B2FA9C36027A85FE2B888F440E4E1C58F067EF9`。
- `map-forest-qv1.png`：1024×683、1,365,938 bytes，森林调色后景，SHA256 `2944C17B771AD04A2C0205722F72DF6A6126BAE5F6EBF2E3AAC1B1485BB50F23`。
- `map-forest-qv1.png`、`map-temple-qv1.png` 是森林/寺院章节预览后景；当前 `native-app.js` 的 playable battle 不加载 back PNG 或 mid/front SVG，`renderer.js` 使用安静的确定性向量场景。
- 图片由内置 imagegen 生成的原创山寺地图缩放/调色得到；未复制《王国保卫战》的角色、Logo、塔、敌人或构图。

## 普通与精英妖怪战斗精灵

- `enemy-creature-kr-v1.png`：1254×1254 px，原创内置 imagegen 透明精灵，历史普通妖怪预览，SHA256 `5EB03BE680A6E4A7B8ABA3B53695D7EB22C2C5F19C1A31A710C711743BA8D102`。
- `enemy-brute-kr-v1.png`：1254×1254 px，原创内置 imagegen 透明精灵，历史精英妖怪预览，SHA256 `99471FED9880D0328CF6438DF1157BC3E6FD5B07A3E4123DEE17481BFE3FDF8D`。
- 上述旧 PNG 仍保留作历史/图鉴和去重审计，不在局内启动时加载。四角色使用 v3 动作表，首关普通虎/熊/牛/狼/猴/鹿/鹰/蛇使用下述32姿态表；尚缺专属动作的精英与 Boss 保留向量 rig 回退。

## 双叉岭高峻山体后景（首关）

- `map-doublefork-high-ridge-v1.png`：**941×1672 px**、**2,968,219 bytes**，SHA256 `3B2B15606E6548F128123201FAA782E6AF625F0BE4F22F8FAEDC5D94C5980BF8`。该文件是首关双叉岭高峻山体候选图的固定副本；`map-doublefork-v4-high-ridge-candidate.png` 与它字节一致，候选文件保留用于追溯，当前不在 playable battle 启动路径。
- 当前 `prototype-2d/native-app.js` 不为 `doublefork` 加载该 PNG，也不把 `theme-forest.svg` 作为 mid/front 洗层；`renderer.js` 以 `battleSceneMode: "vector"` 绘制相同山脊与道路几何，避免静态精美插图和随机贴花堆叠遮挡战斗。
- 该后景对应的可通行几何由引擎固定记录：世界 1800×1800；山脊矩形 `x=0,y=700,width=1800,height=400`；中央小径 `x=790,y=700,width=220,height=400`（即 `x=790..1010`）。上、下战斗区只能通过中央小径穿越，玩家、闪避、敌人寻路和刷怪点共用 `isWalkable` 判断。
- 资源尺寸、SHA256 和碰撞几何仍记录在 [manifest.json](manifest.json) 以便追溯；当前浏览器验收应断言 `battleSceneMode === "vector"` 且 `renderer.mapAssetDraws === 0`。这验证的是“局内没有误加载精美地图”，不等价于微信真机 GPU FPS，真机仍需在开发者工具与低端设备上复测。

## 去重规则

生成新素材前先比较现有 SHA-256、尺寸、用途、构图和运行时引用。旧单姿态角色 PNG、旧地图 PNG 和重复候选文件不应被再次生成或改名复制；只有真正缺少的动作状态、敌人或特效，才可新增独立素材并登记到 `manifest.json`。

## 2026-10-11：普通蛇v3已完成本地技术接入

`enemy-snake-battle-v3-sheet.png` 是本轮复用的已预检候选，SHA256 `c10c9f951f871e0f398cef9a7ef36c46065df4fb986ed2d0bb8b246da11b0ec2`，原字节未改。此前v1跨行粘连、v2最小水平间隔5px未达6px门槛，失败稿只在 `evidence/current/snake/`，不加载/公开/发布。尺寸、hash、失败原因、v3提示词和来源在manifest中；不重复生成已有同用途合格素材。

32姿态 idle8/move8/attack8/hit4/death4 使用实测alpha矩形+2px，固定列根点/行基线、170源像素统一比例，不能均分或逐帧吸底；idle index4的左朝向由模块归一。只绑定stage1+normal+snake，精英/Boss和其他关卡仍用向量回退。

12项Node与真实Edge局内技术验收通过：合法输入加速生产模拟覆盖移动/攻击/受击/死亡、双向、暂停恢复，四类自然状态截图与左右32姿态夹具分别留存；idle自然覆盖为空。图片为小型角鳞人形妖怪，蛇类最终辨识和连续流畅度未批准；近身截图存在遮挡，draw调用/不同像素不等于最终视觉通过。详见 `docs/SNAKE-RUNTIME-HANDOFF.md`，`runtimeApproved`仅表示本地技术接入，当前ZIP、公网和微信实机均未验。

## 2026-10-09：普通虎妖32姿态已接入局内

`enemy-tiger-battle-v1-sheet.png` 为内置 imagegen 新增的普通虎妖动作表，1774×887、1,166,282 bytes；SHA256 为 `b1acb7e65f23b79a33397163e0dc2a51942a0899aa3916c943f695406a307389`。它补齐此前缺失的虎妖动作，不替换或重做四角色表。初稿串格后通过一次内置编辑修正留白，源 PNG 不作脚本重绘。

32 个独立姿态为 idle8/move8/attack8/hit4/death4，alpha 检查与真实 Edge 的 48px 逐姿态预览通过。它不是严格等距网格，必须使用 `enemy-tiger-battle-v1-frames.json` 的实测矩形，不能均分图片，也不能把不同姿态拉伸成同一个方框。

当前已标为 runtimeApproved，并进入网页串行加载和发布 allowlist。仅匹配首关普通虎妖，不匹配虎先锋或寅将军。普通怪 radius15 对应48世界像素体高，以130源像素为统一比例并固定脚底锚点，不叠加摇摆或缩放。攻击8帧/受击4帧使用独立视觉计时，不改变碰撞、移动、伤害与随机数；死亡保留朝向/体型，0→3单次播放，0.42秒后回收。

`evidence/current/tiger/browser-runtime.json` 是本次实际游戏 Edge 验收：正常UI进入，合法移动/升级输入驱动的加速生产模拟中实测移动8帧、攻击8帧、受击4帧、死亡4帧、左右朝向和暂停恢复；32姿态48px渲染夹具另行标注，不冒充自然游戏。`engine-runtime.json` 为Node回归，不冒充GPU/微信实机。新增接入没有生成或重编码图片，原PNG SHA不变。

生成与修正版 prompt 保存在 `prompts/enemy-tiger-battle-v1-sheet.txt` 和 `prompts/enemy-tiger-battle-v1-layout-edit.txt`；证据为 `evidence/current/tiger/asset-preflight.json` 与 `browser-preflight.json`。

## 2026-10-10：普通熊妖32姿态预检（接入前记录）

`enemy-bear-battle-v1-sheet.png` 为查重后补齐的普通熊妖动作表，SHA256 `49cf7d76bc03808b7a7b8d0ec07e4c0fdd21876d4524a14d26b8ca1207b2571f`。10月9日初稿攻击行相接，经一次内置布局编辑后原样保留终稿；10月10日恢复预检没有再生成。两份prompt和来源已登记manifest。

32姿态为idle8/move8/attack8/hit4/death4；PNG使用 `enemy-bear-battle-v1-frames.json` 的实测矩形，不可等距均分或逐帧拉伸。契约的预览锚点仍是provisional，局内脚底和状态衔接待验。真实Edge独立预检确认PNG解码、五状态不同像素和91次绘制覆盖，输出左右atlas及独立录像；未额外回读解码WebM，也未证明流畅度或真实游戏性能。

该预检阶段manifest为 `runtimeApproved:false`、帧契约为 `approvedForRuntime:false`，当时不进入loader/serve/release；随后已按下节完成接入。不能替代熊山君，禁止再次生成同用途素材。生成前审计、初稿REVIEW、EPERM、旧录制INCOMPLETE和新PASS均分别保留。完整阶段边界见 [BEAR-ANIMATION-HANDOFF.md](../../docs/BEAR-ANIMATION-HANDOFF.md)。媒体库存74份、70个唯一SHA、4组可解释重复。

## 2026-10-10：普通熊妖已接入局内

复用上述原PNG和实测裁切，哈希不变。仅stage1+normal+bear绑定专属身份，熊山君/精英/其他关卡不共用；固定根点和136统一比例，血条稳定3.4r，接触攻击/受击视觉时钟不改变原战斗规则，死亡4姿态单次播放并在0.42秒回收。

13项Node专项和真实Edge自然move8/attack8/hit4/death4、双朝向、暂停冻结恢复已通过；32姿态左右48px生产renderer夹具另列，不宣称最终流畅度完美或手机FPS。manifest及帧契约已批准运行时，loader/serve/release清单已更新；10月10日已重建并验收本地候选ZIP，未部署。最新边界见 [BEAR-RELEASE-HANDOFF.md](../../docs/BEAR-RELEASE-HANDOFF.md)。

## 2026-10-10：普通野牛妖32姿态候选预检（接入前记录）

本节保留历史候选阶段；后续已按下一节完成局内接入与批准，不以本节的旧批准状态代替当前状态。

查重确认缺少同用途动作表后，以内置imagegen生成初稿，再仅做一次布局编辑；原样保留终稿，未脚本重绘或重编码。文件SHA256为 `88835913f75054ec232ff3507d7a6fd27bde22ea40a7b004de028262e4408acb`，prompt保存在 `prompts/enemy-bull-battle-v1-sheet.txt` 与 `prompts/enemy-bull-battle-v1-layout-edit.txt`；不能重复生成这份候选。

必须使用 `enemy-bull-battle-v1-frames.json` 的32个实测矩形，统一150源像素比例与固定行列根点，不均分图或逐帧贴底。候选和manifest均未批准运行时，未加入loader/serve/release；只面向第1关普通野牛，不得让Boss特处士（待处士）共用。

真实Edge独立预览已完成PNG解码、不同像素、左右镜像、全姿态绘制覆盖与录制数据播放回读，输出左右48px图集、48/56/96px抽样和WebM。回读确认录像可解码且像素变化，不等于全部源姿态都被编码、动画完美、游戏FPS或局内/公网通过。固定根点仍为provisional。详情与后续接入门槛见 [BULL-ANIMATION-HANDOFF.md](../../docs/BULL-ANIMATION-HANDOFF.md)。

## 2026-10-10：普通野牛妖已接入局内

复用上述PNG/32实测裁切，原图SHA不变，本轮0次生成。仅stage1+normal+bull绑定`bull-normal-v1`，特处士/待处士、精英、其他关卡不共用。150源像素统一比例、固定根点，radius15体高48世界像素；血条3.45r、死亡4姿态单次播放0.42秒回收，保持原碰撞/伤害/移动/RNG规则。

13项Node专项覆盖64镜像、128血条包围、四边裁切和三物种6个有向池复用组合。真实Edge自然生产模拟覆盖move8/attack8/hit4/death4、累计双朝向、暂停冻结与恢复；32姿态左右48px生产夹具单列。接触攻击/受击仍有英雄身体遮挡，不宣称最终质量完美或所有自然帧无遮挡。

manifest/帧契约已批准本地运行；loader/serve/release清单与公开6字段投影同步。接入阶段未打包，随后已按 [BULL-RELEASE-HANDOFF.md](../../docs/BULL-RELEASE-HANDOFF.md) 完成牛版本地候选ZIP及实际解压网页验收，未部署。该阶段库存75/71/4，运行与有限保证见 [BULL-RUNTIME-HANDOFF.md](../../docs/BULL-RUNTIME-HANDOFF.md)。

## 2026-10-10：普通苍狼32姿态候选，尚未接入

`enemy-wolf-battle-v1-sheet.png` 是核对现有副本、原项目/legacy用途和本聊天10张生成图后才补齐的缺失素材。内置imagegen仅生成一次，初稿即通过32姿态分隔，无布局编辑；1774×887、1,410,175 bytes，SHA256 `b116553b99a397f2fd0c28076000246e9c3528c6b28d7ab6f2482927db8d8299`。原PNG直接复制，未代码重绘/重编码。完整prompt在 `prompts/enemy-wolf-battle-v1-sheet.txt`，禁止再次生成同用途候选。

`enemy-wolf-battle-v1-frames.json` 的32个实测裁切四边外扩2px，idle8/move8/attack8/hit4/death4，以170源像素统一缩放、固定列根点/行基线，不逐帧贴底。仅供首关普通苍狼，不给凌虚子/奎木狼、精英或其他关卡共用；`approvedForRuntime:false` 与manifest的 `runtimeApproved:false` 保留，未加入loader/serve/release。

真实Edge独立预检09:31:04Z→09:31:14Z通过：左右48px图集、48/56/96px抽样、不同像素、全姿态绘制覆盖、WebM数据回读。截图/预览录像在 `evidence/current/wolf/`，不是生产游戏或公网验收，也不证明最终流畅度或游戏FPS。锚点仍provisional，下一步复用本PNG验证局内落脚、衔接、双朝向/暂停与遮挡。

最新库存76份媒体/72唯一SHA/4解释副本，旧素材未改。新npm test PASS，首次EPERM单独保留，测试浏览器已关闭；牛版本地ZIP未重建或部署。完整交接见 [WOLF-ANIMATION-HANDOFF.md](../../docs/WOLF-ANIMATION-HANDOFF.md)。
