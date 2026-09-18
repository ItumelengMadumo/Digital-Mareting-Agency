import { NextResponse } from "next/server"
import { withWorkspaceAuth } from "@/lib/auth-helpers"
import { createPPCCampaign, listPPCCampaignsByWorkspace } from "@/lib/db/ppc-campaigns"

// GET /api/ppc
export const GET = withWorkspaceAuth(async (_req, { workspaceId }) => {
  const campaigns = await listPPCCampaignsByWorkspace(workspaceId)
  campaigns.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return NextResponse.json(campaigns)
})

// POST /api/ppc
export const POST = withWorkspaceAuth(async (req, { workspaceId }) => {
  const body = await req.json()
  const { platform, name, budget, externalId } = body

  if (!platform || !name || !budget) {
    return NextResponse.json({ error: "platform, name, and budget are required" }, { status: 400 })
  }

  const campaign = await createPPCCampaign({
    workspaceId,
    platform,
    name,
    budget: parseFloat(budget),
    externalId: externalId || null,
    spend: 0,
    clicks: 0,
    impressions: 0,
    conversions: 0,
    status: "active",
  })

  return NextResponse.json(campaign, { status: 201 })
})
