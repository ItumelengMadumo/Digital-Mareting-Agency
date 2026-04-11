"use client"
import { useState } from "react"
import ContentTypeSelection from "@/components/dashboard/post/content-type-selection"
import PlatformSelection from "@/components/dashboard/post/platform-selection"
import UnifiedComposer from "@/components/dashboard/post/unified-composer"
import ValidationScreen from "@/components/dashboard/post/validation-screen"
import PublishStatusDashboard from "@/components/dashboard/post/publish-status-dashboard"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Megaphone } from "lucide-react"

export type ContentType = "short-video" | "image" | "text" | "long-video" | "link"

export interface PostData {
  contentType: ContentType
  platforms: string[]
  caption: string
  hashtags: string
  media?: File
  link?: string
  platformOverrides: Record<string, { caption?: string; title?: string }>
  scheduleDate?: Date
  isScheduled: boolean
  campaignId?: string
}

const SAMPLE_CAMPAIGNS = [
  { id: "camp1", name: "Summer Product Launch" },
  { id: "camp2", name: "Q2 Brand Awareness" },
  { id: "camp3", name: "Holiday Promo 2026" },
]

export default function CreatePostPage() {
  const [step, setStep] = useState(1)
  const [postData, setPostData] = useState<PostData>({
    contentType: "image",
    platforms: [],
    caption: "",
    hashtags: "",
    platformOverrides: {},
    isScheduled: false,
    campaignId: undefined,
  })
  const [publishResults, setPublishResults] = useState<Record<string, { status: string; error?: string }>>({})

  const handleContentTypeSelect = (contentType: ContentType) => {
    setPostData({ ...postData, contentType })
    setStep(2)
  }

  const handlePlatformsSelect = (platforms: string[]) => {
    setPostData({ ...postData, platforms })
    setStep(3)
  }

  const handleComposerSubmit = (data: Partial<PostData>) => {
    setPostData({ ...postData, ...data })
    setStep(4)
  }

  const handleValidationConfirm = () => {
    // Simulate publishing
    const results: Record<string, { status: string; error?: string }> = {}
    postData.platforms.forEach((platform) => {
      // Simulate success/failure
      const success = Math.random() > 0.1
      results[platform] = {
        status: success ? "success" : "failed",
        error: success ? undefined : "Failed to connect to platform API",
      }
    })
    setPublishResults(results)
    setStep(5)
  }

  const handleStartOver = () => {
    setPostData({
      contentType: "image",
      platforms: [],
      caption: "",
      hashtags: "",
      platformOverrides: {},
      isScheduled: false,
      campaignId: undefined,
    })
    setStep(1)
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Create Social Media Post</h1>

          {/* Campaign Link (optional) */}
          <Card className="border-dashed">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Megaphone className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="flex-1">
                  <Label className="text-sm font-medium">Link to Campaign (optional)</Label>
                  <Select
                    value={postData.campaignId || "none"}
                    onValueChange={(v) => setPostData({ ...postData, campaignId: v === "none" ? undefined : v })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="No campaign — standalone post" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No campaign — standalone post</SelectItem>
                      {SAMPLE_CAMPAIGNS.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    s === step
                      ? "bg-blue-600 text-white"
                      : s < step
                        ? "bg-green-600 text-white"
                        : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {s}
                </div>
                {s < 5 && <div className={`h-0.5 w-12 ${s < step ? "bg-green-600" : "bg-slate-200"}`} />}
              </div>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            {step === 1 && "Step 1: Choose your content type"}
            {step === 2 && "Step 2: Select compatible platforms"}
            {step === 3 && "Step 3: Create your content"}
            {step === 4 && "Step 4: Review and validate"}
            {step === 5 && "Step 5: Publishing status"}
          </div>
        </div>

        {step === 1 && <ContentTypeSelection onSelect={handleContentTypeSelect} />}
        {step === 2 && (
          <PlatformSelection
            contentType={postData.contentType}
            onSelect={handlePlatformsSelect}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <UnifiedComposer
            contentType={postData.contentType}
            platforms={postData.platforms}
            initialData={postData}
            onSubmit={handleComposerSubmit}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && (
          <ValidationScreen postData={postData} onConfirm={handleValidationConfirm} onBack={() => setStep(3)} />
        )}
        {step === 5 && <PublishStatusDashboard results={publishResults} onStartOver={handleStartOver} />}
      </div>
    </div>
  )
}
