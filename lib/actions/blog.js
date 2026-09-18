"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";
import { assertCanWrite } from "@/lib/permissions";

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createBlogPost(formData) {
  const admin = await requireAdmin();
  assertCanWrite(admin.role, "blog");

  const title = formData.get("title")?.toString().trim();
  const content = formData.get("content")?.toString() || "";
  const excerpt = formData.get("excerpt")?.toString() || null;
  const status = formData.get("status")?.toString() || "DRAFT";
  const seoTitle = formData.get("seoTitle")?.toString() || null;
  const seoDescription = formData.get("seoDescription")?.toString() || null;
  const featuredImageId = formData.get("featuredImageId")?.toString() || null;

  if (!title) throw new Error("Title is required.");

  let slug = slugify(title);
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      content,
      excerpt,
      seoTitle,
      seoDescription,
      featuredImageId: featuredImageId || undefined,
      status,
      authorId: admin.id,
      publishedAt: status === "PUBLISHED" ? new Date() : null
    }
  });

  await prisma.auditLog.create({
    data: { adminId: admin.id, action: "blog.created", resource: `BlogPost:${post.id}`, metadata: { title, status } }
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return post;
}

export async function setPostStatus(postId, status) {
  const admin = await requireAdmin();
  assertCanWrite(admin.role, "blog");

  const post = await prisma.blogPost.update({
    where: { id: postId },
    data: { status, publishedAt: status === "PUBLISHED" ? new Date() : undefined }
  });

  await prisma.auditLog.create({
    data: { adminId: admin.id, action: "blog.status_changed", resource: `BlogPost:${postId}`, metadata: { status } }
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return post;
}

export async function permanentlyDeletePost(postId) {
  const admin = await requireAdmin();
  assertCanWrite(admin.role, "blog");

  await prisma.blogPost.delete({ where: { id: postId } });

  await prisma.auditLog.create({
    data: { adminId: admin.id, action: "blog.deleted", resource: `BlogPost:${postId}` }
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}
