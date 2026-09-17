import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LogoutButton from "@/components/LogoutButton";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Dashboard | SwiftPDF",
  description: "Your SwiftPDF account, usage, and recent files.",
  path: "/dashboard",
  noindex: true
});

// Never cache this page — it renders a specific logged-in user's session
// and data. Without this, Next.js can serve a stale (possibly logged-out
// or wrong-user) snapshot when navigating back/forward.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.userType !== "customer") {
    redirect("/login");
  }

  const [user, recentJobs] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.fileJob.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10
    })
  ]);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-14">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink">Your dashboard</h1>
            <p className="mt-1 text-ink/60">{user?.email}</p>
          </div>
          <LogoutButton
            callbackUrl="/"
            className="rounded-card border border-ink/15 px-4 py-2 text-sm font-medium text-ink/70 hover:border-brand hover:text-brand"
          />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-card border border-ink/10 bg-white p-5">
            <p className="text-sm text-ink/60">Current plan</p>
            <p className="mt-1 font-display text-xl font-semibold text-ink">{user?.plan}</p>
          </div>
          <div className="rounded-card border border-ink/10 bg-white p-5">
            <p className="text-sm text-ink/60">Files processed</p>
            <p className="mt-1 font-display text-xl font-semibold text-ink">{recentJobs.length}</p>
          </div>
          <div className="rounded-card border border-ink/10 bg-white p-5">
            <p className="text-sm text-ink/60">Storage</p>
            <p className="mt-1 font-display text-xl font-semibold text-ink">Not tracked yet</p>
          </div>
        </div>

        <h2 className="mt-10 font-display text-xl font-semibold text-ink">Recent files</h2>
        {recentJobs.length === 0 ? (
          <p className="mt-4 text-sm text-ink/50">You haven't processed any files while signed in yet.</p>
        ) : (
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-ink/50">
                <th className="py-2">Tool</th>
                <th className="py-2">Status</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentJobs.map((job) => (
                <tr key={job.id} className="border-b border-ink/5">
                  <td className="py-2">{job.toolKey}</td>
                  <td className="py-2">{job.status}</td>
                  <td className="py-2">{job.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
      <Footer />
    </>
  );
}
