import Link from "next/link";
import { requireAdmin } from "@/lib/adminGuard";
import { prisma } from "@/lib/prisma";
import StatCard from "@/components/admin/StatCard";
import NotConnectedCard from "@/components/admin/NotConnectedCard";
import { ga4Status } from "@/services/analytics/ga4";
import { adsenseStatus } from "@/services/ads/adsense";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();

  const [totalUsers, totalPosts, totalUsages, jobsToday] = await Promise.all([
    prisma.user.count().catch(() => 0),
    prisma.blogPost.count({ where: { status: "PUBLISHED" } }).catch(() => 0),
    prisma.toolUsage.count().catch(() => 0),
    prisma.toolUsage.count({ where: { createdAt: { gte: startOfToday() } } }).catch(() => 0)
  ]);

  const ga4Connected = ga4Status().configured;
  const adsConnected = adsenseStatus().configured;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Dashboard</h1>
          <p className="text-sm text-ink/50">Signed in as {admin.email} ({admin.role})</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/blog/new" className="rounded-card bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">New Blog Post</Link>
          <Link href="/" className="rounded-card border border-ink/15 px-4 py-2 text-sm font-semibold text-ink hover:border-brand">View Website</Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Registered Users" value={totalUsers} />
        <StatCard label="Published Posts" value={totalPosts} />
        <StatCard label="Tool Uses (Total)" value={totalUsages} />
        <StatCard label="Tool Uses Today" value={jobsToday} />
      </div>

      <h2 className="mt-10 font-display text-lg font-semibold text-ink">Website Analytics</h2>
      <div className="mt-4">
        {ga4Connected ? (
          <p className="text-sm text-ink/60">Connected — see the full breakdown on the Analytics page.</p>
        ) : (
          <NotConnectedCard title="Google Analytics" description="Connect GA4 to see visitors, page views, and traffic sources." />
        )}
      </div>

      <h2 className="mt-10 font-display text-lg font-semibold text-ink">Advertising Revenue</h2>
      <div className="mt-4">
        {adsConnected ? (
          <p className="text-sm text-ink/60">Connected — see estimated earnings on the Revenue page.</p>
        ) : (
          <NotConnectedCard title="Google AdSense" description="Connect AdSense to see estimated earnings, impressions, and CTR." />
        )}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Analytics", "/admin/analytics"],
          ["Revenue", "/admin/revenue"],
          ["Manage Tools", "/admin/tools"],
          ["SEO Manager", "/admin/seo"],
          ["Media Library", "/admin/media"]
        ].map(([label, href]) => (
          <Link key={href} href={href} className="rounded-card border border-ink/10 bg-white p-4 text-sm font-medium text-ink hover:border-brand hover:text-brand">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
