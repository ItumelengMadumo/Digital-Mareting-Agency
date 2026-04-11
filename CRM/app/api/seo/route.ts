import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/seo
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")

    const keywords = await prisma.sEOKeyword.findMany({
      where: workspaceId ? { workspaceId } : {},
      orderBy: { updatedAt: "desc" },
    })
    return NextResponse.json(keywords)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

// POST /api/seo
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { workspaceId, keyword, volume, difficulty, currentRank, targetRank, url } = body

    if (!workspaceId || !keyword) {
      return NextResponse.json({ error: "workspaceId and keyword are required" }, { status: 400 })
    }

    const kw = await prisma.sEOKeyword.create({
      data: {
        workspaceId,
        keyword,
        volume: volume ? parseInt(volume) : null,
        difficulty: difficulty ? parseInt(difficulty) : null,
        currentRank: currentRank ? parseInt(currentRank) : null,
        targetRank: targetRank ? parseInt(targetRank) : null,
        url: url || null,
      },
    })

    return NextResponse.json(kw, { status: 201 })
  } catch (error) {
    console.error("SEO keyword creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
