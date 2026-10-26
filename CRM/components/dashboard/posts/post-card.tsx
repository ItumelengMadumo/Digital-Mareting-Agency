"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getUrl } from "aws-amplify/storage"
import { format, formatDistanceToNow } from "date-fns"
import { ChevronDown, FileText, Heart, MessageCircle, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import PlatformIcon from "@/components/platform-icon"
import { anyEngagementAvailable } from "@/lib/engagement"
import { platformLabel } from "@/lib/platforms"
import { platformState, postView, type PlatformState, type Post } from "@/lib/posts"
import { cn } from "@/lib/utils"

const STATE_STYLES: Record<PlatformState, string> = {
  Draft: "bg-slate-100 text-slate-700 border-slate-200",
  Scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  Publishing: "bg-amber-50 text-amber-700 border-amber-200",
  Live: "bg-green-50 text-green-700 border-green-200",
  Failed: "bg-red-50 text-red-700 border-red-200",
}

const VIEW_LABEL = { draft: "Draft", scheduled: "Scheduled", published: "Published" } as const

/** Resolves a media-bucket path (from Compose) to a short-lived URL; full URLs pass through. */
function useMediaUrl(path?: string | null) {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    if (!path) return setUrl(null)
    if (/^https?:\/\//.test(path)) return setUrl(path)
    let cancelled = false
    getUrl({ path, options: { expiresIn: 3600 } })
      .then(({ url }) => !cancelled && setUrl(url.toString()))
      .catch(() => !cancelled && setUrl(null))
    return () => {
      cancelled = true
    }
  }, [path])
  return url
}

export default function PostCard({ post }: { post: Post }) {
  const mediaUrl = useMediaUrl(post.mediaUrl)
  const view = postView(post)
  const when = post.scheduledAt ?? post.createdAt
  const engagementReady = anyEngagementAvailable()

  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="text-xs text-slate-500">
            <Badge variant="outline" className="mr-2">
              {VIEW_LABEL[view]}
            </Badge>
            {view === "scheduled"
              ? `Goes out ${format(new Date(when), "EEE d MMM, HH:mm")}`
              : `${view === "draft" ? "Saved" : "Posted"} ${formatDistanceToNow(new Date(when), { addSuffix: true })}`}
          </div>
        </div>

        <div className="flex gap-4">
          {post.mediaUrl && (
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-28 sm:w-28">
              {mediaUrl &&
                (post.mediaType === "video" ? (
                  <video src={mediaUrl} className="h-full w-full object-cover" muted playsInline />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={mediaUrl} alt="" className="h-full w-full object-cover" />
                ))}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="whitespace-pre-line text-sm text-slate-800">{post.captionMaster}</p>
            {post.hashtags && <p className="mt-2 text-sm text-blue-600">{post.hashtags}</p>}
          </div>
        </div>

        {post.variants.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.variants.map((v) => {
              const state = platformState(post, v)
              return (
                <span
                  key={v.id}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                    STATE_STYLES[state],
                  )}
                >
                  <PlatformIcon id={v.platform} className="h-3 w-3" />
                  {platformLabel(v.platform)} · {state}
                </span>
              )
            })}
          </div>
        )}

        <Collapsible>
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1" title="Likes">
                <Heart className="h-4 w-4" /> —
              </span>
              <span className="flex items-center gap-1" title="Comments">
                <MessageCircle className="h-4 w-4" /> —
              </span>
              <span className="flex items-center gap-1" title="Shares">
                <Share2 className="h-4 w-4" /> —
              </span>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-slate-500">
                Comments <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="mt-3 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
              {view !== "published" ? (
                <p>Likes and comments appear here once this post is live.</p>
              ) : engagementReady ? (
                <p>No comments yet.</p>
              ) : (
                <p>
                  Likes and comments will show here once analytics is connected for your platforms.{" "}
                  <Link href="/dashboard/accounts" className="font-medium text-blue-600 hover:underline">
                    Social accounts
                  </Link>
                </p>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

export function PostsEmptyState({ title, text }: { title: string; text: string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
        <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-100">
          <FileText className="h-6 w-6 text-slate-400" />
        </span>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500">{text}</p>
        </div>
        <Button asChild size="sm" className="bg-blue-500 hover:bg-blue-600">
          <Link href="/dashboard/compose">Compose a post</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
