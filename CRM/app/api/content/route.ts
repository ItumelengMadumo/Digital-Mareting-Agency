import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/content
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")
    const campaignId = searchParams.get("campaignId")
    const status = searchParams.get("status")

    const where: Record<string, unknown> = {}
    if (workspaceId) where.workspaceId = workspaceId
    if (campaignId) where.campaignId = campaignId
    if (status) where.status = status

    const contents = await prisma.content.findMany({
      where,
      include: {
        campaign: true,
        variants: true,
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(contents)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

// POST /api/content
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { workspaceId, campaignId, captionMaster, mediaUrl, mediaType, hashtags, link, scheduledAt } = body

    if (!workspaceId || !captionMaster) {
      return NextResponse.json({ error: "workspaceId and captionMaster are required" }, { status: 400 })
    }

    const content = await prisma.content.create({
      data: {
        workspaceId,
        campaignId: campaignId || null,
        captionMaster,
        mediaUrl: mediaUrl || null,
        mediaType: mediaType || null,
        hashtags: hashtags || null,
        link: link || null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: "draft",
      },
    })

    return NextResponse.json(content, { status: 201 })
  } catch (error) {
    console.error("Content creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
