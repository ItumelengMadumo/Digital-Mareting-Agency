import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/communications
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const leadId = searchParams.get("leadId")

    const where: Record<string, unknown> = {}
    if (leadId) where.leadId = leadId

    const comms = await prisma.communication.findMany({
      where,
      include: { lead: { select: { id: true, name: true, company: true } } },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(comms)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

// POST /api/communications
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { leadId, type, subject, body: content, outcome, direction } = body

    if (!leadId || !type) {
      return NextResponse.json({ error: "leadId and type are required" }, { status: 400 })
    }

    const comm = await prisma.communication.create({
      data: {
        leadId,
        type,
        subject: subject || null,
        body: content || null,
        outcome: outcome || null,
        direction: direction || "outbound",
      },
    })

    return NextResponse.json(comm, { status: 201 })
  } catch (error) {
    console.error("Communication creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
