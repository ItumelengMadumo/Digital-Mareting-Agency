"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export function TimePicker({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [time, setTime] = React.useState<string>("")

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !time && "text-muted-foreground")}
          >
            <Clock className="mr-2 h-4 w-4" />
            {time ? time : <span>Pick a time</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4">
          <div className="space-y-2">
            <div className="grid gap-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-1">
                  <label htmlFor="hours" className="text-xs font-medium">
                    Hours
                  </label>
                  <Input
                    id="hours"
                    className="h-8"
                    type="number"
                    min={0}
                    max={23}
                    onChange={(e) => {
                      const hours = e.target.value.padStart(2, "0")
                      const [_, minutes] = time.split(":") || ["", "00"]
                      setTime(`${hours}:${minutes}`)
                    }}
                  />
                </div>
                <div className="grid gap-1">
                  <label htmlFor="minutes" className="text-xs font-medium">
                    Minutes
                  </label>
                  <Input
                    id="minutes"
                    className="h-8"
                    type="number"
                    min={0}
                    max={59}
                    onChange={(e) => {
                      const minutes = e.target.value.padStart(2, "0")
                      const [hours] = time.split(":") || ["00"]
                      setTime(`${hours}:${minutes}`)
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={() => {
                  const now = new Date()
                  const hours = now.getHours().toString().padStart(2, "0")
                  const minutes = now.getMinutes().toString().padStart(2, "0")
                  setTime(`${hours}:${minutes}`)
                }}
              >
                Now
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
