import { createRepository, type BaseItem } from "./repository"

export interface UserRecord extends BaseItem {
  email: string
  passwordHash: string
  firstName: string
  lastName: string
  avatarUrl?: string
  phone?: string
}

const repo = createRepository<UserRecord>("Users")

export async function getUserById(id: string) {
  return repo.get(id)
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const matches = await repo.listByGsi1(email)
  return matches[0] ?? null
}

export async function createUser(data: Omit<UserRecord, "id" | "createdAt" | "updatedAt" | "gsi1pk" | "gsi1sk">) {
  const existing = await getUserByEmail(data.email)
  if (existing) throw new Error("Email already registered")
  return repo.create(data, { gsi1pk: data.email })
}

export async function updateUser(id: string, patch: Partial<UserRecord>) {
  return repo.update(id, patch)
}
