import { NextResponse } from "next/server"
import { z } from "zod"
import { withWorkspaceAuth } from "@/lib/auth-helpers"
import { createFeedback } from "@/lib/db/feedback"

const schema = z.object({
  kind: z.enum(["bug", "idea", "question"]),
  message: z.string().trim().min(3, "Tell us a little more").max(5000),
  page: z.string().max(500).optional(),
})

// POST /api/feedback - in-app feedback from pilot users
export const POST = withWorkspaceAuth(async (req, { workspaceId, user }) => {
  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid feedback" }, { status: 400 })
  }

  await createFeedback({
    workspaceId,
    userId: user.id,
    email: user.email,
    kind: parsed.data.kind,
    message: parsed.data.message,
    page: parsed.data.page ?? null,
    userAgent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
  })
  return NextResponse.json({ ok: true }, { status: 201 })
})
