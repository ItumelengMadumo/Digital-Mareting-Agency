import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/leads/[id]
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        communications: { orderBy: { createdAt: "desc" } },
        deals: { include: { product: true } },
      },
    })
    if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(lead)
  } catch (error) {
    console.error("Lead fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/leads/[id]
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()

    const data: Record<string, unknown> = {}
    for (const key of ["name", "email", "phone", "company", "position", "source", "status", "notes", "assignedTo"]) {
      if (body[key] !== undefined) data[key] = body[key] || null
    }
    if (body.value !== undefined) data.value = body.value ? parseFloat(body.value) : null

    const lead = await prisma.lead.update({ where: { id }, data })
    return NextResponse.json(lead)
  } catch (error) {
    console.error("Lead update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
