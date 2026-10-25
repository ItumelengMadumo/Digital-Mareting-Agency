"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { CalendarClock, CheckCircle2, Circle, PenSquare, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import PostCard, { PostsEmptyState } from "@/components/dashboard/posts/post-card"
import { postView, usePosts } from "@/lib/posts"
import { useCurrentUser } from "@/lib/use-current-user"
import { useWorkspace } from "@/lib/workspace-context"

const PAGE_SIZE = 10

function useConnectedAccountCount() {
  const { workspace, workspaceLoaded } = useWorkspace()
  const [count, setCount] = useState<number | null>(null)
  useEffect(() => {
    if (!workspaceLoaded || !workspace) return
    fetch(`/api/platforms?workspaceId=${workspace.id}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((accounts: { isConnected?: boolean }[]) => setCount(accounts.filter((a) => a.isConnected).length))
      .catch(() => setCount(0))
  }, [workspace, workspaceLoaded])
  return count
}

export default function DashboardHome() {
  const { user } = useCurrentUser()
  const { posts, loading, error } = usePosts()
  const connectedAccounts = useConnectedAccountCount()
  const [visible, setVisible] = useState(PAGE_SIZE)

  const scheduled = useMemo(
    () =>
      posts
        .filter((p) => postView(p) === "scheduled")
        .sort((a, b) => (a.scheduledAt ?? "").localeCompare(b.scheduledAt ?? ""))
        .slice(0, 5),
    [posts],
  )

  const checklist = [
    { label: "Create your account", done: true },
    { label: "Connect a social account", done: (connectedAccounts ?? 0) > 0, href: "/dashboard/accounts" },
    { label: "Write your first post", done: posts.length > 0, href: "/dashboard/compose" },
    { label: "Schedule a post", done: posts.some((p) => p.scheduledAt), href: "/dashboard/compose" },
  ]
  const checklistDone = checklist.every((c) => c.done)

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {user?.firstName ? `Welcome, ${user.firstName}` : "Welcome"}
          </h1>
          <p className="mt-1 text-muted-foreground">Your posts, newest first.</p>
        </div>
        <Button className="bg-blue-500 hover:bg-blue-600" asChild>
          <Link href="/dashboard/compose">
            <PenSquare className="mr-2 h-4 w-4" />
            New post
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2" aria-label="Post timeline">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />)
          ) : error ? (
            <Card>
              <CardContent className="p-6 text-sm text-red-600">{error}</CardContent>
            </Card>
          ) : posts.length === 0 ? (
            <PostsEmptyState
              title="Your timeline is empty"
              text="Every post you write shows up here with its status on each platform, and its likes and comments once it's live."
            />
          ) : (
            <>
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

        <aside className="space-y-6">
          {!checklistDone && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Get set up</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {checklist.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 text-sm">
                    {item.done ? (
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 flex-shrink-0 text-slate-300" />
                    )}
                    {item.done || !item.href ? (
                      <span className={item.done ? "text-slate-500 line-through" : ""}>{item.label}</span>
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

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarClock className="h-4 w-4 text-blue-500" />
                Coming up
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scheduled.length === 0 ? (
                <p className="text-sm text-slate-500">Nothing scheduled yet.</p>
              ) : (
                <ul className="space-y-3">
                  {scheduled.map((p) => (
                    <li key={p.id} className="text-sm">
                      <p className="font-medium text-slate-800">
                        {format(new Date(p.scheduledAt!), "EEE d MMM, HH:mm")}
                      </p>
                      <p className="line-clamp-2 text-slate-500">{p.captionMaster}</p>
                    </li>
                  ))}
                </ul>
              )}
              <Button variant="link" className="mt-2 h-auto px-0" asChild>
                <Link href="/dashboard/calendar">Open calendar</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Share2 className="h-4 w-4 text-blue-500" />
                Social accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              {connectedAccounts === null
                ? "Checking..."
                : connectedAccounts === 0
                  ? "No accounts connected yet."
                  : `${connectedAccounts} connected`}
              <Button variant="link" className="block h-auto px-0" asChild>
                <Link href="/dashboard/accounts">Manage accounts</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
