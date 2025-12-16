"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

interface LeadNotesProps {
  leadId: string
}

export default function LeadNotes({ leadId }: LeadNotesProps) {
  const [newNote, setNewNote] = useState("")

  // Mock notes data
  const notes = [
    {
      id: "1",
      content:
        "Lead is very interested in the enterprise features. Mentioned they're currently using a competitor's product but not satisfied with the support.",
      user: "Sarah Johnson",
      timestamp: "2 days ago",
    },
    {
      id: "2",
      content: "Decision maker confirmed. Budget approved for Q2.",
      user: "Sarah Johnson",
      timestamp: "5 days ago",
    },
  ]

  const handleAddNote = () => {
    if (newNote.trim()) {
      // TODO: Save note to database
      console.log("[v0] New note:", newNote)
      setNewNote("")
    }
  }

  return (
    <Card className="bg-white border-slate-200">
      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Add Note</h3>
          <Textarea
            placeholder="Add a note about this lead..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
            className="bg-white border-slate-200"
          />
          <Button onClick={handleAddNote} className="mt-2 gap-2">
            <Plus className="h-4 w-4" />
            Add Note
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">All Notes</h3>
          {notes.map((note) => (
            <div key={note.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50">
              <p className="text-sm">{note.content}</p>
              <p className="text-xs text-slate-500 mt-2">
                {note.user} • {note.timestamp}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
