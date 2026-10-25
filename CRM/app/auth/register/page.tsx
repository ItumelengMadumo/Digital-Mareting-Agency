import { Suspense } from "react"
import type { Metadata } from "next"
import AuthPanel from "@/components/auth/auth-panel"

export const metadata: Metadata = {
  title: "Start your free trial - SocialSync",
  description: "Create your SocialSync account and start publishing everywhere at once.",
}

export default function RegisterPage() {
  return (
    <Suspense>
      <AuthPanel mode="signUp" />
    </Suspense>
  )
}
