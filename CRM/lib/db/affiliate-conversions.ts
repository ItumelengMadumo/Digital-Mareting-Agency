import { createRepository, type BaseItem } from "./repository"

export interface AffiliateConversionRecord extends BaseItem {
  affiliateId: string
  amount: number
  commission: number
  status: "pending" | "approved" | "paid" | "rejected"
}

const repo = createRepository<AffiliateConversionRecord>("AffiliateConversions")

export async function createAffiliateConversion(data: Omit<AffiliateConversionRecord, "id" | "createdAt" | "updatedAt">) {
  return repo.create(data, { gsi1pk: data.affiliateId })
}

export async function listConversionsByAffiliate(affiliateId: string) {
  return repo.listByGsi1(affiliateId)
}
