import { createRepository, type BaseItem } from "./repository"

export interface AffiliateRecord extends BaseItem {
  userId: string
  referralCode: string
  commissionRate: number
  totalEarnings: number
}

// GSI1 = userId (one affiliate profile per user), GSI2 = referralCode (lookup on referral clicks)
const repo = createRepository<AffiliateRecord>("Affiliates")

export async function createAffiliate(data: Omit<AffiliateRecord, "id" | "createdAt" | "updatedAt">) {
  return repo.create(data, { gsi1pk: data.userId, gsi2pk: data.referralCode })
}

export async function getAffiliateByUser(userId: string) {
  const matches = await repo.listByGsi1(userId)
  return matches[0] ?? null
}

export async function getAffiliateByReferralCode(code: string) {
  const matches = await repo.listByGsi2(code)
  return matches[0] ?? null
}

export async function listAllAffiliates() {
  return repo.listAll()
}
