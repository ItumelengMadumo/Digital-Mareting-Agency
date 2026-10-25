"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import TrialMenu from "@/components/layout/trial-menu"
import { SITE_NAV } from "@/lib/site"
import { cn } from "@/lib/utils"

export default function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href)

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-slate-200 bg-white transition-shadow",
        scrolled ? "shadow-md" : "shadow-sm",
      )}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="text-2xl font-bold text-slate-900">
            <span className="text-blue-500">Social</span>Sync
          </span>
          <Image src="/site/logo-icon.png" alt="" width={28} height={28} />
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {SITE_NAV.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-500",
                  isActive(item.href) ? "text-blue-500" : "text-slate-600",
                )}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Log in</Link>
          </Button>
          <TrialMenu className="bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30" />
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-slate-700 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 pb-6 lg:hidden">
          <ul className="space-y-1 py-4">
            {SITE_NAV.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-base font-medium hover:bg-slate-100",
                    isActive(item.href) ? "text-blue-500" : "text-slate-700",
                  )}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3">
            <Button variant="outline" asChild>
              <Link href="/auth/login" onClick={() => setOpen(false)}>
                Log in
              </Link>
            </Button>
            <TrialMenu className="w-full" align="center" />
          </div>
        </div>
      )}
    </header>
  )
}
