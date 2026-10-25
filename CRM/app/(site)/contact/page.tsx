import type { Metadata } from "next"
import SectionHeading from "@/components/site/section-heading"
import ContactForm from "@/components/site/contact-form"
import { ContactDetails } from "@/components/site/home/contact-section"

export const metadata: Metadata = {
  title: "Contact - SocialSync",
  description: "Get in touch with the SocialSync team.",
}

export default function ContactPage() {
  return (
    <section className="bg-gradient-to-br from-slate-50 to-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Contact us" align="center">
          Let&apos;s talk about your <em>content</em>
        </SectionHeading>
        <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">
          Questions, pilot interest or feedback: send us a message and we&apos;ll get back to you.
        </p>
        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 sm:p-8">
            <ContactForm />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="mb-6 text-lg font-semibold text-slate-800">Contact information</h3>
            <ContactDetails />
          </div>
        </div>
      </div>
    </section>
  )
}
