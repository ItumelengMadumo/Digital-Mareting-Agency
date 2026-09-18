import { createRepository, type BaseItem } from "./repository"

export interface OfflineCampaignRecord extends BaseItem {
  campaignId: string
  channel: "tv" | "radio" | "billboard" | "print" | "event"
  location?: string | null
  airDate?: string | null
  qrCodeUrl?: string | null
  shortLink?: string | null
  promoCode?: string | null
  callNumber?: string | null
  scans: number
  calls: number
  redemptions: number
}

const repo = createRepository<OfflineCampaignRecord>("OfflineCampaigns")

export async function createOfflineCampaign(data: Omit<OfflineCampaignRecord, "id" | "createdAt" | "updatedAt">) {
  return repo.create(data, { gsi1pk: data.campaignId })
}

export async function getOfflineCampaignByCampaign(campaignId: string) {
  const matches = await repo.listByGsi1(campaignId)
  return matches[0] ?? null
}
