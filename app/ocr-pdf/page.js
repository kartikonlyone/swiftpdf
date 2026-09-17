import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/ToolPageShell";
import OcrTool from "@/components/tools/OcrTool";

export const metadata = buildMetadata({
  title: "OCR PDF – Extract Text from Scanned PDFs | SwiftPDF",
  description: "Run OCR on a scanned PDF to extract its text in multiple languages.",
  path: "/ocr-pdf"
});

export default function OcrPdfPage() {
  return (
    <ToolPageShell
      toolKey="ocr-pdf"
      title="OCR PDF"
      intro="Extract text from scanned PDFs using optical character recognition."
      path="/ocr-pdf"
      howTo={["Upload your scanned PDF.", "Choose the document's language.", "Click Run OCR and download the extracted text."]}
      benefits={["Make old scans searchable and copyable.", "Supports English, Hindi, Spanish, French, German, Italian, and Portuguese.", "Runs entirely server-side — no third-party OCR service required."]}
      faq={[{ question: "Will this give me back a searchable PDF, or just text?", answer: "The current version returns the recognized text as a downloadable file; embedding an invisible text layer back into the original PDF is on the roadmap." }]}
    >
      <OcrTool />
    </ToolPageShell>
  );
}
