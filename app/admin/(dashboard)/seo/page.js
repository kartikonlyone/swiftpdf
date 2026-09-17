import { requireAdmin } from "@/lib/adminGuard";
import { prisma } from "@/lib/prisma";
import { upsertSeoSetting } from "@/lib/actions/seo";

export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  await requireAdmin();
  const settings = await prisma.sEOSetting.findMany({ orderBy: { path: "asc" } }).catch(() => []);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">SEO Manager</h1>
      <p className="mt-1 text-sm text-ink/50">Overrides here take priority over the defaults defined in code, with no redeploy needed.</p>

      <form action={upsertSeoSetting} className="mt-8 max-w-xl space-y-3 rounded-card border border-ink/10 bg-white p-5">
        <h2 className="font-display font-semibold text-ink">Add / update a page</h2>
        <input name="path" placeholder="/merge-pdf" required className="w-full rounded-card border border-ink/15 px-3 py-2 text-sm" />
        <input name="title" placeholder="SEO title" className="w-full rounded-card border border-ink/15 px-3 py-2 text-sm" />
        <textarea name="description" placeholder="Meta description" rows={2} className="w-full rounded-card border border-ink/15 px-3 py-2 text-sm" />
        <input name="canonical" placeholder="Canonical URL (optional)" className="w-full rounded-card border border-ink/15 px-3 py-2 text-sm" />
        <select name="robots" defaultValue="index,follow" className="w-full rounded-card border border-ink/15 px-3 py-2 text-sm">
          <option value="index,follow">index, follow</option>
          <option value="noindex,follow">noindex, follow</option>
          <option value="noindex,nofollow">noindex, nofollow</option>
        </select>
        <button type="submit" className="rounded-card bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">Save</button>
      </form>

      <table className="mt-10 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-ink/50">
            <th className="py-2">Path</th>
            <th className="py-2">Title</th>
            <th className="py-2">Robots</th>
          </tr>
        </thead>
        <tbody>
          {settings.map((s) => (
            <tr key={s.id} className="border-b border-ink/5">
              <td className="py-2">{s.path}</td>
              <td className="py-2">{s.title}</td>
              <td className="py-2">{s.robots}</td>
            </tr>
          ))}
          {settings.length === 0 && (
            <tr><td colSpan={3} className="py-6 text-center text-ink/50">No overrides yet — pages use their code-level defaults.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
