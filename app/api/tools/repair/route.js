import { NextResponse } from "next/server";
import { repairPdf } from "@/services/pdf/pageOps";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientKeyFromRequest } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(request) {
  const { allowed } = rateLimit(clientKeyFromRequest(request, "repair-pdf"));
  if (!allowed) return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });

  const startedAt = Date.now();
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Please upload a PDF file." }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const bytes = await repairPdf(buffer);

    await recordUsage("repair-pdf", true, Date.now() - startedAt).catch(() => {});
    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="repaired.pdf"', "Cache-Control": "no-store" }
    });
  } catch (err) {
    await recordUsage("repair-pdf", false, Date.now() - startedAt).catch(() => {});
    return NextResponse.json(
      { error: "This PDF is too damaged to repair automatically. Try opening and re-saving it from its original source." },
      { status: 422 }
    );
  }
}

async function recordUsage(toolKey, succeeded, durationMs) {
  const tool = await prisma.tool.findUnique({ where: { key: toolKey } });
  if (!tool) return;
  await prisma.toolUsage.create({ data: { toolId: tool.id, succeeded, durationMs } });
}
