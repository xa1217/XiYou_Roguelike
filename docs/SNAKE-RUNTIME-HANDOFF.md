# 普通蛇v3：本地运行时交接

更新：2026-10-11（Asia/Shanghai）。结论是本地技术接入通过，不是最终美术、整体遮挡、公网、当前ZIP或微信实机批准。此次不再生成图片、不重建发布包、不部署。

## 原素材与用途

- 当前运行资源：`prototype-2d/assets/enemy-snake-battle-v3-sheet.png`，1774×887，1,749,032 bytes，SHA256 `c10c9f951f871e0f398cef9a7ef36c46065df4fb986ed2d0bb8b246da11b0ec2`。
- 来源与v3完整提示词在manifest、`prompts/enemy-snake-battle-v3-sheet.txt`。原PNG未改像素、重编码或合成镜像；本步直接复用已通过预检的v3。
- 此前查明普通蛇缺口后串行生成三稿。v1跨行粘连/边缘裁切，v2最小间隔5px低于6px门槛，两者预检均REVIEW，不是可复用的合格动作表。失败原字节移存 `evidence/current/snake/rejected-enemy-snake-v1.png` 与 `rejected-enemy-snake-v2.png`，不进入运行/公开/发布边界。原预检中的input保留检测时路径，不伪造历史；当前存放路径及hash记录在manifest。
- v1 SHA `e17f187e0c6a733572f42cd722d99d8df6793b91c67ca6b66f08a5f9e6b02089`；v2 SHA `3e99eb9c9b26ca02424a7bc2d48f2f28c9475ce3f7704a35ef7838d46b6a19bd`。仅v3提示词有独立文件，不补造失败稿prompt。预检见 `asset-preflight.json`、`asset-preflight-v2.json`、`asset-preflight-v3.json`。

## 运行契约

身份是 `snake-normal-v3`，仅 `stage1 + normal + snake`；不是其他关卡、精英或具名Boss的替身。角色死亡继承普通身份、朝向和原体型，0.42秒只播一次并回收；对象池复用时清空身份/视觉字段。碰撞、伤害、移动、掉落与随机数规则未改。

`enemy-snake-battle-v3-frames.json` 使用独立alpha bounds外扩2px的32个实测矩形：idle8/move8/attack8/hit4/death4；170源像素统一比例。列根点 `[125,345,565,787,999,1227,1449,1667]` 和行基线 `[210,428,652,871]` 暂定且固定，不逐帧吸底、不均分、不添加摇摆/拉伸。idle index4原图朝左，由模块 `mirrorX` 归一后再应用角色朝向；不改PNG。

根代理维护的共享注册、native串行加载（显式v3）、build、serve白名单、release清单与公开合同投影已同步。公开JSON仅6个运行字段及受限嵌套字段，不含source/prompt/审批文字；manifest和失败稿不公开。`approvedForRuntime`/`runtimeApproved`只表示当前本地技术接入。

## 本轮实际验收

|证据|时间（UTC）|范围与结果|
|---|---|---|
|`evidence/current/snake/npm-test.txt`、`validation.json`|05:03:26Z|新跑npm test PASS；17机制、11虎、13熊、13牛、13狼、9猴、11鹿、3鹰、12蛇、8状态，四角色600秒/正常输入/池/渲染/平台桩，八物种公开合同|
|`snake/engine-runtime.json`|同次npm gate|12项蛇专项；64次真实源/目标裁切及scale/translate矩阵断言，朝向归一、身份隔离、攻击/受击不改玩法、暂停冻结恢复、0.42秒死亡和池清理；Node Canvas桩不是GPU测试|
|`snake/browser-runtime.json`|05:05:07.488Z→05:05:11.017Z|真实Edge 155.0.4283.45；首页→选角→战斗，合法移动输入的加速生产模拟7.0196游戏秒/140步；move8/attack8/hit4/death4、左右、命中2次/击杀1次，10项检查PASS；idle自然为空|
|`snake/runtime-natural-{move,attack,hit,death}.png`|同次浏览器|捕获生产绘制调用所在帧，非强制敌人或改状态；截图仍存在近身/UI遮挡，不证明每个姿态完全可见|
|`snake/runtime-fixture-{left,right}.png`|同次浏览器|真实renderer各32个不同姿态格，固定48px基准；明确是夹具，不冒充自然玩法/实时FPS/连续流畅度|
|`snake/runtime-paused-{a,b}.png`|同次浏览器|稳定暂停界面后像素、时钟、快照相同；恢复推进PASS；页面异常/失败请求/console错误均0，browserClosed=true|
|`browser-public-smoke.json`|05:01:19.121Z开始|单Edge、127.0.0.1 workspace公开入口；八物种资源200、32帧六字段合同、调试关闭、正常约9秒推进；9个明确预期404、0意外错误，非公网/ZIP解压件|
|`asset-dedup-audit.json`|05:02:24.506Z|80媒体/76唯一SHA/4解释副本PASS，无manifest元数据差异；失败稿在evidence，按既有规则不计入当前媒体库存|
|`snake/environment-after-tests.json`|05:06:03.868Z|串行测试后无匹配测试进程、无8088/8091监听，可用21.53/31.90GiB；只读快照，不保证未来资源/429状态|

公开入口旧脚本只判探测前console错误，可能漏报后续问题。本步已记录错误来源URL，只排除明确blocked路径+完整预期404文本；其他全程console错误必须FAIL，修复后单Edge重新通过。先前同名报告/截图及Node证据备份在 `work/snake-integration-backup-20261011T0440Z/`。首个受限启动的EPERM见 `snake/runtime-fail-1791694682853.json`，未冒充成功；授权重跑成功后浏览器均关闭。自己启动的服务用Ctrl-C退出，没有停止无关用户进程。

## 目视边界与剩余工作

左右32姿态夹具未见明显串格/切边，idle4朝向归一。当前蛇为角鳞人形小妖；蛇类辨识、连续流畅度和最终风格仍未批准。自然近身截图中蛇会被较大的英雄身体、伤害数字覆盖，第一张移动截帧还可能处于UI遮挡区域。绘制调用覆盖及不同像素不能推出全局可读性或高帧质量已达标。

首关八类普通怪已技术接入，下一步不重做这些同用途素材；从虎先锋、三位最终Boss专属动作、英雄最终高帧质量、整体遮挡中选择一个缺口，先查库存再推进。公网仍只有此前失败记录，本步未再尝试；当前ZIP、外部入口和微信设备不能引用本轮本地PASS。

dist保持牛版，缺狼/猴/鹿/鹰/蛇，未重建/解压重验/部署。进入本步前后SHA一致：

- `dist/xiyou-survivor-web-v1.0.0.zip`：`9c9bd515b0e8dcb5c4d4101838f1ebc3679b0f425ab31685909503c9519ae097`
- `dist/xiyou-survivor-wechat-game-v1.0.0.zip`：`f017493aaf8eeebccc1ac040ded0397a8bfcc4f8d0cbee56e6be5b04e4dec4e2`

完整运行资源与最终视觉、公网门槛未齐，未满足“全部完成就上线”。
