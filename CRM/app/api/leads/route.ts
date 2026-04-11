import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/leads
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")
    const status = searchParams.get("status")

    const where: Record<string, unknown> = {}
    if (workspaceId) where.workspaceId = workspaceId
    if (status) where.status = status

    const leads = await prisma.lead.findMany({
      where,
      include: {
        _count: { select: { communications: true, deals: true } },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(leads)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

// POST /api/leads
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { workspaceId, name, email, phone, company, position, source, status, value, notes, assignedTo } = body

    if (!workspaceId || !name) {
      return NextResponse.json({ error: "workspaceId and name are required" }, { status: 400 })
    }

    const lead = await prisma.lead.create({
      data: {
        workspaceId,
        name,
        email: email || null,
        phone: phone || null,
        company: company || null,
        position: position || null,
        source: source || null,
        status: status || "new",
        value: value ? parseFloat(value) : null,
        notes: notes || null,
        assignedTo: assignedTo || null,
      },
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error("Lead creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
