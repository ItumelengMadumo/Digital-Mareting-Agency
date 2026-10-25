"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus, ArrowLeft, Play, Pause, BarChart3, FileText, Send, Users, Link2,
  Megaphone, Calendar, DollarSign, Target, Eye, TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { useWorkspace } from "@/lib/workspace-context"
import { PLATFORM_RULES, type Platform } from "@/lib/types"

// Sample campaign detail data
const SAMPLE_CAMPAIGN = {
  id: "c1",
  name: "Summer Launch 2026",
  goal: "awareness",
  type: "social",
  status: "active",
  budget: 5000,
  platforms: ["instagram", "facebook", "tiktok"],
  startDate: "2026-04-01",
  endDate: "2026-06-30",
  contents: [
    { id: "cnt1", captionMaster: "Summer is here! Check out our latest collection 🌞", mediaType: "image", status: "published", variants: [
      { id: "v1", platform: "instagram", caption: "Summer is here! Check out our latest collection 🌞 #SummerVibes", format: "1:1", status: "published" },
      { id: "v2", platform: "facebook", caption: "Summer is here! Check out our latest collection 🌞 Shop now at the link in bio.", format: "16:9", status: "published" },
      { id: "v3", platform: "tiktok", caption: "Summer is here! 🌞 #SummerVibes #NewCollection", format: "9:16", status: "published" },
    ]},
    { id: "cnt2", captionMaster: "Behind the scenes of our new photoshoot 📸", mediaType: "video", status: "ready", variants: [
      { id: "v4", platform: "instagram", caption: "BTS of our new photoshoot 📸 #BTS", format: "9:16", status: "ready" },
      { id: "v5", platform: "tiktok", caption: "BTS of our new photoshoot 📸", format: "9:16", status: "pending" },
    ]},
    { id: "cnt3", captionMaster: "5 ways to style our summer pieces", mediaType: "video", status: "draft", variants: [] },
  ],
  distributions: [
    { id: "d1", platform: "instagram", method: "auto", status: "published", publishedAt: "2026-04-05T10:00:00Z" },
    { id: "d2", platform: "facebook", method: "auto", status: "published", publishedAt: "2026-04-05T10:00:00Z" },
    { id: "d3", platform: "tiktok", method: "assisted", status: "assisted_ready" },
    { id: "d4", platform: "instagram", method: "auto", status: "queued" },
    { id: "d5", platform: "tiktok", method: "assisted", status: "pending" },
  ],
  metrics: {
    impressions: 45200,
    clicks: 3100,
    engagement: 5800,
    conversions: 120,
    spend: 1250,
    revenue: 8400,
  },
}

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700",
  ready: "bg-blue-100 text-blue-700",
  published: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  queued: "bg-indigo-100 text-indigo-700",
  assisted_ready: "bg-orange-100 text-orange-700",
  failed: "bg-red-100 text-red-700",
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  completed: "bg-blue-100 text-blue-700",
}

