import { Mail, MapPin, Phone } from "lucide-react"
import SectionHeading from "@/components/site/section-heading"
import ContactForm from "@/components/site/contact-form"
import { SITE } from "@/lib/site"

export function ContactDetails({ dark }: { dark?: boolean }) {
  const item = dark ? "text-white/80 hover:text-blue-300" : "text-slate-600 hover:text-blue-500"
  return (
    <ul className="space-y-5">
      <li className="flex items-center gap-3">
        <Mail className="h-5 w-5 text-blue-400" />
        <a href={`mailto:${SITE.email}`} className={item}>
          {SITE.email}
        </a>
      </li>
      {SITE.phone && (
        <li className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-blue-400" />
          <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className={item}>
            {SITE.phone}
          </a>
        </li>
      )}
      <li className="flex items-center gap-3">
        <MapPin className="h-5 w-5 text-blue-400" />
        <span className={dark ? "text-white/80" : "text-slate-600"}>{SITE.location}</span>
      </li>
    </ul>
  )
}

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="scroll-mt-20 bg-gradient-to-br from-slate-900 to-slate-800 py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Get started" align="center" dark>
          Ready to <span>transform</span> your <em>digital presence?</em>
        </SectionHeading>
        <div className="mt-12 grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <ContactForm dark />
          </div>
          <ContactDetails dark />
        </div>
      </div>
    </section>
  )
}
