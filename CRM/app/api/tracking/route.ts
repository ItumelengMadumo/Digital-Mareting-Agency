import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { buildUtmLink, generatePromoCode, generateShortCode, getQrCodeUrl } from "@/lib/tracking"

// GET /api/tracking
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")

    const assets = await prisma.trackingAsset.findMany({
      where: workspaceId ? { workspaceId } : {},
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(assets)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

// POST /api/tracking
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { workspaceId, type, name, campaignId, baseUrl, utmSource, utmMedium, utmCampaign, prefix } = body

    if (!workspaceId || !type || !name) {
      return NextResponse.json({ error: "workspaceId, type, and name are required" }, { status: 400 })
    }

    let value = ""

    switch (type) {
      case "utm_link":
        if (!baseUrl || !utmSource || !utmMedium || !utmCampaign) {
          return NextResponse.json({ error: "UTM parameters are required" }, { status: 400 })
        }
        value = buildUtmLink({ baseUrl, source: utmSource, medium: utmMedium, campaign: utmCampaign })
        break
      case "qr_code":
        if (!baseUrl) {
          return NextResponse.json({ error: "baseUrl is required for QR code" }, { status: 400 })
        }
        value = getQrCodeUrl(baseUrl)
        break
      case "promo_code":
        value = generatePromoCode(prefix || "PROMO")
        break
      case "short_link":
        value = `/t/${generateShortCode()}`
        break
      case "call_number":
        value = body.value || ""
        break
      default:
        return NextResponse.json({ error: "Invalid tracking type" }, { status: 400 })
    }

    const asset = await prisma.trackingAsset.create({
      data: {
        workspaceId,
        type,
        name,
        value,
        campaignId: campaignId || null,
      },
    })

    return NextResponse.json(asset, { status: 201 })
  } catch (error) {
    console.error("Tracking asset creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
