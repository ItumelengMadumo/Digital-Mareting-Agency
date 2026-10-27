// The SocialSync data schema: one DynamoDB table per entity, keyed on `id`, with up to two
// generic GSIs (gsi1pk/gsi1sk, gsi2pk/gsi2sk) used by lib/db/repository.ts.
// amplify/data/tables.ts creates these in AWS; scripts/create-tables.ts creates them in DynamoDB Local.
// Field shapes live with each repository in lib/db/*.ts.
export interface EntityDefinition {
  name: string
  gsi1?: boolean
  gsi2?: boolean
}

export const ENTITIES: EntityDefinition[] = [
  // Accounts and access
  { name: "Users", gsi1: true }, // gsi1pk = email
  { name: "Workspaces", gsi1: true }, // gsi1pk = ownerId
  { name: "WorkspaceMembers", gsi1: true, gsi2: true }, // gsi1pk = workspaceId, gsi2pk = userId
  { name: "Invitations", gsi1: true, gsi2: true },
  { name: "Clients", gsi1: true },

  // Publishing
  { name: "Campaigns", gsi1: true },
  { name: "Content", gsi1: true, gsi2: true }, // gsi1pk = workspaceId, gsi2pk = campaignId
  { name: "Variants", gsi1: true }, // gsi1pk = contentId
  { name: "Distributions", gsi1: true, gsi2: true }, // gsi1pk = campaignId, gsi2pk = status
  { name: "SocialAccounts", gsi1: true }, // gsi1pk = workspaceId
  { name: "CampaignMetrics", gsi1: true },

  // CRM and communications
  { name: "Leads", gsi1: true },
  { name: "Communications", gsi1: true },
  { name: "Products", gsi1: true },
  { name: "Deals", gsi1: true },
  { name: "ActivityLogs", gsi1: true },

  // Product
  { name: "Feedback", gsi1: true }, // gsi1pk = workspaceId; in-app bug reports and ideas

  // Marketing modules
  { name: "AutomationRules", gsi1: true },
  { name: "AutomationLogs", gsi1: true },
  { name: "TrackingAssets", gsi1: true, gsi2: true },
  { name: "InfluencerCampaigns", gsi1: true },
  { name: "InfluencerAssignments", gsi1: true },
  { name: "Affiliates", gsi1: true, gsi2: true },
  { name: "AffiliateConversions", gsi1: true },
  { name: "SEOKeywords", gsi1: true },
  { name: "PPCCampaigns", gsi1: true },
  { name: "OfflineCampaigns", gsi1: true },
]
