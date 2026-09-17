import { NextResponse } from "next/server";
import { rotatePdf } from "@/services/pdf/rotate";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientKeyFromRequest } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request) {
  const { allowed } = rateLimit(clientKeyFromRequest(request, "rotate-pdf"));
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment and try again." }, { status: 429 });
  }

  const startedAt = Date.now();
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const angle = Number(formData.get("angle") || 90);

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Please upload a valid PDF file." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const rotatedBytes = await rotatePdf(buffer, { angle });

    await recordUsage("rotate-pdf", true, Date.now() - startedAt).catch(() => {});

    return new NextResponse(Buffer.from(rotatedBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="rotated.pdf"',
        "Cache-Control": "no-store"
      }
    });
  } catch (err) {
    await recordUsage("rotate-pdf", false, Date.now() - startedAt).catch(() => {});
    return NextResponse.json({ error: err.message || "Something went wrong. Please try again." }, { status: 500 });
  }
}

async function recordUsage(toolKey, succeeded, durationMs) {
  const tool = await prisma.tool.findUnique({ where: { key: toolKey } });
  if (!tool) return;
  await prisma.toolUsage.create({ data: { toolId: tool.id, succeeded, durationMs } });
}
