"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
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

export interface SocialAccount {
  id: string
  platform: string
  accountName: string
  accountType: string
  isConnected: boolean
  lastSyncAt?: string | null
}

interface DashboardData {
  posts: Post[]
  postsLoading: boolean
  postsError: string
  reloadPosts: () => Promise<void>
  accounts: SocialAccount[] | null
  reloadAccounts: () => Promise<void>
}

const DashboardDataContext = createContext<DashboardData | undefined>(undefined)

/**
 * Loads the workspace's posts and social accounts once for the whole dashboard, so moving
 * between Home, Posts, Calendar and Accounts doesn't refetch everything on every page.
 */
export function DashboardDataProvider({ children }: { children: React.ReactNode }) {
  const { workspace, workspaceLoaded } = useWorkspace()
  const [posts, setPosts] = useState<Post[]>([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [postsError, setPostsError] = useState("")
  const [accounts, setAccounts] = useState<SocialAccount[] | null>(null)
  const workspaceId = workspaceLoaded ? workspace?.id : undefined

  const reloadPosts = useCallback(async () => {
    if (!workspaceId) return
    try {
      const res = await fetch(`/api/content?workspaceId=${workspaceId}`)
      if (!res.ok) throw new Error("Could not load your posts")
      setPosts(await res.json())
      setPostsError("")
    } catch (err) {
      setPostsError(err instanceof Error ? err.message : "Could not load your posts")
    } finally {
      setPostsLoading(false)
    }
  }, [workspaceId])

  const reloadAccounts = useCallback(async () => {
    if (!workspaceId) return
    try {
      const res = await fetch(`/api/platforms?workspaceId=${workspaceId}`)
      setAccounts(res.ok ? await res.json() : [])
    } catch {
      setAccounts([])
    }
  }, [workspaceId])

  useEffect(() => {
    reloadPosts()
    reloadAccounts()
  }, [reloadPosts, reloadAccounts])

  return (
    <DashboardDataContext.Provider
      value={{ posts, postsLoading, postsError, reloadPosts, accounts, reloadAccounts }}
    >
      {children}
    </DashboardDataContext.Provider>
  )
}

function useDashboardData() {
  const context = useContext(DashboardDataContext)
  if (!context) throw new Error("Dashboard data hooks must be used within a DashboardDataProvider")
  return context
}

/** Posts in the current workspace, newest first. */
export function usePosts() {
  const { posts, postsLoading, postsError, reloadPosts } = useDashboardData()
  return { posts, loading: postsLoading, error: postsError, reload: reloadPosts }
}

/** The workspace's social accounts (null while loading). */
export function useSocialAccounts() {
  const { accounts, reloadAccounts } = useDashboardData()
  const connected = accounts?.filter((a) => a.isConnected) ?? []
  return { accounts, connected, reload: reloadAccounts }
}
