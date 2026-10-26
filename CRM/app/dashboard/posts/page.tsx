"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { PenSquare, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PageHeader from "@/components/dashboard/page-header"
import PostCard, { PostsEmptyState } from "@/components/dashboard/posts/post-card"
import PlatformIcon from "@/components/platform-icon"
import { SOCIAL_PLATFORMS, getPlatform } from "@/lib/platforms"
import { postView, usePosts, type PostView } from "@/lib/posts"
import { cn } from "@/lib/utils"

const TABS: { value: PostView; label: string; emptyTitle: string; emptyText: string }[] = [
  {
    value: "draft",
    label: "Drafts",
    emptyTitle: "No drafts",
    emptyText: "Posts you save without a time land here so you can finish them later.",
  },
  {
    value: "scheduled",
    label: "Scheduled",
    emptyTitle: "Nothing scheduled",
    emptyText: "Turn on 'Schedule for later' in Compose to queue a post.",
  },
  {
    value: "published",
    label: "Published",
    emptyTitle: "Nothing published yet",
    emptyText: "Live posts show here with their likes and comments.",
  },
]

function PostsView() {
  const searchParams = useSearchParams()
  const { posts, loading, error } = usePosts()
  const [query, setQuery] = useState(searchParams.get("q") ?? "")
  const [platform, setPlatform] = useState<string | null>(null)

  // The header search box navigates here with ?q=
  useEffect(() => {
    setQuery(searchParams.get("q") ?? "")
  }, [searchParams])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter((p) => {
      if (platform && !p.variants.some((v) => getPlatform(v.platform)?.id === platform)) return false
      if (!q) return true
      return (
        p.captionMaster.toLowerCase().includes(q) ||
        (p.hashtags ?? "").toLowerCase().includes(q) ||
        p.variants.some((v) => v.caption.toLowerCase().includes(q))
      )
    })
  }, [posts, query, platform])

  // Only offer platform chips for platforms that have posts.
  const usedPlatforms = SOCIAL_PLATFORMS.filter((sp) =>
    posts.some((p) => p.variants.some((v) => getPlatform(v.platform)?.id === sp.id)),
  )
  const filtering = Boolean(query.trim() || platform)

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-6">
      <PageHeader
        title="Posts"
        description="Drafts, scheduled posts and everything you've published."
        actions={
          <Button className="hidden bg-blue-500 hover:bg-blue-600 sm:inline-flex" asChild>
            <Link href="/dashboard/compose">
              <PenSquare className="mr-2 h-4 w-4" />
              New post
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search captions and hashtags"
            className="bg-white pl-9"
            aria-label="Search posts"
          />
        </div>
        {usedPlatforms.length > 0 && (
          <div className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:px-0">
            <button
              type="button"
              onClick={() => setPlatform(null)}
              className={cn(
                "flex-shrink-0 rounded-full border px-3 py-1.5 text-sm",
                platform === null ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600",
              )}
            >
              All platforms
            </button>
            {usedPlatforms.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlatform(platform === p.id ? null : p.id)}
                className={cn(
                  "flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm",
                  platform === p.id ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600",
                )}
              >
                <PlatformIcon id={p.id} className="h-3.5 w-3.5" />
                {p.label}
              </button>
            ))}
          </div>
        )}
        {filtering && (
          <Button
            variant="ghost"
            size="sm"
            className="self-start lg:self-auto"
            onClick={() => {
              setQuery("")
              setPlatform(null)
            }}
          >
            <X className="mr-1 h-4 w-4" /> Clear filters
          </Button>
        )}
      </div>

      <Tabs defaultValue="draft">
        <TabsList className="w-full justify-start sm:w-auto">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex-1 sm:flex-none">
              {tab.label}
              {!loading && (
                <span className="ml-2 rounded-full bg-slate-200 px-1.5 text-xs text-slate-700">
                  {filtered.filter((p) => postView(p) === tab.value).length}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tab) => {
          const items = filtered.filter((p) => postView(p) === tab.value)
          return (
            <TabsContent key={tab.value} value={tab.value} className="mt-4">
              {loading ? (
                <div className="grid gap-4 xl:grid-cols-2">
                  <Skeleton className="h-40 rounded-xl" />
                  <Skeleton className="h-40 rounded-xl" />
                </div>
              ) : error ? (
                <Card>
                  <CardContent className="p-6 text-sm text-red-600">{error}</CardContent>
                </Card>
              ) : items.length === 0 ? (
                filtering ? (
                  <p className="rounded-lg border border-dashed bg-white p-6 text-center text-sm text-slate-500">
                    No {tab.label.toLowerCase()} match your filters.
                  </p>
                ) : (
                  <PostsEmptyState title={tab.emptyTitle} text={tab.emptyText} />
                )
              ) : (
                <div className="grid items-start gap-4 xl:grid-cols-2">
                  {items.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}

export default function PostsPage() {
  return (
    <Suspense>
      <PostsView />
    </Suspense>
  )
}
