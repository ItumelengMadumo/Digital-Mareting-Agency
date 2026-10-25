import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import SectionHeading from "@/components/site/section-heading"

// Real client stories replace these once the pilot has run.
const items = [
  { image: "/site/portfolio-01.jpg", title: "Creators", tag: "Beauty, food, fitness" },
  { image: "/site/portfolio-05.jpg", title: "Local businesses", tag: "Shops, studios, services" },
]

export default function Stories() {
  return (
    <section id="portfolio" className="scroll-mt-20 bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Who it's for" className="max-w-xl">
          Built for people who <em>grow</em> their <span>digital presence</span>
        </SectionHeading>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="group relative overflow-hidden rounded-2xl">
              <Image
                src={item.image}
                alt=""
                width={600}
                height={450}
                className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-blue-600/90 via-blue-500/40 to-transparent p-6">
                <h4 className="text-xl font-semibold text-white">{item.title}</h4>
                <span className="text-sm text-white/80">{item.tag}</span>
              </div>
            </div>
          ))}
          <div className="flex h-72 flex-col justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white">
            <h4 className="text-2xl font-bold">Pilot spots open</h4>
            <p className="mt-3 text-white/85">
              We&apos;re onboarding a small group of South African creators for a free 4-week pilot.
            </p>
            <Button variant="secondary" className="mt-6 self-start" asChild>
              <Link href="/auth/register">Join the pilot</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
