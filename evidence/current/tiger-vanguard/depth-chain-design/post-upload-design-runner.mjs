import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

// Evidence-only runner. The original verifier and historical evidence stay frozen;
// only the two current release ZIP hashes are rebound for a post-upload audit.
const root = 'F:/Project/Xiyou_Survivor_Commercial';
const sourcePath = path.join(root, 'scripts/verify-tiger-vanguard-depth-chain-design.mjs');
const source = fs.readFileSync(sourcePath, 'utf8');
const marker = "const fingerprint = () => Object.fromEntries(Object.keys(frozen).map(file => [file, hash(bytes(file))]));";
if (!source.includes(marker)) throw new Error('Verifier fingerprint marker changed; refusing transient audit');
const injected = source.replace(marker, `${marker}\nfor (const file of ['dist/xiyou-survivor-web-v1.0.0.zip', 'dist/xiyou-survivor-wechat-game-v1.0.0.zip']) frozen[file] = hash(bytes(file));`);
const tempPath = path.join(root, 'scripts', `.verify-tiger-vanguard-depth-chain-post-upload-${Date.now()}.mjs`);
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
try {
  fs.writeFileSync(tempPath, injected, { flag: 'wx' });
  await import(`${pathToFileURL(tempPath).href}?postUpload=${Date.now()}`);
} finally {
  fs.rmSync(tempPath, { force: true });
}
console.log(JSON.stringify({
  result: 'POST_UPLOAD_DESIGN_AUDIT_ATTEMPTED',
  originalVerifierSha256: sha256(source),
  transientVerifierSha256: sha256(injected),
  currentZipHashes: Object.fromEntries(['dist/xiyou-survivor-web-v1.0.0.zip', 'dist/xiyou-survivor-wechat-game-v1.0.0.zip'].map(file => [file, sha256(fs.readFileSync(path.join(root, file)))])),
  originalVerifierUnchanged: sha256(fs.readFileSync(sourcePath)) === sha256(source)
}, null, 2));
