import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/adminGuard";
import { createBlogPost } from "@/lib/actions/blog";

export const dynamic = "force-dynamic";

export default async function NewBlogPostPage() {
  await requireAdmin();

  async function handleCreate(formData) {
    "use server";
    const post = await createBlogPost(formData);
    redirect(`/admin/blog`);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink">New Blog Post</h1>
      <form action={handleCreate} className="mt-6 space-y-4">
        <div>
          <label htmlFor="title" className="text-sm font-medium text-ink">Title</label>
          <input id="title" name="title" required className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2 text-sm" />
        </div>
        <div>
          <label htmlFor="excerpt" className="text-sm font-medium text-ink">Excerpt</label>
          <input id="excerpt" name="excerpt" className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2 text-sm" />
        </div>
        <div>
          <label htmlFor="content" className="text-sm font-medium text-ink">Content (HTML)</label>
          <textarea id="content" name="content" rows={12} className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2 font-mono text-sm" />
        </div>

        <fieldset className="rounded-card border border-ink/10 p-4">
          <legend className="px-1 text-sm font-medium text-ink">SEO</legend>
          <div className="mt-2">
            <label htmlFor="seoTitle" className="text-sm text-ink/70">SEO title</label>
            <input id="seoTitle" name="seoTitle" className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2 text-sm" />
          </div>
          <div className="mt-3">
            <label htmlFor="seoDescription" className="text-sm text-ink/70">Meta description</label>
            <textarea id="seoDescription" name="seoDescription" rows={2} className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2 text-sm" />
          </div>
        </fieldset>

        <div>
          <label htmlFor="status" className="text-sm font-medium text-ink">Status</label>
          <select id="status" name="status" defaultValue="DRAFT" className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2 text-sm">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Publish now</option>
          </select>
        </div>

        <button type="submit" className="rounded-card bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
          Save Post
        </button>
      </form>
    </div>
  );
}
