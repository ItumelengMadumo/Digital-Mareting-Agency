"use client"

import { useCallback, useEffect, useState } from "react"
import { useWorkspace } from "@/lib/workspace-context"

export interface PostVariant {
  id: string
  platform: string
  caption: string
  title?: string | null
  status: "pending" | "ready" | "published" | "failed"
}

export interface Post {
  id: string
  workspaceId: string
  captionMaster: string
  mediaUrl?: string | null
  mediaType?: "image" | "video" | "text" | "link" | null
  hashtags?: string | null
  link?: string | null
  status: "draft" | "ready" | "published" | "archived"
  scheduledAt?: string | null
  createdAt: string
  updatedAt: string
  variants: PostVariant[]
}

export type PostView = "draft" | "scheduled" | "published"

/** Which tab a post belongs in: published once anything went live, scheduled once it has a time. */
export function postView(post: Post): PostView {
  if (post.status === "published" || post.variants.some((v) => v.status === "published")) return "published"
  if (post.scheduledAt) return "scheduled"
  return "draft"
}

export type PlatformState = "Draft" | "Scheduled" | "Publishing" | "Live" | "Failed"

export function platformState(post: Post, variant: PostVariant): PlatformState {
  if (variant.status === "published") return "Live"
  if (variant.status === "failed") return "Failed"
  if (post.scheduledAt) return variant.status === "ready" ? "Publishing" : "Scheduled"
  return "Draft"
}

/** Posts in the current workspace, newest first, from GET /api/content. */
export function usePosts() {
  const { workspace, workspaceLoaded } = useWorkspace()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const reload = useCallback(async () => {
    if (!workspaceLoaded || !workspace) return
    setLoading(true)
    try {
      const res = await fetch(`/api/content?workspaceId=${workspace.id}`)
      if (!res.ok) throw new Error("Could not load your posts")
      setPosts(await res.json())
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load your posts")
    } finally {
      setLoading(false)
    }
  }, [workspace, workspaceLoaded])

  useEffect(() => {
    reload()
  }, [reload])

  return { posts, loading: loading || !workspaceLoaded, error, reload }
}
