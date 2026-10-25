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

/** Loads the signed-in user's profile from /api/me once for the whole dashboard. */
export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    try {
      const res = await fetch("/api/me")
      setUser(res.ok ? await res.json() : null)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
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

export function initials(user: Pick<CurrentUser, "firstName" | "lastName" | "email"> | null) {
  if (!user) return "?"
  const letters = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`
  return (letters || user.email[0] || "?").toUpperCase()
}

export function displayName(user: Pick<CurrentUser, "firstName" | "lastName" | "email"> | null) {
  if (!user) return ""
  return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email
}
