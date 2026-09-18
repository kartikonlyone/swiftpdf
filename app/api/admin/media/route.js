import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { assertCanWrite } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { uploadPublicMedia, StorageNotConfiguredError } from "@/lib/storage";
import sharp from "sharp";
import { rateLimit, clientKeyFromRequest } from "@/lib/rateLimit";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 8 * 1024 * 1024; // 8MB

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.userType !== "admin") {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  try {
    assertCanWrite(session.user.role, "media");
  } catch {
    return NextResponse.json({ error: "Your role cannot upload media." }, { status: 403 });
  }

  const { allowed } = rateLimit(clientKeyFromRequest(request, "media-upload"));
  if (!allowed) {
    return NextResponse.json({ error: "Too many uploads. Please wait a moment." }, { status: 429 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const altText = formData.get("altText")?.toString() || null;
  const caption = formData.get("caption")?.toString() || null;

  if (!file) return NextResponse.json({ error: "No file provided." }, { status: 400 });
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Please upload a JPG, PNG, WebP, or GIF image." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image exceeds the 8MB limit." }, { status: 400 });
  }

  try {
    const originalBuffer = Buffer.from(await file.arrayBuffer());

    // Re-encode through sharp: strips EXIF/metadata, normalizes format, and
    // caps dimensions so a 12MP phone photo doesn't get served at full size.
    const optimized = await sharp(originalBuffer)
      .rotate() // auto-orient from EXIF before stripping it
      .resize({ width: 1920, withoutEnlargement: true })
      .toFormat(file.type === "image/gif" ? "gif" : "webp", { quality: 82 })
      .toBuffer();

    const finalContentType = file.type === "image/gif" ? "image/gif" : "image/webp";
    const finalName = file.name.replace(/\.[^.]+$/, "") + (file.type === "image/gif" ? ".gif" : ".webp");

    const { key, url, isPermanentUrl } = await uploadPublicMedia({
      buffer: optimized,
      originalName: finalName,
      contentType: finalContentType
    });

    const metadata = await sharp(optimized).metadata();

    const media = await prisma.media.create({
      data: {
        filename: finalName,
        storageKey: key,
        url,
        mimeType: finalContentType,
        width: metadata.width || null,
        height: metadata.height || null,
        sizeBytes: optimized.length,
        altText,
        caption
      }
    });

    await prisma.auditLog.create({
      data: { adminId: session.user.id, action: "media.uploaded", resource: `Media:${media.id}` }
    });

    return NextResponse.json({ media, isPermanentUrl });
  } catch (err) {
    if (err instanceof StorageNotConfiguredError) {
      return NextResponse.json({ error: err.message, code: "NOT_CONFIGURED" }, { status: 501 });
    }
    return NextResponse.json({ error: err.message || "Upload failed." }, { status: 500 });
  }
}
