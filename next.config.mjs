/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath: '/project-carbon',
  assetPrefix: '/project-carbon',
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
