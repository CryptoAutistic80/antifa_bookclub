/** @type {import('next').NextConfig} */
const nextConfig = {
  // Generate a pre-rendered static site in `out/`
  output: 'export',
  reactStrictMode: true,
  // Not using next/image; keep images simple for static hosting
  images: { unoptimized: true },
  // Deploying to GitHub Pages subpath
  basePath: '/antifa_bookclub',
  assetPrefix: '/antifa_bookclub',
  // Disable ESLint during build to avoid configuration warnings
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
