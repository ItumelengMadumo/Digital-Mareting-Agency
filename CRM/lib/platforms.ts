// Every social platform SocialSync can publish to, in one place. All of these are supported by
// Upload-Post, so connecting each one is the same flow. Icons live in components/platform-icon.tsx.
// Confirm limits against each platform's current docs when they change.

export type ContentKind = "short-video" | "image" | "text" | "long-video" | "link"

export type SocialPlatformId =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "youtube"
  | "twitter"
  | "linkedin"
  | "threads"
  | "pinterest"
  | "bluesky"
  | "reddit"

export interface SocialPlatform {
  /** Stored on variants and accounts. X keeps the id "twitter" so existing posts still match. */
  id: SocialPlatformId
  label: string
  /** Tailwind text colour for the brand icon. */
  color: string
  /** Brand colour for tinted backgrounds (hex). */
  brand: string
  group: "popular" | "more"
  maxCaption: number
  /** Platforms that need a title on every post, and its limit. */
  title?: { required: boolean; max: number; label: string }
  contentKinds: ContentKind[]
  /** True when a photo or video is required (no text-only posts). */
  needsMedia: boolean
  capabilities: string[]
  setupNote: string
  /** Shown on the account card when connecting or posting has a catch. */
  warning?: string
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: "instagram",
    label: "Instagram",
    color: "text-pink-600",
    brand: "#E4405F",
    group: "popular",
    maxCaption: 2200,
    contentKinds: ["short-video", "image"],
    needsMedia: true,
    capabilities: ["Reels", "Photos", "Carousels"],
    setupNote: "Needs a Creator or Business account (free to switch in the app).",
  },
  {
    id: "facebook",
    label: "Facebook",
    color: "text-blue-600",
    brand: "#0866FF",
    group: "popular",
    maxCaption: 5000,
    contentKinds: ["short-video", "image", "text", "long-video", "link"],
    needsMedia: false,
    capabilities: ["Any content", "Links", "Long video"],
    setupNote: "Posts go to a Facebook Page, not a personal profile.",
  },
  {
    id: "tiktok",
    label: "TikTok",
    color: "text-slate-900",
    brand: "#000000",
    group: "popular",
    maxCaption: 2200,
    contentKinds: ["short-video", "image"],
    needsMedia: true,
    capabilities: ["Short video", "Photo mode"],
    setupNote: "Vertical 9:16 video works best.",
  },
  {
    id: "youtube",
    label: "YouTube",
    color: "text-red-600",
    brand: "#FF0000",
    group: "popular",
    maxCaption: 5000,
    title: { required: true, max: 100, label: "Video title" },
    contentKinds: ["short-video", "long-video"],
    needsMedia: true,
    capabilities: ["Shorts", "Long-form video"],
    setupNote: "Video only, and every upload needs a title.",
  },
  {
    id: "twitter",
    label: "X (Twitter)",
    color: "text-slate-900",
    brand: "#000000",
    group: "popular",
    maxCaption: 280,
    contentKinds: ["text", "image", "short-video", "link"],
    needsMedia: false,
    capabilities: ["Text", "Images", "Short video", "Links"],
    setupNote: "Posts are limited to 280 characters.",
    warning: "X charges for API posting, so X publishing will be a paid add-on.",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    color: "text-sky-700",
    brand: "#0A66C2",
    group: "more",
    maxCaption: 3000,
    contentKinds: ["text", "image", "short-video", "long-video", "link"],
    needsMedia: false,
    capabilities: ["Professional", "Video", "Links"],
    setupNote: "Post to your profile or a company page.",
  },
  {
    id: "threads",
    label: "Threads",
    color: "text-slate-900",
    brand: "#000000",
    group: "more",
    maxCaption: 500,
    contentKinds: ["text", "image", "short-video", "link"],
    needsMedia: false,
    capabilities: ["Text", "Images", "Video"],
    setupNote: "Uses your Instagram account to sign in.",
  },
  {
    id: "pinterest",
    label: "Pinterest",
    color: "text-red-700",
    brand: "#BD081C",
    group: "more",
    maxCaption: 500,
    title: { required: false, max: 100, label: "Pin title" },
    contentKinds: ["image", "short-video"],
    needsMedia: true,
    capabilities: ["Pins", "Video pins", "Links"],
    setupNote: "Needs a Pinterest business account and a board to pin to.",
  },
  {
    id: "bluesky",
    label: "Bluesky",
    color: "text-sky-500",
    brand: "#1185FE",
    group: "more",
    maxCaption: 300,
    contentKinds: ["text", "image", "short-video", "link"],
    needsMedia: false,
    capabilities: ["Text", "Images", "Video"],
    setupNote: "Posts are limited to 300 characters.",
  },
  {
    id: "reddit",
    label: "Reddit",
    color: "text-orange-600",
    brand: "#FF4500",
    group: "more",
    maxCaption: 40000,
    title: { required: true, max: 300, label: "Post title" },
    contentKinds: ["text", "image", "short-video", "link"],
    needsMedia: false,
    capabilities: ["Text posts", "Images", "Links"],
    setupNote: "Every post needs a title and a subreddit that allows it.",
  },
]

const BY_ID = new Map<string, SocialPlatform>(SOCIAL_PLATFORMS.map((p) => [p.id, p]))
// Older data and names that map onto a current platform.
BY_ID.set("x", BY_ID.get("twitter")!)
BY_ID.set("youtube_shorts", BY_ID.get("youtube")!)

export function getPlatform(id: string): SocialPlatform | undefined {
  return BY_ID.get(id)
}

export function platformLabel(id: string) {
  return getPlatform(id)?.label ?? id.replace(/_/g, " ")
}

export function platformsFor(kind: ContentKind) {
  return SOCIAL_PLATFORMS.filter((p) => p.contentKinds.includes(kind))
}
