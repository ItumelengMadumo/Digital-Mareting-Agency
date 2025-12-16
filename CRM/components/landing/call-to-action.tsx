import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CallToAction() {
  return (
    <div className="bg-card">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to boost your social media presence?
            <br />
            Start with SocialSync today.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Join thousands of content creators, influencers, and businesses who use SocialSync to streamline their
            social media management.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/auth/register">
              <Button size="lg">Get started for free</Button>
            </Link>
            <Link href="/contact" className="text-sm font-semibold leading-6">
              Contact sales <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
