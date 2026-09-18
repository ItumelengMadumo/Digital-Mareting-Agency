import { createRepository, type BaseItem } from "./repository"
import type { Platform, VariantFormat, VariantStatus } from "@/lib/types"

export interface VariantRecord extends BaseItem {
  contentId: string
  platform: Platform
  caption: string
  mediaUrl?: string | null
  format?: VariantFormat | null
  title?: string | null
  seoTags?: string | null
  status: VariantStatus
}

const repo = createRepository<VariantRecord>("Variants")

export async function getVariant(id: string) {
  return repo.get(id)
}

export async function createVariant(data: Omit<VariantRecord, "id" | "createdAt" | "updatedAt">) {
  return repo.create(data, { gsi1pk: data.contentId })
}

export async function updateVariant(id: string, patch: Partial<VariantRecord>) {
  return repo.update(id, patch)
}

export async function listVariantsByContent(contentId: string) {
  return repo.listByGsi1(contentId)
}

export async function getVariantsByIds(ids: string[]) {
  const results = await Promise.all(ids.map((id) => repo.get(id)))
  return results.filter((v): v is VariantRecord => v !== null)
}
