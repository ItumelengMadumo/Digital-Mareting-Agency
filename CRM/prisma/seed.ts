import { PrismaClient } from "../lib/generated/prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { hash } from "bcryptjs"
import { resolve } from "path"
import "dotenv/config"

const dbPath = resolve(process.cwd(), "dev.db")
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Clean existing data
  await prisma.activityLog.deleteMany()
  await prisma.automationLog.deleteMany()
  await prisma.automationRule.deleteMany()
  await prisma.affiliateConversion.deleteMany()
  await prisma.affiliate.deleteMany()
  await prisma.influencerAssignment.deleteMany()
  await prisma.influencerCampaign.deleteMany()
  await prisma.trackingAsset.deleteMany()
  await prisma.offlineCampaign.deleteMany()
  await prisma.pPCCampaign.deleteMany()
  await prisma.sEOKeyword.deleteMany()
  await prisma.distribution.deleteMany()
  await prisma.variant.deleteMany()
  await prisma.content.deleteMany()
  await prisma.campaignMetric.deleteMany()
  await prisma.campaign.deleteMany()
  await prisma.deal.deleteMany()
  await prisma.communication.deleteMany()
  await prisma.lead.deleteMany()
  await prisma.product.deleteMany()
  await prisma.socialAccount.deleteMany()
  await prisma.client.deleteMany()
  await prisma.workspaceMember.deleteMany()
  await prisma.workspace.deleteMany()
  await prisma.user.deleteMany()

  // Create demo user
  const hashedPw = await hash("demo1234", 12)
  const user = await prisma.user.create({
    data: {
      email: "demo@example.com",
      firstName: "Demo",
      lastName: "User",
      passwordHash: hashedPw,
    },
  })

  // Create workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: "Demo Agency",
      type: "business",
      ownerId: user.id,
      members: {
        create: { userId: user.id, role: "owner" },
      },
    },
  })

  // Create a client
  const client = await prisma.client.create({
    data: {
      name: "Acme Co",
      email: "contact@acme.com",
      industry: "Technology",
      workspaceId: workspace.id,
    },
  })

  // Social accounts
  const socialAccounts = await Promise.all(
    [
      { platform: "instagram", accountType: "business", accountName: "@acme_official", workspaceId: workspace.id, accessToken: "demo_token_ig" },
      { platform: "facebook", accountType: "business", accountName: "AcmeCo", workspaceId: workspace.id, accessToken: "demo_token_fb" },
      { platform: "tiktok", accountType: "creator", accountName: "@acme", workspaceId: workspace.id, accessToken: "demo_token_tt" },
      { platform: "linkedin", accountType: "business", accountName: "Acme Co", workspaceId: workspace.id, accessToken: "demo_token_li" },
    ].map((a) => prisma.socialAccount.create({ data: a }))
  )

  // Campaigns
  const campaign1 = await prisma.campaign.create({
    data: {
      name: "Summer Product Launch",
      goal: "awareness",
      type: "social",
      platforms: JSON.stringify(["instagram", "facebook", "tiktok"]),
      status: "active",
      budget: 5000,
      startDate: new Date("2026-06-01"),
      endDate: new Date("2026-08-31"),
      workspaceId: workspace.id,
      clientId: client.id,
    },
  })

  const campaign2 = await prisma.campaign.create({
    data: {
      name: "Q2 Lead Generation",
      goal: "leads",
      type: "ppc",
      platforms: JSON.stringify(["facebook", "linkedin"]),
      status: "active",
      budget: 12000,
      startDate: new Date("2026-04-01"),
      endDate: new Date("2026-06-30"),
      workspaceId: workspace.id,
      clientId: client.id,
    },
  })

  // Content + Variants + Distribution
  const content = await prisma.content.create({
    data: {
      captionMaster: "Exciting news! Our new product line is here. Designed for professionals who demand the best.",
      mediaType: "image",
      status: "published",
      campaignId: campaign1.id,
      workspaceId: workspace.id,
    },
  })

  const variant = await prisma.variant.create({
    data: {
      platform: "instagram",
      caption: "🚀 Our new product line is here! Designed for pros who demand the best. #SummerLaunch #NewProduct",
      format: "image",
      status: "approved",
      contentId: content.id,
    },
  })

  await prisma.distribution.create({
    data: {
      variantId: variant.id,
      platform: "instagram",
      method: "auto",
      status: "published",
      publishedAt: new Date(),
    },
  })

  // Metrics
  await prisma.campaignMetric.create({
    data: {
      campaignId: campaign1.id,
      platform: "instagram",
      impressions: 45200,
      clicks: 3100,
      engagement: 2800,
      conversions: 156,
      spend: 1200,
      date: new Date(),
    },
  })

  await prisma.campaignMetric.create({
    data: {
      campaignId: campaign2.id,
      platform: "facebook",
      impressions: 89000,
      clicks: 5400,
      engagement: 3200,
      conversions: 312,
      spend: 4500,
      date: new Date(),
    },
  })

  // Leads
  const lead1 = await prisma.lead.create({
    data: {
      name: "Sarah Johnson",
      email: "sarah@techstartup.com",
      phone: "+1-555-0101",
      company: "TechStartup Inc",
      source: "linkedin",
      status: "qualified",
      value: 25000,
      workspaceId: workspace.id,
      assignedTo: user.id,
    },
  })

  await prisma.lead.create({
    data: {
      name: "Mike Chen",
      email: "mike@retailco.com",
      phone: "+1-555-0102",
      company: "RetailCo",
      source: "website",
      status: "new",
      value: 15000,
      workspaceId: workspace.id,
      assignedTo: user.id,
    },
  })

  // Communications
  await prisma.communication.create({
    data: {
      type: "email",
      subject: "Follow up on our call",
      body: "Hi Sarah, great chatting with you today. Here are the details we discussed...",
      direction: "outbound",
      outcome: "sent",
      leadId: lead1.id,
    },
  })

  // Products
  await prisma.product.create({
    data: {
      name: "Pro Marketing Suite",
      description: "All-in-one marketing platform for growing businesses",
      price: 79,
      category: "Software",
      workspaceId: workspace.id,
    },
  })

  // SEO Keywords
  await prisma.sEOKeyword.create({
    data: {
      keyword: "digital marketing platform",
      volume: 12000,
      difficulty: 65,
      currentRank: 8,
      targetRank: 3,
      workspaceId: workspace.id,
    },
  })

  // PPC
  await prisma.pPCCampaign.create({
    data: {
      name: "Brand Search Campaign",
      platform: "google_ads",
      budget: 3000,
      spend: 1850,
      clicks: 4200,
      impressions: 56000,
      conversions: 180,
      cpc: 0.44,
      status: "active",
      workspaceId: workspace.id,
    },
  })

  // Automation Rule
  await prisma.automationRule.create({
    data: {
      name: "Welcome new leads",
      trigger: "lead_created",
      action: "send_email",
      actionConfig: JSON.stringify({ template: "welcome", subject: "Welcome!" }),
      isActive: true,
      workspaceId: workspace.id,
    },
  })

  // Tracking
  await prisma.trackingAsset.create({
    data: {
      type: "utm",
      name: "Summer campaign - Instagram",
      value: "https://example.com/?utm_source=instagram&utm_medium=organic&utm_campaign=summer2026",
      campaignId: campaign1.id,
      workspaceId: workspace.id,
    },
  })

  // Influencer Campaign
  await prisma.influencerCampaign.create({
    data: {
      totalBudget: 8000,
      campaignId: campaign1.id,
      influencers: {
        create: {
          influencerName: "Alex Rivera",
          influencerHandle: "@alexrivera",
          platform: "instagram",
          deliverables: JSON.stringify(["2 posts", "4 stories"]),
          payoutAmount: 2500,
          payoutStatus: "pending",
        },
      },
    },
  })

  // Affiliate
  await prisma.affiliate.create({
    data: {
      userId: user.id,
      referralCode: "TECHREV10",
      commissionRate: 10,
      totalEarnings: 0,
    },
  })

  console.log("Seed complete! Demo user: demo@example.com / demo1234")
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
