"use client"
import Link from "next/link"
import { PenSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import Calendar from "@/components/dashboard/calendar/calendar"
import CalendarSidebar from "@/components/dashboard/calendar/calendar-sidebar"
import PageHeader from "@/components/dashboard/page-header"

export default function CalendarPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-6">
      <PageHeader
        title="Calendar"
        description="Scheduled posts on their publish time, drafts on the day you wrote them."
        actions={
          <Button className="hidden bg-blue-500 hover:bg-blue-600 sm:inline-flex" asChild>
            <Link href="/dashboard/compose">
              <PenSquare className="mr-2 h-4 w-4" />
              New post
            </Link>
          </Button>
        }
      />
      <div className="grid gap-4 xl:grid-cols-[300px_1fr]">
        <div className="order-2 xl:order-1">
          <CalendarSidebar />
        </div>
        <div className="order-1 min-w-0 xl:order-2">
          <Calendar />
        </div>
      </div>
    </div>
  )
}
