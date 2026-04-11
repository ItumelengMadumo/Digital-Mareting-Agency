"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Plus, Link2, QrCode, Tag, Phone, Copy, ExternalLink } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWorkspace } from "@/lib/workspace-context"

type TrackingAsset = {
  id: string
  type: "utm" | "qr_code" | "promo_code" | "short_link" | "call_tracking"
  name: string
  value: string
  campaignName?: string
  clicks: number
  conversions: number
  createdAt: string
}

const SAMPLE_ASSETS: TrackingAsset[] = [
  { id: "1", type: "utm", name: "Summer campaign - Facebook", value: "https://example.com/?utm_source=facebook&utm_medium=paid&utm_campaign=summer2026", campaignName: "Summer Product Launch", clicks: 1240, conversions: 86, createdAt: "2026-03-15" },
  { id: "2", type: "utm", name: "Newsletter - April", value: "https://example.com/?utm_source=newsletter&utm_medium=email&utm_campaign=april2026", campaignName: "Q2 Awareness", clicks: 890, conversions: 52, createdAt: "2026-04-01" },
  { id: "3", type: "qr_code", name: "Billboard - Highway A1", value: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=example.com/billboard-a1", campaignName: "Billboard Campaign", clicks: 320, conversions: 18, createdAt: "2026-03-20" },
  { id: "4", type: "qr_code", name: "Flyer - Coffee shop promo", value: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=example.com/coffeeshop", campaignName: "Local Outreach", clicks: 145, conversions: 12, createdAt: "2026-04-05" },
  { id: "5", type: "promo_code", name: "VIP10 - 10% off", value: "VIP10", campaignName: "Loyalty Campaign", clicks: 0, conversions: 67, createdAt: "2026-02-01" },
  { id: "6", type: "promo_code", name: "SPRING25 - 25% off", value: "SPRING25", campaignName: "Spring Sale", clicks: 0, conversions: 134, createdAt: "2026-03-01" },
  { id: "7", type: "short_link", name: "Product launch landing", value: "https://short.link/launch26", campaignName: "Summer Product Launch", clicks: 2100, conversions: 145, createdAt: "2026-03-10" },
  { id: "8", type: "call_tracking", name: "Radio Ad - Drive time", value: "+1-800-555-0199", campaignName: "Radio Campaign Q2", clicks: 0, conversions: 43, createdAt: "2026-04-01" },
]

const TYPE_CONFIG: Record<string, { label: string; icon: typeof Link2; color: string }> = {
  utm: { label: "UTM Link", icon: Link2, color: "bg-blue-100 text-blue-700" },
  qr_code: { label: "QR Code", icon: QrCode, color: "bg-purple-100 text-purple-700" },
  promo_code: { label: "Promo Code", icon: Tag, color: "bg-green-100 text-green-700" },
  short_link: { label: "Short Link", icon: ExternalLink, color: "bg-orange-100 text-orange-700" },
  call_tracking: { label: "Call Tracking", icon: Phone, color: "bg-red-100 text-red-600" },
}

export default function TrackingPage() {
  const { workspace } = useWorkspace()
  const [assets, setAssets] = useState(SAMPLE_ASSETS)
  const [showAdd, setShowAdd] = useState(false)
  const [tab, setTab] = useState("all")
  const [newAsset, setNewAsset] = useState({ type: "utm" as string, name: "", source: "", medium: "", campaign: "", url: "https://example.com" })
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filtered = tab === "all" ? assets : assets.filter((a) => a.type === tab)
  const totalClicks = assets.reduce((s, a) => s + a.clicks, 0)
  const totalConversions = assets.reduce((s, a) => s + a.conversions, 0)

  const copy = (id: string, value: string) => {
    navigator.clipboard.writeText(value)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const handleAdd = async () => {
    let value = ""
    if (newAsset.type === "utm") {
      const params = new URLSearchParams()
      if (newAsset.source) params.set("utm_source", newAsset.source)
      if (newAsset.medium) params.set("utm_medium", newAsset.medium)
      if (newAsset.campaign) params.set("utm_campaign", newAsset.campaign)
      value = `${newAsset.url}?${params.toString()}`
    } else if (newAsset.type === "qr_code") {
      value = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(newAsset.url)}`
    } else if (newAsset.type === "promo_code") {
      value = newAsset.name.toUpperCase().replace(/\s+/g, "")
    } else if (newAsset.type === "short_link") {
      value = `https://short.link/${Math.random().toString(36).slice(2, 8)}`
    } else if (newAsset.type === "call_tracking") {
      value = `+1-800-555-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`
    }

    const asset: TrackingAsset = {
      id: `asset${Date.now()}`,
      type: newAsset.type as TrackingAsset["type"],
      name: newAsset.name,
      value,
      clicks: 0,
      conversions: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }

    try {
      const res = await fetch("/api/tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...asset, workspaceId: workspace?.id }),
      })
      if (res.ok) {
        const data = await res.json()
        setAssets((prev) => [{ ...data, clicks: 0, conversions: 0 }, ...prev])
      } else {
        setAssets((prev) => [asset, ...prev])
      }
    } catch {
      setAssets((prev) => [asset, ...prev])
    }
    setShowAdd(false)
    setNewAsset({ type: "utm", name: "", source: "", medium: "", campaign: "", url: "https://example.com" })
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tracking & Attribution</h1>
          <p className="text-muted-foreground mt-1">UTM links, QR codes, promo codes, short links & call tracking</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Create Asset</Button></DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Create Tracking Asset</DialogTitle><DialogDescription>Generate a trackable asset for your campaigns.</DialogDescription></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Type</Label>
                <Select value={newAsset.type} onValueChange={(v) => setNewAsset((p) => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(TYPE_CONFIG).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Name / Label</Label><Input placeholder="e.g. Summer campaign - Facebook" value={newAsset.name} onChange={(e) => setNewAsset((p) => ({ ...p, name: e.target.value }))} /></div>
              {(newAsset.type === "utm" || newAsset.type === "qr_code" || newAsset.type === "short_link") && (
                <div className="space-y-2"><Label>Destination URL</Label><Input placeholder="https://example.com" value={newAsset.url} onChange={(e) => setNewAsset((p) => ({ ...p, url: e.target.value }))} /></div>
              )}
              {newAsset.type === "utm" && (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1"><Label className="text-xs">Source</Label><Input placeholder="facebook" className="text-sm" value={newAsset.source} onChange={(e) => setNewAsset((p) => ({ ...p, source: e.target.value }))} /></div>
                    <div className="space-y-1"><Label className="text-xs">Medium</Label><Input placeholder="paid" className="text-sm" value={newAsset.medium} onChange={(e) => setNewAsset((p) => ({ ...p, medium: e.target.value }))} /></div>
                    <div className="space-y-1"><Label className="text-xs">Campaign</Label><Input placeholder="summer2026" className="text-sm" value={newAsset.campaign} onChange={(e) => setNewAsset((p) => ({ ...p, campaign: e.target.value }))} /></div>
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={!newAsset.name}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Assets</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{assets.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Clicks</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-blue-600">{totalClicks.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Conversions</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{totalConversions.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Conversion Rate</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : "0"}%</div></CardContent></Card>
      </div>

      {/* Tabs + Table */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid grid-cols-6 w-full max-w-2xl">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="utm">UTM</TabsTrigger>
          <TabsTrigger value="qr_code">QR</TabsTrigger>
          <TabsTrigger value="promo_code">Promo</TabsTrigger>
          <TabsTrigger value="short_link">Short Links</TabsTrigger>
          <TabsTrigger value="call_tracking">Calls</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4 space-y-3">
          {filtered.map((asset) => {
            const config = TYPE_CONFIG[asset.type]
            const Icon = config?.icon || Link2
            return (
              <Card key={asset.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${config?.color || "bg-gray-100"}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold truncate">{asset.name}</span>
                          <Badge variant="outline" className="text-xs shrink-0">{config?.label}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground truncate mt-0.5">{asset.value}</div>
                        {asset.campaignName && <div className="text-xs text-muted-foreground mt-0.5">Campaign: {asset.campaignName}</div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 ml-4 shrink-0">
                      {asset.type !== "promo_code" && asset.type !== "call_tracking" && (
                        <div className="text-center"><div className="text-lg font-bold">{asset.clicks.toLocaleString()}</div><div className="text-xs text-muted-foreground">clicks</div></div>
                      )}
                      <div className="text-center"><div className="text-lg font-bold text-green-600">{asset.conversions.toLocaleString()}</div><div className="text-xs text-muted-foreground">conversions</div></div>
                      <Button variant="ghost" size="sm" onClick={() => copy(asset.id, asset.value)}>
                        <Copy className="h-4 w-4" />
                        {copiedId === asset.id && <span className="ml-1 text-xs text-green-600">Copied!</span>}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No tracking assets of this type yet.</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
