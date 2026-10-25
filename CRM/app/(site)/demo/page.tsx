import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import UpcomingPosts from "@/components/dashboard/upcoming-posts"

export const metadata: Metadata = {
  title: "Live demo - SocialSync",
  description: "Explore SocialSync with sample data. No account needed.",
}

const targets = [
  { platform: "Instagram", status: "Live" },
  { platform: "Facebook", status: "Live" },
  { platform: "TikTok", status: "Publishing" },
  { platform: "YouTube", status: "Scheduled" },
]

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 rounded-lg border bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm">
          <strong>Demo mode.</strong> Everything below is sample data. Sign up to publish for real.
        </p>
        <Button asChild>
          <Link href="/auth/register">Start free trial</Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold tracking-tight">Post once, go live everywhere</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>New post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="rounded-md border bg-muted/40 p-3 text-sm">
              Our summer collection drops Friday. Tap the link in bio to shop early access.
            </p>
            <div className="flex flex-wrap gap-2">
              {targets.map((t) => (
                <Badge key={t.platform} variant="outline">
                  {t.platform}
                </Badge>
              ))}
            </div>
            <Button disabled>Publish (sign up to try)</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publish status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {targets.map((t) => (
              <div key={t.platform} className="flex items-center justify-between text-sm">
                <span>{t.platform}</span>
                <Badge variant={t.status === "Live" ? "default" : "secondary"}>{t.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <UpcomingPosts />
    </div>
  )
}
