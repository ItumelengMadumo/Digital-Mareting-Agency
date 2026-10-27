"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, CalendarIcon, MoreHorizontal } from "lucide-react"
import PlatformIcon from "@/components/platform-icon"
import Link from "next/link"
import { usePosts } from "@/lib/posts"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// Helper function for generating calendar days
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay()
}

const getPlatformIcon = (platform: string) => <PlatformIcon id={platform} className="h-3 w-3" />

interface CalendarPost {
  id: string
  date: Date
  content: string
  platforms: string[]
}

export default function Calendar() {
  const { posts, loading } = usePosts()
  // Scheduled posts sit on their publish time; drafts on the day they were written.
  const calendarPosts: CalendarPost[] = useMemo(
    () =>
      posts.map((p) => ({
        id: p.id,
        date: new Date(p.scheduledAt ?? p.createdAt),
        content: p.captionMaster,
        platforms: p.variants.map((v) => v.platform),
      })),
    [posts],
  )
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(currentYear, currentMonth, day))
  }

  // Filter posts for the current month
  const postsThisMonth = calendarPosts.filter(
    (post) => post.date.getMonth() === currentMonth && post.date.getFullYear() === currentYear,
  )

  // Group posts by date
  const postsByDate: Record<number, CalendarPost[]> = {}
  postsThisMonth.forEach((post) => {
    const day = post.date.getDate()
    if (!postsByDate[day]) {
      postsByDate[day] = []
    }
    postsByDate[day].push(post)
  })

  return (
    <div className="relative bg-card rounded-lg border shadow-sm overflow-hidden">
      {!loading && posts.length === 0 && (
        <div className="absolute inset-x-0 bottom-0 top-14 z-10 flex items-center justify-center bg-white/70 p-4 backdrop-blur-[1px]">
          <div className="max-w-sm rounded-xl border border-slate-200 bg-white p-6 text-center shadow-lg">
            <CalendarIcon className="mx-auto h-8 w-8 text-blue-500" />
            <h3 className="mt-3 font-semibold text-slate-900">Nothing on your calendar yet</h3>
            <p className="mt-1 text-sm text-slate-500">
              Scheduled posts appear on the day they go out, and drafts on the day you wrote them.
            </p>
            <Button asChild className="mt-4 bg-blue-500 hover:bg-blue-600">
              <Link href="/dashboard/compose">Schedule your first post</Link>
            </Button>
          </div>
        </div>
      )}
      <div className="p-3 sm:p-4 flex justify-between items-center gap-2">
        <div className="flex items-center min-w-0">
          <CalendarIcon className="mr-2 h-5 w-5 flex-shrink-0 text-blue-500" />
          <h2 className="truncate text-base font-semibold sm:text-lg">
            {monthNames[currentMonth]} {currentYear}
          </h2>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-muted">
        {weekDays.map((day) => (
          <div key={day} className="bg-card p-2 text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}

        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="bg-card p-2 h-14 sm:h-28 lg:h-32" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1
          const date = new Date(currentYear, currentMonth, day)
          const isToday = new Date().toDateString() === date.toDateString()
          const isSelected = selectedDate?.toDateString() === date.toDateString()
          const hasPosts = !!postsByDate[day]

          return (
            <div
              key={day}
              className={cn(
                "bg-card border-t p-1 h-14 sm:h-28 lg:h-32 overflow-hidden",
                isSelected ? "ring-2 ring-primary" : "",
                isToday ? "bg-muted/50" : "",
              )}
              onClick={() => handleDateClick(day)}
            >
              <div className="flex justify-between items-start mb-1">
                <span
                  className={cn(
                    "text-xs font-semibold h-5 w-5 flex items-center justify-center rounded-full",
                    isToday ? "bg-primary text-primary-foreground" : "",
                  )}
                >
                  {day}
                </span>
                {hasPosts && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="hidden h-5 w-5 sm:inline-flex">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/compose">Add post</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/posts">View all posts</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {hasPosts && (
                <div className="flex justify-center gap-0.5 sm:hidden" aria-label={`${postsByDate[day].length} posts`}>
                  {postsByDate[day].slice(0, 3).map((post) => (
                    <span key={post.id} className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  ))}
                </div>
              )}
              {hasPosts && (
                <div className="hidden space-y-1 sm:block">
                  {postsByDate[day].slice(0, 2).map((post) => (
                    <div key={post.id} className="text-xs p-1 rounded bg-accent truncate flex items-center">
                      <div className="flex space-x-0.5 mr-1">
                        {post.platforms.slice(0, 2).map((platform) => (
                          <span key={platform}>{getPlatformIcon(platform)}</span>
                        ))}
                        {post.platforms.length > 2 && (
                          <span className="text-[10px] text-muted-foreground">+{post.platforms.length - 2}</span>
                        )}
                      </div>
                      <span className="truncate">{post.content}</span>
                    </div>
                  ))}
                  {postsByDate[day].length > 2 && (
                    <div className="text-[10px] text-muted-foreground pl-1">+{postsByDate[day].length - 2} more</div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
