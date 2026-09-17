import { NextResponse } from "next/server";
import { protectPdf, QpdfNotAvailableError } from "@/services/pdf/protect";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientKeyFromRequest } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(request) {
  const { allowed } = rateLimit(clientKeyFromRequest(request, "protect-pdf"));
  if (!allowed) return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });

  const startedAt = Date.now();
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const password = formData.get("password");
    const allowPrinting = formData.get("allowPrinting") !== "false";
    const allowCopying = formData.get("allowCopying") !== "false";
    const allowEditing = formData.get("allowEditing") !== "false";

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Please upload a valid PDF file." }, { status: 400 });
    }
    if (!password || password.length < 4) {
      return NextResponse.json({ error: "Choose a password with at least 4 characters." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const bytes = await protectPdf(buffer, { userPassword: password, permissions: { allowPrinting, allowCopying, allowEditing } });

    await recordUsage("protect-pdf", true, Date.now() - startedAt).catch(() => {});
    return new NextResponse(bytes, {
      status: 200,
      headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="protected.pdf"', "Cache-Control": "no-store" }
    });
  } catch (err) {
    await recordUsage("protect-pdf", false, Date.now() - startedAt).catch(() => {});
    if (err instanceof QpdfNotAvailableError) {
      return NextResponse.json({ error: err.message, code: "NOT_CONFIGURED" }, { status: 501 });
    }
    return NextResponse.json({ error: err.message || "Something went wrong." }, { status: 500 });
  }
}

async function recordUsage(toolKey, succeeded, durationMs) {
  const tool = await prisma.tool.findUnique({ where: { key: toolKey } });
  if (!tool) return;
  await prisma.toolUsage.create({ data: { toolId: tool.id, succeeded, durationMs } });
}
