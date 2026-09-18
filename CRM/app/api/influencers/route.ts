import { NextResponse } from "next/server"
import { requireWorkspaceAccess, HttpError } from "@/lib/auth-helpers"
import { getCampaign } from "@/lib/db/campaigns"
import { createInfluencerCampaign, getInfluencerCampaignByCampaign } from "@/lib/db/influencer-campaigns"
import { createInfluencerAssignment, listAssignmentsByInfluencerCampaign } from "@/lib/db/influencer-assignments"

// GET /api/influencers?campaignId=...
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const campaignId = searchParams.get("campaignId")
    if (!campaignId) return NextResponse.json({ error: "campaignId is required" }, { status: 400 })

    const campaign = await getCampaign(campaignId)
    if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 })
    await requireWorkspaceAccess(campaign.workspaceId)

    const ic = await getInfluencerCampaignByCampaign(campaignId)
    if (!ic) return NextResponse.json(null)

    const influencers = await listAssignmentsByInfluencerCampaign(ic.id)
    return NextResponse.json({ ...ic, campaign, influencers })
  } catch (error) {
    if (error instanceof HttpError) return NextResponse.json({ error: error.message }, { status: error.status })
    console.error("Influencer campaign fetch error:", error)
    return NextResponse.json([], { status: 200 })
  }
}

// POST /api/influencers
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { campaignId, totalBudget, influencers } = body

    if (!campaignId) return NextResponse.json({ error: "campaignId is required" }, { status: 400 })

    const campaign = await getCampaign(campaignId)
    if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 })
    await requireWorkspaceAccess(campaign.workspaceId)

    const ic = await createInfluencerCampaign({
      campaignId,
      totalBudget: totalBudget ? parseFloat(totalBudget) : null,
    })

    const created = await Promise.all(
      (influencers || []).map((i: Record<string, unknown>) =>
        createInfluencerAssignment({
          influencerCampaignId: ic.id,
          influencerName: i.influencerName as string,
          influencerHandle: i.influencerHandle as string,
          platform: i.platform as string,
          deliverables: (i.deliverables as string[]) || [],
          trackingLink: (i.trackingLink as string) || null,
          payoutAmount: i.payoutAmount ? parseFloat(String(i.payoutAmount)) : null,
          payoutStatus: "pending",
          postCount: 0,
          impressions: 0,
          engagement: 0,
        }),
      ),
    )

    return NextResponse.json({ ...ic, influencers: created }, { status: 201 })
  } catch (error) {
    if (error instanceof HttpError) return NextResponse.json({ error: error.message }, { status: error.status })
    console.error("Influencer campaign creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
