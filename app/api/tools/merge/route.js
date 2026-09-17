import { NextResponse } from "next/server";
import { mergePdfs } from "@/services/pdf/merge";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientKeyFromRequest } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50MB per file

export async function POST(request) {
  const { allowed } = rateLimit(clientKeyFromRequest(request, "merge-pdf"));
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment and try again." }, { status: 429 });
  }

  const startedAt = Date.now();

  try {
    const formData = await request.formData();
    const files = formData.getAll("files");

    if (!files || files.length < 2) {
      return NextResponse.json({ error: "Upload at least two PDF files to merge." }, { status: 400 });
    }

    const buffers = [];
    for (const file of files) {
      if (file.type !== "application/pdf") {
        return NextResponse.json({ error: "Please upload a valid PDF file." }, { status: 400 });
      }
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json({ error: "This file exceeds the maximum allowed size." }, { status: 400 });
      }
      buffers.push(Buffer.from(await file.arrayBuffer()));
    }

    const mergedBytes = await mergePdfs(buffers);

    await recordUsage("merge-pdf", true, Date.now() - startedAt).catch(() => {});

    return new NextResponse(Buffer.from(mergedBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="merged.pdf"',
        "Cache-Control": "no-store"
      }
    });
  } catch (err) {
    await recordUsage("merge-pdf", false, Date.now() - startedAt).catch(() => {});
    return NextResponse.json(
      { error: err.message || "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

async function recordUsage(toolKey, succeeded, durationMs) {
  const tool = await prisma.tool.findUnique({ where: { key: toolKey } });
  if (!tool) return; // Tool not seeded yet — usage tracking is best-effort.
  await prisma.toolUsage.create({
    data: { toolId: tool.id, succeeded, durationMs }
  });
}
