import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/ToolPageShell";
import RepairTool from "@/components/tools/RepairTool";

export const metadata = buildMetadata({
  title: "Repair PDF – Fix a Damaged PDF Free | SwiftPDF",
  description: "Attempt to fix a corrupted or damaged PDF file so it opens normally again.",
  path: "/repair-pdf"
});

export default function RepairPdfPage() {
  return (
    <ToolPageShell
      toolKey="repair-pdf"
      title="Repair PDF"
      intro="Attempt to fix a PDF that won't open properly."
      path="/repair-pdf"
      howTo={["Upload the damaged PDF file.", "Click Repair PDF.", "Download the repaired file, if recovery succeeds."]}
      benefits={["Recovers many structural issues like broken cross-reference tables.", "Clearly reports when a file is too damaged to fix.", "No guesswork — never returns a fabricated 'fixed' file."]}
      faq={[{ question: "What if repair fails?", answer: "Some files are too badly damaged to recover; in that case, try re-exporting or re-scanning the original source." }]}
    >
      <RepairTool />
    </ToolPageShell>
  );
}
