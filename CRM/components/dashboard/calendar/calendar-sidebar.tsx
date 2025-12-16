"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Facebook, Twitter, Instagram, Linkedin, ChevronDown, Filter, Plus } from "lucide-react"

interface PlatformFilterProps {
  platform: {
    id: string
    name: string
    icon: React.ReactNode
    color: string
  }
  checked: boolean
  onToggle: () => void
}

function PlatformFilter({ platform, checked, onToggle }: PlatformFilterProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch id={platform.id} checked={checked} onCheckedChange={onToggle} />
      <Label htmlFor={platform.id} className="flex items-center text-sm font-medium cursor-pointer">
        <span className="mr-2">{platform.icon}</span>
        {platform.name}
      </Label>
    </div>
  )
}

export default function CalendarSidebar() {
  const [platforms, setPlatforms] = useState([
    {
      id: "facebook",
      name: "Facebook",
      icon: <Facebook size={16} className="text-blue-600" />,
      color: "blue",
      enabled: true,
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: <Twitter size={16} className="text-sky-500" />,
      color: "sky",
      enabled: true,
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: <Instagram size={16} className="text-pink-600" />,
      color: "pink",
      enabled: true,
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: <Linkedin size={16} className="text-blue-800" />,
      color: "blue",
      enabled: true,
    },
  ])

  const [expandedSections, setExpandedSections] = useState({
    platforms: true,
    status: true,
  })

  const togglePlatform = (id: string) => {
    setPlatforms(
      platforms.map((platform) => (platform.id === id ? { ...platform, enabled: !platform.enabled } : platform)),
    )
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  return (
    <div className="h-full border-r bg-muted/30 overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center text-sm font-medium">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </div>
        <Link href="/dashboard/create-post">
          <Button size="sm">
            <Plus className="mr-1 h-4 w-4" /> New Post
          </Button>
        </Link>
      </div>

      <ScrollArea className="h-[calc(100%_-_73px)]">
        <div className="p-4 space-y-6">
          <div className="space-y-3">
            <button onClick={() => toggleSection("platforms")} className="flex justify-between items-center w-full">
              <h3 className="text-sm font-medium">Platforms</h3>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${expandedSections.platforms ? "rotate-180" : ""}`}
              />
            </button>

            {expandedSections.platforms && (
              <div className="space-y-2 pl-1">
                {platforms.map((platform) => (
                  <PlatformFilter
                    key={platform.id}
                    platform={platform}
                    checked={platform.enabled}
                    onToggle={() => togglePlatform(platform.id)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button onClick={() => toggleSection("status")} className="flex justify-between items-center w-full">
              <h3 className="text-sm font-medium">Post Status</h3>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.status ? "rotate-180" : ""}`} />
            </button>

            {expandedSections.status && (
              <div className="space-y-2 pl-1">
                <div className="flex items-center space-x-2">
                  <Switch id="scheduled" defaultChecked />
                  <Label htmlFor="scheduled">Scheduled</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="published" defaultChecked />
                  <Label htmlFor="published">Published</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="draft" defaultChecked />
                  <Label htmlFor="draft">Draft</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="failed" defaultChecked />
                  <Label htmlFor="failed">Failed</Label>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Date Range</h3>
            <div className="grid gap-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="from" className="sr-only">
                    From
                  </Label>
                  <Input id="from" type="date" placeholder="From" className="h-8" />
                </div>
                <div>
                  <Label htmlFor="to" className="sr-only">
                    To
                  </Label>
                  <Input id="to" type="date" placeholder="To" className="h-8" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <Button variant="outline" size="sm">
              Reset
            </Button>
            <Button size="sm">Apply Filters</Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
