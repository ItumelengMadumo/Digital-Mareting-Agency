import {
  Activity,
  BarChart3,
  Briefcase,
  Calendar,
  Eye,
  FileText,
  Gift,
  Home,
  Image,
  Inbox,
  LayoutGrid,
  Link2,
  Mail,
  Megaphone,
  MessageCircle,
  MessageSquare,
  MousePointerClick,
  Package,
  PenSquare,
  Phone,
  Radio,
  ScrollText,
  Search,
  Settings,
  Share2,
  User,
  UserCheck,
  Users,
  Video,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { isEnabled, type Feature } from "@/lib/features"

export interface NavLink {
  name: string
  href: string
  icon: LucideIcon
}

export interface NavGroup {
  id: string
  /** Hidden from navigation when this feature is switched off in lib/features.ts. */
  feature?: Feature
  title?: string
  icon?: LucideIcon
  links: NavLink[]
  /** Collapsible groups can be folded away; `defaultOpen` sets the initial state. */
  collapsible?: boolean
  defaultOpen?: boolean
}

const ALL_NAV: NavGroup[] = [
  { id: "home", links: [{ name: "Home", href: "/dashboard", icon: Home }] },
  {
    id: "content",
    title: "Content",
    icon: PenSquare,
    collapsible: true,
    defaultOpen: true,
    links: [
      { name: "Compose", href: "/dashboard/compose", icon: PenSquare },
      { name: "Posts", href: "/dashboard/posts", icon: FileText },
      { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
      { name: "Media library", href: "/dashboard/media", icon: Image },
    ],
  },
  {
    id: "engagement",
    feature: "inbox",
    title: "Engagement",
    icon: Inbox,
    collapsible: true,
    defaultOpen: true,
    links: [{ name: "Inbox", href: "/dashboard/inbox", icon: Inbox }],
  },
  {
    id: "comms",
    feature: "comms",
    title: "Comms",
    icon: Phone,
    collapsible: true,
    defaultOpen: true,
    links: [
      { name: "Overview", href: "/dashboard/comms", icon: LayoutGrid },
      { name: "Email", href: "/dashboard/comms/email", icon: Mail },
      { name: "SMS", href: "/dashboard/comms/sms", icon: MessageSquare },
      { name: "WhatsApp", href: "/dashboard/comms/whatsapp", icon: MessageCircle },
      { name: "Calls (VoIP)", href: "/dashboard/comms/calls", icon: Phone },
      { name: "Meetings", href: "/dashboard/comms/meetings", icon: Video },
      { name: "Comms log", href: "/dashboard/comms/log", icon: ScrollText },
    ],
  },
  {
    id: "accounts",
    title: "Accounts",
    icon: Share2,
    collapsible: true,
    defaultOpen: true,
    links: [{ name: "Social accounts", href: "/dashboard/accounts", icon: Share2 }],
  },
  {
    id: "crm",
    feature: "crm",
    title: "CRM",
    icon: Briefcase,
    collapsible: true,
    defaultOpen: false,
    links: [
      { name: "Leads", href: "/dashboard/leads", icon: Users },
      { name: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
      { name: "Products", href: "/dashboard/products", icon: Package },
      { name: "SEO", href: "/dashboard/seo", icon: Search },
      { name: "PPC / Ads", href: "/dashboard/ppc", icon: MousePointerClick },
      { name: "Tracking", href: "/dashboard/tracking", icon: Link2 },
      { name: "Influencers", href: "/dashboard/influencers", icon: UserCheck },
      { name: "Affiliates", href: "/dashboard/affiliates", icon: Gift },
      { name: "Offline", href: "/dashboard/offline", icon: Radio },
      { name: "Automation", href: "/dashboard/automation", icon: Zap },
      { name: "Team oversight", href: "/dashboard/oversight", icon: Eye },
      { name: "Activity", href: "/dashboard/activity", icon: Activity },
      { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
    ],
  },
  {
    id: "you",
    title: "You",
    icon: User,
    collapsible: true,
    defaultOpen: true,
    links: [
      { name: "Profile", href: "/dashboard/profile", icon: User },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
]

/** Navigation for the features that are switched on. */
export const DASHBOARD_NAV: NavGroup[] = ALL_NAV.filter((g) => !g.feature || isEnabled(g.feature))

// Section roots only match themselves, so "Overview" isn't highlighted on every comms page.
const EXACT_MATCH = new Set(["/dashboard", "/dashboard/comms"])

export function isActiveLink(pathname: string, href: string) {
  return EXACT_MATCH.has(href) ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
}
