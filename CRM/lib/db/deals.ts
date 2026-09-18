import { createRepository, type BaseItem } from "./repository"

export interface DealRecord extends BaseItem {
  leadId: string
  productId: string
  value: number
  status: "open" | "won" | "lost"
}

const repo = createRepository<DealRecord>("Deals")

export async function createDeal(data: Omit<DealRecord, "id" | "createdAt" | "updatedAt">) {
  return repo.create(data, { gsi1pk: data.leadId })
}

export async function updateDeal(id: string, patch: Partial<DealRecord>) {
  return repo.update(id, patch)
}

export async function listDealsByLead(leadId: string) {
  return repo.listByGsi1(leadId)
}
