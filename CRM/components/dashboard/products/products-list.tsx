"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Eye, Trash2 } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  status: "active" | "inactive"
  deals: number
}

// Mock data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Enterprise CRM Package",
    description: "Full-featured CRM with unlimited users",
    price: 50000,
    category: "Software",
    status: "active",
    deals: 12,
  },
  {
    id: "2",
    name: "Professional CRM Package",
    description: "CRM for small to medium businesses",
    price: 25000,
    category: "Software",
    status: "active",
    deals: 24,
  },
  {
    id: "3",
    name: "Consulting Services",
    description: "Expert consulting and implementation",
    price: 10000,
    category: "Services",
    status: "active",
    deals: 8,
  },
  {
    id: "4",
    name: "Training Package",
    description: "Comprehensive team training",
    price: 5000,
    category: "Services",
    status: "active",
    deals: 15,
  },
  {
    id: "5",
    name: "Custom Development",
    description: "Tailored solutions for unique needs",
    price: 75000,
    category: "Development",
    status: "active",
    deals: 3,
  },
]

interface ProductsListProps {
  searchQuery: string
  readOnly?: boolean // Added readOnly prop for sales/marketing view
}

export default function ProductsList({ searchQuery, readOnly = false }: ProductsListProps) {
  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="rounded-md border border-slate-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead>Product Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Active Deals</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                No products found
              </TableCell>
            </TableRow>
          ) : (
            filteredProducts.map((product) => (
              <TableRow key={product.id} className="hover:bg-slate-50">
                <TableCell>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-slate-500">{product.description}</div>
                  </div>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="font-medium">${product.price.toLocaleString()}</TableCell>
                <TableCell>{product.deals}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      product.status === "active"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {!readOnly && (
                      <>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
