import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 bg-slate-200" />
        <Skeleton className="h-4 w-96 bg-slate-200" />
      </div>
      <Skeleton className="h-96 w-full bg-slate-200" />
    </div>
  )
}
