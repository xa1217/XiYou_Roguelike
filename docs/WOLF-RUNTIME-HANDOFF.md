# 普通苍狼32姿态：局内运行时接入交接

更新时间：2026-10-10（Asia/Shanghai）。本步复用既有普通苍狼PNG/实测帧JSON，完成首关 `stage1 + normal + wolf` 的本地运行时接入与真实浏览器验收；没有生成或重编码新图，没有部署，也没有把本地结果当作公网/微信真机通过。

## 复用与运行边界

- 图集 `prototype-2d/assets/enemy-wolf-battle-v1-sheet.png` 保持原字节：1774×887、1,410,175 bytes、SHA256 `b116553b99a397f2fd0c28076000246e9c3528c6b28d7ab6f2482927db8d8299`。
- `enemy-wolf-battle-v1-frames.json` 保持32个实测裁切、170源像素统一比例、固定列根点/行基线；现标记 `approvedForRuntime:true`，含义是已通过本地网页接入门槛，不代表移动端、公网或微信实机最终批准。
- 共享注册、串行图片/JSON加载、构建顺序、运行时公开契约、serve allowlist 与 release 清单均已接入 `wolf`。身份仍严格限制为首关普通苍狼；精英、Boss、凌虚子/奎木狼、其他关卡不共用。
- 局内仍为 `battleArtMode: "authoredFrames"` + `battleSceneMode: "vector"`；没有使用平移缩放静帧冒充动作，碰撞、伤害、移动、掉落、RNG与对象池规则未改。

## 专项证据

|检查|证据|结果|边界|
|---|---|---|---|
|Node/Canvas运行回归|`evidence/current/wolf/engine-runtime.json`|13项PASS；32裁切、64左右镜像绘制、自然攻击/受击/死亡、暂停恢复、对象池清空、跨物种隔离、8边缘裁切、128血条包围|不是浏览器像素、GPU FPS或微信真机|
|真实Edge局内专项|`evidence/current/wolf/browser-runtime.json`|PASS（最新 12:19:08Z→12:19:12Z）；正常UI→选角→战斗，生产流自然move8/attack8/hit4/death4、双朝向、命中/击杀、暂停截图/时钟冻结恢复；32姿态左右48px夹具另列；页面错误/失败请求0|本地 `127.0.0.1:8088`，不是公网或ZIP解压验收|
|公开资源/契约|`evidence/current/browser-public-smoke.json`|PASS（最新 12:21:13Z）；四物种资源与公开6字段帧契约均200/32帧，路径隔离与正常9秒战斗通过，调试保持关闭|本地workspace入口；7个刻意404是阻断探测，不是错误|
|全量回归|`evidence/current/validation.json`、`evidence/current/wolf/npm-test-integration-pass-104858.txt`|`npm test` 2026-10-10T12:12:13Z PASS；17机制、11虎、13熊、13牛、13狼、8状态、四角色600秒、正常输入、对象池/渲染/平台桩|Node/桩，不是微信设备|

首次受限环境的 Edge `spawn EPERM` 保留在 `evidence/current/wolf/runtime-fail-1791631804823.json`；另一次业务检查全通过但清理超时，失败报告同样保留，随后提高清理等待并取得 `browserClosed:true`。最新只读快照 `evidence/current/wolf/process-cleanup-latest.json` 显示 Edge 与8088/8089/8091监听均为0；未终止无关后台进程。

## 仍未完成

- 当前 `dist/` ZIP 仍是未含狼的牛版本，尚未重建候选包；没有上线。
- 猴、鹿、鹰、蛇四类普通怪，虎先锋与三名最终妖王仍缺专属多帧动作；英雄最终高帧质量、身体/血条/伤害数字/HUD整体遮挡、公网稳定通道、微信AppID/真机与商用服务仍延期。
- `approvedForRuntime` 只表示本地接入门槛通过；不宣称“完美动画”、移动端FPS、公网PASS或微信实机PASS。

## 下一步

1. 保留本步证据，继续按素材任务单串行补缺失物种，先查哈希/尺寸/用途/运行时引用，禁止重复生成已存在同用途素材。
2. 待全部局内动作与整体可读性完成后，再重建当前资源候选ZIP并从实际解压目录单Edge验收；公网通道成功后才讨论上线。
