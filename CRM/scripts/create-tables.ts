import {
  CreateTableCommand,
  DynamoDBClient,
  ResourceInUseException,
  type CreateTableCommandInput,
} from "@aws-sdk/client-dynamodb"
import { ENTITIES } from "../amplify/data/entities"

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  ...(process.env.DYNAMODB_ENDPOINT ? { endpoint: process.env.DYNAMODB_ENDPOINT } : {}),
})

const prefix = process.env.DYNAMODB_TABLE_PREFIX || "SocialSync"

// Same schema as AWS (amplify/data/tables.ts); this script is for DynamoDB Local only.

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
