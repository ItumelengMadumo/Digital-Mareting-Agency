"use client"

import Link from "next/link"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PlatformIcon from "@/components/platform-icon"
import { SOCIAL_PLATFORMS, getPlatform } from "@/lib/platforms"
import { postView, usePosts } from "@/lib/posts"

/** Summary beside the calendar: what's queued, what's in draft, and which platforms you post to. */
export default function CalendarSidebar() {
  const { posts } = usePosts()

  const counts = {
    scheduled: posts.filter((p) => postView(p) === "scheduled").length,
    draft: posts.filter((p) => postView(p) === "draft").length,
    published: posts.filter((p) => postView(p) === "published").length,
  }
  const upcoming = posts
    .filter((p) => postView(p) === "scheduled" && p.scheduledAt && new Date(p.scheduledAt) >= new Date())
    .sort((a, b) => a.scheduledAt!.localeCompare(b.scheduledAt!))
    .slice(0, 6)
  const used = SOCIAL_PLATFORMS.filter((sp) =>
    posts.some((p) => p.variants.some((v) => getPlatform(v.platform)?.id === sp.id)),
  )

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Scheduled", value: counts.scheduled, tint: "bg-blue-50 text-blue-700" },
            { label: "Drafts", value: counts.draft, tint: "bg-slate-100 text-slate-700" },
            { label: "Published", value: counts.published, tint: "bg-green-50 text-green-700" },
          ].map((c) => (
            <div key={c.label} className={`rounded-lg p-2 ${c.tint}`}>
              <p className="text-xl font-bold">{c.value}</p>
              <p className="text-xs">{c.label}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Up next</CardTitle>
        </CardHeader>
        <CardContent>
          {upcoming.length === 0 ? (
            <p className="text-sm text-slate-500">
              Nothing scheduled.{" "}
              <Link href="/dashboard/compose" className="text-blue-600 hover:underline">
                Schedule a post
              </Link>
            </p>
          ) : (
            <ul className="space-y-3">
              {upcoming.map((p) => (
                <li key={p.id} className="text-sm">
                  <p className="font-medium text-slate-800">{format(new Date(p.scheduledAt!), "EEE d MMM, HH:mm")}</p>
                  <p className="line-clamp-1 text-slate-500">{p.captionMaster}</p>
                  <div className="mt-1 flex gap-1">
                    {p.variants.map((v) => (
                      <PlatformIcon key={v.id} id={v.platform} className="h-3.5 w-3.5" />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {used.length > 0 && (
        <Card className="sm:col-span-2 xl:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Platforms on your calendar</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {used.map((p) => (
              <span key={p.id} className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs">
                <PlatformIcon id={p.id} className="h-3.5 w-3.5" />
                {p.label}
              </span>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
