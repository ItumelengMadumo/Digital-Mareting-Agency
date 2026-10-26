import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import PageHeader from "@/components/dashboard/page-header"
import { COMMS_CHANNELS } from "@/lib/comms-channels"
import { cn } from "@/lib/utils"

export default function CommsOverviewPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-6">
      <PageHeader
        title="Comms"
        description="Email, messages, calls and meetings with your contacts, all logged against their timeline."
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {COMMS_CHANNELS.map((c) => (
          <Link key={c.id} href={`/dashboard/comms/${c.id}`} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-md">
              <CardContent className="flex h-full items-start gap-4 p-4">
                <span className={cn("flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl", c.tint)}>
                  <c.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{c.title}</h3>
                    {c.provider ? (
                      <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                        Not connected
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                        Ready
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{c.description}</p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-500" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
