"use client"

import { Facebook, Twitter, Instagram, Linkedin, Youtube, Music } from "lucide-react"
import type { ContentType } from "@/app/dashboard/compose/page"

interface PlatformPreviewProps {
  platform: string
  caption: string
  hashtags: string
  contentType: ContentType
}

export default function PlatformPreview({ platform, caption, hashtags, contentType }: PlatformPreviewProps) {
  const getIcon = () => {
    switch (platform) {
      case "facebook":
        return <Facebook className="h-5 w-5 text-blue-600" />
      case "twitter":
        return <Twitter className="h-5 w-5 text-sky-500" />
      case "instagram":
        return <Instagram className="h-5 w-5 text-pink-600" />
      case "linkedin":
        return <Linkedin className="h-5 w-5 text-blue-800" />
      case "youtube":
        return <Youtube className="h-5 w-5 text-red-600" />
      case "tiktok":
        return <Music className="h-5 w-5 text-black" />
      default:
        return null
    }
  }

  const getTruncatedCaption = () => {
    const limits: Record<string, number> = {
      twitter: 280,
      facebook: 63206,
      instagram: 2200,
      linkedin: 3000,
      youtube: 5000,
      tiktok: 2200,
    }
    const limit = limits[platform] || 5000
    if (caption.length > limit) {
      return caption.substring(0, limit) + "..."
    }
    return caption
  }

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-start gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">{getIcon()}</div>
        <div className="flex-1">
          <p className="font-semibold text-sm">Your Brand Name</p>
          <p className="text-xs text-muted-foreground">Just now</p>
        </div>
      </div>

      {/* Media placeholder */}
      {(contentType === "image" || contentType.includes("video")) && (
        <div className="bg-slate-100 rounded-lg mb-3 aspect-square flex items-center justify-center">
          <span className="text-sm text-muted-foreground">
            {contentType.includes("video") ? "Video" : "Image"} Preview
          </span>
        </div>
      )}

      {/* Caption */}
      <div className="space-y-2">
        <p className="text-sm whitespace-pre-wrap">{getTruncatedCaption()}</p>
        {hashtags && <p className="text-sm text-blue-600">{hashtags}</p>}
      </div>

      {/* Platform-specific elements */}
      {platform === "twitter" && (
        <div className="flex gap-4 mt-3 text-muted-foreground">
          <button className="text-xs hover:text-blue-600">Reply</button>
          <button className="text-xs hover:text-green-600">Retweet</button>
          <button className="text-xs hover:text-red-600">Like</button>
        </div>
      )}
    </div>
  )
}
