"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { PlugZap } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import EmailComposer from "@/components/dashboard/communications/email-composer"
import SMSComposer from "@/components/dashboard/communications/sms-composer"
import WhatsAppComposer from "@/components/dashboard/communications/whatsapp-composer"
import VoIPDialer from "@/components/dashboard/communications/voip-dialer"
import VideoConferencing from "@/components/dashboard/communications/video-conferencing"

const CHANNELS: Record<string, { title: string; description: string; provider: string; Component: React.ComponentType }> = {
  email: {
    title: "Email",
    description: "Write and send emails to your contacts and leads.",
    provider: "an email provider (Amazon SES or SendGrid)",
    Component: EmailComposer,
  },
  sms: {
    title: "SMS",
    description: "Send text messages to your contacts.",
    provider: "an SMS gateway",
    Component: SMSComposer,
  },
  whatsapp: {
    title: "WhatsApp",
    description: "Message contacts on WhatsApp Business.",
    provider: "the WhatsApp Business Platform",
    Component: WhatsAppComposer,
  },
  calls: {
    title: "Calls (VoIP)",
    description: "Call contacts from your browser.",
    provider: "a VoIP provider with South African numbers",
    Component: VoIPDialer,
  },
  meetings: {
    title: "Meetings",
    description: "Schedule and start video meetings.",
    provider: "a video meeting provider",
    Component: VideoConferencing,
  },
}

export default function CommsChannelPage({ params }: { params: Promise<{ channel: string }> }) {
  const { channel } = use(params)
  const config = CHANNELS[channel]
  if (!config) notFound()
  const { Component } = config

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{config.title}</h1>
        <p className="mt-1 text-muted-foreground">{config.description}</p>
      </div>
      <Alert className="border-amber-200 bg-amber-50">
        <PlugZap className="h-4 w-4 text-amber-600" />
        <AlertTitle>Not connected yet</AlertTitle>
        <AlertDescription>
          You can draft here, but nothing is sent until {config.provider} is connected. Use the Comms log to record
          conversations you&apos;ve had elsewhere.
        </AlertDescription>
      </Alert>
      <Component />
    </div>
  )
}
