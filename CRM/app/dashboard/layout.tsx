"use client"

import type React from "react"
import { useState, useEffect } from "react"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import { ErrorBoundary } from "@/components/error-boundary"
import { RoleProvider } from "@/lib/workspace-context"
import { CurrentUserProvider } from "@/lib/use-current-user"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMinimized, setIsMinimized] = useState(false)

  // Persist sidebar state in localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sidebar-minimized")
      if (saved !== null) setIsMinimized(JSON.parse(saved))
    } catch {}
  }, [])

  const toggleSidebar = () => {
    const newState = !isMinimized
    setIsMinimized(newState)
    try {
      localStorage.setItem("sidebar-minimized", JSON.stringify(newState))
    } catch {}
  }

  return (
    <CurrentUserProvider>
      <RoleProvider>
        <ErrorBoundary>
          <div className="flex min-h-screen w-full bg-slate-50">
            <DashboardSidebar isMinimized={isMinimized} onToggle={toggleSidebar} />

            <div className="flex min-w-0 flex-1 flex-col">
              <DashboardHeader isMinimized={isMinimized} />
              <main
                className={cn(
                  "flex-1 overflow-x-hidden p-4 transition-all duration-300 ease-in-out sm:p-6",
                  isMinimized ? "lg:ml-16" : "lg:ml-64",
                )}
              >
                <div className="w-full max-w-none">{children}</div>
              </main>
            </div>
          </div>
        </ErrorBoundary>
      </RoleProvider>
    </CurrentUserProvider>
  )
}
