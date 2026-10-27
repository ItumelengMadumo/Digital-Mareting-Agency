"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"

export interface CurrentUser {
  id: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
  phone?: string
  bio?: string
  handle?: string
  timezone?: string
  createdAt: string
}

interface CurrentUserContextValue {
  user: CurrentUser | null
  loading: boolean
  reload: () => Promise<void>
  setUser: (user: CurrentUser) => void
}

const CurrentUserContext = createContext<CurrentUserContextValue | undefined>(undefined)

const CACHE_KEY = "socialsync-user"

function readCache(): CurrentUser | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as CurrentUser) : null
  } catch {
    return null
  }
}

function writeCache(user: CurrentUser | null) {
  try {
    if (user) sessionStorage.setItem(CACHE_KEY, JSON.stringify(user))
    else sessionStorage.removeItem(CACHE_KEY)
  } catch {}
}

/** Forget the cached profile (on sign-out). */
export function clearCurrentUserCache() {
  writeCache(null)
}

/**
 * Loads the signed-in user's profile once for the whole dashboard. The last known profile is kept
 * in sessionStorage so a page reload shows your name straight away, then refreshes in the background.
 */
export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)

  const setUser = useCallback((next: CurrentUser) => {
    setUserState(next)
    writeCache(next)
  }, [])

  const reload = useCallback(async () => {
    try {
      const res = await fetch("/api/me")
      const next = res.ok ? ((await res.json()) as CurrentUser) : null
      setUserState(next)
      writeCache(next)
    } catch {
      // Keep showing the cached profile if the network blips.
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const cached = readCache()
    if (cached) {
      setUserState(cached)
      setLoading(false)
    }
    reload()
  }, [reload])

  return (
    <CurrentUserContext.Provider value={{ user, loading, reload, setUser }}>{children}</CurrentUserContext.Provider>
  )
}

export function useCurrentUser() {
  const context = useContext(CurrentUserContext)
  if (!context) throw new Error("useCurrentUser must be used within a CurrentUserProvider")
  return context
}

/** "itu" -> "Itu", "van der merwe" -> "Van Der Merwe" (display only). */
export function capitalize(name?: string | null) {
  return (name ?? "")
    .split(/(\s+|-)/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}

export function initials(user: Pick<CurrentUser, "firstName" | "lastName" | "email"> | null) {
  if (!user) return "?"
  const letters = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`
  return (letters || user.email[0] || "?").toUpperCase()
}

export function displayName(user: Pick<CurrentUser, "firstName" | "lastName" | "email"> | null) {
  if (!user) return ""
  return `${capitalize(user.firstName)} ${capitalize(user.lastName)}`.trim() || user.email
}
