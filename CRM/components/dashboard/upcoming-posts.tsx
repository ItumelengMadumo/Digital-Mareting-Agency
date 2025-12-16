import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Instagram, Linkedin, Clock, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Example upcoming posts
const upcomingPosts = [
  {
    id: 1,
    content: "Excited to announce our new product launch! Stay tuned for more details.",
    scheduledFor: "2023-07-15T10:00:00",
    platforms: ["facebook", "twitter", "instagram"],
  },
  {
    id: 2,
    content: "Check out our latest blog post on digital marketing trends for 2023.",
    scheduledFor: "2023-07-16T14:30:00",
    platforms: ["twitter", "linkedin"],
  },
  {
    id: 3,
    content: "Join us for a live Q&A session with our product team this Friday!",
    scheduledFor: "2023-07-18T16:00:00",
    platforms: ["instagram", "facebook"],
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
    case "linkedin":
      return <Linkedin className="h-4 w-4 text-blue-800" />
    default:
      return null
  }
}

// Format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
  return new Date(dateString).toLocaleDateString("en-US", options)
}

export default function UpcomingPosts() {
  return (
    <Card className="col-span-2 md:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Posts</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingPosts.map((post) => (
            <div key={post.id} className="flex flex-col space-y-2 rounded-lg border p-3">
              <div className="line-clamp-2 text-sm">{post.content}</div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatDate(post.scheduledFor)}</span>
                </div>
                <div className="flex gap-1">
                  {post.platforms.map((platform) => (
                    <div key={platform} className="flex items-center">
                      {getPlatformIcon(platform)}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <Badge variant="outline" className="text-xs px-2 py-0">
                  Scheduled
                </Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
