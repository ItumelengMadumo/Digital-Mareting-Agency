"use client"

import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { CheckCircle2, Facebook, Info, Instagram, Music2, Youtube, type LucideIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useWorkspace } from "@/lib/workspace-context"

interface SocialAccount {
  id: string
  platform: string
  accountName: string
  accountType: string
  isConnected: boolean
  lastSyncAt?: string | null
}

const PLATFORMS: { id: string; name: string; icon: LucideIcon; color: string; note: string }[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "text-pink-600",
    note: "Needs a Creator or Business account. Switching is free in the Instagram app: Settings → Account type.",
  },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-600", note: "Posts go to a Facebook Page, not a personal profile." },
  { id: "tiktok", name: "TikTok", icon: Music2, color: "text-slate-900", note: "Vertical video works best." },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "text-red-600", note: "Video only, and every post needs a title." },
]

export default function AccountsPage() {
  const { workspace, workspaceLoaded } = useWorkspace()
  const [accounts, setAccounts] = useState<SocialAccount[] | null>(null)

  useEffect(() => {
    if (!workspaceLoaded || !workspace) return
    fetch(`/api/platforms?workspaceId=${workspace.id}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setAccounts)
      .catch(() => setAccounts([]))
  }, [workspace, workspaceLoaded])

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Social accounts</h1>
        <p className="mt-1 text-muted-foreground">Connect the platforms you want to publish to.</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Account connections are being switched on for the pilot. Until then you can write and schedule posts, and
          they&apos;ll go out once an account is connected.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 sm:grid-cols-2">
        {PLATFORMS.map((platform) => {
          const connected = accounts?.filter((a) => a.platform === platform.id && a.isConnected) ?? []
          return (
            <Card key={platform.id}>
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                  <platform.icon className={`h-6 w-6 ${platform.color}`} />
                </div>
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {platform.name}
                    {connected.length > 0 && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Connected
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{platform.note}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                {accounts === null ? (
                  <Skeleton className="h-5 w-40" />
                ) : connected.length === 0 ? (
                  "Not connected"
                ) : (
                  <ul className="space-y-1">
                    {connected.map((a) => (
                      <li key={a.id}>
                        <span className="font-medium text-slate-800">{a.accountName}</span>
                        {a.lastSyncAt && (
                          <span className="text-slate-500">
                            {" "}
                            · synced {formatDistanceToNow(new Date(a.lastSyncAt), { addSuffix: true })}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
              <CardFooter>
                <Button variant={connected.length ? "outline" : "default"} disabled title="Available soon">
                  {connected.length ? "Reconnect" : "Connect"} · coming soon
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
