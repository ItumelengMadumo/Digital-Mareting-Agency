import { createRepository, type BaseItem } from "./repository"

export interface ClientRecord extends BaseItem {
  workspaceId: string
  name: string
  email?: string
  phone?: string
  company?: string
  industry?: string
  notes?: string
}

const repo = createRepository<ClientRecord>("Clients")

export async function getClient(id: string) {
  return repo.get(id)
}

export async function createClient(data: Omit<ClientRecord, "id" | "createdAt" | "updatedAt">) {
  return repo.create(data, { gsi1pk: data.workspaceId })
}

export async function updateClient(id: string, patch: Partial<ClientRecord>) {
  return repo.update(id, patch)
}

export async function deleteClient(id: string) {
  return repo.remove(id)
}

export async function listClientsByWorkspace(workspaceId: string) {
  return repo.listByGsi1(workspaceId)
}
