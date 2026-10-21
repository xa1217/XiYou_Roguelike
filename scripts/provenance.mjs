import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const archive = process.env.XIYOU_SOURCE_ARCHIVE || 'D:/Projects/Xiyou_EightyOne_Calamities(1).rar';
const unrar = process.env.XIYOU_UNRAR || (fs.existsSync('D:/UnRAR.exe') ? 'D:/UnRAR.exe' : 'UnRAR.exe');
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const checkedFiles = [
  'prototype-2d/index.html',
  'prototype-2d/character-art.js',
  'prototype-2d/skills.js',
  'wechat-miniprogram/miniprogram/pages/index/index.js'
];
const checks = checkedFiles.map(file => {
  const member = ('Xiyou_EightyOne_Calamities/' + file).replaceAll('/', '\\');
  const result = spawnSync(unrar, ['p', '-inul', archive, member], { maxBuffer: 16 * 1024 * 1024 });
  if (result.error || result.status !== 0) throw new Error(`Cannot read ${member}: ${result.error?.message || result.stderr}`);
  const copiedBytes = fs.readFileSync(path.join(root, 'legacy-source', file));
  return {
    file, archiveMember: member, bytes: result.stdout.length,
    sourceHash: digest(result.stdout), copyHash: digest(copiedBytes),
    equal: result.stdout.equals(copiedBytes)
  };
});
if (checks.some(check => !check.equal)) throw new Error('Representative source file mismatch');
const stat = fs.statSync(archive);
const data = {
  checkedAt: new Date().toISOString(), sourceArchive: archive,
  sizeBytes: stat.size, modifiedAt: stat.mtime.toISOString(), sha256: digest(fs.readFileSync(archive)),
  destination: root, legacyLocation: 'legacy-source/',
  method: 'UnRAR p -inul of four explicit archive members; raw Buffer.equals and SHA256', checks,
  scope: 'Four representative copied runtime files were compared; this is not a complete inventory comparison of every archive member.',
  copyPolicyExcluded: ['source .git including unfinished merge index', 'work scratch duplicates', 'evidence/local', 'personal SSH public key'],
  result: 'PASS: all four representative source files match the source archive byte-for-byte'
};
fs.mkdirSync(path.join(root, 'evidence/current'), { recursive: true });
fs.writeFileSync(path.join(root, 'evidence/current/copy-provenance.json'), JSON.stringify(data, null, 2));
fs.writeFileSync(path.join(root, 'docs/COPY-PROVENANCE.md'), `# 最新项目复制来源\n\n源归档：\`${archive}\`\n\n大小：${stat.size} 字节；修改时间：${stat.mtime.toISOString()}\n\nSHA256：\`${data.sha256}\`\n\n独立副本：\`${root}\`。保留源游戏文件在 \`legacy-source/\`，本轮实现位于 \`prototype-2d/src/\` 与微信工程。原项目目录不由本轮脚本改写。\n\n## 实际核验\n\n${checks.map(check => `- \`${check.file}\`：${check.bytes} 字节；SHA256 \`${check.copyHash}\`；与该归档成员的原始字节相同。`).join('\n')}\n\n使用 UnRAR 的 \`p -inul\` 读取四个明确的归档成员，Node Buffer.equals 比较原始字节，并保存双方 SHA256。未解压或改写源归档。本次为四份代表性运行文件的抽样核验，不是归档所有成员的完整逐文件盘点。证据：\`evidence/current/copy-provenance.json\`。\n\n副本保留策略排除源 .git 的未完成合并、work 临时重复工程、local 临时证据和个人 SSH 公钥。旧设计文档位于 \`docs/history/\`；发布包还会按明确运行文件清单排除旧源码、测试、生成脚本与个人配置。\n`);
console.log(data.result);
