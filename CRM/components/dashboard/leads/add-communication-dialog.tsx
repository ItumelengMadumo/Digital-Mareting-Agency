"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, MessageSquare, Phone, MessageCircle, Video } from "lucide-react"
import EmailComposer from "@/components/dashboard/communications/email-composer"
import SMSComposer from "@/components/dashboard/communications/sms-composer"
import WhatsAppComposer from "@/components/dashboard/communications/whatsapp-composer"
import VoIPDialer from "@/components/dashboard/communications/voip-dialer"
import VideoConferencing from "@/components/dashboard/communications/video-conferencing"

interface AddCommunicationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leadId: string
  leadName: string
  leadEmail: string
  leadPhone: string
}

export default function AddCommunicationDialog({
  open,
  onOpenChange,
  leadId,
  leadName,
  leadEmail,
  leadPhone,
}: AddCommunicationDialogProps) {
  const [activeTab, setActiveTab] = useState("email")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Communicate with {leadName}</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-slate-100">
            <TabsTrigger value="email" className="gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="sms" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              SMS
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="call" className="gap-2">
              <Phone className="h-4 w-4" />
              VOIP
            </TabsTrigger>
            <TabsTrigger value="video" className="gap-2">
              <Video className="h-4 w-4" />
              Video
            </TabsTrigger>
          </TabsList>
          <TabsContent value="email" className="mt-4">
            <EmailComposer preSelectedLead={{ id: leadId, name: leadName, email: leadEmail }} />
          </TabsContent>
          <TabsContent value="sms" className="mt-4">
            <SMSComposer preSelectedLead={{ id: leadId, name: leadName, phone: leadPhone }} />
          </TabsContent>
          <TabsContent value="whatsapp" className="mt-4">
            <WhatsAppComposer preSelectedLead={{ id: leadId, name: leadName, phone: leadPhone }} />
          </TabsContent>
          <TabsContent value="call" className="mt-4">
            <VoIPDialer preSelectedLead={{ id: leadId, name: leadName, phone: leadPhone }} />
          </TabsContent>
          <TabsContent value="video" className="mt-4">
            <VideoConferencing preSelectedLead={{ id: leadId, name: leadName, email: leadEmail }} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
