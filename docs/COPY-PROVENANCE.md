# 最新项目复制来源

源归档：`D:/Projects/Xiyou_EightyOne_Calamities(1).rar`

大小：237627562 字节；修改时间：2026-10-03T03:38:33.187Z

SHA256：`d4e628b18903e8af08b48ee159ef57b9af720994203f21324828af78a05741e9`

独立副本：`D:\Projects\Xiyou_Survivor_Commercial`。保留源游戏文件在 `legacy-source/`，本轮实现位于 `prototype-2d/src/` 与微信工程。原项目目录不由本轮脚本改写。

## 实际核验

- `prototype-2d/index.html`：105622 字节；SHA256 `0b8b17e7e4cc047fcb29da8391ab0e894c2ab4726ba3e1f21bf5b45c1d00e1ab`；与该归档成员的原始字节相同。
- `prototype-2d/character-art.js`：15364 字节；SHA256 `08938a8959bc2e116647cad95eb3bfe5bdc858aa8096e2a9583072260e67f947`；与该归档成员的原始字节相同。
- `prototype-2d/skills.js`：8742 字节；SHA256 `499b518f0bf6044925f6216cc3f15c5ff4c06ba53d7ed9cdcba6254f7ee4ea2c`；与该归档成员的原始字节相同。
- `wechat-miniprogram/miniprogram/pages/index/index.js`：65688 字节；SHA256 `cd09f24f6cf5e438e70f741272c9fa6edb5c867e3c41ee51c6f44bb063593614`；与该归档成员的原始字节相同。

使用 UnRAR 的 `p -inul` 读取四个明确的归档成员，Node Buffer.equals 比较原始字节，并保存双方 SHA256。未解压或改写源归档。本次为四份代表性运行文件的抽样核验，不是归档所有成员的完整逐文件盘点。证据：`evidence/current/copy-provenance.json`。

副本保留策略排除源 .git 的未完成合并、work 临时重复工程、local 临时证据和个人 SSH 公钥。旧设计文档位于 `docs/history/`；发布包还会按明确运行文件清单排除旧源码、测试、生成脚本与个人配置。
