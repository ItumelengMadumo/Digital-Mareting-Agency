"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { addDays, format, isSameDay, isSameMonth, startOfWeek } from "date-fns"
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Circle,
  FileText,
  Send,
  Share2,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import PostCard from "@/components/dashboard/posts/post-card"
import PlatformIcon from "@/components/platform-icon"
import { SOCIAL_PLATFORMS } from "@/lib/platforms"
import { postView, usePosts, useSocialAccounts } from "@/lib/posts"
import { useCurrentUser } from "@/lib/use-current-user"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 10

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"
}

function KpiTile({ label, value, icon: Icon, href, tint }: {
  label: string
  value: number | string
  icon: LucideIcon
  href: string
  tint: string
}) {
  return (
    <Link href={href} className="group">
      <Card className="h-full transition-shadow group-hover:shadow-md">
        <CardContent className="flex items-center gap-3 p-3 sm:p-4">
          <span className={cn("flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg", tint)}>
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xl font-bold leading-tight text-slate-900 sm:text-2xl">{value}</p>
            <p className="truncate text-xs text-slate-500 sm:text-sm">{label}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function QuickComposer() {
  const router = useRouter()
  const [caption, setCaption] = useState("")
  const go = () => router.push(`/dashboard/compose${caption.trim() ? `?caption=${encodeURIComponent(caption.trim())}` : ""}`)
  return (
    <Card>
      <CardContent className="space-y-3 p-3 sm:p-4">
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="What do you want to post today?"
          rows={2}
          className="resize-none border-0 bg-slate-50 focus-visible:ring-1"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) go()
          }}
        />
        <div className="flex items-center justify-between gap-3">
          <div className="flex -space-x-1 overflow-hidden" aria-hidden>
            {SOCIAL_PLATFORMS.slice(0, 6).map((p) => (
              <span key={p.id} className="flex h-7 w-7 items-center justify-center rounded-full bg-white ring-2 ring-slate-100">
                <PlatformIcon id={p.id} className="h-3.5 w-3.5" />
              </span>
            ))}
            <span className="flex h-7 items-center pl-3 text-xs text-slate-500">+{SOCIAL_PLATFORMS.length - 6}</span>
          </div>
          <Button onClick={go} size="sm" className="bg-blue-500 hover:bg-blue-600">
            Continue <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function GetStarted({ connectedCount }: { connectedCount: number }) {
  const steps = [
    {
      title: "Connect your platforms",
      text: "Link Instagram, TikTok, YouTube, X and more so posts can go out for you.",
      href: "/dashboard/accounts",
      action: "Connect accounts",
      done: connectedCount > 0,
    },
    {
      title: "Write your first post",
      text: "Write it once, then adjust the caption or title for each platform.",
      href: "/dashboard/compose",
      action: "Compose",
      done: false,
    },
    {
      title: "Schedule it",
      text: "Pick a date and time; it shows up on your calendar and timeline.",
      href: "/dashboard/compose",
      action: "Schedule a post",
      done: false,
    },
  ]
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Your timeline starts here</CardTitle>
        <p className="text-sm text-slate-500">
          Every post you make shows up here with its status on each platform, plus likes and comments once it&apos;s live.
        </p>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.title} className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                s.done ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700",
              )}
            >
              {s.done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </span>
            <h3 className="mt-3 font-semibold text-slate-900">{s.title}</h3>
            <p className="mt-1 flex-1 text-sm text-slate-500">{s.text}</p>
            <Button variant="link" className="mt-2 h-auto justify-start px-0 text-blue-600" asChild>
              <Link href={s.href}>
                {s.action} <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default function DashboardHome() {
  const { user } = useCurrentUser()
  const { posts, loading, error } = usePosts()
  const { accounts, connected } = useSocialAccounts()
  const [visible, setVisible] = useState(PAGE_SIZE)

  const counts = useMemo(() => {
    const now = new Date()
    return {
      drafts: posts.filter((p) => postView(p) === "draft").length,
      scheduled: posts.filter((p) => postView(p) === "scheduled").length,
      publishedThisMonth: posts.filter((p) => postView(p) === "published" && isSameMonth(new Date(p.updatedAt), now)).length,
    }
  }, [posts])

  const upcoming = useMemo(
    () =>
      posts
        .filter((p) => postView(p) === "scheduled")
        .sort((a, b) => (a.scheduledAt ?? "").localeCompare(b.scheduledAt ?? ""))
        .slice(0, 4),
    [posts],
  )

  const week = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 })
    return Array.from({ length: 7 }, (_, i) => {
      const day = addDays(start, i)
      const dayPosts = posts.filter((p) => isSameDay(new Date(p.scheduledAt ?? p.createdAt), day))
      return { day, count: dayPosts.length, scheduled: dayPosts.some((p) => p.scheduledAt) }
    })
  }, [posts])

  const connectedIds = new Set(connected.map((a) => a.platform))
  const checklist = [
    { label: "Create your account", done: true },
    { label: "Complete your profile", done: Boolean(user?.handle || user?.bio), href: "/dashboard/profile" },
    { label: "Connect a social account", done: connected.length > 0, href: "/dashboard/accounts" },
    { label: "Write your first post", done: posts.length > 0, href: "/dashboard/compose" },
    { label: "Schedule a post", done: posts.some((p) => p.scheduledAt), href: "/dashboard/compose" },
  ]
  const checklistDone = checklist.filter((c) => c.done).length

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {greeting()}
          {user?.firstName ? `, ${user.firstName}` : ""}
        </h1>
        <p className="text-sm text-slate-500 sm:text-base">{format(new Date(), "EEEE d MMMM")} · here&apos;s your content at a glance.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile label="Drafts" value={loading ? "–" : counts.drafts} icon={FileText} href="/dashboard/posts" tint="bg-slate-100 text-slate-700" />
        <KpiTile label="Scheduled" value={loading ? "–" : counts.scheduled} icon={CalendarClock} href="/dashboard/posts" tint="bg-blue-100 text-blue-700" />
        <KpiTile label="Published this month" value={loading ? "–" : counts.publishedThisMonth} icon={Send} href="/dashboard/posts" tint="bg-green-100 text-green-700" />
        <KpiTile
          label="Connected accounts"
          value={accounts === null ? "–" : `${connected.length}/${SOCIAL_PLATFORMS.length}`}
          icon={Share2}
          href="/dashboard/accounts"
          tint="bg-purple-100 text-purple-700"
        />
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2" aria-label="Post timeline">
          <QuickComposer />
          {loading ? (
            Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />)
          ) : error ? (
            <Card>
              <CardContent className="p-6 text-sm text-red-600">{error}</CardContent>
            </Card>
          ) : posts.length === 0 ? (
            <GetStarted connectedCount={connected.length} />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Timeline</h2>
                <Link href="/dashboard/posts" className="text-sm text-blue-600 hover:underline">
                  All posts
                </Link>
              </div>
              {posts.slice(0, visible).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              {visible < posts.length && (
                <Button variant="outline" className="w-full" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                  Load more
                </Button>
              )}
            </>
          )}
        </section>

        <aside className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base">This week</CardTitle>
              <Link href="/dashboard/calendar" className="text-sm text-blue-600 hover:underline">
                Calendar
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-7 gap-1 text-center">
                {week.map(({ day, count, scheduled }) => {
                  const today = isSameDay(day, new Date())
                  return (
                    <div
                      key={day.toISOString()}
                      className={cn("rounded-lg py-2", today ? "bg-blue-500 text-white" : "bg-slate-50 text-slate-700")}
                    >
                      <p className={cn("text-[10px] uppercase", today ? "text-blue-100" : "text-slate-400")}>
                        {format(day, "EEEEE")}
                      </p>
                      <p className="text-sm font-semibold">{format(day, "d")}</p>
                      <span
                        className={cn(
                          "mx-auto mt-1 block h-1.5 w-1.5 rounded-full",
                          count === 0 ? "bg-transparent" : today ? "bg-white" : scheduled ? "bg-blue-500" : "bg-slate-400",
                        )}
                      />
                    </div>
                  )
                })}
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Coming up</p>
                {upcoming.length === 0 ? (
                  <p className="text-sm text-slate-500">Nothing scheduled yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {upcoming.map((p) => (
                      <li key={p.id} className="flex gap-3 text-sm">
                        <span className="w-12 flex-shrink-0 text-xs font-semibold text-blue-600">
                          {format(new Date(p.scheduledAt!), "EEE")}
                          <br />
                          {format(new Date(p.scheduledAt!), "HH:mm")}
                        </span>
                        <span className="line-clamp-2 text-slate-600">{p.captionMaster}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base">Your platforms</CardTitle>
              <Link href="/dashboard/accounts" className="text-sm text-blue-600 hover:underline">
                Manage
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {SOCIAL_PLATFORMS.map((p) => {
                  const isConnected = connectedIds.has(p.id)
                  return (
                    <Link
                      key={p.id}
                      href="/dashboard/accounts"
                      title={`${p.label}: ${isConnected ? "connected" : "not connected"}`}
                      className={cn(
                        "relative flex aspect-square items-center justify-center rounded-lg border",
                        isConnected ? "border-green-200 bg-green-50" : "border-slate-200 bg-white opacity-60 hover:opacity-100",
                      )}
                    >
                      <PlatformIcon id={p.id} className="h-5 w-5" />
                      {isConnected && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-green-500" />}
                    </Link>
                  )
                })}
              </div>
              <p className="mt-3 text-xs text-slate-500">
                {connected.length === 0 ? "No platforms connected yet." : `${connected.length} connected`}
              </p>
            </CardContent>
          </Card>

          {checklistDone < checklist.length && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  Get set up
                  <span className="text-sm font-normal text-slate-500">
                    {checklistDone}/{checklist.length}
                  </span>
                </CardTitle>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{ width: `${(checklistDone / checklist.length) * 100}%` }}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {checklist.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 text-sm">
                    {item.done ? (
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 flex-shrink-0 text-slate-300" />
                    )}
                    {item.done || !item.href ? (
                      <span className={item.done ? "text-slate-400 line-through" : ""}>{item.label}</span>
                    ) : (
                      <Link href={item.href} className="font-medium text-blue-600 hover:underline">
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  )
}
