"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";
import { assertCanWrite } from "@/lib/permissions";

export async function upsertSeoSetting(formData) {
  const admin = await requireAdmin();
  assertCanWrite(admin.role, "seo");

  const path = formData.get("path")?.toString().trim();
  if (!path || !path.startsWith("/")) throw new Error("Path must start with /");

  const data = {
    title: formData.get("title")?.toString() || null,
    description: formData.get("description")?.toString() || null,
    canonical: formData.get("canonical")?.toString() || null,
    robots: formData.get("robots")?.toString() || "index,follow",
    ogTitle: formData.get("ogTitle")?.toString() || null,
    ogDescription: formData.get("ogDescription")?.toString() || null
  };

  await prisma.sEOSetting.upsert({
    where: { path },
    create: { path, ...data },
    update: data
  });

  await prisma.auditLog.create({ data: { adminId: admin.id, action: "seo.updated", resource: path, metadata: data } });

  revalidatePath("/admin/seo");
  revalidatePath(path);
}

export async function createRedirect(formData) {
  const admin = await requireAdmin();
  assertCanWrite(admin.role, "redirects");

  const fromPath = formData.get("fromPath")?.toString().trim();
  const toPath = formData.get("toPath")?.toString().trim();
  const type = formData.get("type")?.toString() === "TEMPORARY" ? "TEMPORARY" : "PERMANENT";

  if (!fromPath?.startsWith("/") || !toPath) throw new Error("Both paths are required, and 'from' must start with /");
  if (fromPath === toPath) throw new Error("A redirect cannot point to itself.");

  await prisma.redirect.create({ data: { fromPath, toPath, type } });
  await prisma.auditLog.create({ data: { adminId: admin.id, action: "redirect.created", resource: fromPath, metadata: { toPath, type } } });

  revalidatePath("/admin/redirects");
}

export async function deleteRedirect(id) {
  const admin = await requireAdmin();
  assertCanWrite(admin.role, "redirects");

  await prisma.redirect.delete({ where: { id } });
  await prisma.auditLog.create({ data: { adminId: admin.id, action: "redirect.deleted", resource: id } });

  revalidatePath("/admin/redirects");
}
