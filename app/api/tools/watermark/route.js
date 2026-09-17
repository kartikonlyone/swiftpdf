import { NextResponse } from "next/server";
import { watermarkPdf } from "@/services/pdf/watermark";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientKeyFromRequest } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(request) {
  const { allowed } = rateLimit(clientKeyFromRequest(request, "watermark-pdf"));
  if (!allowed) return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });

  const startedAt = Date.now();
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const text = formData.get("text");
    const opacity = Number(formData.get("opacity") || 0.3);

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Please upload a valid PDF file." }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const bytes = await watermarkPdf(buffer, { text, opacity });

    await recordUsage("watermark-pdf", true, Date.now() - startedAt).catch(() => {});
    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="watermarked.pdf"', "Cache-Control": "no-store" }
    });
  } catch (err) {
    await recordUsage("watermark-pdf", false, Date.now() - startedAt).catch(() => {});
    return NextResponse.json({ error: err.message || "Something went wrong." }, { status: 500 });
  }
}

async function recordUsage(toolKey, succeeded, durationMs) {
  const tool = await prisma.tool.findUnique({ where: { key: toolKey } });
  if (!tool) return;
  await prisma.toolUsage.create({ data: { toolId: tool.id, succeeded, durationMs } });
}
