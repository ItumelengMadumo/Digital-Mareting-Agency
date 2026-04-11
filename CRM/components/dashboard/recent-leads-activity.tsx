"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useRole } from "@/lib/workspace-context"

export default function RecentLeadsActivity() {
  const { isExecutive } = useRole()

  const recentActivities = [
    {
      id: "1",
      type: "email",
      lead: "John Smith",
      company: "Tech Corp",
      action: "Sent proposal email",
      user: "Sarah Johnson",
      time: "2 hours ago",
      icon: Mail,
    },
    {
      id: "2",
      type: "call",
      lead: "Emily Davis",
      company: "Startup Co",
      action: "Phone call - 15 minutes",
      user: "Mike Wilson",
      time: "4 hours ago",
      icon: Phone,
    },
    {
      id: "3",
      type: "sms",
      lead: "Michael Brown",
      company: "Enterprises Inc",
      action: "SMS follow-up sent",
      user: "Sarah Johnson",
      time: "1 day ago",
      icon: MessageSquare,
    },
  ]

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader>
        <CardTitle>{isExecutive ? "Team Lead Activity" : "Recent Lead Activity"}</CardTitle>
        <CardDescription>
          {isExecutive ? "Latest interactions across all team members" : "Your latest interactions with leads"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                <activity.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.action}</p>
                <p className="text-sm text-slate-600">
                  {activity.lead} ({activity.company})
                </p>
                <p className="text-xs text-slate-500">
                  {isExecutive && `${activity.user} • `}
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        {isExecutive && (
          <Link href="/dashboard/activity" className="block mt-4">
            <button className="text-sm text-primary hover:underline w-full text-left">View all activity →</button>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
