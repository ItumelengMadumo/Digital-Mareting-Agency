"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send } from "lucide-react"

export default function SMSComposer() {
  const [formData, setFormData] = useState({
    lead: "",
    message: "",
    notes: "",
  })

  const characterCount = formData.message.length
  const messageCount = Math.ceil(characterCount / 160) || 1

  const handleSend = () => {
    const timelineEntry = {
      type: "sms",
      lead: formData.lead,
      message: formData.message,
      notes: formData.notes,
      timestamp: new Date().toISOString(),
    }
    console.log("[v0] Sending SMS and logging to timeline:", timelineEntry)
    // TODO: Send SMS via API and save to lead timeline
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="sms-lead">Select Lead</Label>
        <Select value={formData.lead} onValueChange={(value) => setFormData({ ...formData, lead: value })}>
          <SelectTrigger className="bg-white border-slate-200">
            <SelectValue placeholder="Choose a lead" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">John Smith - +1 (555) 123-4567</SelectItem>
            <SelectItem value="2">Emily Davis - +1 (555) 234-5678</SelectItem>
            <SelectItem value="3">Michael Brown - +1 (555) 345-6789</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sms-message">Message</Label>
        <Textarea
          id="sms-message"
          placeholder="Type your SMS message here..."
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="bg-white border-slate-200"
        />
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>
            {characterCount} characters • {messageCount} SMS
          </span>
          <span className={characterCount > 160 ? "text-orange-600" : ""}>
            {160 - (characterCount % 160)} characters remaining in this segment
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sms-notes">Notes (Next Steps/Follow-up)</Label>
        <Textarea
          id="sms-notes"
          placeholder="Add notes about this communication for future reference..."
          rows={2}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="bg-white border-slate-200"
        />
      </div>

      <div className="flex items-center justify-end pt-4">
        {/* Disabled until a provider is connected: nothing would actually be sent. */}
        <Button onClick={handleSend} variant="outline" className="gap-2" disabled title="SMS isn't connected yet">
          <Send className="h-4 w-4" />
          Send SMS (not connected)
        </Button>
      </div>
    </div>
  )
}
