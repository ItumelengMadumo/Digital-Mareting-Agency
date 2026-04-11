import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// POST /api/distribution - distribute variants
export async function POST(req: Request) {
  try {
    const { variantIds, campaignId } = await req.json()

    if (!variantIds?.length) {
      return NextResponse.json({ error: "variantIds array is required" }, { status: 400 })
    }

    const variants = await prisma.variant.findMany({
      where: { id: { in: variantIds } },
      include: { content: true },
    })

    // Load social accounts to determine auto vs assisted
    const results = await Promise.all(
      variants.map(async (variant) => {
        // Check if we have a connected business account for this platform
        const account = await prisma.socialAccount.findFirst({
          where: {
            platform: variant.platform,
            isConnected: true,
            accountType: "business",
          },
        })

        const canAutoPost = account !== null
        const method = canAutoPost ? "auto" : "assisted"

        // For auto: queue for publishing. For assisted: mark as assisted_ready
        const status = canAutoPost ? "queued" : "assisted_ready"

        const distribution = await prisma.distribution.create({
          data: {
            variantId: variant.id,
            campaignId: campaignId || null,
            platform: variant.platform,
            method,
            status,
          },
        })

        // Update variant status
        await prisma.variant.update({
          where: { id: variant.id },
          data: { status: canAutoPost ? "ready" : "pending" },
        })

        return distribution
      })
    )

    return NextResponse.json(results, { status: 201 })
  } catch (error) {
    console.error("Distribution error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET /api/distribution - list distributions
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const campaignId = searchParams.get("campaignId")
    const status = searchParams.get("status")

    const where: Record<string, unknown> = {}
    if (campaignId) where.campaignId = campaignId
    if (status) where.status = status

    const distributions = await prisma.distribution.findMany({
      where,
      include: {
        variant: { include: { content: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(distributions)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
