import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { createUser } from "@/lib/db/users"
import { createWorkspace } from "@/lib/db/workspaces"
import { addMember } from "@/lib/db/workspace-members"

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const passwordHash = await hash(password, 12)

    let user
    try {
      user = await createUser({ email, passwordHash, firstName, lastName })
    } catch {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    const workspace = await createWorkspace({
      name: `${firstName}'s Workspace`,
      type: "individual",
      ownerId: user.id,
    })
    await addMember(workspace.id, user.id, "owner")

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        workspaceId: workspace.id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
