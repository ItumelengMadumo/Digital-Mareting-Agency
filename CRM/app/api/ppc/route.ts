import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/ppc
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")

    const campaigns = await prisma.pPCCampaign.findMany({
      where: workspaceId ? { workspaceId } : {},
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(campaigns)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

// POST /api/ppc
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { workspaceId, platform, name, budget, externalId } = body

    if (!workspaceId || !platform || !name || !budget) {
      return NextResponse.json({ error: "workspaceId, platform, name, and budget are required" }, { status: 400 })
    }

    const campaign = await prisma.pPCCampaign.create({
      data: {
        workspaceId,
        platform,
        name,
        budget: parseFloat(budget),
        externalId: externalId || null,
      },
    })

    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    console.error("PPC campaign creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
