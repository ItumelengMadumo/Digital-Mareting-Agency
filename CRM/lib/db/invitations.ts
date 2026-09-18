import { createRepository, type BaseItem } from "./repository"
import type { MemberRole } from "@/lib/types"

export interface InvitationRecord extends BaseItem {
  workspaceId: string
  email: string
  role: MemberRole
  token: string
  expiresAt: string
  status: "pending" | "accepted" | "revoked"
}

// GSI1 = workspaceId (list pending invites for a workspace), GSI2 = token (accept-invite lookup)
const repo = createRepository<InvitationRecord>("Invitations")

export async function createInvitation(data: Omit<InvitationRecord, "id" | "createdAt" | "updatedAt">) {
  return repo.create(data, { gsi1pk: data.workspaceId, gsi2pk: data.token })
}

export async function listInvitationsByWorkspace(workspaceId: string) {
  return repo.listByGsi1(workspaceId)
}

export async function getInvitationByToken(token: string) {
  const matches = await repo.listByGsi2(token)
  return matches[0] ?? null
}

export async function updateInvitation(id: string, patch: Partial<InvitationRecord>) {
  return repo.update(id, patch)
}
