import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    // Existing codebase has broad lint debt; keep production builds focused on type/build validity.
    ignoreDuringBuilds: true,
  },
}
export default nextConfig
