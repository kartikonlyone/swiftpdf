import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy | SwiftPDF",
  description: "How SwiftPDF collects, uses, and protects your information.",
  path: "/privacy-policy"
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="font-display text-3xl font-semibold text-ink">Privacy Policy</h1>
        <p className="mt-4 text-sm text-ink/50">This is placeholder legal content — replace with counsel-reviewed text before launch.</p>
        <p className="mt-6 text-ink/70">
          SwiftPDF collects account information you provide (name, email) and file-processing
          metadata needed to operate the tools (file size, tool used, timestamps). Uploaded file
          contents are used only to perform the requested operation and are deleted per our
          retention policy. We do not sell personal data.
        </p>
      </main>
      <Footer />
    </>
  );
}
