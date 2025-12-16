"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, DollarSign, Target, Phone, Mail, MessageSquare, Award } from "lucide-react"

interface TeamOverviewReportProps {
  timeframe: string
}

export default function TeamOverviewReport({ timeframe }: TeamOverviewReportProps) {
  const stats = [
    {
      title: "Total Leads",
      value: "248",
      change: "+18%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Qualified Leads",
      value: "89",
      change: "+12%",
      trend: "up",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Revenue",
      value: "$2.4M",
      change: "+23%",
      trend: "up",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Conversion Rate",
      value: "32%",
      change: "+5%",
      trend: "up",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Total Calls",
      value: "1,248",
      change: "+15%",
      trend: "up",
      icon: Phone,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      title: "Emails Sent",
      value: "3,456",
      change: "+8%",
      trend: "up",
      icon: Mail,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
    },
    {
      title: "Messages Sent",
      value: "2,142",
      change: "+22%",
      trend: "up",
      icon: MessageSquare,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Deals Closed",
      value: "56",
      change: "+10%",
      trend: "up",
      icon: Award,
      color: "text-rose-600",
      bgColor: "bg-rose-100",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-white border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600 mt-1">{stat.change} from previous period</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle>Lead Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">New</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: "30%" }} />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">74</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Contacted</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: "25%" }} />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">62</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Qualified</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: "36%" }} />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">89</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Proposal</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: "9%" }} />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">23</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Enterprise CRM Package</span>
                <span className="text-sm font-medium">$600K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Professional CRM Package</span>
                <span className="text-sm font-medium">$450K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Custom Development</span>
                <span className="text-sm font-medium">$375K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Consulting Services</span>
                <span className="text-sm font-medium">$180K</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
