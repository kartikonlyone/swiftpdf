import { SEO_CONSTANTS } from "@/lib/seo";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/login", "/signup", "/api/"]
      }
    ],
    sitemap: `${SEO_CONSTANTS.SITE_URL}/sitemap.xml`
  };
}
