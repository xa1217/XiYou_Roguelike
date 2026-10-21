# 西游·八十一难 v1.0.0

当前网页试玩使用原生 Canvas：四角色、81难、十分钟割草、八件法宝。微信小游戏工程已生成，微信实机验收按用户最新要求延后。

## 启动

Node.js 20 或更高，无需 npm 安装：

```powershell
Set-Location F:\Project\Xiyou_Survivor_Commercial
npm run build
npm run serve
```

打开 `http://127.0.0.1:8088/`。WASD/方向键移动，空格闪避；鼠标或触摸拖动空白战场移动；右上暂停。法宝自动攻击，升级时三选一。五分钟中期首领、九分半最终首领；达到十分钟且击败最终首领通关。

## 验证与工程

- `npm test`：当前版本专用门禁。真实浏览器证据另见 `evidence/current/`。
- `wechat-game/`：原生微信小游戏工程，`compileType=game`。
- `wechat-miniprogram/`：附加 Canvas 小程序壳，未做工具/真机验收。
- `legacy-source/`：从最新归档保留的原项目来源，不作为当前测试或发布入口。
- `docs/REQUIREMENTS-ACCEPTANCE.md`：需求到实现与证据映射。
- `docs/FINAL-REPORT.md`：本轮交付报告，列出当前证据、外部公网失败边界和延期项。

公网临时通道必须在本地网页验收后启动；本轮外部通道真实访问返回 502，不能视为公网 PASS，详见 `docs/FINAL-REPORT.md`。
