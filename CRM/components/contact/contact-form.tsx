"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)
    }, 1500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Get in Touch</CardTitle>
        <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">First name</Label>
              <Input id="first-name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select>
              <SelectTrigger id="subject">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Inquiry</SelectItem>
                <SelectItem value="support">Technical Support</SelectItem>
                <SelectItem value="sales">Sales Question</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="How can we help you?" className="min-h-[120px]" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting || isSuccess}>
            {isSubmitting ? "Sending..." : isSuccess ? "Message Sent!" : "Send Message"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
