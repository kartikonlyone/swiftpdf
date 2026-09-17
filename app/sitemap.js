import { prisma } from "@/lib/prisma";
import { TOOLS } from "@/lib/toolsCatalog";
import { SEO_CONSTANTS } from "@/lib/seo";

const STATIC_PATHS = [
  "/", "/pdf-tools", "/pricing", "/about", "/faq", "/security",
  "/privacy-policy", "/terms", "/cookie-policy", "/contact", "/blog"
];

// Regenerated on every request in dev; in production, wrap with an
// appropriate `revalidate` value or an on-demand revalidation hook fired
// from the blog-publish server action, so it updates the moment content changes.
export default async function sitemap() {
  const siteUrl = SEO_CONSTANTS.SITE_URL;

  const staticEntries = STATIC_PATHS.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7
  }));

  const toolEntries = TOOLS.map((tool) => ({
    url: `${siteUrl}${tool.path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8
  }));

  const posts = await prisma.blogPost
    .findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } })
    .catch(() => []);

  const postEntries = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6
  }));

  return [...staticEntries, ...toolEntries, ...postEntries];
}
