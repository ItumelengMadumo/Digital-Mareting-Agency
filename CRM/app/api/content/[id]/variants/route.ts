import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { generateVariantCaption, getRecommendedFormat } from "@/lib/tracking"

// POST /api/content/[id]/variants - auto-generate variants for all target platforms
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: contentId } = await params
    const { platforms } = await req.json()

    if (!platforms?.length) {
      return NextResponse.json({ error: "platforms array is required" }, { status: 400 })
    }

    const content = await prisma.content.findUnique({ where: { id: contentId } })
    if (!content) return NextResponse.json({ error: "Content not found" }, { status: 404 })

    // Generate one variant per platform
    const variants = await Promise.all(
      platforms.map((platform: string) =>
        prisma.variant.create({
          data: {
            contentId,
            platform,
            caption: generateVariantCaption(content.captionMaster, platform),
            mediaUrl: content.mediaUrl,
            format: getRecommendedFormat(platform),
            status: "pending",
          },
        })
      )
    )

    // Update content status
    await prisma.content.update({
      where: { id: contentId },
      data: { status: "ready" },
    })

    return NextResponse.json(variants, { status: 201 })
  } catch (error) {
    console.error("Variant generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET /api/content/[id]/variants
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: contentId } = await params
    const variants = await prisma.variant.findMany({
      where: { contentId },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(variants)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
