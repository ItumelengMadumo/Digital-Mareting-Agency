import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  eyebrow: string
  children: React.ReactNode
  align?: "left" | "center"
  dark?: boolean
  className?: string
}

/** Template-style heading: small blue eyebrow, bold title. Use <em> for blue and <span> for green words. */
export default function SectionHeading({ eyebrow, children, align = "left", dark, className }: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "mx-auto max-w-2xl text-center", className)}>
      <h6 className={cn("text-sm font-semibold uppercase tracking-wider", dark ? "text-blue-400" : "text-blue-500")}>
        {eyebrow}
      </h6>
      <h2
        className={cn(
          "mt-3 text-3xl font-bold leading-tight sm:text-4xl [&_em]:not-italic [&_em]:text-blue-500 [&_span]:text-green-500",
          dark ? "text-white" : "text-slate-900",
        )}
      >
        {children}
      </h2>
    </div>
  )
}
