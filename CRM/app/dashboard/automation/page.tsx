"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Plus, Zap, Mail, MessageSquare, Phone, ArrowRight, Activity, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { useWorkspace } from "@/lib/workspace-context"

const TRIGGER_LABELS: Record<string, { label: string; icon: typeof Zap; desc: string }> = {
  booking_created: { label: "Booking Created", icon: Clock, desc: "When a new booking is made" },
  invoice_overdue: { label: "Invoice Overdue", icon: Zap, desc: "When an invoice becomes overdue" },
  campaign_launched: { label: "Campaign Launched", icon: Activity, desc: "When a campaign goes live" },
  lead_created: { label: "New Lead Added", icon: Plus, desc: "When a new lead is created" },
  lead_status_changed: { label: "Lead Status Changed", icon: ArrowRight, desc: "When a lead moves to a new stage" },
}

const ACTION_LABELS: Record<string, { label: string; icon: typeof Mail }> = {
  send_whatsapp: { label: "Send WhatsApp", icon: MessageSquare },
  send_sms: { label: "Send SMS", icon: Phone },
  send_email: { label: "Send Email", icon: Mail },
  create_task: { label: "Create Task", icon: Plus },
  update_lead: { label: "Update Lead", icon: ArrowRight },
}

const SAMPLE_RULES = [
  { id: "1", name: "Welcome new leads", trigger: "lead_created", action: "send_email", actionConfig: { template: "welcome", subject: "Welcome to our platform!" }, isActive: true, _count: { automationLogs: 45 } },
  { id: "2", name: "Overdue invoice reminder", trigger: "invoice_overdue", action: "send_whatsapp", actionConfig: { message: "Hi {name}, your invoice is overdue. Please settle at your earliest convenience." }, isActive: true, _count: { automationLogs: 12 } },
  { id: "3", name: "Campaign launch notification", trigger: "campaign_launched", action: "send_email", actionConfig: { template: "campaign_launch", notifyTeam: true }, isActive: true, _count: { automationLogs: 8 } },
  { id: "4", name: "Lead qualified → SMS team", trigger: "lead_status_changed", action: "send_sms", actionConfig: { toStatus: "qualified", message: "Lead {name} has been qualified. Follow up ASAP!" }, isActive: false, _count: { automationLogs: 23 } },
  { id: "5", name: "Booking confirmation WhatsApp", trigger: "booking_created", action: "send_whatsapp", actionConfig: { message: "Hi {name}, your booking is confirmed for {date}." }, isActive: true, _count: { automationLogs: 67 } },
]

const SAMPLE_LOGS = [
  { id: "l1", ruleName: "Welcome new leads", status: "success", executedAt: "2026-04-10T09:15:00Z" },
  { id: "l2", ruleName: "Booking confirmation WhatsApp", status: "success", executedAt: "2026-04-10T08:30:00Z" },
  { id: "l3", ruleName: "Overdue invoice reminder", status: "failed", executedAt: "2026-04-09T14:00:00Z", errorMsg: "WhatsApp API rate limit" },
  { id: "l4", ruleName: "Campaign launch notification", status: "success", executedAt: "2026-04-09T10:00:00Z" },
  { id: "l5", ruleName: "Welcome new leads", status: "success", executedAt: "2026-04-08T16:45:00Z" },
]

const LOG_COLORS: Record<string, string> = { success: "bg-green-100 text-green-700", failed: "bg-red-100 text-red-600", triggered: "bg-yellow-100 text-yellow-700" }

export default function AutomationPage() {
  const { workspace } = useWorkspace()
  const [rules, setRules] = useState(SAMPLE_RULES)
  const [showAdd, setShowAdd] = useState(false)
  const [newRule, setNewRule] = useState({ name: "", trigger: "lead_created", action: "send_email" })

  const activeRules = rules.filter((r) => r.isActive).length
  const totalExecutions = rules.reduce((s, r) => s + (r._count?.automationLogs || 0), 0)

  const toggleRule = (id: string) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, isActive: !r.isActive } : r))
  }

  const handleAdd = async () => {
    const rule = {
      id: `rule${Date.now()}`,
      ...newRule,
      actionConfig: {},
      isActive: true,
      _count: { automationLogs: 0 },
    }
    try {
      const res = await fetch("/api/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newRule, workspaceId: workspace?.id, actionConfig: {} }),
      })
      if (res.ok) {
        const data = await res.json()
        setRules((prev) => [{ ...data, _count: { automationLogs: 0 } }, ...prev])
      } else {
        setRules((prev) => [rule, ...prev])
      }
    } catch {
      setRules((prev) => [rule, ...prev])
    }
    setShowAdd(false)
    setNewRule({ name: "", trigger: "lead_created", action: "send_email" })
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automation Engine</h1>
          <p className="text-muted-foreground mt-1">Event-based triggers: IF event → THEN action</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> New Rule</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Automation Rule</DialogTitle><DialogDescription>Define a trigger and action for automated workflows.</DialogDescription></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Rule Name</Label><Input placeholder="e.g. Welcome new leads" value={newRule.name} onChange={(e) => setNewRule((p) => ({ ...p, name: e.target.value }))} /></div>
              <div className="space-y-2"><Label>When this happens (Trigger)</Label>
                <Select value={newRule.trigger} onValueChange={(v) => setNewRule((p) => ({ ...p, trigger: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(TRIGGER_LABELS).map(([key, { label, desc }]) => (
                      <SelectItem key={key} value={key}>{label} — {desc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Do this (Action)</Label>
                <Select value={newRule.action} onValueChange={(v) => setNewRule((p) => ({ ...p, action: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(ACTION_LABELS).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={!newRule.name}>Create Rule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Rules</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{rules.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Active Rules</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{activeRules}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Executions</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalExecutions}</div></CardContent></Card>
      </div>

      {/* Rules */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Rules</h2>
        {rules.map((rule) => {
          const TriggerInfo = TRIGGER_LABELS[rule.trigger]
          const ActionInfo = ACTION_LABELS[rule.action]
          return (
            <Card key={rule.id} className={`${rule.isActive ? "" : "opacity-60"}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{rule.name}</span>
                        {!rule.isActive && <Badge variant="outline" className="text-xs">Disabled</Badge>}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">IF {TriggerInfo?.label || rule.trigger}</Badge>
                        <ArrowRight className="h-3 w-3" />
                        <Badge variant="secondary" className="text-xs">THEN {ActionInfo?.label || rule.action}</Badge>
                        <span>• {rule._count?.automationLogs || 0} executions</span>
                      </div>
                    </div>
                  </div>
                  <Switch checked={rule.isActive} onCheckedChange={() => toggleRule(rule.id)} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Logs */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <Card>
          <CardContent className="p-0">
            {SAMPLE_LOGS.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{log.ruleName}</span>
                  {log.errorMsg && <span className="text-xs text-red-500">{log.errorMsg}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{new Date(log.executedAt).toLocaleString()}</span>
                  <Badge className={LOG_COLORS[log.status]}>{log.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
