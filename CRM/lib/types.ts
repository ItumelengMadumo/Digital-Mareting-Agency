// ─── Core System Model ─────────────────────────────────────
// Campaign → Content → Variants → Distribution → Tracking → Analytics → Optimization

// ─── Workspace Types ────────────────────────────────────────
export type WorkspaceType = "individual" | "freelancer" | "business" | "agency"
export type MemberRole = "owner" | "admin" | "manager" | "member"

export interface Workspace {
  id: string
  name: string
  type: WorkspaceType
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface WorkspaceMember {
  id: string
  workspaceId: string
  userId: string
  role: MemberRole
  user?: User
}

// ─── User ───────────────────────────────────────────────────
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
  phone?: string
}

// ─── Client ─────────────────────────────────────────────────
export interface Client {
  id: string
  workspaceId: string
  name: string
  email?: string
  phone?: string
  company?: string
  industry?: string
  notes?: string
}

// ─── Campaign Engine ────────────────────────────────────────
export type CampaignGoal = "awareness" | "sales" | "engagement" | "traffic" | "leads"
export type CampaignType = "social" | "influencer" | "offline" | "email" | "sms" | "ppc" | "mixed"
export type CampaignStatus = "draft" | "active" | "paused" | "completed" | "archived"

export interface Campaign {
  id: string
  workspaceId: string
  clientId?: string
  name: string
  goal: CampaignGoal
  type: CampaignType
  budget?: number
  platforms: string[]
  startDate?: string
  endDate?: string
  status: CampaignStatus
  createdAt: string
  updatedAt: string
  client?: Client
  _count?: {
    contents: number
    distributions: number
  }
}

// ─── Content Engine ─────────────────────────────────────────
export type MediaType = "image" | "video" | "text" | "link"
export type ContentStatus = "draft" | "ready" | "published" | "archived"

export interface Content {
  id: string
  workspaceId: string
  campaignId?: string
  captionMaster: string
  mediaUrl?: string
  mediaType?: MediaType
  hashtags?: string
  link?: string
  status: ContentStatus
  scheduledAt?: string
  createdAt: string
  campaign?: Campaign
  variants?: Variant[]
}

// ─── Variant Engine ─────────────────────────────────────────
export type Platform =
  | "instagram"
  | "facebook"
  | "youtube"
  | "youtube_shorts"
  | "tiktok"
  | "twitter"
  | "linkedin"
  | "threads"
  | "pinterest"
  | "bluesky"
  | "reddit"
  | "whatsapp"
  | "sms"
  | "email"

export type VariantFormat = "9:16" | "1:1" | "16:9" | "4:5" | "2:3"
export type VariantStatus = "pending" | "ready" | "published" | "failed"

export interface Variant {
  id: string
  contentId: string
  platform: Platform
  caption: string
  mediaUrl?: string
  format?: VariantFormat
  title?: string
  seoTags?: string
  status: VariantStatus
}

// Platform transformation rules
export const PLATFORM_RULES: Record<Platform, { label: string; formats: VariantFormat[]; maxCaption: number; features: string[] }> = {
  instagram:      { label: "Instagram",      formats: ["1:1", "4:5", "9:16"], maxCaption: 2200,  features: ["reel", "hashtags", "story"] },
  facebook:       { label: "Facebook",       formats: ["16:9", "1:1"],        maxCaption: 63206, features: ["full_caption", "scheduling"] },
  youtube:        { label: "YouTube",        formats: ["16:9"],               maxCaption: 5000,  features: ["seo", "tags", "description"] },
  youtube_shorts: { label: "YouTube Shorts", formats: ["9:16"],               maxCaption: 100,   features: ["short_form"] },
  tiktok:         { label: "TikTok",         formats: ["9:16"],               maxCaption: 2200,  features: ["short_form", "sounds"] },
  twitter:        { label: "X (Twitter)",      formats: ["16:9", "1:1"],        maxCaption: 280,   features: ["thread", "poll"] },
  linkedin:       { label: "LinkedIn",       formats: ["1:1", "16:9"],        maxCaption: 3000,  features: ["professional", "articles"] },
  threads:        { label: "Threads",        formats: ["1:1", "4:5", "9:16"], maxCaption: 500,   features: ["short_form"] },
  pinterest:      { label: "Pinterest",      formats: ["2:3", "1:1"], maxCaption: 500, features: ["pins", "links"] },
  bluesky:        { label: "Bluesky",        formats: ["16:9", "1:1"],        maxCaption: 300,   features: ["short_form"] },
  reddit:         { label: "Reddit",         formats: ["16:9", "1:1"],        maxCaption: 40000, features: ["title", "subreddit"] },
  whatsapp:       { label: "WhatsApp",       formats: [],                     maxCaption: 1000,  features: ["message_format"] },
  sms:            { label: "SMS",            formats: [],                     maxCaption: 160,   features: ["text_cta"] },
  email:          { label: "Email",          formats: [],                     maxCaption: 99999, features: ["html", "subject", "attachments"] },
}

