"use client"

import Link from "next/link"
import { PenSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PostCard, { PostsEmptyState } from "@/components/dashboard/posts/post-card"
import { postView, usePosts, type PostView } from "@/lib/posts"

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

export default function PostsPage() {
  const { posts, loading, error } = usePosts()

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
          <p className="mt-1 text-muted-foreground">Drafts, scheduled posts and everything you&apos;ve published.</p>
        </div>
        <Button className="bg-blue-500 hover:bg-blue-600" asChild>
          <Link href="/dashboard/compose">
            <PenSquare className="mr-2 h-4 w-4" />
            New post
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="draft">
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
              {!loading && (
                <span className="ml-2 rounded-full bg-slate-200 px-1.5 text-xs text-slate-700">
                  {posts.filter((p) => postView(p) === tab.value).length}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tab) => {
          const items = posts.filter((p) => postView(p) === tab.value)
          return (
            <TabsContent key={tab.value} value={tab.value} className="mt-6 space-y-4">
              {loading ? (
                <Skeleton className="h-40 w-full rounded-xl" />
              ) : error ? (
                <Card>
                  <CardContent className="p-6 text-sm text-red-600">{error}</CardContent>
                </Card>
              ) : items.length === 0 ? (
                <PostsEmptyState title={tab.emptyTitle} text={tab.emptyText} />
              ) : (
                items.map((post) => <PostCard key={post.id} post={post} />)
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
