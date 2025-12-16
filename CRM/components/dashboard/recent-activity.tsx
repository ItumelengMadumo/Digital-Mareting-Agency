import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Facebook, Twitter, Instagram, ExternalLink } from "lucide-react"

// Example activity data
const activities = [
  {
    id: 1,
    content: "New comment on your post: 'Great content!'",
    time: "2 hours ago",
    platform: "instagram",
    type: "comment",
  },
  {
    id: 2,
    content: "Your scheduled post was published successfully",
    time: "5 hours ago",
    platform: "facebook",
    type: "publish",
  },
  {
    id: 3,
    content: "Your post received 50 likes",
    time: "1 day ago",
    platform: "twitter",
    type: "engagement",
  },
  {
    id: 4,
    content: "You gained 15 new followers",
    time: "2 days ago",
    platform: "instagram",
    type: "followers",
  },
]

// Helper function to get platform icon
const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "facebook":
      return <Facebook className="h-4 w-4 text-blue-600" />
    case "twitter":
      return <Twitter className="h-4 w-4 text-sky-500" />
    case "instagram":
      return <Instagram className="h-4 w-4 text-pink-600" />
    default:
      return null
  }
}

// Helper function to get activity type badge
const getActivityBadge = (type: string) => {
  switch (type) {
    case "comment":
      return <Badge className="bg-blue-500">Comment</Badge>
    case "publish":
      return <Badge className="bg-green-500">Published</Badge>
    case "engagement":
      return <Badge className="bg-purple-500">Engagement</Badge>
    case "followers":
      return <Badge className="bg-amber-500">Followers</Badge>
    default:
      return null
  }
}

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <div className="flex-shrink-0">{getPlatformIcon(activity.platform)}</div>
              <div className="flex-1 space-y-1">
                <p className="text-sm">{activity.content}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                  {getActivityBadge(activity.type)}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="flex-shrink-0 h-8 w-8">
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
