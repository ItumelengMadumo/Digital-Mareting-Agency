import { createRepository, type BaseItem } from "./repository"

export interface InfluencerAssignmentRecord extends BaseItem {
  influencerCampaignId: string
  influencerName: string
  influencerHandle: string
  platform: string
  deliverables: string[]
  trackingLink?: string | null
  payoutAmount?: number | null
  payoutStatus: "pending" | "paid" | "cancelled"
  postCount: number
  impressions: number
  engagement: number
}

const repo = createRepository<InfluencerAssignmentRecord>("InfluencerAssignments")

export async function createInfluencerAssignment(
  data: Omit<InfluencerAssignmentRecord, "id" | "createdAt" | "updatedAt">,
) {
  return repo.create(data, { gsi1pk: data.influencerCampaignId })
}

export async function listAssignmentsByInfluencerCampaign(influencerCampaignId: string) {
  return repo.listByGsi1(influencerCampaignId)
}
