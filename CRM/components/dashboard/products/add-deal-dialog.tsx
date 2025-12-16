"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddDealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leadId: string
}

export default function AddDealDialog({ open, onOpenChange, leadId }: AddDealDialogProps) {
  const [formData, setFormData] = useState({
    product: "",
    quantity: "1",
    price: "",
    discount: "",
    status: "proposed",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Adding deal for lead:", leadId, formData)
    // TODO: Save deal to database
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle>Add Product to Deal</DialogTitle>
          <DialogDescription>Add a product or service to this lead's deal</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deal-product">Select Product *</Label>
            <Select value={formData.product} onValueChange={(value) => setFormData({ ...formData, product: value })}>
              <SelectTrigger className="bg-white border-slate-200">
                <SelectValue placeholder="Choose a product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Enterprise CRM Package - $50,000</SelectItem>
                <SelectItem value="2">Professional CRM Package - $25,000</SelectItem>
                <SelectItem value="3">Consulting Services - $10,000</SelectItem>
                <SelectItem value="4">Training Package - $5,000</SelectItem>
                <SelectItem value="5">Custom Development - $75,000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deal-quantity">Quantity *</Label>
              <Input
                id="deal-quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
                className="bg-white border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deal-price">Custom Price ($)</Label>
              <Input
                id="deal-price"
                type="number"
                placeholder="Leave blank for default"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="bg-white border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deal-discount">Discount (%)</Label>
              <Input
                id="deal-discount"
                type="number"
                min="0"
                max="100"
                placeholder="0"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="bg-white border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deal-status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="bg-white border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="proposed">Proposed</SelectItem>
                  <SelectItem value="negotiating">Negotiating</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add to Deal</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
