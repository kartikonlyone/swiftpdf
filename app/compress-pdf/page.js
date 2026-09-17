import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/ToolPageShell";
import CompressTool from "@/components/tools/CompressTool";

export const metadata = buildMetadata({
  title: "Compress PDF Online – Reduce PDF File Size Free | SwiftPDF",
  description: "Shrink large PDF files for email and upload limits. Choose extreme, recommended, or low compression.",
  path: "/compress-pdf"
});

const FAQ = [
  { question: "Will compression reduce quality?", answer: "Higher compression levels reduce image quality more; \"Low\" keeps quality closest to the original while still shrinking the file where possible." },
  { question: "Why didn't my file get smaller?", answer: "Some PDFs — especially text-only or already-optimized files — have little room left to compress. SwiftPDF never inflates a file to claim a fake reduction." }
];

export default function CompressPdfPage() {
  return (
    <ToolPageShell
      toolKey="compress-pdf"
      title="Compress PDF Online"
      intro="Reduce PDF file size for easier sharing, uploading, and emailing."
      path="/compress-pdf"
      howTo={[
        "Upload your PDF file.",
        "Pick a compression level: Extreme, Recommended, or Low.",
        "Download the compressed file and compare the size."
      ]}
      benefits={[
        "Meet email attachment or upload-portal size limits.",
        "See the exact original size, new size, and reduction percentage.",
        "No fabricated results — sizes are calculated from the real output file."
      ]}
      faq={FAQ}
    >
      <CompressTool />
    </ToolPageShell>
  );
}