export default function CampaignDetailPage() {
  const [campaign] = useState(SAMPLE_CAMPAIGN)
  const [activeTab, setActiveTab] = useState("overview")

  const roi = campaign.metrics.spend > 0
    ? (((campaign.metrics.revenue - campaign.metrics.spend) / campaign.metrics.spend) * 100).toFixed(1)
    : "0"

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/campaigns">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{campaign.name}</h1>
              <Badge className={STATUS_COLORS[campaign.status]}>{campaign.status}</Badge>
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Target className="h-3 w-3" /> {campaign.goal}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {campaign.startDate} → {campaign.endDate}</span>
              <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> ${campaign.budget?.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {campaign.status === "active" ? (
            <Button variant="outline" className="gap-2"><Pause className="h-4 w-4" /> Pause</Button>
          ) : (
            <Button className="gap-2"><Play className="h-4 w-4" /> Activate</Button>
          )}
          <Link href="/dashboard/compose">
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Content</Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 md:grid-cols-6">
        {[
          { label: "Impressions", value: campaign.metrics.impressions.toLocaleString(), icon: Eye },
          { label: "Clicks", value: campaign.metrics.clicks.toLocaleString(), icon: Link2 },
          { label: "Engagement", value: campaign.metrics.engagement.toLocaleString(), icon: TrendingUp },
          { label: "Conversions", value: campaign.metrics.conversions.toString(), icon: Target },
          { label: "Spend", value: `$${campaign.metrics.spend.toLocaleString()}`, icon: DollarSign },
          { label: "ROI", value: `${roi}%`, icon: BarChart3 },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm"><m.icon className="h-4 w-4" />{m.label}</div>
              <div className="text-2xl font-bold mt-1">{m.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview" className="gap-1"><Megaphone className="h-4 w-4" /> Overview</TabsTrigger>
          <TabsTrigger value="content" className="gap-1"><FileText className="h-4 w-4" /> Content & Variants</TabsTrigger>
          <TabsTrigger value="distribution" className="gap-1"><Send className="h-4 w-4" /> Distribution</TabsTrigger>
          <TabsTrigger value="analytics" className="gap-1"><BarChart3 className="h-4 w-4" /> Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Platforms</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {campaign.platforms.map((p) => (
                    <Badge key={p} variant="outline" className="text-sm capitalize py-1 px-3">
                      {PLATFORM_RULES[p as Platform]?.label || p}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Content Pipeline</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total content pieces</span>
                  <span className="font-semibold">{campaign.contents.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total variants generated</span>
                  <span className="font-semibold">{campaign.contents.reduce((s, c) => s + c.variants.length, 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Distribution tasks</span>
                  <span className="font-semibold">{campaign.distributions.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4 mt-4">
          {campaign.contents.map((content) => (
            <Card key={content.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="capitalize">{content.mediaType}</Badge>
                      <Badge className={STATUS_COLORS[content.status]}>{content.status}</Badge>
                    </div>
                    <p className="text-sm">{content.captionMaster}</p>
                    {content.variants.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Variants ({content.variants.length})</p>
                        <div className="grid gap-2 md:grid-cols-3">
                          {content.variants.map((v) => (
                            <div key={v.id} className="border rounded-lg p-3 text-sm">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium capitalize">{PLATFORM_RULES[v.platform as Platform]?.label || v.platform}</span>
                                <Badge variant="outline" className={`text-xs ${STATUS_COLORS[v.status]}`}>{v.status}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{v.caption}</p>
                              <p className="text-xs text-muted-foreground mt-1">Format: {v.format}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {content.variants.length === 0 && (
                      <Button variant="outline" size="sm" className="mt-3 gap-1">
                        <Plus className="h-3 w-3" /> Generate Variants
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle>Distribution Status</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {campaign.distributions.map((d) => (
                  <div key={d.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="capitalize">{PLATFORM_RULES[d.platform as Platform]?.label || d.platform}</Badge>
                      <Badge variant="outline" className="capitalize">{d.method}</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={STATUS_COLORS[d.status]}>{d.status.replace("_", " ")}</Badge>
                      {d.publishedAt && <span className="text-xs text-muted-foreground">{new Date(d.publishedAt).toLocaleString()}</span>}
                      {d.status === "assisted_ready" && (
                        <Button size="sm" variant="outline" className="gap-1">
                          <Send className="h-3 w-3" /> Open App
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle>Campaign Performance</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Click-through Rate</p>
                  <p className="text-2xl font-bold">
                    {campaign.metrics.impressions > 0
                      ? ((campaign.metrics.clicks / campaign.metrics.impressions) * 100).toFixed(2)
                      : 0}%
                  </p>
                </div>
                <div className="space-y-2 p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Cost per Click</p>
                  <p className="text-2xl font-bold">
                    ${campaign.metrics.clicks > 0 ? (campaign.metrics.spend / campaign.metrics.clicks).toFixed(2) : "0.00"}
                  </p>
                </div>
                <div className="space-y-2 p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold text-green-600">${campaign.metrics.revenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
