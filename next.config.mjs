/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  // basePath: isProd ? '/project-carbon': '/',
  // We need to reroute these in production, because sidekick already uses /api.
  assetPrefix: isProd ? '/project-carbon': '/',
  env: {
    NEXTJS_API_BASE: isProd ? '/project-carbon/api' : '/api',
    MAX_SOURCE_LEN: "5000"
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: "standalone",
}

export default nextConfig
