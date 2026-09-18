import { NextResponse } from "next/server"
import { withWorkspaceAuth } from "@/lib/auth-helpers"
import { createAutomationRule, listAutomationRulesByWorkspace } from "@/lib/db/automation-rules"
import { listAutomationLogsByRule } from "@/lib/db/automation-logs"

// GET /api/automation
export const GET = withWorkspaceAuth(async (_req, { workspaceId }) => {
  const rules = await listAutomationRulesByWorkspace(workspaceId)
  rules.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const withCounts = await Promise.all(
    rules.map(async (r) => ({ ...r, _count: { automationLogs: (await listAutomationLogsByRule(r.id)).length } })),
  )

  return NextResponse.json(withCounts)
})

// POST /api/automation
export const POST = withWorkspaceAuth(async (req, { workspaceId }) => {
  const body = await req.json()
  const { name, trigger, conditions, action, actionConfig } = body

  if (!name || !trigger || !action || !actionConfig) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const rule = await createAutomationRule({
    workspaceId,
    name,
    trigger,
    conditions: conditions || null,
    action,
    actionConfig,
    isActive: true,
  })

  return NextResponse.json(rule, { status: 201 })
})
