import { createRepository, type BaseItem } from "./repository"
import type { MemberRole } from "@/lib/types"

export interface WorkspaceMemberRecord extends BaseItem {
  workspaceId: string
  userId: string
  role: MemberRole
}

// id = `${workspaceId}#${userId}` for a direct membership lookup without a query.
// GSI1 (gsi1pk = workspaceId) lists members of a workspace.
// GSI2 (gsi2pk = userId) lists workspaces a user belongs to.
const repo = createRepository<WorkspaceMemberRecord>("WorkspaceMembers")

function membershipId(workspaceId: string, userId: string) {
  return `${workspaceId}#${userId}`
}

export async function getMembership(workspaceId: string, userId: string) {
  return repo.get(membershipId(workspaceId, userId))
}

export async function addMember(workspaceId: string, userId: string, role: MemberRole) {
  return repo.create(
    { id: membershipId(workspaceId, userId), workspaceId, userId, role },
    { gsi1pk: workspaceId, gsi2pk: userId },
  )
}

export async function updateMemberRole(workspaceId: string, userId: string, role: MemberRole) {
  return repo.update(membershipId(workspaceId, userId), { role })
}

export async function removeMember(workspaceId: string, userId: string) {
  return repo.remove(membershipId(workspaceId, userId))
}

export async function listMembersOfWorkspace(workspaceId: string) {
  return repo.listByGsi1(workspaceId)
}

export async function listWorkspacesForUser(userId: string) {
  return repo.listByGsi2(userId)
}
