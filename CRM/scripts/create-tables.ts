import {
  CreateTableCommand,
  DynamoDBClient,
  ResourceInUseException,
  type CreateTableCommandInput,
} from "@aws-sdk/client-dynamodb"

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  ...(process.env.DYNAMODB_ENDPOINT ? { endpoint: process.env.DYNAMODB_ENDPOINT } : {}),
})

const prefix = process.env.DYNAMODB_TABLE_PREFIX || "SocialSync"

// Every table shares the same shape: PK "id", plus up to two generic GSIs (gsi1pk/gsi1sk,
// gsi2pk/gsi2sk) used by lib/db/repository.ts. See the redesign plan section 1.1 for why
// this "one table per entity, generic GSI" approach was chosen over single-table design.
const ENTITIES: { name: string; gsi1?: boolean; gsi2?: boolean }[] = [
  { name: "Users", gsi1: true },
  { name: "Workspaces", gsi1: true },
  { name: "WorkspaceMembers", gsi1: true, gsi2: true },
  { name: "Clients", gsi1: true },
  { name: "Campaigns", gsi1: true },
  { name: "Content", gsi1: true, gsi2: true },
  { name: "Variants", gsi1: true },
  { name: "Distributions", gsi1: true, gsi2: true },
  { name: "SocialAccounts", gsi1: true },
  { name: "CampaignMetrics", gsi1: true },
  { name: "Leads", gsi1: true },
  { name: "Communications", gsi1: true },
  { name: "Products", gsi1: true },
  { name: "Deals", gsi1: true },
  { name: "AutomationRules", gsi1: true },
  { name: "AutomationLogs", gsi1: true },
  { name: "TrackingAssets", gsi1: true, gsi2: true },
  { name: "InfluencerCampaigns", gsi1: true },
  { name: "InfluencerAssignments", gsi1: true },
  { name: "Affiliates", gsi1: true, gsi2: true },
  { name: "AffiliateConversions", gsi1: true },
  { name: "SEOKeywords", gsi1: true },
  { name: "PPCCampaigns", gsi1: true },
  { name: "OfflineCampaigns", gsi1: true },
  { name: "ActivityLogs", gsi1: true },
  { name: "Invitations", gsi1: true, gsi2: true },
]

function buildTableInput(entity: (typeof ENTITIES)[number]): CreateTableCommandInput {
  const attributeDefinitions = [{ AttributeName: "id", AttributeType: "S" as const }]
  const globalSecondaryIndexes = []

  if (entity.gsi1) {
    attributeDefinitions.push(
      { AttributeName: "gsi1pk", AttributeType: "S" },
      { AttributeName: "gsi1sk", AttributeType: "S" },
    )
    globalSecondaryIndexes.push({
      IndexName: "GSI1",
      KeySchema: [
        { AttributeName: "gsi1pk", KeyType: "HASH" as const },
        { AttributeName: "gsi1sk", KeyType: "RANGE" as const },
      ],
      Projection: { ProjectionType: "ALL" as const },
    })
  }

  if (entity.gsi2) {
    attributeDefinitions.push(
      { AttributeName: "gsi2pk", AttributeType: "S" },
      { AttributeName: "gsi2sk", AttributeType: "S" },
    )
    globalSecondaryIndexes.push({
      IndexName: "GSI2",
      KeySchema: [
        { AttributeName: "gsi2pk", KeyType: "HASH" as const },
        { AttributeName: "gsi2sk", KeyType: "RANGE" as const },
      ],
      Projection: { ProjectionType: "ALL" as const },
    })
  }

  return {
    TableName: `${prefix}_${entity.name}`,
    BillingMode: "PAY_PER_REQUEST",
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: attributeDefinitions,
    ...(globalSecondaryIndexes.length ? { GlobalSecondaryIndexes: globalSecondaryIndexes } : {}),
  }
}

async function main() {
  for (const entity of ENTITIES) {
    const input = buildTableInput(entity)
    try {
      await client.send(new CreateTableCommand(input))
      console.log(`created ${input.TableName}`)
    } catch (error) {
      if (error instanceof ResourceInUseException) {
        console.log(`skipped ${input.TableName} (already exists)`)
      } else {
        throw error
      }
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
