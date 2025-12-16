"use client"

import { Button } from "@/components/ui/button"
import { Bell, MessageSquare, LogOut, User, Settings } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { RoleSwitcher } from "@/components/dashboard/role-switcher"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DashboardHeaderProps {
  isMinimized: boolean
}

export default function DashboardHeader({ isMinimized }: DashboardHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-16 items-center border-b border-slate-200 bg-white/95 backdrop-blur shadow-sm transition-all duration-300",
        isMinimized ? "ml-16" : "ml-64",
      )}
    >
      <div className="flex items-center justify-between w-full px-6">
        <div className="flex items-center space-x-4">
          <div
            className={cn(
              "transition-all duration-300",
              isMinimized ? "w-[300px] lg:w-[400px]" : "w-[250px] lg:w-[350px]",
            )}
          >
            <Input
              type="search"
              placeholder="Search leads, communications, reports..."
              className="h-9 w-full bg-slate-50 border-slate-200 focus:border-primary/40 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <RoleSwitcher />
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
          >
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="sr-only">Messages</span>
          </Button>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-slate-100">
                <img
                  className="h-9 w-9 rounded-full ring-2 ring-slate-200 hover:ring-slate-300 transition-all duration-200"
                  src="/placeholder.svg?height=36&width=36"
                  alt="Avatar"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
