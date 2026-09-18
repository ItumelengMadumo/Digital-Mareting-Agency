import { NextResponse } from "next/server"
import { withResourceAuth } from "@/lib/auth-helpers"
import { getLead, updateLead } from "@/lib/db/leads"
import { listCommunicationsByLead } from "@/lib/db/communications"
import { listDealsByLead } from "@/lib/db/deals"

// GET /api/leads/[id]
export const GET = withResourceAuth<{ id: string }>(
  async ({ id }) => (await getLead(id))?.workspaceId ?? null,
  async (_req, { params }) => {
    const lead = await getLead(params.id)
    if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const [communications, deals] = await Promise.all([
      listCommunicationsByLead(lead.id),
      listDealsByLead(lead.id),
    ])
    communications.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

    return NextResponse.json({ ...lead, communications, deals })
  },
)

// PATCH /api/leads/[id]
export const PATCH = withResourceAuth<{ id: string }>(
  async ({ id }) => (await getLead(id))?.workspaceId ?? null,
  async (req, { params }) => {
    const body = await req.json()
    const patch: Record<string, unknown> = {}
    for (const key of ["name", "email", "phone", "company", "position", "source", "status", "notes", "assignedTo"]) {
      if (body[key] !== undefined) patch[key] = body[key] || null
    }
    if (body.value !== undefined) patch.value = body.value ? parseFloat(body.value) : null

    const lead = await updateLead(params.id, patch)
    return NextResponse.json(lead)
  },
)
