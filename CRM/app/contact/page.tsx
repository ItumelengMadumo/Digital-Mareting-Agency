import ContactForm from "@/components/contact/contact-form"
import ContactInfo from "@/components/contact/contact-info"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us - SocialSync",
  description: "Get in touch with our team for any questions or support.",
}

export default function ContactPage() {
  return (
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <ContactInfo />
        <ContactForm />
      </div>
    </div>
  )
}
