"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  PenSquare,
  Settings,
  Share2,
  ChevronLeft,
  ChevronRight,
  Users,
  BarChart3,
  Activity,
  Package,
  Eye,
  Phone,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRole } from "@/lib/role-context"

interface SidebarLink {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  executiveOnly?: boolean
}

const executiveOversightLinks: SidebarLink[] = [
  { name: "Team Oversight", href: "/dashboard/oversight", icon: Eye },
  { name: "Activity Feed", href: "/dashboard/activity", icon: Activity },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
]

const mainLinks: SidebarLink[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Leads", href: "/dashboard/leads", icon: Users },
  { name: "Communications", href: "/dashboard/communications", icon: Phone },
  { name: "Products", href: "/dashboard/products", icon: Package },
]

const socialMediaLinks: SidebarLink[] = [
  { name: "Create Post", href: "/dashboard/create-post", icon: PenSquare },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Platforms", href: "/dashboard/platforms", icon: Share2 },
]

const systemLinks: SidebarLink[] = [{ name: "Settings", href: "/dashboard/settings", icon: Settings }]

interface DashboardSidebarProps {
  isMinimized: boolean
  onToggle: () => void
}

export default function DashboardSidebar({ isMinimized, onToggle }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { isExecutive } = useRole()

  const renderSection = (title: string, links: SidebarLink[]) => (
    <div className="space-y-1">
      {!isMinimized && <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">{title}</div>}
      {links.map((link) => {
        const isActive = pathname === link.href
        const LinkContent = (
          <Link
            href={link.href}
            className={cn(
              "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
              isMinimized ? "justify-center" : "justify-start",
            )}
          >
            <link.icon className={cn("h-5 w-5 flex-shrink-0", !isMinimized && "mr-3")} />
            {!isMinimized && <span className="transition-opacity duration-300">{link.name}</span>}
          </Link>
        )

        if (isMinimized) {
          return (
            <Tooltip key={link.name} delayDuration={0}>
              <TooltipTrigger asChild>{LinkContent}</TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                {link.name}
              </TooltipContent>
            </Tooltip>
          )
        }

        return <div key={link.name}>{LinkContent}</div>
      })}
    </div>
  )

  return (
    <TooltipProvider>
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-white border-r border-slate-200 shadow-sm transition-all duration-300 ease-in-out",
          isMinimized ? "w-16" : "w-64",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 bg-white">
          <Link href="/dashboard" className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-bold text-sm">CM</span>
              </div>
              {!isMinimized && <span className="text-xl font-bold transition-opacity duration-300">CRM Pro</span>}
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 hover:bg-slate-100 transition-colors"
          >
            {isMinimized ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 px-2 bg-white overflow-y-auto">
          <nav className="space-y-6">
            {isExecutive && renderSection("Executive", executiveOversightLinks)}

            {renderSection(isExecutive ? "My Work" : "Main", mainLinks)}

            {renderSection("Social Media", socialMediaLinks)}

            {renderSection("System", systemLinks)}
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 bg-white">
          <div className={cn("flex items-center", isMinimized ? "justify-center" : "justify-start")}>
            <div className="flex-shrink-0">
              <img
                className="h-8 w-8 rounded-full ring-2 ring-slate-200"
                src="/placeholder.svg?height=32&width=32"
                alt="Profile"
              />
            </div>
            {!isMinimized && (
              <div className="ml-3 min-w-0 flex-1 transition-opacity duration-300">
                <p className="text-sm font-medium truncate">John Doe</p>
                <p className="text-xs text-slate-600 truncate">{isExecutive ? "Executive" : "Sales & Marketing"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
