"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Paperclip } from "lucide-react"

export default function EmailComposer() {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    body: "",
    lead: "",
    notes: "",
  })

  const handleSend = () => {
    const timelineEntry = {
      type: "email",
      lead: formData.lead,
      to: formData.to,
      subject: formData.subject,
      message: formData.body,
      notes: formData.notes,
      timestamp: new Date().toISOString(),
    }
    console.log("[v0] Sending email and logging to timeline:", timelineEntry)
    // TODO: Send email via API and save to lead timeline
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="lead">Select Lead</Label>
        <Select value={formData.lead} onValueChange={(value) => setFormData({ ...formData, lead: value })}>
          <SelectTrigger className="bg-white border-slate-200">
            <SelectValue placeholder="Choose a lead" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">John Smith - Tech Corp</SelectItem>
            <SelectItem value="2">Emily Davis - Startup Co</SelectItem>
            <SelectItem value="3">Michael Brown - Enterprises Inc</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email-to">To</Label>
        <Input
          id="email-to"
          type="email"
          placeholder="recipient@example.com"
          value={formData.to}
          onChange={(e) => setFormData({ ...formData, to: e.target.value })}
          className="bg-white border-slate-200"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email-subject">Subject</Label>
        <Input
          id="email-subject"
          placeholder="Email subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="bg-white border-slate-200"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email-body">Message</Label>
        <Textarea
          id="email-body"
          placeholder="Type your message here..."
          rows={8}
          value={formData.body}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          className="bg-white border-slate-200"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email-notes">Notes (Next Steps/Follow-up)</Label>
        <Textarea
          id="email-notes"
          placeholder="Add notes about this communication for future reference..."
          rows={2}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="bg-white border-slate-200"
        />
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" className="gap-2 bg-transparent">
          <Paperclip className="h-4 w-4" />
          Attach File
        </Button>
        <Button onClick={handleSend} className="gap-2">
          <Send className="h-4 w-4" />
          Send Email
        </Button>
      </div>
    </div>
  )
}
