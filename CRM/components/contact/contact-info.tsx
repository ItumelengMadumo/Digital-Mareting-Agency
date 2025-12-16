import { Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>We're here to help. Contact us by email, phone, or visit our office.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border p-4">
          <div className="flex items-center">
            <Mail className="h-5 w-5 mr-2 text-blue-500" />
            <h3 className="text-sm font-medium">Email</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Our support team typically responds within 24 hours.</p>
          <Button variant="link" className="mt-2 px-0">
            support@socialsync.com
          </Button>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center">
            <Phone className="h-5 w-5 mr-2 text-blue-500" />
            <h3 className="text-sm font-medium">Phone</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Available Monday-Friday, 9AM-5PM EST.</p>
          <Button variant="link" className="mt-2 px-0">
            +1 (555) 123-4567
          </Button>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-500" />
            <h3 className="text-sm font-medium">Office</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            SocialSync HQ
            <br />
            123 Tech Plaza, Suite 400
            <br />
            San Francisco, CA 94105
          </p>
          <Button variant="link" className="mt-2 px-0">
            Get Directions
          </Button>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium">Business Hours</h3>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <p>Monday-Friday: 9AM-5PM EST</p>
            <p>Saturday: 10AM-2PM EST</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
