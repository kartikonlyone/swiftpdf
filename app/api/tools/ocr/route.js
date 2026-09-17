import { NextResponse } from "next/server";
import { ocrPdf, OCR_LANGUAGES, GhostscriptNotAvailableError } from "@/services/pdf/ocr";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientKeyFromRequest } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function GET() {
  return NextResponse.json({ languages: OCR_LANGUAGES });
}

export async function POST(request) {
  const { allowed } = rateLimit(clientKeyFromRequest(request, "ocr-pdf"));
  if (!allowed) return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });

  const startedAt = Date.now();
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const language = formData.get("language") || "english";

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Please upload a valid PDF file." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const pages = await ocrPdf(buffer, { language });

    await recordUsage("ocr-pdf", true, Date.now() - startedAt).catch(() => {});
    return NextResponse.json({ pages });
  } catch (err) {
    await recordUsage("ocr-pdf", false, Date.now() - startedAt).catch(() => {});
    if (err instanceof GhostscriptNotAvailableError) {
      return NextResponse.json({ error: err.message, code: "NOT_CONFIGURED" }, { status: 501 });
    }
    return NextResponse.json({ error: err.message || "OCR failed." }, { status: 500 });
  }
}

async function recordUsage(toolKey, succeeded, durationMs) {
  const tool = await prisma.tool.findUnique({ where: { key: toolKey } });
  if (!tool) return;
  await prisma.toolUsage.create({ data: { toolId: tool.id, succeeded, durationMs } });
}
