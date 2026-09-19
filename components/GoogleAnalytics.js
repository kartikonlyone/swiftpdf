import Script from "next/script";

/**
 * The actual visitor-tracking script (gtag.js) — separate from
 * services/analytics/ga4.js, which only pulls reports INTO the admin
 * dashboard and requires a service account. This component is what makes
 * GA4 collect any data in the first place.
 *
 * Deliberately reads GA4_MEASUREMENT_ID (no NEXT_PUBLIC_ prefix) — this is
 * a Server Component, rendered only on the server, so the value never needs
 * to be inlined into the client JS bundle the way NEXT_PUBLIC_ vars are.
 * The ID still ends up visible in the page's HTML source (unavoidable, and
 * fine — every site's GA ID is public by design), but skipping the
 * NEXT_PUBLIC_ prefix avoids Vercel's "this will be exposed to the browser"
 * warning entirely, since that warning is specifically about Next.js's
 * build-time client-bundle inlining mechanism, which this never uses.
 *
 * Renders nothing if GA4_MEASUREMENT_ID isn't set — no fake tracking, no
 * broken script tag pointing at an empty ID.
 */
export default function GoogleAnalytics() {
  const measurementId = process.env.GA4_MEASUREMENT_ID;
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
