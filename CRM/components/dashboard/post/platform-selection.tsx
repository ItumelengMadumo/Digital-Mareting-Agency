"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Music, Check } from "lucide-react"
import type { ContentType } from "@/app/dashboard/create-post/page"
import { useState } from "react"

interface PlatformSelectionProps {
  contentType: ContentType
  onSelect: (platforms: string[]) => void
  onBack: () => void
}

const platformCompatibility = {
  "short-video": ["tiktok", "instagram", "youtube", "facebook"],
  image: ["instagram", "facebook", "twitter", "linkedin"],
  text: ["twitter", "linkedin", "facebook"],
  "long-video": ["youtube", "facebook", "linkedin"],
  link: ["twitter", "linkedin", "facebook"],
}

const platforms = [
  {
    id: "tiktok",
    name: "TikTok",
    icon: Music,
    color: "text-black",
    capabilities: ["Short Video", "Hashtags", "Vertical Only"],
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "text-pink-600",
    capabilities: ["Images", "Video", "Reels", "Carousel"],
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "text-blue-600",
    capabilities: ["All Content", "Links", "Long Videos"],
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: Twitter,
    color: "text-sky-500",
    capabilities: ["Text", "Images", "Short Video", "Links"],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "text-blue-800",
    capabilities: ["Professional", "Articles", "Documents"],
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    color: "text-red-600",
    capabilities: ["Video Only", "Shorts", "Long Form"],
  },
]

export default function PlatformSelection({ contentType, onSelect, onBack }: PlatformSelectionProps) {
  const compatiblePlatforms = platformCompatibility[contentType] || []
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId],
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Platforms</CardTitle>
        <CardDescription>
          Based on your content type ({contentType.replace("-", " ")}), these platforms are compatible
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((platform) => {
            const Icon = platform.icon
            const isCompatible = compatiblePlatforms.includes(platform.id)
            const isSelected = selectedPlatforms.includes(platform.id)

            return (
              <button
                key={platform.id}
                onClick={() => isCompatible && togglePlatform(platform.id)}
                disabled={!isCompatible}
                className={`relative border-2 rounded-lg p-5 text-left transition-all ${
                  isSelected
                    ? "border-blue-600 bg-blue-50"
                    : isCompatible
                      ? "border-slate-200 hover:border-blue-400 bg-white hover:bg-slate-50"
                      : "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className="flex flex-col space-y-3">
                  <div className={platform.color}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base mb-2">{platform.name}</h3>
                    <div className="flex flex-wrap gap-1">
                      {platform.capabilities.map((cap) => (
                        <Badge key={cap} variant="secondary" className="text-xs">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {!isCompatible && (
                    <p className="text-xs text-red-600 font-medium">Not compatible with {contentType}</p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button disabled={selectedPlatforms.length === 0} onClick={() => onSelect(selectedPlatforms)}>
          Continue ({selectedPlatforms.length} selected)
        </Button>
      </CardFooter>
    </Card>
  )
}
