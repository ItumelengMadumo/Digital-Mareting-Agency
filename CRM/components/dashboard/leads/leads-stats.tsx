import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, DollarSign, Target } from "lucide-react"

export default function LeadsStats() {
  const stats = [
    {
      title: "Total Leads",
      value: "248",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Qualified Leads",
      value: "89",
      change: "+8%",
      trend: "up",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pipeline Value",
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
  ]

  return (
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
            <p className="text-xs text-green-600 mt-1">{stat.change} from last month</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
