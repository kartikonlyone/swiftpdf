import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/ToolPageShell";
import OfficeConvertTool from "@/components/tools/OfficeConvertTool";

export const metadata = buildMetadata({
  title: "PDF to PowerPoint – Convert PDF to PPTX | SwiftPDF",
  description: "Convert PDF slides into an editable PowerPoint presentation.",
  path: "/pdf-to-powerpoint"
});

export default function PdfToPowerpointPage() {
  return (
    <ToolPageShell
      toolKey="pdf-to-powerpoint"
      title="PDF to PowerPoint"
      intro="Convert a PDF into an editable PowerPoint presentation."
      path="/pdf-to-powerpoint"
      howTo={["Upload your PDF file.", "Click Convert to PowerPoint.", "Download the .pptx file."]}
      benefits={["Reuse PDF slide decks in editable form.", "Each page becomes one slide.", "Keeps images and text layout."]}
      faq={[{ question: "Will animations be preserved?", answer: "No — PDFs don't contain animation data, so slides convert as static content." }]}
    >
      <OfficeConvertTool accept={["application/pdf"]} targetFormat="pptx" toolKey="pdf-to-powerpoint" actionLabel="Convert to PowerPoint" />
    </ToolPageShell>
  );
}
