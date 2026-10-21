# 视觉垂直切片验收记录

## 方向

局内的首要方向是《王国保卫战》启发的原创 Q 版：大头矮身、粗深色轮廓、平色块与清晰动作，不复制具体角色、Logo、敌人或构图。保留蓝、朱红、金黄、翠绿作为识别色，但地图底板和地标降噪，让角色、敌人、投射物与伤害反馈成为视觉焦点。

精美插图只允许用于选角、图鉴和特殊展示，不能用作局内静帧。网页局内角色使用四张 `hero-*-battle-v3-sheet.png` 真实动作表；每张有 4×2 独立透明帧格。动作表未解码时使用确定性 Canvas 角色动画回退，不把旧单姿态 PNG 的裁边、位移或缩放当成新帧。

当前局内模式为 `battleArtMode: "authoredFrames"` + `battleSceneMode: "vector"`。地图用原创 Canvas 路径绘制，保留世界碰撞、山脊与中央通道，不叠加精美地图 PNG、随机红色多边形、绿色圆块或青色相机边缘速度线；`renderer.mapAssetDraws === 0` 是预期值。

## 垂直切片内容

- **四角色**：悟空、唐三藏、八戒、悟净各有 1774×887 的 v3 动作表，按真实帧格裁切；引擎提供 idle/move/attack/hit/stun/dash/intro/death 状态，renderer 依据朝向镜像。与旧单姿态角色 PNG 分离。
- **一地图**：首关绘制安静的双叉岭底板、山脊剪影、中央通路和少量固定地标；普通章节延续同样的低噪声向量场景。地图不依赖 PNG 解码，不再把插图或印章贴纸铺成战斗地图。
- **一 Boss**：Boss 拥有独立放大体型、金色旋转光环、十条入场射线、可选入场环 (`spawnProgress`/`entrance`/`intro`)、独立武器和命名血条；`final` Boss 显示“最终妖王”。
- **法宝效果**：金箍棒扇斩、九环光球、九齿钉耙、降妖旋涡、扇、山、葫芦、金绳、莲花、火池、佛珠等效果均有不同轮廓与高光，不共用一个圆形占位。
- **反馈**：渲染器读取 `damageNumbers`、`floatingTexts` 或 `combatText` 数组绘制漂浮伤害数字；读取敌人的 `statusText`/`debuff`/`status` 绘制状态标签。现有引擎没有强制新增字段，因此旧存档仍可运行。

## 历史证据（不得作为当前 v3 PASS）

执行：

```bash
node prototype-2d/tests/render-smoke.mjs
```

历史结果（2026-10-04）：六主题 × 四角色和全部效果通过，Canvas 栈平衡、输入状态保持不变、无 `roundRect`/DOM/随机帧绘制；压力场景 390×844 DPR2、220 敌人/300 投射物/160 效果/240 经验，视口裁剪后平均 **6,053 Canvas 调用/帧**，36 敌人、45 投射物、25 效果、30 经验进入绘制。上述数字只用于追溯改动前状态，v3 接入后必须重跑。

该脚本使用 Node Canvas mock，验证的是路径参数、裁剪和 JavaScript 调度，不等价于真实设备 GPU FPS。微信真机验收仍需在低端 Android/iOS 上检查字体、混合模式和高 DPI 视觉密度。

## 素材清单变化

`prototype-2d/assets/manifest.json` 升级为 v3，记录四张真实动作表的尺寸、bytes、SHA256、4×2 帧格、pivot、状态 fps 与用途边界。旧 `hero-battle-v2-atlas.png`、`hero-tangseng-kr-v1.png`、敌人/Boss PNG 和地图 PNG 仍保留作追溯或图鉴，不进入局内启动路径。新增素材前先过现有素材哈希、用途和引用去重，缺失资源按角色 → 普通妖怪 → 三名首关 Boss 串行补齐。

## 2026-10-04 手绘地图旧方案（已退出局内）

