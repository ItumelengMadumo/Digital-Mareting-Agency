"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, RefreshCw, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface PublishStatusDashboardProps {
  results: Record<string, { status: string; error?: string }>
  onStartOver: () => void
}

export default function PublishStatusDashboard({ results, onStartOver }: PublishStatusDashboardProps) {
  const router = useRouter()
  const successCount = Object.values(results).filter((r) => r.status === "success").length
  const totalCount = Object.keys(results).length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Publishing Complete</CardTitle>
        <CardDescription>
          {successCount === totalCount
            ? "All platforms published successfully!"
            : `${successCount} of ${totalCount} platforms published successfully`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(results).map(([platform, result]) => (
          <div
            key={platform}
            className={`border rounded-lg p-4 ${
              result.status === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {result.status === "success" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-semibold capitalize">{platform}</span>
              </div>
              <Badge variant={result.status === "success" ? "default" : "destructive"}>
                {result.status === "success" ? "Published" : "Failed"}
              </Badge>
            </div>
            {result.error && <p className="text-sm text-red-600 mt-2 ml-8">{result.error}</p>}
            {result.status === "failed" && (
              <Button variant="outline" size="sm" className="mt-3 ml-8 bg-transparent">
                <RefreshCw className="h-3 w-3 mr-2" />
                Retry
              </Button>
            )}
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onStartOver}>
          Create Another Post
        </Button>
        <Button onClick={() => router.push("/dashboard/calendar")}>
          View Calendar
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  )
}
