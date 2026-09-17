import { NextResponse } from "next/server";
import { compressPdf } from "@/services/pdf/compress";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientKeyFromRequest } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request) {
  const { allowed } = rateLimit(clientKeyFromRequest(request, "compress-pdf"));
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment and try again." }, { status: 429 });
  }

  const startedAt = Date.now();
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const level = formData.get("level") || "recommended";

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Please upload a valid PDF file." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await compressPdf(buffer, level);

    await recordUsage("compress-pdf", true, Date.now() - startedAt).catch(() => {});

    return new NextResponse(Buffer.from(result.bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="compressed.pdf"',
        "X-Original-Size": String(result.originalSizeBytes),
        "X-Compressed-Size": String(result.compressedSizeBytes),
        "X-Reduction-Percent": String(result.reductionPercent),
        "X-Ghostscript-Used": String(result.ghostscriptUsed),
        "Cache-Control": "no-store"
      }
    });
  } catch (err) {
    await recordUsage("compress-pdf", false, Date.now() - startedAt).catch(() => {});
    return NextResponse.json({ error: err.message || "Something went wrong. Please try again." }, { status: 500 });
  }
}

async function recordUsage(toolKey, succeeded, durationMs) {
  const tool = await prisma.tool.findUnique({ where: { key: toolKey } });
  if (!tool) return;
  await prisma.toolUsage.create({ data: { toolId: tool.id, succeeded, durationMs } });
}
