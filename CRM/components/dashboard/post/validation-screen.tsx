"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, XCircle, Calendar, Hash, FileText } from "lucide-react"
import type { PostData } from "@/app/dashboard/compose/page"
import PlatformIcon from "@/components/platform-icon"
import { getPlatform, platformLabel } from "@/lib/platforms"

interface ValidationScreenProps {
  postData: PostData
  onConfirm: () => void
  onBack: () => void
  saving?: boolean
}

export default function ValidationScreen({ postData, onConfirm, onBack, saving }: ValidationScreenProps) {
  const validatePlatform = (platform: string) => {
    const issues: string[] = []
    const warnings: string[] = []
    const rules = getPlatform(platform)
    const caption = postData.platformOverrides[platform]?.caption || postData.caption
    const title = postData.platformOverrides[platform]?.title

    if (rules) {
      if (caption.length > rules.maxCaption) {
        warnings.push(`Caption will be shortened to ${rules.maxCaption.toLocaleString()} characters`)
      }
      if (rules.title?.required && !title?.trim()) {
        issues.push(`${rules.label} needs a ${rules.title.label.toLowerCase()} (add it under "Customize per platform")`)
      }
      if (title && rules.title && title.length > rules.title.max) {
        issues.push(`${rules.title.label} must be ${rules.title.max} characters or fewer`)
      }
      if (rules.needsMedia && !postData.media) {
        issues.push(`${rules.label} needs a photo or video`)
      }
      if (rules.warning) warnings.push(rules.warning)
    }

    // General media validation
    if ((postData.contentType === "image" || postData.contentType.includes("video")) && !postData.media) {
      issues.push("Media file required")
    }

    // Link validation
    if (postData.contentType === "link" && !postData.link) {
      issues.push("Link URL required")
    }

    if (issues.length > 0) return { status: "blocked", issues, warnings }
    if (warnings.length > 0) return { status: "warning", issues, warnings }
    return { status: "ready", issues: [], warnings: [] }
  }

  const allReady = postData.platforms.every((p) => validatePlatform(p).status !== "blocked")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review & Validate</CardTitle>
          <CardDescription>Check platform readiness before publishing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Post Summary */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Caption</p>
                <p className="text-sm text-muted-foreground">{postData.caption.substring(0, 150)}...</p>
              </div>
            </div>
            {postData.hashtags && (
              <div className="flex items-start gap-3">
                <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Hashtags</p>
                  <p className="text-sm text-muted-foreground">{postData.hashtags}</p>
                </div>
              </div>
            )}
            {postData.isScheduled && (
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Scheduled</p>
                  <p className="text-sm text-muted-foreground">
                    {postData.scheduleDate?.toLocaleString() || "Date/time selected"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Platform Status */}
          <div className="space-y-3">
            <h3 className="font-semibold">Platform Status</h3>
            {postData.platforms.map((platform) => {
              const validation = validatePlatform(platform)
              const statusConfig = {
                ready: {
                  icon: CheckCircle2,
                  color: "text-green-600",
                  bg: "bg-green-50",
                  border: "border-green-200",
                  label: "Ready",
                },
                warning: {
                  icon: AlertCircle,
                  color: "text-yellow-600",
                  bg: "bg-yellow-50",
                  border: "border-yellow-200",
                  label: "Warning",
                },
                blocked: {
                  icon: XCircle,
                  color: "text-red-600",
                  bg: "bg-red-50",
                  border: "border-red-200",
                  label: "Blocked",
                },
              }

              const config = statusConfig[validation.status as keyof typeof statusConfig]
              const Icon = config.icon

              return (
                <div key={platform} className={`border ${config.border} ${config.bg} rounded-lg p-4`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${config.color}`} />
                      <PlatformIcon id={platform} />
                      <span className="font-semibold">{platformLabel(platform)}</span>
                    </div>
                    <Badge variant={validation.status === "ready" ? "default" : "secondary"}>{config.label}</Badge>
                  </div>

                  {validation.issues.length > 0 && (
                    <ul className="text-sm space-y-1 ml-7 text-red-600">
                      {validation.issues.map((issue, idx) => (
                        <li key={idx}>• {issue}</li>
                      ))}
                    </ul>
                  )}

                  {validation.warnings.length > 0 && (
                    <ul className="text-sm space-y-1 ml-7 text-yellow-600">
                      {validation.warnings.map((warning, idx) => (
                        <li key={idx}>• {warning}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back to Edit
          </Button>
          <Button disabled={!allReady || saving} onClick={onConfirm}>
            {saving ? "Saving..." : postData.isScheduled ? "Save & schedule" : "Save draft"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
