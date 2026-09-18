import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";

export const metadata = buildMetadata({
  title: "Blog | SwiftPDF",
  description: "Guides and tips for working with PDF files — merging, compressing, converting, and more.",
  path: "/blog"
});

export const revalidate = 300;

export default async function BlogIndexPage() {
  const posts = await prisma.blogPost
    .findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      include: { author: true, category: true, featuredImage: true },
      take: 20
    })
    .catch(() => []); // Graceful fallback if the DB isn't migrated/seeded yet.

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-14">
        <h1 className="font-display text-3xl font-semibold text-ink">Blog</h1>
        <p className="mt-2 text-ink/60">Guides and tips for working with PDF files.</p>

        {posts.length === 0 ? (
          <p className="mt-10 rounded-card border border-dashed border-ink/20 p-8 text-center text-ink/50">
            No posts published yet. Publish your first post from Admin → Blog.
          </p>
        ) : (
          <ul className="mt-10 space-y-8">
            {posts.map((post) => (
              <li key={post.id} className="flex gap-5 border-b border-ink/10 pb-8">
                {post.featuredImage && (
                  <Link href={`/blog/${post.slug}`} className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.featuredImage.url}
                      alt={post.featuredImage.altText || post.title}
                      className="h-24 w-32 rounded-card object-cover"
                    />
                  </Link>
                )}
                <div>
                  <Link href={`/blog/${post.slug}`} className="font-display text-xl font-semibold text-ink hover:text-brand">
                    {post.title}
                  </Link>
                  <p className="mt-1 text-sm text-ink/50">
                    {post.author?.name} · {post.publishedAt?.toLocaleDateString?.() ?? ""}
                  </p>
                {post.excerpt && <p className="mt-2 text-ink/70">{post.excerpt}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </>
  );
}
