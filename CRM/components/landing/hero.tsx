"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import TrialMenu from "@/components/layout/trial-menu"
import { cn } from "@/lib/utils"

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="relative isolate overflow-hidden py-24 sm:py-32 bg-gradient-to-b from-white to-slate-50">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(56,189,248,0.08),rgba(56,189,248,0))]" />
      <div className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] shadow-xl shadow-blue-600/5 ring-1 ring-blue-500/5 md:-mr-80 lg:-mr-96" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
          <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl lg:col-span-2 xl:col-auto">
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
                Manage all your social media
              </span>
              <span className="block">in one powerful platform</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              SocialSync helps you seamlessly create, schedule, and publish content across all your social media
              accounts. Save time, increase engagement, and grow your presence with our all-in-one solution.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <TrialMenu size="lg" align="start" />
              <Link href="/pricing" className="text-sm font-semibold leading-6">
                View pricing <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="mt-10 w-full max-w-lg lg:mt-0 lg:ml-auto lg:mr-0 lg:max-w-none lg:flex-none xl:ml-0">
            <div className="relative aspect-square w-full max-w-lg rounded-2xl lg:max-w-none">
              <div
                className={cn(
                  "w-full h-full rounded-2xl bg-gradient-to-br from-blue-500 to-teal-400 p-4 shadow-xl",
                  "animate-float", // Aceternity UI style floating animation
                )}
              >
                <div className="h-full w-full bg-background/90 backdrop-blur-sm rounded-xl p-6 flex flex-col gap-4">
                  <div className="flex justify-between">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <div className="h-6 w-6 rounded-full bg-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-20 rounded-full bg-muted" />
                      <div className="h-2 w-10 rounded-full bg-muted" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="aspect-video rounded-lg bg-gradient-to-br from-blue-100 to-teal-100 p-2 flex items-center justify-center"
                      >
                        <div className="h-4 w-8 rounded-full bg-blue-500/40" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-8 rounded bg-muted flex items-center justify-center">
                        <div className="h-2 w-10 rounded-full bg-muted-foreground/30" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
