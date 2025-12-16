"use client"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MessageSquare, Eye } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost"
  value: number
  createdBy: string
  lastContact: string
  source: string
}

// Mock data - will be replaced with actual data from database
const mockLeads: Lead[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@techcorp.com",
    phone: "+1 (555) 123-4567",
    company: "Tech Corp",
    status: "qualified",
    value: 50000,
    createdBy: "Sarah Johnson",
    lastContact: "2 hours ago",
    source: "Website",
  },
  {
    id: "2",
    name: "Emily Davis",
    email: "emily@startupco.com",
    phone: "+1 (555) 234-5678",
    company: "Startup Co",
    status: "new",
    value: 25000,
    createdBy: "Mike Wilson",
    lastContact: "1 day ago",
    source: "Referral",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael@enterprises.com",
    phone: "+1 (555) 345-6789",
    company: "Enterprises Inc",
    status: "proposal",
    value: 100000,
    createdBy: "Sarah Johnson",
    lastContact: "3 hours ago",
    source: "LinkedIn",
  },
]

interface LeadsListProps {
  searchQuery: string
  statusFilter: string
}

export default function LeadsList({ searchQuery, statusFilter }: LeadsListProps) {
  const router = useRouter()

  const filteredLeads = mockLeads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Lead["status"]) => {
    const colors = {
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
    <div className="rounded-md border border-slate-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead>Lead</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Last Contact</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLeads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                No leads found
              </TableCell>
            </TableRow>
          ) : (
            filteredLeads.map((lead) => (
              <TableRow key={lead.id} className="hover:bg-slate-50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {lead.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-xs text-slate-500">{lead.source}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{lead.company}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">{lead.email}</div>
                    <div className="text-xs text-slate-500">{lead.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">${lead.value.toLocaleString()}</TableCell>
                <TableCell>{lead.createdBy}</TableCell>
                <TableCell className="text-slate-600">{lead.lastContact}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => router.push(`/dashboard/leads/${lead.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
