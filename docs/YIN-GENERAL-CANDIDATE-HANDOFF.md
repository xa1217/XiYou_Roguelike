# 寅将军动作表候选交接（REVIEW，不接入）

时间：2026-10-12T16:15Z

本次素材任务只生成一张全新、透明的首关最终 Boss 候选，未复用 `enemy-boss-kr-v1.png`、普通虎妖表或任何历史候选。候选保存于 `evidence/current/boss-assets/yin-general-v1/enemy-yin-general-battle-v1-sheet.png`。

- 尺寸：1774×887；字节：2,290,719
- SHA256：`3bcfe483529722987ed7a919c56495132fa96e1ac6d2e83a69604fc29a70d057`
- 目标布局：8 列×4 行，idle8/move8/attack8/hit4/death4；透明背景；同一虎妖、双刃、固定根点
- 预检：`evidence/current/boss-assets/yin-general-v1/asset-preflight.json`
- 预检结果：`REVIEW`。四行实际只测得 5/8/6/6 个分离区域，独立帧 25/32；首尾和武器存在边界污染/裁切风险。透明比例和可见像素归属通过，但不能据此批准完整动作表。

处理决定：候选只留在证据目录，不进入 `prototype-2d/assets/`、manifest、loader、renderer、ZIP 或公网；不再立即重试生成，以避免重复任务和 429。三 Boss 仍使用已验证的身份矢量回退，独立高帧动作继续保持未完成。

生成方式：内置 ImageGen 单次调用；输入是结构化 8×4 透明图集提示，未使用 CLI/API fallback。由于本候选未通过 alpha 隔离，不记录为动画、局内或公网 PASS。
