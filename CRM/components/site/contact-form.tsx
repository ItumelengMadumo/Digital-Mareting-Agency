"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Status = "idle" | "sending" | "sent" | "error"

/** Contact form shared by the home page (dark) and the contact page (light). Posts to /api/contact. */
export default function ContactForm({ dark }: { dark?: boolean }) {
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setStatus("sending")
    setError("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Something went wrong. Please try again.")
      }
      form.reset()
      setStatus("sent")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
      setStatus("error")
    }
  }

  const field = cn(
    "w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30",
    dark ? "border-white/20 bg-white/10 text-white placeholder:text-white/50" : "border-slate-200 bg-white text-slate-900",
  )

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <input name="firstName" placeholder="Name" required autoComplete="given-name" className={field} />
      <input name="lastName" placeholder="Surname" required autoComplete="family-name" className={field} />
      <input name="email" type="email" placeholder="Your email" required autoComplete="email" className={field} />
      <input name="subject" placeholder="Subject" className={field} />
      <textarea name="message" placeholder="Message" required rows={5} className={cn(field, "sm:col-span-2")} />
      <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:items-center sm:gap-4">
        <Button
          type="submit"
          size="lg"
          disabled={status === "sending"}
          className="bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30"
        >
          {status === "sending" ? "Sending..." : "Send message"}
        </Button>
        {status === "sent" && (
          <p className={cn("text-sm", dark ? "text-green-400" : "text-green-600")}>Thanks! We&apos;ll be in touch soon.</p>
        )}
        {status === "error" && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </form>
  )
}
