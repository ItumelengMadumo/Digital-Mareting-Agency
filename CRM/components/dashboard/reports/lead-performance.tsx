"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface LeadPerformanceProps {
  timeframe: string
}

export default function LeadPerformance({ timeframe }: LeadPerformanceProps) {
  const topLeads = [
    {
      id: "1",
      name: "John Smith",
      company: "Tech Corp",
      value: 50000,
      status: "negotiation",
      assignedTo: "Sarah Johnson",
      activities: 24,
      lastContact: "2 hours ago",
    },
    {
      id: "2",
      name: "Emily Davis",
      company: "Startup Co",
      value: 25000,
      status: "qualified",
      assignedTo: "Mike Wilson",
      activities: 18,
      lastContact: "1 day ago",
    },
    {
      id: "3",
      name: "Michael Brown",
      company: "Enterprises Inc",
      value: 100000,
      status: "proposal",
      assignedTo: "Sarah Johnson",
      activities: 32,
      lastContact: "3 hours ago",
    },
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: "bg-blue-100 text-blue-700 border-blue-200",
      contacted: "bg-purple-100 text-purple-700 border-purple-200",
      qualified: "bg-green-100 text-green-700 border-green-200",
      proposal: "bg-yellow-100 text-yellow-700 border-yellow-200",
      negotiation: "bg-orange-100 text-orange-700 border-orange-200",
      won: "bg-emerald-100 text-emerald-700 border-emerald-200",
      lost: "bg-slate-100 text-slate-700 border-slate-200",
    }
    return colors[status]
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle>Most Active Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-xs text-slate-500">{lead.activities} activities</div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle>Highest Value Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topLeads
                .sort((a, b) => b.value - a.value)
                .map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-xs text-slate-500">{lead.company}</div>
                    </div>
                    <div className="text-sm font-semibold">${lead.value.toLocaleString()}</div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle>Recently Contacted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-xs text-slate-500">{lead.assignedTo}</div>
                  </div>
                  <div className="text-xs text-slate-600">{lead.lastContact}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle>Lead Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead>Lead</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Activities</TableHead>
                <TableHead>Last Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topLeads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>${lead.value.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{lead.assignedTo}</TableCell>
                  <TableCell>{lead.activities}</TableCell>
                  <TableCell className="text-slate-600">{lead.lastContact}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
