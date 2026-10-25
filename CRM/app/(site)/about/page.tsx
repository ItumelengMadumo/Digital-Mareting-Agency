import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import AboutHero from "@/components/about/about-hero"
import MissionSection from "@/components/about/mission-section"

export const metadata: Metadata = {
  title: "About Us - SocialSync",
  description: "Learn about our mission and the team behind SocialSync.",
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <MissionSection />
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white">Want to try it with your own content?</h2>
          <p className="mt-4 text-white/80">Join the free pilot, or have a look around the demo first.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-br from-blue-500 to-blue-600" asChild>
              <Link href="/auth/register">Start free trial</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/demo">View live demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
