import { requireAdmin } from "@/lib/adminGuard";
import NotConnectedCard from "@/components/admin/NotConnectedCard";
import { ga4Status, runReport } from "@/services/analytics/ga4";
import { searchConsoleStatus, queryVisibilityData } from "@/services/analytics/searchConsole";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  await requireAdmin();

  const ga4 = ga4Status();
  const gsc = searchConsoleStatus();

  let ga4Report = null;
  let ga4Error = null;
  if (ga4.configured) {
    try {
      ga4Report = await runReport({
        startDate: "30daysAgo",
        endDate: "today",
        metrics: ["activeUsers", "screenPageViews", "sessions"],
        dimensions: ["date"]
      });
    } catch (err) {
      ga4Error = err.message;
    }
  }

  let gscReport = null;
  let gscError = null;
  if (gsc.configured) {
    try {
      gscReport = await queryVisibilityData({ startDate: "30daysAgo", endDate: "today", dimensions: ["query"], rowLimit: 10 });
    } catch (err) {
      gscError = err.message;
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Website Analytics</h1>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold text-ink">Traffic (Google Analytics 4)</h2>
        {!ga4.configured && (
          <NotConnectedCard title="Google Analytics" description="Add GA4_PROPERTY_ID and GA4_SERVICE_ACCOUNT_JSON in Settings to see real visitor data." />
        )}
        {ga4.configured && ga4Error && <p className="mt-2 text-sm text-red-600">GA4 error: {ga4Error}</p>}
        {ga4Report && (
          <pre className="mt-4 max-h-96 overflow-auto rounded-card border border-ink/10 bg-white p-4 text-xs">
            {JSON.stringify(ga4Report, null, 2)}
          </pre>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold text-ink">Search Console</h2>
        {!gsc.configured && (
          <NotConnectedCard title="Google Search Console" description="Add GSC_SITE_URL and GSC_SERVICE_ACCOUNT_JSON in Settings to see clicks, impressions, and top queries." />
        )}
        {gsc.configured && gscError && <p className="mt-2 text-sm text-red-600">Search Console error: {gscError}</p>}
        {gscReport && (
          <pre className="mt-4 max-h-96 overflow-auto rounded-card border border-ink/10 bg-white p-4 text-xs">
            {JSON.stringify(gscReport, null, 2)}
          </pre>
        )}
      </section>
    </div>
  );
}
