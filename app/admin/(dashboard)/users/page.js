import { requireAdmin } from "@/lib/adminGuard";
import { prisma } from "@/lib/prisma";
import { createAdminUser, toggleAdminUserActive } from "@/lib/actions/adminUsers";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const currentAdmin = await requireAdmin();
  const admins = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } }).catch(() => []);
  const canManage = currentAdmin.role === "SUPER_ADMIN";

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Admin Users</h1>

      {canManage && (
        <form action={createAdminUser} className="mt-6 flex max-w-2xl flex-wrap gap-3 rounded-card border border-ink/10 bg-white p-5">
          <input name="name" placeholder="Name" required className="min-w-[140px] flex-1 rounded-card border border-ink/15 px-3 py-2 text-sm" />
          <input name="email" type="email" placeholder="Email" required className="min-w-[180px] flex-1 rounded-card border border-ink/15 px-3 py-2 text-sm" />
          <input name="password" type="password" placeholder="Temporary password" required className="min-w-[160px] flex-1 rounded-card border border-ink/15 px-3 py-2 text-sm" />
          <select name="role" defaultValue="EDITOR" className="rounded-card border border-ink/15 px-3 py-2 text-sm">
            <option value="EDITOR">Editor</option>
            <option value="SEO_MANAGER">SEO Manager</option>
            <option value="ANALYTICS_VIEWER">Analytics Viewer</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
          <button type="submit" className="rounded-card bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">Add</button>
        </form>
      )}

      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-ink/50">
            <th className="py-2">Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Role</th>
            <th className="py-2">Status</th>
            {canManage && <th className="py-2"></th>}
          </tr>
        </thead>
        <tbody>
          {admins.map((a) => (
            <tr key={a.id} className="border-b border-ink/5">
              <td className="py-2">{a.name}</td>
              <td className="py-2">{a.email}</td>
              <td className="py-2">{a.role}</td>
              <td className="py-2">{a.isActive ? "Active" : "Disabled"}</td>
              {canManage && (
                <td className="py-2">
                  <form action={toggleAdminUserActive.bind(null, a.id, !a.isActive)}>
                    <button className="text-brand hover:underline">{a.isActive ? "Disable" : "Enable"}</button>
                  </form>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
