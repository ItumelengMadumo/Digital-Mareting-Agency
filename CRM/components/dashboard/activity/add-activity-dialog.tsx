"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leadId: string
}

export default function AddActivityDialog({ open, onOpenChange, leadId }: AddActivityDialogProps) {
  const [formData, setFormData] = useState({
    type: "note",
    title: "",
    description: "",
    duration: "",
    outcome: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Adding activity for lead:", leadId, formData)
    // TODO: Save activity to database
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle>Add Activity</DialogTitle>
          <DialogDescription>Record an interaction or update for this lead</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="activity-type">Activity Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger className="bg-white border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="call">Phone Call</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="note">Note</SelectItem>
                <SelectItem value="task">Task</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity-title">Title</Label>
            <Input
              id="activity-title"
              placeholder="Brief summary of the activity"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="bg-white border-slate-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity-description">Description</Label>
            <Textarea
              id="activity-description"
              placeholder="Detailed notes about this activity..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="bg-white border-slate-200"
            />
          </div>

          {(formData.type === "call" || formData.type === "meeting") && (
            <div className="space-y-2">
              <Label htmlFor="activity-duration">Duration (minutes)</Label>
              <Input
                id="activity-duration"
                type="number"
                placeholder="15"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="bg-white border-slate-200"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="activity-outcome">Outcome</Label>
            <Select value={formData.outcome} onValueChange={(value) => setFormData({ ...formData, outcome: value })}>
              <SelectTrigger className="bg-white border-slate-200">
                <SelectValue placeholder="Select outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
                <SelectItem value="follow-up">Needs Follow-up</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Activity</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
