import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({
  region: process.env.DYNAMODB_REGION || process.env.AWS_REGION || "us-east-1",
  ...(process.env.DYNAMODB_ENDPOINT ? { endpoint: process.env.DYNAMODB_ENDPOINT } : {}),
})

export const ddb = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
})

// All tables share one GSI named "GSI1" (gsi1pk/gsi1sk) for "list children of parent" queries.
// See scripts/create-tables.ts for the exact table/index definitions.
export function tableName(entity: string): string {
  const prefix = process.env.DYNAMODB_TABLE_PREFIX || "SocialSync"
  return `${prefix}_${entity}`
}
