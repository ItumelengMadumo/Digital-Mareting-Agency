import Link from "next/link"
import { Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PageHeader from "@/components/dashboard/page-header"
import PlatformIcon from "@/components/platform-icon"
import { SOCIAL_PLATFORMS } from "@/lib/platforms"

export default function InboxPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-6">
      <PageHeader title="Inbox" description="Comments and messages from all your platforms in one place." />
      <div className="grid gap-4 lg:grid-cols-3">
      <Card className="border-dashed lg:col-span-2">
        <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
          <Inbox className="h-10 w-10 text-slate-300" />
          <h3 className="font-semibold text-slate-800">Connect an account to see comments</h3>
          <p className="max-w-md text-sm text-slate-500">
            Comments, replies and DMs need each platform&apos;s approval for SocialSync to read them. They&apos;ll start
            showing here, and on each post in your timeline, as each platform is switched on.
          </p>
          <Button variant="outline" className="mt-2" asChild>
            <Link href="/dashboard/accounts">Connect an account</Link>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">What will show up here</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600">
          <p>Comments on your posts, replies and direct messages, newest first, with the post they belong to.</p>
          <p>You&apos;ll be able to reply from here without opening each app.</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {SOCIAL_PLATFORMS.map((p) => (
              <span key={p.id} className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 ring-1 ring-slate-200" title={p.label}>
                <PlatformIcon id={p.id} />
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
