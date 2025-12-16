"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function Loading() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // If loading takes more than 10 seconds, redirect to dashboard
    const timer = setTimeout(() => {
      if (pathname !== "/dashboard") {
        console.warn("Loading timeout, redirecting to dashboard")
        router.push("/dashboard")
      }
    }, 10000)

    return () => clearTimeout(timer)
  }, [router, pathname])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <h2 className="text-lg font-semibold mb-2">Loading...</h2>
          <p className="text-sm text-muted-foreground text-center">Please wait while we load your content</p>
        </CardContent>
      </Card>
    </div>
  )
}
