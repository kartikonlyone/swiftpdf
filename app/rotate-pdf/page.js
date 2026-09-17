import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/ToolPageShell";
import RotateTool from "@/components/tools/RotateTool";

export const metadata = buildMetadata({
  title: "Rotate PDF Online – Fix Sideways Pages Free | SwiftPDF",
  description: "Rotate PDF pages 90, 180, or 270 degrees. Fix scanned documents that were uploaded sideways or upside down.",
  path: "/rotate-pdf"
});

const FAQ = [
  { question: "Can I rotate just one page?", answer: "The current version rotates all pages together. Per-page rotation is on the roadmap in the Edit PDF tool." },
  { question: "Does rotating affect quality?", answer: "No — rotation only changes page orientation metadata, not the page content itself." }
];

export default function RotatePdfPage() {
  return (
    <ToolPageShell
      toolKey="rotate-pdf"
      title="Rotate PDF Online"
      intro="Fix sideways or upside-down pages in seconds."
      path="/rotate-pdf"
      howTo={[
        "Upload your PDF file.",
        "Choose a rotation angle: 90°, 180°, or 270°.",
        "Download your corrected PDF."
      ]}
      benefits={[
        "Fix scans taken with a sideways phone camera.",
        "Correct documents before printing or sharing.",
        "Rotation is lossless — page content is unchanged."
      ]}
      faq={FAQ}
    >
      <RotateTool />
    </ToolPageShell>
  );
}
