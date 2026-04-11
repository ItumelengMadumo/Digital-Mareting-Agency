import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/workspaces - list workspaces for current user
export async function GET() {
  try {
    const workspaces = await prisma.workspace.findMany({
      include: {
        members: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } } },
        _count: { select: { campaigns: true, clients: true, members: true } },
      },
    })
    return NextResponse.json(workspaces)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

// POST /api/workspaces - create a new workspace
export async function POST(req: Request) {
  try {
    const { name, type, ownerId } = await req.json()
    if (!name || !type || !ownerId) {
      return NextResponse.json({ error: "name, type, and ownerId are required" }, { status: 400 })
    }

    const workspace = await prisma.workspace.create({
      data: {
        name,
        type,
        ownerId,
        members: { create: { userId: ownerId, role: "owner" } },
      },
      include: { members: true },
    })
    return NextResponse.json(workspace, { status: 201 })
  } catch (error) {
    console.error("Workspace creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
