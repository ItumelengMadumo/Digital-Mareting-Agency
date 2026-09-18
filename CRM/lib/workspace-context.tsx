"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { Workspace, WorkspaceMember, MemberRole, WorkspaceType } from "@/lib/types"

// Keep backward compatibility with existing role system
export type UserRole = "executive" | "sales"

interface WorkspaceContextType {
  // Legacy role support
  role: UserRole
  setRole: (role: UserRole) => void
  isExecutive: boolean
  // Workspace support
  workspace: Workspace | null
  setWorkspace: (ws: Workspace) => void
  workspaces: Workspace[]
  setWorkspaces: (wsList: Workspace[]) => void
  workspaceRole: MemberRole
  workspaceType: WorkspaceType
  currentClientId: string | null
  setCurrentClientId: (id: string | null) => void
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

// Default workspace for development / before backend is connected
const DEFAULT_WORKSPACE: Workspace = {
  id: "ws_default",
  name: "My Workspace",
  type: "business",
  ownerId: "user_default",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("sales")
  const [workspace, setWorkspaceState] = useState<Workspace>(DEFAULT_WORKSPACE)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([DEFAULT_WORKSPACE])
  const [workspaceRole, setWorkspaceRole] = useState<MemberRole>("member")
  const [currentClientId, setCurrentClientId] = useState<string | null>(null)

  // Load persisted state
  useEffect(() => {
    const savedRole = localStorage.getItem("user-role") as UserRole
    if (savedRole && (savedRole === "executive" || savedRole === "sales")) {
      setRoleState(savedRole)
    }
    const savedWs = localStorage.getItem("current-workspace")
    let parsedSavedWs: (Workspace & { role?: MemberRole }) | null = null
    if (savedWs) {
      try {
        parsedSavedWs = JSON.parse(savedWs)
        setWorkspaceState(parsedSavedWs as Workspace)
        if (parsedSavedWs?.role) setWorkspaceRole(parsedSavedWs.role)
      } catch {}
    }
    const savedClient = localStorage.getItem("current-client-id")
    if (savedClient) setCurrentClientId(savedClient)

    // GET /api/workspaces now returns only the session user's own workspaces, each annotated
    // with that user's real membership role — no more hardcoded "owner".
    fetch("/api/workspaces")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: (Workspace & { role: MemberRole })[] | null) => {
        if (data?.length) {
          setWorkspaces(data)
          const stillValid = parsedSavedWs && data.some((w) => w.id === parsedSavedWs!.id)
          const active = stillValid ? data.find((w) => w.id === parsedSavedWs!.id)! : data[0]
          setWorkspaceState(active)
          setWorkspaceRole(active.role)
          localStorage.setItem("current-workspace", JSON.stringify(active))
        }
      })
      .catch(() => {})
  }, [])

  const setRole = useCallback((newRole: UserRole) => {
    setRoleState(newRole)
    localStorage.setItem("user-role", newRole)
  }, [])

  const setWorkspace = useCallback((ws: Workspace & { role?: MemberRole }) => {
    setWorkspaceState(ws)
    if (ws.role) setWorkspaceRole(ws.role)
    localStorage.setItem("current-workspace", JSON.stringify(ws))
  }, [])

  const setClientId = useCallback((id: string | null) => {
    setCurrentClientId(id)
    if (id) localStorage.setItem("current-client-id", id)
    else localStorage.removeItem("current-client-id")
  }, [])

  const isExecutive = role === "executive"

  return (
    <WorkspaceContext.Provider
      value={{
        role,
        setRole,
        isExecutive,
        workspace,
        setWorkspace,
        workspaces,
        setWorkspaces,
        workspaceRole,
        workspaceType: workspace?.type as WorkspaceType ?? "business",
        currentClientId,
        setCurrentClientId: setClientId,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

// Keep the old hook name for backward compatibility
export function useRole() {
  const context = useContext(WorkspaceContext)
  if (context === undefined) {
    throw new Error("useRole must be used within a WorkspaceProvider")
  }
  return context
}

// New hook
export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider")
  }
  return context
}

// Re-export for backward compatibility
export { WorkspaceProvider as RoleProvider }
