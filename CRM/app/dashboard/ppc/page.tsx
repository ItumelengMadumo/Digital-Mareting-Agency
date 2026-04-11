"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Plus, DollarSign, MousePointer, Eye, Target, TrendingUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { useWorkspace } from "@/lib/workspace-context"

const SAMPLE_PPC = [
  { id: "1", platform: "google_ads", name: "Brand Keywords", budget: 2000, spend: 1450, clicks: 3200, impressions: 45000, conversions: 89, cpc: 0.45, ctr: 7.1, roi: 245, status: "active" },
  { id: "2", platform: "meta_ads", name: "Lookalike Audience", budget: 3000, spend: 2100, clicks: 4500, impressions: 82000, conversions: 120, cpc: 0.47, ctr: 5.5, roi: 180, status: "active" },
  { id: "3", platform: "google_ads", name: "Competitor Terms", budget: 1500, spend: 1500, clicks: 1800, impressions: 32000, conversions: 25, cpc: 0.83, ctr: 5.6, roi: 45, status: "ended" },
  { id: "4", platform: "meta_ads", name: "Retargeting", budget: 1000, spend: 650, clicks: 2900, impressions: 38000, conversions: 95, cpc: 0.22, ctr: 7.6, roi: 320, status: "active" },
  { id: "5", platform: "google_ads", name: "Display Network", budget: 800, spend: 400, clicks: 1200, impressions: 120000, conversions: 15, cpc: 0.33, ctr: 1.0, roi: 80, status: "paused" },
]

const PLATFORM_LABELS: Record<string, string> = { google_ads: "Google Ads", meta_ads: "Meta Ads" }
const STATUS_COLORS: Record<string, string> = { active: "bg-green-100 text-green-700", paused: "bg-yellow-100 text-yellow-700", ended: "bg-slate-100 text-slate-600" }

export default function PPCPage() {
  const { workspace } = useWorkspace()
  const [campaigns, setCampaigns] = useState(SAMPLE_PPC)
  const [showAdd, setShowAdd] = useState(false)
  const [newCampaign, setNewCampaign] = useState({ platform: "google_ads", name: "", budget: "" })

  const totals = campaigns.reduce((a, c) => ({
    spend: a.spend + c.spend,
    clicks: a.clicks + c.clicks,
    impressions: a.impressions + c.impressions,
    conversions: a.conversions + c.conversions,
  }), { spend: 0, clicks: 0, impressions: 0, conversions: 0 })

  const avgCpc = totals.clicks > 0 ? (totals.spend / totals.clicks).toFixed(2) : "0.00"
  const avgCtr = totals.impressions > 0 ? ((totals.clicks / totals.impressions) * 100).toFixed(1) : "0"

  const handleAdd = async () => {
    const campaign = { id: `ppc${Date.now()}`, ...newCampaign, budget: parseFloat(newCampaign.budget) || 0, spend: 0, clicks: 0, impressions: 0, conversions: 0, cpc: 0, ctr: 0, roi: 0, status: "active" }
    try {
      const res = await fetch("/api/ppc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newCampaign, workspaceId: workspace?.id }),
      })
      if (res.ok) {
        const data = await res.json()
        setCampaigns((prev) => [{ ...data, spend: 0, clicks: 0, impressions: 0, conversions: 0, cpc: 0, ctr: 0, roi: 0 }, ...prev])
      } else {
        setCampaigns((prev) => [campaign, ...prev])
      }
    } catch {
      setCampaigns((prev) => [campaign, ...prev])
    }
    setShowAdd(false)
    setNewCampaign({ platform: "google_ads", name: "", budget: "" })
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PPC / Paid Ads</h1>
          <p className="text-muted-foreground mt-1">Google Ads & Meta Ads performance tracking</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Add Campaign</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add PPC Campaign</DialogTitle><DialogDescription>Track a Google Ads or Meta Ads campaign.</DialogDescription></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Platform</Label>
                <Select value={newCampaign.platform} onValueChange={(v) => setNewCampaign((p) => ({ ...p, platform: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google_ads">Google Ads</SelectItem>
                    <SelectItem value="meta_ads">Meta Ads</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Campaign Name</Label><Input placeholder="e.g. Brand Keywords" value={newCampaign.name} onChange={(e) => setNewCampaign((p) => ({ ...p, name: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Budget</Label><Input type="number" placeholder="0.00" value={newCampaign.budget} onChange={(e) => setNewCampaign((p) => ({ ...p, budget: e.target.value }))} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={!newCampaign.name}>Add Campaign</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Spend</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${totals.spend.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Clicks</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold flex items-center gap-1"><MousePointer className="h-5 w-5" />{totals.clicks.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Impressions</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totals.impressions.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Avg CPC</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${avgCpc}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Avg CTR</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{avgCtr}%</div></CardContent></Card>
      </div>

      <div className="grid gap-4">
        {campaigns.map((c) => (
          <Card key={c.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.platform === "google_ads" ? "bg-blue-100" : "bg-indigo-100"}`}>
                    <DollarSign className={`h-5 w-5 ${c.platform === "google_ads" ? "text-blue-600" : "text-indigo-600"}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{c.name}</h3>
                      <Badge variant="outline">{PLATFORM_LABELS[c.platform]}</Badge>
                      <Badge className={STATUS_COLORS[c.status]}>{c.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />${c.spend.toLocaleString()} / ${c.budget.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><MousePointer className="h-3 w-3" />{c.clicks.toLocaleString()} clicks</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{c.impressions.toLocaleString()} impressions</span>
                      <span className="flex items-center gap-1"><Target className="h-3 w-3" />{c.conversions} conversions</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${c.roi >= 100 ? "text-green-600" : c.roi >= 50 ? "text-yellow-600" : "text-red-500"}`}>
                    <span className="flex items-center gap-1"><TrendingUp className="h-4 w-4" />{c.roi}% ROI</span>
                  </div>
                  <p className="text-sm text-muted-foreground">CPC: ${c.cpc?.toFixed(2)} | CTR: {c.ctr?.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
