import { createRepository, type BaseItem } from "./repository"
import type { CampaignGoal, CampaignStatus, CampaignType } from "@/lib/types"

export interface CampaignRecord extends BaseItem {
  workspaceId: string
  clientId?: string | null
  name: string
  goal: CampaignGoal
  type: CampaignType
  budget?: number | null
  platforms: string[]
  startDate?: string | null
  endDate?: string | null
  status: CampaignStatus
}

const repo = createRepository<CampaignRecord>("Campaigns")

export async function getCampaign(id: string) {
  return repo.get(id)
}

export async function createCampaign(data: Omit<CampaignRecord, "id" | "createdAt" | "updatedAt">) {
  return repo.create(data, { gsi1pk: data.workspaceId })
}

export async function updateCampaign(id: string, patch: Partial<CampaignRecord>) {
  return repo.update(id, patch)
}

export async function deleteCampaign(id: string) {
  return repo.remove(id)
}

export async function listCampaignsByWorkspace(workspaceId: string) {
  return repo.listByGsi1(workspaceId)
}
