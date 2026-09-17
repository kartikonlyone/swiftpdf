import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/ToolPageShell";
import ImageToPdfTool from "@/components/tools/ImageToPdfTool";

export const metadata = buildMetadata({
  title: "JPG to PDF – Convert Images to PDF Free | SwiftPDF",
  description: "Combine one or more JPG images into a single PDF document, free and online.",
  path: "/jpg-to-pdf"
});

export default function JpgToPdfPage() {
  return (
    <ToolPageShell
      toolKey="jpg-to-pdf"
      title="JPG to PDF"
      intro="Turn your JPG photos or scans into a single PDF document."
      path="/jpg-to-pdf"
      howTo={["Upload one or more JPG images.", "Reorder them if needed.", "Click Convert to PDF and download your file."]}
      benefits={["Combine multiple photos into one shareable document.", "Keeps original image quality.", "No watermark added."]}
      faq={[{ question: "Can I add more than one image?", answer: "Yes — each image becomes its own page, in the order you add them." }]}
    >
      <ImageToPdfTool accept={["image/jpeg"]} toolKey="jpg-to-pdf" />
    </ToolPageShell>
  );
}
