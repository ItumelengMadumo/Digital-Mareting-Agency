"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "executive" | "sales"

interface RoleContextType {
  role: UserRole
  setRole: (role: UserRole) => void
  isExecutive: boolean
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("sales")

  // Load role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem("user-role") as UserRole
    if (savedRole && (savedRole === "executive" || savedRole === "sales")) {
      setRoleState(savedRole)
    }
  }, [])

  // Save role to localStorage when it changes
  const setRole = (newRole: UserRole) => {
    setRoleState(newRole)
    localStorage.setItem("user-role", newRole)
  }

  const isExecutive = role === "executive"

  return <RoleContext.Provider value={{ role, setRole, isExecutive }}>{children}</RoleContext.Provider>
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
}
