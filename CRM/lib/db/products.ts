import { createRepository, type BaseItem } from "./repository"

export interface ProductRecord extends BaseItem {
  workspaceId: string
  name: string
  description?: string | null
  price: number
  category?: string | null
  status: "active" | "inactive" | "archived"
}

const repo = createRepository<ProductRecord>("Products")

export async function createProduct(data: Omit<ProductRecord, "id" | "createdAt" | "updatedAt">) {
  return repo.create(data, { gsi1pk: data.workspaceId })
}

export async function listProductsByWorkspace(workspaceId: string) {
  return repo.listByGsi1(workspaceId)
}
