import Link from "next/link";

/**
 * Standard "integration not configured" state. Used anywhere the admin
 * dashboard would otherwise need to display analytics/revenue/ads data that
 * depends on an external service — never replaced with fabricated numbers.
 */
export default function NotConnectedCard({ title, description, settingsHref = "/admin/settings" }) {
  return (
    <div className="rounded-card border border-dashed border-ink/20 bg-ink/[0.02] p-6 text-center">
      <p className="font-display font-semibold text-ink">{title} — Not Connected</p>
      <p className="mt-1 text-sm text-ink/60">{description}</p>
      <Link
        href={settingsHref}
        className="mt-4 inline-block rounded-card bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
      >
        Configure Integration
      </Link>
    </div>
  );
}
