"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, PhoneOff, Mic, MicOff, Volume2 } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function VoIPDialer() {
  const [formData, setFormData] = useState({
    lead: "",
    phoneNumber: "",
    notes: "",
  })
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [callDuration, setCallDuration] = useState("00:00")

  const handleCall = () => {
    if (!isCallActive) {
      console.log("[v0] Starting call to:", formData.phoneNumber)
      setIsCallActive(true)
      // TODO: Initiate VoIP call
    } else {
      const timelineEntry = {
        type: "call",
        lead: formData.lead,
        phoneNumber: formData.phoneNumber,
        duration: callDuration,
        notes: formData.notes,
        timestamp: new Date().toISOString(),
      }
      console.log("[v0] Ending call and logging to timeline:", timelineEntry)
      setIsCallActive(false)
      setCallDuration("00:00")
      // TODO: End VoIP call and save to lead timeline
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="call-lead">Select Lead</Label>
        <Select
          value={formData.lead}
          onValueChange={(value) => {
            setFormData({ ...formData, lead: value })
            // Auto-populate phone number based on lead selection
            const phoneNumbers: Record<string, string> = {
              "1": "+1 (555) 123-4567",
              "2": "+1 (555) 234-5678",
              "3": "+1 (555) 345-6789",
            }
            setFormData({ ...formData, lead: value, phoneNumber: phoneNumbers[value] || "" })
          }}
          disabled={isCallActive}
        >
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
        <Label htmlFor="phone-number">Phone Number</Label>
        <Input
          id="phone-number"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          disabled={isCallActive}
          className="bg-white border-slate-200"
        />
      </div>

      {isCallActive && (
        <Card className="p-6 bg-slate-50 border-slate-200">
          <div className="text-center space-y-4">
            <div className="text-sm text-slate-600">Call in progress</div>
            <div className="text-3xl font-bold">{callDuration}</div>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full bg-transparent"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full bg-transparent">
                <Volume2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        <Label htmlFor="call-notes">Call Summary & Next Steps</Label>
        <Textarea
          id="call-notes"
          placeholder="Add call summary and next steps after the call..."
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="bg-white border-slate-200"
        />
        <p className="text-xs text-slate-500">
          This will be automatically logged to the lead's timeline when you end the call
        </p>
      </div>

      <div className="flex items-center justify-center pt-4">
        <Button
          onClick={handleCall}
          className={`gap-2 h-12 px-8 rounded-full ${
            isCallActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isCallActive ? (
            <>
              <PhoneOff className="h-5 w-5" />
              End Call
            </>
          ) : (
            <>
              <Phone className="h-5 w-5" />
              Start Call
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
