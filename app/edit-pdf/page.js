import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/ToolPageShell";
import EditTool from "@/components/tools/EditTool";

export const metadata = buildMetadata({
  title: "Edit PDF Online – Add Text Free | SwiftPDF",
  description: "Add text to a PDF page at the position you choose, free and online.",
  path: "/edit-pdf"
});

export default function EditPdfPage() {
  return (
    <ToolPageShell
      toolKey="edit-pdf"
      title="Edit PDF"
      intro="Add text to any page of your PDF."
      path="/edit-pdf"
      howTo={["Upload your PDF file.", "Enter the text and choose a page and position.", "Click Add Text & Download."]}
      benefits={["Fill in a missing detail without re-exporting the whole document.", "No account or software installation required.", "Full drawing, shapes, and image tools are on the roadmap — this ships real text editing today."]}
      faq={[{ question: "Can I add images or shapes yet?", answer: "Not yet — this first version focuses on adding text. Signatures and images are supported on the dedicated Sign PDF tool." }]}
    >
      <EditTool />
    </ToolPageShell>
  );
}
