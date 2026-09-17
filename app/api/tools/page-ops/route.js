import { NextResponse } from "next/server";
import { organizePdf, deletePages, extractPages, addPageNumbers } from "@/services/pdf/pageOps";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientKeyFromRequest } from "@/lib/rateLimit";

export const runtime = "nodejs";

// A shared endpoint for organize-pdf / delete-pdf-pages / extract-pdf-pages /
// add-page-numbers-to-pdf — they're all page-index operations on pdf-lib, so
// one real, well-tested implementation backs all four tool pages.
export async function POST(request) {
  const { allowed } = rateLimit(clientKeyFromRequest(request, "page-ops"));
  if (!allowed) return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });

  const startedAt = Date.now();
  const formData = await request.formData();
  const file = formData.get("file");
  const operation = formData.get("operation"); // organize | delete | extract | numbers
  const toolKey = formData.get("toolKey") || operation;

  if (!file || file.type !== "application/pdf") {
    return NextResponse.json({ error: "Please upload a valid PDF file." }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    let bytes;
    if (operation === "organize") {
      const order = parseNumberList(formData.get("order"));
      bytes = await organizePdf(buffer, order);
    } else if (operation === "delete") {
      const pages = parseNumberList(formData.get("pages"));
      bytes = await deletePages(buffer, pages);
    } else if (operation === "extract") {
      const pages = parseNumberList(formData.get("pages"));
      bytes = await extractPages(buffer, pages);
    } else if (operation === "numbers") {
      const position = formData.get("position") || "bottom-center";
      const startAt = Number(formData.get("startAt") || 1);
      bytes = await addPageNumbers(buffer, { position, startAt });
    } else {
      return NextResponse.json({ error: "Unknown operation." }, { status: 400 });
    }

    await recordUsage(toolKey, true, Date.now() - startedAt).catch(() => {});
    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${operation}.pdf"`, "Cache-Control": "no-store" }
    });
  } catch (err) {
    await recordUsage(toolKey, false, Date.now() - startedAt).catch(() => {});
    return NextResponse.json({ error: err.message || "Something went wrong." }, { status: 400 });
  }
}

function parseNumberList(value) {
  if (!value) throw new Error("Provide a comma-separated list of page numbers, e.g. 1,2,4");
  return value
    .split(",")
    .map((v) => Number(v.trim()))
    .filter((n) => Number.isInteger(n) && n > 0);
}

async function recordUsage(toolKey, succeeded, durationMs) {
  const tool = await prisma.tool.findUnique({ where: { key: toolKey } });
  if (!tool) return;
  await prisma.toolUsage.create({ data: { toolId: tool.id, succeeded, durationMs } });
}
