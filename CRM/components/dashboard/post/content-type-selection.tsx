"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, ImageIcon, FileText, Film, Link } from "lucide-react"
import type { ContentType } from "@/app/dashboard/compose/page"
import PlatformIcon from "@/components/platform-icon"
import { platformsFor } from "@/lib/platforms"

interface ContentTypeSelectionProps {
  onSelect: (contentType: ContentType) => void
}

const contentTypes = [
  {
    id: "short-video" as ContentType,
    name: "Short-Form Video",
    description: "Perfect for TikTok, Instagram Reels, YouTube Shorts",
    icon: Video,
    duration: "15s - 3 min",
    color: "text-purple-600",
    bgColor: "bg-purple-50 hover:bg-purple-100",
  },
  {
    id: "image" as ContentType,
    name: "Image Post",
    description: "Share photos across Instagram, Facebook, Twitter, LinkedIn",
    icon: ImageIcon,
    duration: "Single or carousel",
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100",
  },
  {
    id: "text" as ContentType,
    name: "Text Post",
    description: "Quick updates for Twitter, LinkedIn, Facebook",
    icon: FileText,
    duration: "Text only",
    color: "text-green-600",
    bgColor: "bg-green-50 hover:bg-green-100",
  },
  {
    id: "long-video" as ContentType,
    name: "Long-Form Video",
    description: "Full videos for YouTube, Facebook, LinkedIn",
    icon: Film,
    duration: "3+ minutes",
    color: "text-red-600",
    bgColor: "bg-red-50 hover:bg-red-100",
  },
  {
    id: "link" as ContentType,
    name: "Link Post",
    description: "Share articles and links with previews",
    icon: Link,
    duration: "With preview card",
    color: "text-orange-600",
    bgColor: "bg-orange-50 hover:bg-orange-100",
  },
]

function PlatformsFor({ kind }: { kind: ContentType }) {
  const list = platformsFor(kind)
  return (
    <span className="flex items-center gap-1.5">
      <span className="flex -space-x-1">
        {list.slice(0, 5).map((p) => (
          <span key={p.id} className="flex h-6 w-6 items-center justify-center rounded-full bg-white ring-2 ring-white">
            <PlatformIcon id={p.id} className="h-3 w-3" />
          </span>
        ))}
      </span>
      <span className="text-xs text-slate-500">{list.length} platforms</span>
    </span>
  )
}

export default function ContentTypeSelection({ onSelect }: ContentTypeSelectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>What type of content do you want to create?</CardTitle>
        <CardDescription>Choose the content format that best fits your message</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {contentTypes.map((type) => {
            const Icon = type.icon
            return (
              <button
                key={type.id}
                onClick={() => onSelect(type.id)}
                className={`${type.bgColor} border-2 border-transparent hover:border-blue-500 rounded-xl p-4 text-left transition-all cursor-pointer group`}
              >
                <div className="flex items-start gap-3">
                  <div className={`${type.color} flex-shrink-0`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <h3 className="font-semibold">{type.name}</h3>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                    <p className="text-xs font-medium text-slate-600">{type.duration}</p>
                    <PlatformsFor kind={type.id} />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
