import { createRepository, type BaseItem } from "./repository"

export interface SEOKeywordRecord extends BaseItem {
  workspaceId: string
  keyword: string
  volume?: number | null
  difficulty?: number | null
  currentRank?: number | null
  targetRank?: number | null
  url?: string | null
}

const repo = createRepository<SEOKeywordRecord>("SEOKeywords")

export async function createSEOKeyword(data: Omit<SEOKeywordRecord, "id" | "createdAt" | "updatedAt">) {
  return repo.create(data, { gsi1pk: data.workspaceId })
}

export async function listSEOKeywordsByWorkspace(workspaceId: string) {
  return repo.listByGsi1(workspaceId)
}
