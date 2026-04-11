"use client"

import type React from "react"
import { useState, useEffect } from "react"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import { ErrorBoundary } from "@/components/error-boundary"
import { RoleProvider } from "@/lib/workspace-context"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMinimized, setIsMinimized] = useState(false)

  // Persist sidebar state in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-minimized")
    if (saved !== null) {
      setIsMinimized(JSON.parse(saved))
    }
  }, [])

  const toggleSidebar = () => {
    const newState = !isMinimized
    setIsMinimized(newState)
    localStorage.setItem("sidebar-minimized", JSON.stringify(newState))
  }

  return (
    <RoleProvider>
      <ErrorBoundary>
        <div className="flex min-h-screen w-full bg-slate-50">
          <DashboardSidebar isMinimized={isMinimized} onToggle={toggleSidebar} />

          <div className="flex-1 flex flex-col">
            <DashboardHeader isMinimized={isMinimized} />
            <main
              className={cn(
                "flex-1 p-6 transition-all duration-300 ease-in-out overflow-auto",
                isMinimized ? "ml-16" : "ml-64",
              )}
            >
              <div className="w-full max-w-none">{children}</div>
            </main>
          </div>
        </div>
      </ErrorBoundary>
    </RoleProvider>
  )
}
