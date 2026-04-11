"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Plus, Users, DollarSign, TrendingUp, Eye, Heart, ExternalLink } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"

const SAMPLE_INFLUENCERS = [
  {
    id: "1",
    campaignName: "Summer Launch Collab",
    status: "active",
    totalBudget: 15000,
    influencers: [
      { name: "Sarah Chen", handle: "@sarahstyle", platform: "instagram", deliverables: ["3 Reels", "5 Stories"], payoutAmount: 5000, payoutStatus: "paid", postCount: 3, impressions: 125000, engagement: 8500 },
      { name: "Mike Torres", handle: "@mikefit", platform: "tiktok", deliverables: ["2 TikToks"], payoutAmount: 3000, payoutStatus: "paid", postCount: 2, impressions: 89000, engagement: 12000 },
      { name: "Ava Williams", handle: "@avacreats", platform: "youtube", deliverables: ["1 Video", "1 Short"], payoutAmount: 7000, payoutStatus: "pending", postCount: 1, impressions: 45000, engagement: 3200 },
    ],
  },
  {
    id: "2",
    campaignName: "Product Review Series",
    status: "active",
    totalBudget: 8000,
    influencers: [
      { name: "Jordan Lee", handle: "@jordanreviews", platform: "youtube", deliverables: ["2 Reviews"], payoutAmount: 4000, payoutStatus: "pending", postCount: 1, impressions: 32000, engagement: 2800 },
      { name: "Priya Patel", handle: "@priyalife", platform: "instagram", deliverables: ["4 Posts", "8 Stories"], payoutAmount: 4000, payoutStatus: "pending", postCount: 2, impressions: 67000, engagement: 5400 },
    ],
  },
]

const PAYOUT_COLORS: Record<string, string> = { paid: "bg-green-100 text-green-700", pending: "bg-yellow-100 text-yellow-700", cancelled: "bg-red-100 text-red-600" }

export default function InfluencersPage() {
  const [campaigns] = useState(SAMPLE_INFLUENCERS)
  const [showAdd, setShowAdd] = useState(false)

  const allInfluencers = campaigns.flatMap((c) => c.influencers)
  const totalSpend = allInfluencers.reduce((s, i) => s + (i.payoutAmount || 0), 0)
  const totalImpressions = allInfluencers.reduce((s, i) => s + i.impressions, 0)
  const totalEngagement = allInfluencers.reduce((s, i) => s + i.engagement, 0)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Influencer Marketing</h1>
          <p className="text-muted-foreground mt-1">Assign campaigns, track posts, measure performance, calculate payouts</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> New Influencer Campaign</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Influencer Campaign</DialogTitle><DialogDescription>Set up a new influencer collaboration.</DialogDescription></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Campaign Name</Label><Input placeholder="e.g. Summer Collab" /></div>
              <div className="space-y-2"><Label>Total Budget</Label><Input type="number" placeholder="0.00" /></div>
              <div className="space-y-2">
                <Label>Link to Campaign</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select a campaign" /></SelectTrigger><SelectContent><SelectItem value="c1">Summer Launch 2026</SelectItem><SelectItem value="c2">Product Demo Series</SelectItem></SelectContent></Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={() => setShowAdd(false)}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Influencers</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold flex items-center gap-1"><Users className="h-5 w-5" />{allInfluencers.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Spend</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${totalSpend.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Impressions</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Engagement</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalEngagement.toLocaleString()}</div></CardContent></Card>
      </div>

      {campaigns.map((campaign) => (
        <Card key={campaign.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{campaign.campaignName}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Budget: ${campaign.totalBudget?.toLocaleString()} • {campaign.influencers.length} influencers</p>
              </div>
              <Badge className="bg-green-100 text-green-700">{campaign.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaign.influencers.map((inf, idx) => (
                <div key={idx} className="flex items-center justify-between border rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{inf.name}</span>
                        <span className="text-sm text-blue-600 flex items-center gap-1"><ExternalLink className="h-3 w-3" />{inf.handle}</span>
                        <Badge variant="secondary" className="capitalize">{inf.platform}</Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span>Deliverables: {inf.deliverables.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center"><div className="text-muted-foreground">Posts</div><div className="font-semibold">{inf.postCount}</div></div>
                    <div className="text-center"><div className="text-muted-foreground flex items-center gap-1"><Eye className="h-3 w-3" />Impressions</div><div className="font-semibold">{inf.impressions.toLocaleString()}</div></div>
                    <div className="text-center"><div className="text-muted-foreground flex items-center gap-1"><Heart className="h-3 w-3" />Engagement</div><div className="font-semibold">{inf.engagement.toLocaleString()}</div></div>
                    <div className="text-center"><div className="text-muted-foreground flex items-center gap-1"><DollarSign className="h-3 w-3" />Payout</div><div className="font-semibold">${inf.payoutAmount?.toLocaleString()}</div></div>
                    <Badge className={PAYOUT_COLORS[inf.payoutStatus]}>{inf.payoutStatus}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
