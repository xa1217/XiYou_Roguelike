import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const runtimeNodeModules = path.resolve(
  process.env.CODEX_NODE_MODULES || path.join(
    process.env.USERPROFILE || '', '.cache', 'codex-runtimes', 'codex-primary-runtime',
    'dependencies', 'node', 'node_modules'
  )
);

export async function loadPlaywright() {
  const candidates = [
    process.env.PLAYWRIGHT_MODULE,
    'playwright',
    path.join(runtimeNodeModules, 'playwright', 'index.js'),
    'C:/Users/wangxr/.codex/skills/playwright-skill/node_modules/playwright/index.js',
  ].filter(Boolean);
  const failures = [];
  for (const candidate of candidates) {
    try {
      if (candidate !== 'playwright' && !fs.existsSync(candidate)) continue;
      const imported = candidate === 'playwright'
        ? await import('playwright')
        : await import(pathToFileURL(candidate));
      return imported.default || imported;
    } catch (error) {
      failures.push(`${candidate}: ${error.message}`);
    }
  }
  throw new Error(`Playwright module unavailable. Set PLAYWRIGHT_MODULE to an installed module. ${failures.join(' | ')}`);
}

export const browserLaunchOptions = () => {
  const configuredChannel = process.env.BROWSER_CHANNEL;
  const channel = configuredChannel === 'none' ? '' : (configuredChannel || (process.platform === 'win32' ? 'msedge' : ''));
  return channel ? { headless: true, channel } : { headless: true };
};
