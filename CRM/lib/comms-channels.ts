import { Mail, MessageCircle, MessageSquare, Phone, ScrollText, Video, type LucideIcon } from "lucide-react"

export interface CommsChannel {
  id: string
  title: string
  description: string
  /** What needs connecting before messages actually send; undefined when nothing does. */
  provider?: string
  icon: LucideIcon
  tint: string
}

export const COMMS_CHANNELS: CommsChannel[] = [
  {
    id: "email",
    title: "Email",
    description: "Write and send emails to contacts and leads.",
    provider: "an email provider (Amazon SES or SendGrid)",
    icon: Mail,
    tint: "bg-blue-100 text-blue-700",
  },
  {
    id: "sms",
    title: "SMS",
    description: "Send text messages to your contacts.",
    provider: "an SMS gateway",
    icon: MessageSquare,
    tint: "bg-violet-100 text-violet-700",
  },
  {
    id: "whatsapp",
    title: "WhatsApp",
    description: "Message contacts on WhatsApp Business.",
    provider: "the WhatsApp Business Platform",
    icon: MessageCircle,
    tint: "bg-green-100 text-green-700",
  },
  {
    id: "calls",
    title: "Calls (VoIP)",
    description: "Call contacts from your browser.",
    provider: "a VoIP provider with South African numbers",
    icon: Phone,
    tint: "bg-amber-100 text-amber-700",
  },
  {
    id: "meetings",
    title: "Meetings",
    description: "Schedule and start video meetings.",
    provider: "a video meeting provider",
    icon: Video,
    tint: "bg-rose-100 text-rose-700",
  },
  {
    id: "log",
    title: "Comms log",
    description: "Record calls, emails and messages you've had anywhere.",
    icon: ScrollText,
    tint: "bg-slate-100 text-slate-700",
  },
]
