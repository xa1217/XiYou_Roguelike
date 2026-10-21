# 虎先锋候选固定比例包围盒/自身血条草案：REVIEW

本步只新增三个scripts、layout-draft.json和本目录证据。复用已锁定候选32姿态与motion draft，不生成/编辑PNG，不写生产契约、manifest、loader或renderer。两个ZIP未重建、未部署/公网复验；生产仍vector/authoredFrames。原项目及legacy-source未动。

## 公式与Node边界

每姿态按既有sourceRect、visibleRect（历史alpha>8 bbox代理）、motion.pivot和每源170/443参照归一化；世界投影乘standing=3.2r、加ground=y+.7r，镜像交换左右。visibleRect不是重新测量全alpha像素、人体/碰撞包围盒或作者根点，完整draw crop是含2px guard的保守矩形。活体28姿态union包含尚无真实事件的attack#18，仅保守预留，不能算attack动作验收；death四姿态投影但不画血条。

活体draw union.top=-193/170（standing单位），worldTop=y-2.932941176470588r；alpha8 proxy top=-191/170，worldTop=y-2.895294117647059r。用完整draw union建立不随帧/朝向改变的基线：w=max(20,2.3r)、h=max(3,.08w)，barY=stableTop-4-h。r25时旧y-46.25改为y-81.9235294117647，上移35.6735294117647 world单位；不改变bar x、widthArgument、实际hp/maxHp ratio或color，不缩放/挪动body。

Node192项几何、168项活体bar检查覆盖32姿态×双向×r7/25/72，输入JSON不变、无death bar、非法输入拒绝。独立等式直接核alpha代理L/R/T，其他边由包含/稳定留空检查约束，并非逐边独立公式断言；不称像素或运动测试。Node result=PASS_EVIDENCE_ONLY_FIXED_SCALE_BOUNDS，所有批准false。

## 单浏览器有限前后对照

真实单Edge155.0.4283.45从首页→选角→战斗(debug=false,time1.0015)后，取消自然RAF，明确300秒加速、清集合、重定位、直接damageEnemy和25ms子系统推进，非自然五分钟/完整gameplay。仅内存hook精确首关冻结虎先锋身份，普通虎/无身份同名elite不绑定，原observer独立视觉hit250ms不延长实际120ms，death只存续原420ms。

三个同状态前后对照分别move#8、move#12、hit#26，均朝左；body pose/geometry/camera/state/RNG相同，只有自身barY变。真实ratio依次1、1、314/315。全390×844画布差异像素1107/1417/1380，均位于旧/新血条屏幕矩形±3px遮罩内，遮罩外差异0；不是“精确仅血条像素”的无halo保证。当前姿态的完整draw顶与bar底分别留13.8824/13.4118/17.1765 world单位，保守活体union最小4。没有body/生命值/数字/控制/TTL变化。

Browser53次render和8次consume逐次检查observer状态JSON/RNG调用数不变；夹具自身的显式写入不因此消失。实际绘制覆盖move#8–13、hit#24–27、death#28–31，不借Node数学32姿态升级浏览器全态/双向动作批准，不预览idle或attack。player-hit/sourceId缺失与玩家attack均拒绝；无attack事件新增。death#31在原expiry前可见且无bar，expiry PNG已无候选，retained0；其lastDraw仍是301.10s历史记录，不是301.125s新绘制。

finally方法引用相等测试确认onEvent/rng/_drawEnemy/_drawEffect已恢复，随后dispose；context/browser/server均关闭，错误/外网0。没有视频或FPS测量。

## 静态结论：自身离头，但出现数字冲突，仍不批准布局

根代理静态查看全部9PNG；独立代理审查公式/代码并查看三组前后共6PNG。自身血条确实移开候选头/眼部，但：

- hit-after-actual-timer-after新bar屏幕y306.416–313.536与黄色数字“1”约y309/310的上缘/黑描边接触并局部叠压。**新数字/血条冲突已观察，整体信息可读性不通过**。
- 当前草案只改候选自身drawEnemy的barY，damageObstacleGeometryUpdated=false；伤害数字避让仍使用原generic身体/血条障碍，不能将自身离头升级为共享避让合同通过。
- world-start-after的bar.right409.732>390，候选visible.right446.807>390，仍右侧裁切；world-follow-after血条在视野内但candidate.visible.right414.906>390。没有把根坐标或body挪进屏幕。
- 贴身hit仍遮住玩家大部分身体/护盾；death伏地与玩家/反馈重叠也未解决。没有将本夹具泛化为自然战斗或全局像素判定。

Browser result=REVIEW_EVIDENCE_ONLY_STABLE_OWN_BAR_LAYOUT，ownBodyClearanceAtObservedFixtures是有限技术事实，不是最终布局批准。

## 新测试、保护与下一步

本轮新npm test 2026-10-14T01:55:27.487Z PASS，完整49163字符输出及摘要归档；原npm流程生成共享派生入口，不重建ZIP。post-test-integrity.json检查156保护文件及新9PNG/三scripts/Node/browser/layout哈希，全部未变；未改源图/生产/发布包、未公网复验。

humanMotionReviewed=false、rootApproved=false、healthBarLayoutApproved=false、playerReadabilityApproved=false、viewportEdgeApproved=false、runtimeApproved=false、highFrameApproved=false、fpsAcceptance=false、publicPass=false、releaseReady=false，整体NOT_READY。

唯一下一安全步：仅证据层让伤害数字有限避让消费同一候选body/bar矩形，有限复核当前hit对照，保留数值、样式、原生命周期/战斗和body世界位置，不通过挪玩家/抑制数字/缩裁切掩盖冲突。不接入生产、不给player-hit编造attack、不再重生图/重复库存/全录像播放/打包部署；贴身身体/视口/艺术/运动质量继续开放。

