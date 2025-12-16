"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MessageSquare, MessageCircle } from "lucide-react"

interface CommunicationMetricsProps {
  timeframe: string
}

export default function CommunicationMetrics({ timeframe }: CommunicationMetricsProps) {
  const channelData = [
    { channel: "Email", sent: 1248, opened: 856, replied: 342, icon: Mail, color: "text-blue-600" },
    { channel: "Phone", calls: 432, connected: 312, avgDuration: "8m", icon: Phone, color: "text-purple-600" },
    { channel: "SMS", sent: 856, delivered: 842, replied: 234, icon: MessageSquare, color: "text-green-600" },
    {
      channel: "WhatsApp",
      sent: 624,
      delivered: 612,
      replied: 298,
      icon: MessageCircle,
      color: "text-emerald-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {channelData.map((channel) => (
          <Card key={channel.channel} className="bg-white border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{channel.channel}</CardTitle>
              <channel.icon className={`h-5 w-5 ${channel.color}`} />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {channel.channel !== "Phone" ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Sent:</span>
                      <span className="font-medium">{channel.sent}</span>
                    </div>
                    {"opened" in channel && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Opened:</span>
                        <span className="font-medium">{channel.opened}</span>
                      </div>
                    )}
                    {"delivered" in channel && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Delivered:</span>
                        <span className="font-medium">{channel.delivered}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Replied:</span>
                      <span className="font-medium">{channel.replied}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Total Calls:</span>
                      <span className="font-medium">{channel.calls}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Connected:</span>
                      <span className="font-medium">{channel.connected}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Avg Duration:</span>
                      <span className="font-medium">{channel.avgDuration}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle>Communication Response Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Email Response Rate</span>
                <span className="text-sm font-medium">27%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: "27%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">SMS Response Rate</span>
                <span className="text-sm font-medium">27%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: "27%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">WhatsApp Response Rate</span>
                <span className="text-sm font-medium">48%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: "48%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Phone Connection Rate</span>
                <span className="text-sm font-medium">72%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: "72%" }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
