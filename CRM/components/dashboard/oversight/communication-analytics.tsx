"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { useState } from "react"

export default function CommunicationAnalytics() {
  const [timePeriod, setTimePeriod] = useState("month")

  // Mock data for communications over time
  const communicationsOverTime = [
    { date: "Week 1", email: 240, sms: 120, whatsapp: 180, calls: 80 },
    { date: "Week 2", email: 280, sms: 145, whatsapp: 210, calls: 95 },
    { date: "Week 3", email: 310, sms: 165, whatsapp: 240, calls: 110 },
    { date: "Week 4", email: 350, sms: 180, whatsapp: 280, calls: 125 },
  ]

  // Mock data for communications by team member
  const communicationsByMember = [
    { name: "Sarah Johnson", email: 420, sms: 180, whatsapp: 320, calls: 145 },
    { name: "Mike Chen", email: 380, sms: 165, whatsapp: 290, calls: 130 },
    { name: "Alex Rivera", email: 310, sms: 140, whatsapp: 240, calls: 105 },
    { name: "Emily Davis", email: 270, sms: 125, whatsapp: 210, calls: 90 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Communication Analytics</h3>
        <Select value={timePeriod} onValueChange={setTimePeriod}>
          <SelectTrigger className="w-[180px] bg-white border-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle>Communications Over Time</CardTitle>
          <CardDescription>Trend analysis of all communication channels</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={communicationsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="email" stroke="#3b82f6" name="Email" strokeWidth={2} />
              <Line type="monotone" dataKey="sms" stroke="#10b981" name="SMS" strokeWidth={2} />
              <Line type="monotone" dataKey="whatsapp" stroke="#8b5cf6" name="WhatsApp" strokeWidth={2} />
              <Line type="monotone" dataKey="calls" stroke="#f59e0b" name="Calls" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle>Communications by Team Member</CardTitle>
          <CardDescription>Activity breakdown across communication channels</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={communicationsByMember}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="email" fill="#3b82f6" name="Email" />
              <Bar dataKey="sms" fill="#10b981" name="SMS" />
              <Bar dataKey="whatsapp" fill="#8b5cf6" name="WhatsApp" />
              <Bar dataKey="calls" fill="#f59e0b" name="Calls" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
