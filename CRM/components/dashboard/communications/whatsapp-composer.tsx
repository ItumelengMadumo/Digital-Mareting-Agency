"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, ImageIcon, Paperclip } from "lucide-react"

export default function WhatsAppComposer() {
  const [formData, setFormData] = useState({
    lead: "",
    message: "",
    notes: "",
  })

  const handleSend = () => {
    const timelineEntry = {
      type: "whatsapp",
      lead: formData.lead,
      message: formData.message,
      notes: formData.notes,
      timestamp: new Date().toISOString(),
    }
    console.log("[v0] Sending WhatsApp message and logging to timeline:", timelineEntry)
    // TODO: Send WhatsApp message via API and save to lead timeline
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="whatsapp-lead">Select Lead</Label>
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
        <Label htmlFor="whatsapp-message">Message</Label>
        <Textarea
          id="whatsapp-message"
          placeholder="Type your WhatsApp message here..."
          rows={8}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="bg-white border-slate-200"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsapp-notes">Notes (Next Steps/Follow-up)</Label>
        <Textarea
          id="whatsapp-notes"
          placeholder="Add notes about this communication for future reference..."
          rows={2}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="bg-white border-slate-200"
        />
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <ImageIcon className="h-4 w-4" />
            Image
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Paperclip className="h-4 w-4" />
            File
          </Button>
        </div>
        {/* Disabled until a provider is connected: nothing would actually be sent. */}
        <Button onClick={handleSend} variant="outline" className="gap-2" disabled title="WhatsApp isn't connected yet">
          <Send className="h-4 w-4" />
          Send (not connected)
        </Button>
      </div>
    </div>
  )
}
