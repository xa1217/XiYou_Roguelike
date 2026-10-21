import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'evidence', 'current', 'asset-dedup-audit.json');
const extensions = new Set(['.png', '.svg', '.wav', '.webp', '.jpg', '.jpeg', '.gif']);
const ignoredDirectories = new Set(['.git', 'evidence', 'dist', 'tmp', 'work', 'node_modules']);
const files = [];

function walk(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || ignoredDirectories.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (extensions.has(path.extname(entry.name).toLowerCase())) files.push(full);
  }
}

walk(root);
const digestGroups = new Map();
const inventory = files.sort().map(file => {
  const bytes = fs.readFileSync(file);
  const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  const relative = path.relative(root, file).replaceAll(path.sep, '/');
  const item = { path: relative, bytes: bytes.length, sha256 };
  const group = digestGroups.get(sha256) || [];
  group.push(item);
  digestGroups.set(sha256, group);
  return item;
});

const duplicateGroups = [...digestGroups.entries()]
  .filter(([, group]) => group.length > 1)
  .map(([sha256, group]) => ({
    sha256,
    files: group,
    classification: group.some(item => item.path.startsWith('legacy-source/'))
      ? 'legacy mirror; not a current runtime duplicate'
      : group.some(item => item.path.includes('wechat-game/illustrations/'))
        ? 'package copy of a source illustration; intentional'
        : group.some(item => item.path.includes('map-doublefork-v4-high-ridge-candidate.png'))
          ? 'traceability candidate copied byte-for-byte; do not regenerate'
          : 'review before any reuse or generation',
  }));

const manifestPath = path.join(root, 'prototype-2d', 'assets', 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const manifestPaths = new Set((manifest.assets || []).map(item => item.path));
const currentAssetPaths = new Set(inventory
  .filter(item => item.path.startsWith('prototype-2d/assets/'))
  .map(item => item.path.slice('prototype-2d/assets/'.length)));
const inventoryByPath = new Map(inventory.map(item => [item.path, item]));
const pngDimensions = file => {
  if (!file || path.extname(file).toLowerCase() !== '.png') return null;
  const bytes = fs.readFileSync(file);
  if (bytes.toString('ascii', 1, 4) !== 'PNG') return null;
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
};
const manifestMetadataMismatches = [];
for (const entry of manifest.assets || []) {
  const relative = `prototype-2d/assets/${entry.path}`;
  const item = inventoryByPath.get(relative);
  if (!item) continue;
  const dimensions = pngDimensions(path.join(root, relative));
  if (Array.isArray(entry.size) && dimensions
    && (entry.size[0] !== dimensions.width || entry.size[1] !== dimensions.height)) {
    manifestMetadataMismatches.push({ path: entry.path, field: 'size', declared: entry.size, actual: [dimensions.width, dimensions.height] });
  }
  if (entry.bytes != null && entry.bytes !== item.bytes) {
    manifestMetadataMismatches.push({ path: entry.path, field: 'bytes', declared: entry.bytes, actual: item.bytes });
  }
  if (entry.sha256 && entry.sha256.toLowerCase() !== item.sha256) {
    manifestMetadataMismatches.push({ path: entry.path, field: 'sha256', declared: entry.sha256, actual: item.sha256 });
  }
}

const result = {
  generatedAt: new Date().toISOString(),
  policy: 'Reuse an existing asset when it satisfies the requirement; generate only a demonstrably new asset after hash, dimensions, purpose and runtime-reference review.',
  scannedExtensions: [...extensions],
  scannedFileCount: inventory.length,
  uniqueSha256Count: digestGroups.size,
  duplicateGroupCount: duplicateGroups.length,
  duplicateGroups,
  manifest: {
    path: 'prototype-2d/assets/manifest.json',
    declaredAssetCount: manifest.assets?.length || 0,
    declaredButMissingFromCurrentAssetDirectory: [...manifestPaths].filter(item => !currentAssetPaths.has(item)),
    metadataMismatches: manifestMetadataMismatches,
  },
  inventory,
  result: duplicateGroups.every(group => group.classification !== 'review before any reuse or generation')
    && manifestMetadataMismatches.length === 0 ? 'PASS' : 'REVIEW',
  note: 'This audit hashes existing files only. It does not generate, download, rasterize, rename or rewrite any asset.',
};

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(result, null, 2));
console.log(JSON.stringify({
  output: path.relative(root, output).replaceAll(path.sep, '/'),
  scannedFileCount: result.scannedFileCount,
  uniqueSha256Count: result.uniqueSha256Count,
  duplicateGroupCount: result.duplicateGroupCount,
  result: result.result,
}, null, 2));
if (result.result !== 'PASS') process.exitCode = 1;
