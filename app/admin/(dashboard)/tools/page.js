import { requireAdmin } from "@/lib/adminGuard";
import { prisma } from "@/lib/prisma";
import { TOOLS } from "@/lib/toolsCatalog";

export const dynamic = "force-dynamic";

export default async function AdminToolsPage() {
  await requireAdmin();

  const dbTools = await prisma.tool.findMany().catch(() => []);
  const usageCounts = await prisma.toolUsage
    .groupBy({ by: ["toolId"], _count: { _all: true } })
    .catch(() => []);
  const usageByToolId = Object.fromEntries(usageCounts.map((u) => [u.toolId, u._count._all]));

  const rows = TOOLS.map((tool) => {
    const dbRow = dbTools.find((t) => t.key === tool.key);
    return {
      ...tool,
      status: dbRow?.status || "ENABLED",
      uses: dbRow ? usageByToolId[dbRow.id] || 0 : 0,
      seeded: Boolean(dbRow)
    };
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Tools</h1>
      <p className="mt-1 text-sm text-ink/50">
        {rows.some((r) => !r.seeded) && "Some tools haven't been seeded into the database yet — run `npm run seed`."}
      </p>

      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-ink/50">
            <th className="py-2">Tool</th>
            <th className="py-2">URL</th>
            <th className="py-2">Status</th>
            <th className="py-2">Total Uses</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((tool) => (
            <tr key={tool.key} className="border-b border-ink/5">
              <td className="py-2">{tool.name}</td>
              <td className="py-2 text-ink/50">{tool.path}</td>
              <td className="py-2">{tool.status}</td>
              <td className="py-2">{tool.uses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
