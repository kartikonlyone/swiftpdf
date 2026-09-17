import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/ToolPageShell";
import WatermarkTool from "@/components/tools/WatermarkTool";

export const metadata = buildMetadata({
  title: "Watermark PDF Online Free | SwiftPDF",
  description: "Stamp a text watermark across every page of a PDF, free and online.",
  path: "/watermark-pdf"
});

export default function WatermarkPdfPage() {
  return (
    <ToolPageShell
      toolKey="watermark-pdf"
      title="Watermark PDF"
      intro="Add a diagonal text watermark to every page of your PDF."
      path="/watermark-pdf"
      howTo={["Upload your PDF file.", "Enter the watermark text.", "Click Add Watermark and download the result."]}
      benefits={["Mark drafts as confidential or for-review.", "Applies consistently across every page.", "Original content stays fully intact underneath."]}
      faq={[{ question: "Can I control the opacity?", answer: "The default watermark is semi-transparent so it doesn't obscure your content." }]}
    >
      <WatermarkTool />
    </ToolPageShell>
  );
}
