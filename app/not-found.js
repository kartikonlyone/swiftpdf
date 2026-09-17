import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold text-ink">Page not found</h1>
        <p className="mt-3 text-ink/60">The page you're looking for doesn't exist or has moved.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="rounded-card bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">Go home</Link>
          <Link href="/pdf-tools" className="rounded-card border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink hover:border-brand">Browse PDF tools</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
