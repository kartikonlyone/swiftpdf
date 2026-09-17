import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Cookie Policy | SwiftPDF",
  description: "How SwiftPDF uses cookies.",
  path: "/cookie-policy"
});

export default function CookiePolicyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="font-display text-3xl font-semibold text-ink">Cookie Policy</h1>
        <p className="mt-4 text-sm text-ink/50">This is placeholder legal content — replace with counsel-reviewed text before launch.</p>
        <p className="mt-6 text-ink/70">
          SwiftPDF uses essential cookies for authentication sessions, and, only when Google
          Analytics is connected, analytics cookies to understand site usage.
        </p>
      </main>
      <Footer />
    </>
  );
}
