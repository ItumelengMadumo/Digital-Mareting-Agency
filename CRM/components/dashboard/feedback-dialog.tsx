"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Bug, CheckCircle2, HelpCircle, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useWorkspace } from "@/lib/workspace-context"
import { cn } from "@/lib/utils"

const KINDS = [
  { id: "bug", label: "Something's broken", icon: Bug },
  { id: "idea", label: "An idea", icon: Lightbulb },
  { id: "question", label: "A question", icon: HelpCircle },
] as const

type Kind = (typeof KINDS)[number]["id"]

/** In-app feedback for pilot users. Saved to the Feedback table with the page it was sent from. */
export default function FeedbackDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const pathname = usePathname()
  const { workspace, workspaceLoaded } = useWorkspace()
  const [kind, setKind] = useState<Kind>("bug")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")
  const [error, setError] = useState("")

  const reset = () => {
    setKind("bug")
    setMessage("")
    setStatus("idle")
    setError("")
  }

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next)
    if (!next) setTimeout(reset, 200)
  }

  const submit = async () => {
    if (!workspace || !workspaceLoaded) return
    setStatus("sending")
    setError("")
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId: workspace.id, kind, message, page: pathname }),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Couldn't send that. Please try again.")
      setStatus("sent")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send that. Please try again.")
      setStatus("idle")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {status === "sent" ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
            <DialogTitle>Thanks, we got it</DialogTitle>
            <DialogDescription>We read every message during the pilot and will follow up if we need more detail.</DialogDescription>
            <Button className="mt-2" onClick={() => handleOpenChange(false)}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Help & feedback</DialogTitle>
              <DialogDescription>Tell us what&apos;s not working or what you&apos;d like to see.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {KINDS.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => setKind(k.id)}
                    aria-pressed={kind === k.id}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 text-xs font-medium",
                      kind === k.id ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50",
                    )}
                  >
                    <k.icon className="h-5 w-5" />
                    {k.label}
                  </button>
                ))}
              </div>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                maxLength={5000}
                placeholder={
                  kind === "bug" ? "What happened, and what did you expect?" : kind === "idea" ? "What would make SocialSync better for you?" : "What would you like to know?"
                }
              />
              <p className="text-xs text-slate-500">We&apos;ll include the page you&apos;re on ({pathname}) so we can find the problem.</p>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={submit}
                disabled={message.trim().length < 3 || status === "sending"}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {status === "sending" ? "Sending..." : "Send feedback"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
