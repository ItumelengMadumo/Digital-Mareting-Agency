"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { initials, useCurrentUser } from "@/lib/use-current-user"

const EMPTY = { firstName: "", lastName: "", handle: "", phone: "", bio: "", timezone: "", avatarUrl: "" }

export default function ProfilePage() {
  const { user, loading, setUser } = useCurrentUser()
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null)

  useEffect(() => {
    if (!user) return
    setForm({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      handle: user.handle ?? "",
      phone: user.phone ?? "",
      bio: user.bio ?? "",
      timezone: user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      avatarUrl: user.avatarUrl ?? "",
    })
  }, [user])

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not save your profile")
      setUser(data)
      setMessage({ type: "ok", text: "Profile saved." })
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Could not save your profile" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Skeleton className="mx-auto h-96 w-full max-w-3xl rounded-xl" />
  if (!user) return <p className="text-sm text-red-600">Could not load your profile. Try refreshing the page.</p>

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-muted-foreground">How you appear in SocialSync.</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
          <Avatar className="h-20 w-20">
            {form.avatarUrl && <AvatarImage src={form.avatarUrl} alt="" />}
            <AvatarFallback className="bg-blue-100 text-2xl font-semibold text-blue-700">{initials(user)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xl font-semibold">
              {form.firstName} {form.lastName}
            </p>
            {form.handle && <p className="text-blue-600">@{form.handle}</p>}
            <p className="text-sm text-slate-500">
              {user.email} · member since {format(new Date(user.createdAt), "MMMM yyyy")}
            </p>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>Your email is your login and can&apos;t be changed here.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" value={form.firstName} onChange={set("firstName")} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" value={form.lastName} onChange={set("lastName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="handle">Creator handle</Label>
              <Input id="handle" value={form.handle} onChange={set("handle")} placeholder="yourhandle" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={set("phone")} placeholder="+27 ..." />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" value={form.bio} onChange={set("bio")} rows={3} maxLength={500} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Time zone</Label>
              <Input id="timezone" value={form.timezone} onChange={set("timezone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatarUrl">Photo URL</Label>
              <Input id="avatarUrl" type="url" value={form.avatarUrl} onChange={set("avatarUrl")} placeholder="https://" />
            </div>
          </CardContent>
          <CardFooter className="flex items-center gap-4">
            <Button type="submit" disabled={saving} className="bg-blue-500 hover:bg-blue-600">
              {saving ? "Saving..." : "Save profile"}
            </Button>
            {message && (
              <p className={message.type === "ok" ? "text-sm text-green-600" : "text-sm text-red-600"}>{message.text}</p>
            )}
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
