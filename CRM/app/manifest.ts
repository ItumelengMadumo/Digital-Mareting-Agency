import type { MetadataRoute } from "next"

// Lets SocialSync be added to a phone's home screen and open full-screen like an app.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SocialSync",
    short_name: "SocialSync",
    description: "Post once, go live everywhere.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#3b82f6",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  }
}
