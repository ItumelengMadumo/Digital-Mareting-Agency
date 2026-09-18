import { createRepository, type BaseItem } from "./repository"
import type { DistributionMethod, DistributionStatus } from "@/lib/types"

export interface DistributionRecord extends BaseItem {
  variantId: string
  campaignId?: string | null
  platform: string
  method: DistributionMethod
  status: DistributionStatus
  publishedAt?: string | null
  externalId?: string | null
  errorMsg?: string | null
}

// GSI1 = campaignId (dashboard filtering), GSI2 = status (scheduling worker's "find due work" query)
const repo = createRepository<DistributionRecord>("Distributions")

export async function getDistribution(id: string) {
  return repo.get(id)
}

export async function createDistribution(data: Omit<DistributionRecord, "id" | "createdAt" | "updatedAt">) {
  return repo.create(data, {
    ...(data.campaignId ? { gsi1pk: data.campaignId } : {}),
    gsi2pk: data.status,
  })
}

export async function updateDistribution(id: string, patch: Partial<DistributionRecord>) {
  const updated = await repo.update(id, patch)
  // Keep GSI2 (status index) in sync when status changes.
  if (patch.status) {
    await repo.update(id, { gsi2pk: patch.status } as Partial<DistributionRecord>)
  }
  return updated
}

export async function listDistributionsByCampaign(campaignId: string) {
  return repo.listByGsi1(campaignId)
}

export async function listDistributionsByStatus(status: DistributionStatus) {
  return repo.listByGsi2(status)
}

export async function listAllDistributions() {
  return repo.listAll()
}
