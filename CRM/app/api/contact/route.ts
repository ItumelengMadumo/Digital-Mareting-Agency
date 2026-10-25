import { NextResponse } from "next/server"
import { z } from "zod"
import { createLead } from "@/lib/db/leads"

const schema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(1).max(5000),
})

// Public website contact form. Messages become Leads in the site owner's workspace
// (SITE_LEADS_WORKSPACE_ID) so they show up in the CRM.
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in your name, a valid email and a message." }, { status: 400 })
  }

  const workspaceId = process.env.SITE_LEADS_WORKSPACE_ID
  if (!workspaceId) {
    console.warn("Contact form submitted but SITE_LEADS_WORKSPACE_ID is not set; message not stored")
    return NextResponse.json({ ok: true })
  }

  const { firstName, lastName, email, subject, message } = parsed.data
  try {
    await createLead({
      workspaceId,
      name: `${firstName} ${lastName}`,
      email,
      source: "website",
      status: "new",
      notes: subject ? `${subject}\n\n${message}` : message,
    })
  } catch (error) {
    console.error("Contact form: failed to store lead", error)
    return NextResponse.json({ error: "We couldn't send your message. Please email us instead." }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
