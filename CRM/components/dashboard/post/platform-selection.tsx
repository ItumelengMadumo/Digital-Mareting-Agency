"use client"

import { useState } from "react"
import { Check, TriangleAlert } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import PlatformIcon from "@/components/platform-icon"
import { SOCIAL_PLATFORMS, type SocialPlatform } from "@/lib/platforms"
import type { ContentType } from "@/app/dashboard/compose/page"
import { cn } from "@/lib/utils"

interface PlatformSelectionProps {
  contentType: ContentType
  initialSelected?: string[]
  onSelect: (platforms: string[]) => void
  onBack: () => void
}

const KIND_LABEL: Record<ContentType, string> = {
  "short-video": "short video",
  "long-video": "long video",
  image: "image",
  text: "text",
  link: "link",
}

export default function PlatformSelection({ contentType, initialSelected = [], onSelect, onBack }: PlatformSelectionProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected)
  const compatible = SOCIAL_PLATFORMS.filter((p) => p.contentKinds.includes(contentType))
  const incompatible = SOCIAL_PLATFORMS.filter((p) => !p.contentKinds.includes(contentType))

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))

  const allSelected = compatible.length > 0 && compatible.every((p) => selected.includes(p.id))

  const renderTile = (platform: SocialPlatform, enabled: boolean) => {
    const isSelected = selected.includes(platform.id)
    return (
      <button
        key={platform.id}
        type="button"
        onClick={() => enabled && toggle(platform.id)}
        disabled={!enabled}
        aria-pressed={isSelected}
        className={cn(
          "relative flex items-start gap-3 rounded-xl border-2 p-3 text-left transition-all sm:p-4",
          isSelected
            ? "border-blue-500 bg-blue-50"
            : enabled
              ? "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
              : "cursor-not-allowed border-slate-100 bg-slate-50 opacity-50",
        )}
      >
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
          <PlatformIcon id={platform.id} className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-slate-900">{platform.label}</span>
          <span className="block truncate text-xs text-slate-500">{platform.capabilities.join(" · ")}</span>
          {enabled && platform.warning && (
            <span className="mt-1 flex items-center gap-1 text-xs text-amber-700">
              <TriangleAlert className="h-3 w-3" /> Paid add-on
            </span>
          )}
        </span>
        {isSelected && (
          <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
            <Check className="h-3 w-3 text-white" />
          </span>
        )}
      </button>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 space-y-0 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Where should it go?</CardTitle>
          <CardDescription>
            {compatible.length} platforms take {KIND_LABEL[contentType]} posts.
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelected(allSelected ? [] : compatible.map((p) => p.id))}
        >
          {allSelected ? "Clear all" : "Select all"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {compatible.map((p) => renderTile(p, true))}
        </div>
        {incompatible.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Not available for {KIND_LABEL[contentType]}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
              {incompatible.map((p) => (
                <div key={p.id} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-400">
                  <PlatformIcon id={p.id} colored={false} />
                  {p.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-3">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          disabled={selected.length === 0}
          onClick={() => onSelect(selected)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Continue ({selected.length})
        </Button>
      </CardFooter>
    </Card>
  )
}
