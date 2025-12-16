"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp } from "lucide-react"

interface PlatformOverridesProps {
  platforms: string[]
  overrides: Record<string, { caption?: string; title?: string }>
  onChange: (overrides: Record<string, { caption?: string; title?: string }>) => void
  baseCaption: string
}

export default function PlatformOverrides({ platforms, overrides, onChange, baseCaption }: PlatformOverridesProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateOverride = (platform: string, field: "caption" | "title", value: string) => {
    onChange({
      ...overrides,
      [platform]: {
        ...overrides[platform],
        [field]: value,
      },
    })
  }

  if (!isExpanded) {
    return (
      <Button variant="outline" onClick={() => setIsExpanded(true)} className="w-full">
        <ChevronDown className="h-4 w-4 mr-2" />
        Advanced: Customize per platform (optional)
      </Button>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Platform Overrides</CardTitle>
            <CardDescription>Customize caption or title for specific platforms</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {platforms.map((platform) => (
          <div key={platform} className="border rounded-lg p-4 space-y-3">
            <h4 className="font-semibold capitalize">{platform}</h4>

            {platform === "youtube" && (
              <div className="space-y-2">
                <Label>Video Title</Label>
                <Input
                  placeholder="Custom title for YouTube"
                  value={overrides[platform]?.title || ""}
                  onChange={(e) => updateOverride(platform, "title", e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Custom Caption</Label>
              <Textarea
                placeholder={`Leave empty to use default caption: "${baseCaption.substring(0, 50)}..."`}
                value={overrides[platform]?.caption || ""}
                onChange={(e) => updateOverride(platform, "caption", e.target.value)}
                rows={3}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
