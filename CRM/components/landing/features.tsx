import { CalendarDays, BarChart3, Share2, Clock, Layout, Zap } from "lucide-react"

const features = [
  {
    name: "Multi-platform Publishing",
    description: "Publish content to multiple social media platforms simultaneously with just a single click.",
    icon: Share2,
  },
  {
    name: "Content Calendar",
    description: "Plan and visualize your content strategy with our intuitive drag-and-drop calendar interface.",
    icon: CalendarDays,
  },
  {
    name: "Scheduled Posts",
    description: "Schedule your posts ahead of time to maintain a consistent social media presence.",
    icon: Clock,
  },
  {
    name: "Performance Analytics",
    description: "Track the performance of your posts across all platforms with detailed analytics.",
    icon: BarChart3,
  },
  {
    name: "Content Library",
    description: "Store and organize all your media assets in one centralized location for easy access.",
    icon: Layout,
  },
  {
    name: "AI-powered Suggestions",
    description: "Get intelligent recommendations for the best times to post and content ideas.",
    icon: Zap,
  },
]

export default function Features() {
  return (
    <div className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-500">Boost your social presence</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to manage your social media
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            SocialSync provides all the tools you need to create, schedule, and analyze your social media content across
            multiple platforms.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-muted-foreground">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
