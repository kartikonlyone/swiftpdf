import { prisma } from "@/lib/prisma";
import { SEO_CONSTANTS } from "@/lib/seo";

export const revalidate = 300;

export async function GET() {
  const posts = await prisma.blogPost
    .findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      include: { author: true },
      take: 50
    })
    .catch(() => []);

  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SEO_CONSTANTS.SITE_URL}/blog/${post.slug}</link>
      <guid>${SEO_CONSTANTS.SITE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt || ""}]]></description>
      <pubDate>${post.publishedAt?.toUTCString?.() || ""}</pubDate>
      <author>${post.author?.name || "SwiftPDF"}</author>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SEO_CONSTANTS.SITE_NAME} Blog</title>
    <link>${SEO_CONSTANTS.SITE_URL}/blog</link>
    <description>Guides and tips for working with PDF files.</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
