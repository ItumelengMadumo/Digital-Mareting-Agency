import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Youtube, Music, PlusCircle } from "lucide-react"

// Sample data for available platforms
const availablePlatforms = [
  {
    id: "youtube",
    name: "YouTube",
    description: "Share videos and grow your channel",
    icon: <Youtube className="h-10 w-10 text-red-600" />,
    popular: true,
  },
  {
    id: "tiktok",
    name: "TikTok",
    description: "Create short-form viral video content",
    icon: <Music className="h-10 w-10 text-black" />,
    popular: true,
  },
  {
    id: "pinterest",
    name: "Pinterest",
    description: "Share visual content and drive traffic",
    icon: <PlusCircle className="h-10 w-10 text-red-500" />,
    popular: false,
  },
]

export default function AvailablePlatforms() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Available Platforms</h2>
        <p className="text-muted-foreground">Connect more platforms to expand your social media presence</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {availablePlatforms.map((platform) => (
          <Card key={platform.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-muted rounded-lg">{platform.icon}</div>
                {platform.popular && (
                  <div className="bg-yellow-500/10 text-yellow-600 text-xs font-medium rounded-full px-2.5 py-0.5 border border-yellow-500/20">
                    Popular
                  </div>
                )}
              </div>
              <CardTitle className="mt-4">{platform.name}</CardTitle>
              <CardDescription>{platform.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Connect
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
