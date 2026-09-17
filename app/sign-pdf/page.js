import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/ToolPageShell";
import SignTool from "@/components/tools/SignTool";

export const metadata = buildMetadata({
  title: "Sign PDF Online Free | SwiftPDF",
  description: "Add a typed, drawn, or uploaded signature to a PDF document.",
  path: "/sign-pdf"
});

export default function SignPdfPage() {
  return (
    <ToolPageShell
      toolKey="sign-pdf"
      title="Sign PDF"
      intro="Add your signature to a PDF — typed, drawn, or uploaded."
      path="/sign-pdf"
      howTo={["Upload your PDF file.", "Choose to type, draw, or upload your signature.", "Pick the page and click Sign PDF."]}
      benefits={["Sign contracts and forms without printing.", "Works on desktop and touch devices.", "Signature is embedded directly into the PDF."]}
      faq={[{ question: "Is this legally binding?", answer: "SwiftPDF adds a visual signature to the document; whether that satisfies e-signature requirements depends on your jurisdiction and use case." }]}
    >
      <SignTool />
    </ToolPageShell>
  );
}
