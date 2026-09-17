"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // If someone lands here already logged in (e.g. pressing Back after a
  // successful login), skip straight to the dashboard instead of showing
  // a stale login form — the session itself was never lost, this is purely
  // about not showing a confusing screen.
  useEffect(() => {
    if (status === "authenticated" && session?.user?.userType === "customer") {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("customer-credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Incorrect email or password.");
      return;
    }
    // router.refresh() forces Next.js to throw away its cached (logged-out)
    // render of whatever page comes next, so the dashboard reflects the
    // fresh session cookie immediately instead of a stale cached version.
    router.refresh();
    router.push("/dashboard");
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-sm px-6 py-16">
        <h1 className="font-display text-2xl font-semibold text-ink">Log in</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-ink">Email</label>
            <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2 text-sm" />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-ink">Password</label>
            <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2 text-sm" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-card bg-brand py-3 font-semibold text-white disabled:opacity-40 hover:bg-brand-dark">
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-ink/60">
          Don't have an account? <Link href="/signup" className="text-brand hover:underline">Sign up</Link>
        </p>
        <p className="mt-2 text-center text-xs text-ink/40">
          <Link href="/admin/login" className="hover:text-ink/60">Admin sign-in</Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
