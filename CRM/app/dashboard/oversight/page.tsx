"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, TrendingUp, MessageSquare, DollarSign } from "lucide-react"
import TeamLeadsOverview from "@/components/dashboard/oversight/team-leads-overview"
import LeadAnalytics from "@/components/dashboard/oversight/lead-analytics"
import CommunicationAnalytics from "@/components/dashboard/oversight/communication-analytics"

export default function OversightPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Oversight</h1>
        <p className="text-muted-foreground mt-1">Monitor team performance and lead progress</p>
      </div>

      {/* Executive Overview Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Team Leads</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-slate-600">Across all team members</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">64</div>
            <p className="text-xs text-slate-600">In proposal/negotiation</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Communications</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,840</div>
            <p className="text-xs text-slate-600">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1.2M</div>
            <p className="text-xs text-slate-600">Total potential revenue</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="leads" className="w-full">
        <TabsList className="bg-slate-100 border-slate-200">
          <TabsTrigger value="leads">Team Leads</TabsTrigger>
          <TabsTrigger value="analytics">Lead Analytics</TabsTrigger>
          <TabsTrigger value="communications">Communication Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="mt-6">
          <TeamLeadsOverview />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <LeadAnalytics />
        </TabsContent>

        <TabsContent value="communications" className="mt-6">
          <CommunicationAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}
