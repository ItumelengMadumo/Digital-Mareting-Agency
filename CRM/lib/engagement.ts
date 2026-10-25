// Likes and comments come from each platform's own API (Meta Graph, TikTok, YouTube Data), which
// need app approval. Until a provider is connected, every lookup returns null and the UI shows a
// "Connect analytics" state instead of numbers. Plug real providers in here; the UI won't change.

export interface PostComment {
  id: string
  author: string
  text: string
  at: string
  platform: string
}

export interface PostEngagement {
  likes: number
  comments: number
  shares?: number
  views?: number
  recentComments: PostComment[]
}

export interface EngagementProvider {
  platform: string
  /** Engagement for one live post on this platform, or null if unavailable. */
  getEngagement(externalPostId: string): Promise<PostEngagement | null>
}

const providers: EngagementProvider[] = []

export function engagementAvailable(platform: string) {
  return providers.some((p) => p.platform === platform)
}

export function anyEngagementAvailable() {
  return providers.length > 0
}
