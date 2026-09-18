import { NextResponse } from "next/server"
import { requireWorkspaceAccess, HttpError } from "@/lib/auth-helpers"
import { getVariantsByIds } from "@/lib/db/variants"
import { getContent } from "@/lib/db/content"
import { createDistribution, listDistributionsByCampaign } from "@/lib/db/distributions"
import { listSocialAccountsByWorkspace, findConnectedBusinessAccount } from "@/lib/db/social-accounts"
import { getCampaign } from "@/lib/db/campaigns"

// POST /api/distribution - distribute variants
// Still a mock publish (queues or marks assisted_ready, never actually calls a platform API) —
// real per-platform publishing is Phase 1 of the redesign plan.
export async function POST(req: Request) {
  try {
    const { variantIds, campaignId } = await req.json()
    if (!variantIds?.length) {
      return NextResponse.json({ error: "variantIds array is required" }, { status: 400 })
    }

    const variants = await getVariantsByIds(variantIds)
    if (!variants.length) return NextResponse.json({ error: "No matching variants" }, { status: 404 })

    // Every variant's parent content must live in a workspace the caller has access to.
    const workspaceIds = new Set<string>()
    const contentByVariant = new Map<string, Awaited<ReturnType<typeof getContent>>>()
    for (const variant of variants) {
      const content = await getContent(variant.contentId)
      if (!content) continue
      contentByVariant.set(variant.id, content)
      workspaceIds.add(content.workspaceId)
    }
    for (const wsId of workspaceIds) {
      await requireWorkspaceAccess(wsId)
    }

    const results = await Promise.all(
      variants.map(async (variant) => {
        const content = contentByVariant.get(variant.id)
        const accounts = content ? await listSocialAccountsByWorkspace(content.workspaceId) : []
        const account = await findConnectedBusinessAccount(variant.platform, accounts)
        const canAutoPost = account !== null
        const status = canAutoPost ? "queued" : "assisted_ready"

        const distribution = await createDistribution({
          variantId: variant.id,
          campaignId: campaignId || null,
          platform: variant.platform,
          method: canAutoPost ? "auto" : "assisted",
          status,
        })

        return distribution
      }),
    )

    return NextResponse.json(results, { status: 201 })
  } catch (error) {
    if (error instanceof HttpError) return NextResponse.json({ error: error.message }, { status: error.status })
    console.error("Distribution error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET /api/distribution?campaignId=...&status=...
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const campaignId = searchParams.get("campaignId")
    const status = searchParams.get("status")
    if (!campaignId) return NextResponse.json({ error: "campaignId is required" }, { status: 400 })

    const campaign = await getCampaign(campaignId)
    if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 })
    await requireWorkspaceAccess(campaign.workspaceId)

    let distributions = await listDistributionsByCampaign(campaignId)
    if (status) distributions = distributions.filter((d) => d.status === status)
    distributions.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

    return NextResponse.json(distributions)
  } catch (error) {
    if (error instanceof HttpError) return NextResponse.json({ error: error.message }, { status: error.status })
    console.error("Distribution list error:", error)
    return NextResponse.json([], { status: 200 })
  }
}
