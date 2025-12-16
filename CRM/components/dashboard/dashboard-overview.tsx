import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Users, Share2, Heart, MessageSquare } from "lucide-react"

export default function DashboardOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12,834</div>
          <p className="text-xs text-muted-foreground flex items-center">
            <span className="text-green-500 flex items-center mr-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> 18.2%
            </span>
            from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Posts Published</CardTitle>
          <Share2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">48</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 flex items-center mr-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> 12%
            </span>
            from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Engagements</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,429</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 flex items-center mr-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> 24.5%
            </span>
            from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Comments</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">342</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 flex items-center mr-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> 9.3%
            </span>
            from last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
