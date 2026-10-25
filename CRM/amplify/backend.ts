import { defineBackend } from "@aws-amplify/backend"
import { auth } from "./auth/resource"
import { postConfirmation } from "./auth/post-confirmation/resource"
import { storage } from "./storage/resource"
import { createTables } from "./data/tables"

const backend = defineBackend({ auth, postConfirmation, storage })

// master keeps the original "SocialSync" table names and retains data on stack deletion;
// other branches and sandboxes get their own throwaway tables.
const branch = process.env.AWS_BRANCH
const isProduction = branch === "master"
const tablePrefix = isProduction ? "SocialSync" : `SocialSync-${branch ?? "sandbox"}`

const dataStack = backend.createStack("SocialSyncTables")
const tables = createTables(dataStack, tablePrefix, isProduction)

const postConfirmationLambda = backend.postConfirmation.resources.lambda
for (const table of tables) table.grantReadWriteData(postConfirmationLambda)
backend.postConfirmation.addEnvironment("DYNAMODB_TABLE_PREFIX", tablePrefix)

// Read by the Next.js server (written into .env.production by amplify.yml).
backend.addOutput({
  custom: {
    tablePrefix,
    region: dataStack.region,
  },
})
