import Link from "next/link"
import { Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function InboxPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
        <p className="mt-1 text-muted-foreground">Comments and messages from all your platforms in one place.</p>
      </div>
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
          <Inbox className="h-10 w-10 text-slate-300" />
          <h3 className="font-semibold text-slate-800">Connect analytics to see comments here</h3>
          <p className="max-w-md text-sm text-slate-500">
            Comments, replies and DMs need each platform&apos;s approval for SocialSync to read them. They&apos;ll start
            showing here, and on each post in your timeline, as each platform is switched on.
          </p>
          <Button variant="outline" className="mt-2" asChild>
            <Link href="/dashboard/accounts">Social accounts</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
