import { requireAdmin } from "@/lib/adminGuard";
import { prisma } from "@/lib/prisma";
import { createRedirect, deleteRedirect } from "@/lib/actions/seo";

export const dynamic = "force-dynamic";

export default async function AdminRedirectsPage() {
  await requireAdmin();
  const redirects = await prisma.redirect.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Redirects</h1>

      <form action={createRedirect} className="mt-6 flex max-w-2xl flex-wrap gap-3 rounded-card border border-ink/10 bg-white p-5">
        <input name="fromPath" placeholder="/old-url" required className="min-w-[160px] flex-1 rounded-card border border-ink/15 px-3 py-2 text-sm" />
        <input name="toPath" placeholder="/new-url" required className="min-w-[160px] flex-1 rounded-card border border-ink/15 px-3 py-2 text-sm" />
        <select name="type" defaultValue="PERMANENT" className="rounded-card border border-ink/15 px-3 py-2 text-sm">
          <option value="PERMANENT">301 (Permanent)</option>
          <option value="TEMPORARY">302 (Temporary)</option>
        </select>
        <button type="submit" className="rounded-card bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">Add</button>
      </form>

      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-ink/50">
            <th className="py-2">From</th>
            <th className="py-2">To</th>
            <th className="py-2">Type</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {redirects.map((r) => (
            <tr key={r.id} className="border-b border-ink/5">
              <td className="py-2">{r.fromPath}</td>
              <td className="py-2">{r.toPath}</td>
              <td className="py-2">{r.type === "PERMANENT" ? "301" : "302"}</td>
              <td className="py-2">
                <form action={deleteRedirect.bind(null, r.id)}>
                  <button className="text-red-600 hover:underline">Delete</button>
                </form>
              </td>
            </tr>
          ))}
          {redirects.length === 0 && (
            <tr><td colSpan={4} className="py-6 text-center text-ink/50">No redirects configured.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
