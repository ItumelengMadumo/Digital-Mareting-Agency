"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import AddDealDialog from "@/components/dashboard/products/add-deal-dialog"

interface LeadProductsProps {
  leadId: string
}

export default function LeadProducts({ leadId }: LeadProductsProps) {
  const [isAddDealOpen, setIsAddDealOpen] = useState(false)

  // Mock products data
  const products = [
    {
      id: "1",
      name: "Enterprise CRM Package",
      quantity: 1,
      price: 50000,
      status: "proposed",
    },
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      proposed: "bg-yellow-100 text-yellow-700 border-yellow-200",
      accepted: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
      negotiating: "bg-orange-100 text-orange-700 border-orange-200",
    }
    return colors[status] || colors.proposed
  }

  return (
    <Card className="bg-white border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Products & Deals</h3>
          <Button size="sm" className="gap-2" onClick={() => setIsAddDealOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50"
            >
              <div>
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-sm text-slate-600 mt-1">Quantity: {product.quantity}</p>
              </div>
              <div className="text-right">
                <div className="font-semibold">${product.price.toLocaleString()}</div>
                <Badge variant="outline" className={`mt-1 ${getStatusColor(product.status)}`}>
                  {product.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total Deal Value</span>
            <span>${products.reduce((sum, p) => sum + p.price, 0).toLocaleString()}</span>
          </div>
        </div>
      </CardContent>

      <AddDealDialog open={isAddDealOpen} onOpenChange={setIsAddDealOpen} leadId={leadId} />
    </Card>
  )
}
