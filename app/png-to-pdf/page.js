import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/ToolPageShell";
import ImageToPdfTool from "@/components/tools/ImageToPdfTool";

export const metadata = buildMetadata({
  title: "PNG to PDF – Convert Images to PDF Free | SwiftPDF",
  description: "Combine one or more PNG images into a single PDF document, free and online.",
  path: "/png-to-pdf"
});

export default function PngToPdfPage() {
  return (
    <ToolPageShell
      toolKey="png-to-pdf"
      title="PNG to PDF"
      intro="Turn your PNG images or screenshots into a single PDF document."
      path="/png-to-pdf"
      howTo={["Upload one or more PNG images.", "Reorder them if needed.", "Click Convert to PDF and download your file."]}
      benefits={["Preserves transparency-free PNG quality.", "Great for combining screenshots into a document.", "No watermark added."]}
      faq={[{ question: "Does this support transparent PNGs?", answer: "Transparent areas render as white in the resulting PDF page." }]}
    >
      <ImageToPdfTool accept={["image/png"]} toolKey="png-to-pdf" />
    </ToolPageShell>
  );
}
