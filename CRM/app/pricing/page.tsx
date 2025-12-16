import PricingPlans from "@/components/pricing/pricing-plans"
import PricingHeader from "@/components/pricing/pricing-header"
import PricingFaq from "@/components/pricing/pricing-faq"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing - SocialSync",
  description: "Choose the perfect plan for your social media management needs.",
}

export default function PricingPage() {
  return (
    <div className="container py-10 space-y-16">
      <PricingHeader />
      <PricingPlans />
      <PricingFaq />
    </div>
  )
}
