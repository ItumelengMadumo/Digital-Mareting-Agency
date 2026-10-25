import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import TrialMenu from "@/components/layout/trial-menu"

const stats = [
  { label: "Platforms", value: "4 in one go" },
  { label: "Setup", value: "~5 minutes" },
  { label: "Pilot", value: "Free" },
]

export default function Banner() {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-white">
      <Image
        src="/site/banner-dec-left.png"
        alt=""
        width={152}
        height={155}
        className="pointer-events-none absolute left-0 top-24 hidden opacity-70 md:block"
      />
      <Image
        src="/site/banner-dec-right.png"
        alt=""
        width={153}
        height={110}
        className="pointer-events-none absolute right-0 top-10 hidden opacity-70 md:block"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-md sm:p-4">
                <h6 className="text-xs font-medium text-slate-500 sm:text-sm">{s.label}:</h6>
                <h4 className="mt-1 text-sm font-bold text-blue-500 sm:text-lg">{s.value}</h4>
              </div>
            ))}
          </div>
          <h1 className="mt-8 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            Post once. Go live on <span className="text-blue-500">Instagram, Facebook, TikTok</span> and{" "}
            <span className="text-green-500">YouTube</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-600">
            SocialSync shapes your caption for each platform, publishes now or on schedule, and shows you exactly what went
            live, with one click to retry anything that didn&apos;t.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <TrialMenu size="lg" align="start" className="bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30" />
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">View live demo</Link>
            </Button>
          </div>
        </div>
        <div className="animate-in fade-in slide-in-from-right-8 duration-1000">
          <Image
            src="/site/banner-right-image.png"
            alt="Illustration of content being published across social platforms"
            width={640}
            height={560}
            priority
            className="mx-auto h-auto w-full max-w-xl"
          />
        </div>
      </div>
    </section>
  )
}
