import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/products
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")

    const products = await prisma.product.findMany({
      where: workspaceId ? { workspaceId } : {},
      include: { _count: { select: { deals: true } } },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(products)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

// POST /api/products
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { workspaceId, name, description, price, category } = body

    if (!workspaceId || !name || price === undefined) {
      return NextResponse.json({ error: "workspaceId, name, and price are required" }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        workspaceId,
        name,
        description: description || null,
        price: parseFloat(price),
        category: category || null,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Product creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
