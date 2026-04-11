"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Plus, Search, TrendingUp, TrendingDown, Minus, ArrowUpDown, ExternalLink } from "lucide-react"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { useWorkspace } from "@/lib/workspace-context"

const SAMPLE_KEYWORDS = [
  { id: "1", keyword: "digital marketing agency", volume: 12000, difficulty: 72, currentRank: 15, targetRank: 5, url: "/services" },
  { id: "2", keyword: "social media management tools", volume: 8500, difficulty: 65, currentRank: 22, targetRank: 10, url: "/features" },
  { id: "3", keyword: "content marketing platform", volume: 6200, difficulty: 58, currentRank: 8, targetRank: 3, url: "/platform" },
  { id: "4", keyword: "influencer marketing software", volume: 4800, difficulty: 45, currentRank: null, targetRank: 10, url: "/influencers" },
  { id: "5", keyword: "email campaign builder", volume: 9100, difficulty: 70, currentRank: 35, targetRank: 15, url: "/email" },
  { id: "6", keyword: "marketing automation", volume: 22000, difficulty: 85, currentRank: 45, targetRank: 20, url: "/" },
]

function DifficultyBadge({ difficulty }: { difficulty: number }) {
  if (difficulty >= 70) return <Badge variant="destructive">{difficulty}</Badge>
  if (difficulty >= 40) return <Badge className="bg-yellow-100 text-yellow-700">{difficulty}</Badge>
  return <Badge className="bg-green-100 text-green-700">{difficulty}</Badge>
}

function RankChange({ current, target }: { current: number | null; target: number | null }) {
  if (!current) return <span className="text-muted-foreground text-sm">Not ranked</span>
  if (!target) return <span className="text-sm font-medium">#{current}</span>
  if (current <= (target || 0)) return <span className="text-green-600 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> #{current}</span>
  return <span className="text-red-500 flex items-center gap-1"><TrendingDown className="h-3 w-3" /> #{current}</span>
}

export default function SEOPage() {
  const { workspace } = useWorkspace()
  const [keywords, setKeywords] = useState(SAMPLE_KEYWORDS)
  const [search, setSearch] = useState("")
  const [showAdd, setShowAdd] = useState(false)
  const [newKw, setNewKw] = useState({ keyword: "", volume: "", difficulty: "", targetRank: "", url: "" })

  const filtered = keywords.filter((k) => k.keyword.toLowerCase().includes(search.toLowerCase()))

  const handleAdd = async () => {
    const kw = { id: `kw${Date.now()}`, ...newKw, volume: parseInt(newKw.volume) || 0, difficulty: parseInt(newKw.difficulty) || 0, currentRank: null, targetRank: parseInt(newKw.targetRank) || null }

    try {
      const res = await fetch("/api/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newKw, workspaceId: workspace?.id }),
      })
      if (res.ok) {
        const data = await res.json()
        setKeywords((prev) => [data, ...prev])
      } else {
        setKeywords((prev) => [kw, ...prev])
      }
    } catch {
      setKeywords((prev) => [kw, ...prev])
    }
    setShowAdd(false)
    setNewKw({ keyword: "", volume: "", difficulty: "", targetRank: "", url: "" })
  }

  const avgRank = keywords.filter((k) => k.currentRank).reduce((s, k) => s + (k.currentRank || 0), 0) / (keywords.filter((k) => k.currentRank).length || 1)
  const totalVolume = keywords.reduce((s, k) => s + (k.volume || 0), 0)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SEO</h1>
          <p className="text-muted-foreground mt-1">Keyword tracking, content suggestions, and ranking analytics</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Track Keyword</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Track New Keyword</DialogTitle>
              <DialogDescription>Add a keyword to monitor its search ranking.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Keyword</Label><Input placeholder="e.g. digital marketing agency" value={newKw.keyword} onChange={(e) => setNewKw((p) => ({ ...p, keyword: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Search Volume</Label><Input type="number" placeholder="0" value={newKw.volume} onChange={(e) => setNewKw((p) => ({ ...p, volume: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Difficulty (0-100)</Label><Input type="number" placeholder="0" value={newKw.difficulty} onChange={(e) => setNewKw((p) => ({ ...p, difficulty: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Target Rank</Label><Input type="number" placeholder="1" value={newKw.targetRank} onChange={(e) => setNewKw((p) => ({ ...p, targetRank: e.target.value }))} /></div>
                <div className="space-y-2"><Label>URL</Label><Input placeholder="/page" value={newKw.url} onChange={(e) => setNewKw((p) => ({ ...p, url: e.target.value }))} /></div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={!newKw.keyword}>Add Keyword</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Tracked Keywords</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{keywords.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Avg. Rank</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">#{avgRank.toFixed(0)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Search Volume</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalVolume.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Top 10 Rankings</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{keywords.filter((k) => k.currentRank && k.currentRank <= 10).length}</div></CardContent></Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search keywords..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-4">Keyword</th>
                <th className="p-4"><span className="flex items-center gap-1"><ArrowUpDown className="h-3 w-3" />Volume</span></th>
                <th className="p-4">Difficulty</th>
                <th className="p-4">Current Rank</th>
                <th className="p-4">Target</th>
                <th className="p-4">URL</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((kw) => (
                <tr key={kw.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-4 font-medium">{kw.keyword}</td>
                  <td className="p-4">{kw.volume?.toLocaleString() || "-"}</td>
                  <td className="p-4">{kw.difficulty ? <DifficultyBadge difficulty={kw.difficulty} /> : "-"}</td>
                  <td className="p-4"><RankChange current={kw.currentRank} target={kw.targetRank} /></td>
                  <td className="p-4">{kw.targetRank ? `#${kw.targetRank}` : "-"}</td>
                  <td className="p-4">{kw.url ? <span className="flex items-center gap-1 text-sm text-blue-600"><ExternalLink className="h-3 w-3" />{kw.url}</span> : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
