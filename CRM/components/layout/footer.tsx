"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react"

export default function Footer() {
  const pathname = usePathname()

  // Don't show footer on dashboard pages
  if (pathname.startsWith("/dashboard")) {
    return null
  }

  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link href="#" className="text-muted-foreground hover:text-primary">
            <span className="sr-only">Facebook</span>
            <Facebook className="h-5 w-5" />
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary">
            <span className="sr-only">Instagram</span>
            <Instagram className="h-5 w-5" />
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary">
            <span className="sr-only">Twitter</span>
            <Twitter className="h-5 w-5" />
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary">
            <span className="sr-only">LinkedIn</span>
            <Linkedin className="h-5 w-5" />
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary">
            <span className="sr-only">GitHub</span>
            <Github className="h-5 w-5" />
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-muted-foreground">
            &copy; {new Date().getFullYear()} SocialSync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
