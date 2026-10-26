// ─── Tracking Utilities ─────────────────────────────────────
// UTM links, QR codes, promo codes, short links
import { getPlatform } from "./platforms"

export function buildUtmLink(params: {
  baseUrl: string
  source: string
  medium: string
  campaign: string
  term?: string
  content?: string
}): string {
  const url = new URL(params.baseUrl)
  url.searchParams.set("utm_source", params.source)
  url.searchParams.set("utm_medium", params.medium)
  url.searchParams.set("utm_campaign", params.campaign)
  if (params.term) url.searchParams.set("utm_term", params.term)
  if (params.content) url.searchParams.set("utm_content", params.content)
  return url.toString()
}

export function generatePromoCode(prefix: string, length: number = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = prefix.toUpperCase() + "-"
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function generateShortCode(length: number = 7): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789"
  let code = ""
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Generate a QR code data URL using a simple API (no heavy dependency)
export function getQrCodeUrl(data: string, size: number = 200): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`
}

// ─── Platform-specific variant generation ───────────────────
export function generateVariantCaption(masterCaption: string, platform: string): string {
  switch (platform) {
    case "twitter":
      // Truncate to 280 chars, add relevant hashtags
      return masterCaption.length > 250
        ? masterCaption.substring(0, 247) + "..."
        : masterCaption
    case "sms":
      // Truncate to 160 chars with CTA
      return masterCaption.length > 140
        ? masterCaption.substring(0, 137) + "..."
        : masterCaption
    case "youtube":
    case "youtube_shorts":
      return masterCaption // Full description
    case "instagram":
      // Add hashtag formatting
      return masterCaption
    case "whatsapp":
      // Message format with emoji-friendly text
      return masterCaption
    default: {
      // Keep within the platform's caption limit (e.g. Bluesky 300, Threads 500)
      const max = getPlatform(platform)?.maxCaption
      return max && masterCaption.length > max ? masterCaption.substring(0, max - 3) + "..." : masterCaption
    }
  }
}

export function getRecommendedFormat(platform: string): string {
  const formats: Record<string, string> = {
    instagram: "1:1",
    facebook: "16:9",
    youtube: "16:9",
    youtube_shorts: "9:16",
    tiktok: "9:16",
    twitter: "16:9",
    linkedin: "1:1",
    threads: "4:5",
    pinterest: "2:3",
    bluesky: "16:9",
    reddit: "16:9",
  }
  return formats[platform] || "1:1"
}
