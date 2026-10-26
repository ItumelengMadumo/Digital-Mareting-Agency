"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Upload, Calendar, Clock } from "lucide-react"
import type { ContentType, PostData } from "@/app/dashboard/compose/page"
import PlatformPreview from "./platform-preview"
import PlatformIcon from "@/components/platform-icon"
import { getPlatform, platformLabel } from "@/lib/platforms"
import PlatformOverrides from "./platform-overrides"

interface UnifiedComposerProps {
  contentType: ContentType
  platforms: string[]
  initialData: PostData
  onSubmit: (data: Partial<PostData>) => void
  onBack: () => void
}

export default function UnifiedComposer({
  contentType,
  platforms,
  initialData,
  onSubmit,
  onBack,
}: UnifiedComposerProps) {
  const [caption, setCaption] = useState(initialData.caption)
  const [hashtags, setHashtags] = useState(initialData.hashtags)
  const [link, setLink] = useState(initialData.link || "")
  const [media, setMedia] = useState<File | undefined>(initialData.media)
  const [isScheduled, setIsScheduled] = useState(initialData.isScheduled)
  // Local date and time from the pickers; combined into a Date (sent to the API as UTC).
  const [scheduleDay, setScheduleDay] = useState(
    initialData.scheduleDate ? format(initialData.scheduleDate, "yyyy-MM-dd") : "",
  )
  const [scheduleTime, setScheduleTime] = useState(
    initialData.scheduleDate ? format(initialData.scheduleDate, "HH:mm") : "",
  )
  const scheduleDate = scheduleDay && scheduleTime ? new Date(`${scheduleDay}T${scheduleTime}`) : undefined
  const [platformOverrides, setPlatformOverrides] = useState(initialData.platformOverrides)

  const getCharLimit = () => {
    const selectedLimits = platforms.map((p) => getPlatform(p)?.maxCaption ?? 5000)
    return Math.min(...selectedLimits)
  }

  const charLimit = getCharLimit()
  const warnings = []

  for (const p of platforms) {
    const rules = getPlatform(p)
    if (rules && caption.length > rules.maxCaption) {
      warnings.push(`Caption will be shortened for ${rules.label} (${rules.maxCaption.toLocaleString()} character limit)`)
    }
  }
  if ((contentType === "short-video" || contentType === "long-video") && !media) {
    warnings.push("Video upload is required for selected platforms")
  }
  if (contentType === "image" && !media) {
    warnings.push("Image upload is required for selected platforms")
  }
  if (isScheduled && !scheduleDate) {
    warnings.push("Pick a date and time to schedule this post")
  } else if (isScheduled && scheduleDate && scheduleDate.getTime() < Date.now()) {
    warnings.push("The scheduled time is in the past")
  }

  const handleSubmit = () => {
    onSubmit({
      caption,
      hashtags,
      link: link || undefined,
      media,
      isScheduled,
      scheduleDate: isScheduled ? scheduleDate : undefined,
      platformOverrides,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Your Content</CardTitle>
          <CardDescription>
            Write once, publish everywhere. Your content will be adapted for each platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {warnings.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {warnings.map((warning, idx) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Media Upload */}
          {(contentType === "image" || contentType === "short-video" || contentType === "long-video") && (
            <div className="space-y-2">
              <Label>
                Upload {contentType.includes("video") ? "Video" : "Image"} <span className="text-red-500">*</span>
              </Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-accent/50 transition-colors cursor-pointer">
                <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">
                  {media ? media.name : `Click to upload ${contentType.includes("video") ? "video" : "image"}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {contentType === "short-video" && "Vertical video (9:16) recommended, 15s - 3min"}
                  {contentType === "long-video" && "Landscape video (16:9) recommended, 3min+"}
                  {contentType === "image" && "JPG, PNG, or GIF up to 10MB"}
                </p>
              </div>
            </div>
          )}

          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption">Caption / Description</Label>
            <Textarea
              id="caption"
              placeholder="Write your caption here..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="min-h-[120px]"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{caption.length} characters</span>
              <span className={caption.length > charLimit ? "text-red-500 font-medium" : ""}>
                Max: {charLimit} (strictest limit across platforms)
              </span>
            </div>
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <Label htmlFor="hashtags">Hashtags (optional)</Label>
            <Input
              id="hashtags"
              placeholder="#marketing #business #growth"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Separate with spaces. Popular on Instagram, TikTok, Twitter.
            </p>
          </div>

          {/* Link (if applicable) */}
          {contentType === "link" && (
            <div className="space-y-2">
              <Label htmlFor="link">
                Link URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="link"
                type="url"
                placeholder="https://example.com"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
          )}

          {/* Scheduling */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="schedule">Schedule for later</Label>
                <p className="text-xs text-muted-foreground">Post at optimal time across all platforms</p>
              </div>
              <Switch id="schedule" checked={isScheduled} onCheckedChange={setIsScheduled} />
            </div>

            {isScheduled && (
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Date
                  </Label>
                  <Input type="date" value={scheduleDay} onChange={(e) => setScheduleDay(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Time
                  </Label>
                  <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Platform Previews */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Previews</CardTitle>
          <CardDescription>See how your content will appear on each platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={platforms[0]}>
            <TabsList className="flex h-auto w-full justify-start gap-1 overflow-x-auto">
              {platforms.map((platform) => (
                <TabsTrigger key={platform} value={platform} className="flex-shrink-0 gap-1.5">
                  <PlatformIcon id={platform} />
                  {platformLabel(platform)}
                </TabsTrigger>
              ))}
            </TabsList>
            {platforms.map((platform) => (
              <TabsContent key={platform} value={platform}>
                <PlatformPreview
                  platform={platform}
                  caption={platformOverrides[platform]?.caption || caption}
                  hashtags={hashtags}
                  contentType={contentType}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Platform Overrides (Advanced) */}
      <PlatformOverrides
        platforms={platforms}
        overrides={platformOverrides}
        onChange={setPlatformOverrides}
        baseCaption={caption}
      />

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">Save Draft</Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !caption ||
              ((contentType === "image" || contentType.includes("video")) && !media) ||
              (contentType === "link" && !link)
            }
          >
            Continue to Review
          </Button>
        </div>
      </div>
    </div>
  )
}
