import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/automation
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")

    const rules = await prisma.automationRule.findMany({
      where: workspaceId ? { workspaceId } : {},
      include: { _count: { select: { automationLogs: true } } },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(
      rules.map((r) => ({
        ...r,
        conditions: r.conditions ? JSON.parse(r.conditions) : null,
        actionConfig: JSON.parse(r.actionConfig),
      }))
    )
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

// POST /api/automation
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { workspaceId, name, trigger, conditions, action, actionConfig } = body

    if (!workspaceId || !name || !trigger || !action || !actionConfig) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const rule = await prisma.automationRule.create({
      data: {
        workspaceId,
        name,
        trigger,
        conditions: conditions ? JSON.stringify(conditions) : null,
        action,
        actionConfig: JSON.stringify(actionConfig),
        isActive: true,
      },
    })

    return NextResponse.json(rule, { status: 201 })
  } catch (error) {
    console.error("Automation rule creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
