import Image from "next/image"
import SectionHeading from "@/components/site/section-heading"

const services = [
  {
    icon: "/site/service-icon-01.png",
    title: "Multi-platform publishing",
    text: "Publish to Instagram, Facebook, TikTok and YouTube at once, with a caption shaped for each.",
  },
  {
    icon: "/site/service-icon-02.png",
    title: "Content calendar",
    text: "See everything that is scheduled and live in month and week views.",
  },
  {
    icon: "/site/service-icon-03.png",
    title: "AI caption rewrites",
    text: "One click turns your caption into a version that fits each platform's style and limits.",
  },
  {
    icon: "/site/service-icon-03.png",
    title: "Lead management",
    text: "Keep track of enquiries and brand-deal leads in a built-in CRM, from new to won.",
  },
  {
    icon: "/site/service-icon-01.png",
    title: "Publish status & retry",
    text: "Live, Publishing or Failed per platform, with the reason in plain words and a retry button.",
  },
  {
    icon: "/site/service-icon-02.png",
    title: "Workspaces & teams",
    text: "Everything lives in your workspace, ready for team members and client brands as you grow.",
  },
]

export default function Services() {
  return (
    <section id="services" className="scroll-mt-20 bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Platform features" align="center">
          Everything you need to <span>grow</span> your <em>digital presence</em>
        </SectionHeading>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <Image src={s.icon} alt="" width={64} height={64} className="h-16 w-16 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-semibold text-slate-800">{s.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
