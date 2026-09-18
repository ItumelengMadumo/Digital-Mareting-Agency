import { NextResponse } from "next/server"
import { withWorkspaceAuth } from "@/lib/auth-helpers"
import { createContent, listContentByWorkspace } from "@/lib/db/content"
import { listVariantsByContent } from "@/lib/db/variants"

// GET /api/content
export const GET = withWorkspaceAuth(async (req, { workspaceId }) => {
  const { searchParams } = new URL(req.url)
  const campaignId = searchParams.get("campaignId")
  const status = searchParams.get("status")

  let contents = await listContentByWorkspace(workspaceId)
  if (campaignId) contents = contents.filter((c) => c.campaignId === campaignId)
  if (status) contents = contents.filter((c) => c.status === status)
  contents.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const withVariants = await Promise.all(
    contents.map(async (c) => ({ ...c, variants: await listVariantsByContent(c.id) })),
  )

  return NextResponse.json(withVariants)
})

// POST /api/content
export const POST = withWorkspaceAuth(async (req, { workspaceId }) => {
  const body = await req.json()
  const { campaignId, captionMaster, mediaUrl, mediaType, hashtags, link, scheduledAt } = body

  if (!captionMaster) {
    return NextResponse.json({ error: "captionMaster is required" }, { status: 400 })
  }

  const content = await createContent({
    workspaceId,
    campaignId: campaignId || null,
    captionMaster,
    mediaUrl: mediaUrl || null,
    mediaType: mediaType || null,
    hashtags: hashtags || null,
    link: link || null,
    scheduledAt: scheduledAt || null,
    status: "draft",
  })

  return NextResponse.json(content, { status: 201 })
})
