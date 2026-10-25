import { NextResponse } from "next/server"
import { withResourceAuth } from "@/lib/auth-helpers"
import { getContent, updateContent } from "@/lib/db/content"
import { createVariant, listVariantsByContent } from "@/lib/db/variants"
import { generateVariantCaption, getRecommendedFormat } from "@/lib/tracking"

// POST /api/content/[id]/variants - auto-generate variants for all target platforms
export const POST = withResourceAuth<{ id: string }>(
  async ({ id }) => (await getContent(id))?.workspaceId ?? null,
  async (req, { params }) => {
    const { platforms, overrides = {}, markReady = true } = (await req.json()) as {
      platforms?: string[]
      overrides?: Record<string, { caption?: string; title?: string }>
      markReady?: boolean
    }
    if (!platforms?.length) {
      return NextResponse.json({ error: "platforms array is required" }, { status: 400 })
    }

    const content = await getContent(params.id)
    if (!content) return NextResponse.json({ error: "Content not found" }, { status: 404 })

    const variants = await Promise.all(
      platforms.map((platform: string) =>
        createVariant({
          contentId: content.id,
          platform: platform as never,
          caption: overrides[platform]?.caption?.trim() || generateVariantCaption(content.captionMaster, platform),
          title: overrides[platform]?.title?.trim() || null,
          mediaUrl: content.mediaUrl,
          format: getRecommendedFormat(platform) as never,
          status: "pending",
        }),
      ),
    )

    // Drafts stay drafts; anything queued to go out becomes "ready".
    if (markReady) await updateContent(content.id, { status: "ready" })

    return NextResponse.json(variants, { status: 201 })
  },
)

// GET /api/content/[id]/variants
export const GET = withResourceAuth<{ id: string }>(
  async ({ id }) => (await getContent(id))?.workspaceId ?? null,
  async (_req, { params }) => {
    const variants = await listVariantsByContent(params.id)
    variants.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return NextResponse.json(variants)
  },
)
