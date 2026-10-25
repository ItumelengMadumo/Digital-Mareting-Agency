// Amplify Hosting doesn't pass build-time values to the Next.js server at runtime, so this writes
// them into .env.production before `next build`. Values come from amplify_outputs.json (generated
// by `ampx pipeline-deploy`) plus a short list of app settings from the Amplify console.
import { appendFileSync, existsSync, readFileSync } from "node:fs"

const lines = []

if (existsSync("amplify_outputs.json")) {
  const { custom = {} } = JSON.parse(readFileSync("amplify_outputs.json", "utf8"))
  if (custom.tablePrefix) lines.push(`DYNAMODB_TABLE_PREFIX=${custom.tablePrefix}`)
  if (custom.region) lines.push(`DYNAMODB_REGION=${custom.region}`)
} else {
  console.warn("amplify_outputs.json not found; the backend phase did not run")
}

for (const key of ["SITE_LEADS_WORKSPACE_ID", "CRON_SECRET"]) {
  if (process.env[key]) lines.push(`${key}=${process.env[key]}`)
}

if (lines.length) appendFileSync(".env.production", lines.join("\n") + "\n")
console.log(`Wrote ${lines.length} runtime settings: ${lines.map((l) => l.split("=")[0]).join(", ") || "none"}`)
