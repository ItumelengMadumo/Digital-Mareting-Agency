import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import AmplifyProvider from "@/components/amplify-provider"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <AmplifyProvider>{children}</AmplifyProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: "SocialSync",
  description: "Post once, go live on Instagram, Facebook, TikTok, YouTube, X and more.",
  appleWebApp: { capable: true, title: "SocialSync", statusBarStyle: "default" },
}

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}
