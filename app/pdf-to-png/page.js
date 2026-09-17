import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/ToolPageShell";
import PdfToImageTool from "@/components/tools/PdfToImageTool";

export const metadata = buildMetadata({
  title: "PDF to PNG – Convert PDF Pages to Images | SwiftPDF",
  description: "Turn each page of a PDF into a high-quality PNG image, downloaded as a ZIP.",
  path: "/pdf-to-png"
});

export default function PdfToPngPage() {
  return (
    <ToolPageShell
      toolKey="pdf-to-png"
      title="PDF to PNG"
      intro="Convert every page of a PDF into a separate PNG image."
      path="/pdf-to-png"
      howTo={["Upload your PDF file.", "Click Convert to PNG.", "Download a ZIP with one PNG per page."]}
      benefits={["Great for inserting PDF pages into slides or documents.", "Lossless image format, ideal for diagrams and text.", "Each page keeps its original resolution at 150 DPI."]}
      faq={[{ question: "Why do I need this instead of a screenshot?", answer: "A rendered PNG keeps full page resolution and works for every page at once, not just what's on screen." }]}
    >
      <PdfToImageTool format="png" toolKey="pdf-to-png" />
    </ToolPageShell>
  );
}
