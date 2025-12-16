import AboutHero from "@/components/about/about-hero"
import TeamSection from "@/components/about/team-section"
import MissionSection from "@/components/about/mission-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us - SocialSync",
  description: "Learn about our mission and the team behind SocialSync.",
}

export default function AboutPage() {
  return (
    <div className="container py-10 space-y-20">
      <AboutHero />
      <MissionSection />
      <TeamSection />
    </div>
  )
}
