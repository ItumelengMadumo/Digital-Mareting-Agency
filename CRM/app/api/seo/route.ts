import { NextResponse } from "next/server"
import { withWorkspaceAuth } from "@/lib/auth-helpers"
import { createSEOKeyword, listSEOKeywordsByWorkspace } from "@/lib/db/seo-keywords"

// GET /api/seo
export const GET = withWorkspaceAuth(async (_req, { workspaceId }) => {
  const keywords = await listSEOKeywordsByWorkspace(workspaceId)
  keywords.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  return NextResponse.json(keywords)
})

// POST /api/seo
export const POST = withWorkspaceAuth(async (req, { workspaceId }) => {
  const body = await req.json()
  const { keyword, volume, difficulty, currentRank, targetRank, url } = body

  if (!keyword) {
    return NextResponse.json({ error: "keyword is required" }, { status: 400 })
  }

  const kw = await createSEOKeyword({
    workspaceId,
    keyword,
    volume: volume ? parseInt(volume) : null,
    difficulty: difficulty ? parseInt(difficulty) : null,
    currentRank: currentRank ? parseInt(currentRank) : null,
    targetRank: targetRank ? parseInt(targetRank) : null,
    url: url || null,
  })

  return NextResponse.json(kw, { status: 201 })
})
