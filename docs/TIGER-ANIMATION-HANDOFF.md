# 首关普通虎妖：32姿态素材与接入交接

日期：2026-10-09。状态：**现有32姿态已接入首关普通虎妖，本地真实Edge与Node回归通过；公网仍未通过**。

## 素材准备记录（前一轮，不是局内验收）

- 生成前扫描 72 个媒体、68 个唯一 SHA；不存在普通虎妖动作表，旧通用妖怪单姿态不是可复用的虎妖动画。
- 使用内置 imagegen（非 CLI/API）串行生成一次，再对初稿串格问题定向编辑一次。imagegen 技能要求保留透明底、源文件和非破坏性版本，因此仅将修正版复制到工程，没有覆盖旧素材。
- 当前素材：`prototype-2d/assets/enemy-tiger-battle-v1-sheet.png`，1774×887、1,166,282 bytes，SHA256 `b1acb7e65f23b79a33397163e0dc2a51942a0899aa3916c943f695406a307389`。
- 32 个逐像素不同的姿态：idle8 / move8 / attack8 / hit4 / death4；透明像素 1,147,507 个。大于 8/255 alpha 的 331,442 个像素全部归入独立姿态，最小水平间隔 19px，无画布边缘裁断。
- 图中虽有 8列×4行，但行列间距不是严格网格。`prototype-2d/assets/enemy-tiger-battle-v1-frames.json` 保存实测矩形（四周留2px）和预览脚底锚点；禁止直接 width/8、height/4 均分，也不能每帧拉伸成同一个方框。
- 当前去重扫描：73 个媒体、69 个唯一 SHA、4 组可解释的旧副本；新增虎妖未形成重复组。

## 生成记录

- 初始完整 prompt：`prompts/enemy-tiger-battle-v1-sheet.txt`。
- 最终布局编辑 prompt：`prompts/enemy-tiger-battle-v1-layout-edit.txt`（保留造型及32姿态顺序，只缩小并调整留白）。
- 原始生成图 `exec-3786a15d-7da7-4a79-9d96-59fedebcf0bf.png` 有攻击姿态串格，未复制入项目资源。
- 最终源图：`C:/Users/Administrator/.codex/generated_images/01a10ba8-459b-73f1-bf80-21b0b426fb23/exec-d5b8298b-c2ee-488b-b27e-1e23c01fe4b6.png`。本地生成源文件保留。

## 真实验证与边界

- `node scripts/audit-tiger-sheet.mjs`：PASS，PNG alpha/像素哈希/孤立帧/契约一致性，只读检查，不修改图片。
- `node scripts/browser-tiger-preflight.mjs`：PASS，真实 Edge 155.0.4283.45 解码并按实测坐标绘制32个独立姿态；检查全部状态有不同渲染像素、左右镜像，无页面错误。首次启动被沙箱以 `spawn EPERM` 拦截，随后在批准的单个 Edge 进程中成功；未并发启动浏览器。
- 浏览器截图：`evidence/current/tiger/atlas-48px-preflight.png` 和 `pose-samples-preflight.png`，已检查小尺寸识别、完整剪影、无邻帧带入。
- JSON 证据：`evidence/current/tiger/asset-preflight.json`、`browser-preflight.json`。这是独立素材页面的预检，**不是游戏中自然触发/流畅度/性能验收**。
- `npm test`：本轮重新 PASS，未复用旧 Node 结果。
- 前一轮素材预检时尚未修改游戏绑定或发布 allowlist，旧游戏浏览器证据不作为接入通过依据。本轮接入状态见下方，不应继续按候选处理。

## 本轮接入完成：只复用普通虎妖，不再重生成本表

1. 出生时只给 `stage.id===1 && kind==='normal' && variant==='tiger'` 标记 `battleSpriteId='tiger-normal-v1'`。虎先锋和寅将军不共用，其他关卡不误绑定。
2. `enemyImages.tiger` 复用串行图片队列；`src/tiger-animation.js` 校验JSON后才发布图片引用，加载失败保留向量回退。源像素统一比例 `radius*3.2/130`，脚底 `radius*.7`，不叠加旋转、摇摆、压扁或每帧拉伸；镜像只翻转横轴。
3. 虎妖独立idle8/move8/attack8/hit4/death4；接触触发0.5秒视觉攻击，受击视觉0.25秒，反应末帧不回绕。原0.12秒hitTimer、伤害、碰撞、移动与随机数不变；不会延长硬直或修改平衡。
4. 死亡效果保存朝向和原radius，10FPS按0→3单次播放，末帧锁定，原0.42秒TTL到期回收；对象池复用时不遗留虎妖字段。活体/尸体扩大视野边界，避免伸出的动作被提前剔除。
5. `npm test`新增11项虎妖回归，证据 `evidence/current/tiger/engine-runtime.json`；32裁切、64左右绘制、自然接触触发、完整hit4、pause、death20/120Hz单调与回收、伤害/RNG不变、身份隔离和边缘裁切通过。
6. `scripts/browser-tiger-smoke.mjs`真实Edge由正常UI进入，合法移动/升级输入的加速生产模拟实际绘制move8/attack8/hit4/death4、双朝向与真实击杀；键盘暂停后图像和时钟冻结，恢复继续。`browser-runtime.json`记录种子/时间/事件/截图；不是连续真人试玩或手机FPS。32姿态左右48px生产renderer夹具单独标明，不计入自然帧覆盖。
7. 初次Edge启动遭沙箱EPERM，授权后串行重试；首个运行未观察到move末帧，记录为FAIL，随后调整合法移动输入让虎妖完整走近再攻击（未改角色HP、时间、刷怪或伤害），重新通过。`runtime-fail-*.json`保留原始失败，未复用旧PASS。
8. PNG字节/hash不变；JSON与manifest已标runtimeApproved，网页服务/发布allowlist已加入PNG、JSON和共享模块。微信包只继承逻辑，仍用向量回退，不声称已接入微信图片或完成微信实机。

后续2026-10-09状态专项已修复正常`slow=1`误减速、状态牌间重叠及虎妖头顶血条/眩晕星环堆叠，Node与真实Edge证据见 `STATUS-BADGE-HANDOFF.md`。这仅是有限提示避让，其他敌人身体/血条、伤害数字及HUD覆盖区未全局解决。下一素材步骤应先查库存再选择其他普通妖怪或Boss的真实缺口，禁止重生成本虎妖表。

公网仍未通过，沿用此前外部 502 的未解决状态；没有在本轮重测公网，也没有用此素材预检取代公网验收。
