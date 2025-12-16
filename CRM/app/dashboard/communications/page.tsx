"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Phone, Mail, MessageSquare, MessageCircle, Video } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import LogCommunicationDialog from "@/components/dashboard/communications/log-communication-dialog"

export default function CommunicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLogCommOpen, setIsLogCommOpen] = useState(false)
  const [typeFilter, setTypeFilter] = useState<string>("all")

  // Mock data for standalone communications
  const communications = [
    {
      id: "1",
      type: "call",
      contact: "John Smith",
      phone: "+1 234 567 8900",
      email: "john@example.com",
      company: "Tech Corp",
      date: "2024-01-15 10:30 AM",
      duration: "15 mins",
      outcome: "Interested - Follow up next week",
      notes: "Discussed product features, needs pricing info",
      loggedBy: "Sarah Johnson",
      convertedToLead: false,
    },
    {
      id: "2",
      type: "email",
      contact: "Emma Wilson",
      phone: "+1 234 567 8901",
      email: "emma@startup.io",
      company: "StartUp.io",
      date: "2024-01-14 3:45 PM",
      outcome: "No response yet",
      notes: "Sent product demo video and case studies",
      loggedBy: "Mike Davis",
      convertedToLead: false,
    },
    {
      id: "3",
      type: "whatsapp",
      contact: "David Lee",
      phone: "+1 234 567 8902",
      email: "david@company.com",
      company: "Growth Co",
      date: "2024-01-14 11:20 AM",
      outcome: "Not interested at this time",
      notes: "Currently using competitor, might revisit in Q2",
      loggedBy: "Sarah Johnson",
      convertedToLead: false,
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "call":
        return <Phone className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "sms":
        return <MessageSquare className="h-4 w-4" />
      case "whatsapp":
        return <MessageCircle className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      default:
        return <Phone className="h-4 w-4" />
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "call":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "email":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      case "sms":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "whatsapp":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
      case "video":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      default:
        return "bg-slate-100 text-slate-800 hover:bg-slate-100"
    }
  }

  const filteredCommunications = communications.filter((comm) => {
    const matchesSearch =
      comm.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comm.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comm.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || comm.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Communications Log</h1>
          <p className="text-muted-foreground mt-1">
            Track all outreach and conversations, even before they become leads
          </p>
        </div>
        <Button onClick={() => setIsLogCommOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Log Communication
        </Button>
      </div>

      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle>All Communications</CardTitle>
          <CardDescription>View all logged communications and convert promising ones to leads</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by contact, company, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-slate-200"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={typeFilter === "all" ? "default" : "outline"}
                onClick={() => setTypeFilter("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={typeFilter === "call" ? "default" : "outline"}
                onClick={() => setTypeFilter("call")}
                size="sm"
              >
                Calls
              </Button>
              <Button
                variant={typeFilter === "email" ? "default" : "outline"}
                onClick={() => setTypeFilter("email")}
                size="sm"
              >
                Emails
              </Button>
              <Button
                variant={typeFilter === "whatsapp" ? "default" : "outline"}
                onClick={() => setTypeFilter("whatsapp")}
                size="sm"
              >
                WhatsApp
              </Button>
              <Button
                variant={typeFilter === "video" ? "default" : "outline"}
                onClick={() => setTypeFilter("video")}
                size="sm"
              >
                Video
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredCommunications.map((comm) => (
              <Card key={comm.id} className="bg-slate-50 border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-2 bg-white rounded-lg border border-slate-200">{getTypeIcon(comm.type)}</div>
                        <Badge className={getTypeBadgeColor(comm.type)}>{comm.type.toUpperCase()}</Badge>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{comm.contact}</h3>
                          <span className="text-sm text-slate-500">at {comm.company}</span>
                        </div>
                        <div className="flex gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {comm.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {comm.email}
                          </span>
                        </div>
                        <div className="text-sm space-y-1">
                          <p>
                            <span className="font-medium">Outcome:</span> {comm.outcome}
                          </p>
                          <p>
                            <span className="font-medium">Notes:</span> {comm.notes}
                          </p>
                          <p className="text-xs text-slate-500">
                            {comm.date} • Logged by {comm.loggedBy}
                            {comm.duration && ` • Duration: ${comm.duration}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="default">
                        Convert to Lead
                      </Button>
                      <Button size="sm" variant="outline">
                        Add Follow-up
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <LogCommunicationDialog open={isLogCommOpen} onOpenChange={setIsLogCommOpen} />
    </div>
  )
}
