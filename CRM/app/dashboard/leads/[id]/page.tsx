"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Edit, MoreVertical, Plus } from "lucide-react"
import LeadTimeline from "@/components/dashboard/leads/lead-timeline"
import LeadProducts from "@/components/dashboard/leads/lead-products"
import LeadNotes from "@/components/dashboard/leads/lead-notes"
import AddCommunicationDialog from "@/components/dashboard/leads/add-communication-dialog"

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const leadId = params.id
  const [isAddCommunicationOpen, setIsAddCommunicationOpen] = useState(false)

  const lead = {
    id: leadId,
    name: "John Smith",
    email: "john@techcorp.com",
    phone: "+1 (555) 123-4567",
    company: "Tech Corp",
    position: "CTO",
    status: "qualified",
    value: 50000,
    createdBy: "Sarah Johnson",
    source: "Website",
    createdAt: "2024-01-15",
  }

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

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{lead.name}</h1>
            <p className="text-muted-foreground mt-1">
              {lead.company} - {lead.position}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsAddCommunicationOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Communication
          </Button>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {lead.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{lead.name}</div>
                  <div className="text-sm text-slate-500">{lead.position}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Status</span>
                  <Badge variant="outline" className={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Email</span>
                  <span className="font-medium">{lead.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Phone</span>
                  <span className="font-medium">{lead.phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Company</span>
                  <span className="font-medium">{lead.company}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Value</span>
                  <span className="font-medium">${lead.value.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Created By</span>
                  <span className="font-medium">{lead.createdBy}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Source</span>
                  <span className="font-medium">{lead.source}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Created</span>
                  <span className="font-medium">{lead.createdAt}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="bg-slate-100 border-slate-200">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="products">Products & Deals</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline" className="mt-6">
              <LeadTimeline leadId={leadId as string} />
            </TabsContent>
            <TabsContent value="products" className="mt-6">
              <LeadProducts leadId={leadId as string} />
            </TabsContent>
            <TabsContent value="notes" className="mt-6">
              <LeadNotes leadId={leadId as string} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AddCommunicationDialog
        open={isAddCommunicationOpen}
        onOpenChange={setIsAddCommunicationOpen}
        leadId={leadId as string}
        leadName={lead.name}
        leadEmail={lead.email}
        leadPhone={lead.phone}
      />
    </div>
  )
}
