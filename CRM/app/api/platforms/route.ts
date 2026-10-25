import { NextResponse } from "next/server"
import { withWorkspaceAuth } from "@/lib/auth-helpers"
import { createSocialAccount, listSocialAccountsByWorkspace } from "@/lib/db/social-accounts"

// GET /api/platforms
export const GET = withWorkspaceAuth(async (_req, { workspaceId }) => {
  const accounts = await listSocialAccountsByWorkspace(workspaceId)
  accounts.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  // Never send platform tokens to the browser.
  return NextResponse.json(accounts.map(({ accessToken: _a, refreshToken: _r, ...account }) => account))
})

// POST /api/platforms - connect a social account
// NOTE: this still just records a SocialAccount row (accessToken/refreshToken stay empty).
// Real OAuth (Meta/X/LinkedIn) is a later phase — see the redesign plan's Phase 1.
export const POST = withWorkspaceAuth(async (req, { workspaceId }) => {
  const body = await req.json()
  const { platform, accountType, accountName } = body

  if (!platform || !accountType || !accountName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const account = await createSocialAccount({
    workspaceId,
    platform,
    accountType,
    accountName,
    followers: 0,
    isConnected: true,
    lastSyncAt: new Date().toISOString(),
  })

  return NextResponse.json(account, { status: 201 })
})
