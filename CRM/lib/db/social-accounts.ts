import { createRepository, type BaseItem } from "./repository"
import type { AccountType, Platform } from "@/lib/types"

export interface SocialAccountRecord extends BaseItem {
  workspaceId: string
  platform: Platform
  accountType: AccountType
  accountName: string
  accessToken?: string | null
  refreshToken?: string | null
  externalId?: string | null
  followers: number
  isConnected: boolean
  lastSyncAt?: string | null
}

const repo = createRepository<SocialAccountRecord>("SocialAccounts")

export async function getSocialAccount(id: string) {
  return repo.get(id)
}

export async function createSocialAccount(data: Omit<SocialAccountRecord, "id" | "createdAt" | "updatedAt">) {
  return repo.create(data, { gsi1pk: data.workspaceId })
}

export async function updateSocialAccount(id: string, patch: Partial<SocialAccountRecord>) {
  return repo.update(id, patch)
}

export async function deleteSocialAccount(id: string) {
  return repo.remove(id)
}

export async function listSocialAccountsByWorkspace(workspaceId: string) {
  return repo.listByGsi1(workspaceId)
}

export async function findConnectedBusinessAccount(platform: string, accounts: SocialAccountRecord[]) {
  return accounts.find((a) => a.platform === platform && a.isConnected && a.accountType === "business") ?? null
}
