import { NextResponse } from "next/server";
import { signPdf } from "@/services/pdf/sign";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientKeyFromRequest } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(request) {
  const { allowed } = rateLimit(clientKeyFromRequest(request, "sign-pdf"));
  if (!allowed) return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });

  const startedAt = Date.now();
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const type = formData.get("type"); // "typed" | "image"
    const text = formData.get("text") || "";
    const image = formData.get("image");
    const pageNumber = Number(formData.get("pageNumber") || 1);
    const x = Number(formData.get("x") || 40);
    const y = Number(formData.get("y") || 40);
    const width = Number(formData.get("width") || 180);
    const height = Number(formData.get("height") || 60);

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Please upload a valid PDF file." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const imageBuffer = image ? Buffer.from(await image.arrayBuffer()) : undefined;

    const bytes = await signPdf(buffer, { pageNumber, x, y, width, height, type, text, imageBuffer });

    await recordUsage("sign-pdf", true, Date.now() - startedAt).catch(() => {});
    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="signed.pdf"', "Cache-Control": "no-store" }
    });
  } catch (err) {
    await recordUsage("sign-pdf", false, Date.now() - startedAt).catch(() => {});
    return NextResponse.json({ error: err.message || "Something went wrong." }, { status: 400 });
  }
}

async function recordUsage(toolKey, succeeded, durationMs) {
  const tool = await prisma.tool.findUnique({ where: { key: toolKey } });
  if (!tool) return;
  await prisma.toolUsage.create({ data: { toolId: tool.id, succeeded, durationMs } });
}
