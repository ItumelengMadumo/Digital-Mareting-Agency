"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Video, Calendar, Link2, Copy, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface VideoConferencingProps {
  preSelectedLead?: {
    id: string
    name: string
    email: string
  }
}

export default function VideoConferencing({ preSelectedLead }: VideoConferencingProps) {
  const [meetingTitle, setMeetingTitle] = useState("")
  const [meetingDate, setMeetingDate] = useState("")
  const [meetingTime, setMeetingTime] = useState("")
  const [duration, setDuration] = useState("30")
  const [agenda, setAgenda] = useState("")
  const [notes, setNotes] = useState("")
  const [meetingLink, setMeetingLink] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)

  const handleScheduleMeeting = async () => {
    setIsScheduling(true)

    // Simulate API call to schedule meeting
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate mock meeting link
    const generatedLink = `https://meet.app/room/${Math.random().toString(36).substring(7)}`
    setMeetingLink(generatedLink)

    // Log to timeline (in real app, this would be an API call)
    console.log("[v0] Video conference scheduled:", {
      leadId: preSelectedLead?.id,
      title: meetingTitle,
      date: meetingDate,
      time: meetingTime,
      duration,
      agenda,
      notes,
      link: generatedLink,
    })

    setIsScheduling(false)
  }

  const handleStartInstantMeeting = async () => {
    setIsScheduling(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate mock meeting link
    const generatedLink = `https://meet.app/room/${Math.random().toString(36).substring(7)}`
    setMeetingLink(generatedLink)

    // Log to timeline
    console.log("[v0] Instant video conference started:", {
      leadId: preSelectedLead?.id,
      notes,
      link: generatedLink,
    })

    setIsScheduling(false)
  }

  const handleCopyLink = () => {
    if (meetingLink) {
      navigator.clipboard.writeText(meetingLink)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-4">
      {preSelectedLead && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-900">Meeting With</CardTitle>
            <CardDescription className="text-blue-700">{preSelectedLead.name}</CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-4">
        {/* Instant Meeting */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Video className="h-5 w-5 text-blue-600" />
              Start Instant Meeting
            </CardTitle>
            <CardDescription>Begin a video call immediately</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="instant-notes">Meeting Notes (Optional)</Label>
              <Textarea
                id="instant-notes"
                placeholder="Quick notes about this meeting..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1.5 bg-white border-slate-300"
                rows={2}
              />
            </div>
            <Button
              onClick={handleStartInstantMeeting}
              disabled={isScheduling}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Video className="mr-2 h-4 w-4" />
              {isScheduling ? "Starting..." : "Start Instant Meeting"}
            </Button>
          </CardContent>
        </Card>

        {/* Schedule Meeting */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Schedule Meeting
            </CardTitle>
            <CardDescription>Plan a video call for later</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="meeting-title">Meeting Title</Label>
              <Input
                id="meeting-title"
                placeholder="e.g., Product Demo, Follow-up Discussion"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                className="mt-1.5 bg-white border-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="meeting-date">Date</Label>
                <Input
                  id="meeting-date"
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="mt-1.5 bg-white border-slate-300"
                />
              </div>
              <div>
                <Label htmlFor="meeting-time">Time</Label>
                <Input
                  id="meeting-time"
                  type="time"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="mt-1.5 bg-white border-slate-300"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="duration">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration" className="mt-1.5 bg-white border-slate-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="agenda">Agenda</Label>
              <Textarea
                id="agenda"
                placeholder="What will you discuss in this meeting?"
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                className="mt-1.5 bg-white border-slate-300"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="scheduled-notes">Additional Notes</Label>
              <Textarea
                id="scheduled-notes"
                placeholder="Any additional context or preparation notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1.5 bg-white border-slate-300"
                rows={2}
              />
            </div>

            <Button
              onClick={handleScheduleMeeting}
              disabled={!meetingTitle || !meetingDate || !meetingTime || isScheduling}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {isScheduling ? "Scheduling..." : "Schedule Meeting"}
            </Button>
          </CardContent>
        </Card>

        {/* Meeting Link */}
        {meetingLink && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-base text-green-900">Meeting Link Generated</CardTitle>
              <CardDescription className="text-green-700">
                Share this link with the lead to join the meeting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input value={meetingLink} readOnly className="bg-white border-green-300 text-sm" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  className="border-green-300 hover:bg-green-100 bg-transparent"
                >
                  {isCopied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full border-green-300 text-green-700 hover:bg-green-100 bg-transparent"
                onClick={() => window.open(meetingLink, "_blank")}
              >
                <Link2 className="mr-2 h-4 w-4" />
                Open Meeting Room
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
