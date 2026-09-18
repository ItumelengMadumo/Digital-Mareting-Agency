import { createRepository, type BaseItem } from "./repository"

export interface PPCCampaignRecord extends BaseItem {
  workspaceId: string
  platform: "google_ads" | "meta_ads"
  externalId?: string | null
  name: string
  budget: number
  spend: number
  clicks: number
  impressions: number
  conversions: number
  cpc?: number | null
  ctr?: number | null
  roi?: number | null
  status: "active" | "paused" | "ended"
}

const repo = createRepository<PPCCampaignRecord>("PPCCampaigns")

export async function createPPCCampaign(data: Omit<PPCCampaignRecord, "id" | "createdAt" | "updatedAt">) {
  return repo.create(data, { gsi1pk: data.workspaceId })
}

export async function listPPCCampaignsByWorkspace(workspaceId: string) {
  return repo.listByGsi1(workspaceId)
}
