import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/ToolPageShell";
import ProtectTool from "@/components/tools/ProtectTool";

export const metadata = buildMetadata({
  title: "Protect PDF – Add a Password Free | SwiftPDF",
  description: "Add a password and set printing, copying, and editing permissions on a PDF.",
  path: "/protect-pdf"
});

export default function ProtectPdfPage() {
  return (
    <ToolPageShell
      toolKey="protect-pdf"
      title="Protect PDF"
      intro="Add a password to your PDF and control who can print, copy, or edit it."
      path="/protect-pdf"
      howTo={["Upload your PDF file.", "Set a password.", "Click Protect PDF and download the encrypted file."]}
      benefits={["Restrict access to sensitive documents.", "Uses standard 256-bit PDF encryption.", "Choose whether printing, copying, or editing is allowed."]}
      faq={[{ question: "What happens if I forget the password?", answer: "SwiftPDF does not store passwords, so a forgotten password cannot be recovered — keep it somewhere safe." }]}
    >
      <ProtectTool />
    </ToolPageShell>
  );
}
