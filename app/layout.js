import "./globals.css";
import { Fraunces, Inter } from "next/font/google";
import { buildMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import SeoJsonLd from "@/components/SeoJsonLd";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

export const dynamic = 'force-dynamic';

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
  ...buildMetadata({
    title: "SwiftPDF — Fast, Simple PDF Tools for Everyone",
    description:
      "Merge, split, compress, convert, edit, sign and manage PDF files online with SwiftPDF.",
    path: "/"
  }),
  verification: {
    google: "PG8HGjtCKzxAGHBSctLkyyfS47SoOEEmWOTfzvcoyPo",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        <SeoJsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}