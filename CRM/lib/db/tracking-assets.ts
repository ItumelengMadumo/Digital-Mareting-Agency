import { createRepository, type BaseItem } from "./repository"
import type { TrackingType } from "@/lib/types"

export interface TrackingAssetRecord extends BaseItem {
  workspaceId: string
  type: TrackingType
  name: string
  value: string
  campaignId?: string | null
  clicks: number
  conversions: number
}

// GSI1 = workspaceId (listing), GSI2 = the short-code portion of `value` for /t/[code] redirects.
const repo = createRepository<TrackingAssetRecord>("TrackingAssets")

export async function createTrackingAsset(data: Omit<TrackingAssetRecord, "id" | "createdAt" | "updatedAt">) {
  const shortCode = data.type === "short_link" ? data.value.replace(/^\/t\//, "") : undefined
  return repo.create(data, { gsi1pk: data.workspaceId, ...(shortCode ? { gsi2pk: shortCode } : {}) })
}

export async function listTrackingAssetsByWorkspace(workspaceId: string) {
  return repo.listByGsi1(workspaceId)
}

export async function getTrackingAssetByShortCode(code: string) {
  const matches = await repo.listByGsi2(code)
  return matches[0] ?? null
}

export async function incrementTrackingClicks(id: string, current: number) {
  return repo.update(id, { clicks: current + 1 } as Partial<TrackingAssetRecord>)
}
