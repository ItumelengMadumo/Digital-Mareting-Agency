"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileQuestion, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect to dashboard after 5 seconds
    const timer = setTimeout(() => {
      router.push("/dashboard")
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  const handleGoToDashboard = () => {
    router.push("/dashboard")
  }

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FileQuestion className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle>Page Not Found</CardTitle>
          <CardDescription>
            The page you're looking for doesn't exist. You'll be redirected to your dashboard automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Button onClick={handleGoToDashboard} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
            <Button variant="outline" onClick={handleGoBack} className="w-full bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
