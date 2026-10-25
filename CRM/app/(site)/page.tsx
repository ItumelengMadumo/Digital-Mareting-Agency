import type { Metadata } from "next"
import Banner from "@/components/site/home/banner"
import Features from "@/components/site/home/features"
import About from "@/components/site/home/about"
import Services from "@/components/site/home/services"
import Stories from "@/components/site/home/stories"
import ContactSection from "@/components/site/home/contact-section"

export const metadata: Metadata = {
  title: "SocialSync - Post once, go live everywhere",
  description:
    "Publish to Instagram, Facebook, TikTok and YouTube in one go, with captions shaped for each platform, scheduling and clear publish status.",
}

export default function Home() {
  return (
    <>
      <Banner />
      <Features />
      <About />
      <Services />
      <Stories />
      <ContactSection />
    </>
  )
}
