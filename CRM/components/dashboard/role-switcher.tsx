"use client"

import { useRole } from "@/lib/role-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Shield, UserCheck, ChevronDown } from "lucide-react"

export function RoleSwitcher() {
  const { role, setRole, isExecutive } = useRole()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
        >
          {isExecutive ? (
            <>
              <Shield className="h-4 w-4 text-purple-600" />
              <span className="hidden sm:inline">Executive</span>
            </>
          ) : (
            <>
              <UserCheck className="h-4 w-4 text-blue-600" />
              <span className="hidden sm:inline">Sales & Marketing</span>
            </>
          )}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Switch Role View</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setRole("sales")} className="cursor-pointer">
          <UserCheck className="mr-2 h-4 w-4 text-blue-600" />
          <div className="flex flex-col">
            <span className="font-medium">Sales & Marketing</span>
            <span className="text-xs text-muted-foreground">Create and manage leads</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setRole("executive")} className="cursor-pointer">
          <Shield className="mr-2 h-4 w-4 text-purple-600" />
          <div className="flex flex-col">
            <span className="font-medium">Executive</span>
            <span className="text-xs text-muted-foreground">Oversee team and reports</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
