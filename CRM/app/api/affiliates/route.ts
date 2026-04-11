import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/affiliates
export async function GET() {
  try {
    const affiliates = await prisma.affiliate.findMany({
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        conversions: { orderBy: { createdAt: "desc" }, take: 10 },
      },
    })
    return NextResponse.json(affiliates)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

// POST /api/affiliates
export async function POST(req: Request) {
  try {
    const { userId, commissionRate } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    // Generate unique referral code
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const code = `${user.firstName.toUpperCase().slice(0, 3)}${Date.now().toString(36).toUpperCase()}`

    const affiliate = await prisma.affiliate.create({
      data: {
        userId,
        referralCode: code,
        commissionRate: commissionRate || 0.1,
      },
    })

    return NextResponse.json(affiliate, { status: 201 })
  } catch (error) {
    console.error("Affiliate creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
