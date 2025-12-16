"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MessageSquare, FileText, Calendar, Plus, Filter, MessageCircle } from "lucide-react"
import AddActivityDialog from "@/components/dashboard/activity/add-activity-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface LeadTimelineProps {
  leadId: string
}

export default function LeadTimeline({ leadId }: LeadTimelineProps) {
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false)
  const [filterType, setFilterType] = useState("all")

  const activities = [
    {
      id: "1",
      type: "email",
      title: "Sent proposal email",
      description: "Sent detailed proposal with pricing breakdown for Enterprise plan",
      notes: "Follow-up: Schedule call next week to discuss any questions",
      user: "Sarah Johnson",
      timestamp: "2024-01-20 10:30 AM",
      relativeTime: "2 hours ago",
      icon: Mail,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: "2",
      type: "call",
      title: "Phone call - 15 minutes",
      description: "Discussed project requirements, timeline, and budget constraints",
      notes: "Next steps: Send proposal via email. Client mentioned Q1 deadline is critical",
      user: "Sarah Johnson",
      timestamp: "2024-01-19 02:15 PM",
      relativeTime: "1 day ago",
      icon: Phone,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      id: "3",
      type: "whatsapp",
      title: "WhatsApp message",
      description: "Shared product demo video and case studies",
      notes: "Client responded positively, interested in seeing more details",
      user: "Sarah Johnson",
      timestamp: "2024-01-18 04:45 PM",
      relativeTime: "2 days ago",
      icon: MessageCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      id: "4",
      type: "meeting",
      title: "Discovery meeting scheduled",
      description: "Set up meeting for next Tuesday at 2 PM to present full solution",
      notes: "Prepare: Product roadmap, implementation timeline, and pricing options",
      user: "Sarah Johnson",
      timestamp: "2024-01-18 11:00 AM",
      relativeTime: "2 days ago",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      id: "5",
      type: "sms",
      title: "SMS follow-up",
      description: "Quick check-in: 'Hi John, just confirming our meeting tomorrow. Looking forward to it!'",
      notes: "Client confirmed attendance",
      user: "Sarah Johnson",
      timestamp: "2024-01-17 09:20 AM",
      relativeTime: "3 days ago",
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      id: "6",
      type: "email",
      title: "Initial contact email",
      description: "Introduction email explaining our services and requesting discovery call",
      notes: "Client responded within 2 hours - very interested",
      user: "Sarah Johnson",
      timestamp: "2024-01-15 10:00 AM",
      relativeTime: "5 days ago",
      icon: Mail,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: "7",
      type: "note",
      title: "Lead qualification note",
      description: "Lead is interested in enterprise plan with 50+ user licenses",
      notes: "High-value opportunity. Decision maker confirmed. Budget approved for Q1",
      user: "Sarah Johnson",
      timestamp: "2024-01-15 09:30 AM",
      relativeTime: "5 days ago",
      icon: FileText,
      color: "text-slate-600",
      bgColor: "bg-slate-100",
    },
  ]

  const filteredActivities = filterType === "all" ? activities : activities.filter((a) => a.type === filterType)

  return (
    <Card className="bg-white border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Communication Timeline</h3>
            <p className="text-sm text-slate-600">All interactions and notes for this lead</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px] bg-white border-slate-200">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="email">Emails</SelectItem>
                <SelectItem value="call">Calls</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="meeting">Meetings</SelectItem>
                <SelectItem value="note">Notes</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" className="gap-2" onClick={() => setIsAddActivityOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Activity
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No activities found</div>
          ) : (
            filteredActivities.map((activity, index) => (
              <div key={activity.id} className="flex gap-4">
                <div className="relative flex flex-col items-center">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${activity.bgColor}`}>
                    <activity.icon className={`h-5 w-5 ${activity.color}`} />
                  </div>
                  {index !== filteredActivities.length - 1 && <div className="w-px flex-1 bg-slate-200 mt-2" />}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900">{activity.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                    <span className="text-xs text-slate-500">{activity.relativeTime}</span>
                  </div>
                  <p className="text-sm text-slate-700 mb-2">{activity.description}</p>
                  {activity.notes && (
                    <div className="mt-2 p-3 bg-slate-50 rounded-md border border-slate-200">
                      <p className="text-xs font-medium text-slate-600 mb-1">Notes:</p>
                      <p className="text-sm text-slate-700">{activity.notes}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                        {activity.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      {activity.user}
                    </div>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{activity.timestamp}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      <AddActivityDialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen} leadId={leadId} />
    </Card>
  )
}
