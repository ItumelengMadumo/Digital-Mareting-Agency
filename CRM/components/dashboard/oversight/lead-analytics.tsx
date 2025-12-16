"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useState } from "react"

export default function LeadAnalytics() {
  const [timePeriod, setTimePeriod] = useState("month")

  // Mock data for leads by team member
  const leadsByMember = [
    { name: "Sarah Johnson", leads: 85, won: 34, lost: 12, active: 39 },
    { name: "Mike Chen", leads: 72, won: 28, lost: 10, active: 34 },
    { name: "Alex Rivera", leads: 56, won: 22, lost: 8, active: 26 },
    { name: "Emily Davis", leads: 35, won: 14, lost: 5, active: 16 },
  ]

  // Mock data for leads by type
  const leadsByType = [
    { name: "Enterprise", value: 45, color: "#3b82f6" },
    { name: "SMB", value: 98, color: "#10b981" },
    { name: "Startup", value: 67, color: "#f59e0b" },
    { name: "Individual", value: 38, color: "#8b5cf6" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Lead Analytics</h3>
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle>Leads by Team Member</CardTitle>
            <CardDescription>Performance breakdown by sales team</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leadsByMember}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="won" fill="#10b981" name="Won" />
                <Bar dataKey="active" fill="#3b82f6" name="Active" />
                <Bar dataKey="lost" fill="#ef4444" name="Lost" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle>Leads by Type</CardTitle>
            <CardDescription>Distribution of lead categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leadsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {leadsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
