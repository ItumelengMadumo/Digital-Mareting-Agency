import { NextResponse } from "next/server"
import { requireWorkspaceAccess, HttpError } from "@/lib/auth-helpers"
import { getCampaign, listCampaignsByWorkspace } from "@/lib/db/campaigns"
import { listMetricsByCampaign } from "@/lib/db/campaign-metrics"
import { listContentByCampaign } from "@/lib/db/content"
import { listDistributionsByCampaign } from "@/lib/db/distributions"
import type { CampaignMetricRecord } from "@/lib/db/campaign-metrics"

function sumMetrics(metrics: CampaignMetricRecord[]) {
  return metrics.reduce(
    (acc, m) => ({
      impressions: acc.impressions + m.impressions,
      clicks: acc.clicks + m.clicks,
      engagement: acc.engagement + m.engagement,
      conversions: acc.conversions + m.conversions,
      spend: acc.spend + m.spend,
      revenue: acc.revenue + m.revenue,
    }),
    { impressions: 0, clicks: 0, engagement: 0, conversions: 0, spend: 0, revenue: 0 },
  )
}

function roiOf(totals: { spend: number; revenue: number }) {
  return totals.spend > 0 ? ((totals.revenue - totals.spend) / totals.spend) * 100 : 0
}

function groupByPlatform(metrics: CampaignMetricRecord[]) {
  const byPlatform = new Map<string, CampaignMetricRecord[]>()
  for (const m of metrics) {
    byPlatform.set(m.platform, [...(byPlatform.get(m.platform) ?? []), m])
  }
  const grouped: Record<string, ReturnType<typeof sumMetrics>> = {}
  for (const [platform, list] of byPlatform) {
    grouped[platform] = sumMetrics(list)
  }
  return grouped
}

// GET /api/analytics?campaignId=... or ?workspaceId=...
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const campaignId = searchParams.get("campaignId")
    const workspaceId = searchParams.get("workspaceId")
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    if (campaignId) {
      const campaign = await getCampaign(campaignId)
      if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 })
      await requireWorkspaceAccess(campaign.workspaceId)

      let metrics = await listMetricsByCampaign(campaignId)
      if (from && to) metrics = metrics.filter((m) => m.date >= from && m.date <= to)
      metrics.sort((a, b) => a.date.localeCompare(b.date))

      const totals = sumMetrics(metrics)
      return NextResponse.json({ metrics, totals: { ...totals, roi: roiOf(totals) } })
    }

    if (workspaceId) {
      await requireWorkspaceAccess(workspaceId)

      const campaigns = await listCampaignsByWorkspace(workspaceId)
      const allMetrics = (await Promise.all(campaigns.map((c) => listMetricsByCampaign(c.id)))).flat()
      const totals = sumMetrics(allMetrics)

      const contentsAndDistributions = await Promise.all(
        campaigns.map(async (c) => ({
          contents: (await listContentByCampaign(c.id)).length,
          distributions: (await listDistributionsByCampaign(c.id)).length,
        })),
      )

      return NextResponse.json({
        campaigns: campaigns.length,
        contents: contentsAndDistributions.reduce((s, c) => s + c.contents, 0),
        distributions: contentsAndDistributions.reduce((s, c) => s + c.distributions, 0),
        totals: { ...totals, roi: roiOf(totals) },
        byPlatform: groupByPlatform(allMetrics),
      })
    }

    return NextResponse.json({ error: "campaignId or workspaceId is required" }, { status: 400 })
  } catch (error) {
    if (error instanceof HttpError) return NextResponse.json({ error: error.message }, { status: error.status })
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
