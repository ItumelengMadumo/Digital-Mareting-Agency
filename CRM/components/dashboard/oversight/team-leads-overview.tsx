"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function TeamLeadsOverview() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data showing all team leads
  const teamLeads = [
    {
      id: "1",
      name: "John Smith",
      company: "Tech Corp",
      value: 50000,
      status: "qualified",
      createdBy: "Sarah Johnson",
      lastContact: "2 hours ago",
      activities: 12,
    },
    {
      id: "2",
      name: "Emma Wilson",
      company: "Design Studio",
      value: 35000,
      status: "proposal",
      createdBy: "Mike Chen",
      lastContact: "1 day ago",
      activities: 8,
    },
    {
      id: "3",
      name: "Robert Taylor",
      company: "Marketing Plus",
      value: 75000,
      status: "negotiation",
      createdBy: "Sarah Johnson",
      lastContact: "3 hours ago",
      activities: 15,
    },
    {
      id: "4",
      name: "Lisa Anderson",
      company: "Startup Hub",
      value: 45000,
      status: "contacted",
      createdBy: "Alex Rivera",
      lastContact: "2 days ago",
      activities: 5,
    },
    {
      id: "5",
      name: "David Martinez",
      company: "Enterprise Solutions",
      value: 120000,
      status: "qualified",
      createdBy: "Mike Chen",
      lastContact: "5 hours ago",
      activities: 10,
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
    return colors[status] || colors.new
  }

  const filteredLeads = teamLeads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.createdBy.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader>
        <CardTitle>All Team Leads</CardTitle>
        <CardDescription>Monitor leads created by all team members</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by lead name, company, or team member..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-slate-200"
            />
          </div>
        </div>

        <div className="rounded-md border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Lead Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Activities</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>${lead.value.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                        {lead.createdBy
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      {lead.createdBy}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600">{lead.lastContact}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{lead.activities}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/leads/${lead.id}`)}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
