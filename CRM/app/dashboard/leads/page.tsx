"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search } from "lucide-react"
import LeadsList from "@/components/dashboard/leads/leads-list"
import AddLeadDialog from "@/components/dashboard/leads/add-lead-dialog"
import LeadsStats from "@/components/dashboard/leads/leads-stats"

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads Management</h1>
          <p className="text-muted-foreground mt-1">Track and manage all your sales leads in one place</p>
        </div>
        <Button onClick={() => setIsAddLeadOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Lead
        </Button>
      </div>

      <LeadsStats />

      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle>All Leads</CardTitle>
          <CardDescription>View and manage your lead pipeline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search leads by name, company, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-slate-200"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={statusFilter === "new" ? "default" : "outline"}
                onClick={() => setStatusFilter("new")}
                size="sm"
              >
                New
              </Button>
              <Button
                variant={statusFilter === "contacted" ? "default" : "outline"}
                onClick={() => setStatusFilter("contacted")}
                size="sm"
              >
                Contacted
              </Button>
              <Button
                variant={statusFilter === "qualified" ? "default" : "outline"}
                onClick={() => setStatusFilter("qualified")}
                size="sm"
              >
                Qualified
              </Button>
              <Button
                variant={statusFilter === "proposal" ? "default" : "outline"}
                onClick={() => setStatusFilter("proposal")}
                size="sm"
              >
                Proposal
              </Button>
            </div>
          </div>

          <LeadsList searchQuery={searchQuery} statusFilter={statusFilter} />
        </CardContent>
      </Card>

      <AddLeadDialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen} />
    </div>
  )
}
