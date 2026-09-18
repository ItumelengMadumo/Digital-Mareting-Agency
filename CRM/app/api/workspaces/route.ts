import { NextResponse } from "next/server"
import { getCurrentUser, HttpError } from "@/lib/auth-helpers"
import { createWorkspace, listWorkspacesByIds } from "@/lib/db/workspaces"
import { addMember, listWorkspacesForUser } from "@/lib/db/workspace-members"

// GET /api/workspaces - list workspaces the current session user belongs to
export async function GET() {
  try {
    const user = await getCurrentUser()
    const memberships = await listWorkspacesForUser(user.id)
    const workspaces = await listWorkspacesByIds(memberships.map((m) => m.workspaceId))

    const byId = new Map(memberships.map((m) => [m.workspaceId, m.role]))
    return NextResponse.json(workspaces.map((w) => ({ ...w, role: byId.get(w.id) })))
  } catch (error) {
    if (error instanceof HttpError) return NextResponse.json({ error: error.message }, { status: error.status })
    console.error("Workspace list error:", error)
    return NextResponse.json([], { status: 200 })
  }
}

// POST /api/workspaces - create a workspace owned by the current session user
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    const body = await req.json()
    const { name, type } = body

    if (!name || !type) {
      return NextResponse.json({ error: "name and type are required" }, { status: 400 })
    }

    const workspace = await createWorkspace({ name, type, ownerId: user.id })
    await addMember(workspace.id, user.id, "owner")

    return NextResponse.json({ ...workspace, role: "owner" }, { status: 201 })
  } catch (error) {
    if (error instanceof HttpError) return NextResponse.json({ error: error.message }, { status: error.status })
    console.error("Workspace creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
