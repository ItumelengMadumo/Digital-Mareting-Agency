"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, DollarSign, Target, MessageSquare, Plus, ArrowRight, BarChart3, Eye } from "lucide-react"
import Link from "next/link"
import RecentLeadsActivity from "@/components/dashboard/recent-leads-activity"
import UpcomingPosts from "@/components/dashboard/upcoming-posts"
import { useRole } from "@/lib/role-context"

export default function DashboardPage() {
  const { isExecutive } = useRole()

  const stats = [
    {
      title: "Total Leads",
      value: isExecutive ? "248" : "42",
      change: isExecutive ? "+18% from last month" : "Your active leads",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      href: "/dashboard/leads",
    },
    {
      title: "Qualified Leads",
      value: isExecutive ? "89" : "18",
      change: isExecutive ? "+12% from last month" : "Ready to close",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-100",
      href: "/dashboard/leads",
    },
    {
      title: isExecutive ? "Pipeline Value" : "Your Pipeline",
      value: isExecutive ? "$2.4M" : "$180K",
      change: isExecutive ? "+23% from last month" : "Total deal value",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      href: isExecutive ? "/dashboard/reports" : "/dashboard/leads",
    },
    {
      title: "Communications",
      value: isExecutive ? "3,160" : "87",
      change: isExecutive ? "This month" : "This week",
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      href: "/dashboard/communications",
    },
  ]

  return (
    <div className="space-y-6 w-full p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {isExecutive
              ? "Welcome back! Here's your team's sales and marketing overview."
              : "Welcome back! Here's your sales and marketing overview."}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/leads">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Lead
            </Button>
          </Link>
          <Link href="/dashboard/create-post">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Plus className="h-4 w-4" />
              Create Post
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="bg-white border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {isExecutive ? (
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-indigo-600" />
                Team Oversight
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-slate-600">Monitor all team leads, analytics, and communications</p>
              <Link href="/dashboard/oversight">
                <Button variant="outline" className="w-full gap-2 bg-white">
                  View Oversight
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Team Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-slate-600">View comprehensive team performance metrics</p>
              <Link href="/dashboard/reports">
                <Button variant="outline" className="w-full gap-2 bg-white">
                  View Reports
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                My Leads
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-slate-600">Manage your personal leads</p>
              <Link href="/dashboard/leads">
                <Button variant="outline" className="w-full gap-2 bg-white">
                  View My Leads
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                My Leads
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-slate-600">Manage and track your sales leads</p>
              <Link href="/dashboard/leads">
                <Button variant="outline" className="w-full gap-2 bg-white">
                  View My Leads
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                Communications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-slate-600">Contact leads via email, SMS, WhatsApp, or call</p>
              <Link href="/dashboard/communications">
                <Button variant="outline" className="w-full gap-2 bg-white">
                  Open Communications
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                My Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-slate-600">Track your deals and conversion rates</p>
              <Link href="/dashboard/leads">
                <Button variant="outline" className="w-full gap-2 bg-white">
                  View Performance
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <RecentLeadsActivity />
        <UpcomingPosts />
      </div>
    </div>
  )
}
