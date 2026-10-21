# 贴身玩家内轮廓草案：REVIEW，艺术可读性未通过

唯一小步：对既有玩家精灵与虎先锋实际本帧像素交叠区加证据层内轮廓，未更改生产/图像/几何/时序。不是新素材或重新调用玩家绘制，也不是自然完整战斗。

## 输入和边界

- 前序反馈browser锁SHA 2110863dcb29a25387d90d7e6afe65c9ec9947a2269f77c9441508b97b3f0311；候选表/motion/layout沿用前序锁定输入。
- 当前玩家运行图hero-wukong-battle-v3-sheet.png，1774×887，SHA 6d5e900a45300320f5072f6c0072c59975d9db9d8fa564c8e4418d0996d19127；实际现有英雄绘制引用，不引入立绘。继承186项保护包括此图、虎先锋两页、生产与两ZIP。
- 原_drawPlayer每模式调用一次。只在该调用内部记录实际玩家drawImage，完整source/dest与device矩阵、alpha/合成/平滑记录；原drawImage成功返回才提交，后绘绑定候选实际body成功draw同样捕获。副画布重放这些命令，不再取动作帧/采样原_player，不包含影子/尾迹/受击/无敌环作为玩家body。
- 每render清空外部记录/token与3张复用辅助画布。alpha>8内侧2px Chebyshev环与后绘候选alpha交叠，色RGBA[255,240,166,210]；只有原_feedback之前新增一次identity矩阵复合，随后恢复原ctx。保护实际bar，数字/状态牌继续按原路径在上层。
- helper最大512×1024/524288像素、RGBA长度和厚度门禁。5组Node合成RGBA测试覆盖inner-ring非实心、透明/分离/早绘、token失效、视口截断关闭、有限参数/源数组不变；不等于实际艺术或网页验收。

## 本轮真实网页结果

一个Edge从首页指针点击到选角/战斗，debug=false、time1.0005s；其后明确300秒加速/清集合/世界重定位/direct damage/25ms仅updateEffects+updateEnemies夹具。两张接触图是DPR1、hit26朝左、实际hitTimer0、视觉hit剩100ms；不是自然五分钟。

玩家实际sourceRect=[887,443.5,443.5,443.5]，dest=[-43.65,-46.44,87.3,87.3]，完整矩阵保存于browser；候选sourceRect=[451,698,171,162]。前后实际源绘制参数/矩阵、body/bar/camera、state/RNG、数字全部字段/顺序/TTL与最终paint变换相同。额外mask重放与1次主画布复合单独记账，不声称Canvas调用数不变。

阈值屏幕代理：player6911像素，overlap4616，outline1035，提示bounds=[169,254)×[363,456)。1035变化像素恰在1035个mask非零alpha位置，mask外0；bar交叠0。不把alpha>8统计当实际遮挡百分比或作者身体语义。

27次render/6次consumer只读state/RNG检查；14RNG调用来自显式夹具，不由观察器增加。原方法与ctx引用finally恢复并逐一===核验，辅助画布resize1×1，正常原路径重画、游戏dispose、context/browser/server均关闭。page/console/失败请求/HTTP/外网全0。死亡未在本轮触发，不复用前轮死亡TTL作为新测试，空statusRects不能当状态牌通过。

2026-10-14T02:30:57.261Z新npm test exit0完整归档；186保护文件、6PNG与三新scripts/Node/browser前后哈希一致。未生图、录屏、生产接入、ZIP重建、部署或公网验收。

## 根代理与独立静态结论

根代理看6PNG：可定位玩家头顶/头发、抬手与部分衣缘，但头线穿过虎先锋额头/脸，手臂线叠在护肩，黄色线又和尾迹混在一起。玩家脸与身体细节仍被覆盖，因此本轮技术检查不升级为艺术可读性通过。

独立player_outline_audit先只读审查安全捕获与绘制顺序，再看without/with/player-source/outline-mask四图、审查helper/browser并核186保护/6PNG/脚本SHA，无第二个浏览器或任何写入。结论相同：有限定位辅助存在，但playerReadability不批准。源英雄已有高帧/crop缺陷保持开放。

所有艺术/根点/布局/玩家/边缘/运行时/高帧/FPS/公网/发布门禁保持false，总体NOT_READY；多怪/其他动作朝向/DPR/死亡/状态牌/连续运行成本和全局可读性均未验。

下一安全步只在证据层对照“玩家单次绘制的贴身深度优先”草案：复用现有玩家路径，仅延后同一接触夹具的玩家绘制次序、不新增第二次人物绘制；保持世界位置/碰撞/伤害/素材/比例/动作时序/数字和血条，实证玩家与敌人双方可读性，不接入生产或上线。

