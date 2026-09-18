import { createRepository, type BaseItem } from "./repository"
import type { WorkspaceType } from "@/lib/types"

export interface WorkspaceRecord extends BaseItem {
  name: string
  type: WorkspaceType
  ownerId: string
}

const repo = createRepository<WorkspaceRecord>("Workspaces")

export async function getWorkspace(id: string) {
  return repo.get(id)
}

export async function createWorkspace(data: Omit<WorkspaceRecord, "id" | "createdAt" | "updatedAt">) {
  return repo.create(data, { gsi1pk: data.ownerId })
}

export async function updateWorkspace(id: string, patch: Partial<WorkspaceRecord>) {
  return repo.update(id, patch)
}

export async function listWorkspacesByIds(ids: string[]): Promise<WorkspaceRecord[]> {
  const results = await Promise.all(ids.map((id) => repo.get(id)))
  return results.filter((w): w is WorkspaceRecord => w !== null)
}
