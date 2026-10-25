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
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <PricingHeader />
      <PricingPlans />
      <PricingFaq />
    </div>
  )
}
