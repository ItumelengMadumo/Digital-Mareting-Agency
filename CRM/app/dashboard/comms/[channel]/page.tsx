"use client"

import { use } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PlugZap, ScrollText } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PageHeader from "@/components/dashboard/page-header"
import EmailComposer from "@/components/dashboard/communications/email-composer"
import SMSComposer from "@/components/dashboard/communications/sms-composer"
import WhatsAppComposer from "@/components/dashboard/communications/whatsapp-composer"
import VoIPDialer from "@/components/dashboard/communications/voip-dialer"
import VideoConferencing from "@/components/dashboard/communications/video-conferencing"
import { COMMS_CHANNELS } from "@/lib/comms-channels"
import { cn } from "@/lib/utils"

const COMPONENTS: Record<string, React.ComponentType> = {
  email: EmailComposer,
  sms: SMSComposer,
  whatsapp: WhatsAppComposer,
  calls: VoIPDialer,
  meetings: VideoConferencing,
}

export default function CommsChannelPage({ params }: { params: Promise<{ channel: string }> }) {
  const { channel } = use(params)
  const config = COMMS_CHANNELS.find((c) => c.id === channel)
  const Component = COMPONENTS[channel]
  if (!config || !Component) notFound()

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-6">
      <PageHeader title={config.title} description={config.description} />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Alert className="border-amber-200 bg-amber-50">
            <PlugZap className="h-4 w-4 text-amber-600" />
            <AlertTitle>Not connected yet</AlertTitle>
            <AlertDescription>
              You can draft here, but nothing is sent until {config.provider} is connected.
            </AlertDescription>
          </Alert>
          <Component />
        </div>
        <aside className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <ScrollText className="h-4 w-4 text-blue-500" /> Recent
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-500">
              <p>Nothing logged for {config.title.toLowerCase()} yet. Conversations you log show up here and on the contact&apos;s timeline.</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/comms/log">Open comms log</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Other channels</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {COMMS_CHANNELS.filter((c) => c.id !== channel).map((c) => (
                <Link
                  key={c.id}
                  href={`/dashboard/comms/${c.id}`}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 p-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <span className={cn("flex h-7 w-7 items-center justify-center rounded-md", c.tint)}>
                    <c.icon className="h-4 w-4" />
                  </span>
                  <span className="truncate">{c.title}</span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
