import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoJsonLd from "@/components/SeoJsonLd";
import { buildMetadata, breadcrumbJsonLd, articleJsonLd } from "@/lib/seo";
import { prisma } from "@/lib/prisma";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } }).catch(() => null);
  if (!post) return buildMetadata({ title: "Post not found | SwiftPDF", description: "This post could not be found.", path: `/blog/${params.slug}`, noindex: true });

  return buildMetadata({
    title: post.seoTitle || `${post.title} | SwiftPDF Blog`,
    description: post.seoDescription || post.excerpt || post.title,
    path: `/blog/${post.slug}`
  });
}

export default async function BlogPostPage({ params }) {
  const post = await prisma.blogPost
    .findUnique({ where: { slug: params.slug }, include: { author: true, category: true } })
    .catch(() => null);

  if (!post || post.status !== "PUBLISHED") notFound();

  return (
    <>
      <Header />
      <SeoJsonLd
        data={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }]),
          articleJsonLd({
            title: post.title,
            description: post.excerpt || post.title,
            path: `/blog/${post.slug}`,
            publishedAt: post.publishedAt?.toISOString(),
            modifiedAt: post.updatedAt?.toISOString(),
            authorName: post.author?.name
          })
        ]}
      />
      <main className="mx-auto max-w-2xl px-6 py-14">
        <nav aria-label="Breadcrumb" className="text-sm text-ink/50">
          <a href="/" className="hover:text-brand">Home</a> / <a href="/blog" className="hover:text-brand">Blog</a> / {post.title}
        </nav>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink">{post.title}</h1>
        <p className="mt-2 text-sm text-ink/50">
          {post.author?.name} · {post.publishedAt?.toLocaleDateString?.() ?? ""}
        </p>
        {/* Content is rich HTML authored in the Admin blog editor. */}
        <div className="prose prose-headings:font-display mt-8 max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </main>
      <Footer />
    </>
  );
}
