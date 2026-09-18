import { NextResponse } from "next/server"
import { withResourceAuth } from "@/lib/auth-helpers"
import { deleteCampaign, getCampaign, updateCampaign } from "@/lib/db/campaigns"
import { listContentByCampaign } from "@/lib/db/content"
import { listVariantsByContent } from "@/lib/db/variants"
import { listDistributionsByCampaign } from "@/lib/db/distributions"
import { listMetricsByCampaign } from "@/lib/db/campaign-metrics"
import { getInfluencerCampaignByCampaign } from "@/lib/db/influencer-campaigns"
import { listAssignmentsByInfluencerCampaign } from "@/lib/db/influencer-assignments"
import { getOfflineCampaignByCampaign } from "@/lib/db/offline-campaigns"

// GET /api/campaigns/[id]
export const GET = withResourceAuth<{ id: string }>(
  async ({ id }) => (await getCampaign(id))?.workspaceId ?? null,
  async (_req, { params }) => {
    const campaign = await getCampaign(params.id)
    if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const contents = await listContentByCampaign(campaign.id)
    const contentsWithVariants = await Promise.all(
      contents.map(async (content) => ({ ...content, variants: await listVariantsByContent(content.id) })),
    )

    const [distributions, metrics, influencerCampaign, offlineCampaign] = await Promise.all([
      listDistributionsByCampaign(campaign.id),
      listMetricsByCampaign(campaign.id),
      getInfluencerCampaignByCampaign(campaign.id),
      getOfflineCampaignByCampaign(campaign.id),
    ])

    const influencers = influencerCampaign ? await listAssignmentsByInfluencerCampaign(influencerCampaign.id) : []

    return NextResponse.json({
      ...campaign,
      contents: contentsWithVariants,
      distributions,
      metrics,
      influencerCampaign: influencerCampaign ? { ...influencerCampaign, influencers } : null,
      offlineCampaign,
    })
  },
)

// PATCH /api/campaigns/[id]
export const PATCH = withResourceAuth<{ id: string }>(
  async ({ id }) => (await getCampaign(id))?.workspaceId ?? null,
  async (req, { params }) => {
    const body = await req.json()
    const patch: Record<string, unknown> = {}
    if (body.name !== undefined) patch.name = body.name
    if (body.goal !== undefined) patch.goal = body.goal
    if (body.type !== undefined) patch.type = body.type
    if (body.status !== undefined) patch.status = body.status
    if (body.budget !== undefined) patch.budget = body.budget ? parseFloat(body.budget) : null
    if (body.platforms !== undefined) patch.platforms = body.platforms
    if (body.startDate !== undefined) patch.startDate = body.startDate || null
    if (body.endDate !== undefined) patch.endDate = body.endDate || null
    if (body.clientId !== undefined) patch.clientId = body.clientId || null

    const campaign = await updateCampaign(params.id, patch)
    return NextResponse.json(campaign)
  },
)

// DELETE /api/campaigns/[id]
export const DELETE = withResourceAuth<{ id: string }>(
  async ({ id }) => (await getCampaign(id))?.workspaceId ?? null,
  async (_req, { params }) => {
    await deleteCampaign(params.id)
    return NextResponse.json({ success: true })
  },
)
