"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MoreHorizontal,
  RefreshCw,
  ExternalLink,
  Settings,
  Trash2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample data for connected platforms
const connectedPlatforms = [
  {
    id: "facebook-1",
    type: "facebook",
    name: "Facebook",
    accountName: "Brand Page",
    accountType: "Page",
    connected: true,
    lastSync: "1 hour ago",
    icon: <Facebook className="h-5 w-5 text-blue-600" />,
    stats: {
      followers: "5.2K",
      engagement: "3.8%",
      posts: "128",
    },
  },
  {
    id: "twitter-1",
    type: "twitter",
    name: "Twitter",
    accountName: "@brandhandle",
    accountType: "Profile",
    connected: true,
    lastSync: "30 minutes ago",
    icon: <Twitter className="h-5 w-5 text-sky-500" />,
    stats: {
      followers: "12.4K",
      engagement: "2.1%",
      posts: "543",
    },
  },
  {
    id: "instagram-1",
    type: "instagram",
    name: "Instagram",
    accountName: "@brandgram",
    accountType: "Business",
    connected: true,
    lastSync: "2 hours ago",
    icon: <Instagram className="h-5 w-5 text-pink-600" />,
    stats: {
      followers: "18.7K",
      engagement: "4.5%",
      posts: "312",
    },
  },
  {
    id: "linkedin-1",
    type: "linkedin",
    name: "LinkedIn",
    accountName: "Company Page",
    accountType: "Company",
    connected: true,
    lastSync: "1 day ago",
    icon: <Linkedin className="h-5 w-5 text-blue-800" />,
    stats: {
      followers: "3.6K",
      engagement: "1.9%",
      posts: "75",
    },
  },
]

export default function ConnectedPlatforms() {
  const [platforms, setPlatforms] = useState(connectedPlatforms)
  const [refreshing, setRefreshing] = useState<string | null>(null)

  const handleRefresh = (id: string) => {
    setRefreshing(id)
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(null)
    }, 1500)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Connected Platforms</h2>
          <p className="text-muted-foreground">Manage your connected social media accounts</p>
        </div>
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh All
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {platforms.map((platform) => (
          <Card key={platform.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {platform.icon}
                  <CardTitle className="ml-2 text-lg">{platform.name}</CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleRefresh(platform.id)}>
                      <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ExternalLink className="mr-2 h-4 w-4" /> View Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Disconnect
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>{platform.accountName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-3">
                <Badge variant="outline">{platform.accountType}</Badge>
                <div className="text-xs text-muted-foreground flex items-center">
                  {refreshing === platform.id ? <RefreshCw className="animate-spin mr-1 h-3 w-3" /> : null}
                  Last sync: {platform.lastSync}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-muted p-2 rounded-md">
                  <div className="text-xs text-muted-foreground">Followers</div>
                  <div className="font-medium">{platform.stats.followers}</div>
                </div>
                <div className="bg-muted p-2 rounded-md">
                  <div className="text-xs text-muted-foreground">Engagement</div>
                  <div className="font-medium">{platform.stats.engagement}</div>
                </div>
                <div className="bg-muted p-2 rounded-md">
                  <div className="text-xs text-muted-foreground">Posts</div>
                  <div className="font-medium">{platform.stats.posts}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
