"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { uploadData } from "aws-amplify/storage"
import ContentTypeSelection from "@/components/dashboard/post/content-type-selection"
import PlatformSelection from "@/components/dashboard/post/platform-selection"
import UnifiedComposer from "@/components/dashboard/post/unified-composer"
import ValidationScreen from "@/components/dashboard/post/validation-screen"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useWorkspace } from "@/lib/workspace-context"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Megaphone } from "lucide-react"

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

const MEDIA_TYPE: Record<ContentType, "image" | "video" | "text" | "link"> = {
  "short-video": "video",
  "long-video": "video",
  image: "image",
  text: "text",
  link: "link",
}

/** Uploads the post's media to the signed-in user's folder in the media bucket; returns its storage path. */
async function uploadMedia(file: File) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
  const { path } = await uploadData({
    path: ({ identityId }) => `media/${identityId}/${Date.now()}-${safeName}`,
    data: file,
    options: { contentType: file.type },
  }).result
  return path
}

export default function ComposePage() {
  const { workspace, workspaceLoaded } = useWorkspace()
  const [step, setStep] = useState(1)
  const [campaigns, setCampaigns] = useState<{ id: string; name: string }[]>([])
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [postData, setPostData] = useState<PostData>({
    contentType: "image",
    platforms: [],
    caption: "",
    hashtags: "",
    platformOverrides: {},
    isScheduled: false,
    campaignId: undefined,
  })

  useEffect(() => {
    if (!workspaceLoaded || !workspace) return
    fetch(`/api/campaigns?workspaceId=${workspace.id}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: { id: string; name: string }[]) => setCampaigns(data))
      .catch(() => setCampaigns([]))
  }, [workspace, workspaceLoaded])

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

  // Saves the post and one variant per platform. Publishing to the platforms switches on once
  // accounts are connected through Upload-Post; until then posts are saved as drafts or scheduled.
  const handleValidationConfirm = async () => {
    if (!workspace || !workspaceLoaded) return
    setSaving(true)
    setSaveError("")
    try {
      const mediaUrl = postData.media ? await uploadMedia(postData.media) : null
      const scheduledAt = postData.isScheduled && postData.scheduleDate ? postData.scheduleDate.toISOString() : null
      const contentRes = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: workspace.id,
          campaignId: postData.campaignId,
          captionMaster: postData.caption,
          hashtags: postData.hashtags || null,
          link: postData.link || null,
          mediaType: MEDIA_TYPE[postData.contentType],
          mediaUrl,
          scheduledAt,
        }),
      })
      if (!contentRes.ok) throw new Error((await contentRes.json().catch(() => ({}))).error || "Could not save the post")
      const content = await contentRes.json()

      const variantsRes = await fetch(`/api/content/${content.id}/variants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platforms: postData.platforms,
          overrides: postData.platformOverrides,
          markReady: Boolean(scheduledAt),
        }),
      })
      if (!variantsRes.ok) throw new Error("The post was saved, but its platform versions were not")
      setStep(5)
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not save the post")
    } finally {
      setSaving(false)
    }
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
    <div className="w-full">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Compose</h1>
            <p className="mt-1 text-muted-foreground">Write once, then shape it for each platform.</p>
          </div>

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
                      {campaigns.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center gap-2">
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
                {s < 5 && <div className={`h-0.5 w-6 sm:w-12 ${s < step ? "bg-green-600" : "bg-slate-200"}`} />}
              </div>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            {step === 1 && "Step 1: Choose your content type"}
            {step === 2 && "Step 2: Select compatible platforms"}
            {step === 3 && "Step 3: Create your content"}
            {step === 4 && "Step 4: Review and validate"}
            {step === 5 && "Step 5: Saved"}
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
          <>
            {saveError && (
              <Alert variant="destructive">
                <AlertDescription>{saveError}</AlertDescription>
              </Alert>
            )}
            <ValidationScreen
              postData={postData}
              onConfirm={handleValidationConfirm}
              onBack={() => setStep(3)}
              saving={saving}
            />
          </>
        )}
        {step === 5 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {postData.isScheduled ? "Post saved and scheduled" : "Draft saved"}
              </CardTitle>
              <CardDescription>
                It&apos;s in your Posts list and on your timeline. Posts go out to{" "}
                {postData.platforms.join(", ")} once those accounts are connected under Social accounts.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/dashboard/posts">View posts</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/accounts">Connect accounts</Link>
              </Button>
              <Button variant="ghost" onClick={handleStartOver}>
                Compose another
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
