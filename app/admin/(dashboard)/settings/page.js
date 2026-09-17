import { requireAdmin } from "@/lib/adminGuard";
import { storageStatus } from "@/lib/storage";
import { emailStatus } from "@/services/email/resend";
import { razorpayStatus } from "@/services/payments/razorpay";
import { ga4Status } from "@/services/analytics/ga4";
import { searchConsoleStatus } from "@/services/analytics/searchConsole";
import { adsenseStatus } from "@/services/ads/adsense";
import { officeConversionStatus } from "@/services/pdf/officeConvert";

export const dynamic = "force-dynamic";

const SECTIONS = [
  {
    title: "General",
    rows: [{ label: "Site name / logo / timezone", envVars: ["NEXT_PUBLIC_SITE_NAME"] }]
  },
  {
    title: "File Storage",
    rows: [{ label: "Cloudflare R2 / AWS S3", envVars: ["STORAGE_PROVIDER", "STORAGE_BUCKET", "STORAGE_ACCESS_KEY_ID"], statusFn: storageStatus }]
  },
  {
    title: "Email",
    rows: [{ label: "Resend", envVars: ["RESEND_API_KEY", "EMAIL_FROM"], statusFn: emailStatus }]
  },
  {
    title: "Payments",
    rows: [{ label: "Razorpay", envVars: ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET"], statusFn: razorpayStatus }]
  },
  {
    title: "Analytics",
    rows: [
      { label: "Google Analytics 4", envVars: ["GA4_PROPERTY_ID", "GA4_SERVICE_ACCOUNT_JSON"], statusFn: ga4Status },
      { label: "Google Search Console", envVars: ["GSC_SITE_URL", "GSC_SERVICE_ACCOUNT_JSON"], statusFn: searchConsoleStatus }
    ]
  },
  {
    title: "Advertising",
    rows: [{ label: "Google AdSense", envVars: ["NEXT_PUBLIC_ADSENSE_CLIENT_ID", "ADSENSE_ACCOUNT_ID"], statusFn: adsenseStatus }]
  },
  {
    title: "PDF Processing",
    rows: [{ label: "Office Conversion Worker (LibreOffice)", envVars: ["CONVERSION_WORKER_URL"], statusFn: officeConversionStatus }]
  }
];

export default async function AdminSettingsPage() {
  await requireAdmin();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Settings</h1>
      <p className="mt-1 max-w-xl text-sm text-ink/50">
        All secrets live in environment variables, never in the database or the browser. Update
        <code className="mx-1 rounded bg-ink/10 px-1">.env</code>
        and redeploy to change any of these.
      </p>

      {SECTIONS.map((section) => (
        <section key={section.title} className="mt-8">
          <h2 className="font-display text-lg font-semibold text-ink">{section.title}</h2>
          <ul className="mt-3 divide-y divide-ink/10 rounded-card border border-ink/10 bg-white">
            {section.rows.map((row) => {
              const configured = row.statusFn ? row.statusFn().configured : null;
              return (
                <li key={row.label} className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-ink">{row.label}</p>
                    <p className="text-xs text-ink/40">{row.envVars.join(", ")}</p>
                  </div>
                  {configured !== null && (
                    <span className={configured ? "text-xs font-semibold text-green-700" : "text-xs font-semibold text-ink/50"}>
                      {configured ? "Connected" : "Not Connected"}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
