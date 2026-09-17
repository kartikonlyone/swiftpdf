import { requireAdmin } from "@/lib/adminGuard";
import { prisma } from "@/lib/prisma";
import { storageStatus } from "@/lib/storage";
import { emailStatus } from "@/services/email/resend";
import { razorpayStatus } from "@/services/payments/razorpay";
import { ga4Status } from "@/services/analytics/ga4";
import { searchConsoleStatus } from "@/services/analytics/searchConsole";
import { adsenseStatus } from "@/services/ads/adsense";
import { officeConversionStatus } from "@/services/pdf/officeConvert";

export const dynamic = "force-dynamic";

async function checkDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return "Operational";
  } catch {
    return "Error";
  }
}

export default async function SystemHealthPage() {
  await requireAdmin();

  const dbStatus = await checkDatabase();
  const rows = [
    { name: "Database (PostgreSQL)", status: dbStatus },
    { name: "PDF Processing (pdf-lib)", status: "Operational" },
    { name: "File Storage", status: storageStatus().configured ? "Operational" : "Not Connected" },
    { name: "Authentication", status: "Operational" },
    { name: "Email (Resend)", status: emailStatus().configured ? "Operational" : "Not Connected" },
    { name: "Payments (Razorpay)", status: razorpayStatus().configured ? "Operational" : "Not Connected" },
    { name: "Analytics (GA4)", status: ga4Status().configured ? "Operational" : "Not Connected" },
    { name: "Search Console", status: searchConsoleStatus().configured ? "Operational" : "Not Connected" },
    { name: "AdSense", status: adsenseStatus().configured ? "Operational" : "Not Connected" },
    { name: "Office Conversion Worker", status: officeConversionStatus().configured ? "Operational" : "Not Connected" }
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">System Health</h1>
      <ul className="mt-6 divide-y divide-ink/10 rounded-card border border-ink/10 bg-white">
        {rows.map((row) => (
          <li key={row.name} className="flex items-center justify-between px-5 py-3 text-sm">
            <span className="text-ink">{row.name}</span>
            <span className={badgeClass(row.status)}>{row.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function badgeClass(status) {
  const base = "rounded-full px-3 py-1 text-xs font-semibold";
  if (status === "Operational") return `${base} bg-green-100 text-green-700`;
  if (status === "Warning") return `${base} bg-amber-100 text-amber-700`;
  if (status === "Error") return `${base} bg-red-100 text-red-700`;
  return `${base} bg-ink/10 text-ink/60`; // Not Connected
}
