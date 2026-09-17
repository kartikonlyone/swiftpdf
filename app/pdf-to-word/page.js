import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/ToolPageShell";
import OfficeConvertTool from "@/components/tools/OfficeConvertTool";

export const metadata = buildMetadata({
  title: "PDF to Word – Convert PDF to DOCX | SwiftPDF",
  description: "Convert a PDF file into an editable Microsoft Word (.docx) document.",
  path: "/pdf-to-word"
});

export default function PdfToWordPage() {
  return (
    <ToolPageShell
      toolKey="pdf-to-word"
      title="PDF to Word"
      intro="Convert a PDF into an editable Word document."
      path="/pdf-to-word"
      howTo={["Upload your PDF file.", "Click Convert to Word.", "Download the resulting .docx file."]}
      benefits={["Edit contracts, reports, and forms after conversion.", "Keeps layout close to the original where possible.", "Runs on a dedicated conversion service, not a guess-based text dump."]}
      faq={[{ question: "Will formatting be preserved exactly?", answer: "Text-based PDFs convert cleanly; heavily designed layouts may need minor cleanup in Word." }]}
    >
      <OfficeConvertTool accept={["application/pdf"]} targetFormat="docx" toolKey="pdf-to-word" actionLabel="Convert to Word" />
    </ToolPageShell>
  );
}
