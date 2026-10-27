/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets a verification build run beside `npm run dev` without overwriting its .next folder.
  distDir: process.env.NEXT_DIST_DIR || ".next",
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
      // Short links people type or share, e.g. /compose -> /dashboard/compose
      ...["compose", "posts", "calendar", "media", "accounts", "profile", "settings"].map((page) => ({
        source: `/${page}`,
        destination: `/dashboard/${page}`,
        permanent: false,
      })),
      { source: "/app", destination: "/dashboard", permanent: false },
      { source: "/login", destination: "/auth/login", permanent: false },
      { source: "/signin", destination: "/auth/login", permanent: false },
      { source: "/signup", destination: "/auth/register", permanent: false },
      { source: "/register", destination: "/auth/register", permanent: false },
    ]
  },
}

export default nextConfig
