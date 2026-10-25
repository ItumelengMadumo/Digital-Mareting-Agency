/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: "/dashboard/create-post", destination: "/dashboard/compose", permanent: true },
      { source: "/dashboard/platforms", destination: "/dashboard/accounts", permanent: true },
      { source: "/dashboard/communications", destination: "/dashboard/comms/log", permanent: true },
    ]
  },
}

export default nextConfig