// ─── Distribution Engine ────────────────────────────────────
export type DistributionMethod = "auto" | "assisted"
export type DistributionStatus = "pending" | "queued" | "publishing" | "published" | "failed" | "assisted_ready"

// Platform → distribution method mapping
export const PLATFORM_DISTRIBUTION: Record<Platform, { canAuto: boolean; requiresBusinessAccount?: boolean; assistedFlow?: string[] }> = {
  instagram:      { canAuto: true, requiresBusinessAccount: true, assistedFlow: ["copy_caption", "download_media", "open_instagram"] },
  facebook:       { canAuto: true },
  youtube:        { canAuto: true },
  youtube_shorts: { canAuto: true },
  tiktok:         { canAuto: true, assistedFlow: ["copy_caption", "download_media", "open_tiktok"] },
  twitter:        { canAuto: true },
  linkedin:       { canAuto: true },
  threads:        { canAuto: true },
  pinterest:      { canAuto: true, requiresBusinessAccount: true },
  bluesky:        { canAuto: true },
  reddit:         { canAuto: true },
  whatsapp:       { canAuto: false, assistedFlow: ["open_chat", "prefill_message"] },
  sms:            { canAuto: true },
  email:          { canAuto: true },
}

export interface Distribution {
  id: string
  variantId: string
  campaignId?: string
  platform: string
  method: DistributionMethod
  status: DistributionStatus
  publishedAt?: string
  externalId?: string
  errorMsg?: string
}

// ─── Social Accounts ────────────────────────────────────────
export type AccountType = "personal" | "business" | "creator"

export interface SocialAccount {
  id: string
  workspaceId: string
  platform: Platform
  accountType: AccountType
  accountName: string
  followers: number
  isConnected: boolean
  lastSyncAt?: string
}

// ─── Analytics ──────────────────────────────────────────────
export interface CampaignMetric {
  id: string
  campaignId: string
  platform: string
  impressions: number
  clicks: number
  engagement: number
  conversions: number
  spend: number
  revenue: number
  date: string
}

export interface UnifiedMetrics {
  impressions: number
  clicks: number
  engagement: number
  conversions: number
  roi: number
  spend: number
  revenue: number
  byPlatform: Record<string, CampaignMetric>
  byChannel: { social: number; messaging: number; email: number; offline: number }
}

// ─── Leads ──────────────────────────────────────────────────
export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost"
export type LeadSource = "website" | "referral" | "social" | "ad" | "cold_call" | "event"

export interface Lead {
  id: string
  workspaceId: string
  name: string
  email?: string
  phone?: string
  company?: string
  position?: string
  source?: LeadSource
  status: LeadStatus
  value?: number
  notes?: string
  assignedTo?: string
  createdAt: string
}

export interface CommunicationRecord {
  id: string
  leadId: string
  type: "email" | "sms" | "whatsapp" | "call" | "video"
  subject?: string
  body?: string
  outcome?: string
  direction: "inbound" | "outbound"
  createdAt: string
}

// ─── Products & Deals ───────────────────────────────────────
export interface Product {
  id: string
  workspaceId: string
  name: string
  description?: string
  price: number
  category?: string
  status: "active" | "inactive" | "archived"
}

export interface Deal {
  id: string
  leadId: string
  productId: string
  value: number
  status: "open" | "won" | "lost"
}

// ─── Automation Engine ──────────────────────────────────────
export type AutomationTrigger = "booking_created" | "invoice_overdue" | "campaign_launched" | "lead_created" | "lead_status_changed"
export type AutomationAction = "send_whatsapp" | "send_sms" | "send_email" | "create_task" | "update_lead"

