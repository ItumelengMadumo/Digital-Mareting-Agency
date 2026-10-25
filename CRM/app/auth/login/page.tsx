import { Suspense } from "react"
import type { Metadata } from "next"
import AuthPanel from "@/components/auth/auth-panel"

export const metadata: Metadata = {
  title: "Log in - SocialSync",
  description: "Log in to your SocialSync account.",
}

export default function LoginPage() {
  return (
    <Suspense>
      <AuthPanel mode="signIn" />
    </Suspense>
  )
}
