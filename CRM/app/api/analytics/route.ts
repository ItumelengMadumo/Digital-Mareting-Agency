import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/analytics
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const campaignId = searchParams.get("campaignId")
    const workspaceId = searchParams.get("workspaceId")
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    if (campaignId) {
      const metrics = await prisma.campaignMetric.findMany({
        where: {
          campaignId,
          ...(from && to ? { date: { gte: new Date(from), lte: new Date(to) } } : {}),
        },
        orderBy: { date: "asc" },
      })

      // Aggregate totals
      const totals = metrics.reduce(
        (acc, m) => ({
          impressions: acc.impressions + m.impressions,
          clicks: acc.clicks + m.clicks,
          engagement: acc.engagement + m.engagement,
          conversions: acc.conversions + m.conversions,
          spend: acc.spend + m.spend,
          revenue: acc.revenue + m.revenue,
        }),
        { impressions: 0, clicks: 0, engagement: 0, conversions: 0, spend: 0, revenue: 0 }
      )

      const roi = totals.spend > 0 ? ((totals.revenue - totals.spend) / totals.spend) * 100 : 0

      return NextResponse.json({ metrics, totals: { ...totals, roi } })
    }

    if (workspaceId) {
      // Get all campaigns for workspace and aggregate
      const campaigns = await prisma.campaign.findMany({
        where: { workspaceId },
        include: {
          metrics: true,
          _count: { select: { contents: true, distributions: true } },
        },
      })

      const allMetrics = campaigns.flatMap((c) => c.metrics)
      const totals = allMetrics.reduce(
        (acc, m) => ({
          impressions: acc.impressions + m.impressions,
          clicks: acc.clicks + m.clicks,
          engagement: acc.engagement + m.engagement,
          conversions: acc.conversions + m.conversions,
          spend: acc.spend + m.spend,
          revenue: acc.revenue + m.revenue,
        }),
        { impressions: 0, clicks: 0, engagement: 0, conversions: 0, spend: 0, revenue: 0 }
      )

      const roi = totals.spend > 0 ? ((totals.revenue - totals.spend) / totals.spend) * 100 : 0

      return NextResponse.json({
        campaigns: campaigns.length,
        totals: { ...totals, roi },
        byPlatform: groupByPlatform(allMetrics),
      })
    }

    return NextResponse.json({ error: "campaignId or workspaceId is required" }, { status: 400 })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function groupByPlatform(metrics: { platform: string; impressions: number; clicks: number; engagement: number; conversions: number; spend: number; revenue: number }[]) {
  const grouped: Record<string, { impressions: number; clicks: number; engagement: number; conversions: number; spend: number; revenue: number }> = {}
  for (const m of metrics) {
    if (!grouped[m.platform]) {
      grouped[m.platform] = { impressions: 0, clicks: 0, engagement: 0, conversions: 0, spend: 0, revenue: 0 }
    }
    grouped[m.platform].impressions += m.impressions
    grouped[m.platform].clicks += m.clicks
    grouped[m.platform].engagement += m.engagement
    grouped[m.platform].conversions += m.conversions
    grouped[m.platform].spend += m.spend
    grouped[m.platform].revenue += m.revenue
  }
  return grouped
}
