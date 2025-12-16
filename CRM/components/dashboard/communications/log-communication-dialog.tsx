"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, MessageSquare, Phone, MessageCircle, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LogCommunicationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function LogCommunicationDialog({ open, onOpenChange }: LogCommunicationDialogProps) {
  const [activeTab, setActiveTab] = useState("call")
  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [company, setCompany] = useState("")
  const [outcome, setOutcome] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = () => {
    console.log("[v0] Logging communication:", {
      type: activeTab,
      contactName,
      contactEmail,
      contactPhone,
      company,
      outcome,
      notes,
    })
    // Reset form
    setContactName("")
    setContactEmail("")
    setContactPhone("")
    setCompany("")
    setOutcome("")
    setNotes("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Log Communication Activity</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Contact Information - Common for all types */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name *</Label>
              <Input
                id="contactName"
                placeholder="John Smith"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="Tech Corp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone Number</Label>
              <Input
                id="contactPhone"
                placeholder="+1 234 567 8900"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email Address</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="john@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          {/* Communication Type Selection */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 bg-slate-100">
              <TabsTrigger value="call" className="gap-2">
                <Phone className="h-4 w-4" />
                Call
              </TabsTrigger>
              <TabsTrigger value="email" className="gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="sms" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                SMS
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </TabsTrigger>
              <TabsTrigger value="video" className="gap-2">
                <Video className="h-4 w-4" />
                Video
              </TabsTrigger>
            </TabsList>

            {/* Call Specific Fields */}
            <TabsContent value="call" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="callDuration">Call Duration</Label>
                <Input id="callDuration" placeholder="15 minutes" className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="callOutcome">Call Outcome *</Label>
                <Select value={outcome} onValueChange={setOutcome}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select outcome" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interested">Interested - Follow up</SelectItem>
                    <SelectItem value="not-interested">Not interested</SelectItem>
                    <SelectItem value="callback">Request callback</SelectItem>
                    <SelectItem value="no-answer">No answer</SelectItem>
                    <SelectItem value="voicemail">Left voicemail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* Email Specific Fields */}
            <TabsContent value="email" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="emailSubject">Email Subject</Label>
                <Input id="emailSubject" placeholder="Product inquiry follow-up" className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailOutcome">Email Status *</Label>
                <Select value={outcome} onValueChange={setOutcome}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sent">Sent - Awaiting response</SelectItem>
                    <SelectItem value="replied">Received reply</SelectItem>
                    <SelectItem value="bounced">Bounced</SelectItem>
                    <SelectItem value="opened">Opened - No reply yet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* SMS Specific Fields */}
            <TabsContent value="sms" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="smsOutcome">SMS Status *</Label>
                <Select value={outcome} onValueChange={setOutcome}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sent">Sent - Awaiting response</SelectItem>
                    <SelectItem value="replied">Received reply</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="failed">Failed to deliver</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* WhatsApp Specific Fields */}
            <TabsContent value="whatsapp" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="whatsappOutcome">WhatsApp Status *</Label>
                <Select value={outcome} onValueChange={setOutcome}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sent">Sent - Awaiting response</SelectItem>
                    <SelectItem value="replied">Received reply</SelectItem>
                    <SelectItem value="read">Read - No reply yet</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* Video Specific Fields */}
            <TabsContent value="video" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="videoDuration">Meeting Duration</Label>
                <Input id="videoDuration" placeholder="30 minutes" className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="videoOutcome">Meeting Outcome *</Label>
                <Select value={outcome} onValueChange={setOutcome}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select outcome" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed successfully</SelectItem>
                    <SelectItem value="interested">Very interested</SelectItem>
                    <SelectItem value="needs-followup">Needs follow-up</SelectItem>
                    <SelectItem value="no-show">Contact didn't show</SelectItem>
                    <SelectItem value="rescheduled">Rescheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>

          {/* Common Notes Field */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes & Next Steps *</Label>
            <Textarea
              id="notes"
              placeholder="Add detailed notes about the conversation and any follow-up actions needed..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[120px] bg-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!contactName || !outcome || !notes}>
              Log Communication
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
