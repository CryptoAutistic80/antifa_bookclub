//@ts-check
import { composePlugins, withNx } from '@nx/next';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workspaceRoot = join(__dirname, '../../');
const workspaceAliases = {
  '@antifa-bookclub/api-types': join(workspaceRoot, 'libs/api-types/src/index.ts'),
  '@antifa-bookclub/config': join(workspaceRoot, 'libs/config/src/index.ts'),
  '@antifa-bookclub/core/utils': join(workspaceRoot, 'libs/core/utils/src/index.ts'),
};

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: workspaceRoot,
  transpilePackages: [
    '@antifa-bookclub/api-types',
    '@antifa-bookclub/config',
    '@antifa-bookclub/core/utils',
  ],
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api',
  },
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

const withWorkspaceAliases = (config) => ({
  ...config,
  webpack: (webpackConfig, options) => {
    const baseConfig =
      typeof config.webpack === 'function' ? config.webpack(webpackConfig, options) : webpackConfig;
    baseConfig.resolve = baseConfig.resolve ?? {};
    baseConfig.resolve.alias = {
      ...(baseConfig.resolve.alias ?? {}),
      ...workspaceAliases,
    };
    return baseConfig;
  },
});

export default composePlugins(...plugins, withWorkspaceAliases)(nextConfig);
