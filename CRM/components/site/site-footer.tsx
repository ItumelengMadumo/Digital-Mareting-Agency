import Link from "next/link"
import { SITE, SITE_NAV } from "@/lib/site"

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-700 bg-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-10 sm:px-6 md:flex-row md:justify-between lg:px-8">
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {SITE_NAV.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className="text-sm text-slate-400 hover:text-blue-400">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-center text-sm text-slate-400 md:text-right">
          &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
          <br />
          Built for digital creators and businesses
        </p>
      </div>
    </footer>
  )
}
