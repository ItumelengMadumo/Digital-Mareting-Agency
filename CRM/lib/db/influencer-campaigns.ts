import { createRepository, type BaseItem } from "./repository"

export interface InfluencerCampaignRecord extends BaseItem {
  campaignId: string
  totalBudget?: number | null
}

const repo = createRepository<InfluencerCampaignRecord>("InfluencerCampaigns")

export async function createInfluencerCampaign(data: Omit<InfluencerCampaignRecord, "id" | "createdAt" | "updatedAt">) {
  return repo.create(data, { gsi1pk: data.campaignId })
}

export async function getInfluencerCampaignByCampaign(campaignId: string) {
  const matches = await repo.listByGsi1(campaignId)
  return matches[0] ?? null
}

export async function listAllInfluencerCampaigns() {
  return repo.listAll()
}
