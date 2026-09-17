"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";
import { assertCanWrite } from "@/lib/permissions";

export async function createAdminUser(formData) {
  const admin = await requireAdmin();
  assertCanWrite(admin.role, "users");

  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().toLowerCase().trim();
  const password = formData.get("password")?.toString();
  const role = formData.get("role")?.toString();

  if (!name || !email || !password || password.length < 8) {
    throw new Error("Name, email, and an 8+ character password are required.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.adminUser.create({ data: { name, email, passwordHash, role } });

  await prisma.auditLog.create({ data: { adminId: admin.id, action: "admin_user.created", resource: `AdminUser:${user.id}`, metadata: { email, role } } });

  revalidatePath("/admin/users");
}

export async function toggleAdminUserActive(userId, isActive) {
  const admin = await requireAdmin();
  assertCanWrite(admin.role, "users");

  await prisma.adminUser.update({ where: { id: userId }, data: { isActive } });
  await prisma.auditLog.create({ data: { adminId: admin.id, action: isActive ? "admin_user.enabled" : "admin_user.disabled", resource: `AdminUser:${userId}` } });

  revalidatePath("/admin/users");
}
