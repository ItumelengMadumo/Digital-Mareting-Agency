import { createUser, getUserByEmail, updateUser, type UserRecord } from "./users"
import { createWorkspace } from "./workspaces"
import { addMember } from "./workspace-members"

/** "itu" -> "Itu", "van der merwe" -> "Van Der Merwe". */
function capitalizeName(name: string) {
  return name
    .split(/(\s+|-)/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}

interface ProvisionInput {
  email: string
  cognitoSub?: string
  firstName?: string
  lastName?: string
}

/**
 * Returns the SocialSync user for a Cognito identity, creating the user, their first workspace
 * and the owner membership if they don't exist yet. Called by the Cognito post-confirmation
 * trigger and, as a fallback, on the first authenticated request. Safe to call repeatedly.
 */
export async function provisionUser({ email, cognitoSub, firstName, lastName }: ProvisionInput): Promise<UserRecord> {
  const normalizedEmail = email.trim().toLowerCase()
  const existing = await getUserByEmail(normalizedEmail)
  if (existing) {
    if (cognitoSub && existing.cognitoSub !== cognitoSub) {
      return updateUser(existing.id, { cognitoSub })
    }
    return existing
  }

  const first = capitalizeName(firstName?.trim() || normalizedEmail.split("@")[0])
  let user: UserRecord
  try {
    user = await createUser({ email: normalizedEmail, cognitoSub, firstName: first, lastName: capitalizeName(lastName?.trim() || "") })
  } catch {
    // Another request created the user between our read and write.
    const raced = await getUserByEmail(normalizedEmail)
    if (raced) return raced
    throw new Error(`Could not provision user ${normalizedEmail}`)
  }

  const workspace = await createWorkspace({ name: `${first}'s Workspace`, type: "individual", ownerId: user.id })
  await addMember(workspace.id, user.id, "owner")
  return user
}
