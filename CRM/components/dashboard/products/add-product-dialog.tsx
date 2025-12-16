"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddProductDialog({ open, onOpenChange }: AddProductDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    status: "active",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Adding product:", formData)
    // TODO: Save product to database
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>Create a new product or service for your catalog</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product-name">Product Name *</Label>
            <Input
              id="product-name"
              placeholder="Enterprise CRM Package"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-white border-slate-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-description">Description</Label>
            <Textarea
              id="product-description"
              placeholder="Describe your product or service..."
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-white border-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-price">Price ($) *</Label>
              <Input
                id="product-price"
                type="number"
                placeholder="50000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="bg-white border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="bg-white border-slate-200">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="bg-white border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Product</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
