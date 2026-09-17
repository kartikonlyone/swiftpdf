import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

/**
 * Defense-in-depth: middleware.js already blocks unauthenticated requests to
 * /admin/*, but every server component/page re-checks here too, since
 * middleware alone should never be the only gate for privileged data.
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.userType !== "admin") {
    redirect("/admin/login");
  }
  return session.user; // { id, email, name, role }
}
