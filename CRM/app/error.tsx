"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log the error for debugging
    console.error("Application error:", error)

    // Auto-redirect to dashboard after 5 seconds if user doesn't take action
    const timer = setTimeout(() => {
      router.push("/dashboard")
    }, 5000)

    return () => clearTimeout(timer)
  }, [error, router])

  const handleGoToDashboard = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>
            An unexpected error occurred. You'll be redirected to your dashboard automatically in a few seconds.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            <strong>Error:</strong> {error.message || "Unknown error occurred"}
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={reset} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>
            <Button variant="outline" onClick={handleGoToDashboard} className="w-full bg-transparent">
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
