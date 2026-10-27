import Link from "next/link"
import { Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-7xl justify-center py-10">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
            <Compass className="h-6 w-6 text-blue-500" />
          </span>
          <h1 className="text-xl font-semibold text-slate-900">We couldn&apos;t find that page</h1>
          <p className="text-sm text-slate-500">It may have moved, or it isn&apos;t part of the pilot yet.</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <Button asChild className="bg-blue-500 hover:bg-blue-600">
              <Link href="/dashboard">Go to Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/compose">Compose a post</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
