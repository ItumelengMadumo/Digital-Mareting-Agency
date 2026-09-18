import { createRepository, type BaseItem } from "./repository"

export interface CommunicationRecord extends BaseItem {
  leadId: string
  type: "email" | "sms" | "whatsapp" | "call" | "video"
  subject?: string | null
  body?: string | null
  outcome?: string | null
  direction: "inbound" | "outbound"
}

const repo = createRepository<CommunicationRecord>("Communications")

export async function createCommunication(data: Omit<CommunicationRecord, "id" | "createdAt" | "updatedAt">) {
  return repo.create(data, { gsi1pk: data.leadId })
}

export async function listCommunicationsByLead(leadId: string) {
  return repo.listByGsi1(leadId)
}
