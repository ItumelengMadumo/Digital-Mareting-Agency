"use client"

import { useMemo, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MoreHorizontal,
  Music2,
  Youtube,
} from "lucide-react"
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

// Helper function to get platform icon
const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "facebook":
      return <Facebook className="h-3 w-3 text-blue-600" />
    case "twitter":
      return <Twitter className="h-3 w-3 text-sky-500" />
    case "instagram":
      return <Instagram className="h-3 w-3 text-pink-600" />
    case "linkedin":
      return <Linkedin className="h-3 w-3 text-blue-800" />
    case "youtube":
    case "youtube_shorts":
      return <Youtube className="h-3 w-3 text-red-600" />
    case "tiktok":
      return <Music2 className="h-3 w-3 text-slate-900" />
    default:
      return null
  }
}

interface CalendarPost {
  id: string
  date: Date
  content: string
  platforms: string[]
}

export default function Calendar() {
  const { posts } = usePosts()
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
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-5 w-5" />
          <h2 className="text-lg font-medium">Content Calendar</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium min-w-[120px] text-center">
            {monthNames[currentMonth]} {currentYear}
          </div>
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
          <div key={`empty-${index}`} className="bg-card p-2 h-24 sm:h-28 lg:h-32" />
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
                "bg-card border-t p-1 h-24 sm:h-28 lg:h-32 overflow-hidden",
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
                      <Button variant="ghost" size="icon" className="h-5 w-5">
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
                <div className="space-y-1">
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
