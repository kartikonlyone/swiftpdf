import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/ToolPageShell";
import UnlockTool from "@/components/tools/UnlockTool";

export const metadata = buildMetadata({
  title: "Unlock PDF – Remove Password Free | SwiftPDF",
  description: "Remove a password or restrictions from a PDF you own or have permission to unlock.",
  path: "/unlock-pdf"
});

export default function UnlockPdfPage() {
  return (
    <ToolPageShell
      toolKey="unlock-pdf"
      title="Unlock PDF"
      intro="Remove a password or restrictions from a PDF you have the right to unlock."
      path="/unlock-pdf"
      howTo={["Upload your PDF file.", "Enter the current password, if there is one.", "Click Unlock PDF and download the result."]}
      benefits={["Regain full access to your own documents.", "Removes printing, copying, and editing restrictions.", "Works entirely server-side, nothing stored afterward."]}
      faq={[{ question: "Can this bypass a password I don't know?", answer: "No — SwiftPDF only removes restrictions on files you can already open, or where you supply the correct password." }]}
    >
      <UnlockTool />
    </ToolPageShell>
  );
}
