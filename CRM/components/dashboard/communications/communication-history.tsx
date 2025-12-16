"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageSquare, Phone, MessageCircle } from "lucide-react"

export default function CommunicationHistory() {
  const history = [
    {
      id: "1",
      type: "email",
      title: "Proposal sent to John Smith",
      timestamp: "2 hours ago",
      status: "sent",
      icon: Mail,
      color: "text-blue-600",
    },
    {
      id: "2",
      type: "call",
      title: "Call with Emily Davis",
      timestamp: "4 hours ago",
      status: "completed",
      icon: Phone,
      color: "text-purple-600",
    },
    {
      id: "3",
      type: "whatsapp",
      title: "Message to Michael Brown",
      timestamp: "1 day ago",
      status: "delivered",
      icon: MessageCircle,
      color: "text-emerald-600",
    },
    {
      id: "4",
      type: "sms",
      title: "SMS to John Smith",
      timestamp: "1 day ago",
      status: "delivered",
      icon: MessageSquare,
      color: "text-green-600",
    },
    {
      id: "5",
      type: "email",
      title: "Follow-up email to Emily Davis",
      timestamp: "2 days ago",
      status: "opened",
      icon: Mail,
      color: "text-blue-600",
    },
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      sent: "bg-blue-100 text-blue-700 border-blue-200",
      delivered: "bg-green-100 text-green-700 border-green-200",
      opened: "bg-purple-100 text-purple-700 border-purple-200",
      completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
      failed: "bg-red-100 text-red-700 border-red-200",
    }
    return colors[status] || colors.sent
  }

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader>
        <CardTitle>Recent Communications</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="flex gap-3 pb-4 border-b border-slate-100 last:border-0">
                <div className={`mt-1 ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="text-sm font-medium">{item.title}</div>
                  <div className="text-xs text-slate-500">{item.timestamp}</div>
                  <Badge variant="outline" className={`text-xs ${getStatusColor(item.status)}`}>
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
