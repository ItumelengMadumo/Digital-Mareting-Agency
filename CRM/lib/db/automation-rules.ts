import { createRepository, type BaseItem } from "./repository"
import type { AutomationAction, AutomationTrigger } from "@/lib/types"

export interface AutomationRuleRecord extends BaseItem {
  workspaceId: string
  name: string
  trigger: AutomationTrigger
  conditions?: Record<string, unknown> | null
  action: AutomationAction
  actionConfig: Record<string, unknown>
  isActive: boolean
}

const repo = createRepository<AutomationRuleRecord>("AutomationRules")

export async function createAutomationRule(data: Omit<AutomationRuleRecord, "id" | "createdAt" | "updatedAt">) {
  return repo.create(data, { gsi1pk: data.workspaceId })
}

export async function listAutomationRulesByWorkspace(workspaceId: string) {
  return repo.listByGsi1(workspaceId)
}
