import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact SwiftPDF",
  description: "Get in touch with the SwiftPDF team.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-xl px-6 py-14">
        <h1 className="font-display text-3xl font-semibold text-ink">Contact</h1>
        <p className="mt-4 text-ink/70">
          For support or business inquiries, email{" "}
          <a href="mailto:support@swiftpdf.example" className="text-brand hover:underline">support@swiftpdf.example</a>.
        </p>
        <p className="mt-2 text-sm text-ink/50">Update this address from Admin → Settings → General.</p>
      </main>
      <Footer />
    </>
  );
}
