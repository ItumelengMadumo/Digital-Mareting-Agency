"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronLeft, ChevronRight, LifeBuoy } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DASHBOARD_NAV, isActiveLink, type NavGroup, type NavLink } from "@/lib/dashboard-nav"
import { displayName, initials, useCurrentUser } from "@/lib/use-current-user"
import { SITE } from "@/lib/site"

const STORAGE_KEY = "sidebar-groups"

function useGroupState(pathname: string) {
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(DASHBOARD_NAV.map((g) => [g.id, g.defaultOpen ?? true])),
  )

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setOpen((prev) => ({ ...prev, ...JSON.parse(saved) }))
    } catch {}
  }, [])

  // Always show the group holding the current page.
  useEffect(() => {
    const active = DASHBOARD_NAV.find((g) => g.links.some((l) => isActiveLink(pathname, l.href)))
    if (active) setOpen((prev) => (prev[active.id] ? prev : { ...prev, [active.id]: true }))
  }, [pathname])

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {}
      return next
    })

  return { open, toggle }
}

function NavItem({ link, pathname, minimized, onNavigate }: {
  link: NavLink
  pathname: string
  minimized?: boolean
  onNavigate?: () => void
}) {
  const active = isActiveLink(pathname, link.href)
  const item = (
    <Link
      href={link.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active ? "bg-blue-500 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        minimized ? "justify-center" : "justify-start",
      )}
    >
      <link.icon className={cn("h-5 w-5 flex-shrink-0", !minimized && "mr-3")} />
      {!minimized && <span className="truncate">{link.name}</span>}
    </Link>
  )

  if (!minimized) return item
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>{item}</TooltipTrigger>
      <TooltipContent side="right">{link.name}</TooltipContent>
    </Tooltip>
  )
}

/** Minimized sidebar: a collapsible group becomes one icon that opens its links to the side. */
function MinimizedGroup({ group, pathname }: { group: NavGroup; pathname: string }) {
  const Icon = group.icon ?? group.links[0].icon
  const active = group.links.some((l) => isActiveLink(pathname, l.href))
  return (
    <DropdownMenu>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex w-full items-center justify-center rounded-md px-3 py-2 transition-colors",
                active ? "bg-blue-500 text-white" : "text-slate-600 hover:bg-slate-100",
              )}
              aria-label={group.title}
            >
              <Icon className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="right">{group.title}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent side="right" align="start" className="w-52">
        <DropdownMenuLabel>{group.title}</DropdownMenuLabel>
        {group.links.map((link) => (
          <DropdownMenuItem key={link.href} asChild>
            <Link href={link.href} className={cn(isActiveLink(pathname, link.href) && "font-semibold text-blue-600")}>
              <link.icon className="mr-2 h-4 w-4" />
              {link.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** The navigation list, shared by the desktop sidebar and the mobile drawer. */
export function SidebarNav({ minimized, onNavigate }: { minimized?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname()
  const { open, toggle } = useGroupState(pathname)

  return (
    <nav className="space-y-1">
      {DASHBOARD_NAV.map((group) => {
        if (minimized) {
          return (
            <div key={group.id} className="space-y-1">
              {group.collapsible && group.links.length > 1 ? (
                <MinimizedGroup group={group} pathname={pathname} />
              ) : (
                group.links.map((link) => <NavItem key={link.href} link={link} pathname={pathname} minimized />)
              )}
            </div>
          )
        }

        if (!group.collapsible || !group.title) {
          return (
            <div key={group.id} className="space-y-1 pb-2">
              {group.links.map((link) => (
                <NavItem key={link.href} link={link} pathname={pathname} onNavigate={onNavigate} />
              ))}
            </div>
          )
        }

        return (
          <Collapsible key={group.id} open={open[group.id]} onOpenChange={() => toggle(group.id)}>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:bg-slate-50 hover:text-slate-700">
              {group.title}
              <ChevronDown className={cn("h-4 w-4 transition-transform", !open[group.id] && "-rotate-90")} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pb-2">
              {group.links.map((link) => (
                <NavItem key={link.href} link={link} pathname={pathname} onNavigate={onNavigate} />
              ))}
            </CollapsibleContent>
          </Collapsible>
        )
      })}
    </nav>
  )
}

export function SidebarBrand({ minimized }: { minimized?: boolean }) {
  return (
    <Link href="/dashboard" className="flex items-center gap-2">
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold text-white">
        S
      </span>
      {!minimized && (
        <span className="text-xl font-bold text-slate-900">
          <span className="text-blue-500">Social</span>Sync
        </span>
      )}
    </Link>
  )
}

export function SidebarFooter({ minimized }: { minimized?: boolean }) {
  const { user } = useCurrentUser()
  return (
    <div className="space-y-3 border-t border-slate-200 p-3">
      <a
        href={`mailto:${SITE.email}?subject=SocialSync%20feedback`}
        className={cn(
          "flex items-center rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100",
          minimized && "justify-center",
        )}
        title="Help & feedback"
      >
        <LifeBuoy className={cn("h-5 w-5", !minimized && "mr-3")} />
        {!minimized && "Help & feedback"}
      </a>
      <Link href="/dashboard/profile" className={cn("flex items-center gap-3 px-1", minimized && "justify-center")}>
        <Avatar className="h-8 w-8">
          {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
          <AvatarFallback className="bg-blue-100 text-xs font-semibold text-blue-700">{initials(user)}</AvatarFallback>
        </Avatar>
        {!minimized && (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">{displayName(user) || "Loading..."}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
        )}
      </Link>
    </div>
  )
}

interface DashboardSidebarProps {
  isMinimized: boolean
  onToggle: () => void
}

/** Desktop sidebar (lg and up). On smaller screens the header opens the same nav in a drawer. */
export default function DashboardSidebar({ isMinimized, onToggle }: DashboardSidebarProps) {
  return (
    <TooltipProvider>
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 hidden h-full flex-col border-r border-slate-200 bg-white shadow-sm transition-all duration-300 lg:flex",
          isMinimized ? "w-16" : "w-64",
        )}
      >
        <div
          className={cn(
            "flex h-16 items-center border-b border-slate-200 px-3",
            isMinimized ? "justify-center" : "justify-between",
          )}
        >
          {!isMinimized && <SidebarBrand />}
          <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8" aria-label="Toggle sidebar">
            {isMinimized ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-4">
          <SidebarNav minimized={isMinimized} />
        </div>
        <SidebarFooter minimized={isMinimized} />
      </aside>
    </TooltipProvider>
  )
}
