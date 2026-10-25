"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { User, Bell, Shield, Building2, Palette, Database, CreditCard } from "lucide-react"
import { useRole } from "@/lib/workspace-context"

export default function SettingsPage() {
  const { isExecutive } = useRole()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Workspace, notifications and security. Your name, photo and bio are on your{" "}
          <Link href="/dashboard/profile" className="text-blue-600 hover:underline">
            profile
          </Link>
          .
        </p>
      </div>

      <Tabs defaultValue="usage" className="w-full">
        <TabsList className="h-auto flex-wrap justify-start bg-slate-100">
          <TabsTrigger value="usage" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Usage &amp; billing
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          {isExecutive && (
            <>
              <TabsTrigger value="team" className="gap-2">
                <Building2 className="h-4 w-4" />
                Team Management
              </TabsTrigger>
              <TabsTrigger value="system" className="gap-2">
                <Database className="h-4 w-4" />
                System
              </TabsTrigger>
            </>
          )}
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="mt-6">
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle>Usage &amp; billing</CardTitle>
              <CardDescription>Your plan and what you&apos;ve used this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div>
                  <p className="font-medium">Free pilot</p>
                  <p className="text-muted-foreground">No charges during the pilot. Paid plans start after it.</p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/pricing">See plans</Link>
                </Button>
              </div>
              <p className="text-muted-foreground">
                Monthly publishes per platform will show here once publishing to your connected accounts is switched on.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Lead Notifications</Label>
                    <p className="text-sm text-slate-500">Get notified when a new lead is created</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Communication Updates</Label>
                    <p className="text-sm text-slate-500">Alerts for new messages and calls</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Deal Status Changes</Label>
                    <p className="text-sm text-slate-500">Updates when deal status changes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Digest</Label>
                    <p className="text-sm text-slate-500">Daily summary of activities</p>
                  </div>
                  <Switch />
                </div>
              </div>
              <Separator />
              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {isExecutive && (
          <>
            <TabsContent value="team" className="mt-6">
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle>Team Management</CardTitle>
                  <CardDescription>Manage team members and their access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">Sarah Johnson</p>
                        <p className="text-sm text-slate-600">Sales & Marketing</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">Mike Davis</p>
                        <p className="text-sm text-slate-600">Sales & Marketing</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">Emily Chen</p>
                        <p className="text-sm text-slate-600">Sales & Marketing</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <Button className="gap-2">
                    <User className="h-4 w-4" />
                    Add Team Member
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="mt-6">
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure system-wide settings and integrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input id="company" placeholder="Your Company Inc." className="bg-white border-slate-200" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="timezone">Time Zone</Label>
                      <Input id="timezone" placeholder="UTC-5 (EST)" className="bg-white border-slate-200" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="currency">Default Currency</Label>
                      <Input id="currency" placeholder="USD" className="bg-white border-slate-200" />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-semibold">Integrations</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Integration</Label>
                        <p className="text-sm text-slate-500">Connect email service</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>WhatsApp Business API</Label>
                        <p className="text-sm text-slate-500">Connect WhatsApp for messaging</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>VOIP Provider</Label>
                        <p className="text-sm text-slate-500">Connect calling service</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <Button>Save System Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}

        <TabsContent value="appearance" className="mt-6">
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the application looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-slate-500">Enable dark theme</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact View</Label>
                    <p className="text-sm text-slate-500">Use condensed layout</p>
                  </div>
                  <Switch />
                </div>
              </div>
              <Separator />
              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" className="bg-white border-slate-200" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" className="bg-white border-slate-200" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" className="bg-white border-slate-200" />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-slate-500">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
              </div>
              <Separator />
              <Button>Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
