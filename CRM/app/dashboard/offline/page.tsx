"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Plus, Tv, Radio, Signpost, QrCode, Link2, PhoneCall, Hash, ScanLine } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"

const CHANNEL_ICONS: Record<string, typeof Tv> = { tv: Tv, radio: Radio, billboard: Signpost, print: ScanLine, event: Hash }
const CHANNEL_COLORS: Record<string, string> = { tv: "bg-purple-100 text-purple-700", radio: "bg-blue-100 text-blue-700", billboard: "bg-green-100 text-green-700", print: "bg-orange-100 text-orange-700", event: "bg-pink-100 text-pink-700" }

const SAMPLE_OFFLINE = [
  { id: "1", campaignName: "Summer Brand Awareness", channel: "tv", location: "National TV, SABC 3", airDate: "2026-04-15", qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://example.com/summer", shortLink: "/t/sum26", promoCode: "SUMMER26", callNumber: "+27 800 123 456", scans: 1250, calls: 89, redemptions: 234 },
  { id: "2", campaignName: "Local Radio Drive", channel: "radio", location: "Metro FM, Joburg", airDate: "2026-04-01", qrCodeUrl: null, shortLink: "/t/rad26", promoCode: "RADIO2026", callNumber: "+27 800 456 789", scans: 0, calls: 156, redemptions: 67 },
  { id: "3", campaignName: "Highway Billboard", channel: "billboard", location: "N1 Highway, Pretoria", airDate: "2026-03-15", qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://example.com/highway", shortLink: "/t/hwy26", promoCode: "HWY2026", callNumber: null, scans: 3400, calls: 0, redemptions: 89 },
  { id: "4", campaignName: "Trade Show 2026", channel: "event", location: "Cape Town ICC", airDate: "2026-05-20", qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://example.com/tradeshow", shortLink: "/t/evt26", promoCode: "EVENT2026", callNumber: "+27 800 789 012", scans: 0, calls: 0, redemptions: 0 },
]

export default function OfflinePage() {
  const [campaigns] = useState(SAMPLE_OFFLINE)
  const [showAdd, setShowAdd] = useState(false)

  const totalScans = campaigns.reduce((s, c) => s + c.scans, 0)
  const totalCalls = campaigns.reduce((s, c) => s + c.calls, 0)
  const totalRedemptions = campaigns.reduce((s, c) => s + c.redemptions, 0)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Offline Marketing</h1>
          <p className="text-muted-foreground mt-1">TV, Radio, Billboard — made trackable with QR codes, short links, promo codes & call numbers</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> New Offline Campaign</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Offline Campaign</DialogTitle><DialogDescription>Track offline marketing with digital tracking assets.</DialogDescription></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Campaign Name</Label><Input placeholder="e.g. Highway Billboard Q2" /></div>
              <div className="space-y-2"><Label>Channel</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select channel" /></SelectTrigger><SelectContent>
                  <SelectItem value="tv">📺 TV</SelectItem><SelectItem value="radio">📻 Radio</SelectItem><SelectItem value="billboard">🪧 Billboard</SelectItem><SelectItem value="print">🖨️ Print</SelectItem><SelectItem value="event">🎪 Event</SelectItem>
                </SelectContent></Select>
              </div>
              <div className="space-y-2"><Label>Location</Label><Input placeholder="e.g. N1 Highway, Pretoria" /></div>
              <div className="space-y-2"><Label>Air/Start Date</Label><Input type="date" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={() => setShowAdd(false)}>Create & Generate Tracking</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Active Campaigns</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{campaigns.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">QR Code Scans</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold flex items-center gap-1"><QrCode className="h-5 w-5" />{totalScans.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Call Tracking</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold flex items-center gap-1"><PhoneCall className="h-5 w-5" />{totalCalls}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Promo Redemptions</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold flex items-center gap-1"><Hash className="h-5 w-5" />{totalRedemptions}</div></CardContent></Card>
      </div>

      {campaigns.map((c) => {
        const Icon = CHANNEL_ICONS[c.channel] || Tv
        return (
          <Card key={c.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${CHANNEL_COLORS[c.channel]}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{c.campaignName}</h3>
                      <Badge variant="outline" className={CHANNEL_COLORS[c.channel]}>{c.channel.toUpperCase()}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{c.location} • {c.airDate}</p>
                    <div className="flex flex-wrap gap-3 mt-3">
                      {c.qrCodeUrl && (
                        <div className="flex items-center gap-1 text-sm bg-muted px-2 py-1 rounded"><QrCode className="h-3 w-3" /> QR Code</div>
                      )}
                      {c.shortLink && (
                        <div className="flex items-center gap-1 text-sm bg-muted px-2 py-1 rounded"><Link2 className="h-3 w-3" />{c.shortLink}</div>
                      )}
                      {c.promoCode && (
                        <div className="flex items-center gap-1 text-sm bg-muted px-2 py-1 rounded"><Hash className="h-3 w-3" />{c.promoCode}</div>
                      )}
                      {c.callNumber && (
                        <div className="flex items-center gap-1 text-sm bg-muted px-2 py-1 rounded"><PhoneCall className="h-3 w-3" />{c.callNumber}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center"><div className="text-muted-foreground">Scans</div><div className="text-lg font-semibold">{c.scans.toLocaleString()}</div></div>
                  <div className="text-center"><div className="text-muted-foreground">Calls</div><div className="text-lg font-semibold">{c.calls}</div></div>
                  <div className="text-center"><div className="text-muted-foreground">Redeemed</div><div className="text-lg font-semibold">{c.redemptions}</div></div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
