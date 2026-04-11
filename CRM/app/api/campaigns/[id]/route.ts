import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/campaigns/[id]
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        client: true,
        contents: { include: { variants: true } },
        distributions: true,
        metrics: true,
        influencerCampaign: { include: { influencers: true } },
        offlineCampaign: true,
      },
    })
    if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 })

    return NextResponse.json({ ...campaign, platforms: JSON.parse(campaign.platforms || "[]") })
  } catch (error) {
    console.error("Campaign fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/campaigns/[id]
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()

    const data: Record<string, unknown> = {}
    if (body.name !== undefined) data.name = body.name
    if (body.goal !== undefined) data.goal = body.goal
    if (body.type !== undefined) data.type = body.type
    if (body.status !== undefined) data.status = body.status
    if (body.budget !== undefined) data.budget = body.budget ? parseFloat(body.budget) : null
    if (body.platforms !== undefined) data.platforms = JSON.stringify(body.platforms)
    if (body.startDate !== undefined) data.startDate = body.startDate ? new Date(body.startDate) : null
    if (body.endDate !== undefined) data.endDate = body.endDate ? new Date(body.endDate) : null
    if (body.clientId !== undefined) data.clientId = body.clientId || null

    const campaign = await prisma.campaign.update({ where: { id }, data })
    return NextResponse.json({ ...campaign, platforms: JSON.parse(campaign.platforms || "[]") })
  } catch (error) {
    console.error("Campaign update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/campaigns/[id]
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.campaign.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Campaign delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
