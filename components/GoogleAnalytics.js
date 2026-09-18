import Script from "next/script";

/**
 * The actual visitor-tracking script (gtag.js) — separate from
 * services/analytics/ga4.js, which only pulls reports INTO the admin
 * dashboard and requires a service account. This component is what makes
 * GA4 collect any data in the first place, and only needs the public
 * Measurement ID (safe to expose client-side, starts with "G-").
 *
 * Renders nothing if NEXT_PUBLIC_GA4_MEASUREMENT_ID isn't set — no fake
 * tracking, no broken script tag pointing at an empty ID.
 */
export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
