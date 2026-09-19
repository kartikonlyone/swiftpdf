// Falls back to the real production URL (not localhost) if the env var is
// ever missing — this was the root cause of the canonical-URL SEO bug, so
// the fallback itself should never again resolve to something unusable in
// production. Local dev still overrides this via NEXT_PUBLIC_SITE_URL in
// .env, which should be set to http://localhost:3000 there.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://swiftpdf-two.vercel.app";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "SwiftPDF";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og/default.png`;

/**
 * Build a Next.js `metadata` object for a page, with sane SwiftPDF-wide
 * defaults. Pass `dbOverride` (a row from SEOSetting) to let the admin
 * panel override any field without a code change or redeploy.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  ogImage,
  noindex = false,
  dbOverride = null
}) {
  const finalTitle = dbOverride?.title || title;
  const finalDescription = dbOverride?.description || description;
  const canonical = dbOverride?.canonical || `${SITE_URL}${path}`;
  const robots = dbOverride?.robots || (noindex ? "noindex,nofollow" : "index,follow");
  const image = dbOverride?.ogImageUrl || ogImage || DEFAULT_OG_IMAGE;

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: { canonical },
    robots: {
      index: !robots.includes("noindex"),
      follow: !robots.includes("nofollow")
    },
    openGraph: {
      title: dbOverride?.ogTitle || finalTitle,
      description: dbOverride?.ogDescription || finalDescription,
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630 }],
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: dbOverride?.ogTitle || finalTitle,
      description: dbOverride?.ogDescription || finalDescription,
      images: [image]
    }
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL
  };
}

export function breadcrumbJsonLd(items) {
  // items: [{ name, path }]
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`
    }))
  };
}

export function softwareApplicationJsonLd({ name, path, description }) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    url: `${SITE_URL}${path}`,
    description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (Web)",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  };
}

export function faqJsonLd(faq) {
  // Only ever call this with real, visible FAQ content — never fabricate entries.
  if (!faq || faq.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function articleJsonLd({ title, description, path, image, publishedAt, modifiedAt, authorName }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: image ? [image] : undefined,
    datePublished: publishedAt,
    dateModified: modifiedAt || publishedAt,
    author: authorName ? [{ "@type": "Person", name: authorName }] : undefined,
    mainEntityOfPage: `${SITE_URL}${path}`
  };
}

export const SEO_CONSTANTS = { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE };
