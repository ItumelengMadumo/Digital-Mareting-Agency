import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/campaigns - list campaigns for workspace
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")
    const status = searchParams.get("status")
    const clientId = searchParams.get("clientId")

    const where: Record<string, unknown> = {}
    if (workspaceId) where.workspaceId = workspaceId
    if (status) where.status = status
    if (clientId) where.clientId = clientId

    const campaigns = await prisma.campaign.findMany({
      where,
      include: {
        client: true,
        _count: { select: { contents: true, distributions: true, metrics: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    // Parse platforms JSON string back to array
    const parsed = campaigns.map((c) => ({
      ...c,
      platforms: JSON.parse(c.platforms || "[]"),
    }))

    return NextResponse.json(parsed)
  } catch (error) {
    console.error("Campaign list error:", error)
    return NextResponse.json([], { status: 200 })
  }
}

// POST /api/campaigns - create a campaign
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { workspaceId, name, goal, type, platforms, budget, startDate, endDate, clientId } = body

    if (!workspaceId || !name || !goal || !type) {
      return NextResponse.json({ error: "workspaceId, name, goal, and type are required" }, { status: 400 })
    }

    const campaign = await prisma.campaign.create({
      data: {
        workspaceId,
        name,
        goal,
        type,
        platforms: JSON.stringify(platforms || []),
        budget: budget ? parseFloat(budget) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        clientId: clientId || null,
        status: "draft",
      },
    })

    return NextResponse.json({ ...campaign, platforms: JSON.parse(campaign.platforms) }, { status: 201 })
  } catch (error) {
    console.error("Campaign creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
