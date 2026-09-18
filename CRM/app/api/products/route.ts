import { NextResponse } from "next/server"
import { withWorkspaceAuth } from "@/lib/auth-helpers"
import { createProduct, listProductsByWorkspace } from "@/lib/db/products"

// GET /api/products
export const GET = withWorkspaceAuth(async (_req, { workspaceId }) => {
  const products = await listProductsByWorkspace(workspaceId)
  products.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return NextResponse.json(products)
})

// POST /api/products
export const POST = withWorkspaceAuth(async (req, { workspaceId }) => {
  const body = await req.json()
  const { name, description, price, category } = body

  if (!name || price === undefined) {
    return NextResponse.json({ error: "name and price are required" }, { status: 400 })
  }

  const product = await createProduct({
    workspaceId,
    name,
    description: description || null,
    price: parseFloat(price),
    category: category || null,
    status: "active",
  })

  return NextResponse.json(product, { status: 201 })
})