旧方案使用 `map-forest-qv1.png` 与 `map-temple-qv1.png`（1024×683）作为后景，`theme-forest.svg`/`theme-temple.svg` 作为中景与前景低透明度层。该方案现已退出局内，资源仅作章节预览/追溯，不能据此声称当前地图需要 `drawImage` 或 PNG 解码成功。

普通与精英妖怪的旧单姿态 `enemy-creature-kr-v1.png`、`enemy-brute-kr-v1.png` 以及 `enemy-boss-kr-v1.png` 不再在局内启动时加载。当前敌人/Boss 使用统一向量动画 rig；对应 PNG 仍保留作历史/图鉴和去重审计，缺失的真实多帧资源待后续串行制作。

战斗反馈继续由同一 Canvas 渲染器绘制：本命武器拖尾、光球轨迹、火鸟/火焰爆炸、眩晕/燃烧/流血/减速状态徽章、有限 TTL 伤害数字和 Boss 入场光环。`node scripts/browser-visual-smoke.mjs` 应记录本轮真实浏览器截图；当前地图验收条件是 `mapAssetDraws === 0`。Node Canvas render smoke 只验证调用和裁剪，不等价于微信真机 GPU FPS。

## 首关双叉岭地图垂直切片（高峻山体版）

首关 `双叉岭遇妖` 仍绑定 `stage.mapAssetKey = "doublefork"`，但当前 playable battle 不加载 `map-doublefork-high-ridge-v1.png` 或 `theme-forest.svg`。`renderer.js` 直接绘制 back → route/landmark → actor 的安静向量场景；地图 PNG 只作章节预览和追溯。

该后景候选只负责视觉，不改变世界坐标；战斗世界仍为 1800×1800。山脊碰撞矩形是 `x=0,y=700,width=1800,height=400`，中央小径是 `x=790,y=700,width=220,height=400`。上、下战斗区通过中央小径往返，玩家移动、冲刺、敌人移动和刷怪点都调用相同的 `isWalkable` 规则。

源图尺寸为 **941×1672 px**、**2,968,219 bytes**，SHA256 为 `3B2B15606E6548F128123201FAA782E6AF625F0BE4F22F8FAEDC5D94C5980BF8`，仅用于追溯。当前浏览器视觉/动画脚本应检查 `battleSceneMode === "vector"`、`mapAssetDraws === 0` 和双叉岭碰撞几何；这证明局内没有误加载精美地图，不等价于微信开发者工具/真机 GPU FPS 测量。

## 角色与特效动画实现

`renderer.js` 为玩家、普通/精英/Boss、投射物和死亡效果保留 `animationState`、`animationFrame`、`animationPose` 与 `spriteFrameRect`。玩家角色优先裁切 v3 真实帧表：每张 4×2、8 个独立格，状态序列由 `native-app.js` 的帧合同映射到 idle/move/attack/hit/stun/dash/intro/death，并对左向移动做镜像；缺图时继续使用同状态的 Canvas 向量 rig。`native-app.js` 通过单项队列串行解码四张表，减少公网通道并发和内存峰值；旧单姿态 PNG 不在启动路径。`renderer.dispose()` 清空绘制缓存，避免长局累积纹理或对象引用。

当前可复核命令：

```powershell
node prototype-2d/tests/render-smoke.mjs
node scripts/browser-animation-smoke.mjs
node scripts/browser-visual-smoke.mjs
```

Node Canvas 压力场景仍以视口剔除、Canvas 调用量和状态清理为主；浏览器脚本应覆盖四张 v3 表加载、每张至少 8 个独立帧格、暂停冻结、恢复继续、左右朝向、Boss 入场和向量地图模式。微信原生 Canvas 是否支持 SVG 仍按回退策略处理，正式包应继续使用程序化向量层或经平台验证的离线 PNG；不得以旧历史 PASS 代替当前 v3 证据。
