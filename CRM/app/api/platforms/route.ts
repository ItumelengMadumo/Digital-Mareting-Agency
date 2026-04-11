import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/platforms
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")

    const accounts = await prisma.socialAccount.findMany({
      where: workspaceId ? { workspaceId } : {},
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(accounts)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

// POST /api/platforms - connect a social account
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { workspaceId, platform, accountType, accountName } = body

    if (!workspaceId || !platform || !accountType || !accountName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const account = await prisma.socialAccount.create({
      data: {
        workspaceId,
        platform,
        accountType,
        accountName,
        isConnected: true,
        lastSyncAt: new Date(),
      },
    })

    return NextResponse.json(account, { status: 201 })
  } catch (error) {
    console.error("Platform connect error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
