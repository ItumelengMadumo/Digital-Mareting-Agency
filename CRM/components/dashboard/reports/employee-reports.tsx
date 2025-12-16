"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MessageSquare, Users, DollarSign, TrendingUp } from "lucide-react"

interface EmployeeReportsProps {
  timeframe: string
}

export default function EmployeeReports({ timeframe }: EmployeeReportsProps) {
  const [selectedEmployee, setSelectedEmployee] = useState("all")

  const employees = [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Senior Sales Rep",
      leads: 68,
      qualified: 24,
      dealsWon: 12,
      revenue: 720000,
      calls: 342,
      emails: 856,
      messages: 487,
      conversionRate: 35,
    },
    {
      id: "2",
      name: "Mike Wilson",
      role: "Sales Representative",
      leads: 52,
      qualified: 18,
      dealsWon: 9,
      revenue: 540000,
      calls: 284,
      emails: 623,
      messages: 412,
      conversionRate: 32,
    },
    {
      id: "3",
      name: "Jessica Lee",
      role: "Sales Representative",
      leads: 61,
      qualified: 22,
      dealsWon: 11,
      revenue: 660000,
      calls: 312,
      emails: 742,
      messages: 453,
      conversionRate: 34,
    },
    {
      id: "4",
      name: "David Chen",
      role: "Sales Representative",
      leads: 45,
      qualified: 15,
      dealsWon: 7,
      revenue: 420000,
      calls: 256,
      emails: 534,
      messages: 389,
      conversionRate: 31,
    },
  ]

  const filteredEmployees = selectedEmployee === "all" ? employees : employees.filter((e) => e.id === selectedEmployee)

  return (
    <div className="space-y-6">
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Employee Performance</CardTitle>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="w-[200px] bg-white border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                <SelectItem value="1">Sarah Johnson</SelectItem>
                <SelectItem value="2">Mike Wilson</SelectItem>
                <SelectItem value="3">Jessica Lee</SelectItem>
                <SelectItem value="4">David Chen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="bg-slate-50 border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{employee.name}</h3>
                      <p className="text-sm text-slate-600">{employee.role}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    {employee.conversionRate}% conversion
                  </Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Users className="h-4 w-4" />
                      <span className="text-xs">Leads</span>
                    </div>
                    <div className="text-2xl font-bold">{employee.leads}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs">Qualified</span>
                    </div>
                    <div className="text-2xl font-bold">{employee.qualified}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-600">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-xs">Revenue</span>
                    </div>
                    <div className="text-2xl font-bold">${(employee.revenue / 1000).toFixed(0)}K</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="h-4 w-4" />
                      <span className="text-xs">Calls</span>
                    </div>
                    <div className="text-2xl font-bold">{employee.calls}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="h-4 w-4" />
                      <span className="text-xs">Emails</span>
                    </div>
                    <div className="text-2xl font-bold">{employee.emails}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-xs">Messages</span>
                    </div>
                    <div className="text-2xl font-bold">{employee.messages}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
