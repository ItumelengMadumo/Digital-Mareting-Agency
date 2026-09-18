import { NextResponse } from "next/server"
import { getCurrentUser, HttpError } from "@/lib/auth-helpers"
import { createAffiliate, getAffiliateByUser } from "@/lib/db/affiliates"
import { listConversionsByAffiliate } from "@/lib/db/affiliate-conversions"
import { getUserById } from "@/lib/db/users"

// GET /api/affiliates - the current session user's own affiliate profile (not a global admin list)
export async function GET() {
  try {
    const user = await getCurrentUser()
    const affiliate = await getAffiliateByUser(user.id)
    if (!affiliate) return NextResponse.json([])

    const conversions = await listConversionsByAffiliate(affiliate.id)
    conversions.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

    return NextResponse.json([
      { ...affiliate, user: { id: user.id, email: user.email }, conversions: conversions.slice(0, 10) },
    ])
  } catch (error) {
    if (error instanceof HttpError) return NextResponse.json({ error: error.message }, { status: error.status })
    console.error("Affiliate list error:", error)
    return NextResponse.json([], { status: 200 })
  }
}

// POST /api/affiliates - create the current session user's own affiliate profile
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    const { commissionRate } = await req.json()

    const existing = await getAffiliateByUser(user.id)
    if (existing) return NextResponse.json({ error: "Affiliate profile already exists" }, { status: 409 })

    const dbUser = await getUserById(user.id)
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const code = `${dbUser.firstName.toUpperCase().slice(0, 3)}${Date.now().toString(36).toUpperCase()}`

    const affiliate = await createAffiliate({
      userId: user.id,
      referralCode: code,
      commissionRate: commissionRate || 0.1,
      totalEarnings: 0,
    })

    return NextResponse.json(affiliate, { status: 201 })
  } catch (error) {
    if (error instanceof HttpError) return NextResponse.json({ error: error.message }, { status: error.status })
    console.error("Affiliate creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
