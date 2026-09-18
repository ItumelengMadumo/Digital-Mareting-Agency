import { NextResponse } from "next/server"
import { withWorkspaceAuth } from "@/lib/auth-helpers"
import { createLead, listLeadsByWorkspace } from "@/lib/db/leads"

// GET /api/leads
export const GET = withWorkspaceAuth(async (req, { workspaceId }) => {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")

  let leads = await listLeadsByWorkspace(workspaceId)
  if (status) leads = leads.filter((l) => l.status === status)
  leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return NextResponse.json(leads)
})

// POST /api/leads
export const POST = withWorkspaceAuth(async (req, { workspaceId }) => {
  const body = await req.json()
  const { name, email, phone, company, position, source, status, value, notes, assignedTo } = body

  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 })
  }

  const lead = await createLead({
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
  })

  return NextResponse.json(lead, { status: 201 })
})
