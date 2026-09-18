import { createRepository, type BaseItem } from "./repository"
import type { ContentStatus, MediaType } from "@/lib/types"

export interface ContentRecord extends BaseItem {
  workspaceId: string
  campaignId?: string | null
  captionMaster: string
  mediaUrl?: string | null
  mediaType?: MediaType | null
  hashtags?: string | null
  link?: string | null
  status: ContentStatus
  scheduledAt?: string | null
}

// GSI1 = workspaceId (primary listing), GSI2 = campaignId (campaign detail page)
const repo = createRepository<ContentRecord>("Content")

export async function getContent(id: string) {
  return repo.get(id)
}

export async function createContent(data: Omit<ContentRecord, "id" | "createdAt" | "updatedAt">) {
  return repo.create(data, {
    gsi1pk: data.workspaceId,
    ...(data.campaignId ? { gsi2pk: data.campaignId } : {}),
  })
}

export async function updateContent(id: string, patch: Partial<ContentRecord>) {
  return repo.update(id, patch)
}

export async function deleteContent(id: string) {
  return repo.remove(id)
}

export async function listContentByWorkspace(workspaceId: string) {
  return repo.listByGsi1(workspaceId)
}

export async function listContentByCampaign(campaignId: string) {
  return repo.listByGsi2(campaignId)
}
