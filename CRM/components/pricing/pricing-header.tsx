import SectionHeading from "@/components/site/section-heading"

export default function PricingHeader() {
  return (
    <div>
      <SectionHeading eyebrow="Pricing" align="center">
        Simple plans that <span>grow</span> with <em>you</em>
      </SectionHeading>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-slate-600">
        Every plan includes cross-platform publishing and scheduling. The pilot is free; paid plans start after it.
      </p>
    </div>
  )
}
