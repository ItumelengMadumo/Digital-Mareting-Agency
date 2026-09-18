import { createRepository, type BaseItem } from "./repository"
import type { LeadSource, LeadStatus } from "@/lib/types"

export interface LeadRecord extends BaseItem {
  workspaceId: string
  name: string
  email?: string | null
  phone?: string | null
  company?: string | null
  position?: string | null
  source?: LeadSource | null
  status: LeadStatus
  value?: number | null
  notes?: string | null
  assignedTo?: string | null
}

const repo = createRepository<LeadRecord>("Leads")

export async function getLead(id: string) {
  return repo.get(id)
}

export async function createLead(data: Omit<LeadRecord, "id" | "createdAt" | "updatedAt">) {
  return repo.create(data, { gsi1pk: data.workspaceId })
}

export async function updateLead(id: string, patch: Partial<LeadRecord>) {
  return repo.update(id, patch)
}

export async function listLeadsByWorkspace(workspaceId: string) {
  return repo.listByGsi1(workspaceId)
}
