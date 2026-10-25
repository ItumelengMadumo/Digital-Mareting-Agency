"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut } from "aws-amplify/auth"
import { Bell, LogOut, Menu, PenSquare, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { displayName, initials, useCurrentUser } from "@/lib/use-current-user"
import { useWorkspace } from "@/lib/workspace-context"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  isMinimized: boolean
}

export default function DashboardHeader({ isMinimized }: DashboardHeaderProps) {
  const router = useRouter()
  const { user } = useCurrentUser()
  const { workspace } = useWorkspace()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      localStorage.removeItem("current-workspace")
    } catch {}
    await signOut()
    router.replace("/")
    router.refresh()
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 flex h-16 items-center border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur transition-all duration-300",
          isMinimized ? "lg:ml-16" : "lg:ml-64",
        )}
      >
        <div className="flex w-full items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{workspace?.name ?? "My Workspace"}</p>
              <p className="hidden text-xs text-slate-500 sm:block">Workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" className="hidden bg-blue-500 hover:bg-blue-600 sm:inline-flex" asChild>
              <Link href="/dashboard/compose">
                <PenSquare className="mr-2 h-4 w-4" />
                New post
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9" aria-label="Notifications">
                  <Bell className="h-4 w-4" />
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
                  <Avatar className="h-9 w-9">
                    {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
                    <AvatarFallback className="bg-blue-100 text-sm font-semibold text-blue-700">
                      {initials(user)}
                    </AvatarFallback>
                  </Avatar>
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

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="flex w-72 flex-col p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-16 items-center border-b border-slate-200 px-4">
            <SidebarBrand />
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-4">
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </div>
          <SidebarFooter />
        </SheetContent>
      </Sheet>
    </>
  )
}
