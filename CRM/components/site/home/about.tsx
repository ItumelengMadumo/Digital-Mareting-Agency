import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import SectionHeading from "@/components/site/section-heading"

const facts = [
  { value: "4", label: "platforms supported" },
  { value: "1", label: "post, many places" },
  { value: "0", label: "copy-pasting" },
]

export default function About() {
  return (
    <section id="about" className="scroll-mt-20 bg-slate-50 py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Image
          src="/site/about-left-image.png"
          alt="Illustration of a team planning content"
          width={600}
          height={500}
          className="mx-auto h-auto w-full max-w-lg"
        />
        <div>
          <SectionHeading eyebrow="About us">
            Your complete <em>social media</em> &amp; <span>CRM solution</span>
          </SectionHeading>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {facts.map((f) => (
              <div key={f.label}>
                <h4 className="text-3xl font-bold text-blue-500">{f.value}</h4>
                <h6 className="text-sm text-slate-600">{f.label}</h6>
              </div>
            ))}
          </div>
          <p className="mt-6 leading-relaxed text-slate-600">
            SocialSync combines cross-platform publishing with a simple CRM. Whether you&apos;re a creator, a growing brand
            or a business, you can plan content, publish it everywhere from one place, and keep track of the people who
            reach out, all in one app.
          </p>
          <Button className="mt-8 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30" size="lg" asChild>
            <Link href="/about">More about us</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
