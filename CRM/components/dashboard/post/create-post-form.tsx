"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Music,
  ImageIcon,
  Calendar,
  Clock,
  Send,
  AlertCircle,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const platforms = [
  {
    id: "facebook",
    name: "Facebook",
    icon: <Facebook className="h-5 w-5 text-blue-600" />,
    maxChars: 63206,
    mediaTypes: ["image", "video", "link"],
    videoMaxDuration: 240, // minutes
    requirements: "Supports images, videos up to 240 minutes, and link sharing",
  },
  {
    id: "twitter",
    name: "Twitter",
    icon: <Twitter className="h-5 w-5 text-sky-500" />,
    maxChars: 280,
    mediaTypes: ["image", "video"],
    videoMaxDuration: 2.2, // minutes
    requirements: "Max 280 characters, videos up to 2:20 minutes",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: <Instagram className="h-5 w-5 text-pink-600" />,
    maxChars: 2200,
    mediaTypes: ["image", "video", "carousel"],
    videoMaxDuration: 60, // seconds for feed, 90 for reels
    requirements: "Square or vertical images/videos. Reels: 15-90 seconds. Feed videos: up to 60 seconds",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: <Linkedin className="h-5 w-5 text-blue-800" />,
    maxChars: 3000,
    mediaTypes: ["image", "video", "document", "link"],
    videoMaxDuration: 10, // minutes
    requirements: "Professional content. Videos up to 10 minutes. Supports documents and articles",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: <Youtube className="h-5 w-5 text-red-600" />,
    maxChars: 5000, // description
    mediaTypes: ["video"],
    videoMaxDuration: 720, // 12 hours for verified accounts
    requirements: "Video only. Requires title, description, tags, and thumbnail. Videos can be up to 12 hours",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: <Music className="h-5 w-5 text-black" />,
    maxChars: 2200,
    mediaTypes: ["video"],
    videoMaxDuration: 10, // minutes
    requirements: "Vertical video only (9:16). Duration: 15 seconds to 10 minutes. Hashtags recommended",
  },
]

// Placeholder component for date picker
function DatePicker({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Input type="date" className="h-10" />
    </div>
  )
}

// Placeholder component for time picker
function TimePicker({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Input type="time" className="h-10" />
    </div>
  )
}

