import { createRepository, type BaseItem } from "./repository"

export interface ActivityLogRecord extends BaseItem {
  userId: string
  type: "campaign_created" | "content_published" | "lead_added" | "communication_sent" | "automation_triggered"
  message: string
  metadata?: Record<string, unknown> | null
}

const repo = createRepository<ActivityLogRecord>("ActivityLogs")

export async function createActivityLog(data: Omit<ActivityLogRecord, "id" | "createdAt" | "updatedAt">) {
  return repo.create(data, { gsi1pk: data.userId })
}

export async function listActivityByUser(userId: string) {
  return repo.listByGsi1(userId)
}
