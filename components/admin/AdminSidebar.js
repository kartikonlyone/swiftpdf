"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import LogoutButton from "@/components/LogoutButton";

const SECTIONS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "Revenue", href: "/admin/revenue" },
  { label: "Blog", href: "/admin/blog" },
  { label: "Media", href: "/admin/media" },
  { label: "Tools", href: "/admin/tools" },
  { label: "SEO", href: "/admin/seo" },
  { label: "Redirects", href: "/admin/redirects" },
  { label: "Users", href: "/admin/users" },
  { label: "Audit Logs", href: "/admin/audit-logs" },
  { label: "System Health", href: "/admin/system-health" },
  { label: "Settings", href: "/admin/settings" }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav aria-label="Admin" className="flex h-full w-60 flex-col border-r border-ink/10 bg-white py-6">
      <div className="px-6 pb-6">
        <span className="font-display text-lg font-semibold text-ink">SwiftPDF Admin</span>
        {session?.user?.email && <p className="mt-1 truncate text-xs text-ink/50">{session.user.email}</p>}
      </div>
      <ul className="flex-1 space-y-1 px-3">
        {SECTIONS.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                  active ? "bg-brand-tint text-brand" : "text-ink/70 hover:bg-ink/5"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="space-y-2 border-t border-ink/10 px-6 pt-4">
        <Link href="/" className="block text-xs text-ink/50 hover:text-ink">
          ← View website
        </Link>
        <LogoutButton
          callbackUrl="/admin/login"
          className="text-xs font-medium text-ink/50 hover:text-red-600"
        />
      </div>
    </nav>
  );
}