export default function CreatePostForm() {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["facebook", "twitter"])
  const [isScheduled, setIsScheduled] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [youtubeTitle, setYoutubeTitle] = useState("")
  const [youtubeTags, setYoutubeTags] = useState("")
  const [youtubeCategory, setYoutubeCategory] = useState("")
  const [tiktokHashtags, setTiktokHashtags] = useState("")
  const [instagramAspectRatio, setInstagramAspectRatio] = useState("square")
  const [linkedinArticleTitle, setLinkedinArticleTitle] = useState("")

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId],
    )
  }

  const getCharacterLimit = () => {
    if (selectedPlatforms.length === 0) return null
    const selectedPlatformData = platforms.filter((p) => selectedPlatforms.includes(p.id))
    return Math.min(...selectedPlatformData.map((p) => p.maxChars))
  }

  const isVideoRequired = () => {
    return selectedPlatforms.some((id) => ["youtube", "tiktok"].includes(id))
  }

  const getPlatformWarnings = () => {
    const warnings = []
    const charLimit = getCharacterLimit()

    if (selectedPlatforms.includes("twitter") && content.length > 280) {
      warnings.push("Twitter has a 280 character limit")
    }
    if (selectedPlatforms.includes("tiktok") && !selectedPlatforms.every((id) => ["tiktok"].includes(id))) {
      warnings.push("TikTok requires vertical video format which may not work well with other platforms")
    }
    if (selectedPlatforms.includes("youtube") && !youtubeTitle) {
      warnings.push("YouTube requires a video title")
    }
    if (
      isVideoRequired() &&
      !selectedPlatforms.every((id) => platforms.find((p) => p.id === id)?.mediaTypes.includes("video"))
    ) {
      warnings.push("Some selected platforms do not support video")
    }

    return warnings
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // Navigate to calendar after submission
      router.push("/dashboard/calendar")
    }, 1500)
  }

  const charLimit = getCharacterLimit()
  const warnings = getPlatformWarnings()

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Post</CardTitle>
            <CardDescription>Create a post to share across your social media platforms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="platforms">Select Platforms</Label>
              <div className="flex flex-wrap gap-3">
                {platforms.map((platform) => (
                  <Button
                    key={platform.id}
                    type="button"
                    variant={selectedPlatforms.includes(platform.id) ? "default" : "outline"}
                    className="gap-2"
                    onClick={() => togglePlatform(platform.id)}
                  >
                    {platform.icon}
                    {platform.name}
                  </Button>
                ))}
              </div>
              {selectedPlatforms.length === 0 && (
                <p className="text-sm text-red-500">Please select at least one platform</p>
              )}

              {selectedPlatforms.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label className="text-sm font-medium">Platform Requirements:</Label>
                  {platforms
                    .filter((p) => selectedPlatforms.includes(p.id))
                    .map((platform) => (
                      <div key={platform.id} className="text-xs text-muted-foreground bg-muted p-2 rounded-md">
                        <span className="font-medium">{platform.name}:</span> {platform.requirements}
                      </div>
                    ))}
                </div>
              )}
            </div>

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

            {selectedPlatforms.includes("youtube") && (
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Youtube className="h-5 w-5 text-red-600" />
                    YouTube Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="youtube-title">Video Title *</Label>
                    <Input
                      id="youtube-title"
                      placeholder="Enter video title (required)"
                      value={youtubeTitle}
                      onChange={(e) => setYoutubeTitle(e.target.value)}
                      maxLength={100}
                    />
                    <p className="text-xs text-muted-foreground">{youtubeTitle.length}/100 characters</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="youtube-category">Category</Label>
                    <Select value={youtubeCategory} onValueChange={setYoutubeCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="howto">How-to & Style</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="news">News & Politics</SelectItem>
                        <SelectItem value="tech">Science & Technology</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="youtube-tags">Tags (comma-separated)</Label>
                    <Input
                      id="youtube-tags"
                      placeholder="marketing, business, tutorial"
                      value={youtubeTags}
                      onChange={(e) => setYoutubeTags(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedPlatforms.includes("tiktok") && (
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Music className="h-5 w-5 text-black" />
                    TikTok Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tiktok-hashtags">Hashtags</Label>
                    <Input
                      id="tiktok-hashtags"
                      placeholder="#marketing #business #viral"
                      value={tiktokHashtags}
                      onChange={(e) => setTiktokHashtags(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Add trending hashtags to increase visibility</p>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      TikTok videos must be vertical (9:16 aspect ratio) and between 15 seconds to 10 minutes
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}

            {selectedPlatforms.includes("instagram") && (
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Instagram className="h-5 w-5 text-pink-600" />
                    Instagram Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagram-format">Post Format</Label>
                    <Select value={instagramAspectRatio} onValueChange={setInstagramAspectRatio}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="square">Square (1:1)</SelectItem>
                        <SelectItem value="portrait">Portrait (4:5)</SelectItem>
                        <SelectItem value="landscape">Landscape (1.91:1)</SelectItem>
                        <SelectItem value="reel">Reel (9:16)</SelectItem>
                        <SelectItem value="carousel">Carousel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedPlatforms.includes("linkedin") && (
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Linkedin className="h-5 w-5 text-blue-800" />
                    LinkedIn Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin-title">Article Title (optional)</Label>
                    <Input
                      id="linkedin-title"
                      placeholder="Enter article title for LinkedIn article posts"
                      value={linkedinArticleTitle}
                      onChange={(e) => setLinkedinArticleTitle(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              <Label htmlFor="content">
                Content {selectedPlatforms.includes("youtube") ? "(Video Description)" : ""}
              </Label>
              <Tabs defaultValue="editor">
                <TabsList className="mb-2">
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="editor">
                  <Textarea
                    id="content"
                    placeholder={
                      selectedPlatforms.includes("youtube") ? "Video description..." : "What's on your mind?"
                    }
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[200px]"
                  />
                </TabsContent>
                <TabsContent value="preview">
                  <div className="bg-card border rounded-md min-h-[200px] p-4">
                    {content || <p className="text-muted-foreground">Your post preview will appear here</p>}
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{content.length} characters</span>
                {charLimit && (
                  <span className={content.length > charLimit ? "text-red-500 font-medium" : ""}>
                    {charLimit - content.length} characters remaining (strictest limit)
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Media {isVideoRequired() && <span className="text-red-500">* (Video Required)</span>}</Label>
              <div className="border border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors">
                <div className="flex flex-col items-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">Drag and drop or click to upload</p>
                  <p className="text-xs text-muted-foreground">
                    {isVideoRequired()
                      ? "Video upload required for selected platforms"
                      : "Support: JPG, PNG, GIF, MP4 (max 10MB)"}
                  </p>
                </div>
                <Input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept={isVideoRequired() ? "video/*" : "image/*,video/*"}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="scheduling">Post Scheduling</Label>
                  <p className="text-sm text-muted-foreground">Choose when to publish your post</p>
                </div>
                <Switch id="scheduling" checked={isScheduled} onCheckedChange={setIsScheduled} />
              </div>

              {isScheduled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="post-date" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Date
                    </Label>
                    <DatePicker className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="post-time" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Time
                    </Label>
                    <TimePicker className="w-full" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="utc">
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                        <SelectItem value="est">Eastern Time (GMT-5)</SelectItem>
                        <SelectItem value="cst">Central Time (GMT-6)</SelectItem>
                        <SelectItem value="pst">Pacific Time (GMT-8)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <Button
              type="submit"
              disabled={
                content.length === 0 ||
                selectedPlatforms.length === 0 ||
                isSubmitting ||
                (selectedPlatforms.includes("youtube") && !youtubeTitle)
              }
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {isScheduled ? "Schedule Post" : "Post Now"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  )
}
