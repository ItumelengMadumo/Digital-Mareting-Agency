import { NextResponse } from "next/server"
import { withWorkspaceAuth } from "@/lib/auth-helpers"
import { createCampaign, listCampaignsByWorkspace } from "@/lib/db/campaigns"
import { listContentByCampaign } from "@/lib/db/content"
import { listDistributionsByCampaign } from "@/lib/db/distributions"

// GET /api/campaigns - list campaigns for the caller's workspace
export const GET = withWorkspaceAuth(async (req, { workspaceId }) => {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const clientId = searchParams.get("clientId")

  let campaigns = await listCampaignsByWorkspace(workspaceId)
  if (status) campaigns = campaigns.filter((c) => c.status === status)
  if (clientId) campaigns = campaigns.filter((c) => c.clientId === clientId)
  campaigns.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const withCounts = await Promise.all(
    campaigns.map(async (c) => {
      const [contents, distributions] = await Promise.all([
        listContentByCampaign(c.id),
        listDistributionsByCampaign(c.id),
      ])
      return { ...c, _count: { contents: contents.length, distributions: distributions.length } }
    }),
  )

  return NextResponse.json(withCounts)
})

// POST /api/campaigns - create a campaign
export const POST = withWorkspaceAuth(async (req, { workspaceId }) => {
  const body = await req.json()
  const { name, goal, type, platforms, budget, startDate, endDate, clientId } = body

  if (!name || !goal || !type) {
    return NextResponse.json({ error: "name, goal, and type are required" }, { status: 400 })
  }

  const campaign = await createCampaign({
    workspaceId,
    name,
    goal,
    type,
    platforms: platforms || [],
    budget: budget ? parseFloat(budget) : null,
    startDate: startDate || null,
    endDate: endDate || null,
    clientId: clientId || null,
    status: "draft",
  })

  return NextResponse.json(campaign, { status: 201 })
})
