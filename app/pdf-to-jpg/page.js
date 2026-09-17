import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/ToolPageShell";
import PdfToImageTool from "@/components/tools/PdfToImageTool";

export const metadata = buildMetadata({
  title: "PDF to JPG – Convert PDF Pages to Images Free | SwiftPDF",
  description: "Turn each page of a PDF into a JPG image, downloaded as a ZIP file.",
  path: "/pdf-to-jpg"
});

export default function PdfToJpgPage() {
  return (
    <ToolPageShell
      toolKey="pdf-to-jpg"
      title="PDF to JPG"
      intro="Convert every page of a PDF into a separate JPG image."
      path="/pdf-to-jpg"
      howTo={["Upload your PDF file.", "Click Convert to JPG.", "Download a ZIP with one JPG per page."]}
      benefits={["Share individual pages as images.", "Smaller file size than PNG for photos and scans.", "Works on multi-page documents at once."]}
      faq={[{ question: "What resolution are the images?", answer: "Pages are rendered at 150 DPI by default, a good balance of clarity and file size." }]}
    >
      <PdfToImageTool format="jpg" toolKey="pdf-to-jpg" />
    </ToolPageShell>
  );
}