export interface AutomationRule {
  id: string
  workspaceId: string
  name: string
  trigger: AutomationTrigger
  conditions?: Record<string, unknown>
  action: AutomationAction
  actionConfig: Record<string, unknown>
  isActive: boolean
  _count?: { automationLogs: number }
}

export interface AutomationLog {
  id: string
  ruleId: string
  status: "triggered" | "success" | "failed"
  payload?: Record<string, unknown>
  errorMsg?: string
  executedAt: string
}

// ─── Tracking Layer ─────────────────────────────────────────
export type TrackingType = "utm_link" | "qr_code" | "promo_code" | "short_link" | "call_number"

export interface TrackingAsset {
  id: string
  workspaceId: string
  type: TrackingType
  name: string
  value: string
  campaignId?: string
  clicks: number
  conversions: number
}

// ─── Influencer Module ──────────────────────────────────────
export interface InfluencerCampaign {
  id: string
  campaignId: string
  totalBudget?: number
  campaign?: Campaign
  influencers?: InfluencerAssignment[]
}

export interface InfluencerAssignment {
  id: string
  influencerCampaignId: string
  influencerName: string
  influencerHandle: string
  platform: string
  deliverables: string[]
  trackingLink?: string
  payoutAmount?: number
  payoutStatus: "pending" | "paid" | "cancelled"
  postCount: number
  impressions: number
  engagement: number
}

// ─── Affiliate Module ───────────────────────────────────────
export interface AffiliateProfile {
  id: string
  userId: string
  referralCode: string
  commissionRate: number
  totalEarnings: number
}

export interface AffiliateConversion {
  id: string
  affiliateId: string
  amount: number
  commission: number
  status: "pending" | "approved" | "paid" | "rejected"
  createdAt: string
}

// ─── SEO Module ─────────────────────────────────────────────
export interface SEOKeyword {
  id: string
  workspaceId: string
  keyword: string
  volume?: number
  difficulty?: number
  currentRank?: number
  targetRank?: number
  url?: string
}

// ─── PPC Module ─────────────────────────────────────────────
export interface PPCCampaignData {
  id: string
  workspaceId: string
  platform: "google_ads" | "meta_ads"
  externalId?: string
  name: string
  budget: number
  spend: number
  clicks: number
  impressions: number
  conversions: number
  cpc?: number
  ctr?: number
  roi?: number
  status: "active" | "paused" | "ended"
}

// ─── Offline Marketing ──────────────────────────────────────
export interface OfflineCampaignData {
  id: string
  campaignId: string
  channel: "tv" | "radio" | "billboard" | "print" | "event"
  location?: string
  airDate?: string
  qrCodeUrl?: string
  shortLink?: string
  promoCode?: string
  callNumber?: string
  scans: number
  calls: number
  redemptions: number
}

// ─── Monetization Tiers ─────────────────────────────────────
export const PRICING_TIERS = {
  individual: {
    name: "Individual",
    price: { monthly: 15, annually: 144 },
    features: [
      "Assisted posting",
      "Up to 3 social accounts",
      "5 campaigns per month",
      "Basic analytics",
      "Email support",
      "Mobile access (PWA)",
    ],
  },
  freelancer: {
    name: "Freelancer",
    price: { monthly: 35, annually: 336 },
    features: [
      "Everything in Individual",
      "Up to 5 clients",
      "10 social accounts",
      "Unlimited campaigns",
      "Scheduling & calendar",
      "SMS & Email marketing",
      "Priority support",
    ],
  },
  business: {
    name: "Business",
    price: { monthly: 79, annually: 756 },
    features: [
      "Everything in Freelancer",
      "Team management",
      "25 social accounts",
      "Automation engine",
      "Advanced analytics & reports",
      "PPC integration",
      "API access",
    ],
  },
  agency: {
    name: "Agency",
    price: { monthly: 149, annually: 1428 },
    features: [
      "Everything in Business",
      "Unlimited clients",
      "Unlimited social accounts",
      "Influencer module",
      "Affiliate system",
      "Offline campaign tracking",
      "Advanced reporting & white-label",
      "Dedicated account manager",
    ],
  },
} as const
