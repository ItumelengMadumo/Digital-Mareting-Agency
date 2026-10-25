import { NextResponse, type NextRequest } from "next/server"
import { fetchAuthSession } from "aws-amplify/auth/server"
import { runWithAmplifyServerContext } from "@/lib/amplify-server"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const authenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec)
        return session.tokens?.idToken !== undefined
      } catch {
        return false
      }
    },
  })
  if (authenticated) return response

  const loginUrl = new URL("/auth/login", request.url)
  loginUrl.searchParams.set("next", request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
