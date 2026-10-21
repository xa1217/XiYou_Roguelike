import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const folder = path.resolve(root, process.argv[2] || 'missing-candidate-folder');
if (!folder.startsWith(path.join(root, 'evidence/current/wujing-layout') + path.sep)) throw new Error('Expected Wujing layout evidence folder');
const relative = file => path.relative(root, file).replaceAll('\\', '/');
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const baseline = read(relative(path.join(folder, 'baseline.json')));
const preflightFile = fs.readdirSync(folder).find(name => /^preflight-.*\.json$/.test(name));
const browserFolders = fs.readdirSync(folder).filter(name => name.startsWith('browser-')).sort();
const browserFolder = browserFolders.at(-1);
const preflight = read(relative(path.join(folder, preflightFile)));
const browser = read(relative(path.join(folder, browserFolder, 'browser.json')));
const changedProtected = [];
for (const [file, before] of Object.entries(baseline.protected)) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) changedProtected.push({ file, before, after: null, reason: 'missing' });
  else {
    const after = sha(full);
    if (after !== before) changedProtected.push({ file, before, after, reason: 'changed' });
  }
}
const npmTail = fs.readFileSync(path.join(folder, 'npm-test.txt'), 'utf8').split(/\r?\n/).filter(Boolean).slice(-8);
const audit = read('evidence/current/asset-dedup-audit.json');
const candidatePath = path.join(folder, 'hero-wujing-layout-v1-candidate.png');
const sourcePath = path.join(root, baseline.original);
const report = {
  generatedAt: new Date().toISOString(),
  scope: 'Immutable handoff for one Wujing layout-edit candidate; no production integration or release claim',
  candidate: {
    file: relative(candidatePath), sha256: sha(candidatePath), bytes: fs.statSync(candidatePath).size,
    dimensions: [preflight.width, preflight.height],
    preflight: relative(path.join(folder, preflightFile)), preflightResult: preflight.result,
    browser: relative(path.join(folder, browserFolder, 'browser.json')), browserResult: browser.result,
    browserVersion: browser.browserVersion, previewChecksPassed: browser.previewChecksPassed,
    screenshots: browser.screenshots.map(item => item.file),
  },
  source: {
    file: baseline.original, sha256: sha(sourcePath), bytes: fs.statSync(sourcePath).size,
    originalSha256Before: baseline.originalSha256, unchanged: sha(sourcePath) === baseline.originalSha256,
    manifestMatchesBeforeEdit: baseline.manifestMatches,
  },
  review: {
    rowCounts: preflight.measurements.map(item => ({ alphaGreaterThan: item.alphaGreaterThan, rows: item.rowCounts, majorComponents: item.majorComponents })),
    alpha8ForeignMajorPixels: preflight.measurements.find(item => item.alphaGreaterThan === 8).candidates.map(item => ({ index: item.index, tight: item.tight.foreignMajorPixels, padded: item.padded.foreignMajorPixels })),
    alpha8EqualCellComplete: preflight.measurements.find(item => item.alphaGreaterThan === 8).allEqualCellsContainWholeMajor,
    alpha8Margins30: preflight.measurements.find(item => item.alphaGreaterThan === 8).allEqualCellsHaveRequestedMargins,
    independentReview: { completed: false, reason: '429 then 503 auth_unavailable; retries stopped and no independent approval claimed' },
  },
  regression: {
    npmTestLog: relative(path.join(folder, 'npm-test.txt')), npmTail,
    npmTestPass: npmTail.some(line => line.includes('VALIDATE PASS:')),
    assetAudit: 'evidence/current/asset-dedup-audit.json', assetAuditResult: audit.result,
    protectedCount: Object.keys(baseline.protected).length, changedProtected,
    candidateEvidenceIntact: fs.existsSync(path.join(folder, 'generation.json')) && fs.existsSync(path.join(folder, 'prompt.txt')),
  },
  gates: {
    candidateLayoutPassed: false, runtimeApproved: false, highFrameApproved: false,
    productionSourceChanged: false, publicOrReleaseApproved: false, deploy: false,
  },
  conclusion: 'REVIEW_LAYOUT_CONSTRAINTS_NOT_MET: preserve candidate and failures; do not replace runtime Wujing sheet. A new source-level art/layout solution is required before fixed-root integration; this does not supply new high-frame poses.',
};
const out = path.join(folder, `handoff-verification-${new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')}.json`);
fs.writeFileSync(out, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ output: relative(out), candidateResult: preflight.result, browserResult: browser.result, sourceUnchanged: report.source.unchanged, changedProtected: changedProtected.length, audit: audit.result, candidateLayoutPassed: false }, null, 2));
