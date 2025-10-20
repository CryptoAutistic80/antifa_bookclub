/** @type {import('next').NextConfig} */
const nextConfig = {
  // Generate a pre-rendered static site in `out/`
  output: 'export',
  reactStrictMode: true,
  // Not using next/image; keep images simple for static hosting
  images: { unoptimized: true },
  // Disable ESLint during build to avoid configuration warnings
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
