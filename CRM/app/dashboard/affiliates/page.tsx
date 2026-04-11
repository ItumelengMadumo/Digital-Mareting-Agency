"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Users, TrendingUp, Copy, ExternalLink } from "lucide-react"

const SAMPLE_AFFILIATES = [
  { id: "1", name: "Alex Johnson", email: "alex@example.com", referralCode: "ALE2024XYZ", commissionRate: 0.15, totalEarnings: 2450, conversions: [
    { id: "ac1", amount: 79, commission: 11.85, status: "paid", createdAt: "2026-04-01" },
    { id: "ac2", amount: 149, commission: 22.35, status: "paid", createdAt: "2026-04-03" },
    { id: "ac3", amount: 35, commission: 5.25, status: "approved", createdAt: "2026-04-08" },
  ]},
  { id: "2", name: "Maria Garcia", email: "maria@example.com", referralCode: "MAR2024ABC", commissionRate: 0.10, totalEarnings: 1200, conversions: [
    { id: "ac4", amount: 79, commission: 7.90, status: "paid", createdAt: "2026-03-15" },
    { id: "ac5", amount: 149, commission: 14.90, status: "pending", createdAt: "2026-04-05" },
  ]},
  { id: "3", name: "David Kim", email: "david@example.com", referralCode: "DAV2024QRS", commissionRate: 0.12, totalEarnings: 780, conversions: [
    { id: "ac6", amount: 35, commission: 4.20, status: "pending", createdAt: "2026-04-09" },
  ]},
]

const STATUS_COLORS: Record<string, string> = { paid: "bg-green-100 text-green-700", approved: "bg-blue-100 text-blue-700", pending: "bg-yellow-100 text-yellow-700", rejected: "bg-red-100 text-red-600" }

export default function AffiliatesPage() {
  const [affiliates] = useState(SAMPLE_AFFILIATES)
  const [copied, setCopied] = useState<string | null>(null)

  const totalEarnings = affiliates.reduce((s, a) => s + a.totalEarnings, 0)
  const totalConversions = affiliates.reduce((s, a) => s + a.conversions.length, 0)

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Affiliate Program</h1>
          <p className="text-muted-foreground mt-1">Referral codes, commission tracking, and payouts</p>
        </div>
        <Button className="gap-2"><Users className="h-4 w-4" /> Invite Affiliate</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Affiliates</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{affiliates.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Earnings</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${totalEarnings.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Conversions</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalConversions}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Avg Commission Rate</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{((affiliates.reduce((s, a) => s + a.commissionRate, 0) / affiliates.length) * 100).toFixed(0)}%</div></CardContent></Card>
      </div>

      {affiliates.map((affiliate) => (
        <Card key={affiliate.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{affiliate.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{affiliate.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Commission Rate</p>
                  <p className="font-semibold">{(affiliate.commissionRate * 100).toFixed(0)}%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Earnings</p>
                  <p className="font-semibold text-green-600">${affiliate.totalEarnings.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <code className="text-sm font-mono flex-1">{affiliate.referralCode}</code>
                <Button variant="ghost" size="sm" onClick={() => copyCode(affiliate.referralCode)}>
                  <Copy className="h-4 w-4 mr-1" />
                  {copied === affiliate.referralCode ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">Recent Conversions</p>
              {affiliate.conversions.map((conv) => (
                <div key={conv.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Sale: ${conv.amount}</span>
                    <span className="text-sm text-muted-foreground">→ Commission: ${conv.commission.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{conv.createdAt}</span>
                    <Badge className={STATUS_COLORS[conv.status]}>{conv.status}</Badge>
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
