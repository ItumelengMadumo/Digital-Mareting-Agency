import { NextResponse } from "next/server"
import { z } from "zod"
import { getCurrentUser, HttpError } from "@/lib/auth-helpers"
import { getUserById, updateUser, type UserRecord } from "@/lib/db/users"

function toProfile(user: UserRecord) {
  const { id, email, firstName, lastName, avatarUrl, phone, bio, handle, timezone, createdAt } = user
  return { id, email, firstName, lastName, avatarUrl, phone, bio, handle, timezone, createdAt }
}

function errorResponse(error: unknown) {
  if (error instanceof HttpError) return NextResponse.json({ error: error.message }, { status: error.status })
  console.error("/api/me error:", error)
  return NextResponse.json({ error: "Internal server error" }, { status: 500 })
}

// GET /api/me - the signed-in user's SocialSync profile
export async function GET() {
  try {
    const { id } = await getCurrentUser()
    const user = await getUserById(id)
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
    return NextResponse.json(toProfile(user))
  } catch (error) {
    return errorResponse(error)
  }
}

const profileSchema = z.object({
  firstName: z.string().trim().min(1).max(100).optional(),
  lastName: z.string().trim().max(100).optional(),
  phone: z.string().trim().max(40).optional(),
  bio: z.string().trim().max(500).optional(),
  handle: z
    .string()
    .trim()
    .max(50)
    .regex(/^[a-zA-Z0-9_.]*$/, "Use letters, numbers, dots and underscores only")
    .optional(),
  timezone: z.string().trim().max(60).optional(),
  avatarUrl: z.string().trim().url().max(1000).or(z.literal("")).optional(),
})

// PATCH /api/me - update profile fields (email changes go through Cognito, not here)
export async function PATCH(req: Request) {
  try {
    const { id } = await getCurrentUser()
    const parsed = profileSchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid profile" }, { status: 400 })
    }
    const updated = await updateUser(id, parsed.data)
    return NextResponse.json(toProfile(updated))
  } catch (error) {
    return errorResponse(error)
  }
}
