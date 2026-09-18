import { NextResponse } from "next/server"
import { withWorkspaceAuth } from "@/lib/auth-helpers"
import { createTrackingAsset, listTrackingAssetsByWorkspace } from "@/lib/db/tracking-assets"
import { buildUtmLink, generatePromoCode, generateShortCode, getQrCodeUrl } from "@/lib/tracking"

// GET /api/tracking
export const GET = withWorkspaceAuth(async (_req, { workspaceId }) => {
  const assets = await listTrackingAssetsByWorkspace(workspaceId)
  assets.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return NextResponse.json(assets)
})

// POST /api/tracking
export const POST = withWorkspaceAuth(async (req, { workspaceId }) => {
  const body = await req.json()
  const { type, name, campaignId, baseUrl, utmSource, utmMedium, utmCampaign, prefix } = body

  if (!type || !name) {
    return NextResponse.json({ error: "type and name are required" }, { status: 400 })
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

  const asset = await createTrackingAsset({
    workspaceId,
    type,
    name,
    value,
    campaignId: campaignId || null,
    clicks: 0,
    conversions: 0,
  })

  return NextResponse.json(asset, { status: 201 })
})
