import { NextResponse } from "next/server"
import { requireWorkspaceAccess, HttpError } from "@/lib/auth-helpers"
import { getLead } from "@/lib/db/leads"
import { createCommunication, listCommunicationsByLead } from "@/lib/db/communications"

// GET /api/communications?leadId=...
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const leadId = searchParams.get("leadId")
    if (!leadId) return NextResponse.json({ error: "leadId is required" }, { status: 400 })

    const lead = await getLead(leadId)
    if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 })
    await requireWorkspaceAccess(lead.workspaceId)

    const comms = await listCommunicationsByLead(leadId)
    comms.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

    return NextResponse.json(comms.map((c) => ({ ...c, lead: { id: lead.id, name: lead.name, company: lead.company } })))
  } catch (error) {
    if (error instanceof HttpError) return NextResponse.json({ error: error.message }, { status: error.status })
    console.error("Communications list error:", error)
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

    const lead = await getLead(leadId)
    if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 })
    await requireWorkspaceAccess(lead.workspaceId)

    const comm = await createCommunication({
      leadId,
      type,
      subject: subject || null,
      body: content || null,
      outcome: outcome || null,
      direction: direction || "outbound",
    })

    return NextResponse.json(comm, { status: 201 })
  } catch (error) {
    if (error instanceof HttpError) return NextResponse.json({ error: error.message }, { status: error.status })
    console.error("Communication creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
