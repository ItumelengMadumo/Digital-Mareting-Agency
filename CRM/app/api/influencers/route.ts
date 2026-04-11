import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/influencers
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const campaignId = searchParams.get("campaignId")

    if (campaignId) {
      const ic = await prisma.influencerCampaign.findUnique({
        where: { campaignId },
        include: { influencers: true, campaign: true },
      })
      return NextResponse.json(ic || null)
    }

    const all = await prisma.influencerCampaign.findMany({
      include: { influencers: true, campaign: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(all)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

// POST /api/influencers
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { campaignId, totalBudget, influencers } = body

    if (!campaignId) {
      return NextResponse.json({ error: "campaignId is required" }, { status: 400 })
    }

    const ic = await prisma.influencerCampaign.create({
      data: {
        campaignId,
        totalBudget: totalBudget ? parseFloat(totalBudget) : null,
        influencers: {
          create: (influencers || []).map((i: Record<string, unknown>) => ({
            influencerName: i.influencerName as string,
            influencerHandle: i.influencerHandle as string,
            platform: i.platform as string,
            deliverables: JSON.stringify(i.deliverables || []),
            trackingLink: (i.trackingLink as string) || null,
            payoutAmount: i.payoutAmount ? parseFloat(String(i.payoutAmount)) : null,
          })),
        },
      },
      include: { influencers: true },
    })

    return NextResponse.json(ic, { status: 201 })
  } catch (error) {
    console.error("Influencer campaign creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
