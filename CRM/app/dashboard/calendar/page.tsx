"use client"
import Calendar from "@/components/dashboard/calendar/calendar"
import CalendarSidebar from "@/components/dashboard/calendar/calendar-sidebar"

export default function CalendarPage() {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Content Calendar</h1>
        <p className="text-muted-foreground text-lg">Schedule, manage, and visualize your social media content.</p>
      </div>

      <div className="h-[calc(100vh-240px)] w-full">
        <div className="grid h-full gap-4 grid-cols-1 xl:grid-cols-[320px_1fr]">
          <CalendarSidebar />
          <div className="min-w-0 flex-1">
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  )
}
