import { requireAdmin } from "@/lib/adminGuard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage() {
  await requireAdmin();
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { admin: true }
  }).catch(() => []);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Audit Logs</h1>
      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-ink/50">
            <th className="py-2">Admin</th>
            <th className="py-2">Action</th>
            <th className="py-2">Resource</th>
            <th className="py-2">Result</th>
            <th className="py-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-b border-ink/5">
              <td className="py-2">{log.admin?.name || "—"}</td>
              <td className="py-2">{log.action}</td>
              <td className="py-2 text-ink/60">{log.resource || "—"}</td>
              <td className="py-2">{log.result}</td>
              <td className="py-2 text-ink/50">{log.createdAt.toLocaleString()}</td>
            </tr>
          ))}
          {logs.length === 0 && (
            <tr><td colSpan={5} className="py-6 text-center text-ink/50">No admin actions recorded yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
