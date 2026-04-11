"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, Megaphone, ArrowRight, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { useWorkspace } from "@/lib/workspace-context"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { CampaignGoal, CampaignType, CampaignStatus } from "@/lib/types"

// Sample data for initial display (replaced by API when connected)
const SAMPLE_CAMPAIGNS = [
  { id: "c1", name: "Summer Launch 2026", goal: "awareness" as CampaignGoal, type: "social" as CampaignType, status: "active" as CampaignStatus, platforms: ["instagram", "facebook", "tiktok"], budget: 5000, startDate: "2026-04-01", endDate: "2026-06-30", _count: { contents: 12, distributions: 28 } },
  { id: "c2", name: "Product Demo Series", goal: "engagement" as CampaignGoal, type: "mixed" as CampaignType, status: "active" as CampaignStatus, platforms: ["youtube", "linkedin", "twitter"], budget: 3000, startDate: "2026-03-15", endDate: "2026-05-15", _count: { contents: 8, distributions: 15 } },
  { id: "c3", name: "Black Friday Sale", goal: "sales" as CampaignGoal, type: "mixed" as CampaignType, status: "draft" as CampaignStatus, platforms: ["instagram", "facebook", "email", "sms"], budget: 10000, startDate: "2026-11-20", endDate: "2026-12-01", _count: { contents: 0, distributions: 0 } },
  { id: "c4", name: "Influencer Collab Q2", goal: "awareness" as CampaignGoal, type: "influencer" as CampaignType, status: "active" as CampaignStatus, platforms: ["instagram", "tiktok", "youtube"], budget: 15000, startDate: "2026-04-01", endDate: "2026-06-30", _count: { contents: 5, distributions: 10 } },
  { id: "c5", name: "Local Radio Spot", goal: "awareness" as CampaignGoal, type: "offline" as CampaignType, status: "completed" as CampaignStatus, platforms: [], budget: 2000, startDate: "2026-02-01", endDate: "2026-03-01", _count: { contents: 1, distributions: 1 } },
  { id: "c6", name: "Email Newsletter Drive", goal: "leads" as CampaignGoal, type: "email" as CampaignType, status: "paused" as CampaignStatus, platforms: ["email"], budget: 500, startDate: "2026-03-01", endDate: "2026-04-30", _count: { contents: 4, distributions: 4 } },
]

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700",
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  completed: "bg-blue-100 text-blue-700",
  archived: "bg-gray-100 text-gray-500",
}

const GOAL_ICONS: Record<string, string> = {
  awareness: "📣",
  sales: "💰",
  engagement: "💬",
  traffic: "🔗",
  leads: "🎯",
}

export default function CampaignsPage() {
  const { workspace } = useWorkspace()
  const [campaigns, setCampaigns] = useState(SAMPLE_CAMPAIGNS)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showCreate, setShowCreate] = useState(false)
  const [newCampaign, setNewCampaign] = useState({ name: "", goal: "awareness", type: "social", budget: "" })

  const filtered = campaigns.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: campaigns.length,
    active: campaigns.filter((c) => c.status === "active").length,
    draft: campaigns.filter((c) => c.status === "draft").length,
    totalBudget: campaigns.reduce((s, c) => s + (c.budget || 0), 0),
  }

  const handleCreateCampaign = async () => {
    const campaign = {
      id: `c${Date.now()}`,
      ...newCampaign,
      budget: newCampaign.budget ? parseFloat(newCampaign.budget) : 0,
      status: "draft" as CampaignStatus,
      platforms: [],
      startDate: new Date().toISOString(),
      endDate: null,
      _count: { contents: 0, distributions: 0 },
    }

    // Try API first
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newCampaign, workspaceId: workspace?.id }),
      })
      if (res.ok) {
        const data = await res.json()
        setCampaigns((prev) => [{ ...data, _count: { contents: 0, distributions: 0 } }, ...prev])
        setShowCreate(false)
        setNewCampaign({ name: "", goal: "awareness", type: "social", budget: "" })
        return
      }
    } catch {}

    // Fallback to local
    setCampaigns((prev) => [campaign, ...prev])
    setShowCreate(false)
    setNewCampaign({ name: "", goal: "awareness", type: "social", budget: "" })
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground mt-1">
            Campaign → Content → Variants → Distribution → Tracking → Analytics
          </p>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Campaign</DialogTitle>
              <DialogDescription>Set up a new marketing campaign. You&apos;ll add content and platforms next.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Campaign Name</Label>
                <Input placeholder="e.g. Summer Launch 2026" value={newCampaign.name} onChange={(e) => setNewCampaign((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Goal</Label>
                  <Select value={newCampaign.goal} onValueChange={(v) => setNewCampaign((p) => ({ ...p, goal: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="awareness">📣 Awareness</SelectItem>
                      <SelectItem value="sales">💰 Sales</SelectItem>
                      <SelectItem value="engagement">💬 Engagement</SelectItem>
                      <SelectItem value="traffic">🔗 Traffic</SelectItem>
                      <SelectItem value="leads">🎯 Leads</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={newCampaign.type} onValueChange={(v) => setNewCampaign((p) => ({ ...p, type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="influencer">Influencer</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="ppc">PPC / Ads</SelectItem>
                      <SelectItem value="mixed">Mixed / Multi-channel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Budget (optional)</Label>
                <Input type="number" placeholder="0.00" value={newCampaign.budget} onChange={(e) => setNewCampaign((p) => ({ ...p, budget: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button onClick={handleCreateCampaign} disabled={!newCampaign.name}>Create Campaign</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Campaigns</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">{stats.active}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-slate-500">{stats.draft}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">${stats.totalBudget.toLocaleString()}</div></CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search campaigns..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campaign List */}
      <div className="grid gap-4">
        {filtered.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                    <Megaphone className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{campaign.name}</h3>
                      <Badge variant="outline" className={STATUS_COLORS[campaign.status]}>{campaign.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>{GOAL_ICONS[campaign.goal]} {campaign.goal}</span>
                      <span>•</span>
                      <span className="capitalize">{campaign.type}</span>
                      {campaign.budget ? (
                        <>
                          <span>•</span>
                          <span>${campaign.budget.toLocaleString()} budget</span>
                        </>
                      ) : null}
                      <span>•</span>
                      <span>{campaign._count.contents} content pieces</span>
                      <span>•</span>
                      <span>{campaign._count.distributions} distributions</span>
                    </div>
                    {campaign.platforms.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {campaign.platforms.map((p) => (
                          <Badge key={p} variant="secondary" className="text-xs capitalize">{p}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/campaigns/${campaign.id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      Open <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem>Archive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No campaigns found</p>
              <p className="text-sm mt-1">Create your first campaign to start distributing content.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
