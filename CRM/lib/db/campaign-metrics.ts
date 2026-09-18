import { createRepository, type BaseItem } from "./repository"

export interface CampaignMetricRecord extends BaseItem {
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

const repo = createRepository<CampaignMetricRecord>("CampaignMetrics")

export async function createCampaignMetric(data: Omit<CampaignMetricRecord, "id" | "createdAt" | "updatedAt">) {
  return repo.create(data, { gsi1pk: data.campaignId, gsi1sk: data.date })
}

export async function listMetricsByCampaign(campaignId: string) {
  return repo.listByGsi1(campaignId)
}
