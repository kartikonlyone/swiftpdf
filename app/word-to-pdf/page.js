import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/ToolPageShell";
import OfficeConvertTool from "@/components/tools/OfficeConvertTool";

export const metadata = buildMetadata({
  title: "Word to PDF – Convert DOCX to PDF Free | SwiftPDF",
  description: "Convert a Microsoft Word document into a shareable PDF file.",
  path: "/word-to-pdf"
});

export default function WordToPdfPage() {
  return (
    <ToolPageShell
      toolKey="word-to-pdf"
      title="Word to PDF"
      intro="Convert a Word document into a PDF for sharing or printing."
      path="/word-to-pdf"
      howTo={["Upload your Word (.docx) file.", "Click Convert to PDF.", "Download your PDF."]}
      benefits={["Keeps formatting consistent across devices.", "Ideal for finalizing resumes, letters, and reports.", "No account required."]}
      faq={[{ question: "Does this support older .doc files?", answer: "The conversion worker accepts .docx; convert legacy .doc files to .docx first for best results." }]}
    >
      <OfficeConvertTool
        accept={[".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]}
        targetFormat="pdf"
        toolKey="word-to-pdf"
        actionLabel="Convert to PDF"
      />
    </ToolPageShell>
  );
}
