"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react"
import "@aws-amplify/ui-react/styles.css"

const formFields = {
  signUp: {
    given_name: { label: "First name", placeholder: "Your first name", order: 1 },
    family_name: { label: "Last name", placeholder: "Your last name", order: 2 },
    email: { order: 3 },
    password: { order: 4 },
    confirm_password: { order: 5 },
  },
}

/** Only allow redirects to paths inside the app, never to another site. */
function safeNext(next: string | null) {
  return next && next.startsWith("/dashboard") ? next : "/dashboard"
}

function RedirectWhenSignedIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { authStatus } = useAuthenticator((context) => [context.authStatus])

  useEffect(() => {
    if (authStatus === "authenticated") {
      router.replace(safeNext(searchParams.get("next")))
      router.refresh()
    }
  }, [authStatus, router, searchParams])

  return <p className="py-8 text-center text-sm text-slate-500">Signing you in...</p>
}

export default function AuthPanel({ mode }: { mode: "signIn" | "signUp" }) {
  return (
    <div className="w-full max-w-md">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          {mode === "signIn" ? "Welcome back" : "Start your free trial"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {mode === "signIn"
            ? "Log in to your SocialSync account."
            : "Create your account and publish your first post in minutes."}
        </p>
      </div>
      <div className="socialsync-auth rounded-2xl border border-slate-200 bg-white shadow-lg">
        <Authenticator.Provider>
          <Authenticator initialState={mode} formFields={formFields}>
            <RedirectWhenSignedIn />
          </Authenticator>
        </Authenticator.Provider>
      </div>
      <p className="mt-6 text-center text-sm text-slate-600">
        Just looking?{" "}
        <Link href="/demo" className="font-medium text-blue-500 hover:underline">
          View the live demo
        </Link>
      </p>
    </div>
  )
}
