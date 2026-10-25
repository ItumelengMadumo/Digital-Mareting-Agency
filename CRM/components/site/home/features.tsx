const steps = [
  {
    title: "Connect accounts",
    text: "Link Instagram, a Facebook Page, TikTok and YouTube once. We keep the connections safe and tell you when one needs reconnecting.",
  },
  {
    title: "Create content",
    text: "Write one caption and add your photo or video. Each platform gets its own tab, preview and plain-language checks.",
  },
  {
    title: "Schedule & publish",
    text: "Post now or pick a time. Your post goes out on every platform you chose, with no copy-pasting between apps.",
  },
  {
    title: "Track & grow",
    text: "See Live, Publishing or Failed per platform, open the live post, and retry a failed one in a click.",
  },
]

const rings = [
  { value: 4, max: 4, label: "Platforms per post", display: "4" },
  { value: 1, max: 1, label: "Caption to write", display: "1" },
  { value: 5, max: 10, label: "Minutes to set up", display: "5" },
  { value: 100, max: 100, label: "Status visibility", display: "100%" },
]

function Ring({ value, max, label, display }: (typeof rings)[number]) {
  const r = 54
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={r} fill="none" strokeWidth="8" className="stroke-slate-200" />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - value / max)}
            className="stroke-blue-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold text-slate-900">{display}</span>
        </div>
      </div>
      <span className="mt-3 text-center text-sm text-slate-500">{label}</span>
    </div>
  )
}

export default function Features() {
  return (
    <section id="features" className="scroll-mt-20 bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-lg font-bold text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h4 className="mt-5 text-lg font-semibold text-slate-800">{step.title}</h4>
              <div className="my-4 h-0.5 w-12 bg-gradient-to-r from-blue-500 to-green-500" />
              <p className="text-sm leading-relaxed text-slate-500">{step.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {rings.map((ring) => (
            <Ring key={ring.label} {...ring} />
          ))}
        </div>
      </div>
    </section>
  )
}
