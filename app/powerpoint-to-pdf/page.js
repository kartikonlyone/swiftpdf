import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/ToolPageShell";
import OfficeConvertTool from "@/components/tools/OfficeConvertTool";

export const metadata = buildMetadata({
  title: "PowerPoint to PDF – Convert PPTX to PDF Free | SwiftPDF",
  description: "Convert a PowerPoint presentation into a shareable PDF.",
  path: "/powerpoint-to-pdf"
});

export default function PowerpointToPdfPage() {
  return (
    <ToolPageShell
      toolKey="powerpoint-to-pdf"
      title="PowerPoint to PDF"
      intro="Convert a presentation into a PDF for sharing or printing."
      path="/powerpoint-to-pdf"
      howTo={["Upload your PowerPoint (.pptx) file.", "Click Convert to PDF.", "Download your PDF."]}
      benefits={["Share slide decks without requiring PowerPoint.", "Keeps slide layout fixed for printing.", "Good for handouts and archives."]}
      faq={[{ question: "Do speaker notes get included?", answer: "The default export includes slides only, not speaker notes." }]}
    >
      <OfficeConvertTool
        accept={[".pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"]}
        targetFormat="pdf"
        toolKey="powerpoint-to-pdf"
        actionLabel="Convert to PDF"
      />
    </ToolPageShell>
  );
}
