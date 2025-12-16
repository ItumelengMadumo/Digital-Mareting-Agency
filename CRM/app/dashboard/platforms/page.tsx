"use client"
import ConnectedPlatforms from "@/components/dashboard/platforms/connected-platforms"
import AvailablePlatforms from "@/components/dashboard/platforms/available-platforms"

export default function PlatformsPage() {
  return (
    <div className="w-full space-y-10">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Platforms</h1>
        <p className="text-muted-foreground text-lg">Connect and manage your social media accounts.</p>
      </div>

      <div className="space-y-10">
        <ConnectedPlatforms />
        <AvailablePlatforms />
      </div>
    </div>
  )
}
