// Which parts of the app pilot users can see. Everything else stays in the codebase but is hidden
// from navigation and redirected away from, until it actually works. Flip a module back on here.

export type Feature =
  | "home"
  | "compose"
  | "posts"
  | "calendar"
  | "media"
  | "accounts"
  | "profile"
  | "settings"
  | "inbox"
  | "comms"
  | "crm"

export const ENABLED_FEATURES: ReadonlySet<Feature> = new Set<Feature>([
  "home",
  "compose",
  "posts",
  "calendar",
  "media",
  "accounts",
  "profile",
  "settings",
])

export function isEnabled(feature: Feature) {
  return ENABLED_FEATURES.has(feature)
}

/** Dashboard path prefixes owned by each switchable feature (used by middleware to redirect). */
const FEATURE_PATHS: Partial<Record<Feature, string[]>> = {
  inbox: ["/dashboard/inbox"],
  comms: ["/dashboard/comms"],
  crm: [
    "/dashboard/leads",
    "/dashboard/campaigns",
    "/dashboard/products",
    "/dashboard/seo",
    "/dashboard/ppc",
    "/dashboard/tracking",
    "/dashboard/influencers",
    "/dashboard/affiliates",
    "/dashboard/offline",
    "/dashboard/automation",
    "/dashboard/oversight",
    "/dashboard/activity",
    "/dashboard/reports",
  ],
}

/** True when the path belongs to a feature that's switched off. */
export function isHiddenPath(pathname: string) {
  return Object.entries(FEATURE_PATHS).some(
    ([feature, prefixes]) =>
      !isEnabled(feature as Feature) && prefixes!.some((p) => pathname === p || pathname.startsWith(`${p}/`)),
  )
}
