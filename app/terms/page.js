import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Service | SwiftPDF",
  description: "The terms that govern use of SwiftPDF.",
  path: "/terms"
});

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="font-display text-3xl font-semibold text-ink">Terms of Service</h1>
        <p className="mt-4 text-sm text-ink/50">This is placeholder legal content — replace with counsel-reviewed text before launch.</p>
        <p className="mt-6 text-ink/70">
          By using SwiftPDF you agree not to upload content you don't have the right to process,
          not to abuse or overload the service, and to use paid plans according to their stated limits.
        </p>
      </main>
      <Footer />
    </>
  );
}
