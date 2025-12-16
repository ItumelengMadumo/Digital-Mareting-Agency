import type { Metadata } from "next"
import LoginForm from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login - SocialSync",
  description: "Log in to your SocialSync account.",
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
      <div className="w-full max-w-md p-6">
        <LoginForm />
      </div>
    </div>
  )
}
