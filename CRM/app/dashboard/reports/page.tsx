"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import TeamOverviewReport from "@/components/dashboard/reports/team-overview-report"
import EmployeeReports from "@/components/dashboard/reports/employee-reports"
import LeadPerformance from "@/components/dashboard/reports/lead-performance"
import CommunicationMetrics from "@/components/dashboard/reports/communication-metrics"

export default function ReportsPage() {
  const [timeframe, setTimeframe] = useState("30")

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Track performance across your sales and marketing team</p>
        </div>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px] bg-white border-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-slate-100 border-slate-200">
          <TabsTrigger value="overview">Team Overview</TabsTrigger>
          <TabsTrigger value="employees">By Employee</TabsTrigger>
          <TabsTrigger value="leads">Lead Performance</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <TeamOverviewReport timeframe={timeframe} />
        </TabsContent>

        <TabsContent value="employees" className="mt-6">
          <EmployeeReports timeframe={timeframe} />
        </TabsContent>

        <TabsContent value="leads" className="mt-6">
          <LeadPerformance timeframe={timeframe} />
        </TabsContent>

        <TabsContent value="communications" className="mt-6">
          <CommunicationMetrics timeframe={timeframe} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
