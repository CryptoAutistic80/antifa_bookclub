/** @type {import('next').NextConfig} */
const nextConfig = {
  // Generate a pre-rendered static site in `out/`
  output: 'export',
  reactStrictMode: true,
  // Not using next/image; keep images simple for static hosting
  images: { unoptimized: true },
  // If deploying to a subpath (e.g. GitHub Pages repo):
  // basePath: '/REPO_NAME',
  // assetPrefix: '/REPO_NAME',
};

export default nextConfig;
