"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Phone, Mail, MessageSquare, Calendar, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterUser, setFilterUser] = useState("all")

  // Mock all activities across all leads
  const allActivities = [
    {
      id: "1",
      type: "email",
      title: "Sent proposal email",
      description: "Sent detailed proposal with pricing breakdown",
      lead: "John Smith",
      leadCompany: "Tech Corp",
      user: "Sarah Johnson",
      timestamp: "2 hours ago",
      icon: Mail,
      outcome: "positive",
    },
    {
      id: "2",
      type: "call",
      title: "Phone call - 15 minutes",
      description: "Discussed project requirements and timeline",
      lead: "Emily Davis",
      leadCompany: "Startup Co",
      user: "Mike Wilson",
      timestamp: "4 hours ago",
      icon: Phone,
      outcome: "positive",
    },
    {
      id: "3",
      type: "whatsapp",
      title: "WhatsApp follow-up",
      description: "Quick check-in message sent",
      lead: "Michael Brown",
      leadCompany: "Enterprises Inc",
      user: "Sarah Johnson",
      timestamp: "1 day ago",
      icon: MessageCircle,
      outcome: "neutral",
    },
    {
      id: "4",
      type: "meeting",
      title: "Discovery meeting",
      description: "Initial consultation and needs assessment",
      lead: "John Smith",
      leadCompany: "Tech Corp",
      user: "Jessica Lee",
      timestamp: "2 days ago",
      icon: Calendar,
      outcome: "positive",
    },
    {
      id: "5",
      type: "sms",
      title: "SMS reminder",
      description: "Sent meeting reminder",
      lead: "Emily Davis",
      leadCompany: "Startup Co",
      user: "Mike Wilson",
      timestamp: "2 days ago",
      icon: MessageSquare,
      outcome: "neutral",
    },
  ]

  const filteredActivities = allActivities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.lead.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === "all" || activity.type === filterType
    const matchesUser = filterUser === "all" || activity.user === filterUser

    return matchesSearch && matchesType && matchesUser
  })

  const getOutcomeColor = (outcome: string) => {
    const colors: Record<string, string> = {
      positive: "bg-green-100 text-green-700 border-green-200",
      neutral: "bg-slate-100 text-slate-700 border-slate-200",
      negative: "bg-red-100 text-red-700 border-red-200",
      "follow-up": "bg-orange-100 text-orange-700 border-orange-200",
    }
    return colors[outcome] || colors.neutral
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Activities</h1>
        <p className="text-muted-foreground mt-1">View all team activities across all leads</p>
      </div>

      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
          <CardDescription>Track every interaction with your leads</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-slate-200"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[160px] bg-white border-slate-200">
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="call">Calls</SelectItem>
                <SelectItem value="email">Emails</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="meeting">Meetings</SelectItem>
                <SelectItem value="note">Notes</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger className="w-[160px] bg-white border-slate-200">
                <SelectValue placeholder="Team Member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Team</SelectItem>
                <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                <SelectItem value="Mike Wilson">Mike Wilson</SelectItem>
                <SelectItem value="Jessica Lee">Jessica Lee</SelectItem>
                <SelectItem value="David Chen">David Chen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No activities found</div>
            ) : (
              filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                    <activity.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                                {activity.user
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-slate-600">{activity.user}</span>
                          </div>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-600">
                            {activity.lead} ({activity.leadCompany})
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{activity.timestamp}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className={getOutcomeColor(activity.outcome)}>
                        {activity.outcome}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
