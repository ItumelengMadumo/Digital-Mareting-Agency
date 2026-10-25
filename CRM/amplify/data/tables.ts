import { RemovalPolicy, type Stack } from "aws-cdk-lib"
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb"
import { ENTITIES } from "./entities"

/** Creates one table per entity, named `${prefix}_${Entity}` to match lib/db/client.ts `tableName()`. */
export function createTables(stack: Stack, prefix: string, retain: boolean): Table[] {
  return ENTITIES.map((entity) => {
    const table = new Table(stack, entity.name, {
      tableName: `${prefix}_${entity.name}`,
      partitionKey: { name: "id", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: retain },
      removalPolicy: retain ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
    })
    if (entity.gsi1) {
      table.addGlobalSecondaryIndex({
        indexName: "GSI1",
        partitionKey: { name: "gsi1pk", type: AttributeType.STRING },
        sortKey: { name: "gsi1sk", type: AttributeType.STRING },
      })
    }
    if (entity.gsi2) {
      table.addGlobalSecondaryIndex({
        indexName: "GSI2",
        partitionKey: { name: "gsi2pk", type: AttributeType.STRING },
        sortKey: { name: "gsi2sk", type: AttributeType.STRING },
      })
    }
    return table
  })
}
