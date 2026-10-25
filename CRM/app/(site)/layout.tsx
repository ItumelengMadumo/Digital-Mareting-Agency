import type React from "react"
import { Open_Sans } from "next/font/google"
import SiteHeader from "@/components/site/site-header"
import SiteFooter from "@/components/site/site-footer"
import { cn } from "@/lib/utils"

const openSans = Open_Sans({ subsets: ["latin"], weight: ["300", "400", "600", "700", "800"] })

// Public website: landing, pricing, about, contact and demo. The app lives under /dashboard.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn(openSans.className, "flex min-h-screen flex-col bg-white text-slate-900")}>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
