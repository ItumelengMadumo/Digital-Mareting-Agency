import { createRepository, type BaseItem } from "./repository"

export interface AutomationLogRecord extends BaseItem {
  ruleId: string
  status: "triggered" | "success" | "failed"
  payload?: Record<string, unknown> | null
  errorMsg?: string | null
  executedAt: string
}

const repo = createRepository<AutomationLogRecord>("AutomationLogs")

export async function createAutomationLog(data: Omit<AutomationLogRecord, "id" | "createdAt" | "updatedAt">) {
  return repo.create(data, { gsi1pk: data.ruleId })
}

export async function listAutomationLogsByRule(ruleId: string) {
  return repo.listByGsi1(ruleId)
}
