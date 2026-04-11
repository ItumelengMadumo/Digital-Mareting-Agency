import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    const passwordHash = await hash(password, 12)

    const user = await prisma.user.create({
      data: { email, passwordHash, firstName, lastName },
    })

    // Create default workspace
    const workspace = await prisma.workspace.create({
      data: {
        name: `${firstName}'s Workspace`,
        type: "individual",
        ownerId: user.id,
        members: {
          create: { userId: user.id, role: "owner" },
        },
      },
    })

    return NextResponse.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      workspaceId: workspace.id,
    }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
