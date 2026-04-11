"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const frequencies = [
  { value: "monthly", label: "Monthly", priceSuffix: "/month" },
  { value: "annually", label: "Annually", priceSuffix: "/year" },
]

const tiers = [
  {
    name: "Individual",
    id: "individual",
    href: "#",
    price: { monthly: "$15", annually: "$144" },
    description: "For solo creators managing their own presence.",
    features: [
      "1 workspace",
      "Up to 3 social accounts",
      "30 scheduled posts per month",
      "Basic analytics & reporting",
      "UTM link builder",
      "Email support",
    ],
    mostPopular: false,
  },
  {
    name: "Freelancer",
    id: "freelancer",
    href: "#",
    price: { monthly: "$35", annually: "$336" },
    description: "For freelancers managing multiple client accounts.",
    features: [
      "Up to 5 client workspaces",
      "Up to 10 social accounts",
      "Unlimited scheduled posts",
      "Campaign management",
      "Content calendar & variants",
      "Lead tracking & CRM",
      "Priority support",
    ],
    mostPopular: true,
  },
  {
    name: "Business",
    id: "business",
    href: "#",
    price: { monthly: "$79", annually: "$756" },
    description: "For growing businesses with dedicated marketing teams.",
    features: [
      "Up to 15 client workspaces",
      "Up to 25 social accounts",
      "Multi-channel campaigns",
      "Automation engine",
      "SEO & PPC tracking",
      "Influencer & affiliate management",
      "Tracking & attribution",
      "Dedicated account manager",
    ],
    mostPopular: false,
  },
  {
    name: "Agency",
    id: "agency",
    href: "#",
    price: { monthly: "$149", annually: "$1,428" },
    description: "For agencies managing portfolios of clients at scale.",
    features: [
      "Unlimited client workspaces",
      "Unlimited social accounts",
      "White-label reports",
      "Offline channel tracking",
      "Advanced automation rules",
      "Team roles & permissions",
      "API access",
      "24/7 priority support",
      "Custom integrations",
    ],
    mostPopular: false,
  },
]

export default function PricingPlans() {
  const [frequency, setFrequency] = useState(frequencies[0])

  return (
    <div>
      <div className="flex justify-center mb-8">
        <div className="relative flex rounded-full bg-muted p-1">
          {frequencies.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                "relative w-32 rounded-full py-2 text-sm font-semibold transition-all",
                option.value === frequency.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted/80",
              )}
              onClick={() => setFrequency(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-4">
        {tiers.map((tier) => (
          <Card key={tier.id} className={cn("flex flex-col", tier.mostPopular ? "border-blue-500 shadow-md" : "")}>
            <CardHeader>
              {tier.mostPopular && (
                <div className="rounded-full bg-blue-500 px-3 py-1 text-center text-xs font-semibold leading-5 text-white absolute -top-3 right-6">
                  Most Popular
                </div>
              )}
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="mt-4">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight">
                    {tier.price[frequency.value as keyof typeof tier.price]}
                  </span>
                  <span className="ml-1 text-sm font-semibold text-muted-foreground">{frequency.priceSuffix}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckIcon className="h-4 w-4 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button className={cn("w-full", tier.mostPopular ? "bg-blue-500 hover:bg-blue-600" : "")}>
                Get started
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
