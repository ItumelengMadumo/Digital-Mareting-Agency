"use client"

import { formatDistanceToNow } from "date-fns"
import { CheckCircle2, Info, TriangleAlert } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import PageHeader from "@/components/dashboard/page-header"
import PlatformIcon from "@/components/platform-icon"
import { SOCIAL_PLATFORMS, type SocialPlatform } from "@/lib/platforms"
import { useSocialAccounts, type SocialAccount } from "@/lib/posts"

function PlatformCard({ platform, accounts, loading }: {
  platform: SocialPlatform
  accounts: SocialAccount[]
  loading: boolean
}) {
  const connected = accounts.filter((a) => a.platform === platform.id && a.isConnected)
  return (
    <Card className={connected.length ? "border-green-200" : undefined}>
      <CardContent className="flex h-full flex-col gap-3 p-4">
        <div className="flex items-start gap-3">
          <span
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${platform.brand}14` }}
          >
            <PlatformIcon id={platform.id} className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-slate-900">{platform.label}</h3>
              {connected.length > 0 && (
                <Badge className="bg-green-100 px-1.5 text-green-700 hover:bg-green-100">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Connected
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500">{platform.capabilities.join(" · ")}</p>
          </div>
        </div>

        <p className="flex-1 text-sm text-slate-600">{platform.setupNote}</p>
        {platform.warning && (
          <p className="flex items-start gap-1.5 rounded-md bg-amber-50 px-2 py-1.5 text-xs text-amber-800">
            <TriangleAlert className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            {platform.warning}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <div className="min-w-0 truncate text-xs text-slate-500">
            {loading ? (
              <Skeleton className="h-4 w-24" />
            ) : connected.length ? (
              <>
                {connected[0].accountName}
                {connected[0].lastSyncAt &&
                  ` · synced ${formatDistanceToNow(new Date(connected[0].lastSyncAt), { addSuffix: true })}`}
              </>
            ) : (
              "Not connected"
            )}
          </div>
          <Button size="sm" variant={connected.length ? "outline" : "default"} disabled title="Available soon">
            {connected.length ? "Reconnect" : "Connect"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AccountsPage() {
  const { accounts, connected } = useSocialAccounts()
  const loading = accounts === null
  const groups = [
    { title: "Popular", platforms: SOCIAL_PLATFORMS.filter((p) => p.group === "popular") },
    { title: "More platforms", platforms: SOCIAL_PLATFORMS.filter((p) => p.group === "more") },
  ]

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <PageHeader
        title="Social accounts"
        description="Connect the platforms you want to publish to. Each one only needs connecting once."
        actions={
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            <span className="font-semibold text-slate-900">{loading ? "–" : connected.length}</span>
            <span className="text-slate-500"> of {SOCIAL_PLATFORMS.length} connected</span>
          </div>
        }
      />

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          Connecting accounts is being switched on for the pilot. You can already write and schedule posts for any of
          these platforms; they go out once the account is connected.
        </AlertDescription>
      </Alert>

      {groups.map((group) => (
        <section key={group.title} className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{group.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {group.platforms.map((p) => (
              <PlatformCard key={p.id} platform={p} accounts={accounts ?? []} loading={loading} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
