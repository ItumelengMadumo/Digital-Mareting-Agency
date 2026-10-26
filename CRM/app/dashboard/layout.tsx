"use client"

import type React from "react"
import { useState, useEffect } from "react"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import MobileTabBar from "@/components/dashboard/mobile-tab-bar"
import { ErrorBoundary } from "@/components/error-boundary"
import { RoleProvider } from "@/lib/workspace-context"
import { CurrentUserProvider } from "@/lib/use-current-user"
import { DashboardDataProvider } from "@/lib/posts"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

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
        <DashboardDataProvider>
          <ErrorBoundary>
            <div className="flex min-h-screen w-full bg-slate-50">
              <DashboardSidebar isMinimized={isMinimized} onToggle={toggleSidebar} />

              <div className="flex min-w-0 flex-1 flex-col">
                <DashboardHeader
                  isMinimized={isMinimized}
                  mobileNavOpen={mobileNavOpen}
                  onMobileNavChange={setMobileNavOpen}
                />
                <main
                  className={cn(
                    // Bottom padding keeps content clear of the mobile tab bar.
                    "flex-1 overflow-x-hidden p-3 pb-24 transition-all duration-300 ease-in-out sm:p-4 sm:pb-24 lg:p-6",
                    isMinimized ? "lg:ml-16" : "lg:ml-64",
                  )}
                >
                  {children}
                </main>
              </div>
              <MobileTabBar onOpenMenu={() => setMobileNavOpen(true)} />
            </div>
          </ErrorBoundary>
        </DashboardDataProvider>
      </RoleProvider>
    </CurrentUserProvider>
  )
}
