"use client"

import Link from "next/link"
import { ChevronDown, LogIn, PlayCircle, UserPlus } from "lucide-react"
import { Button, type ButtonProps } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TrialMenuProps {
  size?: ButtonProps["size"]
  className?: string
  align?: "start" | "center" | "end"
}

export default function TrialMenu({ size, className, align = "end" }: TrialMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={size} className={className}>
          Start free trial
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/auth/register">
            <UserPlus className="mr-2 h-4 w-4" />
            Create free account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/auth/login">
            <LogIn className="mr-2 h-4 w-4" />
            Log in
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/demo">
            <PlayCircle className="mr-2 h-4 w-4" />
            View live demo
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
