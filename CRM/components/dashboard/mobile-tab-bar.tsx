"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, FileText, Home, Menu, Plus } from "lucide-react"
import { isActiveLink } from "@/lib/dashboard-nav"
import { cn } from "@/lib/utils"

const TABS = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Posts", href: "/dashboard/posts", icon: FileText },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
]

/** Bottom navigation for phones and tablets (below lg). Menu opens the full navigation drawer. */
export default function MobileTabBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname()

  const tab = (t: (typeof TABS)[number]) => {
    const active = isActiveLink(pathname, t.href)
    return (
      <Link
        key={t.href}
        href={t.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium",
          active ? "text-blue-600" : "text-slate-500",
        )}
      >
        <t.icon className="h-5 w-5" />
        {t.name}
      </Link>
    )
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Main"
    >
      <div className="mx-auto flex max-w-lg items-stretch">
        {tab(TABS[0])}
        {tab(TABS[1])}
        <div className="flex flex-1 items-center justify-center">
          <Link
            href="/dashboard/compose"
            aria-label="Compose a post"
            className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/40 ring-4 ring-white"
          >
            <Plus className="h-6 w-6" />
          </Link>
        </div>
        {tab(TABS[2])}
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium text-slate-500"
        >
          <Menu className="h-5 w-5" />
          Menu
        </button>
      </div>
    </nav>
  )
}
