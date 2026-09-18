import "./globals.css";
import { Fraunces, Inter } from "next/font/google";
import { buildMetadata, organizationJsonLd, websiteJsonLd, SEO_CONSTANTS } from "@/lib/seo";
import SeoJsonLd from "@/components/SeoJsonLd";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import GoogleAnalytics from "@/components/GoogleAnalytics";

// Real font loading — previously globals.css referenced --font-display /
// --font-body as CSS variables but nothing ever set them, so every page was
// silently rendering in the browser's default system font. next/font
// self-hosts these (no external request at runtime, no layout shift) and
// wires them to the exact CSS variables Tailwind's config expects.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap"
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap"
});

export const metadata = {
  // metadataBase fixes exactly the "canonical points at localhost" class of
  // bug: Next.js resolves every relative URL in metadata (canonical, OG
  // images, etc.) against this base. Without it explicitly set, Next.js
  // silently defaults to http://localhost:3000 in production too — which is
  // the bug your SEO audit caught. The real, root fix is still to set
  // NEXT_PUBLIC_SITE_URL correctly in Vercel's environment variables; this
  // is a second safety net so a missing env var can never leak localhost
  // into production metadata again.
  metadataBase: new URL(SEO_CONSTANTS.SITE_URL),
  ...buildMetadata({
    title: "SwiftPDF — Fast, Simple PDF Tools for Everyone",
    description:
      "Merge, split, compress, convert, edit, sign and manage PDF files online with SwiftPDF.",
    path: "/"
  }),
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        <SeoJsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <GoogleAnalytics />
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
