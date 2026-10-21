# 虎先锋真实身份/事件驱动预览：技术 REVIEW，布局未批准

本轮只新增三个 scripts 证据层文件与此目录证据。候选表、motion draft、两张源图和生产文件未改；未重建 ZIP、未部署或重测公网。生产仍 vector/authoredFrames，候选没有 manifest/loader/生产引用。

## 实际检查与边界

单个真实 Edge 155.0.4283.45 从首页经选角进入战斗，debug=false、time≈1s，保存 real-ui-before-fixture.png；随后取消自然 RAF，显式加速至300秒、清理集合、重定位玩家/敌人、直接 damageEnemy，并按25ms只推进 updateEffects/updateEnemies 子系统。它不是自然存活五分钟、完整 update 游戏模拟或自然攻击/受击验收。

候选只在当前页面内存临时替换精确首关、冻结 encounterIdentity 的虎先锋 elite/death body。普通虎妖及无身份同名精英仍由原 renderer 绘制；同一画布、真实世界 XY/camera/zoom/朝向，地线 y+0.7r、standing height=3.2r，每源固定170/443参照比例，不逐帧拉伸。原事件消费者一次透传，finally恢复方法并dispose；context/browser/server已关闭。

外部 Map 消费真实 engine 发出的 hit(target=enemy, enemy) 与 kill(enemy)，但触发它们的是本轮直接伤害夹具。视觉hit为250ms，不延长真实hitTimer120ms；死亡只存在于原420ms effect TTL内，源death末态可在剩余70ms时观察，原expiry后候选及保留记录均消失。死亡 effect 没有 sourceEnemyId/facing，证据层仅利用对象引用/冻结身份/坐标及外部缓存关联，不补生产字段。

虎先锋elite没有 attackPattern；接触 damagePlayer 的 hit(target=player) 没有 enemy/sourceId，玩家attack也不能归属为虎先锋攻击。两者均被预览拒绝，attackEventSupported=false、attackPreviewed=false，不据接触推测攻击动作。idle及双向全覆盖本轮也未验收。

Node off/on固定种子夹具：完整state、事件摘要、17次RNG及值、内部调度、pools/stats和creation TTL七项相同，71次observer只读检查；move8/hit4/death4技术时钟遍历。Browser有48次draw/8次consume stateJSON与RNG次数不变检查，只针对observer，不否定夹具本身的显式写入；实际浏览器源覆盖仅move#8–13、hit#24–27、death#28–31，不能用Node补宣称浏览器全move8。

## 静态视觉缺陷（未批准）

根代理已看全部10张PNG；独立只读代理 incontext_evidence_audit 查看四张关键图并复核脚本/报告。没有观察到累积残影，但：

- world-start-move / world-follow-move 的生产通用精英血条横穿候选头/眼部，候选更高而血条仍原 generic elite y-1.85r；本轮保留真实 hp/maxHp、原位置/宽度，不伪造更优结果。
- hit-visual-after-actual-timer 的贴身候选遮住玩家大部分身体/头部，血条仍覆额头；death-frame31中伏地人物与玩家/护盾/数字重叠。
- world-start的根位置约screenX365，follow约331，候选在390px右边缘裁切。世界跟随不等于候选完整可见或viewport边界批准。
- 这些是明确近身/边缘夹具的静态缺陷，不泛化为自然战斗，也不把静态截图当连续运动、艺术质量或FPS验收。

original-death-expired.png 的 snapshot.lastDraw 是先前301.10s最后draw的历史日志，截图采样已301.125s；不能把残留lastDraw误读为仍有死亡body。当前effects/retainedRecords与PNG证明原expiry消失。

## 失败保留、测试与完整性

finally源码明确还原onEvent/rng/_drawEnemy/_drawEffect；browser.json的hooksRestored实际取g.dispose()后的g.disposed，证明dispose完成，不是独立方法引用相等测试。

首稿 2026-10-14T01-25-31-546Z 的Node报告在池复用后读取death.maxTtl，误记为0.01；原0.42断言在复用前已通过，但该报告已由 rejected-review.json 明确拒绝且保留。最终版本提前捕获creation标量，增RNG值/内部调度hash，并将observer异常从engine.emit吞异常路径收集出来。

本轮新 npm test：2026-10-14T01:36:20.181Z PASS，完整49163字符输出保存在 npm-test.txt，摘要 npm-validation.json；这是当前工作区Node/Canvas mock/平台桩回归，没有额外浏览器或公网PASS。现有npm测试按原流程生成派生共享入口，两个ZIP没有重建。post-test-integrity.json核对137保护文件前后哈希、新10PNG/三个scripts及Node/browser证据，均未改变。页面/console/失败请求/HTTP/外网请求均0；单浏览器/本地服务已关闭，没有录像或生图。

最终 browser.json SHA ecc6404a91243670b6c4226f3ab34c35c5c7a76c927397940470904c54e6edd1。
Node result=PASS_EVIDENCE_ONLY_EVENT_CLOCK；Browser result=REVIEW_IDENTITY_EVENT_WORLD_FOLLOW_PREVIEW。Node技术PASS不冲销上述布局缺陷。

humanMotionReviewed=false、rootApproved=false、healthBarLayoutApproved=false、playerReadabilityApproved=false、viewportEdgeApproved=false、runtimeApproved=false、highFrameApproved=false、fpsAcceptance=false、publicPass=false、releaseReady=false，整体仍NOT_READY。

## 唯一下一安全步

仅在证据层按既有32姿态、固定源比例建立候选实际包围盒和稳定血条避让草案，有限重验本次夹具；保留原HP/宽度/伤害/控制/世界位置/死亡TTL，不挪玩家或改战斗来掩盖遮挡。贴身身体和视野边缘问题继续单独待解决。未批准前不改生产契约、不给player-hit伪造attack、不重复播放/库存/生图，不打包或上线。

