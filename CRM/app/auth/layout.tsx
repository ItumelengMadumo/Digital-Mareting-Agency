import type React from "react"
import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-white">
      <header className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-bold text-slate-900">
          <span className="text-blue-500">Social</span>Sync
        </Link>
        <Link href="/" className="text-sm font-medium text-slate-600 hover:text-blue-500">
          &larr; Back to website
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-16">{children}</main>
    </div>
  )
}
