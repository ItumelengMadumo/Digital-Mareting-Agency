import { notFound } from "next/navigation"

// Any unknown /dashboard/* address shows the dashboard's own 404 (with the sidebar), not the site's.
export default function UnknownDashboardPage() {
  notFound()
}
