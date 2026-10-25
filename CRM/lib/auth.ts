import type { NextAuthOptions } from "next-auth"
import CognitoProvider from "next-auth/providers/cognito"
import { createUser, getUserByEmail, updateUser } from "@/lib/db/users"
import { createWorkspace } from "@/lib/db/workspaces"
import { addMember } from "@/lib/db/workspace-members"

/**
 * Finds the app user for a Cognito identity, creating the user, their workspace
 * and the owner membership on first login. Returns the internal user id.
 */
async function resolveUser(email: string, sub: string | undefined, name: string | null | undefined) {
  const existing = await getUserByEmail(email)
  if (existing) {
    if (sub && existing.cognitoSub !== sub) await updateUser(existing.id, { cognitoSub: sub })
    return existing.id
  }

  const [firstName, ...rest] = (name || email.split("@")[0]).split(" ")
  const user = await createUser({ email, cognitoSub: sub, firstName, lastName: rest.join(" ") })
  const workspace = await createWorkspace({
    name: `${firstName}'s Workspace`,
    type: "individual",
    ownerId: user.id,
  })
  await addMember(workspace.id, user.id, "owner")
  return user.id
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer: process.env.COGNITO_ISSUER!,
    }),
  ],
  callbacks: {
    async jwt({ token, profile }) {
      // `profile` is only present on sign-in; afterwards the stored id is reused.
      if (profile?.email) {
        token.id = await resolveUser(profile.email, profile.sub, profile.name)
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.id as string
      }
      return session
    },
  },
}
