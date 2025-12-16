import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, DollarSign, TrendingUp, ShoppingCart } from "lucide-react"

export default function ProductsStats() {
  const stats = [
    {
      title: "Total Products",
      value: "24",
      change: "+3 this month",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Deals",
      value: "56",
      change: "+12 this week",
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Revenue",
      value: "$1.2M",
      change: "+18% this month",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Avg Deal Size",
      value: "$21,400",
      change: "+5% this month",
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
            <p className="text-xs text-green-600 mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
