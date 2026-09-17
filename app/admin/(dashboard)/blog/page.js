import Link from "next/link";
import { requireAdmin } from "@/lib/adminGuard";
import { prisma } from "@/lib/prisma";
import { setPostStatus, permanentlyDeletePost } from "@/lib/actions/blog";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  await requireAdmin();
  const posts = await prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" }, include: { author: true } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Blog</h1>
        <Link href="/admin/blog/new" className="rounded-card bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          New Post
        </Link>
      </div>

      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-ink/50">
            <th className="py-2">Title</th>
            <th className="py-2">Status</th>
            <th className="py-2">Author</th>
            <th className="py-2">Updated</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b border-ink/5">
              <td className="py-2">
                {post.status === "PUBLISHED" ? (
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="text-brand hover:underline">{post.title}</a>
                ) : (
                  post.title
                )}
              </td>
              <td className="py-2">{post.status}</td>
              <td className="py-2">{post.author?.name}</td>
              <td className="py-2">{post.updatedAt.toLocaleDateString()}</td>
              <td className="py-2">
                <div className="flex gap-3">
                  {post.status !== "PUBLISHED" && (
                    <form action={publishAction.bind(null, post.id)}>
                      <button className="text-brand hover:underline">Publish</button>
                    </form>
                  )}
                  {post.status === "PUBLISHED" && (
                    <form action={archiveAction.bind(null, post.id)}>
                      <button className="text-ink/60 hover:underline">Archive</button>
                    </form>
                  )}
                  {post.status !== "TRASH" ? (
                    <form action={trashAction.bind(null, post.id)}>
                      <button className="text-ink/60 hover:underline">Trash</button>
                    </form>
                  ) : (
                    <form action={deleteAction.bind(null, post.id)}>
                      <button className="text-red-600 hover:underline">Delete permanently</button>
                    </form>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan={5} className="py-8 text-center text-ink/50">No posts yet. Create your first post.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

async function publishAction(postId) {
  "use server";
  await setPostStatus(postId, "PUBLISHED");
}
async function archiveAction(postId) {
  "use server";
  await setPostStatus(postId, "ARCHIVED");
}
async function trashAction(postId) {
  "use server";
  await setPostStatus(postId, "TRASH");
}
async function deleteAction(postId) {
  "use server";
  await permanentlyDeletePost(postId);
}
