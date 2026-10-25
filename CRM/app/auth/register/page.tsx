import type { Metadata } from "next"
import AuthForm from "@/components/auth/auth-form"

export const metadata: Metadata = {
  title: "Register - SocialSync",
  description: "Create your SocialSync account and start managing your social media presence.",
}

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
      <div className="w-full max-w-md p-6">
        <AuthForm mode="register" />
      </div>
    </div>
  )
}
