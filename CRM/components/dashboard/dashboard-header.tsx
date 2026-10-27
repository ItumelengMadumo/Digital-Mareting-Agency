"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "aws-amplify/auth"
import { Bell, LogOut, PenSquare, Search, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarBrand, SidebarFooter, SidebarNav } from "@/components/dashboard/dashboard-sidebar"
import { DASHBOARD_NAV, isActiveLink } from "@/lib/dashboard-nav"
import { capitalize, clearCurrentUserCache, displayName, initials, useCurrentUser } from "@/lib/use-current-user"
import { Skeleton } from "@/components/ui/skeleton"
import { useWorkspace } from "@/lib/workspace-context"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  isMinimized: boolean
  mobileNavOpen: boolean
  onMobileNavChange: (open: boolean) => void
}

function usePageTitle() {
  const pathname = usePathname()
  // Most specific match wins, e.g. /dashboard/comms/email over /dashboard.
  const links = DASHBOARD_NAV.flatMap((g) => g.links)
    .filter((l) => isActiveLink(pathname, l.href))
    .sort((a, b) => b.href.length - a.href.length)
  return links[0]?.name ?? "SocialSync"
}

export default function DashboardHeader({ isMinimized, mobileNavOpen, onMobileNavChange }: DashboardHeaderProps) {
  const router = useRouter()
  const { user } = useCurrentUser()
  const { workspace, workspaceRole, workspaceLoaded } = useWorkspace()
  const pageTitle = usePageTitle()
  const [query, setQuery] = useState("")

  const handleSignOut = async () => {
    try {
      localStorage.removeItem("current-workspace")
    } catch {}
    clearCurrentUserCache()
    await signOut()
    router.replace("/")
    router.refresh()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/dashboard/posts${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`)
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 flex h-14 items-center border-b border-slate-200 bg-white/95 backdrop-blur transition-all duration-300 lg:h-16",
          isMinimized ? "lg:ml-16" : "lg:ml-64",
        )}
      >
        <div className="flex w-full items-center justify-between gap-3 px-3 sm:px-4 lg:px-6">
          {/* Phones and tablets: brand mark + page title. Desktop: workspace + post search. */}
          <div className="flex min-w-0 items-center gap-2 lg:hidden">
            <SidebarBrand minimized />
            <p className="truncate text-base font-semibold text-slate-900">{pageTitle}</p>
          </div>
          <div className="hidden min-w-0 flex-1 items-center gap-6 lg:flex">
            {workspaceLoaded && workspace ? (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{workspace.name}</p>
                <p className="text-xs text-slate-500">Pilot · {capitalize(workspaceRole)}</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            )}
            <form onSubmit={handleSearch} className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your posts..."
                className="h-9 bg-slate-50 pl-9"
                aria-label="Search your posts"
              />
            </form>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" className="hidden bg-blue-500 hover:bg-blue-600 lg:inline-flex" asChild>
              <Link href="/dashboard/compose">
                <PenSquare className="mr-2 h-4 w-4" />
                New post
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Notifications">
                  <Bell className="h-5 w-5 text-slate-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <p className="px-2 py-6 text-center text-sm text-slate-500">
                  You&apos;re all caught up. Failed posts and accounts that need reconnecting will show here.
                </p>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 rounded-full p-0" aria-label="Account menu">
                  {user ? (
                    <Avatar className="h-8 w-8 lg:h-9 lg:w-9">
                      {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
                      <AvatarFallback className="bg-blue-100 text-sm font-semibold text-blue-700">
                        {initials(user)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Skeleton className="h-8 w-8 rounded-full lg:h-9 lg:w-9" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <p className="truncate text-sm font-medium">{displayName(user)}</p>
                  <p className="truncate text-xs text-slate-500">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleSignOut} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <Sheet open={mobileNavOpen} onOpenChange={onMobileNavChange}>
        <SheetContent side="left" className="flex w-72 flex-col p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-14 items-center border-b border-slate-200 px-4">
            <SidebarBrand />
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-4">
            <SidebarNav onNavigate={() => onMobileNavChange(false)} />
          </div>
          <SidebarFooter />
        </SheetContent>
      </Sheet>
    </>
  )
}
