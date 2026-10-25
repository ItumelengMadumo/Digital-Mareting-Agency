"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { getUrl, list, remove, uploadData } from "aws-amplify/storage"
import { formatDistanceToNow } from "date-fns"
import { FileVideo, ImageIcon, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface MediaItem {
  path: string
  name: string
  size?: number
  lastModified?: Date
  url?: string
  isVideo: boolean
}

const MEDIA_PATH = ({ identityId }: { identityId?: string }) => `media/${identityId}/`

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[] | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    try {
      const { items: files } = await list({ path: MEDIA_PATH, options: { listAll: true } })
      const withUrls = await Promise.all(
        files
          .filter((f) => !f.path.endsWith("/"))
          .map(async (f) => ({
            path: f.path,
            name: f.path.split("/").pop()!.replace(/^\d+-/, ""),
            size: f.size,
            lastModified: f.lastModified,
            isVideo: /\.(mp4|mov|webm|m4v)$/i.test(f.path),
            url: (await getUrl({ path: f.path, options: { expiresIn: 3600 } })).url.toString(),
          })),
      )
      withUrls.sort((a, b) => (b.lastModified?.getTime() ?? 0) - (a.lastModified?.getTime() ?? 0))
      setItems(withUrls)
      setError("")
    } catch {
      setItems([])
      setError("Could not load your media. Try refreshing the page.")
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return
    setUploading(true)
    setError("")
    try {
      for (const file of Array.from(files)) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
        await uploadData({
          path: ({ identityId }) => `media/${identityId}/${Date.now()}-${safeName}`,
          data: file,
          options: { contentType: file.type },
        }).result
      }
      await load()
    } catch {
      setError("Upload failed. Check the file and try again.")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const handleDelete = async (path: string) => {
    if (!confirm("Delete this file? Posts that use it will lose their media.")) return
    await remove({ path })
    setItems((prev) => prev?.filter((i) => i.path !== path) ?? null)
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media library</h1>
          <p className="mt-1 text-muted-foreground">Photos and videos you&apos;ve uploaded, ready to reuse in posts.</p>
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button onClick={() => inputRef.current?.click()} disabled={uploading} className="bg-blue-500 hover:bg-blue-600">
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {items === null ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <ImageIcon className="h-10 w-10 text-slate-300" />
            <h3 className="font-semibold text-slate-800">No media yet</h3>
            <p className="max-w-sm text-sm text-slate-500">
              Upload photos and videos here, or add them while composing a post.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <Card key={item.path} className="group overflow-hidden">
              <div className="relative aspect-square bg-slate-100">
                {item.isVideo ? (
                  item.url ? (
                    <video src={item.url} className="h-full w-full object-cover" muted playsInline controls />
                  ) : (
                    <FileVideo className="m-auto h-10 w-10 text-slate-300" />
                  )
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                )}
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => handleDelete(item.path)}
                  aria-label={`Delete ${item.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-3">
                <p className="truncate text-sm font-medium">{item.name}</p>
                {item.lastModified && (
                  <p className="text-xs text-slate-500">
                    {formatDistanceToNow(item.lastModified, { addSuffix: true })}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
