"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <h2 className="text-lg font-semibold mb-2">Loading Dashboard...</h2>
          <p className="text-sm text-muted-foreground text-center">Preparing your social media management tools</p>
        </CardContent>
      </Card>
    </div>
  )
}
