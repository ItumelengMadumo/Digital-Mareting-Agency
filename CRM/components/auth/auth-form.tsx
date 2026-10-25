"use client"

import { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface AuthFormProps {
  mode: "login" | "register"
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const isLogin = mode === "login"

  const handleContinue = () => {
    setIsLoading(true)
    // Cognito's hosted page handles both sign in and sign up; `signup` opens the sign-up tab.
    signIn("cognito", { callbackUrl: "/dashboard" }, isLogin ? undefined : { screen_hint: "signup" })
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{isLogin ? "Sign in" : "Start your free trial"}</CardTitle>
        <CardDescription>
          {isLogin ? "Log in to your SocialSync account" : "Create your account to start publishing in minutes"}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button className="w-full" disabled={isLoading} onClick={handleContinue}>
          {isLoading ? "Redirecting..." : isLogin ? "Continue to sign in" : "Create free account"}
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/demo">View live demo</Link>
        </Button>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground text-center w-full">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link
            href={isLogin ? "/auth/register" : "/auth/login"}
            className="text-primary underline-offset-4 hover:underline"
          >
            {isLogin ? "Start free trial" : "Log in"}
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
