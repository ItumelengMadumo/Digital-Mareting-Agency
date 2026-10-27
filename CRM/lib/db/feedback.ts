import { createRepository, type BaseItem } from "./repository"

export type FeedbackKind = "bug" | "idea" | "question"

export interface FeedbackRecord extends BaseItem {
  workspaceId: string
  userId: string
  email: string
  kind: FeedbackKind
  message: string
  /** The page the user was on when they sent it. */
  page?: string | null
  userAgent?: string | null
}

// GSI1 = workspaceId
const repo = createRepository<FeedbackRecord>("Feedback")

export async function createFeedback(data: Omit<FeedbackRecord, "id" | "createdAt" | "updatedAt">) {
  return repo.create(data, { gsi1pk: data.workspaceId })
}

export async function listFeedbackByWorkspace(workspaceId: string) {
  return repo.listByGsi1(workspaceId)
}
