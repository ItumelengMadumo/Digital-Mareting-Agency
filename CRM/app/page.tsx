import Hero from "@/components/landing/hero"
import Features from "@/components/landing/features"
import Testimonials from "@/components/landing/testimonials"
import CallToAction from "@/components/landing/call-to-action"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SocialSync - All-in-one Social Media Management Platform",
  description:
    "Manage all your social media platforms in one place. Schedule posts, analyze performance, and grow your audience.",
}

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <Features />
      <Testimonials />
      <CallToAction />
    </div>
  )
}
