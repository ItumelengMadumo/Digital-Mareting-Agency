import { randomUUID } from "crypto"
import { DeleteCommand, GetCommand, PutCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb"
import { ddb, tableName } from "./client"

export interface BaseItem {
  id: string
  createdAt: string
  updatedAt: string
  gsi1pk?: string
  gsi1sk?: string
  gsi2pk?: string
  gsi2sk?: string
}

interface RepositoryOptions {
  gsi1Name?: string
  gsi2Name?: string
}

/**
 * A deliberately simple, un-optimized DynamoDB repository factory: one table per entity,
 * a single generic GSI1 for "list by parent id" queries. This is the fast/pragmatic data
 * layer chosen to replace Prisma for now — see the redesign plan for the rationale and
 * the intent to revisit the database layer later.
 */
export function createRepository<T extends BaseItem>(entity: string, options: RepositoryOptions = {}) {
  const table = tableName(entity)
  const gsi1Name = options.gsi1Name ?? "GSI1"
  const gsi2Name = options.gsi2Name ?? "GSI2"

  async function get(id: string): Promise<T | null> {
    const res = await ddb.send(new GetCommand({ TableName: table, Key: { id } }))
    return (res.Item as T) ?? null
  }

  async function create(
    data: Omit<T, "id" | "createdAt" | "updatedAt" | "gsi1pk" | "gsi1sk" | "gsi2pk" | "gsi2sk"> & { id?: string },
    index?: { gsi1pk?: string; gsi1sk?: string; gsi2pk?: string; gsi2sk?: string },
  ): Promise<T> {
    const now = new Date().toISOString()
    const item = {
      ...data,
      id: data.id ?? randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...(index?.gsi1pk ? { gsi1pk: index.gsi1pk, gsi1sk: index.gsi1sk ?? now } : {}),
      ...(index?.gsi2pk ? { gsi2pk: index.gsi2pk, gsi2sk: index.gsi2sk ?? now } : {}),
    } as unknown as T
    await ddb.send(new PutCommand({ TableName: table, Item: item }))
    return item
  }

  async function update(id: string, patch: Partial<T>): Promise<T> {
    const existing = await get(id)
    if (!existing) throw new Error(`${entity} not found: ${id}`)
    const updated = { ...existing, ...patch, id, updatedAt: new Date().toISOString() } as T
    await ddb.send(new PutCommand({ TableName: table, Item: updated }))
    return updated
  }

  async function remove(id: string): Promise<void> {
    await ddb.send(new DeleteCommand({ TableName: table, Key: { id } }))
  }

  async function listByGsi1(pk: string): Promise<T[]> {
    const res = await ddb.send(
      new QueryCommand({
        TableName: table,
        IndexName: gsi1Name,
        KeyConditionExpression: "gsi1pk = :pk",
        ExpressionAttributeValues: { ":pk": pk },
      }),
    )
    return (res.Items as T[]) ?? []
  }

  async function listByGsi2(pk: string): Promise<T[]> {
    const res = await ddb.send(
      new QueryCommand({
        TableName: table,
        IndexName: gsi2Name,
        KeyConditionExpression: "gsi2pk = :pk",
        ExpressionAttributeValues: { ":pk": pk },
      }),
    )
    return (res.Items as T[]) ?? []
  }

  // Escape hatch for the handful of admin-only "list everything" needs. Avoid using this
  // in workspace-scoped routes — it does a full table scan.
  async function listAll(): Promise<T[]> {
    const res = await ddb.send(new ScanCommand({ TableName: table }))
    return (res.Items as T[]) ?? []
  }

  return { table, get, create, update, remove, listByGsi1, listByGsi2, listAll }
}
