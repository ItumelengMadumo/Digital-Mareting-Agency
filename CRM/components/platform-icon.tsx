import type { IconType } from "react-icons"
import { FaLinkedin } from "react-icons/fa6"
import {
  SiBluesky,
  SiFacebook,
  SiInstagram,
  SiPinterest,
  SiReddit,
  SiThreads,
  SiTiktok,
  SiX,
  SiYoutube,
} from "react-icons/si"
import { Globe } from "lucide-react"
import { getPlatform } from "@/lib/platforms"
import { cn } from "@/lib/utils"

const ICONS: Record<string, IconType> = {
  instagram: SiInstagram,
  facebook: SiFacebook,
  tiktok: SiTiktok,
  youtube: SiYoutube,
  twitter: SiX,
  linkedin: FaLinkedin,
  threads: SiThreads,
  pinterest: SiPinterest,
  bluesky: SiBluesky,
  reddit: SiReddit,
}

interface PlatformIconProps {
  id: string
  className?: string
  /** Use the platform's brand colour (default) or inherit the surrounding text colour. */
  colored?: boolean
}

/** The platform's real logo. Unknown platforms fall back to a globe. */
export default function PlatformIcon({ id, className, colored = true }: PlatformIconProps) {
  const platform = getPlatform(id)
  const Icon = platform ? ICONS[platform.id] : undefined
  if (!Icon) return <Globe className={cn("h-4 w-4", className)} aria-hidden />
  return <Icon className={cn("h-4 w-4", colored && platform?.color, className)} aria-hidden />
}
