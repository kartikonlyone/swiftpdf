import { requireAdmin } from "@/lib/adminGuard";
import { prisma } from "@/lib/prisma";
import StatCard from "@/components/admin/StatCard";
import NotConnectedCard from "@/components/admin/NotConnectedCard";
import { adsenseStatus, getEarningsReport } from "@/services/ads/adsense";
import { razorpayStatus } from "@/services/payments/razorpay";

export const dynamic = "force-dynamic";

export default async function AdminRevenuePage() {
  await requireAdmin();

  const [subscriptionRevenue, otherRevenue] = await Promise.all([
    prisma.revenueRecord.aggregate({ where: { source: "subscription" }, _sum: { amountPaise: true } }).catch(() => ({ _sum: { amountPaise: 0 } })),
    prisma.revenueRecord.aggregate({ where: { source: "other" }, _sum: { amountPaise: true } }).catch(() => ({ _sum: { amountPaise: 0 } }))
  ]);

  const ads = adsenseStatus();
  const rzp = razorpayStatus();

  let adsReport = null;
  let adsError = null;
  if (ads.configured) {
    const today = new Date();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
    try {
      adsReport = await getEarningsReport({
        startDate: { year: thirtyDaysAgo.getFullYear(), month: thirtyDaysAgo.getMonth() + 1, day: thirtyDaysAgo.getDate() },
        endDate: { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() }
      });
    } catch (err) {
      adsError = err.message;
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Revenue</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatCard label="Subscription Revenue" value={formatPaise(subscriptionRevenue._sum.amountPaise)} sub={rzp.configured ? "via Razorpay" : "Razorpay not connected"} />
        <StatCard label="Other Revenue" value={formatPaise(otherRevenue._sum.amountPaise)} />
        <StatCard label="Advertising Revenue" value={ads.configured ? "See AdSense report below" : "Not connected"} />
      </div>

      {!rzp.configured && (
        <div className="mt-8">
          <NotConnectedCard title="Razorpay" description="Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Settings to accept and track subscription payments." />
        </div>
      )}

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold text-ink">Advertising (AdSense)</h2>
        {!ads.configured && (
          <NotConnectedCard title="Google AdSense" description="Connect AdSense in Settings to see estimated earnings, impressions, clicks, CTR, and RPM." />
        )}
        {ads.configured && adsError && <p className="mt-2 text-sm text-red-600">AdSense error: {adsError}</p>}
        {adsReport && (
          <pre className="mt-4 max-h-96 overflow-auto rounded-card border border-ink/10 bg-white p-4 text-xs">
            {JSON.stringify(adsReport, null, 2)}
          </pre>
        )}
      </section>
    </div>
  );
}

function formatPaise(paise) {
  if (!paise) return "₹0";
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}
