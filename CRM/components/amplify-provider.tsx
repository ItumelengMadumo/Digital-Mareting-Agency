"use client"

import { Amplify } from "aws-amplify"
import outputs from "@/amplify_outputs.json"

// ssr: true keeps the Cognito tokens in cookies so middleware and API routes can read the session.
Amplify.configure(outputs, { ssr: true })

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
