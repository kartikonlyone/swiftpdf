import { NextResponse } from "next/server";
import { unlockPdf, QpdfNotAvailableError } from "@/services/pdf/protect";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientKeyFromRequest } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(request) {
  const { allowed } = rateLimit(clientKeyFromRequest(request, "unlock-pdf"));
  if (!allowed) return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });

  const startedAt = Date.now();
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const password = formData.get("password") || "";

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Please upload a valid PDF file." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const bytes = await unlockPdf(buffer, { password });

    await recordUsage("unlock-pdf", true, Date.now() - startedAt).catch(() => {});
    return new NextResponse(bytes, {
      status: 200,
      headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="unlocked.pdf"', "Cache-Control": "no-store" }
    });
  } catch (err) {
    await recordUsage("unlock-pdf", false, Date.now() - startedAt).catch(() => {});
    if (err instanceof QpdfNotAvailableError) {
      return NextResponse.json({ error: err.message, code: "NOT_CONFIGURED" }, { status: 501 });
    }
    return NextResponse.json({ error: "Incorrect password, or this PDF's restrictions cannot be removed." }, { status: 400 });
  }
}

async function recordUsage(toolKey, succeeded, durationMs) {
  const tool = await prisma.tool.findUnique({ where: { key: toolKey } });
  if (!tool) return;
  await prisma.toolUsage.create({ data: { toolId: tool.id, succeeded, durationMs } });
}
