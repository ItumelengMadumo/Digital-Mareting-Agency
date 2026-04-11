"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import ProductsList from "@/components/dashboard/products/products-list"
import AddProductDialog from "@/components/dashboard/products/add-product-dialog"
import ProductsStats from "@/components/dashboard/products/products-stats"
import { useRole } from "@/lib/workspace-context"

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const { isExecutive } = useRole()

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products & Services</h1>
          <p className="text-muted-foreground mt-1">
            {isExecutive ? "Manage your product catalog and pricing" : "Browse available products and services"}
          </p>
        </div>
        {isExecutive && (
          <Button onClick={() => setIsAddProductOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        )}
      </div>

      <ProductsStats />

      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>
            {isExecutive ? "View and manage all your products and services" : "View all available products"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-slate-200"
            />
          </div>

          <ProductsList searchQuery={searchQuery} readOnly={!isExecutive} />
        </CardContent>
      </Card>

      {isExecutive && <AddProductDialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen} />}
    </div>
  )
}
