#!/usr/bin/env node
const { spawnSync } = require('node:child_process');

if (process.env.NX_TASK_TARGET_PROJECT === 'anti_fascist_3d_site') {
  console.log('Skipping root build; handled by dependent targets.');
  process.exit(0);
}

const run = (args) =>
  spawnSync('pnpm', ['exec', ...args], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

const result = run(['nx', 'run', 'frontend:build']);

if ((result.status ?? 0) !== 0) {
  console.warn(
    'Nx build failed; falling back to direct `pnpm exec next build apps/frontend`.',
  );
  const fallback = run(['next', 'build', 'apps/frontend']);
  process.exit(fallback.status ?? 0);
}

process.exit(result.status ?? 0);
