import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getMembership } from "@/lib/db/workspace-members"
import type { MemberRole } from "@/lib/types"

const ROLE_RANK: Record<MemberRole, number> = { member: 0, manager: 1, admin: 2, owner: 3 }

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  const id = (session?.user as { id?: string } | undefined)?.id
  if (!id) throw new HttpError(401, "Not authenticated")
  return { id, email: session!.user!.email as string }
}

export async function requireWorkspaceAccess(workspaceId: string, minRole?: MemberRole) {
  const user = await getCurrentUser()
  const membership = await getMembership(workspaceId, user.id)
  if (!membership) throw new HttpError(403, "You do not have access to this workspace")
  if (minRole && ROLE_RANK[membership.role] < ROLE_RANK[minRole]) {
    throw new HttpError(403, `Requires ${minRole} role or higher`)
  }
  return { user, membership }
}

function extractWorkspaceId(req: Request, params?: Record<string, string>): string | null {
  const { searchParams } = new URL(req.url)
  return searchParams.get("workspaceId") || params?.workspaceId || null
}

type RouteContext<P> = { params: Promise<P> }
type Handler<P> = (
  req: Request,
  ctx: RouteContext<P> & { workspaceId: string; user: { id: string; email: string }; membership: Awaited<ReturnType<typeof getMembership>> },
) => Promise<Response>

/**
 * Wraps a route handler so it 403s unless the caller's session has WorkspaceMember access to
 * the workspaceId supplied in the query string, request body, or route params. Every API route
 * previously trusted a client-supplied workspaceId with no session check at all — this closes
 * that gap without changing each route's business logic.
 */
export function withWorkspaceAuth<P = Record<string, string>>(handler: Handler<P>, minRole?: MemberRole) {
  return async (req: Request, routeCtx?: RouteContext<P>) => {
    try {
      const params = routeCtx ? await routeCtx.params : undefined
      let workspaceId = extractWorkspaceId(req, params as Record<string, string> | undefined)

      // POST/PATCH bodies carry workspaceId in JSON, not the query string — peek at a clone
      // so the wrapped handler can still read the original body.
      if (!workspaceId && (req.method === "POST" || req.method === "PATCH" || req.method === "PUT")) {
        try {
          const body = await req.clone().json()
          workspaceId = body?.workspaceId ?? null
        } catch {
          // no JSON body
        }
      }

      if (!workspaceId) {
        return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
      }

      const { user, membership } = await requireWorkspaceAccess(workspaceId, minRole)
      return await handler(req, { params: routeCtx?.params as Promise<P>, workspaceId, user, membership })
    } catch (error) {
      if (error instanceof HttpError) {
        return NextResponse.json({ error: error.message }, { status: error.status })
      }
      console.error("withWorkspaceAuth error:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  }
}

type ResourceHandler<P> = (
  req: Request,
  ctx: { params: P; user: { id: string; email: string } },
) => Promise<Response>

/**
 * For "detail by id" routes (e.g. /api/leads/[id]) that don't carry a workspaceId directly —
 * `resolveWorkspaceId` loads the resource and returns the workspaceId it belongs to (or null
 * if the resource doesn't exist, which 404s). Access is then checked the same way as
 * `withWorkspaceAuth`.
 */
export function withResourceAuth<P>(
  resolveWorkspaceId: (params: P) => Promise<string | null>,
  handler: ResourceHandler<P>,
  minRole?: MemberRole,
) {
  return async (req: Request, routeCtx: RouteContext<P>) => {
    try {
      const params = await routeCtx.params
      const workspaceId = await resolveWorkspaceId(params)
      if (!workspaceId) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
      }
      const { user } = await requireWorkspaceAccess(workspaceId, minRole)
      return await handler(req, { params, user })
    } catch (error) {
      if (error instanceof HttpError) {
        return NextResponse.json({ error: error.message }, { status: error.status })
      }
      console.error("withResourceAuth error:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  }
}
